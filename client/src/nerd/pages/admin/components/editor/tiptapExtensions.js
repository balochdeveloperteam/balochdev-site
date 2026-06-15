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
    return ({ node }) => {
      const figure = document.createElement('figure');
      figure.className = 'blog-figure';
      const img = document.createElement('img');
      img.src = node.attrs.src || '';
      img.alt = node.attrs.alt || '';
      img.loading = 'lazy';
      const figcap = document.createElement('figcaption');
      figcap.textContent = node.attrs.caption || '';
      if (!node.attrs.caption) figcap.classList.add('is-empty');
      figure.append(img, figcap);
      return { dom: figure };
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
    Placeholder.configure({ placeholder: 'Write your post…' }),
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
