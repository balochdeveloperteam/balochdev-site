# Deployment Guide — BalochDev

Goal: ship the site on a fully **free tier** that comfortably handles **10,000 visitors / month**, with **automatic deploys on every git push**.

---

## Architecture

```
┌──────────────┐     ┌──────────────────────┐     ┌──────────────┐
│  visitor     │────▶│  Cloudflare Pages    │────▶│   Supabase   │
│  (browser)   │     │  (React frontend)    │     │  (DB + Auth) │
└──────────────┘     └──────────────────────┘     └──────────────┘
                              │
                              │ /api/* fetch
                              ▼
                     ┌──────────────────────┐
                     │   Render (free)      │
                     │   Express API        │
                     └──────────────────────┘
                              │
                              ▼ (optional)
                     Telegram bot, Google Sheets
```

| Piece | Where | Cost | Limits (free tier) |
|---|---|---|---|
| Frontend | Cloudflare Pages | $0 | Unlimited bandwidth, 500 builds/mo, custom domain free |
| API | Render free Web Service | $0 | 750 hours/mo, sleeps after 15 min idle, 512 MB RAM |
| DB / Auth / Storage | Supabase free | $0 | 500 MB DB, 1 GB storage, 50k MAU |
| Domain DNS | Cloudflare (you already own) | $0 | unlimited |

> 10k/month visitors = **~14 visits/hour**. Cloudflare caches your static site at the edge, so the API only gets hit when someone submits a form or loads the admin dashboard. Render free handles this with room to spare.

---

## Step 1 — Get the repo on GitHub

You already cleaned the repo, the `.gitignore` is set, and `.env` files are protected. Now:

```powershell
# from D:\website development\all project (S-course)\adeel course work\ServiceSite
git init
git add .
git commit -m "Initial commit: BalochDev site"
git branch -M main
```

