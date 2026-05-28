import { motion } from "framer-motion";
import { Play } from "@phosphor-icons/react";
import type { Highlight } from "@/data/types";
import { cn } from "@/lib/utils";

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

const categoryColor: Record<Highlight["category"], string> = {
  Ace: "bg-lime text-navy",
  Clutch: "bg-teal text-white",
  Play: "bg-navy/85 text-white backdrop-blur-sm",
  Recap: "bg-navy/85 text-white backdrop-blur-sm",
};

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function HighlightCard({ highlight }: { highlight: Highlight }) {
  return (
    <motion.button
      whileHover={{ x: -3, y: -3 }}
      transition={{ duration: 0.12 }}
      className="block text-left bg-white border-[1.5px] border-border overflow-hidden cursor-pointer hover:border-lime hover:[box-shadow:5px_5px_0_#0A1A3D] transition-colors w-full"
    >
      <div
        className={cn(
          "aspect-[16/10] relative bg-gradient-to-br",
          thumbVariants[highlight.thumbVariant]
        )}
      >
        <span
          className={cn(
            "absolute top-2 left-2 px-2 py-0.5 font-display italic font-extrabold text-[10px] uppercase tracking-[0.08em]",
            categoryColor[highlight.category]
          )}
        >
          {highlight.category}
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-lime text-navy flex items-center justify-center [box-shadow:4px_4px_0_#0A1A3D]">
            <Play weight="fill" size={16} />
          </div>
        </div>
        <span className="absolute bottom-2 right-2 bg-navy text-white px-2 py-1 text-[11px] font-extrabold font-display italic tabular-nums">
          {formatDuration(highlight.durationSeconds)}
        </span>
      </div>
      <div className="p-3.5">
        <div className="font-display italic font-extrabold text-[15px] uppercase text-navy leading-tight">
          {highlight.title}
        </div>
        <div className="text-[10.5px] text-fg-mute mt-1.5 font-bold uppercase tracking-[0.06em]">
          {highlight.map && `${highlight.map} · `}
          {highlight.views >= 1000
            ? `${(highlight.views / 1000).toFixed(1)}K views`
            : `${highlight.views} views`}
          {" · "}
          {highlight.publishedDaysAgo === 0
            ? "hoje"
            : `${highlight.publishedDaysAgo}d atrás`}
        </div>
      </div>
    </motion.button>
  );
}
