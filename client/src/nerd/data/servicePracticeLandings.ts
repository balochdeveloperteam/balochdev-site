/**
 * Service practice hubs — /services/practice/:id
 * SEO + depth for each practice (AI, Build, Automate, Design).
 */

export type ServicePracticeId = "ai" | "build" | "automate" | "design";

export type PracticeOfferingBrief = {
  slug: string;
  title: string;
  timeline: string;
  fromPrice: string;
};

export type ServicePracticeLandingConfig = {
  id: ServicePracticeId;
  number: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  heroLead: string;
  seoTitle: string;
  seoBody: string;
  introPanel: {
    kicker: string;
    headline: string;
    tiles: { label: string; sub: string }[];
  };
  why: { title: string; text: string }[];
  howPhases: { title: string; weeks: string; body: string }[];
  priceRows: { phase: string; includes: string; timeline: string; fromPrice: string }[];
  priceFootnote: string;
  deliveryHeading: string;
  deliveryLead: string;
  deliveryTags: string[];
  offerings: PracticeOfferingBrief[];
  faq: { q: string; a: string }[];
};

const DISCOVERY_NOTE =
  "Assumed bands are typical first phases before integrations and compliance add scope — we confirm fees in writing after a short brief.";

export const SERVICE_PRACTICE_LANDINGS: Record<ServicePracticeId, ServicePracticeLandingConfig> = {
  ai: {
    id: "ai",
    number: "/01",
    title: "AI & Intelligence",
    metaTitle: "AI development services — agents, RAG, chatbots & voice | BalochDev",
    description:
      "Production AI from BalochDev: LLM integrations, agents with tools, RAG, customer chatbots, and voice workflows — scoped with milestones, guardrails, and clear pricing bands.",
    keywords: [
      "AI development company",
      "AI agent development services",
      "RAG development",
      "LLM integration services",
      "AI chatbot development",
      "voice AI development",
      "OpenAI Claude Gemini integration",
      "BalochDev AI services",
    ],
    heroLead:
      "We ship AI that lives in your product: grounded retrieval, tool-using agents, chatbots across channels, and voice flows — with evaluation, budgets, and human gates where stakes are high.",
    seoTitle: "What BalochDev means by AI & Intelligence delivery",
    seoBody:
      "AI & Intelligence is not a slide deck category for us — it is engineering work that ends in production features. We scope whether you need prompt-only integrations, retrieval-augmented generation over your documents, autonomous agents with audited tool access, or multilingual voice. Each path gets acceptance criteria, staging, and observability hooks so you can see quality and cost before traffic scales. When a use case is a poor fit, we say so early — cheaper than a three-month prototype that never clears review.",
    introPanel: {
      kicker: "Practice snapshot",
      headline: "How this practice shows up on real roadmaps",
      tiles: [
        { label: "Grounding & citations", sub: "RAG and policy-aware prompts so answers trace to your data — not generic model memory." },
        { label: "Agents & tools", sub: "MCP, APIs, and human-in-the-loop writes — least-privilege credentials and kill switches." },
        { label: "Channels & voice", sub: "Web, WhatsApp, telephony — latency-aware UX and handoff to humans when needed." },
        { label: "Ops & cost", sub: "Model routing, tracing, and budgets so invoices stay predictable week over week." },
      ],
    },
    why: [
      { title: "Product-first AI", text: "We ship features your users touch — not isolated notebooks or one-off demos." },
      { title: "Security-conscious defaults", text: "PII boundaries, retention awareness, and explicit review before risky automation." },
      { title: "Provider-agnostic where sensible", text: "OpenAI, Claude, Gemini, or open models — chosen for quality, latency, and your constraints." },
      { title: "Milestones you can accept", text: "Written scope per phase with demos — aligned with how procurement and founders actually buy." },
    ],
    howPhases: [
      {
        title: "Discovery & scope",
        weeks: "1–2 wks",
        body: "Goals, data access, risk tolerance, and integrations — output is a phased plan with assumed fees, not vague “Phase 2 someday.”",
      },
      {
        title: "Proof on your data",
        weeks: "1–3 wks",
        body: "A narrow vertical slice: real prompts, retrieval, or agent tools — so we prove fit before a long build commit.",
      },
      {
        title: "Production build",
        weeks: "3–12+ wks",
        body: "Hardening, auth, monitoring, and rollouts — weight depends on channels, compliance, and number of integrations.",
      },
      {
        title: "Handoff & care",
        weeks: "ongoing optional",
        body: "Repos, env docs, runbooks — optional retainer for drift, model upgrades, and small product tweaks.",
      },
    ],
    priceRows: [
      {
        phase: "Discovery / scope sprint",
        includes: "Brief, architecture notes, phased quote",
        timeline: "1–2 wks",
        fromPrice: "~USD $1.2k+",
      },
      {
        phase: "First production ship (typical slice)",
        includes: "RAG, chatbot, or agent MVP with staging",
        timeline: "3–8 wks",
        fromPrice: "~USD $4.5k+",
      },
      {
        phase: "Larger program",
        includes: "Multi-channel, voice, or heavy integrations",
        timeline: "8–16+ wks",
        fromPrice: "~USD $12k+",
      },
    ],
    priceFootnote: DISCOVERY_NOTE,
    deliveryHeading: "Deliverables we routinely ship in this practice",
    deliveryLead:
      "Concrete surfaces: LLM-backed features in your app, retrieval stacks over Postgres or managed vectors, agent workflows with approvals, and voice flows with human transfer — documented so your team can operate them.",
    deliveryTags: [
      "LLM features in web & mobile",
      "RAG & citations",
      "Tool-using agents",
      "Support & sales chatbots",
      "Voice agents & telephony",
      "Evals & monitoring hooks",
    ],
    offerings: [
      { slug: "ai-development", title: "AI Development", timeline: "3–8 wks", fromPrice: "~USD $4.5k+" },
      { slug: "ai-agents", title: "AI Agent Development", timeline: "4–12 wks", fromPrice: "~USD $8k+" },
      { slug: "rag-llm", title: "RAG · LLM Development", timeline: "3–8 wks", fromPrice: "~USD $5.5k+" },
      { slug: "chatbots", title: "AI Chatbot Development", timeline: "2–6 wks", fromPrice: "~USD $3.2k+" },
      { slug: "voice-ai", title: "Voice AI", timeline: "6–14 wks", fromPrice: "~USD $12k+" },
    ],
    faq: [
      {
        q: "Do you only build chatbots?",
        a: "No — we also ship agents, RAG over internal data, embedded copilots, and voice. The right shape depends on your workflow, not the buzzword.",
      },
      {
        q: "How do you price AI work?",
        a: "Phased scopes with fixed fees per milestone when possible; retainers when you need ongoing capacity. AI usage (tokens) is forecasted and capped with alerts.",
      },
      {
        q: "Can you work inside our existing app?",
        a: "Yes — we extend React/Next, Android, and common stacks, and integrate with CRMs, helpdesks, and data stores you already run.",
      },
      {
        q: "What if our use case is a bad fit for LLMs?",
        a: "We tell you in discovery — we prefer a short no than a failed launch. Sometimes rules + automation beats a model.",
      },
    ],
  },

  build: {
    id: "build",
    number: "/02",
    title: "Build · Product",
    metaTitle: "Web, Android, SaaS & ecommerce development | BalochDev",
    description:
      "Product development at BalochDev: Next.js and React web, Android apps, SaaS foundations, MVPs, and ecommerce on Shopify, WordPress, and modern stacks — milestones, SEO-aware delivery, and clear handoff.",
    keywords: [
      "web development agency",
      "Next.js development services",
      "Android app development",
      "SaaS development company",
      "MVP development services",
      "Shopify WordPress development",
      "BalochDev product development",
    ],
    heroLead:
      "We build surfaces customers actually use: marketing sites, dashboards, Android apps, subscription products, and stores — with auth, payments hooks, and deploy paths you can own.",
    seoTitle: "How BalochDev scopes Build · Product engagements",
    seoBody:
      "Build · Product is where design intent becomes running software. We group web, Android, SaaS, MVP, hybrid no-code, and ecommerce here because buyers usually need more than one label — but each engagement still gets its own scope line and acceptance. We bias to TypeScript, React/Next.js, Supabase or Firebase-style backends for speed, and pragmatic SEO for public pages. Larger programs split into milestones so you can ship a first slice to users without betting everything on a big-bang release.",
    introPanel: {
      kicker: "Practice snapshot",
      headline: "What “build” means in proposals and SOWs",
      tiles: [
        { label: "Web & dashboards", sub: "SSR/SSG choices, performance budgets, and sane metadata for discovery in search." },
        { label: "Mobile (Android)", sub: "Business and community apps with notifications, offline where needed, and API discipline." },
        { label: "SaaS shape", sub: "Auth, roles, billing seams, admin tooling — the recurring skeleton behind recurring revenue." },
        { label: "Ecommerce", sub: "Shopify, WooCommerce, Wix, or headless when templates stop scaling — catalog, checkout, ops integrations." },
      ],
    },
    why: [
      { title: "One team, end-to-end", text: "UX through deploy — fewer gaps between design intent and production behavior." },
      { title: "Milestone-driven", text: "You see working software on a rhythm — not a silent backlog for months." },
      { title: "Honest stack choices", text: "We match framework and hosting to your team and timeline — not resume-driven complexity." },
      { title: "Launchable handoff", text: "Repos, env templates, and runbooks — you can operate or extend without vendor lock-in stories." },
    ],
    howPhases: [
      {
        title: "Discovery & UX alignment",
        weeks: "1–2 wks",
        body: "Goals, IA, integrations, and success metrics — wireframes or Figma sync when you already have visuals.",
      },
      {
        title: "Build iterations",
        weeks: "2–12+ wks",
        body: "Vertical slices merged behind feature flags or staging — complexity tracks ecommerce, auth, and third-party APIs.",
      },
      {
        title: "Hardening & launch",
        weeks: "1–3 wks",
        body: "Analytics, error reporting, basic perf checks, and production deploy — with rollback path documented.",
      },
      {
        title: "Grow or maintain",
        weeks: "optional",
        body: "Retainers for improvements, upgrades, and small features after go-live.",
      },
    ],
    priceRows: [
      {
        phase: "Landing / small site slice",
        includes: "Templated structure + custom sections",
        timeline: "2–4 wks",
        fromPrice: "~USD $2.8k+",
      },
      {
        phase: "Product MVP",
        includes: "Auth, core flows, staging",
        timeline: "4–8 wks",
        fromPrice: "~USD $4k+",
      },
      {
        phase: "SaaS or app program",
        includes: "Roles, billing hooks, wider QA",
        timeline: "8–20 wks",
        fromPrice: "~USD $14k+",
      },
    ],
    priceFootnote: DISCOVERY_NOTE,
    deliveryHeading: "What we ship in Build · Product",
    deliveryLead:
      "Production-ready web and mobile experiences with sensible defaults for SEO, accessibility hygiene, and observability — so your first real users do not become your first production incident.",
    deliveryTags: [
      "Marketing & content sites",
      "Customer portals & dashboards",
      "Android applications",
      "SaaS MVP → v1",
      "Shopify / WooCommerce / Wix",
      "API-backed features",
    ],
    offerings: [
      { slug: "web", title: "Web Development", timeline: "2–6 wks", fromPrice: "~USD $2.8k+" },
      { slug: "android-app-development", title: "Android App Development", timeline: "5–12 wks", fromPrice: "~USD $6.5k+" },
      { slug: "saas-development", title: "SaaS Development", timeline: "8–20 wks", fromPrice: "~USD $14k+" },
      { slug: "mvp-development", title: "MVP Development", timeline: "3–7 wks", fromPrice: "~USD $4k+" },
      { slug: "no-code-custom-code", title: "No-Code + Custom Code", timeline: "2–5 wks", fromPrice: "~USD $1.8k+" },
      { slug: "ecommerce", title: "Ecommerce & platform sites", timeline: "2–8 wks", fromPrice: "~USD $3.5k+" },
    ],
    faq: [
      {
        q: "Do you take over existing codebases?",
        a: "Often — we start with a short audit and milestone plan so refactors do not block useful shipping.",
      },
      {
        q: "Fixed price or time and materials?",
        a: "Usually fixed per milestone for product work; T&M for unclear discovery or advisory when that is fairer.",
      },
      {
        q: "Can you help after launch?",
        a: "Yes — light retainers for security updates, monitoring, and small features are common.",
      },
    ],
  },

  automate: {
    id: "automate",
    number: "/03",
    title: "Automate · Ops",
    metaTitle: "Workflow automation & API integrations | BalochDev",
    description:
      "Automation and integrations from BalochDev: n8n, Make, Zapier, custom APIs, webhooks, and ongoing maintenance — fewer manual hops between CRMs, sheets, messaging, and AI actions.",
    keywords: [
      "workflow automation services",
      "n8n Make Zapier integration",
      "custom API development",
      "business process automation",
      "software maintenance retainer",
      "BalochDev automation",
    ],
    heroLead:
      "We connect the tools you already run — forms, CRMs, chat, sheets, billing — with reliable automation, retries, and observability so ops teams stop copy-pasting.",
    seoTitle: "How BalochDev delivers Automate · Ops work",
    seoBody:
      "Automate · Ops is the glue layer: orchestration with n8n, Make, or Zapier when speed wins, plus Node or Python services when you need custom logic, idempotency, or long-running jobs. We document failure paths, alerting, and who owns credentials — because automation that only works on demo day becomes shelfware. Maintenance retainers keep workflows alive as vendors change APIs and your processes evolve.",
    introPanel: {
      kicker: "Practice snapshot",
      headline: "When to reach for automation vs custom code",
      tiles: [
        { label: "Fast orchestration", sub: "Zapier/Make/n8n for well-defined triggers — clear owner and error notifications." },
        { label: "Custom middleware", sub: "When you need branching logic, audit trails, or systems that generic zaps cannot model cleanly." },
        { label: "API discipline", sub: "Versioned contracts, webhooks with retries, secrets outside Git — production hygiene by default." },
        { label: "Run & maintain", sub: "Playbooks for breaks, vendor upgrades, and small improvements — not one-off scripts nobody dares touch." },
      ],
    },
    why: [
      { title: "Hours back to the team", text: "Automations target repetitive, high-volume paths — where ROI is legible within weeks." },
      { title: "Fewer silent failures", text: "Retries, dead-letter patterns, and logs — so you know when a bot stops." },
      { title: "Security-aware plumbing", text: "Least-privilege tokens and scoped credentials — especially around CRM and billing." },
      { title: "Sustainable ops", text: "Handover docs and optional retainers — automations are living systems, not freezer assets." },
    ],
    howPhases: [
      {
        title: "Map & prioritize",
        weeks: "3–7 days",
        body: "Interview-style walkthrough of systems, triggers, and exceptions — we rank what to automate first.",
      },
      {
        title: "Implement & test",
        weeks: "1–5 wks",
        body: "Build flows or services with staging hooks — dry runs before production traffic depends on them.",
      },
      {
        title: "Rollout & monitor",
        weeks: "ongoing",
        body: "Alerts, ownership, and change process — especially when marketing or ops edits live flows.",
      },
      {
        title: "Maintain",
        weeks: "monthly optional",
        body: "Vendor API bumps, new fields, and incident response — keep glue from rotting.",
      },
    ],
    priceRows: [
      {
        phase: "Single high-value flow",
        includes: "One critical path automated end-to-end",
        timeline: "1–3 wks",
        fromPrice: "~USD $1.5k+",
      },
      {
        phase: "Integration program",
        includes: "Multiple systems + custom middleware",
        timeline: "2–8 wks",
        fromPrice: "~USD $2.8k+",
      },
      {
        phase: "Maintenance retainer",
        includes: "Hours for fixes, upgrades, tweaks",
        timeline: "monthly",
        fromPrice: "~USD $800+/mo",
      },
    ],
    priceFootnote: DISCOVERY_NOTE,
    deliveryHeading: "Outputs in Automate · Ops",
    deliveryLead:
      "Reliable workflows, documented failure handling, and integrations that survive API changes — with clear ownership between BalochDev and your internal admins.",
    deliveryTags: [
      "CRM & form routing",
      "Sheets, email, chat bridges",
      "AI-assisted automation",
      "Webhooks & custom APIs",
      "Monitoring & alerts",
      "Monthly care retainers",
    ],
    offerings: [
      { slug: "workflow-automation", title: "Workflow Automation", timeline: "1–5 wks", fromPrice: "~USD $1.5k+" },
      { slug: "api-integrations", title: "API & Integrations", timeline: "2–8 wks", fromPrice: "~USD $2.8k+" },
      { slug: "maintenance-support", title: "Maintenance & Support", timeline: "ongoing", fromPrice: "~USD $800+/mo" },
    ],
    faq: [
      {
        q: "Zapier vs n8n vs custom code?",
        a: "Volume, branching, hosting policy, and data residency drive the choice — we recommend per flow, not per religion.",
      },
      {
        q: "Who owns credentials?",
        a: "Typically your org stores production secrets; we use scoped access during build and document rotation steps.",
      },
      {
        q: "What happens when a vendor breaks an API?",
        a: "We monitor, patch connectors, and communicate impact — retainers make that sustainable.",
      },
    ],
  },

  design: {
    id: "design",
    number: "/04",
    title: "Design · Craft",
    metaTitle: "UX/UI design, branding & design systems | BalochDev",
    description:
      "Design practice at BalochDev: UX/UI for web and product, branding direction, and design systems — Figma-native handoff that survives engineering iteration.",
    keywords: [
      "UX UI design services",
      "product design agency",
      "branding for startups",
      "design system development",
      "Figma to development handoff",
      "BalochDev design",
    ],
    heroLead:
      "We design interfaces people can use: research-backed UX, clear UI, brand systems that scale, and tokens your engineers can actually implement.",
    seoTitle: "How BalochDev runs Design · Craft engagements",
    seoBody:
      "Design · Craft covers UX/UI, branding, and design systems because those packages often arrive together in real proposals — but each stream still has its own estimate. We work Figma-first with accessibility and responsive behavior in mind, and we align naming and tokens with whoever implements. The goal is not maximum pixels — it is a handshake between design and code that survives v2 features without chaos.",
    introPanel: {
      kicker: "Practice snapshot",
      headline: "Where design plugs into delivery",
      tiles: [
        { label: "UX clarity", sub: "Flows, states, and edge cases surfaced before engineering buries assumptions." },
        { label: "UI craft", sub: "Typography, spacing, and components that hold up on real devices — not only hero mocks." },
        { label: "Brand systems", sub: "Voice, color, type, and usage rules your marketing and product can share." },
        { label: "Systems for scale", sub: "Tokens and components so velocity goes up as the product grows." },
      ],
    },
    why: [
      { title: "Engineering-aware handoff", text: "Components and states match what React/Next or native stacks need to build." },
      { title: "Faster stakeholder alignment", text: "Artifacts teams can comment on — fewer circular “make it pop” loops." },
      { title: "Accessible baseline", text: "Contrast, focus, and hierarchy — not an afterthought the week before launch." },
      { title: "Coherent brand", text: "Visual language that fits your product story across site, app, and decks." },
    ],
    howPhases: [
      {
        title: "Understand & frame",
        weeks: "3–10 days",
        body: "Users, constraints, and success signals — lightweight research when the problem is fuzzy.",
      },
      {
        title: "Explore & decide",
        weeks: "1–3 wks",
        body: "Directions, IA, and key screens — decisions documented before high-fidelity sprawls.",
      },
      {
        title: "Refine & specify",
        weeks: "2–6 wks",
        body: "Components, specs, and redlines — ready for build and QA against acceptance notes.",
      },
      {
        title: "Support build",
        weeks: "as needed",
        body: "Iteration with engineering during implementation — within agreed touchpoints so scope stays bounded.",
      },
    ],
    priceRows: [
      {
        phase: "Focused UX/UI slice",
        includes: "Key flows + component-ready frames",
        timeline: "2–4 wks",
        fromPrice: "~USD $2.2k+",
      },
      {
        phase: "Brand + web visual system",
        includes: "Identity direction + core marketing surfaces",
        timeline: "2–4 wks",
        fromPrice: "~USD $1.8k+",
      },
      {
        phase: "Design system pass",
        includes: "Tokens, library, documentation spine",
        timeline: "3–8 wks",
        fromPrice: "~USD $5k+",
      },
    ],
    priceFootnote: DISCOVERY_NOTE,
    deliveryHeading: "Design · Craft deliverables",
    deliveryLead:
      "Figma libraries, annotated specs, and brand guidelines your team can reuse — paired with build partners who care about token discipline.",
    deliveryTags: [
      "UX research & flows",
      "UI for web & mobile",
      "Brand identity & guidelines",
      "Design tokens & components",
      "Design QA with engineering",
    ],
    offerings: [
      { slug: "ux-ui", title: "UX/UI Design", timeline: "2–6 wks", fromPrice: "~USD $2.2k+" },
      { slug: "branding", title: "Branding", timeline: "2–4 wks", fromPrice: "~USD $1.8k+" },
      { slug: "design-systems", title: "Design Systems", timeline: "3–8 wks", fromPrice: "~USD $5k+" },
    ],
    faq: [
      {
        q: "Do you design without a developer lined up?",
        a: "Yes — we can deliver implementation-ready files and optional build pairing when you are ready.",
      },
      {
        q: "Can you refresh an existing product?",
        a: "Common — we audit screens, propose a phased visual and UX cleanup, and align with your backlog capacity.",
      },
      {
        q: "What tools do you use?",
        a: "Primarily Figma; exports and naming follow whatever your engineering team standardizes on.",
      },
    ],
  },
};

export function isValidServicePracticeId(id: string | undefined): id is ServicePracticeId {
  return id === "ai" || id === "build" || id === "automate" || id === "design";
}

export function getServicePracticeLanding(id: string | undefined): ServicePracticeLandingConfig | null {
  if (!id || !isValidServicePracticeId(id)) return null;
  return SERVICE_PRACTICE_LANDINGS[id];
}
