import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus, Filter, MoreVertical, Eye, Edit, Trash2, X, Loader2, Tag, User, Shield, Calendar, ExternalLink } from "lucide-react";
import { kmService } from "../kmService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Asset, AssetStatus, AssetType, Classification, AssetFormData } from "../types";
import { useToast } from "@/hooks/use-toast";

const ASSET_TYPES: AssetType[] = ['Service', 'Offer', 'Package', 'Question', 'UseCase', 'Framework', 'GHLAsset', 'GHLFeature'];
const STATUSES: AssetStatus[] = ['Active', 'Draft', 'Inactive', 'Archived'];
const CLASSIFICATIONS: Classification[] = ['Internal', 'External', 'Public', 'Restricted', 'Highly Confidential'];

const BLANK_FORM: AssetFormData = {
  name: '', type: 'Service', status: 'Draft', owner: '',
  classification: 'Internal', access_label: 'Clearance Level 1', notes: '',
};

const statusColor = (s: AssetStatus) => ({
  Active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Inactive: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  Archived: 'bg-red-500/20 text-red-400 border-red-500/30',
  Draft: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}[s] ?? 'bg-slate-500/20 text-slate-400');

export const AssetRegistry = () => {
  const { toast } = useToast();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [form, setForm] = useState<AssetFormData>(BLANK_FORM);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { setAssets(await kmService.getAssets()); }
    catch (e: any) { toast({ title: "Load failed", description: e.message, variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const filtered = useMemo(() => assets.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.asset_id.toLowerCase().includes(searchTerm.toLowerCase()) || a.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "all" || a.type === filterType;
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    const matchClass = filterClass === "all" || a.classification === filterClass;
    return matchSearch && matchType && matchStatus && matchClass;
  }), [assets, searchTerm, filterType, filterStatus, filterClass]);

  const openCreate = () => { setEditingAsset(null); setForm(BLANK_FORM); setIsModalOpen(true); };
  const openEdit = (a: Asset) => {
    setEditingAsset(a);
    setForm({ name: a.name, type: a.type, status: a.status, owner: a.owner, classification: a.classification, access_label: a.access_label, notes: a.notes });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.owner.trim()) {
      toast({ title: "Validation Error", description: "Name and Owner are required.", variant: "destructive" }); return;
    }
    setSaving(true);
    try {
      if (editingAsset) {
        const updated = await kmService.updateAsset(editingAsset.id, form);
        setAssets(prev => prev.map(a => a.id === updated.id ? updated : a));
        toast({ title: "Asset updated" });
      } else {
        const created = await kmService.createAsset(form);
        setAssets(prev => [created, ...prev]);
        toast({ title: "Asset created", description: `ID: ${created.asset_id}` });
      }
      setIsModalOpen(false);
    } catch (e: any) { toast({ title: "Save failed", description: e.message, variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await kmService.deleteAsset(id);
      setAssets(prev => prev.filter(a => a.id !== id));
      setIsDetailOpen(false);
      toast({ title: "Asset deleted" });
    } catch (e: any) { toast({ title: "Delete failed", description: e.message, variant: "destructive" }); }
  };

  const activeFilters = [filterType !== "all", filterStatus !== "all", filterClass !== "all"].filter(Boolean).length;

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Search by ID, name, owner…" className="pl-10 bg-white/5 border-white/10 h-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className={`border-white/10 hover:bg-white/5 text-[10px] uppercase font-black tracking-widest h-10 relative ${showFilters ? 'border-primary/40 text-primary' : ''}`} onClick={() => setShowFilters(v => !v)}>
            <Filter className="w-3.5 h-3.5 mr-2" /> Filters
            {activeFilters > 0 && <span className="absolute -top-1.5 -right-1.5 bg-primary text-black text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center">{activeFilters}</span>}
          </Button>
          <Button className="bg-primary text-black hover:bg-primary/90 text-[10px] uppercase font-black tracking-widest h-10" onClick={openCreate}>
            <Plus className="w-3.5 h-3.5 mr-2" /> New Asset
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Type:</span>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-8 bg-white/5 border-white/10 text-xs w-36"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#0a1122] border-white/10 text-white">
                <SelectItem value="all">All Types</SelectItem>
                {ASSET_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Status:</span>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-8 bg-white/5 border-white/10 text-xs w-32"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#0a1122] border-white/10 text-white">
                <SelectItem value="all">All</SelectItem>
                {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Class:</span>
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger className="h-8 bg-white/5 border-white/10 text-xs w-44"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#0a1122] border-white/10 text-white">
                <SelectItem value="all">All</SelectItem>
                {CLASSIFICATIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {activeFilters > 0 && (
            <Button variant="ghost" size="sm" className="h-8 text-slate-500 hover:text-red-400 text-[9px] uppercase font-black" onClick={() => { setFilterType("all"); setFilterStatus("all"); setFilterClass("all"); }}>
              <X className="w-3 h-3 mr-1" /> Clear
            </Button>
          )}
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest self-center ml-auto">{filtered.length} of {assets.length} assets</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              {["Asset ID","Name","Type","Status","Classification","Owner","Actions"].map(h => (
                <TableHead key={h} className={`text-[10px] font-black uppercase tracking-widest text-slate-400 py-4 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="py-20 text-center">
                <div className="flex flex-col items-center gap-3"><Loader2 className="w-8 h-8 animate-spin text-primary" /><span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Accessing Registry…</span></div>
              </TableCell></TableRow>
            ) : filtered.length > 0 ? filtered.map(asset => (
              <TableRow key={asset.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                <TableCell className="font-mono text-[10px] text-slate-400 py-4">{asset.asset_id}</TableCell>
                <TableCell className="font-bold text-sm text-white">
                  <button onClick={() => { setSelectedAsset(asset); setIsDetailOpen(true); }} className="hover:text-primary transition-colors text-left">{asset.name}</button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tight gap-1">
                    <Tag className="w-3 h-3" />{asset.type}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${statusColor(asset.status)} text-[9px] font-black uppercase tracking-widest px-2 py-0.5`}>{asset.status}</Badge>
                </TableCell>
                <TableCell className="text-[10px] text-slate-400 uppercase tracking-tighter font-bold">
                  <div className="flex items-center gap-1"><Shield className="w-3 h-3 opacity-40" />{asset.classification}</div>
                </TableCell>
                <TableCell><div className="flex items-center text-xs text-slate-300 gap-1"><User className="w-3 h-3 opacity-40" />{asset.owner}</div></TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white"><MoreVertical className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0a1122] border-white/10 text-white">
                      <DropdownMenuItem onClick={() => { setSelectedAsset(asset); setIsDetailOpen(true); }} className="text-xs gap-2 hover:bg-white/5 cursor-pointer"><Eye className="w-3 h-3" /> View</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEdit(asset)} className="text-xs gap-2 hover:bg-white/5 cursor-pointer"><Edit className="w-3 h-3" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(asset.id)} className="text-xs gap-2 text-red-400 hover:bg-red-400/10 cursor-pointer"><Trash2 className="w-3 h-3" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={7} className="py-20 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">No assets found. Click "New Asset" to create one.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Drawer */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="bg-[#050b18] border-l-white/10 text-white w-full sm:max-w-xl overflow-y-auto">
          {selectedAsset && (
            <>
              <SheetHeader className="space-y-4 pb-8 border-b border-white/5">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={`${statusColor(selectedAsset.status)} text-[10px] font-black uppercase tracking-widest px-3 py-1`}>{selectedAsset.status}</Badge>
                  <span className="font-mono text-xs text-slate-500">{selectedAsset.asset_id}</span>
                </div>
                <SheetTitle className="text-3xl font-black text-white uppercase tracking-tight leading-none">{selectedAsset.name}</SheetTitle>
                <SheetDescription className="text-slate-400 text-sm italic">"{selectedAsset.notes || 'No notes.'}"</SheetDescription>
              </SheetHeader>
              <div className="py-8 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Type', value: selectedAsset.type },
                    { label: 'Owner', value: selectedAsset.owner },
                    { label: 'Classification', value: selectedAsset.classification },
                    { label: 'Access Label', value: selectedAsset.access_label },
                    { label: 'Created', value: new Date(selectedAsset.created_at).toLocaleDateString() },
                    { label: 'Updated', value: new Date(selectedAsset.updated_at).toLocaleDateString() },
                  ].map(({ label, value }) => (
                    <div key={label} className="space-y-1">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</div>
                      <div className="text-sm font-bold text-white">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Linked SOPs', val: selectedAsset.linked_sop_count ?? 0, color: 'text-primary' },
                    { label: 'Linked Reqs', val: selectedAsset.linked_req_count ?? 0, color: 'text-amber-400' },
                    { label: 'Linked Audits', val: selectedAsset.linked_audit_count ?? 0, color: 'text-blue-400' },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                      <div className={`text-2xl font-black ${color}`}>{val}</div>
                      <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-primary text-black hover:bg-primary/90 font-black uppercase tracking-widest" onClick={() => { setIsDetailOpen(false); openEdit(selectedAsset); }}>
                    <Edit className="w-4 h-4 mr-2" /> Edit Asset
                  </Button>
                  <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(selectedAsset.id)}>
                    <Trash2 className="w-4 h-4" />
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
            <DialogTitle className="text-xl font-black uppercase tracking-tighter">{editingAsset ? `Edit — ${editingAsset.asset_id}` : "Register New Asset"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asset Name *</Label>
              <Input className="bg-white/5 border-white/10" placeholder="e.g. Standard GHL Onboarding Flow" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type *</Label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as AssetType }))}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#0a1122] border-white/10 text-white">{ASSET_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as AssetStatus }))}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#0a1122] border-white/10 text-white">{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Owner *</Label>
              <Input className="bg-white/5 border-white/10" placeholder="e.g. John Doe" value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Classification</Label>
              <Select value={form.classification} onValueChange={v => setForm(f => ({ ...f, classification: v as Classification }))}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#0a1122] border-white/10 text-white">{CLASSIFICATIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Access Label</Label>
              <Input className="bg-white/5 border-white/10" placeholder="e.g. Clearance Level 2" value={form.access_label} onChange={e => setForm(f => ({ ...f, access_label: e.target.value }))} />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notes</Label>
              <Textarea className="bg-white/5 border-white/10 min-h-[80px] resize-none" placeholder="Internal notes about this asset…" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="outline" className="border-white/10" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="bg-primary text-black hover:bg-primary/90 font-black uppercase tracking-widest px-8" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editingAsset ? "Save Changes" : "Create Asset"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
