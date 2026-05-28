import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "@phosphor-icons/react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Mudar para tema claro" : "Mudar para tema escuro"}
      className={cn(
        "relative w-10 h-10 flex items-center justify-center bg-surface-3 border border-border-strong hover:bg-white dark:hover:bg-surface-2 transition-colors overflow-hidden",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "moon" : "sun"}
          initial={{ y: -16, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 16, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {dark ? (
            <Moon weight="fill" size={16} className="text-lime" />
          ) : (
            <Sun weight="fill" size={16} className="text-blue" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
