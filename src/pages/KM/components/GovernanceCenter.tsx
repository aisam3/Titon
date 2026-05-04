import React, { useState } from "react";
import { 
  ShieldAlert, 
  Search, 
  Lock, 
  FileLock, 
  History, 
  AlertTriangle,
  ChevronRight,
  Eye,
  UserPlus,
  RefreshCcw
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const policies = [
  { id: "POL-001", name: "L3 Data Access Policy", scope: "Global", status: "Active", risk: "Low" },
  { id: "POL-002", name: "Key Rotation Protocol", scope: "Restricted", status: "Review Required", risk: "High" },
  { id: "POL-003", name: "External Vendor Clearance", scope: "Third-party", status: "Active", risk: "Medium" }
];

const reviews = [
  { q: "Q1 2026", date: "2026-03-31", status: "Completed", compliance: "100%", auditor: "John Doe" },
  { q: "Q4 2025", date: "2025-12-31", status: "Archived", compliance: "98.5%", auditor: "System AI" }
];

export const GovernanceCenter = () => {
  return (
    <div className="space-y-10 pb-20">
      {/* Policy Management */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Access Policy Engine</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Manage system-wide clearance and permissions</p>
          </div>
          <Button className="bg-white text-black hover:bg-primary transition-all text-[10px] font-black uppercase tracking-widest h-10">
            Define New Policy
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {policies.map(policy => (
            <div key={policy.id} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-primary/20 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/5 rounded-2xl group-hover:text-primary transition-colors">
                  <FileLock className="w-6 h-6" />
                </div>
                <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest ${
                  policy.risk === 'High' ? 'text-red-500 border-red-500/20' : 'text-primary border-primary/20'
                }`}>
                  Risk: {policy.risk}
                </Badge>
              </div>
              <div className="space-y-1 mb-6">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{policy.id} • {policy.scope}</div>
                <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors tracking-tight">{policy.name}</h4>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <RefreshCcw className="w-3 h-3" /> {policy.status}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Quarterly Reviews */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <History className="w-5 h-5 text-primary" /> Quarterly Review Logs
          </h3>
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-4">Quarter</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400">Compliance</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map(review => (
                  <TableRow key={review.q} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="font-bold text-white py-4">{review.q}</TableCell>
                    <TableCell className="text-xs text-slate-500">{review.date}</TableCell>
                    <TableCell className="text-xs font-black text-primary">{review.compliance}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Restricted Assets Monitor */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-500" /> Strategic Restricted Assets
          </h3>
          <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-3xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <AlertTriangle className="w-20 h-20 text-red-500" />
            </div>
            <div className="space-y-2 relative z-10">
              <div className="text-3xl font-black text-white">02</div>
              <div className="text-xs text-slate-400 uppercase tracking-[0.2em] font-bold">Unreviewed Critical Flags</div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm italic">
              "Strategic assets marked as 'Restricted' require manual quarterly overrides. Failure to review within 72 hours results in automatic decryption key revocation."
            </p>
            <Button className="w-full bg-red-500 text-white hover:bg-red-600 font-black uppercase tracking-widest py-6">
              Launch Urgent Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
