import mango1 from "../../assets/Projects/ManGo/1.webp";
import mango2 from "../../assets/Projects/ManGo/2.webp";
import mango3 from "../../assets/Projects/ManGo/3.webp";
import toy1 from "../../assets/Projects/TheoryOfYou/4-j.webp";
import toy2 from "../../assets/Projects/TheoryOfYou/5-j.webp";
import toy3 from "../../assets/Projects/TheoryOfYou/6-j.webp";
import toy4 from "../../assets/Projects/TheoryOfYou/7-j.webp";
import doch1 from "../../assets/Projects/Doch.com/1.webp";
import doch2 from "../../assets/Projects/Doch.com/2.webp";
import doch3 from "../../assets/Projects/Doch.com/3.webp";
import doch4 from "../../assets/Projects/Doch.com/4.webp";
import doch5 from "../../assets/Projects/Doch.com/5.webp";
import iinta1 from "../../assets/Projects/iinta.ca/1.webp";
import iinta2 from "../../assets/Projects/iinta.ca/2.webp";
import iinta3 from "../../assets/Projects/iinta.ca/3.webp";
import iinta4 from "../../assets/Projects/iinta.ca/4.webp";
import iinta5 from "../../assets/Projects/iinta.ca/5.webp";
import iinta6 from "../../assets/Projects/iinta.ca/6.webp";
import iinta7 from "../../assets/Projects/iinta.ca/7.webp";
import iinta8 from "../../assets/Projects/iinta.ca/8.webp";
import iinta9 from "../../assets/Projects/iinta.ca/9.webp";
import iinta10 from "../../assets/Projects/iinta.ca/10.webp";
import soroz1 from "../../assets/Projects/Soroz.ai/1.webp";
import soroz2 from "../../assets/Projects/Soroz.ai/2.webp";
import soroz3 from "../../assets/Projects/Soroz.ai/3.webp";
import soroz4 from "../../assets/Projects/Soroz.ai/4.webp";
import soroz5 from "../../assets/Projects/Soroz.ai/5.webp";
import soroz6 from "../../assets/Projects/Soroz.ai/6.webp";
import soroz7 from "../../assets/Projects/Soroz.ai/7.webp";
import soroz8 from "../../assets/Projects/Soroz.ai/8.webp";
import toledo1 from "../../assets/Projects/Toledo/1.webp";
import toledo2 from "../../assets/Projects/Toledo/2.webp";
import toledo3 from "../../assets/Projects/Toledo/3.webp";
import toledo4 from "../../assets/Projects/Toledo/4.webp";
import toledo5 from "../../assets/Projects/Toledo/5.webp";
import shabash1 from "../../assets/Projects/shabash/1.webp";
import shabash2 from "../../assets/Projects/shabash/2.webp";
import shabash3 from "../../assets/Projects/shabash/3.webp";
import shabash4 from "../../assets/Projects/shabash/4.webp";
import shabash5 from "../../assets/Projects/shabash/5.webp";
import shabash6 from "../../assets/Projects/shabash/6.webp";
import shabash7 from "../../assets/Projects/shabash/7.webp";

export interface ProjectTeamMember {
  name: string;
  role: string;
}

export interface Project {
  slug: string | null;
  title: string;
  tagline: string;
  category: "client" | "partner" | "balochdev";
  industry: string;
  year: string;
  duration?: string;
  clientLocation?: string;
  cover: string | null;
  images?: string[];
  stack?: string[];
  featured?: boolean;
  /** Full-width top row on the portfolio grid */
  featuredHero?: boolean;
  live?: boolean;
  /** Public preview / production URL (no repo when private) */
  liveUrl?: string;
  underDevelopment?: boolean;
  challenge?: string;
  solution?: string[];
  features?: string[];
  results?: string[];
  /** One image + copy panel on the case study page (main gallery stays unchanged) */
  caseStudyPanel?: {
    image: string;
    heading: string;
    body: string;
  };
  seoDescription?: string;
  team?: ProjectTeamMember[];
}

