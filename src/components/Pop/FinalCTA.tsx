import React from "react";
import { ArrowRight, Lock } from "lucide-react";

export const FinalCTA = () => {
  return (
    <div className="max-w-5xl mx-auto w-full text-center relative overflow-hidden p-12 md:p-24 rounded-[60px]">
       {/* Background Glow */}
       <div className="absolute inset-0 bg-primary/5 -z-10" />
       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] -z-10 rounded-full" />

       <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic mb-8 leading-none">
         Stop Guessing. <br />
         Start <span className="text-primary italic underline underline-offset-8">Scaling</span>.
       </h2>

       <p className="text-xl text-slate-400 font-medium mb-12 max-w-2xl mx-auto mb-16">
         The TITON system is ready for your data. Lock in your custom growth plan today and fix your manual bottlenecks forever.
       </p>

       <div className="flex flex-col items-center gap-6">
         <button className="group relative px-12 py-6 bg-white text-black text-sm font-black uppercase tracking-[0.5em] hover:bg-primary transition-all duration-500 rounded-2xl shadow-2xl overflow-hidden scale-110">
            <span className="relative z-10 flex items-center gap-3">
              Get My Plan Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mt-8">
            <Lock className="w-3 h-3" />
            100% Secure & Encrypted Registration
          </div>
       </div>
    </div>
  );
};
