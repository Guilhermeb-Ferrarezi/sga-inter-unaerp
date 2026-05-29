import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/section";
import { FilterPill } from "@/components/ui/filter-pill";
import { TeamLogo } from "@/components/ui/team-logo";
import { PlayerPodium } from "@/components/cards/PlayerPodium";
import { useEditionPlayers } from "@/lib/use-players";
import { useEditionTeams } from "@/lib/use-edition";
import { cn } from "@/lib/utils";
import type { Player } from "@/data/types";

export const Route = createFileRoute("/jogadores/")({
  component: PlayersPage,
});

type SortKey = "kd" | "frags" | "acs" | "hs" | "firstBloods";

const sortLabels: Record<SortKey, string> = {
  kd: "K/D",
  frags: "Frags",
  acs: "ACS",
  hs: "Head Shot %",
  firstBloods: "First Blood",
};

const sortBy = (key: SortKey) => (a: Player, b: Player) => {
  if (key === "kd") return b.stats.kd - a.stats.kd;
  if (key === "frags") return b.stats.frags - a.stats.frags;
  if (key === "acs") return b.stats.acs - a.stats.acs;
  if (key === "hs") return b.stats.hsPercent - a.stats.hsPercent;
  return b.stats.firstBloods - a.stats.firstBloods;
};

function PlayersPage() {
  const [sort, setSort] = useState<SortKey>("kd");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const { players, loading } = useEditionPlayers("valorant");
  const { teams } = useEditionTeams("valorant");

  const filtered = players
    .filter((p) => roleFilter === "all" || p.role === roleFilter)
    .sort(sortBy(sort));

  const top3 = [...players].sort(sortBy(sort)).slice(0, 3);

  return (
    <>
      <PageHeader
        crumbs={[{ to: "/", label: "Inter UnaERP" }, { label: "Jogadores" }]}
        tagNumber="03"
        tagVariant="lime"
        title={
          <>
            Ranking <span className="text-lime">de Jogadores</span>
          </>
        }
        subtitle={
          players.length === 0
            ? "Ranking atualizado a cada partida com dados oficiais de in-game."
            : `${players.length} jogadores registrados. Ranking atualizado a cada partida.`
        }
      >
        <div className="flex gap-1 mt-6 border-b-2 border-navy">
          {(Object.keys(sortLabels) as SortKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setSort(k)}
              className={cn(
                "font-display italic font-extrabold text-[16px] uppercase px-4.5 py-3 relative",
                sort === k ? "text-navy" : "text-fg-mute hover:text-navy"
              )}
            >
              {sortLabels[k]}
              {sort === k && (
                <span className="absolute -bottom-0.5 left-1.5 right-1.5 h-1 bg-lime" />
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2.5 mt-4.5">
          <FilterPill
            active={roleFilter === "all"}
            onClick={() => setRoleFilter("all")}
          >
            Todos os Roles
          </FilterPill>
          {["Duelist", "Initiator", "Controller", "Sentinel"].map((r) => (
            <FilterPill
              key={r}
              active={roleFilter === r}
              onClick={() => setRoleFilter(r)}
            >
              {r}
            </FilterPill>
          ))}
        </div>
      </PageHeader>

      <Section decoNum="TOP">
        {loading ? (
          <div className="text-center py-16 text-fg-mute font-display italic font-extrabold uppercase">
            Carregando jogadores…
          </div>
        ) : players.length === 0 ? (
          <div className="bg-white border-[1.5px] border-border-strong p-9 text-center mt-6">
            <div className="font-display italic font-black text-[28px] uppercase text-navy mb-3">
              Sem jogadores registrados
            </div>
            <p className="text-fg-soft text-[14px] leading-relaxed max-w-md mx-auto">
              Os jogadores aparecem aqui assim que os rosters dos times forem
              cadastrados.
            </p>
          </div>
        ) : (
          <>
            <PlayerPodium top3={top3} />
            <PlayersTable
              players={filtered}
              sortKey={sort}
              teams={teams}
            />
          </>
        )}
      </Section>
    </>
  );
}

function PlayersTable({
  players: list,
  sortKey,
  teams,
}: {
  players: Player[];
  sortKey: SortKey;
  teams: { slug: string; name: string; shortName: string; color: string }[];
}) {
  const findTeam = (slug: string) => teams.find((t) => t.slug === slug);
  return (
    <div className="bg-white border-[1.5px] border-border-strong shadow-brutal">
      <div className="grid grid-cols-[50px_1fr_140px_90px_90px_90px_90px] px-5.5 py-3.5 bg-navy">
        {["#", "Jogador", "Time", "K/D", "Frags", "ACS", "HS%"].map((h, i) => (
          <span
            key={h}
            className={cn(
              "text-[10px] text-white font-display italic font-black uppercase tracking-[0.12em] text-center",
              (i === 1 || i === 2) && "text-left"
            )}
          >
            {h}
          </span>
        ))}
      </div>
      {list.slice(0, 10).map((p, idx) => {
        const team = findTeam(p.teamSlug);
        const rank = idx + 1;
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: idx * 0.02 }}
            className="grid grid-cols-[50px_1fr_140px_90px_90px_90px_90px] px-5.5 py-3.5 border-b border-border last:border-b-0 items-center hover:bg-surface-3 transition-colors"
          >
            <span
              className={cn(
                "font-display italic font-black text-[22px] text-center",
                rank <= 3 ? "text-lime" : "text-fg-mute"
              )}
            >
              {rank}
            </span>
            <Link
              to="/jogadores/$id"
              params={{ id: p.id }}
              className="flex items-center gap-3 hover:text-blue"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue to-teal text-white font-display italic font-black text-[13px] flex items-center justify-center">
                {p.ign.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-display italic font-black text-[17px] uppercase text-navy">
                  {p.ign}
                </div>
                <div className="text-[10.5px] text-fg-mute font-bold uppercase tracking-[0.08em]">
                  {p.role}
                  {p.isIgl && " · IGL"}
                </div>
              </div>
            </Link>
            <Link
              to="/times/$slug"
              params={{ slug: p.teamSlug }}
              className="flex items-center gap-2 hover:text-blue"
            >
              {team && (
                <TeamLogo
                  shortName={team.shortName}
                  color={team.color}
                  size="xs"
                />
              )}
              <span className="font-display italic font-extrabold text-[14px] uppercase text-navy">
                {team?.name}
              </span>
            </Link>
            <span
              className={cn(
                "font-display italic font-black text-[18px] text-center tabular-nums",
                sortKey === "kd" ? "text-lime" : "text-navy"
              )}
            >
              {p.stats.kd.toFixed(2)}
            </span>
            <span
              className={cn(
                "font-display italic font-black text-[18px] text-center tabular-nums",
                sortKey === "frags" ? "text-lime" : "text-navy"
              )}
            >
              {p.stats.frags}
            </span>
            <span
              className={cn(
                "font-display italic font-black text-[18px] text-center tabular-nums",
                sortKey === "acs" ? "text-lime" : "text-blue"
              )}
            >
              {p.stats.acs}
            </span>
            <span
              className={cn(
                "font-display italic font-black text-[18px] text-center tabular-nums",
                sortKey === "hs" ? "text-lime" : "text-teal"
              )}
            >
              {p.stats.hsPercent}%
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
