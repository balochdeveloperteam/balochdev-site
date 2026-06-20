const rateLimit = require('express-rate-limit');
const { hashClientIp, isValidEmail, isValidVisitorKey } = require('../services/blogEngagement');
const { generateEstimate } = require('../services/gemini');

const estimateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many estimate requests. Please try again later.' },
});

function startOfTodayUtcIso() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function dailyLimit() {
  const n = parseInt(process.env.ESTIMATE_DAILY_LIMIT || '3', 10);
  return Number.isFinite(n) && n > 0 ? n : 3;
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

function registerEstimateRoutes(app, { admin, safeError }) {
  app.post('/api/estimate', estimateLimiter, async (req, res) => {
    if (!admin) return res.status(503).json({ error: 'Database not configured' });

    const {
      name,
      email,
      phone: _phone,
      company,
      budget,
      timeline,
      brief: briefField,
      message,
      visitor_key,
    } = req.body || {};

    const brief = String(briefField ?? message ?? '').trim();

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email is required.' });
    }
    if (brief.length < 12 || brief.length > 4000) {
      return res.status(400).json({ error: 'Brief must be between 12 and 4000 characters.' });
    }

    const ipHash = hashClientIp(req);
    const visitorKey = String(visitor_key || '').trim();
    const validVisitorKey = isValidVisitorKey(visitorKey) ? visitorKey : null;
    const limit = dailyLimit();

    try {
      const used = await countTodayOkGenerations(admin, ipHash, validVisitorKey);
      if (used >= limit) {
        return res.status(429).json({
          error: `Daily limit reached (${limit} estimates per day). Try again tomorrow.`,
          limit_reached: true,
        });
      }

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
        ({ report, model } = await generateEstimate({
          name: leadSnapshot.name,
          company: leadSnapshot.company,
          budget: leadSnapshot.budget,
          timeline: leadSnapshot.timeline,
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
          return res.status(503).json({
            error: 'AI temporarily unavailable, please try again.',
          });
        }
        throw err;
      }

      const { error: insertErr } = await admin.from('estimate_usage').insert({
        ...leadSnapshot,
        report,
        model,
        status: 'ok',
      });
      if (insertErr) return safeError(res, 500, insertErr.message);

      return res.json({
        report,
        model,
        remaining: Math.max(0, limit - used - 1),
      });
    } catch (err) {
      return safeError(res, 500, err.message);
    }
  });
}

module.exports = { registerEstimateRoutes };
