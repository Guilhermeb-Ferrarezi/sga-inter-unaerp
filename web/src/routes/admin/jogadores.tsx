import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Star } from "@phosphor-icons/react";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { DataTable } from "@/components/admin/DataTable";
import { RowActions } from "@/components/admin/RowActions";
import { TeamLogo } from "@/components/ui/team-logo";
import { Button } from "@/components/ui/button";
import { FilterPill } from "@/components/ui/filter-pill";
import { players, findTeam } from "@/data/mock";
import type { Player } from "@/data/types";

export const Route = createFileRoute("/admin/jogadores")({
  component: AdminPlayersPage,
});

function AdminPlayersPage() {
  const [teamFilter, setTeamFilter] = useState<string>("all");

  const list = players.filter(
    (p) => teamFilter === "all" || p.teamSlug === teamFilter
  );

  return (
    <>
      <AdminTopbar
        title="Jogadores"
        subtitle={`${players.length} jogadores cadastrados`}
        actions={
          <Button>
            <Plus weight="bold" size={14} />
            Novo jogador
          </Button>
        }
      />

      <div className="p-9 space-y-5">
        <div className="flex flex-wrap gap-2">
          <FilterPill
            active={teamFilter === "all"}
            onClick={() => setTeamFilter("all")}
          >
            Todos
          </FilterPill>
          {Array.from(new Set(players.map((p) => p.teamSlug))).map((s) => {
            const t = findTeam(s);
            return (
              <FilterPill
                key={s}
                active={teamFilter === s}
                onClick={() => setTeamFilter(s)}
              >
                {t?.name}
              </FilterPill>
            );
          })}
        </div>

        <DataTable<Player>
          columns={[
            {
              key: "ign",
              header: "Jogador",
              width: "minmax(0, 1.5fr)",
              render: (p) => (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue to-teal text-white font-display italic font-black text-[13px] flex items-center justify-center">
                    {p.ign.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-display italic font-extrabold text-[15px] uppercase text-navy leading-none flex items-center gap-1.5">
                      {p.ign}
                      {p.isCaptain && (
                        <Star weight="fill" size={11} className="text-lime" />
                      )}
                    </div>
                    <div className="text-[10.5px] text-fg-mute font-bold uppercase tracking-[0.08em] mt-0.5">
                      {p.role}
                      {p.isIgl && " · IGL"}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "team",
              header: "Time",
              width: "minmax(0, 0.9fr)",
              render: (p) => {
                const t = findTeam(p.teamSlug);
                if (!t) return null;
                return (
                  <div className="flex items-center gap-2">
                    <TeamLogo
                      shortName={t.shortName}
                      color={t.color}
                      size="xs"
                    />
                    <span className="font-display italic font-extrabold text-[14px] uppercase text-navy">
                      {t.name}
                    </span>
                  </div>
                );
              },
            },
            {
              key: "kd",
              header: "K/D",
              width: "80px",
              className: "text-center",
              render: (p) => (
                <span className="font-display italic font-black text-[16px] text-lime tabular-nums">
                  {p.stats.kd.toFixed(2)}
                </span>
              ),
            },
            {
              key: "frags",
              header: "Frags",
              width: "80px",
              className: "text-center",
              render: (p) => (
                <span className="font-display italic font-black text-[16px] text-navy tabular-nums">
                  {p.stats.frags}
                </span>
              ),
            },
            {
              key: "acs",
              header: "ACS",
              width: "80px",
              className: "text-center",
              render: (p) => (
                <span className="font-display italic font-black text-[16px] text-blue tabular-nums">
                  {p.stats.acs}
                </span>
              ),
            },
            {
              key: "actions",
              header: "Ações",
              width: "120px",
              className: "text-right",
              render: () => (
                <RowActions onEdit={() => {}} onDelete={() => {}} />
              ),
            },
          ]}
          rows={list}
          rowKey={(p) => p.id}
        />
      </div>
    </>
  );
}
