import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Signal, Play, ShieldCheck } from "lucide-react";

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
        <div className="hidden md:block md:w-1/2" />

        {/* Right Content */}
        <div className="w-full md:w-1/2 hero-content flex flex-col space-y-8">
          <div>
            <div className="inline-block px-3 py-1 border border-white/20 rounded-full text-white/40 text-[10px] uppercase tracking-widest mb-6">
              ESTABLISHED 2026
            </div>
            <h1 className="text-5xl md:text-8xl font-black leading-tight text-white mb-4">
              Cutting Through
              the <span className="inline-flex">
                <span className="text-[#84ce3a]">F</span>
                <span className="text-[#f59e0b]">o</span>
                <span className="text-[#06b6d4]">g</span>
              </span> of AI — <br />
              Together.
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
              If you've felt overwhelmed by "AI everything," you're in the right harbor. We turn the fog into <span className="text-white font-bold italic">Signal → Action → Proof.</span>
            </p>
          </div>

          {/* Feature Boxes */}
          <div className="grid grid-cols-1 gap-4 max-w-lg">
            <div className="flex items-center gap-4 p-5 bg-[#0a1120] border border-white/5 rounded-xl hover:border-[#84ce3a]/30 transition-all group">
              <div className="p-3 bg-white/5 rounded-lg group-hover:bg-[#84ce3a]/20 transition-colors">
                <Signal className="w-6 h-6 text-[#84ce3a]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Signal</h3>
                <p className="text-slate-500 text-sm">Clear insights cutting through the fog of AI complexity</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-[#0a1120] border border-white/5 rounded-xl hover:border-[#f59e0b]/30 transition-all group">
              <div className="p-3 bg-white/5 rounded-lg group-hover:bg-[#f59e0b]/20 transition-colors">
                <Play className="w-6 h-6 text-[#f59e0b]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Action</h3>
                <p className="text-slate-500 text-sm">Guided pathways to transform intelligence into results</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-[#0a1120] border border-white/5 rounded-xl hover:border-[#06b6d4]/30 transition-all group">
              <div className="p-3 bg-white/5 rounded-lg group-hover:bg-[#06b6d4]/20 transition-colors">
                <ShieldCheck className="w-6 h-6 text-[#06b6d4]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Proof</h3>
                <p className="text-slate-500 text-sm">Measurable outcomes that validate your AI investments</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="px-8 py-3 bg-[#84ce3a] text-black font-bold text-sm rounded hover:bg-[#99da56] transition-colors uppercase tracking-tight">
              GET THE COMPASS
            </button>
            <button className="px-8 py-3 bg-transparent border border-white/20 text-white font-medium text-sm rounded hover:bg-white/5 transition-colors">
              View Proof Tiles
            </button>
          </div>

          <div className="text-[10px] text-white/30 italic tracking-widest pt-2">
            AI Business Friends · Partner Track: The TITONS of AI Automation Agencies
          </div>
        </div>
      </div>
    </section>
  );
};

