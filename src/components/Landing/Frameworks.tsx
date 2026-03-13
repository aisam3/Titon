import React, { useRef } from "react";

const frameworks = [
  { title: "PROBABILISTIC", category: "Bayesian Models", description: "Update strategic beliefs in real-time as new data points emerge from the horizon." },
  { title: "PREDICTIVE", category: "Decision Trees", description: "Map complex branching outcomes to anticipate market shifts before they manifest." },
  { title: "STATISTICAL", category: "Regression", description: "Isolate the core variables that truly define your historical performance trajectory." },
  { title: "ALGORITHMIC", category: "Cluster Analysis", description: "Discover hidden segments within your data ocean using unsupervised learning." },
  { title: "EXPERIMENTAL", category: "A/B Mastery", description: "Validate every hypothesis with rigorous testing frameworks built into the core." },
  { title: "FORECASTING", category: "Time Series", description: "Project future trends by analyzing the mathematical rhythms of the past." },
];

export const Frameworks = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="framework" ref={containerRef} className="py-60 relative w-full">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-40 gap-12 border-b border-slate-200 pb-20">
          <div className="max-w-4xl space-y-10">
            <div className="flex items-center gap-6">
              <div className="w-12 h-[2px] bg-primary" />
              <span className="text-primary font-black tracking-[0.5em] text-[10px] uppercase">ANALYTIC CORE ENGINE</span>
            </div>
            <h2 className="text-8xl md:text-[10rem] font-black tracking-tighter italic leading-[0.8] uppercase text-slate-900">
              ADVANCED <br />
              <span className="text-gradient-primary">ALGORITHMS.</span>
            </h2>
            <p className="text-2xl text-slate-600 font-light leading-relaxed max-w-2xl tracking-tight italic">
              The TITON engine processes complexity through the lens of modern statistical theory, reaching depths of insight beyond standard capability.
            </p>
          </div>
          <button className="group relative px-12 py-6 border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-slate-900 hover:text-white transition-all overflow-hidden">
            <span className="relative z-10">System Schema</span>
            <div className="absolute inset-0 bg-slate-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-slate-200 border border-slate-200">
          {frameworks.map((fw, i) => (
            <div key={i} className="framework-card group p-20 bg-white hover:bg-slate-50 transition-all duration-700 relative overflow-hidden">
              {/* Dynamic corner accent */}
              <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-slate-100 group-hover:border-primary group-hover:w-full group-hover:h-full transition-all duration-700 pointer-events-none" />

              <div className="space-y-10">
                <span className="text-[10px] text-primary font-black uppercase tracking-[0.4em] block">{fw.category}</span>
                <h3 className="text-4xl font-black tracking-tighter italic uppercase text-slate-900 group-hover:translate-x-4 transition-transform duration-500">
                  {fw.title}
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed font-light italic tracking-tight">
                  {fw.description}
                </p>
                <div className="pt-6">
                  <div className="w-12 h-px bg-slate-200 group-hover:w-full group-hover:bg-primary transition-all duration-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
