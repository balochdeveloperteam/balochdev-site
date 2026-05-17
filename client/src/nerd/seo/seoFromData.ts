/** Normalize copy from CMS-ish strings for meta tags (no paraphrasing). */

const TITLE_TRAILING_SEP = /(?:\s+|,|\||·|\.|‐|‑|–|—|−|-)+$/u;

/** Collapses runs of spaces after HTML stripping. */
export function stripHtml(s: string): string {
  return String(s)
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripTrailingSeparators(text: string): string {
  let prev = '';
  let r = text.trimEnd();
  while (r !== prev) {
    prev = r;
    r = r.replace(TITLE_TRAILING_SEP, '').trimEnd();
    /** Drop dangling "&" often left when the next clause is clipped (not a headline token). */
    r = r.replace(/(?:\s*&)+\s*$/u, '').trimEnd();
  }
  return r;
}

/**
 * Canonical emitted brand tail for `<title>` (atomic in capTitle — never shorten to "| Ba…").
 * CMS copy may arrive as "… | BalochDev" or "… — BalochDev"; we always normalize emits to this pipe form.
 */
const TITLE_BRAND_SUFFIX = ' | BalochDev';

/** Accepted source suffix for stripping topic only (normalized output still uses TITLE_BRAND_SUFFIX). */
const TITLE_SOURCE_SUFFIX_EM_DASH = ` \u2014 BalochDev`;
const TITLE_UNSUFFIXED_TOPIC_MAX = 57;

const BY_BRAND_SUFFIX = /\s+by\s+BalochDev$/iu;
const ELLIPSIS = '\u2026';
const DESCRIPTION_BODY_MAX = 152;

/**
 * Keeps strictly before the last whitespace or hyphen-dash in `text.slice(0, limit)` (exclusive).
 * Returns `null` when no boundary lies inside that window (single overlong token case).
 */
function shortenBeforeBoundaryExclusive(text: string, limit: number): string | null {
  const raw = stripTrailingSeparators(text.trim());
  if (!raw) return raw;
  if (raw.length <= limit) return raw;
  const clip = raw.slice(0, limit);
  let breakIdx = Math.max(
    clip.lastIndexOf(' '),
    clip.lastIndexOf('-'),
    clip.lastIndexOf('\u2010'),
    clip.lastIndexOf('\u2011'),
    clip.lastIndexOf('\u2013'),
    clip.lastIndexOf('\u2014'),
  );
  if (breakIdx <= 0) return null;
  const out = stripTrailingSeparators(raw.slice(0, breakIdx).trimEnd());
  return out.length ? out : null;
}

function capPlainTitle(normalizedTopic: string, max: number): string {
  const t = stripTrailingSeparators(normalizedTopic.trim());
  if (!t) return '';
  if (t.length <= max) return t;
  /** First try a clean boundary before ellipsis (`…` consumes one visible slot toward `max`). */
  const wordish = shortenBeforeBoundaryExclusive(t, TITLE_UNSUFFIXED_TOPIC_MAX);
  if (wordish)
    return stripTrailingSeparators(`${stripTrailingSeparators(wordish)}${ELLipsis}`);
  /** One very long token: hard cap topic head + ellipsis (cannot satisfy inner word-boundary rule). */
  const headBudget = Math.max(0, max - ELLIPSIS.length);
  return stripTrailingSeparators(`${stripTrailingSeparators(t.slice(0, headBudget))}${ELLIPSIS}`);
}

/**
 * Assert-style checks — run manually, e.g. in Node after importing this module:
 * ```
 * console.assert(capTitle('Short topic | BalochDev') === 'Short topic | BalochDev'); // branded short
 * const long = `${'phrase '.repeat(12)}never mid brand | BalochDev`;
 * console.assert(capTitle(long).endsWith('| BalochDev') && capTitle(long).length <= 60); // full atomic suffix survives
 * console.assert(capTitle('Legacy \u2014 BalochDev').endsWith('| BalochDev')); // em-dash CMS join normalizes to " | BalochDev"
 * const overflow = `${'mega '.repeat(30)}xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`; // simulate >57 without suffix path
 * const u = capTitle(overflow); console.assert(/\u2026$/.test(u) && !/\|\s*B/.test(u)); // suffix dropped / no partial BalochDev
 * const d = capDescription(('word '.repeat(80)) + '|'); console.assert(/\u2026$/.test(d) && d.length <= 155 && !/[|.—,]\u2026$/.test(d));
 * ```
 */
export function capTitle(s: string, max = 60): string {
  const normalized = stripHtml(s).trim();
  if (!normalized) return '';

  const sourceSuffix = normalized.endsWith(TITLE_BRAND_SUFFIX)
    ? TITLE_BRAND_SUFFIX
    : normalized.endsWith(TITLE_SOURCE_SUFFIX_EM_DASH)
      ? TITLE_SOURCE_SUFFIX_EM_DASH
      : '';

  if (sourceSuffix) {
    /** Always emit TITLE_BRAND_SUFFIX so topic and brand never abut without " | ". */
    const brand = TITLE_BRAND_SUFFIX;
    let topic = stripTrailingSeparators(
      normalized.slice(0, normalized.length - sourceSuffix.length),
    );
    const roomForTopic = max - brand.length;
    /** If brand physically cannot coexist with topic in `max`, drop branded suffix entirely (atomic rule). */
    if (brand.length > max || roomForTopic < 1) return capPlainTitle(topic, max);
    /** Empty topic (bare brand in source): keep canonical brand literal if it fits. */
    if (!topic.length) return brand.length <= max ? brand : stripTrailingSeparators(brand.slice(0, max));
    /** Whole line fits ≤ max. */
    if (topic.length + brand.length <= max) return stripTrailingSeparators(`${topic}${brand}`);

    const fitted = shortenBeforeBoundaryExclusive(topic, roomForTopic);
    if (fitted) return stripTrailingSeparators(`${fitted}${brand}`);

    /** No word-boundary fit for topic + atomic brand → unbranded ellipsis title. */
    return capPlainTitle(topic, max);
  }

  return capPlainTitle(normalized, max);
}

/**
 * Hand-authored `<title>` copy from static pages: aligns `… — BalochDev` / `… by BalochDev` with `capTitle` pipe emits;
 * avoids appending another `| BalochDev` when the phrase already mentions BalochDev (e.g. About / Contact).
 */
export function metaTitleFromPublicBrief(verbatimTitle: string, max = 60): string {
  const t = stripHtml(verbatimTitle).trim();
  if (!t) return t;

  const emTail = TITLE_SOURCE_SUFFIX_EM_DASH;
  const pipeTail = TITLE_BRAND_SUFFIX;

  if (t.endsWith(pipeTail) || t.endsWith(emTail)) return capTitle(t, max);

  if (BY_BRAND_SUFFIX.test(t)) {
    const base = stripTrailingSeparators(t.replace(BY_BRAND_SUFFIX, '').trimEnd());
    return capTitle(`${base}${emTail}`, max);
  }

  return capPlainTitle(t, max);
}

export function capDescription(s: string, max = 155): string {
  const base = stripHtml(s).trim();
  if (!base) return '';
  if (base.length <= max) return stripTrailingSeparators(base);

  let shortened = shortenBeforeBoundaryExclusive(base, DESCRIPTION_BODY_MAX);
  if (!shortened) {
    for (let probe = DESCRIPTION_BODY_MAX - 1; probe >= 16; probe--) {
      shortened = shortenBeforeBoundaryExclusive(base, probe);
      if (shortened) break;
    }
  }
  const head =
    shortened && shortened.length ? shortened : stripTrailingSeparators(base.slice(0, DESCRIPTION_BODY_MAX));
  return `${stripTrailingSeparators(head)}${ELLIPSIS}`;
}

export function h1FromMetaTitle(metaTitle: string): string {
  return stripHtml(metaTitle).replace(/\s\|\sBalochDev$/u, '').replace(/\s—\sBalochDev$/u, '').trim();
}
