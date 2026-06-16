const PLACEMENTS = ['blog_hero', 'post_sidebar_a', 'post_sidebar_b'];

function isValidPlacement(p) {
  return PLACEMENTS.includes(p);
}

function isAdLive(ad, now = new Date()) {
  if (!ad || !ad.is_active) return false;
  if (ad.starts_at && new Date(ad.starts_at) > now) return false;
  if (ad.ends_at && new Date(ad.ends_at) < now) return false;
  return true;
}

/** Most recently updated among live ads for a placement. */
function pickLiveAd(rows) {
  const live = (rows || []).filter(isAdLive);
  if (!live.length) return null;
  live.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
  return live[0];
}

function mapPublicAd(row) {
  if (!row) return null;
  return {
    id: row.id,
    placement: row.placement,
    image_url: row.image_url,
    image_alt: row.image_alt || '',
    link_url: row.link_url || '',
  };
}

function mapAdminAd(row) {
  if (!row) return null;
  return {
    id: row.id,
    placement: row.placement,
    image_url: row.image_url,
    image_alt: row.image_alt || '',
    link_url: row.link_url || '',
    is_active: !!row.is_active,
    starts_at: row.starts_at,
    ends_at: row.ends_at,
    advertiser_name: row.advertiser_name || '',
    notes: row.notes || '',
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function buildAdsByPlacement(rows) {
  /** @type {Record<string, object[]>} */
  const grouped = {};
  for (const p of PLACEMENTS) grouped[p] = [];
  for (const row of rows || []) {
    if (grouped[row.placement]) grouped[row.placement].push(row);
  }
  /** @type {Record<string, object|null>} */
  const publicAds = {};
  for (const p of PLACEMENTS) {
    publicAds[p] = mapPublicAd(pickLiveAd(grouped[p]));
  }
  return publicAds;
}

function latestAdPerPlacement(rows) {
  /** @type {Record<string, object|null>} */
  const out = {};
  for (const p of PLACEMENTS) out[p] = null;
  const sorted = [...(rows || [])].sort(
    (a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0),
  );
  for (const row of sorted) {
    if (out[row.placement] == null) {
      out[row.placement] = mapAdminAd(row);
    }
  }
  return out;
}

function normalizeAdBody(body) {
  const placement = String(body?.placement || '').trim();
  if (!isValidPlacement(placement)) {
    const err = new Error('Invalid placement');
    err.status = 400;
    throw err;
  }
  const imageUrl = String(body?.image_url || '').trim();
  if (!imageUrl) {
    const err = new Error('image_url required');
    err.status = 400;
    throw err;
  }
  return {
    placement,
    image_url: imageUrl,
    image_alt: String(body?.image_alt || '').trim(),
    link_url: String(body?.link_url || '').trim(),
    is_active: body?.is_active !== false,
    starts_at: body?.starts_at || null,
    ends_at: body?.ends_at || null,
    advertiser_name: String(body?.advertiser_name || '').trim(),
    notes: String(body?.notes || '').trim(),
  };
}

module.exports = {
  PLACEMENTS,
  isValidPlacement,
  isAdLive,
  pickLiveAd,
  mapPublicAd,
  mapAdminAd,
  buildAdsByPlacement,
  latestAdPerPlacement,
  normalizeAdBody,
};
