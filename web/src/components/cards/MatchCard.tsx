import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { TeamLogo } from "@/components/ui/team-logo";
import { LiveDot } from "@/components/ui/live-dot";
import { findTeam } from "@/data/mock";
import type { Match } from "@/data/types";
import { cn } from "@/lib/utils";

function formatDay(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { weekday: "short" })
    .format(new Date(iso))
    .replace(".", "");
}

function formatHour(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function MatchCard({ match }: { match: Match }) {
  const a = findTeam(match.teamA);
  const b = findTeam(match.teamB);
  if (!a || !b) return null;

  const winnerA = match.result?.winnerSlug === a.slug;
  const isLive = match.status === "live";
  const isDone = match.status === "done";

  return (
    <Link
      to="/confrontos/$id"
      params={{ id: match.id }}
      className="block"
    >
      <motion.div
        whileHover={{ x: -2, y: -2 }}
        transition={{ duration: 0.12 }}
        className={cn(
          "bg-white border-[1.5px] border-border p-4 mb-3 grid grid-cols-[90px_1fr_90px] gap-5 items-center hover:border-blue hover:[box-shadow:4px_4px_0_#0A1A3D] transition-colors",
          isLive && "border-l-4 border-l-lime",
          isDone && "border-l-4 border-l-teal",
          match.status === "scheduled" && "border-l-4 border-l-blue"
        )}
      >
        <div className="flex flex-col gap-0.5">
          {isLive ? (
            <span className="text-[9.5px] text-teal font-black uppercase tracking-[0.1em] flex items-center gap-1.5">
              <LiveDot variant="teal" className="!w-1.5 !h-1.5" />
              Live
            </span>
          ) : (
            <span className="text-[10px] text-fg-mute font-extrabold uppercase tracking-[0.1em]">
              {formatDay(match.scheduledAt)}
            </span>
          )}
          <span className="font-display italic font-black text-[26px] text-navy leading-none tabular-nums">
            {isLive && match.result
              ? `${match.result.scoreA}·${match.result.scoreB}`
              : formatHour(match.scheduledAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <TeamLogo shortName={a.shortName} color={a.color} size="sm" />
            <span className="font-display italic font-extrabold text-[17px] uppercase text-navy">
              {a.name}
            </span>
          </div>
          <span className="text-[10px] text-fg-mute font-extrabold uppercase tracking-[0.12em]">
            VS
          </span>
          <div className="flex items-center gap-2.5 flex-row-reverse">
            <TeamLogo shortName={b.shortName} color={b.color} size="sm" />
            <span className="font-display italic font-extrabold text-[17px] uppercase text-navy">
              {b.name}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] text-fg-mute font-extrabold uppercase tracking-[0.08em]">
            {match.round}
          </span>
          {match.result && (
            <span className="font-display italic font-black text-[24px] text-navy leading-none">
              <span className={cn(winnerA && "text-teal")}>
                {match.result.scoreA}
              </span>
              <span className="text-fg-mute mx-1 font-normal">·</span>
              <span className={cn(!winnerA && "text-teal")}>
                {match.result.scoreB}
              </span>
            </span>
          )}
          {match.result?.map && (
            <span className="text-[10px] text-blue font-extrabold uppercase tracking-[0.08em]">
              {match.result.map}
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
