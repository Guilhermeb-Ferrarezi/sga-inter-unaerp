import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "@phosphor-icons/react";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { DataTable } from "@/components/admin/DataTable";
import { RowActions } from "@/components/admin/RowActions";
import { TeamLogo } from "@/components/ui/team-logo";
import { Button } from "@/components/ui/button";
import { teams, teamRoster } from "@/data/mock";
import type { Team } from "@/data/types";

export const Route = createFileRoute("/admin/times")({
  component: AdminTeamsPage,
});

function AdminTeamsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <AdminTopbar
        title="Times"
        subtitle={`${teams.length} times cadastrados na edição Valorant 2025`}
        actions={
          <Button onClick={() => setShowForm(true)}>
            <Plus weight="bold" size={14} />
            Novo time
          </Button>
        }
      />

      <div className="p-9">
        {showForm && <NewTeamForm onClose={() => setShowForm(false)} />}

        <DataTable<Team>
          columns={[
            {
              key: "name",
              header: "Time",
              width: "minmax(0, 1.6fr)",
              render: (t) => (
                <div className="flex items-center gap-3">
                  <TeamLogo
                    shortName={t.shortName}
                    color={t.color}
                    size="sm"
                  />
                  <div>
                    <div className="font-display italic font-extrabold text-[15px] uppercase text-navy leading-none">
                      {t.name}
                    </div>
                    <div className="text-[10.5px] text-fg-mute font-bold uppercase tracking-[0.08em] mt-0.5">
                      @{t.slug}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "group",
              header: "Grupo",
              width: "80px",
              className: "text-center",
              render: (t) => (
                <span className="font-display italic font-black text-[16px] text-navy">
                  {t.group}
                </span>
              ),
            },
            {
              key: "roster",
              header: "Roster",
              width: "100px",
              className: "text-center",
              render: (t) => (
                <span className="text-[13px] font-bold text-navy">
                  {teamRoster(t.slug).length} / 5
                </span>
              ),
            },
            {
              key: "record",
              header: "V · D",
              width: "100px",
              className: "text-center",
              render: (t) => (
                <span className="font-display italic font-black text-[16px] tabular-nums">
                  <span className="text-teal">{t.wins}</span>
                  <span className="text-fg-mute mx-1">·</span>
                  <span className="text-fg-mute">{t.losses}</span>
                </span>
              ),
            },
            {
              key: "captain",
              header: "Capitão",
              width: "minmax(0, 0.6fr)",
              render: (t) => (
                <span className="text-[13px] text-fg-soft font-semibold">
                  {t.captainIgn}
                </span>
              ),
            },
            {
              key: "actions",
              header: "Ações",
              width: "120px",
              className: "text-right",
              render: () => (
                <RowActions
                  onView={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ),
            },
          ]}
          rows={teams}
          rowKey={(t) => t.id}
        />
      </div>
    </>
  );
}

function NewTeamForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="bg-white border-[1.5px] border-border-strong shadow-brutal-lime p-7 mb-7 brackets-lime relative">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display italic font-black text-[24px] uppercase text-navy">
          Novo time
        </h3>
        <button
          onClick={onClose}
          className="text-fg-mute hover:text-navy font-display italic font-extrabold uppercase text-[12px]"
        >
          ✕ Cancelar
        </button>
      </div>
      <form className="grid grid-cols-2 gap-5">
        <Field label="Nome" placeholder="Olimpo" />
        <Field label="Slug" placeholder="olimpo" hint="usado em URLs" />
        <Field label="Cor primária" placeholder="#0073B7" type="color" />
        <Field label="Grupo" placeholder="A" />
        <div className="col-span-2 flex items-center gap-3 pt-3 border-t border-border">
          <Button type="submit">Criar time</Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.1em]">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="bg-surface-3 border border-border-strong px-3 py-2.5 text-[13.5px] focus:border-blue focus:outline-none focus:[box-shadow:3px_3px_0_#0A1A3D] transition-all"
      />
      {hint && <span className="text-[10.5px] text-fg-mute">{hint}</span>}
    </label>
  );
}
