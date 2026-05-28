import { useQuery, gql } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { CloudSlash, Database } from "@phosphor-icons/react";

const PING_GAMES = gql`
  query PingGames {
    games {
      id
      slug
    }
  }
`;

/**
 * Banner discreto que aparece só quando a API GraphQL está inacessível.
 *
 * Quando a API estiver online, fica invisível.
 * Quando estiver offline, mostra um aviso amarelo no topo informando que
 * o site está mostrando dados de demonstração (mock).
 */
export function ApiStatusBanner() {
  const { error, loading } = useQuery(PING_GAMES, {
    pollInterval: 60_000,
    errorPolicy: "all",
    fetchPolicy: "no-cache",
  });

  const offline = !!error && !loading;

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#F5B700] border-b-2 border-navy overflow-hidden"
        >
          <div className="max-w-[1500px] mx-auto px-7 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-[12px] text-navy">
              <CloudSlash weight="fill" size={16} />
              <span className="font-display italic font-extrabold uppercase tracking-[0.06em]">
                Modo demo
              </span>
              <span className="font-semibold hidden md:inline">
                · A API GraphQL está fora do ar. Mostrando dados de demonstração.
              </span>
            </div>
            <span className="text-[10.5px] text-navy/70 font-extrabold uppercase tracking-[0.1em] hidden md:inline-flex items-center gap-1.5">
              <Database weight="bold" size={11} />
              Mock data
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
