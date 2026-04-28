import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface PopHeroProps {
  onOpenWaitlist: () => void;
}

export const PopHero: React.FC<PopHeroProps> = ({ onOpenWaitlist }) => {
  return (
    <div className="container mx-auto w-full flex flex-col lg:flex-row items-center gap-12 px-6">
      <div className="hidden lg:block lg:w-[40%]" />

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-[60%] text-left lg:text-right flex flex-col items-start lg:items-end space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
          <Sparkles className="w-3 h-3" />
          The Profitable Offer Prototype
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-[0.9] sm:leading-none">
          Build Proof Together. <br/>
          Build MRR From What <span className="text-primary italic">Compounds</span>.
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-xl">
          TITON is a collaborative MVP environment where agencies turn workflows into proof, proof into analytics, and analytics into recurring value.
        </p>

        <div className="flex flex-col md:flex-row-reverse items-center justify-end gap-6 w-full lg:w-auto">
          <button 
            onClick={onOpenWaitlist}
            className="group relative px-10 py-5 bg-[#84ce3a] text-black text-xs font-black uppercase tracking-[0.5em] hover:bg-white transition-all duration-500 rounded overflow-hidden w-full md:w-auto"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            <span className="relative z-10 flex items-center justify-center gap-3">
              Apply for Early Access
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <a 
            href="#fog-to-proof"
            className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            Explore the TITON Path
          </a>
        </div>
      </motion.div>
    </div>
  );
};
