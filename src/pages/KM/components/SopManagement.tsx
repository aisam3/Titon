import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus, FileText, Users, Clock, ChevronRight, Loader2, Edit, Trash2, X, GripVertical, PlusCircle } from "lucide-react";
import { kmService } from "../kmService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sop, SopStatus, SopStep, SopFormData } from "../types";
import { useToast } from "@/hooks/use-toast";

const STATUSES: SopStatus[] = ['Published', 'Draft', 'Review', 'Deprecated'];
const DEPARTMENTS = ['Operations', 'Sales', 'Marketing', 'Finance', 'HR', 'Technical', 'Compliance', 'Executive'];

const statusColor = (s: SopStatus) => ({
  Published: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Draft: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Review: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Deprecated: 'bg-red-500/20 text-red-400 border-red-500/30',
}[s] ?? 'bg-slate-500/20 text-slate-400');

const BLANK_STEP = (): SopStep => ({ id: crypto.randomUUID(), title: '', content: '', order: 0 });
const BLANK_FORM: SopFormData = { title: '', version: '1.0.0', owner: '', department: 'Operations', status: 'Draft', description: '', steps: [], attachments: [] };

export const SopManagement = () => {
  const { toast } = useToast();
  const [sops, setSops] = useState<Sop[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedSop, setSelectedSop] = useState<Sop | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSop, setEditingSop] = useState<Sop | null>(null);
  const [form, setForm] = useState<SopFormData>(BLANK_FORM);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setSops(await kmService.getSops()); }
    catch (e: any) { toast({ title: "Load failed", description: e.message, variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const filtered = useMemo(() => sops.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.sop_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  }), [sops, searchTerm, filterStatus]);

  const openCreate = () => { setEditingSop(null); setForm(BLANK_FORM); setIsModalOpen(true); };
  const openEdit = (s: Sop) => {
    setEditingSop(s);
    setForm({ title: s.title, version: s.version, owner: s.owner, department: s.department, status: s.status, description: s.description, steps: [...s.steps], attachments: s.attachments });
    setIsModalOpen(true);
  };

  // Step CRUD within form
  const addStep = () => {
    const step = BLANK_STEP();
    step.order = form.steps.length + 1;
    setForm(f => ({ ...f, steps: [...f.steps, step] }));
  };
  const updateStep = (id: string, field: keyof SopStep, value: string) => {
    setForm(f => ({ ...f, steps: f.steps.map(s => s.id === id ? { ...s, [field]: value } : s) }));
  };
  const removeStep = (id: string) => {
    setForm(f => ({ ...f, steps: f.steps.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i + 1 })) }));
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.owner.trim()) {
      toast({ title: "Validation Error", description: "Title and Owner are required.", variant: "destructive" }); return;
    }
    setSaving(true);
    try {
      if (editingSop) {
        const updated = await kmService.updateSop(editingSop.id, form);
        setSops(prev => prev.map(s => s.id === updated.id ? updated : s));
        toast({ title: "SOP updated" });
      } else {
        const created = await kmService.createSop(form);
        setSops(prev => [created, ...prev]);
        toast({ title: "SOP created", description: `ID: ${created.sop_id}` });
      }
      setIsModalOpen(false);
    } catch (e: any) { toast({ title: "Save failed", description: e.message, variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await kmService.deleteSop(id);
      setSops(prev => prev.filter(s => s.id !== id));
      setIsViewerOpen(false);
      toast({ title: "SOP deleted" });
    } catch (e: any) { toast({ title: "Delete failed", description: e.message, variant: "destructive" }); }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <div className="flex gap-3 flex-1">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input placeholder="Search SOP library…" className="pl-10 bg-white/5 border-white/10 h-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-10 bg-white/5 border-white/10 text-xs w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent className="bg-[#0a1122] border-white/10 text-white">
              <SelectItem value="all">All Status</SelectItem>
              {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-primary text-black hover:bg-primary/90 text-[10px] uppercase font-black tracking-widest h-10" onClick={openCreate}>
          <Plus className="w-3.5 h-3.5 mr-2" /> New Procedure
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3">
        {STATUSES.map(s => (
          <div key={s} className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${filterStatus === s ? 'border-primary/40 bg-primary/5' : 'border-white/5 bg-white/[0.02]'}`} onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}>
            <div className="text-xl font-black text-white">{sops.filter(x => x.status === s).length}</div>
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{s}</div>
          </div>
        ))}
      </div>

      {/* SOP Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Syncing SOP Library…</span>
          </div>
        ) : filtered.length > 0 ? filtered.map(sop => (
          <div key={sop.id} className="group relative p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.04] hover:border-primary/20 transition-all duration-300 cursor-pointer" onClick={() => { setSelectedSop(sop); setIsViewerOpen(true); }}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-2xl"><FileText className="w-5 h-5 text-primary" /></div>
              <Badge variant="outline" className={`${statusColor(sop.status)} text-[8px] font-black uppercase tracking-widest px-2`}>{sop.status}</Badge>
            </div>
            <div className="mb-5">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{sop.sop_id} • v{sop.version} • {sop.department}</div>
              <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors tracking-tight">{sop.title}</h3>
              <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed italic">"{sop.description || 'No description.'}"</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5"><Users className="w-3 h-3 text-slate-500" /><span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{sop.owner}</span></div>
                <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-slate-500" /><span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{sop.step_count ?? sop.steps?.length ?? 0} Steps</span></div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary transition-all group-hover:translate-x-1" />
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center text-slate-500 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-white/5 rounded-3xl">
            No SOPs found. Click "New Procedure" to create one.
          </div>
        )}
      </div>

      {/* Viewer Sheet */}
      <Sheet open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <SheetContent className="bg-[#050b18] border-l-white/10 text-white w-full sm:max-w-3xl overflow-y-auto">
          {selectedSop && (
            <div className="py-6">
              <SheetHeader className="space-y-4 pb-8 border-b border-white/10">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className={`${statusColor(selectedSop.status)} uppercase text-[9px] tracking-widest px-3 py-1`}>{selectedSop.status}</Badge>
                  <span className="text-slate-500 text-[10px] font-mono">{selectedSop.sop_id}</span>
                  <span className="text-slate-500 text-[10px] font-mono">v{selectedSop.version}</span>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">{selectedSop.department}</span>
                </div>
                <SheetTitle className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{selectedSop.title}</SheetTitle>
                <SheetDescription className="text-slate-300 text-sm leading-relaxed">{selectedSop.description}</SheetDescription>
              </SheetHeader>

              <div className="py-8 space-y-8">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-6">Step-by-Step Procedure</h4>
                  <div className="space-y-4">
                    {(selectedSop.steps || []).length > 0 ? (selectedSop.steps || []).map((step, idx) => (
                      <div key={step.id || idx} className="relative pl-12 pb-6 border-l border-white/10 last:pb-0">
                        <div className="absolute left-[-13px] top-0 w-6 h-6 rounded-full bg-slate-900 border border-white/20 flex items-center justify-center text-[10px] font-black text-primary">{idx + 1}</div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-white tracking-tight">{step.title}</h5>
                          <p className="text-slate-400 text-sm leading-relaxed">{step.content}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-slate-600 text-sm italic">No steps defined for this SOP.</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <Button className="flex-1 bg-primary text-black hover:bg-primary/90 font-black uppercase tracking-widest" onClick={() => { setIsViewerOpen(false); openEdit(selectedSop); }}>
                    <Edit className="w-4 h-4 mr-2" /> Edit SOP
                  </Button>
                  <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(selectedSop.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Create / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#070d1e] border-white/10 text-white sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tighter">{editingSop ? `Edit — ${editingSop.sop_id}` : "Create New SOP"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title *</Label>
                <Input className="bg-white/5 border-white/10" placeholder="e.g. Client Onboarding Protocol" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Owner *</Label>
                <Input className="bg-white/5 border-white/10" placeholder="e.g. John Doe" value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Department</Label>
                <Select value={form.department} onValueChange={v => setForm(f => ({ ...f, department: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0a1122] border-white/10 text-white">{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Version</Label>
                <Input className="bg-white/5 border-white/10" placeholder="1.0.0" value={form.version} onChange={e => setForm(f => ({ ...f, version: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as SopStatus }))}>
                  <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0a1122] border-white/10 text-white">{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</Label>
                <Textarea className="bg-white/5 border-white/10 min-h-[70px] resize-none" placeholder="Describe this SOP's purpose…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>

            {/* Step Builder */}
            <div className="space-y-3 border-t border-white/5 pt-5">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Procedure Steps ({form.steps.length})</Label>
                <Button type="button" variant="outline" size="sm" className="h-8 border-white/10 text-[9px] font-black uppercase tracking-widest" onClick={addStep}>
                  <PlusCircle className="w-3 h-3 mr-1.5" /> Add Step
                </Button>
              </div>

              {form.steps.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-white/5 rounded-2xl text-center">
                  <p className="text-slate-600 text-xs uppercase font-black tracking-widest">No steps yet. Click "Add Step" to build the procedure.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {form.steps.map((step, idx) => (
                    <div key={step.id} className="group p-4 bg-white/[0.03] border border-white/5 rounded-xl space-y-2 relative">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-primary w-5 shrink-0">#{idx + 1}</span>
                        <Input className="bg-white/5 border-white/10 h-8 text-sm flex-1" placeholder="Step title…" value={step.title} onChange={e => updateStep(step.id, 'title', e.target.value)} />
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-red-400 shrink-0" onClick={() => removeStep(step.id)}><X className="w-3.5 h-3.5" /></Button>
                      </div>
                      <Textarea className="bg-white/5 border-white/10 min-h-[56px] resize-none text-xs" placeholder="Describe what to do in this step…" value={step.content} onChange={e => updateStep(step.id, 'content', e.target.value)} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="outline" className="border-white/10" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="bg-primary text-black hover:bg-primary/90 font-black uppercase tracking-widest px-8" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editingSop ? "Save Changes" : "Create SOP"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
