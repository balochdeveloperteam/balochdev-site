/**
 * Authoritative pricing catalog for AI estimates.
 * Gemini may only select ids from this list; prices are recomputed server-side.
 * Bands align with client/src/nerd/data/serviceDetailLandings.ts.
 */

/** @typedef {{ id: string, label: string, category: string, low: number, high: number, calendarDaysLow?: number, calendarDaysHigh?: number, requiresCall?: boolean }} PricingItem */

/** @type {PricingItem[]} */
export const PRICING_CATALOG = [
  // Starter / micro (entry from ~$300 — matches public “from $300” messaging)
  { id: 'starter-landing', label: 'Single landing page (content-ready)', category: 'starter', low: 300, high: 1200, calendarDaysLow: 3, calendarDaysHigh: 10 },
  { id: 'starter-site-lite', label: 'Lite brochure site (3–5 pages)', category: 'starter', low: 800, high: 2500, calendarDaysLow: 7, calendarDaysHigh: 21 },
  { id: 'starter-fix-flow', label: 'Lead form + email notify', category: 'starter', low: 300, high: 900, calendarDaysLow: 2, calendarDaysHigh: 7 },
  { id: 'starter-automation', label: 'Small automation (1–3 steps)', category: 'starter', low: 400, high: 1500, calendarDaysLow: 2, calendarDaysHigh: 10 },
  { id: 'starter-chatbot-lite', label: 'Lite FAQ chatbot (single channel)', category: 'starter', low: 900, high: 3500, calendarDaysLow: 7, calendarDaysHigh: 21 },
  { id: 'starter-brand-mini', label: 'Mini brand pack (logo + colors)', category: 'starter', low: 500, high: 1800, calendarDaysLow: 5, calendarDaysHigh: 14 },
  { id: 'starter-fix', label: 'Quick fix / small change pack', category: 'starter', low: 300, high: 800, calendarDaysLow: 1, calendarDaysHigh: 5 },

  // Discovery / planning
  { id: 'discovery-web', label: 'Web planning sprint', category: 'discovery', low: 2500, high: 7000, calendarDaysLow: 7, calendarDaysHigh: 14 },
  { id: 'discovery-ai', label: 'AI discovery & written plan', category: 'discovery', low: 2500, high: 6000, calendarDaysLow: 7, calendarDaysHigh: 14 },
  { id: 'discovery-mobile', label: 'Mobile discovery', category: 'discovery', low: 2500, high: 6000, calendarDaysLow: 7, calendarDaysHigh: 14 },
  { id: 'discovery-saas', label: 'SaaS discovery', category: 'discovery', low: 4000, high: 12000, calendarDaysLow: 7, calendarDaysHigh: 14 },
  { id: 'discovery-mvp', label: 'MVP workshop', category: 'discovery', low: 1500, high: 4000, calendarDaysLow: 3, calendarDaysHigh: 7 },
  { id: 'discovery-chatbot', label: 'Chatbot discovery', category: 'discovery', low: 2000, high: 5000, calendarDaysLow: 3, calendarDaysHigh: 7 },
  { id: 'discovery-rag', label: 'RAG discovery', category: 'discovery', low: 2500, high: 7000, calendarDaysLow: 7, calendarDaysHigh: 14 },
  { id: 'discovery-agent', label: 'Agent discovery', category: 'discovery', low: 3000, high: 8000, calendarDaysLow: 7, calendarDaysHigh: 14 },
  { id: 'discovery-commerce', label: 'Commerce strategy + stack pick', category: 'discovery', low: 2500, high: 8000, calendarDaysLow: 3, calendarDaysHigh: 10 },
  { id: 'discovery-automation', label: 'Automation audit', category: 'discovery', low: 1500, high: 4000, calendarDaysLow: 2, calendarDaysHigh: 5 },
  { id: 'discovery-integration', label: 'Integration plan', category: 'discovery', low: 2000, high: 6000, calendarDaysLow: 3, calendarDaysHigh: 7 },

  // Web
  { id: 'web-marketing', label: 'Marketing / lead site', category: 'web', low: 12000, high: 45000, calendarDaysLow: 28, calendarDaysHigh: 56 },
  { id: 'web-product', label: 'Product web app', category: 'web', low: 45000, high: 120000, calendarDaysLow: 56, calendarDaysHigh: 126 },

  // Mobile
  { id: 'mobile-android-mvp', label: 'Single-role Android MVP', category: 'mobile', low: 20000, high: 58000, calendarDaysLow: 42, calendarDaysHigh: 84 },
  { id: 'mobile-android-complex', label: 'Multi-module / offline-heavy Android', category: 'mobile', low: 58000, high: 140000, calendarDaysLow: 84, calendarDaysHigh: 154 },
  { id: 'mobile-cross-mvp', label: 'Cross-platform mobile MVP (Flutter / RN)', category: 'mobile', low: 18000, high: 55000, calendarDaysLow: 28, calendarDaysHigh: 70 },
  { id: 'mobile-cross-plus', label: 'Cross-platform mobile MVP+', category: 'mobile', low: 55000, high: 95000, calendarDaysLow: 56, calendarDaysHigh: 98 },

  // AI / RAG / agents / chatbots / voice
  { id: 'ai-mvp-feature', label: 'MVP AI feature', category: 'ai', low: 12000, high: 45000, calendarDaysLow: 28, calendarDaysHigh: 56 },
  { id: 'ai-multi-workflow', label: 'Multi-workflow / agents program', category: 'ai', low: 45000, high: 120000, calendarDaysLow: 56, calendarDaysHigh: 112, requiresCall: true },
  { id: 'rag-mvp', label: 'MVP RAG assistant', category: 'ai', low: 15000, high: 48000, calendarDaysLow: 28, calendarDaysHigh: 56 },
  { id: 'rag-enterprise', label: 'Enterprise RAG', category: 'ai', low: 48000, high: 120000, calendarDaysLow: 56, calendarDaysHigh: 112, requiresCall: true },
  { id: 'agent-mvp', label: 'Single-domain agent MVP', category: 'ai', low: 18000, high: 55000, calendarDaysLow: 28, calendarDaysHigh: 56 },
  { id: 'agent-regulated', label: 'Multi-tool / regulated agents', category: 'ai', low: 55000, high: 140000, calendarDaysLow: 70, calendarDaysHigh: 126, requiresCall: true },
  { id: 'chatbot-mvp', label: 'MVP chatbot (1–2 channels)', category: 'ai', low: 10000, high: 35000, calendarDaysLow: 21, calendarDaysHigh: 42 },
  { id: 'chatbot-omni', label: 'Omnichannel chatbot + RAG', category: 'ai', low: 35000, high: 90000, calendarDaysLow: 42, calendarDaysHigh: 98 },
  { id: 'voice-pilot', label: 'Voice AI pilot line', category: 'ai', low: 18000, high: 52000, calendarDaysLow: 28, calendarDaysHigh: 56 },
  { id: 'voice-scaled', label: 'Scaled voice AI program', category: 'ai', low: 52000, high: 130000, calendarDaysLow: 56, calendarDaysHigh: 112, requiresCall: true },

  // SaaS / MVP
  { id: 'saas-mvp', label: 'MVP SaaS', category: 'saas', low: 55000, high: 130000, calendarDaysLow: 70, calendarDaysHigh: 112 },
  { id: 'saas-growth', label: 'Growth SaaS', category: 'saas', low: 130000, high: 280000, calendarDaysLow: 112, calendarDaysHigh: 210, requiresCall: true },
  { id: 'mvp-focused', label: 'Focused MVP (web or mobile slice)', category: 'mvp', low: 18000, high: 55000, calendarDaysLow: 28, calendarDaysHigh: 70 },
  { id: 'mvp-plus', label: 'MVP+', category: 'mvp', low: 55000, high: 95000, calendarDaysLow: 56, calendarDaysHigh: 98 },

  // No-code / hybrid
  { id: 'hybrid-builder', label: 'Builder MVP + API (Bubble / hybrid)', category: 'nocode', low: 12000, high: 38000, calendarDaysLow: 21, calendarDaysHigh: 56 },
  { id: 'hybrid-scale', label: 'Scale bridge (workers, monitoring)', category: 'nocode', low: 38000, high: 95000, calendarDaysLow: 42, calendarDaysHigh: 98 },

  // Commerce
  { id: 'commerce-store', label: 'Store implementation', category: 'commerce', low: 15000, high: 55000, calendarDaysLow: 28, calendarDaysHigh: 70 },
  { id: 'commerce-complex', label: 'Complex / headless / multi-region commerce', category: 'commerce', low: 55000, high: 150000, calendarDaysLow: 70, calendarDaysHigh: 154, requiresCall: true },

  // Automation / integrations
  { id: 'automation-core', label: 'Core automation flow (3–8 steps)', category: 'automation', low: 6000, high: 22000, calendarDaysLow: 7, calendarDaysHigh: 21 },
  { id: 'automation-program', label: 'Automation program (many flows / n8n)', category: 'automation', low: 22000, high: 75000, calendarDaysLow: 21, calendarDaysHigh: 70 },
  { id: 'integration-bridge', label: 'Single high-value API bridge', category: 'integration', low: 10000, high: 35000, calendarDaysLow: 14, calendarDaysHigh: 42 },
  { id: 'integration-platform', label: 'Integration platform program', category: 'integration', low: 35000, high: 120000, calendarDaysLow: 42, calendarDaysHigh: 112, requiresCall: true },

  // Design
  { id: 'ux-product', label: 'Product UI (single platform)', category: 'design', low: 12000, high: 38000, calendarDaysLow: 21, calendarDaysHigh: 49 },
  { id: 'ux-complex', label: 'Multi-surface / complex admin UI', category: 'design', low: 38000, high: 95000, calendarDaysLow: 49, calendarDaysHigh: 98 },
  { id: 'brand-kit', label: 'Full identity kit', category: 'design', low: 18000, high: 45000, calendarDaysLow: 28, calendarDaysHigh: 49 },
  { id: 'design-system-mvp', label: 'MVP design system', category: 'design', low: 28000, high: 75000, calendarDaysLow: 42, calendarDaysHigh: 84 },

  // Support (monthly — flagged; not summed into project totals the same way if alone)
  { id: 'support-essential', label: 'Essential retainer (monthly)', category: 'support', low: 3500, high: 9000, requiresCall: true },
  { id: 'support-growth', label: 'Growth retainer (monthly)', category: 'support', low: 9000, high: 22000, requiresCall: true },
];

