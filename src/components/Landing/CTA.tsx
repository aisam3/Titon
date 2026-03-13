import React, { useRef } from "react";

export const CTA = () => {
   const containerRef = useRef<HTMLDivElement>(null);

   return (
      <section id="contact" ref={containerRef} className="py-32 relative overflow-hidden w-full text-slate-900 bg-white">
         <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-start">
            <div className="cta-visual md:w-3/4 flex flex-col items-center md:items-start text-center md:text-left space-y-12">
               <div className="space-y-6">
                  <div className="inline-block px-4 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary font-bold tracking-widest text-[10px] uppercase mb-4 shadow-[0_0_20px_rgba(0,163,255,0.1)]">
                     READY TO START?
                  </div>
                  <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none text-slate-900">
                     JOIN THE TITON <br />
                     <span className="text-primary text-gradient-primary">PARTNER FLEET.</span>
                  </h2>
               </div>

               <p className="text-xl text-slate-600 font-light max-w-xl leading-relaxed uppercase tracking-[0.2em]">
                  "Discover the benefits of AI + ENS-aligned software development for the TITON Partner Fleet, built on anonymized data."
               </p>

               <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-6">
                  <button className="px-12 py-6 bg-primary text-white font-black rounded-sm border border-primary/50 hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-[0_20px_50px_rgba(0,163,255,0.2)] uppercase tracking-widest text-xs">
                     Join on Skool.com
                  </button>
                  <button className="px-12 py-6 bg-transparent border border-slate-200 text-slate-900 font-black rounded-sm hover:border-primary hover:text-primary transition-all duration-500 uppercase tracking-widest text-xs">
                     The Primer
                  </button>
               </div>
            </div>
         </div>

         {/* Editorial Footer */}
         <div className="container mx-auto px-6 mt-32 relative z-10">
            <div className="grid lg:grid-cols-12 gap-16 py-20 border-t border-slate-200 items-start">
               <div className="lg:col-span-6 space-y-8 text-slate-900">
                  <div className="flex items-center gap-4">
                     <span className="font-bold tracking-widest uppercase text-xl text-slate-900">TITON ANALYTICS</span>
                  </div>
                  <p className="text-slate-600 text-lg font-normal leading-relaxed max-w-md">
                     Phil Wilson, Managing Director. AI Business Friends. <br />
                     Empowering HighLevel AI Automation Agency Owners with precision analytics.
                  </p>
               </div>

               <div className="lg:col-span-2 space-y-6">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-slate-900">EXPLORE</div>
                  <div className="flex flex-col gap-4 text-sm font-normal text-slate-600 text-slate-500">
                     <a href="#" className="hover:text-primary transition-colors text-slate-600">The Manifesto</a>
                     <a href="#" className="hover:text-primary transition-colors text-slate-600">System Schema</a>
                     <a href="#" className="hover:text-primary transition-colors text-slate-600">Engine Logs</a>
                  </div>
               </div>

               <div className="lg:col-span-2 space-y-6">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-slate-900">SYSTEM</div>
                  <div className="flex flex-col gap-4 text-sm font-normal text-slate-600">
                     <a href="#" className="hover:text-primary transition-colors text-slate-600">Security Gate</a>
                     <a href="#" className="hover:text-primary transition-colors text-slate-600">Data Rights</a>
                     <a href="#" className="hover:text-primary transition-colors text-slate-600">Encryption</a>
                  </div>
               </div>

               <div className="lg:col-span-2 space-y-6">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-slate-900">LOCATION</div>
                  <p className="text-sm font-normal text-slate-600 leading-loose">
                     District 04, Neural Sector <br />
                     Vox Nebula
                  </p>
               </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 py-10 border-t border-slate-200">
               <p className="text-[10px] font-mono tracking-widest uppercase text-slate-400">© 2026 TITON NEURAL NETWORK</p>
               <div className="flex gap-8 items-center opacity-30">
                  <div className="w-4 h-4 border border-slate-900 rotate-45" />
                  <div className="w-8 h-[1px] bg-slate-900" />
                  <div className="w-4 h-4 bg-slate-900" />
               </div>
            </div>
         </div>
      </section>
   );
};