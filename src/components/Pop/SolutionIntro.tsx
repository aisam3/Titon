import React from "react";
import { CheckCircle2, Zap, Target } from "lucide-react";

export const SolutionIntro = () => {
  return (
    <div className="max-w-6xl mx-auto w-full text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8">
        <Target className="w-3 h-3" />
        The Solution
      </div>

      <h2 className="text-3xl sm:text-4xl md:text-7xl font-black tracking-tighter text-white uppercase mb-8 leading-[0.9] sm:leading-none">
        Your Custom <span className="text-primary italic underline decoration-primary/30">Growth Plan</span>
      </h2>

      <p className="text-xl text-slate-400 mb-16 max-w-3xl mx-auto font-medium">
        We've engineered a specific TITON implementation tailored to your Scaling stage. Here is how we resolve your manual entry bottlenecks and secure your data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {[
          {
            title: "Automated Data Ingestion",
            desc: "Replace manual logs with 500+ daily automated entries via our secure API bridge.",
            icon: Zap
          },
          {
            title: "Real-time Intelligence",
            desc: "Move from 3-day lag to 3-second visibility on all key performance indicators.",
            icon: CheckCircle2
          },
          {
            title: "Scalable Architecture",
            desc: "A foundation built to handle 10x your current volume without adding additional staff.",
            icon: Target
          }
        ].map((item, i) => (
          <div key={i} className="p-8 rounded-3xl bg-slate-900/50 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full translate-x-12 -translate-y-12 group-hover:bg-primary/20 transition-colors duration-500" />
            <div className="p-3 w-fit rounded-xl bg-primary/10 text-primary mb-6">
              <item.icon className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">{item.title}</h4>
            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
