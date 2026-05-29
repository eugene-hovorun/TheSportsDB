import { Router, Request, Response, NextFunction } from "express";
import { getPlayerById } from "../api.js";
import { createError } from "../utils/httpError.js";

const router = Router();

router.get(
  "/player/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const player = await getPlayerById(req.params["id"] as string);
      if (!player) throw createError(404, "Player not found.");
      res.render("player", { player, title: `${player.strPlayer} - EPL Hub` });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
