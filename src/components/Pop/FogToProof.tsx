import React from "react";

export const FogToProof = () => {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-16 max-w-3xl">
        <div className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">Phase 01: The Reality Check</div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic mb-8">From Fog to Proof</h2>
        <p className="text-xl text-slate-400 font-medium leading-relaxed">
          Most agencies are working on the wrong things. They invest time in projects that feel important—but don't produce measurable results. At the same time, there are opportunities that create fast, provable impact. TITON helps you identify the difference—and focus on the work that actually moves your business forward.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative p-8 md:p-12 border border-white/10 rounded-3xl bg-white/[0.02]">
        {/* Quadrant Axis Lines */}
        <div className="hidden md:block absolute top-1/2 left-8 right-8 h-px bg-white/10" />
        <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px bg-white/10" />
        
        {/* Top-Left */}
        <div className="p-8 rounded-2xl bg-white/5 border border-primary/30 hover:bg-primary/5 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Quick BreakPoints™</h3>
            <span className="px-2 py-1 bg-primary/20 text-primary text-[8px] font-bold uppercase tracking-widest rounded">High Impact, Low Complexity</span>
          </div>
          <p className="text-slate-400 font-medium group-hover:text-primary/80 transition-colors">Start here - Fast Proof Tiles™</p>
        </div>

        {/* Top-Right */}
        <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Nice-to-Haves</h3>
            <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[8px] font-bold uppercase tracking-widest rounded">Low Impact, Low Complexity</span>
          </div>
          <p className="text-slate-400 font-medium">Don't brag - Do if easy</p>
        </div>

        {/* Bottom-Left */}
        <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Transformation Bets</h3>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[8px] font-bold uppercase tracking-widest rounded">High Impact, High Complexity</span>
          </div>
          <p className="text-slate-400 font-medium">Needs SOP agreement - Governance + cadence</p>
        </div>

        {/* Bottom-Right */}
        <div className="p-8 rounded-2xl bg-white/5 border border-red-500/30 hover:bg-red-500/5 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Fog Projects</h3>
            <span className="px-2 py-1 bg-red-500/20 text-red-500 text-[8px] font-bold uppercase tracking-widest rounded">Low Impact, High Complexity</span>
          </div>
          <p className="text-slate-400 font-medium">Credibility risk - Avoid / stop early</p>
        </div>
      </div>

      <div className="mt-12 p-6 border-l-4 border-primary bg-primary/5 rounded-r-xl">
        <p className="text-lg text-slate-300 font-medium">
          Start with <span className="text-white font-bold">Quick BreakPoints™</span>. These are the fastest path to measurable results—and your first Proof Tile. Take the TITON R6 Assessment to find your fastest path.
        </p>
      </div>
    </div>
  );
};
