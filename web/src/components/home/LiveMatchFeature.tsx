import { motion } from "framer-motion";
import { Play } from "@phosphor-icons/react";
import { LiveDot } from "@/components/ui/live-dot";
import { TeamLogo } from "@/components/ui/team-logo";
import { findTeam } from "@/data/mock";
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
  if (!a || !b) return null;
  const aLeading = liveScoreA > liveScoreB;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-white border-[1.5px] border-border-strong border-l-4 border-l-lime px-8 py-7 mb-8 grid grid-cols-[auto_1fr_auto] gap-10 items-center shadow-brutal brackets-lime"
    >
      <div>
        <div className="text-[10.5px] text-teal font-extrabold uppercase tracking-[0.12em] flex items-center gap-2 mb-2">
          <LiveDot variant="lime" />
          Ao Vivo agora
        </div>
        <div className="font-display italic font-extrabold text-[22px] uppercase text-navy">
          {match.group} · {match.round} · {liveMap}
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
          <div className="font-display italic font-black text-[84px] leading-none text-navy tracking-[-0.04em]">
            <span className={cn(aLeading && "text-teal")}>{liveScoreA}</span>
            <span className="text-border-strong mx-2 font-normal">·</span>
            <span className={cn(!aLeading && "text-teal")}>{liveScoreB}</span>
          </div>
          <div className="text-[11px] text-fg-mute uppercase tracking-[0.12em] font-extrabold mt-2">
            {liveStatus}
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
