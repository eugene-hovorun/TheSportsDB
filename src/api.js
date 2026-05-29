import axios from "axios";

const BASE_URL = "https://www.thesportsdb.com/api/v1/json/123";
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
  const { data } = await client.get("/lookupteam.php", { params: { id } });
  return data.teams?.[0] ?? null;
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
