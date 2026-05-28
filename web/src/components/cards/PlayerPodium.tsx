import { motion } from "framer-motion";
import type { Player } from "@/data/types";
import { findTeam } from "@/data/mock";
import { cn } from "@/lib/utils";

interface PlayerPodiumProps {
  top3: Player[];
}

const positions = [
  {
    pos: "02",
    cardClass: "border-teal",
    posClass: "bg-teal text-white",
    statClass: "text-teal",
    avatarGradient:
      "bg-gradient-to-br from-[#2EAA80] to-[#A4CD3A] text-navy",
  },
  {
    pos: "01",
    cardClass: "border-lime translate-y-[-12px] !shadow-brutal-lime",
    posClass: "bg-lime text-navy",
    statClass: "text-lime",
    avatarGradient: "bg-gradient-to-br from-blue to-teal text-white",
  },
  {
    pos: "03",
    cardClass: "border-blue",
    posClass: "bg-blue text-white",
    statClass: "text-blue",
    avatarGradient: "bg-gradient-to-br from-navy to-blue text-white",
  },
];

export function PlayerPodium({ top3 }: PlayerPodiumProps) {
  // expected order: [#2, #1, #3]
  const ordered = [top3[1], top3[0], top3[2]];
  return (
    <div className="grid grid-cols-[1fr_1.2fr_1fr] gap-5 items-end mt-8 mb-12">
      {ordered.map((p, idx) => {
        const team = findTeam(p.teamSlug);
        const meta = positions[idx];
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: idx === 1 ? -12 : 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className={cn(
              "relative bg-white border-[1.5px] border-border-strong p-7 text-center shadow-brutal-lg",
              meta.cardClass
            )}
          >
            <div
              className={cn(
                "absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 font-display italic font-black text-[22px] flex items-center justify-center shadow-brutal-sm",
                meta.posClass
              )}
            >
              {meta.pos}
            </div>
            <div
              className={cn(
                "w-[100px] h-[100px] flex items-center justify-center font-display italic font-black text-[36px] mx-auto mt-4 mb-3.5",
                meta.avatarGradient
              )}
            >
              {p.ign.charAt(0).toUpperCase()}
            </div>
            <div className="font-display italic font-black text-[32px] uppercase text-navy leading-none">
              {p.ign}
            </div>
            <div className="text-[11.5px] text-fg-mute font-extrabold uppercase tracking-[0.1em] mt-2 mb-4.5">
              {team?.name} · {p.role}
            </div>
            <div
              className={cn(
                "font-display italic font-black text-[56px] leading-none mb-1 tabular-nums",
                meta.statClass
              )}
            >
              {p.stats.kd.toFixed(2)}
            </div>
            <div className="text-[10px] text-fg-mute font-extrabold uppercase tracking-[0.12em]">
              Kill / Death
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
