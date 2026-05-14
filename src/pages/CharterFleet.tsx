import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Clock, 
  FileText, 
  Layout, 
  Search, 
  ClipboardCheck,
  TrendingUp,
  Award,
  Layers,
  Activity,
  ChevronRight,
  Mail,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";

const CharterFleet = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Registration successful! Welcome to the Free Standard Group.");
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    },
    viewport: { once: true }
  };

  return (
    <div className="min-h-screen bg-background text-white font-body selection:bg-primary/20">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[#050b18] text-white">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-white font-bold text-xs uppercase tracking-widest mb-6 border border-white/10"
            >
              <Award className="w-4 h-4 text-primary" />
              TITON Charter Fleet
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter"
            >
              TITON Charter Fleet — <br className="hidden md:block"/>Visible Proof of Operational Improvement
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              The first Proof Tile Registry for AI Automation Agencies. Move beyond dashboards. <span className="text-primary font-bold">Signal → Action → Proof.</span>
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Button className="bg-primary hover:bg-primary/90 text-black px-8 py-7 rounded-xl text-lg font-black uppercase tracking-wider shadow-xl shadow-primary/20 transition-all hover:scale-105">
                Join the Free Standard Group
              </Button>
              <a href="#registry" className="text-white font-bold flex items-center gap-2 hover:gap-3 transition-all group">
                View Proof Tile Registry <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Problem Section */}
      <section className="py-24 bg-[#0a1122]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div {...fadeIn} className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Dashboards show activity. TITON shows proof.</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Today's agencies rely on noise. We provide the signal.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                {...fadeIn}
                className="bg-white/5 p-8 rounded-2xl border border-white/10 shadow-sm"
              >
                <h3 className="text-xl font-bold text-slate-500 mb-6 uppercase tracking-widest">Conventional Agencies</h3>
                <ul className="space-y-4">
                  {[
                    "Passive dashboards with lagging metrics",
                    "Activity-based reporting (tasks done)",
                    "Vague 'optimization' promises",
                    "Isolated data points without context"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-400">
                      <div className="mt-1 bg-white/5 p-1 rounded-full text-slate-500">
                        <Activity className="w-3 h-3" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div 
                {...fadeIn}
                className="bg-primary/10 p-8 rounded-2xl shadow-xl border border-primary/20"
              >
                <h3 className="text-xl font-bold text-primary mb-6 uppercase tracking-widest">TITON Enabled</h3>
                <ul className="space-y-4">
                  {[
                    "Signal → Action → Proof framework",
                    "Outcome-based evidence (value delivered)",
                    "Baseline vs. Outcome comparison",
                    "Anonymized evidence for benchmark-ready proof"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white">
                      <div className="mt-1 bg-primary p-1 rounded-full text-black">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The TITON Framework Section */}
      <section className="py-24 bg-background border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Signal → Action → Proof</h2>
            <p className="text-slate-400">The operational framework that turns interventions into evidence.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-white/5 -translate-y-12 z-0" />
            
            <motion.div {...fadeIn} transition={{delay: 0.1}} className="relative z-10 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-sm group hover:border-primary transition-all">
                <Zap className="w-8 h-8 text-white group-hover:text-primary transition-all" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Signal</h3>
              <p className="text-slate-400">The operational trigger or condition requiring attention.</p>
            </motion.div>

            <motion.div {...fadeIn} transition={{delay: 0.2}} className="relative z-10 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-sm group hover:border-primary transition-all">
                <Layers className="w-8 h-8 text-white group-hover:text-primary transition-all" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Action</h3>
              <p className="text-slate-400">The AI automation intervention deployed to address the signal.</p>
            </motion.div>

            <motion.div {...fadeIn} transition={{delay: 0.3}} className="relative z-10 text-center">
              <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-sm group hover:border-primary transition-all">
                <ShieldCheck className="w-8 h-8 text-white group-hover:text-primary transition-all" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Proof</h3>
              <p className="text-slate-400">The measurable outcome improvement captured as a Proof Tile.</p>
            </motion.div>
          </div>

          <motion.div 
            {...fadeIn}
            className="mt-16 p-6 bg-white/5 rounded-xl border border-white/10 text-center italic text-slate-400 max-w-2xl mx-auto"
          >
            "Lead response time → AI SMS automation → 68% faster response, 23% more meetings"
          </motion.div>
        </div>
      </section>

      {/* 4. Proof Tile Registry Section */}
      <section id="registry" className="py-24 bg-[#0a1122]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">What the Registry Captures</h2>
            <p className="text-slate-400 mb-2">Anonymized. Curated. Benchmark-ready.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: "Lead Response Automation", metric: "-84% response lag", icon: Clock },
              { title: "Client Onboarding Workflows", metric: "3.5x velocity increase", icon: Users },
              { title: "Sales Pipeline Velocity", metric: "+42% stage progression", icon: TrendingUp },
              { title: "Operational Cycle Time", metric: "-60min per event", icon: Activity },
              { title: "Service Delivery Consistency", metric: "99.2% SOP adherence", icon: ClipboardCheck },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-primary hover:shadow-md transition-all group"
              >
                <item.icon className="w-8 h-8 text-white mb-4 group-hover:text-primary transition-colors" />
                <h4 className="font-bold text-white mb-2 text-sm leading-tight">{item.title}</h4>
                <div className="text-xs font-black text-primary bg-primary/10 inline-block px-2 py-1 rounded">
                  {item.metric}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. What You Get (Charter Fleet Benefits) */}
      <section className="py-24 bg-background text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 -skew-x-12 translate-x-1/4 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="inline-block px-3 py-1 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded mb-4">
                For qualified GHL agencies
              </div>
              <h2 className="text-3xl md:text-5xl font-black mb-4">Join the TITON Charter Fleet</h2>
              <p className="text-slate-400">Scale your agency with the discipline of operational proof.</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-black px-8 py-6 rounded-xl font-bold transition-all hover:scale-105">
              Secure Your Slot
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Workflow Modeling & SOP Clarification", desc: "Standardize your operations with precision notation." },
              { title: "Operational Signal Design", desc: "Identify exactly when and where AI needs to intervene." },
              { title: "Proof Artifact Generation", desc: "Turn automation results into marketing and sales assets." },
              { title: "Structured Peer Learning", desc: "Learn from those solving the same operational bottlenecks." },
              { title: "Benchmarking Readiness", desc: "Compare against peer averages and Z-scores for performance." },
              { title: "Shared Industry Intelligence", desc: "Gain access to the collective intelligence of elite AAAs." },
            ].map((item, i) => (
              <motion.div 
                key={i}
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Speed of Enablement Section */}
      <section className="py-24 bg-[#0a1122]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeIn}>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Speed Wins. <br/><span className="text-primary">Structured Speed.</span></h2>
              <p className="text-slate-400 mb-8 text-lg">"Not rushed. Not chaotic. Structured."</p>
              
              <div className="space-y-6">
                {[
                  { title: "Practical Workflow Language", desc: "FIPS-inspired notation for unambiguous SOPs." },
                  { title: "SOP Enablers", desc: "Modeling shortcuts to map your business in hours, not weeks." },
                  { title: "Quick-Start Templates", desc: "Pre-built frameworks for immediate deployment." },
                  { title: "Proof Tile Examples", desc: "Blueprints for what winning proof looks like." },
                  { title: "Guided Best Practices", desc: "Step-by-step implementation from agency veterans." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 bg-white/5 p-2 rounded-lg text-primary">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              {...fadeIn}
              className="bg-background p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Activity className="w-32 h-32 text-primary" />
              </div>
              <div className="relative z-10">
                <div className="text-primary font-black text-xs uppercase tracking-[0.3em] mb-4">TITON ENABLEMENT ASSETS</div>
                <h3 className="text-2xl font-black text-white mb-8">Ready-to-Deploy Assets</h3>
                <div className="grid gap-4">
                  {[1,2,3,4,5].map(n => (
                    <div key={n} className="bg-white/5 h-4 rounded-full w-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.random() * 60 + 40}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: n * 0.1 }}
                        className="h-full bg-gradient-to-r from-primary to-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Layout className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase">Current Asset</div>
                      <div className="font-bold text-white">Notation V2.4</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-400">Enablement assets are updated weekly for the Charter Fleet classroom.</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. How It Works (Steps) */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeIn} className="mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Your Path to Operational Proof</h2>
            <p className="text-slate-400">Four steps to join the elite tier of AI Automation Agencies.</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Register", desc: "Join through the Free Standard Group portal.", icon: Mail },
              { step: "02", title: "Verify", desc: "Receive comped access to the top VIP Group.", icon: ShieldCheck },
              { step: "03", title: "Enter", desc: "Step into the TITON Charter Fleet classroom.", icon: LogIn },
              { step: "04", title: "Deploy", desc: "Begin fast-start enablement (notation, SOPs, Proof Tiles).", icon: Zap }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                {i < 3 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-slate-200 z-0 -translate-x-1/2" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/5 rounded-full border-2 border-white/10 flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:border-primary transition-all">
                    <span className="text-primary font-black">{item.step}</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Documentation Standards (Preview) */}
      <section className="py-24 bg-[#0a1122] border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-black text-white mb-6">Documentation Standards</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                We believe in structured data. The Proof Tile Registry isn't a gallery of screenshots; it's a searchable database of operational improvements.
              </p>
              
              <div className="space-y-4">
                {[
                  "Workflow name & context",
                  "Baseline condition",
                  "Signal → Action → Proof",
                  "Measured outcome",
                  "Anonymity & approval status"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-white font-medium">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 p-4 bg-white/5 border-l-4 border-primary rounded-r-lg">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Standard v2.1</p>
                <p className="text-sm italic text-slate-400">"Structured for comparison, review, and benchmarking readiness"</p>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="bg-white/5 p-1 rounded-2xl shadow-2xl overflow-hidden border border-white/10">
                <div className="bg-[#0a2337] px-6 py-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="text-[10px] text-white/50 font-mono tracking-widest uppercase">Proof-Tile-Schema.json</div>
                </div>
                <div className="p-8 font-mono text-sm">
                  <pre className="text-blue-300">
                    {`{
  "context": "Real Estate Lead Nurture",
  "baseline": {
    "response_time": "14.2 hours",
    "conversion_rate": "2.1%"
  },
  "signal": "New Lead Webhook",
  "action": "TITON AI-SMS-Bridge",
  "proof": {
    "delta_time": "-94%",
    "delta_conversion": "+18%"
  },
  "status": "Verified"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Call to Action Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto bg-[#0a1122] rounded-[40px] p-8 md:p-20 text-center relative overflow-hidden shadow-2xl border border-white/5">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">The fastest path into proof-driven operations</h2>
              <p className="text-slate-300 text-lg mb-12 max-w-2xl mx-auto">
                Qualified GHL agencies receive comped VIP access and immediate entry to the Charter Fleet classroom.
              </p>
              
              <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3" onSubmit={handleRegister}>
                <Input 
                  required
                  type="email"
                  placeholder="Enter your agency email" 
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-14 rounded-xl focus:ring-primary focus:border-primary"
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-black h-14 px-8 rounded-xl font-bold whitespace-nowrap transition-all hover:scale-105">
                  Register Now
                </Button>
              </form>
              
              <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 text-white/40 text-sm font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  No cost for enablement
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  AIBF covers training
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="py-16 bg-background border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="TITON" className="w-10 h-10 object-contain" />
                <div className="flex flex-col leading-none">
                  <span className="font-black text-xl tracking-tighter text-white uppercase">TITON</span>
                  <span className="text-[8px] font-black tracking-[0.5em] text-primary uppercase">Charter Fleet</span>
                </div>
              </div>
              <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
                Tactical Intelligence for Transformation, Optimization and Navigation. Building the future of AI automation through structured proof.
              </p>
              <div className="text-xs font-bold text-white uppercase tracking-widest">
                AI Business Friends (AIBF)
              </div>
            </div>
            
            <div>
              <h5 className="font-bold text-white uppercase tracking-widest text-xs mb-6">Resources</h5>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">Press Release</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">Tech Spec</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">Documentation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">Registry API</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold text-white uppercase tracking-widest text-xs mb-6">Legal</h5>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary text-sm transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-500 text-xs font-medium">
              &copy; {new Date().getFullYear()} AI Business Friends. March 24, 2026.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Activity className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Search className="w-5 h-5" /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><TrendingUp className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CharterFleet;
