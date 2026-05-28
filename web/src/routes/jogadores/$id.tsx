import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star } from "@phosphor-icons/react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/section";
import { TeamLogo } from "@/components/ui/team-logo";
import { findPlayer, findTeam } from "@/data/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/jogadores/$id")({
  loader: ({ params }) => {
    const player = findPlayer(params.id);
    if (!player) throw notFound();
    const team = findTeam(player.teamSlug);
    return { player, team };
  },
  component: PlayerDetailPage,
});

function PlayerDetailPage() {
  const { player, team } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        crumbs={[
          { to: "/", label: "Inter UnaERP" },
          { to: "/jogadores", label: "Jogadores" },
          { label: player.ign },
        ]}
        tagNumber="04"
        tagVariant="navy"
        title={
          <span className="flex items-center gap-4">
            {player.ign}
            {player.isCaptain && (
              <Star weight="fill" size={36} className="text-lime" />
            )}
          </span>
        }
        subtitle={`${player.role}${player.isIgl ? " · IGL" : ""}${
          team ? ` · ${team.name}` : ""
        }`}
      />

      <Section decoNum="01">
        <SectionHeader
          number="01"
          title={
            <>
              Estatísticas da <span className="text-blue">Edição</span>
            </>
          }
        />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-5 bg-white border-[1.5px] border-border-strong shadow-brutal"
        >
          <BigStat label="K/D" value={player.stats.kd.toFixed(2)} variant="lime" />
          <BigStat label="Frags" value={player.stats.frags} variant="navy" />
          <BigStat label="ACS" value={player.stats.acs} variant="blue" />
          <BigStat label="HS%" value={`${player.stats.hsPercent}%`} variant="teal" />
          <BigStat
            label="First Bloods"
            value={player.stats.firstBloods}
            variant="navy"
          />
        </motion.div>
      </Section>

      {team && (
        <Section alt decoNum="02">
          <SectionHeader
            number="02"
            variant="teal"
            title={
              <>
                Time <span className="text-teal">Atual</span>
              </>
            }
          />
          <Link to="/times/$slug" params={{ slug: team.slug }} className="block">
            <motion.div
              whileHover={{ x: -3, y: -3 }}
              transition={{ duration: 0.12 }}
              className="bg-white border-[1.5px] border-border-strong p-7 shadow-brutal flex items-center gap-7 hover:[box-shadow:8px_8px_0_#0A1A3D] transition-shadow"
            >
              <TeamLogo
                shortName={team.shortName}
                color={team.color}
                size="lg"
              />
              <div className="flex-1">
                <div className="font-display italic font-black text-[40px] uppercase leading-none text-navy">
                  {team.name}
                </div>
                <div className="flex gap-3 mt-2.5">
                  <Pill>Grupo {team.group}</Pill>
                  <Pill>
                    <strong className="text-teal">{team.wins}V</strong> · {team.losses}D
                  </Pill>
                  <Pill>
                    Saldo{" "}
                    <strong className="text-blue">
                      {team.pointsDiff > 0 ? "+" : ""}
                      {team.pointsDiff}
                    </strong>
                  </Pill>
                </div>
              </div>
              <div className="font-display italic font-black text-[56px] text-blue tabular-nums">
                #{team.points}
              </div>
            </motion.div>
          </Link>
        </Section>
      )}
    </>
  );
}

function BigStat({
  label,
  value,
  variant,
}: {
  label: string;
  value: string | number;
  variant: "lime" | "teal" | "blue" | "navy";
}) {
  const colors = {
    lime: "text-lime",
    teal: "text-teal",
    blue: "text-blue",
    navy: "text-navy",
  };
  return (
    <div className="px-6 py-7 border-r border-border last:border-r-0 text-center">
      <div
        className={cn(
          "font-display italic font-black text-[56px] leading-none tabular-nums",
          colors[variant]
        )}
      >
        {value}
      </div>
      <div className="text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.12em] mt-3">
        {label}
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-surface-3 border-[1.5px] border-border px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-fg-soft font-display italic">
      {children}
    </span>
  );
}
