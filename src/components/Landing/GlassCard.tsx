import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export const GlassCard = ({ children, className, glowColor = "rgba(59, 130, 246, 0.3)" }: GlassCardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden transition-all duration-700 ease-out",
        "bg-slate-900/40/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl",
        "hover:bg-slate-900/40/[0.08] hover:border-white/20",
        "group",
        className
      )}
      style={{
        boxShadow: `0 20px 40px -10px rgba(0,0,0,0.5), 0 0 20px -5px ${glowColor}`,
      }}
    >
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
      
      {/* Animated Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
        <div className="absolute -inset-[100%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.1)_180deg,transparent_360deg)]" />
      </div>

      <div className="relative z-10 p-8">
        {children}
      </div>

      {/* Subtle Bottom Glow */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-700"
      />
    </div>
  );
};
