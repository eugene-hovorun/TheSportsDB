import axios from "axios";

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

/**
 * Fetch all teams in the EPL.
 * @returns {Promise<Array>} Array of team objects
 */
export async function getTeams() {
  const { data } = await client.get("/search_all_teams.php", {
    params: { l: "English_Premier_League" },
  });
  return data.teams ?? [];
}

/**
 * Fetch a single team by its ID.
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
  const { data } = await client.get("/lookup_all_players.php", {
    params: { id: teamId },
  });
  return data.player ?? [];
}

/**
 * Fetch a single player by their ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getPlayerById(id) {
  const { data } = await client.get("/lookupplayer.php", { params: { id } });
  return data.players?.[0] ?? null;
}

/**
 * Fetch next scheduled events for a team.
 * @param {string} teamId
 * @returns {Promise<Array>}
 */
export async function getNextEvents(teamId) {
  const { data } = await client.get("/eventsnext.php", {
    params: { id: teamId },
  });
  return data.events ?? [];
}

/**
 * Fetch last results for a team.
 * @param {string} teamId
 * @returns {Promise<Array>}
 */
export async function getLastEvents(teamId) {
  const { data } = await client.get("/eventslast.php", {
    params: { id: teamId },
  });
  return data.results ?? [];
}

export { LEAGUE_ID };
