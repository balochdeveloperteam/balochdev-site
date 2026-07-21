/** Dummy client stories — replace with live platform reviews later. */

export type ReviewPlatform = 'Clutch' | 'Upwork' | 'GoodFirms' | 'Trustpilot' | 'Fiverr';

export type ProjectReview = {
  id: string;
  projectSlug: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  platform: ReviewPlatform;
  rating: number;
  /** Placeholder until real platform links are wired */
  dummy: true;
};

export const AGGREGATE_RATING = {
  score: '5.0',
  outOf: '5',
  label: 'Average across Clutch · Upwork · GoodFirms · Trustpilot · Fiverr',
  platforms: [
    { name: 'Clutch' as const, href: null as string | null },
    { name: 'Upwork' as const, href: null },
    { name: 'GoodFirms' as const, href: null },
    { name: 'Trustpilot' as const, href: null },
    { name: 'Fiverr' as const, href: null },
  ],
};

export const projectReviews: ProjectReview[] = [
  {
    id: 'rv-mango-1',
    projectSlug: 'mango-restaurant',
    quote:
      'BalochDev rebuilt our restaurant ops in weeks — real-time orders, Telegram alerts, and a dashboard our staff actually uses. Clear milestones, no surprise invoices.',
    name: 'Alexei M.',
    role: 'Owner',
    company: 'ManGo Restaurant',
    platform: 'Upwork',
    rating: 5,
    dummy: true,
  },
  {
    id: 'rv-shabash-1',
    projectSlug: 'shabash',
    quote:
      'We outgrew Shopify. Their NestJS + Next storefront with BenefitPay and rewards felt purpose-built for Bahrain — senior engineers on every call.',
    name: 'Sara K.',
    role: 'Founder',
    company: 'Shbash',
    platform: 'Clutch',
    rating: 5,
    dummy: true,
  },
  {
    id: 'rv-toy-1',
    projectSlug: 'theory-of-you',
    quote:
      'From curriculum UX to Stripe and certificates, they shipped a learning platform students can finish — not a pile of disconnected tutorials.',
    name: 'James R.',
    role: 'Product lead',
    company: 'Theory of You',
    platform: 'GoodFirms',
    rating: 5,
    dummy: true,
  },
  {
    id: 'rv-iinta-1',
    projectSlug: 'iinta',
    quote:
      'Editorial and commerce in one Liquid storefront — mega-menu IA across dozens of verticals without drowning the magazine voice. Still partners years later.',
    name: 'Nadia H.',
    role: 'Publisher',
    company: 'iinta.ca',
    platform: 'Trustpilot',
    rating: 5,
    dummy: true,
  },
  {
    id: 'rv-doch-1',
    projectSlug: 'doch',
    quote:
      'Bilingual EN / Balochi craft site that feels premium and loads fast. They understood heritage branding without slowing the build.',
    name: 'Ramin D.',
    role: 'Creative director',
    company: 'DOCH',
    platform: 'Fiverr',
    rating: 5,
    dummy: true,
  },
  {
    id: 'rv-toledo-1',
    projectSlug: 'toledo-locks',
    quote:
      'B2B lock catalog UX finally matches how buyers research hardware. Discovery flows and Next.js storefront landed on time and on budget.',
    name: 'Michael T.',
    role: 'Operations',
    company: 'Toledo & Co.',
    platform: 'Upwork',
    rating: 5,
    dummy: true,
  },
  {
    id: 'rv-mango-2',
    projectSlug: 'mango-restaurant',
    quote:
      'Near-zero infra cost was a hard constraint — Firebase + their architecture delivered live sync without a surprise cloud bill.',
    name: 'Irina V.',
    role: 'Ops manager',
    company: 'ManGo Restaurant',
    platform: 'Clutch',
    rating: 5,
    dummy: true,
  },
  {
    id: 'rv-shabash-2',
    projectSlug: 'shabash',
    quote:
      'Security audit findings got closed, Apple Pay worked, and guest order tracking stopped support tickets. Treat them like an embedded product team.',
    name: 'Omar A.',
    role: 'CTO advisor',
    company: 'Shbash',
    platform: 'GoodFirms',
    rating: 5,
    dummy: true,
  },
];

export function reviewsForProject(slug: string | null | undefined): ProjectReview[] {
  if (!slug) return [];
  return projectReviews.filter((r) => r.projectSlug === slug);
}

export function initialsFromName(name: string): string {
  const parts = name.replace(/[^a-zA-Z\s.]/g, '').trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}
