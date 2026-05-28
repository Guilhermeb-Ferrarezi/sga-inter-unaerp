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
  WarningCircle,
} from "@phosphor-icons/react";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { TeamLogo } from "@/components/ui/team-logo";
import { Button } from "@/components/ui/button";
import {
  teams,
  matches,
  liveMatches,
  upcomingMatches,
  doneMatches,
  highlights,
} from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const kpis = [
  {
    label: "Times confirmados",
    value: teams.length,
    delta: "+0 esta semana",
    icon: Trophy,
    color: "blue",
  },
  {
    label: "Jogadores",
    value: 47,
    delta: "+3 esta semana",
    icon: Lightning,
    color: "teal",
  },
  {
    label: "Partidas jogadas",
    value: doneMatches().length,
    delta: `${matches.length} previstas`,
    icon: Sword,
    color: "lime",
  },
  {
    label: "Highlights",
    value: highlights.length,
    delta: "+12 esta semana",
    icon: VideoCamera,
    color: "blue",
  },
] as const;

const todos = [
  {
    title: "Registrar resultado: Olimpo vs Thunder (07/Jun)",
    type: "match",
    urgent: true,
  },
  {
    title: "Publicar highlight: ACE g1lh (R22)",
    type: "highlight",
    urgent: false,
  },
  {
    title: "Confirmar roster: Lynx · 1 jogador pendente",
    type: "team",
    urgent: false,
  },
  {
    title: "Upload fotos do estúdio: 07/Jun",
    type: "media",
    urgent: true,
  },
];

const activity = [
  {
    by: "guilherme",
    action: "registrou resultado",
    target: "Olimpo 13×7 Thunder",
    time: "2h atrás",
  },
  {
    by: "henrique",
    action: "publicou highlight",
    target: "ACE do g1lh · R22",
    time: "3h atrás",
  },
  {
    by: "guilherme",
    action: "adicionou jogador",
    target: "scr ao roster Olimpo",
    time: "5h atrás",
  },
  {
    by: "henrique",
    action: "fez upload",
    target: "12 fotos · Bastidores R2",
    time: "1d atrás",
  },
  {
    by: "guilherme",
    action: "atualizou status",
    target: "Inter UnaERP 2025 → ongoing",
    time: "2d atrás",
  },
];

function AdminDashboard() {
  const live = liveMatches();
  const upcoming = upcomingMatches().slice(0, 3);

  return (
    <>
      <AdminTopbar
        title="Dashboard"
        subtitle="Inter UnaERP · Valorant 2025 · em andamento"
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
                <div className="text-[11px] text-teal font-bold mt-1">
                  {k.delta}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CONTENT GRID */}
        <div className="grid lg:grid-cols-3 gap-7">
          {/* LEFT — PARTIDAS + TODO */}
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
              title="A fazer"
              dotColor="lime"
              count={todos.length}
            >
              {todos.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2.5 border-b border-border last:border-b-0"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-lime cursor-pointer"
                  />
                  <span className="flex-1 text-[13px] font-medium text-navy">
                    {t.title}
                  </span>
                  {t.urgent && (
                    <span className="flex items-center gap-1 text-[10px] text-red-500 font-extrabold uppercase tracking-[0.1em]">
                      <WarningCircle weight="fill" size={12} />
                      Urgente
                    </span>
                  )}
                </div>
              ))}
            </DashCard>

            <DashCard
              title="Próximas partidas"
              dotColor="blue"
              link={{ to: "/admin/confrontos", label: "Agenda →" }}
            >
              {upcoming.map((m) => {
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
              })}
            </DashCard>
          </div>

          {/* RIGHT — Atividade + atalhos */}
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

            <DashCard title="Atividade recente" dotColor="blue">
              {activity.map((a, i) => (
                <div
                  key={i}
                  className="py-2.5 border-b border-border last:border-b-0"
                >
                  <div className="text-[12.5px] text-fg-soft leading-snug">
                    <strong className="font-display italic font-black uppercase text-navy mr-1">
                      {a.by}
                    </strong>
                    {a.action}{" "}
                    <strong className="text-blue">{a.target}</strong>
                  </div>
                  <div className="text-[10px] text-fg-mute font-extrabold uppercase tracking-[0.08em] mt-0.5">
                    {a.time}
                  </div>
                </div>
              ))}
            </DashCard>

            <DashCard title="Health Check" dotColor="teal">
              <HealthItem ok label="API GraphQL" detail="200 OK · 12ms" />
              <HealthItem ok label="PostgreSQL" detail="9 ms" />
              <HealthItem ok label="Redis Cache" detail="2 ms" />
              <HealthItem ok label="Cloudflare R2" detail="connected" />
              <HealthItem ok label="Cloudflare Stream" detail="connected" />
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
