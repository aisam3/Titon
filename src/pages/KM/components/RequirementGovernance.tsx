import React, { useState, useEffect, useMemo } from "react";
import { ShieldCheck, Search, Plus, ArrowRight, AlertTriangle, CheckCircle, ExternalLink, Target, Loader2, Edit, Trash2, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Requirement, GovernanceClass, ProofStatus, RequirementFormData } from "../types";
import { kmService, calculateComplianceScore, getAggregateCompliance } from "../kmService";
import { useToast } from "@/hooks/use-toast";

const GOV_CLASSES: GovernanceClass[] = ['Regulatory', 'Standard', 'Internal', 'Client'];
const PROOF_STATUSES: ProofStatus[] = ['Verified', 'Pending', 'Rejected', 'N/A'];

const govColor = (g: GovernanceClass) => ({
  Regulatory: 'bg-red-500/20 text-red-400 border-red-500/30',
  Standard: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Internal: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Client: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}[g] ?? 'bg-slate-500/20 text-slate-400');

const proofColor = (p: ProofStatus) => ({
  Verified: 'text-emerald-400', Pending: 'text-amber-400', Rejected: 'text-red-400', 'N/A': 'text-slate-500',
}[p] ?? 'text-slate-500');

const BLANK_FORM: RequirementFormData = {
  title: '', governance_class: 'Internal', description: '', next_best_action: '',
  compliance_score: 0, proof_status: 'Pending', proof_document: '',
};

