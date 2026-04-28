import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { LighthouseScene } from "@/components/Three/LighthouseScene";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion, useScroll, useSpring } from "framer-motion";

// Import POP Components (to be created)
import { PopHero } from "@/components/Pop/PopHero";
import { FogToProof } from "@/components/Pop/FogToProof";
import { PartnerRole } from "@/components/Pop/PartnerRole";
import { PurpleCow } from "@/components/Pop/PurpleCow";
import { PopPath } from "@/components/Pop/PopPath";
import { Economics } from "@/components/Pop/Economics";
import { AccessStructure } from "@/components/Pop/AccessStructure";
import { FinalCTA } from "@/components/Pop/FinalCTA";
import { WaitlistModal } from "@/components/Pop/WaitlistModal";

gsap.registerPlugin(ScrollTrigger);

const PopPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isWaitlistOpen, setIsWaitlistOpen] = React.useState(false);
  const [selectedFleet, setSelectedFleet] = React.useState("Charter");

  const handleOpenWaitlist = (fleet: string = "Charter") => {
    setSelectedFleet(fleet);
    setIsWaitlistOpen(true);
  };

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
      '#fog-to-proof', 
      '#partner-role', 
      '#purple-cow', 
      '#pop-path', 
      '#economics', 
      '#access-structure', 
      '#final-cta'
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

      <main className="relative z-10 pt-20">
        <section id="pop-hero" className="min-h-[90vh] flex items-center justify-center py-20 px-6">
          <div className="w-full">
            <PopHero onOpenWaitlist={() => handleOpenWaitlist("Charter")} />
          </div>
        </section>

        <section id="fog-to-proof" className="min-h-[80vh] flex items-center py-32 px-6 bg-slate-950/40 backdrop-blur-sm border-y border-white/5">
          <div className="w-full">
            <FogToProof />
          </div>
        </section>

        <section id="partner-role" className="min-h-[80vh] flex items-center py-32 px-6">
          <div className="w-full">
            <PartnerRole />
          </div>
        </section>

        <section id="purple-cow" className="min-h-[80vh] flex items-center py-32 px-6 bg-primary/5 border-y border-white/5">
          <div className="w-full">
            <PurpleCow />
          </div>
        </section>

        <section id="pop-path" className="min-h-[80vh] flex items-center py-32 px-6 bg-slate-950/40 backdrop-blur-sm">
          <div className="w-full">
            <PopPath />
          </div>
        </section>

        <section id="economics" className="min-h-[80vh] flex items-center py-32 px-6">
          <div className="w-full">
            <Economics />
          </div>
        </section>

        <section id="access-structure" className="py-32 px-6 bg-primary/5 border-y border-white/5">
          <div className="w-full">
            <AccessStructure onOpenWaitlist={handleOpenWaitlist} />
          </div>
        </section>

        <section id="final-cta" className="min-h-[60vh] flex items-center py-32 px-6 bg-slate-950/40 backdrop-blur-sm">
          <div className="w-full">
            <FinalCTA onOpenWaitlist={handleOpenWaitlist} />
          </div>
        </section>
      </main>

      <WaitlistModal 
        isOpen={isWaitlistOpen} 
        onClose={() => setIsWaitlistOpen(false)} 
        defaultFleet={selectedFleet}
      />
    </div>
  );
};

export default PopPage;
