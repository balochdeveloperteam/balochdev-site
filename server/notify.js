/**
 * Optional integrations: Telegram + Google Sheets append.
 * Set env vars to enable; API still stores rows in Supabase when configured.
 */

async function sendTelegramHtml(html) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
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

async function appendGoogleSheetRow(row) {
  const sheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!sheetId || !keyFile) return { ok: false, skipped: true };

  let google;
  try {
    // Lazy require so server runs without googleapis when Sheets is disabled
    // eslint-disable-next-line import/no-extraneous-dependencies, global-require
    google = require('googleapis').google;
  } catch (e) {
    console.error('googleapis not installed; run npm install in server/', e.message);
    return { ok: false, skipped: true };
  }

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const tab = process.env.GOOGLE_SHEETS_TAB_NAME || 'Sheet1';
    const range = `${tab}!A:Z`;

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });
    return { ok: true };
  } catch (e) {
    console.error('Google Sheets append failed', e.message || e);
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

function formatTelegramMessage(payload) {
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

function sheetRowFromPayload(payload) {
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

module.exports = {
  sendTelegramHtml,
  appendGoogleSheetRow,
  formatTelegramMessage,
  sheetRowFromPayload,
};
