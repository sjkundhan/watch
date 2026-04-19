"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform, motion, useMotionValueEvent } from "framer-motion";
import Link from "next/link";

const FRAME_COUNT = 120;

export default function CanvasScroll() {
  const [images] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const isLoaded = loadedCount === FRAME_COUNT;

  // Preload Images
  useEffect(() => {
    let loaded = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const frameNum = i.toString().padStart(4, "0");
      img.src = `/sequence/${frameNum}.jpg`;

      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
      };
      img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
      };
      images.push(img);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLoaded) {
    const progressPerc = Math.floor((loadedCount / FRAME_COUNT) * 100);
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
        <h1 className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-8 z-10">Loading Precision</h1>
        <div className="w-64 h-[1px] bg-gray-800 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-white transition-all duration-300"
            style={{ width: `${progressPerc}%` }}
          />
        </div>
        <span className="mt-4 text-xs font-mono text-gray-500">{progressPerc}%</span>
      </div>
    );
  }

  return <CanvasScrollContent images={images} />;
}

function CanvasScrollContent({ images }: { images: HTMLImageElement[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set up Scroll Tracking now that container is mounted
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.0001,
  });

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = images[index];
    if (!img || !img.complete) return;

    const dpr = window.devicePixelRatio || 1;
    // Set actual canvas resolution while maintaining CSS size
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    const canvasRatio = window.innerWidth / window.innerHeight;
    const imgRatio = img.width / img.height;
    
    let renderWidth = window.innerWidth;
    let renderHeight = window.innerHeight;
    let xOffset = 0;
    let yOffset = 0;

    if (canvasRatio > imgRatio) {
      renderWidth = window.innerHeight * imgRatio;
      xOffset = (window.innerWidth - renderWidth) / 2;
    } else {
      renderHeight = window.innerWidth / imgRatio;
      yOffset = (window.innerHeight - renderHeight) / 2;
    }

    ctx.drawImage(img, xOffset, yOffset, renderWidth, renderHeight);
  };

  useMotionValueEvent(smoothProgress, "change", (latestVal) => {
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.max(0, Math.floor(latestVal * (FRAME_COUNT - 1)))
    );
    requestAnimationFrame(() => renderFrame(frameIndex));
  });

  useEffect(() => {
    // Initial draw
    renderFrame(0);
    const handleResize = () => {
      const val = smoothProgress.get();
      const frameIndex = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(val * (FRAME_COUNT - 1))));
      renderFrame(frameIndex);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const beatA_opacity = useTransform(smoothProgress, [0, 0.05, 0.15, 0.20], [0, 1, 1, 0]);
  const beatA_y = useTransform(smoothProgress, [0, 0.20], [50, -50]);

  const beatB_opacity = useTransform(smoothProgress, [0.25, 0.30, 0.40, 0.45], [0, 1, 1, 0]);
  const beatB_y = useTransform(smoothProgress, [0.25, 0.45], [50, -50]);

  const beatC_opacity = useTransform(smoothProgress, [0.50, 0.55, 0.65, 0.70], [0, 1, 1, 0]);
  const beatC_y = useTransform(smoothProgress, [0.50, 0.70], [50, -50]);

  const beatD_opacity = useTransform(smoothProgress, [0.75, 0.85, 0.95, 1], [0, 1, 1, 1]);
  const beatD_y = useTransform(smoothProgress, [0.75, 1], [50, 0]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "400vh" }}>
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-[#050505]">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
          style={{ width: "100vw", height: "100vh" }}
        />

        <motion.div 
          style={{ opacity: beatA_opacity, y: beatA_y }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <h2 className="text-7xl md:text-9xl font-semibold tracking-tighter text-white drop-shadow-2xl">
            TIMELESS.
          </h2>
        </motion.div>

        <motion.div 
          style={{ opacity: beatB_opacity, y: beatB_y }}
          className="absolute inset-0 flex items-center justify-start pl-[10vw] pointer-events-none"
        >
          <h2 className="text-5xl md:text-8xl font-light tracking-tight text-white max-w-xl">
            PRECISION <br className="hidden md:block"/> CORE
          </h2>
        </motion.div>

        <motion.div 
          style={{ opacity: beatC_opacity, y: beatC_y }}
          className="absolute inset-0 flex items-center justify-end pr-[10vw] pointer-events-none text-right"
        >
          <h2 className="text-5xl md:text-8xl font-light tracking-tight text-white max-w-xl">
            SKELETONIZED
          </h2>
        </motion.div>

        <motion.div 
          style={{ opacity: beatD_opacity, y: beatD_y }}
          className="absolute inset-0 flex flex-col items-center justify-end pb-32 pointer-events-none"
        >
          <h2 className="text-4xl md:text-6xl font-medium tracking-wide text-white mb-8">
            OWN THE INNER TRUTH
          </h2>
          <Link href="/collection" className="pointer-events-auto">
            <button className="px-8 py-4 border border-white/30 text-white text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-500">
              Discover Collection
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