export const RequirementGovernance = () => {
  const { toast } = useToast();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterProof, setFilterProof] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReq, setEditingReq] = useState<Requirement | null>(null);
  const [form, setForm] = useState<RequirementFormData>(BLANK_FORM);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setRequirements(await kmService.getRequirements()); }
    catch (e: any) { toast({ title: "Load failed", description: e.message, variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const filtered = useMemo(() => requirements.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.requirement_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = filterClass === "all" || r.governance_class === filterClass;
    const matchProof = filterProof === "all" || r.proof_status === filterProof;
    return matchSearch && matchClass && matchProof;
  }), [requirements, searchTerm, filterClass, filterProof]);

  // ── CALCULATED AGGREGATES ──
  const avgCompliance = getAggregateCompliance(requirements);
  const verifiedCount = requirements.filter(r => r.proof_status === 'Verified').length;
  const pendingCount = requirements.filter(r => r.proof_status === 'Pending').length;
  const rejectedCount = requirements.filter(r => r.proof_status === 'Rejected').length;

  // Live preview of calculated score as form changes
  const previewScore = useMemo(() =>
    calculateComplianceScore(form.proof_status, form.compliance_score > 0 ? form.compliance_score : undefined),
    [form.proof_status, form.compliance_score]
  );

  const openCreate = () => { setEditingReq(null); setForm(BLANK_FORM); setIsModalOpen(true); };
  const openEdit = (r: Requirement) => {
    setEditingReq(r);
    setForm({ title: r.title, governance_class: r.governance_class, description: r.description, next_best_action: r.next_best_action, compliance_score: r.compliance_score, proof_status: r.proof_status, proof_document: r.proof_document });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      if (editingReq) {
        const updated = await kmService.updateRequirement(editingReq.id, form);
        setRequirements(prev => prev.map(r => r.id === updated.id ? updated : r));
        toast({ title: "Requirement updated" });
      } else {
        const created = await kmService.createRequirement(form);
        setRequirements(prev => [created, ...prev]);
        toast({ title: "Requirement created", description: `ID: ${created.requirement_id}` });
      }
      setIsModalOpen(false);
    } catch (e: any) { toast({ title: "Save failed", description: e.message, variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await kmService.deleteRequirement(id);
      setRequirements(prev => prev.filter(r => r.id !== id));
      toast({ title: "Requirement deleted" });
    } catch (e: any) { toast({ title: "Delete failed", description: e.message, variant: "destructive" }); }
  };

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="col-span-2 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aggregate Compliance</span>
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div className={`text-4xl font-black mb-3 ${avgCompliance >= 80 ? 'text-emerald-400' : avgCompliance >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
            {loading ? '—' : `${avgCompliance}%`}
          </div>
          <Progress value={avgCompliance} className="h-1.5 bg-white/5" />
          <p className="text-[10px] text-slate-600 mt-2 uppercase font-bold tracking-widest">Based on {requirements.length} requirements</p>
        </div>
        {[
          { label: 'Verified', count: verifiedCount, color: 'text-emerald-400', icon: <CheckCircle className="w-4 h-4 text-emerald-400" /> },
          { label: 'Pending', count: pendingCount, color: 'text-amber-400', icon: <AlertTriangle className="w-4 h-4 text-amber-400" /> },
          { label: 'Rejected', count: rejectedCount, color: 'text-red-400', icon: <AlertTriangle className="w-4 h-4 text-red-400" /> },
        ].map(({ label, count, color, icon }) => (
          <div key={label} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
              {icon}
            </div>
            <div className={`text-4xl font-black ${color}`}>{loading ? '—' : count}</div>
          </div>
        ))}
      </div>

      {/* Compliance breakdown by governance class */}
      {requirements.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {GOV_CLASSES.map(gc => {
            const items = requirements.filter(r => r.governance_class === gc);
            const avg = getAggregateCompliance(items);
            return (
              <div key={gc} className={`p-4 rounded-2xl border cursor-pointer transition-all ${filterClass === gc ? 'border-primary/40 bg-primary/5' : 'border-white/5 bg-white/[0.02]'}`} onClick={() => setFilterClass(filterClass === gc ? 'all' : gc)}>
                <Badge variant="outline" className={`${govColor(gc)} text-[8px] font-black uppercase tracking-widest mb-2`}>{gc}</Badge>
                <div className="text-2xl font-black text-white">{avg}%</div>
                <div className="text-[9px] text-slate-500 uppercase font-bold mt-1">{items.length} requirements</div>
                <Progress value={avg} className="h-0.5 bg-white/5 mt-2" />
              </div>
            );
          })}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <div className="flex gap-3 flex-1">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input placeholder="Search requirements…" className="pl-10 bg-white/5 border-white/10 h-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Select value={filterProof} onValueChange={setFilterProof}>
            <SelectTrigger className="h-10 bg-white/5 border-white/10 text-xs w-36"><SelectValue placeholder="Proof Status" /></SelectTrigger>
            <SelectContent className="bg-[#0a1122] border-white/10 text-white">
              <SelectItem value="all">All Proofs</SelectItem>
              {PROOF_STATUSES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-primary text-black hover:bg-primary/90 text-[10px] uppercase font-black tracking-widest h-10" onClick={openCreate}>
          <Plus className="w-3.5 h-3.5 mr-2" /> Define Requirement
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              {["Req ID", "Class", "Title", "Score", "Proof", "Next Action", "Actions"].map(h => (
                <TableHead key={h} className={`text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 ${h === 'Actions' ? 'text-right' : h === 'Score' ? 'text-center' : ''}`}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="py-20 text-center">
                <div className="flex flex-col items-center gap-3"><Loader2 className="w-8 h-8 animate-spin text-primary" /><span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Retrieving Governance Data…</span></div>
              </TableCell></TableRow>
            ) : filtered.length > 0 ? filtered.map(req => (
              <TableRow key={req.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="font-mono text-[10px] text-slate-500 py-4">{req.requirement_id}</TableCell>
                <TableCell><Badge variant="outline" className={`${govColor(req.governance_class)} text-[8px] font-black uppercase tracking-widest`}>{req.governance_class}</Badge></TableCell>
                <TableCell className="max-w-xs">
                  <div className="font-bold text-white text-sm">{req.title}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 italic mt-0.5">"{req.description}"</div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`text-sm font-black ${Number(req.compliance_score) >= 80 ? 'text-emerald-400' : Number(req.compliance_score) >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                      {Number(req.compliance_score).toFixed(0)}%
                    </span>
                    <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${Number(req.compliance_score) >= 80 ? 'bg-emerald-400' : Number(req.compliance_score) >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${req.compliance_score}%` }} />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${proofColor(req.proof_status)}`}>
                    {req.proof_status === 'Verified' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    {req.proof_status}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg text-[9px] font-bold text-slate-300 max-w-[180px]">
                    <ArrowRight className="w-3 h-3 text-primary shrink-0" />
                    <span className="truncate">{req.next_best_action || 'No action defined'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-primary" onClick={() => openEdit(req)}><Edit className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400" onClick={() => handleDelete(req.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={7} className="py-20 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">No requirements found. Click "Define Requirement" to add one.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#070d1e] border-white/10 text-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tighter">{editingReq ? `Edit — ${editingReq.requirement_id}` : "Define New Requirement"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title *</Label>
              <Input className="bg-white/5 border-white/10" placeholder="e.g. Data Privacy Compliance" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Governance Class</Label>
              <Select value={form.governance_class} onValueChange={v => setForm(f => ({ ...f, governance_class: v as GovernanceClass }))}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#0a1122] border-white/10 text-white">{GOV_CLASSES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Proof Status</Label>
              <Select value={form.proof_status} onValueChange={v => setForm(f => ({ ...f, proof_status: v as ProofStatus, compliance_score: 0 }))}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#0a1122] border-white/10 text-white">{PROOF_STATUSES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            {/* Live Compliance Score Preview */}
            <div className="md:col-span-2 p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance Score Preview</span>
                <span className={`text-xl font-black ${previewScore >= 80 ? 'text-emerald-400' : previewScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{previewScore}%</span>
              </div>
              <Progress value={previewScore} className="h-2 bg-white/5" />
              <p className="text-[9px] text-slate-600 mt-2 italic">Auto-calculated from Proof Status. Override below if needed.</p>
              <div className="mt-3 space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manual Override (0–100, leave 0 for auto)</Label>
                <Input type="number" min="0" max="100" className="bg-white/5 border-white/10 h-9" value={form.compliance_score} onChange={e => setForm(f => ({ ...f, compliance_score: Number(e.target.value) }))} />
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</Label>
              <Textarea className="bg-white/5 border-white/10 min-h-[70px] resize-none" placeholder="Describe the compliance requirement…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Next Best Action</Label>
              <Input className="bg-white/5 border-white/10" placeholder="e.g. Review GDPR audit logs by end of quarter" value={form.next_best_action} onChange={e => setForm(f => ({ ...f, next_best_action: e.target.value }))} />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Proof Document / URL</Label>
              <Input className="bg-white/5 border-white/10" placeholder="https://… or document reference" value={form.proof_document} onChange={e => setForm(f => ({ ...f, proof_document: e.target.value }))} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="outline" className="border-white/10" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="bg-primary text-black hover:bg-primary/90 font-black uppercase tracking-widest px-8" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editingReq ? "Save Changes" : "Create Requirement"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