const BY_ID = new Map(PRICING_CATALOG.map((item) => [item.id, item]));

export function getPricingItem(id) {
  return BY_ID.get(String(id || '')) || null;
}

/** Resolve catalog ids even if the model returns a close label or casing mismatch. */
export function resolveCatalogIds(rawIds) {
  const out = [];
  const seen = new Set();
  for (const raw of rawIds || []) {
    const token = String(raw || '').trim();
    if (!token) continue;

    let item = BY_ID.get(token) || BY_ID.get(token.toLowerCase());
    if (!item) {
      const needle = token.toLowerCase();
      item =
        PRICING_CATALOG.find((row) => row.id.toLowerCase() === needle) ||
        PRICING_CATALOG.find((row) => row.label.toLowerCase() === needle) ||
        PRICING_CATALOG.find((row) => needle.includes(row.id.toLowerCase()) && row.id.length >= 6) ||
        null;
    }
    if (!item || seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item.id);
  }
  return out;
}

export function catalogForPrompt() {
  return PRICING_CATALOG.map((item) => {
    const days =
      item.calendarDaysLow != null && item.calendarDaysHigh != null
        ? ` · ${item.calendarDaysLow}–${item.calendarDaysHigh} calendar days`
        : item.category === 'support'
          ? ' · monthly'
          : '';
    const call = item.requiresCall ? ' · requires call' : '';
    return `- ${item.id}: ${item.label} ($${item.low}–$${item.high} USD${days}${call})`;
  }).join('\n');
}

