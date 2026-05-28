import { motion, AnimatePresence } from "framer-motion";
import { Play } from "@phosphor-icons/react";
import { LiveDot } from "@/components/ui/live-dot";
import { TeamLogo } from "@/components/ui/team-logo";
import { findTeam } from "@/data/mock";
import { useLiveMatchPolling } from "@/lib/use-live-match";
import { cn } from "@/lib/utils";
import type { Match } from "@/data/types";

interface LiveMatchFeatureProps {
  match: Match;
  liveScoreA?: number;
  liveScoreB?: number;
  liveMap?: string;
  liveStatus?: string;
}

export function LiveMatchFeature({
  match,
  liveScoreA = 10,
  liveScoreB = 8,
  liveMap = "Pearl",
  liveStatus = "Round 19 · Half 2",
}: LiveMatchFeatureProps) {
  const a = findTeam(match.teamA);
  const b = findTeam(match.teamB);

  const live = useLiveMatchPolling(
    match.id,
    {
      scoreA: liveScoreA,
      scoreB: liveScoreB,
      map: liveMap,
      status: match.status,
    },
    { enabled: match.status === "live" }
  );

  if (!a || !b) return null;
  const aLeading = live.scoreA > live.scoreB;
  const isLive = live.status === "live";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-white border-[1.5px] border-border-strong border-l-4 border-l-lime px-8 py-7 mb-8 grid grid-cols-[auto_1fr_auto] gap-10 items-center shadow-brutal brackets-lime"
    >
      <div>
        <div className="text-[10.5px] text-teal font-extrabold uppercase tracking-[0.12em] flex items-center gap-2 mb-2">
          {isLive ? <LiveDot variant="lime" /> : null}
          {isLive ? "Ao Vivo agora" : "Encerrada"}
        </div>
        <div className="font-display italic font-extrabold text-[22px] uppercase text-navy">
          {match.group} · {match.round} · {live.map ?? liveMap}
        </div>
      </div>

      <div className="flex items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-2.5 min-w-[130px]">
          <TeamLogo shortName={a.shortName} color={a.color} size="lg" />
          <div className="font-display italic font-black text-[20px] uppercase text-navy">
            {a.name}
          </div>
        </div>
        <div className="text-center">
          <div className="font-display italic font-black text-[84px] leading-none text-navy tracking-[-0.04em] flex items-center justify-center gap-1">
            <AnimatedScore value={live.scoreA} pulse={live.lastChanged === "a"} active={aLeading} />
            <span className="text-border-strong font-normal">·</span>
            <AnimatedScore value={live.scoreB} pulse={live.lastChanged === "b"} active={!aLeading} />
          </div>
          <div className="text-[11px] text-fg-mute uppercase tracking-[0.12em] font-extrabold mt-2">
            {isLive ? liveStatus : "Resultado final"}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2.5 min-w-[130px]">
          <TeamLogo shortName={b.shortName} color={b.color} size="lg" />
          <div className="font-display italic font-black text-[20px] uppercase text-navy">
            {b.name}
          </div>
        </div>
      </div>

      <button className="bg-lime text-navy px-5.5 py-3.5 text-[12px] font-display italic font-black uppercase tracking-[0.1em] inline-flex items-center gap-2 [box-shadow:4px_4px_0_#0A1A3D] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:[box-shadow:6px_6px_0_#0A1A3D] transition-all">
        <Play weight="fill" size={14} />
        Assistir
      </button>
    </motion.div>
  );
}

function AnimatedScore({
  value,
  pulse,
  active,
}: {
  value: number;
  pulse: boolean;
  active: boolean;
}) {
  return (
    <span className="relative inline-block">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "inline-block tabular-nums",
            active && "text-teal",
            pulse && "drop-shadow-[0_0_12px_rgba(46,170,128,0.6)]"
          )}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
