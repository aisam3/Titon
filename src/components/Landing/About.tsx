import React, { useRef } from "react";
import { motion } from "framer-motion";

export const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section id="about" ref={sectionRef} className="py-32 relative w-full">
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        <div className="flex flex-col items-center text-center mb-24 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-[2px] bg-primary" />
            <span className="text-primary font-bold tracking-widest text-[10px] uppercase">OUR MANIFESTO</span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase text-slate-900">
            BUILDING <br />
            <span className="text-primary">CERTAINTY.</span>
          </h2>
          <p className="mt-12 text-lg md:text-xl text-slate-600 leading-relaxed font-light tracking-wide uppercase">
            "In a world drowning in raw information, the challenge isn't acquiring data—it's navigating it. TITON provides the structural integrity needed to transform chaos into clarity."
          </p>
        </div>

        <div className="about-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20 w-full">
          {[
            { title: "Performance", desc: "SOP-based assessments and performance measurement that ensure rigorous operational hierarchy." },
            { title: "Control", desc: "Control Self-Assessment (CSA) audits for provisioning, set-up, and deployment integrity." },
            { title: "Benchmarking", desc: "Using the TITON SOP Taxonomy + Process-Based Management overlays for industry insight." }
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ rotateX: 10, rotateY: 10, translateZ: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="group p-10 bg-slate-50/50 backdrop-blur-3xl rounded-sm border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:border-primary/50 transition-colors duration-500"
            >
              <div className="space-y-6" style={{ transform: 'translateZ(40px)' }}>
                <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center font-black text-primary text-xs border border-primary/20 shadow-[0_0_20px_rgba(0,163,255,0.2)]">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900 group-hover:text-primary transition-colors">{card.title}</h3>
                <p className="text-slate-600 text-xs font-mono leading-relaxed uppercase tracking-widest">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
