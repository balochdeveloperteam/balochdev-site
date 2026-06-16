/**
 * Split HTML at roughly the midpoint by top-level block children (client-only).
 * @param {string} html
 * @returns {{ first: string, second: string }}
 */
export function splitHtmlAtMidpoint(html) {
  const source = String(html || '').trim();
  if (!source) return { first: '<p></p>', second: '' };

  if (typeof DOMParser === 'undefined') {
    return { first: source, second: '' };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div id="split-root">${source}</div>`, 'text/html');
  const root = doc.getElementById('split-root');
  if (!root) return { first: source, second: '' };

  const nodes = [...root.childNodes].filter((n) => {
    if (n.nodeType === Node.ELEMENT_NODE) return true;
    if (n.nodeType === Node.TEXT_NODE) return Boolean(n.textContent?.trim());
    return false;
  });

  if (nodes.length < 2) return { first: source, second: '' };

  const mid = Math.ceil(nodes.length / 2);
  const toHtml = (list) =>
    list
      .map((n) => {
        if (n.nodeType === Node.ELEMENT_NODE) return n.outerHTML;
        return n.textContent;
      })
      .join('');

  return {
    first: toHtml(nodes.slice(0, mid)) || source,
    second: toHtml(nodes.slice(mid)),
  };
}
