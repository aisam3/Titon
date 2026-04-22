import React from "react";
import { AlertCircle, TrendingUp, ShieldAlert, BarChart3 } from "lucide-react";

const AuditItem = ({ icon: Icon, title, desc, status }: any) => (
  <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all duration-500 group">
    <div className="flex items-start justify-between mb-6">
      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded ${
        status === 'at-risk' ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'
      }`}>
        {status}
      </span>
    </div>
    <h3 className="text-xl font-black mb-3 text-white uppercase tracking-tighter">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed font-medium">{desc}</p>
  </div>
);

export const AuditBreakdown = () => {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">Phase 01: The Diagnosis</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">Audit Results Breakdown</h2>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <BarChart3 className="text-primary w-8 h-8" />
          <div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Growth Readiness</div>
            <div className="text-2xl font-black text-white tracking-tighter">42%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AuditItem 
          icon={AlertCircle}
          title="Manual Entry Bottlenecks"
          desc="Your team is spending 12+ hours weekly on manual log entries, leading to a 15% error rate in reporting."
          status="at-risk"
        />
        <AuditItem 
          icon={TrendingUp}
          title="Scalability Gap"
          desc="Your current system is optimized for low volume. Scaling to your target of 5,000 entries will cause system lag."
          status="attention"
        />
        <AuditItem 
          icon={ShieldAlert}
          title="Data Fragment Leak"
          desc="Multiple silos mean 22% of your performance data is never acted upon, resulting in missed optimizations."
          status="at-risk"
        />
      </div>
    </div>
  );
};
