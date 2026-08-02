# BalochDev API — Cloudflare Workers

This is the Cloudflare Workers port of `server/` (Express + Node). It uses
[Hono](https://hono.dev) for routing and runs at the edge with zero cold
starts.

## Why Workers

| Render free | Workers free |
|---|---|
| 30–60s cold start after 15 min idle | **No cold starts** |
| Single region | 300+ edge locations |
| 512MB shared RAM | 128MB **per request**, isolated |
| Sleep on inactivity | Always warm |

## Local development

```bash
cd worker
npm install
cp .dev.vars.example .dev.vars   # fill in real values (do not commit)
npm run dev                       # runs on http://localhost:8787
```

## Production deploy

CI deploys on every push to `main` via `.github/workflows/deploy-worker.yml`.

For manual deploy:

```bash
cd worker
npx wrangler deploy
```

## Why env vars used to disappear after deploy

By default Wrangler treats `wrangler.toml` `[vars]` as the source of truth for
**plain-text Variables**. On each `wrangler deploy` it removes dashboard
Variables that are not listed there.

That is why `SUPABASE_URL`, `CLOUDINARY_CLOUD_NAME`, and `TELEGRAM_CHAT_ID`
vanished after CI/deploy if they were entered as plain Variables in the
dashboard.

**Fix in this repo:**
- `keep_vars = true` in `wrangler.toml` (and `deploy --keep-vars` in CI)
- Non-secret values (`SUPABASE_URL`, `CLOUDINARY_CLOUD_NAME`) live in `[vars]`
- Real secrets must be **Secrets** (encrypted), not plain Variables

## One-time secrets (Cloudflare dashboard or CLI)

`SUPABASE_URL` and `CLOUDINARY_CLOUD_NAME` are already in `wrangler.toml` `[vars]`.
Set the rest as **Secrets** (encrypted):

```bash
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put CLOUDINARY_API_KEY
npx wrangler secret put CLOUDINARY_API_SECRET
npx wrangler secret put IP_HASH_SECRET

# optional
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
npx wrangler secret put GOOGLE_SHEETS_SPREADSHEET_ID
npx wrangler secret put GOOGLE_SHEETS_TAB_NAME
npx wrangler secret put GOOGLE_SERVICE_ACCOUNT_JSON   # paste full JSON contents
```

If a value was previously a plain Variable and still goes missing, delete the
plain Variable in the dashboard and re-add it as a **Secret** with the same name.

## Notable porting decisions

| Express | Workers replacement |
|---|---|
| `express` | `hono` (same patterns, single `c` context) |
| `helmet` | `hono/secure-headers` |
| `express-rate-limit` | In-isolate Map limiter (`src/middleware/rateLimit.js`) |
| `cors` | Custom CORS middleware mirroring origins from Express |
| `multer` | Native `c.req.formData()` |
| `cloudinary` SDK | Direct REST + SHA-1 signed params via Web Crypto |
| `googleapis` | Direct REST + RS256 JWT signing via Web Crypto |
| `process.env` | `c.env.*` Worker bindings |
| Node `crypto` | Web Crypto API (`crypto.subtle`) |

`@supabase/supabase-js` and `sanitize-html` work as-is with the
`nodejs_compat` flag (set in `wrangler.toml`).
