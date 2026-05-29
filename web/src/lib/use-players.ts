import { gql, useQuery } from "@apollo/client";
import { useEditionTeams } from "./use-edition";
import type { Player } from "@/data/types";

const ROSTER_QUERY = gql`
  query Roster($editionTeamId: UUID!) {
    teams(editionId: "") {
      id
    }
  }
`;

const PLAYER_QUERY = gql`
  query Player($id: UUID!) {
    player(id: $id) {
      id
      sgaUserId
      ign
      avatarUrl
      role
    }
  }
`;

type GqlPlayer = {
  id: string;
  sgaUserId?: number | null;
  ign: string;
  avatarUrl?: string | null;
  role?: string | null;
};

function adaptPlayer(p: GqlPlayer, teamSlug = "—"): Player {
  return {
    id: p.id,
    ign: p.ign,
    teamSlug,
    role: (p.role as Player["role"]) ?? "Flex",
    isCaptain: false,
    isIgl: false,
    stats: { kd: 0, frags: 0, acs: 0, hsPercent: 0, firstBloods: 0 },
  };
}

/**
 * Player ranking — placeholder usando os times atuais.
 * Enquanto a API não tem stats consolidadas, retorna lista vazia (UI mostra empty state).
 */
export function useEditionPlayers(_gameSlug: string = "valorant") {
  const { loading, error } = useEditionTeams(_gameSlug);
  return {
    players: [] as Player[],
    loading,
    error,
  };
}

export function usePlayer(id: string) {
  const { data, loading, error } = useQuery<{ player: GqlPlayer | null }>(PLAYER_QUERY, {
    variables: { id },
    skip: !id,
    errorPolicy: "all",
  });

  return {
    player: data?.player ? adaptPlayer(data.player) : null,
    loading,
    error: !!error,
  };
}

// suprime linter sobre query não usada (será usada quando schema tiver roster)
void ROSTER_QUERY;
