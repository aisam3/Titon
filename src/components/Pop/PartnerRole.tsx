import React from "react";
import { CheckCircle2, Workflow, Target, FileCheck, BarChart, ShieldCheck, Zap, Users, Lightbulb } from "lucide-react";

export const PartnerRole = () => {
  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Section 3: The TITON Partner Role */}
      <div className="text-center max-w-4xl mx-auto mb-20">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic mb-6">The TITON Partner Role</h2>
        <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
          This is not a passive subscription. Partners contribute: <span className="text-primary">proof for their agency</span> + <span className="text-white">intelligence for the TITON network</span>.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Section 4: What Partners Contribute */}
        <div className="p-10 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Users className="w-32 h-32" />
          </div>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 relative z-10">What Partners Contribute</h3>
          <ul className="space-y-6 relative z-10">
            {[
              { icon: Workflow, text: "One priority workflow" },
              { icon: Target, text: "PSD observations" },
              { icon: FileCheck, text: "SOP clarity" },
              { icon: BarChart, text: "Performance measures" },
              { icon: ShieldCheck, text: "First Proof Tile™" }
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-slate-300 font-medium text-lg">
                <item.icon className="w-6 h-6 text-primary flex-shrink-0" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Section 5: What TITON Provides */}
        <div className="p-10 rounded-3xl bg-primary/5 border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Zap className="w-32 h-32 text-primary" />
          </div>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 relative z-10">What TITON Provides</h3>
          <ul className="space-y-6 relative z-10">
            {[
              { icon: Lightbulb, text: "Workflow modeling support" },
              { icon: Zap, text: "Signal → Action → Proof discipline" },
              { icon: FileCheck, text: "SOP structure" },
              { icon: ShieldCheck, text: "Proof Tile™ standards" },
              { icon: Users, text: "Collaborative feedback" }
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-slate-300 font-medium text-lg">
                <CheckCircle2 className="w-6 h-6 text-[#84ce3a] flex-shrink-0" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
