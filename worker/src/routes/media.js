/**
 * /api/media — admin media library. Records Cloudinary uploads in
 * media_assets so the editor can browse + reuse images across posts.
 *
 * All endpoints gated by requireBlogAdmin() (same admin/manager gate as
 * /api/blog/admin and /api/uploads/image). Public clients never call this.
 */

import { Hono } from 'hono';
import { getAdmin } from '../db.js';
import { requireBlogAdmin } from '../middleware/auth.js';
import { destroyImage, ALLOWED_FOLDERS } from '../services/cloudinary.js';
import { safeError } from '../utils.js';

async function resolveTeamMemberId(adminClient, authUserId) {
  const { data } = await adminClient
    .from('team_members')
    .select('id')
    .eq('auth_user_id', authUserId)
    .maybeSingle();
  return data?.id || null;
}

function clipText(value, max) {
  return String(value ?? '').trim().slice(0, max);
}

const media = new Hono();
media.use('*', requireBlogAdmin());

media.get('/', async (c) => {
  const admin = getAdmin(c);
  if (!admin) return c.json({ error: 'No DB' }, 503);
  try {
    const { data, error } = await admin
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) {
      if (/relation.*media_assets.*does not exist|media_assets.*does not exist/i.test(error.message || '')) {
        return c.json({ assets: [] });
      }
      return safeError(c, 500, error.message);
    }
    return c.json({ assets: data || [] });
  } catch (err) {
    return safeError(c, 500, err.message);
  }
});

media.post('/', async (c) => {
  const admin = getAdmin(c);
  if (!admin) return c.json({ error: 'No DB' }, 503);
  try {
    const body = await c.req.json().catch(() => ({}));
    const publicId = clipText(body.cloudinary_public_id || body.publicId, 300);
    const secureUrl = clipText(body.secure_url || body.secureUrl, 600);
    const folder = clipText(body.folder || 'balochdev/blog', 80);
    if (!publicId || !secureUrl) {
      return c.json({ error: 'cloudinary_public_id and secure_url are required' }, 400);
    }
    if (!ALLOWED_FOLDERS.has(folder)) {
      return c.json({ error: `Invalid folder. Allowed: ${[...ALLOWED_FOLDERS].join(', ')}` }, 400);
    }

    const row = {
      cloudinary_public_id: publicId,
      secure_url: secureUrl,
      alt: clipText(body.alt, 280),
      caption: clipText(body.caption, 500),
      folder,
      width: Number.isFinite(Number(body.width)) ? Number(body.width) : null,
      height: Number.isFinite(Number(body.height)) ? Number(body.height) : null,
      format: clipText(body.format, 16) || null,
      created_by: await resolveTeamMemberId(admin, c.get('user').id),
    };

    // Upsert on cloudinary_public_id so re-uploading the same asset
    // refreshes the row instead of erroring on the unique index.
    const { data, error } = await admin
      .from('media_assets')
      .upsert(row, { onConflict: 'cloudinary_public_id' })
      .select()
      .single();
    if (error) return safeError(c, 500, error.message);
    return c.json({ asset: data }, 201);
  } catch (err) {
    return safeError(c, 500, err.message);
  }
});

media.patch('/:id', async (c) => {
  const admin = getAdmin(c);
  if (!admin) return c.json({ error: 'No DB' }, 503);
  try {
    const id = c.req.param('id');
    const body = await c.req.json().catch(() => ({}));
    /** Only alt + caption are editable from the library; everything else is provenance. */
    const patch = {};
    if (typeof body.alt === 'string') patch.alt = clipText(body.alt, 280);
    if (typeof body.caption === 'string') patch.caption = clipText(body.caption, 500);
    if (!Object.keys(patch).length) {
      return c.json({ error: 'No editable fields supplied' }, 400);
    }

    const { data, error } = await admin
      .from('media_assets')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) return safeError(c, 500, error.message);
    if (!data) return c.json({ error: 'Asset not found' }, 404);
    return c.json({ asset: data });
  } catch (err) {
    return safeError(c, 500, err.message);
  }
});

media.delete('/:id', async (c) => {
  const admin = getAdmin(c);
  if (!admin) return c.json({ error: 'No DB' }, 503);
  try {
    const id = c.req.param('id');
    const { data: existing, error: findErr } = await admin
      .from('media_assets')
      .select('id, cloudinary_public_id')
      .eq('id', id)
      .maybeSingle();
    if (findErr) return safeError(c, 500, findErr.message);
    if (!existing) return c.json({ error: 'Asset not found' }, 404);

    /** Destroy on Cloudinary FIRST so a successful row delete never leaves an orphan asset. */
    let cloudinaryResult = 'skipped';
    try {
      cloudinaryResult = await destroyImage(existing.cloudinary_public_id, c.env);
    } catch (e) {
      return safeError(c, 502, `Cloudinary destroy failed: ${e.message}`, 'Delete failed');
    }

    const { error: delErr } = await admin.from('media_assets').delete().eq('id', id);
    if (delErr) return safeError(c, 500, delErr.message);

    return c.json({ ok: true, cloudinary: cloudinaryResult });
  } catch (err) {
    return safeError(c, 500, err.message);
  }
});

export default media;
