import mango1 from "../../assets/projects/ManGo/1.png";
import mango2 from "../../assets/projects/ManGo/2.png";
import mango3 from "../../assets/projects/ManGo/3.png";

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
