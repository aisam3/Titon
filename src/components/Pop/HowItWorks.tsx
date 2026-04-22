import React from "react";

export const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Select Your Tier",
      desc: "Based on your audit, we recommend the Scaling Tier with 500+ daily entries."
    },
    {
      num: "02",
      title: "One-Click Setup",
      desc: "Sync your existing data sources. Our AI handles the initial mapping and cleanup."
    },
    {
      num: "03",
      title: "Activate Intelligence",
      desc: "Launch your custom dashboard and start seeing real-time optimizations in 15 minutes."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="text-center mb-20">
         <div className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">Phase 03: Implementation</div>
         <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic">3 Steps To Full Automation</h2>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Connection Line */}
        <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-[1px] bg-white/10 z-0" />
        
        {steps.map((step, i) => (
          <div key={i} className="relative z-10 text-center group">
            <div className="w-36 h-36 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mx-auto mb-8 group-hover:border-primary transition-all duration-500 relative overflow-hidden">
               <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
               <div className="text-5xl font-black text-white italic tracking-tighter transition-all group-hover:scale-110 group-hover:text-primary">
                 {step.num}
               </div>
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-4">{step.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed px-4">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
