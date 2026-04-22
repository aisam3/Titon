import React, { useState, useEffect } from "react";
import { Timer } from "lucide-react";

export const UrgencySection = () => {
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 59); // 14:59

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="max-w-4xl mx-auto w-full text-center py-4">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500 rounded-2xl text-white animate-pulse">
            <Timer className="w-8 h-8" />
          </div>
          <div className="text-left">
            <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Time Limited Offer</div>
            <div className="text-4xl font-black text-white italic tracking-tighter tabular-nums">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>
        </div>
        
        <div className="h-12 w-[1px] bg-white/10 hidden md:block" />

        <div className="text-white font-black uppercase tracking-widest text-lg md:text-xl italic">
          Audit Discount Expiring: <span className="text-red-500">Only 4 Spots</span> Left For This Month
        </div>
      </div>
    </div>
  );
};
