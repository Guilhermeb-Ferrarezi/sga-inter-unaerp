import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { SignOut, ShieldCheck, List, X } from "@phosphor-icons/react";
import { Brand } from "./Brand";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const links = [
  { to: "/", label: "Início" },
  { to: "/times", label: "Times" },
  { to: "/jogadores", label: "Jogadores" },
  { to: "/confrontos", label: "Confrontos" },
  { to: "/classificacao", label: "Classificação" },
  { to: "/highlights", label: "Highlights" },
  { to: "/galeria", label: "Galeria" },
  { to: "/edicoes", label: "Edições" },
] as const;

export function Nav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isAdmin, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  // fecha o drawer quando muda de rota
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ESC fecha
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <>
      <nav
        className="sticky top-0 z-50 backdrop-blur-lg border-b border-border h-[68px] px-5 md:px-7 flex items-center justify-between"
        style={{ background: "var(--nav-bg)" }}
      >
        <div className="flex items-center gap-10">
          <Link to="/" className="shrink-0">
            <Brand />
          </Link>
          <ul className="hidden xl:flex gap-1 list-none">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={cn(
                    "relative px-3.5 py-2 text-[12px] font-extrabold uppercase tracking-[0.06em] transition-colors",
                    isActive(l.to) ? "text-blue" : "text-fg-soft hover:text-navy"
                  )}
                >
                  {l.label}
                  {isActive(l.to) && (
                    <span className="absolute -bottom-[23px] left-3.5 right-3.5 h-[3px] bg-blue" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden md:flex" />
          <span className="hidden lg:inline-flex font-display italic font-extrabold text-[10.5px] uppercase tracking-[0.1em] text-teal border-[1.5px] border-teal px-2.5 py-1">
            Valorant · 2025
          </span>
          {user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="bg-lime text-navy px-3 py-2 text-[11px] font-display italic font-extrabold uppercase tracking-[0.08em] [box-shadow:2px_2px_0_#0A1A3D] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:[box-shadow:3px_3px_0_#0A1A3D] transition-all inline-flex items-center gap-1.5"
                >
                  <ShieldCheck weight="fill" size={12} />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}
              <div className="flex items-center gap-2 bg-surface-3 border border-border-strong pl-2 pr-1 py-1">
                <div className="w-6 h-6 bg-navy text-white flex items-center justify-center font-display italic font-black text-[10px]">
                  {user.login.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-display italic font-extrabold text-[12px] uppercase text-navy">
                  {user.login}
                </span>
                <button
                  onClick={signOut}
                  className="w-6 h-6 flex items-center justify-center text-fg-mute hover:text-red-500 transition-colors"
                  title="Sair"
                >
                  <SignOut weight="bold" size={12} />
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/entrar"
              className="hidden sm:inline-flex bg-blue text-white px-5 py-2 text-[11.5px] font-extrabold uppercase tracking-[0.08em] shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:[box-shadow:4px_4px_0_#0A1A3D] transition-all"
            >
              Entrar com SGA
            </Link>
          )}
          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="xl:hidden w-10 h-10 flex items-center justify-center bg-navy text-white hover:bg-blue transition-colors"
            aria-label="Abrir menu"
          >
            <List weight="bold" size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[100] bg-navy/40 backdrop-blur-sm xl:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 z-[110] w-[88%] max-w-[420px] bg-bg border-l-[3px] border-lime shadow-2xl flex flex-col xl:hidden overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <Brand />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 flex items-center justify-center bg-navy text-white"
                  aria-label="Fechar"
                >
                  <X weight="bold" size={18} />
                </button>
              </div>

              <div className="px-5 py-3 border-b border-border">
                <span className="inline-flex font-display italic font-extrabold text-[10.5px] uppercase tracking-[0.1em] text-teal border-[1.5px] border-teal px-2.5 py-1">
                  Valorant · 2025
                </span>
              </div>

              <nav className="flex-1 overflow-y-auto p-3">
                {links.map((l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                  >
                    <Link
                      to={l.to}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-4 py-4 font-display italic font-black uppercase text-[24px] tracking-[-0.01em] transition-colors border-b border-border last:border-b-0",
                        isActive(l.to)
                          ? "text-blue [text-shadow:3px_3px_0_#A4CD3A]"
                          : "text-navy hover:text-blue"
                      )}
                    >
                      <span>
                        <span className="font-display italic font-extrabold text-fg-mute text-[12px] tracking-[0.12em] mr-3">
                          0{i + 1}
                        </span>
                        {l.label}
                      </span>
                      {isActive(l.to) && (
                        <span className="w-2 h-2 bg-lime" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="border-t border-border p-5 bg-surface-3">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-navy text-white flex items-center justify-center font-display italic font-black text-[16px]">
                        {user.login.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-display italic font-black text-[16px] uppercase text-navy leading-none">
                          {user.login}
                        </div>
                        <div className="text-[11px] text-fg-mute font-bold uppercase tracking-[0.08em]">
                          {user.email}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setMobileOpen(false);
                        }}
                        className="w-9 h-9 flex items-center justify-center bg-white border border-border text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        aria-label="Sair"
                      >
                        <SignOut weight="bold" size={14} />
                      </button>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="block bg-lime text-navy py-3 text-center font-display italic font-extrabold uppercase text-[13px] tracking-[0.08em] [box-shadow:3px_3px_0_#0A1A3D]"
                      >
                        <ShieldCheck weight="fill" size={14} className="inline mr-2" />
                        Painel Admin
                      </Link>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/entrar"
                    onClick={() => setMobileOpen(false)}
                    className="block bg-blue text-white py-3 text-center font-display italic font-extrabold uppercase text-[13px] tracking-[0.08em] shadow-brutal-sm"
                  >
                    Entrar com SGA
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
