import { gql, useQuery } from "@apollo/client";
import { teams as mockTeams } from "@/data/mock";
import { editionToMockTeams, type GqlEdition } from "@/data/adapters";
import type { Team } from "@/data/types";

const ACTIVE_EDITION_QUERY = gql`
  query ActiveEdition($gameSlug: String!) {
    activeEdition(gameSlug: $gameSlug) {
      id
      year
      name
      status
      startedAt
      endedAt
      teams {
        id
        wins
        losses
        finalPlacement
        team {
          id
          name
          slug
          primaryColor
          logoUrl
        }
      }
    }
  }
`;

interface UseEditionTeamsResult {
  teams: Team[];
  loading: boolean;
  usingFallback: boolean;
  edition: GqlEdition | null;
}

/**
 * Carrega edição ativa + times via GraphQL.
 * Em caso de erro de rede ou API offline, retorna times do mock.
 */
export function useEditionTeams(
  gameSlug: string = "valorant"
): UseEditionTeamsResult {
  const { data, loading, error } = useQuery<{
    activeEdition: GqlEdition | null;
  }>(ACTIVE_EDITION_QUERY, {
    variables: { gameSlug },
    errorPolicy: "all",
  });

  if (loading && !data) {
    return { teams: [], loading: true, usingFallback: false, edition: null };
  }

  if (error || !data?.activeEdition) {
    return {
      teams: mockTeams,
      loading: false,
      usingFallback: true,
      edition: null,
    };
  }

  const edition = data.activeEdition;
  const teams = editionToMockTeams(edition);
  if (teams.length === 0) {
    // Edição sem times cadastrados — usar mock pra UI não ficar vazia
    return { teams: mockTeams, loading: false, usingFallback: true, edition };
  }
  return { teams, loading: false, usingFallback: false, edition };
}
