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

## One-time secrets (set in the Cloudflare dashboard or via CLI)

```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put CLOUDINARY_CLOUD_NAME
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