const projects: Project[] = [
  {
    slug: "soroz",
    title: "Soroz AI",
    tagline:
      "AI music generation for any language — with stronger results for languages and traditions that tools like Suno underserve. Built and powered by BalochDev; still under active development.",
    category: "balochdev",
    industry: "AI · Music",
    year: "2025–2026",
    cover: soroz1,
    images: [
      soroz1,
      soroz2,
      soroz3,
      soroz4,
      soroz5,
      soroz6,
      soroz7,
      soroz8,
    ],
    stack: ["Large-level LLM model for music"],
    featured: true,
    featuredHero: true,
    underDevelopment: true,
    live: false,
    liveUrl: "https://zahirok-ai-frontend-bwhlov9xg-jaberb281-arts-projects.vercel.app/",
    seoDescription:
      "Soroz AI by BalochDev — under-development AI music generation for any language, with stronger results for languages and traditions global tools like Suno often miss. Powered by a large-level LLM model for music.",
    challenge:
      "Global AI music tools generate songs in many languages — but quality collapses for languages, dialects, and musical traditions they under-train. Creators who need Balochi, Makkuran, coastal folk, and other underserved voices are left with generic pastiche or nothing usable at all.",
    solution: [
      "Building a music LLM product that can generate in any language, while specializing where mainstream tools are weakest.",
      "Investing depth in Balochi and related coastal folk instruments and forms — Dambora, Suroz, Doholl — so those outputs are markedly better than one-size-fits-all generators.",
      "Designing mood-, lyric-, and instrument-first creation so anyone can draft a track without studio expertise.",
      "Shipping The Drift and a full studio surface while the model and language coverage keep improving — powered by BalochDev.",
    ],
    features: [
      "Large-level LLM model for music (in development)",
      "Any-language song generation",
      "Stronger results for languages Suno-style tools miss",
      "Balochi & coastal folk depth where it matters",
      "The Drift — capture-to-song flow",
      "Studio workspace & listening surface",
      "Powered by BalochDev",
    ],
    results: [
      "Flagship BalochDev product — multilingual AI music, still under active development",
      "Live product preview while the music model and language coverage deepen",
      "Built to fill the gap left by global generators on underserved languages and sounds",
    ],
    caseStudyPanel: {
      image: soroz3,
      heading: "Any language. Better where others fail.",
      body: "Soroz is not only a Balochi music tool — it generates songs across languages from a mood, a lyric, or an instrument cue. The product goal is simple: usable drafts for creators who today get weak or empty results from global generators.\n\nWhere Suno-style platforms underserve certain languages, dialects, and folk traditions, Soroz is built to go deeper — Balochi and coastal folk sound included, without locking the product to one culture only. The Drift, studio flows, and listening surface are shipping while the music LLM keeps improving.\n\nPowered by BalochDev. Still under active development — the live preview shows the direction, not a finished catalogue of every language yet.",
    },
    team: [
      { name: "Adeel Baloch", role: "Project Manager · Full Stack Developer" },
      { name: "Shams Baloch", role: "UI / UX Design" },
    ],
  },
  {
    slug: "mango-restaurant",
    title: "ManGo Restaurant",
    tagline:
      "Enterprise-grade restaurant management platform with real-time order tracking, AI-powered customer support, Telegram push notifications, and Google Sheets record-keeping — shipped in 1.5 months at near-zero infrastructure cost.",
    category: "client",
    industry: "Food & Hospitality",
    year: "2025",
    duration: "1.5 months",
    clientLocation: "Russia",
    cover: mango1,
    images: [mango1, mango2, mango3],
    stack: [
      "React 18",
      "Firebase Firestore",
      "Firebase Auth",
      "Firebase Cloud Functions",
      "Firebase Cloud Messaging",
      "Firebase Hosting",
      "Firebase Storage",
      "Node.js",
      "Express.js",
      "Redux Toolkit",
      "React Router v6",
      "Tailwind CSS",
      "Vite",
      "Telegram Bot API",
      "Google Sheets API v4",
      "PWA",
      "Real-time Listeners",
      "Role-based Access Control",
    ],
    featured: true,
    live: true,
    seoDescription:
      "ManGo Restaurant System — a full-stack restaurant management platform built by BalochDev for a Russian client. Features real-time order management, AI chatbot support, Telegram bot notifications, Google Sheets integration, delivery tracking, staff management, analytics dashboard, and customer-facing ordering UI. Built with React 18, Firebase, Node.js, Redux Toolkit, and Tailwind CSS. Delivered in 1.5 months.",
    challenge:
      "The client, a restaurant owner in Russia, needed a scalable, cloud-backed management system but had a strict constraint: near-zero ongoing infrastructure cost. The existing workflow relied on VK — a Russian social network — for order intake. This was fragile, unscalable, and produced no analytics, no order history, and no way to track deliveries or customers. After conducting a detailed analysis of their daily order volume, customer traffic patterns, and peak hours, we concluded that the entire modern stack could run for free or at negligible cost by leveraging Firebase's Spark plan alongside Google's free API tiers.",
    solution: [
      "Architected and built a full React 18 SPA with Vite, wired to Firebase Firestore for real-time data synchronisation across all devices simultaneously — no polling, no delays.",
      "Designed and implemented a comprehensive admin dashboard giving managers a live overview of orders, revenue trends, customer acquisition, and menu performance with granular date-range filtering.",
      "Built a chef and kitchen manager portal showing live order queues with status transitions (received → preparing → ready → picked up → delivered), reducing miscommunication between front-of-house and kitchen.",
      "Engineered a product, category, and promotions management system — managers can add items with images, set prices, schedule time-limited deals, and push promotional notifications to subscribed customers.",
      "Developed a dedicated delivery management module: riders receive an in-app push notification (via Firebase Cloud Messaging) the moment an order is marked ready; pickup and drop-off confirmations are logged with timestamps.",
      "Built a customer order-tracking interface where diners can see their order status in real time without needing an account — shareable via a unique order link.",
      "Integrated a role-based access control system using Firebase Auth so owners, managers, chefs, and delivery staff each see only their relevant panels with appropriate permissions.",
      "Implemented a staff management panel for adding, editing, and assigning roles to team members, with activity logging for accountability.",
      "Integrated a lightweight AI chatbot trained on the restaurant's menu and FAQs — it resolves common enquiries (order status, opening hours, allergens, menu recommendations) around the clock, reducing staff interruptions significantly.",
      "Built a Telegram Bot integration that fires a structured, formatted order notification into a dedicated Telegram group the instant a new order is placed — visible on any device, no app switching required.",
      "Wired Google Sheets API v4 as a secondary record layer: every order is automatically appended to a live spreadsheet for accounting, printing, and long-term analysis — shareable with accountants without system access.",
    ],
    features: [
      "Real-time order dashboard (all devices)",
      "Admin analytics — revenue, orders, customers",
      "Product & category management",
      "Promotions & deals engine",
      "Customer order tracking (no login required)",
      "Kitchen queue & status board",
      "Delivery rider notifications (FCM)",
      "Delivery tracking & confirmation",
      "Staff management & role permissions",
      "AI chatbot — 24/7 customer support",
      "Telegram Bot — instant order alerts",
      "Google Sheets auto-logging",
      "Customer CRM & history",
      "PWA — works offline & installable",
      "SEO-optimised storefront",
      "Firebase Auth + RBAC security",
    ],
    results: [
      "Full platform launched and live within 1.5 months of kickoff",
      "Monthly infrastructure cost under $1 — running on Firebase free tier and Google free API quotas",
      "Order workflow fully migrated from VK to a structured, trackable system",
      "Delivery riders receive instant FCM notifications — zero manual phone calls for order dispatch",
      "All orders automatically recorded in Google Sheets — printing and accounting available immediately",
      "AI chatbot handles routine customer queries 24 / 7, freeing staff for higher-value tasks",
      "Telegram bot ensures no order is missed regardless of which device the team is using",
    ],
    team: [
      { name: "Adeel Baloch", role: "Project Manager · Full Stack Developer" },
      { name: "Shees Baloch", role: "Mobile & Backend Developer" },
      { name: "Jaber Ali", role: "Full Stack Developer" },
      { name: "Sohail Baloch", role: "Frontend Developer" },
      { name: "Shams Baloch", role: "UI / UX Design" },
    ],
  },
  {
    slug: "theory-of-you",
    title: "Theory of You",
    tagline:
      "AI Foundations — a full-stack online academy that makes artificial intelligence education practical, structured, and accessible to beginner developers and creators worldwide.",
    category: "client",
    industry: "EdTech · Online Learning",
    year: "2025",
    duration: "2 months",
    cover: toy1,
    images: [toy1, toy2, toy3, toy4],
    stack: [
      "React 18",
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "Supabase",
      "Supabase Auth",
      "Stripe",
      "Cloudflare",
      "Cloudflare R2",
      "Redis",
      "REST API",
      "JWT",
      "SSR / SEO",
    ],
    featured: true,
    live: true,
    seoDescription:
      "Theory of You — AI Foundations: a full-stack online learning platform built by BalochDev. Features structured multi-week AI/ML curriculum, project-based learning, Stripe payments, student dashboards, progress tracking, certificate generation, and SEO-optimised course pages. Built with Next.js, Supabase, PostgreSQL, Stripe, and Cloudflare.",
    challenge:
      "Beginners wanting to enter the world of artificial intelligence and machine learning had no clear, practical path. Everywhere online they were flooded with hype, disconnected tutorials, random tool lists, and overwhelming jargon. Most available courses were either too theoretical, too expensive, or too passive — students watched content but never built anything real. Many learners gave up before they even started, unsure where to begin, which technologies actually mattered, how ML workflows operated, or how to produce portfolio work that could demonstrate real skill. The client needed a platform that flipped this entirely: one built around doing rather than watching.",
    solution: [
      "Architected a full-stack Next.js 14 platform with server-side rendering throughout — every course page, lesson, and landing page is SSR for maximum SEO performance and fast first-load times without sacrificing interactivity.",
      "Designed and built a structured course system: instructors define multi-week curricula with chapters, lessons, and milestone projects. Students progress through a gated sequence, unlocking each section as they complete prior work.",
      "Implemented project-based learning modules where every course section culminates in a real, runnable AI project — not a quiz. Learners build portfolio items they can share publicly from day one.",
      "Built a student dashboard showing live progress, completed projects, accumulated skills, and course certificates — all in a single view, designed to reinforce confidence rather than overwhelm.",
      "Integrated Stripe for secure course purchases and subscription plans, including free-trial access to introductory content with zero friction for first-time learners.",
      "Implemented Supabase Auth with JWT sessions for secure, stateless user authentication across the platform, with role-based access distinguishing students, instructors, and administrators.",
      "Built a PostgreSQL database schema (via Supabase) optimised for course content hierarchy, user enrolment state, and progress tracking — with Redis caching for lesson delivery at low latency.",
      "Stored all course media (video, images, downloadable resources) on Cloudflare R2 with edge delivery via Cloudflare CDN, ensuring fast load times globally regardless of learner location.",
      "Designed and built an instructor content management panel where course creators can write lessons in a rich-text editor, attach code notebooks, upload media, and publish/unpublish content without touching code.",
      "Built a comprehensive admin dashboard covering enrolments, revenue tracking, active learner counts, course completion rates, and content moderation — all updated in real time.",
      "Implemented automatic certificate generation on course completion — PDF certificates with the student's name, course title, and completion date, downloadable and shareable.",
    ],
    features: [
      "Structured multi-week AI/ML curriculum",
      "Project-based learning — build real things",
      "Student dashboard + progress tracking",
      "Portfolio project builder",
      "Stripe payments — one-time & subscription",
      "Free-trial access to starter content",
      "Supabase Auth + JWT + RBAC",
      "Cloudflare R2 media storage + CDN delivery",
      "Redis-cached lesson delivery",
      "Instructor content management panel",
      "Rich-text lesson editor",
      "Certificate generation on completion",
      "Admin analytics dashboard",
      "SSR-optimised course & landing pages",
      "SEO-structured course metadata",
      "Mobile-responsive across all screens",
    ],
    results: [
      "Platform launched and accepting real enrolments within 2 months",
      "SSR + Cloudflare CDN delivering sub-second course page loads globally",
      "Stripe integration live — one-time purchases and subscription tiers operational",
      "PostgreSQL + Redis architecture handling concurrent learner sessions without degradation",
      "Certificate generation fully automated — no manual intervention required",
      "SEO-optimised pages ranking for beginner AI / ML search terms",
      "Instructor panel enabling content updates without any developer involvement",
    ],
    team: [
      { name: "Adeel Baloch", role: "Project Manager · Full Stack Developer" },
      { name: "Jaber Ali", role: "Full Stack Developer" },
      { name: "Sohail Baloch", role: "Frontend Developer" },
      { name: "Shams Baloch", role: "UI / UX Design" },
    ],
  },
  {
    slug: "doch",
    title: "DOCH",
    tagline:
      "Bilingual English–Balochi editorial home for Balochi hand embroidery — from Instagram DMs to a digital heritage house.",
    category: "client",
    industry: "Craft · Heritage Fashion",
    year: "2025",
    cover: doch1,
    images: [doch1, doch2, doch3, doch4, doch5],
    stack: ["HTML", "CSS", "JavaScript", "Bilingual EN / Balochi"],
    featured: true,
    live: true,
    seoDescription:
      "DOCH — a bilingual English–Balochi editorial website for Balochi hand embroidery, built by BalochDev. Region-as-atlas collections (Makrani, Rakhshani, Kalati), craft depth storytelling, bilingual toggle, and WhatsApp-native commerce. Hand-coded static site.",
    challenge:
      "DOCH's brand lived entirely on Instagram and WhatsApp — beautiful work, zero permanence. There was no durable home for the craft's regional depth, no discoverability beyond social algorithms, and no credibility layer for a heritage fashion house that deserved more than a feed and a DM thread.",
    solution: [
      "Designed the site as a digital heritage house: collections organised as a region-as-atlas (Makrani, Rakhshani, Kalati) so buyers and readers navigate by geography and stitch tradition, not generic product grids.",
      "Built a craft-depth section that explains technique, materials, and regional identity — giving the embroidery cultural weight beyond product photography.",
      "Implemented a bilingual English–Balochi experience with a clear language toggle, treating Balochi as a first-class reading mode rather than an afterthought translation.",
      "Added a Feature Your Dress CTA so wearers and makers can contribute into the brand's editorial surface.",
      "Kept commerce WhatsApp-native — the site informs and converts trust; ordering stays where the community already buys.",
      "Hand-coded a static site in HTML, CSS, and JavaScript — fast, maintainable, and free of CMS overhead for a content-led heritage brand.",
    ],
    features: [
      "Region-as-atlas collections (Makrani / Rakhshani / Kalati)",
      "Craft depth & heritage storytelling",
      "Bilingual English–Balochi toggle",
      "Feature your dress contribution CTA",
      "WhatsApp-native purchase flow",
      "Hand-coded static site — no CMS bloat",
      "Editorial-first visual presentation",
      "Mobile-first browsing experience",
    ],
    results: [
      "Brand moved from ephemeral Instagram DMs to a permanent, searchable digital home",
      "Regional embroidery traditions presented as structured collections instead of scattered posts",
      "Bilingual EN / Balochi reading experience live for diaspora and local audiences",
      "WhatsApp commerce retained — site builds trust without forcing a checkout rebuild",
      "Lightweight static delivery keeps the heritage house fast and easy to maintain",
    ],
    team: [
      { name: "Adeel Baloch", role: "Project Manager · Full Stack Developer" },
      { name: "Shams Baloch", role: "UI / UX Design" },
    ],
  },
  {
    slug: "iinta",
    title: "iinta.ca",
    tagline:
      "Magazine + marketplace + membership in one fully custom digital platform — designed, built, and managed by BalochDev since 2022.",
    category: "client",
    industry: "Media · Marketplace",
    year: "2022–2025",
    duration: "Ongoing since 2022",
    cover: iinta1,
    images: [
      iinta1,
      iinta2,
      iinta3,
      iinta4,
      iinta5,
      iinta6,
      iinta7,
      iinta8,
      iinta9,
      iinta10,
    ],
    stack: [
      "Liquid",
      "HTML",
      "CSS",
      "JavaScript",
      "Custom Shopify Storefront",
      "Apple Pay",
      "Google Pay",
      "PayPal",
    ],
    featured: true,
    live: true,
    liveUrl: "https://iinta.ca/",
    seoDescription:
      "iinta.ca — a custom magazine, marketplace, and membership platform designed, built, and managed by BalochDev since 2022. Zero-theme Liquid storefront, mega-menu IA across 20+ verticals, editorial as first-class content, and My Union Rewards membership. Hand-coded Shopify storefront with Apple Pay, Google Pay, and PayPal.",
    challenge:
      "iinta needed an identity no off-the-shelf theme could hold: editorial and commerce at equal weight, twenty-plus verticals under one roof, and a membership roadmap that template apps would only approximate. A standard Shopify theme would either bury the magazine or flatten the marketplace — neither was acceptable.",
    solution: [
      "Built a zero-theme, hand-coded Liquid storefront so every layout decision served iinta's hybrid identity rather than a theme author's defaults.",
      "Designed mega-menu information architecture spanning 20+ verticals — buyers and readers can jump into any lane without drowning in a single infinite grid.",
      "Treated editorial as a first-class surface: magazine issues and stories sit alongside commerce, not as blog afterthoughts.",
      "Layered marketplace commerce with Apple Pay, Google Pay, and PayPal for frictionless checkout across the community.",
      "Introduced My Union Rewards as a native membership layer — loyalty and belonging built into the platform, not bolted on as a third-party widget.",
      "Ongoing design, build, and management partnership since 2022 — the platform evolves with the brand rather than shipping once and walking away.",
    ],
    features: [
      "Zero-theme custom Liquid storefront",
      "Mega-menu IA across 20+ verticals",
      "Editorial magazine as first-class content",
      "Marketplace commerce checkout",
      "My Union Rewards membership",
      "Apple Pay · Google Pay · PayPal",
      "Hand-coded Shopify storefront",
      "Ongoing platform management since 2022",
    ],
    results: [
      "Grown into a six-figure business on the custom platform",
      "7+ magazine editions shipped through the editorial system",
      "20+ marketplace verticals live under one storefront",
      "8,300+ Instagram community connected to the digital home",
      "Continuously designed, built, and managed by BalochDev since 2022",
    ],
    team: [
      { name: "Adeel Baloch", role: "Project Manager · Full Stack Developer" },
      { name: "Shams Baloch", role: "UI / UX Design" },
    ],
  },
  {
    slug: "toledo-locks",
    title: "Toledo & Co.",
    tagline:
      "Security hardware e-commerce for Caribbean B2B buyers — category-first catalog, dense inventory browsing, downloadable PDF catalog.",
    category: "client",
    industry: "Hardware · B2B E-commerce",
    year: "2025",
    cover: toledo1,
    images: [toledo1, toledo2, toledo3, toledo4, toledo5],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "UX / UI", "Product Discovery"],
    featured: true,
    live: true,
    liveUrl: "https://toledolocks.com/",
    seoDescription:
      "Toledo & Co. (toledolocks.com) — security hardware e-commerce rebuilt by BalochDev for Caribbean B2B buyers. Category-first homepage, dense 354+ SKU catalog with grid/list views, downloadable PDF catalog, collections layer, and credibility-focused About. Next.js, TypeScript, Tailwind CSS.",
    challenge:
      "Toledo & Co. exports locks, deadbolts, padlocks, and related hardware across the Caribbean. Their buyers are sourcing professionals — not casual shoppers — navigating 354+ SKUs, offline procurement habits, and the need to trust a 20+ year distributor. A standard product-grid storefront would either overwhelm or hide inventory behind navigation buyers would never find.",
    solution: [
      "Led with a category-first homepage — Deadbolts, Knobs, Door Locks, Electronic Locks, Padlocks — so a buyer who knows what they need is one click from their lane.",
      "Built a dense All Products catalog with product count, per-page controls, alphabetical sort, and grid/list toggles — closer to a distributor inventory system than a D2C shop page.",
      "Added a downloadable PDF catalog for offline procurement: forward internally, compare suppliers, decide away from the browser.",
      "Layered collections for curated entry points alongside the full inventory browse.",
      "Designed a credibility-focused About experience that signals two decades of export history across dozens of markets.",
      "Optimised mobile for floor buyers checking stock and specs on the warehouse floor, not only desktop procurement desks.",
    ],
    features: [
      "Category-first homepage navigation",
      "Dense 354+ SKU catalog — grid & list",
      "Downloadable PDF product catalog",
      "Collections layer for curated browsing",
      "Credibility-focused About page",
      "Mobile-ready for floor / field buyers",
      "Product discovery tuned for B2B sourcing",
      "Live at toledolocks.com",
    ],
    results: [
      "Storefront live at toledolocks.com serving Puerto Rico, Panama, Dominican Republic, Jamaica, Costa Rica, and 25+ Caribbean markets",
      "Buyers can jump by category or browse the full dense inventory without losing their place",
      "PDF catalog supports offline procurement workflows that pure web catalogs miss",
      "Site reads as an established distributor — not a template storefront — matching 20+ years of export credibility",
    ],
    team: [
      { name: "Adeel Baloch", role: "Project Manager · Full Stack Developer" },
      { name: "Shams Baloch", role: "UI / UX Design" },
    ],
  },
  {
    slug: "shabash",
    title: "Shbash",
    tagline:
      "Custom e-commerce platform for Bahrain mobile accessories — storefront, admin, NestJS API, rewards, BenefitPay.",
    category: "client",
    industry: "E-commerce · Retail",
    year: "2025",
    clientLocation: "Bahrain",
    cover: shabash1,
    images: [
      shabash1,
      shabash2,
      shabash3,
      shabash4,
      shabash5,
      shabash6,
      shabash7,
    ],
    stack: [
      "NestJS",
      "Next.js Storefront",
      "Next.js Admin",
      "Supabase",
      "Railway",
      "Vercel",
      "Cloudinary",
      "Resend",
      "next-intl",
      "BenefitPay",
      "Apple Pay",
    ],
    featured: true,
    live: true,
    liveUrl: "https://shbash.co/",
    seoDescription:
      "Shbash — custom e-commerce platform for a Bahrain mobile accessories brand, built by BalochDev. Three-repo stack: NestJS API, Next.js storefront, Next.js admin. Native rewards, guest order tracking, BenefitPay + Apple Pay, bilingual AR/EN, security audit with 87 findings resolved. Supabase, Railway, Vercel, Cloudinary, Resend.",
    challenge:
      "Shbash had outgrown Shopify. Editorial curated-drop merchandising, a native points/rewards system with social earning, Bahrain-specific payments (BenefitPay), BHD formatting, and guest order tracking were all fighting the theme-and-app ceiling. The brand needed to own its schema, checkout, and roadmap — not rent them.",
    solution: [
      "Rebuilt as a three-repo custom platform: NestJS API, Next.js storefront, and Next.js admin — deployed on Railway, Vercel, and Supabase.",
      "Designed editorial merchandising (trending designs, curated collections, drop framing) so cases feel collectible, not commodity.",
      "Built rewards natively into identity — points balance, lifetime spend, and social-account earning (Instagram, TikTok, X) on one data model.",
      "Shipped guest-accessible Track Your Drop order tracking with no login required.",
      "Integrated BenefitPay alongside Apple Pay and cards for Bahrain-native checkout rails.",
      "Completed a full security audit resolving 87 findings before carrying live customer and payment data.",
      "Delivered bilingual Arabic / English via next-intl, Cloudinary avatars, Resend email, and an ops admin dashboard with loyalty as first-class tooling.",
    ],
    features: [
      "Three-repo custom platform (API · storefront · admin)",
      "Editorial curated-drop merchandising",
      "Native rewards & social earning",
      "Guest order tracking — no login",
      "BenefitPay · Apple Pay · cards",
      "Bilingual Arabic / English (next-intl)",
      "Ops admin — revenue, stock, tickets, loyalty",
      "Security audit — 87 findings resolved",
    ],
    results: [
      "Owned stack — schema, auth, checkout, and roadmap no longer rented from Shopify",
      "Admin operations dashboard answering same-day questions: revenue, pending orders, low stock, support",
      "Loyalty treated as first-class on both storefront and admin — not a bolted-on app",
      "Bahrain-native payments and bilingual AR / EN experience live for the Gulf customer base",
      "Security-hardened platform ready for live customer and payment data",
    ],
    team: [
      { name: "Adeel Baloch", role: "Project Manager · Full Stack Developer" },
      { name: "Shams Baloch", role: "UI / UX Design" },
    ],
  },
];

export default projects;
