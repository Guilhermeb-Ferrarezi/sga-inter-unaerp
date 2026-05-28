import { Link, useRouterState } from "@tanstack/react-router";
import { SignOut, ShieldCheck } from "@phosphor-icons/react";
import { Brand } from "./Brand";
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
  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <nav className="sticky top-0 z-50 bg-bg/90 backdrop-blur-lg border-b border-border h-[68px] px-7 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <Link to="/" className="shrink-0">
          <Brand />
        </Link>
        <ul className="flex gap-1 list-none">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={cn(
                  "relative px-3.5 py-2 text-[12px] font-extrabold uppercase tracking-[0.06em] transition-colors",
                  isActive(l.to)
                    ? "text-blue"
                    : "text-fg-soft hover:text-navy"
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
        <span className="hidden md:inline-flex font-display italic font-extrabold text-[10.5px] uppercase tracking-[0.1em] text-teal border-[1.5px] border-teal px-2.5 py-1">
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
                Admin
              </Link>
            )}
            <div className="flex items-center gap-2 bg-surface-3 border border-border-strong pl-2 pr-1 py-1">
              <div className="w-6 h-6 bg-navy text-white flex items-center justify-center font-display italic font-black text-[10px]">
                {user.login.charAt(0).toUpperCase()}
              </div>
              <span className="font-display italic font-extrabold text-[12px] uppercase text-navy">
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
            className="bg-blue text-white px-5 py-2 text-[11.5px] font-extrabold uppercase tracking-[0.08em] shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:[box-shadow:4px_4px_0_#0A1A3D] transition-all"
          >
            Entrar com SGA
          </Link>
        )}
      </div>
    </nav>
  );
}
