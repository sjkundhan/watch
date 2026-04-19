import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import Link from "next/link";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Precision Timepieces | Luxury Watch Scrollytelling",
  description: "Experience the art of mechanical watchmaking through a high-fidelity scrollytelling journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="font-sans min-h-full flex flex-col bg-[#050505]">
        <CustomCursor />
        
        {/* Global Ordinary Website Navigation */}
        <header className="fixed top-0 left-0 w-full pt-6 px-6 md:pt-8 md:px-12 z-50 flex justify-between items-center pointer-events-none">
          <Link href="/" className="pointer-events-auto mix-blend-difference">
            <h1 className="text-white text-sm md:text-base tracking-[0.3em] uppercase font-semibold hover:text-[#D4AF37] transition-colors">
              Aeterna
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-10 text-[10px] tracking-widest uppercase font-mono text-white/50 pointer-events-auto mix-blend-difference">
            <Link href="/" className="hover:text-white hover:scale-105 transition-all">Heritage</Link>
            <Link href="/collection" className="text-white hover:scale-105 transition-all flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#D4AF37]"></span>
              Collection
            </Link>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
