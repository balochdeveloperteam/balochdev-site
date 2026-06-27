/**
 * Telegram + Google Sheets notifications. Both are optional — they no-op
 * when their respective env vars are not configured.
 *
 * Google Sheets uses a service account; provide GOOGLE_SERVICE_ACCOUNT_JSON
 * (the contents of the service-account JSON, not a file path), since Workers
 * has no filesystem.
 */

export async function sendTelegramHtml(env, html) {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { ok: false, skipped: true };

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: html,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      console.error('Telegram send failed', data);
      return { ok: false, error: data.description || res.statusText };
    }
    return { ok: true };
  } catch (e) {
    console.error('Telegram error', e);
    return { ok: false, error: e.message };
  }
}

function base64UrlEncode(input) {
  let bin;
  if (input instanceof Uint8Array) {
    bin = String.fromCharCode(...input);
  } else {
    bin = unescape(encodeURIComponent(input));
  }
  return btoa(bin).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function pemToArrayBuffer(pem) {
  const stripped = pem
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/\s+/g, '');
  const binary = atob(stripped);
  const buf = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) buf[i] = binary.charCodeAt(i);
  return buf.buffer;
}

async function getGoogleAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claims = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(claims))}`;

  const keyData = pemToArrayBuffer(serviceAccount.private_key);
  const key = await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(unsigned),
  );
  const jwt = `${unsigned}.${base64UrlEncode(new Uint8Array(sig))}`;

  const tokRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const tokJson = await tokRes.json();
  if (!tokRes.ok) {
    throw new Error(tokJson?.error_description || tokJson?.error || 'Google token exchange failed');
  }
  return tokJson.access_token;
}

export async function appendGoogleSheetRow(env, row) {
  const sheetId = env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const credsJson = env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!sheetId || !credsJson) return { ok: false, skipped: true };

  let serviceAccount;
  try {
    serviceAccount = typeof credsJson === 'string' ? JSON.parse(credsJson) : credsJson;
  } catch (e) {
    console.error('Invalid GOOGLE_SERVICE_ACCOUNT_JSON', e.message);
    return { ok: false, skipped: true };
  }
  if (!serviceAccount.client_email || !serviceAccount.private_key) {
    return { ok: false, skipped: true };
  }

  try {
    const accessToken = await getGoogleAccessToken(serviceAccount);
    const tab = env.GOOGLE_SHEETS_TAB_NAME || 'Sheet1';
    const range = encodeURIComponent(`${tab}!A:Z`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [row] }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error('Google Sheets append failed', data);
      return { ok: false, error: data?.error?.message || res.statusText };
    }
    return { ok: true };
  } catch (e) {
    console.error('Google Sheets error', e.message || e);
    return { ok: false, error: e.message };
  }
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatTelegramMessage(payload) {
  const lines = [
    `<b>New ${escapeHtml(payload.form_type)}</b>`,
    `<b>Name:</b> ${escapeHtml(payload.name)}`,
    `<b>Email:</b> ${escapeHtml(payload.email)}`,
  ];
  if (payload.phone) lines.push(`<b>Phone:</b> ${escapeHtml(payload.phone)}`);
  if (payload.company) lines.push(`<b>Company:</b> ${escapeHtml(payload.company)}`);
  if (payload.message) lines.push(`<b>Message:</b>\n${escapeHtml(payload.message)}`);
  if (payload.meta && Object.keys(payload.meta).length) {
    lines.push(`<b>Meta:</b>\n<code>${escapeHtml(JSON.stringify(payload.meta))}</code>`);
  }
  lines.push(`<i>${new Date().toISOString()}</i>`);
  return lines.join('\n');
}

export function sheetRowFromPayload(payload) {
  const ts = new Date().toISOString();
  return [
    ts,
    payload.form_type || '',
    payload.name || '',
    payload.email || '',
    payload.phone || '',
    payload.company || '',
    payload.message || '',
    payload.meta ? JSON.stringify(payload.meta) : '',
  ];
}
