import { createFileRoute } from "@tanstack/react-router";
import { Plus, Play, Eye } from "@phosphor-icons/react";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { DataTable } from "@/components/admin/DataTable";
import { RowActions } from "@/components/admin/RowActions";
import { Button } from "@/components/ui/button";
import { highlights, findTeam, findMatch } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { Highlight } from "@/data/types";

export const Route = createFileRoute("/admin/highlights")({
  component: AdminHighlightsPage,
});

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

const categoryClass: Record<Highlight["category"], string> = {
  Ace: "bg-lime text-navy",
  Clutch: "bg-teal text-white",
  Play: "bg-blue text-white",
  Recap: "bg-navy text-white",
};

function AdminHighlightsPage() {
  return (
    <>
      <AdminTopbar
        title="Highlights"
        subtitle={`${highlights.length} clipes publicados · Cloudflare Stream`}
        actions={
          <Button>
            <Plus weight="bold" size={14} />
            Novo highlight
          </Button>
        }
      />

      <div className="p-9">
        <DataTable<Highlight>
          columns={[
            {
              key: "title",
              header: "Highlight",
              width: "minmax(0, 1.8fr)",
              render: (h) => (
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-14 h-10 bg-gradient-to-br relative flex items-center justify-center",
                      h.thumbVariant === 1 && "from-[#0E4D8C] to-[#2EAA80]",
                      h.thumbVariant === 2 && "from-[#0A1A3D] to-[#0073B7]",
                      h.thumbVariant === 3 && "from-[#2EAA80] to-[#A4CD3A]",
                      h.thumbVariant === 4 && "from-[#A4CD3A] to-[#0073B7]",
                      h.thumbVariant === 5 && "from-[#0073B7] to-[#0A1A3D]",
                      h.thumbVariant === 6 && "from-[#EC4899] to-[#2EAA80]",
                      h.thumbVariant === 7 && "from-[#F97316] to-[#A4CD3A]",
                      h.thumbVariant === 8 && "from-[#A855F7] to-[#0073B7]"
                    )}
                  >
                    <Play weight="fill" size={14} className="text-white/90" />
                  </div>
                  <div>
                    <div className="font-display italic font-extrabold text-[14px] uppercase text-navy leading-tight">
                      {h.title}
                    </div>
                    <div className="text-[10.5px] text-fg-mute font-bold uppercase tracking-[0.08em] mt-0.5">
                      {h.map && `${h.map} · `}
                      {formatDuration(h.durationSeconds)}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: "category",
              header: "Tipo",
              width: "100px",
              render: (h) => (
                <span
                  className={cn(
                    "inline-flex font-display italic font-black text-[10px] uppercase tracking-[0.1em] px-2 py-0.5",
                    categoryClass[h.category]
                  )}
                >
                  {h.category}
                </span>
              ),
            },
            {
              key: "match",
              header: "Partida",
              width: "minmax(0, 0.9fr)",
              render: (h) => {
                if (!h.matchId) {
                  return (
                    <span className="text-fg-mute text-[11px]">—</span>
                  );
                }
                const m = findMatch(h.matchId);
                if (!m) return null;
                const a = findTeam(m.teamA);
                const b = findTeam(m.teamB);
                return (
                  <span className="text-[12px] text-fg-soft font-semibold">
                    {a?.name} vs {b?.name}
                  </span>
                );
              },
            },
            {
              key: "player",
              header: "Jogador",
              width: "100px",
              render: (h) =>
                h.playerIgn ? (
                  <span className="font-display italic font-extrabold text-[13px] uppercase text-blue">
                    {h.playerIgn}
                  </span>
                ) : (
                  <span className="text-fg-mute text-[11px]">—</span>
                ),
            },
            {
              key: "views",
              header: "Views",
              width: "80px",
              className: "text-center",
              render: (h) => (
                <span className="font-display italic font-black text-[15px] text-navy tabular-nums flex items-center justify-center gap-1">
                  <Eye weight="bold" size={12} className="text-fg-mute" />
                  {h.views >= 1000
                    ? `${(h.views / 1000).toFixed(1)}K`
                    : h.views}
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
          rows={highlights}
          rowKey={(h) => h.id}
        />
      </div>
    </>
  );
}
