import type { Team, Player, Match, Highlight, Edition } from "./types";

export const teams: Team[] = [
  {
    id: "t1", slug: "olimpo", name: "Olimpo", shortName: "OP",
    color: "#0073B7", group: "A",
    wins: 4, losses: 0, pointsDiff: 22, points: 12,
    rosterIds: ["p1", "p2", "p3", "p4", "p5"], captainIgn: "g1lh",
  },
  {
    id: "t2", slug: "thunder", name: "Thunder", shortName: "TH",
    color: "#0A1A3D", group: "A",
    wins: 3, losses: 1, pointsDiff: 14, points: 9,
    rosterIds: ["p6", "p7", "p8", "p9", "p10"], captainIgn: "luK",
  },
  {
    id: "t3", slug: "dragon", name: "Dragon", shortName: "DR",
    color: "#2EAA80", group: "B",
    wins: 3, losses: 1, pointsDiff: 10, points: 9,
    rosterIds: ["p11", "p12", "p13", "p14", "p15"], captainIgn: "raf1",
  },
  {
    id: "t4", slug: "storm", name: "Storm", shortName: "ST",
    color: "#0E4D8C", group: "B",
    wins: 2, losses: 2, pointsDiff: 3, points: 6,
    rosterIds: ["p16", "p17", "p18", "p19", "p20"], captainIgn: "mtL",
  },
  {
    id: "t5", slug: "lynx", name: "Lynx", shortName: "LX",
    color: "#A4CD3A", group: "A",
    wins: 1, losses: 3, pointsDiff: -5, points: 3,
    rosterIds: ["p21", "p22", "p23", "p24", "p25"], captainIgn: "p3dro",
  },
  {
    id: "t6", slug: "nova", name: "Nova", shortName: "NV",
    color: "#EC4899", group: "C",
    wins: 1, losses: 3, pointsDiff: -8, points: 3,
    rosterIds: ["p26", "p27", "p28", "p29", "p30"], captainIgn: "nx",
  },
  {
    id: "t7", slug: "titan", name: "Titan", shortName: "TI",
    color: "#F97316", group: "C",
    wins: 1, losses: 3, pointsDiff: -10, points: 3,
    rosterIds: ["p31", "p32", "p33", "p34", "p35"], captainIgn: "titan",
  },
  {
    id: "t8", slug: "eclipse", name: "Eclipse", shortName: "EC",
    color: "#A855F7", group: "C",
    wins: 1, losses: 3, pointsDiff: -12, points: 3,
    rosterIds: ["p36", "p37", "p38", "p39", "p40"], captainIgn: "ec",
  },
  {
    id: "t9", slug: "fenix", name: "Fênix", shortName: "FC",
    color: "#0073B7", group: "B",
    wins: 0, losses: 4, pointsDiff: -24, points: 0,
    rosterIds: ["p41", "p42", "p43", "p44", "p45"], captainIgn: "fnx",
  },
];

