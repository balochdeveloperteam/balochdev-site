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
    id: "deepseek",
    name: "DeepSeek",
    href: "https://www.deepseek.com/",
    src: "/partners/deepseek.svg",
    alt: "DeepSeek",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    href: "https://gemini.google.com/",
    src: "/partners/gemini.svg",
    alt: "Google Gemini",
  },
  {
    id: "suno",
    name: "Suno AI",
    href: "https://suno.com/",
    src: "/partners/suno.png",
    alt: "Suno AI",
  },
  {
    id: "iinta",
    name: "iinta.ca",
    href: "https://iinta.ca/",
    src: "/partners/iinta.png",
    alt: "iinta — what are you into?",
  },
];
