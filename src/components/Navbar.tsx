import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Menu, X, LogIn, UserPlus, LayoutDashboard, LogOut, Home, Sparkles, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AuthModal } from "./AuthModal";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { GlobalSearch } from "./GlobalSearch";

export const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "expo.out", delay: 0.5 }
    );

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Successfully logged out");
    navigate("/");
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "KM Vault", href: "/kmvault" },
    { name: "About", href: "#about" },
    { name: "POP", href: "/pop" },
    // { name: "R6 Audit", href: "#r6-audit" },
    { name: "PSD Quickstart", href: "#psd-quickstart" },
    { name: "Proof", href: "#proof" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center w-full transition-all duration-500 pt-4 md:pt-6 px-4 pointer-events-none">
        <nav
          ref={navRef}
          className={`pointer-events-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-between w-full max-w-[1400px] ${scrolled || isMenuOpen
              ? "py-3 px-6 bg-[#0a1122]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-[32px]"
              : "py-4 px-2 bg-transparent rounded-none"
            }`}
        >
          {/* Logo Section */}
          <a href="/" className="flex items-center gap-3 group/logo cursor-pointer shrink-0">
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-transform duration-500 group-hover/logo:scale-110">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-50 opacity-0 group-hover/logo:opacity-100 group-hover/logo:scale-150 transition-all duration-700" />
              <img
                src="/logo.png"
                alt="TITON Logo"
                className="relative z-10 w-full h-full object-contain group-hover/logo:rotate-[5deg] transition-all duration-500"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-lg md:text-xl tracking-tighter text-white uppercase group-hover/logo:text-primary transition-colors duration-300">
                TITON
              </span>
              <span className="text-[7px] md:text-[8px] font-black tracking-[0.5em] text-primary uppercase opacity-80 group-hover/logo:opacity-100 transition-opacity duration-300">
                System
              </span>
            </div>
          </a>

          {/* Center Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/[0.03] rounded-full border border-white/5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em] hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <a
              href="/r6-audit"
              className="group flex items-center gap-2 px-5 py-2.5 bg-[#84ce3a]/10 border border-[#84ce3a]/20 text-[#84ce3a] hover:bg-[#84ce3a] hover:text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full transition-all duration-500"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>R6 Audit</span>
            </a>

            <div className="w-px h-8 bg-white/10 mx-1" />

            {!session ? (
              <>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-5 py-2.5 text-white hover:text-primary text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:scale-105 rounded-full transition-all duration-500"
                >
                  <span>Join</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all duration-300"
                  title="Exit System"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-white hover:text-primary transition-colors z-[101]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[99] bg-[#050b18]/95 backdrop-blur-xl transition-all duration-500 lg:hidden flex flex-col justify-center px-8 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex flex-col gap-6 mt-16">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-white text-2xl font-black uppercase tracking-tighter hover:text-primary transition-colors flex items-center justify-between group"
            >
              {link.name}
              <ChevronRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
            </a>
          ))}

          <div className="w-full h-px bg-white/10 my-4" />

          <a
            href="/r6-audit"
            onClick={() => setIsMenuOpen(false)}
            className="w-full py-4 flex items-center justify-center gap-2 bg-[#84ce3a]/10 border border-[#84ce3a]/20 text-[#84ce3a] text-sm font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-[#84ce3a] hover:text-black transition-all"
          >
            <Sparkles className="w-4 h-4" /> R6 Audit
          </a>

          {!session ? (
            <div className="grid grid-cols-2 gap-4 mt-2">
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full py-4 text-center border border-white/10 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="w-full py-4 text-center bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-primary transition-all"
              >
                Join
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-2">
              <button
                onClick={handleLogout}
                className="w-full py-4 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" /> Exit System
              </button>
            </div>
          )}

          <div className="mt-8 text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase text-center">
            TITON CORE v1.0.4 - ACTIVE SYSTEM
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
          });
        }}
      />
    </>
  );
};

export default Navbar;
