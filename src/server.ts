import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import teamsRouter from "./routes/teams.js";
import playersRouter from "./routes/players.js";
import { imgUrl } from "./utils/imgUrl.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT ?? 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Make imgUrl available as a template local in every render call
app.locals.imgUrl = imgUrl;

app.use("/", teamsRouter);
app.use("/", playersRouter);

// Central error handler
app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  const status = err.status ?? 500;
  res.status(status).render("error", {
    title: "Error – EPL Hub",
    message: err.status ? err.message : "Something went wrong. Please try again.",
  });
});

app.listen(PORT, () => {
  console.log(`EPL Hub running at http://localhost:${PORT}`);
});
