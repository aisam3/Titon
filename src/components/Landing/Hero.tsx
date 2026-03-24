import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });

      tl.from(".hero-line", {
        y: 100,
        rotateX: -45,
        opacity: 0,
        stagger: 0.1,
        duration: 1.5,
        ease: "power4.out",
      })
        .from(
          ".hero-sub",
          {
            y: 20,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.8",
        )
        .from(
          ".hero-cta",
          {
            scale: 0.9,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
          },
          "-=0.5",
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-20 overflow-visible">
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-end overflow-visible">
        {/* Decorative Grid Lines */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Content Box - Right Aligned with careful spacing */}
        <div className="md:w-3/5 lg:w-1/2 flex flex-col items-center md:items-start text-center md:text-left relative z-10">
          <div className="relative mb-6 group">
            <div className="inline-block px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-8">
              ESTABLISHED 2026
            </div>
            <h1 className="hero-line relative text-7xl md:text-9xl font-black leading-[0.85] tracking-tighter uppercase mb-4 text-slate-900">
              TITON T³ <br />
              <span className="text-primary text-gradient-primary">
                PRIMER.
              </span>
            </h1>
          </div>

          <p className="hero-sub text-lg md:text-xl text-slate-500 max-w-lg font-light leading-relaxed mb-14 tracking-wide uppercase">
            REDEFINING THE AI LANDSCAPE. <br />
            <span className="text-slate-900 font-bold opacity-80">
              STAY IN CONTROL. TITON POWERS YOUR ANALYTICS.
            </span>
          </p>

          <div className="hero-cta flex flex-wrap gap-6 justify-center md:justify-start items-center">
            <button className="group relative px-12 py-6 bg-slate-900 text-white font-black overflow-hidden transition-all duration-500 hover:bg-primary uppercase tracking-[0.2em] text-[10px]">
              <span className="relative z-10">Access Primer</span>
              <div className="absolute inset-0 bg-primary translate-y-full transition-transform duration-500 group-hover:translate-y-0" />
            </button>
            <button className="px-12 py-6 bg-transparent border border-slate-200 text-slate-900 font-black hover:border-primary hover:text-primary transition-all duration-500 uppercase tracking-[0.2em] text-[10px]">
              Join Fleet
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator refinement */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
        <div className="text-[10px] font-bold tracking-[0.5em] uppercase text-slate-400">
          SCROLL
        </div>
        <div className="w-[1px] h-12 bg-slate-400 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-primary animate-scroll-line" />
        </div>
      </div>
    </section>
  );
};
