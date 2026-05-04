import React, { useState, useEffect, useMemo } from "react";
import { ShieldCheck, Search, Plus, CheckCircle2, XCircle, FileText, Loader2, Edit, Trash2, MoreVertical, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Audit, AuditStatus, AuditTargetType, AuditFormData } from "../types";
import { kmService, calculateAuditScore, deriveAuditStatus } from "../kmService";
import { useToast } from "@/hooks/use-toast";

const TARGET_TYPES: AuditTargetType[] = ['Asset', 'SOP', 'Requirement', 'System', 'Process'];
const STATUSES: AuditStatus[] = ['Pending', 'In Progress', 'Passed', 'Failed'];

const statusColor = (s: AuditStatus) => ({
  Passed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  Pending: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  'In Progress': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}[s] ?? 'bg-slate-500/20 text-slate-400');

const BLANK_FORM: AuditFormData = {
  title: '', target_type: 'System', status: 'Pending',
  score: 0, proof_url: '', findings: '', auditor: '',
  passed_checks: 0, total_checks: 0,
} as any;

export const AuditConsole = () => {
  const { toast } = useToast();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingAudit, setEditingAudit] = useState<Audit | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [form, setForm] = useState<any>({ ...BLANK_FORM });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setAudits(await kmService.getAudits()); }
    catch (e: any) { toast({ title: "Load failed", description: e.message, variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const filtered = useMemo(() => audits.filter(a => {
    const matchSearch = a.title?.toLowerCase().includes(searchTerm.toLowerCase()) || a.audit_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  }), [audits, searchTerm, filterStatus]);

  // Computed stats
  const passedCount = audits.filter(a => a.status === 'Passed').length;
  const failedCount = audits.filter(a => a.status === 'Failed').length;
  const pendingCount = audits.filter(a => a.status === 'Pending').length;
  const avgScore = audits.length > 0 ? parseFloat((audits.reduce((s, a) => s + Number(a.score), 0) / audits.length).toFixed(1)) : 0;

  // Live score preview from checks
  const liveScore = useMemo(() => calculateAuditScore(Number(form.passed_checks || 0), Number(form.total_checks || 0)), [form.passed_checks, form.total_checks]);
  const liveStatus = useMemo(() => deriveAuditStatus(liveScore), [liveScore]);

  const openCreate = () => { setEditingAudit(null); setForm({ ...BLANK_FORM }); setIsModalOpen(true); };
  const openEdit = (a: Audit) => {
    setEditingAudit(a);
    setForm({ title: a.title, target_type: a.target_type, status: a.status, score: a.score, proof_url: a.proof_url, findings: a.findings, auditor: a.auditor, passed_checks: 0, total_checks: 0 });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title?.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    setSaving(true);
    // Auto-calculate score from checks if provided
    const total = Number(form.total_checks || 0);
    const passed = Number(form.passed_checks || 0);
    const finalScore = total > 0 ? calculateAuditScore(passed, total) : Number(form.score || 0);
    const finalStatus = total > 0 ? deriveAuditStatus(finalScore) : form.status;

    const payload: AuditFormData = {
      title: form.title, target_type: form.target_type, status: finalStatus,
      score: finalScore, proof_url: form.proof_url, findings: form.findings, auditor: form.auditor,
    };

    try {
      if (editingAudit) {
        const updated = await kmService.updateAudit(editingAudit.id, payload);
        setAudits(prev => prev.map(a => a.id === updated.id ? updated : a));
        toast({ title: "Audit updated" });
      } else {
        const created = await kmService.createAudit(payload);
        setAudits(prev => [created, ...prev]);
        toast({ title: "Audit created", description: `ID: ${created.audit_id}` });
      }
      setIsModalOpen(false);
    } catch (e: any) { toast({ title: "Save failed", description: e.message, variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const handleMarkStatus = async (id: string, status: 'Passed' | 'Failed') => {
    try {
      await kmService.markAuditStatus(id, status);
      setAudits(prev => prev.map(a => a.id === id ? { ...a, status, score: status === 'Passed' ? 100 : 0 } : a));
      toast({ title: `Audit marked as ${status}` });
    } catch (e: any) { toast({ title: "Failed", description: e.message, variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    try {
      await kmService.deleteAudit(id);
      setAudits(prev => prev.filter(a => a.id !== id));
      setIsDetailOpen(false);
      toast({ title: "Audit deleted" });
    } catch (e: any) { toast({ title: "Delete failed", description: e.message, variant: "destructive" }); }
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Avg Score</div>
          <div className={`text-3xl font-black mb-2 ${avgScore >= 80 ? 'text-emerald-400' : avgScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{loading ? '—' : `${avgScore}%`}</div>
          <Progress value={avgScore} className="h-1 bg-white/5" />
        </div>
        {[
          { label: 'Passed', count: passedCount, color: 'text-emerald-400', filter: 'Passed' },
          { label: 'Failed', count: failedCount, color: 'text-red-400', filter: 'Failed' },
          { label: 'Pending', count: pendingCount, color: 'text-slate-400', filter: 'Pending' },
        ].map(({ label, count, color, filter }) => (
          <div key={label} className={`p-6 bg-white/[0.02] border rounded-3xl text-center cursor-pointer transition-all ${filterStatus === filter ? 'border-primary/40' : 'border-white/5 hover:border-white/10'}`} onClick={() => setFilterStatus(filterStatus === filter ? 'all' : filter)}>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</div>
            <div className={`text-3xl font-black ${color}`}>{loading ? '—' : count}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Search audits…" className="pl-10 bg-white/5 border-white/10 h-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Button className="bg-primary text-black hover:bg-primary/90 text-[10px] font-black uppercase tracking-widest h-10 px-6" onClick={openCreate}>
          <Plus className="w-3.5 h-3.5 mr-2" /> Initialize Audit
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              {["Audit ID", "Title / Target", "Status", "Score", "Auditor", "Findings", "Actions"].map(h => (
                <TableHead key={h} className={`text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="py-20 text-center">
                <div className="flex flex-col items-center gap-3"><Loader2 className="w-8 h-8 animate-spin text-primary" /><span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Syncing Console…</span></div>
              </TableCell></TableRow>
            ) : filtered.length > 0 ? filtered.map(audit => (
              <TableRow key={audit.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="font-mono text-[10px] text-slate-500 py-5">{audit.audit_id}</TableCell>
                <TableCell>
                  <div className="font-bold text-white text-sm">{audit.title}</div>
                  <div className="text-[9px] text-slate-600 uppercase tracking-tighter mt-0.5">Target: {audit.target_type}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${statusColor(audit.status)} text-[8px] font-black uppercase tracking-widest px-2`}>{audit.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-black ${Number(audit.score) >= 80 ? 'text-emerald-400' : Number(audit.score) >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{Number(audit.score).toFixed(0)}%</span>
                    <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${Number(audit.score) >= 80 ? 'bg-emerald-400' : Number(audit.score) >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${audit.score}%` }} />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-slate-400">{audit.auditor || '—'}</TableCell>
                <TableCell className="max-w-[160px]">
                  <p className="text-[10px] text-slate-500 truncate italic">{audit.findings || 'No findings logged.'}</p>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white"><MoreVertical className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0a1122] border-white/10 text-white">
                      <DropdownMenuItem onClick={() => { setSelectedAudit(audit); setIsDetailOpen(true); }} className="text-xs gap-2 hover:bg-white/5 cursor-pointer"><FileText className="w-3 h-3" /> View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEdit(audit)} className="text-xs gap-2 hover:bg-white/5 cursor-pointer"><Edit className="w-3 h-3" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMarkStatus(audit.id, 'Passed')} className="text-xs gap-2 hover:bg-white/5 cursor-pointer"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Mark Pass</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMarkStatus(audit.id, 'Failed')} className="text-xs gap-2 hover:bg-white/5 cursor-pointer"><XCircle className="w-3 h-3 text-red-400" /> Mark Fail</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(audit.id)} className="text-xs gap-2 text-red-400 hover:bg-red-400/10 cursor-pointer border-t border-white/5 mt-1"><Trash2 className="w-3 h-3" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={7} className="py-20 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">No audits found. Click "Initialize Audit" to create one.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="bg-[#050b18] border-l-white/10 text-white w-full sm:max-w-lg overflow-y-auto">
          {selectedAudit && (
            <>
              <SheetHeader className="pb-6 border-b border-white/5">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="outline" className={`${statusColor(selectedAudit.status)} text-[10px] font-black uppercase tracking-widest px-3 py-1`}>{selectedAudit.status}</Badge>
                  <span className="font-mono text-xs text-slate-500">{selectedAudit.audit_id}</span>
                </div>
                <SheetTitle className="text-2xl font-black text-white uppercase tracking-tight">{selectedAudit.title}</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl text-center">
                  <div className={`text-5xl font-black mb-2 ${Number(selectedAudit.score) >= 80 ? 'text-emerald-400' : Number(selectedAudit.score) >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{Number(selectedAudit.score).toFixed(0)}%</div>
                  <Progress value={Number(selectedAudit.score)} className="h-2 bg-white/5 mb-2" />
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Audit Score</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Target Type', value: selectedAudit.target_type },
                    { label: 'Auditor', value: selectedAudit.auditor || '—' },
                    { label: 'Created', value: new Date(selectedAudit.created_at).toLocaleDateString() },
                    { label: 'Last Updated', value: new Date(selectedAudit.updated_at).toLocaleDateString() },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</div>
                      <div className="text-sm font-bold text-white">{value}</div>
                    </div>
                  ))}
                </div>
                {selectedAudit.findings && (
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Findings</div>
                    <p className="text-sm text-slate-300 leading-relaxed italic">"{selectedAudit.findings}"</p>
                  </div>
                )}
                {selectedAudit.proof_url && (
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Proof Document</div>
                    <a href={selectedAudit.proof_url} target="_blank" rel="noreferrer" className="text-sm text-primary underline break-all">{selectedAudit.proof_url}</a>
                  </div>
                )}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 font-black uppercase tracking-widest text-[10px]" onClick={() => { handleMarkStatus(selectedAudit.id, 'Passed'); setIsDetailOpen(false); }}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Mark Pass
                  </Button>
                  <Button className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 font-black uppercase tracking-widest text-[10px]" onClick={() => { handleMarkStatus(selectedAudit.id, 'Failed'); setIsDetailOpen(false); }}>
                    <XCircle className="w-4 h-4 mr-2" /> Mark Fail
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#070d1e] border-white/10 text-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tighter">{editingAudit ? `Edit — ${editingAudit.audit_id}` : "Initialize New Audit"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audit Title *</Label>
              <Input className="bg-white/5 border-white/10" placeholder="e.g. Q2 2026 Data Compliance Review" value={form.title} onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Type</Label>
              <Select value={form.target_type} onValueChange={v => setForm((f: any) => ({ ...f, target_type: v }))}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#0a1122] border-white/10 text-white">{TARGET_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Auditor</Label>
              <Input className="bg-white/5 border-white/10" placeholder="e.g. Jane Smith / System AI" value={form.auditor} onChange={e => setForm((f: any) => ({ ...f, auditor: e.target.value }))} />
            </div>

            {/* Score Calculator */}
            <div className="md:col-span-2 p-4 bg-white/[0.03] border border-white/5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score Calculator</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xl font-black ${liveScore >= 80 ? 'text-emerald-400' : liveScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{liveScore}%</span>
                  <Badge variant="outline" className={`${statusColor(liveStatus as AuditStatus)} text-[8px] font-black uppercase tracking-widest`}>{liveStatus}</Badge>
                </div>
              </div>
              <Progress value={liveScore} className="h-2 bg-white/5" />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Passed Checks</Label>
                  <Input type="number" min="0" className="bg-white/5 border-white/10 h-9" placeholder="e.g. 18" value={form.passed_checks} onChange={e => setForm((f: any) => ({ ...f, passed_checks: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Total Checks</Label>
                  <Input type="number" min="0" className="bg-white/5 border-white/10 h-9" placeholder="e.g. 20" value={form.total_checks} onChange={e => setForm((f: any) => ({ ...f, total_checks: e.target.value }))} />
                </div>
              </div>
              <p className="text-[9px] text-slate-600 italic">Score = Passed ÷ Total × 100. Leave 0 for manual status.</p>
            </div>

            {Number(form.total_checks || 0) === 0 && (
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manual Status</Label>
                <Select value={form.status} onValueChange={v => setForm((f: any) => ({ ...f, status: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0a1122] border-white/10 text-white">{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}

            <div className={Number(form.total_checks || 0) === 0 ? "space-y-1.5" : "md:col-span-2 space-y-1.5"}>
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Proof URL</Label>
              <Input className="bg-white/5 border-white/10" placeholder="https://…" value={form.proof_url} onChange={e => setForm((f: any) => ({ ...f, proof_url: e.target.value }))} />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Findings / Notes</Label>
              <Textarea className="bg-white/5 border-white/10 min-h-[80px] resize-none" placeholder="Describe audit findings, gaps, or observations…" value={form.findings} onChange={e => setForm((f: any) => ({ ...f, findings: e.target.value }))} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="outline" className="border-white/10" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="bg-primary text-black hover:bg-primary/90 font-black uppercase tracking-widest px-8" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editingAudit ? "Save Changes" : "Initialize Audit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
