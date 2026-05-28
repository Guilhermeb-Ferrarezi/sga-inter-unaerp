import { useEffect, useRef, useState } from "react";
import { useQuery, gql } from "@apollo/client";

const GET_LIVE_MATCH = gql`
  query GetLiveMatch($id: UUID!) {
    match(id: $id) {
      id
      status
      result {
        scoreA
        scoreB
        map
      }
    }
  }
`;

type LiveSnapshot = {
  scoreA: number;
  scoreB: number;
  map: string | null;
  status: "scheduled" | "live" | "done";
};

/**
 * Polling do placar de uma partida ao vivo.
 *
 * - Quando a partida está `live`, refetcha a cada 10s
 * - Quando vira `done`, para o polling automaticamente
 * - Anima score updates marcando o lado que mudou
 *
 * Se a API estiver offline ou a query falhar, retorna o snapshot inicial
 * passado em `initial`.
 */
export function useLiveMatchPolling(
  matchId: string,
  initial: LiveSnapshot,
  options: { enabled?: boolean; intervalMs?: number } = {}
) {
  const { enabled = true, intervalMs = 10_000 } = options;
  const [snapshot, setSnapshot] = useState<LiveSnapshot>(initial);
  const [lastChanged, setLastChanged] = useState<"a" | "b" | null>(null);
  const previousRef = useRef<LiveSnapshot>(initial);

  const { data, error, startPolling, stopPolling } = useQuery(GET_LIVE_MATCH, {
    variables: { id: matchId },
    skip: !enabled,
    errorPolicy: "all",
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (!enabled || snapshot.status === "done") {
      stopPolling();
      return;
    }
    startPolling(intervalMs);
    return () => stopPolling();
  }, [enabled, snapshot.status, intervalMs, startPolling, stopPolling]);

  useEffect(() => {
    if (error || !data?.match) return;
    const m = data.match;
    const next: LiveSnapshot = {
      scoreA: m.result?.scoreA ?? snapshot.scoreA,
      scoreB: m.result?.scoreB ?? snapshot.scoreB,
      map: m.result?.map ?? snapshot.map,
      status: m.status,
    };

    const prev = previousRef.current;
    if (next.scoreA > prev.scoreA) setLastChanged("a");
    else if (next.scoreB > prev.scoreB) setLastChanged("b");
    if (next.scoreA !== prev.scoreA || next.scoreB !== prev.scoreB) {
      previousRef.current = next;
      const t = setTimeout(() => setLastChanged(null), 1_500);
      setSnapshot(next);
      return () => clearTimeout(t);
    }
    setSnapshot(next);
  }, [data, error, snapshot.scoreA, snapshot.scoreB, snapshot.map]);

  return { ...snapshot, lastChanged, offline: !!error };
}