export const players: Player[] = [
  // OLIMPO
  { id: "p1", ign: "g1lh", teamSlug: "olimpo", role: "Duelist", isCaptain: true, isIgl: true, stats: { kd: 1.87, frags: 142, acs: 312, hsPercent: 38, firstBloods: 24 } },
  { id: "p2", ign: "t4t", teamSlug: "olimpo", role: "Initiator", isCaptain: false, isIgl: false, stats: { kd: 1.28, frags: 85, acs: 256, hsPercent: 26, firstBloods: 12 } },
  { id: "p3", ign: "y0g4", teamSlug: "olimpo", role: "Controller", isCaptain: false, isIgl: false, stats: { kd: 1.04, frags: 62, acs: 218, hsPercent: 22, firstBloods: 8 } },
  { id: "p4", ign: "iz4", teamSlug: "olimpo", role: "Sentinel", isCaptain: false, isIgl: false, stats: { kd: 1.12, frags: 71, acs: 192, hsPercent: 24, firstBloods: 6 } },
  { id: "p5", ign: "scr", teamSlug: "olimpo", role: "Duelist", isCaptain: false, isIgl: false, stats: { kd: 1.34, frags: 88, acs: 241, hsPercent: 27, firstBloods: 14 } },
  // THUNDER
  { id: "p6", ign: "luK", teamSlug: "thunder", role: "Sentinel", isCaptain: true, isIgl: true, stats: { kd: 1.52, frags: 119, acs: 261, hsPercent: 31, firstBloods: 18 } },
  { id: "p7", ign: "v4ld", teamSlug: "thunder", role: "Duelist", isCaptain: false, isIgl: false, stats: { kd: 1.22, frags: 79, acs: 218, hsPercent: 25, firstBloods: 13 } },
  { id: "p8", ign: "k1n", teamSlug: "thunder", role: "Initiator", isCaptain: false, isIgl: false, stats: { kd: 1.08, frags: 64, acs: 198, hsPercent: 23, firstBloods: 9 } },
  { id: "p9", ign: "mz1", teamSlug: "thunder", role: "Controller", isCaptain: false, isIgl: false, stats: { kd: 0.94, frags: 54, acs: 178, hsPercent: 21, firstBloods: 6 } },
  { id: "p10", ign: "sh4", teamSlug: "thunder", role: "Sentinel", isCaptain: false, isIgl: false, stats: { kd: 0.88, frags: 49, acs: 168, hsPercent: 20, firstBloods: 4 } },
  // DRAGON
  { id: "p11", ign: "raf1", teamSlug: "dragon", role: "Initiator", isCaptain: true, isIgl: false, stats: { kd: 1.64, frags: 128, acs: 284, hsPercent: 34, firstBloods: 21 } },
  { id: "p12", ign: "b3k", teamSlug: "dragon", role: "Sentinel", isCaptain: false, isIgl: false, stats: { kd: 1.14, frags: 68, acs: 196, hsPercent: 22, firstBloods: 7 } },
  { id: "p13", ign: "n0r", teamSlug: "dragon", role: "Controller", isCaptain: false, isIgl: false, stats: { kd: 1.01, frags: 59, acs: 184, hsPercent: 21, firstBloods: 5 } },
  { id: "p14", ign: "gh4", teamSlug: "dragon", role: "Duelist", isCaptain: false, isIgl: false, stats: { kd: 1.21, frags: 77, acs: 211, hsPercent: 25, firstBloods: 11 } },
  { id: "p15", ign: "xy", teamSlug: "dragon", role: "Duelist", isCaptain: false, isIgl: false, stats: { kd: 0.92, frags: 51, acs: 174, hsPercent: 19, firstBloods: 6 } },
  // STORM
  { id: "p16", ign: "mtL", teamSlug: "storm", role: "Duelist", isCaptain: true, isIgl: true, stats: { kd: 1.38, frags: 96, acs: 224, hsPercent: 28, firstBloods: 15 } },
  { id: "p17", ign: "cfb", teamSlug: "storm", role: "Initiator", isCaptain: false, isIgl: false, stats: { kd: 1.02, frags: 58, acs: 182, hsPercent: 22, firstBloods: 8 } },
  { id: "p18", ign: "jh3", teamSlug: "storm", role: "Controller", isCaptain: false, isIgl: false, stats: { kd: 0.96, frags: 55, acs: 174, hsPercent: 21, firstBloods: 6 } },
  { id: "p19", ign: "vct", teamSlug: "storm", role: "Sentinel", isCaptain: false, isIgl: false, stats: { kd: 0.98, frags: 56, acs: 168, hsPercent: 20, firstBloods: 4 } },
  { id: "p20", ign: "rg2", teamSlug: "storm", role: "Duelist", isCaptain: false, isIgl: false, stats: { kd: 1.08, frags: 64, acs: 192, hsPercent: 23, firstBloods: 9 } },
  // LYNX
  { id: "p21", ign: "p3dro", teamSlug: "lynx", role: "Controller", isCaptain: true, isIgl: false, stats: { kd: 1.41, frags: 104, acs: 238, hsPercent: 29, firstBloods: 11 } },
  { id: "p22", ign: "l4n", teamSlug: "lynx", role: "Duelist", isCaptain: false, isIgl: false, stats: { kd: 1.18, frags: 72, acs: 209, hsPercent: 24, firstBloods: 12 } },
  { id: "p23", ign: "bx", teamSlug: "lynx", role: "Sentinel", isCaptain: false, isIgl: false, stats: { kd: 0.84, frags: 44, acs: 156, hsPercent: 18, firstBloods: 3 } },
  { id: "p24", ign: "cm2", teamSlug: "lynx", role: "Initiator", isCaptain: false, isIgl: false, stats: { kd: 0.92, frags: 51, acs: 172, hsPercent: 20, firstBloods: 5 } },
  { id: "p25", ign: "w1", teamSlug: "lynx", role: "Duelist", isCaptain: false, isIgl: false, stats: { kd: 0.86, frags: 47, acs: 161, hsPercent: 19, firstBloods: 7 } },
  // NOVA
  { id: "p26", ign: "nx", teamSlug: "nova", role: "Duelist", isCaptain: true, isIgl: true, stats: { kd: 1.18, frags: 72, acs: 209, hsPercent: 24, firstBloods: 10 } },
  { id: "p27", ign: "pln", teamSlug: "nova", role: "Initiator", isCaptain: false, isIgl: false, stats: { kd: 0.95, frags: 54, acs: 178, hsPercent: 21, firstBloods: 6 } },
  { id: "p28", ign: "ay", teamSlug: "nova", role: "Controller", isCaptain: false, isIgl: false, stats: { kd: 0.88, frags: 49, acs: 168, hsPercent: 20, firstBloods: 4 } },
  { id: "p29", ign: "k7", teamSlug: "nova", role: "Sentinel", isCaptain: false, isIgl: false, stats: { kd: 0.81, frags: 42, acs: 154, hsPercent: 18, firstBloods: 3 } },
  { id: "p30", ign: "drz", teamSlug: "nova", role: "Flex", isCaptain: false, isIgl: false, stats: { kd: 0.91, frags: 50, acs: 170, hsPercent: 20, firstBloods: 5 } },
];

