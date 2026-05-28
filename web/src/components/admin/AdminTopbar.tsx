import { Bell, MagnifyingGlass, User } from "@phosphor-icons/react";
import {
  CommandPalette,
  useCommandPalette,
} from "@/components/admin/CommandPalette";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth";

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AdminTopbar({ title, subtitle, actions }: AdminTopbarProps) {
  const { open, setOpen } = useCommandPalette();
  const { user } = useAuth();
  const displayName = user?.login ?? "guilherme";

  return (
    <>
      <div className="bg-white border-b border-border px-9 py-5 flex items-center justify-between gap-7 sticky top-0 z-30">
        <div>
          <h1 className="font-display italic font-black text-[34px] leading-none uppercase text-navy tracking-[-0.015em]">
            {title}
          </h1>
          {subtitle && (
            <div className="text-[12px] text-fg-soft mt-1.5 font-medium">
              {subtitle}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hidden lg:flex items-center gap-2 bg-surface-3 border border-border px-3 py-2 min-w-[300px] hover:bg-white hover:border-blue transition-colors text-left"
          >
            <MagnifyingGlass weight="bold" size={14} className="text-fg-mute" />
            <span className="text-[13px] text-fg-mute flex-1">
              Buscar time, jogador, partida...
            </span>
            <kbd className="bg-white border border-border-strong px-1.5 py-0.5 text-[10px] font-display italic font-extrabold uppercase text-fg-mute">
              ⌘K
            </kbd>
          </button>
          <ThemeToggle />
          <button className="w-10 h-10 bg-surface-3 border border-border flex items-center justify-center hover:bg-white relative">
            <Bell weight="bold" size={16} className="text-navy" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-lime rounded-full" />
          </button>
          <div className="flex items-center gap-2.5 bg-surface-3 border border-border pl-3 pr-2 py-2">
            <div className="w-7 h-7 bg-navy text-white flex items-center justify-center font-display italic font-black text-[12px]">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="font-display italic font-extrabold text-[13px] uppercase text-navy">
              {displayName}
            </div>
            <User weight="bold" size={14} className="text-fg-mute" />
          </div>
          {actions}
        </div>
      </div>
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </>
  );
}
