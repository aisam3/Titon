import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Menu, X } from "lucide-react";

export const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "expo.out", delay: 0.5 }
    );

    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-in-out px-6 md:px-10 ${scrolled || isMenuOpen
          ? "py-4 bg-slate-950/90 backdrop-blur-3xl border-b border-white/10"
          : "py-6 bg-transparent"
          }`}
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-12 group/nav cursor-pointer">
            <div className="flex items-center group/logo gap-3 md:gap-4">
              <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center transition-all duration-500 ease-out group-hover/logo:scale-110">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-50 opacity-0 group-hover/logo:opacity-100 group-hover/logo:scale-150 transition-all duration-700" />
                <div className="absolute inset-2 bg-primary/10 blur-xl rounded-full animate-pulse" />
                <img
                  src="/logo.png"
                  alt="TITON Logo"
                  className="relative z-10 w-full h-full object-contain transition-all duration-500 group-hover/logo:rotate-[5deg]"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-xl md:text-2xl tracking-tighter text-white uppercase group-hover/logo:text-primary transition-colors duration-300">
                  TITON
                </span>
                <span className="text-[8px] md:text-[10px] font-black tracking-[0.6em] text-primary uppercase opacity-80 group-hover/logo:opacity-100 transition-opacity duration-300">
                  System
                </span>
              </div>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="/dashboard"
              className="px-6 py-3 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:border-primary hover:text-primary transition-all duration-300 rounded"
            >
              Dashboard
            </a>
            <a
              href="#contact"
              className="px-8 py-3 bg-[#84ce3a] text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all duration-300 rounded"
            >
              Commence
            </a>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-white hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[99] bg-slate-950 transition-all duration-500 md:hidden ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
          <a
            href="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="w-full py-6 text-center border border-white/10 text-white text-xs font-black uppercase tracking-[0.5em] hover:bg-white/5 transition-all"
          >
            Dashboard
          </a>
          <a
            href="#contact"
            onClick={() => setIsMenuOpen(false)}
            className="w-full py-6 text-center bg-[#84ce3a] text-black text-xs font-black uppercase tracking-[0.5em] hover:bg-[#99da56] transition-all"
          >
            Commence
          </a>
          
          <div className="mt-12 text-[9px] text-slate-500 font-bold tracking-[0.4em] uppercase text-center">
            TITON CORE v1.0.4 - ACTIVE SYSTEM
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

