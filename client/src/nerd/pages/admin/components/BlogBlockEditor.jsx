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
import EditorToolbarPopover from './editor/EditorToolbarPopover';
import { sanitizeBlogEditorHtml } from './editor/editorSanitize';
import {
  BlogRawHtml,
  EDITOR_COLOR_PALETTE,
  FONT_SIZE_OPTIONS,
  createBlogEditorExtensions,
  insertBlogFigure,
  serializeBlogEditorHtml,
} from './editor/tiptapExtensions';
import { applyTextColor, preventToolbarFocusSteal } from './editor/applyTextColor';

export function ToolbarButton({ active, onClick, onMouseDown, children, title, className = '', buttonRef }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${active ? 'is-active' : ''} ${className}`.trim()}
      onClick={onClick}
      onMouseDown={onMouseDown}
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

function LinkModalFields({ linkUrl, onLinkUrlChange }) {
  return (
    <>
      <label className="ndx-admin-field">
        <span>URL</span>
        <input
          className="ndx-admin-input"
          type="url"
          value={linkUrl}
          onChange={(e) => onLinkUrlChange(e.target.value)}
          placeholder="https://example.com/page"
          autoFocus
        />
      </label>
      <p className="ndx-admin-field-hint">Leave empty to remove an existing link from the selection.</p>
    </>
  );
}

function ImageModalFields({
  mode,
  onModeChange,
  imageUrl,
  imageAlt,
  imageCaption,
  libraryAssets,
  libraryLoading,
  libraryError,
  selectedAssetId,
  onUrlChange,
  onAltChange,
  onCaptionChange,
  onPickAsset,
}) {
  return (
    <>
      <div className="ndx-blog-editor-image-modes" role="tablist" aria-label="Image source">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'url'}
          className={`ndx-blog-editor-image-mode${mode === 'url' ? ' is-active' : ''}`}
          onClick={() => onModeChange('url')}
        >
          Paste URL
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'library'}
          className={`ndx-blog-editor-image-mode${mode === 'library' ? ' is-active' : ''}`}
          onClick={() => onModeChange('library')}
        >
          From Media library
        </button>
      </div>

      {mode === 'url' ? (
        <label className="ndx-admin-field">
          <span>Image URL (required)</span>
          <input
            className="ndx-admin-input"
            type="url"
            value={imageUrl}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="Paste image URL from Media library"
            autoFocus
          />
          <p className="ndx-admin-field-hint">
            Upload images in <strong>Admin → Media</strong>, then click <strong>Copy URL</strong> and paste here.
          </p>
        </label>
      ) : (
        <div className="ndx-admin-field">
          <span>Pick from your library</span>
          <div className="ndx-blog-editor-media-picker">
            {libraryLoading ? (
              <p className="ndx-blog-editor-media-empty">Loading library…</p>
            ) : libraryError ? (
              <p className="ndx-blog-editor-media-empty">{libraryError}</p>
            ) : libraryAssets.length === 0 ? (
              <p className="ndx-blog-editor-media-empty">
                No images yet. Upload images in Admin → Media first.
              </p>
            ) : (
              libraryAssets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  className={`ndx-blog-editor-media-pick${selectedAssetId === asset.id ? ' is-selected' : ''}`}
                  onClick={() => onPickAsset(asset)}
                  title={asset.alt || asset.secure_url}
                >
                  <img src={asset.secure_url} alt={asset.alt || ''} loading="lazy" />
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <label className="ndx-admin-field">
        <span>Alt text (required)</span>
        <input
          className="ndx-admin-input"
          value={imageAlt}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder="Describe the image for SEO and accessibility"
        />
      </label>
      <label className="ndx-admin-field">
        <span>Caption (optional)</span>
        <input
          className="ndx-admin-input"
          value={imageCaption}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="Shown below the image"
        />
      </label>
    </>
  );
}

function HtmlEmbedModalFields({ htmlInput, onHtmlInputChange }) {
  const htmlPreview = htmlInput.trim() ? sanitizeBlogEditorHtml(htmlInput) : '';

  return (
    <>
      <p className="ndx-admin-field-hint" style={{ marginTop: 0 }}>
        Paste HTML for custom sections. Scripts and external stylesheets are blocked. You can use{' '}
        <strong>inline styles</strong> and a single embedded <code>&lt;style&gt;</code> block (no{' '}
        <code>@import</code>, no <code>url()</code>).
      </p>
      <label className="ndx-admin-field">
        <span>HTML + optional CSS</span>
        <textarea
          className="ndx-admin-textarea ndx-admin-textarea--mono"
          rows={10}
          value={htmlInput}
          onChange={(e) => onHtmlInputChange(e.target.value)}
          placeholder={`<style>
.feature-box { padding: 1.25rem; border-radius: 12px; background: #0b1340; color: #fff; }
</style>
<section class="feature-box">
  <h2 style="margin:0 0 0.5rem;color:#2dd4bf">Custom section</h2>
  <p style="margin:0">Styled with embedded CSS + inline styles.</p>
</section>`}
          autoFocus
        />
      </label>
      <div className="ndx-admin-field">
        <span>Sanitized preview</span>
        <div
          className="ndx-blog-raw-html-preview"
          dangerouslySetInnerHTML={{
            __html: htmlPreview || '<p class="ndx-admin-field-hint">Preview appears here</p>',
          }}
        />
      </div>
    </>
  );
}

function ColorPicker({ editor }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const current = editor.getAttributes('textStyle').color || '';

  const apply = useCallback(
    (color) => {
      applyTextColor(editor, color);
      setOpen(false);
    },
    [editor],
  );

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <div className="ndx-blog-editor-color">
        <ToolbarButton
          buttonRef={triggerRef}
          active={!!current}
          onMouseDown={preventToolbarFocusSteal}
          onClick={() => setOpen((value) => !value)}
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
      </div>
      <EditorToolbarPopover open={open} onClose={close} anchorRef={triggerRef} className="ndx-blog-editor-color-menu">
        <div className="ndx-blog-editor-color-grid">
          {EDITOR_COLOR_PALETTE.map((c) => (
            <button
              key={c.value}
              type="button"
              className={`ndx-blog-editor-color-chip${current === c.value ? ' is-active' : ''}`}
              style={{ background: c.value }}
              title={c.label}
              aria-label={c.label}
              onMouseDown={preventToolbarFocusSteal}
              onClick={() => apply(c.value)}
            />
          ))}
        </div>
        <label className="ndx-blog-editor-color-custom">
          <span>Custom</span>
          <input
            type="color"
            value={current || '#f8fafc'}
            onMouseDown={preventToolbarFocusSteal}
            onChange={(e) => apply(e.target.value)}
          />
        </label>
        <button
          type="button"
          className="ndx-blog-editor-color-clear"
          onMouseDown={preventToolbarFocusSteal}
          onClick={() => apply(null)}
        >
          Clear color
        </button>
      </EditorToolbarPopover>
    </>
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
  const [imageMode, setImageMode] = useState('url'); // 'url' | 'library'
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [libraryAssets, setLibraryAssets] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryError, setLibraryError] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [htmlOpen, setHtmlOpen] = useState(false);
  const [htmlInput, setHtmlInput] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

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

  const closeLink = useCallback(() => setLinkOpen(false), []);
  const closeImage = useCallback(() => setImageOpen(false), []);
  const closeHtml = useCallback(() => setHtmlOpen(false), []);
  const closeAlert = useCallback(() => setAlertOpen(false), []);

  const openLink = useCallback(() => {
    if (!editor) return;
    setLinkUrl(editor.getAttributes('link').href || 'https://');
    setLinkOpen(true);
  }, [editor]);

  const confirmLink = useCallback(() => {
    if (!editor) return;
    const url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
    setLinkOpen(false);
  }, [editor, linkUrl]);

  /** Lazy-load the Media library once when the user switches to that tab. */
  const loadLibrary = useCallback(async () => {
    if (!token) {
      setLibraryError('Sign in to browse the media library.');
      return;
    }
    setLibraryLoading(true);
    setLibraryError('');
    try {
      const res = await fetch(apiUrl('/api/media'), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not load media library');
      setLibraryAssets(Array.isArray(data.assets) ? data.assets : []);
    } catch (e) {
      setLibraryError(e.message || 'Could not load media library');
    } finally {
      setLibraryLoading(false);
    }
  }, [token]);

  const openImage = useCallback(() => {
    setImageMode('url');
    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
    setSelectedAssetId(null);
    setLibraryError('');
    setImageOpen(true);
  }, []);

  const onModeChange = useCallback(
    (next) => {
      setImageMode(next);
      if (next === 'library' && libraryAssets.length === 0 && !libraryLoading) {
        loadLibrary();
      }
    },
    [libraryAssets.length, libraryLoading, loadLibrary],
  );

  const onPickAsset = useCallback((asset) => {
    setSelectedAssetId(asset.id);
    setImageUrl(asset.secure_url);
    setImageAlt((prev) => prev || asset.alt || '');
    setImageCaption((prev) => prev || asset.caption || '');
  }, []);

  const confirmImage = useCallback(() => {
    if (!editor) return;
    const url = imageUrl.trim();
    if (!url) {
      notify('Paste an image URL or pick from the library first.');
      return;
    }
    if (!/^https?:\/\//i.test(url)) {
      notify('Image URL must start with http:// or https://');
      return;
    }
    if (!imageAlt.trim()) {
      notify('Alt text is required for SEO.');
      return;
    }
    const inserted = insertBlogFigure(editor, {
      src: url,
      alt: imageAlt.trim(),
      caption: imageCaption.trim(),
    });
    if (!inserted) {
      notify('Could not insert image into the editor.');
      return;
    }
    setImageOpen(false);
  }, [editor, imageAlt, imageCaption, imageUrl, notify]);

  const openHtml = useCallback(() => {
    setHtmlInput('');
    setHtmlOpen(true);
  }, []);

  const confirmHtml = useCallback(() => {
    if (!editor) return;
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
  }, [editor, htmlInput]);

  if (!editor) return null;

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
        onClose={closeLink}
        footer={
          <>
            <button type="button" className="ndx-btn" onClick={closeLink}>
              Cancel
            </button>
            <button type="button" className="ndx-btn ndx-btn-primary" onClick={confirmLink}>
              Apply
            </button>
          </>
        }
      >
        <LinkModalFields linkUrl={linkUrl} onLinkUrlChange={setLinkUrl} />
      </AdminEditorModal>

      <AdminEditorModal
        open={imageOpen}
        title="Insert inline image"
        wide
        onClose={closeImage}
        footer={
          <>
            <button type="button" className="ndx-btn" onClick={closeImage}>
              Cancel
            </button>
            <button
              type="button"
              className="ndx-btn ndx-btn-primary"
              disabled={!imageUrl.trim() || !imageAlt.trim()}
              onClick={confirmImage}
            >
              Insert
            </button>
          </>
        }
      >
        <ImageModalFields
          mode={imageMode}
          onModeChange={onModeChange}
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          imageCaption={imageCaption}
          libraryAssets={libraryAssets}
          libraryLoading={libraryLoading}
          libraryError={libraryError}
          selectedAssetId={selectedAssetId}
          onUrlChange={setImageUrl}
          onAltChange={setImageAlt}
          onCaptionChange={setImageCaption}
          onPickAsset={onPickAsset}
        />
      </AdminEditorModal>

      <AdminEditorModal
        open={htmlOpen}
        title="Embed HTML"
        wide
        onClose={closeHtml}
        footer={
          <>
            <button type="button" className="ndx-btn" onClick={closeHtml}>
              Cancel
            </button>
            <button type="button" className="ndx-btn ndx-btn-primary" disabled={!htmlInput.trim()} onClick={confirmHtml}>
              Insert
            </button>
          </>
        }
      >
        <HtmlEmbedModalFields htmlInput={htmlInput} onHtmlInputChange={setHtmlInput} />
      </AdminEditorModal>

      <AdminEditorModal
        open={alertOpen}
        title="Notice"
        onClose={closeAlert}
        footer={
          <button type="button" className="ndx-btn ndx-btn-primary" onClick={closeAlert}>
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
  const isEditorUpdate = useRef(false);

  const editor = useEditor({
    extensions: createBlogEditorExtensions(),
    content: contentHtml || '',
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      isEditorUpdate.current = true;
      onChange(serializeBlogEditorHtml(ed));
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor || contentHtml === undefined) return;
    if (isEditorUpdate.current) {
      isEditorUpdate.current = false;
      return;
    }
    const serialized = serializeBlogEditorHtml(editor);
    if (serialized === contentHtml) return;
    editor.commands.setContent(contentHtml || '', false);
  }, [editor, contentHtml]);

  return editor;
}

export default function BlogBlockEditor({ editor, token, showToolbar = true, onNotify }) {
  if (!editor) {
    return (
      <div className="ndx-blog-editor ndx-blog-editor--focus ndx-blog-editor--loading" aria-busy="true">
        <p className="ndx-admin-field-hint">Loading editor…</p>
      </div>
    );
  }

  return (
    <div className="ndx-blog-editor ndx-blog-editor--focus">
      {showToolbar && <BlogEditorToolbar editor={editor} token={token} onNotify={onNotify} />}
      <div className="ndx-blog-editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
