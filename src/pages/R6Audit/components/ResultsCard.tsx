import React from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowRight, RotateCcw } from 'lucide-react';
import { AuditResults } from '../types';

interface ResultsCardProps {
  results: AuditResults;
  onDownloadPdf: () => void;
  onStartOver: () => void;
  onContinue: () => void;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({ 
  results, 
  onDownloadPdf, 
  onStartOver,
  onContinue
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto space-y-8"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
          Audit <span className="text-[#34D399]">Complete</span>
        </h2>
        <p className="text-slate-400 text-lg">
          We've analyzed your workflows and mapped your path to measurable results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Insights Card */}
        <div className="p-8 bg-[#0d1829] border border-white/10 rounded-2xl md:col-span-2">
          <h3 className="text-[#84ce3a] font-bold text-sm tracking-widest uppercase mb-6 border-b border-white/10 pb-4">
            Your Custom Action Plan
          </h3>
          
          <div className="space-y-6">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                Quick BreakPoints™ Opportunity
              </p>
              <p className="text-white text-lg font-medium">
                {results.quickBreakpointOpportunity || "Optimize standard workflows"}
              </p>
            </div>
            
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">
                Recommended First Proof Tile™
              </p>
              <p className="text-white text-lg font-medium">
                {results.recommendedFirstProofTile}
              </p>
            </div>
          </div>
        </div>

        {/* Fleet Recommendation */}
        <div className="p-8 bg-[#0d1829] border border-white/10 rounded-2xl flex flex-col justify-center items-center text-center">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">
            TITON Fleet Match
          </p>
          <div className="inline-flex px-6 py-2 bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] font-black text-2xl uppercase tracking-tight rounded-xl mb-4">
            {results.fleetRecommendation || "Extended"}
          </div>
          <p className="text-sm text-slate-400">
            Based on your readiness and commitment level.
          </p>
        </div>

        {/* Time to Proof */}
        <div className="p-8 bg-[#0d1829] border border-white/10 rounded-2xl flex flex-col justify-center items-center text-center">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">
            Estimated Time to Proof
          </p>
          <div className="text-white font-black text-4xl tracking-tighter mb-4">
            {results.estimatedTimeToProof}
          </div>
          <p className="text-sm text-slate-400">
            Until your first measurable result.
          </p>
        </div>
        
        {/* Quadrant Match (Simplified representation) */}
        <div className="p-8 bg-[#0a1122] border border-[#84ce3a]/30 rounded-2xl md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] text-[#84ce3a] font-bold uppercase tracking-widest mb-1">
              Quadrant Match
            </p>
            <h4 className="text-white font-bold text-2xl">
              {results.quadrantMatch}
            </h4>
            <p className="text-slate-400 text-sm mt-2 max-w-md">
              This mapping determines which TITON system module you should deploy first to maximize immediate impact.
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-white/5">
        <button
          onClick={onStartOver}
          className="w-full sm:w-auto px-6 py-4 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Start Over
        </button>
        
        <button
          onClick={onDownloadPdf}
          className="w-full sm:w-auto px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" /> Download PDF
        </button>

        <button
          onClick={onContinue}
          className="w-full sm:w-auto px-8 py-4 bg-[#84ce3a] hover:bg-[#73b632] text-black text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(132,206,58,0.3)] hover:shadow-[0_0_30px_rgba(132,206,58,0.5)]"
        >
          Continue to POP <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
