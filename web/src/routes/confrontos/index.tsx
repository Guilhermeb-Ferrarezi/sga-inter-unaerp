import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/section";
import { FilterPill } from "@/components/ui/filter-pill";
import { MatchCard } from "@/components/cards/MatchCard";
import { LiveMatchFeature } from "@/components/home/LiveMatchFeature";
import {
  matches,
  liveMatches,
  upcomingMatches,
  doneMatches,
} from "@/data/mock";
import { cn } from "@/lib/utils";
import type { Match } from "@/data/types";

export const Route = createFileRoute("/confrontos/")({
  component: MatchesPage,
});

type Tab = "all" | "live" | "upcoming" | "done";
type GroupFilter = "all" | "A" | "B" | "C";

function MatchesPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [group, setGroup] = useState<GroupFilter>("all");

  const filtered = useMemo(() => {
    let list: Match[] = matches;
    if (tab === "live") list = liveMatches();
    else if (tab === "upcoming") list = upcomingMatches();
    else if (tab === "done") list = doneMatches();
    if (group !== "all") list = list.filter((m) => m.group === group);
    return list;
  }, [tab, group]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);
  const featuredLive = liveMatches()[0];

  return (
    <>
      <PageHeader
        crumbs={[{ to: "/", label: "Inter UnaERP" }, { label: "Confrontos" }]}
        tagNumber="04"
        tagVariant="teal"
        title={
          <>
            Agenda <span className="text-teal">de Partidas</span>
          </>
        }
        subtitle="24 partidas previstas na fase de grupos · 12 disputadas até agora. Todas em MD1."
      >
        <div className="flex gap-1 mt-6 border-b-2 border-navy">
          {(
            [
              ["all", `Todas (${matches.length})`],
              ["live", `Ao Vivo (${liveMatches().length})`],
              ["upcoming", `Próximas (${upcomingMatches().length})`],
              ["done", `Disputadas (${doneMatches().length})`],
            ] as [Tab, string][]
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={cn(
                "font-display italic font-extrabold text-[16px] uppercase px-4.5 py-3 relative",
                tab === k ? "text-navy" : "text-fg-mute hover:text-navy"
              )}
            >
              {label}
              {tab === k && (
                <span className="absolute -bottom-0.5 left-1.5 right-1.5 h-1 bg-lime" />
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2.5 mt-4.5">
          <FilterPill
            active={group === "all"}
            onClick={() => setGroup("all")}
          >
            Todos os Grupos
          </FilterPill>
          {(["A", "B", "C"] as const).map((g) => (
            <FilterPill
              key={g}
              active={group === g}
              onClick={() => setGroup(g)}
            >
              Grupo {g}
            </FilterPill>
          ))}
        </div>
      </PageHeader>

      <Section decoNum="VS">
        {tab !== "done" && featuredLive && tab !== "upcoming" && (
          <LiveMatchFeature match={featuredLive} />
        )}

        {grouped.map(({ label, weekday, items }, idx) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            className="mt-9 first:mt-0"
          >
            <div className="flex items-baseline gap-3.5 pb-3 border-b-2 border-navy mb-4.5">
              <span className="font-display italic font-black text-[44px] leading-none text-navy">
                {label.split(" ")[0]}
              </span>
              <span className="font-display italic font-extrabold text-[18px] text-fg-mute uppercase">
                {label.split(" ")[1]}
              </span>
              <span className="text-[11.5px] text-blue font-extrabold uppercase tracking-[0.12em] ml-auto">
                {weekday}
              </span>
              <span className="text-[11px] text-fg-mute font-extrabold uppercase tracking-[0.1em]">
                {items.length} partida{items.length === 1 ? "" : "s"}
              </span>
            </div>
            {items.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </motion.div>
        ))}

        {grouped.length === 0 && (
          <div className="text-center py-16 text-fg-mute font-display italic font-extrabold uppercase">
            Nenhuma partida encontrada para esse filtro.
          </div>
        )}
      </Section>
    </>
  );
}

function groupByDate(list: Match[]) {
  const map = new Map<string, Match[]>();
  for (const m of list) {
    const d = new Date(m.scheduledAt);
    const key = `${d.getDate().toString().padStart(2, "0")} ${d
      .toLocaleString("pt-BR", { month: "short" })
      .replace(".", "")}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  return Array.from(map.entries())
    .map(([label, items]) => {
      const first = new Date(items[0].scheduledAt);
      const weekday = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
      }).format(first);
      return { label, weekday, items };
    })
    .sort((a, b) => +new Date(a.items[0].scheduledAt) - +new Date(b.items[0].scheduledAt));
}
