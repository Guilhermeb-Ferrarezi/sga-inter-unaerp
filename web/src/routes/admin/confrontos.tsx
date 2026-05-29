import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trophy } from "@phosphor-icons/react";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { DataTable } from "@/components/admin/DataTable";
import { RowActions } from "@/components/admin/RowActions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TeamLogo } from "@/components/ui/team-logo";
import { Button } from "@/components/ui/button";
import { FilterPill } from "@/components/ui/filter-pill";
import { useEditionMatches } from "@/lib/use-matches";
import { useEditionTeams } from "@/lib/use-edition";
import type { Match } from "@/data/types";

export const Route = createFileRoute("/admin/confrontos")({
  component: AdminMatchesPage,
});

type StatusFilter = "all" | "scheduled" | "live" | "done";

function AdminMatchesPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const { matches, loading } = useEditionMatches("valorant");
  const { teams } = useEditionTeams("valorant");
  const findTeam = (slug: string) => teams.find((t) => t.slug === slug);

  const list = matches.filter((m) => filter === "all" || m.status === filter);

  return (
    <>
      <AdminTopbar
        title="Confrontos"
        subtitle={`${matches.length} partidas previstas · ${
          matches.filter((m) => m.status === "done").length
        } encerradas`}
        actions={
          <Button>
            <Plus weight="bold" size={14} />
            Agendar partida
          </Button>
        }
      />

      <div className="p-9 space-y-5">
        <div className="flex flex-wrap gap-2">
          <FilterPill
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            Todas ({matches.length})
          </FilterPill>
          <FilterPill
            active={filter === "scheduled"}
            onClick={() => setFilter("scheduled")}
          >
            Agendadas
          </FilterPill>
          <FilterPill
            active={filter === "live"}
            onClick={() => setFilter("live")}
          >
            Ao vivo
          </FilterPill>
          <FilterPill
            active={filter === "done"}
            onClick={() => setFilter("done")}
          >
            Encerradas
          </FilterPill>
        </div>

        {loading ? (
          <div className="text-center py-16 text-fg-mute font-display italic font-extrabold uppercase">
            Carregando partidas…
          </div>
        ) : (
        <DataTable<Match>
          columns={[
            {
              key: "when",
              header: "Data",
              width: "minmax(0, 0.5fr)",
              render: (m) => {
                const d = new Date(m.scheduledAt);
                return (
                  <div>
                    <div className="text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.08em]">
                      {new Intl.DateTimeFormat("pt-BR", {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                      }).format(d)}
                    </div>
                    <div className="font-display italic font-black text-[18px] text-navy tabular-nums leading-none">
                      {new Intl.DateTimeFormat("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(d)}
                    </div>
                  </div>
                );
              },
            },
            {
              key: "matchup",
              header: "Confronto",
              width: "minmax(0, 1.6fr)",
              render: (m) => {
                const a = findTeam(m.teamA);
                const b = findTeam(m.teamB);
                if (!a || !b) return null;
                const aWon = m.result?.winnerSlug === a.slug;
                return (
                  <div className="flex items-center gap-3">
                    <TeamLogo
                      shortName={a.shortName}
                      color={a.color}
                      size="xs"
                    />
                    <span className="font-display italic font-extrabold text-[14px] uppercase text-navy">
                      {a.name}
                    </span>
                    {m.result && (
                      <span className="font-display italic font-black text-[14px] tabular-nums px-2">
                        <span className={aWon ? "text-teal" : "text-fg-mute"}>
                          {m.result.scoreA}
                        </span>
                        <span className="text-fg-mute mx-1">·</span>
                        <span className={!aWon ? "text-teal" : "text-fg-mute"}>
                          {m.result.scoreB}
                        </span>
                      </span>
                    )}
                    {!m.result && (
                      <span className="text-fg-mute text-[10px] font-extrabold uppercase px-2">
                        vs
                      </span>
                    )}
                    <span className="font-display italic font-extrabold text-[14px] uppercase text-navy">
                      {b.name}
                    </span>
                    <TeamLogo
                      shortName={b.shortName}
                      color={b.color}
                      size="xs"
                    />
                  </div>
                );
              },
            },
            {
              key: "round",
              header: "Rodada",
              width: "minmax(0, 0.5fr)",
              render: (m) => (
                <span className="text-[12.5px] text-fg-soft font-bold uppercase tracking-[0.06em]">
                  Gr. {m.group} · {m.round}
                </span>
              ),
            },
            {
              key: "map",
              header: "Mapa",
              width: "100px",
              render: (m) =>
                m.result?.map ? (
                  <span className="text-[12px] text-blue font-extrabold uppercase tracking-[0.06em]">
                    {m.result.map}
                  </span>
                ) : (
                  <span className="text-fg-mute text-[11px]">—</span>
                ),
            },
            {
              key: "status",
              header: "Status",
              width: "120px",
              render: (m) => <StatusBadge status={m.status} />,
            },
            {
              key: "actions",
              header: "Ações",
              width: "180px",
              className: "text-right",
              render: (m) => (
                <div className="flex gap-1 justify-end">
                  {m.status === "scheduled" && (
                    <Button size="sm" variant="blue">
                      <Trophy weight="fill" size={12} />
                      Registrar
                    </Button>
                  )}
                  <RowActions onEdit={() => {}} onDelete={() => {}} />
                </div>
              ),
            },
          ]}
          rows={list}
          rowKey={(m) => m.id}
        />
        )}
      </div>
    </>
  );
}
