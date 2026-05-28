import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/section";

export const Route = createFileRoute("/galeria")({
  component: GalleryPage,
});

const albums = [
  { title: "Olimpo vs Thunder", date: "07 Jun · Estúdio SGA", photos: 42, variant: 1 },
  { title: "Dragon vs Storm", date: "07 Jun · Estúdio SGA", photos: 28, variant: 2 },
  { title: "Bastidores R2", date: "04 Jun · Camarins", photos: 36, variant: 3 },
  { title: "Sorteio · Cerimônia", date: "28 Mai · Auditório", photos: 19, variant: 4 },
];

const photoVariants = [
  "from-[#0E4D8C] to-[#2EAA80]",
  "from-[#2EAA80] to-[#A4CD3A]",
  "from-[#0A1A3D] to-[#0073B7]",
  "from-[#A4CD3A] to-[#0073B7]",
  "from-[#0073B7] to-[#0A1A3D]",
  "from-[#EC4899] to-[#2EAA80]",
  "from-[#F97316] to-[#A4CD3A]",
  "from-[#A855F7] to-[#0073B7]",
  "from-[#0E4D8C] to-[#A4CD3A]",
];

const photoData = [
  { cap: "g1lh em ação", info: "Olimpo vs Thunder · 07 Jun", aspect: "aspect-[4/3]" },
  { cap: "Bastidores Thunder", info: "Camarim · 07 Jun", aspect: "aspect-[3/4]" },
  { cap: "Hi-5 do Dragon", info: "Após o Round 14", aspect: "aspect-square" },
  { cap: "Roster do Nova", info: "Estúdio · 04 Jun", aspect: "aspect-[4/3]" },
  { cap: "Atenção pré-partida", info: "Olimpo · 07 Jun", aspect: "aspect-video" },
  { cap: "Vitória Eclipse", info: "Comemoração · Gr. C", aspect: "aspect-[3/4]" },
  { cap: "scr em foco", info: "Olimpo · Defesa", aspect: "aspect-[4/3]" },
  { cap: "Mesa de mixagem", info: "Áudio SGA", aspect: "aspect-square" },
  { cap: "Trophy 2024", info: "Memória · Olimpo", aspect: "aspect-[3/4]" },
  { cap: "Casters em ação", info: "Mesa principal", aspect: "aspect-[4/3]" },
  { cap: "luK concentrado", info: "Thunder · Half 2", aspect: "aspect-[2/3]" },
  { cap: "Comemoração Olimpo", info: "Match point", aspect: "aspect-[4/3]" },
  { cap: "Titan no warm-up", info: "Bastidores · 04 Jun", aspect: "aspect-square" },
  { cap: "Frame da derrota", info: "Thunder · pós-partida", aspect: "aspect-[3/4]" },
  { cap: "Plateia lotada", info: "Auditório · estreia", aspect: "aspect-video" },
];

function GalleryPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ to: "/", label: "Inter UnaERP" }, { label: "Galeria" }]}
        tagNumber="07"
        tagVariant="teal"
        title={
          <>
            Galeria <span className="text-teal">de Fotos</span>
          </>
        }
        subtitle="252 fotos publicadas. Estúdio, bastidores, premiação e mais — hospedadas no Cloudflare R2."
      />

      <Section decoNum="FT">
        <SectionHeader
          number="01"
          title={
            <>
              Álbuns <span className="text-blue">Recentes</span>
            </>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4.5 mt-2 mb-10">
          {albums.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white border-[1.5px] border-border-strong [box-shadow:4px_4px_0_#0A1A3D] overflow-hidden cursor-pointer hover:translate-x-[-2px] hover:translate-y-[-2px] hover:[box-shadow:6px_6px_0_#0A1A3D] hover:border-lime transition-all"
            >
              <div
                className={`aspect-[16/10] bg-gradient-to-br ${
                  photoVariants[a.variant - 1]
                } relative`}
              >
                <span className="absolute top-2.5 right-2.5 bg-navy/85 text-white px-2.5 py-1 font-display italic font-black text-[12px] backdrop-blur-sm">
                  {a.photos} fotos
                </span>
              </div>
              <div className="p-3.5">
                <div className="font-display italic font-extrabold text-[16px] uppercase text-navy">
                  {a.title}
                </div>
                <div className="text-[11px] text-fg-mute font-bold uppercase tracking-[0.08em] mt-1">
                  {a.date}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <SectionHeader
          number="02"
          variant="lime"
          title={
            <>
              Todas as <span className="text-lime">Fotos</span>
            </>
          }
        />

        <div className="columns-2 md:columns-4 xl:columns-5 gap-3.5 mt-2">
          {photoData.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              className={`relative break-inside-avoid mb-3.5 group cursor-pointer bg-gradient-to-br ${
                photoVariants[i % photoVariants.length]
              } ${p.aspect} hover:translate-x-[-2px] hover:translate-y-[-2px] hover:[box-shadow:4px_4px_0_#0A1A3D] transition-all`}
            >
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 to-transparent p-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="font-display italic font-extrabold text-[13px] uppercase leading-tight">
                  {p.cap}
                </div>
                <div className="text-[10px] text-white/70 font-bold uppercase tracking-[0.06em] mt-1">
                  {p.info}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>
    </>
  );
}
