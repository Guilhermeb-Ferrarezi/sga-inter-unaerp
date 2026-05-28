import { Bell, MagnifyingGlass, User } from "@phosphor-icons/react";

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function AdminTopbar({ title, subtitle, actions }: AdminTopbarProps) {
  return (
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
        <div className="hidden lg:flex items-center gap-2 bg-surface-3 border border-border px-3 py-2 min-w-[260px]">
          <MagnifyingGlass weight="bold" size={14} className="text-fg-mute" />
          <input
            placeholder="Buscar..."
            className="bg-transparent text-[13px] outline-none placeholder:text-fg-mute flex-1"
          />
        </div>
        <button className="w-10 h-10 bg-surface-3 border border-border flex items-center justify-center hover:bg-white relative">
          <Bell weight="bold" size={16} className="text-navy" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-lime rounded-full" />
        </button>
        <div className="flex items-center gap-2.5 bg-surface-3 border border-border pl-3 pr-2 py-2">
          <div className="w-7 h-7 bg-navy text-white flex items-center justify-center font-display italic font-black text-[12px]">
            G
          </div>
          <div className="font-display italic font-extrabold text-[13px] uppercase text-navy">
            guilherme
          </div>
          <User weight="bold" size={14} className="text-fg-mute" />
        </div>
        {actions}
      </div>
    </div>
  );
}
