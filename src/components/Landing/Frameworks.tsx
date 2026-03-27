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
    <section id="framework" ref={containerRef} className="py-14 md:py-20 lg:py-20 relative w-full">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 md:mb-24 lg:mb-40 gap-10 md:gap-12 border-b border-white/10 pb-10 md:pb-16 lg:pb-20">

          <div className="max-w-4xl space-y-6 md:space-y-8 lg:space-y-10">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-8 md:w-12 h-[2px] bg-primary" />
              <span className="text-primary font-black tracking-[0.3em] md:tracking-[0.5em] text-[8px] md:text-[10px] uppercase">
                ANALYTIC CORE ENGINE
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter italic leading-[0.9] lg:leading-[0.8] uppercase text-white">
              ADVANCED <br />
              <span className="text-gradient-primary">ALGORITHMS.</span>
            </h2>

            <p className="text-base md:text-xl lg:text-2xl text-slate-300 font-light leading-relaxed max-w-2xl tracking-tight italic mt-10">
              The TITON engine processes complexity through the lens of modern statistical theory, reaching depths of insight beyond standard capability.
            </p>
          </div>

          <button className="group relative px-6 md:px-10 lg:px-12 py-3 md:py-5 lg:py-6 border border-white/10 text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] hover:bg-slate-900 hover:text-white transition-all overflow-hidden w-full sm:w-auto">
            <span className="relative z-10">System Schema</span>
            <div className="absolute inset-0 bg-slate-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-slate-800/40 border border-white/10">
          {frameworks.map((fw, i) => (
            <div
              key={i}
              className="framework-card group p-8 sm:p-12 md:p-16 lg:p-20 bg-slate-900/40 hover:bg-slate-900/40 transition-all duration-700 relative overflow-hidden"
            >
              {/* Dynamic corner accent */}
              <div className="absolute top-0 right-0 w-6 h-6 md:w-10 md:h-10 border-t border-r border-white/10 group-hover:border-primary group-hover:w-full group-hover:h-full transition-all duration-700 pointer-events-none" />

              <div className="space-y-6 md:space-y-8 lg:space-y-10">
                <span className="text-[8px] md:text-[10px] text-primary font-black uppercase tracking-[0.3em] md:tracking-[0.4em] block">
                  {fw.category}
                </span>

                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter italic uppercase text-white group-hover:translate-x-2 md:group-hover:translate-x-4 transition-transform duration-500">
                  {fw.title}
                </h3>

                <p className="text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed font-light italic tracking-tight">
                  {fw.description}
                </p>

                <div className="pt-4 md:pt-6">
                  <div className="w-10 md:w-12 h-px bg-slate-800/40 group-hover:w-full group-hover:bg-primary transition-all duration-700" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};