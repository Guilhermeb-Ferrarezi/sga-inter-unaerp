import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  UploadSimple,
  ImageSquare,
  CloudArrowUp,
  CheckCircle,
  Folder,
} from "@phosphor-icons/react";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Button } from "@/components/ui/button";
import { useEditionGallery, useEditionHighlights } from "@/lib/use-highlights";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/midia")({
  component: AdminMediaPage,
});

function AdminMediaPage() {
  const [dragOver, setDragOver] = useState(false);
  const { photos } = useEditionGallery("valorant");
  const { highlights } = useEditionHighlights("valorant");

  return (
    <>
      <AdminTopbar
        title="Mídia"
        subtitle={`${photos.length} fotos · ${highlights.length} vídeos · Cloudflare R2 + Stream`}
        actions={
          <Button disabled>
            <UploadSimple weight="bold" size={14} />
            Upload em massa
          </Button>
        }
      />

      <div className="p-9 grid lg:grid-cols-[1fr_360px] gap-7">
        <div className="space-y-7">
          {/* Drop zone */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
            }}
            className={cn(
              "border-[3px] border-dashed border-border-strong bg-white p-12 text-center transition-all",
              dragOver && "border-lime bg-lime/[0.05]"
            )}
          >
            <CloudArrowUp
              weight="duotone"
              size={56}
              className={cn("mx-auto mb-3", dragOver ? "text-lime" : "text-blue")}
            />
            <div className="font-display italic font-black text-[24px] uppercase text-navy">
              Arraste arquivos aqui
            </div>
            <div className="text-[13px] text-fg-soft mt-2 mb-5">
              Ou{" "}
              <button className="text-blue font-bold underline underline-offset-2">
                escolha do computador
              </button>
              . PNG, JPG, WebP (máx. 20 MB). Vídeos vão direto para Cloudflare Stream.
            </div>
            <div className="flex justify-center gap-2 text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.08em]">
              <span className="flex items-center gap-1">
                <CheckCircle weight="fill" size={11} className="text-teal" />
                Presigned URLs
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <CheckCircle weight="fill" size={11} className="text-teal" />
                Upload direto pro R2
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <CheckCircle weight="fill" size={11} className="text-teal" />
                Confirmação no banco
              </span>
            </div>
          </motion.div>

          {/* Uploads recentes */}
          <div className="bg-white border-[1.5px] border-border-strong shadow-brutal-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="font-display italic font-black text-[16px] uppercase text-navy flex items-center gap-2.5">
                <ImageSquare weight="bold" size={16} className="text-blue" />
                Uploads recentes
              </div>
              <span className="text-[11px] text-fg-mute font-extrabold uppercase tracking-[0.1em]">
                {photos.length} arquivos
              </span>
            </div>
            {photos.length === 0 ? (
              <div className="text-center py-12 text-fg-mute text-[13px]">
                Nenhuma foto enviada ainda. Use a área acima pra fazer upload.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 p-4">
                {photos.slice(0, 24).map((u, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-surface-3 border border-border relative cursor-pointer group overflow-hidden"
                  >
                    <img
                      src={u.publicUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — pastas + storage */}
        <div className="space-y-5">
          <div className="bg-white border-[1.5px] border-border-strong p-5 shadow-brutal-sm">
            <div className="font-display italic font-black text-[16px] uppercase text-navy mb-4 pb-2.5 border-b border-border flex items-center gap-2">
              <Folder weight="fill" size={14} className="text-lime" />
              Pastas no R2
            </div>
            <div className="space-y-1.5">
              <FolderRow name="universitarios/inter-unaerp/" count={photos.length} />
            </div>
            <div className="text-[10.5px] text-fg-mute mt-3 leading-relaxed">
              Listagem detalhada por pasta requer integração com API R2 (não
              implementado no GraphQL ainda).
            </div>
          </div>

          <div className="bg-navy text-white p-5 [box-shadow:4px_4px_0_#A4CD3A]">
            <div className="font-display italic font-black text-[14px] uppercase mb-2">
              Cloudflare Stream
            </div>
            <div className="text-[11.5px] text-white/70 mb-4 leading-relaxed">
              Vídeos são enviados direto pro Stream com token de embed gerado pela
              API. Sem CDN extra.
            </div>
            <Button size="sm" variant="secondary" className="w-full">
              Configurar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function FolderRow({ name, count }: { name: string; count: number }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 px-2 hover:bg-surface-3 cursor-pointer transition-colors">
      <span className="text-[12.5px] text-fg-soft font-mono">{name}</span>
      <span className="text-[11px] text-fg-mute font-extrabold">{count}</span>
    </div>
  );
}
