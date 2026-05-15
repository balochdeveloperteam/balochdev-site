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
      "Full-stack restaurant management system with AI chatbot, Telegram notifications, and Google Sheets integration — built for zero-to-minimal running cost.",
    category: "client",
    industry: "Food & Hospitality",
    year: "2025",
    duration: "1.5 months",
    clientLocation: "Russia",
    cover: mango1,
    images: [mango1, mango2, mango3],
    stack: ["React", "Firebase", "Node.js", "Tailwind CSS", "Redux", "Telegram Bot API", "Google Sheets API"],
    featured: true,
    live: true,
    seoDescription:
      "ManGo Restaurant: a full-stack restaurant system with admin dashboard, AI chatbot, Telegram order notifications, delivery management, and Google Sheets record-keeping — built by BalochDev in 1.5 months.",
    challenge:
      "The restaurant owner needed a stable, cloud-backed management system at near-zero running cost. They were using VK (a Russian social network) for orders — a fragile, unscalable workflow with no analytics, no delivery tracking, and no customer visibility. After analysing their order volume and traffic patterns, we identified that the entire stack could run free or at negligible cost using Firebase's free tier and Google's APIs.",
    solution: [
      "Rebuilt the ordering and operations flow from scratch in React with Firebase as the real-time backend.",
      "Admin dashboard where managers add products, categories, and promotions — and see live analytics on revenue, order volume, and customer behaviour.",
      "Chef & manager portal to track in-kitchen status and push order updates.",
      "Delivery management: delivery riders receive a push notification the moment an order is ready; they mark pickup and drop-off in the app.",
      "Customer order tracking in real time so diners always know where their food is.",
      "Staff management panel to add, edit, and permission-manage team members.",
      "AI chatbot integrated for basic customer support — FAQs, order status, menu questions — reducing staff load significantly.",
      "Telegram bot integration: every new order fires a structured notification into a Telegram group so the team sees it on any device instantly.",
      "Google Sheets as a secondary record database — orders are written there automatically, making printing and accounting straightforward.",
    ],
    features: [
      "Full admin dashboard (orders, revenue, analytics)",
      "Product & category management",
      "Promotions & deals engine",
      "Customer tracking & CRM",
      "Delivery rider app & notifications",
      "Staff management & role permissions",
      "AI chatbot (order tracking + support)",
      "Telegram bot — real-time order alerts",
      "Google Sheets order logging",
      "SEO-optimised customer-facing storefront",
    ],
    results: [
      "System launched in 1.5 months and running in production",
      "Near-zero monthly infrastructure cost (Firebase free tier + free Google APIs)",
      "Order management moved from VK to a stable, trackable platform",
      "Delivery riders receive instant notifications — no manual calls",
      "All order records auto-logged to Google Sheets for printing and accounting",
      "AI chatbot handles routine customer queries 24/7",
    ],
  },
  {
    slug: null,
    title: "Balochi Academy App",
    tagline: "Mobile learning app for the Balochi language — structured lessons, audio pronunciation, and progress tracking.",
    category: "partner",
    industry: "EdTech · Language",
    year: "2025",
    cover: null,
    stack: ["Flutter", "Firebase", "Dart"],
    featured: false,
    live: false,
  },
  {
    slug: null,
    title: "E-commerce Platform",
    tagline: "Headless storefront with AI-powered product recommendations, multi-vendor support, and Stripe checkout.",
    category: "client",
    industry: "E-commerce",
    year: "2025",
    cover: null,
    stack: ["Next.js", "Supabase", "Stripe", "Tailwind CSS"],
    featured: false,
    live: false,
  },
  {
    slug: null,
    title: "Mobile Delivery App",
    tagline: "Cross-platform courier app with real-time GPS tracking, driver assignment, and customer ETA notifications.",
    category: "client",
    industry: "Logistics",
    year: "2026",
    cover: null,
    stack: ["React Native", "Node.js", "PostgreSQL"],
    featured: false,
    live: false,
  },
  {
    slug: null,
    title: "BalochDev Studio",
    tagline: "Internal project management and client portal — milestones, invoices, and delivery tracking in one place.",
    category: "balochdev",
    industry: "SaaS · Internal tooling",
    year: "2026",
    cover: null,
    stack: ["React", "Supabase", "Cloudflare Workers"],
    featured: false,
    live: false,
  },
];

export default projects;
