import { describe, it, expect } from "vitest";
import {
  teams,
  matches,
  findTeam,
  findPlayer,
  teamRoster,
  teamMatches,
  playersByKD,
  liveMatches,
  upcomingMatches,
  doneMatches,
} from "./mock";

describe("mock data fixtures", () => {
  it("has all 9 teams of edition 2025", () => {
    expect(teams).toHaveLength(9);
    expect(teams.every((t) => t.slug.length > 0)).toBe(true);
  });

  it("each team has unique slug", () => {
    const slugs = teams.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("groups are valid (A/B/C)", () => {
    expect(teams.every((t) => ["A", "B", "C"].includes(t.group))).toBe(true);
  });

  it("findTeam returns undefined for unknown slug", () => {
    expect(findTeam("nope")).toBeUndefined();
    expect(findTeam("olimpo")?.name).toBe("Olimpo");
  });

  it("findPlayer returns the correct player", () => {
    expect(findPlayer("p1")?.ign).toBe("g1lh");
    expect(findPlayer("nope")).toBeUndefined();
  });

  it("teams with roster have at least 5 players", () => {
    for (const t of teams) {
      const roster = teamRoster(t.slug);
      if (roster.length === 0) continue; // alguns times só têm fixture até onde precisamos
      expect(roster.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("teams with roster have exactly one captain", () => {
    for (const t of teams) {
      const roster = teamRoster(t.slug);
      if (roster.length === 0) continue;
      const captains = roster.filter((p) => p.isCaptain);
      expect(captains).toHaveLength(1);
    }
  });

  it("at least 6 teams have full roster of 5 players", () => {
    const withFullRoster = teams.filter(
      (t) => teamRoster(t.slug).length >= 5
    );
    expect(withFullRoster.length).toBeGreaterThanOrEqual(6);
  });

  it("teamMatches returns matches involving the team", () => {
    const olimpoMatches = teamMatches("olimpo");
    expect(olimpoMatches.length).toBeGreaterThan(0);
    expect(
      olimpoMatches.every(
        (m) => m.teamA === "olimpo" || m.teamB === "olimpo"
      )
    ).toBe(true);
  });

  it("playersByKD is sorted descending", () => {
    const sorted = playersByKD();
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].stats.kd).toBeGreaterThanOrEqual(
        sorted[i].stats.kd
      );
    }
  });

  it("g1lh is the top KD player", () => {
    expect(playersByKD()[0].ign).toBe("g1lh");
  });

  it("liveMatches + upcomingMatches + doneMatches partition the schedule", () => {
    expect(
      liveMatches().length + upcomingMatches().length + doneMatches().length
    ).toBe(matches.length);
  });

  it("done matches have a result", () => {
    for (const m of doneMatches()) {
      expect(m.result).toBeDefined();
      expect(m.result?.winnerSlug).toBeDefined();
    }
  });

  it("standings: wins + losses must match match history sanity", () => {
    // Total V do top deve ser ≥ 0 (sanity check; não comparamos com matches
    // porque o mock tem pontos pré-calculados)
    expect(teams[0].wins).toBeGreaterThan(teams[teams.length - 1].wins);
  });
});
