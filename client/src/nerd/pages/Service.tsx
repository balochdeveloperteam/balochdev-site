import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BookCallButton from "../components/bookCall/BookCallButton";
import { motion, useReducedMotion } from "framer-motion";
import type { IconType } from "react-icons";
import { useDataTheme } from "../hooks/useDataTheme";
import Seo from "../seo/Seo";
import { SITE_URL } from "../seo/siteSeo";
import logoBlack from "../../assets/BalochDevLogo/logo_black.svg";
import logoWhite from "../../assets/BalochDevLogo/logo_white.svg";
import logoOrange from "../../assets/BalochDevLogo/logo_orange.svg";
import {
  SiOpenai,
  SiReact,
  SiNextdotjs,
  SiAndroid,
  SiSupabase,
  SiNodedotjs,
  SiFigma,
  SiZapier,
  SiDocker,
  SiVisa,
  SiMastercard,
  SiPaypal,
  SiStripe,
  SiShopify,
  SiWebflow,
  SiClaude,
  SiGooglegemini,
  SiLangchain,
  SiGithubcopilot,
  SiStorybook,
  SiTailwindcss,
  SiTypescript,
  SiPostgresql,
  SiVercel,
  SiJavascript,
  SiGit,
  SiPython,
  SiRedis,
  SiMysql,
  SiMongodb,
  SiGraphql,
} from "react-icons/si";
import { FaPaintBrush } from "react-icons/fa";
import {
  TbPhoneCall,
  TbRocket,
  TbLanguage,
  TbArrowRightCircle,
  TbCoin,
  TbHeadset,
  TbSparkles,
} from "react-icons/tb";
import RichSectionIntro from "../components/RichSectionIntro";
import AiEstimatePromo from "../components/AiEstimatePromo";
import FaqAccordion from "../components/FaqAccordion";
import SelectedWorkGrid from "../components/SelectedWorkGrid";

type ServiceItem = {
  number: string;
  eyebrow: string;
  title: string;
  desc: string;
  tools: string;
  icon: IconType;
  slug: string;
  /** Typical calendar span for a focused first phase */
  estimatedTimeline: string;
  /** Plain-language budget band; “assumed” clarified in UI */
  priceAssumption: string;
};

type Practice = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  count: string;
  services: ServiceItem[];
};

const whyUsItems: { icon: IconType; title: string; text: string }[] = [
  {
    icon: TbLanguage,
    title: "Balochi-first work, not a gimmick",
    text: "Language tech and community projects sit alongside commercial builds — the same engineering standards for both.",
  },
  {
    icon: TbArrowRightCircle,
    title: "Design → build → deploy",
    text: "One team carries scope from UX and branding through production deployment, with staging before go-live.",
  },
  {
    icon: TbCoin,
    title: "Milestones you can track",
    text: "We agree scope, checkpoints, and acceptance in writing. Changes are discussed before extra cost.",
  },
  {
    icon: TbHeadset,
    title: "After launch, we don’t disappear",
    text: "Maintenance retainers and small follow-on tasks keep your product secure, useful, and easy to extend.",
  },
];

const heroStats = [
  { label: "Founded", value: "2024" },
  { label: "Projects", value: "150+" },
  { label: "Review", value: "4.8" },
  { label: "Team", value: "14+" },
];

