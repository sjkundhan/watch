"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import watchesData from "../data/watches.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CarouselCard({ watch, index, dragX, cardWidth, totalCards, onSelect }: any) {
  // Circular Fan Physics
  const loopWidth = totalCards * cardWidth;
  const offset = index * cardWidth;

  const distance = useTransform(dragX, (v: number) => {
    let d = (v + offset) % loopWidth;
    if (d > loopWidth / 2) d -= loopWidth;
    if (d < -loopWidth / 2) d += loopWidth;
    return d;
  });

  // Map distance to a pure rotational angle (A true Ferris wheel arc)
  // Set to precisely 50 degrees as requested
  const angle = useTransform(distance, (d: number) => (d / cardWidth) * 50);

  // Bring the active center card slightly forward and pop it up
  const scale = useTransform(distance, [-cardWidth * 2, 0, cardWidth * 2], [0.8, 1.05, 0.8]);
  const yOffset = useTransform(distance, [-cardWidth * 2, 0, cardWidth * 2], [50, 0, 50]);

  // Fade out cards before they rotate upside down (smooth visibility limits)
  const opacity = useTransform(distance, [-cardWidth * 3, -cardWidth * 1.5, 0, cardWidth * 1.5, cardWidth * 3], [0, 0.5, 1, 0.5, 0]);

  // Z-Index hierarchy to ensure active card stays on top
  const zIndex = useTransform(distance, (v: number) => {
    return 100 - Math.min(100, Math.abs(Math.floor(v / 10)));
  });

  const isLight = index % 2 !== 0;

  return (
    <motion.div
      style={{
        rotate: angle,       // Moving laterally is purely controlled by rotating the massive dial
        scale,
        y: yOffset,
        opacity,
        zIndex,
        position: "absolute",
        left: "50%",
        top: "12vh",
        marginLeft: -cardWidth / 2,
        width: cardWidth,
        transformOrigin: "50% 120vh", // The critical pivot point anchored extremely far below creates the huge circle
      }}
      initial={{ opacity: 0, y: 500, rotate: index % 2 === 0 ? 10 : -10 }}
      animate={{ opacity: undefined, y: undefined, rotate: undefined }}
      transition={{ duration: 1, delay: 0.1 + index * 0.03, type: "spring", damping: 20 }}
      className={`group h-[75vh] w-full rounded-[2rem] p-8 flex flex-col shadow-[0_30px_70px_rgba(0,0,0,0.4)] cursor-grab active:cursor-grabbing border ${isLight ? "bg-[#f5f5f5] text-black border-black/10" : "bg-[#111] text-white border-white/5"
        }`}
    >
      {/* Top Header */}
      <div className="flex justify-between items-start font-mono text-xs tracking-widest uppercase mb-12">
        <span className={isLight ? "text-gray-500" : "text-[#D4AF37]"}>No. {String(index + 1).padStart(2, '0')}</span>
        <span className="opacity-40">AETERNA</span>
      </div>

      {/* Central Content */}
      <div className="flex-1 flex flex-col justify-end relative overflow-visible group h-full pb-4">
        
        {/* Stunning Central Image */}
        {watch.image && (
          <div className={`absolute inset-0 flex items-center justify-center -z-10 pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-4 opacity-100 ${isLight ? 'mix-blend-multiply' : 'mix-blend-screen'}`}>
            <div className="relative w-[85%] max-w-[340px] aspect-square flex items-center justify-center transition-all duration-700 group-hover:rotate-[-4deg]">
               {/* Behind-image glow */}
               <div className={`absolute inset-0 blur-[60px] rounded-full opacity-30 transition-all duration-700 group-hover:opacity-70 group-hover:blur-[90px] group-hover:scale-110 ${isLight ? 'bg-black/20' : 'bg-[#D4AF37]/30'}`}></div>
               <img src={watch.image} alt="Watch" className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] z-10 transition-transform duration-700 group-hover:scale-110" />
            </div>
          </div>
        )}

        {/* Minimalist Floating Text Area - ALWAYS VISIBLE */}
        <div className="w-full mt-auto flex flex-col items-center justify-end relative z-10 pointer-events-none transition-all duration-700 ease-out translate-y-0 group-hover:translate-y-[-5px]">
          <div className={`inline-flex px-4 py-1.5 rounded-full backdrop-blur-md mb-3 border transition-colors shadow-lg ${isLight ? 'bg-white/60 border-white/60' : 'bg-black/60 border-white/10'}`}>
            <h3 className={`text-[8px] md:text-[9px] font-mono tracking-[0.4em] uppercase font-bold ${isLight ? 'text-gray-700' : 'text-[#D4AF37]'}`}>
              {watch.brand.slice(0, 30)}{watch.brand.length > 30 ? '...' : ''}
            </h3>
          </div>

          <h2 className={`text-sm md:text-base font-black tracking-widest uppercase leading-tight mb-2 drop-shadow-xl text-center px-4 ${isLight ? 'text-black' : 'text-white'}`}>
            {watch.model.split(" (")[0].slice(0, 35)}{watch.model.split(" (")[0].length > 35 ? '...' : ''}
          </h2>

          <div className={`text-[8px] font-mono tracking-[0.3em] uppercase flex items-center gap-3 mt-1 ${isLight ? 'text-black/60' : 'text-white/60'}`}>
            <span>{watch.type}</span>
            <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
            <span className={isLight ? 'font-bold text-black' : 'font-bold text-[#D4AF37]'}>{watch.price}</span>
          </div>
        </div>
      </div>

      {/* Bottom UI */}
      <div className="mt-4 flex justify-between items-center shrink-0 z-20 w-full px-2 border-t pt-4 transition-colors duration-500 ease-out group-hover:border-opacity-50 border-opacity-10 border-current">
        <span className={`text-[9px] font-mono tracking-widest uppercase ${isLight ? 'text-black/40' : 'text-white/40'}`}>
          {watch.founded !== 'N/A' ? watch.founded.split(',')[0] : 'Ref. DATA'}
        </span>
        <button
          onClick={(e) => {
             e.stopPropagation();
             onSelect(index);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase transition-all duration-300 pointer-events-auto shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${isLight ? 'bg-black text-white shadow-black/20' : 'bg-white text-black shadow-white/20'
            }`}
        >
          View Specs
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </motion.div>
  );
}

export default function CollectionPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedWatch, setSelectedWatch] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'customers'>('dashboard');
  const cardWidth = typeof window !== "undefined" ? Math.min(window.innerWidth * 0.8, 480) : 400; // Responsive card sizing
  const dragX = useMotionValue(0);

  // Spring physics attached to drag for smoothness
  const smoothDragX = useSpring(dragX, { damping: 25, stiffness: 120 });

  // Auto-Sliding Mechanics
  const scrollSettings = useRef({ paused: false });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Continuous Auto-Slider (Infinite Circular)
  useEffect(() => {
    let raf: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      if (!scrollSettings.current.paused && mounted && selectedWatch === null) {
        // Slide endlessly without mirroring bounds for true circular wrap
        dragX.set(dragX.get() - (0.05 * dt));
      }
      raf = requestAnimationFrame(loop);
    };

    if (mounted) raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mounted, cardWidth, dragX, selectedWatch]);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <main className="min-h-screen w-full bg-[#050505] text-white overflow-x-hidden relative select-none">
      <section className="h-screen w-full relative overflow-hidden">

        {/* Background Graphic */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03]">
          <div className="w-[150vw] h-[150vw] rounded-full border border-white" />
          <div className="w-[100vw] h-[100vw] rounded-full border border-white absolute" />
          <div className="w-[50vw] h-[50vw] rounded-full border border-white absolute" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute top-20 left-8 z-50 mix-blend-difference"
        >
          <Link href="/" className="text-white flex items-center gap-4 group pointer-events-auto">
            <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            <span className="text-xs font-mono tracking-[0.3em] uppercase hidden md:block">Retreat</span>
          </Link>
        </motion.div>

        {/* Invisible Drag Area stretching infinitely */}
        <motion.div
          drag="x"
          style={{ x: dragX }}
          onDragStart={() => (scrollSettings.current.paused = true)}
          onDragEnd={() => (scrollSettings.current.paused = false)}
          className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing hover:cursor-grab"
        >
          {/* We map the actual UI statically, and their 'x' styling overrides position based on their index */}
        </motion.div>

        {/* Render the deck statically, visual movements attached to independent bounds */}
        <div className="relative w-full h-full pointer-events-none z-20">
          {watchesData.map((watch, i) => (
            <CarouselCard
              key={i}
              index={i}
              watch={watch}
              dragX={smoothDragX}
              cardWidth={cardWidth}
              totalCards={watchesData.length}
              onSelect={setSelectedWatch}
            />
          ))}
        </div>

        {/* Bottom Hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white/30 font-mono text-[10px] tracking-widest uppercase pointer-events-none z-0"
        >
          Drag Horizontally to Intersect Auto-Slide
        </motion.div>
      </section>

      {/* DASHBOARD COMMERCE SECTION - Mapped from Reference */}
      <section
        className="w-full min-h-screen bg-[#111111] text-white flex relative z-30 font-sans border-t border-[#1a1a1a]"
        style={{
          backgroundImage: "url('/images/dashboard-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        {/* Dark glass overlay to keep UI elements legible over the 3D background */}
        <div className="absolute inset-0 bg-[#050505]/70 backdrop-blur-sm z-0 pointer-events-none" />

        {/* Sidebar */}
        <aside className="w-20 md:w-64 border-r border-white/5 flex flex-col p-4 bg-[#141414]/60 backdrop-blur-2xl shrink-0 sticky top-0 h-screen overflow-hidden z-10">
          {/* Sidebar branding */}
          <div className="flex items-center gap-3 mb-10 px-2 mt-4">
            <div className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 font-bold font-mono text-sm shrink-0">AE</div>
            <span className="hidden md:block font-bold tracking-widest uppercase text-sm">Aeterna</span>
          </div>

          <nav className="flex flex-col gap-3">
            <div 
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-transform ${activeTab === 'dashboard' ? 'bg-[#ccff00]/10 text-[#ccff00] hover:scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <div className="w-5 h-5 rounded flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>
              </div>
              <span className="hidden md:block text-sm font-medium">Dashboard</span>
            </div>
            
            <div 
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${activeTab === 'orders' ? 'bg-[#ccff00]/10 text-[#ccff00]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <div className="w-5 h-5 rounded flex items-center justify-center shrink-0"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" /></svg></div>
              <span className="hidden md:block text-sm font-medium">Orders</span>
            </div>
            
            <div 
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${activeTab === 'products' ? 'bg-[#ccff00]/10 text-[#ccff00]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <div className="w-5 h-5 rounded flex items-center justify-center shrink-0"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 3.8l7.2 14.2H4.8L12 5.8z" /></svg></div>
              <span className="hidden md:block text-sm font-medium">Products</span>
            </div>
            
            <div 
              onClick={() => setActiveTab('customers')}
              className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${activeTab === 'customers' ? 'bg-[#ccff00]/10 text-[#ccff00]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <div className="w-5 h-5 rounded flex items-center justify-center shrink-0"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg></div>
              <span className="hidden md:block text-sm font-medium">Customers</span>
            </div>
          </nav>
        </aside>

        {/* Main Area */}
        <div className="flex-1 p-6 md:p-10 flex flex-col overflow-y-auto relative z-10">
          {/* Dashboard Header */}
          <header className="flex justify-between items-center mb-10 gap-4">
            <div className="bg-[#1c1c1c]/60 backdrop-blur-md rounded-full px-6 py-3 w-full max-w-md flex items-center border border-white/10 focus-within:border-white/30 transition-colors shadow-lg">
              <svg className="w-4 h-4 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-600" />
            </div>
            <div className="flex gap-4 shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#1c1c1c]/60 backdrop-blur-md border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors shadow-lg">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ccff00] to-green-600 p-[2px] cursor-pointer">
                <div className="w-full h-full bg-black rounded-full overflow-hidden">
                  <img src="/images/dashboard-watches/silver_diver.png" alt="Profile" className="w-full h-full object-cover scale-150" />
                </div>
              </div>
            </div>
          </header>

          {/* Conditional Rendering based on Tab State */}
          {activeTab === 'dashboard' && (
            <>
              <div className="flex flex-col xl:flex-row gap-8">
                {/* Featured Hero Box */}
                <div className="flex-1 bg-[#1a1a1a]/60 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 relative flex flex-col md:flex-row items-center border border-white/10 shadow-2xl overflow-hidden group">
                  {/* Left Controls */}
                  <div className="flex flex-col gap-4 z-10 w-full md:w-auto">
                    <div className="flex gap-2 mb-4">
                      <div className="w-10 h-10 rounded-[10px] bg-[#ccff00]/10 flex items-center justify-center text-[#ccff00] cursor-pointer hover:bg-[#ccff00]/20 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                      </div>
                      <div className="w-10 h-10 rounded-[10px] bg-[#ccff00] flex items-center justify-center text-black font-bold shadow-lg shadow-[#ccff00]/20 cursor-pointer hover:scale-105 transition-transform">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </div>
                    </div>
                    <div className="bg-[#111]/60 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-inner hidden md:block">
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Water Resistance</div>
                      <div className="text-sm font-semibold mb-5 text-gray-200">100 meters</div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Weight</div>
                      <div className="text-sm font-semibold mb-6 text-gray-200">40G</div>
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-red-600 border-2 border-[#111] shadow-[0_0_0_1px_rgba(255,255,255,0.2)] cursor-pointer"></div>
                        <div className="w-5 h-5 rounded-full bg-[#ccff00] opacity-50 hover:opacity-100 cursor-pointer transition-opacity"></div>
                        <div className="w-5 h-5 rounded-full bg-green-900 opacity-50 hover:opacity-100 cursor-pointer transition-opacity"></div>
                      </div>
                    </div>
                  </div>

                  {/* Center Image */}
                  <div className="w-full max-w-[280px] h-[340px] md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-0 my-8 shadow-2xl mix-blend-screen pointer-events-none transition-transform duration-700 md:group-hover:scale-110 md:group-hover:rotate-6">
                    <img src="/images/dashboard-watches/red_chrono.png" alt="Chronograph" className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(255,0,0,0.15)]" />
                  </div>

                  {/* Right Details */}
                  <div className="z-10 md:ml-auto max-w-[320px] text-left mt-8 md:mt-0 flex flex-col h-full justify-center">
                    <h3 className="text-3xl font-bold mb-4 leading-tight">Timeless Elegance in Every Look</h3>
                    <p className="text-sm text-gray-400 mb-8 leading-relaxed">Upgrade your style with a watch that blends classic elegance and expert craftsmanship for any occasion.</p>

                    <div className="flex items-center gap-6 mt-auto">
                      <button 
                        onClick={() => setSelectedWatch(0)}
                        className="bg-[#ccff00] text-black px-8 py-3.5 rounded-full font-bold text-sm tracking-wide hover:scale-105 hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all">
                        Shop Now
                      </button>
                      <span className="text-2xl font-bold tracking-tight text-white">$120.00</span>
                    </div>

                    <div className="text-[10px] text-gray-500 mt-6 pt-4 border-t border-white/5 opacity-50">
                      Warranty: 2-year international warranty
                    </div>
                  </div>
                </div>

                {/* Customer Review Panel */}
                <div className="w-full xl:w-[340px] bg-[#1a1a1a]/60 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 border border-white/10 shrink-0 flex flex-col shadow-xl">
                  <h3 className="font-bold text-lg mb-6 tracking-tight">Customer Review</h3>

                  <div className="flex items-end gap-5 mb-10">
                    <span className="text-6xl font-bold tracking-tighter">4,7</span>
                    <div className="mb-2">
                      <div className="text-[#ccff00] text-lg tracking-widest leading-none mb-1">★★★★★</div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Based on 600 reviews</div>
                    </div>
                  </div>

                  <div className="space-y-5 flex-1 w-full">
                    {[
                      { stars: 5, pct: 85 },
                      { stars: 4, pct: 60 },
                      { stars: 3, pct: 40 },
                      { stars: 2, pct: 20 },
                      { stars: 1, pct: 10 }
                    ].map((item, i) => (
                      <div key={item.stars} className="flex items-center gap-4 text-xs font-medium text-gray-400 group cursor-pointer hover:text-white transition-colors">
                        <span className="w-12 whitespace-nowrap">{item.stars} Star</span>
                        <div className="flex-1 h-[6px] bg-black/40 rounded-full overflow-hidden shadow-inner border border-white/5">
                          <div className="h-full bg-gradient-to-r from-blue-600 to-[#5c5cff] rounded-full group-hover:from-[#ccff00] group-hover:to-green-400 transition-all duration-500" style={{ width: `${item.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/5 mt-8 flex justify-between items-center text-xs text-gray-500 font-medium uppercase tracking-wider">
                    <span>Total</span>
                    <span className="text-white">600 Review</span>
                  </div>
                </div>
              </div>

              {/* Popular Products Row */}
              <div className="mt-14">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold tracking-tight">Popular Product</h3>
                  <span className="text-xs text-gray-500 cursor-pointer hover:text-white uppercase tracking-widest transition-colors font-medium">View All</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {watchesData.slice(0, 4).map((watch: any, i: number) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedWatch(i)}
                      className="bg-[#1a1a1a]/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 hover:border-white/30 hover:bg-[#1f1f1f]/80 transition-all relative group cursor-pointer shadow-xl overflow-hidden flex flex-col justify-end min-h-[300px]"
                    >
                      <div className="absolute inset-0 pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-2 opacity-100 mix-blend-screen flex items-center justify-center">
                        <div className="relative w-[85%] max-w-[200px] aspect-square flex items-center justify-center transition-all duration-700 group-hover:rotate-[-4deg]">
                           {/* Behind-image glow */}
                           <div className={`absolute inset-0 blur-[40px] rounded-full opacity-0 transition-opacity duration-700 group-hover:opacity-40 group-hover:blur-[60px] group-hover:scale-110 bg-[#D4AF37]/30`}></div>
                           <img src={watch.image || "/images/dashboard-watches/silver_diver.png"} alt={watch.model} className="max-w-full max-h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] z-10 transition-transform duration-700 group-hover:scale-110" />
                        </div>
                      </div>

                      <div className="w-full mt-auto flex flex-col items-center justify-end relative z-10 pointer-events-none transition-all duration-700 ease-out translate-y-0 group-hover:translate-y-[-5px]">
                        <div className="inline-flex px-3 py-1 rounded-full backdrop-blur-md mb-2 border border-white/10 shadow-lg bg-black/60">
                          <h3 className="text-[7px] font-mono tracking-[0.3em] uppercase font-bold text-[#D4AF37]">
                            {watch.brand.slice(0, 20)}{watch.brand.length > 20 ? '...' : ''}
                          </h3>
                        </div>

                        <h4 className="font-black text-xs md:text-sm tracking-widest uppercase leading-tight mb-2 drop-shadow-xl text-center text-white">
                           {watch.model.split(" (")[0].slice(0, 25)}{watch.model.split(" (")[0].length > 25 ? '...' : ''}
                        </h4>

                        <div className="flex justify-between items-center w-full mt-2 pt-2 border-t border-white/10">
                          <span className="font-bold text-xs text-white">Auction</span>
                          <span className="text-[#D4AF37] text-[10px] tracking-widest">★★★★★</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Alternate Tab States */}
          {activeTab === 'orders' && (
            <div className="flex-1 bg-[#1a1a1a]/60 backdrop-blur-2xl rounded-[2.5rem] p-12 border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center">
               <svg className="w-16 h-16 text-white/10 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
               <h2 className="text-2xl font-bold uppercase tracking-widest mb-4">No Recent Orders</h2>
               <p className="text-gray-500 text-sm max-w-sm">You haven't acquired any new Masterworks yet. Return to the dashboard to view our catalog.</p>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="flex-1 bg-[#1a1a1a]/60 backdrop-blur-2xl rounded-[2.5rem] p-12 border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center">
               <svg className="w-16 h-16 text-white/10 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
               <h2 className="text-2xl font-bold uppercase tracking-widest mb-4">Product Management</h2>
               <p className="text-gray-500 text-sm max-w-sm">Inventory and bespoke customization options are currently locked for tier-1 accounts.</p>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="flex-1 bg-[#1a1a1a]/60 backdrop-blur-2xl rounded-[2.5rem] p-12 border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center">
               <svg className="w-16 h-16 text-white/10 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
               <h2 className="text-2xl font-bold uppercase tracking-widest mb-4">VIP Customer Portal</h2>
               <p className="text-gray-500 text-sm max-w-sm">View concierge queries, specialized delivery paths, and private messaging configurations.</p>
            </div>
          )}
        </div>
      </section>

      {/* Global Absolute Side-Panel Modal for Detailed View */}
      <AnimatePresence>
        {selectedWatch !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex justify-end"
          >
            {/* Glass Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-md cursor-none"
              onClick={() => setSelectedWatch(null)}
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full md:w-[600px] h-full bg-[#111111]/95 backdrop-blur-3xl border-l border-white/10 p-10 md:p-16 flex flex-col overflow-y-auto cursor-none shadow-2xl z-[260]"
            >
              <button
                onClick={() => setSelectedWatch(null)}
                className="absolute top-10 right-10 w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                style={{ zIndex: 1000 }}
              >
                <span className="text-xs font-mono">X</span>
              </button>

              <div className="text-[#D4AF37] font-mono text-xs tracking-widest uppercase mb-4">
                No. {String(selectedWatch + 1).padStart(2, '0')}
              </div>
              <h3 className="text-white/40 font-mono text-sm tracking-[0.3em] uppercase mb-4">
                {watchesData[selectedWatch]?.brand}
              </h3>
              <h2 className="text-5xl font-bold uppercase tracking-tighter mb-12 leading-[0.9]">
                {watchesData[selectedWatch]?.model}
              </h2>

              {watchesData[selectedWatch]?.image && (
                <div className="mb-12 w-full h-64 md:h-80 relative flex items-center justify-center bg-white/5 rounded-2xl overflow-hidden shrink-0 pointer-events-none group hover:bg-white/10 transition-colors">
                  <img src={watchesData[selectedWatch]?.image} alt={watchesData[selectedWatch]?.model} className="max-w-full max-h-full object-contain mix-blend-screen group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}

              <div className="flex-1">
                <p className="text-gray-300 font-light leading-relaxed text-sm mb-12">
                  {watchesData[selectedWatch]?.overview}
                </p>

                <div className="space-y-6 pt-8 border-t border-white/10 font-mono text-xs uppercase tracking-widest text-[#C0C0C0]">
                  <div>
                    <div className="text-white/30 mb-2">Heritage Data</div>
                    <div>{watchesData[selectedWatch]?.founded}</div>
                  </div>
                  <div>
                    <div className="text-white/30 mb-2">Case Core Data</div>
                    <div>{watchesData[selectedWatch]?.specs}</div>
                  </div>
                  <div>
                    <div className="text-white/30 mb-2">Appraisal</div>
                    <div className="text-[#D4AF37] text-lg font-bold">
                      {watchesData[selectedWatch]?.price}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
