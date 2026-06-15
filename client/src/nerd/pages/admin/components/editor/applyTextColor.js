/**
 * Apply TipTap text color without losing selection (toolbar controls steal focus).
 */
export function applyTextColor(editor, color) {
  if (!editor) return;

  const { empty, from, to } = editor.state.selection;
  const chain = editor.chain().focus();

  if (!color) {
    chain.extendMarkRange('textStyle').unsetColor().run();
    return;
  }

  if (!empty && to > from) {
    chain.extendMarkRange('textStyle').setColor(color).run();
    return;
  }

  // Cursor only — color entire text block (e.g. heading) or next typed chars
  const { $from } = editor.state.selection;
  const blockStart = $from.start();
  const blockEnd = $from.end();
  if (blockEnd > blockStart) {
    editor
      .chain()
      .focus()
      .setTextSelection({ from: blockStart, to: blockEnd })
      .extendMarkRange('textStyle')
      .setColor(color)
      .run();
    return;
  }

  chain.setColor(color).run();
}

/** Prevent toolbar controls from clearing the editor selection before apply. */
export function preventToolbarFocusSteal(e) {
  e.preventDefault();
}
