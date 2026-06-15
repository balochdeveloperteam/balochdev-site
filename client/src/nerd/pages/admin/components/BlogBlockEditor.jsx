import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import {
  TbAlignCenter,
  TbAlignJustified,
  TbAlignLeft,
  TbAlignRight,
  TbBold,
  TbCode,
  TbH2,
  TbH3,
  TbItalic,
  TbLink,
  TbList,
  TbListNumbers,
  TbMinus,
  TbPalette,
  TbPhoto,
  TbQuote,
  TbSourceCode,
  TbTypography,
} from 'react-icons/tb';
import { apiUrl } from '../../../../lib/api';
import AdminEditorModal from './editor/AdminEditorModal';
import { sanitizeBlogEditorHtml } from './editor/editorSanitize';
import {
  BlogFigure,
  BlogRawHtml,
  EDITOR_COLOR_PALETTE,
  FONT_SIZE_OPTIONS,
  createBlogEditorExtensions,
  serializeBlogEditorHtml,
} from './editor/tiptapExtensions';

export function ToolbarButton({ active, onClick, children, title, className = '' }) {
  return (
    <button
      type="button"
      className={`${active ? 'is-active' : ''} ${className}`.trim()}
      onClick={onClick}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="ndx-blog-editor-toolbar-divider" aria-hidden />;
}

function ColorPicker({ editor }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const current = editor.getAttributes('textStyle').color || '';

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const apply = (color) => {
    if (!color) {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
    setOpen(false);
  };

  return (
    <div className="ndx-blog-editor-color" ref={wrapRef}>
      <ToolbarButton
        active={!!current}
        onClick={() => setOpen((v) => !v)}
        title="Text color"
        className="ndx-blog-editor-color-trigger"
      >
        <TbPalette aria-hidden />
        <span
          className="ndx-blog-editor-color-swatch"
          style={{ background: current || 'var(--ndx-text)' }}
          aria-hidden
        />
      </ToolbarButton>
      {open ? (
        <div className="ndx-blog-editor-color-menu">
          <div className="ndx-blog-editor-color-grid">
            {EDITOR_COLOR_PALETTE.map((c) => (
              <button
                key={c.value}
                type="button"
                className={`ndx-blog-editor-color-chip${current === c.value ? ' is-active' : ''}`}
                style={{ background: c.value }}
                title={c.label}
                aria-label={c.label}
                onClick={() => apply(c.value)}
              />
            ))}
          </div>
          <label className="ndx-blog-editor-color-custom">
            <span>Custom</span>
            <input type="color" value={current || '#f8fafc'} onChange={(e) => apply(e.target.value)} />
          </label>
          <button type="button" className="ndx-blog-editor-color-clear" onClick={() => apply(null)}>
            Clear color
          </button>
        </div>
      ) : null}
    </div>
  );
}

function FontSizeSelect({ editor }) {
  const current = editor.getAttributes('textStyle').fontSize || '';
  return (
    <label className="ndx-blog-editor-font-size">
      <TbTypography aria-hidden className="ndx-blog-editor-font-size-icon" />
      <select
        value={current || ''}
        onChange={(e) => {
          const v = e.target.value;
          if (!v) editor.chain().focus().unsetFontSize().run();
          else editor.chain().focus().setFontSize(v).run();
        }}
        title="Text size"
        aria-label="Text size"
      >
        {FONT_SIZE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function BlogEditorToolbar({ editor, token, onNotify }) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageOpen, setImageOpen] = useState(false);
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [htmlOpen, setHtmlOpen] = useState(false);
  const [htmlInput, setHtmlInput] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const fileRef = useRef(null);

  const notify = useCallback(
    (message) => {
      if (onNotify) onNotify(message);
      else {
        setAlertMessage(message);
        setAlertOpen(true);
      }
    },
    [onNotify],
  );

  if (!editor) return null;

  const openLink = () => {
    setLinkUrl(editor.getAttributes('link').href || 'https://');
    setLinkOpen(true);
  };

  const confirmLink = () => {
    const url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
    setLinkOpen(false);
  };

  const openImage = () => {
    setImageAlt('');
    setImageCaption('');
    setImageFile(null);
    setImageOpen(true);
  };

  const confirmImage = async () => {
    if (!imageFile || !token) return;
    if (!imageAlt.trim()) {
      notify('Alt text is required for SEO.');
      return;
    }
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('folder', 'balochdev/blog');
      const res = await fetch(apiUrl('/api/uploads/image'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('upload failed');
      const { secureUrl } = await res.json();
      editor
        .chain()
        .focus()
        .insertContent({
          type: BlogFigure.name,
          attrs: {
            src: secureUrl,
            alt: imageAlt.trim(),
            caption: imageCaption.trim(),
          },
        })
        .insertContent({ type: 'paragraph' })
        .run();
      setImageOpen(false);
    } catch {
      notify('Image upload failed.');
    } finally {
      setImageUploading(false);
    }
  };

  const openHtml = () => {
    setHtmlInput('');
    setHtmlOpen(true);
  };

  const confirmHtml = () => {
    const trimmed = htmlInput.trim();
    if (!trimmed) return;
    const sanitized = sanitizeBlogEditorHtml(trimmed);
    editor
      .chain()
      .focus()
      .insertContent({
        type: BlogRawHtml.name,
        attrs: { html: sanitized },
      })
      .insertContent({ type: 'paragraph' })
      .run();
    setHtmlOpen(false);
  };

  const htmlPreview = htmlInput.trim() ? sanitizeBlogEditorHtml(htmlInput) : '';

  return (
    <>
      <div className="ndx-blog-editor-toolbar ndx-blog-editor-toolbar--icons">
        <div className="ndx-blog-editor-toolbar-group">
          <ToolbarButton
            active={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <TbBold aria-hidden />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <TbItalic aria-hidden />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <div className="ndx-blog-editor-toolbar-group">
          <ToolbarButton
            active={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            title="Heading 2"
          >
            <TbH2 aria-hidden />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            title="Heading 3"
          >
            <TbH3 aria-hidden />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <div className="ndx-blog-editor-toolbar-group">
          <ToolbarButton
            active={editor.isActive({ textAlign: 'left' })}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            title="Align left"
          >
            <TbAlignLeft aria-hidden />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive({ textAlign: 'center' })}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            title="Align center"
          >
            <TbAlignCenter aria-hidden />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive({ textAlign: 'right' })}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            title="Align right"
          >
            <TbAlignRight aria-hidden />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive({ textAlign: 'justify' })}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            title="Justify"
          >
            <TbAlignJustified aria-hidden />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <div className="ndx-blog-editor-toolbar-group">
          <ColorPicker editor={editor} />
          <FontSizeSelect editor={editor} />
        </div>

        <ToolbarDivider />

        <div className="ndx-blog-editor-toolbar-group">
          <ToolbarButton
            active={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet list"
          >
            <TbList aria-hidden />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered list"
          >
            <TbListNumbers aria-hidden />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="Quote"
          >
            <TbQuote aria-hidden />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
            <TbMinus aria-hidden />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <div className="ndx-blog-editor-toolbar-group">
          <ToolbarButton
            active={editor.isActive('codeBlock')}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="Code block — monospace display, not executed"
          >
            <TbCode aria-hidden />
          </ToolbarButton>
          <ToolbarButton onClick={openHtml} title="Embed HTML — paste sanitized HTML snippet">
            <TbSourceCode aria-hidden />
          </ToolbarButton>
        </div>

        <ToolbarDivider />

        <div className="ndx-blog-editor-toolbar-group">
          <ToolbarButton onClick={openLink} active={editor.isActive('link')} title="Insert link">
            <TbLink aria-hidden />
          </ToolbarButton>
          <ToolbarButton onClick={openImage} title="Insert inline image">
            <TbPhoto aria-hidden />
          </ToolbarButton>
        </div>
      </div>

      <AdminEditorModal
        open={linkOpen}
        title="Insert link"
        onClose={() => setLinkOpen(false)}
        footer={
          <>
            <button type="button" className="ndx-btn" onClick={() => setLinkOpen(false)}>
              Cancel
            </button>
            <button type="button" className="ndx-btn ndx-btn-primary" onClick={confirmLink}>
              Apply
            </button>
          </>
        }
      >
        <label className="ndx-admin-field">
          <span>URL</span>
          <input
            className="ndx-admin-input"
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://"
            autoFocus
          />
        </label>
        <p className="ndx-admin-field-hint">Leave empty to remove an existing link from the selection.</p>
      </AdminEditorModal>

      <AdminEditorModal
        open={imageOpen}
        title="Insert inline image"
        onClose={() => !imageUploading && setImageOpen(false)}
        footer={
          <>
            <button type="button" className="ndx-btn" disabled={imageUploading} onClick={() => setImageOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="ndx-btn ndx-btn-primary"
              disabled={imageUploading || !imageFile}
              onClick={confirmImage}
            >
              {imageUploading ? 'Uploading…' : 'Insert'}
            </button>
          </>
        }
      >
        <div className="ndx-admin-field">
          <span>Image file</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="ndx-admin-input"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>
        <label className="ndx-admin-field">
          <span>Alt text (required)</span>
          <input
            className="ndx-admin-input"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder="Describe the image for SEO and accessibility"
          />
        </label>
        <label className="ndx-admin-field">
          <span>Caption (optional)</span>
          <input
            className="ndx-admin-input"
            value={imageCaption}
            onChange={(e) => setImageCaption(e.target.value)}
            placeholder="Shown below the image"
          />
        </label>
      </AdminEditorModal>

      <AdminEditorModal
        open={htmlOpen}
        title="Embed HTML"
        wide
        onClose={() => setHtmlOpen(false)}
        footer={
          <>
            <button type="button" className="ndx-btn" onClick={() => setHtmlOpen(false)}>
              Cancel
            </button>
            <button type="button" className="ndx-btn ndx-btn-primary" disabled={!htmlInput.trim()} onClick={confirmHtml}>
              Insert
            </button>
          </>
        }
      >
        <p className="ndx-admin-field-hint" style={{ marginTop: 0 }}>
          Paste HTML that will be sanitized on save. It is displayed as an embed block, not executed as a script.
        </p>
        <label className="ndx-admin-field">
          <span>HTML</span>
          <textarea
            className="ndx-admin-textarea ndx-admin-textarea--mono"
            rows={8}
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="<div>…</div>"
            autoFocus
          />
        </label>
        <div className="ndx-admin-field">
          <span>Sanitized preview</span>
          <div
            className="ndx-blog-raw-html-preview"
            dangerouslySetInnerHTML={{ __html: htmlPreview || '<p class="ndx-admin-field-hint">Preview appears here</p>' }}
          />
        </div>
      </AdminEditorModal>

      <AdminEditorModal
        open={alertOpen}
        title="Notice"
        onClose={() => setAlertOpen(false)}
        footer={
          <button type="button" className="ndx-btn ndx-btn-primary" onClick={() => setAlertOpen(false)}>
            OK
          </button>
        }
      >
        <p>{alertMessage}</p>
      </AdminEditorModal>
    </>
  );
}

export function useBlogBlockEditor({ contentHtml, onChange, disabled }) {
  const editor = useEditor({
    extensions: createBlogEditorExtensions(),
    content: contentHtml || '',
    editable: !disabled,
    onUpdate: ({ editor: ed }) => onChange(serializeBlogEditorHtml(ed)),
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor || contentHtml === undefined) return;
    const serialized = serializeBlogEditorHtml(editor);
    if (serialized !== contentHtml) {
      editor.commands.setContent(contentHtml || '', false);
    }
  }, [editor, contentHtml]);

  return editor;
}

export default function BlogBlockEditor({ editor, token, showToolbar = true, onNotify }) {
  if (!editor) return null;

  return (
    <div className="ndx-blog-editor ndx-blog-editor--focus">
      {showToolbar && <BlogEditorToolbar editor={editor} token={token} onNotify={onNotify} />}
      <div className="ndx-blog-editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
