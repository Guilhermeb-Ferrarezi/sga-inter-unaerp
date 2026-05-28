import { cn } from "@/lib/utils";

type Status = "ongoing" | "scheduled" | "live" | "done" | "draft" | "finished";

const styles: Record<Status, string> = {
  ongoing: "bg-lime text-navy",
  scheduled: "bg-blue text-white",
  live: "bg-lime text-navy",
  done: "bg-teal text-white",
  draft: "bg-fg-mute text-white",
  finished: "bg-navy text-white",
};

const labels: Record<Status, string> = {
  ongoing: "Em andamento",
  scheduled: "Agendada",
  live: "Ao vivo",
  done: "Encerrada",
  draft: "Rascunho",
  finished: "Finalizada",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex font-display italic font-black text-[10px] uppercase tracking-[0.1em] px-2 py-0.5",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
}
