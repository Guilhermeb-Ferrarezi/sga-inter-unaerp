import { cn } from "@/lib/utils";

interface SectionProps {
  alt?: boolean;
  decoNum?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ alt, decoNum, children, className }: SectionProps) {
  return (
    <section
      className={cn(
        "relative py-14 px-7 border-b border-border",
        alt && "bg-surface-3",
        className
      )}
    >
      {decoNum && (
        <div
          aria-hidden
          className="hidden md:block absolute top-9 right-15 font-display italic font-black text-[200px] leading-none text-navy/[0.035] pointer-events-none select-none"
        >
          {decoNum}
        </div>
      )}
      <div className="relative max-w-[1500px] mx-auto">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  number: string;
  variant?: "blue" | "teal" | "lime" | "navy";
  title: React.ReactNode;
  link?: { to: string; label: string } | { href: string; label: string };
}

const tagVariants = {
  blue: "bg-blue text-white [box-shadow:3px_3px_0_#0A1A3D]",
  teal: "bg-teal text-white [box-shadow:3px_3px_0_#0A1A3D]",
  lime: "bg-lime text-navy [box-shadow:3px_3px_0_#2EAA80]",
  navy: "bg-navy text-white [box-shadow:3px_3px_0_#A4CD3A]",
};

export function SectionHeader({
  number,
  variant = "blue",
  title,
  link,
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-6 mb-8">
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "font-display italic font-black text-[12px] px-2.5 py-1.5 mt-2",
            tagVariants[variant]
          )}
        >
          {number}
        </span>
        <h2 className="font-display italic font-black uppercase text-[40px] md:text-[50px] leading-[0.9] tracking-[-0.015em] text-navy">
          {title}
        </h2>
      </div>
      {link && (
        <a
          {...(("to" in link)
            ? { href: link.to }
            : { href: link.href })}
          className="text-blue text-[11.5px] font-extrabold uppercase tracking-[0.12em] whitespace-nowrap pb-1.5 hover:text-navy hover:border-b-2 hover:border-blue"
        >
          {link.label}
        </a>
      )}
    </div>
  );
}
