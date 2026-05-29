import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Trophy,
  Sword,
  ImageSquare,
  VideoCamera,
  Plus,
  Lightning,
  TrendUp,
  CheckCircle,
} from "@phosphor-icons/react";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { TeamLogo } from "@/components/ui/team-logo";
import { Button } from "@/components/ui/button";
import { useEditionTeams } from "@/lib/use-edition";
import { useEditionMatches, isLive, isUpcoming, isDone } from "@/lib/use-matches";
import { useEditionHighlights } from "@/lib/use-highlights";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { teams } = useEditionTeams("valorant");
  const { matches } = useEditionMatches("valorant");
  const { highlights } = useEditionHighlights("valorant");

  const live = matches.filter(isLive);
  const upcoming = matches.filter(isUpcoming).slice(0, 3);
  const done = matches.filter(isDone);

  const kpis = [
    {
      label: "Times confirmados",
      value: teams.length,
      icon: Trophy,
      color: "blue" as const,
    },
    {
      label: "Jogadores",
      value: "—",
      icon: Lightning,
      color: "teal" as const,
    },
    {
      label: "Partidas jogadas",
      value: done.length,
      delta: `${matches.length} previstas`,
      icon: Sword,
      color: "lime" as const,
    },
    {
      label: "Highlights",
      value: highlights.length,
      icon: VideoCamera,
      color: "blue" as const,
    },
  ];

  return (
    <>
      <AdminTopbar
        title="Dashboard"
        subtitle="Inter UnaERP · Valorant 2025"
        actions={
          <Button asChild>
            <Link to="/admin/confrontos">
              <Plus weight="bold" size={14} />
              Nova partida
            </Link>
          </Button>
        }
      />

      <div className="p-9 space-y-7">
        {/* KPI ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {kpis.map((k, i) => {
            const Icon = k.icon;
            return (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={cn(
                  "bg-white border-[1.5px] border-border-strong p-5 relative",
                  k.color === "blue" && "shadow-brutal-blue",
                  k.color === "teal" && "shadow-brutal-teal",
                  k.color === "lime" && "shadow-brutal-lime"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={cn(
                      "w-9 h-9 flex items-center justify-center",
                      k.color === "blue" && "bg-blue/10 text-blue",
                      k.color === "teal" && "bg-teal/10 text-teal",
                      k.color === "lime" && "bg-lime/15 text-[#6B8E1A]"
                    )}
                  >
                    <Icon weight="bold" size={18} />
                  </div>
                  <TrendUp weight="bold" size={14} className="text-teal" />
                </div>
                <div className="font-display italic font-black text-[44px] leading-none text-navy tabular-nums">
                  {k.value}
                </div>
                <div className="text-[11px] text-fg-mute font-extrabold uppercase tracking-[0.1em] mt-1.5">
                  {k.label}
                </div>
                {k.delta && (
                  <div className="text-[11px] text-teal font-bold mt-1">
                    {k.delta}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CONTENT GRID */}
        <div className="grid lg:grid-cols-3 gap-7">
          <div className="lg:col-span-2 space-y-6">
            <DashCard
              title="Ao vivo agora"
              dotColor="lime"
              link={{ to: "/admin/confrontos", label: "Gerenciar →" }}
            >
              {live.length === 0 ? (
                <Empty text="Nenhuma partida ao vivo agora" />
              ) : (
                live.map((m) => {
                  const a = teams.find((t) => t.slug === m.teamA);
                  const b = teams.find((t) => t.slug === m.teamB);
                  if (!a || !b) return null;
                  return (
                    <div
                      key={m.id}
                      className="flex items-center gap-4 py-3 border-b border-border last:border-b-0"
                    >
                      <span className="font-display italic font-black text-[10px] bg-lime text-navy px-2 py-0.5 uppercase tracking-[0.1em]">
                        Live
                      </span>
                      <div className="flex items-center gap-3 flex-1">
                        <TeamLogo
                          shortName={a.shortName}
                          color={a.color}
                          size="sm"
                        />
                        <span className="font-display italic font-extrabold text-[15px] uppercase text-navy">
                          {a.name}
                        </span>
                        <span className="text-fg-mute text-[10px] font-extrabold uppercase">
                          vs
                        </span>
                        <span className="font-display italic font-extrabold text-[15px] uppercase text-navy">
                          {b.name}
                        </span>
                        <TeamLogo
                          shortName={b.shortName}
                          color={b.color}
                          size="sm"
                        />
                      </div>
                      <Button size="sm" variant="blue">
                        Painel ao vivo
                      </Button>
                    </div>
                  );
                })
              )}
            </DashCard>

            <DashCard
              title="Próximas partidas"
              dotColor="blue"
              link={{ to: "/admin/confrontos", label: "Agenda →" }}
            >
              {upcoming.length === 0 ? (
                <Empty text="Nenhuma partida agendada" />
              ) : (
                upcoming.map((m) => {
                  const a = teams.find((t) => t.slug === m.teamA);
                  const b = teams.find((t) => t.slug === m.teamB);
                  if (!a || !b) return null;
                  const d = new Date(m.scheduledAt);
                  return (
                    <div
                      key={m.id}
                      className="grid grid-cols-[80px_1fr_auto] gap-3 py-3 items-center border-b border-border last:border-b-0"
                    >
                      <div>
                        <div className="text-[10px] text-fg-mute font-extrabold uppercase tracking-[0.08em]">
                          {new Intl.DateTimeFormat("pt-BR", {
                            weekday: "short",
                            day: "2-digit",
                            month: "2-digit",
                          }).format(d)}
                        </div>
                        <div className="font-display italic font-black text-[18px] text-navy tabular-nums">
                          {new Intl.DateTimeFormat("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(d)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <TeamLogo
                          shortName={a.shortName}
                          color={a.color}
                          size="xs"
                        />
                        <span className="font-display italic font-extrabold text-[14px] uppercase text-navy">
                          {a.name}
                        </span>
                        <span className="text-fg-mute text-[10px] font-extrabold uppercase">
                          vs
                        </span>
                        <span className="font-display italic font-extrabold text-[14px] uppercase text-navy">
                          {b.name}
                        </span>
                        <TeamLogo
                          shortName={b.shortName}
                          color={b.color}
                          size="xs"
                        />
                      </div>
                      <Button size="sm" variant="ghost">
                        Editar
                      </Button>
                    </div>
                  );
                })
              )}
            </DashCard>
          </div>

          <div className="space-y-6">
            <DashCard title="Atalhos" dotColor="teal">
              <div className="grid grid-cols-2 gap-2">
                <ShortcutCard
                  to="/admin/times"
                  icon={Trophy}
                  label="Novo time"
                />
                <ShortcutCard
                  to="/admin/jogadores"
                  icon={Lightning}
                  label="Novo jogador"
                />
                <ShortcutCard
                  to="/admin/midia"
                  icon={ImageSquare}
                  label="Upload fotos"
                />
                <ShortcutCard
                  to="/admin/highlights"
                  icon={VideoCamera}
                  label="Novo highlight"
                />
              </div>
            </DashCard>

            <DashCard title="Health Check" dotColor="teal">
              <HealthItem ok label="API GraphQL" detail="conectado" />
              <HealthItem ok label="PostgreSQL" detail="ok" />
              <HealthItem ok label="Redis Cache" detail="ok" />
              <HealthItem ok label="Cloudflare R2" detail="conectado" />
            </DashCard>
          </div>
        </div>
      </div>
    </>
  );
}

function DashCard({
  title,
  dotColor,
  link,
  count,
  children,
}: {
  title: string;
  dotColor: "lime" | "teal" | "blue";
  link?: { to: string; label: string };
  count?: number;
  children: React.ReactNode;
}) {
  const dotMap = {
    lime: "bg-lime",
    teal: "bg-teal",
    blue: "bg-blue",
  };
  return (
    <div className="bg-white border-[1.5px] border-border-strong p-5 shadow-brutal-sm">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
        <div className="font-display italic font-black text-[16px] uppercase text-navy flex items-center gap-2.5">
          <span className={cn("w-2.5 h-2.5", dotMap[dotColor])} />
          {title}
          {count !== undefined && (
            <span className="text-fg-mute text-[12px]">({count})</span>
          )}
        </div>
        {link && (
          <Link
            to={link.to}
            className="text-[11px] text-blue font-extrabold uppercase tracking-[0.1em] hover:text-navy"
          >
            {link.label}
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="py-6 text-center text-fg-mute text-[13px] font-medium">
      {text}
    </div>
  );
}

function ShortcutCard({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: typeof Lightning;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="bg-surface-3 border border-border p-3.5 flex flex-col items-center gap-2 hover:border-blue hover:bg-white transition-colors"
    >
      <Icon weight="bold" size={20} className="text-blue" />
      <span className="text-[11px] text-navy font-display italic font-extrabold uppercase text-center">
        {label}
      </span>
    </Link>
  );
}

function HealthItem({
  ok,
  label,
  detail,
}: {
  ok: boolean;
  label: string;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-2.5 py-2 border-b border-border last:border-b-0">
      <CheckCircle
        weight="fill"
        size={16}
        className={ok ? "text-teal" : "text-red-500"}
      />
      <span className="text-[13px] text-navy font-semibold flex-1">{label}</span>
      <span className="text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.06em]">
        {detail}
      </span>
    </div>
  );
}
