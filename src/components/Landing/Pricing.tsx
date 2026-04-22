import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { subscriptionService } from "@/services/subscriptionService";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { CustomPricingModal } from "./CustomPricingModal";

const pricingPlans = [
  {
    name: "PRIMER",
    price: "FREE",
    description: "Initial situational awareness with a 3-entry performance cap.",
    features: [
      "Core Performance Analytics",
      "3 Maximum Execution Logs",
      "3 Total Active Projects",
      "Community Dashboard",
    ],
    cta: "Start Syncing",
    popular: false,
  },
  {
    name: "PARTNER FLEET",
    price: "$99",
    period: "/month",
    priceId: "price_1THdvd34NiMjgD3rQITGjGqs",
    description: "Professional scale with 500 Project and Log capacity.",
    features: [
      "500 Total Active Projects",
      "500 Maximum Execution Logs",
      "Neural Sector Access",
      "Advanced Bayesian Models",
      "Priority System Support",
    ],
    cta: "Join Fleet",
    popular: true,
  },
  {
    name: "CUSTOM PLAN",
    price: "CUSTOM",
    description:
      "Scale your business with a tailored solution built to your exact needs.",
    features: [
      "Dedicated Server Support",
      "Unlimited Project Logs",
      "Priority Customer Support",
      "No Hidden Fees",
      "Highest Level Security",
    ],
    cta: "Configure Plan",
    popular: false,
  },
];

export const Pricing = () => {
  const containerRef = useRef(null);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const handleCustomCheckout = async (entries: number) => {
    setLoadingPlan("CUSTOM PLAN");
    setTimeout(() => {
      window.location.href = "https://www.skool.com/business-optimization-experts-5569/about";
      setIsCustomModalOpen(false);
      setLoadingPlan(null);
    }, 800);
  };

  const handleCheckout = async (plan) => {
    console.log("Clicked:", plan);

    // ✅ FREE PLAN FIX
    if (plan.price === "FREE") {
      setLoadingPlan(plan.name);
      try {
        const success = await subscriptionService.activateFreePlan();
        if (success) {
          toast.success("Free plan activated on your account 🚀", {
            description: "You now have 3 Project and 3 Log slots.",
          });
        } else {
          toast.error("Failed to activate plan", {
            description: "Please sign in to link this plan to your account.",
          });
        }
      } catch (err) {
        toast.error("An error occurred during activation.");
      } finally {
        setLoadingPlan(null);
      }
      return;
    }

    // ✅ Pro Plan - Redirect to Skool
    if (plan.name === "PARTNER FLEET" || plan.price === "$99") {
      setLoadingPlan(plan.name);
      setTimeout(() => {
        window.location.href = "https://www.skool.com/business-optimization-experts-5569/about";
      }, 500);
      return;
    }

    if (plan.price === "CUSTOM") {
      setIsCustomModalOpen(true);
      return;
    }
  };

  return (
    <section
      id="pricing"
      ref={containerRef}
      className="py-60 relative overflow-hidden bg-transparent"
    >
      <div className="container mx-auto px-6 relative z-10">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-32 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-primary/30" />
            <span className="text-primary font-black tracking-[0.6em] text-[10px] uppercase">
              OPERATIONAL TIERS
            </span>
            <div className="w-12 h-px bg-primary/30" />
          </div>

          <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none text-white">
            SCALAR <br />
            <span className="text-gradient-primary">INVESTMENT.</span>
          </h2>

          <p className="text-slate-400 text-lg md:text-xl font-bold uppercase tracking-widest max-w-2xl">
            Provision the exact level of structural integrity required for your
            current operational volume.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -20, scale: 1.02 }}
              className={`pricing-card relative p-12 rounded-sm border ${
                plan.popular
                  ? "border-primary bg-primary/5 shadow-[0_20px_80px_rgba(132,206,58,0.15)]"
                  : "border-white/10 bg-slate-900/40 shadow-[0_10px_40px_rgba(0,0,0,0.1)]"
              } backdrop-blur-3xl transition-all duration-700 flex flex-col h-full`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-12 -translate-y-1/2 bg-primary text-white text-[9px] font-black px-4 py-2 uppercase tracking-widest">
                  MOST ACTIVE
                </div>
              )}

              {/* PLAN INFO */}
              <div className="mb-12">
                <h3 className="text-sm font-black tracking-[0.4em] text-primary uppercase mb-4">
                  {plan.name}
                </h3>

                <div className="flex items-baseline gap-2 text-white">
                  <span className={`${plan.price === "CUSTOM" ? "text-4xl md:text-5xl" : "text-6xl"} font-black tracking-tighter uppercase`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-slate-700 font-bold text-xs font-mono tracking-widest uppercase">
                      {plan.period}
                    </span>
                  )}
                </div>

                <p className="mt-6 text-slate-200 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* FEATURES */}
              <div className="flex-grow space-y-6 mb-12">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-4 group/item">
                    <div className="w-1.5 h-1.5 mt-1.5 bg-primary group-hover/item:scale-125 transition-transform rotate-45 shrink-0" />
                    <span className="text-[11px] text-white font-bold uppercase tracking-widest group-hover/item:text-primary transition-colors">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* BUTTON */}
              <button
                onClick={() => handleCheckout(plan)}
                disabled={loadingPlan === plan.name}
                className={`w-full py-6 font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-500 border ${
                  plan.popular
                    ? "bg-primary text-black border-primary hover:bg-[#99da56]"
                    : "bg-transparent text-white border-white/10 hover:border-primary hover:text-primary"
                } ${
                  loadingPlan === plan.name ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loadingPlan === plan.name ? "PROCESSING..." : plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <CustomPricingModal 
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onConfirm={handleCustomCheckout}
        isLoading={loadingPlan === "CUSTOM PLAN"}
      />
    </section>
  );
};