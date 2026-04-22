import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { LighthouseScene } from "@/components/Three/LighthouseScene";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion, useScroll, useSpring } from "framer-motion";

// Import POP Components (to be created)
import { PopHero } from "@/components/Pop/PopHero";
import { AuditBreakdown } from "@/components/Pop/AuditBreakdown";
import { ProblemAmplification } from "@/components/Pop/ProblemAmplification";
import { SolutionIntro } from "@/components/Pop/SolutionIntro";
import { OfferDetails } from "@/components/Pop/OfferDetails";
import { TrustSection } from "@/components/Pop/TrustSection";
import { HowItWorks } from "@/components/Pop/HowItWorks";
import { PricingStack } from "@/components/Pop/PricingStack";
import { UrgencySection } from "@/components/Pop/UrgencySection";
import { FinalCTA } from "@/components/Pop/FinalCTA";
import { FAQSection } from "@/components/Pop/FAQSection";

gsap.registerPlugin(ScrollTrigger);

const PopPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      lerp: 0.1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Standard Scroll Entry Animations
    const sections = [
      '#pop-hero', 
      '#audit-breakdown', 
      '#problem-amplification', 
      '#solution-intro', 
      '#offer-details', 
      '#trust-section', 
      '#how-it-works', 
      '#pricing-stack', 
      '#urgency-section', 
      '#final-cta', 
      '#faq-section'
    ];
    
    sections.forEach((selector) => {
      gsap.from(selector + " > div", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: selector,
          start: "top 80%",
          toggleActions: "play none none reverse",
          scrub: false,
        }
      });
    });

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div id="pop-container" className="relative bg-[#050b18] text-white min-h-screen selection:bg-[#84ce3a]/30 selection:text-white overflow-hidden">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[200] origin-left"
        style={{ scaleX }}
      />

      <Navbar />

      {/* Persistent 3D Lighthouse Scene */}
      <LighthouseScene />

      <main className="relative z-10">
        <section id="pop-hero" className="min-h-[90vh] flex items-center justify-center py-20 px-6">
          <div className="w-full">
            <PopHero />
          </div>
        </section>

        <section id="audit-breakdown" className="min-h-[80vh] flex items-center py-20 px-6 bg-slate-950/40 backdrop-blur-sm border-y border-white/5">
          <div className="w-full">
            <AuditBreakdown />
          </div>
        </section>

        <section id="problem-amplification" className="min-h-[80vh] flex items-center py-20 px-6">
          <div className="w-full">
            <ProblemAmplification />
          </div>
        </section>

        <section id="solution-intro" className="min-h-[80vh] flex items-center py-20 px-6 bg-primary/5">
          <div className="w-full">
            <SolutionIntro />
          </div>
        </section>

        <section id="offer-details" className="min-h-[80vh] flex items-center py-20 px-6">
          <div className="w-full">
            <OfferDetails />
          </div>
        </section>

        <section id="trust-section" className="min-h-[80vh] flex items-center py-20 px-6 bg-slate-950/40 backdrop-blur-sm border-y border-white/5">
          <div className="w-full">
            <TrustSection />
          </div>
        </section>

        <section id="how-it-works" className="min-h-[80vh] flex items-center py-20 px-6">
          <div className="w-full">
            <HowItWorks />
          </div>
        </section>

        <section id="pricing-stack" className="min-h-[100vh] flex items-center py-20 px-6 bg-primary/5">
          <div className="w-full">
            <PricingStack />
          </div>
        </section>

        <section id="urgency-section" className="py-20 px-6 bg-red-500/10 border-y border-red-500/20">
          <div className="w-full">
            <UrgencySection />
          </div>
        </section>

        <section id="final-cta" className="min-h-[60vh] flex items-center py-20 px-6">
          <div className="w-full">
            <FinalCTA />
          </div>
        </section>

        <section id="faq-section" className="py-20 px-6 bg-slate-950/40 backdrop-blur-sm border-t border-white/5">
          <div className="w-full">
            <FAQSection />
          </div>
        </section>
      </main>
    </div>
  );
};

export default PopPage;
