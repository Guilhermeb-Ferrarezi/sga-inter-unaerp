/**
 * ⚠️ DEPRECADO — Não use mais para dados de UI.
 *
 * Este arquivo continha fixtures (times, jogadores, partidas, highlights, edições)
 * usados quando a API ainda não estava disponível. Todos os arrays agora estão
 * vazios para forçar a UI a consumir dados reais via Apollo Client (hooks em
 * src/lib/use-*.ts).
 *
 * Os tipos e helpers de lookup (findTeam, findPlayer, etc.) continuam aqui para
 * compatibilidade com componentes que ainda fazem busca local em listas
 * pequenas — mas devem ser substituídos por queries específicas ao backend.
 */
import type { Team, Player, Match, Highlight, Edition } from "./types";

export const teams: Team[] = [];
export const players: Player[] = [];
export const matches: Match[] = [];
export const highlights: Highlight[] = [];
export const editions: Edition[] = [];

export const currentEdition: Edition | undefined = undefined;

// Helpers de lookup — agora trabalham sobre arrays vazios (retornam undefined/array vazio).
// Componentes devem migrar pra hooks Apollo (use-edition, use-matches, etc).
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
