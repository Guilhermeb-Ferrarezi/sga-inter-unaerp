import { useQuery, gql } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { CloudSlash } from "@phosphor-icons/react";

const PING_GAMES = gql`
  query PingGames {
    games {
      id
      slug
    }
  }
`;

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
          <div className="max-w-[1500px] mx-auto px-7 py-2.5 flex items-center gap-3 text-[12px] text-navy">
            <CloudSlash weight="fill" size={16} />
            <span className="font-display italic font-extrabold uppercase tracking-[0.06em]">
              API offline
            </span>
            <span className="font-semibold hidden md:inline">
              · Não foi possível conectar ao backend. Tentando reconectar…
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
