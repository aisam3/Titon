import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

import { AuditResponses, AuditResults, Fleet } from './types';
import { ProgressBar } from './components/ProgressBar';
import { MultiStepForm } from './components/MultiStepForm';
import { ResultsCard } from './components/ResultsCard';
import { generatePdf } from './components/PdfGenerator';

const initialResponses: AuditResponses = {
  fullName: '',
  agencyName: '',
  email: '',
  website: '',
  country: '',
  timezone: '',
  workflowCount: '',
  sopsDocumented: '',
  painPoints: [],
  confidenceScore: 5,
  quickBreakpoints: [],
  targetWorkflow: '',
  ghlStatus: '',
  toolsUsed: [],
  recommendedFleet: '',
  readinessTimeline: ''
};

const R6Audit: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [responses, setResponses] = useState<AuditResponses>(initialResponses);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<AuditResults | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep, isComplete]);

  const updateResponse = (key: keyof AuditResponses, value: any) => {
    setResponses(prev => ({ ...prev, [key]: value }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return responses.fullName.trim() !== '' && 
               responses.agencyName.trim() !== '' && 
               validateEmail(responses.email);
      case 2:
        return responses.workflowCount !== '' && responses.sopsDocumented !== '';
      case 3:
        return responses.painPoints.length > 0;
      case 4:
        return responses.quickBreakpoints.length > 0 && responses.targetWorkflow.trim() !== '';
      case 5:
        return responses.ghlStatus !== '' && responses.toolsUsed.length > 0;
      case 6:
        return responses.recommendedFleet !== '' && responses.readinessTimeline !== '';
      default:
        return true;
    }
  };

  const calculateResults = (): AuditResults => {
    // Determine Quadrant
    let quadrant: AuditResults['quadrantMatch'] = 'Fog Projects';
    if (responses.quickBreakpoints.length > 2 && responses.confidenceScore < 6) {
      quadrant = 'Quick BreakPoints';
    } else if (responses.sopsDocumented.includes('No') || responses.confidenceScore < 4) {
      quadrant = 'Transformation Bets';
    } else if (responses.workflowCount.includes('1-2') && responses.confidenceScore > 7) {
      quadrant = 'Nice-to-Haves';
    }

    // Determine estimated time
    let timeToProof = '2-4 Weeks';
    if (responses.sopsDocumented.includes('Yes') && responses.ghlStatus.includes('actively')) {
      timeToProof = '1-2 Weeks';
    } else if (responses.sopsDocumented.includes('No')) {
      timeToProof = '4-6 Weeks';
    }

    return {
      quickBreakpointOpportunity: responses.quickBreakpoints[0] || "Optimize core delivery",
      recommendedFirstProofTile: responses.targetWorkflow || "Client Onboarding",
      fleetRecommendation: responses.recommendedFleet as Fleet,
      estimatedTimeToProof: timeToProof,
      quadrantMatch: quadrant
    };
  };

  const submitAudit = async () => {
    setIsSubmitting(true);
    
    try {
      // Calculate final results
      const finalResults = calculateResults();
      setResults(finalResults);
      
      // Attempt to save to Supabase
      const { error } = await supabase
        .from('audit_responses')
        .insert([{
          user_email: responses.email,
          full_name: responses.fullName,
          agency_name: responses.agencyName,
          website: responses.website,
          country: responses.country,
          timezone: responses.timezone,
          workflow_count: responses.workflowCount,
          sops_documented: responses.sopsDocumented,
          pain_points: responses.painPoints,
          confidence_score: responses.confidenceScore,
          quick_breakpoints: responses.quickBreakpoints,
          target_workflow: responses.targetWorkflow,
          ghl_status: responses.ghlStatus,
          tools_used: responses.toolsUsed,
          recommended_fleet: responses.recommendedFleet,
          readiness_timeline: responses.readinessTimeline,
          completed: true
        }]);

      if (error) {
        console.error("Supabase insert error:", error);
        // We still show the results even if DB fails, but show a toast
        toast.error("Results generated, but we couldn't save to the database. Make sure you ran the SQL migration.");
      } else {
        toast.success("Audit completed successfully!");
      }

      setIsComplete(true);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong processing your audit.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    } else {
      submitAudit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleDownloadPdf = () => {
    if (results) {
      generatePdf(responses, results);
      toast.success("PDF downloading...");
    }
  };

  const handleContinueToPop = () => {
    // We could pass data via URL params, but for now we'll just navigate
    navigate('/pop');
  };

  const handleStartOver = () => {
    setResponses(initialResponses);
    setCurrentStep(1);
    setIsComplete(false);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-[#050b18] text-white selection:bg-[#84ce3a]/30">
      <Navbar />
      
      <main className="pt-32 pb-24 px-4 sm:px-6 relative z-10">
        
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-[-1]">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#84ce3a]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#F97316]/5 rounded-full blur-[120px]" />
        </div>

        {!isComplete ? (
          <>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
                Find Your <span className="text-[#84ce3a]">Fastest Path</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl">
                Complete the R6 Audit to identify your Quick BreakPoints™, map your workflows, and discover which TITON Fleet fits your agency.
              </p>
            </div>

            <ProgressBar currentStep={currentStep} totalSteps={6} />
            
            {isSubmitting ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-[#84ce3a]/20 border-t-[#84ce3a] rounded-full animate-spin mb-6" />
                <p className="text-xl font-bold tracking-widest uppercase text-[#84ce3a] animate-pulse">
                  Analyzing Workflows...
                </p>
              </div>
            ) : (
              <MultiStepForm 
                currentStep={currentStep}
                responses={responses}
                updateResponse={updateResponse}
                nextStep={nextStep}
                prevStep={prevStep}
                isStepValid={isStepValid}
              />
            )}
          </>
        ) : (
          results && (
            <ResultsCard 
              results={results}
              onDownloadPdf={handleDownloadPdf}
              onStartOver={handleStartOver}
              onContinue={handleContinueToPop}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-8 text-center text-sm text-slate-500">
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Notice</a>
          <a href="#" className="hover:text-white transition-colors">Data Sharing Guidelines</a>
          <a href="#" className="hover:text-white transition-colors">Contact Support</a>
        </div>
        <p>Anonymous data feeds into the Shared Industry Intelligence (SII) model.</p>
      </footer>
    </div>
  );
};

export default R6Audit;
