import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  BarChart3, 
  ClipboardCheck, 
  Target, 
  FileSearch, 
  Zap, 
  RefreshCcw,
  AlertCircle,
  Download,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- State Management ---

interface WorkflowData {
  // Step 1
  readiness: {
    hasSignal: boolean;
    canMeasure: boolean;
    hasBuyIn: boolean;
    risks: string;
    isDocumented: boolean;
  };
  // Step 2
  baseline: {
    signalName: string;
    value: number;
    unit: string;
    date: string;
  };
  // Step 3
  target: {
    value: number;
    meaning: string;
  };
  // Step 4
  audit: {
    workflowDescription: string;
    maturity: {
      written: boolean;
      accessible: boolean;
      upToDate: boolean;
      followed: boolean;
    };
    breakdown: string;
  };
  // Step 5
  plan: {
    action: string;
    evidence: string;
    cadence: "Weekly" | "Monthly";
  };
  // Step 6
  measure: {
    newValue: number;
  };
}

interface WorkflowStore {
  currentStep: number;
  data: WorkflowData;
  proofTiles: any[];
  setStep: (step: number) => void;
  updateData: (updates: Partial<WorkflowData>) => void;
  addProofTile: (tile: any) => void;
  resetWorkflow: () => void;
}

const initialData: WorkflowData = {
  readiness: { hasSignal: false, canMeasure: false, hasBuyIn: false, risks: "", isDocumented: false },
  baseline: { signalName: "", value: 0, unit: "", date: new Date().toISOString().split('T')[0] },
  target: { value: 0, meaning: "" },
  audit: { workflowDescription: "", maturity: { written: false, accessible: false, upToDate: false, followed: false }, breakdown: "" },
  plan: { action: "", evidence: "", cadence: "Weekly" },
  measure: { newValue: 0 }
};

const useWorkflowStore = create<WorkflowStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      data: initialData,
      proofTiles: [],
      setStep: (step) => set({ currentStep: step }),
      updateData: (updates) => set((state) => ({ data: { ...state.data, ...updates } })),
      addProofTile: (tile) => set((state) => ({ proofTiles: [...state.proofTiles, tile] })),
      resetWorkflow: () => set({ currentStep: 1, data: initialData }),
    }),
    { name: "titon-workflow-storage" }
  )
);

// --- Components ---

