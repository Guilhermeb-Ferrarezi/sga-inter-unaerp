import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Play, Star } from "@phosphor-icons/react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/section";
import { FilterPill } from "@/components/ui/filter-pill";
import { HighlightCard } from "@/components/cards/HighlightCard";
import { useEditionHighlights } from "@/lib/use-highlights";
import { useEditionTeams } from "@/lib/use-edition";
import { cn } from "@/lib/utils";
import type { Highlight } from "@/data/types";

export const Route = createFileRoute("/highlights")({
  component: HighlightsPage,
});

type CatFilter = "all" | Highlight["category"];

function HighlightsPage() {
  const [cat, setCat] = useState<CatFilter>("all");
  const [team, setTeam] = useState<string>("all");
  const { highlights, loading } = useEditionHighlights("valorant");
  const { teams } = useEditionTeams("valorant");

  const featured = highlights[0];
  const rest = highlights
    .slice(1)
    .filter((h) => cat === "all" || h.category === cat)
    .filter((h) => team === "all" || h.teamSlug === team);

  return (
    <>
      <PageHeader
        crumbs={[{ to: "/", label: "Inter UnaERP" }, { label: "Highlights" }]}
        tagNumber="06"
        tagVariant="lime"
        title={
          <>
            Highlights da <span className="text-lime">Edição</span>
          </>
        }
        subtitle={
          highlights.length === 0
            ? "Aces, clutches, jogadas decisivas e recaps de cada rodada — hospedados em Cloudflare Stream."
            : `${highlights.length} clipes publicados. Aces, clutches, jogadas decisivas — Cloudflare Stream.`
        }
      >
        <div className="flex gap-1 mt-6 border-b-2 border-navy">
          {(
            [
              ["all", `Todos (${highlights.length})`],
              ["Ace", `Aces (${highlights.filter((h) => h.category === "Ace").length})`],
              [
                "Clutch",
                `Clutches (${highlights.filter((h) => h.category === "Clutch").length})`,
              ],
              ["Play", "Plays"],
              ["Recap", "Recaps"],
            ] as [CatFilter, string][]
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setCat(k)}
              className={cn(
                "font-display italic font-extrabold text-[16px] uppercase px-4.5 py-3 relative",
                cat === k ? "text-navy" : "text-fg-mute hover:text-navy"
              )}
            >
              {label}
              {cat === k && (
                <span className="absolute -bottom-0.5 left-1.5 right-1.5 h-1 bg-lime" />
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2.5 mt-4.5">
          <FilterPill active={team === "all"} onClick={() => setTeam("all")}>
            Todos os times
          </FilterPill>
          {teams.slice(0, 5).map((t) => (
            <FilterPill
              key={t.slug}
              active={team === t.slug}
              onClick={() => setTeam(t.slug)}
            >
              {t.name}
            </FilterPill>
          ))}
        </div>
      </PageHeader>

      <Section decoNum="06">
        {loading && (
          <div className="text-center py-16 text-fg-mute font-display italic font-extrabold uppercase">
            Carregando highlights…
          </div>
        )}
        {/* FEATURED */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border-[1.5px] border-border-strong shadow-brutal-lg grid lg:grid-cols-[1.4fr_1fr] overflow-hidden mt-6 mb-9"
          >
            <div className="aspect-video relative bg-gradient-to-br from-navy via-blue to-teal">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 100%)",
                }}
              />
              <span className="absolute top-4 left-4 bg-lime text-navy px-3 py-1.5 font-display italic font-black text-[11px] uppercase tracking-[0.1em] flex items-center gap-1.5 z-10">
                <Star weight="fill" size={11} />
                Destaque
              </span>
              <button className="absolute inset-0 flex items-center justify-center z-10 group">
                <div className="w-20 h-20 bg-lime text-navy flex items-center justify-center [box-shadow:6px_6px_0_#0A1A3D] group-hover:scale-105 group-hover:[box-shadow:8px_8px_0_#0A1A3D] transition-all">
                  <Play weight="fill" size={28} />
                </div>
              </button>
              <span className="absolute bottom-4 right-4 bg-navy text-white px-2.5 py-1 font-display italic font-black text-[13px] z-10">
                0:42
              </span>
            </div>
            <div className="p-9 flex flex-col justify-center">
              <div className="font-display italic font-extrabold text-teal text-[12px] uppercase tracking-[0.12em] mb-2.5">
                {featured.category} · Round Decisivo
              </div>
              <div className="font-display italic font-black text-[42px] uppercase text-navy leading-[0.95] tracking-[-0.02em] mb-3.5">
                {featured.title}
              </div>
              <p className="text-fg-soft text-[14px] leading-[1.6] mb-5.5">
                Round 22 da partida. Match point. Entra sozinho no site, vira pra
                cima dos três que fechavam pelo lado — clip definidor do
                campeonato.
              </p>
              <div className="flex gap-5.5 pt-4.5 border-t-[1.5px] border-border">
                <FeatCredit label="Mapa" value={featured.map ?? "—"} />
                <FeatCredit
                  label="Publicado"
                  value={`${featured.publishedDaysAgo}d atrás`}
                />
                <FeatCredit
                  label="Views"
                  value={`${(featured.views / 1000).toFixed(1)}K`}
                  color="text-lime"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* GRID */}
        {rest.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5">
            {rest.map((h) => (
              <HighlightCard key={h.id} highlight={h} />
            ))}
          </div>
        ) : (
          !featured && (
            <div className="text-center py-16 text-fg-mute font-display italic font-extrabold uppercase">
              Sem highlights publicados ainda.
            </div>
          )
        )}
      </Section>
    </>
  );
}

function FeatCredit({
  label,
  value,
  color = "text-navy",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div>
      <div className="text-[10px] text-fg-mute font-extrabold uppercase tracking-[0.1em]">
        {label}
      </div>
      <div
        className={cn(
          "font-display italic font-black text-[18px] mt-0.5",
          color
        )}
      >
        {value}
      </div>
    </div>
  );
}
