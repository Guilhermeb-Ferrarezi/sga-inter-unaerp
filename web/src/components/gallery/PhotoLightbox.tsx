import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CaretLeft,
  CaretRight,
  DownloadSimple,
  ShareNetwork,
} from "@phosphor-icons/react";

export type LightboxPhoto = {
  id: string;
  gradient: string; // tailwind classes
  caption: string;
  info: string;
};

interface PhotoLightboxProps {
  photos: LightboxPhoto[];
  currentIndex: number | null;
  onClose: () => void;
  onChange: (idx: number) => void;
}

export function PhotoLightbox({
  photos,
  currentIndex,
  onClose,
  onChange,
}: PhotoLightboxProps) {
  const open = currentIndex !== null;
  const current = open ? photos[currentIndex!] : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && currentIndex! > 0) {
        onChange(currentIndex! - 1);
      } else if (e.key === "ArrowRight" && currentIndex! < photos.length - 1) {
        onChange(currentIndex! + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, currentIndex, photos.length, onClose, onChange]);

  const hasPrev = currentIndex !== null && currentIndex > 0;
  const hasNext = currentIndex !== null && currentIndex < photos.length - 1;

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <AnimatePresence>
        {open && current && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-[200] bg-navy/95 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-[210] flex flex-col"
              >
                {/* Top bar */}
                <div className="flex items-center justify-between px-7 py-4 border-b border-white/10 text-white">
                  <Dialog.Title asChild>
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="font-display italic font-black text-[20px] uppercase tracking-[-0.01em] truncate">
                        {current.caption}
                      </span>
                      <span className="hidden md:inline text-[11.5px] text-white/60 font-extrabold uppercase tracking-[0.1em]">
                        {current.info}
                      </span>
                    </div>
                  </Dialog.Title>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-white/60 font-extrabold uppercase tracking-[0.12em] mr-2 hidden md:inline">
                      {currentIndex! + 1} / {photos.length}
                    </span>
                    <ToolButton icon={DownloadSimple} label="Download" />
                    <ToolButton icon={ShareNetwork} label="Compartilhar" />
                    <button
                      onClick={onClose}
                      className="w-10 h-10 flex items-center justify-center bg-lime text-navy [box-shadow:3px_3px_0_#0E4D8C] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:[box-shadow:4px_4px_0_#0E4D8C] transition-all"
                      aria-label="Fechar"
                    >
                      <X weight="bold" size={16} />
                    </button>
                  </div>
                </div>

                {/* Photo area */}
                <div className="flex-1 flex items-center justify-center relative overflow-hidden p-5 md:p-10">
                  {/* Prev */}
                  {hasPrev && (
                    <button
                      onClick={() => onChange(currentIndex! - 1)}
                      className="absolute left-4 md:left-7 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white text-navy flex items-center justify-center [box-shadow:4px_4px_0_#A4CD3A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:[box-shadow:6px_6px_0_#A4CD3A] transition-all"
                      aria-label="Foto anterior"
                    >
                      <CaretLeft weight="bold" size={18} />
                    </button>
                  )}
                  {/* Photo */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className={`relative max-w-5xl w-full aspect-video bg-gradient-to-br ${current.gradient}`}
                    >
                      {/* placeholder ornament */}
                      <div className="absolute top-3 left-3 w-10 h-10 border-t-[3px] border-l-[3px] border-lime" />
                      <div className="absolute bottom-3 right-3 w-10 h-10 border-b-[3px] border-r-[3px] border-lime" />
                    </motion.div>
                  </AnimatePresence>
                  {/* Next */}
                  {hasNext && (
                    <button
                      onClick={() => onChange(currentIndex! + 1)}
                      className="absolute right-4 md:right-7 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white text-navy flex items-center justify-center [box-shadow:4px_4px_0_#A4CD3A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:[box-shadow:6px_6px_0_#A4CD3A] transition-all"
                      aria-label="Próxima foto"
                    >
                      <CaretRight weight="bold" size={18} />
                    </button>
                  )}
                </div>

                {/* Bottom strip — thumbs */}
                <div className="border-t border-white/10 px-7 py-3 overflow-x-auto">
                  <div className="flex gap-2 justify-center min-w-max mx-auto">
                    {photos.map((p, idx) => (
                      <button
                        key={p.id}
                        onClick={() => onChange(idx)}
                        className={`w-16 h-12 bg-gradient-to-br ${p.gradient} transition-opacity ${
                          idx === currentIndex
                            ? "opacity-100 ring-2 ring-lime"
                            : "opacity-50 hover:opacity-80"
                        }`}
                        aria-label={`Foto ${idx + 1}`}
                      />
                    ))}
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

function ToolButton({
  icon: Icon,
  label,
}: {
  icon: typeof DownloadSimple;
  label: string;
}) {
  return (
    <button
      className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-[11px] font-display italic font-extrabold uppercase tracking-[0.08em] text-white"
      title={label}
    >
      <Icon weight="bold" size={13} />
      {label}
    </button>
  );
}
