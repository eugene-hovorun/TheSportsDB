# EPL Hub

A server-rendered website for exploring English Premier League teams and players, built with **Express + EJS** (SSR) and **Vue 3** (client-side dynamic sections).

Live demo: *(deploy to Render/Railway and paste URL here)*

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Runtime | Node.js ≥ 18 | Native ESM, `--watch` dev mode |
| Server | Express 4 | Minimal, battle-tested |
| Templating | EJS | Simple, logic-friendly, no build step |
| Reactivity | Vue 3 (CDN) | No bundler needed; drops in on specific pages |
| Styling | Tailwind CSS (CDN) | Utility-first, no build step for this scope |
| Data | TheSportsDB v1 API | Free, covers EPL teams + players |
| HTTP client | axios | Clean API, timeout support |

---

## Architecture

```
src/
├── server.js              # Express entry – view engine, static, routes
├── api.js                 # TheSportsDB API client (all fetch logic lives here)
├── routes/
│   ├── teams.js           # GET /  (team list)  +  GET /team/:id  (team detail)
│   └── players.js         # GET /player/:id  +  GET /api/team/:id/events/*
├── views/
│   ├── index.ejs          # Team grid
│   ├── team.ejs           # Team detail (SSR hero + squad, Vue events)
│   ├── player.ejs         # Player detail (fully SSR)
│   ├── error.ejs          # Generic error page
│   └── partials/
│       ├── header.ejs     # HTML head + sticky nav
│       └── footer.ejs     # Attribution footer + closing tags
└── public/
    ├── css/app.css        # Custom utilities (line-clamp, etc.)
    └── js/events.js       # Vue 3 component – fixtures & results
```

### SSR vs. Vue split

**EJS (server-rendered):**
- Team grid (home page)
- Team hero, description, quick facts, kit/manager/stadium info
- Squad player cards
- Full player detail page

**Vue 3 (client-side):**
- *Fixtures & Results* section on the team page — fetches upcoming and recent events via `/api/team/:id/events/next` and `/api/team/:id/events/last`. These are thin proxy routes on our Express server so the TheSportsDB API key never hits the browser.

This separation keeps initial paint fast (no FOUC, SEO-friendly content) while still demonstrating reactive Vue components for data that is secondary and non-critical for first load.

---

## API Endpoints Used

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/search_all_teams.php?l=English_Premier_League` | Full team list |
| `GET` | `/lookupteam.php?id=:id` | Single team detail |
| `GET` | `/lookup_all_players.php?id=:teamId` | Squad for a team |
| `GET` | `/lookupplayer.php?id=:id` | Single player detail |
| `GET` | `/eventsnext.php?id=:teamId` | Upcoming fixtures |
| `GET` | `/eventslast.php?id=:teamId` | Recent results |

All calls use the free public key `123`. Rate limit: 30 req/min.

---

## Getting Started

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/epl-hub.git
cd epl-hub

# Install
npm install

# Run
npm start          # production
npm run dev        # auto-restart on file change (Node ≥ 18)
```

Then open [http://localhost:3000](http://localhost:3000).

No `.env` file is required – the free TheSportsDB key is baked into `src/api.js`. If you get a premium key, replace `123` in that file.

---

## Design Decisions & Assumptions

1. **No bundler.** Tailwind and Vue 3 are loaded from CDN. For a real production app I'd use Vite + a proper Vue SFC setup, but the task asked to explore EJS + SSR and a bundlerless approach makes the project easier to run and review without a build step.

2. **League choice: English Premier League (id 4328).** It has the richest data on TheSportsDB – team badges, fanart, player photos and biographies.

3. **Image sizing.** TheSportsDB supports `/tiny`, `/small`, `/medium` suffixes on image URLs. The app uses the smallest appropriate size per context (e.g. `/tiny` in the team grid, `/small` for player cards) to keep pages fast.

4. **Free API limitations.** Some endpoints (player honours, contracts, former teams) are limited to 1 result on the free key. These are therefore not included to avoid misleading partial data. Upcoming/last events are capped at ~5 per team.

5. **Error handling.** All async route handlers `next(err)` to the Express error middleware which renders a dedicated `error.ejs` page instead of crashing.

6. **No client-side router.** Navigation is traditional multi-page. Vue is scoped strictly to the events widget – it does not take over the whole page. This keeps the EJS/SSR character of the app clear.

---

## Possible Improvements

- Add a search bar (Vue-powered, hits `/searchteams.php`)
- Paginate or filter the squad grid by position
- Cache API responses in-memory (or Redis) to stay within rate limits
- Extract Tailwind config to a proper `tailwind.config.js` with a PostCSS build
- Add E2E tests (Playwright) for team/player navigation
- Deploy via Dockerfile to Railway or Render

---

## License

MIT
