import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/section";
import { StandingsTable } from "@/components/cards/StandingsTable";
import { TeamLogo } from "@/components/ui/team-logo";
import { teams } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/classificacao")({
  component: StandingsPage,
});

function StandingsPage() {
  const sorted = [...teams].sort(
    (a, b) => b.points - a.points || b.pointsDiff - a.pointsDiff
  );

  const groups = (["A", "B", "C"] as const).map((g) => ({
    name: g,
    teams: sorted.filter((t) => t.group === g),
  }));

  return (
    <>
      <PageHeader
        crumbs={[{ to: "/", label: "Inter UnaERP" }, { label: "Classificação" }]}
        tagNumber="05"
        tagVariant="blue"
        title={
          <>
            Classificação <span className="text-blue">Geral</span>
          </>
        }
        subtitle="Top 4 da fase de grupos avançam para o mata-mata. Critério de desempate: vitórias → saldo de rounds → confronto direto."
      />

      <Section decoNum="CLS">
        <div className="grid lg:grid-cols-[1fr_360px] gap-7">
          <StandingsTable teams={sorted} qualifyCutoff={4} />

          <div className="space-y-5.5">
            <SidebarCard title="Como Funciona" dotColor="lime">
              <Legend
                swatch={
                  <span className="w-3.5 h-3.5 bg-gradient-to-r from-lime/40 to-transparent" />
                }
                text="Top 4 classifica ao mata-mata"
              />
              <Legend
                swatch={<span className="w-3.5 h-3.5 bg-lime" />}
                text="3 pontos por vitória"
              />
              <Legend
                swatch={<span className="w-3.5 h-3.5 bg-teal" />}
                text="Desempate: saldo de rounds"
              />
            </SidebarCard>

            <SidebarCard title="Stats da Edição" dotColor="teal">
              <div className="grid grid-cols-2 gap-3.5">
                <StatItem label="Maior placar" value="13·5" color="text-lime" />
                <StatItem label="Maior virada" value="12→13" color="text-teal" />
                <StatItem label="Rounds disputados" value="312" />
                <StatItem label="Aces" value="7" color="text-blue" />
                <StatItem label="Clutches" value="11" />
                <StatItem
                  label="MVP atual"
                  value="g1lh"
                  color="text-lime"
                  small
                />
              </div>
            </SidebarCard>

            <SidebarCard title="Mapas Mais Jogados" dotColor="blue">
              {[
                ["Ascent", 5, "text-lime"],
                ["Bind", 3, ""],
                ["Haven", 2, ""],
                ["Pearl", 1, ""],
                ["Lotus", 1, ""],
              ].map(([name, count, color]) => (
                <div
                  key={name as string}
                  className="flex justify-between py-1.5 text-[12px] text-fg-soft font-bold"
                >
                  <span>{name}</span>
                  <span
                    className={cn(
                      "font-display italic font-black",
                      color as string || "text-navy"
                    )}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </SidebarCard>
          </div>
        </div>

        {/* GROUPS */}
        <div className="grid md:grid-cols-3 gap-5 mt-9">
          {groups.map((g, idx) => (
            <motion.div
              key={g.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="bg-white border-[1.5px] border-border-strong shadow-brutal"
            >
              <div className="bg-navy text-white py-3.5 px-4.5 text-center font-display italic font-black text-[18px] uppercase">
                Grupo {g.name}
              </div>
              {g.teams.map((t, i) => {
                const q = i < 2;
                return (
                  <div
                    key={t.id}
                    className={cn(
                      "grid grid-cols-[40px_1fr_50px_60px] py-3 px-4 items-center border-b border-border last:border-b-0",
                      q && "bg-gradient-to-r from-lime/[0.1] to-transparent"
                    )}
                  >
                    <span
                      className={cn(
                        "font-display italic font-black text-[18px] text-center",
                        q ? "text-lime" : "text-fg-mute"
                      )}
                    >
                      {i + 1}
                    </span>
                    <div className="flex items-center gap-2 font-display italic font-extrabold text-[14px] uppercase text-navy">
                      <TeamLogo
                        shortName={t.shortName}
                        color={t.color}
                        size="xs"
                      />
                      {t.name}
                    </div>
                    <span className="font-display italic font-black text-[14px] text-teal text-center tabular-nums">
                      {t.wins}
                      <span className="text-fg-mute">·{t.losses}</span>
                    </span>
                    <span className="font-display italic font-black text-[18px] text-blue text-center">
                      {t.points}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  );
}

function SidebarCard({
  title,
  dotColor,
  children,
}: {
  title: string;
  dotColor: "lime" | "teal" | "blue";
  children: React.ReactNode;
}) {
  const dotMap = {
    lime: "bg-lime",
    teal: "bg-teal",
    blue: "bg-blue",
  };
  return (
    <div className="bg-white border-[1.5px] border-border-strong p-5.5 shadow-brutal">
      <div className="font-display italic font-black text-[20px] uppercase text-navy mb-4 pb-2.5 border-b-2 border-navy flex items-center gap-2.5">
        <span className={cn("w-2.5 h-2.5", dotMap[dotColor])} />
        {title}
      </div>
      {children}
    </div>
  );
}

function Legend({ swatch, text }: { swatch: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      {swatch}
      <span className="text-[12px] text-fg-soft font-semibold">{text}</span>
    </div>
  );
}

function StatItem({
  label,
  value,
  color = "text-navy",
  small,
}: {
  label: string;
  value: string;
  color?: string;
  small?: boolean;
}) {
  return (
    <div className="py-2.5 border-b border-border last:border-b-0">
      <div className="text-[10px] text-fg-mute font-extrabold uppercase tracking-[0.1em]">
        {label}
      </div>
      <div
        className={cn(
          "font-display italic font-black leading-none mt-1",
          small ? "text-[18px]" : "text-[28px]",
          color
        )}
      >
        {value}
      </div>
    </div>
  );
}