/**
 * Resolve selected catalog ids into priced line items + totals.
 * @param {string[]} selectedIds
 */
export function recomputeFromIds(selectedIds) {
  const seen = new Set();
  const lineItems = [];
  let low = 0;
  let high = 0;
  let calendarDaysLow = 0;
  let calendarDaysHigh = 0;
  let hasCalendar = false;
  let requiresCall = false;
  let hasMonthly = false;

  for (const rawId of selectedIds || []) {
    const id = String(rawId || '').trim();
    if (!id || seen.has(id)) continue;
    const item = getPricingItem(id);
    if (!item) continue;
    seen.add(id);

    lineItems.push({
      id: item.id,
      label: item.label,
      category: item.category,
      low: item.low,
      high: item.high,
      calendarDaysLow: item.calendarDaysLow ?? null,
      calendarDaysHigh: item.calendarDaysHigh ?? null,
      requiresCall: Boolean(item.requiresCall),
      billing: item.category === 'support' ? 'monthly' : 'project',
    });

    low += item.low;
    high += item.high;
    if (item.requiresCall) requiresCall = true;
    if (item.category === 'support') {
      hasMonthly = true;
    } else if (item.calendarDaysLow != null && item.calendarDaysHigh != null) {
      hasCalendar = true;
      calendarDaysLow += item.calendarDaysLow;
      calendarDaysHigh += item.calendarDaysHigh;
    }
  }

  if (!lineItems.length) {
    return null;
  }

  return {
    lineItems,
    totals: {
      currency: 'USD',
      low,
      high,
      notes: hasMonthly
        ? 'Totals include monthly retainer line(s); project fees are one-time studio bands.'
        : 'Ballpark from BalochDev catalog bands — not a formal quote.',
      requiresCall,
    },
    timeframe: hasCalendar
      ? {
          calendarDaysLow,
          calendarDaysHigh,
          label: `${calendarDaysLow}–${calendarDaysHigh} calendar days (parallelism may shorten)`,
        }
      : {
          calendarDaysLow: null,
          calendarDaysHigh: null,
          label: hasMonthly ? 'Ongoing monthly engagement' : 'Timeline TBD on scoping call',
        },
  };
}
