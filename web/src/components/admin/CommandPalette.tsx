import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlass,
  UsersThree,
  GameController,
  Sword,
  Trophy,
  VideoCamera,
  ImageSquare,
  UploadSimple,
  ChartLineUp,
  ArrowBendUpRight,
} from "@phosphor-icons/react";
import { useEditionTeams } from "@/lib/use-edition";
import { useEditionMatches } from "@/lib/use-matches";
import { cn } from "@/lib/utils";

type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  icon: typeof Sword;
  to: string;
  params?: Record<string, string>;
  category: "Páginas" | "Times" | "Partidas";
};

const adminPages: CommandItem[] = [
  { id: "p-dash", label: "Dashboard", icon: ChartLineUp, to: "/admin", category: "Páginas" },
  { id: "p-ed", label: "Edições", icon: Trophy, to: "/admin/edicoes", category: "Páginas" },
  { id: "p-t", label: "Times", icon: UsersThree, to: "/admin/times", category: "Páginas" },
  { id: "p-pl", label: "Jogadores", icon: GameController, to: "/admin/jogadores", category: "Páginas" },
  { id: "p-m", label: "Confrontos", icon: Sword, to: "/admin/confrontos", category: "Páginas" },
  { id: "p-md", label: "Mídia (R2)", icon: ImageSquare, to: "/admin/midia", category: "Páginas" },
  { id: "p-hl", label: "Highlights", icon: VideoCamera, to: "/admin/highlights", category: "Páginas" },
  { id: "p-imp", label: "Importar edição", icon: UploadSimple, to: "/admin/importar", category: "Páginas" },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { teams } = useEditionTeams("valorant");
  const { matches } = useEditionMatches("valorant");

  const items = useMemo<CommandItem[]>(() => {
    const teamItems: CommandItem[] = teams.map((t) => ({
      id: `t-${t.id}`,
      label: t.name,
      hint: `@${t.slug} · Grupo ${t.group} · ${t.wins}V ${t.losses}D`,
      icon: UsersThree,
      to: "/times/$slug",
      params: { slug: t.slug },
      category: "Times",
    }));
    const matchItems: CommandItem[] = matches.map((m) => {
      const a = teams.find((t) => t.slug === m.teamA);
      const b = teams.find((t) => t.slug === m.teamB);
      return {
        id: `m-${m.id}`,
        label: `${a?.name ?? "?"} vs ${b?.name ?? "?"}`,
        hint: `${m.round} · ${m.status}`,
        icon: Sword,
        to: "/confrontos/$id",
        params: { id: m.id },
        category: "Partidas",
      };
    });
    return [...adminPages, ...teamItems, ...matchItems];
  }, [teams, matches]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items.slice(0, 12);
    const q = query.toLowerCase();
    return items
      .filter(
        (it) =>
          it.label.toLowerCase().includes(q) ||
          it.hint?.toLowerCase().includes(q)
      )
      .slice(0, 20);
  }, [items, query]);

  const grouped = useMemo(() => {
    const groups = new Map<CommandItem["category"], CommandItem[]>();
    for (const it of filtered) {
      if (!groups.has(it.category)) groups.set(it.category, []);
      groups.get(it.category)!.push(it);
    }
    return Array.from(groups.entries());
  }, [filtered]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[selectedIdx];
        if (item) {
          navigate({
            to: item.to as never,
            params: item.params as never,
          });
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, selectedIdx, navigate, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[200] bg-navy/40 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white border-[1.5px] border-navy shadow-brutal-lg w-full max-w-2xl overflow-hidden"
          >
            {/* search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b-2 border-navy">
              <MagnifyingGlass weight="bold" size={20} className="text-navy" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIdx(0);
                }}
                placeholder="Buscar time, jogador, partida ou página..."
                className="bg-transparent text-[15px] outline-none flex-1 placeholder:text-fg-mute"
              />
              <kbd className="bg-surface-3 border border-border-strong px-2 py-0.5 text-[10.5px] font-display italic font-extrabold uppercase text-fg-mute">
                ESC
              </kbd>
            </div>

            {/* results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {grouped.length === 0 && (
                <div className="py-12 text-center text-fg-mute font-display italic font-extrabold uppercase">
                  Nenhum resultado para "{query}"
                </div>
              )}
              {grouped.map(([category, list]) => (
                <div key={category}>
                  <div className="px-5 pt-4 pb-2 text-[10px] text-fg-mute font-extrabold uppercase tracking-[0.16em] sticky top-0 bg-white border-b border-border">
                    {category} · {list.length}
                  </div>
                  {list.map((item) => {
                    const globalIdx = filtered.indexOf(item);
                    const selected = globalIdx === selectedIdx;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setSelectedIdx(globalIdx)}
                        onClick={() => {
                          navigate({
                            to: item.to as never,
                            params: item.params as never,
                          });
                          onClose();
                        }}
                        className={cn(
                          "w-full px-5 py-3 flex items-center gap-3.5 text-left transition-colors",
                          selected ? "bg-lime" : "hover:bg-surface-3"
                        )}
                      >
                        <Icon
                          weight={selected ? "fill" : "bold"}
                          size={18}
                          className={selected ? "text-navy" : "text-blue"}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-display italic font-extrabold text-[15px] uppercase text-navy truncate">
                            {item.label}
                          </div>
                          {item.hint && (
                            <div className="text-[11.5px] text-fg-soft truncate">
                              {item.hint}
                            </div>
                          )}
                        </div>
                        {selected && (
                          <ArrowBendUpRight
                            weight="bold"
                            size={14}
                            className="text-navy"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* footer */}
            <div className="px-5 py-2.5 border-t border-border bg-surface-3 flex items-center justify-between text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.08em]">
              <div className="flex gap-3">
                <span>
                  <kbd className="bg-white border border-border-strong px-1.5 py-0.5">↑↓</kbd>{" "}
                  navegar
                </span>
                <span>
                  <kbd className="bg-white border border-border-strong px-1.5 py-0.5">↵</kbd>{" "}
                  abrir
                </span>
              </div>
              <span>{filtered.length} resultados</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook que escuta Cmd/Ctrl+K e abre o palette.
 */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isModK =
        (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      const slash = e.key === "/" && !isInputFocused();
      if (isModK || slash) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return { open, setOpen };
}

function isInputFocused() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return tag === "input" || tag === "textarea" || (el as HTMLElement).isContentEditable;
}
