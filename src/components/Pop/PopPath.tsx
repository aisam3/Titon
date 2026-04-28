import React from "react";
import { Globe2, TrendingUp, GitBranch } from "lucide-react";

export const PopPath = () => {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="grid lg:grid-cols-2 gap-16 mb-24">
        {/* Section 9: Why This Is Bigger Than One Agency */}
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase italic mb-6">
            Bigger Than One Agency
          </h2>
          <p className="text-lg text-slate-400 font-medium leading-relaxed mb-8">
            Contributions create a flywheel effect that benefits everyone in the network.
          </p>
          <div className="flex gap-4">
            <div className="flex-1 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Globe2 className="w-8 h-8 text-primary mx-auto mb-4" />
              <div className="font-bold text-white">Shared Analytics</div>
            </div>
            <div className="flex-1 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
              <GitBranch className="w-8 h-8 text-primary mx-auto mb-4" />
              <div className="font-bold text-white">SOP Patterns</div>
            </div>
          </div>
        </div>

        {/* Section 10: The Long-Term Reveal */}
        <div className="relative p-10 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/30">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase italic mb-6">
            The Long-Term Reveal
          </h2>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-white/5">
              <span className="text-slate-300 font-bold uppercase tracking-widest text-xs">Over time</span>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="pl-4 border-l-2 border-primary space-y-4">
              <div className="text-xl text-white font-black uppercase tracking-tighter">Peer Average</div>
              <div className="text-xl text-white font-black uppercase tracking-tighter">Best-in-Class</div>
              <div className="text-xl text-[#84ce3a] font-black uppercase tracking-tighter">Stronger Positioning</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 11: The TITON POP Path */}
      <div className="relative">
        <div className="text-center mb-16">
          <div className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">The Methodology</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">The TITON POP Path</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Select Workflow" },
            { step: "02", title: "Clarify Reality" },
            { step: "03", title: "Improve" },
            { step: "04", title: "Produce Signal → Action → Proof", colSpan: true },
            { step: "05", title: "Create Proof Tile™" },
            { step: "06", title: "Contribute" },
            { step: "07", title: "Repeat", highlight: true }
          ].map((item, i) => (
            <div 
              key={i} 
              className={`p-6 rounded-2xl border ${
                item.highlight 
                  ? 'bg-primary/10 border-primary/50 ring-1 ring-primary/20' 
                  : 'bg-white/5 border-white/10 hover:border-white/30'
              } transition-colors flex flex-col justify-between ${item.colSpan ? 'md:col-span-2 lg:col-span-2' : ''}`}
            >
              <div className={`text-4xl font-black ${item.highlight ? 'text-primary' : 'text-slate-700'} mb-4`}>
                {item.step}
              </div>
              <div className={`text-xl font-bold uppercase tracking-tight ${item.highlight ? 'text-[#84ce3a]' : 'text-white'}`}>
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
