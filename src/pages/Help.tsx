import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { LighthouseScene } from "@/components/Three/LighthouseScene";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion, useScroll, useSpring } from "framer-motion";
import {
    Users,
    LifeBuoy,
    MessageSquare,
    ChevronRight,
    Download,
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    Zap,
    Mail,
    Clock,
    ExternalLink,
    Plus
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

gsap.registerPlugin(ScrollTrigger);

const Help = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        document.title = "Help & Community | TITON";

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

        const sections = ['#community', '#support', '#contact'];
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

    const [formState, setFormState] = useState({
        name: "",
        email: "",
        agencyName: "",
        membershipStatus: "",
        inquiryType: "",
        message: "",
        website: "",
        highLevelStatus: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation
        if (!formState.name || !formState.email || !formState.agencyName || !formState.message) {
            toast.error("Please fill in all required fields.");
            return;
        }

        // Simulate submission
        console.log("Form submitted:", formState);
        toast.success("Thank you. We'll respond within " + (formState.inquiryType === 'Member Support' ? '24 hours' : '2-3 business days') + ".");

        setFormState({
            name: "",
            email: "",
            agencyName: "",
            membershipStatus: "",
            inquiryType: "",
            message: "",
            website: "",
            highLevelStatus: ""
        });
    };

    return (
        <div id="help-container" className="relative bg-[#050b18] text-white min-h-screen selection:bg-primary/30 selection:text-white overflow-hidden font-['Inter',_sans-serif]">
            {/* Scroll Progress Indicator */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary z-[200] origin-left"
                style={{ scaleX }}
            />

            <Navbar />

            {/* Persistent 3D Lighthouse Scene */}
            <LighthouseScene />

            <main className="relative z-10 pt-32 pb-20">

                {/* HEADER */}
                <section className="container mx-auto px-6 mb-20 text-center">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">Help & <span className="text-primary">Community</span></h1>
                    <p className="text-xl text-slate-400 uppercase tracking-widest font-bold">Resources, Engagement, and Direct Routing</p>
                </section>

                {/* SECTION 1: COMMUNITY */}
                <section id="community" className="py-20 px-6 border-t border-white/5">
                    <div className="container mx-auto max-w-6xl">
                        <div className="mb-16">
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">Community</h2>
                            <p className="text-2xl text-primary font-black uppercase tracking-[0.3em] mb-8">Where collaboration happens</p>
                            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                                TITON is not a passive community. It is a structured working collaborative. Below is exactly where and how members engage.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12">
                            <div className="space-y-12">
                                {/* Charter Fleet */}
                                <div className="p-10 bg-slate-900/40 border border-white/10 rounded-[40px] backdrop-blur-xl">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <ShieldCheck className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-black uppercase tracking-tight">Charter Fleet</h3>
                                    </div>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">The core working group (limited to 50 agencies)</p>
                                    <p className="text-slate-300 mb-8 leading-relaxed">
                                        Monthly working group sessions, direct founder access, first access to new Proof Tile standards, priority benchmarking data.
                                    </p>
                                    <div className="flex items-center justify-between gap-6">
                                        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            [X] of 50 spots filled
                                        </div>
                                        <Button className="bg-primary text-black font-black uppercase tracking-widest text-[10px] rounded-full px-6 py-5 hover:bg-white transition-all shadow-[0_0_20px_rgba(132,206,58,0.3)]">
                                            Join Charter Fleet Waitlist
                                        </Button>
                                    </div>
                                </div>

                                {/* Skool Community */}
                                <div className="p-10 bg-slate-900/40 border border-white/10 rounded-[40px] backdrop-blur-xl">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                                            <Users className="w-6 h-6 text-accent" />
                                        </div>
                                        <h3 className="text-2xl font-black uppercase tracking-tight">Skool Community</h3>
                                    </div>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">Daily collaboration hub</p>
                                    <p className="text-slate-300 mb-8 leading-relaxed">
                                        Daily discussion, workflow reviews, shared learning, real-time HighLevel implementation help.
                                    </p>
                                    <Button variant="outline" className="border-white/20 text-white font-black uppercase tracking-widest text-[10px] rounded-full px-6 py-5 hover:bg-white hover:text-black transition-all">
                                        Request Skool Access
                                    </Button>
                                    <p className="text-[10px] text-slate-500 mt-4 uppercase tracking-widest italic">Note: only for waitlist members</p>
                                </div>
                            </div>

                            <div className="space-y-12">
                                {/* Working Groups */}
                                <div className="p-10 bg-black/60 border border-white/5 rounded-[40px] backdrop-blur-xl">
                                    <h3 className="text-2xl font-black uppercase tracking-tight mb-6">Working Groups — Focused cohorts</h3>
                                    <ul className="space-y-4 mb-8">
                                        {["SOP Modeling Group", "Proof Tile Registry Group", "Benchmarking Group", "Agency Offer Group"].map((group) => (
                                            <li key={group} className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                                <span className="text-slate-300 font-bold uppercase tracking-widest text-xs">{group}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-slate-400 text-sm leading-relaxed italic border-l-2 border-primary/30 pl-4">
                                        "Working groups meet bi-weekly and produce actual system outputs — not just discussion."
                                    </p>
                                </div>

                                {/* Community Rhythm */}
                                <div className="p-10 bg-black/60 border border-white/5 rounded-[40px] backdrop-blur-xl">
                                    <h3 className="text-2xl font-black uppercase tracking-tight mb-6">Community Rhythm</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        {[
                                            { label: "Daily", value: "Skool discussions" },
                                            { label: "Weekly", value: "Office hours" },
                                            { label: "Monthly", value: "Charter Fleet working group" },
                                            { label: "Quarterly", value: "Benchmark releases" }
                                        ].map((item) => (
                                            <div key={item.label} className="space-y-1">
                                                <div className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">{item.label}</div>
                                                <div className="text-sm text-slate-300 font-bold uppercase tracking-tight">{item.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: SUPPORT */}
                <section id="support" className="py-40 px-6 bg-slate-900/20 border-y border-white/5">
                    <div className="container mx-auto max-w-6xl">
                        <div className="mb-16">
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">Support</h2>
                            <p className="text-2xl text-primary font-black uppercase tracking-[0.3em] mb-8">Enablement + movement, not just answers</p>
                            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                                TITON is designed to be self-directed but never alone. This section helps you find what you need to keep moving forward.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-12 gap-16">
                            {/* Where to Start */}
                            <div className="lg:col-span-5 space-y-10">
                                <h3 className="text-3xl font-black uppercase tracking-tight border-b border-white/10 pb-4">Where to Start</h3>
                                <div className="space-y-8">
                                    {[
                                        { step: "Step 1", title: "Read the Start Here page", link: "/start-here", type: "link" },
                                        { step: "Step 2", title: "Download the Starter Guide", action: "Download PDF", type: "cta" },
                                        { step: "Step 3", title: "Join the waitlist for your tier", link: "/about#membership", type: "link" },
                                        { step: "Step 4", title: "Request Skool access (after joining)", type: "text" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-6 group">
                                            <div className="text-primary font-black text-xs uppercase tracking-widest pt-1">{item.step}</div>
                                            <div className="space-y-3">
                                                <p className="text-xl font-bold uppercase tracking-tight text-white">{item.title}</p>
                                                {item.type === "link" && (
                                                    <a href={item.link} className="inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest hover:translate-x-2 transition-transform">
                                                        Go to page <ArrowRight className="w-3 h-3" />
                                                    </a>
                                                )}
                                                {item.type === "cta" && (
                                                    <Button className="bg-accent text-white font-black uppercase tracking-widest text-[10px] rounded-full px-6 flex items-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                                                        <Download className="w-3.5 h-3.5" /> {item.action}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* How to Get Unstuck */}
                            <div className="lg:col-span-7 space-y-10">
                                <h3 className="text-3xl font-black uppercase tracking-tight border-b border-white/10 pb-4">How to Get Unstuck</h3>
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    {[
                                        {
                                            category: "Understanding Proof Tiles",
                                            items: [
                                                { text: "What is a Proof Tile?", link: "/how-titon-works" },
                                                { text: "How do I define a signal?", link: "/start-here" },
                                                { text: "Proof Tile template", link: "#", type: "download" }
                                            ]
                                        },
                                        {
                                            category: "Workflow + SOP Questions",
                                            items: [
                                                { text: "How do I map a workflow?", link: "/how-titon-works" },
                                                { text: "What is Signal Discipline?", link: "/start-here" }
                                            ]
                                        },
                                        {
                                            category: "Community & Collaboration",
                                            items: [
                                                { text: "How do I join a working group?", link: "#community" },
                                                { text: "How do I share a Proof Tile?", link: "https://skool.com" }
                                            ]
                                        },
                                        {
                                            category: "Membership & Access",
                                            items: [
                                                { text: "What's the difference between fleets?", link: "/about#membership" },
                                                { text: "How do I upgrade my tier?", link: "#contact" }
                                            ]
                                        }
                                    ].map((cat, i) => (
                                        <AccordionItem key={i} value={`item-${i}`} className="border border-white/5 rounded-2xl bg-black/20 overflow-hidden px-6">
                                            <AccordionTrigger className="text-lg font-black uppercase tracking-tight hover:no-underline hover:text-primary transition-colors py-6">
                                                {cat.category}
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-6">
                                                <ul className="space-y-4">
                                                    {cat.items.map((item, j) => (
                                                        <li key={j}>
                                                            <a href={item.link} className="flex items-center justify-between group">
                                                                <span className="text-slate-400 group-hover:text-white transition-colors">{item.text}</span>
                                                                {item.type === 'download' ? <Download className="w-4 h-4 text-slate-500 group-hover:text-accent" /> : <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-primary" />}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="mt-40">
                            <h3 className="text-3xl font-black uppercase tracking-tight mb-12 text-center">Quick Links <span className="text-slate-500 font-bold text-sm block tracking-[0.5em] mt-2">(Resource Library)</span></h3>
                            <div className="grid md:grid-cols-2 gap-x-20 gap-y-6 max-w-4xl mx-auto">
                                {[
                                    "TITON Operating Creed™", "Proof Tile Standard", "Signal Discipline & SOG Cadence", "SOP / Workflow Modeling Standard",
                                    "Data & Anonymization Policy", "Claims & Proof Integrity Standard", "Cluster & Benchmarking Rules", "Platform Architecture Overview"
                                ].map((link) => (
                                    <a key={link} href="#" className="flex items-center justify-between py-4 border-b border-white/5 group hover:border-primary/30 transition-all">
                                        <span className="text-slate-300 font-bold uppercase tracking-widest text-xs group-hover:text-white">{link}</span>
                                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Still Stuck? */}
                        <div className="mt-32 p-12 bg-primary/5 border border-primary/10 rounded-[48px] text-center max-w-3xl mx-auto backdrop-blur-md">
                            <h3 className="text-3xl font-black uppercase tracking-tight mb-4">Still Stuck?</h3>
                            <p className="text-slate-400 mb-10 font-medium">If you've gone through the resources above and still need help:</p>
                            <div className="flex flex-col md:flex-row gap-6 justify-center">
                                <a href="https://skool.com" className="flex-1 p-6 bg-black/40 border border-white/10 rounded-2xl hover:border-primary/50 transition-all group text-left">
                                    <div className="text-[10px] text-primary font-black uppercase tracking-widest mb-2">Option 1</div>
                                    <div className="text-xl font-black uppercase tracking-tight mb-2">Ask in Skool</div>
                                    <div className="text-xs text-slate-500 uppercase font-bold">(Fastest Response)</div>
                                </a>
                                <a href="#contact" className="flex-1 p-6 bg-black/40 border border-white/10 rounded-2xl hover:border-accent/50 transition-all group text-left">
                                    <div className="text-[10px] text-accent font-black uppercase tracking-widest mb-2">Option 2</div>
                                    <div className="text-xl font-black uppercase tracking-tight mb-2">Contact TITON</div>
                                    <div className="text-xs text-slate-500 uppercase font-bold">(Direct Support)</div>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 3: CONTACT */}
                <section id="contact" className="py-40 px-6">
                    <div className="container mx-auto max-w-6xl">
                        <div className="mb-16">
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">Contact</h2>
                            <p className="text-2xl text-primary font-black uppercase tracking-[0.3em] mb-8">Routing + communication</p>
                            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                                Select the option that matches who you are and what you need. This helps us respond faster.
                            </p>
                        </div>

                        {/* Contact Options Cards */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
                            {[
                                { title: "General Inquiry", for: "Questions about TITON, membership, or partnerships", response: "2-3 business days", cta: "Send General Inquiry" },
                                { title: "Partner Inquiry", for: "Strategic partnerships, integrations, agency alliances", response: "1-2 business days", cta: "Partner with Us" },
                                { title: "Member Support", for: "Current Charter Fleet or Partner Fleet members", response: "Within 24 hours", cta: "Member Support Request" },
                                { title: "Waitlist Question", for: "Those on Extended Waitlist", response: "3-5 business days", cta: "Waitlist Inquiry" }
                            ].map((card, i) => (
                                <Card key={i} className="bg-slate-900/40 border-white/5 hover:border-white/20 transition-all rounded-[32px] overflow-hidden flex flex-col">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xl font-black uppercase tracking-tight">{card.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col space-y-6">
                                        <div className="space-y-2">
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">For:</div>
                                            <p className="text-sm text-slate-300 font-medium leading-relaxed">{card.for}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Response:</div>
                                            <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-tight">
                                                <Clock className="w-3.5 h-3.5 text-primary" /> {card.response}
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => {
                                                document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                                                setFormState(prev => ({ ...prev, inquiryType: card.title.replace(' Inquiry', '') }));
                                            }}
                                            variant="ghost"
                                            className="mt-auto text-[10px] font-black uppercase tracking-widest p-0 h-auto hover:bg-transparent hover:text-primary flex items-center gap-2 group justify-start"
                                        >
                                            {card.cta} <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Contact Form */}
                        <div id="contact-form" className="grid lg:grid-cols-12 gap-20 items-start">
                            <div className="lg:col-span-7">
                                <form onSubmit={handleSubmit} className="p-10 md:p-16 bg-black/40 border border-white/10 rounded-[48px] space-y-8 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Full Name *</Label>
                                            <Input
                                                id="name"
                                                placeholder="Your Name"
                                                required
                                                value={formState.name}
                                                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                                className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all py-6 h-auto"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Email Address *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="your@email.com"
                                                required
                                                value={formState.email}
                                                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                                className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all py-6 h-auto"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label htmlFor="agency" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Agency Name *</Label>
                                            <Input
                                                id="agency"
                                                placeholder="Agency Name"
                                                required
                                                value={formState.agencyName}
                                                onChange={(e) => setFormState({ ...formState, agencyName: e.target.value })}
                                                className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all py-6 h-auto"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="status" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Membership Status</Label>
                                            <Select
                                                value={formState.membershipStatus}
                                                onValueChange={(v) => setFormState({ ...formState, membershipStatus: v })}
                                            >
                                                <SelectTrigger className="bg-white/5 border-white/10 rounded-xl py-6 h-auto text-left">
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                    <SelectItem value="Charter Fleet">Charter Fleet</SelectItem>
                                                    <SelectItem value="Partner Fleet">Partner Fleet</SelectItem>
                                                    <SelectItem value="Extended Waitlist">Extended Waitlist</SelectItem>
                                                    <SelectItem value="Not yet a member">Not yet a member</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inquiry Type</Label>
                                        <Select
                                            value={formState.inquiryType}
                                            onValueChange={(v) => setFormState({ ...formState, inquiryType: v })}
                                        >
                                            <SelectTrigger className="bg-white/5 border-white/10 rounded-xl py-6 h-auto text-left">
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                <SelectItem value="General">General Inquiry</SelectItem>
                                                <SelectItem value="Partner">Partner Inquiry</SelectItem>
                                                <SelectItem value="Member Support">Member Support</SelectItem>
                                                <SelectItem value="Waitlist">Waitlist Inquiry</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Message *</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="How can we help?"
                                            required
                                            rows={5}
                                            value={formState.message}
                                            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                            className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all p-4 min-h-[150px]"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <Label htmlFor="website" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Website (Optional)</Label>
                                            <Input
                                                id="website"
                                                placeholder="https://..."
                                                value={formState.website}
                                                onChange={(e) => setFormState({ ...formState, website: e.target.value })}
                                                className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all py-6 h-auto"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="ghl" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">HighLevel Status (Optional)</Label>
                                            <Input
                                                id="ghl"
                                                placeholder="Current Plan / Usage"
                                                value={formState.highLevelStatus}
                                                onChange={(e) => setFormState({ ...formState, highLevelStatus: e.target.value })}
                                                className="bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all py-6 h-auto"
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full bg-primary text-black font-black uppercase tracking-[0.3em] py-8 rounded-2xl hover:bg-white transition-all text-sm group shadow-[0_0_30px_rgba(132,206,58,0.4)]">
                                        Send Message <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                                    </Button>

                                    <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest italic">Member support inquiries will be prioritized.</p>
                                </form>
                            </div>

                            <div className="lg:col-span-5 space-y-16">
                                {/* Direct Contact */}
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black uppercase tracking-tight">Direct Contact</h3>
                                    <p className="text-slate-400 text-sm font-medium">For established partnership discussions only:</p>
                                    <div className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl group cursor-pointer hover:border-primary/30 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="text-lg font-black text-white group-hover:text-primary transition-colors">partners [at] titon [dot] com</span>
                                    </div>
                                </div>

                                {/* Response Commitment Table */}
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-black uppercase tracking-tight">Response Commitment</h3>
                                    <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/20">
                                        <Table>
                                            <TableHeader className="bg-white/5">
                                                <TableRow className="border-white/10 hover:bg-transparent">
                                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 px-6">Inquiry type</TableHead>
                                                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 px-6 text-right">Response time</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {[
                                                    { type: "Member support", time: "Within 24 hours" },
                                                    { type: "Partner inquiry", time: "1-2 business days" },
                                                    { type: "General inquiry", time: "2-3 business days" },
                                                    { type: "Waitlist question", time: "3-5 business days" }
                                                ].map((row) => (
                                                    <TableRow key={row.type} className="border-white/5 hover:bg-white/5 transition-colors">
                                                        <TableCell className="font-bold uppercase tracking-tight text-white py-6 px-6">{row.type}</TableCell>
                                                        <TableCell className="text-right text-primary font-black uppercase tracking-tighter py-6 px-6">{row.time}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest italic mt-4 text-center">We're a small team. Thank you for your patience.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* FOOTER - Reused from other pages */}
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

export default Help;
