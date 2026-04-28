import React from "react";
import { DollarSign, ShieldCheck, Database } from "lucide-react";

export const Economics = () => {
  return (
    <div className="max-w-7xl mx-auto w-full text-center">
      <div className="mb-16">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic mb-8">
          Why This Matters <span className="text-primary underline underline-offset-8">Economically</span>
        </h2>
        <p className="text-2xl text-slate-400 font-medium max-w-3xl mx-auto">
          TITON strengthens your Monthly Recurring Revenue (MRR) through three core pillars of operational maturity.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: ShieldCheck, title: "SOP Standards", desc: "Build unshakeable operations" },
          { icon: DollarSign, title: "Proof-Backed Delivery", desc: "Justify higher retainers" },
          { icon: Database, title: "Benchmark Intelligence", desc: "Know where you stand" }
        ].map((pillar, i) => (
          <div key={i} className="p-10 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-500 group">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <pillar.icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{pillar.title}</h3>
            <p className="text-slate-400 font-medium">{pillar.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
