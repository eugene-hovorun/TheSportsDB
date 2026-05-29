import { Router } from "express";
import {
  getTeams,
  getTeamById,
  getPlayersByTeam,
  getNextEvents,
  getLastEvents,
} from "../api.js";
import { createError } from "../utils/httpError.js";

const router = Router();

// Home: list all EPL teams
router.get("/", async (_req, res, next) => {
  try {
    const teams = await getTeams();
    // Sort alphabetically for a tidy grid
    teams.sort((a, b) => a.strTeam.localeCompare(b.strTeam));
    res.render("index", { teams, title: "EPL Hub – All Teams" });
  } catch (err) {
    next(err);
  }
});

// Team detail page – SSR shell, Vue picks up dynamic sections client-side
router.get("/team/:id", async (req, res, next) => {
  try {
    const team = await getTeamById(req.params.id);
    if (!team) throw createError(404, "Team not found.");

    const players = await getPlayersByTeam(req.params.id);
    res.render("team", { team, players, title: `${team.strTeam} – EPL Hub` });
  } catch (err) {
    next(err);
  }
});

// ── JSON endpoints consumed by Vue components ─────────────────────────────────

router.get("/api/team/:id/events/next", async (req, res, next) => {
  try {
    const events = await getNextEvents(req.params.id);
    res.json(events);
  } catch (err) {
    next(err);
  }
});

router.get("/api/team/:id/events/last", async (req, res, next) => {
  try {
    const events = await getLastEvents(req.params.id);
    res.json(events);
  } catch (err) {
    next(err);
  }
});

export default router;
