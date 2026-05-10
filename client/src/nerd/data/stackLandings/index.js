import { AI_TECH_LANDINGS, aiIconKeyToLandingSlug } from "../technologyAiLandings.js";
import { AUTOMATION_TECH_LANDINGS } from "./automationLandings.js";
import { FRONTEND_TECH_LANDINGS } from "./frontendLandings.js";
import { BACKEND_TECH_LANDINGS } from "./backendLandings.js";
import { DATA_TECH_LANDINGS } from "./dataLandings.js";
import { NOCODE_TECH_LANDINGS } from "./nocodeLandings.js";
import { OPS_TECH_LANDINGS } from "./opsLandings.js";
import { DESIGN_TECH_LANDINGS } from "./designLandings.js";

export const STACK_CATEGORY_LABELS = {
  ai: "AI & Intelligence",
  automation: "Automation & Workflows",
  frontend: "Frontend Frameworks",
  backend: "Backends & APIs",
  data: "Databases & Search",
  nocode: "No-Code & CMS",
  ops: "Deploy & Ops",
  design: "Design & Handoff",
};

/** Key = `${categoryId}:${iconKey}` — disambiguate duplicate iconKeys across sections */
const STACK_ICON_SLUG_OVERRIDES = /** @type {Record<string, string>} */ ({
  "frontend:googlegemini": "google-ai-studio",
  "design:storybook": "storybook-chromatic",
  "backend:supabase": "supabase-edge-functions",
  "data:supabase": "supabase-postgres",
});

/**
 * @param {string} categoryId
 * @param {string} iconKey
 */
export function stackIconKeyToSlug(categoryId, iconKey) {
  const k = `${categoryId}:${iconKey}`;
  if (STACK_ICON_SLUG_OVERRIDES[k]) return STACK_ICON_SLUG_OVERRIDES[k];
  if (categoryId === "ai") return aiIconKeyToLandingSlug(iconKey);
  return iconKey;
}

/** @type {Record<string, Record<string, import('../technologyAiLandings.js').AiLandingConfig>>} */
export const STACK_TECH_LANDINGS = {
  ai: AI_TECH_LANDINGS,
  automation: AUTOMATION_TECH_LANDINGS,
  frontend: FRONTEND_TECH_LANDINGS,
  backend: BACKEND_TECH_LANDINGS,
  data: DATA_TECH_LANDINGS,
  nocode: NOCODE_TECH_LANDINGS,
  ops: OPS_TECH_LANDINGS,
  design: DESIGN_TECH_LANDINGS,
};

/**
 * @param {string | undefined} categoryId
 * @param {string | undefined} slug
 */
export function getStackLandingPage(categoryId, slug) {
  if (!categoryId || !slug) return null;
  return STACK_TECH_LANDINGS[categoryId]?.[slug] ?? null;
}

/**
 * @param {string} categoryId
 * @param {string} iconKey
 * @returns {string | undefined}
 */
export function stackToolLandingPath(categoryId, iconKey) {
  const slug = stackIconKeyToSlug(categoryId, iconKey);
  const cat = STACK_TECH_LANDINGS[categoryId];
  return cat?.[slug] ? `/technologies/${categoryId}/${slug}` : undefined;
}

/** @param {string | undefined} categoryId */
export function isValidStackCategory(categoryId) {
  return !!(categoryId && Object.prototype.hasOwnProperty.call(STACK_TECH_LANDINGS, categoryId));
}
