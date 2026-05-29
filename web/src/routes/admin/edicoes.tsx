import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plus, Trophy } from "@phosphor-icons/react";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { useEditions } from "@/lib/use-editions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/edicoes")({
  component: AdminEditionsPage,
});

function AdminEditionsPage() {
  const { editions, loading } = useEditions("valorant");

  return (
    <>
      <AdminTopbar
        title="Edições"
        subtitle={`${editions.length} edições cadastradas no sistema`}
        actions={
          <Button disabled>
            <Plus weight="bold" size={14} />
            Nova edição
          </Button>
        }
      />

      <div className="p-9">
        {loading ? (
          <div className="text-center py-16 text-fg-mute font-display italic font-extrabold uppercase">
            Carregando edições…
          </div>
        ) : editions.length === 0 ? (
          <div className="bg-white border-[1.5px] border-border-strong p-9 text-center text-fg-mute font-display italic font-extrabold uppercase">
            Nenhuma edição cadastrada.
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {editions.map((e, i) => {
          const champ = null as { name: string } | null;
          return (
            <motion.div
              key={e.year}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={cn(
                "bg-white border-[1.5px] border-border-strong p-6 shadow-brutal-sm",
                e.status === "ongoing" && "border-l-4 border-l-lime"
              )}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <StatusBadge status={e.status} />
                    <span className="text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.1em]">
                      {e.game}
                    </span>
                  </div>
                  <div className="font-display italic font-black text-[40px] leading-none text-navy">
                    {e.name}
                  </div>
                </div>
                <div className="font-display italic font-black text-[56px] text-lime leading-none">
                  {e.year}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 py-4 border-y border-border my-4">
                <Stat label="Times" value={e.teamsCount} />
                <Stat label="Partidas" value={e.matchesCount} />
                <Stat label="Fotos" value={e.photosCount} />
              </div>

              {champ && (
                <div className="flex items-center gap-2.5 text-[13px] text-fg-soft">
                  <Trophy weight="fill" size={14} className="text-lime" />
                  Campeão:{" "}
                  <strong className="font-display italic font-black text-navy uppercase text-[15px]">
                    {champ.name}
                  </strong>
                  {e.mvp && (
                    <>
                      <span className="text-fg-mute">·</span>
                      <span>
                        MVP:{" "}
                        <strong className="text-blue font-display italic font-black">
                          {e.mvp}
                        </strong>
                      </span>
                    </>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-5 pt-4 border-t border-border">
                <Button size="sm" variant="blue">
                  Gerenciar
                </Button>
                <Button size="sm" variant="ghost">
                  Ver no site
                </Button>
              </div>
            </motion.div>
          );
        })}
        </div>
        )}
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="font-display italic font-black text-[24px] text-navy leading-none tabular-nums">
        {value}
      </div>
      <div className="text-[10px] text-fg-mute font-extrabold uppercase tracking-[0.1em] mt-1">
        {label}
      </div>
    </div>
  );
}
