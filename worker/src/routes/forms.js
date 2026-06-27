import { Hono } from 'hono';
import { getAdmin } from '../db.js';
import { rateLimit } from '../middleware/rateLimit.js';
import {
  sendTelegramHtml,
  appendGoogleSheetRow,
  formatTelegramMessage,
  sheetRowFromPayload,
} from '../services/notify.js';
import { clientIp, safeError } from '../utils.js';

async function handleFormPayload(c, form_type, body) {
  const admin = getAdmin(c);
  const {
    name,
    email,
    phone,
    company,
    message,
    budget,
    timeline,
    details,
    form_type: _formTypeIgnored,
    website, // honeypot
    ...rest
  } = body || {};

  // Silent reject for bots
  if (website) return c.json({ ok: true });

  if (!name || !email || !message) {
    return c.json({ error: 'name, email, and message are required' }, 400);
  }

  const meta = { ...rest };
  if (budget) meta.budget = budget;
  if (timeline) meta.timeline = timeline;
  if (details) meta.details = details;

  const payload = {
    form_type,
    name: String(name).slice(0, 500),
    email: String(email).slice(0, 500),
    phone: phone ? String(phone).slice(0, 100) : null,
    company: company ? String(company).slice(0, 300) : null,
    message: String(message).slice(0, 15000),
    meta,
    client_ip: clientIp(c),
  };

  if (admin) {
    const { error } = await admin.from('form_submissions').insert(payload);
    if (error) return safeError(c, 500, error.message, 'Could not save submission');
  }

  const tg = await sendTelegramHtml(c.env, formatTelegramMessage(payload));
  const sheet = await appendGoogleSheetRow(c.env, sheetRowFromPayload(payload));

  return c.json({
    ok: true,
    telegram: tg.skipped ? 'disabled' : tg.ok ? 'sent' : 'failed',
    sheets: sheet.skipped ? 'disabled' : sheet.ok ? 'appended' : 'failed',
  });
}

const formLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  scope: 'form',
  message: { error: 'Too many submissions. Please try again later.' },
});

const forms = new Hono();

forms.post('/submit', formLimiter, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const form_type = body?.form_type || 'contact';
  if (!['contact', 'proposal', 'estimate'].includes(form_type)) {
    return c.json({ error: 'Invalid form_type' }, 400);
  }
  return handleFormPayload(c, form_type, body);
});

// Backward-compatible alias mounted directly on /api/contact in index.js
export async function legacyContactHandler(c) {
  const body = await c.req.json().catch(() => ({}));
  return handleFormPayload(c, 'contact', body);
}

export { formLimiter };
export default forms;
