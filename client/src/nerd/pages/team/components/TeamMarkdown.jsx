/** Lightweight markdown renderer for policy content (headings, lists, emphasis). */
export default function TeamMarkdown({ content }) {
  if (!content?.trim()) {
    return <p className="ndx-tech-blurb">No content yet.</p>;
  }

  const lines = content.replace(/\r\n/g, '\n').split('\n');
  /** @type {import('react').ReactNode[]} */
  const nodes = [];
  let listItems = [];

  const flushList = () => {
    if (!listItems.length) return;
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="ndx-team-md-list">
        {listItems.map((item, i) => (
          <li key={i}>{inlineFormat(item)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushList();
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      listItems.push(line.replace(/^[-*]\s+/, ''));
      continue;
    }
    flushList();
    if (line.startsWith('### ')) {
      nodes.push(<h4 key={nodes.length} className="ndx-team-md-h4">{inlineFormat(line.slice(4))}</h4>);
    } else if (line.startsWith('## ')) {
      nodes.push(<h3 key={nodes.length} className="ndx-team-md-h3">{inlineFormat(line.slice(3))}</h3>);
    } else if (line.startsWith('# ')) {
      nodes.push(<h2 key={nodes.length} className="ndx-team-md-h2">{inlineFormat(line.slice(2))}</h2>);
    } else {
      nodes.push(<p key={nodes.length} className="ndx-team-md-p">{inlineFormat(line)}</p>);
    }
  }
  flushList();

  return <div className="ndx-team-markdown">{nodes}</div>;
}

function inlineFormat(text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
