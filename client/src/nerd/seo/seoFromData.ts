/** Normalize copy from CMS-ish strings for meta tags (no paraphrasing). */

export function stripHtml(s: string): string {
  return String(s)
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function capTitle(s: string, max = 60): string {
  const t = stripHtml(s).trim();
  if (!t) return '';
  return t.length <= max ? t : t.slice(0, max).trimEnd();
}

export function capDescription(s: string, max = 155): string {
  const t = stripHtml(s).trim();
  if (!t) return '';
  return t.length <= max ? t : t.slice(0, max).trimEnd();
}

export function h1FromMetaTitle(metaTitle: string): string {
  return stripHtml(metaTitle).replace(/\s\|\sBalochDev$/u, '').replace(/\s—\sBalochDev$/u, '').trim();
}
