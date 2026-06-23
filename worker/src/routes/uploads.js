import { Hono } from 'hono';
import { requireBlogAdmin } from '../middleware/auth.js';
import { uploadImage, ALLOWED_FOLDERS } from '../services/cloudinary.js';
import { safeError } from '../utils.js';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_BYTES = 10 * 1024 * 1024;

const uploads = new Hono();
uploads.use('*', requireBlogAdmin());

uploads.post('/image', async (c) => {
  let form;
  try {
    form = await c.req.formData();
  } catch {
    return c.json({ error: 'Expected multipart/form-data with field "image"' }, 400);
  }

  const file = form.get('image');
  if (!file || typeof file === 'string') {
    return c.json({ error: 'No image file provided. Use multipart field name "image".' }, 400);
  }
  if (file.size > MAX_BYTES) {
    return c.json({ error: 'Image must be 10MB or smaller' }, 400);
  }
  if (!ALLOWED_MIME.includes(file.type)) {
    return c.json({ error: 'Only JPEG, PNG, WebP, and GIF images are allowed' }, 400);
  }

  const folder = String(form.get('folder') || '').trim();
  if (!ALLOWED_FOLDERS.has(folder)) {
    return c.json(
      { error: 'Invalid folder. Use balochdev/blog, balochdev/members, balochdev/site, or balochdev/ads.' },
      400,
    );
  }
  const publicId = String(form.get('publicId') || '').trim() || undefined;

  try {
    const result = await uploadImage(file, { folder, publicId }, c.env);
    return c.json({ secureUrl: result.secureUrl, publicId: result.publicId });
  } catch (err) {
    return safeError(c, 500, err.message, 'Upload failed');
  }
});

export default uploads;
