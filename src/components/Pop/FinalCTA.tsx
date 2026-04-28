import React from "react";
import { ArrowRight, Star, Users, Clock } from "lucide-react";

interface FinalCTAProps {
  onOpenWaitlist: (fleet: string) => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenWaitlist }) => {
  return (
    <div className="max-w-5xl mx-auto w-full text-center relative overflow-hidden p-12 md:p-24 rounded-[60px] border border-white/10 bg-slate-950/40 backdrop-blur-md">
       {/* Background Glow */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] -z-10 rounded-full" />

       <h2 className="text-3xl sm:text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic mb-8 leading-[0.9] sm:leading-none">
         Stop Guessing. <br />
         Start <span className="text-primary italic underline underline-offset-8">Scaling</span>.
       </h2>

       <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto mb-16">
         The TITON system is ready for your data. Lock in your spot today and fix your manual bottlenecks forever.
       </p>

       <div className="flex flex-col items-center gap-6 max-w-xl mx-auto w-full">
         <button 
           onClick={() => onOpenWaitlist("Charter")}
           className="w-full group relative px-8 py-5 bg-yellow-400 text-black text-sm font-black uppercase tracking-[0.2em] hover:bg-white transition-all duration-500 rounded-2xl shadow-xl overflow-hidden"
         >
            <span className="relative z-10 flex items-center justify-between">
              <span className="flex items-center gap-2"><Star className="w-5 h-5" /> Join the TITON Charter Fleet Waitlist</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <button 
            onClick={() => onOpenWaitlist("Partner")}
            className="w-full group relative px-8 py-5 bg-[#84ce3a] text-black text-sm font-black uppercase tracking-[0.2em] hover:bg-white transition-all duration-500 rounded-2xl shadow-xl overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-between">
              <span className="flex items-center gap-2"><Users className="w-5 h-5" /> Join the TITON Partner Fleet Waitlist</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button 
            onClick={() => onOpenWaitlist("Extended")}
            className="w-full group relative px-8 py-5 bg-white/10 text-white border border-white/20 text-sm font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500 rounded-2xl overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-between">
              <span className="flex items-center gap-2"><Clock className="w-5 h-5" /> Join the TITON Extended Waitlist</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
       </div>
    </div>
  );
};
