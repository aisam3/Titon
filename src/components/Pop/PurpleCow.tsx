import React from "react";
import { ArrowRight, Box, Repeat, Gauge, Search, CheckSquare } from "lucide-react";

export const PurpleCow = () => {
  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Section 6: Why TITON Stands Apart */}
      <div className="mb-24">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic mb-8">
          Why TITON Stands Apart <span className="text-primary text-2xl align-top block mt-2 not-italic">(The Purple Cow)</span>
        </h2>
        <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-4xl">
          TITON is a collaborative <strong className="text-white">Profitable Offer Prototype (POP)</strong>. It enables fast workflow mapping, SOP alignment, and proof → Shared Industry Intelligence. 
          <br /><br />
          It is designed so that individual proof <ArrowRight className="inline w-5 h-5 text-primary mx-2" /> collective analytics <ArrowRight className="inline w-5 h-5 text-primary mx-2" /> benchmark intelligence.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Section 7: Lean MVP Expectation */}
        <div className="p-8 rounded-3xl bg-primary/10 border border-primary/30 relative">
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#84ce3a] rounded-full flex items-center justify-center text-black font-black text-xl shadow-lg shadow-primary/20">
            MVP
          </div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 pl-6">Lean MVP Expectation</h3>
          <div className="flex flex-wrap gap-4 mb-8">
            {["One Workflow", "One Signal", "One Improvement", "One Proof"].map((badge, i) => (
              <span key={i} className="px-4 py-2 bg-white/10 text-white rounded-full text-sm font-bold tracking-widest uppercase border border-white/5">
                {badge}
              </span>
            ))}
          </div>
          <p className="text-xl text-primary font-black uppercase tracking-widest italic">
            Speed of enablement wins.
          </p>
        </div>

        {/* Section 8: What Your Tech Team Signs Up For */}
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
          <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 flex items-center gap-3">
            <Box className="w-8 h-8 text-slate-400" />
            What Your Tech Team Signs Up For
          </h3>
          <div className="space-y-6">
            {[
              { icon: Box, text: "Map workflows in GHL" },
              { icon: Search, text: "Capture before/after metrics" },
              { icon: CheckSquare, text: "Produce one Proof Tile™" },
              { icon: Repeat, text: "Iterate quickly" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                <div className="p-2 rounded-lg bg-slate-800">
                  <item.icon className="w-5 h-5 text-slate-300" />
                </div>
                <span className="text-white font-medium text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
