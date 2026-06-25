import { Node, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { Color, FontSize, TextStyle } from '@tiptap/extension-text-style';

export const FONT_SIZE_OPTIONS = [
  { label: 'Small', value: '0.875rem' },
  { label: 'Normal', value: '' },
  { label: 'Large', value: '1.25rem' },
  { label: 'XL', value: '1.5rem' },
];

export const EDITOR_COLOR_PALETTE = [
  { label: 'White', value: '#f8fafc' },
  { label: 'Light gray', value: '#cbd5e1' },
  { label: 'Muted', value: '#94a3b8' },
  { label: 'Dark gray', value: '#64748b' },
  { label: 'Teal accent', value: '#2dd4bf' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Coral', value: '#ff6b4a' },
  { label: 'Sky', value: '#38bdf8' },
  { label: 'Rose', value: '#fb7185' },
];

export const BlogFigure = Node.create({
  name: 'blogFigure',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: '' },
      caption: { default: '' },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'figure.blog-figure',
        getAttrs: (node) => {
          const el = node;
          const img = el.querySelector('img');
          const cap = el.querySelector('figcaption');
          return {
            src: img?.getAttribute('src') || null,
            alt: img?.getAttribute('alt') || '',
            caption: cap?.textContent || '',
          };
        },
      },
    ];
  },
  renderHTML({ node }) {
    const { src, alt, caption } = node.attrs;
    return [
      'figure',
      { class: 'blog-figure' },
      ['img', { src, alt: alt || '', loading: 'lazy' }],
      ['figcaption', {}, caption || ''],
    ];
  },
  addNodeView() {
    return ({ node: initialNode, getPos, editor: tiptapEditor }) => {
      const figure = document.createElement('figure');
      figure.className = 'blog-figure';

      const img = document.createElement('img');
      img.src = initialNode.attrs.src || '';
      img.alt = initialNode.attrs.alt || '';
      img.loading = 'lazy';

      const figcap = document.createElement('figcaption');
      figcap.textContent = initialNode.attrs.caption || '';
      if (!initialNode.attrs.caption) figcap.classList.add('is-empty');

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'blog-figure-delete';
      deleteBtn.setAttribute('aria-label', 'Remove image');
      deleteBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>';
      deleteBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pos = typeof getPos === 'function' ? getPos() : undefined;
        if (typeof pos === 'number') {
          tiptapEditor.chain().setNodeSelection(pos).deleteSelection().run();
        }
      });

      figure.append(img, figcap, deleteBtn);

      return {
        dom: figure,
        update(updatedNode) {
          if (updatedNode.type.name !== 'blogFigure') return false;
          img.src = updatedNode.attrs.src || '';
          img.alt = updatedNode.attrs.alt || '';
          figcap.textContent = updatedNode.attrs.caption || '';
          if (updatedNode.attrs.caption) {
            figcap.classList.remove('is-empty');
          } else {
            figcap.classList.add('is-empty');
          }
          return true;
        },
      };
    };
  },
});

export const BlogRawHtml = Node.create({
  name: 'blogRawHtml',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      html: { default: '' },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div.blog-raw-html[data-raw-html]',
        getAttrs: (node) => ({ html: node.innerHTML || '' }),
      },
    ];
  },
  renderHTML() {
    return ['div', { class: 'blog-raw-html', 'data-raw-html': 'true' }];
  },
  addNodeView() {
    return ({ node }) => {
      const wrap = document.createElement('div');
      wrap.className = 'blog-raw-html';
      wrap.setAttribute('data-raw-html', 'true');

      const label = document.createElement('span');
      label.className = 'blog-raw-html__label';
      label.textContent = 'HTML embed';

      const preview = document.createElement('div');
      preview.className = 'blog-raw-html__preview';
      preview.innerHTML = node.attrs.html || '';

      wrap.append(label, preview);
      return { dom: wrap };
    };
  },
});

/** Expand empty raw-html placeholders with stored attrs for save/API. */
export function serializeBlogEditorHtml(editor) {
  const rawNodes = [];
  editor.state.doc.descendants((node) => {
    if (node.type.name === 'blogRawHtml') {
      rawNodes.push(node.attrs.html || '');
    }
  });

  let html = editor.getHTML();
  let index = 0;
  html = html.replace(
    /<div class="blog-raw-html" data-raw-html="true"><\/div>/g,
    () => {
      const inner = rawNodes[index++] || '';
      return `<div class="blog-raw-html" data-raw-html="true">${inner}</div>`;
    },
  );
  return html;
}

function escapeHtmlAttr(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtmlText(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Build sanitized figure HTML for TipTap parseHTML → blogFigure node. */
export function buildBlogFigureHtml({ src, alt, caption = '' }) {
  const figcaption = caption.trim()
    ? `<figcaption>${escapeHtmlText(caption.trim())}</figcaption>`
    : '<figcaption></figcaption>';
  return `<figure class="blog-figure"><img src="${escapeHtmlAttr(src)}" alt="${escapeHtmlAttr(alt)}" loading="lazy" />${figcaption}</figure>`;
}

/** Insert an inline blog figure at the current selection. Returns false if insert failed. */
export function insertBlogFigure(editor, { src, alt, caption = '' }) {
  if (!editor || !src) return false;
  return editor
    .chain()
    .focus()
    .insertContent({ type: 'blogFigure', attrs: { src, alt: alt || '', caption: caption || '' } })
    .insertContent({ type: 'paragraph' })
    .run();
}

export function createBlogEditorExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3] },
      codeBlock: {
        HTMLAttributes: { class: 'blog-code-block' },
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
    }),
    Placeholder.configure({
      placeholder:
        'Start writing your article… use the toolbar for headings, images, and formatting.',
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
    }),
    TextStyle,
    Color.configure({ types: ['textStyle'] }),
    FontSize.configure({
      types: ['textStyle'],
    }),
    BlogFigure,
    BlogRawHtml,
  ];
}
