import React from "react";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const Cancel = () => {
  return (
    <div className="min-h-screen bg-[#050b18] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-slate-900/40 border border-white/10 backdrop-blur-3xl p-12 rounded-sm text-center relative z-10 shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="inline-flex items-center justify-center w-24 h-24 bg-red-500/20 rounded-full mb-8"
        >
          <XCircle className="w-12 h-12 text-red-500" />
        </motion.div>

        <h1 className="text-4xl font-black tracking-tighter uppercase mb-4 leading-none">
          SYSTEM <span className="text-red-500">DEFERRED.</span>
        </h1>
        
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-10 leading-relaxed text-center mx-auto max-w-xs">
          Sector access has been paused. No credits were debited from your account. 
        </p>

        <div className="space-y-4">
          <Link
            to="/#pricing"
            className="group flex items-center justify-center gap-3 w-full py-6 bg-transparent text-white font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 border border-white/10 hover:border-red-500 hover:text-red-500"
          >
            <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180" />
            Retry Provision
          </Link>
          
          <Link
            to="/"
            className="group flex items-center justify-center gap-3 w-full py-2 text-slate-600 font-bold uppercase tracking-[0.4em] text-[9px] hover:text-slate-400 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Return to Bridge
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Cancel;
