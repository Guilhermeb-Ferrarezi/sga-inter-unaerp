import { Link } from "@tanstack/react-router";
import { TeamLogo } from "@/components/ui/team-logo";
import { cn } from "@/lib/utils";
import type { Team } from "@/data/types";

interface StandingsTableProps {
  teams: Team[];
  qualifyCutoff?: number;
  topCount?: number;
  compact?: boolean;
}

const rankClass = (rank: number) => {
  if (rank === 1) return "text-lime";
  if (rank === 2) return "text-teal";
  if (rank === 3) return "text-blue";
  return "text-fg-mute";
};

export function StandingsTable({
  teams,
  qualifyCutoff = 4,
  topCount,
  compact = false,
}: StandingsTableProps) {
  const list = topCount ? teams.slice(0, topCount) : teams;

  return (
    <div className="bg-white border-[1.5px] border-border-strong shadow-brutal">
      <div
        className={cn(
          "grid bg-navy px-5.5 py-3.5",
          compact
            ? "grid-cols-[50px_1fr_60px_60px_70px]"
            : "grid-cols-[50px_1fr_60px_60px_60px_60px_70px]"
        )}
      >
        {(compact
          ? ["#", "Time", "V", "D", "Pts"]
          : ["#", "Time", "J", "V", "D", "Saldo", "Pts"]
        ).map((h, i) => (
          <span
            key={h}
            className={cn(
              "text-[10px] text-white font-display italic font-black uppercase tracking-[0.12em] text-center",
              i === 1 && "text-left"
            )}
          >
            {h}
          </span>
        ))}
      </div>
      {list.map((t, idx) => {
        const rank = idx + 1;
        const qualified = rank <= qualifyCutoff;
        return (
          <Link
            key={t.id}
            to="/times/$slug"
            params={{ slug: t.slug }}
            className={cn(
              "grid px-5.5 py-3.5 border-b border-border last:border-b-0 items-center hover:bg-surface-3 transition-colors",
              compact
                ? "grid-cols-[50px_1fr_60px_60px_70px]"
                : "grid-cols-[50px_1fr_60px_60px_60px_60px_70px]",
              qualified && "bg-gradient-to-r from-lime/[0.12] to-transparent"
            )}
          >
            <span
              className={cn(
                "font-display italic font-black text-[22px] text-center",
                rankClass(rank)
              )}
            >
              {rank}
            </span>
            <div className="flex items-center gap-3">
              <TeamLogo shortName={t.shortName} color={t.color} size="sm" />
              <span className="font-display italic font-extrabold text-[17px] uppercase text-navy">
                {t.name}
              </span>
            </div>
            {!compact && (
              <span className="font-display italic font-black text-[18px] text-navy text-center tabular-nums">
                {t.wins + t.losses}
              </span>
            )}
            <span className="font-display italic font-black text-[18px] text-teal text-center tabular-nums">
              {t.wins}
            </span>
            <span className="font-display italic font-black text-[18px] text-fg-mute text-center tabular-nums">
              {t.losses}
            </span>
            {!compact && (
              <span className="font-display italic font-black text-[18px] text-navy text-center tabular-nums">
                {t.pointsDiff > 0 ? `+${t.pointsDiff}` : t.pointsDiff}
              </span>
            )}
            <span className="font-display italic font-black text-[24px] text-blue text-center tabular-nums">
              {t.points}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
