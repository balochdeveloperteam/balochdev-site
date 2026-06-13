import { useEffect, useState } from 'react';
import { apiUrl } from '../../../../lib/api';

export function slugifyTitle(title) {
  return String(title || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function countChars(text, max) {
  const len = String(text || '').length;
  return `${len} / ~${max}`;
}

export default function PostMetaPanel({
  form,
  onChange,
  token,
  postId,
  onUploadCover,
  readingTime,
}) {
  const [slugStatus, setSlugStatus] = useState('');
  const [publishedOptions, setPublishedOptions] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch(apiUrl(`/api/blog/admin/published-options?excludeId=${postId || ''}`), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setPublishedOptions(d.posts || []))
      .catch(() => {});

    fetch(apiUrl('/api/blog/admin/authors'), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setAuthors(d.members || []))
      .catch(() => {});
  }, [token, postId]);

  useEffect(() => {
    if (!token || !form.slug?.trim()) {
      setSlugStatus('');
      return undefined;
    }
    const timer = setTimeout(async () => {
      const params = new URLSearchParams({ slug: form.slug.trim() });
      if (postId) params.set('excludeId', postId);
      const res = await fetch(apiUrl(`/api/blog/admin/slug-check?${params}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setSlugStatus(data.available ? 'available' : 'taken');
    }, 400);
    return () => clearTimeout(timer);
  }, [form.slug, token, postId]);

  const setField = (key, value) => onChange({ ...form, [key]: value });

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag) return;
    const tags = [...new Set([...(form.tags || []), tag])].slice(0, 20);
    setField('tags', tags);
    setTagInput('');
  };

  const removeTag = (tag) => {
    setField(
      'tags',
      (form.tags || []).filter((t) => t !== tag),
    );
  };

  const toggleRelated = (slug) => {
    const current = form.related_slugs || [];
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug].slice(0, 8);
    setField('related_slugs', next);
  };

  const onAuthorChange = (memberId) => {
    const member = authors.find((m) => m.id === memberId);
    onChange({
      ...form,
      author_member_id: memberId || null,
      author_name: member?.full_name || form.author_name || 'BalochDev',
    });
  };

  return (
    <aside className="ndx-admin-meta-panel">
      <div className="ndx-admin-field">
        <label htmlFor="post-slug">Slug</label>
        <input
          id="post-slug"
          className="ndx-admin-input"
          value={form.slug}
          onChange={(e) => setField('slug', e.target.value)}
        />
        {slugStatus === 'available' && <span className="ndx-admin-slug-ok">Slug available</span>}
        {slugStatus === 'taken' && <span className="ndx-admin-slug-bad">Slug already in use</span>}
      </div>

      <div className="ndx-admin-field">
        <label htmlFor="post-type">Post type</label>
        <select
          id="post-type"
          className="ndx-admin-select"
          value={form.post_type}
          onChange={(e) => setField('post_type', e.target.value)}
        >
          <option value="article">Article</option>
          <option value="image_caption">Image + caption</option>
        </select>
      </div>

      <div className="ndx-admin-field">
        <label htmlFor="post-excerpt">Excerpt</label>
        <textarea
          id="post-excerpt"
          className="ndx-admin-textarea"
          rows={3}
          value={form.excerpt}
          onChange={(e) => setField('excerpt', e.target.value)}
        />
      </div>

      <div className="ndx-admin-field">
        <label>Cover image</label>
        {form.cover_image_url && (
          <img src={form.cover_image_url} alt="" className="ndx-admin-cover-preview" />
        )}
        <button type="button" className="ndx-btn" onClick={onUploadCover}>
          {form.cover_image_url ? 'Replace cover' : 'Upload cover'}
        </button>
      </div>

      <div className="ndx-admin-field">
        <label htmlFor="cover-alt">Cover alt text</label>
        <input
          id="cover-alt"
          className="ndx-admin-input"
          value={form.cover_image_alt}
          onChange={(e) => setField('cover_image_alt', e.target.value)}
        />
      </div>

      <div className="ndx-admin-field">
        <label htmlFor="meta-title">Meta title</label>
        <input
          id="meta-title"
          className="ndx-admin-input"
          value={form.meta_title}
          onChange={(e) => setField('meta_title', e.target.value)}
        />
        <span className="ndx-admin-field-hint">{countChars(form.meta_title, 60)}</span>
      </div>

      <div className="ndx-admin-field">
        <label htmlFor="meta-desc">Meta description</label>
        <textarea
          id="meta-desc"
          className="ndx-admin-textarea"
          rows={3}
          value={form.meta_description}
          onChange={(e) => setField('meta_description', e.target.value)}
        />
        <span className="ndx-admin-field-hint">{countChars(form.meta_description, 155)}</span>
      </div>

      <div className="ndx-admin-field">
        <label htmlFor="focus-kw">Focus keyword</label>
        <input
          id="focus-kw"
          className="ndx-admin-input"
          value={form.focus_keyword}
          onChange={(e) => setField('focus_keyword', e.target.value)}
        />
      </div>

      <div className="ndx-admin-field">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          className="ndx-admin-input"
          value={form.category}
          onChange={(e) => setField('category', e.target.value)}
        />
      </div>

      <div className="ndx-admin-field">
        <label htmlFor="tags">Tags</label>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <input
            id="tags"
            className="ndx-admin-input"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
          />
          <button type="button" className="ndx-btn" onClick={addTag}>
            Add
          </button>
        </div>
        <div className="ndx-admin-tag-list">
          {(form.tags || []).map((tag) => (
            <span key={tag} className="ndx-admin-tag">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="ndx-admin-field">
        <label>Related articles</label>
        <div className="ndx-admin-field-hint">Published posts only</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '160px', overflowY: 'auto' }}>
          {publishedOptions.map((p) => (
            <label key={p.id} style={{ display: 'flex', gap: '0.4rem', fontSize: '0.82rem' }}>
              <input
                type="checkbox"
                checked={(form.related_slugs || []).includes(p.slug)}
                onChange={() => toggleRelated(p.slug)}
              />
              {p.title}
            </label>
          ))}
        </div>
      </div>

      <div className="ndx-admin-field">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          className="ndx-admin-select"
          value={form.status}
          onChange={(e) => setField('status', e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="ndx-admin-field">
        <label htmlFor="published-at">Published at</label>
        <input
          id="published-at"
          type="datetime-local"
          className="ndx-admin-input"
          value={form.published_at_local || ''}
          onChange={(e) => setField('published_at_local', e.target.value)}
        />
      </div>

      <div className="ndx-admin-field">
        <label htmlFor="author">Author</label>
        <select
          id="author"
          className="ndx-admin-select"
          value={form.author_member_id || ''}
          onChange={(e) => onAuthorChange(e.target.value || null)}
        >
          <option value="">BalochDev (default)</option>
          {authors.map((m) => (
            <option key={m.id} value={m.id}>
              {m.full_name}
            </option>
          ))}
        </select>
      </div>

      <p className="ndx-admin-field-hint">Reading time: ~{readingTime} min</p>
    </aside>
  );
}
