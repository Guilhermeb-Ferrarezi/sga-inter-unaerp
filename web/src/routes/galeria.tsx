import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeader } from "@/components/ui/section";
import {
  PhotoLightbox,
  type LightboxPhoto,
} from "@/components/gallery/PhotoLightbox";
import { useEditionGallery } from "@/lib/use-highlights";

export const Route = createFileRoute("/galeria")({
  component: GalleryPage,
});

function GalleryPage() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const { photos, loading } = useEditionGallery("valorant");

  const lightboxPhotos: LightboxPhoto[] = photos.map((p, i) => ({
    id: `photo-${i}`,
    src: p.publicUrl,
    caption: p.caption ?? "",
    info: "",
  }));

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
        subtitle={
          photos.length === 0
            ? "Fotos da edição — estúdio, bastidores, premiação. Hospedadas no Cloudflare R2."
            : `${photos.length} fotos publicadas. Hospedadas no Cloudflare R2.`
        }
      />

      <Section decoNum="FT">
        {loading ? (
          <div className="text-center py-16 text-fg-mute font-display italic font-extrabold uppercase">
            Carregando galeria…
          </div>
        ) : photos.length === 0 ? (
          <div className="bg-white border-[1.5px] border-border-strong p-9 text-center mt-6">
            <div className="font-display italic font-black text-[28px] uppercase text-navy mb-3">
              Sem fotos publicadas
            </div>
            <p className="text-fg-soft text-[14px] leading-relaxed max-w-md mx-auto">
              As fotos da edição aparecem aqui assim que forem enviadas pelo
              painel admin.
            </p>
          </div>
        ) : (
          <>
            <SectionHeader
              number="01"
              variant="lime"
              title={
                <>
                  Todas as <span className="text-lime">Fotos</span>
                </>
              }
            />

            <div className="columns-2 md:columns-4 xl:columns-5 gap-3.5 mt-2">
              {photos.map((p, i) => (
                <motion.button
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                  className="relative break-inside-avoid mb-3.5 group cursor-pointer block w-full bg-surface-3 border border-border overflow-hidden hover:translate-x-[-2px] hover:translate-y-[-2px] hover:[box-shadow:4px_4px_0_#0A1A3D] transition-all"
                >
                  <img
                    src={p.publicUrl}
                    alt={p.caption ?? ""}
                    loading="lazy"
                    className="w-full h-auto block"
                  />
                  {p.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 to-transparent p-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity text-left">
                      <div className="font-display italic font-extrabold text-[13px] uppercase leading-tight">
                        {p.caption}
                      </div>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            <PhotoLightbox
              photos={lightboxPhotos}
              currentIndex={activeIdx}
              onClose={() => setActiveIdx(null)}
              onChange={setActiveIdx}
            />
          </>
        )}
      </Section>
    </>
  );
}
