import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { subscriptionService } from "@/services/subscriptionService";
import { toast } from "sonner";

const Success = () => {
  const [provisioning, setProvisioning] = useState(true);

  useEffect(() => {
    const fulfillUpgrade = async () => {
      try {
        const success = await subscriptionService.upgradeToPro();
        if (success) {
          toast.success("Sector Unlocked", {
            description: "Your Partner Fleet access has been provisioned successfully."
          });
        } else {
          toast.error("Provisioning Delay", {
            description: "We couldn't update your limits automatically. Please contact support."
          });
        }
      } catch (err) {
        console.error("Fulfillment error:", err);
      } finally {
        setProvisioning(false);
      }
    };

    fulfillUpgrade();
  }, []);

  return (
    <div className="min-h-screen bg-[#050b18] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      
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
          className="inline-flex items-center justify-center w-24 h-24 bg-primary/20 rounded-full mb-8"
        >
          {provisioning ? (
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          ) : (
            <CheckCircle2 className="w-12 h-12 text-primary" />
          )}
        </motion.div>

        <h1 className="text-4xl font-black tracking-tighter uppercase mb-4 leading-none">
          {provisioning ? "PROVISIONING..." : "SYSTEM SYNCED."}
        </h1>
        
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-10 leading-relaxed">
          {provisioning 
            ? "Syncing your subscription with the neural sector. Stand by..."
            : "Your credentials have been provisioned and your sector access is now live. Welcome to the fleet."}
        </p>

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className={`group flex items-center justify-center gap-3 w-full py-6 bg-primary text-black font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-500 border border-primary hover:bg-[#99da56] ${provisioning ? 'opacity-50 pointer-events-none' : ''}`}
          >
            Dashboard Access
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          
          {!provisioning && (
            <div className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.4em] pt-4">
              Sector Status: ACTIVE - PRO LIMITS ENABLED
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Success;
