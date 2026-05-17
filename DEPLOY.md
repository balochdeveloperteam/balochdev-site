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
| Frontend | Cloudflare Pages (static) + GitHub Actions (build + prerender) | $0 | Pages: edge CDN bandwidth and custom domains; GH Actions consumes your free/private Actions minutes (~2 min per deploy typical) |
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

## Step 2 — Cloudflare Pages (Direct Upload only) + GitHub Actions CI

Production **never** relies on Pages “Connect to Git” builds. **`npm run prerender`** runs on **`ubuntu-latest`** in GitHub Actions; **Wrangler** uploads **`client/dist`.** Pages only hosts the static artifact.

Also keep using this flow for **manual local testing**:

```powershell
cd client
npm ci
npm run routes:enumerate
npm run prerender
```

---

### One-time: GitHub Secrets (encrypted)

In GitHub: repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret | What it holds |
|---|---|
| **`VITE_SUPABASE_URL`** | Supabase URL (same value you used for Vite, e.g. `https://<ref>.supabase.co`) |
| **`VITE_SUPABASE_ANON_KEY`** | Supabase anon (public) key |
| **`VITE_API_URL`** | Public API base URL (Render service URL once Step 3 is live) |
| **`CLOUDFLARE_API_TOKEN`** | API token scoped for Pages deploy (**Account → Cloudflare Pages → Edit** on your account — or use Wrangler/dashboard “Create Pages token” preset if offered) |
| **`CLOUDFLARE_ACCOUNT_ID`** | Cloudflare **Account ID** (dashboard right sidebar → your account → **Account ID**) |

### One-time: GitHub Actions Variable (non-secret)

**Settings → Secrets and variables → Actions → Variables tab → New repository variable**

| Variable | Purpose |
|---|---|
| **`CLOUDFLARE_PAGES_PROJECT_NAME`** | Exact Cloudflare Pages **project name** (slug) — Wrangler **`pages deploy`** targets this project |

If this variable is empty, `.github/workflows/deploy.yml` stops before upload so you cannot deploy blindly.

---

### One-time: Cloudflare Pages dashboard (switch off Git builds)

Pick **either** migrate an existing project **or** create a dedicated Direct Upload project.

#### If you already have a Git-connected Pages project

1. Log in → **Workers & Pages** → click your **Pages** project.
2. Go to **Settings**.
3. Open **Builds & deployments** (wording may be **Build configuration** / **Configure build** depending on UI version).
4. Find the connected Git integration and choose **Disconnect** / **Disconnect repository** (you are removing automated Cloudflare CI so it no longer runs `npm run build` on push).
5. Confirm: there should be **no** active Git-based build pipeline for this site. All future uploads come from Wrangler/GitHub Actions.

#### If you are creating Pages from scratch (recommended clarity)

1. **Workers & Pages** → **Create** → choose **Pages** → **Upload your site** (**Direct Upload**), not **Connect to Git**.
2. Create the project once (name matches **`CLOUDFLARE_PAGES_PROJECT_NAME`**).
3. You do **not** need build command or root directory — Wrangler uploads the finished `dist/`.

Leave **Workers & Pages** → your project → **Custom domains** as before (`balochdev.com`, optional `www`).

SSL stays automatic once DNS is wired.

---

### CI workflow behaviour

Workflow file: **`.github/workflows/deploy.yml`** (workflow name shown in Actions: **“Deploy Pages (prerender)”**).

- Runs on **every push to `main`** and on **`workflow_dispatch`** (manual rerun from **Actions → Deploy Pages (prerender) → Run workflow**).
- Steps order: **`npm ci` → `playwright install --with-deps chromium` → `npm run routes:enumerate` → `npm run prerender` → `wrangler pages deploy`** (against `client/dist`).
- **Fail-safe**: if **`npm run prerender`** (or anything before deploy) exits with a non‑zero status, **`Publish to Cloudflare Pages` never runs**, so production is not overwritten with a broken or empty tree.
- **`~/.cache/ms-playwright`** is cached keyed by **`client/package-lock.json`** hash for faster runs.

Branch previews: pushes to branches other than `main` **do not** auto-deploy unless you extend the workflow. Use **`workflow_dispatch`** on another branch intentionally if needed.

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

### 3b. Wire the URL into the frontend bundle

Production Vite bundles read **`VITE_*` at CI time**, not Cloudflare Pages env:

1. In GitHub → your repo → **Settings** → **Secrets and variables** → **Actions**.
2. Set or update the **`VITE_API_URL`** secret to your Render URL, e.g. `https://balochdev-api.onrender.com`.
3. Deploy the site again — push to **`main`** (triggers **`Deploy Pages (prerender)`**) **or** run that workflow manually from **Actions**.

### 3c. (Optional) Defeat the cold start

Render free tier sleeps after 15 minutes idle. First request after sleep takes 30–60s. If that bothers you:

- Add a free uptime ping at https://uptimerobot.com → HTTP monitor → URL = `https://balochdev-api.onrender.com/api/health` → interval 5 min.
- Or — simpler future move — migrate the API to Cloudflare Workers (no cold starts), see "Step 6" below.

---

## Step 4 — Auto-deploy on every push

Render still watches **`main`** for the API (`server`). The frontend goes through GitHub Actions + Wrangler.

```
git add .
git commit -m "tweak homepage copy"
git push
```

→ **GitHub Actions** runs **`.github/workflows/deploy.yml`**: **`npm ci` → Playwright chromium → enumerate routes → `npm run prerender` → `wrangler pages deploy`** (~2–15 min depending on cache).
→ Render auto-builds & deploys API (~2 min).

**Frontend branch previews:**

- There is **no** automatic Pages preview deploy for arbitrary branches unless you extend the workflow. Use **`workflow_dispatch`** on **`Deploy Pages (prerender)`** deliberately on a chosen branch/build if you want a one-off artifact.

If you want a stricter flow (lint on every PR), extend **`.github/workflows/`** — the deploy workflow deliberately focuses on **`npm ci` + `npm run prerender`** only.

Example optional PR-only CI (SPA build, no Playwright):

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
        with: { node-version: 22, cache: npm, cache-dependency-path: client/package-lock.json }
      - run: npm ci
      - run: npm run lint
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
| GitHub deploy fails — missing `VITE_SUPABASE_*` / `VITE_API_URL` at build time | Set **Secrets** (`VITE_*`) → re-run **`Deploy Pages (prerender)`** |
| `CLOUDFLARE_PAGES_PROJECT_NAME` error in Actions | Repo **Variables**: set **`CLOUDFLARE_PAGES_PROJECT_NAME`** to Pages project slug |
| Front-end works but API calls fail CORS | Add your **`*.pages.dev` + apex + www** to Render **`CORS_ORIGIN`**, redeploy API |
| Login fails (“Invalid session”) after deploy | Match Supabase **`VITE_`** frontend secrets vs Render server env |
| Render service won't start | Logs — **`SUPABASE_SERVICE_ROLE_KEY`** often missing |
| First API idle request 30–60 s | Cold start → UptimeRobot ping or Workers migration |
| 10 k traffic triggers 429s | Raise global limit **`server/index.js`** (`max: 300` → `1000`) |
