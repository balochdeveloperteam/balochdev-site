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

const TITLE_SUFFIX_PIPE_SPACED = ' | BalochDev';
const TITLE_SUFFIX_EM_SPACED = ` \u2014 BalochDev`;
const TITLE_UNSUFFIXED_TOPIC_MAX = 57;
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
 * console.assert(capTitle(long).endsWith('| BalochDev') && capTitle(long).length <= 60); // full suffix survives
 * const overflow = `${'mega '.repeat(30)}xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`; // simulate >57 without suffix path
 * const u = capTitle(overflow); console.assert(/\u2026$/.test(u) && !/\|\s*B/.test(u)); // suffix dropped / no partial BalochDev
 * const d = capDescription(('word '.repeat(80)) + '|'); console.assert(/\u2026$/.test(d) && d.length <= 155 && !/[|.—,]\u2026$/.test(d));
 * ```
 */
export function capTitle(s: string, max = 60): string {
  const normalized = stripHtml(s).trim();
  if (!normalized) return '';

  const suffix = normalized.endsWith(TITLE_SUFFIX_PIPE_SPACED)
    ? TITLE_SUFFIX_PIPE_SPACED
    : normalized.endsWith(TITLE_SUFFIX_EM_SPACED)
      ? TITLE_SUFFIX_EM_SPACED
      : '';

  if (suffix) {
    let topic = stripTrailingSeparators(normalized.slice(0, normalized.length - suffix.length));
    const roomForTopic = max - suffix.length;
    /** If canonical suffix physically cannot coexist with topic in `max`, drop suffix semantics entirely (atomic rule). */
    if (suffix.length > max || roomForTopic < 1) return capPlainTitle(topic, max);
    /** Empty topic leaf (e.g. bare suffix) keeps full suffix unchanged if it fits. */
    if (!topic.length) return suffix.length <= max ? suffix : stripTrailingSeparators(suffix.slice(0, max));
    /** Topic + atomic suffix fits already. */
    if (topic.length + suffix.length <= max) return stripTrailingSeparators(`${topic}${suffix}`);

    const fitted = shortenBeforeBoundaryExclusive(topic, roomForTopic);
    if (fitted) return stripTrailingSeparators(`${fitted}${suffix}`);

    /** No word-boundary truncation can fit atomic suffix → drop branded suffix altogether. */
    return capPlainTitle(topic, max);
  }

  return capPlainTitle(normalized, max);
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
