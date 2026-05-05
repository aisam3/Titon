import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { LighthouseScene } from "@/components/Three/LighthouseScene";
import { WaitlistModal } from "@/components/Pop/WaitlistModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion, useScroll, useSpring } from "framer-motion";
import { ChevronRight, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Zap, Target, Layers } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState("Charter");

  const handleOpenWaitlist = (fleet: string = "Charter") => {
    navigate("/r6-audit");
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

    // Standard Scroll Entry Animations from Index.tsx
    const sections = ['#hero', '#different', '#purple-cow', '#why-now', '#membership', '#join-early', '#starter-guide', '#final-cta'];
    
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
    <div id="about-container" className="relative bg-[#050b18] text-white min-h-screen selection:bg-primary/30 selection:text-white overflow-hidden">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[200] origin-left"
        style={{ scaleX }}
      />

      <Navbar />

      {/* Persistent 3D Lighthouse Scene */}
      <LighthouseScene />

      <main className="relative z-10 pt-20">
        
        {/* 1. HERO */}
        <section id="hero" className="min-h-screen flex items-center justify-center py-20 px-6">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                <ShieldCheck className="w-3 h-3" /> System Authority
              </div>
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-8 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                Proof Builds <br />
                <span className="text-primary text-gradient-primary">Authority</span>
              </h1>
              <p className="text-xl md:text-3xl font-bold text-slate-100 max-w-5xl mx-auto leading-tight uppercase tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                A working collaborative for HighLevel agencies ready to move beyond dashboards into measurable, proof-driven operations.
              </p>
              <div className="space-y-6 text-slate-300 max-w-2xl mx-auto leading-relaxed text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                <p>
                  TITON helps agencies push the frontier of GHL analytics, workflow discipline, and benchmark-ready Standard Operating Procedure (SOP) measurement.
                </p>
                <p>
                  This is not a passive community. It is a structured collaborative for agencies that want to turn workflow activity into visible proof, stronger authority, and longer-term recurring value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. WHAT MAKES TITON DIFFERENT */}
        <section id="different" className="py-40 px-6 bg-slate-900/40 backdrop-blur-sm border-y border-white/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">What Makes TITON Different</h2>
              <p className="text-xl text-primary font-black uppercase tracking-[0.3em]">Our secret sauce combines:</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-16">
              <div className="space-y-8">
                <ul className="space-y-6">
                  {[
                    "cross-industry function mapping",
                    "workflow / SOP overlays",
                    "Signal → Action → Proof",
                    "Proof Tile™",
                    "Plus a growing knowledge system that turns workflow improvements into Shared Industry Intelligence (SII)"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-5 group">
                      <div className="mt-1 w-6 h-6 rounded-full border border-primary/30 flex items-center justify-center shrink-0 group-hover:bg-primary transition-all duration-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary group-hover:text-black" />
                      </div>
                      <span className="text-slate-300 font-bold uppercase tracking-widest text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-8 p-10 bg-black/60 border border-white/10 rounded-[32px] backdrop-blur-xl">
                <p className="text-xl font-black text-white uppercase tracking-tighter mb-6">Inside TITON, members collaborate on:</p>
                <ul className="space-y-6">
                  {[
                    "use cases",
                    "shared learning",
                    "workflow clarity",
                    "proof-driven operating habits",
                    "a benchmark-ready SOP library"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 group">
                      <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-2 transition-transform" />
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PURPLE COW */}
        <section id="purple-cow" className="py-40 px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="space-y-16">
              <div className="inline-block px-4 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent font-black tracking-widest text-[10px] uppercase">
                THE PURPLE COW
              </div>
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                Why TITON Stands Out <br />
                <span className="text-accent">(Purple Cow)</span>
              </h2>
              <div className="space-y-8 text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto uppercase tracking-tight">
                <p>
                  Most platforms stop at tools, dashboards, and isolated workflow activity.
                </p>
                <p className="font-black text-white text-3xl">
                  TITON is being built differently.
                </p>
                <p>
                  Our Purple Cow is a ground-up collaborative Profitable Offer Prototype (POP).
                </p>
              </div>
              <div className="pt-10 flex flex-col items-center">
                <div className="p-10 bg-primary/5 border border-primary/10 rounded-[40px] inline-block backdrop-blur-md">
                  <p className="text-2xl md:text-3xl font-black tracking-tighter text-primary uppercase">
                    individual proof <span className="mx-4 text-white opacity-20">→</span> collective analytics <span className="mx-4 text-white opacity-20">→</span> benchmark intelligence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. WHY THIS MATTERS NOW */}
        <section id="why-now" className="py-40 px-6 bg-slate-900/40 backdrop-blur-sm border-y border-white/5">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="relative">
                <div className="absolute -inset-10 bg-primary/10 blur-[100px] rounded-full" />
                <div className="relative bg-black/80 border border-white/10 p-16 rounded-[40px] space-y-10 backdrop-blur-2xl">
                  <div className="w-20 h-20 bg-primary/10 rounded-[24px] flex items-center justify-center">
                    <Zap className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-tight">
                    Why This <br /><span className="text-primary">Matters Now</span>
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    Most agencies can show dashboards, campaign metrics, and automation activity.
                    Far fewer can show:
                  </p>
                  <ul className="space-y-5">
                    {[
                      "proof that a workflow improved",
                      "clear operational signals",
                      "repeatable SOP discipline",
                      "visible business outcomes"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-4 text-white font-black uppercase tracking-widest text-xs">
                        <div className="w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-10">
                <p className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1] uppercase">
                  "The agencies that stand out next will be those that can prove improvement consistently."
                </p>
                <div className="h-1 w-32 bg-primary" />
                <p className="text-xl text-slate-400 font-medium leading-relaxed uppercase tracking-wide">
                  As the market matures, dashboards are no longer enough. Clients demand proof of operational excellence. TITON provides the framework to capture and scale that proof.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. MEMBERSHIP PATH */}
        <section id="membership" className="py-40 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6">Membership Path</h2>
              <div className="h-1.5 w-32 bg-primary mx-auto mb-10" />
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                { name: "TITON Charter Fleet", count: "50 agencies", color: "border-accent/40", bg: "bg-accent/5", icon: Sparkles, iconColor: "text-accent" },
                { name: "TITON Partner Fleet", count: "100 agencies", color: "border-primary/40", bg: "bg-primary/5", icon: Target, iconColor: "text-primary" },
                { name: "TITON Extended Waitlist", count: "500 agencies", color: "border-blue-500/40", bg: "bg-blue-500/5", icon: Layers, iconColor: "text-blue-500" }
              ].map((tier, i) => (
                <div key={i} className={`p-12 border ${tier.color} ${tier.bg} rounded-[40px] flex flex-col items-center text-center group hover:scale-[1.05] transition-all duration-700 backdrop-blur-md`}>
                  <tier.icon className={`w-16 h-16 mb-8 ${tier.iconColor} group-hover:scale-110 transition-transform duration-500`} />
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-3">{tier.name}</h3>
                  <p className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-10 opacity-70">{tier.count}</p>
                  <button 
                    onClick={() => navigate("/r6-audit")}
                    className="mt-auto px-10 py-4 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500"
                  >
                    Select Path
                  </button>
                </div>
              ))}
            </div>
            <p className="text-center mt-16 text-slate-500 font-black uppercase tracking-[0.6em] text-[10px]">
              Entry is limited by design.
            </p>
          </div>
        </section>

        {/* 6. WHY JOIN EARLY */}
        <section id="join-early" className="py-40 px-6 bg-slate-900/40 backdrop-blur-sm border-y border-white/5">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-10">Why Join Early</h2>
                <p className="text-2xl text-primary font-black uppercase tracking-[0.4em] mb-16">Speed of enablement wins.</p>
                
                <ul className="space-y-8">
                  {[
                    "SOP enablers",
                    "Proof Tile™ examples",
                    "workflow modeling support",
                    "collaborative learning assets",
                    "stronger operating structure"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-6 text-xl font-black uppercase tracking-widest group">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary transition-all duration-500">
                        <CheckCircle2 className="w-5 h-5 text-primary group-hover:text-black" />
                      </div>
                      <span className="group-hover:text-primary transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative w-80 h-80">
                  <div className="absolute inset-0 border-[3px] border-primary/20 rounded-full animate-[spin_30s_linear_infinite]" />
                  <div className="absolute inset-6 border-[3px] border-accent/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
                  <div className="absolute inset-12 border-[1px] border-white/5 rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="block text-6xl font-black text-white leading-none">EARLY</span>
                      <span className="block text-sm font-black text-primary tracking-[0.8em] uppercase mt-2">Access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. STARTER GUIDE */}
        <section id="starter-guide" className="py-40 px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-gradient-to-br from-slate-900 to-black border border-white/10 p-20 rounded-[64px] text-center relative overflow-hidden shadow-[0_0_100px_-20px_rgba(132,206,58,0.1)]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] -translate-y-1/2 translate-x-1/2" />
              
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-10">Starter Guide</h2>
              <p className="text-2xl text-slate-300 mb-16 max-w-3xl mx-auto uppercase tracking-tight font-bold">
                Start with one workflow: define the signal, identify the action, and describe the proof.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-16">
                {["DEFINE SIGNAL", "IDENTIFY ACTION", "DESCRIBE PROOF"].map((step, i) => (
                  <div key={i} className="p-6 border border-white/5 rounded-2xl bg-black/40 text-xs font-black uppercase tracking-[0.3em] text-slate-500 hover:text-primary hover:border-primary/30 transition-all duration-500">
                    Step 0{i+1}: {step}
                  </div>
                ))}
              </div>

              <button className="px-14 py-7 bg-accent text-white font-black uppercase tracking-[0.4em] text-xs hover:bg-white hover:text-black transition-all duration-700 rounded-2xl shadow-[0_0_50px_-10px_rgba(249,115,22,0.4)]">
                Download the TITON Starter Guide
              </button>
            </div>
          </div>
        </section>

        {/* 8. FINAL CTA */}
        <section id="final-cta" className="py-40 px-6 relative">
          <div className="container mx-auto text-center space-y-16">
            <div className="space-y-6">
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-tight mb-4">
                READY TO SECURE <br />
                <span className="text-primary text-gradient-primary">YOUR POSITION?</span>
              </h2>
              <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-sm mb-16 opacity-60">Select your fleet entry point</p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-8">
              <button 
                onClick={() => navigate("/r6-audit")}
                className="group relative px-12 py-7 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-primary transition-all duration-700 rounded shadow-xl"
              >
                Join the TITON Charter Fleet Waitlist
                <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-accent group-hover:w-full transition-all duration-700" />
              </button>
              <button 
                onClick={() => navigate("/r6-audit")}
                className="group relative px-12 py-7 bg-primary text-black font-black uppercase tracking-widest text-xs hover:bg-white transition-all duration-700 rounded shadow-[0_0_40px_-10px_rgba(132,206,58,0.5)]"
              >
                Join the TITON Partner Fleet Waitlist
                <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-accent group-hover:w-full transition-all duration-700" />
              </button>
              <button 
                onClick={() => navigate("/r6-audit")}
                className="group relative px-12 py-7 bg-transparent border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:border-primary hover:text-primary transition-all duration-700 rounded"
              >
                Join the TITON Extended Waitlist
              </button>
            </div>
          </div>
        </section>

      </main>

      <WaitlistModal 
        isOpen={isWaitlistOpen} 
        onClose={() => setIsWaitlistOpen(false)} 
        defaultFleet={selectedFleet}
      />
      
      {/* Editorial Footer */}
      <footer className="py-20 border-t border-white/10 bg-[#050b18] relative z-20">
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
                <a href="/pop" className="hover:text-primary transition-colors">System Schema</a>
                <a href="/kmvault" className="hover:text-primary transition-colors">Engine Logs</a>
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

export default About;
