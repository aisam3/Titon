import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  "Profile",
  "Workflows",
  "Pain Points",
  "BreakPoints",
  "Tools",
  "Commitment"
];

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto mb-12 px-4">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[#84ce3a] font-bold text-sm tracking-widest uppercase">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-slate-400 text-xs font-medium tracking-wide">
          {stepLabels[currentStep - 1]}
        </span>
      </div>
      
      <div className="h-2 w-full bg-[#0a1122] rounded-full overflow-hidden relative">
        <motion.div
          className="absolute top-0 left-0 h-full bg-[#84ce3a]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      
      <div className="flex justify-between mt-3 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
        {stepLabels.map((label, index) => (
          <span 
            key={index} 
            className={`hidden sm:block transition-colors duration-300 ${
              index + 1 === currentStep ? 'text-[#84ce3a]' : 
              index + 1 < currentStep ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};