const StepProgress = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    "Readiness",
    "Baseline",
    "Target",
    "SOP Audit",
    "Plan",
    "Re-measure"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">
        <div className="flex justify-between items-center mb-4 min-w-[500px] sm:min-w-0">
          {steps.map((label, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <div key={label} className="flex flex-col items-center relative flex-1">
                <div 
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${
                    isActive ? "border-primary bg-primary text-black scale-110 shadow-[0_0_15px_rgba(132,206,58,0.5)]" : 
                    isCompleted ? "border-primary bg-primary/20 text-primary" : 
                    "border-white/10 bg-white/5 text-slate-500"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <span className="text-xs sm:text-base">{stepNum}</span>}
                </div>
                <span className={`text-[8px] sm:text-[10px] uppercase font-bold mt-2 tracking-widest ${isActive ? "text-primary" : "text-slate-500"} hidden xs:block`}>
                  {label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`absolute top-4 sm:top-5 left-1/2 w-full h-[2px] -z-0 ${isCompleted ? "bg-primary" : "bg-white/10"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Progress value={(currentStep / 6) * 100} className="h-1 bg-white/5" />
    </div>
  );
};

const WorkflowEngine = () => {
  const { currentStep, data, updateData, setStep, proofTiles, addProofTile, resetWorkflow } = useWorkflowStore();
  const [localData, setLocalData] = useState<WorkflowData>(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleNext = () => {
    updateData(localData);
    if (currentStep < 6) setStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (currentStep > 1) setStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Step 1: Readiness Assessment ---
  const renderStep1 = () => {
    const isReady = localData.readiness.hasSignal && localData.readiness.canMeasure && localData.readiness.hasBuyIn;
    const missing = [];
    if (!localData.readiness.hasSignal) missing.push("Signal Access");
    if (!localData.readiness.canMeasure) missing.push("Measurement Tools");
    if (!localData.readiness.hasBuyIn) missing.push("Team Buy-in");

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <ClipboardCheck className="text-primary w-6 h-6" /> 1. Readiness Assessment
            </CardTitle>
            <CardDescription className="text-slate-400 italic">Verify the foundations of this workflow improvement.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6">
              {[
                { id: "hasSignal", label: "Do you have access to the signal you want to improve?" },
                { id: "canMeasure", label: "Can you measure it today?" },
                { id: "hasBuyIn", label: "Do you have team buy-in?" },
                { id: "isDocumented", label: "Is the process documented anywhere?" },
              ].map((q) => (
                <div key={q.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-sm font-medium">{q.label}</span>
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`${localData.readiness[q.id as keyof typeof localData.readiness] === true ? "bg-primary text-black border-primary" : "bg-transparent text-white border-white/20"}`}
                      onClick={() => setLocalData({ ...localData, readiness: { ...localData.readiness, [q.id]: true } })}
                    >Yes</Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`${localData.readiness[q.id as keyof typeof localData.readiness] === false ? "bg-red-500/20 text-red-500 border-red-500/50" : "bg-transparent text-white border-white/20"}`}
                      onClick={() => setLocalData({ ...localData, readiness: { ...localData.readiness, [q.id]: false } })}
                    >No</Button>
                  </div>
                </div>
              ))}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Are there obvious risks?</label>
                <Textarea 
                  placeholder="e.g., Seasonal variations, team turnover..."
                  value={localData.readiness.risks}
                  onChange={(e) => setLocalData({ ...localData, readiness: { ...localData.readiness, risks: e.target.value } })}
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                />
              </div>
            </div>

            {/* Output */}
            <div className={`p-6 rounded-2xl border transition-all duration-500 ${isReady ? "bg-primary/10 border-primary/20" : "bg-red-500/10 border-red-500/20"}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isReady ? "bg-primary/20 text-primary" : "bg-red-500/20 text-red-500"}`}>
                  {isReady ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                </div>
                <div>
                  <h4 className={`text-xl font-black uppercase tracking-tight ${isReady ? "text-primary" : "text-red-500"}`}>
                    {isReady ? "System Ready" : "Not Ready Yet"}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {isReady ? "Foundations verified. Proceed to baseline." : `Fix first: ${missing.join(", ")}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={!isReady} className="bg-primary hover:bg-primary/90 text-black px-8 py-6 rounded-xl font-black uppercase tracking-widest transition-all hover:scale-105">
                Save & Continue <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // --- Step 2: SVA Mini (Baseline) ---
  const renderStep2 = () => {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <BarChart3 className="text-primary w-6 h-6" /> 2. SVA Mini (Baseline)
            </CardTitle>
            <CardDescription className="text-slate-400 italic">Capture the current performance state before any intervention.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Signal Name</label>
                <Input 
                  placeholder="e.g., Lead Response Time" 
                  value={localData.baseline.signalName}
                  onChange={(e) => setLocalData({ ...localData, baseline: { ...localData.baseline, signalName: e.target.value } })}
                  className="bg-white/5 border-white/10 h-14"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Baseline Captured On</label>
                <Input 
                  type="date"
                  value={localData.baseline.date}
                  onChange={(e) => setLocalData({ ...localData, baseline: { ...localData.baseline, date: e.target.value } })}
                  className="bg-white/5 border-white/10 h-14"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Current Performance (Value)</label>
                <Input 
                  type="number"
                  placeholder="0.00" 
                  value={localData.baseline.value}
                  onChange={(e) => setLocalData({ ...localData, baseline: { ...localData.baseline, value: parseFloat(e.target.value) || 0 } })}
                  className="bg-white/5 border-white/10 h-14"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Unit</label>
                <Input 
                  placeholder="e.g., Minutes, %" 
                  value={localData.baseline.unit}
                  onChange={(e) => setLocalData({ ...localData, baseline: { ...localData.baseline, unit: e.target.value } })}
                  className="bg-white/5 border-white/10 h-14"
                />
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Baseline Snapshot</div>
              <div className="text-3xl font-black">{localData.baseline.value || "0"} <span className="text-sm font-medium text-slate-400">{localData.baseline.unit || "units"}</span></div>
              <div className="text-xs text-slate-500 mt-1">Status: Initial Baseline Captured</div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={handleBack} className="text-white hover:text-primary">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={!localData.baseline.signalName || !localData.baseline.value}
                className="bg-primary hover:bg-primary/90 text-black px-8 py-6 rounded-xl font-black uppercase tracking-widest"
              >
                Save & Continue <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // --- Step 3: ENS (Target State) ---
  const renderStep3 = () => {
    const gap = localData.target.value - data.baseline.value;
    const absGap = Math.abs(gap);

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <Target className="text-primary w-6 h-6" /> 3. ENS (Target State)
            </CardTitle>
            <CardDescription className="text-slate-400 italic">Define what excellence looks like for this workflow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Signal</div>
              <div className="text-lg font-bold text-primary">{data.baseline.signalName}</div>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Target Performance Value</label>
                <Input 
                  type="number"
                  placeholder="0.00" 
                  value={localData.target.value}
                  onChange={(e) => setLocalData({ ...localData, target: { ...localData.target, value: parseFloat(e.target.value) || 0 } })}
                  className="bg-white/5 border-white/10 h-14"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Baseline</div>
                  <div className="text-xl font-bold">{data.baseline.value} {data.baseline.unit}</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Projected Gap</div>
                  <div className="text-xl font-bold text-primary">{gap > 0 ? "+" : ""}{gap} {data.baseline.unit}</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">What 'better' means in plain language</label>
                <Textarea 
                  placeholder="e.g., Clients feel immediate relief and trust the process within the first 5 mins..."
                  value={localData.target.meaning}
                  onChange={(e) => setLocalData({ ...localData, target: { ...localData.target, meaning: e.target.value } })}
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={handleBack} className="text-white hover:text-primary">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={!localData.target.value || !localData.target.meaning}
                className="bg-primary hover:bg-primary/90 text-black px-8 py-6 rounded-xl font-black uppercase tracking-widest"
              >
                Save & Continue <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // --- Step 4: SOP Audit ---
  const renderStep4 = () => {
    const maturityScore = Object.values(localData.audit.maturity).filter(Boolean).length;
    const maturityLabel = maturityScore === 4 ? "Strong" : maturityScore >= 2 ? "Medium" : "Weak";
    const maturityColor = maturityScore === 4 ? "text-primary" : maturityScore >= 2 ? "text-yellow-500" : "text-red-500";

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <FileSearch className="text-primary w-6 h-6" /> 4. SOP Audit
            </CardTitle>
            <CardDescription className="text-slate-400 italic">Inspect the existing instructions behind this workflow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Current Workflow Description</label>
                <Textarea 
                  placeholder="Describe the steps currently taken when this signal occurs..."
                  value={localData.audit.workflowDescription}
                  onChange={(e) => setLocalData({ ...localData, audit: { ...localData.audit, workflowDescription: e.target.value } })}
                  className="bg-white/5 border-white/10 min-h-[120px]"
                />
              </div>

              <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-4">SOP Maturity Checklist</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: "written", label: "SOP exists in writing" },
                    { id: "accessible", label: "SOP is accessible to team" },
                    { id: "upToDate", label: "SOP is up to date (< 6 months)" },
                    { id: "followed", label: "SOP is followed consistently" },
                  ].map((check) => (
                    <div key={check.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all">
                      <Checkbox 
                        id={check.id} 
                        checked={localData.audit.maturity[check.id as keyof typeof localData.audit.maturity]}
                        onCheckedChange={(checked) => setLocalData({ 
                          ...localData, 
                          audit: { 
                            ...localData.audit, 
                            maturity: { ...localData.audit.maturity, [check.id]: checked === true } 
                          } 
                        })}
                        className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-black"
                      />
                      <label htmlFor={check.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{check.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Maturity Rating:</div>
                <div className={`text-lg font-black uppercase ${maturityColor}`}>{maturityLabel} ({maturityScore}/4)</div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Biggest breakdown or handoff problem</label>
                <Textarea 
                  placeholder="Where does it usually fail?"
                  value={localData.audit.breakdown}
                  onChange={(e) => setLocalData({ ...localData, audit: { ...localData.audit, breakdown: e.target.value } })}
                  className="bg-white/5 border-white/10 min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={handleBack} className="text-white hover:text-primary">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={!localData.audit.workflowDescription}
                className="bg-primary hover:bg-primary/90 text-black px-8 py-6 rounded-xl font-black uppercase tracking-widest"
              >
                Save & Continue <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // --- Step 5: Proof Tile Plan ---
  const renderStep5 = () => {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <Zap className="text-primary w-6 h-6" /> 5. Proof Tile Plan
            </CardTitle>
            <CardDescription className="text-slate-400 italic">Design the intervention and the evidence of its success.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">First Improvement Action</label>
                <Input 
                  placeholder="e.g., Automate lead distribution via Round Robin..." 
                  value={localData.plan.action}
                  onChange={(e) => setLocalData({ ...localData, plan: { ...localData.plan, action: e.target.value } })}
                  className="bg-white/5 border-white/10 h-14"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">What counts as evidence/proof?</label>
                <Input 
                  placeholder="e.g., Dashboard screenshot showing 20% reduction..." 
                  value={localData.plan.evidence}
                  onChange={(e) => setLocalData({ ...localData, plan: { ...localData.plan, evidence: e.target.value } })}
                  className="bg-white/5 border-white/10 h-14"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-4">Measurement Cadence</label>
                <div className="flex gap-4">
                  {["Weekly", "Monthly"].map((c) => (
                    <Button 
                      key={c}
                      variant="outline"
                      className={`flex-1 h-14 rounded-xl border transition-all ${localData.plan.cadence === c ? "bg-primary text-black border-primary font-black" : "bg-white/5 text-white border-white/10"}`}
                      onClick={() => setLocalData({ ...localData, plan: { ...localData.plan, cadence: c as any } })}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="relative mt-8 p-8 rounded-3xl bg-gradient-to-br from-[#0a1122] to-[#050b18] border border-primary/30 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-32 h-32 text-primary" />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Proof Tile Blueprint</div>
                    <h4 className="text-2xl font-black">{data.baseline.signalName || "Draft Signal"}</h4>
                  </div>
                  <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Status: Open
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">The Action</div>
                    <p className="text-sm font-medium italic">{localData.plan.action || "No action defined yet"}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">The Proof</div>
                    <p className="text-sm font-medium italic">{localData.plan.evidence || "No evidence defined yet"}</p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Baseline</div>
                      <div className="font-bold text-sm">{data.baseline.value} {data.baseline.unit}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Target</div>
                      <div className="font-bold text-sm text-primary">{data.target.value} {data.baseline.unit}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cadence: {localData.plan.cadence}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={handleBack} className="text-white hover:text-primary">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={!localData.plan.action || !localData.plan.evidence}
                className="bg-primary hover:bg-primary/90 text-black px-8 py-6 rounded-xl font-black uppercase tracking-widest"
              >
                Save & Continue <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // --- Step 6: Re-measure ---
  const renderStep6 = () => {
    const isImproved = localData.measure.newValue < data.baseline.value; // Assuming lower is better for most signals (time, lag)
    // For many metrics higher is better, but TITON often focuses on efficiency.
    // Let's just compare if it moved towards the target.
    const targetDirection = data.target.value > data.baseline.value ? 1 : -1;
    const currentDirection = localData.measure.newValue > data.baseline.value ? 1 : -1;
    const progress = Math.abs(localData.measure.newValue - data.baseline.value);
    const totalGoal = Math.abs(data.target.value - data.baseline.value);
    
    let status = "Stable";
    if (localData.measure.newValue !== data.baseline.value) {
      if (currentDirection === targetDirection) status = "Improved";
      else status = "Did not improve yet";
    }

    const chartData = [
      { name: "Baseline", value: data.baseline.value },
      { name: "Re-measure", value: localData.measure.newValue },
      { name: "Target", value: data.target.value }
    ];

    const generateReport = () => {
      const tile = {
        id: Date.now(),
        signalName: data.baseline.signalName,
        baseline: data.baseline.value,
        target: data.target.value,
        current: localData.measure.newValue,
        unit: data.baseline.unit,
        status: status === "Improved" ? "Proven" : "Open",
        date: new Date().toLocaleDateString(),
        action: data.plan.action,
        evidence: data.plan.evidence
      };
      addProofTile(tile);
      toast.success("Proof Report Generated and added to Dashboard!");
    };

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <RefreshCcw className="text-primary w-6 h-6" /> 6. Re-measure
            </CardTitle>
            <CardDescription className="text-slate-400 italic">Close the loop by capturing the new performance data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">New Measurement Value</label>
                <div className="flex gap-4">
                  <Input 
                    type="number"
                    placeholder="0.00" 
                    value={localData.measure.newValue}
                    onChange={(e) => setLocalData({ ...localData, measure: { ...localData.measure, newValue: parseFloat(e.target.value) || 0 } })}
                    className="bg-white/5 border-white/10 h-14"
                  />
                  <Button className="bg-primary text-black font-bold h-14 px-8" onClick={() => updateData(localData)}>Update Chart</Button>
                </div>
              </div>

              {/* Chart */}
              <div className="h-[300px] w-full bg-white/5 rounded-2xl border border-white/10 p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(val) => `${val}${data.baseline.unit}`}
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #ffffff10", borderRadius: "8px" }}
                      itemStyle={{ color: "#84ce3a" }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 1 ? (status === "Improved" ? "#84ce3a" : "#ef4444") : index === 2 ? "#3b82f6" : "#475569"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-2">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resulting Status</div>
                  <div className={`text-4xl font-black uppercase tracking-tighter ${status === "Improved" ? "text-primary" : "text-red-500"}`}>{status}</div>
                  <p className="text-sm text-slate-400">
                    {status === "Improved" ? `Gap closed by ${progress} ${data.baseline.unit}. Value delivered.` : `No improvement detected against the ${data.baseline.value} ${data.baseline.unit} baseline.`}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={generateReport}
                    className="bg-primary hover:bg-primary/90 text-black h-16 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                  >
                    <Download className="mr-2 w-5 h-5" /> Generate Proof Report
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={resetWorkflow}
                    className="border-white/10 text-white h-12 rounded-xl"
                  >
                    Start New Loop
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-start">
              <Button variant="ghost" onClick={handleBack} className="text-white hover:text-primary">
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050b18] text-white font-body selection:bg-primary/30 pb-20">
      <Navbar />

      <main className="container mx-auto px-4 pt-32">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-4 border border-primary/20">
                <Zap className="w-3 h-3" /> TITON Workflow Engine
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">Activity → Proof</h1>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">Current Cycle</div>
              <div className="text-lg font-bold text-primary">{data.baseline.signalName || "New Workflow"}</div>
            </div>
          </div>

          <StepProgress currentStep={currentStep} />

          <div className="relative mt-12">
            <AnimatePresence mode="wait">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
              {currentStep === 6 && renderStep6()}
            </AnimatePresence>
          </div>

          {/* Proof Tiles Dashboard Preview */}
          {proofTiles.length > 0 && (
            <section className="mt-32">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">Active Proof Tiles</h2>
                <Button variant="ghost" onClick={resetWorkflow} className="text-primary hover:bg-primary/10">
                  <Plus className="mr-2 w-4 h-4" /> New Workflow
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {proofTiles.map((tile) => (
                  <Card key={tile.id} className="bg-white/5 border-white/10 text-white overflow-hidden group hover:border-primary/50 transition-all">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-lg">{tile.signalName}</h4>
                        <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${tile.status === "Proven" ? "bg-primary text-black" : "bg-white/10 text-slate-400"}`}>
                          {tile.status}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div>
                          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Baseline</div>
                          <div className="font-bold">{tile.baseline} {tile.unit}</div>
                        </div>
                        <div>
                          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Target</div>
                          <div className="font-bold text-blue-400">{tile.target} {tile.unit}</div>
                        </div>
                        <div>
                          <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Current</div>
                          <div className={`font-bold ${tile.status === "Proven" ? "text-primary" : "text-slate-400"}`}>{tile.current} {tile.unit}</div>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Updated: {tile.date}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkflowEngine;