const todayISO = () => new Date().toISOString();
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
const daysAhead = (n: number) => new Date(Date.now() + n * 86400000).toISOString();

export const matches: Match[] = [
  // LIVE
  {
    id: "m1", teamA: "olimpo", teamB: "dragon", scheduledAt: todayISO(),
    status: "live", round: "Rodada 2", group: "A",
  },
  // SCHEDULED
  { id: "m2", teamA: "fenix", teamB: "storm", scheduledAt: daysAhead(6), status: "scheduled", round: "Rodada 2", group: "B" },
  { id: "m3", teamA: "lynx", teamB: "thunder", scheduledAt: daysAhead(6), status: "scheduled", round: "Rodada 3", group: "A" },
  { id: "m4", teamA: "nova", teamB: "eclipse", scheduledAt: daysAhead(7), status: "scheduled", round: "Rodada 2", group: "C" },
  { id: "m5", teamA: "olimpo", teamB: "storm", scheduledAt: daysAhead(6), status: "scheduled", round: "Rodada 3", group: "A" },
  { id: "m6", teamA: "titan", teamB: "lynx", scheduledAt: daysAhead(7), status: "scheduled", round: "Rodada 2", group: "C" },
  // DONE
  {
    id: "m7", teamA: "olimpo", teamB: "thunder", scheduledAt: daysAgo(1),
    status: "done", round: "Rodada 2", group: "A",
    result: { winnerSlug: "olimpo", scoreA: 13, scoreB: 7, map: "Ascent", playedAt: daysAgo(1) },
  },
  {
    id: "m8", teamA: "dragon", teamB: "storm", scheduledAt: daysAgo(1),
    status: "done", round: "Rodada 2", group: "B",
    result: { winnerSlug: "dragon", scoreA: 13, scoreB: 9, map: "Bind", playedAt: daysAgo(1) },
  },
  {
    id: "m9", teamA: "lynx", teamB: "fenix", scheduledAt: daysAgo(4),
    status: "done", round: "Rodada 1", group: "A",
    result: { winnerSlug: "lynx", scoreA: 13, scoreB: 11, map: "Haven", playedAt: daysAgo(4) },
  },
  {
    id: "m10", teamA: "nova", teamB: "titan", scheduledAt: daysAgo(4),
    status: "done", round: "Rodada 1", group: "C",
    result: { winnerSlug: "nova", scoreA: 13, scoreB: 8, map: "Lotus", playedAt: daysAgo(4) },
  },
  {
    id: "m11", teamA: "eclipse", teamB: "fenix", scheduledAt: daysAgo(5),
    status: "done", round: "Rodada 1", group: "C",
    result: { winnerSlug: "eclipse", scoreA: 13, scoreB: 10, map: "Pearl", playedAt: daysAgo(5) },
  },
  {
    id: "m12", teamA: "olimpo", teamB: "lynx", scheduledAt: daysAgo(8),
    status: "done", round: "Rodada 1", group: "A",
    result: { winnerSlug: "olimpo", scoreA: 13, scoreB: 9, map: "Bind", playedAt: daysAgo(8) },
  },
];

