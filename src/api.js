import axios from "axios";
import { get as cacheGet, set as cacheSet } from "./utils/cache.js";

const API_KEY = process.env.SPORTSDB_API_KEY;

if (!API_KEY) {
  throw new Error(
    "SPORTSDB_API_KEY is not set. Copy .env.example to .env and fill in the value.",
  );
}

const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;
const LEAGUE_ID = "4328"; // English Premier League

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
});

const TTL = {
  teams: 5 * 60_000, // 5 min — squad/team list changes rarely mid-season
  player: 5 * 60_000, // 5 min
  events: 60_000, // 1 min — scores/fixtures are time-sensitive
};

/**
 * Fetch all teams in the EPL.
 * @returns {Promise<Array>} Array of team objects
 */
export async function getTeams() {
  const cached = cacheGet("teams");
  if (cached) return cached;

  const { data } = await client.get("/search_all_teams.php", {
    params: { l: "English_Premier_League" },
  });
  const teams = data.teams ?? [];
  cacheSet("teams", teams, TTL.teams);
  return teams;
}

/**
 * Fetch a single team by its ID.
 * Reuses the cached getTeams() result — avoids a separate API call and works
 * correctly with the free API key (lookupteam.php always returns Arsenal on key 123).
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getTeamById(id) {
  const teams = await getTeams();
  return teams.find((t) => t.idTeam === id) ?? null;
}

/**
 * Fetch all players for a given team.
 * @param {string} teamId
 * @returns {Promise<Array>}
 */
export async function getPlayersByTeam(teamId) {
  const key = `players:${teamId}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const { data } = await client.get("/lookup_all_players.php", {
    params: { id: teamId },
  });
  const players = data.player ?? [];
  cacheSet(key, players, TTL.teams);
  return players;
}

/**
 * Fetch a single player by their ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getPlayerById(id) {
  const key = `player:${id}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const { data } = await client.get("/lookupplayer.php", { params: { id } });
  const player = data.players?.[0] ?? null;
  if (player) cacheSet(key, player, TTL.player);
  return player;
}

/**
 * Fetch next scheduled events for a team.
 * @param {string} teamId
 * @returns {Promise<Array>}
 */
export async function getNextEvents(teamId) {
  const key = `events:next:${teamId}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const { data } = await client.get("/eventsnext.php", {
    params: { id: teamId },
  });
  const events = data.events ?? [];
  cacheSet(key, events, TTL.events);
  return events;
}

/**
 * Fetch last results for a team.
 * @param {string} teamId
 * @returns {Promise<Array>}
 */
export async function getLastEvents(teamId) {
  const key = `events:last:${teamId}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const { data } = await client.get("/eventslast.php", {
    params: { id: teamId },
  });
  const results = data.results ?? [];
  cacheSet(key, results, TTL.events);
  return results;
}

export { LEAGUE_ID };
