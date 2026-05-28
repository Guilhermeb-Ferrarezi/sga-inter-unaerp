import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Star } from "@phosphor-icons/react";
import { TeamLogo } from "@/components/ui/team-logo";
import { teamRoster } from "@/data/mock";
import type { Team } from "@/data/types";
import { cn } from "@/lib/utils";

interface TeamCardProps {
  team: Team;
  rank?: number;
}

const rankColors: Record<number, string> = {
  1: "bg-lime text-navy",
  2: "bg-teal text-white",
  3: "bg-blue text-white",
};

export function TeamCard({ team, rank }: TeamCardProps) {
  const roster = teamRoster(team.slug);

  return (
    <Link to="/times/$slug" params={{ slug: team.slug }} className="block">
      <motion.div
        whileHover={{ x: -3, y: -3 }}
        transition={{ duration: 0.12 }}
        className="relative bg-white border-[1.5px] border-border-strong p-7 shadow-brutal hover:[box-shadow:8px_8px_0_#0A1A3D] transition-shadow cursor-pointer"
      >
        {rank && rank <= 3 && (
          <div
            className={cn(
              "absolute -top-3.5 -left-3.5 w-10 h-10 font-display italic font-black text-[18px] flex items-center justify-center shadow-brutal-sm",
              rankColors[rank]
            )}
          >
            {rank.toString().padStart(2, "0")}
          </div>
        )}

        <div className="flex items-center gap-4.5 mb-5.5">
          <TeamLogo shortName={team.shortName} color={team.color} size="lg" />
          <div className="flex flex-col gap-1">
            <div className="font-display italic font-black text-[32px] uppercase leading-none text-navy">
              {team.name}
            </div>
            <div className="text-[11px] text-fg-mute font-bold uppercase tracking-[0.1em]">
              @{team.slug}
            </div>
            <span className="inline-block bg-surface-3 text-fg-soft font-display italic font-black text-[10px] uppercase tracking-[0.1em] px-2 py-0.5 mt-1 w-fit">
              Grupo {team.group}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 py-4 border-y border-border mb-4.5 text-center">
          <Stat label="Vit." value={team.wins} className="text-teal" />
          <Stat
            label="Der."
            value={team.losses}
            className="text-fg-mute"
          />
          <Stat
            label="Saldo"
            value={team.pointsDiff > 0 ? `+${team.pointsDiff}` : team.pointsDiff}
            className="text-lime"
          />
          <Stat label="Pts" value={team.points} className="text-blue" />
        </div>

        <div>
          <div className="text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.1em] mb-2.5">
            Roster · {roster.length} jogadores
          </div>
          <div className="flex flex-wrap gap-1.5">
            {roster.map((p) => (
              <span
                key={p.id}
                className={cn(
                  "px-2.5 py-1 font-display italic font-extrabold text-[12px] uppercase border",
                  p.isCaptain
                    ? "bg-lime border-lime text-navy"
                    : "bg-surface-3 text-navy border-border"
                )}
              >
                {p.ign}
                {p.isCaptain && <Star weight="fill" size={10} className="inline ml-1" />}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div>
      <div
        className={cn(
          "font-display italic font-black text-[26px] leading-none tabular-nums",
          className
        )}
      >
        {value}
      </div>
      <div className="text-[9px] text-fg-mute font-extrabold uppercase tracking-[0.1em] mt-1">
        {label}
      </div>
    </div>
  );
}
