const REPORT_SCHEMA_HINT = `{
  "project_title": string,
  "summary": string,
  "project_type": string,
  "platforms": [string],
  "cost": { "currency": "USD", "low": number, "likely": number, "high": number, "notes": string },
  "timeline": { "total_weeks": number, "phases": [ { "name": string, "weeks": number } ] },
  "tech_stack": { "frontend": [string], "backend": [string], "infra": [string] },
  "market": { "size_note": string, "audience": string, "monetization": string },
  "competitors": [ { "name": string, "note": string } ],
  "complexity": { "score": number, "label": string, "drivers": [string] },
  "risks": [string],
  "recommendations": [string]
}`;

function buildPrompt({ name, company, budget, timeline, brief }) {
  const clientLines = [
    name ? `Client name: ${name}` : null,
    company ? `Company: ${company}` : null,
    budget ? `Budget range: ${budget}` : null,
    timeline ? `Target timeline: ${timeline}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  return `You are a senior software consultant at BalochDev (balochdev.com), a studio that builds web, mobile, and AI-powered products for startups and SMEs.

Analyze the project brief below and produce a realistic ballpark estimate for a freelance/studio engagement. Use USD. Cost low/likely/high should reflect a sensible spread (not identical numbers). Timeline total_weeks and phase weeks must be positive integers; include 4–6 phases (e.g. Discovery, Design, Build, QA, Launch). Complexity score is 0–100. Include 3–4 competitors and 3–5 risks.

Infer project_type from the brief (e.g. "Multi-vendor marketplace", "SaaS dashboard", "Mobile consumer app"). Infer platforms from the brief as a string array (e.g. ["Web"], ["Web","iOS","Android"] — only platforms clearly implied). Set cost.notes to one concise line explaining the basis for the cost range. Set market.monetization to one concise sentence (not a list). Set recommendations to an array of concrete next steps for the client.

Return ONLY valid minified JSON — no markdown, no code fences, no commentary — matching EXACTLY this schema:
${REPORT_SCHEMA_HINT}

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

function validateReportShape(obj) {
  return (
    obj &&
    typeof obj.project_title === 'string' &&
    obj.cost &&
    typeof obj.cost === 'object' &&
    obj.timeline &&
    typeof obj.timeline === 'object'
  );
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
        temperature: 0.6,
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

  if (!validateReportShape(parsed)) throw new Error('INVALID_SHAPE');
  return parsed;
}

export async function generateEstimate(env, { name, company, budget, timeline, brief }) {
  const truncatedBrief = String(brief || '').slice(0, 4000);
  const prompt = buildPrompt({
    name,
    company,
    budget,
    timeline,
    brief: truncatedBrief,
  });

  const primary = env.GEMINI_MODEL || 'gemini-2.5-flash';
  const fallback = env.GEMINI_FALLBACK_MODEL || 'gemini-2.5-flash-lite';

  try {
    const report = await callGemini(env, primary, prompt);
    return { report, model: primary };
  } catch {
    try {
      const report = await callGemini(env, fallback, prompt);
      return { report, model: fallback };
    } catch {
      throw new Error('AI_UNAVAILABLE');
    }
  }
}
