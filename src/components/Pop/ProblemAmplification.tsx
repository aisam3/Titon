import React from "react";
import { motion } from "framer-motion";
import { XCircle, AlertTriangle, Clock } from "lucide-react";

export const ProblemAmplification = () => {
  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase mb-8">
          The Hidden Cost of <span className="text-red-500">Inaction</span>
        </h2>
        <div className="h-1 w-24 bg-red-500 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tighter italic">Wasted Human Capital</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                By sticking with your current manual workflow, you are paying high-level engineers to do entry-level data entry. This costs you roughly <span className="text-white font-bold">$14,500/month</span> in lost productivity.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tighter italic">Fatal Decision Delay</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                Slow data cycles mean you're reacting to problems that happened 3 days ago. In this market, that delay is the difference between profit and loss.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tighter italic">The Ceiling Effect</h4>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                You cannot scale a broken foundation. Without TITON, your growth will plateau because your team simply cannot process more data manually.
              </p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000" />
          <div className="relative bg-slate-950 border border-red-500/30 p-8 rounded-3xl backdrop-blur-xl">
            <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.5em] mb-6">Status: HIGH RISK</div>
            <div className="space-y-4">
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "85%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-red-500" 
                />
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span>Burn Rate</span>
                <span className="text-white">85%</span>
              </div>
              
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "92%" }}
                  transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                  className="h-full bg-red-500" 
                />
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span>Scaling Friction</span>
                <span className="text-white">92%</span>
              </div>

              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "70%" }}
                  transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                  className="h-full bg-red-500" 
                />
              </div>
              <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span>Data Leakage</span>
                <span className="text-white">70%</span>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl text-center">
              <p className="text-xs text-slate-400 italic font-medium">
                "Without a system change, your operational costs will outpace revenue growth within 4 months."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
