import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { updateSupabaseConfig, supabase, isSupabaseConfigured } from "@/lib/supabase";
import { sopService, SOP, SOPLog, SOPDetails, RankingData, SOPComparison } from "@/services/sopService";
import { useToast } from "@/hooks/use-toast";
import {
  Lock,
  BarChart3,
  BrainCircuit,
  Settings2,
  Plus,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  ChevronRight,
  Trash2,
  LogOut,
  LogIn,
  UserPlus,
  Mail,
  Loader2,
  User,
  ShieldCheck,
  Download,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PerformanceCharts } from "@/components/Dashboard/PerformanceCharts";
import { exportUtils } from "@/utils/exportUtils";

import { AuthModal } from "@/components/AuthModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [sops, setSops] = useState<SOP[]>([]);
  const [selectedSopId, setSelectedSopId] = useState<string | null>(null);
  const [details, setDetails] = useState<SOPDetails | null>(null);
  const [intelligence, setIntelligence] = useState<{ ranking: RankingData; comparisons: SOPComparison[] } | null>(null);
  const [comparisonData, setComparisonData] = useState<{ name: string; avgScore: number }[]>([]);
  const [loading, setLoading] = useState(false);

  // Log creation form state
  const [newLog, setNewLog] = useState({ time: "", output: "", errors: "" });
  // SOP creation form state
  const [newSopName, setNewSopName] = useState("");

  useEffect(() => {
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        setIsAuthModalOpen(false);
        fetchSOPs();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      fetchSOPs();
    }
  };

  useEffect(() => {
    if (selectedSopId && user) {
      fetchDetails(selectedSopId);
    }
  }, [selectedSopId, user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged Out", description: "System session terminated." });
    setSops([]);
    setDetails(null);
    setIsAuthModalOpen(true);
  };

  const fetchSOPs = async () => {
    try {
      const { data, error } = await supabase.from('sops').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setSops(data || []);
      if (data && data.length > 0 && !selectedSopId) {
        setSelectedSopId(data[0].id);
      }

      // Fetch comparison data and intelligence
      const intel = await sopService.getSystemIntelligence();
      setIntelligence(intel);
      setComparisonData(intel.comparisons.map(c => ({ name: c.name, avgScore: c.avg_score })));
    } catch (err) {
      console.error("Failed to fetch SOPs", err);
    }
  };

  const fetchDetails = async (id: string) => {
    setLoading(true);
    try {
      const data = await sopService.getSOPDetails(id);
      setDetails(data);

      // Refresh comparison data
      const compData = await sopService.getSOPComparisonData();
      setComparisonData(compData);
    } catch (err: any) {
      toast({
        title: "Error fetching details",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSop = async () => {
    if (!newSopName) return;
    try {
      await sopService.createSOP(newSopName);
      setNewSopName("");
      fetchSOPs();
      toast({ title: "SOP Created", description: "New system procedure initialized successfully." });
    } catch (err: any) {
      toast({ title: "Creation Failed", description: err.message, variant: "destructive" });
    }
  };

  const handleCreateLog = async () => {
    if (!selectedSopId) {
      toast({
        title: "No Project Selected",
        description: "Please create a project using the (+) button and select it first.",
        variant: "destructive"
      });
      return;
    }

    // Validation: Check if values are provided
    if (!newLog.time || !newLog.output || newLog.errors === "") {
      toast({
        title: "Incomplete Data",
        description: "Please fill in all record fields (Time, Output, and Errors).",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await sopService.insertLog(
        selectedSopId,
        parseFloat(newLog.time),
        parseFloat(newLog.output),
        parseFloat(newLog.errors)
      );
      setNewLog({ time: "", output: "", errors: "" });
      await fetchDetails(selectedSopId);
      toast({ title: "Log Added", description: "Your performance record has been saved successfully." });
    } catch (err: any) {
      toast({ title: "Failed to Add Log", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLastLog = async () => {
    if (!details || details.logs.length === 0) return;

    const lastLog = details.logs[details.logs.length - 1];

    try {
      setLoading(true);
      await sopService.deleteLog(lastLog.id);
      await fetchDetails(selectedSopId!);
      toast({ title: "Record Pruned", description: "The most recent execution log has been deleted." });
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetRequest = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast({
        title: "Link Dispatched",
        description: "A secure password reconfiguration link has been sent to your email.",
      });
    } catch (err: any) {
      toast({ title: "Request Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSop = async (id: string, name: string) => {
    try {
      setLoading(true);
      await sopService.deleteSOP(id);
      toast({ title: "Project Nuked", description: `"${name}" has been permanently erased from the system.` });

      // Update local state
      const updatedSops = sops.filter(s => s.id !== id);
      setSops(updatedSops);

      if (selectedSopId === id) {
        setSelectedSopId(updatedSops.length > 0 ? updatedSops[0].id : null);
        setDetails(null);
      }
    } catch (err: any) {
      toast({ title: "Terminal Failure", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b18] text-white selection:bg-primary/30">
      <Navbar />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={checkUser}
      />

      <main className="container mx-auto px-6 pt-32 pb-20 space-y-12 transition-all duration-700" style={{ opacity: user ? 1 : 0.4 }}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase text-white">Performance &nbsp; Dashboard</h1>
            <p className="text-slate-400 text-xs font-mono uppercase tracking-[0.3em]">Version 1.0.4 - {user ? "Logged In" : "Signed Out"}</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/40 p-2 pl-4 rounded-lg border border-white/5 backdrop-blur-xl">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-primary font-black tracking-widest uppercase">Active User</span>
                  <span className="text-[11px] text-white font-mono opacity-60">{user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePasswordResetRequest}
                  className="h-10 w-10 text-slate-400 hover:text-primary hover:bg-primary/10"
                  title="Security: Reconfigure Key"
                >
                  <ShieldCheck className="w-5 h-5" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="w-5 h-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#0c1425] border-white/10 text-white backdrop-blur-xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl font-black uppercase tracking-tight text-white">Terminate Session?</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400 font-medium">
                        Are you sure you want to exit the intelligence system? You will need to re-authenticate to access your metrics.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-6">
                      <AlertDialogCancel className="bg-transparent border-white/10 text-slate-400 hover:bg-white/5 hover:text-white font-bold uppercase tracking-widest text-[10px]">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLogout}
                        className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-black uppercase tracking-widest text-[10px]"
                      >
                        Log Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <Button onClick={() => setIsAuthModalOpen(true)} className="bg-primary text-black font-black uppercase text-xs tracking-widest px-8">
                Sign In
              </Button>
            )}
          </div>
        </div>

        {!user && (
          <div className="p-20 border-2 border-dashed border-primary/20 bg-primary/5 rounded-2xl flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center border border-primary/30 shadow-[0_0_30px_rgba(132,206,58,0.2)]">
              <Lock className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-widest text-white">Secure Area</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto font-medium">
                Please sign in to view your performance records and AI-powered insights.
              </p>
            </div>
            <Button onClick={() => setIsAuthModalOpen(true)} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black font-black mt-4">
              SIGN IN
            </Button>
          </div>
        )}

        {user && (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Sidebar: SOP Navigation */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="bg-slate-900/40 border-white/10 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-white">My Projects</CardTitle>
                  <div className="flex gap-2 mt-4">
                    <Input
                      placeholder="Project Name..."
                      value={newSopName}
                      onChange={(e) => setNewSopName(e.target.value)}
                      className="bg-black/40 border-white/5 text-xs h-8"
                    />
                    <Button onClick={handleCreateSop} size="icon" className="h-8 w-8 bg-primary/20 text-primary hover:bg-primary hover:text-black">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1 px-1">
                  {sops.length === 0 && (
                    <div className="py-8 text-center text-slate-500 uppercase tracking-widest text-[9px]">
                      No active projects.
                    </div>
                  )}
                  {sops.map((sop) => (
                    <div key={sop.id} className="relative group/sop">
                      <button
                        onClick={() => setSelectedSopId(sop.id)}
                        className={`w-full text-left px-4 py-3 pr-10 rounded-md transition-all flex items-center justify-between ${selectedSopId === sop.id
                          ? "bg-primary/20 border border-primary/30 text-primary"
                          : "hover:bg-white/5 text-slate-400 hover:text-white"
                          }`}
                      >
                        <span className="text-sm font-bold truncate">{sop.name}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${selectedSopId === sop.id ? "rotate-90" : ""}`} />
                      </button>

                      {/* Delete SOP Button */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-red-400 transition-all opacity-100 hover:opacity-100"
                            title="Purge Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-950 border-white/10 text-white backdrop-blur-3xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold uppercase tracking-tight">Delete &nbsp; Project?</AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-400">
                              Are you sure you want to delete "{sop.name}"? This will permanently remove all logs for this project.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-transparent border-white/10 text-slate-400 hover:bg-white/5 hover:text-white uppercase font-bold text-xs tracking-widest">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSop(sop.id, sop.name)}
                              className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white uppercase font-bold text-xs tracking-widest"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-slate-900/40 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-white">Add New Log</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Time Spent (mins)</label>
                    <Input
                      type="number"
                      placeholder="Enter time..."
                      value={newLog.time}
                      onChange={(e) => setNewLog({ ...newLog, time: e.target.value })}
                      className="bg-black/40 border-white/5 h-10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Output Units</label>
                    <Input
                      type="number"
                      placeholder="Deliverables..."
                      value={newLog.output}
                      onChange={(e) => setNewLog({ ...newLog, output: e.target.value })}
                      className="bg-black/40 border-white/5 h-10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Error Count</label>
                    <Input
                      type="number"
                      placeholder="Discrepancies..."
                      value={newLog.errors}
                      onChange={(e) => setNewLog({ ...newLog, errors: e.target.value })}
                      className="bg-black/40 border-white/5 h-10 text-white"
                    />
                  </div>
                  <Button onClick={handleCreateLog} className="w-full bg-[#84ce3a] hover:bg-[#99da56] text-black font-black uppercase text-xs tracking-widest py-6 mt-2">
                    ADD LOG ENTRY
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Dashboard Area */}
            <div className="lg:col-span-9 space-y-8">
              {details ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Stats Grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-slate-900 to-black border-white/10 overflow-hidden relative group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-16 h-16 text-primary" />
                      </div>
                      <CardHeader className="pb-2">
                        <CardDescription className="text-slate-400 uppercase tracking-widest text-[9px] font-black">Efficiency Metric</CardDescription>
                        <CardTitle className="text-4xl font-black text-white">{details.metrics_summary.avg_efficiency.toFixed(2)} <span className="text-xs text-slate-500 uppercase tracking-normal">units/hr</span></CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`flex items-center gap-2 text-xs font-bold ${details.metrics_summary.trend === 'increasing' ? "text-primary" : "text-red-400"}`}>
                          {details.metrics_summary.trend === 'increasing' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                          {details.metrics_summary.last_3_change ? `${details.metrics_summary.last_3_change.toFixed(1)}% Performance Shift` : "Stable"}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-slate-900 to-black border-white/10 overflow-hidden relative group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target className="w-16 h-16 text-primary" />
                      </div>
                      <CardHeader className="pb-2">
                        <CardDescription className="text-slate-400 uppercase tracking-widest text-[9px] font-black">Avg Error Rate</CardDescription>
                        <CardTitle className="text-4xl font-black text-white">
                          {(details.metrics_summary.avg_error_rate * 100).toFixed(1)}%
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${Math.min(100, (details.metrics_summary.avg_error_rate * 100))}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-slate-900 to-black border-white/10 overflow-hidden relative group border-l-primary border-l-2">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BrainCircuit className="w-16 h-16 text-primary" />
                      </div>
                      <CardHeader className="pb-2">
                        <CardDescription className="text-slate-400 uppercase tracking-widest text-[9px] font-black">Avg & Peak Score</CardDescription>
                        <CardTitle className="text-4xl font-black text-white">
                          {details.metrics_summary.avg_score.toFixed(0)} <span className="text-xs text-slate-500 font-mono">/ {details.metrics_summary.best_score.toFixed(0)}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] tracking-widest font-black uppercase">
                            Status: {details.pattern.consistency_status}
                          </Badge>
                          <span className="text-[9px] text-slate-500 font-black uppercase">Worst: {details.metrics_summary.worst_score.toFixed(0)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* System Rankings Summary */}
                  {intelligence && intelligence.ranking && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {intelligence.ranking.best_sop && (
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-primary font-black uppercase tracking-widest">Top Project</span>
                            <span className="text-sm font-bold text-white">{intelligence.ranking.best_sop.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-black text-primary">{intelligence.ranking.best_sop.avg_score.toFixed(0)}</span>
                          </div>
                        </div>
                      )}
                      {intelligence.ranking.most_improved_sop && (
                        <div className="p-4 bg-sky-500/5 border border-sky-500/20 rounded-lg flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-sky-400 font-black uppercase tracking-widest">Best Progress</span>
                            <span className="text-sm font-bold text-white">{intelligence.ranking.most_improved_sop.name}</span>
                          </div>
                          <div className="p-1 px-2 bg-sky-500/20 rounded text-[10px] font-black text-sky-400 uppercase">Up</div>
                        </div>
                      )}
                      {intelligence.ranking.worst_sop && (
                        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-red-400 font-black uppercase tracking-widest">Needs Help</span>
                            <span className="text-sm font-bold text-white">{intelligence.ranking.worst_sop.name}</span>
                          </div>
                          <div className="text-right">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Insights and Logs */}
                  <div className="grid lg:grid-cols-12 gap-8">
                    {/* Performance Logs Table */}
                    <Card className="lg:col-span-8 bg-slate-900/40 border-white/10 backdrop-blur-xl">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-white">Execution Logs</CardTitle>
                        <div className="flex items-center gap-2">
                          {details.logs.length > 0 && (
                            <>
                              <Button
                                onClick={() => exportUtils.exportToCSV(details)}
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-slate-500 hover:text-primary hover:bg-primary/10 flex items-center gap-2"
                                title="Download Excel Data"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-black tracking-widest uppercase">Excel</span>
                              </Button>
                              <Button
                                onClick={() => exportUtils.exportToPDF(details)}
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 flex items-center gap-2"
                                title="Download Full Report"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-black tracking-widest uppercase">Full Report</span>
                              </Button>
                              <div className="w-[1px] h-4 bg-white/10 mx-1" />
                              <Button
                                onClick={handleDeleteLastLog}
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-black tracking-widest uppercase">Delete</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader className="border-white/5">
                            <TableRow className="hover:bg-transparent border-white/5">
                              <TableHead className="text-[10px] uppercase tracking-widest font-black text-slate-500">Date</TableHead>
                              <TableHead className="text-[10px] uppercase tracking-widest font-black text-slate-500">Efficiency</TableHead>
                              <TableHead className="text-[10px] uppercase tracking-widest font-black text-slate-500">Errors</TableHead>
                              <TableHead className="text-[10px] uppercase tracking-widest font-black text-slate-500">Score</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {details.logs.slice().reverse().map((log) => (
                              <TableRow key={log.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                <TableCell className="font-mono text-[10px] text-slate-400">
                                  {new Date(log.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="font-bold text-white text-xs">{log.efficiency.toFixed(2)}</TableCell>
                                <TableCell className="text-xs">
                                  <Badge variant="outline" className={`${log.error_rate > 0.1 ? "border-red-500 text-red-500" : "border-slate-700 text-slate-400"} text-[9px]`}>
                                    {(log.error_rate * 100).toFixed(1)}% Error
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-black text-primary text-xs">{(log.score * 100).toFixed(0)}</TableCell>
                              </TableRow>
                            ))}
                            {details.logs.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-slate-500 uppercase tracking-widest text-[10px]">
                                  No records found. Inject your first log.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    {/* Insight Engine */}
                    <Card className="lg:col-span-4 bg-slate-900/40 border-white/10 backdrop-blur-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                      <CardHeader>
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                          <BrainCircuit className="w-4 h-4 text-primary" />
                          Insight Engine
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 relative z-10">
                        {/* High Priority Alerts */}
                        {details.alerts.map((alert, i) => (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={`alert-${i}`}
                            className={`p-4 rounded border-l-4 flex items-start gap-3 ${alert.type === 'critical'
                              ? "bg-red-500/10 border-l-red-500 text-red-200"
                              : alert.type === 'warning'
                                ? "bg-amber-500/10 border-l-amber-500 text-amber-200"
                                : "bg-blue-500/10 border-l-blue-500 text-blue-200"
                              }`}
                          >
                            <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${alert.type === 'critical' ? "text-red-500" : "text-amber-500"
                              }`} />
                            <span className="text-[11px] font-bold leading-tight uppercase tracking-tight">{alert.message}</span>
                          </motion.div>
                        ))}

                        {/* Standard Insights */}
                        {details.insights.map((insight, i) => (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={`insight-${i}`}
                            className="p-4 bg-black/40 rounded border-l-2 border-l-primary text-xs text-slate-300 leading-relaxed font-medium italic"
                          >
                            "{insight}"
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts Section */}
                  <div className="w-full">
                    <PerformanceCharts
                      logs={details.logs}
                      comparisonData={comparisonData}
                    />
                  </div>
                </motion.div>
              ) : (
                <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 space-y-4 border-2 border-dashed border-white/5 rounded-2xl">
                  <BarChart3 className="w-12 h-12 opacity-20" />
                  <p className="uppercase tracking-[0.3em] text-[10px] font-black">Select a project to see your performance data.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
