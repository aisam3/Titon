import React, { useState, useRef } from "react";
import {
  Sparkles, Search, Send, BrainCircuit, FileText,
  Database, ShieldCheck, ChevronRight, Loader2, Tag
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { kmService } from "../kmService";
import { useToast } from "@/hooks/use-toast";

interface SearchResults {
  assets: any[];
  sops: any[];
  requirements: any[];
}

const QUICK_QUERIES = [
  "Show all active assets",
  "What SOPs are published?",
  "Requirements with low compliance",
  "Pending audit items",
];

export const AskTitonAI = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (q?: string) => {
    const term = q ?? query;
    if (!term.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await kmService.globalSearch(term);
      setResults(data);
      if (!q) setQuery(term);
    } catch (e: any) {
      toast({ title: "Search failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const totalResults = results ? results.assets.length + results.sops.length + results.requirements.length : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 shadow-[0_0_40px_rgba(132,206,58,0.2)]">
          <BrainCircuit className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
            Ask <span className="text-primary italic">TITON AI</span>
          </h2>
          <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">
            Semantic Search Across All Vault Data
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full relative group max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-all" />
          <Input
            ref={inputRef}
            placeholder="Search assets, SOPs, requirements…"
            className="w-full h-16 pl-16 pr-16 bg-white/[0.03] border-white/10 rounded-3xl text-base font-medium focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-700"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <Button
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-primary text-black rounded-2xl hover:bg-primary/80 transition-all"
            onClick={() => handleSearch()}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>

        {/* Quick query chips */}
        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_QUERIES.map(q => (
            <button
              key={q}
              onClick={() => { setQuery(q); handleSearch(q); }}
              className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 hover:text-primary hover:border-primary/30 transition-all uppercase tracking-widest"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div className="space-y-8">
          {loading ? (
            <div className="flex flex-col items-center gap-4 py-16">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Searching Vault…</span>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="text-slate-600 text-4xl">◈</div>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest">No results found for "{query}"</p>
              <p className="text-slate-600 text-[10px]">Try a broader term or check that data exists in the vault</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {totalResults} result{totalResults !== 1 ? 's' : ''} for "{query}"
                </span>
                <button onClick={() => { setResults(null); setSearched(false); setQuery(""); }} className="text-[9px] text-slate-600 hover:text-slate-400 uppercase font-black tracking-widest transition-colors">Clear</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Assets */}
                {results!.assets.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Database className="w-3 h-3 text-primary" /> Assets ({results!.assets.length})
                    </h4>
                    {results!.assets.map((a: any) => (
                      <div key={a.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-primary/20 transition-all group cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-bold text-white group-hover:text-primary transition-colors tracking-tight line-clamp-1">{a.name}</span>
                          <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-primary transition-all shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-[9px] text-slate-600">{a.asset_id}</span>
                          <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest bg-primary/5 text-primary border-primary/20 px-1.5">{a.type}</Badge>
                          {a.status && <Badge variant="outline" className="text-[7px] font-black uppercase border-white/10 text-slate-500 px-1.5">{a.status}</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* SOPs */}
                {results!.sops.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <FileText className="w-3 h-3 text-blue-400" /> SOPs ({results!.sops.length})
                    </h4>
                    {results!.sops.map((s: any) => (
                      <div key={s.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-blue-400/20 transition-all group cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight line-clamp-1">{s.title}</span>
                          <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-blue-400 transition-all shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-[9px] text-slate-600">{s.sop_id}</span>
                          {s.status && <Badge variant="outline" className="text-[7px] font-black uppercase border-white/10 text-slate-500 px-1.5">{s.status}</Badge>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Requirements */}
                {results!.requirements.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3 text-amber-400" /> Requirements ({results!.requirements.length})
                    </h4>
                    {results!.requirements.map((r: any) => (
                      <div key={r.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-amber-400/20 transition-all group cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors tracking-tight line-clamp-1">{r.title}</span>
                          <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-amber-400 transition-all shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-[9px] text-slate-600">{r.requirement_id}</span>
                          {r.compliance_score !== undefined && (
                            <span className={`text-[9px] font-black ${Number(r.compliance_score) >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {Number(r.compliance_score).toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Idle state quick actions */}
      {!searched && (
        <div className="flex flex-wrap justify-center gap-4 pt-6">
          {[
            { icon: <Sparkles className="w-4 h-4 text-primary" />, label: "System Optimization Tips" },
            { icon: <Database className="w-4 h-4 text-blue-400" />, label: "Query Asset Analytics" },
            { icon: <Tag className="w-4 h-4 text-amber-400" />, label: "Browse by Type" },
          ].map(({ icon, label }) => (
            <button key={label} className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-xs font-bold text-slate-400">
              {icon} {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
