import mango1 from "../../assets/projects/ManGo/1.png";
import mango2 from "../../assets/projects/ManGo/2.png";
import mango3 from "../../assets/projects/ManGo/3.png";
import toy1 from "../../assets/projects/TheoryOfYou/4-j.png";
import toy2 from "../../assets/projects/TheoryOfYou/5-j.png";
import toy3 from "../../assets/projects/TheoryOfYou/6-j.png";
import toy4 from "../../assets/projects/TheoryOfYou/7-j.png";

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
  live?: boolean;
  challenge?: string;
  solution?: string[];
  features?: string[];
  results?: string[];
  seoDescription?: string;
  team?: ProjectTeamMember[];
}

const projects: Project[] = [
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
    slug: null,
    title: "Balochi Academy App",
    tagline:
      "Cross-platform mobile learning application for the Balochi language — structured lesson modules, native audio pronunciation, spaced-repetition practice, and real-time progress tracking.",
    category: "partner",
    industry: "EdTech · Language Technology",
    year: "2025",
    cover: null,
    stack: ["Flutter", "Firebase", "Dart", "Firestore", "Firebase Auth"],
    featured: false,
    live: false,
  },
  {
    slug: null,
    title: "Multi-vendor E-commerce Platform",
    tagline:
      "Headless storefront with AI-powered product recommendations, multi-vendor management, Stripe checkout, and a seller analytics dashboard.",
    category: "client",
    industry: "E-commerce",
    year: "2025",
    cover: null,
    stack: ["Next.js", "Supabase", "Stripe", "Tailwind CSS", "TypeScript", "Cloudflare"],
    featured: false,
    live: false,
  },
  {
    slug: null,
    title: "Mobile Courier & Delivery App",
    tagline:
      "Cross-platform courier application with real-time GPS tracking, smart driver assignment, push notifications, and customer ETA estimation.",
    category: "client",
    industry: "Logistics & Delivery",
    year: "2026",
    cover: null,
    stack: ["React Native", "Node.js", "PostgreSQL", "Supabase", "Google Maps API"],
    featured: false,
    live: false,
  },
  {
    slug: null,
    title: "BalochDev Studio",
    tagline:
      "Internal project management and client portal — milestone tracking, invoice generation, delivery timelines, and team workload visibility in one place.",
    category: "balochdev",
    industry: "SaaS · Internal Tooling",
    year: "2026",
    cover: null,
    stack: ["React", "Supabase", "Cloudflare Workers", "TypeScript", "Tailwind CSS"],
    featured: false,
    live: false,
  },
];

export default projects;
