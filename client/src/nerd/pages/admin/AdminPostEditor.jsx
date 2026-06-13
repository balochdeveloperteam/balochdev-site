import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { apiUrl } from '../../../lib/api';
import { useAdmin } from './AdminContext';
import BlogBlockEditor from './components/BlogBlockEditor';
import PostMetaPanel, { slugifyTitle } from './components/PostMetaPanel';

function computeReadingTime(html) {
  const text = String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = text ? text.split(' ').filter(Boolean).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

function toLocalInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function emptyForm() {
  return {
    title: '',
    slug: '',
    excerpt: '',
    content_html: '',
    post_type: 'article',
    cover_image_url: '',
    cover_image_alt: '',
    meta_title: '',
    meta_description: '',
    focus_keyword: '',
    tags: [],
    category: '',
    related_slugs: [],
    status: 'draft',
    published_at_local: '',
    author_name: 'BalochDev',
    author_member_id: null,
    caption_text: '',
    caption_image_url: '',
    caption_image_alt: '',
  };
}

function postToForm(post) {
  return {
    title: post.title || '',
    slug: post.slug || '',
    excerpt: post.excerpt || '',
    content_html: post.content_html || post.body_html || '',
    post_type: post.post_type || 'article',
    cover_image_url: post.cover_image_url || '',
    cover_image_alt: post.cover_image_alt || '',
    meta_title: post.meta_title || '',
    meta_description: post.meta_description || '',
    focus_keyword: post.focus_keyword || '',
    tags: post.tags || [],
    category: post.category || '',
    related_slugs: post.related_slugs || [],
    status: post.status || (post.published ? 'published' : 'draft'),
    published_at_local: toLocalInput(post.published_at),
    author_name: post.author_name || 'BalochDev',
    author_member_id: post.author_member_id || null,
    caption_text: post.excerpt || '',
    caption_image_url: post.cover_image_url || '',
    caption_image_alt: post.cover_image_alt || '',
  };
}

async function uploadImage(token, file, folder = 'balochdev/blog') {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);
  const res = await fetch(apiUrl('/api/uploads/image'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export default function AdminPostEditor() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { authFetch, token } = useAdmin();
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const slugTouched = useRef(false);

  useEffect(() => {
    if (isNew) return undefined;
    let cancelled = false;
    authFetch(`/api/blog/admin/posts/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setForm(postToForm(data.post));
      })
      .catch((e) => {
        if (!cancelled) setErr(e.message || 'Failed to load post');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authFetch, id, isNew]);

  const readingTime = useMemo(() => {
    if (form.post_type === 'image_caption') return 1;
    return computeReadingTime(form.content_html);
  }, [form.content_html, form.post_type]);

  const onTitleChange = (title) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugTouched.current ? prev.slug : slugifyTitle(title),
    }));
  };

  const buildPayload = (statusOverride) => {
    const status = statusOverride || form.status;
    let contentHtml = form.content_html;
    let coverUrl = form.cover_image_url;
    let coverAlt = form.cover_image_alt;

    if (form.post_type === 'image_caption') {
      coverUrl = form.caption_image_url;
      coverAlt = form.caption_image_alt;
      const cap = form.caption_text.trim();
      contentHtml = coverUrl
        ? `<figure class="blog-figure"><img src="${coverUrl.replace(/"/g, '&quot;')}" alt="${(coverAlt || '').replace(/"/g, '&quot;')}" loading="lazy" />${cap ? `<figcaption>${cap.replace(/</g, '&lt;')}</figcaption>` : '<figcaption></figcaption>'}</figure>`
        : '';
    }

    return {
      title: form.title.trim(),
      slug: (form.slug || slugifyTitle(form.title)).trim(),
      excerpt: form.post_type === 'image_caption' ? form.caption_text.trim() : form.excerpt.trim(),
      content_html: contentHtml,
      post_type: form.post_type,
      cover_image_url: coverUrl || null,
      cover_image_alt: coverAlt,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      focus_keyword: form.focus_keyword,
      tags: form.tags,
      category: form.category,
      related_slugs: form.related_slugs,
      status,
      author_name: form.author_name,
      author_member_id: form.author_member_id,
      published_at: form.published_at_local
        ? new Date(form.published_at_local).toISOString()
        : undefined,
    };
  };

  const save = async (statusOverride) => {
    setErr('');
    if (!form.title.trim()) {
      setErr('Title is required.');
      return;
    }
    if (form.post_type === 'image_caption' && !form.caption_image_url) {
      setErr('Image is required for image + caption posts.');
      return;
    }
    if (form.post_type === 'image_caption' && !form.caption_image_alt.trim()) {
      setErr('Image alt text is required for SEO.');
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload(statusOverride);
      const path = isNew ? '/api/blog/admin/posts' : `/api/blog/admin/posts/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await authFetch(path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Save failed');
      navigate('/admin/posts', { replace: !isNew });
    } catch (e) {
      setErr(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const uploadCover = async () => {
    if (!token) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,image/gif';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const { secureUrl } = await uploadImage(token, file);
        setForm((prev) => ({ ...prev, cover_image_url: secureUrl }));
      } catch {
        alert('Cover upload failed');
      }
    };
    input.click();
  };

  const uploadCaptionImage = async () => {
    if (!token) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,image/gif';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const { secureUrl } = await uploadImage(token, file);
        setForm((prev) => ({ ...prev, caption_image_url: secureUrl }));
      } catch {
        alert('Image upload failed');
      }
    };
    input.click();
  };

  if (loading) {
    return <p className="ndx-tech-blurb">Loading post…</p>;
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="ndx-admin-page-head">
        <div>
          <p className="ndx-eyebrow">{isNew ? 'New post' : 'Edit post'}</p>
          <h2 className="ndx-h2" style={{ margin: 0 }}>
            {isNew ? 'Create post' : form.title || 'Untitled'}
          </h2>
        </div>
        <Link to="/admin/posts" className="ndx-btn">
          ← Back to list
        </Link>
      </div>

      {err && (
        <p style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '1rem' }}>{err}</p>
      )}

      <div className="ndx-admin-field" style={{ marginBottom: '1rem' }}>
        <label htmlFor="post-title">Title</label>
        <input
          id="post-title"
          className="ndx-admin-input"
          value={form.title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      {form.post_type === 'image_caption' ? (
        <div className="ndx-admin-editor-layout">
          <div className="ndx-glass-section" style={{ padding: '1rem', borderRadius: '16px' }}>
            <div className="ndx-admin-field">
              <label>Image</label>
              {form.caption_image_url && (
                <img src={form.caption_image_url} alt="" className="ndx-admin-cover-preview" />
              )}
              <button type="button" className="ndx-btn" onClick={uploadCaptionImage}>
                {form.caption_image_url ? 'Replace image' : 'Upload image'}
              </button>
            </div>
            <div className="ndx-admin-field">
              <label htmlFor="caption-alt">Image alt text</label>
              <input
                id="caption-alt"
                className="ndx-admin-input"
                value={form.caption_image_alt}
                onChange={(e) => setForm((p) => ({ ...p, caption_image_alt: e.target.value }))}
              />
            </div>
            <div className="ndx-admin-field">
              <label htmlFor="caption-text">Caption</label>
              <textarea
                id="caption-text"
                className="ndx-admin-textarea"
                rows={4}
                value={form.caption_text}
                onChange={(e) => setForm((p) => ({ ...p, caption_text: e.target.value }))}
              />
            </div>
          </div>
          <PostMetaPanel
            form={form}
            onChange={setForm}
            token={token}
            postId={isNew ? null : id}
            onUploadCover={uploadCover}
            readingTime={readingTime}
          />
        </div>
      ) : (
        <div className="ndx-admin-editor-layout">
          <BlogBlockEditor
            contentHtml={form.content_html}
            onChange={(html) => setForm((p) => ({ ...p, content_html: html }))}
            token={token}
            disabled={saving}
          />
          <PostMetaPanel
            form={form}
            onChange={(next) => {
              if (next.slug !== form.slug) slugTouched.current = true;
              setForm(next);
            }}
            token={token}
            postId={isNew ? null : id}
            onUploadCover={uploadCover}
            readingTime={readingTime}
          />
        </div>
      )}

      <div className="ndx-admin-save-bar">
        <button type="button" className="ndx-btn" disabled={saving} onClick={() => save('draft')}>
          Save draft
        </button>
        <button
          type="button"
          className="ndx-btn ndx-btn-primary"
          disabled={saving}
          onClick={() => save('published')}
        >
          Publish
        </button>
      </div>
    </motion.div>
  );
}
