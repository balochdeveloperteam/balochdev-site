/**
 * Cloudinary integration for Cloudflare Workers — uses the Upload REST API
 * directly with signed parameters (SHA-1 of params + api_secret) so we don't
 * need the Node-only `cloudinary` SDK.
 */

export const ALLOWED_FOLDERS = new Set([
  'balochdev/blog',
  'balochdev/members',
  'balochdev/site',
  'balochdev/ads',
]);

async function sha1Hex(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-1', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function assertConfigured(env) {
  const missing = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].filter(
    (k) => !String(env[k] || '').trim(),
  );
  if (missing.length) {
    throw new Error(`Cloudinary not configured: missing ${missing.join(', ')}`);
  }
}

/**
 * Build the Cloudinary signature string for the given parameters.
 * Cloudinary rule: alphabetical sort, "key=value" joined with "&", append api_secret, SHA-1.
 */
async function signParams(params, apiSecret) {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
  return sha1Hex(`${toSign}${apiSecret}`);
}

/**
 * @param {File|Blob} file
 * @param {{ folder: string, publicId?: string }} options
 * @param {object} env Worker env bindings (with CLOUDINARY_* secrets)
 */
export async function uploadImage(file, { folder, publicId }, env) {
  assertConfigured(env);
  if (!folder || !ALLOWED_FOLDERS.has(folder)) {
    throw new Error(`Invalid folder. Allowed: ${[...ALLOWED_FOLDERS].join(', ')}`);
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signedParams = { folder, timestamp };
  if (publicId) signedParams.public_id = publicId;

  const signature = await signParams(signedParams, env.CLOUDINARY_API_SECRET);

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', env.CLOUDINARY_API_KEY);
  form.append('timestamp', timestamp);
  form.append('folder', folder);
  if (publicId) form.append('public_id', publicId);
  form.append('signature', signature);

  const url = `https://api.cloudinary.com/v1_1/${encodeURIComponent(env.CLOUDINARY_CLOUD_NAME)}/image/upload`;
  const res = await fetch(url, { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error?.message || `Cloudinary upload failed (${res.status})`);
  }

  return {
    secureUrl: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
  };
}

/**
 * Destroy a Cloudinary asset by public_id. Signed REST call (no SDK).
 * Returns Cloudinary's `result` string: 'ok' when destroyed, 'not found'
 * when the asset is already gone (caller can treat as soft-success).
 *
 * @param {string} publicId
 * @param {object} env Worker env bindings
 */
export async function destroyImage(publicId, env) {
  assertConfigured(env);
  if (!publicId) throw new Error('Missing public_id');

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signedParams = { public_id: publicId, timestamp };
  const signature = await signParams(signedParams, env.CLOUDINARY_API_SECRET);

  const form = new FormData();
  form.append('public_id', publicId);
  form.append('api_key', env.CLOUDINARY_API_KEY);
  form.append('timestamp', timestamp);
  form.append('signature', signature);

  const url = `https://api.cloudinary.com/v1_1/${encodeURIComponent(env.CLOUDINARY_CLOUD_NAME)}/image/destroy`;
  const res = await fetch(url, { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error?.message || `Cloudinary destroy failed (${res.status})`);
  }
  return data.result || 'ok';
}
