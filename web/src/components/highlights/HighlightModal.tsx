import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, ShareNetwork, Heart, ArrowSquareOut } from "@phosphor-icons/react";
import { findMatch, findTeam } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { Highlight } from "@/data/types";

const CF_STREAM_BASE =
  import.meta.env.VITE_CF_STREAM_BASE ?? "https://iframe.videodelivery.net";

interface HighlightModalProps {
  highlight: Highlight | null;
  onClose: () => void;
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

const thumbVariants: Record<number, string> = {
  1: "from-[#0E4D8C] to-[#2EAA80]",
  2: "from-[#0A1A3D] to-[#0073B7]",
  3: "from-[#2EAA80] to-[#A4CD3A]",
  4: "from-[#A4CD3A] to-[#0073B7]",
  5: "from-[#0073B7] to-[#0A1A3D]",
  6: "from-[#EC4899] to-[#2EAA80]",
  7: "from-[#F97316] to-[#A4CD3A]",
  8: "from-[#A855F7] to-[#0073B7]",
};

const categoryClass: Record<Highlight["category"], string> = {
  Ace: "bg-lime text-navy",
  Clutch: "bg-teal text-white",
  Play: "bg-blue text-white",
  Recap: "bg-navy text-white",
};

export function HighlightModal({ highlight, onClose }: HighlightModalProps) {
  const open = !!highlight;
  const match = highlight?.matchId ? findMatch(highlight.matchId) : null;
  const team = highlight?.teamSlug ? findTeam(highlight.teamSlug) : null;
  const a = match ? findTeam(match.teamA) : null;
  const b = match ? findTeam(match.teamB) : null;

  // cfStreamId pode estar disponível na API real; aqui usamos fallback gradient
  const hasStream = false; // será true quando highlight.cfStreamId existir na API

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <AnimatePresence>
        {open && highlight && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-[200] bg-navy/70 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.97 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-0 z-[210] flex items-center justify-center p-4 overflow-y-auto"
              >
                <div className="bg-white border-[1.5px] border-border-strong shadow-brutal-lg max-w-5xl w-full my-8 relative">
                  {/* Close */}
                  <Dialog.Close asChild>
                    <button
                      onClick={onClose}
                      className="absolute -top-4 -right-4 z-20 w-10 h-10 bg-navy text-white flex items-center justify-center [box-shadow:3px_3px_0_#A4CD3A] hover:bg-blue transition-colors"
                      aria-label="Fechar"
                    >
                      <X weight="bold" size={16} />
                    </button>
                  </Dialog.Close>

                  {/* Player */}
                  <div
                    className={cn(
                      "aspect-video relative bg-gradient-to-br",
                      thumbVariants[highlight.thumbVariant]
                    )}
                  >
                    {hasStream ? (
                      <iframe
                        title={highlight.title}
                        src={`${CF_STREAM_BASE}/CF_STREAM_ID/iframe`}
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                          <div className="w-20 h-20 bg-lime text-navy flex items-center justify-center [box-shadow:6px_6px_0_#0A1A3D] cursor-pointer hover:scale-105 transition-transform">
                            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                          <div className="text-white/80 text-[12px] font-display italic font-extrabold uppercase tracking-[0.12em]">
                            Cloudflare Stream · {formatDuration(highlight.durationSeconds)}
                          </div>
                        </div>
                      </>
                    )}
                    <span className="absolute top-4 left-4 bg-navy text-white px-3 py-1.5 font-display italic font-black text-[11px] uppercase tracking-[0.1em] backdrop-blur-sm">
                      <span
                        className={cn(
                          "inline-block px-2 py-0.5 mr-2",
                          categoryClass[highlight.category]
                        )}
                      >
                        {highlight.category}
                      </span>
                      {highlight.map && `Mapa: ${highlight.map}`}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-7 grid lg:grid-cols-[1fr_auto] gap-6">
                    <div>
                      <Dialog.Title asChild>
                        <h2 className="font-display italic font-black uppercase text-[36px] leading-[0.95] text-navy tracking-[-0.02em] mb-3">
                          {highlight.title}
                        </h2>
                      </Dialog.Title>

                      <div className="flex flex-wrap gap-3 mb-5">
                        {team && (
                          <Pill>
                            <span
                              className="inline-block w-3 h-3 mr-2"
                              style={{ background: team.color }}
                            />
                            {team.name}
                          </Pill>
                        )}
                        {highlight.playerIgn && (
                          <Pill>
                            Player:{" "}
                            <strong className="text-blue ml-1">
                              {highlight.playerIgn}
                            </strong>
                          </Pill>
                        )}
                        {a && b && (
                          <Pill>
                            {a.shortName} vs {b.shortName}
                            {match?.result && (
                              <span className="ml-2 font-display italic font-black">
                                {match.result.scoreA}·{match.result.scoreB}
                              </span>
                            )}
                          </Pill>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-5 py-4 border-t-[1.5px] border-b-[1.5px] border-border">
                        <Stat
                          label="Views"
                          value={
                            highlight.views >= 1000
                              ? `${(highlight.views / 1000).toFixed(1)}K`
                              : highlight.views.toString()
                          }
                          color="text-lime"
                          icon={Eye}
                        />
                        <Stat
                          label="Duração"
                          value={formatDuration(highlight.durationSeconds)}
                          color="text-blue"
                        />
                        <Stat
                          label="Publicado"
                          value={
                            highlight.publishedDaysAgo === 0
                              ? "hoje"
                              : `${highlight.publishedDaysAgo}d atrás`
                          }
                        />
                      </div>
                    </div>

                    {/* Actions sidebar */}
                    <div className="flex lg:flex-col gap-2.5 lg:min-w-[160px]">
                      <ActionButton icon={Heart} label="Curtir" />
                      <ActionButton icon={ShareNetwork} label="Compartilhar" />
                      <ActionButton
                        icon={ArrowSquareOut}
                        label="Ver no site"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-surface-3 border border-border-strong text-fg-soft font-display italic font-extrabold text-[12px] uppercase tracking-[0.06em] px-3 py-1.5 inline-flex items-center">
      {children}
    </span>
  );
}

function Stat({
  label,
  value,
  color = "text-navy",
  icon: Icon,
}: {
  label: string;
  value: string;
  color?: string;
  icon?: typeof Eye;
}) {
  return (
    <div>
      <div className="text-[10px] text-fg-mute font-extrabold uppercase tracking-[0.12em]">
        {label}
      </div>
      <div
        className={cn(
          "font-display italic font-black text-[26px] leading-none mt-1 flex items-center gap-1.5 tabular-nums",
          color
        )}
      >
        {Icon && <Icon weight="bold" size={18} />}
        {value}
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
}: {
  icon: typeof Heart;
  label: string;
}) {
  return (
    <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-3 border border-border-strong hover:bg-white hover:border-blue transition-colors text-[12px] font-display italic font-extrabold uppercase tracking-[0.06em] text-navy flex-1 lg:flex-initial">
      <Icon weight="bold" size={14} />
      {label}
    </button>
  );
}
