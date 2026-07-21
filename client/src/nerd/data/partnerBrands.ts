export type PartnerBrand = {
  id: string;
  name: string;
  href: string;
  src: string;
  alt: string;
};

/**
 * Logos + official links — order is display order.
 * Raster/SVG files live under `client/public/partners/` so tiles load from the app origin (no cross-domain latency).
 */
export const PARTNER_BRANDS: PartnerBrand[] = [
  {
    id: "balochistaniyat",
    name: "Balochistaniyat",
    href: "https://balochistaniyat.balochiacademy.org/index.php/journal",
    src: "/partners/balochistaniyat.png",
    alt: "Balochistaniyat — research journal of Balochi Academy",
  },
  {
    id: "ebooks",
    name: "Balochi Academy E-BOOKS",
    href: "https://ebook.balochiacademy.org/",
    src: "/partners/ebooks.png",
    alt: "Balochi Academy e-books library",
  },
  {
    id: "academy",
    name: "Balochi Academy",
    href: "https://academy.balochiacademy.org/",
    src: "/partners/academy.jpg",
    alt: "Balochi Academy Quetta",
  },
  {
    id: "dictionary",
    name: "Balochi Dictionary",
    href: "https://thebalochi.com/balochidictionary/",
    src: "/partners/dictionary.png",
    alt: "Balochi Dictionary — thebalochi.com",
  },
  {
    id: "taheer",
    name: "Taheer Team",
    href: "https://www.youtube.com/@taheerteam",
    src: "/partners/taheer.jpg",
    alt: "Taheer Team",
  },
  {
    id: "iinta",
    name: "iinta.ca",
    href: "https://iinta.ca/",
    src: "/partners/iinta.png",
    alt: "iinta — what are you into?",
  },
  {
    id: "shbash",
    name: "Shbash",
    href: "https://shbash.co/",
    src: "/partners/shbash.png",
    alt: "Shbash — Bahrain mobile accessories brand",
  },
  {
    id: "soroz-ai",
    name: "Soroz AI",
    href: "https://zahirok-ai-frontend-bwhlov9xg-jaberb281-arts-projects.vercel.app/",
    src: "/partners/soroz-ai.svg",
    alt: "Soroz AI — multilingual music generation by BalochDev",
  },
  {
    id: "adam-holland",
    name: "Adam Holland Marketing",
    href: "https://www.adamhollandmarketing.com/",
    src: "/partners/adam-holland.svg",
    alt: "Adam Holland Marketing",
  },
  {
    id: "mahmoud-alzeer",
    name: "Mahmoud Alzeer",
    href: "https://mahmoudalzeer.com/",
    src: "/partners/mahmoud-alzeer.svg",
    alt: "Mahmoud Alzeer — digital marketing",
  },
  {
    id: "amazon-ads",
    name: "Amazon Ads",
    href: "https://advertising.amazon.com/",
    src: "/partners/amazon-ads.svg",
    alt: "Amazon Ads",
  },
  {
    id: "google-premier-2026",
    name: "Google Premier Partner 2026",
    href: "https://www.google.com/partners/",
    src: "/partners/google-premier-2026.svg",
    alt: "Google Premier Partner 2026",
  },
];
