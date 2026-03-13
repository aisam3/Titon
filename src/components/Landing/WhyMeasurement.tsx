import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const WhyMeasurement = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".why-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 20,
        opacity: 0.1,
        stagger: 0.05,
        duration: 0.6,
        ease: "power2.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-60 container mx-auto px-6 relative bg-transparent" ref={sectionRef}>
      <div className="max-w-4xl mx-auto space-y-16 backdrop-blur-lg bg-white/40 p-12 rounded-[3rem] border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
        <div className="text-center space-y-4 text-slate-900">
          <div className="text-primary font-black tracking-[0.4em] text-xs">CORE PRINCIPLE</div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
            Why It <span className="text-gradient-primary">Matters</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[
            { title: "Objectivity", desc: "Removing human bias from decision-making layers through quantified truth." },
            { title: "Scalability", desc: "A framework that grows with your data volume without losing structural integrity." },
            { title: "Clarity", desc: "Cutting through the noise to reveal the underlying signals that drive growth." },
            { title: "Precision", desc: "Operating at levels of mathematical accuracy that standard tools cannot match." }
          ].map((item, i) => (
            <div key={i} className="why-card space-y-4 border-b border-slate-100 pb-8">
              <h3 className="text-2xl font-black tracking-tighter italic text-primary">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
