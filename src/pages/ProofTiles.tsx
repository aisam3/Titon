import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  History, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ShieldCheck, 
  Clock, 
  Search, 
  Download, 
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  FileText,
  Calendar,
  Database,
  ArrowUpRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format } from "date-fns";

// --- Types ---

type Cadence = "Daily" | "Weekly" | "Monthly" | "Quarterly";

interface HistoryItem {
  value: number;
  timestamp: string;
  author: string;
}

interface ReviewItem {
  timestamp: string;
  notes: string;
}

interface ProofTile {
  id: string;
  workflow: string;
  signal: string;
  baseline: number;
  target: number;
  currentValue: number;
  unit: string;
  evidenceSource: string;
  cadence: Cadence;
  history: HistoryItem[];
  reviews: ReviewItem[];
  createdAt: string;
}

// --- Store ---

interface ProofTileStore {
  tiles: ProofTile[];
  addTile: (tile: ProofTile) => void;
  updateTile: (id: string, updates: Partial<ProofTile>) => void;
  deleteTile: (id: string) => void;
  addHistoryPoint: (id: string, value: number, author: string) => void;
  addReview: (id: string, notes: string) => void;
}

const defaultTiles: ProofTile[] = [
  {
    id: "tile-1",
    workflow: "Lead Management",
    signal: "Lead Response Time",
    baseline: 18,
    target: 4,
    currentValue: 2.4,
    unit: "hours",
    evidenceSource: "CRM Timestamps API",
    cadence: "Weekly",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    history: [
      { value: 18, timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), author: "System" },
      { value: 14.5, timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), author: "A. Abbas" },
      { value: 8.2, timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), author: "A. Abbas" },
      { value: 3.1, timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), author: "A. Abbas" },
      { value: 2.4, timestamp: new Date().toISOString(), author: "A. Abbas" },
    ],
    reviews: [
      { timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), notes: "Significant drop due to new AI SMS bridge." }
    ]
  },
  {
    id: "tile-2",
    workflow: "Client Onboarding",
    signal: "Time to First Value (TTFV)",
    baseline: 14,
    target: 5,
    currentValue: 12,
    unit: "days",
    evidenceSource: "Project Management Board",
    cadence: "Monthly",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    history: [
      { value: 14, timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), author: "System" },
      { value: 13.5, timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), author: "Admin" },
      { value: 12, timestamp: new Date().toISOString(), author: "Admin" },
    ],
    reviews: []
  }
];

const useProofTileStore = create<ProofTileStore>()(
  persist(
    (set) => ({
      tiles: defaultTiles,
      addTile: (tile) => set((state) => ({ tiles: [tile, ...state.tiles] })),
      updateTile: (id, updates) => set((state) => ({
        tiles: state.tiles.map((t) => (t.id === id ? { ...t, ...updates } : t))
      })),
      deleteTile: (id) => set((state) => ({ tiles: state.tiles.filter((t) => t.id !== id) })),
      addHistoryPoint: (id, value, author) => set((state) => ({
        tiles: state.tiles.map((t) => {
          if (t.id === id) {
            const newHistory = [...t.history, { value, timestamp: new Date().toISOString(), author }];
            return { ...t, history: newHistory, currentValue: value };
          }
          return t;
        })
      })),
      addReview: (id, notes) => set((state) => ({
        tiles: state.tiles.map((t) => (t.id === id ? { ...t, reviews: [{ timestamp: new Date().toISOString(), notes }, ...t.reviews] } : t))
      })),
    }),
    { name: "titon-proof-tiles-storage" }
  )
);

// --- Helpers ---

const calculateImprovement = (baseline: number, current: number) => {
  if (baseline === 0) return 0;
  // If baseline > target (like response time), lower current is better
  // Formula: (Baseline - Current) / Baseline * 100
  return ((baseline - current) / baseline) * 100;
};

