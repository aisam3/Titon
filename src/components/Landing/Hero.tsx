import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 });
      tl.from(".hero-content > *", {
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center pt-20 pb-20">
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-12 items-center">
        {/* Left Space for Lighthouse - Adjust width to fit the 3D model */}
        <div className="hidden md:block md:w-[40%] lg:w-[35%]" />

        {/* Right Content */}
        <div className="w-full md:w-[60%] lg:w-[65%] hero-content flex flex-col space-y-8">
          <div>
            <div className="inline-block px-4 py-1 border border-white/20 rounded-full text-white/40 text-[10px] uppercase tracking-widest mb-6 mt-8">
              ESTABLISHED 2026
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight text-white mb-4 tracking-tighter drop-shadow-xl">
              Enter the Race for <br className="hidden md:block" />
              <span className="text-primary drop-shadow-md">Authority.</span>
            </h1>
            <div className="space-y-4">
              <p className="text-slate-100 [text-shadow:_0_2px_10px_rgba(0,0,0,0.8)] text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
                Top AI Automation Agencies don’t drift. They fly—using precision analytics, real-time controls, and measured performance. TITON turns your GHL system into a high-performance foilcraft.
              </p>
              <p className="text-white [text-shadow:_0_2px_10px_rgba(0,0,0,0.8)] font-black text-sm md:text-base tracking-widest uppercase max-w-3xl">
                Measure your workflows. Control your system. Prove your results.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="/r6-audit"
              className="px-8 py-3.5 bg-primary text-black font-black text-xs md:text-sm rounded-full hover:bg-primary/90 transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(132,206,58,0.2)] hover:shadow-[0_0_30px_rgba(132,206,58,0.4)] hover:-translate-y-0.5 flex items-center justify-center"
            >
              Run Your Navigation Check
            </a>
            <a 
              href="#proof"
              className="px-8 py-3.5 bg-white/5 border border-white/20 text-white font-bold text-xs md:text-sm rounded-full hover:bg-white/10 transition-all uppercase tracking-widest backdrop-blur-sm flex items-center justify-center"
            >
              See Example Proof
            </a>
          </div>

          {/* Conversion Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl pt-6">
            {/* Card 1 */}
            <div className="p-6 bg-[#050b18]/80 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-primary/30 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
              <div className="relative z-10">
                <h3 className="text-white font-black text-lg mb-2 tracking-tight">Already Running GHL?</h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  Optimize your current system. Find your performance gaps. Build your first Proof.
                </p>
              </div>
              <div className="relative z-10 space-y-4 mt-auto">
                <a href="/r6-audit" className="flex items-center justify-center w-full py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-black hover:border-primary transition-all duration-300">
                  Run Your Navigation Check
                </a>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed">
                  Use your existing workflows to generate measurable results.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-[#050b18]/80 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-[#06b6d4]/30 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#06b6d4]/5 rounded-full blur-3xl group-hover:bg-[#06b6d4]/10 transition-colors" />
              <div className="relative z-10">
                <h3 className="text-white font-black text-lg mb-2 tracking-tight">Starting Your AAA?</h3>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  Launch with a performance-ready system. Get GHL + TITON aligned from day one.
                </p>
              </div>
              <div className="relative z-10 space-y-4 mt-auto">
                <a href="https://www.skool.com/titon/about" className="flex items-center justify-center w-full py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#06b6d4] hover:text-black hover:border-[#06b6d4] transition-all duration-300">
                  Start With Our GHL Setup
                </a>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed">
                  Use our affiliate build to skip setup mistakes and start with measurement built in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

