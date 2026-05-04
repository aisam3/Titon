import React, { useState } from "react";
import { 
  Search, 
  FileText, 
  BookOpen, 
  Database, 
  HelpCircle, 
  Layers, 
  Zap, 
  ChevronRight,
  Menu,
  Clock,
  MoreVertical,
  Star
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const documents = [
  { 
    id: "doc-1", 
    title: "Requirement Inventory", 
    icon: <Database className="w-4 h-4" />,
    items: ["GDPR Compliance", "Data Sovereignty", "Encryption Standards"]
  },
  { 
    id: "doc-2", 
    title: "SOP Library", 
    icon: <FileText className="w-4 h-4" />,
    items: ["Client Onboarding", "Incident Response", "Sub-account Pruning"]
  },
  { 
    id: "doc-3", 
    title: "Question Bank", 
    icon: <HelpCircle className="w-4 h-4" />,
    items: ["Sales FAQs", "Technical Support", "Strategic Discovery"]
  },
  { 
    id: "doc-4", 
    title: "Feature Catalog", 
    icon: <Zap className="w-4 h-4" />,
    items: ["Automated CRM", "AI Calling", "Review Management"]
  },
  { 
    id: "doc-5", 
    title: "Learning Anchors", 
    icon: <BookOpen className="w-4 h-4" />,
    items: ["System Architecture", "Optimization Theory"]
  }
];

export const KnowledgeHub = () => {
  const [selectedDoc, setSelectedDoc] = useState(documents[0]);
  const [selectedItem, setSelectedItem] = useState(documents[0].items[0]);

  return (
    <div className="flex h-[70vh] bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
      {/* Notion-style Left Sidebar */}
      <div className="w-72 border-r border-white/5 bg-[#0a1122]/50 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
            <Input 
              placeholder="Search Workspace..." 
              className="h-8 pl-8 bg-white/5 border-white/5 text-[10px] uppercase font-black tracking-widest placeholder:text-slate-600"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-6">
            {documents.map((doc) => (
              <div key={doc.id} className="space-y-1">
                <button 
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    selectedDoc.id === doc.id ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-white/5'
                  }`}
                >
                  {doc.icon}
                  <span className="text-xs font-black uppercase tracking-tight">{doc.title}</span>
                </button>
                {selectedDoc.id === doc.id && (
                  <div className="ml-7 space-y-1 mt-1 border-l border-white/5">
                    {doc.items.map(item => (
                      <button
                        key={item}
                        onClick={() => setSelectedItem(item)}
                        className={`w-full text-left px-4 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                          selectedItem === item ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-primary transition-all">
            <Star className="w-3 h-3" /> Favorites
          </button>
        </div>
      </div>

      {/* Content Reader */}
      <div className="flex-1 flex flex-col bg-transparent">
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-8">
          <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {selectedDoc.title} <ChevronRight className="w-3 h-3" /> {selectedItem}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
              <Clock className="w-3 h-3" /> Last edited 3h ago
            </div>
            <button className="p-1.5 text-slate-500 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-12">
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="space-y-4">
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
                {selectedItem}
              </h1>
              <div className="flex items-center gap-3">
                <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] uppercase font-black tracking-widest">v2.1.0</Badge>
                <Badge className="bg-white/5 text-slate-400 border-white/10 text-[8px] uppercase font-black tracking-widest">Active System</Badge>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <div className="p-6 bg-white/[0.03] border-l-4 border-primary rounded-r-2xl text-slate-300 leading-relaxed italic mb-8">
                "This document outlines the core architecture and strategic alignment for {selectedItem} within the TITON ecosystem. Access restricted to L2 clearance."
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">Overview</h3>
              <p className="text-slate-400 leading-relaxed mb-6">
                The {selectedItem} protocol serves as a foundational anchor for system operations. 
                Integrating this module requires strict adherence to the L3 optimization framework and 
                pre-authorized key rotations.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Key Insight</div>
                  <div className="text-xs text-white font-medium">94% efficiency increase observed after v2 implementation.</div>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Risk Factor</div>
                  <div className="text-xs text-white font-medium">Deviation of {'>'}5% triggers automatic system lockdown.</div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">Technical Specifications</h3>
              <ul className="space-y-3 text-slate-400 text-sm list-disc pl-5">
                <li>Automated synchronization across all GHL sub-accounts.</li>
                <li>Real-time telemetry logging via TITON-Core.</li>
                <li>Encrypted storage at rest using AES-256 standards.</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
