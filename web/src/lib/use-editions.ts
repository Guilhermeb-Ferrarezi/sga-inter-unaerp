import { gql, useQuery } from "@apollo/client";
import type { Edition } from "@/data/types";

const EDITIONS_QUERY = gql`
  query Editions($gameSlug: String!) {
    editions(gameSlug: $gameSlug) {
      id
      year
      name
      status
      startedAt
      endedAt
      game {
        slug
      }
    }
  }
`;

type GqlEdition = {
  id: string;
  year: number;
  name: string;
  status: string;
  startedAt?: string | null;
  endedAt?: string | null;
  game: { slug: string };
};

function adaptEdition(e: GqlEdition): Edition {
  const status: Edition["status"] =
    e.status === "ongoing"
      ? "ongoing"
      : e.status === "finished"
      ? "finished"
      : "draft";

  return {
    year: e.year,
    game: e.game.slug as Edition["game"],
    name: e.name,
    status,
    teamsCount: 0,
    matchesCount: 0,
    photosCount: 0,
  };
}

export function useEditions(gameSlug: string = "valorant") {
  const { data, loading, error } = useQuery<{ editions: GqlEdition[] }>(EDITIONS_QUERY, {
    variables: { gameSlug },
    errorPolicy: "all",
  });

  return {
    editions: (data?.editions ?? []).map(adaptEdition),
    loading,
    error: !!error,
  };
}
