/**
 * Imported by scripts/enumerate-routes.mjs via an esbuild Node bundle — keeps
 * service / tech / resources slugs in sync with bundled app data.
 */
import { SERVICE_DETAIL_LANDINGS } from '../src/nerd/data/serviceDetailLandings.ts';
import { SERVICE_PRACTICE_LANDINGS } from '../src/nerd/data/servicePracticeLandings.ts';
import { RESOURCE_PAGES } from '../src/nerd/data/resourcePages.js';
import { STACK_TECH_LANDINGS } from '../src/nerd/data/stackLandings/index.js';

export function collectBundledRoutePieces() {
  const serviceDetailSlugs = Object.keys(SERVICE_DETAIL_LANDINGS);
  const practiceIds = /** @type {string[]} */ (Object.keys(SERVICE_PRACTICE_LANDINGS));
  const resourceSlugs = Object.keys(RESOURCE_PAGES);

  /** @type {string[]} */
  const techPathnames = [];
  for (const categoryId of Object.keys(STACK_TECH_LANDINGS)) {
    const section = STACK_TECH_LANDINGS[categoryId];
    if (!section || typeof section !== 'object') continue;
    for (const slug of Object.keys(section)) {
      techPathnames.push(`/technologies/${categoryId}/${slug}`);
    }
  }

  return {
    serviceDetailSlugs,
    practiceIds,
    resourceSlugs,
    techPathnames,
  };
}
