import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface-3 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.4s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent",
        className
      )}
      {...props}
    />
  );
}

// MATCH CARD SKELETON
export function MatchCardSkeleton() {
  return (
    <div className="bg-white border-[1.5px] border-border p-4 mb-3 grid grid-cols-[90px_1fr_90px] gap-5 items-center">
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-3 w-6" />
        <div className="flex items-center gap-2.5 flex-row-reverse">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}

// TEAM CARD SKELETON
export function TeamCardSkeleton() {
  return (
    <div className="bg-white border-[1.5px] border-border-strong p-7 shadow-brutal">
      <div className="flex items-center gap-4.5 mb-5.5">
        <Skeleton className="w-[72px] h-[72px]" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-16 mt-2" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 py-4 border-y border-border mb-4.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center space-y-2">
            <Skeleton className="h-7 w-8 mx-auto" />
            <Skeleton className="h-2.5 w-8 mx-auto" />
          </div>
        ))}
      </div>
      <Skeleton className="h-3 w-20 mb-2.5" />
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-12" />
        ))}
      </div>
    </div>
  );
}

// STANDINGS SKELETON
export function StandingsTableSkeleton({ rows = 9 }: { rows?: number }) {
  return (
    <div className="bg-white border-[1.5px] border-border-strong shadow-brutal">
      <div className="bg-navy h-11" />
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[50px_1fr_60px_60px_60px_60px_70px] px-5.5 py-3.5 border-b border-border last:border-b-0 items-center gap-2"
        >
          <Skeleton className="h-5 w-5 mx-auto" />
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8" />
            <Skeleton className="h-4 w-24" />
          </div>
          {Array.from({ length: 5 }).map((_, j) => (
            <Skeleton key={j} className="h-5 w-8 mx-auto" />
          ))}
        </div>
      ))}
    </div>
  );
}

// HIGHLIGHT CARD SKELETON
export function HighlightCardSkeleton() {
  return (
    <div className="bg-white border-[1.5px] border-border overflow-hidden">
      <Skeleton className="aspect-[16/10]" />
      <div className="p-3.5 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-2.5 w-1/2" />
      </div>
    </div>
  );
}

// PODIUM SKELETON
export function PodiumSkeleton() {
  return (
    <div className="grid grid-cols-[1fr_1.2fr_1fr] gap-5 items-end mt-8 mb-12">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-white border-[1.5px] border-border-strong p-7 text-center shadow-brutal-lg",
            i === 1 && "translate-y-[-12px]"
          )}
        >
          <Skeleton className="w-[100px] h-[100px] mx-auto mb-3.5" />
          <Skeleton className="h-7 w-20 mx-auto mb-2" />
          <Skeleton className="h-3 w-28 mx-auto mb-4.5" />
          <Skeleton className="h-12 w-24 mx-auto mb-2" />
          <Skeleton className="h-2.5 w-20 mx-auto" />
        </div>
      ))}
    </div>
  );
}

// HERO SKELETON
export function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden bg-bg border-b border-border">
      <div className="relative max-w-[1500px] mx-auto px-7 py-[72px] grid lg:grid-cols-[1.2fr_1fr] gap-14 items-center">
        <div className="space-y-5">
          <Skeleton className="h-7 w-72" />
          <div className="space-y-2">
            <Skeleton className="h-20 w-3/4" />
            <Skeleton className="h-20 w-1/2" />
            <Skeleton className="h-16 w-32" />
          </div>
          <Skeleton className="h-12 w-full max-w-md" />
          <div className="flex gap-3">
            <Skeleton className="h-12 w-44" />
            <Skeleton className="h-12 w-36" />
          </div>
        </div>
        <Skeleton className="aspect-[4/5]" />
      </div>
    </section>
  );
}
