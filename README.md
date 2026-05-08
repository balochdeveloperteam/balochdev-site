# BalochDev

AI-first web & mobile, Supabase backends, Balochi language tech.
Production-ready React + Express stack designed for the free tier:
**Cloudflare Pages** (frontend) + **Render / Fly / Workers** (API) + **Supabase** (DB, auth, storage).

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite 6, React Router 7, Vanta.js, Three.js |
| Backend | Node.js, Express, Helmet, express-rate-limit |
| Auth & DB | Supabase (Postgres + RLS + Auth + Storage) |
| Notifications | Telegram Bot, Google Sheets (optional) |

## Project structure

```
.
├── client/            # Vite React app (deployed to Cloudflare Pages)
│   ├── src/
│   │   ├── nerd/      # All live UI (pages, components, theme)
│   │   ├── lib/       # Singleton supabase client + apiUrl helper
│   │   └── App.jsx    # Router (with /admin and 404)
│   └── public/
├── server/            # Express API (deployed to Render / Fly / Workers)
│   ├── index.js       # Routes, helmet, CORS, rate limiting, honeypot
│   └── notify.js      # Telegram + Google Sheets helpers
└── supabase/migrations/   # SQL schema (re-applyable on a fresh project)
```

## Local setup

```bash
# 1. Clone & install
git clone <repo-url>
cd <repo>

# 2. Server
cd server
cp .env.example .env       # fill SUPABASE_*, optional TELEGRAM_*, GOOGLE_SHEETS_*
npm install
npm run dev                # http://localhost:4000

# 3. Client (new terminal)
cd ../client
cp .env.example .env       # fill VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
npm install
npm run dev                # http://localhost:5173
```

The client uses a Vite proxy in dev so `VITE_API_URL` should stay empty;
in production, set it to your deployed API URL.

## Environment variables

### `client/.env`
| Var | Notes |
|---|---|
| `VITE_SUPABASE_URL` | Public — safe to ship in JS bundle |
| `VITE_SUPABASE_ANON_KEY` | Public — protected by RLS |
| `VITE_API_URL` | Empty in dev, full URL of API in prod |

### `server/.env`
| Var | Notes |
|---|---|
| `NODE_ENV` | Set to `production` when deployed |
| `SUPABASE_URL` | Same as client |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — full DB access |
| `CORS_ORIGIN` | **Required in prod.** Comma-list of allowed frontends |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Optional — form notifications |
| `GOOGLE_SHEETS_*` | Optional — lead logging |

## Security model

- **RLS on every table.** Public reads only when `published = true`.
- **Admin route guard** checks `app_metadata.role === 'admin'`.
- **Helmet** sets standard security headers on every API response.
- **Rate limiting**: 300 req / IP / 15 min globally; 5 form posts / IP / 10 min.
- **Honeypot** field silently drops bot submissions.
- **CORS fail-closed** in production.
- **No DB error messages leak** to clients in production.
- All `.env` files & service-account keys are gitignored.

## Deployment overview

See `DEPLOY.md` for the full step-by-step. Short version:

1. Push to GitHub.
2. Connect frontend → **Cloudflare Pages** (build: `npm run build`, output: `client/dist`, root: `client`).
3. Deploy API → **Render free** (or Fly.io / Cloudflare Workers).
4. In Cloudflare DNS, point your domain at Pages.
5. Set env vars on each platform.
6. Every push to `main` auto-deploys.

## Database

Re-apply the schema on a fresh Supabase project:

```sql
-- run supabase/migrations/001_init.sql, then 002_balochdev.sql
-- or via Supabase CLI / MCP
```

Promote a user to admin:

```sql
update auth.users
   set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
 where email = 'you@example.com';
```
