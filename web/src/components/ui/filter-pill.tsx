import { cn } from "@/lib/utils";

interface FilterPillProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function FilterPill({ children, active, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "font-display italic font-extrabold text-[11px] uppercase tracking-[0.08em] px-3.5 py-2 border-[1.5px] transition-all",
        active
          ? "bg-navy text-white border-navy [box-shadow:3px_3px_0_#A4CD3A]"
          : "bg-white text-fg-soft border-border-strong hover:text-navy hover:border-navy"
      )}
    >
      {children}
    </button>
  );
}