const practices: Practice[] = [
  {
    id: "ai",
    number: "/01",
    title: "AI & Intelligence",
    subtitle: "Where LLMs meet production — agents, RAG, voice, and chatbots that work inside real businesses.",
    count: "5 services",
    services: [
      {
        number: "01",
        eyebrow: "Foundation models at the core",
        title: "AI Development",
        desc: "Custom LLM integrations, prompt pipelines, AI-first product features, and intelligent workflows built to ship, not just demo.",
        tools: "OpenAI · Claude · Gemini",
        icon: SiClaude,
        slug: "ai-development",
        estimatedTimeline: "3–8 wks",
        priceAssumption: "~USD $4.5k+",
      },
      {
        number: "02",
        eyebrow: "Agents, not basic chat",
        title: "AI Agent Development",
        desc: "Tool-using agents with memory, actions, guardrails, human approval steps, and business system integrations.",
        tools: "LangGraph · MCP · Tools",
        icon: SiLangchain,
        slug: "ai-agents",
        estimatedTimeline: "4–12 wks",
        priceAssumption: "~USD $8k+",
      },
      {
        number: "03",
        eyebrow: "Grounded answers",
        title: "RAG · LLM Development",
        desc: "Retrieval systems connected to your documents, databases, and knowledge so the AI answers from your real information.",
        tools: "Vector DB · Search · Citations",
        icon: SiGooglegemini,
        slug: "rag-llm",
        estimatedTimeline: "3–8 wks",
        priceAssumption: "~USD $5.5k+",
      },
      {
        number: "04",
        eyebrow: "Conversations that convert",
        title: "AI Chatbot Development",
        desc: "Support, sales, onboarding, FAQ, and internal assistant chatbots for websites, WhatsApp, Telegram, and dashboards.",
        tools: "OpenAI · CRM · Help docs",
        icon: SiOpenai,
        slug: "chatbots",
        estimatedTimeline: "2–6 wks",
        priceAssumption: "~USD $3.2k+",
      },
      {
        number: "05",
        eyebrow: "Real calls, real actions",
        title: "Voice AI",
        desc: "Inbound and outbound voice agents with call handling, customer data, notes, follow-ups, and human handoff logic.",
        tools: "Twilio · STT · TTS",
        icon: TbPhoneCall,
        slug: "voice-ai",
        estimatedTimeline: "6–14 wks",
        priceAssumption: "~USD $12k+",
      },
    ],
  },
  {
    id: "build",
    number: "/02",
    title: "Build · Product",
    subtitle: "Web, Android, SaaS, e-commerce storefronts, MVPs, dashboards, and surfaces clients launch and grow.",
    count: "6 services",
    services: [
      {
        number: "01",
        eyebrow: "Custom apps, not templates",
        title: "Web Development",
        desc: "Modern websites, dashboards, portals, landing pages, and full-stack platforms built for speed, SEO, and trust.",
        tools: "Next.js · React · TypeScript",
        icon: SiNextdotjs,
        slug: "web",
        estimatedTimeline: "2–6 wks",
        priceAssumption: "~USD $2.8k+",
      },
      {
        number: "02",
        eyebrow: "Android-first experiences",
        title: "Android App Development",
        desc: "Business apps, community apps, booking systems, dashboards, and mobile tools designed for daily use.",
        tools: "Android · Firebase · APIs",
        icon: SiAndroid,
        slug: "android-app-development",
        estimatedTimeline: "5–12 wks",
        priceAssumption: "~USD $6.5k+",
      },
      {
        number: "03",
        eyebrow: "From MVP to SaaS",
        title: "SaaS Development",
        desc: "Auth, subscriptions, admin dashboards, customer portals, multi-role access, billing, and product analytics.",
        tools: "Supabase · Stripe · Next.js",
        icon: SiSupabase,
        slug: "saas-development",
        estimatedTimeline: "8–20 wks",
        priceAssumption: "~USD $14k+",
      },
      {
        number: "04",
        eyebrow: "Validate fast",
        title: "MVP Development",
        desc: "A focused first product that proves your idea with real users before you spend months building the wrong thing.",
        tools: "Prototype · Build · Launch",
        icon: TbRocket,
        slug: "mvp-development",
        estimatedTimeline: "3–7 wks",
        priceAssumption: "~USD $4k+",
      },
      {
        number: "05",
        eyebrow: "Ship quickly, own it later",
        title: "No-Code + Custom Code",
        desc: "Fast no-code systems with custom logic where needed, so your product is quick to launch and not boxed in.",
        tools: "Webflow · Bubble · n8n",
        icon: SiWebflow,
        slug: "no-code-custom-code",
        estimatedTimeline: "2–5 wks",
        priceAssumption: "~USD $1.8k+",
      },
      {
        number: "06",
        eyebrow: "Stores that sell",
        title: "Ecommerce & platform sites",
        desc: "Shopify and Shopify themes, Wix and WordPress / WooCommerce builds, product and catalog SEO, payments, shipping rules, and integrations — plus headless or custom storefronts when you outgrow templates.",
        tools: "Shopify · WordPress · Wix · WooCommerce",
        icon: SiShopify,
        slug: "ecommerce",
        estimatedTimeline: "2–8 wks",
        priceAssumption: "~USD $3.5k+",
      },
    ],
  },
  {
    id: "automate",
    number: "/03",
    title: "Automate · Ops",
    subtitle: "The operational plumbing: workflows, APIs, integrations, and support systems that keep work moving.",
    count: "3 services",
    services: [
      {
        number: "01",
        eyebrow: "Stop doing work twice",
        title: "Workflow Automation",
        desc: "Automations that connect forms, CRMs, sheets, email, Telegram, WhatsApp, websites, and AI actions.",
        tools: "n8n · Make · Zapier",
        icon: SiZapier,
        slug: "workflow-automation",
        estimatedTimeline: "1–5 wks",
        priceAssumption: "~USD $1.5k+",
      },
      {
        number: "02",
        eyebrow: "Connect your systems",
        title: "API & Integrations",
        desc: "Custom APIs and middleware connecting payments, CRMs, dashboards, databases, AI models, and third-party tools.",
        tools: "Node · Python · Webhooks",
        icon: SiNodedotjs,
        slug: "api-integrations",
        estimatedTimeline: "2–8 wks",
        priceAssumption: "~USD $2.8k+",
      },
      {
        number: "03",
        eyebrow: "Keep products alive",
        title: "Maintenance & Support",
        desc: "Monthly product support, bug fixes, monitoring, upgrades, optimization, and small feature improvements.",
        tools: "Sentry · Vercel · Docker",
        icon: SiDocker,
        slug: "maintenance-support",
        estimatedTimeline: "ongoing",
        priceAssumption: "~USD $800+/mo",
      },
    ],
  },
  {
    id: "design",
    number: "/04",
    title: "Design · Craft",
    subtitle: "UX, branding, interfaces, and design systems — taste applied with AI-accelerated iteration.",
    count: "3 services",
    services: [
      {
        number: "01",
        eyebrow: "Designed by humans",
        title: "UX/UI Design",
        desc: "Research, wireframes, landing pages, dashboards, mobile app screens, and polished UI for real users.",
        tools: "Figma · UX · UI",
        icon: SiFigma,
        slug: "ux-ui",
        estimatedTimeline: "2–6 wks",
        priceAssumption: "~USD $2.2k+",
      },
      {
        number: "02",
        eyebrow: "Identity with direction",
        title: "Branding",
        desc: "Logo direction, colors, type, product tone, website visuals, and brand systems for startups and businesses.",
        tools: "Identity · Visuals · Voice",
        icon: FaPaintBrush,
        slug: "branding",
        estimatedTimeline: "2–4 wks",
        priceAssumption: "~USD $1.8k+",
      },
      {
        number: "03",
        eyebrow: "Scale design cleanly",
        title: "Design Systems",
        desc: "Design tokens, reusable components, UI rules, and interface systems that keep your product consistent as it grows.",
        tools: "Tokens · Components · Rules",
        icon: SiStorybook,
        slug: "design-systems",
        estimatedTimeline: "3–8 wks",
        priceAssumption: "~USD $5k+",
      },
    ],
  },
];

