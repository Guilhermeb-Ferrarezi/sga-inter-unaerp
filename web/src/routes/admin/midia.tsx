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
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/midia")({
  component: AdminMediaPage,
});

const photoVariants = [
  "from-[#0E4D8C] to-[#2EAA80]",
  "from-[#2EAA80] to-[#A4CD3A]",
  "from-[#0A1A3D] to-[#0073B7]",
  "from-[#A4CD3A] to-[#0073B7]",
  "from-[#0073B7] to-[#0A1A3D]",
  "from-[#EC4899] to-[#2EAA80]",
];

const recentUploads = Array.from({ length: 18 }).map((_, i) => ({
  id: `m${i}`,
  caption: [
    "g1lh em ação",
    "Bastidores Thunder",
    "Hi-5 do Dragon",
    "Roster Nova",
    "Atenção pré-partida",
    "Vitória Eclipse",
  ][i % 6],
  variant: photoVariants[i % photoVariants.length],
  size: ["1.2 MB", "2.4 MB", "850 KB", "1.7 MB", "3.1 MB"][i % 5],
  date: ["agora", "5 min atrás", "1h atrás", "3h atrás", "1d atrás"][i % 5],
}));

function AdminMediaPage() {
  const [dragOver, setDragOver] = useState(false);

  return (
    <>
      <AdminTopbar
        title="Mídia"
        subtitle="252 fotos · 37 vídeos · Cloudflare R2 + Stream"
        actions={
          <Button>
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
                {recentUploads.length} arquivos
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 p-4">
              {recentUploads.map((u) => (
                <div
                  key={u.id}
                  className={cn(
                    "aspect-square bg-gradient-to-br relative cursor-pointer group",
                    u.variant
                  )}
                >
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="font-display italic font-extrabold text-[11px] uppercase text-white leading-tight truncate">
                      {u.caption}
                    </div>
                    <div className="text-[9px] text-white/70 font-bold uppercase tracking-[0.06em] mt-0.5">
                      {u.size} · {u.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              <FolderRow name="unaerp/2025/matches" count={142} />
              <FolderRow name="unaerp/2025/backstage" count={58} />
              <FolderRow name="unaerp/2025/teams" count={42} />
              <FolderRow name="unaerp/2024" count={189} />
              <FolderRow name="unaerp/2023" count={142} />
              <FolderRow name="unaerp/2022" count={98} />
            </div>
          </div>

          <div className="bg-white border-[1.5px] border-border-strong p-5 shadow-brutal-sm">
            <div className="font-display italic font-black text-[16px] uppercase text-navy mb-4 pb-2.5 border-b border-border">
              Storage R2
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[12px] text-fg-soft mb-1.5">
                  <span>Usado</span>
                  <span className="font-display italic font-black text-navy">
                    2.1 GB / 10 GB
                  </span>
                </div>
                <div className="h-3 bg-surface-3 border border-border">
                  <div
                    className="h-full bg-gradient-to-r from-blue via-teal to-lime"
                    style={{ width: "21%" }}
                  />
                </div>
              </div>
              <div className="text-[11px] text-fg-mute">
                Custo estimado:{" "}
                <strong className="text-navy">$0.31 / mês</strong>
              </div>
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
