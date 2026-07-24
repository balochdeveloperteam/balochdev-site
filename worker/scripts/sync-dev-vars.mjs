import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const envPath = path.resolve(root, '../server/.env');
const outPath = path.join(root, '.dev.vars');

const raw = fs.readFileSync(envPath, 'utf8');
const map = {};
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (!m) continue;
  let v = m[2].trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  map[m[1]] = v;
}

const keys = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'GEMINI_API_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];
const missing = keys.filter((k) => !map[k]);
if (missing.length) {
  console.error('Missing keys in server/.env:', missing.join(', '));
  process.exit(1);
}

const ip = map.IP_HASH_SECRET || 'local-dev-ip-hash-secret-change-me-32';
const escape = (v) => String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const out = [
  `SUPABASE_URL="${escape(map.SUPABASE_URL)}"`,
  `SUPABASE_SERVICE_ROLE_KEY="${escape(map.SUPABASE_SERVICE_ROLE_KEY)}"`,
  `GEMINI_API_KEY="${escape(map.GEMINI_API_KEY)}"`,
  `CLOUDINARY_CLOUD_NAME="${escape(map.CLOUDINARY_CLOUD_NAME)}"`,
  `CLOUDINARY_API_KEY="${escape(map.CLOUDINARY_API_KEY)}"`,
  `CLOUDINARY_API_SECRET="${escape(map.CLOUDINARY_API_SECRET)}"`,
  `IP_HASH_SECRET="${escape(ip)}"`,
  'NODE_ENV="development"',
  'CORS_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:5174,https://balochdev.com,https://www.balochdev.com"',
  '',
].join('\n');

fs.writeFileSync(outPath, out);
console.log('Wrote worker/.dev.vars from server/.env');