const decisionRows = [
  ["Validate an idea with a real product", "MVP Development + UX/UI Design", "Clickable fast, live in weeks, focused on learning from users."],
  ["Add AI features to an existing app", "AI Agent Development + RAG", "Grounded answers, tool use, and real product integration."],
  ["Build an Android app", "Android App Development + Backend APIs", "Mobile app, admin control, auth, database, and notifications."],
  ["Automate repetitive work", "Workflow Automation + API Integrations", "Forms, messages, sheets, CRMs, and AI actions connected together."],
  ["Launch a business website", "Web Development + Branding", "Clear positioning, professional UI, SEO foundation, and conversion paths."],
  ["Sell products online", "Ecommerce & platform sites + Web Development", "Shopify, WordPress/WooCommerce, or Wix storefronts — catalog, checkout, shipping rules, and SEO-ready pages."],
  ["Keep a product healthy", "Maintenance & Support + Monitoring", "Bug fixes, upgrades, reports, and continuous improvements."],
];

const pairings = [
  { number: "01", title: "Web Development + AI Agents", desc: "A modern web app with AI agents embedded into the product surface.", result: "AI-native SaaS" },
  { number: "02", title: "MVP Development + UX/UI Design", desc: "A focused sprint from idea to clickable product to real launch.", result: "Validated launch" },
  { number: "03", title: "RAG + Chatbot", desc: "A knowledge assistant that answers from your documents and business data.", result: "Better support" },
  { number: "04", title: "Workflow Automation + Integrations", desc: "n8n and custom APIs connecting the tools your team already uses.", result: "Hours saved" },
  { number: "05", title: "Android App + Backend APIs", desc: "Mobile app plus dashboard, database, auth and notification system.", result: "Mobile product" },
  { number: "06", title: "Design System + Web Platform", desc: "Reusable UI components and product rules so your team ships faster.", result: "3× velocity" },
];

const engagementModels = [
  {
    number: "01",
    timeline: "2 – 16 weeks",
    title: "Fixed-scope build",
    desc: "Defined scope, timeline, and delivery. Best for MVPs, websites, Android apps, and clear feature builds.",
    best: "MVPs, rebuilds, launch projects",
    assumedFrom: "~USD $2.5k+",
    billingShape: "Milestone invoices against a written SOW",
  },
  {
    number: "02",
    timeline: "Monthly",
    title: "Embedded team",
    desc: "A small product pod joins your workflow for ongoing design, development, AI and automation work.",
    best: "Growing products, ongoing capacity",
    assumedFrom: "~USD $6k+ / mo",
    billingShape: "Monthly retainer with agreed throughput",
  },
  {
    number: "03",
    timeline: "Weekly",
    title: "AI strategy advisory",
    desc: "Architecture, AI vendor choice, workflow design, automation planning, and technical direction.",
    best: "Teams starting with AI",
    assumedFrom: "~USD $1.2k+ / wk",
    billingShape: "Time-boxed calls + written recommendations",
  },
];

const terms = [
  { title: "AI agent", desc: "Software that uses an LLM to reason, call tools, remember context, and complete multi-step tasks with guardrails." },
  { title: "RAG", desc: "Retrieval-augmented generation: an AI system that answers from your documents instead of guessing from memory." },
  { title: "MVP", desc: "The smallest useful product you can ship to real users to validate the idea before building too much." },
  { title: "Workflow automation", desc: "Connected tools and triggers that run repetitive business tasks without manual work." },
  { title: "Design system", desc: "Reusable UI components, tokens, and rules that keep a product consistent as it grows." },
];

const faqs = [
  {
    q: "What do you actually build for clients?",
    a: "Web apps and marketing sites, Android apps, SaaS-style dashboards, e-commerce on Shopify, WordPress, and similar stacks, AI features (chatbots, RAG, agents, voice), workflow automation, integrations, and UX/UI. Below you can see seventeen concrete delivery areas grouped into four practices.",
  },
  {
    q: "How does a project start?",
    a: "Usually a short call or brief: goals, deadline, budget band, and any existing designs or repos. We respond with a written scope, milestones, and pricing options — nothing vague.",
  },
  {
    q: "How fast can you ship?",
    a: "Small marketing sites often land in a few weeks; MVPs and apps depend on integrations and compliance. We set dates per milestone so you see progress every week, not a black box.",
  },
  {
    q: "Do you work fixed-price or hourly?",
    a: "Most product work is fixed scope per phase (e.g. MVP, then v2). Retainers and advisory blocks can run monthly when you need ongoing capacity.",
  },
  {
    q: "Can you work with our existing product or stack?",
    a: "Yes. We routinely extend React/Next sites, Android apps, Shopify or headless commerce, Supabase/Firebase backends, and automation you already run.",
  },
  {
    q: "How do we stay in touch during the build?",
    a: "Shared channel (e.g. Slack or Telegram), scheduled demos, and written summaries after each milestone so decisions stay traceable.",
  },
  {
    q: "What happens after launch?",
    a: "We hand over repos, env docs, and deploy steps. Many teams keep a light maintenance window for updates, monitoring, and small changes.",
  },
  {
    q: "How do we reach you for a quote?",
    a: "Use the contact page or book a call — we reply with next steps and, when possible, a ballpark range before any deep discovery.",
  },
];

