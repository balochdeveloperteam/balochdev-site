import { useState } from 'react';
import { FaFacebookF, FaLinkedinIn, FaRedditAlien } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

import { SITE_URL } from '../../seo/siteSeo';

export default function BlogShareRow({ slug, title }) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/blog/${slug}`;
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="ndx-blog-share">
      <span className="ndx-blog-share__label">Share</span>
      <button type="button" className="ndx-blog-share__btn" onClick={copyLink} title="Copy link" aria-label="Copy link">
        {copied ? '✓' : '⎘'}
      </button>
      <a
        className="ndx-blog-share__btn"
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
      >
        <FaXTwitter size={14} />
      </a>
      <a
        className="ndx-blog-share__btn"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
      >
        <FaLinkedinIn size={14} />
      </a>
      <a
        className="ndx-blog-share__btn"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
      >
        <FaFacebookF size={14} />
      </a>
      <a
        className="ndx-blog-share__btn"
        href={`https://reddit.com/submit?url=${encoded}&title=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Reddit"
      >
        <FaRedditAlien size={14} />
      </a>
    </div>
  );
}
