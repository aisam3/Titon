import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { LighthouseScene } from "@/components/Three/LighthouseScene";
import { WaitlistModal } from "@/components/Pop/WaitlistModal";
import gsap from "gsap";
import Lenis from "lenis";
import { motion, useScroll, useSpring, Variants } from "framer-motion";
import { 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Target, 
  Layers, 
  Settings, 
  Database, 
  BarChart3, 
  Repeat, 
  Box, 
  Activity,
  Workflow
} from "lucide-react";

const HowItWorks = () => {
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

    return () => {
      lenis.destroy();
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
    <div id="how-it-works-container" className="relative bg-[#050b18] text-white min-h-screen selection:bg-primary/30 selection:text-white overflow-hidden font-['Inter',_sans-serif]">
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
                <Settings className="w-3 h-3" /> System Mechanics
              </div>
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none mb-8 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                How TITON <span className="text-primary text-gradient-primary">Works</span>
              </h1>
              <p className="text-xl md:text-3xl font-bold text-slate-100 max-w-5xl mx-auto leading-tight uppercase tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                From workflow activity → visible proof → collective intelligence
              </p>
              <div className="space-y-6 text-slate-300 max-w-2xl mx-auto leading-relaxed text-lg drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
                <p>
                  TITON is not a dashboard. It is a system that helps you prove improvement, learn from peers, and build authority through disciplined operations.
                </p>
              </div>
              <div className="pt-10">
                <ChevronRight className="w-10 h-10 text-primary mx-auto animate-bounce" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2. THE CORE FRAMEWORK: SIGNAL → ACTION → PROOF */}
        <section id="framework" className="py-40 px-6 bg-slate-900/40 backdrop-blur-sm border-y border-white/5">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="container mx-auto max-w-6xl"
          >
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">Signal → Action → Proof</h2>
              <p className="text-xl text-slate-400 font-medium uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
                Every workflow inside TITON follows this three-part structure:
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector Lines (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2 z-0" />
              
              {[
                { 
                  title: "Signal", 
                  desc: "What triggers the workflow?", 
                  example: "Example: New lead form submission",
                  icon: Activity,
                  color: "border-blue-500/30 bg-blue-500/5"
                },
                { 
                  title: "Action", 
                  desc: "What does the workflow do?", 
                  example: "Example: Send SMS, create task, update CRM",
                  icon: Zap,
                  color: "border-primary/30 bg-primary/5"
                },
                { 
                  title: "Proof", 
                  desc: "How do you measure improvement?", 
                  example: "Example: 40% faster response time",
                  icon: ShieldCheck,
                  color: "border-accent/30 bg-accent/5"
                }
              ].map((item, i) => (
                <div key={i} className={`relative z-10 p-10 border ${item.color} rounded-[40px] backdrop-blur-xl group hover:scale-105 transition-all duration-700`}>
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-4">{item.title}</h3>
                  <p className="text-slate-300 font-bold mb-4">{item.desc}</p>
                  <p className="text-sm text-slate-500 italic leading-relaxed">{item.example}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-20">
              <p className="text-2xl text-primary font-black uppercase tracking-widest">
                This turns "activity" into "evidence."
              </p>
            </div>
          </motion.div>
        </section>

        {/* 3. PROOF TILES™ */}
        <section id="proof-tiles" className="py-40 px-6">
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
                  Proof <br />
                  <span className="text-primary">Tiles™</span>
                </h2>
                <p className="text-xl text-slate-300 font-bold uppercase tracking-tight">
                  A Proof Tile is a documented, benchmark-ready workflow that includes:
                </p>
                <ul className="space-y-6">
                  {[
                    "Clear signal definition",
                    "Mapped actions (with SOP overlay)",
                    "Measurable proof of improvement",
                    "Industry context (for benchmarking)"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-5 group">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary transition-all duration-500">
                        <CheckCircle2 className="w-4 h-4 text-primary group-hover:text-black" />
                      </div>
                      <span className="text-lg font-bold uppercase tracking-tight text-slate-400 group-hover:text-white transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-lg text-slate-400 leading-relaxed italic border-l-2 border-primary pl-6">
                  "Proof Tiles can be shared, compared, and improved collaboratively."
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full" />
                <div className="relative p-1 bg-gradient-to-br from-primary/40 via-white/5 to-accent/40 rounded-[42px]">
                  <div className="bg-[#0a1122] rounded-[40px] p-12 space-y-8">
                    <div className="flex justify-between items-center border-b border-white/5 pb-6">
                      <span className="text-[10px] font-black tracking-widest text-primary uppercase">Proof Tile #842</span>
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 w-3/4 bg-white/5 rounded" />
                      <div className="h-4 w-1/2 bg-white/5 rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="aspect-video bg-white/5 rounded-2xl" />
                      <div className="aspect-video bg-white/5 rounded-2xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4. LIGHTHOUSE / ENS / FLYWHEEL */}
        <section id="engine" className="py-40 px-6 bg-slate-900/40 backdrop-blur-sm border-y border-white/5">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="container mx-auto max-w-6xl"
          >
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6">The TITON Engine</h2>
              <p className="text-2xl text-primary font-black uppercase tracking-[0.4em]">Lighthouse · ENS · Flywheel</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-12">
              {[
                { 
                  title: "Lighthouse", 
                  desc: "The visibility layer — shows what's working across the collaborative in real time.",
                  icon: Activity
                },
                { 
                  title: "ENS (Notification System)", 
                  desc: "The signal layer — routes workflow triggers, alerts, and intelligence to the right place.",
                  icon: Workflow
                },
                { 
                  title: "Flywheel", 
                  desc: "The momentum layer — individual proof feeds collective analytics, which feeds benchmark intelligence.",
                  icon: Repeat
                }
              ].map((item, i) => (
                <div key={i} className="p-12 bg-black/60 border border-white/10 rounded-[64px] space-y-8 hover:border-primary/40 transition-all duration-700 group">
                  <div className="w-20 h-20 bg-primary/5 border border-primary/20 rounded-3xl flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                    <item.icon className="w-10 h-10 text-primary group-hover:text-black" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-white">{item.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 5. SHARED INDUSTRY INTELLIGENCE (SII) */}
        <section id="sii" className="py-40 px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="container mx-auto max-w-4xl"
          >
            <div className="bg-gradient-to-br from-slate-900 to-black border border-white/10 p-20 rounded-[64px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex flex-col items-center text-center space-y-10">
                <div className="w-24 h-24 bg-accent/10 border border-accent/20 rounded-[32px] flex items-center justify-center">
                  <Database className="w-12 h-12 text-accent" />
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Shared Industry Intelligence (SII)</h2>
                <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                  When members contribute Proof Tiles, the system aggregates anonymized data into benchmarks.
                </p>
                
                <ul className="grid md:grid-cols-1 gap-6 w-full text-left max-w-2xl">
                  {[
                    "Compare your workflow performance against peers",
                    "See what signals and actions drive the best outcomes",
                    "Improve faster with real evidence, not guesses"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-6 p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-accent/30 transition-all duration-500">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                      </div>
                      <span className="text-lg font-bold uppercase tracking-tight text-white">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 6. THE FLYWHEEL IN ACTION */}
        <section id="flywheel-action" className="py-40 px-6 bg-slate-900/40 backdrop-blur-sm border-y border-white/5">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="container mx-auto max-w-6xl text-center"
          >
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-20">How It All Connects</h2>
            
            <div className="flex flex-col lg:flex-row items-center justify-center gap-4 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] overflow-x-auto pb-4">
              {[
                "Individual Proof",
                "Collective Analytics",
                "Benchmark Intelligence",
                "Stronger Authority",
                "Better Workflows",
                "More Proof"
              ].map((step, i, arr) => (
                <React.Fragment key={i}>
                  <div className="px-8 py-4 bg-primary/10 border border-primary/20 rounded-full text-primary hover:bg-primary hover:text-black transition-all duration-500">
                    {step}
                  </div>
                  {i < arr.length - 1 && <ArrowRight className="w-6 h-6 text-white/20 hidden lg:block" />}
                  {i < arr.length - 1 && <ArrowRight className="w-6 h-6 text-white/20 rotate-90 lg:hidden my-2" />}
                </React.Fragment>
              ))}
            </div>
            
            <p className="mt-20 text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto italic">
              "This is the TITON flywheel. Every contribution makes the whole system smarter."
            </p>
          </motion.div>
        </section>

        {/* 7. WHAT YOU NEED TO START */}
        <section id="requirements" className="py-40 px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="container mx-auto max-w-4xl"
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">What You Need to Begin</h2>
            </div>
            
            <div className="grid gap-6">
              {[
                { title: "Active HighLevel Workflow", desc: "One workflow currently in use for a client or your agency." },
                { title: "Strategic Willingness", desc: "Willingness to define signal, action, and proof metrics." },
                { title: "Collaborative Access", desc: "Access to the TITON collaborative community (Skool)." }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-8 p-10 bg-black/40 border border-white/5 rounded-[40px] group hover:border-primary/30 transition-all duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary transition-all duration-500">
                    <CheckCircle2 className="w-8 h-8 text-primary group-hover:text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-center mt-16 text-xl text-slate-300 font-bold uppercase tracking-widest">
              That's it. The system handles the rest.
            </p>
          </motion.div>
        </section>

        {/* 8. FINAL CTA */}
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
                <span className="text-primary text-gradient-primary">SEE IT WORK?</span>
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
                Download the Starter Guide
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
          <div className="grid lg:grid-cols-12 gap-20 items-start">
            <div className="lg:col-span-6 space-y-10 text-white">
              <div className="flex items-center gap-4">
                <span className="font-black tracking-[0.2em] uppercase text-2xl text-white">TITON ANALYTICS</span>
              </div>
              <p className="text-slate-400 text-xl font-normal leading-relaxed max-w-md uppercase tracking-tight">
                Phil Wilson, Managing Director. AI Business Friends. <br />
                Empowering HighLevel AI Automation Agency Owners with precision analytics.
              </p>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="text-[10px] font-black tracking-[0.4em] uppercase text-white opacity-40">EXPLORE</div>
              <div className="flex flex-col gap-6 text-sm font-bold uppercase tracking-widest text-slate-400">
                <a href="/" className="hover:text-primary transition-colors">Manifesto</a>
                <a href="/pop" className="hover:text-primary transition-colors">POP System</a>
                <a href="/kmvault" className="hover:text-primary transition-colors">KM Vault</a>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="text-[10px] font-black tracking-[0.4em] uppercase text-white opacity-40">SYSTEM</div>
              <div className="flex flex-col gap-6 text-sm font-bold uppercase tracking-widest text-slate-400">
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Data Rights</a>
                <a href="#" className="hover:text-primary transition-colors">Terms</a>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="text-[10px] font-black tracking-[0.4em] uppercase text-white opacity-40">LOCATION</div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400 leading-loose">
                District 04, Neural Sector <br />
                Vox Nebula
              </p>
            </div>
          </div>
          <div className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-mono tracking-[0.5em] uppercase text-slate-500">© 2026 TITON NEURAL NETWORK</p>
            <div className="text-[10px] font-black tracking-[0.8em] text-primary uppercase animate-pulse">System Active</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;
