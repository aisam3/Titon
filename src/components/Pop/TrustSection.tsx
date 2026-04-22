import React from "react";
import { Quote, Star } from "lucide-react";

export const TrustSection = () => {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase italic mb-4">Trusted By High-Performance Teams</h2>
        <div className="flex items-center justify-center gap-1 text-primary">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            name: "Marcus Thorne",
            role: "CTO, Vector Logistics",
            quote: "TITON cut our data entry time by 80%. We were able to scale our delivery fleet without hiring a single extra dispatcher.",
            img: "MT"
          },
          {
            name: "Sarah Chen",
            role: "Director of Ops, NeoFlow",
            quote: "The personalized audit was eye-opening. We didn't realize we were leaking $10k a month in manual overhead until TITON showed us.",
            img: "SC"
          },
          {
            name: "David Ross",
            role: "Founder, Titan Infrastructure",
            quote: "Integration was seamless. Within 48 hours, our entire engineering team was working off real-time data instead of spreadsheets.",
            img: "DR"
          }
        ].map((t, i) => (
          <div key={i} className="p-8 rounded-3xl bg-slate-950 border border-white/10 hover:border-primary/50 transition-all duration-500 relative flex flex-col justify-between">
            <Quote className="absolute top-6 right-8 w-12 h-12 text-white/5" />
            <p className="text-slate-300 italic mb-8 relative z-10 leading-relaxed font-medium">"{t.quote}"</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary font-black uppercase text-xs">
                {t.img}
              </div>
              <div>
                <div className="text-white font-bold uppercase tracking-tight">{t.name}</div>
                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-20 flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
         {/* Placeholder for partner logos */}
         {["VECTOR", "NEOFLOW", "TITAN", "APEX", "QUANTUM"].map(l => (
           <span key={l} className="text-2xl font-black tracking-tighter text-white uppercase">{l}</span>
         ))}
      </div>
    </div>
  );
};
