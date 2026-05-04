import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';
import { AuditResponses, Fleet } from '../types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MultiStepFormProps {
  currentStep: number;
  responses: AuditResponses;
  updateResponse: (key: keyof AuditResponses, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  isStepValid: () => boolean;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  currentStep,
  responses,
  updateResponse,
  nextStep,
  prevStep,
  isStepValid
}) => {

  const handleArrayToggle = (key: keyof AuditResponses, value: string) => {
    const currentArray = responses[key] as string[];
    if (currentArray.includes(value)) {
      updateResponse(key, currentArray.filter(i => i !== value));
    } else {
      updateResponse(key, [...currentArray, value]);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-white mb-6">Agency Profile</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Full Name *</label>
          <input 
            type="text" 
            value={responses.fullName}
            onChange={(e) => updateResponse('fullName', e.target.value)}
            className="w-full bg-[#0d1829] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#84ce3a] transition-colors"
            placeholder="John Doe"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Agency Name *</label>
          <input 
            type="text" 
            value={responses.agencyName}
            onChange={(e) => updateResponse('agencyName', e.target.value)}
            className="w-full bg-[#0d1829] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#84ce3a] transition-colors"
            placeholder="Acme Automation"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Email *</label>
          <input 
            type="email" 
            value={responses.email}
            onChange={(e) => updateResponse('email', e.target.value)}
            className="w-full bg-[#0d1829] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#84ce3a] transition-colors"
            placeholder="john@example.com"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Website</label>
          <input 
            type="url" 
            value={responses.website}
            onChange={(e) => updateResponse('website', e.target.value)}
            className="w-full bg-[#0d1829] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#84ce3a] transition-colors"
            placeholder="https://example.com"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Country</label>
          <select 
            value={responses.country}
            onChange={(e) => updateResponse('country', e.target.value)}
            className="w-full bg-[#0d1829] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#84ce3a] transition-colors appearance-none"
          >
            <option value="">Select Country...</option>
            <option value="US">United States</option>
            <option value="Canada">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Timezone</label>
          <select 
            value={responses.timezone}
            onChange={(e) => updateResponse('timezone', e.target.value)}
            className="w-full bg-[#0d1829] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#84ce3a] transition-colors appearance-none"
          >
            <option value="">Select Timezone...</option>
            <option value="EST">EST</option>
            <option value="CST">CST</option>
            <option value="MST">MST</option>
            <option value="PST">PST</option>
            <option value="GMT">GMT</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-black text-white mb-6">Current Workflow Status</h3>
      
      <div className="space-y-4">
        <label className="text-sm font-bold text-white mb-2 block">How many core workflows does your agency currently run?</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['1-2 workflows', '3-5 workflows', '6-10 workflows', '10+ workflows'].map(option => (
            <button
              key={option}
              onClick={() => updateResponse('workflowCount', option)}
              className={`p-4 rounded-xl border text-left transition-all ${
                responses.workflowCount === option 
                  ? 'border-[#84ce3a] bg-[#84ce3a]/10 text-white' 
                  : 'border-white/10 bg-[#0d1829] text-slate-300 hover:border-white/30'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-bold text-white block">Are your current SOPs documented?</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-4 h-4 text-[#84ce3a]" />
              </TooltipTrigger>
              <TooltipContent className="bg-[#0d1829] border-white/10 text-white max-w-xs">
                Standard Operating Procedures (SOPs) are step-by-step instructions compiled to help workers carry out complex routine operations.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['Yes, fully documented', 'Partial / In progress', 'No, not documented', 'What are SOPs?'].map(option => (
            <button
              key={option}
              onClick={() => updateResponse('sopsDocumented', option)}
              className={`p-4 rounded-xl border text-left transition-all ${
                responses.sopsDocumented === option 
                  ? 'border-[#84ce3a] bg-[#84ce3a]/10 text-white' 
                  : 'border-white/10 bg-[#0d1829] text-slate-300 hover:border-white/30'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-black text-white mb-6">Pain Points & Challenges</h3>
      
      <div className="space-y-4">
        <label className="text-sm font-bold text-white mb-2 block">What is your agency's biggest operational challenge? (Select up to 3)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Inconsistent delivery quality',
            'Team doesn\'t follow processes',
            'Too much manual work',
            'Can\'t scale workflows',
            'Client reporting takes too long',
            'No clear accountability'
          ].map(option => {
            const isSelected = responses.painPoints.includes(option);
            return (
              <button
                key={option}
                onClick={() => {
                  if (isSelected || responses.painPoints.length < 3) {
                    handleArrayToggle('painPoints', option);
                  }
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#84ce3a] bg-[#84ce3a]/10 text-white' 
                    : 'border-white/10 bg-[#0d1829] text-slate-300 hover:border-white/30'
                } ${!isSelected && responses.painPoints.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'border-[#84ce3a] bg-[#84ce3a]' : 'border-white/20'}`}>
                    {isSelected && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-sm">{option}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/10">
        <label className="text-sm font-bold text-white mb-2 block">On a scale of 1-10, how confident are you in your current delivery system?</label>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Chaos</span>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={responses.confidenceScore || 5}
            onChange={(e) => updateResponse('confidenceScore', parseInt(e.target.value))}
            className="flex-1 accent-[#84ce3a] h-2 bg-[#0d1829] rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Systematized</span>
        </div>
        <div className="text-center text-3xl font-black text-[#84ce3a] mt-4">
          {responses.confidenceScore || 5}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-black text-white mb-6">Quick BreakPoints™ Identification</h3>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-bold text-white block">Which of these opportunities could create FAST impact in your agency?</label>
        </div>
        <div className="flex flex-col gap-3">
          {[
            'Automating a manual task (saves 5+ hours/week)',
            'Documenting an unwritten process',
            'Creating a Proof Tile™ for a successful workflow',
            'Standardizing client reporting',
            'Reducing delivery time by 25%+'
          ].map(option => {
            const isSelected = responses.quickBreakpoints.includes(option);
            return (
              <button
                key={option}
                onClick={() => handleArrayToggle('quickBreakpoints', option)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#84ce3a] bg-[#84ce3a]/10 text-white' 
                    : 'border-white/10 bg-[#0d1829] text-slate-300 hover:border-white/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'border-[#84ce3a] bg-[#84ce3a]' : 'border-white/20'}`}>
                    {isSelected && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-sm">{option}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/10">
        <label className="text-sm font-bold text-white mb-2 block">What is one workflow you would like to improve first?</label>
        <input 
          type="text" 
          value={responses.targetWorkflow}
          onChange={(e) => updateResponse('targetWorkflow', e.target.value)}
          className="w-full bg-[#0d1829] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#84ce3a] transition-colors"
          placeholder="e.g., Client onboarding, Content approval, Reporting"
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-black text-white mb-6">System & Integration</h3>
      
      <div className="space-y-4">
        <label className="text-sm font-bold text-white mb-2 block">Do you currently use GoHighLevel (GHL)?</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['Yes, actively', 'Yes, but not fully utilized', 'No, but interested', 'No, what is GHL?'].map(option => (
            <button
              key={option}
              onClick={() => updateResponse('ghlStatus', option)}
              className={`p-4 rounded-xl border text-left transition-all ${
                responses.ghlStatus === option 
                  ? 'border-[#84ce3a] bg-[#84ce3a]/10 text-white' 
                  : 'border-white/10 bg-[#0d1829] text-slate-300 hover:border-white/30'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/10">
        <label className="text-sm font-bold text-white mb-2 block">Which tools does your agency use? (Select all that apply)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'GoHighLevel',
            'Zapier / Make',
            'ClickUp / Asana / Monday',
            'Slack',
            'Google Workspace',
            'HubSpot / Salesforce'
          ].map(option => {
            const isSelected = responses.toolsUsed.includes(option);
            return (
              <button
                key={option}
                onClick={() => handleArrayToggle('toolsUsed', option)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#84ce3a] bg-[#84ce3a]/10 text-white' 
                    : 'border-white/10 bg-[#0d1829] text-slate-300 hover:border-white/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'border-[#84ce3a] bg-[#84ce3a]' : 'border-white/20'}`}>
                    {isSelected && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-sm">{option}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-8">
      <h3 className="text-2xl font-black text-white mb-6">Commitment & Readiness</h3>
      
      <div className="space-y-4">
        <label className="text-sm font-bold text-white mb-2 block">Which TITON Fleet matches your commitment level?</label>
        <div className="flex flex-col gap-3">
          {[
            { id: 'Charter', title: 'Charter Fleet (50 spots)', desc: 'I want early access and will actively contribute workflows' },
            { id: 'Partner', title: 'Partner Fleet (100 spots)', desc: 'I want to participate and contribute when ready' },
            { id: 'Extended', title: 'Extended Waitlist', desc: 'I want to stay informed and join later' }
          ].map(fleet => (
            <button
              key={fleet.id}
              onClick={() => updateResponse('recommendedFleet', fleet.id as Fleet)}
              className={`p-5 rounded-xl border text-left transition-all ${
                responses.recommendedFleet === fleet.id 
                  ? 'border-[#84ce3a] bg-[#84ce3a]/10' 
                  : 'border-white/10 bg-[#0d1829] hover:border-white/30'
              }`}
            >
              <div className="font-black text-lg text-white tracking-tight">{fleet.title}</div>
              <div className="text-sm text-slate-400 mt-1">{fleet.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/10">
        <label className="text-sm font-bold text-white mb-2 block">How soon are you ready to start?</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['Immediately (0-2 weeks)', 'Within 1 month', 'Within 3 months', 'Just exploring for now'].map(option => (
            <button
              key={option}
              onClick={() => updateResponse('readinessTimeline', option)}
              className={`p-4 rounded-xl border text-left transition-all ${
                responses.readinessTimeline === option 
                  ? 'border-[#84ce3a] bg-[#84ce3a]/10 text-white' 
                  : 'border-white/10 bg-[#0d1829] text-slate-300 hover:border-white/30'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const steps = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5, renderStep6];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-[#0a1122] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Animated background glow */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#84ce3a]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {steps[currentStep - 1]()}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-white/10 relative z-10">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors ${
              currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          
          <button
            onClick={nextStep}
            disabled={!isStepValid()}
            className={`flex items-center gap-2 px-8 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              isStepValid() 
                ? 'bg-[#84ce3a] text-black hover:bg-[#73b632] shadow-[0_0_15px_rgba(132,206,58,0.3)]' 
                : 'bg-white/10 text-slate-500 cursor-not-allowed'
            }`}
          >
            {currentStep === 6 ? 'Complete Audit' : 'Next Step'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
