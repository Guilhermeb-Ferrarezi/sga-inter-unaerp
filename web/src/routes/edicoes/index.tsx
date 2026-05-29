import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Lightning, Trophy, Archive } from "@phosphor-icons/react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { useEditions } from "@/lib/use-editions";
import { useEditionTeams } from "@/lib/use-edition";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/edicoes/")({
  component: EditionsPage,
});

function EditionsPage() {
  const { editions, loading, error } = useEditions("valorant");
  const { edition: gqlActiveEdition } = useEditionTeams("valorant");
  const past = editions.filter((e) => e.status !== "ongoing");
  const currentEdition = editions.find((e) => e.status === "ongoing");
  // findTeam stub — sem roster cadastrado, retorna fake
  const findTeam = (_slug: string | undefined): { name: string } | undefined => undefined;
  void gqlActiveEdition;

  return (
    <>
      <PageHeader
        crumbs={[{ to: "/", label: "Inter UnaERP" }, { label: "Edições" }]}
        tagNumber="08"
        tagVariant="navy"
        title={
          <>
            Edições <span className="text-blue">Anteriores</span>
          </>
        }
        subtitle="Histórico completo do Inter UnaERP desde 2022. Cada edição tem times, jogadores, partidas e galeria preservados — campeões e gerações documentadas para sempre."
      />

      <Section decoNum="HIST">
        {loading && (
          <div className="text-center py-12 text-fg-mute font-display italic font-extrabold uppercase">
            Carregando edições…
          </div>
        )}
        {error && (
          <div className="text-center py-12 text-red-500 font-display italic font-extrabold uppercase">
            Erro ao carregar
          </div>
        )}

        {currentEdition && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative bg-white border-[1.5px] border-border-strong shadow-brutal-lg p-9 mt-7 mb-12 brackets-lime"
        >
          <span className="inline-flex bg-lime text-navy px-3 py-1.5 font-display italic font-black text-[11px] uppercase tracking-[0.1em] mb-4.5 shadow-brutal-sm gap-1.5 items-center">
            <Lightning weight="fill" size={12} />
            Edição em Andamento
          </span>
          <h2 className="font-display italic font-black uppercase text-[80px] leading-[0.9] text-navy tracking-[-0.025em] mb-5">
            <span className="text-blue">Inter UnaERP</span> Valorant
            <br />
            <span
              className="text-transparent inline-block text-[56px]"
              style={{ WebkitTextStroke: "2px #2EAA80" }}
            >
              {currentEdition.year}
            </span>
          </h2>
          <div className="flex flex-wrap gap-5.5 mb-7">
            <CurrentStat
              num={currentEdition.teamsCount.toString()}
              label="Times"
              color="text-blue"
            />
            <CurrentStat num="—" label="Jogadores" color="text-teal" />
            <CurrentStat
              num={`${currentEdition.matchesCount}`}
              label="Partidas"
              color="text-lime"
            />
            <CurrentStat num="28 Jun" label="Final" />
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/classificacao">Ver Classificação →</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/confrontos">Próximos Confrontos</Link>
            </Button>
          </div>
        </motion.div>
        )}

        <SectionHeader
          number="02"
          variant="teal"
          title={
            <>
              Linha do <span className="text-teal">Tempo</span>
            </>
          }
        />

        <div className="relative pl-20 mt-4">
          <div className="absolute left-[38px] top-0 bottom-0 w-[3px] bg-navy" />
          {past.map((e, idx) => {
            const champ = e.champion ? findTeam(e.champion) : null;
            return (
              <motion.div
                key={e.year}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative bg-white border-[1.5px] border-border-strong p-7 mb-6 shadow-brutal hover:translate-x-[-2px] hover:translate-y-[-2px] hover:[box-shadow:7px_7px_0_#0A1A3D] hover:border-blue transition-all cursor-pointer"
              >
                <span
                  className={cn(
                    "absolute -left-[45px] top-7 w-4 h-4 border-[3px] border-white",
                    idx === 0 && "bg-lime",
                    idx === 1 && "bg-teal",
                    idx === 2 && "bg-blue"
                  )}
                  style={{ boxShadow: "0 0 0 3px #0A1A3D" }}
                />
                <Link to="/edicoes/$year" params={{ year: e.year.toString() }}>
                  <div className="grid grid-cols-[90px_1fr_auto] gap-7 items-center">
                    <div className="font-display italic font-black text-[64px] leading-none text-navy tracking-[-0.02em]">
                      {e.year}
                    </div>
                    <div>
                      <div className="font-display italic font-black text-[26px] uppercase text-navy leading-none mb-2">
                        {e.name}
                      </div>
                      <div className="flex flex-wrap gap-3.5">
                        <Pill variant="game">Valorant</Pill>
                        {champ && (
                          <Pill variant="champ">
                            <Trophy weight="fill" size={11} />
                            {champ.name} · Campeão
                          </Pill>
                        )}
                        <Pill>{e.teamsCount} times</Pill>
                        {e.mvp && (
                          <Pill>
                            MVP <strong className="text-blue">{e.mvp}</strong>
                          </Pill>
                        )}
                        <Pill>{e.matchesCount} partidas</Pill>
                        <Pill>{e.photosCount} fotos</Pill>
                      </div>
                    </div>
                    <div className="font-display italic font-black text-[22px] text-lime flex items-center gap-2">
                      <Archive weight="bold" size={20} />
                      Acervo
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Section>
    </>
  );
}

function CurrentStat({
  num,
  label,
  color = "text-navy",
}: {
  num: string;
  label: string;
  color?: string;
}) {
  return (
    <div className="px-4.5 border-r border-border-strong first:pl-0 last:border-r-0">
      <div
        className={cn(
          "font-display italic font-black text-[38px] leading-none",
          color
        )}
      >
        {num}
      </div>
      <div className="text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.1em] mt-1">
        {label}
      </div>
    </div>
  );
}

function Pill({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant?: "champ" | "game";
}) {
  return (
    <span
      className={cn(
        "px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.08em] font-display italic border inline-flex items-center gap-1.5",
        variant === "champ" && "bg-lime border-lime text-navy",
        variant === "game" && "bg-navy text-white border-navy",
        !variant && "bg-surface-3 text-fg-soft border-border"
      )}
    >
      {children}
    </span>
  );
}
