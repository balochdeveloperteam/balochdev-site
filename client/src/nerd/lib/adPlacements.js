/** Ad placement ids — must match public.ad_placement enum in 008_ads.sql */
export const AD_PLACEMENTS = [
  {
    id: 'blog_hero',
    label: 'Blog Hero',
    description: 'Wide landscape banner on the main /blog page, under the page heading and above filters.',
    specs: '1200 × 300 px (4:1 aspect ratio). Max 300 KB. JPG, PNG, or WebP.',
    variant: 'hero',
  },
  {
    id: 'post_sidebar_a',
    label: 'Post Sidebar A',
    description: 'Portrait or square ad in the single-post right sidebar (first ad slot).',
    specs: '400 × 500 px (4:5) or 400 × 400 px square. Max 200 KB. JPG, PNG, or WebP.',
    variant: 'sidebar',
  },
  {
    id: 'post_sidebar_b',
    label: 'Post Sidebar B',
    description: 'Second ad slot in the single-post right sidebar.',
    specs: '400 × 500 px (4:5) or 400 × 400 px square. Max 200 KB. JPG, PNG, or WebP.',
    variant: 'sidebar',
  },
];

export const AD_PLACEMENT_BY_ID = Object.fromEntries(AD_PLACEMENTS.map((p) => [p.id, p]));
