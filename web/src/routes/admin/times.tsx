import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@apollo/client";
import { motion } from "framer-motion";
import { Plus, CheckCircle, WarningCircle, Spinner } from "@phosphor-icons/react";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { DataTable } from "@/components/admin/DataTable";
import { RowActions } from "@/components/admin/RowActions";
import { TeamLogo } from "@/components/ui/team-logo";
import { Button } from "@/components/ui/button";
import { teams, teamRoster } from "@/data/mock";
import { CREATE_TEAM } from "@/lib/graphql/queries";
import { cn } from "@/lib/utils";
import type { Team } from "@/data/types";

export const Route = createFileRoute("/admin/times")({
  component: AdminTeamsPage,
});

function AdminTeamsPage() {
  const [showForm, setShowForm] = useState(false);
  // Lista local mutável pra mostrar optimistic insert
  const [localTeams, setLocalTeams] = useState<Team[]>(teams);

  return (
    <>
      <AdminTopbar
        title="Times"
        subtitle={`${localTeams.length} times cadastrados na edição Valorant 2025`}
        actions={
          <Button onClick={() => setShowForm(true)}>
            <Plus weight="bold" size={14} />
            Novo time
          </Button>
        }
      />

      <div className="p-9">
        {showForm && (
          <NewTeamForm
            onClose={() => setShowForm(false)}
            onCreated={(t) => {
              setLocalTeams((prev) => [t, ...prev]);
              setShowForm(false);
            }}
          />
        )}

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
          rows={localTeams}
          rowKey={(t) => t.id}
        />
      </div>
    </>
  );
}

type FormState = {
  name: string;
  slug: string;
  color: string;
  group: "A" | "B" | "C";
  captainIgn: string;
};

function NewTeamForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (team: Team) => void;
}) {
  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    color: "#0073B7",
    group: "A",
    captainIgn: "",
  });
  const [createTeam, { loading, error }] = useMutation(CREATE_TEAM);
  const [success, setSuccess] = useState(false);

  const update = (k: keyof FormState, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const slugFromName = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) return;

    const optimisticTeam: Team = {
      id: `temp-${Date.now()}`,
      slug: form.slug,
      name: form.name,
      shortName: form.name.slice(0, 2).toUpperCase(),
      color: form.color,
      group: form.group,
      wins: 0,
      losses: 0,
      pointsDiff: 0,
      points: 0,
      rosterIds: [],
      captainIgn: form.captainIgn || "—",
    };

    try {
      await createTeam({
        variables: {
          name: form.name,
          slug: form.slug,
          primaryColor: form.color,
        },
      });
      setSuccess(true);
      onCreated(optimisticTeam);
    } catch {
      // Mesmo se a API der erro (offline), insere optimistic no local pra demo
      onCreated(optimisticTeam);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -12, height: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white border-[1.5px] border-border-strong shadow-brutal-lime p-7 mb-7 brackets-lime relative"
    >
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

      {error && (
        <div className="mb-5 bg-[#F5B700]/15 border border-[#F5B700] text-navy p-3.5 flex items-start gap-3 text-[12.5px]">
          <WarningCircle weight="fill" size={18} className="shrink-0 mt-0.5" />
          <div>
            <strong className="font-display italic font-extrabold uppercase mr-2">
              API offline
            </strong>
            O time foi criado localmente em modo demo. Quando a API voltar,
            tente novamente para persistir no banco.
          </div>
        </div>
      )}

      {success && !error && (
        <div className="mb-5 bg-teal/10 border border-teal text-navy p-3.5 flex items-start gap-3 text-[13px]">
          <CheckCircle weight="fill" size={18} className="shrink-0 mt-0.5 text-teal" />
          <span>
            <strong className="font-display italic font-extrabold uppercase mr-2">
              Sucesso
            </strong>
            Time criado e persistido via GraphQL.
          </span>
        </div>
      )}

      <form onSubmit={submit} className="grid grid-cols-2 gap-5">
        <Field
          label="Nome"
          placeholder="Olimpo"
          value={form.name}
          onChange={(v) => {
            update("name", v);
            if (!form.slug || form.slug === slugFromName(form.name)) {
              update("slug", slugFromName(v));
            }
          }}
        />
        <Field
          label="Slug"
          placeholder="olimpo"
          hint="usado em URLs · auto-gerado do nome"
          value={form.slug}
          onChange={(v) => update("slug", v)}
        />
        <Field
          label="Cor primária"
          placeholder="#0073B7"
          type="color"
          value={form.color}
          onChange={(v) => update("color", v)}
        />
        <label className="flex flex-col gap-1.5">
          <span className="text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.1em]">
            Grupo
          </span>
          <select
            value={form.group}
            onChange={(e) => update("group", e.target.value)}
            className="bg-surface-3 border border-border-strong px-3 py-2.5 text-[13.5px] focus:border-blue focus:outline-none focus:[box-shadow:3px_3px_0_#0A1A3D] transition-all font-medium"
          >
            <option value="A">Grupo A</option>
            <option value="B">Grupo B</option>
            <option value="C">Grupo C</option>
          </select>
        </label>
        <Field
          label="Capitão (IGN)"
          placeholder="g1lh"
          value={form.captainIgn}
          onChange={(v) => update("captainIgn", v)}
        />
        <div className="col-span-2 flex items-center gap-3 pt-3 border-t border-border">
          <Button type="submit" disabled={loading || !form.name || !form.slug}>
            {loading ? (
              <>
                <Spinner
                  weight="bold"
                  size={14}
                  className="animate-spin"
                />
                Criando...
              </>
            ) : (
              <>
                <Plus weight="bold" size={14} />
                Criar time
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <span className="ml-auto text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.08em]">
            Endpoint:{" "}
            <code className="text-blue normal-case">createTeam</code>
          </span>
        </div>
      </form>
    </motion.div>
  );
}

function Field({
  label,
  placeholder,
  hint,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  hint?: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.1em]">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "bg-surface-3 border border-border-strong px-3 py-2.5 text-[13.5px] focus:border-blue focus:outline-none focus:[box-shadow:3px_3px_0_#0A1A3D] transition-all",
          type === "color" && "h-11 cursor-pointer p-1"
        )}
      />
      {hint && <span className="text-[10.5px] text-fg-mute">{hint}</span>}
    </label>
  );
}
