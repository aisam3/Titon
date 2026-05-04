import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Database, 
  FileText, 
  ShieldCheck, 
  Command, 
  Loader2,
  X,
  ChevronRight
} from "lucide-react";
import { kmService } from "@/pages/KM/kmService";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

export const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ assets: any[], sops: any[], requirements: any[] }>({
    assets: [], sops: [], requirements: []
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 1) {
        setLoading(true);
        try {
          const res = await kmService.globalSearch(query);
          setResults(res);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults({ assets: [], sops: [], requirements: [] });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all group"
      >
        <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Search Vault...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#0a1122]/95 backdrop-blur-3xl border-white/10 text-white p-0 max-w-2xl overflow-hidden rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center border-b border-white/10 p-6">
            <Search className="w-5 h-5 text-primary mr-3" />
            <input
              placeholder="Search assets, SOPs, requirements..."
              className="flex-1 bg-transparent border-none outline-none text-lg font-medium placeholder:text-slate-600"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-xl text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Querying Core...</span>
              </div>
            ) : query === "" ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600 gap-2">
                <Command className="w-12 h-12 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">TITON SEARCH v1.0</p>
              </div>
            ) : (
              <>
                {results.assets.length > 0 && (
                  <section className="space-y-3">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Database className="w-3 h-3 text-primary" /> Central Assets
                    </h3>
                    <div className="grid gap-2">
                      {results.assets.map(asset => (
                        <button key={asset.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-primary/10 hover:border-primary/30 transition-all text-left group">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{asset.name}</span>
                            <span className="text-[9px] font-mono text-slate-500 uppercase">{asset.asset_id} • {asset.type}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {results.sops.length > 0 && (
                  <section className="space-y-3">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-3 h-3 text-blue-400" /> Operational SOPs
                    </h3>
                    <div className="grid gap-2">
                      {results.sops.map(sop => (
                        <button key={sop.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-blue-400/10 hover:border-blue-400/30 transition-all text-left group">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{sop.title}</span>
                            <span className="text-[9px] font-mono text-slate-500 uppercase">{sop.sop_id}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {results.requirements.length > 0 && (
                  <section className="space-y-3">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3 text-amber-400" /> Governance Requirements
                    </h3>
                    <div className="grid gap-2">
                      {results.requirements.map(req => (
                        <button key={req.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-amber-400/10 hover:border-amber-400/30 transition-all text-left group">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{req.title}</span>
                            <span className="text-[9px] font-mono text-slate-500 uppercase">{req.requirement_id}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {results.assets.length === 0 && results.sops.length === 0 && results.requirements.length === 0 && (
                  <div className="text-center py-10 text-slate-500 text-xs italic">
                    No records found matching "{query}"
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
