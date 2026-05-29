import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "@phosphor-icons/react";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Button } from "@/components/ui/button";
import { useEditionPlayers } from "@/lib/use-players";

export const Route = createFileRoute("/admin/jogadores")({
  component: AdminPlayersPage,
});

function AdminPlayersPage() {
  const { players, loading } = useEditionPlayers("valorant");

  return (
    <>
      <AdminTopbar
        title="Jogadores"
        subtitle={`${players.length} jogadores cadastrados`}
        actions={
          <Button disabled>
            <Plus weight="bold" size={14} />
            Novo jogador
          </Button>
        }
      />

      <div className="p-9">
        {loading ? (
          <div className="text-center py-16 text-fg-mute font-display italic font-extrabold uppercase">
            Carregando jogadores…
          </div>
        ) : players.length === 0 ? (
          <div className="bg-white border-[1.5px] border-border-strong p-9 text-center">
            <div className="font-display italic font-black text-[28px] uppercase text-navy mb-3">
              Nenhum jogador cadastrado
            </div>
            <p className="text-fg-soft text-[14px] leading-relaxed max-w-md mx-auto">
              Cadastre os times primeiro e depois adicione jogadores aos rosters
              via API GraphQL (mutation <code className="text-blue">createPlayer</code>{" "}
              + <code className="text-blue">addPlayerToRoster</code>).
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
}
