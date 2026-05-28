import { cn } from "@/lib/utils";

interface LiveDotProps {
  variant?: "lime" | "teal" | "blue";
  className?: string;
}

const variants = {
  lime: "bg-lime [box-shadow:0_0_0_4px_rgba(164,205,58,0.35)]",
  teal: "bg-teal [box-shadow:0_0_0_4px_rgba(46,170,128,0.2)]",
  blue: "bg-blue [box-shadow:0_0_0_4px_rgba(0,115,183,0.2)]",
};

export function LiveDot({ variant = "lime", className }: LiveDotProps) {
  return (
    <span
      className={cn(
        "inline-block w-2 h-2 rounded-full animate-pulse-dot",
        variants[variant],
        className
      )}
    />
  );
}
