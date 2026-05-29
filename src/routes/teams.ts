import { Router, Request, Response, NextFunction } from "express";
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
router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const teams = await getTeams();
    teams.sort((a, b) => a.strTeam.localeCompare(b.strTeam));
    res.render("index", { teams, title: "EPL Hub – All Teams" });
  } catch (err) {
    next(err);
  }
});

// Team detail page
router.get(
  "/team/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params["id"] as string;
      const team = await getTeamById(id);
      if (!team) throw createError(404, "Team not found.");

      const players = await getPlayersByTeam(id);
      res.render("team", { team, players, title: `${team.strTeam} – EPL Hub` });
    } catch (err) {
      next(err);
    }
  },
);

// ── JSON endpoints consumed by Vue components ─────────────────────────────────

router.get(
  "/api/team/:id/events/next",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const events = await getNextEvents(req.params["id"] as string);
      res.json(events);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  "/api/team/:id/events/last",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const events = await getLastEvents(req.params["id"] as string);
      res.json(events);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
