import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TeamLogo } from "@/components/ui/team-logo";
import { Section, SectionHeader } from "@/components/ui/section";
import { MatchCard } from "@/components/cards/MatchCard";
import {
  findTeam,
  teamRoster,
  teamMatches,
} from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/times/$slug")({
  loader: ({ params }) => {
    const team = findTeam(params.slug);
    if (!team) throw notFound();
    return { team };
  },
  component: TeamDetailPage,
});

function TeamDetailPage() {
  const { team } = Route.useLoaderData();
  const roster = teamRoster(team.slug);
  const matches = teamMatches(team.slug).slice(0, 4);
  const captain = roster.find((p) => p.isCaptain);

  return (
    <>
      {/* HERO */}
      <header className="relative bg-gradient-to-br from-surface-1 to-surface-3 overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 70% at 90% 50%, rgba(0,115,183,0.18) 0%, transparent 60%), radial-gradient(ellipse 40% 80% at 70% 30%, rgba(46,170,128,0.10) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-[1500px] mx-auto px-7 py-16 grid grid-cols-[auto_1fr_auto] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <TeamLogo
              shortName={team.shortName}
              color={team.color}
              size="xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <div className="flex gap-2 items-center text-[11px] text-fg-mute font-extrabold uppercase tracking-[0.12em] mb-3.5">
              <Link to="/" className="hover:text-blue">
                Inter UnaERP
              </Link>
              <span>/</span>
              <Link to="/times" className="hover:text-blue">
                Times
              </Link>
              <span>/</span>
              <span>{team.name}</span>
            </div>
            <h1 className="font-display italic font-black uppercase text-[96px] leading-[0.9] text-navy tracking-[-0.025em]">
              {team.name}
            </h1>
            <div className="flex flex-wrap gap-3.5 mt-3.5">
              <Pill>@{team.slug}</Pill>
              <Pill>
                Grupo <strong className="text-blue">{team.group}</strong>
              </Pill>
              <Pill>{roster.length} jogadores</Pill>
              {captain && (
                <Pill>
                  Capitão <strong className="text-blue">{captain.ign}</strong>
                </Pill>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-4 min-w-[460px]"
          >
            <HeroStat label="Vitórias" value={team.wins} variant="teal" />
            <HeroStat label="Derrotas" value={team.losses} variant="mute" />
            <HeroStat
              label="Saldo"
              value={team.pointsDiff > 0 ? `+${team.pointsDiff}` : team.pointsDiff}
              variant="lime"
            />
            <HeroStat label="Pontos" value={team.points} variant="blue" />
          </motion.div>
        </div>
      </header>

      {/* ROSTER */}
      <Section decoNum="01">
        <SectionHeader
          number="01"
          variant="lime"
          title={
            <>
              Roster <span className="text-lime">Atual</span>
            </>
          }
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {roster.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={cn(
                "relative bg-white border-[1.5px] border-border-strong p-5 text-center [box-shadow:4px_4px_0_#0A1A3D] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:[box-shadow:6px_6px_0_#0A1A3D] transition-all cursor-pointer",
                p.isCaptain && "border-l-4 border-l-lime"
              )}
            >
              {p.isCaptain && (
                <span className="absolute -top-2.5 -right-2.5 bg-lime text-navy font-display italic font-black text-[10px] px-2 py-1 uppercase tracking-[0.1em] shadow-brutal-sm">
                  Capitão
                </span>
              )}
              <div className="w-20 h-20 bg-gradient-to-br from-blue to-teal text-white font-display italic font-black text-[30px] flex items-center justify-center mx-auto mb-3.5">
                {p.ign.charAt(0).toUpperCase()}
              </div>
              <div className="font-display italic font-black text-[22px] uppercase text-navy leading-none">
                {p.ign}
              </div>
              <div className="text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.1em] my-1.5 mb-3.5">
                {p.role}
                {p.isIgl && " · IGL"}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-3 border-t-[1.5px] border-border text-left">
                <div>
                  <div className="text-[9px] text-fg-mute font-extrabold uppercase tracking-[0.1em]">
                    K/D
                  </div>
                  <div className="font-display italic font-black text-[18px] text-navy tabular-nums">
                    {p.stats.kd.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] text-fg-mute font-extrabold uppercase tracking-[0.1em]">
                    ACS
                  </div>
                  <div className="font-display italic font-black text-[18px] text-navy tabular-nums">
                    {p.stats.acs}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* RECENT MATCHES + SIDEBAR */}
      <Section alt decoNum="02">
        <SectionHeader
          number="02"
          variant="teal"
          title={
            <>
              Partidas <span className="text-teal">Recentes</span>
            </>
          }
          link={{ to: "/confrontos", label: "Todas as partidas →" }}
        />
        <div className="grid lg:grid-cols-[1fr_340px] gap-7">
          <div>
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
          <div className="space-y-5.5">
            <SidebarCard title="Conquistas" dotColor="lime">
              <Achievement
                year="2024"
                title="🏆 Inter UnaERP"
                result="Campeão · Valorant"
              />
              <Achievement
                year="2023"
                title="2º Lugar"
                result="Inter UnaERP · Valorant"
              />
              <Achievement
                year="2022"
                title="Semi-finalista"
                result="Inter UnaERP · Valorant"
              />
            </SidebarCard>
            <SidebarCard title="Desempenho por Mapa" dotColor="teal">
              <MapPerf name="Ascent" w={2} l={0} wr="100%" />
              <MapPerf name="Bind" w={1} l={0} wr="100%" />
              <MapPerf name="Haven" w={1} l={0} wr="100%" />
              <MapPerf name="Pearl" w={0} l={0} wr="—" />
            </SidebarCard>
          </div>
        </div>
      </Section>
    </>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-white border-[1.5px] border-border-strong px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-fg-soft font-display italic">
      {children}
    </span>
  );
}

function HeroStat({
  label,
  value,
  variant,
}: {
  label: string;
  value: number | string;
  variant: "teal" | "lime" | "blue" | "mute";
}) {
  const colors = {
    teal: "text-teal",
    lime: "text-lime",
    blue: "text-blue",
    mute: "text-fg-mute",
  };
  return (
    <div className="px-5.5 border-r border-border-strong last:border-r-0 text-center">
      <div
        className={cn(
          "font-display italic font-black text-[48px] leading-none tabular-nums",
          colors[variant]
        )}
      >
        {value}
      </div>
      <div className="text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.1em] mt-1.5">
        {label}
      </div>
    </div>
  );
}

function SidebarCard({
  title,
  dotColor,
  children,
}: {
  title: string;
  dotColor: "lime" | "teal" | "blue";
  children: React.ReactNode;
}) {
  const dotMap = {
    lime: "bg-lime",
    teal: "bg-teal",
    blue: "bg-blue",
  };
  return (
    <div className="bg-white border-[1.5px] border-border-strong p-5.5 shadow-brutal">
      <div className="font-display italic font-black text-[20px] uppercase text-navy mb-4 pb-2.5 border-b-2 border-navy flex items-center gap-2.5">
        <span className={cn("w-2.5 h-2.5", dotMap[dotColor])} />
        {title}
      </div>
      {children}
    </div>
  );
}

function Achievement({
  year,
  title,
  result,
}: {
  year: string;
  title: string;
  result: string;
}) {
  return (
    <div className="flex gap-3 items-center py-2.5 border-b border-border last:border-b-0">
      <div className="font-display italic font-black text-[22px] text-lime min-w-[56px]">
        {year}
      </div>
      <div>
        <div className="font-display italic font-extrabold text-[14px] text-navy uppercase leading-tight">
          {title}
        </div>
        <div className="text-[11px] text-fg-mute font-bold uppercase tracking-[0.06em] mt-0.5">
          {result}
        </div>
      </div>
    </div>
  );
}

function MapPerf({
  name,
  w,
  l,
  wr,
}: {
  name: string;
  w: number;
  l: number;
  wr: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-center py-2.5 border-b border-border last:border-b-0">
      <span className="font-display italic font-extrabold text-[15px] uppercase text-navy">
        {name}
      </span>
      <span className="font-display italic font-black text-[16px] text-teal">
        {w}
        <span className="text-fg-mute">·{l}</span>
      </span>
      <span className="text-[11px] text-fg-mute font-extrabold">{wr}</span>
    </div>
  );
}
