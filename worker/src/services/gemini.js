import { catalogForPrompt, recomputeFromIds } from '../data/pricing.js';

const NARRATIVE_SCHEMA_HINT = `{
  "selectedIds": [string],
  "meta": {
    "projectTitle": string,
    "projectType": string,
    "platforms": [string]
  },
  "summary": string,
  "market": {
    "sizeNote": string,
    "audience": string,
    "monetization": string,
    "macroSeries": [ { "label": string, "value": number } ]
  },
  "recommendations": [ { "title": string, "detail": string } ],
  "nextStep": { "title": string, "detail": string, "ctaLabel": string }
}`;

function buildPrompt({ name, company, budget, timeline, brief, projectType }) {
  const clientLines = [
    name ? `Client name: ${name}` : null,
    company ? `Company: ${company}` : null,
    budget ? `Budget range: ${budget}` : null,
    timeline ? `Target timeline: ${timeline}` : null,
    projectType ? `Stated project type: ${projectType}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return `You are a senior software consultant at BalochDev (balochdev.com).

Select 1–4 package ids from the PRICE CATALOG that best match the brief. Prefer the smallest coherent set (discovery + build when useful). Do NOT invent prices, currency amounts, or catalog ids — only pick from the list.

Fill narrative fields only. market.macroSeries must be 3–5 items with numeric value on a relative 0–100 scale (complexity / effort share or market signal), each with a short label. recommendations: 3–5 concrete {title, detail} objects. nextStep: one clear follow-up with ctaLabel (e.g. "Book a scoping call").

Return ONLY valid minified JSON — no markdown, no code fences — matching EXACTLY this schema:
${NARRATIVE_SCHEMA_HINT}

PRICE CATALOG:
${catalogForPrompt()}

${clientLines ? `${clientLines}\n` : ''}Project brief:
${brief}`;
}

function stripJsonFences(text) {
  let s = String(text || '').trim();
  if (s.startsWith('```')) {
    s = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }
  return s;
}

function validateNarrativeShape(obj) {
  return (
    obj &&
    Array.isArray(obj.selectedIds) &&
    obj.selectedIds.length > 0 &&
    typeof obj.summary === 'string' &&
    obj.meta &&
    typeof obj.meta === 'object' &&
    typeof obj.meta.projectTitle === 'string' &&
    obj.market &&
    Array.isArray(obj.market.macroSeries) &&
    Array.isArray(obj.recommendations) &&
    obj.nextStep &&
    typeof obj.nextStep === 'object'
  );
}

function validateReportShape(report) {
  return (
    report &&
    report.meta &&
    typeof report.summary === 'string' &&
    Array.isArray(report.lineItems) &&
    report.lineItems.length > 0 &&
    report.totals &&
    typeof report.totals.low === 'number' &&
    typeof report.totals.high === 'number' &&
    report.timeframe &&
    report.market &&
    Array.isArray(report.market.macroSeries) &&
    Array.isArray(report.recommendations) &&
    report.nextStep &&
    typeof report.nextStep.title === 'string'
  );
}

function normalizeMacroSeries(series) {
  if (!Array.isArray(series)) return [];
  return series
    .slice(0, 6)
    .map((row) => ({
      label: String(row?.label || '').slice(0, 80),
      value: Math.min(100, Math.max(0, Number(row?.value) || 0)),
    }))
    .filter((row) => row.label);
}

function normalizeRecommendations(list) {
  if (!Array.isArray(list)) return [];
  return list
    .slice(0, 6)
    .map((row) => {
      if (typeof row === 'string') {
        return { title: row.slice(0, 120), detail: '' };
      }
      return {
        title: String(row?.title || '').slice(0, 120),
        detail: String(row?.detail || '').slice(0, 500),
      };
    })
    .filter((row) => row.title);
}

function assembleReport(narrative, { name, email, phone, company, budget, timeline }) {
  const priced = recomputeFromIds(narrative.selectedIds);
  if (!priced) return null;

  const platforms = Array.isArray(narrative.meta?.platforms)
    ? narrative.meta.platforms.map((p) => String(p).slice(0, 40)).filter(Boolean).slice(0, 8)
    : [];

  return {
    meta: {
      projectTitle: String(narrative.meta?.projectTitle || 'Project estimate').slice(0, 160),
      projectType: String(narrative.meta?.projectType || '').slice(0, 120),
      platforms,
      userName: name || null,
      userEmail: email || null,
      userPhone: phone || null,
      company: company || null,
      budgetHint: budget || null,
      timelineHint: timeline || null,
      selectedIds: priced.lineItems.map((i) => i.id),
      generatedAt: new Date().toISOString(),
    },
    summary: String(narrative.summary || '').slice(0, 2000),
    lineItems: priced.lineItems,
    totals: priced.totals,
    timeframe: priced.timeframe,
    market: {
      sizeNote: String(narrative.market?.sizeNote || '').slice(0, 400),
      audience: String(narrative.market?.audience || '').slice(0, 400),
      monetization: String(narrative.market?.monetization || '').slice(0, 400),
      macroSeries: normalizeMacroSeries(narrative.market?.macroSeries),
    },
    recommendations: normalizeRecommendations(narrative.recommendations),
    nextStep: {
      title: String(narrative.nextStep?.title || 'Book a scoping call').slice(0, 120),
      detail: String(narrative.nextStep?.detail || '').slice(0, 500),
      ctaLabel: String(narrative.nextStep?.ctaLabel || 'Contact BalochDev').slice(0, 80),
    },
  };
}

async function callGemini(env, model, prompt) {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('AI_UNAVAILABLE');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.55,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const err = new Error(res.status === 429 ? 'RATE_LIMIT' : 'API_ERROR');
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('EMPTY_RESPONSE');

  let parsed;
  try {
    parsed = JSON.parse(stripJsonFences(rawText));
  } catch {
    throw new Error('PARSE_ERROR');
  }

  if (!validateNarrativeShape(parsed)) throw new Error('INVALID_SHAPE');
  return parsed;
}

export async function generateEstimate(
  env,
  { name, email, phone, company, budget, timeline, brief, projectType },
) {
  const truncatedBrief = String(brief || '').slice(0, 4000);
  const prompt = buildPrompt({
    name,
    company,
    budget,
    timeline,
    brief: truncatedBrief,
    projectType,
  });

  const primary = env.GEMINI_MODEL || 'gemini-2.5-flash';
  const fallback = env.GEMINI_FALLBACK_MODEL || 'gemini-2.5-flash-lite';

  let narrative;
  let model;
  try {
    narrative = await callGemini(env, primary, prompt);
    model = primary;
  } catch {
    try {
      narrative = await callGemini(env, fallback, prompt);
      model = fallback;
    } catch {
      throw new Error('AI_UNAVAILABLE');
    }
  }

  const report = assembleReport(narrative, { name, email, phone, company, budget, timeline });
  if (!report || !validateReportShape(report)) {
    throw new Error('AI_UNAVAILABLE');
  }

  return { report, model };
}

export { validateReportShape };
