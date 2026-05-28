import { motion } from "framer-motion";
import { Check, ArrowDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type Step = {
  label: string;
  date: string;
  state: "done" | "current" | "upcoming";
};

const steps: Step[] = [
  { label: "Sorteio", date: "28 Mai", state: "done" },
  { label: "Rodada 1", date: "04 Jun", state: "done" },
  { label: "Fase de Grupos", date: "12/24 jogadas", state: "current" },
  { label: "Quartas", date: "22 Jun", state: "upcoming" },
  { label: "Semi", date: "25 Jun", state: "upcoming" },
  { label: "Final", date: "28 Jun", state: "upcoming" },
];

export function BracketProgress() {
  return (
    <div className="bg-white border-[1.5px] border-border-strong shadow-brutal">
      <div className="grid grid-cols-6">
        {steps.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className={cn(
              "py-5.5 px-4.5 text-center relative",
              i < steps.length - 1 && "border-r border-border",
              s.state === "done" && "bg-teal/[0.08]",
              s.state === "current" && "bg-lime text-navy"
            )}
          >
            {s.state === "done" && (
              <Check
                weight="bold"
                size={14}
                className="absolute top-2 right-2.5 text-teal"
              />
            )}
            {s.state === "current" && (
              <ArrowDown
                weight="fill"
                size={12}
                className="absolute top-2 right-2.5 text-navy"
              />
            )}
            <div
              className={cn(
                "font-display italic font-black uppercase text-[18px] leading-none",
                s.state === "done" ? "text-teal" : "text-navy"
              )}
            >
              {s.label}
            </div>
            <div
              className={cn(
                "text-[11px] mt-2 font-bold uppercase tracking-[0.08em]",
                s.state === "current" ? "text-navy/70 font-extrabold" : "text-fg-soft"
              )}
            >
              {s.date}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
