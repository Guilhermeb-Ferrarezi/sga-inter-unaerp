import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play } from "@phosphor-icons/react";
import { Section, SectionHeader } from "@/components/ui/section";
import { TeamLogo } from "@/components/ui/team-logo";
import { HighlightCard } from "@/components/cards/HighlightCard";
import { findMatch, findTeam, highlights } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/confrontos/$id")({
  loader: ({ params }) => {
    const match = findMatch(params.id);
    if (!match) throw notFound();
    return { match };
  },
  component: MatchDetailPage,
});

function MatchDetailPage() {
  const { match } = Route.useLoaderData();
  const a = findTeam(match.teamA);
  const b = findTeam(match.teamB);
  if (!a || !b) return null;

  const aWon = match.result?.winnerSlug === a.slug;
  const matchHighlights = highlights.filter((h) => h.matchId === match.id).slice(0, 4);
  const fallbackHl = matchHighlights.length === 0 ? highlights.slice(0, 4) : matchHighlights;

  return (
    <>
      <header className="relative bg-gradient-to-br from-surface-1 to-surface-3 border-b border-border overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 25% 50%, rgba(0,115,183,0.18) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(10,26,61,0.10) 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-[1500px] mx-auto px-7 pt-7 pb-14">
          <div className="flex gap-2 items-center text-[11px] text-fg-mute font-extrabold uppercase tracking-[0.12em]">
            <Link to="/" className="hover:text-blue">Inter UnaERP</Link>
            <span>/</span>
            <Link to="/confrontos" className="hover:text-blue">Confrontos</Link>
            <span>/</span>
            <span>{a.name} vs {b.name}</span>
          </div>

          <div className="flex items-center gap-3.5 mt-8 mb-8">
            <span
              className={cn(
                "px-3 py-1 font-display italic font-extrabold text-[11px] uppercase tracking-[0.1em]",
                match.status === "live"
                  ? "bg-lime text-navy"
                  : match.status === "done"
                  ? "bg-teal text-white"
                  : "bg-blue text-white"
              )}
            >
              {match.status === "live"
                ? "Ao Vivo"
                : match.status === "done"
                ? "Encerrada"
                : "Agendada"}
            </span>
            <Pill>
              Grupo <strong className="text-blue">{match.group}</strong>
            </Pill>
            <Pill>{match.round}</Pill>
            <Pill>MD <strong className="text-blue">1</strong></Pill>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-[1fr_auto_1fr] gap-8 items-center py-7"
          >
            <div className="flex items-center gap-7">
              <TeamLogo
                shortName={a.shortName}
                color={a.color}
                size="xl"
              />
              <div>
                <div className="font-display italic font-black uppercase text-[64px] leading-[0.9] text-navy tracking-[-0.025em]">
                  {a.name}
                </div>
                <div className="text-[11px] text-fg-mute font-extrabold uppercase tracking-[0.1em] mt-1.5">
                  @{a.slug} · Grupo {a.group}
                </div>
                <div className="flex gap-2 mt-1.5 font-display italic font-black text-[18px]">
                  <span className="text-teal">{a.wins}V</span>
                  <span className="text-fg-mute">{a.losses}D</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="font-display italic font-black text-[144px] leading-none text-navy tracking-[-0.05em] tabular-nums">
                <span className={cn(aWon && "text-teal")}>
                  {match.result?.scoreA ?? "—"}
                </span>
                <span className="text-border-strong mx-3 font-normal">·</span>
                <span className={cn(!aWon && match.result && "text-teal")}>
                  {match.result?.scoreB ?? "—"}
                </span>
              </div>
              {match.result && (
                <div className="inline-flex items-center gap-2 bg-lime text-navy px-3.5 py-1.5 font-display italic font-black text-[14px] uppercase tracking-[0.08em] mt-3 [box-shadow:3px_3px_0_#0A1A3D]">
                  <Play weight="fill" size={12} />
                  Mapa: {match.result.map}
                </div>
              )}
            </div>

            <div className="flex items-center gap-7 flex-row-reverse text-right">
              <TeamLogo
                shortName={b.shortName}
                color={b.color}
                size="xl"
              />
              <div>
                <div className="font-display italic font-black uppercase text-[64px] leading-[0.9] text-navy tracking-[-0.025em]">
                  {b.name}
                </div>
                <div className="text-[11px] text-fg-mute font-extrabold uppercase tracking-[0.1em] mt-1.5">
                  Grupo {b.group} · @{b.slug}
                </div>
                <div className="flex gap-2 mt-1.5 font-display italic font-black text-[18px] justify-end">
                  <span className="text-teal">{b.wins}V</span>
                  <span className="text-fg-mute">{b.losses}D</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <Section decoNum="01">
        <SectionHeader
          number="01"
          variant="lime"
          title={
            <>
              Highlights da <span className="text-lime">Partida</span>
            </>
          }
          link={{ to: "/highlights", label: "Todos →" }}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {fallbackHl.map((h) => (
            <HighlightCard key={h.id} highlight={h} />
          ))}
        </div>
      </Section>
    </>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-white border-[1.5px] border-border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-fg-soft font-display italic">
      {children}
    </span>
  );
}
