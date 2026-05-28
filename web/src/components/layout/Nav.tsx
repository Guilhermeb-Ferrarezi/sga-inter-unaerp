import { Link, useRouterState } from "@tanstack/react-router";
import { Brand } from "./Brand";
import { cn } from "@/lib/utils";

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
        <span className="font-display italic font-extrabold text-[10.5px] uppercase tracking-[0.1em] text-teal border-[1.5px] border-teal px-2.5 py-1">
          Valorant · 2025
        </span>
        <Link
          to="/entrar"
          className="bg-blue text-white px-5 py-2 text-[11.5px] font-extrabold uppercase tracking-[0.08em] shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:[box-shadow:4px_4px_0_#0A1A3D] transition-all"
        >
          Entrar com SGA
        </Link>
      </div>
    </nav>
  );
}
