import { useMemo } from 'react';

import { splitHtmlAtMidpoint } from '../../lib/splitHtmlAtMidpoint';
import BlogAdSlot from './BlogAdSlot';

/**
 * Article body — single prose block by default (prerender-safe).
 * When an in-content ad exists, splits HTML at ~50% and inserts the ad between halves.
 * @param {{ html: string, inContentAd?: object|null, isImageCaption?: boolean }} props
 */
export default function BlogArticleBody({ html, inContentAd = null, isImageCaption = false }) {
  const proseClass = `ndx-blog-prose ndx-blog-prose--in-main${isImageCaption ? ' ndx-blog-prose--caption' : ''}`;
  const bodyHtml = html || '<p></p>';

  const split = useMemo(() => {
    if (!inContentAd?.image_url) return null;
    return splitHtmlAtMidpoint(bodyHtml);
  }, [bodyHtml, inContentAd?.image_url]);

  if (!split || !split.second) {
    return (
      <div className={proseClass} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    );
  }

  return (
    <>
      <div className={proseClass} dangerouslySetInnerHTML={{ __html: split.first || '<p></p>' }} />
      <BlogAdSlot ad={inContentAd} variant="in-content" />
      <div className={proseClass} dangerouslySetInnerHTML={{ __html: split.second }} />
    </>
  );
}
