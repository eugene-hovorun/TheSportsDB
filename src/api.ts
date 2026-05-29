import axios from "axios";
import { get as cacheGet, set as cacheSet } from "./utils/cache.js";
import type { Team, Player, Event } from "./types/api.js";

const API_KEY = process.env.SPORTSDB_API_KEY;

if (!API_KEY) {
  throw new Error(
    "SPORTSDB_API_KEY is not set. Copy .env.example to .env and fill in the value.",
  );
}

const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
});

const TTL = {
  teams: 5 * 60_000, // 5 min — squad/team list changes rarely mid-season
  player: 5 * 60_000, // 5 min
  events: 60_000, // 1 min — scores/fixtures are time-sensitive
} as const;

/** Fetch all teams in the EPL. */
export async function getTeams(): Promise<Team[]> {
  const cached = cacheGet<Team[]>("teams");
  if (cached) return cached;

  const { data } = await client.get<{ teams: Team[] | null }>(
    "/search_all_teams.php",
    {
      params: { l: "English_Premier_League" },
    },
  );
  const teams = data.teams ?? [];
  cacheSet("teams", teams, TTL.teams);
  return teams;
}

/**
 * Fetch a single team by ID.
 * Reuses the cached getTeams() result — avoids a separate API call and works
 */
export async function getTeamById(id: string): Promise<Team | null> {
  const teams = await getTeams();
  return teams.find((t) => t.idTeam === id) ?? null;
}

/** Fetch all players for a given team. */
export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  const key = `players:${teamId}`;
  const cached = cacheGet<Player[]>(key);
  if (cached) return cached;

  const { data } = await client.get<{ player: Player[] | null }>(
    "/lookup_all_players.php",
    {
      params: { id: teamId },
    },
  );
  const players = data.player ?? [];
  cacheSet(key, players, TTL.player);
  return players;
}

/** Fetch a single player by ID. */
export async function getPlayerById(id: string): Promise<Player | null> {
  const key = `player:${id}`;
  const cached = cacheGet<Player>(key);
  if (cached) return cached;

  const { data } = await client.get<{ players: Player[] | null }>(
    "/lookupplayer.php",
    {
      params: { id },
    },
  );
  const player = data.players?.[0] ?? null;
  if (player) cacheSet(key, player, TTL.player);
  return player;
}

/** Fetch next scheduled events for a team. */
export async function getNextEvents(teamId: string): Promise<Event[]> {
  const key = `events:next:${teamId}`;
  const cached = cacheGet<Event[]>(key);
  if (cached) return cached;

  const { data } = await client.get<{ events: Event[] | null }>(
    "/eventsnext.php",
    {
      params: { id: teamId },
    },
  );
  const events = data.events ?? [];
  cacheSet(key, events, TTL.events);
  return events;
}

/** Fetch last results for a team. */
export async function getLastEvents(teamId: string): Promise<Event[]> {
  const key = `events:last:${teamId}`;
  const cached = cacheGet<Event[]>(key);
  if (cached) return cached;

  const { data } = await client.get<{ results: Event[] | null }>(
    "/eventslast.php",
    {
      params: { id: teamId },
    },
  );
  const results = data.results ?? [];
  cacheSet(key, results, TTL.events);
  return results;
}
