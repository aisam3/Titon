import React from "react";
import { Check, Shield, Zap, Gift } from "lucide-react";

export const PricingStack = () => {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none mb-6">Choose Your <span className="text-primary italic underline underline-offset-[10px]">Access</span></h2>
        <p className="text-slate-400 font-medium uppercase tracking-widest text-sm">Select the plan that matches your scaling speed</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
        {/* Core Entry Plan */}
        <div className="group p-10 rounded-[40px] bg-slate-900/50 border border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col">
          <div className="mb-8">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Core Entry</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Standard Operations</p>
          </div>
          
          <div className="mb-8 flex items-baseline gap-1">
            <span className="text-4xl font-black text-white">$49</span>
            <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">/ month</span>
          </div>

          <div className="space-y-4 mb-12 flex-grow">
            {[
              "500 Entry Capacity",
              "Standard Dashboard",
              "Core Security v1",
              "Email Support"
            ].map(f => (
              <div key={f} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{f}</span>
              </div>
            ))}
          </div>

          <button className="w-full py-4 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/5 transition-all rounded-xl">
             Start Core
          </button>
        </div>

        {/* Recommended: Scaling Pro */}
        <div className="relative group p-10 rounded-[40px] bg-slate-950 border-2 border-primary shadow-[0_0_50px_-12px_rgba(132,206,58,0.3)] flex flex-col transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-full z-10 animate-pulse">
             Recommended for you
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 italic">Scaling Pro</h3>
            <p className="text-primary font-bold uppercase tracking-widest text-[10px]">Optimized Automation</p>
          </div>
          
          <div className="mb-8 flex items-baseline gap-1">
            <span className="text-4xl font-black text-white">$149</span>
            <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">/ month</span>
          </div>

          <div className="space-y-4 mb-12 flex-grow">
            {[
              "5,000 Entry Capacity",
              "Custom BI Dashboard",
              "Enterprise Security v2",
              "24/7 Priority Neural Support",
              "Real-time Anomaly Detection"
            ].map(f => (
              <div key={f} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-white text-[10px] font-black uppercase tracking-[0.1em] italic">{f}</span>
              </div>
            ))}
            
            <div className="pt-4 border-t border-white/5 mt-4">
              <div className="flex items-start gap-3 bg-primary/5 p-4 rounded-2xl border border-primary/20">
                <Gift className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <div className="text-[10px] font-black text-primary uppercase tracking-widest">Bonus: Quick Launch</div>
                  <div className="text-[9px] text-slate-400 font-medium">Free concierge data migration ($499 value)</div>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full py-4 bg-primary text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all rounded-xl shadow-xl">
             Activate Scaling Plan
          </button>
        </div>
      </div>
      
      <div className="mt-16 flex items-center justify-center gap-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
         <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> Secure Payment</div>
         <div className="flex items-center gap-2"><Zap className="w-4 h-4" /> Instant Activation</div>
      </div>
    </div>
  );
};
