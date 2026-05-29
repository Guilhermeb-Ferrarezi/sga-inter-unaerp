import { gql, useQuery } from "@apollo/client";
import { useEditionTeams } from "./use-edition";
import type { Highlight } from "@/data/types";

const HIGHLIGHTS_QUERY = gql`
  query Highlights($editionId: UUID!) {
    highlights(editionId: $editionId) {
      id
      cfStreamId
      title
      thumbnailUrl
      publishedAt
    }
  }
`;

const GALLERY_QUERY = gql`
  query Gallery($editionId: UUID!) {
    gallery(editionId: $editionId) {
      id
      r2Key
      url
      caption
      type
    }
  }
`;

type GqlHighlight = {
  id: string;
  cfStreamId: string;
  title: string;
  thumbnailUrl?: string | null;
  publishedAt: string;
};

type GqlMedia = {
  id: string;
  r2Key: string;
  url: string;
  caption?: string | null;
  type: string;
};

function adaptHighlight(h: GqlHighlight, idx: number): Highlight {
  const daysAgo = Math.floor(
    (Date.now() - new Date(h.publishedAt).getTime()) / 86400000
  );
  return {
    id: h.id,
    title: h.title,
    category: idx % 3 === 0 ? "Ace" : idx % 3 === 1 ? "Clutch" : "Play",
    durationSeconds: 30,
    views: 0,
    publishedDaysAgo: Math.max(0, daysAgo),
    thumbVariant: (((idx % 8) + 1) as Highlight["thumbVariant"]),
  };
}

export function useEditionHighlights(gameSlug: string = "valorant") {
  const editionData = useEditionTeams(gameSlug);
  const { data, loading, error } = useQuery<{ highlights: GqlHighlight[] }>(HIGHLIGHTS_QUERY, {
    variables: { editionId: editionData.edition?.id },
    skip: !editionData.edition?.id,
    errorPolicy: "all",
  });

  return {
    highlights: (data?.highlights ?? []).map(adaptHighlight),
    loading: editionData.loading || loading,
    error: editionData.error || !!error,
  };
}

export function useEditionGallery(gameSlug: string = "valorant") {
  const editionData = useEditionTeams(gameSlug);
  const { data, loading, error } = useQuery<{ gallery: GqlMedia[] }>(GALLERY_QUERY, {
    variables: { editionId: editionData.edition?.id },
    skip: !editionData.edition?.id,
    errorPolicy: "all",
  });

  return {
    photos: data?.gallery ?? [],
    loading: editionData.loading || loading,
    error: editionData.error || !!error,
  };
}