const getHealthStatus = (baseline: number, target: number, current: number) => {
  const goal = calculateImprovement(baseline, target);
  const actual = calculateImprovement(baseline, current);
  
  if (baseline > target) {
    // Case: Lower is better (e.g. response time)
    if (current <= target) return "green";
    if (current <= target * 1.2) return "yellow";
    return "red";
  } else {
    // Case: Higher is better (e.g. conversion rate)
    // Needs adjustment for conversion logic, but standardizing on "Lower is better" for response time examples
    if (current >= target) return "green";
    if (current >= target * 0.8) return "yellow";
    return "red";
  }
};

const getTrend = (history: HistoryItem[]) => {
  if (history.length < 2) return "stable";
  const last = history[history.length - 1].value;
  const prev = history[history.length - 2].value;
  if (last < prev) return "down"; // Good for time/cost
  if (last > prev) return "up";
  return "stable";
};

// --- Components ---

const ProofTileCard = ({ tile, onSelect }: { tile: ProofTile, onSelect: (tile: ProofTile) => void }) => {
  const improvement = calculateImprovement(tile.baseline, tile.currentValue);
  const health = getHealthStatus(tile.baseline, tile.target, tile.currentValue);
  const trend = getTrend(tile.history);

  const healthColors = {
    green: "border-primary/50 text-primary shadow-[0_0_15px_rgba(132,206,58,0.1)]",
    yellow: "border-yellow-500/50 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]",
    red: "border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
  };

  const trendIcon = {
    up: <TrendingUp className="w-4 h-4 text-red-400" />, // Up is bad for response time
    down: <TrendingDown className="w-4 h-4 text-primary" />, // Down is good for response time
    stable: <Activity className="w-4 h-4 text-slate-400" />
  };

  return (
    <Card 
      onClick={() => onSelect(tile)}
      className={`bg-[#0a1122] border-white/5 cursor-pointer hover:border-primary/50 transition-all duration-300 group overflow-hidden ${healthColors[health]}`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <ShieldCheck className="w-24 h-24" />
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="text-[8px] uppercase tracking-widest font-black bg-white/5 border-white/10">
            {tile.workflow}
          </Badge>
          <div className="flex items-center gap-1">
            {trendIcon[trend]}
            <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">Trend</span>
          </div>
        </div>
        <CardTitle className="text-xl font-black tracking-tight text-white">{tile.signal}</CardTitle>
        <CardDescription className="text-slate-400 text-xs font-medium">Source: {tile.evidenceSource}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 mb-6">
          <div className="space-y-1">
            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Baseline</div>
            <div className="text-sm font-bold text-white">{tile.baseline} {tile.unit}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Current</div>
            <div className={`text-sm font-black ${health === "green" ? "text-primary" : health === "yellow" ? "text-yellow-500" : "text-red-500"}`}>
              {tile.currentValue} {tile.unit}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Target</div>
            <div className="text-sm font-bold text-blue-400">{tile.target} {tile.unit}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Improvement</div>
            <div className="text-2xl font-black tracking-tighter text-white">
              {improvement > 0 ? "+" : ""}{improvement.toFixed(1)}%
            </div>
          </div>
          <Progress value={Math.min(100, Math.max(0, improvement))} className="h-1 bg-white/5" />
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 border-t border-white/5 mt-4 flex justify-between items-center bg-white/5">
        <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
          <Clock className="w-3 h-3" /> Cadence: {tile.cadence}
        </div>
        <div className="text-[8px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
          View Detail <ChevronRight className="w-3 h-3" />
        </div>
      </CardFooter>
    </Card>
  );
};

const ProofTiles = () => {
  const { tiles, addTile, updateTile, deleteTile, addHistoryPoint, addReview } = useProofTileStore();
  const [selectedTile, setSelectedTile] = useState<ProofTile | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newTile, setNewTile] = useState<Partial<ProofTile>>({
    workflow: "",
    signal: "",
    baseline: 0,
    target: 0,
    unit: "",
    evidenceSource: "",
    cadence: "Weekly"
  });

  const [updateValue, setUpdateValue] = useState<number>(0);
  const [reviewNotes, setReviewNotes] = useState("");

  const summary = useMemo(() => {
    const total = tiles.length;
    const green = tiles.filter(t => getHealthStatus(t.baseline, t.target, t.currentValue) === "green").length;
    const yellow = tiles.filter(t => getHealthStatus(t.baseline, t.target, t.currentValue) === "yellow").length;
    const red = tiles.filter(t => getHealthStatus(t.baseline, t.target, t.currentValue) === "red").length;
    const avgImprovement = tiles.reduce((acc, t) => acc + calculateImprovement(t.baseline, t.currentValue), 0) / total || 0;
    
    return { total, green, yellow, red, avgImprovement };
  }, [tiles]);

  const handleAddTile = () => {
    if (!newTile.workflow || !newTile.signal || !newTile.baseline || !newTile.target) {
      toast.error("All fields are required and numeric values must be valid.");
      return;
    }

    const tile: ProofTile = {
      id: `tile-${Date.now()}`,
      workflow: newTile.workflow!,
      signal: newTile.signal!,
      baseline: Number(newTile.baseline),
      target: Number(newTile.target),
      currentValue: Number(newTile.baseline), // Start current at baseline
      unit: newTile.unit || "units",
      evidenceSource: newTile.evidenceSource || "Manual",
      cadence: (newTile.cadence as Cadence) || "Weekly",
      createdAt: new Date().toISOString(),
      history: [{ value: Number(newTile.baseline), timestamp: new Date().toISOString(), author: "System" }],
      reviews: []
    };

    addTile(tile);
    setIsAdding(false);
    setNewTile({ workflow: "", signal: "", baseline: 0, target: 0, unit: "", evidenceSource: "", cadence: "Weekly" });
    toast.success("Proof Tile created successfully!");
  };

  const handleUpdateCurrent = () => {
    if (!selectedTile) return;
    addHistoryPoint(selectedTile.id, updateValue, "User");
    setSelectedTile({ ...selectedTile, currentValue: updateValue, history: [...selectedTile.history, { value: updateValue, timestamp: new Date().toISOString(), author: "User" }] });
    setUpdateValue(0);
    toast.success("Measurement updated.");
  };

  const handleAddReview = () => {
    if (!selectedTile || !reviewNotes) return;
    addReview(selectedTile.id, reviewNotes);
    setSelectedTile({ ...selectedTile, reviews: [{ timestamp: new Date().toISOString(), notes: reviewNotes }, ...selectedTile.reviews] });
    setReviewNotes("");
    toast.success("Review logged.");
  };

  return (
    <div className="min-h-screen bg-[#050b18] text-white font-body selection:bg-primary/30">
      <Navbar />

      <main className="container mx-auto px-4 pt-32 pb-40">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-4 border border-primary/20">
                <ShieldCheck className="w-3 h-3" /> Proof Tile Standard™
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none italic">Proof Board</h1>
            </div>
            <Button 
              onClick={() => setIsAdding(true)}
              className="bg-primary hover:bg-primary/90 text-black px-8 py-7 rounded-xl text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105"
            >
              <Plus className="mr-2 w-6 h-6" /> Create Tile
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Tiles</div>
              <div className="text-3xl font-black">{summary.total}</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Avg Improvement</div>
              <div className="text-3xl font-black text-primary">{summary.avgImprovement.toFixed(1)}%</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Healthy (Green)</div>
              <div className="text-3xl font-black text-primary">{summary.green}</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Critical (Red)</div>
              <div className="text-3xl font-black text-red-500">{summary.red}</div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {tiles.map((tile) => (
              <motion.div 
                key={tile.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
              >
                <ProofTileCard tile={tile} onSelect={setSelectedTile} />
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        {/* --- Add Tile Modal (Simplified) --- */}
        <AnimatePresence>
          {isAdding && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-[#0a1122] border border-white/10 w-full max-w-2xl rounded-[32px] md:rounded-[40px] p-6 md:p-12 overflow-y-auto max-h-[90vh]"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-black uppercase tracking-tight">New Proof Tile</h2>
                  <Button variant="ghost" onClick={() => setIsAdding(false)} className="text-slate-400">Cancel</Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Workflow Name</label>
                    <Input 
                      placeholder="e.g., Lead Management" 
                      value={newTile.workflow}
                      onChange={(e) => setNewTile({ ...newTile, workflow: e.target.value })}
                      className="bg-white/5 border-white/10 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Signal (Metric)</label>
                    <Input 
                      placeholder="e.g., Response Time" 
                      value={newTile.signal}
                      onChange={(e) => setNewTile({ ...newTile, signal: e.target.value })}
                      className="bg-white/5 border-white/10 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Baseline Value</label>
                    <Input 
                      type="number"
                      placeholder="0.00" 
                      value={newTile.baseline}
                      onChange={(e) => setNewTile({ ...newTile, baseline: parseFloat(e.target.value) || 0 })}
                      className="bg-white/5 border-white/10 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Value</label>
                    <Input 
                      type="number"
                      placeholder="0.00" 
                      value={newTile.target}
                      onChange={(e) => setNewTile({ ...newTile, target: parseFloat(e.target.value) || 0 })}
                      className="bg-white/5 border-white/10 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Unit</label>
                    <Input 
                      placeholder="e.g., hours, %, min" 
                      value={newTile.unit}
                      onChange={(e) => setNewTile({ ...newTile, unit: e.target.value })}
                      className="bg-white/5 border-white/10 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cadence</label>
                    <Select onValueChange={(val) => setNewTile({ ...newTile, cadence: val as Cadence })}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-12 text-white">
                        <SelectValue placeholder="Weekly" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0f172a] border-white/10 text-white">
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Evidence Source</label>
                    <Input 
                      placeholder="e.g., CRM Timestamps, Google Sheets query..." 
                      value={newTile.evidenceSource}
                      onChange={(e) => setNewTile({ ...newTile, evidenceSource: e.target.value })}
                      className="bg-white/5 border-white/10 h-12"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleAddTile}
                  className="w-full mt-12 bg-primary hover:bg-primary/90 text-black h-16 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                >
                  Create Proof Tile
                </Button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* --- Detail Overlay --- */}
        <AnimatePresence>
          {selectedTile && (
            <div className="fixed inset-0 z-[200] flex items-center justify-end p-0 md:p-4 bg-black/80 backdrop-blur-sm">
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                className="bg-[#050b18] w-full max-w-4xl h-full md:h-[95vh] md:rounded-[40px] border-white/10 md:border-l overflow-y-auto shadow-2xl flex flex-col"
              >
                <div className="sticky top-0 z-20 bg-[#050b18]/80 backdrop-blur-md p-8 border-b border-white/5 flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight">{selectedTile.signal}</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{selectedTile.workflow}</p>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedTile(null)} className="rounded-full w-12 h-12 p-0 hover:bg-white/5">
                    <Trash2 className="w-6 h-6 text-slate-500" />
                  </Button>
                </div>

                <div className="p-8 space-y-12 flex-1">
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                      <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Baseline</div>
                      <div className="text-xl font-bold">{selectedTile.baseline} {selectedTile.unit}</div>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                      <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Current</div>
                      <div className="text-xl font-bold text-primary">{selectedTile.currentValue} {selectedTile.unit}</div>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                      <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Target</div>
                      <div className="text-xl font-bold text-blue-400">{selectedTile.target} {selectedTile.unit}</div>
                    </div>
                    <div className="p-6 bg-primary/10 rounded-3xl border border-primary/20">
                      <div className="text-[8px] font-black text-primary uppercase tracking-widest mb-1">Improvement</div>
                      <div className="text-2xl font-black text-primary">
                        {calculateImprovement(selectedTile.baseline, selectedTile.currentValue).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                        <History className="text-primary w-5 h-5" /> Performance History
                      </h3>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Time Series (Days 0-30)</div>
                    </div>
                    <div className="h-[350px] w-full bg-white/5 rounded-[40px] border border-white/10 p-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedTile.history}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#84ce3a" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#84ce3a" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                          <XAxis 
                            dataKey="timestamp" 
                            stroke="#475569" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(t) => format(new Date(t), 'MMM d')}
                          />
                          <YAxis 
                            stroke="#475569" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            domain={['auto', 'auto']}
                          />
                          <RechartsTooltip 
                            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #ffffff10", borderRadius: "16px" }}
                            itemStyle={{ color: "#84ce3a", fontWeight: "bold" }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#84ce3a" 
                            strokeWidth={4}
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                            animationDuration={1500}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Tabs for Actions */}
                  <Tabs defaultValue="update" className="w-full">
                    <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl w-full flex justify-stretch h-14">
                      <TabsTrigger value="update" className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold uppercase text-xs">Update Measurement</TabsTrigger>
                      <TabsTrigger value="review" className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold uppercase text-xs">Log Review</TabsTrigger>
                      <TabsTrigger value="audit" className="flex-1 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-bold uppercase text-xs">Audit Log</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="update" className="mt-8 p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">New Measurement ({selectedTile.unit})</label>
                        <div className="flex gap-4">
                          <Input 
                            type="number"
                            placeholder="Enter latest value"
                            value={updateValue}
                            onChange={(e) => setUpdateValue(parseFloat(e.target.value) || 0)}
                            className="bg-[#050b18] border-white/10 h-14 rounded-2xl"
                          />
                          <Button 
                            onClick={handleUpdateCurrent}
                            className="bg-primary hover:bg-primary/90 text-black h-14 px-8 rounded-2xl font-black uppercase tracking-widest"
                          >
                            Post Measurement
                          </Button>
                        </div>
                        <p className="text-[10px] text-slate-500 italic">This will update the Current Value and append to the history graph.</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="review" className="mt-8 p-8 bg-white/5 rounded-3xl border border-white/10 space-y-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Review Notes & Insights</label>
                        <Textarea 
                          placeholder="What drove this period's performance? Any adjustments needed?"
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          className="bg-[#050b18] border-white/10 min-h-[120px] rounded-2xl"
                        />
                        <Button 
                          onClick={handleAddReview}
                          className="w-full bg-primary hover:bg-primary/90 text-black h-14 rounded-2xl font-black uppercase tracking-widest"
                        >
                          Complete Review Log
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="audit" className="mt-8 space-y-4">
                      {selectedTile.history.slice().reverse().map((item, idx) => (
                        <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                              <Database className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm font-bold">{item.value} {selectedTile.unit}</div>
                              <div className="text-[10px] text-slate-500 uppercase font-medium">{format(new Date(item.timestamp), 'MMM d, h:mm a')}</div>
                            </div>
                          </div>
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Updated by {item.author}</div>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="p-8 border-t border-white/5 bg-white/5">
                  <div className="flex justify-between items-center">
                    <Button variant="ghost" className="text-red-500 hover:bg-red-500/10" onClick={() => { deleteTile(selectedTile.id); setSelectedTile(null); toast.success("Tile deleted."); }}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Permanent Record
                    </Button>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Record ID: {selectedTile.id}</div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* --- Floating Action: Formula Bar --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-[#0a1122]/90 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full shadow-2xl flex items-center gap-6 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Formula:</span>
        </div>
        <code className="text-[11px] font-mono text-primary font-bold">((Baseline - Current) / Baseline) * 100</code>
        <div className="h-4 w-[1px] bg-white/20" />
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verification: Required</span>
        </div>
      </div>
    </div>
  );
};

export default ProofTiles;
