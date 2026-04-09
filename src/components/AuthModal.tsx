import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, UserPlus, LogIn, Loader2, Rocket, User, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { userService } from "@/services/userService";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [isResetMode, setIsResetMode] = useState(false);

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "Password must be at least 8 characters long.";
    if (!/[a-zA-Z]/.test(pass)) return "Password must contain at least one letter.";
    if (!/[0-9]/.test(pass)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return "Password must contain at least one special character.";
    return null;
  };

  const handleAuth = async (type: "login" | "signup") => {
    if (!email.trim() || !password) {
      toast({ title: "Incomplete Flow", description: "Email and password are required.", variant: "destructive" });
      return;
    }

    if (type === "signup") {
      if (password !== confirmPassword) {
        toast({ title: "Mismatch", description: "Passwords do not match.", variant: "destructive" });
        return;
      }
      const error = validatePassword(password);
      if (error) {
        toast({ title: "Weak Credentials", description: error, variant: "destructive" });
        return;
      }
    }

    setLoading(true);
    try {
      let result;
      if (type === "signup") {
        result = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName.trim()
            }
          }
        });
      } else {
        result = await supabase.auth.signInWithPassword({ email, password });
      }

      if (result.error) throw result.error;

      if (type === "signup") {
        if (result.data.user) {
          await userService.syncUser(result.data.user.id, email, fullName);
        }
        toast({
          title: "Verify Your Email",
          description: "We sent a link to your email. Check your inbox (and spam) to activate your account!",
        });
      } else {
        if (result.data.user) {
          await userService.syncUser(result.data.user.id, email);
        }
        toast({
          title: "Welcome Back",
          description: "You have successfully signed in.",
        });
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error("Auth System Error:", error);
      toast({
        title: "Auth Failed",
        description: error.message || "An unexpected error occurred during authentication.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetRequest = async () => {
    if (!email) {
      toast({ title: "Missing ID", description: "Please enter your email address to receive a reset link.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast({
        title: "Link Dispatched",
        description: "A password reset link has been sent to your email.",
      });
      setIsResetMode(false);
    } catch (error: any) {
      toast({ title: "Request Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] bg-slate-950 border border-white/10 text-white backdrop-blur-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />

        <DialogHeader className="pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Rocket className="w-5 h-5" />
            </div>
            <DialogTitle className="text-xl font-bold uppercase">
              {isResetMode ? "Reset Password" : "Titon App Account"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-400 text-sm font-normal">
            {isResetMode
              ? "Enter your email address to receive a password reset link."
              : "Please sign in or create an account to manage your data."}
          </DialogDescription>
        </DialogHeader>

        {!isResetMode ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-white/5 p-1 mb-8">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-black font-semibold uppercase text-xs transition-all">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-black font-semibold uppercase text-xs transition-all">Sign Up</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {activeTab === "login" ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 py-4"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase text-slate-500">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="your@email.com"
                        className="bg-black/50 border-white/10 pl-10 h-11 text-sm rounded-md focus-visible:ring-primary/50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-medium uppercase text-slate-500">Password</label>
                      <button
                        onClick={() => setIsResetMode(true)}
                        className="text-[10px] font-semibold text-primary hover:text-white transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password..."
                        className="bg-black/50 border-white/10 pl-10 pr-10 h-11 text-sm rounded-md focus-visible:ring-primary/50"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAuth("login")}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-12 uppercase text-sm mt-4"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
                    Sign In
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 py-4"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase text-slate-500">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="John Doe"
                        className="bg-black/50 border-white/10 pl-10 h-11 text-sm rounded-md focus-visible:ring-primary/50"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase text-slate-500">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="your@email.com"
                        className="bg-black/50 border-white/10 pl-10 h-11 text-sm rounded-md focus-visible:ring-primary/50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase text-slate-500">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Letters + Numbers + Special"
                        className="bg-black/50 border-white/10 pl-10 pr-10 h-11 text-sm rounded-md focus-visible:ring-primary/50"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase text-slate-500">Confirm Password</label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Type password again..."
                        className="bg-black/50 border-white/10 pl-10 pr-10 h-11 text-sm rounded-md focus-visible:ring-primary/50"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAuth("signup")}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-12 uppercase text-sm mt-4"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                    Create Account
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Tabs>
        ) : (
          <div className="space-y-6 pt-4 pb-8">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase text-slate-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="your@email.com"
                  className="bg-black/50 border-white/10 pl-10 h-11 text-sm rounded-md focus-visible:ring-primary/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-3">
              <Button
                onClick={handleResetRequest}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-12 uppercase text-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Rocket className="w-4 h-4 mr-2" />}
                Send Reset Link
              </Button>
              <button
                onClick={() => setIsResetMode(false)}
                className="w-full text-xs font-semibold text-slate-500 hover:text-white transition-colors py-2"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-slate-500 text-center font-medium uppercase tracking-widest">
          Secure System Authentication
        </div>
      </DialogContent>
    </Dialog>
  );
};
