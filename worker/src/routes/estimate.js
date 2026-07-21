import { Hono } from 'hono';
import { getAdmin } from '../db.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { generateEstimate } from '../services/gemini.js';
import {
  hashClientIp,
  isValidEmail,
  isValidVisitorKey,
  safeError,
} from '../utils.js';

function startOfTodayUtc() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function startOfTodayUtcIso() {
  return startOfTodayUtc().toISOString();
}

function utcDayKey() {
  return startOfTodayUtc().toISOString().slice(0, 10);
}

function nextUtcMidnightIso() {
  const d = startOfTodayUtc();
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString();
}

function dailyLimit(env) {
  const n = parseInt(env.ESTIMATE_DAILY_LIMIT || '3', 10);
  return Number.isFinite(n) && n > 0 ? n : 3;
}

function quotaPayload(limit, used) {
  return {
    limit,
    used,
    remaining: Math.max(0, limit - used),
    day: utcDayKey(),
    resetsAt: nextUtcMidnightIso(),
  };
}

async function countTodayOkGenerations(admin, ipHash, visitorKey) {
  let orFilter = `ip_hash.eq.${ipHash}`;
  if (visitorKey && isValidVisitorKey(visitorKey)) {
    orFilter += `,visitor_key.eq.${visitorKey}`;
  }
  const { count, error } = await admin
    .from('estimate_usage')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'ok')
    .gte('created_at', startOfTodayUtcIso())
    .or(orFilter);
  if (error) throw error;
  return count || 0;
}

const estimate = new Hono();

/** Current daily quota for this visitor / IP (used by the estimator UI). */
estimate.get(
  '/',
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    scope: 'estimate-quota',
    message: { error: 'Too many requests. Please try again later.' },
  }),
  async (c) => {
    const admin = getAdmin(c);
    if (!admin) return c.json({ error: 'Database not configured' }, 503);

    const visitorKey = String(c.req.query('visitor_key') || '').trim();
    const validVisitorKey = isValidVisitorKey(visitorKey) ? visitorKey : null;
    const ipHash = await hashClientIp(c);
    const limit = dailyLimit(c.env);

    try {
      const used = await countTodayOkGenerations(admin, ipHash, validVisitorKey);
      return c.json(quotaPayload(limit, used));
    } catch (err) {
      return safeError(c, 500, err.message);
    }
  },
);

estimate.post(
  '/',
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 8,
    scope: 'estimate',
    message: { error: 'Too many estimate requests. Please try again later.' },
  }),
  async (c) => {
    const admin = getAdmin(c);
    if (!admin) return c.json({ error: 'Database not configured' }, 503);

    const body = await c.req.json().catch(() => ({}));
    const {
      name,
      email,
      phone,
      company,
      budget,
      timeline,
      projectType,
      project_type,
      brief: briefField,
      message,
      visitor_key,
    } = body;

    const brief = String(briefField ?? message ?? '').trim();

    if (!isValidEmail(email)) {
      return c.json({ error: 'A valid email is required.' }, 400);
    }
    if (brief.length < 12 || brief.length > 4000) {
      return c.json({ error: 'Brief must be between 12 and 4000 characters.' }, 400);
    }

    const ipHash = await hashClientIp(c);
    const visitorKey = String(visitor_key || '').trim();
    const validVisitorKey = isValidVisitorKey(visitorKey) ? visitorKey : null;
    const limit = dailyLimit(c.env);

    try {
      const used = await countTodayOkGenerations(admin, ipHash, validVisitorKey);
      if (used >= limit) {
        return c.json(
          {
            error: `Daily limit reached (${limit} estimates per day). Resets at UTC midnight — try again tomorrow.`,
            limit_reached: true,
            ...quotaPayload(limit, used),
          },
          429,
        );
      }

      const phoneClean = phone ? String(phone).trim().slice(0, 40) : null;

      const leadSnapshot = {
        visitor_key: validVisitorKey,
        ip_hash: ipHash,
        name: name ? String(name).slice(0, 500) : null,
        email: String(email).trim().slice(0, 500),
        company: company ? String(company).slice(0, 300) : null,
        budget: budget ? String(budget).slice(0, 200) : null,
        timeline: timeline ? String(timeline).slice(0, 200) : null,
        brief: brief.slice(0, 4000),
      };

      let report;
      let model;
      try {
        ({ report, model } = await generateEstimate(c.env, {
          name: leadSnapshot.name,
          email: leadSnapshot.email,
          phone: phoneClean,
          company: leadSnapshot.company,
          budget: leadSnapshot.budget,
          timeline: leadSnapshot.timeline,
          projectType: projectType || project_type || null,
          brief: leadSnapshot.brief,
        }));
      } catch (err) {
        if (err?.message === 'AI_UNAVAILABLE') {
          await admin.from('estimate_usage').insert({
            ...leadSnapshot,
            report: null,
            model: null,
            status: 'error',
          });
          return c.json({ error: 'AI temporarily unavailable, please try again.' }, 503);
        }
        throw err;
      }

      // Phone lives in report.meta (jsonb) — no schema migration required.
      if (phoneClean && report?.meta) {
        report.meta.userPhone = phoneClean;
      }

      const { error: insertErr } = await admin.from('estimate_usage').insert({
        ...leadSnapshot,
        report,
        model,
        status: 'ok',
      });
      if (insertErr) return safeError(c, 500, insertErr.message);

      return c.json({
        report,
        model,
        ...quotaPayload(limit, used + 1),
      });
    } catch (err) {
      return safeError(c, 500, err.message);
    }
  },
);

export default estimate;
