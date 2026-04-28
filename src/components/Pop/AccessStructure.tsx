import React, { useState, useEffect } from "react";
import { Users, Star, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AccessStructureProps {
  onOpenWaitlist: (fleet: string) => void;
}

export const AccessStructure: React.FC<AccessStructureProps> = ({ onOpenWaitlist }) => {
  const [counts, setCounts] = useState({
    Charter: 0,
    Partner: 0,
    Extended: 0
  });

  useEffect(() => {
    // Fetch live counts from Supabase
    const fetchCounts = async () => {
      try {
        const { data, error } = await supabase
          .from('waitlist_applications')
          .select('fleet_choice');
        
        if (error) {
          console.error("Error fetching waitlist counts:", error);
          return;
        }

        const newCounts = { Charter: 0, Partner: 0, Extended: 0 };
        data?.forEach((row: any) => {
          if (row.fleet_choice in newCounts) {
            newCounts[row.fleet_choice as keyof typeof newCounts]++;
          }
        });
        setCounts(newCounts);
      } catch (err) {
        console.error("Error connecting to Supabase:", err);
      }
    };

    fetchCounts();

    // Set up realtime subscription
    const subscription = supabase
      .channel('waitlist_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'waitlist_applications' }, payload => {
        const newRecord = payload.new;
        if (newRecord && newRecord.fleet_choice) {
          setCounts(prev => ({
            ...prev,
            [newRecord.fleet_choice]: prev[newRecord.fleet_choice as keyof typeof prev] + 1
          }));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fleets = [
    {
      id: "Charter",
      title: "TITON Charter Fleet",
      maxSpots: 50,
      icon: Star,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/30"
    },
    {
      id: "Partner",
      title: "TITON Partner Fleet",
      maxSpots: 100,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/30"
    },
    {
      id: "Extended",
      title: "TITON Extended Waitlist",
      maxSpots: 500,
      icon: Clock,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/30"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic mb-4">
          Access Structure
        </h2>
        <p className="text-xl text-slate-400 font-medium">Spots are strictly limited to ensure quality collaboration.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {fleets.map((fleet) => {
          const spotsRemaining = Math.max(0, fleet.maxSpots - (counts[fleet.id as keyof typeof counts] || 0));
          const isFull = spotsRemaining === 0;

          return (
            <div key={fleet.id} className={`relative p-8 rounded-3xl bg-white/5 border ${fleet.border} flex flex-col justify-between overflow-hidden group`}>
              {/* Background gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${fleet.bg} blur-[50px] -z-10`} />

              <div>
                <div className={`w-12 h-12 rounded-xl ${fleet.bg} flex items-center justify-center mb-6`}>
                  <fleet.icon className={`w-6 h-6 ${fleet.color}`} />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{fleet.title}</h3>
                <div className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">
                  {fleet.maxSpots} Total Spots
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-white uppercase tracking-widest">Spots Remaining</span>
                    <span className={`text-3xl font-black ${isFull ? 'text-red-500' : fleet.color}`}>{spotsRemaining}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${isFull ? 'bg-red-500' : 'bg-current'} transition-all duration-1000`}
                      style={{ width: `${(1 - (spotsRemaining / fleet.maxSpots)) * 100}%`, color: fleet.color === 'text-primary' ? '#84ce3a' : fleet.color === 'text-yellow-400' ? '#facc15' : '#60a5fa' }}
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onOpenWaitlist(fleet.id)}
                disabled={isFull}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all duration-300 ${
                  isFull 
                    ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5' 
                    : 'bg-white text-black hover:bg-primary border border-transparent'
                }`}
              >
                {isFull ? 'Waitlist Full' : `Join ${fleet.id} Waitlist`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
