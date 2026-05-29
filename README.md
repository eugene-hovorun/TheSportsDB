# EPL Hub

A server-rendered website for exploring English Premier League teams and players, built with **Express + EJS** (SSR) and **Vue 3** (client-side dynamic sections).

Live demo: _(deploy to Render/Railway and paste URL here)_

---

## Tech Stack

| Layer       | Choice          | Reason                                                     |
| ----------- | --------------- | ---------------------------------------------------------- |
| Runtime     | Node.js ≥ 18    | Native ESM, `--watch` dev mode                             |
| Server      | Express 5       | Minimal, battle-tested                                     |
| Templating  | EJS             | Simple, logic-friendly, no client build step               |
| Reactivity  | Vue 3 (SFC)     | Compiled via Vite; scoped to the events widget             |
| Bundler     | Vite 5          | Compiles Vue SFCs and Tailwind for the client bundle       |
| Styling     | Tailwind CSS v3 | Utility-first; scanned across EJS views and Vue components |
| Data        | TheSportsDB v1  | Free tier covers EPL teams, squads, fixtures, and players  |
| HTTP client | axios           | Clean API, configurable timeout                            |
| Cache       | lru-cache v11   | In-process LRU with native per-entry TTL                   |

---

## Architecture

```
src/
├── server.ts                  # Express entry – view engine, static files, routes, error handler
├── api.ts                     # TheSportsDB API client (all fetch + cache logic)
├── types/
│   └── api.ts                 # Shared TypeScript interfaces for API response shapes
├── utils/
│   ├── cache.ts               # Thin wrapper around lru-cache (get / set with TTL)
│   ├── httpError.ts           # createError(status, message) helper for route handlers
│   └── imgUrl.ts              # Null-safe TheSportsDB image URL builder
├── routes/
│   ├── teams.ts               # GET /  · GET /team/:id  · GET /api/team/:id/events/{next,last}
│   └── players.ts             # GET /player/:id
├── views/
│   ├── index.ejs              # Team grid (home page)
│   ├── team.ejs               # Team detail: SSR hero + squad, Vue events widget
│   ├── player.ejs             # Player detail (fully SSR)
│   ├── error.ejs              # Catch-all error page
│   └── partials/
│       ├── header.ejs         # HTML head, Inter font, app.css, sticky nav
│       └── footer.ejs         # Attribution + closing tags
├── client/
│   ├── main.ts                # Vue app entry - mounts EventsSection on #events-app
│   ├── style.css              # Tailwind directives (@tailwind base/components/utilities)
│   └── components/
│       ├── EventsSection.vue  # Fetches and renders upcoming + recent fixtures
│       └── EventCard.vue      # Single fixture / result card
└── public/                    # Static assets served by Express
    ├── css/app.css            # ← Vite build output (compiled Tailwind)
    └── js/events.js           # ← Vite build output (compiled Vue bundle)
```

### SSR vs. Vue split

**EJS (server-rendered):**

- Team grid (home page)
- Team hero, description, quick facts, stadium/manager/kit info
- Full squad player cards
- Full player detail page

**Vue 3 (client-side):**

- _Fixtures & Results_ section on the team page — loaded after the initial paint via `/api/team/:id/events/next` and `/api/team/:id/events/last`. These are thin proxy endpoints on the Express server so the TheSportsDB API key is never exposed to the browser.

This split keeps first paint fast and content SEO-indexable, while still demonstrating Vue SFC components and client-side data fetching for secondary, time-sensitive data.

### Build pipeline

```
Vite (client)          tsc (server)
─────────────          ────────────
src/client/main.ts  →  src/public/js/events.js
src/client/style.css → src/public/css/app.css
src/server.ts       →  dist/server.js   (via tsconfig.server.json)
```

---

## Getting Started

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/epl-hub.git
cd epl-hub

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and set SPORTSDB_API_KEY (use "123" for the free public key)

# 4a. Development (server auto-restarts + Vite rebuilds on change)
npm run dev

# 4b. Production build + start
npm run build
npm start
```

Then open [http://localhost:3000](http://localhost:3000).

---

## API Endpoints Used

| Method | TheSportsDB endpoint                             | Purpose              |
| ------ | ------------------------------------------------ | -------------------- |
| `GET`  | `/search_all_teams.php?l=English_Premier_League` | Full team list       |
| `GET`  | `/lookup_all_players.php?id=:teamId`             | Squad for a team     |
| `GET`  | `/lookupplayer.php?id=:id`                       | Single player detail |
| `GET`  | `/eventsnext.php?id=:teamId`                     | Upcoming fixtures    |
| `GET`  | `/eventslast.php?id=:teamId`                     | Recent results       |

The free public key (`123`) covers all endpoints above. Rate limit: 30 req/min.
Some endpoints (player honours, contracts, transfer history) return only 1 result on the free tier and are intentionally excluded to avoid showing misleading partial data.

---

## Design Decisions & Assumptions

1. **League choice: English Premier League.** It has the richest data on TheSportsDB — team badges, fanart, player photos, and biographies are all populated. Other leagues have sparse or missing assets.

2. **Image sizing.** TheSportsDB CDN supports `/tiny`, `/small`, `/medium`, `/large` suffixes. The app picks the smallest size appropriate for each context (e.g. `/tiny` in the team grid, `/small` for squad cards) to reduce bandwidth.

3. **`getTeamById` reuses `getTeams()`.** Rather than calling `/lookupteam.php` separately, the team detail route finds its team in the already-cached team list. This avoids a redundant API call on every team page visit and keeps the cache warm.

4. **In-memory LRU cache.** All API calls are wrapped with `lru-cache` (v11 native TTL). Teams and players are cached for 5 minutes; fixture data for 1 minute (it changes on matchday). The cache lives in-process and resets on restart — Redis or a shared cache layer would be the next step for multi-instance deployments.

5. **Error handling.** All async route handlers call `next(err)`. The central error middleware in `server.ts` renders `error.ejs` with a safe message — stack traces never reach the browser.

6. **No client-side router.** Navigation is traditional multi-page. Vue is scoped strictly to the events widget; it does not take over the page. This preserves the EJS/SSR character of the app and keeps the Vue bundle small.

7. **`imgUrl` as `app.locals`.** The helper is injected once via `app.locals` so every EJS view can call `imgUrl(src, size)` without explicit `res.render` boilerplate. The trade-off is an implicit dependency — callers need to know it comes from `app.locals`, not the route's local data.

---

## Possible Improvements

- **Vue mount pattern.** The current approach mounts Vue on `#events-app` and resolves `<events-section>` from the in-DOM template. A cleaner alternative: pass `teamId` as a `data-team-id` attribute on the mount element and call `createApp(EventsSection, { teamId }).mount(el)`, eliminating reliance on Vue's DOM template compiler.
- **Dev tooling.** The `--loader ts-node/esm` flag is considered legacy. Replacing it with `tsx watch` would improve startup time and ESM compatibility.
- **Persistent cache.** Replace the in-process LRU with Redis for cache survival across deploys and support for multiple server instances.
- **Pagination.** The squad grid and player list have no pagination; large squads render all at once.

---

## License

MIT
