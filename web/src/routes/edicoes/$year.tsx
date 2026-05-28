import { createFileRoute, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trophy, Star } from "@phosphor-icons/react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/section";
import { TeamLogo } from "@/components/ui/team-logo";
import { editions, findTeam, teamRoster } from "@/data/mock";

export const Route = createFileRoute("/edicoes/$year")({
  loader: ({ params }) => {
    const edition = editions.find((e) => e.year.toString() === params.year);
    if (!edition) throw notFound();
    const champion = edition.champion ? findTeam(edition.champion) : null;
    const champRoster = champion ? teamRoster(champion.slug) : [];
    return { edition, champion, champRoster };
  },
  component: EditionDetailPage,
});

function EditionDetailPage() {
  const { edition, champion, champRoster } = Route.useLoaderData();

  return (
    <>
      <PageHeader
        crumbs={[
          { to: "/", label: "Inter UnaERP" },
          { to: "/edicoes", label: "Edições" },
          { label: edition.year.toString() },
        ]}
        tagNumber={edition.year.toString().slice(-2)}
        tagVariant="lime"
        title={
          <>
            Inter <span className="text-blue">UnaERP</span> {edition.year}
          </>
        }
        subtitle={`Edição ${edition.game.toUpperCase()} de ${edition.year}. ${
          edition.teamsCount
        } times, ${edition.matchesCount} partidas, ${edition.photosCount} fotos preservadas.`}
      />

      {champion && (
        <Section decoNum="01">
          <SectionHeader
            number="01"
            variant="lime"
            title={
              <>
                Campeão <span className="text-lime">da Edição</span>
              </>
            }
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border-[1.5px] border-lime shadow-brutal-lime p-9 brackets-lime"
          >
            <div className="inline-flex items-center gap-2 text-lime font-display italic font-black text-[12px] uppercase tracking-[0.12em] mb-4.5">
              <Trophy weight="fill" size={14} />
              Campeão · Mata-Mata Final
            </div>
            <div className="flex items-center gap-9 mb-6">
              <TeamLogo
                shortName={champion.shortName}
                color={champion.color}
                size="xl"
              />
              <div>
                <div className="font-display italic font-black uppercase text-[80px] leading-[0.9] text-navy tracking-[-0.025em]">
                  {champion.name}
                </div>
                {edition.mvp && (
                  <div className="flex items-center gap-2 mt-3 text-[13px] text-fg-soft">
                    MVP:{" "}
                    <strong className="text-blue font-display italic font-black text-[20px]">
                      {edition.mvp}
                    </strong>
                    <Star weight="fill" size={16} className="text-lime" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-5.5 border-t-[1.5px] border-border">
              {champRoster.map((p) => (
                <span
                  key={p.id}
                  className={
                    "px-3 py-1.5 font-display italic font-extrabold text-[13px] uppercase border " +
                    (p.isCaptain
                      ? "bg-lime border-lime text-navy"
                      : "bg-surface-3 text-navy border-border")
                  }
                >
                  {p.ign}
                  {p.isCaptain && (
                    <Star weight="fill" size={10} className="inline ml-1" />
                  )}
                </span>
              ))}
            </div>
          </motion.div>
        </Section>
      )}
    </>
  );
}
