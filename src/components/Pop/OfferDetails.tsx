import React from "react";
import { Layers, ShieldCheck, Cpu, Database, Activity } from "lucide-react";

export const OfferDetails = () => {
  const features = [
    { icon: Layers, title: "Custom Dashboard", desc: "Tailored to your Scaling KPI needs" },
    { icon: ShieldCheck, title: "Security Protocols", desc: "Military-grade data encryption" },
    { icon: Cpu, title: "Core Processor v2", desc: "Handle up to 5,000 entries daily" },
    { icon: Database, title: "Vault Storage", desc: "Unlimited log history retention" },
    { icon: Activity, title: "Neural Link", desc: "Predictive anomaly detection" }
  ];

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">Phase 02: Deployment</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic mb-8">What You Get Inside The TITON Tier</h2>
          
          <div className="space-y-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                  <f.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-lg font-black text-white uppercase tracking-tighter leading-none mb-1 italic">{f.title}</div>
                  <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-4 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
             <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050b18] bg-slate-800" />
                ))}
             </div>
             +240 High Volume Users Already Active
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full animate-pulse" />
          <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-[40px] p-8 overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="px-3 py-1 rounded bg-primary text-black text-[8px] font-black uppercase tracking-widest animate-bounce">Live System</div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Network Throughput</div>
                 <div className="h-24 w-full flex items-end gap-1">
                   {[40, 70, 45, 90, 65, 80, 50, 100, 75, 85].map((h, i) => (
                     <div key={i} className="flex-1 bg-primary/40 rounded-t group-hover:bg-primary transition-colors" style={{ height: `${h}%` }} />
                   ))}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-center">Uptime</div>
                   <div className="text-3xl font-black text-white text-center tracking-tighter">99.98%</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-center">Latency</div>
                   <div className="text-3xl font-black text-white text-center tracking-tighter italic">42ms</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Estimated ROI</div>
                  <div className="text-3xl font-black text-primary tracking-tighter italic">340%</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">First 30 Days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
