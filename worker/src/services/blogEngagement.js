import sanitizeHtml from 'sanitize-html';

export function sanitizeCommentPlainText(content) {
  const stripped = sanitizeHtml(String(content || ''), { allowedTags: [], allowedAttributes: {} });
  return stripped.replace(/\r\n/g, '\n').trim().slice(0, 4000);
}

export function mapPublicComment(row) {
  if (!row) return row;
  return {
    id: row.id,
    post_id: row.post_id,
    parent_id: row.parent_id,
    author_name: row.author_name,
    content: row.content,
    is_pinned: !!row.is_pinned,
    like_count: row.like_count || 0,
    created_at: row.created_at,
  };
}