Create the repo on GitHub (https://github.com/new) — name it e.g. `balochdev-site`. **Make it private** if you want to keep code closed, public is also fine since secrets are gitignored.

```powershell
git remote add origin https://github.com/<your-username>/balochdev-site.git
git push -u origin main
```

**Before the very first push**, double-check no secrets snuck in:

```powershell
git ls-files | Select-String '\.env$|service.*key|google.*sa\.json'
```

If anything besides `.env.example` shows up, remove it from staging before pushing.

---

## Step 2 — Deploy frontend to Cloudflare Pages

### 2a. Create the Pages project

1. Log in to https://dash.cloudflare.com
2. Left sidebar → **Workers & Pages** → **Create application** → **Pages** tab → **Connect to Git**
3. Authorize Cloudflare to read your GitHub account, pick `balochdev-site`.
4. Build settings:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory (advanced):** `client`
   - **Environment variables (Production):**
     - `VITE_SUPABASE_URL` = `https://<your-ref>.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `<your anon key>`
     - `VITE_API_URL` = `https://your-api.onrender.com`  ← fill this in **after Step 3**
5. Click **Save and Deploy**.

The first build will fail to talk to your API until step 3 is done — that's OK.

### 2b. Connect your Cloudflare-bought domain

1. Pages project → **Custom domains** tab → **Set up a custom domain**
2. Type your domain (e.g. `balochdev.com`).
3. Cloudflare auto-creates the CNAME — accept it. Done.
4. (Optional) Add `www.balochdev.com` the same way.

SSL is automatic. Propagation takes 1–10 minutes.

---

## Step 3 — Deploy API to Render

### 3a. Create the service

1. Sign up at https://render.com using GitHub.
2. **New +** → **Web Service** → connect the same GitHub repo.
3. Settings:
   - **Name:** `balochdev-api`
   - **Region:** any (closest to your users — Frankfurt is good for Pakistan)
   - **Branch:** `main`
   - **Root directory:** `server`
   - **Build command:** `npm install`
   - **Start command:** `node index.js`
   - **Instance type:** **Free**
4. **Environment variables** (paste in Render UI, do NOT commit):

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `4000` (Render sets this automatically; harmless to set) |
   | `SUPABASE_URL` | from Supabase dashboard |
   | `SUPABASE_SERVICE_ROLE_KEY` | from Supabase dashboard |
   | `CORS_ORIGIN` | `https://balochdev.com,https://www.balochdev.com,https://balochdev-site.pages.dev` |
   | `TELEGRAM_BOT_TOKEN` | (optional) |
   | `TELEGRAM_CHAT_ID` | (optional) |

5. Click **Create Web Service**. Wait for green "Live" status — first build is ~3 minutes.
6. Copy the URL (e.g. `https://balochdev-api.onrender.com`).

### 3b. Wire the URL into the frontend

Back in **Cloudflare Pages → Settings → Environment variables**:
- Set `VITE_API_URL` = `https://balochdev-api.onrender.com`
- Trigger a redeploy: **Deployments** → **Retry deployment**.

### 3c. (Optional) Defeat the cold start

Render free tier sleeps after 15 minutes idle. First request after sleep takes 30–60s. If that bothers you:

- Add a free uptime ping at https://uptimerobot.com → HTTP monitor → URL = `https://balochdev-api.onrender.com/api/health` → interval 5 min.
- Or — simpler future move — migrate the API to Cloudflare Workers (no cold starts), see "Step 6" below.

---

## Step 4 — Auto-deploy on every push

You're done. Both Cloudflare Pages and Render watch your `main` branch.

```
git add .
git commit -m "tweak homepage copy"
git push
```

→ Cloudflare Pages auto-builds & deploys frontend (~30 sec).
→ Render auto-builds & deploys API (~2 min).

**Preview deploys for branches:**
- Cloudflare Pages: every non-`main` branch gets a preview URL automatically.
- Render: free tier doesn't do PR previews, but the production deploy waits for `main`.

If you want a stricter flow (run tests before deploy), add `.github/workflows/ci.yml`:

```yaml
name: CI
on: [push, pull_request]
jobs:
  build-frontend:
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: client } }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm, cache-dependency-path: client/package-lock.json }
      - run: npm ci
      - run: npm run build
```

---

## Step 5 — Final smoke tests after deploy

Open `https://balochdev.com` in an incognito tab and confirm:

| Test | Expected |
|---|---|
| Homepage loads | ✓ Vanta hero + sections render |
| `/admin/login` works | ✓ Login form shown when logged out |
| Login with admin user | ✓ Redirects to `/admin` dashboard |
| Login with non-admin user | ✗ Should reject (`Admin only` from server) |
| Submit contact form | ✓ Saves to `form_submissions` in Supabase |
| `/something-bogus` | ✓ Renders custom 404 page |
| `https://balochdev-api.onrender.com/api/health` | `{ "ok": true, "db": true }` |
| `curl -X POST https://balochdev-api.onrender.com/api/contact` 6 times rapidly | 6th returns 429 rate-limit |
| Submit form with `website` honeypot field | Returns `{"ok":true}` but no DB row written |

---

## Step 6 — (Future) move API to Cloudflare Workers

If Render's cold start is annoying, migrate the API to Workers for a fully Cloudflare stack:

- Install `wrangler`, port `server/index.js` from Express → [Hono](https://hono.dev) (very similar API).
- `notify.js` works as-is (uses fetch + googleapis with Workers-compatible fork).
- Workers free tier = **100,000 requests/day** at the edge with **no cold starts**. Your 10k/month uses ~330/day — far inside the limit.

Not required for launch — Render free is fine. Mention this when you're ready and I'll port it.

---

## Troubleshooting cheatsheet

| Symptom | Fix |
|---|---|
| Cloudflare Pages build fails: "VITE_SUPABASE_URL not defined" | Set env vars in Pages → Settings → Environment variables, redeploy |
| Frontend works but API calls fail with CORS error | Add your Pages URL to `CORS_ORIGIN` on Render, redeploy API |
| Login fails with "Invalid session" after deploy | Make sure the **same** Supabase URL+anon key are on both Pages and Render |
| Render service won't start | Check logs — usually `SUPABASE_SERVICE_ROLE_KEY` not set |
| First API call after idle is 30–60s | Render free tier cold start; add UptimeRobot ping or migrate to Workers |
| 10k traffic causes 429s | Bump global rate limit in `server/index.js` (`max: 300` → `1000`) |
