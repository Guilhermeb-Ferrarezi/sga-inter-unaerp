import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChartLineUp,
  Trophy,
  UsersThree,
  GameController,
  Sword,
  ImageSquare,
  VideoCamera,
  UploadSimple,
  SignOut,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { Brand } from "@/components/layout/Brand";
import { cn } from "@/lib/utils";

type SidebarItem = {
  to: string;
  label: string;
  icon: typeof ChartLineUp;
  exact?: boolean;
};

const sections: { label: string; items: SidebarItem[] }[] = [
  {
    label: "Visão geral",
    items: [
      { to: "/admin", label: "Dashboard", icon: ChartLineUp, exact: true },
      { to: "/admin/edicoes", label: "Edições", icon: Trophy },
    ],
  },
  {
    label: "Gestão",
    items: [
      { to: "/admin/times", label: "Times", icon: UsersThree },
      { to: "/admin/jogadores", label: "Jogadores", icon: GameController },
      { to: "/admin/confrontos", label: "Confrontos", icon: Sword },
    ],
  },
  {
    label: "Conteúdo",
    items: [
      { to: "/admin/midia", label: "Mídia (R2)", icon: ImageSquare },
      { to: "/admin/highlights", label: "Highlights", icon: VideoCamera },
      { to: "/admin/importar", label: "Importar", icon: UploadSimple },
    ],
  },
];

export function AdminSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="bg-navy text-white w-[260px] min-h-screen sticky top-0 flex flex-col p-5 border-r-[3px] border-lime">
      <div className="mb-2">
        <Link to="/" className="inline-block">
          <Brand />
        </Link>
        <div className="mt-3 inline-flex items-center gap-2 bg-lime text-navy px-2.5 py-1 font-display italic font-black text-[10px] uppercase tracking-[0.12em] [box-shadow:2px_2px_0_#0E4D8C]">
          Admin
        </div>
      </div>

      <nav className="mt-7 flex-1 space-y-7">
        {sections.map((s) => (
          <div key={s.label}>
            <div className="text-[10px] text-white/40 font-extrabold uppercase tracking-[0.16em] mb-2.5 px-2">
              {s.label}
            </div>
            <ul className="space-y-0.5">
              {s.items.map((item) => {
                const active = item.exact
                  ? pathname === item.to
                  : pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 font-display italic font-extrabold text-[14px] uppercase tracking-[0.04em] transition-all relative",
                        active
                          ? "bg-lime text-navy [box-shadow:3px_3px_0_#0E4D8C]"
                          : "text-white/70 hover:text-white hover:bg-white/[0.05]"
                      )}
                    >
                      <Icon weight={active ? "fill" : "bold"} size={18} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-7 pt-5 border-t border-white/10 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 text-[11px] text-white/60 font-extrabold uppercase tracking-[0.1em] hover:text-white"
        >
          <ArrowSquareOut weight="bold" size={14} />
          Voltar ao site
        </Link>
        <button className="flex items-center gap-2.5 px-3 py-2 text-[11px] text-white/60 font-extrabold uppercase tracking-[0.1em] hover:text-white w-full text-left">
          <SignOut weight="bold" size={14} />
          Sair
        </button>
      </div>
    </aside>
  );
}
