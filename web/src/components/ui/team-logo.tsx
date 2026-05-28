import { cn } from "@/lib/utils";

interface TeamLogoProps {
  shortName: string;
  color: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: "w-6 h-6 text-[9px]",
  sm: "w-8 h-8 text-[11px]",
  md: "w-11 h-11 text-[15px]",
  lg: "w-[72px] h-[72px] text-[24px] [box-shadow:4px_4px_0_#0A1A3D]",
  xl: "w-[120px] h-[120px] text-[40px] [box-shadow:6px_6px_0_#0A1A3D]",
};

export function TeamLogo({ shortName, color, size = "sm", className }: TeamLogoProps) {
  const needsDarkText = ["#A4CD3A", "#FACC15", "#FDE047"].includes(color.toUpperCase());
  return (
    <div
      className={cn(
        "flex items-center justify-center font-display italic font-black text-white shrink-0",
        sizeMap[size],
        needsDarkText && "text-navy",
        className
      )}
      style={{ background: color }}
    >
      {shortName}
    </div>
  );
}
