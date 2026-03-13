import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

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
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-in-out px-10 ${
        scrolled 
          ? "py-4 bg-white/80 backdrop-blur-3xl border-b border-slate-200" 
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        {/* Brand Group */}
        <div className="flex items-center gap-12 group cursor-pointer">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 flex items-center justify-center font-black rounded-none">
                <span className="text-white text-lg">T³</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase translate-y-1">
                  TITON
                </span>
                <span className="text-[10px] font-black tracking-[0.6em] text-primary uppercase opacity-60">
                   System
                </span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-10">
          <a
            href="#contact"
            className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-900 hover:text-white transition-all duration-300"
          >
            Commence
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
