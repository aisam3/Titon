import React, { useState } from "react";
import { X, Loader2, User, Building, Mail, Globe, MapPin, Clock, ShieldCheck, CheckCircle2, Circle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFleet?: string;
}

const InputWrapper = ({ label, icon: Icon, children }: any) => (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
      </div>
      {children}
    </div>
  </div>
);

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose, defaultFleet = "Charter" }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    agencyName: "",
    email: "",
    website: "",
    country: "US",
    timezone: "EST",
    hlStatus: "Yes",
    fleetChoice: defaultFleet,
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setFleet = (fleet: string) => {
    setFormData({ ...formData, fleetChoice: fleet });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("waitlist_applications").insert([
        {
          full_name: formData.fullName,
          agency_name: formData.agencyName,
          email: formData.email,
          website: formData.website,
          country: formData.country,
          timezone: formData.timezone,
          hl_status: formData.hlStatus === "Yes",
          fleet_choice: formData.fleetChoice,
        },
      ]);

      if (error) {
        if (error.code === '23505') {
          throw new Error("This email is already on the waitlist.");
        }
        throw error;
      }

      toast.success("Successfully joined the waitlist!");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to join waitlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative bg-[#0a1122] border border-white/10 rounded-3xl w-full max-w-2xl p-8 sm:p-10 shadow-[0_0_80px_-20px_rgba(132,206,58,0.15)] overflow-y-auto max-h-[90vh] custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <ShieldCheck className="w-3 h-3" /> Early Access Registration
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white leading-none mb-3">
            Join the TITON Waitlist
          </h2>
          <p className="text-slate-400 font-medium">
            Secure your spot in the ecosystem. Limited availability across all fleets.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWrapper label="Full Name *" icon={User}>
              <input 
                type="text" 
                name="fullName"
                required 
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-[#050b18] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                placeholder="John Doe"
              />
            </InputWrapper>

            <InputWrapper label="Agency Name *" icon={Building}>
              <input 
                type="text" 
                name="agencyName"
                required 
                value={formData.agencyName}
                onChange={handleChange}
                className="w-full bg-[#050b18] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                placeholder="Acme Agency"
              />
            </InputWrapper>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWrapper label="Email Address *" icon={Mail}>
              <input 
                type="email" 
                name="email"
                required 
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#050b18] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                placeholder="john@example.com"
              />
            </InputWrapper>

            <InputWrapper label="Website (Optional)" icon={Globe}>
              <input 
                type="url" 
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full bg-[#050b18] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                placeholder="https://example.com"
              />
            </InputWrapper>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputWrapper label="Country *" icon={MapPin}>
              <select 
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className="w-full bg-[#050b18] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all appearance-none font-medium"
              >
                {["US", "Canada", "UK", "Australia", "Germany", "France", "Spain", "Italy", "Netherlands", "Other"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </InputWrapper>

            <InputWrapper label="Timezone *" icon={Clock}>
              <select 
                name="timezone"
                required
                value={formData.timezone}
                onChange={handleChange}
                className="w-full bg-[#050b18] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all appearance-none font-medium"
              >
                {["EST", "CST", "MST", "PST", "GMT", "CET", "AEST", "Other"].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </InputWrapper>

            <InputWrapper label="Have HighLevel? *" icon={ShieldCheck}>
              <select 
                name="hlStatus"
                required
                value={formData.hlStatus}
                onChange={handleChange}
                className="w-full bg-[#050b18] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all appearance-none font-medium"
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </InputWrapper>
          </div>

          <div className="pt-4 border-t border-white/5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Select Your Fleet *</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "Charter", label: "Charter Fleet", desc: "50 max spots", color: "text-yellow-400", border: "border-yellow-400/50", bg: "bg-yellow-400/10" },
                { id: "Partner", label: "Partner Fleet", desc: "100 max spots", color: "text-primary", border: "border-primary/50", bg: "bg-primary/10" },
                { id: "Extended", label: "Extended", desc: "500 max spots", color: "text-blue-400", border: "border-blue-400/50", bg: "bg-blue-400/10" }
              ].map(fleet => {
                const isSelected = formData.fleetChoice === fleet.id;
                return (
                  <div 
                    key={fleet.id} 
                    onClick={() => setFleet(fleet.id)}
                    className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                      isSelected ? fleet.border + ' ' + fleet.bg : 'border-white/10 bg-[#050b18] hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-black uppercase tracking-tight ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {fleet.label}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className={`w-5 h-5 ${fleet.color}`} />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{fleet.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={loading}
              className="w-full relative group px-8 py-5 bg-[#84ce3a] text-black text-sm font-black uppercase tracking-[0.3em] hover:bg-white transition-all duration-500 rounded-xl overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_40px_-10px_rgba(132,206,58,0.5)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? "Processing Registration..." : "Confirm Registration"}
              </span>
            </button>
            <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
              <ShieldCheck className="w-3 h-3" /> 100% Secure & Encrypted
            </p>
          </div>
        </form>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};