type OrbitSlot = { Icon: IconType; label: string };

type OrbitRing = {
  id: string;
  /** spoke + orbit radius from hub (matches --ndx-hero-orbit-* token name) */
  radiusVar: "--ndx-hero-orbit-a" | "--ndx-hero-orbit-b" | "--ndx-hero-orbit-c";
  /** Orbit guide + spoke styling tier */
  layer: "a" | "b" | "c";
  durationSec: number;
  clockwise: boolean;
  icons: OrbitSlot[];
};

const HERO_HUB_MARKS: Record<string, string> = {
  light: logoBlack,
  dark: logoWhite,
  dusk: logoOrange,
};

/** Match largest --ndx-hero-icon-box (~2.95rem ≈ 47px at 16px root) for glyph sizing */
const HERO_ORBIT_ICON_GLYPH = Math.round(47 * 0.48);

const HERO_ORBIT_RINGS: OrbitRing[] = [
  {
    id: "build",
    radiusVar: "--ndx-hero-orbit-a",
    layer: "a",
    durationSec: 70,
    clockwise: true,
    icons: [
      { Icon: SiNextdotjs, label: "NEXT" },
      { Icon: SiReact, label: "REACT" },
      { Icon: SiAndroid, label: "ANDROID" },
      { Icon: SiShopify, label: "SHOPIFY" },
      { Icon: SiSupabase, label: "SUPABASE" },
      { Icon: SiFigma, label: "FIGMA" },
      { Icon: SiTailwindcss, label: "TAILWIND" },
      { Icon: SiTypescript, label: "TS" },
      { Icon: SiPostgresql, label: "POSTGRES" },
      { Icon: SiVercel, label: "VERCEL" },
      { Icon: SiJavascript, label: "JS" },
      { Icon: SiGit, label: "GIT" },
    ],
  },
  {
    id: "ai",
    radiusVar: "--ndx-hero-orbit-b",
    layer: "b",
    durationSec: 52,
    clockwise: false,
    icons: [
      { Icon: SiOpenai, label: "OPENAI" },
      { Icon: SiClaude, label: "CLAUDE" },
      { Icon: SiGooglegemini, label: "GEMINI" },
      { Icon: SiLangchain, label: "AGENTS" },
      { Icon: SiGithubcopilot, label: "COPILOT" },
      { Icon: TbSparkles, label: "LLMS" },
      { Icon: SiPython, label: "PYTHON" },
      { Icon: SiDocker, label: "DOCKER" },
      { Icon: SiStripe, label: "STRIPE" },
      { Icon: SiRedis, label: "REDIS" },
      { Icon: SiMysql, label: "MYSQL" },
    ],
  },
  {
    id: "ship",
    radiusVar: "--ndx-hero-orbit-c",
    layer: "c",
    durationSec: 38,
    clockwise: true,
    icons: [
      { Icon: SiNodedotjs, label: "NODE" },
      { Icon: SiZapier, label: "AUTO" },
      { Icon: TbRocket, label: "SHIP" },
      { Icon: SiMongodb, label: "MONGO" },
      { Icon: SiGraphql, label: "GRAPHQL" },
    ],
  },
];

/** Hub→icon: one dot after another, same speed; fades out at the icon. */
const SPOKE_TRAIN_DOTS = 3;
/** Travel time hub → icon (slower = larger value). */
const SPOKE_LEG_SEC = 1.4;

function OrbitSpoke({
  angleDeg,
  radiusVar,
  reduced,
}: {
  angleDeg: number;
  radiusVar: OrbitRing["radiusVar"];
  reduced: boolean;
}) {
  const pause = (SPOKE_TRAIN_DOTS - 1) * SPOKE_LEG_SEC;
  const cycle = SPOKE_TRAIN_DOTS * SPOKE_LEG_SEC;
  /** Random stagger per spoke so trains don’t line up across the wheel. */
  const phase = useMemo(() => Math.random() * cycle, []);

  return (
    <div
      className="ndx-hero-orbit-spoke pointer-events-none absolute left-1/2 top-1/2"
      style={{
        height: `calc(var(${radiusVar}) - var(--ndx-hero-hub-rim))`,
        transformOrigin: "50% 100%",
        transform: `translate(-50%, -100%) rotate(${angleDeg}deg) translateY(calc(-1 * var(--ndx-hero-hub-rim)))`,
      }}
    >
      {Array.from({ length: SPOKE_TRAIN_DOTS }, (_, di) => (
        <motion.span
          key={di}
          className="ndx-hero-orbit-dot absolute left-1/2 block size-[4.5px] -translate-x-1/2 rounded-full sm:size-[5.5px]"
          animate={
            reduced
              ? {}
              : {
                bottom: ["10%", "90%", "90%"],
                opacity: [0, 1, 0],
              }
          }
          transition={
            reduced
              ? { duration: 0 }
              : {
                duration: SPOKE_LEG_SEC,
                delay: phase + di * SPOKE_LEG_SEC,
                repeat: Infinity,
                repeatDelay: pause,
                ease: "linear",
                times: [0, 0.92, 1],
              }
          }
        />
      ))}
    </div>
  );
}

