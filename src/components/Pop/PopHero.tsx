import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PopHeroProps {
  onOpenWaitlist: () => void;
}

export const PopHero: React.FC<PopHeroProps> = ({ onOpenWaitlist }) => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto w-full flex flex-col items-center justify-center gap-12 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl flex flex-col items-center space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
          <Sparkles className="w-3 h-3" />
          The Profitable Offer Prototype
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter text-white uppercase leading-[0.9] sm:leading-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          Build Proof Together. <br/>
          Build MRR From What <span className="text-primary italic">Compounds</span>.
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          TITON is a collaborative MVP environment where agencies turn workflows into proof, proof into analytics, and analytics into recurring value.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
          <button 
            onClick={() => navigate("/r6-audit")}
            className="group relative px-12 py-6 bg-[#84ce3a] text-black text-xs font-black uppercase tracking-[0.5em] hover:bg-white transition-all duration-500 rounded overflow-hidden w-full md:w-auto"
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
