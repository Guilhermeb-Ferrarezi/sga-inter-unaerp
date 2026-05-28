import { gql, useQuery } from "@apollo/client";
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
  error: boolean;
  edition: GqlEdition | null;
}

/**
 * Carrega edição ativa + times via GraphQL.
 * Retorna estado real (loading/error) — sem fallback mock.
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

  const edition = data?.activeEdition ?? null;
  const teams = edition ? editionToMockTeams(edition) : [];

  return {
    teams,
    loading,
    error: !!error,
    edition,
  };
}
