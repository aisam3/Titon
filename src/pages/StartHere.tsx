import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { LighthouseScene } from "@/components/Three/LighthouseScene";
import { WaitlistModal } from "@/components/Pop/WaitlistModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion, useScroll, useSpring, Variants } from "framer-motion";
import { ChevronRight, ArrowRight, CheckCircle2, ShieldCheck, Zap, Target, Layers, PlayCircle, BookOpen, Users, Milestone } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const StartHere = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState("Charter");

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

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: "easeOut" }
    }
  };

  return (
    <div id="start-here-container" className="relative bg-[#050b18] text-white min-h-screen selection:bg-primary/30 selection:text-white overflow-hidden font-['Inter',_sans-serif]">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[200] origin-left"
        style={{ scaleX }}
      />

      <Navbar />

      {/* Persistent 3D Lighthouse Scene */}
      <LighthouseScene />

      <main className="relative z-20 pt-20">
        
        {/* 1. HERO */}
        <section id="hero" className="min-h-screen flex items-center justify-center py-20 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="container mx-auto text-center max-w-4xl"
          >
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                <PlayCircle className="w-3 h-3" /> Guided Entry Point
              </div>
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none mb-8 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                Start <span className="text-primary text-gradient-primary">Here</span>
              </h1>
              <p className="text-xl md:text-3xl font-bold text-slate-100 max-w-5xl mx-auto leading-tight uppercase tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                A guided entry point into TITON
              </p>
              <div className="space-y-6 text-slate-300 max-w-2xl mx-auto leading-relaxed text-lg drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
                <p>
                  New here? You're in the right place. Below is everything you need to understand what TITON is, whether it's for you, and how to take your first step.
                </p>
              </div>
              <div className="pt-10">
                <ChevronRight className="w-10 h-10 text-primary mx-auto animate-bounce" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2. TITON OPERATING CREED™ */}
        <section id="creed" className="py-40 px-6 bg-slate-900/40 backdrop-blur-sm border-y border-white/5">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="container mx-auto max-w-4xl"
          >
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">TITON Operating Creed™</h2>
              <p className="text-xl text-slate-400 font-medium uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
                The Creed is our philosophy and guiding principles. It answers 'how we operate' before 'what we build.'
              </p>
            </div>
            
            <div className="grid gap-8">
              {[
                { title: "Principle 1", text: "[Placeholder for Operating Principle 1]" },
                { title: "Principle 2", text: "[Placeholder for Operating Principle 2]" },
                { title: "Principle 3", text: "[Placeholder for Operating Principle 3]" }
              ].map((item, i) => (
                <div key={i} className="group p-8 bg-black/40 border border-white/5 rounded-2xl hover:border-primary/30 transition-all duration-500">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary transition-all duration-500">
                      <ShieldCheck className="w-6 h-6 text-primary group-hover:text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">{item.title}</h3>
                      <p className="text-slate-400 leading-relaxed font-medium">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 3. SYSTEM OVERVIEW */}
        <section id="overview" className="py-40 px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="container mx-auto max-w-5xl"
          >
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                  TITON System <br />
                  <span className="text-primary">Overview</span>
                </h2>
                <p className="text-xl text-slate-300 font-bold uppercase tracking-tight">TITON is built on three core layers:</p>
                <ul className="space-y-8">
                  {[
                    { title: "Charter Fleet", desc: "The primary working group (50 agencies)" },
                    { title: "Proof Tile Registry", desc: "Library of Signal → Action → Proof workflows" },
                    { title: "Shared Industry Intelligence (SII)", desc: "Collective benchmark data" }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-5">
                      <div className="mt-1 w-6 h-6 rounded-full border border-primary/30 flex items-center justify-center shrink-0">
                        <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(132,206,58,1)]" />
                      </div>
                      <div>
                        <span className="block text-white font-black uppercase tracking-widest text-sm mb-1">{item.title}</span>
                        <span className="text-slate-400 font-medium">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-lg text-slate-400 leading-relaxed italic border-l-2 border-primary pl-6">
                  "Together, these turn individual workflow activity into visible proof and industry authority."
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full" />
                <div className="relative aspect-square border border-white/10 rounded-[64px] bg-black/40 backdrop-blur-2xl p-12 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="aspect-square bg-primary/10 border border-primary/20 rounded-3xl animate-pulse" />
                    <div className="aspect-square bg-accent/10 border border-accent/20 rounded-3xl" style={{ animationDelay: '0.5s' }} />
                    <div className="aspect-square bg-blue-500/10 border border-blue-500/20 rounded-3xl" style={{ animationDelay: '1s' }} />
                    <div className="aspect-square bg-white/5 border border-white/10 rounded-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4. FIRST STEPS (The Fast-Start Path) */}
        <section id="first-steps" className="py-40 px-6 bg-slate-900/40 backdrop-blur-sm border-y border-white/5">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="container mx-auto max-w-6xl"
          >
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6">Your First Steps</h2>
              <p className="text-2xl text-primary font-black uppercase tracking-[0.4em]">Join → First Proof → Momentum</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  step: "01", 
                  title: "Join a waitlist", 
                  desc: "Choose Charter Fleet, Partner Fleet, or Extended Waitlist",
                  icon: Users
                },
                { 
                  step: "02", 
                  title: "Access the Guide", 
                  desc: "Download the TITON Starter Guide (PDF)",
                  icon: BookOpen
                },
                { 
                  step: "03", 
                  title: "Build First Proof", 
                  desc: "Pick one workflow, define signal, action, and proof",
                  icon: Target
                },
                { 
                  step: "04", 
                  title: "Collaborate", 
                  desc: "Join Skool, attend working group sessions",
                  icon: Milestone
                }
              ].map((item, i) => (
                <div key={i} className="relative p-10 bg-black/60 border border-white/5 rounded-[40px] hover:border-primary/40 transition-all duration-700 group">
                  <div className="absolute top-8 right-8 text-6xl font-black text-white/5 group-hover:text-primary/10 transition-colors">
                    {item.step}
                  </div>
                  <item.icon className="w-12 h-12 text-primary mb-8 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-black uppercase tracking-tight text-white mb-4 leading-tight">{item.title}</h3>
                  <p className="text-slate-400 font-medium text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 5. WHO THIS IS FOR */}
        <section id="who-it-is-for" className="py-40 px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="container mx-auto max-w-4xl"
          >
            <div className="bg-gradient-to-br from-slate-900 to-black border border-white/10 p-20 rounded-[64px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-12">Is TITON for you?</h2>
              <p className="text-xl text-slate-300 font-black uppercase tracking-widest mb-10">TITON is for HighLevel agencies that want:</p>
              
              <ul className="space-y-6 mb-12">
                {[
                  "To move beyond dashboards into proof-driven operations",
                  "Benchmark-ready SOP discipline",
                  "Collaborative intelligence, not isolated work",
                  "A structured path to authority and recurring value"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg font-bold uppercase tracking-tight group">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary transition-all duration-500">
                      <CheckCircle2 className="w-4 h-4 text-primary group-hover:text-black" />
                    </div>
                    <span className="group-hover:text-primary transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
              
              <p className="text-xl text-primary font-black uppercase tracking-[0.5em] animate-pulse">If that sounds like you — keep going.</p>
            </div>
          </motion.div>
        </section>

        {/* 6. FINAL CTA */}
        <section id="final-cta" className="py-40 px-6 relative">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="container mx-auto text-center space-y-16"
          >
            <div className="space-y-6">
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-tight mb-4">
                READY TO <br />
                <span className="text-primary text-gradient-primary">START?</span>
              </h2>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-8">
              <button 
                onClick={() => handleOpenWaitlist("Charter")}
                className="group relative px-12 py-7 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-primary transition-all duration-700 rounded shadow-xl"
              >
                Join the TITON Charter Fleet Waitlist
                <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-accent group-hover:w-full transition-all duration-700" />
              </button>
              <button 
                onClick={() => handleOpenWaitlist("Partner")}
                className="group relative px-12 py-7 bg-primary text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-all duration-700 rounded shadow-[0_0_40px_-10px_rgba(132,206,58,0.5)]"
              >
                Join the TITON Partner Fleet Waitlist
                <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-accent group-hover:w-full transition-all duration-700" />
              </button>
              <button 
                onClick={() => handleOpenWaitlist("Extended")}
                className="group relative px-12 py-7 bg-transparent border border-white/20 text-white font-black uppercase tracking-widest text-xs hover:border-primary hover:text-primary transition-all duration-700 rounded"
              >
                Join the TITON Extended Waitlist
              </button>
            </div>
            
            <div className="pt-8">
              <a href="#" className="text-slate-500 hover:text-white font-black uppercase tracking-[0.3em] text-xs transition-colors underline decoration-primary/30 underline-offset-8">
                Or download the Starter Guide first
              </a>
            </div>
          </motion.div>
        </section>

      </main>

      <WaitlistModal 
        isOpen={isWaitlistOpen} 
        onClose={() => setIsWaitlistOpen(false)} 
        defaultFleet={selectedFleet}
      />
      
      {/* Editorial Footer */}
      <footer className="py-32 border-t border-white/5 bg-[#050b18] relative z-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-6 space-y-8 text-white">
              <div className="flex items-center gap-4">
                <span className="font-bold tracking-widest uppercase text-xl text-white">TITON ANALYTICS</span>
              </div>
              <p className="text-slate-300 text-lg font-normal leading-relaxed max-w-md">
                Phil Wilson, Managing Director. AI Business Friends. <br />
                Empowering HighLevel AI Automation Agency Owners with precision analytics.
              </p>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="text-[10px] font-bold tracking-widest uppercase text-white">EXPLORE</div>
              <div className="flex flex-col gap-4 text-sm font-normal text-slate-300">
                <a href="/" className="hover:text-primary transition-colors">The Manifesto</a>
                <a href="/pop" className="hover:text-primary transition-colors">POP System</a>
                <a href="/kmvault" className="hover:text-primary transition-colors">KM Vault</a>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="text-[10px] font-bold tracking-widest uppercase text-white">SYSTEM</div>
              <div className="flex flex-col gap-4 text-sm font-normal text-slate-300">
                <a href="#" className="hover:text-primary transition-colors">Security Gate</a>
                <a href="#" className="hover:text-primary transition-colors">Data Rights</a>
                <a href="#" className="hover:text-primary transition-colors">Encryption</a>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="text-[10px] font-bold tracking-widest uppercase text-white">LOCATION</div>
              <p className="text-sm font-normal text-slate-300 leading-loose">
                District 04, Neural Sector <br />
                Vox Nebula
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-10 border-t border-white/10 mt-20">
            <p className="text-[10px] font-mono tracking-widest uppercase text-slate-400">© 2026 TITON NEURAL NETWORK</p>
            <div className="flex gap-8 items-center">
              <div className="text-[10px] font-black tracking-[0.5em] text-primary uppercase">Active Status</div>
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(132,206,58,1)]" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StartHere;
