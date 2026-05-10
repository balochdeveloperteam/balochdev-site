import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { IconType } from "react-icons";
import { usePageMeta } from "../hooks/usePageMeta";
import { useDataTheme } from "../hooks/useDataTheme";
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
import PartnerBrandsGrid from "../components/PartnerBrandsGrid";

type ServiceItem = {
  number: string;
  eyebrow: string;
  title: string;
  desc: string;
  tools: string;
  icon: IconType;
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

const reviewCards = [
  {
    quote: "Weekly demos kept decisions fast. We shipped a customer portal without redoing the whole backend.",
    name: "Product lead",
    role: "B2B services",
    rating: 5,
  },
  {
    quote: "They explained trade-offs in plain language and stuck to the timeline we agreed on.",
    name: "Founder",
    role: "Early-stage product",
    rating: 5,
  },
  {
    quote: "Our Shopify theme and checkout flow finally match the brand — and conversion picked up after launch.",
    name: "Marketing director",
    role: "E-commerce",
    rating: 5,
  },
  {
    quote: "The RAG assistant actually cites our policy docs. Support tickets for repeat questions dropped sharply.",
    name: "Head of ops",
    role: "Mid-size SaaS",
    rating: 5,
  },
  {
    quote: "They inherited a messy WordPress + WooCommerce setup and still hit the migration date we promised partners.",
    name: "IT lead",
    role: "Retail",
    rating: 4,
  },
  {
    quote: "Clear milestones and written scope — we always knew what was in the next release and what waited for v2.",
    name: "Engineering manager",
    role: "Fintech",
    rating: 5,
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
      },
      {
        number: "02",
        eyebrow: "Agents, not basic chat",
        title: "AI Agent Development",
        desc: "Tool-using agents with memory, actions, guardrails, human approval steps, and business system integrations.",
        tools: "LangGraph · MCP · Tools",
        icon: SiLangchain,
      },
      {
        number: "03",
        eyebrow: "Grounded answers",
        title: "RAG · LLM Development",
        desc: "Retrieval systems connected to your documents, databases, and knowledge so the AI answers from your real information.",
        tools: "Vector DB · Search · Citations",
        icon: SiGooglegemini,
      },
      {
        number: "04",
        eyebrow: "Conversations that convert",
        title: "AI Chatbot Development",
        desc: "Support, sales, onboarding, FAQ, and internal assistant chatbots for websites, WhatsApp, Telegram, and dashboards.",
        tools: "OpenAI · CRM · Help docs",
        icon: SiOpenai,
      },
      {
        number: "05",
        eyebrow: "Real calls, real actions",
        title: "Voice AI",
        desc: "Inbound and outbound voice agents with call handling, customer data, notes, follow-ups, and human handoff logic.",
        tools: "Twilio · STT · TTS",
        icon: TbPhoneCall,
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
      },
      {
        number: "02",
        eyebrow: "Android-first experiences",
        title: "Android App Development",
        desc: "Business apps, community apps, booking systems, dashboards, and mobile tools designed for daily use.",
        tools: "Android · Firebase · APIs",
        icon: SiAndroid,
      },
      {
        number: "03",
        eyebrow: "From MVP to SaaS",
        title: "SaaS Development",
        desc: "Auth, subscriptions, admin dashboards, customer portals, multi-role access, billing, and product analytics.",
        tools: "Supabase · Stripe · Next.js",
        icon: SiSupabase,
      },
      {
        number: "04",
        eyebrow: "Validate fast",
        title: "MVP Development",
        desc: "A focused first product that proves your idea with real users before you spend months building the wrong thing.",
        tools: "Prototype · Build · Launch",
        icon: TbRocket,
      },
      {
        number: "05",
        eyebrow: "Ship quickly, own it later",
        title: "No-Code + Custom Code",
        desc: "Fast no-code systems with custom logic where needed, so your product is quick to launch and not boxed in.",
        tools: "Webflow · Bubble · n8n",
        icon: SiWebflow,
      },
      {
        number: "06",
        eyebrow: "Stores that sell",
        title: "Ecommerce & platform sites",
        desc: "Shopify and Shopify themes, Wix and WordPress / WooCommerce builds, product and catalog SEO, payments, shipping rules, and integrations — plus headless or custom storefronts when you outgrow templates.",
        tools: "Shopify · WordPress · Wix · WooCommerce",
        icon: SiShopify,
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
      },
      {
        number: "02",
        eyebrow: "Connect your systems",
        title: "API & Integrations",
        desc: "Custom APIs and middleware connecting payments, CRMs, dashboards, databases, AI models, and third-party tools.",
        tools: "Node · Python · Webhooks",
        icon: SiNodedotjs,
      },
      {
        number: "03",
        eyebrow: "Keep products alive",
        title: "Maintenance & Support",
        desc: "Monthly product support, bug fixes, monitoring, upgrades, optimization, and small feature improvements.",
        tools: "Sentry · Vercel · Docker",
        icon: SiDocker,
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
      },
      {
        number: "02",
        eyebrow: "Identity with direction",
        title: "Branding",
        desc: "Logo direction, colors, type, product tone, website visuals, and brand systems for startups and businesses.",
        tools: "Identity · Visuals · Voice",
        icon: FaPaintBrush,
      },
      {
        number: "03",
        eyebrow: "Scale design cleanly",
        title: "Design Systems",
        desc: "Design tokens, reusable components, UI rules, and interface systems that keep your product consistent as it grows.",
        tools: "Tokens · Components · Rules",
        icon: SiStorybook,
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
  { number: "01", timeline: "2 – 16 weeks", title: "Fixed-scope build", desc: "Defined scope, timeline, and delivery. Best for MVPs, websites, Android apps, and clear feature builds.", best: "MVPs, rebuilds, launch projects" },
  { number: "02", timeline: "monthly", title: "Embedded team", desc: "A small product pod joins your workflow for ongoing design, development, AI and automation work.", best: "Growing products, ongoing capacity" },
  { number: "03", timeline: "weekly", title: "AI strategy advisory", desc: "Architecture, AI vendor choice, workflow design, automation planning, and technical direction.", best: "Teams starting with AI" },
];

const selectedWork = [
  { tag: "AI", title: "AI Call Center", desc: "Autonomous agents for inbound and outbound customer calls." },
  { tag: "Web", title: "FutureSpark", desc: "AI-enabled business platform with strong UX and launch-ready pages." },
  { tag: "Mobile", title: "Android CRM", desc: "Mobile-first operations platform with dashboard and data workflows." },
  { tag: "Automation", title: "Lead Engine", desc: "Automated lead capture, enrichment, notification and CRM update flows." },
  { tag: "SaaS", title: "Admin Portal", desc: "Multi-role dashboard with auth, analytics and client management." },
  { tag: "RAG", title: "Knowledge Bot", desc: "Document-connected assistant for internal teams and customers." },
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
    durationSec: 120,
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
    durationSec: 88,
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
    durationSec: 62,
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
      : { duration: durationSec, repeat: Infinity, ease: "linear" as const };

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
    <a href={`#${practice.id}`} className="ndx-practice-link">
      <div>
        <div className="ndx-practice-link__meta">
          {practice.number} · {practice.count}
        </div>
        <div className="ndx-practice-link__title">{practice.title}</div>
      </div>
      <span className="ndx-practice-link__arrow" aria-hidden>
        →
      </span>
    </a>
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
      <div
        style={{
          marginTop: "1rem",
          paddingTop: "0.85rem",
          borderTop: "1px solid var(--ndx-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <span className="ndx-tech-meta" style={{ marginBottom: 0 }}>
          {service.tools}
        </span>
        <span className="ndx-tech-arrow">→</span>
      </div>
    </motion.article>
  );
}

function RichSectionIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="ndx-rich-split-head">
      <div className="ndx-rich-split-head__lead">
        <p className="ndx-tech-meta">{eyebrow}</p>
        <h2 className="ndx-h2 ndx-rich-split-head__title">{title}</h2>
      </div>
      <div className="ndx-rich-split-head__copy">
        <div className="ndx-group-sub ndx-rich-split-head__text">{children}</div>
      </div>
    </div>
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

function ReviewsCarousel({
  items,
  reduced,
}: {
  items: (typeof reviewCards)[number][];
  reduced: boolean;
}) {
  const [index, setIndex] = useState(0);
  const n = items.length;
  const prev = () => setIndex((i) => (i - 1 + n) % n);
  const next = () => setIndex((i) => (i + 1) % n);

  return (
    <div className="ndx-reviews-carousel">
      <div className="ndx-reviews-carousel__viewport">
        <motion.div
          className="ndx-reviews-carousel__track"
          animate={{ x: `${-index * 100}%` }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 32, mass: 0.85 }}
          aria-live="polite"
        >
          {items.map((r, i) => (
            <div key={i} className="ndx-reviews-carousel__slide">
              <figure className="ndx-reviews-carousel__figure">
                <p
                  role="img"
                  aria-label={`${r.rating} out of 5 stars`}
                  style={{ color: "var(--ndx-accent)", letterSpacing: "0.08em", fontSize: "0.95rem", margin: 0 }}
                >
                  {"★".repeat(r.rating)}
                  <span className="visually-hidden"> {r.rating} of 5</span>
                </p>
                <blockquote
                  className="ndx-tech-blurb"
                  style={{ margin: "0.75rem 0 0", fontStyle: "normal", fontSize: "1.05rem", lineHeight: 1.55 }}
                >
                  “{r.quote}”
                </blockquote>
                <figcaption style={{ marginTop: "1.1rem", fontSize: "0.875rem", color: "var(--ndx-muted)" }}>
                  <strong style={{ color: "var(--ndx-text)" }}>{r.name}</strong>
                  <span> · {r.role}</span>
                </figcaption>
              </figure>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="ndx-reviews-carousel__controls">
        <button type="button" className="ndx-reviews-carousel__btn" onClick={prev} aria-label="Previous testimonial">
          ‹
        </button>
        <span className="ndx-page-rich__reviews-meta">
          {index + 1} / {n}
        </span>
        <button type="button" className="ndx-reviews-carousel__btn" onClick={next} aria-label="Next testimonial">
          ›
        </button>
      </div>
      <div className="ndx-reviews-carousel__dots" aria-label="Testimonial index">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show testimonial ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            className={i === index ? "ndx-reviews-carousel__dot ndx-reviews-carousel__dot--active" : "ndx-reviews-carousel__dot"}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
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

function FAQItem({ item, index }: { item: (typeof faqs)[number]; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="ndx-faq-item">
      <button type="button" className="ndx-faq-q" onClick={() => setOpen(!open)}>
        <span>{item.q}</span>
        <span style={{ color: "var(--ndx-accent)", fontSize: "1.35rem" }}>{open ? "−" : "+"}</span>
      </button>
      {open ? <div className="ndx-faq-a">{item.a}</div> : null}
    </div>
  );
}

export default function ServicesPage() {
  const reduced = useReducedMotion();
  const jsonLd = useMemo(() => {
    const baseUrl = "https://balochdev.com";
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
            provider: { "@type": "Organization", name: "BalochDev", url: baseUrl },
          },
        };
      }),
    );
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${baseUrl}/services#webpage`,
          name: "BalochDev — Web, mobile & AI product development",
          description:
            "Seventeen delivery areas across AI, build, automation, and design: web, Android, SaaS, e-commerce, agents, RAG, workflows, integrations, and UX. Discovery, milestones, handoff.",
          url: `${baseUrl}/services`,
        },
        {
          "@type": "ItemList",
          "@id": `${baseUrl}/services#itemlist`,
          name: "BalochDev delivery areas",
          itemListElement: itemListElements,
        },
      ],
    };
  }, []);

  usePageMeta({
    title: "BalochDev — Web, mobile & AI product development",
    description:
      "Seventeen scoped offerings: AI agents, RAG, voice, web, Android, SaaS, e-commerce, automation, integrations, UX/UI. Weekly demos, clear handoff, maintenance options.",
    path: "/services",
    jsonLd,
    ogTitle: "BalochDev — Web, mobile & AI product development",
    ogDescription:
      "Seventeen scoped offerings: AI agents, RAG, voice, web, Android, SaaS, e-commerce, automation, integrations, UX/UI. Weekly demos, clear handoff, maintenance options.",
    ogImage: "https://placehold.co/1200x630/6366f1/ffffff/png?text=BalochDev+Services",
    ogUrl: "https://balochdev.com/services",
  });

  return (
    <section className="ndx-section ndx-page-rich" style={{ paddingTop: "1.65rem" }}>
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
              <Link to="/contact" className="ndx-btn ndx-btn-primary">
                Start a project →
              </Link>
              <a href="#capabilities" className="ndx-btn">
                Browse offerings
              </a>
            </motion.div>
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
          <RichSectionIntro eyebrow="Why us" title="Why teams work with us">
            Straightforward delivery: one team, clear milestones, and a handoff you can maintain — not two different “pages” of promises.
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

        <div className="ndx-rich-block">
          <RichSectionIntro eyebrow="How we pair" title="A real build rarely uses one service.">
            Common pairings clients actually request. Mix and match — or let us propose the shape during discovery.
          </RichSectionIntro>
          <div className="ndx-card-grid" style={{ marginTop: "1.5rem" }}>
            {pairings.map((item) => (
              <PairingCard key={item.number} item={item} />
            ))}
          </div>
        </div>

        <div className="ndx-rich-block">
          <RichSectionIntro eyebrow="Engagement models" title="Three ways to work with us.">
            Most builds start fixed-scope; retainers and advisory blocks when you need steady capacity or direction.
          </RichSectionIntro>
          <div className="ndx-card-grid" style={{ marginTop: "1.5rem" }}>
            {engagementModels.map((item) => (
              <motion.article key={item.number} className="ndx-card" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: "var(--ndx-font-serif)", fontSize: "2.25rem", fontStyle: "italic", color: "var(--ndx-accent)" }}>{item.number}</span>
                  <span className="ndx-pill">{item.timeline}</span>
                </div>
                <h3 className="ndx-tech-name" style={{ fontSize: "1.2rem" }}>
                  {item.title}
                </h3>
                <p className="ndx-tech-blurb" style={{ marginTop: "0.5rem" }}>
                  {item.desc}
                </p>
                <p className="ndx-tech-meta" style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--ndx-border)" }}>
                  Best for: <span style={{ color: "var(--ndx-accent)" }}>{item.best}</span>
                </p>
              </motion.article>
            ))}
          </div>
        </div>

        <div id="recent-work" className="ndx-rich-block scroll-mt-24">
          <RichSectionIntro eyebrow="Recent work" title="What shipping looks like">
            Representative project shapes — case studies and credits live on the portfolio.
          </RichSectionIntro>
          <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            <Link to="/portfolio" className="ndx-btn">
              Full portfolio →
            </Link>
          </div>
          <div className="ndx-card-grid" style={{ marginTop: "1.5rem" }}>
            {selectedWork.map((item, index) => (
              <Link key={item.title} to="/portfolio" className="ndx-card ndx-card-link" style={{ overflow: "hidden", padding: 0, display: "block" }}>
                <div
                  style={{
                    position: "relative",
                    height: "11rem",
                    background: `linear-gradient(135deg, color-mix(in srgb, var(--ndx-accent) 26%, transparent), color-mix(in srgb, var(--ndx-accent-2) 18%, transparent), color-mix(in srgb, var(--ndx-bg) 72%, transparent))`,
                  }}
                >
                  <span className="ndx-pill" style={{ position: "absolute", left: "1.1rem", top: "1.1rem", color: "var(--ndx-accent)" }}>
                    {item.tag}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      right: "1.1rem",
                      bottom: "1rem",
                      fontFamily: "var(--ndx-font-serif)",
                      fontSize: "2.5rem",
                      fontStyle: "italic",
                      opacity: 0.45,
                    }}
                  >
                    0{index + 1}
                  </span>
                </div>
                <div style={{ padding: "1.35rem" }}>
                  <h3>{item.title}</h3>
                  <p className="ndx-tech-blurb" style={{ marginTop: "0.35rem" }}>
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div id="partners" className="ndx-rich-block scroll-mt-24">
          <RichSectionIntro eyebrow="Collaborators" title="Organizations we’ve shipped with">
            Language, publishing, AI platforms, and digital partners — hover a mark for its name; click to open the official site.
          </RichSectionIntro>
          <PartnerBrandsGrid />
        </div>

        <PaymentsAndTrust />

        <div id="reviews" className="ndx-rich-block scroll-mt-24">
          <RichSectionIntro eyebrow="Trust" title="Client feedback">
            Paraphrased themes after delivery — not paid endorsements or cherry-picked quotes.
          </RichSectionIntro>
          <ReviewsCarousel items={reviewCards} reduced={!!reduced} />
        </div>

        <div id="pricing-note" className="ndx-rich-block scroll-mt-24">
          <RichSectionIntro eyebrow="Quotes" title="Budgets & timelines">
            <>
              We scope work after discovery: goals, integrations, compliance, and who owns maintenance afterward. You get milestones and fees in
              writing — no vague “phase 2 someday.” For a tailored estimate, use{" "}
              <Link to="/contact">contact</Link> or the <Link to="/estimate">AI estimate</Link> form.
            </>
          </RichSectionIntro>
        </div>

        <div id="faq" className="ndx-rich-block scroll-mt-24">
          <RichSectionIntro eyebrow="FAQ" title="Working with BalochDev">
            Practical answers before you book a call — aligned with how we actually run projects.
          </RichSectionIntro>
          <div style={{ marginTop: "1.25rem" }}>
            {faqs.map((item, index) => (
              <FAQItem key={item.q} item={item} index={index} />
            ))}
          </div>
        </div>

        <div className="ndx-rich-block">
          <RichSectionIntro eyebrow="Key terms" title="The vocabulary, briefly.">
            Plain definitions for terms that show up on scoping calls.
          </RichSectionIntro>
          <div className="ndx-rich-terms-grid">
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
            <Link to="/contact" className="ndx-btn ndx-btn-primary">
              Book a call →
            </Link>
            <Link to="/estimate" className="ndx-btn">
              Get AI estimate
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
