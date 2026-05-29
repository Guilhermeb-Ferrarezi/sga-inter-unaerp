import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { LiveMatchFeature } from "@/components/home/LiveMatchFeature";
import { MatchCard } from "@/components/cards/MatchCard";
import { BracketProgress } from "@/components/home/BracketProgress";
import { StandingsTable } from "@/components/cards/StandingsTable";
import { HighlightCard } from "@/components/cards/HighlightCard";
import { LiveDot } from "@/components/ui/live-dot";
import { PlayerPodium } from "@/components/cards/PlayerPodium";
import { useEditionTeams } from "@/lib/use-edition";
import { useEditionMatches, isLive, isUpcoming } from "@/lib/use-matches";
import { useEditionHighlights } from "@/lib/use-highlights";
import { useEditionPlayers } from "@/lib/use-players";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { teams, loading } = useEditionTeams("valorant");
  const { matches } = useEditionMatches("valorant");
  const { highlights } = useEditionHighlights("valorant");
  const { players } = useEditionPlayers("valorant");

  const live = matches.filter(isLive);
  const upcoming = matches.filter(isUpcoming).slice(0, 3);
  const featuredLive = live[0];
  const topPlayers = [...players].sort((a, b) => b.stats.kd - a.stats.kd).slice(0, 3);
  const recentHl = highlights.slice(0, 4);

  return (
    <>
      <Hero />

      {/* 01 ARENA EM AÇÃO */}
      <Section decoNum="01">
        <SectionHeader
          number="01"
          variant="lime"
          title={
            <>
              Arena <span className="text-lime">em Ação</span>
            </>
          }
        />

        {featuredLive && <LiveMatchFeature match={featuredLive} />}

        {live.length === 0 && upcoming.length === 0 ? (
          <div className="bg-white border-[1.5px] border-border-strong p-9 text-center">
            <div className="font-display italic font-black text-[22px] uppercase text-navy mb-2">
              Nenhuma partida em andamento
            </div>
            <p className="text-fg-soft text-[13px]">
              Quando rolar uma partida ao vivo ou agendada, ela aparece aqui.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 pb-4 mb-4.5 border-b-2 border-navy">
                <h3 className="font-display italic font-black uppercase text-[28px] text-teal">
                  Ao Vivo
                </h3>
                <LiveDot variant="teal" />
                <span className="ml-auto text-[11px] text-fg-mute font-extrabold uppercase tracking-[0.1em]">
                  {live.length} partida{live.length === 1 ? "" : "s"}
                </span>
              </div>
              {live.length === 0 ? (
                <div className="text-center py-6 text-fg-mute text-[13px]">
                  Nenhuma partida ao vivo.
                </div>
              ) : (
                live.map((m) => <MatchCard key={m.id} match={m} />)
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 pb-4 mb-4.5 border-b-2 border-navy">
                <h3 className="font-display italic font-black uppercase text-[28px] text-navy">
                  Próximas Partidas
                </h3>
                <a
                  href="/confrontos"
                  className="ml-auto text-blue text-[11.5px] font-extrabold uppercase tracking-[0.12em]"
                >
                  Ver agenda →
                </a>
              </div>
              {upcoming.length === 0 ? (
                <div className="text-center py-6 text-fg-mute text-[13px]">
                  Nenhuma partida agendada.
                </div>
              ) : (
                upcoming.map((m) => <MatchCard key={m.id} match={m} />)
              )}
            </div>
          </div>
        )}
      </Section>

      {/* 02 BRACKET */}
      <Section alt decoNum="02">
        <SectionHeader
          number="02"
          variant="teal"
          title={
            <>
              Progresso do <span className="text-teal">Torneio</span>
            </>
          }
          link={{ to: "/edicoes", label: "Ver chaveamento →" }}
        />
        <BracketProgress />
      </Section>

      {/* 03 CLASSIFICAÇÃO */}
      <Section decoNum="03">
        <SectionHeader
          number="03"
          title={
            <>
              Classificação <span className="text-blue">Geral</span>
            </>
          }
          link={{ to: "/classificacao", label: "Tabela completa →" }}
        />
        {loading ? (
          <div className="text-center py-12 text-fg-mute font-display italic font-extrabold uppercase">
            Carregando classificação…
          </div>
        ) : (
          <StandingsTable teams={teams} qualifyCutoff={4} />
        )}
      </Section>

      {/* 04 TOP JOGADORES */}
      <Section alt decoNum="04">
        <SectionHeader
          number="04"
          variant="lime"
          title={
            <>
              Top <span className="text-lime">Jogadores</span>
            </>
          }
          link={{ to: "/jogadores", label: "Ranking completo →" }}
        />
        <PlayerPodium top3={topPlayers} />
      </Section>

      {/* 05 HIGHLIGHTS */}
      <Section decoNum="05">
        <SectionHeader
          number="05"
          variant="teal"
          title={
            <>
              Highlights da <span className="text-teal">Semana</span>
            </>
          }
          link={{ to: "/highlights", label: "Ver todos →" }}
        />
        {recentHl.length === 0 ? (
          <div className="bg-white border-[1.5px] border-border-strong p-9 text-center">
            <div className="font-display italic font-black text-[22px] uppercase text-navy mb-2">
              Sem highlights publicados
            </div>
            <p className="text-fg-soft text-[13px]">
              Aces, clutches e plays decisivas aparecem aqui assim que forem
              publicados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {recentHl.map((h) => (
              <HighlightCard key={h.id} highlight={h} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
