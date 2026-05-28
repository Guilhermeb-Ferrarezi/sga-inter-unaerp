import type { Team } from "./types";

// ────────────────────────────────────────────────────────
// Shapes que a API GraphQL retorna
// ────────────────────────────────────────────────────────

export type GqlTeam = {
  id: string;
  name: string;
  slug: string;
  primaryColor?: string | null;
  logoUrl?: string | null;
};

export type GqlEditionTeam = {
  id: string;
  wins: number;
  losses: number;
  finalPlacement?: number | null;
  team: GqlTeam;
};

export type GqlEdition = {
  id: string;
  year: number;
  name: string;
  status: string;
  startedAt?: string | null;
  endedAt?: string | null;
  teams?: GqlEditionTeam[];
};

// ────────────────────────────────────────────────────────
// Adapters → shapes que os componentes existentes esperam
// ────────────────────────────────────────────────────────

const groupHeuristic = (idx: number): "A" | "B" | "C" => {
  const groups: ("A" | "B" | "C")[] = ["A", "B", "C"];
  return groups[idx % 3];
};

function shortNameOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (name.length >= 2) return name.slice(0, 2).toUpperCase();
  return name.toUpperCase();
}

export function editionTeamToMockTeam(et: GqlEditionTeam, idx: number): Team {
  const pointsDiff = (et.wins - et.losses) * 4; // heurística sem score detalhado
  return {
    id: et.id,
    slug: et.team.slug,
    name: et.team.name,
    shortName: shortNameOf(et.team.name),
    color: et.team.primaryColor ?? "#0073B7",
    group: groupHeuristic(idx),
    wins: et.wins,
    losses: et.losses,
    pointsDiff,
    points: et.wins * 3,
    rosterIds: [],
    captainIgn: "—",
  };
}

export function editionToMockTeams(edition: GqlEdition): Team[] {
  if (!edition.teams) return [];
  return edition.teams
    .slice()
    .sort((a, b) => b.wins - a.wins || a.losses - b.losses)
    .map((et, idx) => editionTeamToMockTeam(et, idx));
}
