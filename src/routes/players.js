import { Router } from "express";
import { getPlayerById, getNextEvents, getLastEvents } from "../api.js";

const router = Router();

// Player detail page – data carried via query param to avoid free-tier lockout
// on lookupplayer.php (which always returns the same demo player on key 123)
router.get("/player/:id", (req, res) => {
  try {
    const raw = req.query.data;
    if (!raw)
      return res.status(404).render("error", { message: "Player not found." });

    const player = JSON.parse(decodeURIComponent(raw));
    res.render("player", { player, title: `${player.strPlayer} – EPL Hub` });
  } catch {
    res.status(400).render("error", { message: "Invalid player data." });
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
