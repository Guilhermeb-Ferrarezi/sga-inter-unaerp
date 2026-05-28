import { gql, useQuery } from "@apollo/client";
import { useEditionTeams } from "./use-edition";
import type { Match, Team } from "@/data/types";

const MATCHES_QUERY = gql`
  query Matches($editionId: UUID!) {
    matches(editionId: $editionId) {
      id
      round
      status
      scheduledAt
      teamA {
        id
        team {
          id
          name
          slug
          primaryColor
        }
      }
      teamB {
        id
        team {
          id
          name
          slug
          primaryColor
        }
      }
      result {
        id
        map
        scoreA
        scoreB
        playedAt
        winner {
          id
          team {
            slug
          }
        }
      }
    }
  }
`;

type GqlMatchTeam = {
  id: string;
  team: { id: string; name: string; slug: string; primaryColor?: string | null };
};
type GqlMatch = {
  id: string;
  round: string;
  status: string;
  scheduledAt?: string | null;
  teamA: GqlMatchTeam;
  teamB: GqlMatchTeam;
  result?: {
    id: string;
    map?: string | null;
    scoreA: number;
    scoreB: number;
    playedAt: string;
    winner: { id: string; team: { slug: string } };
  } | null;
};

const groupHeuristic = (round: string): Match["group"] => {
  if (/grupo\s*a/i.test(round)) return "A";
  if (/grupo\s*b/i.test(round)) return "B";
  if (/grupo\s*c/i.test(round)) return "C";
  if (/quart/i.test(round)) return "Quartas";
  if (/semi/i.test(round)) return "Semi";
  if (/final/i.test(round)) return "Final";
  return "A";
};

function adaptMatch(m: GqlMatch): Match {
  const status: Match["status"] =
    m.status === "live" ? "live" : m.status === "done" ? "done" : "scheduled";

  return {
    id: m.id,
    teamA: m.teamA.team.slug,
    teamB: m.teamB.team.slug,
    scheduledAt: m.scheduledAt ?? new Date().toISOString(),
    status,
    round: m.round,
    group: groupHeuristic(m.round),
    result: m.result
      ? {
          winnerSlug: m.result.winner.team.slug,
          scoreA: m.result.scoreA,
          scoreB: m.result.scoreB,
          map: m.result.map ?? "",
          playedAt: m.result.playedAt,
        }
      : undefined,
  };
}

interface UseEditionMatchesResult {
  matches: Match[];
  teams: Team[];
  loading: boolean;
  error: boolean;
}

/**
 * Carrega partidas + times da edição ativa.
 * Times vêm pra que cards de partida possam resolver shortName/color.
 */
export function useEditionMatches(gameSlug: string = "valorant"): UseEditionMatchesResult {
  const editionData = useEditionTeams(gameSlug);
  const { data, loading, error } = useQuery<{ matches: GqlMatch[] }>(MATCHES_QUERY, {
    variables: { editionId: editionData.edition?.id },
    skip: !editionData.edition?.id,
    errorPolicy: "all",
  });

  return {
    matches: (data?.matches ?? []).map(adaptMatch),
    teams: editionData.teams,
    loading: editionData.loading || loading,
    error: editionData.error || !!error,
  };
}
