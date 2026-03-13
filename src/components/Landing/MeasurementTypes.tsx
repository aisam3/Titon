import React, { useRef } from "react";
import { motion } from "framer-motion";

const measurementTypes = [
  {
    title: "NOMINAL",
    category: "Classification",
    description: "Identifies name/label only—like a horse's number. It tells us which horse is which but nothing about the finish.",
    tag: "BASE.01",
  },
  {
    title: "ORDINAL",
    category: "Ranking",
    description: "Indicates rank order only. 1st is ahead of 2nd, but we don't know how far ahead the horse finished.",
    tag: "RANK.02",
  },
  {
    title: "INTERVAL",
    category: "Comparison",
    description: "Indicates distance between finishers. Measuring 'lengths' adds important context not conveyed by order alone.",
    tag: "PREC.03",
  },
  {
    title: "RATIO",
    category: "Absolute",
    description: "The highest utility. Ratio-based scalar measurement that preserves comparability across changing conditions.",
    tag: "APEX.04",
  },
];

export const MeasurementTypes = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="measurement" ref={containerRef} className="py-32 relative bg-white">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-24 gap-12">
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
               <div className="w-8 h-[2px] bg-primary" />
               <span className="text-primary font-bold tracking-widest text-[10px] uppercase">ENGINEERING STACK</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight uppercase text-slate-900">
              STRUCTURAL <br />
              <span className="text-primary">HIERARCHY.</span>
            </h2>
          </div>
        </div>

        <div className="measurement-grid grid grid-cols-1 md:grid-cols-2 gap-8">
          {measurementTypes.map((type, index) => (
            <motion.div 
              key={index} 
              whileHover={{ rotateX: -5, rotateY: 5, translateZ: 30 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="group p-12 bg-white rounded-sm border-2 border-slate-100 hover:border-primary/50 transition-all duration-700 shadow-[0_10px_30px_rgba(0,0,0,0.05)]" 
            >
              <div className="space-y-6" style={{ transform: 'translateZ(50px)' }}>
                <div className="inline-block px-4 py-1 bg-primary text-white font-black text-[9px] tracking-[0.4em] uppercase shadow-[0_10px_20px_rgba(0,163,255,0.2)]">
                   {type.tag || type.category}
                </div>
                <h3 className="text-4xl font-black tracking-tighter text-slate-900 uppercase group-hover:text-primary transition-colors">
                   {type.title}
                </h3>
                <p className="text-slate-900 text-sm font-bold leading-relaxed max-w-sm uppercase tracking-wider">
                  {type.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
