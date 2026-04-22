import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Zap, Cpu, Globe } from "lucide-react";

interface CustomPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (entries: number) => void;
  isLoading: boolean;
}

export const CustomPricingModal: React.FC<CustomPricingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const [entries, setEntries] = useState(1000);
  const minEntries = 1000;
  const maxEntries = 50000;
  const pricePerEntry = 0.18;
  const totalPrice = Math.round(entries * pricePerEntry);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-2xl bg-slate-950 border-white/10 p-0 overflow-hidden border-0 shadow-[0_0_100px_rgba(132,206,58,0.1)] max-h-[95vh] h-fit overflow-y-auto custom-scrollbar">
        <div className="relative p-6 sm:p-10 pt-16 space-y-8">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
          <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Cpu className="w-5 h-5" />
              <span className="text-[10px] font-black tracking-[0.4em] uppercase">Set your capacity</span>
            </div>
            <DialogTitle className="text-3xl sm:text-4xl font-black tracking-tighter text-white uppercase leading-none">
              CUSTOM <span className="ml-2 sm:ml-3 text-gradient-primary">SCALING.</span>
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
              Select the number of entries you need for your fleet. Your price will update automatically based on your selection.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-12 py-8">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected Entries</label>
                  <p className="text-2xl sm:text-3xl font-black text-white">{entries.toLocaleString()} <span className="text-primary/50 text-sm italic">Slots</span></p>
                </div>
                <div className="text-left sm:text-right space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Rate</label>
                  <p className="text-sm font-bold text-slate-300 font-mono">${pricePerEntry.toFixed(2)} / Slot</p>
                </div>
              </div>

              <div className="relative pt-4">
                <Slider
                  value={[entries]}
                  onValueChange={(val) => setEntries(val[0])}
                  min={minEntries}
                  max={maxEntries}
                  step={500}
                  className="py-4"
                />
                <div className="flex justify-between mt-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
                  <span>{minEntries.toLocaleString()}</span>
                  <span>{maxEntries.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: ShieldCheck, label: "SECURE", value: "ENCRYPTED" },
                { icon: Zap, label: "SPEED", value: "INSTANT" },
                { icon: Globe, label: "ACCESS", value: "GLOBAL" },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-sm space-y-2">
                  <item.icon className="w-4 h-4 text-primary/70" />
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{item.label}</p>
                    <p className="text-[10px] font-bold text-white uppercase">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="p-6 sm:p-8 bg-primary/10 border border-primary/20 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 sm:gap-0">
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Estimated Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter">${totalPrice.toLocaleString()}</span>
                  <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">/ ONE-TIME</span>
                </div>
              </div>

              <button
                onClick={() => onConfirm(entries)}
                disabled={isLoading}
                className="w-full sm:w-auto bg-primary text-black font-black uppercase tracking-[0.3em] text-[10px] px-8 py-5 hover:bg-[#99da56] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(132,206,58,0.3)]"
              >
                {isLoading ? "PROCESSING..." : "Continue to Checkout"}
              </button>
            </div>

            <p className="text-center text-[9px] font-bold text-slate-500 uppercase tracking-[0.1em]">
              * Payments are processed via secure Stripe gateway. Capacity provisioned instantly upon confirmation.
            </p>
          </div>
          <div className="h-10 w-full" /> {/* Bottom spacer */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
