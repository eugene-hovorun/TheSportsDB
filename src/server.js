import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import teamsRouter from "./routes/teams.js";
import playersRouter from "./routes/players.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", teamsRouter);
app.use("/", playersRouter);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .render("error", { message: "Something went wrong. Please try again." });
});

app.listen(PORT, () => {
  console.log(`EPL Hub running at http://localhost:${PORT}`);
});
