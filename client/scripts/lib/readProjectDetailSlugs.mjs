import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Parses string `slug: "..."` fields from canonical `projects.ts` (bundled PNG
 * imports block Node TS imports). Mirrors non-null slug rows only.
 *
 * Single source path: {@link ../../../src/nerd/data/projects.ts}
 */
export function readProjectDetailSlugsFromCanonicalFile() {
  const path = join(__dirname, '../../src/nerd/data/projects.ts');
  const src = readFileSync(path, 'utf8');
  const re = /^\s+slug:\s*"([^"]+)"\s*,?\s*$/gm;
  /** @type {string[]} */
  const list = [];
  let m;
  while ((m = re.exec(src)) !== null) list.push(m[1]);
  return [...new Set(list)];
}
