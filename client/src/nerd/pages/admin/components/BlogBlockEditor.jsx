import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  TbBold,
  TbCode,
  TbH2,
  TbH3,
  TbItalic,
  TbLink,
  TbList,
  TbListNumbers,
  TbMinus,
  TbPhoto,
  TbQuote,
  TbSourceCode,
} from 'react-icons/tb';
import { apiUrl } from '../../../../lib/api';

function escapeAttr(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

export function ToolbarButton({ active, onClick, children, title }) {
  return (
    <button type="button" className={active ? 'is-active' : ''} onClick={onClick} title={title} aria-label={title}>
      {children}
    </button>
  );
}

export function BlogEditorToolbar({ editor, token }) {
  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes('link').href;
    const url = window.prompt('Link URL', prev || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const insertImageFigure = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,image/gif';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !token) return;
      const alt = window.prompt('Alt text (required for SEO):', '');
      if (!alt?.trim()) {
        alert('Alt text is required.');
        return;
      }
      const caption = window.prompt('Caption (optional):', '') || '';
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', 'balochdev/blog');
      const res = await fetch(apiUrl('/api/uploads/image'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        alert('Image upload failed');
        return;
      }
      const { secureUrl } = await res.json();
      const captionHtml = caption.trim()
        ? `<figcaption>${escapeAttr(caption.trim())}</figcaption>`
        : '<figcaption></figcaption>';
      editor
        .chain()
        .focus()
        .insertContent(
          `<figure class="blog-figure"><img src="${escapeAttr(secureUrl)}" alt="${escapeAttr(alt.trim())}" loading="lazy" />${captionHtml}</figure><p></p>`,
        )
        .run();
    };
    input.click();
  };

  const insertRawHtml = () => {
    const html = window.prompt('Paste HTML (sanitized on save):');
    if (!html?.trim()) return;
    editor
      .chain()
      .focus()
      .insertContent(`<div class="blog-raw-html" data-raw-html="true">${html}</div><p></p>`)
      .run();
  };

  return (
    <div className="ndx-blog-editor-toolbar ndx-blog-editor-toolbar--icons">
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
      <ToolbarButton
        active={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        title="Code block"
      >
        <TbCode aria-hidden />
      </ToolbarButton>
      <ToolbarButton onClick={setLink} title="Link">
        <TbLink aria-hidden />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
        <TbMinus aria-hidden />
      </ToolbarButton>
      <ToolbarButton onClick={insertImageFigure} title="Centered image">
        <TbPhoto aria-hidden />
      </ToolbarButton>
      <ToolbarButton onClick={insertRawHtml} title="Raw HTML block">
        <TbSourceCode aria-hidden />
      </ToolbarButton>
    </div>
  );
}

export function useBlogBlockEditor({ contentHtml, onChange, disabled }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } }),
      Placeholder.configure({ placeholder: 'Write your post…' }),
    ],
    content: contentHtml || '',
    editable: !disabled,
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor || contentHtml === undefined) return;
    if (editor.getHTML() !== contentHtml) {
      editor.commands.setContent(contentHtml || '', false);
    }
  }, [editor, contentHtml]);

  return editor;
}

export default function BlogBlockEditor({ editor, token, showToolbar = true }) {
  if (!editor) return null;

  return (
    <div className="ndx-blog-editor ndx-blog-editor--focus">
      {showToolbar && <BlogEditorToolbar editor={editor} token={token} />}
      <div className="ndx-blog-editor-content">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
