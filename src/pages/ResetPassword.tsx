import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Lock, Loader2, ShieldCheck, ArrowRight } from "lucide-react";

const ResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check if we have an active session for password recovery
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        toast({
          title: "Session Expired",
          description: "Recovery link is invalid or expired. Please request a new one.",
          variant: "destructive",
        });
        navigate("/");
      }
    });
  }, [navigate, toast]);

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "Password must be at least 8 characters long.";
    if (!/[a-zA-Z]/.test(pass)) return "Password must contain at least one letter.";
    if (!/[0-9]/.test(pass)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return "Password must contain at least one special character.";
    return null;
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validatePassword(password);
    if (error) {
      toast({ title: "Weak Key", description: error, variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast({
        title: "Key Updated",
        description: "Your system access key has been successfully reconfigured.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b18] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-slate-900/40 border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <div className="h-1 w-full bg-primary/20" />
          <CardHeader className="pb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-primary/20 rounded-xl text-primary border border-primary/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold uppercase tracking-tight text-white line-height-tight">Titon App</CardTitle>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Reset Password</p>
              </div>
            </div>
            <CardDescription className="text-slate-400 font-medium leading-relaxed">
              Enter a new password to regain access to your Titon account and performance metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase text-slate-500">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="Letters + Numbers + Special"
                    className="bg-black/50 border-white/10 pl-10 h-12 text-sm rounded-md focus-visible:ring-primary/50 text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase text-slate-500">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    type="password"
                    placeholder="Repeat your password..."
                    className="bg-black/50 border-white/10 pl-10 h-12 text-sm rounded-md focus-visible:ring-primary/50 text-white"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-14 uppercase text-sm shadow-[0_0_20px_rgba(132,206,58,0.1)] group"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                Update Password
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
              <p className="text-[10px] text-slate-500 text-center font-medium tracking-widest uppercase">
                Secure Account Recovery
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
