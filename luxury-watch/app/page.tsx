import CanvasScroll from "@/components/CanvasScroll";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black">
      <CanvasScroll />
      
      {/* About Us / Brand Heritage Section */}
      <section className="w-full min-h-screen bg-[#050505] flex flex-col items-center py-32 px-8 overflow-hidden relative border-t border-white/5">
        
        {/* Subtle Architecture Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
             style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '120px 120px' }}>
        </div>

        <div className="max-w-5xl w-full flex flex-col items-center text-center relative z-10 my-auto">
          {/* Section Marker */}
          <div className="flex items-center gap-6 mb-16 opacity-60">
            <div className="w-16 h-[1px] bg-[#D4AF37]" />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#D4AF37]">
              The Heritage
            </span>
            <div className="w-16 h-[1px] bg-[#D4AF37]" />
          </div>

          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase mb-16 leading-[0.9]">
            The Shape <br className="hidden md:block"/> Of Time
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left max-w-4xl mx-auto items-center">
            {/* Left Block - Quote */}
            <div className="border-l border-[#D4AF37]/40 pl-8">
              <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed italic">
                "Aeterna transcends the simple measurement of seconds. We catalog the mechanical soul, archiving the seminal achievements in global horological history."
              </p>
            </div>
            
            {/* Right Block - Body */}
            <div>
              <p className="text-sm md:text-base text-gray-500 font-light leading-revert mb-6">
                Since our inception, Aeterna has been dedicated to preserving the absolute pinnacle of high-end watchmaking. From skeletonized tourbillons to ultra-thin perpetual calendars, the timepieces in our collection represent far more than tools—they are masterpieces of micro-mechanical art.
              </p>
              <p className="text-sm md:text-base text-gray-500 font-light leading-revert">
                This digital exhibition distills decades of master craftsmanship into a singular, interactive experience. We invite you to explore the friction, the gears, and the silence.
              </p>
            </div>
          </div>
          
          {/* Massive Watermark */}
          <div className="mt-40 opacity-5 pointer-events-none select-none">
            <h1 className="text-[12vw] font-bold tracking-tighter leading-none">AETERNA</h1>
          </div>
        </div>
      </section>
    </main>
  );
}
