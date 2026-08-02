import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TbArrowLeft, TbSettings } from 'react-icons/tb';
import { apiUrl } from '../../../lib/api';
import { useAdmin } from './AdminContext';
import BlogBlockEditor, { BlogEditorToolbar, useBlogBlockEditor } from './components/BlogBlockEditor';
import AdminEditorErrorBoundary from './components/AdminEditorErrorBoundary';
import PostMetaDrawer from './components/PostMetaDrawer';
import { slugifyTitle } from './components/PostMetaPanel';

function snapshotForm(form) {
  try {
    return JSON.stringify(form);
  } catch {
    return '';
  }
}

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
    summary: '',
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
    summary: post.summary || '',
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

function statusLabel(status) {
  if (status === 'published') return 'Published';
  if (status === 'archived') return 'Archived';
  return 'Draft';
}

export default function AdminPostEditor() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { authFetch, token } = useAdmin();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const slugTouched = useRef(false);
  const baselineRef = useRef(snapshotForm(emptyForm()));
  const [baselineReady, setBaselineReady] = useState(isNew);

  const editor = useBlogBlockEditor({
    contentHtml: form.content_html,
    onChange: (html) => setForm((p) => ({ ...p, content_html: html })),
    disabled: saving || form.post_type === 'image_caption',
  });

  useEffect(() => {
    if (!isNew) return undefined;
    baselineRef.current = snapshotForm(emptyForm());
    setBaselineReady(true);
    return undefined;
  }, [isNew]);

  useEffect(() => {
    if (isNew) return undefined;
    let cancelled = false;
    authFetch(`/api/blog/admin/posts/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Post not found');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const next = postToForm(data.post);
        setForm(next);
        baselineRef.current = snapshotForm(next);
        setBaselineReady(true);
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

  const isDirty = baselineReady && snapshotForm(form) !== baselineRef.current;

  useEffect(() => {
    const onBeforeUnload = (event) => {
      if (!isDirty || saving) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty, saving]);

  const confirmLeaveIfDirty = (event) => {
    if (!isDirty || saving) return;
    const leave = window.confirm(
      'You have unsaved changes. Leave this page without saving? Your edits will be lost.',
    );
    if (!leave) event.preventDefault();
  };

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
      summary: form.summary.trim(),
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

  const persist = async (statusOverride, { navigateAway = true } = {}) => {
    setErr('');
    if (!form.title.trim()) {
      setErr('Title is required.');
      return false;
    }
    if (form.post_type === 'image_caption' && !form.caption_image_url) {
      setErr('Image is required for image + caption posts.');
      return false;
    }
    if (form.post_type === 'image_caption' && !form.caption_image_alt.trim()) {
      setErr('Image alt text is required for SEO.');
      return false;
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
      setLastSavedAt(new Date());
      const savedForm = statusOverride ? { ...form, status: statusOverride } : form;
      if (statusOverride) {
        setForm((p) => ({ ...p, status: statusOverride }));
      }
      baselineRef.current = snapshotForm(savedForm);
      if (navigateAway) {
        navigate('/admin/posts', { replace: !isNew });
      }
      return true;
    } catch (e) {
      setErr(e.message || 'Save failed');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const save = async (statusOverride) => {
    await persist(statusOverride, { navigateAway: true });
  };

  const saveSettings = async () => {
    setSettingsSaving(true);
    const ok = await persist(form.status, { navigateAway: false });
    setSettingsSaving(false);
    if (ok) setSettingsOpen(false);
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
        setErr('Cover upload failed');
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
        setErr('Image upload failed');
      }
    };
    input.click();
  };

  const handleFormChange = (next) => {
    if (next.slug !== form.slug) slugTouched.current = true;
    setForm(next);
  };

  const panelProps = {
    form,
    onChange: handleFormChange,
    token,
    postId: isNew ? null : id,
    onUploadCover: uploadCover,
    readingTime,
  };

  if (loading) {
    return <p className="ndx-admin-loading">Loading post</p>;
  }

  return (
    <AdminEditorErrorBoundary>
      <motion.div
        className="ndx-admin-post-editor"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
      <div className="ndx-admin-editor-chrome">
        <div className="ndx-admin-editor-chrome-row ndx-admin-editor-chrome-row--primary">
          <div className="ndx-admin-editor-chrome-left">
            <Link to="/admin/posts/" className="ndx-admin-editor-back" onClick={confirmLeaveIfDirty}>
              <TbArrowLeft aria-hidden />
              <span>Posts</span>
            </Link>
            <span className="ndx-admin-editor-status" aria-live="polite">
              {saving
                ? 'Saving…'
                : isDirty
                  ? 'Unsaved changes'
                  : lastSavedAt
                    ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : statusLabel(form.status)}
            </span>
          </div>
          <div className="ndx-admin-editor-chrome-actions">
            <button
              type="button"
              className="ndx-btn ndx-admin-editor-settings-btn"
              onClick={() => setSettingsOpen(true)}
            >
              <TbSettings aria-hidden />
              <span>Settings / SEO</span>
            </button>
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
        </div>
        {form.post_type === 'article' && editor ? (
          <div className="ndx-admin-editor-chrome-row ndx-admin-editor-chrome-row--toolbar">
            <BlogEditorToolbar editor={editor} token={token} onNotify={(msg) => setErr(msg)} />
          </div>
        ) : form.post_type === 'article' ? (
          <div className="ndx-admin-editor-chrome-row ndx-admin-editor-chrome-row--toolbar">
            <p className="ndx-admin-field-hint" style={{ margin: 0 }}>Loading toolbar…</p>
          </div>
        ) : null}
      </div>

      {err && <p className="ndx-admin-alert">{err}</p>}

      <div className="ndx-admin-editor-write">
        <div className="ndx-admin-editor-write-inner">
          <label htmlFor="post-title" className="ndx-admin-editor-title-label">
            Post title
          </label>
          <input
            id="post-title"
            className="ndx-admin-input ndx-admin-input--title"
            placeholder="Post title…"
            value={form.title}
            onChange={(e) => onTitleChange(e.target.value)}
          />

          {form.post_type === 'image_caption' ? (
            <div className="ndx-admin-caption-compose ndx-glass-section">
              <div className="ndx-admin-field">
                <label>Image</label>
                {form.caption_image_url ? (
                  <img src={form.caption_image_url} alt="" className="ndx-admin-cover-preview" />
                ) : (
                  <div className="ndx-admin-cover-placeholder" aria-hidden>
                    No image yet
                  </div>
                )}
                <div className="ndx-admin-cover-actions">
                  <button type="button" className="ndx-btn" onClick={uploadCaptionImage}>
                    {form.caption_image_url ? 'Upload new' : 'Upload image'}
                  </button>
                </div>
                <label htmlFor="caption-image-url" className="ndx-admin-field-sublabel">
                  Or paste image URL
                </label>
                <input
                  id="caption-image-url"
                  className="ndx-admin-input"
                  type="url"
                  value={form.caption_image_url || ''}
                  onChange={(e) => setForm((p) => ({ ...p, caption_image_url: e.target.value.trim() }))}
                  placeholder="https://… image link"
                />
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
                  className="ndx-admin-textarea ndx-admin-textarea--caption"
                  rows={4}
                  value={form.caption_text}
                  onChange={(e) => setForm((p) => ({ ...p, caption_text: e.target.value }))}
                />
              </div>
            </div>
          ) : (
            <BlogBlockEditor editor={editor} token={token} showToolbar={false} />
          )}
        </div>
      </div>

      <PostMetaDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={saveSettings}
        saving={settingsSaving || saving}
        panelProps={panelProps}
      />
    </motion.div>
    </AdminEditorErrorBoundary>
  );
}