export const highlights: Highlight[] = [
  { id: "h1", title: "ACE do g1lh · Round 22", category: "Ace", matchId: "m7", teamSlug: "olimpo", playerIgn: "g1lh", map: "Ascent", durationSeconds: 42, views: 2143, publishedDaysAgo: 2, thumbVariant: 1 },
  { id: "h2", title: "Clutch 1v3 · raf1", category: "Clutch", matchId: "m8", teamSlug: "dragon", playerIgn: "raf1", map: "Bind", durationSeconds: 28, views: 1432, publishedDaysAgo: 3, thumbVariant: 2 },
  { id: "h3", title: "Recap Rodada 2", category: "Recap", durationSeconds: 75, views: 986, publishedDaysAgo: 4, thumbVariant: 3 },
  { id: "h4", title: "Ace de luK · operator", category: "Ace", teamSlug: "thunder", playerIgn: "luK", map: "Pearl", durationSeconds: 18, views: 1812, publishedDaysAgo: 5, thumbVariant: 4 },
  { id: "h5", title: "Spray transfer · scr", category: "Play", matchId: "m12", teamSlug: "olimpo", playerIgn: "scr", map: "Haven", durationSeconds: 38, views: 712, publishedDaysAgo: 6, thumbVariant: 5 },
  { id: "h6", title: "Clutch 1v2 · mtL", category: "Clutch", teamSlug: "storm", playerIgn: "mtL", map: "Bind", durationSeconds: 31, views: 624, publishedDaysAgo: 7, thumbVariant: 6 },
  { id: "h7", title: "Wall bang · b3k", category: "Play", teamSlug: "dragon", playerIgn: "b3k", map: "Ascent", durationSeconds: 23, views: 481, publishedDaysAgo: 7, thumbVariant: 7 },
  { id: "h8", title: "Ace de t4t · Sova", category: "Ace", teamSlug: "olimpo", playerIgn: "t4t", map: "Bind", durationSeconds: 22, views: 952, publishedDaysAgo: 8, thumbVariant: 8 },
];

export const editions: Edition[] = [
  { year: 2025, game: "valorant", name: "Inter UnaERP 2025", status: "ongoing", teamsCount: 9, matchesCount: 24, photosCount: 252 },
  { year: 2024, game: "valorant", name: "Inter UnaERP 2024", status: "finished", champion: "olimpo", mvp: "g1lh", teamsCount: 8, matchesCount: 14, photosCount: 189 },
  { year: 2023, game: "valorant", name: "Inter UnaERP 2023", status: "finished", champion: "thunder", mvp: "luK", teamsCount: 6, matchesCount: 12, photosCount: 142 },
  { year: 2022, game: "valorant", name: "Inter UnaERP 2022", status: "finished", champion: "dragon", mvp: "raf1", teamsCount: 6, matchesCount: 11, photosCount: 98 },
];

export const currentEdition = editions[0];

// helpers
export const findTeam = (slug: string) => teams.find((t) => t.slug === slug);
export const findPlayer = (id: string) => players.find((p) => p.id === id);
export const findPlayerByIgn = (ign: string) => players.find((p) => p.ign === ign);
export const findMatch = (id: string) => matches.find((m) => m.id === id);
export const teamRoster = (slug: string) => players.filter((p) => p.teamSlug === slug);
export const teamMatches = (slug: string) =>
  matches.filter((m) => m.teamA === slug || m.teamB === slug);
export const playersByKD = () => [...players].sort((a, b) => b.stats.kd - a.stats.kd);

export const liveMatches = () => matches.filter((m) => m.status === "live");
export const upcomingMatches = () => matches.filter((m) => m.status === "scheduled");
export const doneMatches = () => matches.filter((m) => m.status === "done");
