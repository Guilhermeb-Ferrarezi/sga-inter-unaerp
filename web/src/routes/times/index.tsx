import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/section";
import { FilterPill } from "@/components/ui/filter-pill";
import { TeamCard } from "@/components/cards/TeamCard";
import { useEditionTeams } from "@/lib/use-edition";

export const Route = createFileRoute("/times/")({
  component: TeamsListPage,
});

type GroupFilter = "all" | "A" | "B" | "C";

function TeamsListPage() {
  const [filter, setFilter] = useState<GroupFilter>("all");

  // 🌐 GraphQL — times reais (fallback automático pro mock)
  const { teams, usingFallback } = useEditionTeams("valorant");

  const sorted = [...teams].sort((a, b) => b.points - a.points || b.pointsDiff - a.pointsDiff);
  const visible = filter === "all" ? sorted : sorted.filter((t) => t.group === filter);

  return (
    <>
      <PageHeader
        crumbs={[{ to: "/", label: "Inter UnaERP" }, { label: "Times" }]}
        tagNumber="02"
        tagVariant="blue"
        title={
          <>
            Times <span className="text-blue">2025</span>
          </>
        }
        subtitle={`${teams.length} times confirmados na edição Valorant 2025. Cada time tem roster próprio, histórico de confrontos e estatísticas acompanhadas em tempo real.`}
      >
        {!usingFallback && (
          <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal text-teal px-3 py-1.5 font-display italic font-extrabold uppercase text-[10.5px] tracking-[0.1em] mt-3">
            <span className="w-2 h-2 bg-teal rounded-full animate-pulse-dot" />
            Dados ao vivo do PostgreSQL
          </div>
        )}
        <div className="flex flex-wrap gap-2.5 mt-4.5">
          <FilterPill
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            Todos ({teams.length})
          </FilterPill>
          {(["A", "B", "C"] as const).map((g) => (
            <FilterPill
              key={g}
              active={filter === g}
              onClick={() => setFilter(g)}
            >
              Grupo {g} ({teams.filter((t) => t.group === g).length})
            </FilterPill>
          ))}
        </div>
      </PageHeader>

      <Section decoNum="TMS">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2"
        >
          {visible.map((t) => (
            <TeamCard key={t.id} team={t} rank={sorted.indexOf(t) + 1} />
          ))}
        </motion.div>
      </Section>
    </>
  );
}
