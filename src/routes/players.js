import { Router } from "express";
import { getPlayerById } from "../api.js";
import { createError } from "../utils/httpError.js";

const router = Router();

// Player detail page
router.get("/player/:id", async (req, res, next) => {
  try {
    const player = await getPlayerById(req.params.id);
    if (!player) throw createError(404, "Player not found.");
    res.render("player", { player, title: `${player.strPlayer} – EPL Hub` });
  } catch (err) {
    next(err);
  }
});

export default router;
