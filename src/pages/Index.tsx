import React, { useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Landing/Hero";
import { About } from "@/components/Landing/About";
import { Frameworks as Achievements } from "@/components/Landing/Frameworks";
import { MeasurementTypes as Measurements } from "@/components/Landing/MeasurementTypes";
import { WhyMeasurement } from "@/components/Landing/WhyMeasurement";
import { Pricing } from "@/components/Landing/Pricing";
import { CTA as Contact } from "@/components/Landing/CTA";
import { LighthouseScene } from "@/components/Three/LighthouseScene";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion, useScroll, useSpring } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    console.log("TITON SYSTEM: Index component mounted successfully.");
  }, []);

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
    const sections = ['#hero-section', '#about-section', '#achievements-section', '#why-section', '#measurements-section', '#pricing-section', '#cta-section'];
    
    sections.forEach((selector) => {
      gsap.from(selector + " > div", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: selector,
          start: "top 95%",
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
    <div id="index-container" className="relative bg-[#050b18] text-white min-h-screen selection:bg-[#84ce3a]/30 selection:text-white overflow-hidden">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[200] origin-left"
        style={{ scaleX }}
      />

      <Navbar />

      {/* Persistent 3D Lighthouse Scene */}
      <LighthouseScene />

      <main className="relative z-10">
        <section id="hero-section" className="min-h-[80vh] flex items-center justify-center">
          <div>
            <Hero />
          </div>
        </section>

        <section id="about-section" className="min-h-[80vh] flex items-center">
          <div className="w-full">
            <About />
          </div>
        </section>

        <section id="achievements-section" className="min-h-[80vh] flex items-center">
          <div className="w-full">
            <Achievements />
          </div>
        </section>

        <section id="why-section" className="min-h-[80vh] flex items-center">
          <div className="w-full">
            <WhyMeasurement />
          </div>
        </section>

        <section id="measurements-section" className="min-h-[80vh] flex items-center">
          <div className="w-full">
            <Measurements />
          </div>
        </section>

        <section id="pricing-section" className="min-h-[80vh] flex items-center">
          <div className="w-full">
            <Pricing />
          </div>
        </section>

        <section id="cta-section" className="min-h-[80vh] flex items-center">
          <div className="w-full">
            <Contact />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
