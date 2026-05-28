import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Crumb = { to: string; label: string } | { label: string };

interface PageHeaderProps {
  crumbs?: Crumb[];
  tagNumber: string;
  tagVariant?: "blue" | "teal" | "lime" | "navy";
  title: React.ReactNode;
  subtitle?: string;
  children?: React.ReactNode;
}

const tagVariants = {
  blue: "bg-blue text-white [box-shadow:3px_3px_0_#0A1A3D]",
  teal: "bg-teal text-white [box-shadow:3px_3px_0_#0A1A3D]",
  lime: "bg-lime text-navy [box-shadow:3px_3px_0_#2EAA80]",
  navy: "bg-navy text-white [box-shadow:3px_3px_0_#A4CD3A]",
};

export function PageHeader({
  crumbs,
  tagNumber,
  tagVariant = "blue",
  title,
  subtitle,
  children,
}: PageHeaderProps) {
  return (
    <header className="relative bg-surface-1 border-b border-border overflow-hidden">
      {/* radial deco */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 70% at 90% 50%, rgba(46,170,128,0.10) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 95% 100%, rgba(164,205,58,0.10) 0%, transparent 60%)",
        }}
      />
      <div className="relative max-w-[1500px] mx-auto px-7 pt-14 pb-9">
        {crumbs && crumbs.length > 0 && (
          <div className="flex gap-2 items-center text-[11px] text-fg-mute font-extrabold uppercase tracking-[0.12em] mb-3.5">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                {"to" in c ? (
                  <Link to={c.to} className="hover:text-blue transition-colors">
                    {c.label}
                  </Link>
                ) : (
                  <span>{c.label}</span>
                )}
                {i < crumbs.length - 1 && (
                  <CaretRight weight="bold" className="text-border-strong" size={11} />
                )}
              </span>
            ))}
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start gap-4 mb-4"
        >
          <span
            className={cn(
              "font-display italic font-black text-[12px] px-2.5 py-1.5 mt-2",
              tagVariants[tagVariant]
            )}
          >
            {tagNumber}
          </span>
          <h1 className="font-display italic font-black uppercase text-[64px] md:text-[76px] leading-[0.9] tracking-[-0.02em] text-navy">
            {title}
          </h1>
        </motion.div>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="text-[15px] text-fg-soft max-w-[600px] leading-[1.55]"
          >
            {subtitle}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </header>
  );
}
