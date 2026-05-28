export type Team = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  color: string;
  group: "A" | "B" | "C";
  wins: number;
  losses: number;
  pointsDiff: number;
  points: number;
  rosterIds: string[];
  captainIgn: string;
};

export type Player = {
  id: string;
  ign: string;
  teamSlug: string;
  role: "Duelist" | "Initiator" | "Controller" | "Sentinel" | "Flex";
  isCaptain: boolean;
  isIgl: boolean;
  stats: {
    kd: number;
    frags: number;
    acs: number;
    hsPercent: number;
    firstBloods: number;
  };
};

export type MatchStatus = "scheduled" | "live" | "done";

export type Match = {
  id: string;
  teamA: string;
  teamB: string;
  scheduledAt: string;
  status: MatchStatus;
  round: string;
  group: "A" | "B" | "C" | "Quartas" | "Semi" | "Final";
  result?: {
    winnerSlug: string;
    scoreA: number;
    scoreB: number;
    map: string;
    playedAt: string;
  };
};

export type Highlight = {
  id: string;
  title: string;
  category: "Ace" | "Clutch" | "Play" | "Recap";
  matchId?: string;
  teamSlug?: string;
  playerIgn?: string;
  map?: string;
  durationSeconds: number;
  views: number;
  publishedDaysAgo: number;
  thumbVariant: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
};

export type Edition = {
  year: number;
  game: "valorant" | "cs2" | "lol" | "fifa";
  name: string;
  status: "ongoing" | "finished" | "draft";
  champion?: string;
  mvp?: string;
  teamsCount: number;
  matchesCount: number;
  photosCount: number;
};
