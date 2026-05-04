import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import {
  Database, FileText, ShieldCheck, Layers, Activity,
  Box, Cpu, Globe, Settings, ClipboardCheck, BookOpen,
  Gavel, BrainCircuit, Loader2, TrendingUp, AlertTriangle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetRegistry } from "./components/AssetRegistry";
import { SopManagement } from "./components/SopManagement";
import { RequirementGovernance } from "./components/RequirementGovernance";
import { AuditConsole } from "./components/AuditConsole";
import { KnowledgeHub } from "./components/KnowledgeHub";
import { GovernanceCenter } from "./components/GovernanceCenter";
import { AskTitonAI } from "./components/AskTitonAI";
import { kmService } from "./kmService";
import { VaultStats } from "./types";

const KMVault = () => {
  const [stats, setStats] = useState<VaultStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await kmService.getVaultStats();
      setStats(data);
    } catch {
      // fallback zeros
      setStats({ asset_count: 0, sop_count: 0, req_count: 0, audit_count: 0, avg_compliance: 0, verified_reqs: 0, passed_audits: 0 });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const statCards = [
    { label: 'Total Assets', value: stats?.asset_count ?? 0, color: 'text-white' },
    { label: 'SOPs', value: stats?.sop_count ?? 0, color: 'text-blue-400' },
    { label: 'Requirements', value: stats?.req_count ?? 0, color: 'text-amber-400' },
    { label: 'Compliance', value: stats ? `${stats.avg_compliance}%` : '—', color: stats && stats.avg_compliance >= 80 ? 'text-emerald-400' : 'text-amber-400' },
  ];

  return (
    <div className="min-h-screen bg-[#050b18] text-white font-sans selection:bg-primary/30 pb-20">
      <Navbar />

      {/* Header */}
      <section className="relative pt-32 pb-12 px-6 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
              <div className="inline-block px-4 py-1 border border-primary/20 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                Enterprise Core Intelligence
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
                TITON <span className="text-primary italic">Vault</span>
              </h1>
              <p className="max-w-2xl text-slate-400 text-sm md:text-base font-medium leading-relaxed tracking-wide italic">
                Centralized knowledge architecture for master asset management, operational SOPs, and governance compliance.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {statsLoading ? (
                <div className="col-span-2 flex items-center gap-3 text-slate-500">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Loading vault stats…</span>
                </div>
              ) : statCards.map(({ label, value, color }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex flex-col items-center justify-center min-w-[110px]">
                  <div className={`text-2xl font-black ${color}`}>{value}</div>
                  <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance health bar */}
          {stats && (
            <div className="mt-8 p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <TrendingUp className="w-4 h-4 text-primary" /> Vault Health
              </div>
              <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${stats.avg_compliance >= 80 ? 'bg-emerald-400' : stats.avg_compliance >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                  style={{ width: `${stats.avg_compliance}%` }}
                />
              </div>
              <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest shrink-0">
                <span className="text-emerald-400">{stats.verified_reqs} Verified</span>
                <span className="text-emerald-400">{stats.passed_audits} Passed</span>
                {stats.req_count - stats.verified_reqs > 0 && (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />{stats.req_count - stats.verified_reqs} Pending
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Interface */}
      <section className="pt-10 px-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="registry" className="space-y-10">
            <div className="flex justify-center w-full overflow-hidden">
              <TabsList className="bg-white/[0.03] border border-white/10 p-1.5 rounded-2xl h-auto flex flex-nowrap overflow-x-auto gap-1 max-w-full">
                {[
                  { value: 'registry', icon: <Database className="w-3.5 h-3.5 mr-2" />, label: 'Asset Registry' },
                  { value: 'sops', icon: <FileText className="w-3.5 h-3.5 mr-2" />, label: 'SOPs' },
                  { value: 'governance', icon: <ShieldCheck className="w-3.5 h-3.5 mr-2" />, label: 'Compliance' },
                  { value: 'audits', icon: <ClipboardCheck className="w-3.5 h-3.5 mr-2" />, label: 'Audit Console' },
                  { value: 'hub', icon: <BookOpen className="w-3.5 h-3.5 mr-2" />, label: 'Knowledge Hub' },
                  { value: 'center', icon: <Gavel className="w-3.5 h-3.5 mr-2" />, label: 'Governance' },
                  { value: 'ai', icon: <BrainCircuit className="w-3.5 h-3.5 mr-2" />, label: 'Ask AI' },
                ].map(({ value, icon, label }) => (
                  <TabsTrigger key={value} value={value}
                    className="rounded-xl px-5 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-black text-[9px] font-black uppercase tracking-[0.1em] transition-all whitespace-nowrap flex items-center shrink-0">
                    {icon}{label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="registry" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AssetRegistry />
            </TabsContent>
            <TabsContent value="sops" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SopManagement />
            </TabsContent>
            <TabsContent value="governance" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <RequirementGovernance />
            </TabsContent>
            <TabsContent value="audits" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AuditConsole />
            </TabsContent>
            <TabsContent value="hub" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <KnowledgeHub />
            </TabsContent>
            <TabsContent value="center" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <GovernanceCenter />
            </TabsContent>
            <TabsContent value="ai" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <AskTitonAI />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <div className="fixed top-0 right-0 -z-10 w-1/3 h-1/3 bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-1/3 h-1/3 bg-blue-500/5 blur-[150px] pointer-events-none" />
    </div>
  );
};

export default KMVault;