function OrbitIconNode({
  angleDeg,
  radiusVar,
  Icon,
  label,
}: {
  angleDeg: number;
  radiusVar: OrbitRing["radiusVar"];
  Icon: IconType;
  label: string;
}) {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const showLabel = active || hovered;

  return (
    <div
      className="pointer-events-auto absolute left-1/2 top-1/2"
      style={{
        width: "var(--ndx-hero-icon-box)",
        height: "var(--ndx-hero-icon-box)",
        transform: `translate(-50%, -50%) rotate(${angleDeg}deg) translateY(calc(-1 * var(${radiusVar}))) rotate(${-angleDeg}deg)`,
      }}
    >
      <div
        className="relative h-full w-full shrink-0"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          type="button"
          className="ndx-hero-orbit-icon-tile flex h-full w-full items-center justify-center rounded-xl p-0"
          aria-label={label}
          aria-pressed={active}
          onClick={() => setActive((v) => !v)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
        >
          <Icon size={HERO_ORBIT_ICON_GLYPH} aria-hidden />
        </button>
        <span
          className={`ndx-hero-orbit-label pointer-events-none absolute left-1/2 top-full z-[2] mt-0.5 max-w-[4.5rem] -translate-x-1/2 truncate text-center text-[6px] uppercase leading-tight tracking-[0.12em] sm:max-w-[5rem] sm:text-[7px] sm:tracking-[0.14em] ${showLabel ? "opacity-100" : "opacity-0"
            }`}
          aria-hidden={!showLabel}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function HeroSurface({ reduced }: { reduced: boolean }) {
  const theme = useDataTheme();
  const hubMark = HERO_HUB_MARKS[theme] ?? logoWhite;
  const ringTransition = (durationSec: number) =>
    reduced
      ? { duration: 0 }
      : { duration: durationSec, repeat: Infinity, repeatType: "loop" as const, ease: "linear" as const };

  const orbitTracks: { r: OrbitRing["radiusVar"]; opacity: number }[] = [
    { r: "--ndx-hero-orbit-a", opacity: 0.62 },
    { r: "--ndx-hero-orbit-b", opacity: 0.54 },
    { r: "--ndx-hero-orbit-c", opacity: 0.48 },
  ];

  return (
    <div className="ndx-hero-surface relative mx-auto aspect-square w-full overflow-hidden max-w-[min(100%,26rem)] sm:max-w-[min(100%,34rem)] lg:max-w-[min(100%,48rem)] xl:max-w-[min(100%,58rem)] min-[1400px]:max-w-[min(100%,min(78rem,94vw))] 2xl:max-w-[min(100%,min(82rem,94vw))]">
      <div className="ndx-hero-wheel-bg-glow" aria-hidden />

      {/* Orbit tracks — dashed rings through icon centers (border color from theme) */}
      {orbitTracks.map((t) => (
        <div
          key={t.r}
          className="ndx-hero-orbit-track pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: `calc(2 * var(${t.r}))`,
            height: `calc(2 * var(${t.r}))`,
            opacity: t.opacity,
          }}
          aria-hidden
        />
      ))}

      {HERO_ORBIT_RINGS.map((ring) => {
        const n = ring.icons.length;
        return (
          <motion.div
            key={ring.id}
            className="pointer-events-none absolute inset-0 z-[1] origin-center"
            animate={reduced ? {} : { rotate: ring.clockwise ? 360 : -360 }}
            transition={ringTransition(ring.durationSec)}
          >
            {ring.icons.map((slot, i) => {
              const angle = (360 / n) * i - 90;
              return (
                <React.Fragment key={`${ring.id}-${slot.label}`}>
                  <OrbitSpoke
                    angleDeg={angle}
                    radiusVar={ring.radiusVar}
                    reduced={reduced}
                  />
                  <OrbitIconNode
                    angleDeg={angle}
                    radiusVar={ring.radiusVar}
                    Icon={slot.Icon}
                    label={slot.label}
                  />
                </React.Fragment>
              );
            })}
          </motion.div>
        );
      })}

      {/* Center hub: perfect circle, double border, logo only, light 2px backdrop blur */}
      <div
        className="ndx-hero-hub pointer-events-none absolute left-1/2 top-1/2 z-[2] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        aria-hidden
      >
        <div className="ndx-hero-hub__fill absolute inset-0 rounded-full border-2 border-solid backdrop-blur-[2px]" />
        <div
          className="pointer-events-none absolute inset-[5px] rounded-full border border-solid sm:inset-[6px]"
          style={{ borderColor: "var(--ndx-hero-wheel-hub-border-inner)" }}
        />
        <span className={`ndx-hero-hub__mark-wrap relative z-[1] ${reduced ? "" : "ndx-hero-hub__mark-wrap--spin"}`}>
          <img
            src={hubMark}
            alt=""
            width={44}
            height={44}
            className="h-9 w-9 object-contain sm:h-10 sm:w-10 min-[1400px]:h-11 min-[1400px]:w-11"
            draggable={false}
          />
        </span>
      </div>
    </div>
  );
}

function PracticeLink({ practice }: { practice: Practice }) {
  return (
    <Link to={`/services/practice/${practice.id}/`} className="ndx-practice-link">
      <div>
        <div className="ndx-practice-link__meta">
          {practice.number} · {practice.count}
        </div>
        <div className="ndx-practice-link__title">{practice.title}</div>
      </div>
      <span className="ndx-practice-link__arrow" aria-hidden>
        →
      </span>
    </Link>
  );
}

function ServiceCard({ service }: { service: ServiceItem }) {
  const Icon = service.icon;
  return (
    <motion.article className="ndx-card" whileHover={{ y: -4 }} transition={{ duration: 0.22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
        <div className="ndx-tech-abbr" style={{ width: 48, height: 48 }}>
          <Icon size={22} />
        </div>
        <span style={{ fontFamily: "var(--ndx-font-serif)", fontSize: "1.75rem", fontStyle: "italic", color: "var(--ndx-muted)" }}>
          /{service.number}
        </span>
      </div>
      <p className="ndx-tech-meta">{service.eyebrow}</p>
      <h3 className="ndx-tech-name" style={{ fontSize: "1.15rem" }}>
        {service.title}
      </h3>
      <p className="ndx-tech-blurb" style={{ marginTop: "0.5rem" }}>
        {service.desc}
      </p>
      <p className="ndx-tech-meta" style={{ marginTop: "0.85rem", marginBottom: 0 }}>
        {service.tools}
      </p>
      <div className="ndx-service-card-plan">
        <span>
          <strong>Est. timeline</strong> {service.estimatedTimeline}
        </span>
        <span>
          <strong>Assumed from</strong> {service.priceAssumption}
        </span>
      </div>
      <div className="ndx-service-card-footer">
        <span className="ndx-tech-meta" style={{ marginBottom: 0 }}>
          Final numbers after a short brief
        </span>
        <Link to={`/services/${service.slug}/`} className="ndx-service-card-cta">
          View page<span aria-hidden> →</span>
        </Link>
      </div>
    </motion.article>
  );
}

function PracticeSection({ practice }: { practice: Practice }) {
  return (
    <section id={practice.id} className="scroll-mt-24">
      <div className="ndx-group-head" style={{ paddingTop: "0.5rem" }}>
        <div style={{ fontFamily: "var(--ndx-font-serif)", fontSize: "clamp(2rem, 4vw, 2.75rem)", fontStyle: "italic", color: "var(--ndx-accent)", marginBottom: "0.35rem" }}>
          {practice.number}
        </div>
        <h2 className="ndx-h2">{practice.title}</h2>
        <p className="ndx-group-sub" style={{ maxWidth: "52rem" }}>
          {practice.subtitle}
        </p>
        <p className="ndx-tech-meta" style={{ marginTop: "0.35rem" }}>
          {practice.count}
        </p>
      </div>
      <div className="ndx-rich-service-grid" style={{ marginTop: "1.5rem" }}>
        {practice.services.map((service) => (
          <ServiceCard key={service.title} service={service} />
        ))}
      </div>
    </section>
  );
}

function PairingCard({ item }: { item: (typeof pairings)[number] }) {
  return (
    <motion.article className="ndx-card" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <span className="ndx-tech-meta">Pairing · /{item.number}</span>
        <span className="ndx-tech-arrow">→</span>
      </div>
      <h3 className="ndx-tech-name" style={{ fontSize: "1.1rem" }}>
        {item.title}
      </h3>
      <p className="ndx-tech-blurb" style={{ marginTop: "0.5rem" }}>
        {item.desc}
      </p>
      <div className="ndx-pill" style={{ marginTop: "1rem", display: "inline-block", color: "var(--ndx-accent)", borderColor: "var(--ndx-accent)" }}>
        → {item.result}
      </div>
    </motion.article>
  );
}

function PaymentsAndTrust() {
  const methods = [
    { Icon: SiVisa, label: "Visa", hint: "Credit & debit cards" },
    { Icon: SiMastercard, label: "Mastercard", hint: "Credit & debit cards" },
    { Icon: SiPaypal, label: "PayPal", hint: "Wallet & PayPal balance" },
    { Icon: SiStripe, label: "Stripe", hint: "Cards, wallets, invoicing" },
  ];
  return (
    <div id="payments-trust" className="ndx-rich-block scroll-mt-24">
      <RichSectionIntro eyebrow="Payments & risk" title="Money, time tracking, and agreements">
        How we run delivery for local and international clients alike.
      </RichSectionIntro>
      <div className="ndx-payment-trust-card">
        <p className="ndx-payment-methods-label">How you can pay</p>
        <div className="ndx-payment-methods-grid">
          {methods.map(({ Icon, label, hint }) => (
            <div key={label} className="ndx-payment-method-cell">
              <Icon size={26} aria-hidden style={{ color: "var(--ndx-text)" }} />
              <span className="ndx-payment-method-name">{label}</span>
              <span className="ndx-payment-method-hint">{hint}</span>
            </div>
          ))}
        </div>
        <div className="ndx-payment-wire">
          <strong>Bank wire / SWIFT</strong> — for larger milestones or when your finance team requires it. Beneficiary details ship after a signed
          SOW.
        </div>
        <ul
          style={{
            margin: "1.15rem 0 0",
            paddingLeft: "1.15rem",
            maxWidth: "50rem",
            color: "var(--ndx-muted)",
            fontSize: "0.9375rem",
            lineHeight: 1.6,
          }}
        >
          <li style={{ marginBottom: "0.75rem" }}>
            <strong style={{ color: "var(--ndx-text)" }}>Hours &amp; milestones.</strong> Work is broken into milestones with time against each. You see demos and acceptance criteria — not a single lump sum with no visibility.
          </li>
          <li style={{ marginBottom: "0.75rem" }}>
            <strong style={{ color: "var(--ndx-text)" }}>Security baseline.</strong> TLS on production, no secrets in Git, separate staging where possible, least-privilege access to your systems, and defined handover for hosting creds.
          </li>
          <li style={{ marginBottom: 0 }}>
            <strong style={{ color: "var(--ndx-text)" }}>Agreements from ~USD $1,000.</strong> Above that band we put scope, payment schedule, IP, and confidentiality in writing (SOW or short contract). Larger programs use a master agreement plus statements of work. We default to{" "}
            <strong style={{ color: "var(--ndx-text)" }}>English, globally usable terms</strong>; if you need local counsel or a specific jurisdiction, we align before signatures.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const reduced = useReducedMotion();
  const servicesTitle = "Services — AI, RAG, Web & App Development | BalochDev";
  const servicesDesc =
    "Full-stack development services: AI agents, RAG pipelines, LLM chatbots, web apps, Android, SaaS and automation. Scoped delivery, weekly demos, clear handoff for international clients.";

  const jsonLd = useMemo(() => {
    let position = 0;
    const itemListElements = practices.flatMap((practice) =>
      practice.services.map((svc) => {
        position += 1;
        return {
          "@type": "ListItem",
          position,
          item: {
            "@type": "Service",
            name: svc.title,
            description: svc.desc,
            provider: { "@type": "Organization", name: "BalochDev", url: SITE_URL },
          },
        };
      }),
    );
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${SITE_URL}/services#webpage`,
          name: servicesTitle,
          description: servicesDesc,
          url: `${SITE_URL}/services`,
        },
        {
          "@type": "ItemList",
          "@id": `${SITE_URL}/services#itemlist`,
          name: "BalochDev delivery areas",
          itemListElement: itemListElements,
        },
      ],
    };
  }, [servicesTitle, servicesDesc]);

  return (
    <section className="ndx-section ndx-page-rich" style={{ paddingTop: "1.65rem" }}>
      <Seo title={servicesTitle} description={servicesDesc} canonicalPath="/services" jsonLd={jsonLd} />

      <div className="ndx-container">
        <motion.div
          className="ndx-rich-pill ndx-rich-pill--minimal"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="ndx-rich-pill-dot" aria-hidden />
          BD · Services · AI-first studio v2024.1 · Remote
        </motion.div>

        <div className="ndx-rich-hero">
          <div className="ndx-rich-hero__copy">
            <motion.h1 className="ndx-h1" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.55 }}>
              We design, build, and ship
              <br />
              the <em>full product surface</em>.
            </motion.h1>
            <motion.p
              className="ndx-lead"
              style={{ maxWidth: "52ch" }}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.08 }}
            >
              <strong>AI, Build, Automate, Design</strong> — seventeen scoped offerings, one team, weekly demos, and a handoff you can run.
            </motion.p>
            <motion.div className="ndx-rich-actions" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.16 }}>
              <Link to="/contact/" className="ndx-btn ndx-btn-primary">
                Start a project →
              </Link>
              <a href="#capabilities" className="ndx-btn">
                Browse offerings
              </a>
            </motion.div>
            <motion.table
              className="ndx-rich-hero-offer"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.19 }}
            >
              <tbody>
                <tr>
                  <th scope="row">Assumed starting price</th>
                  <td>
                    <strong>From ~USD $2,500</strong>
                    <span className="ndx-rich-hero-offer-note">Typical entry band for a scoped first phase. Final fees follow a short brief — nothing vague.</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Delivery window</th>
                  <td>
                    <strong>2–4 weeks</strong> for tight slices
                    <span className="ndx-rich-hero-offer-note">Many marketing sites, automations, and design passes land here; bigger products list their own timelines on each card.</span>
                  </td>
                </tr>
              </tbody>
            </motion.table>
            <motion.div
              className="ndx-rich-stats ndx-rich-stats--hero-metrics"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.22 }}
            >
              {heroStats.map((item) => (
                <div key={item.label} className="ndx-rich-stat-cell">
                  <div className="ndx-rich-stat-label">{item.label}</div>
                  <div className="ndx-rich-stat-value">{item.value}</div>
                </div>
              ))}
            </motion.div>
          </div>
          <motion.div className="ndx-rich-hero__viz" initial={reduced ? false : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : 0.1 }}>
            <HeroSurface reduced={!!reduced} />
          </motion.div>
        </div>

        <div className="ndx-practice-grid">
          {practices.map((practice) => (
            <PracticeLink key={practice.id} practice={practice} />
          ))}
        </div>

        <div id="capabilities" className="ndx-rich-block scroll-mt-24">
          <RichSectionIntro eyebrow="Capabilities" title="Seventeen delivery areas in four practices">
            <>
              The labels <strong>/01–/04</strong> are <strong>practice groups</strong> (AI, Build, Automate, Design). Under them are{" "}
              <strong>seventeen individual offerings</strong> we scope separately — five in AI, six in Build (including e-commerce / Shopify,
              WordPress, Wix-style work), three in Automate, three in Design. Each card is its own estimate and milestone, so pairings stay
              predictable when you combine, for example, RAG with workflow automation or a design system with a storefront launch.
            </>
          </RichSectionIntro>
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {practices.map((practice, idx) => (
              <div
                key={practice.id}
                style={
                  idx === 0
                    ? undefined
                    : { borderTop: "1px solid var(--ndx-border)", paddingTop: "2rem", marginTop: "0.5rem" }
                }
              >
                <PracticeSection practice={practice} />
              </div>
            ))}
          </div>
        </div>

        <div id="why-us" className="ndx-rich-block scroll-mt-24">
          <RichSectionIntro eyebrow="Trust & clarity" title="Why teams work with us">
            Written scope and pricing bands before deep work, weekly visibility during the build, and a handoff you can run — so you are not buying a black box.
          </RichSectionIntro>
          <div className="ndx-card-grid" style={{ marginTop: "1.5rem" }}>
            {whyUsItems.map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.title} className="ndx-card" style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div className="ndx-tech-abbr" style={{ width: 44, height: 44, flexShrink: 0 }}>
                    <Icon size={22} aria-hidden />
                  </div>
                  <div>
                    <h3 className="ndx-tech-name" style={{ fontSize: "1rem", marginBottom: "0.35rem" }}>
                      {row.title}
                    </h3>
                    <p className="ndx-tech-blurb" style={{ margin: 0 }}>
                      {row.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="ndx-rich-block">
          <RichSectionIntro eyebrow="How to choose" title="Which services do you actually need?">
            Match a goal to a pairing — then we validate scope, risks, and sequencing on a short discovery call.
          </RichSectionIntro>
          <div className="ndx-table-wrap" style={{ marginTop: "1.25rem" }}>
            <table className="ndx-table">
              <tbody>
                {decisionRows.map((row, index) => (
                  <tr key={row[0]}>
                    <td>
                      <span style={{ color: "var(--ndx-accent)", marginRight: "0.35rem" }}>{["◯", "◉", "◇", "◎", "◐", "⊟", "⬡"][index]}</span>
                      {row[0]}
                    </td>
                    <td style={{ color: "var(--ndx-accent)", fontWeight: 600 }}>{row[1]}</td>
                    <td>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ndx-rich-block ndx-glass-section scroll-mt-24">
          <RichSectionIntro eyebrow="How we pair" title="A real build rarely uses one service.">
            Common pairings clients actually request. Mix and match — or let us propose the shape during discovery.
          </RichSectionIntro>
          <div className="ndx-card-grid ndx-card-grid--cols-3" style={{ marginTop: "1.5rem" }}>
            {pairings.map((item) => (
              <PairingCard key={item.number} item={item} />
            ))}
          </div>
        </div>

        <div className="ndx-rich-block ndx-glass-section scroll-mt-24">
          <RichSectionIntro eyebrow="Engagement models" title="Three ways to work with us.">
            Most builds start fixed-scope; retainers and advisory blocks when you need steady capacity or direction. Assumed bands are ballparks — we confirm fees after a short brief.
          </RichSectionIntro>
          <div className="ndx-card-grid ndx-card-grid--cols-3" style={{ marginTop: "1.5rem" }}>
            {engagementModels.map((item) => (
              <motion.article key={item.number} className="ndx-card" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: "var(--ndx-font-serif)", fontSize: "2.25rem", fontStyle: "italic", color: "var(--ndx-accent)", lineHeight: 1 }}>{item.number}</span>
                  <span className="ndx-pill" style={{ flexShrink: 0 }}>
                    {item.timeline}
                  </span>
                </div>
                <h3 className="ndx-tech-name" style={{ fontSize: "1.2rem" }}>
                  {item.title}
                </h3>
                <p className="ndx-tech-blurb" style={{ marginTop: "0.5rem" }}>
                  {item.desc}
                </p>
                <p className="ndx-engagement-card__label" style={{ marginTop: "0.75rem", marginBottom: 0 }}>
                  <strong>Assumed from</strong> {item.assumedFrom}
                </p>
                <p className="ndx-engagement-card__label" style={{ marginTop: "0.45rem" }}>
                  <strong>Billing shape</strong> {item.billingShape}
                </p>
                <p className="ndx-tech-meta" style={{ marginTop: "0.65rem", paddingTop: "0.75rem", borderTop: "1px solid var(--ndx-border)", marginBottom: 0 }}>
                  Best for: <span style={{ color: "var(--ndx-accent)" }}>{item.best}</span>
                </p>
              </motion.article>
            ))}
          </div>
        </div>

        <div id="recent-work" className="ndx-rich-block ndx-glass-section ndx-glass-section--recent-work scroll-mt-24">
          <RichSectionIntro eyebrow="Recent work" title="What shipping looks like">
            Real client and BalochDev builds — open a case study for the full story.
          </RichSectionIntro>
          <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            <Link to="/portfolio/" className="ndx-btn">
              Full portfolio →
            </Link>
          </div>
          <SelectedWorkGrid />
        </div>

        <AiEstimatePromo />

        <PaymentsAndTrust />

        <div id="faq" className="ndx-rich-block ndx-glass-section scroll-mt-24">
          <RichSectionIntro eyebrow="FAQ" title="Working with BalochDev">
            Practical answers before you book a call — aligned with how we actually run projects.
          </RichSectionIntro>
          <div className="ndx-faq-stack--in-glass" style={{ marginTop: "1.25rem" }}>
            <FaqAccordion items={faqs} />
          </div>
        </div>

        <div className="ndx-rich-block ndx-glass-section scroll-mt-24">
          <RichSectionIntro eyebrow="Key terms" title="The vocabulary, briefly.">
            Plain definitions for terms that show up on scoping calls.
          </RichSectionIntro>
          <div className="ndx-rich-terms-grid ndx-rich-terms-grid--in-glass">
            {terms.map((item) => (
              <div key={item.title} className="ndx-card">
                <div style={{ color: "var(--ndx-accent)", marginBottom: "0.35rem", fontSize: "1.1rem" }}>&lt;/&gt;</div>
                <h3>{item.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--ndx-dim)", lineHeight: 1.55, marginTop: "0.35rem" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="ndx-rich-cta-box">
          <div>
            <p className="ndx-tech-meta">Let’s ship</p>
            <h2 className="ndx-h2" style={{ fontSize: "clamp(1.85rem, 3.5vw, 2.75rem)" }}>
              Tell us what you’re trying to build.
            </h2>
            <p className="ndx-lead" style={{ marginTop: "0.75rem", marginBottom: 0 }}>
              Bring a Figma, idea, repo, or rough sketch. We’ll help shape the scope, timeline and delivery plan.
            </p>
          </div>
          <div className="ndx-hero-btns">
            <BookCallButton className="ndx-btn ndx-btn-primary">Book a call →</BookCallButton>
            <Link to="/estimate/" className="ndx-btn">
              Get AI estimate
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
