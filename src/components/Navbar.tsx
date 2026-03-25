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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-in-out px-10 ${scrolled
        ? "py-4 bg-white/80 backdrop-blur-3xl border-b border-slate-200"
        : "py-6 bg-transparent"
        }`}
    >
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12 group/nav cursor-pointer">
          <div className="flex items-center group/logo gap-4">
            <div className="relative w-14 h-14 flex items-center justify-center transition-all duration-500 ease-out group-hover/logo:scale-110">
              {/* Main Background Glow */}
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-50 opacity-0 group-hover/logo:opacity-100 group-hover/logo:scale-150 transition-all duration-700" />

              {/* Subtle Constant Glow */}
              <div className="absolute inset-2 bg-primary/10 blur-xl rounded-full animate-pulse" />

              <img
                src="/logo.jpg"
                alt="TITON Logo"
                className="relative z-10 w-full h-full object-contain transition-all duration-500 group-hover/logo:rotate-[5deg] mix-blend-multiply"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase group-hover/logo:text-primary transition-colors duration-300">
                TITON
              </span>
              <span className="text-[10px] font-black tracking-[0.6em] text-primary uppercase opacity-60 group-hover/logo:opacity-100 transition-opacity duration-300">
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
