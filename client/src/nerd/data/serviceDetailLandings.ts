/**
 * Rich /services/:slug landings — SEO, pricing bands, phased delivery, FAQs.
 * Layout rendered by ServiceDetailPage.tsx (ndx-tech-landing, same family as practice + tech stacks).
 */

import type { ServicePracticeId } from "./servicePracticeLandings";

export type ServiceDetailSlug =
  | "ai-development"
  | "ai-agents"
  | "rag-llm"
  | "chatbots"
  | "voice-ai"
  | "web"
  | "android-app-development"
  | "saas-development"
  | "mvp-development"
  | "no-code-custom-code"
  | "ecommerce"
  | "workflow-automation"
  | "api-integrations"
  | "maintenance-support"
  | "ux-ui"
  | "branding"
  | "design-systems";

export type ServiceDetailLandingConfig = {
  slug: ServiceDetailSlug;
  practiceId: ServicePracticeId;
  metaTitle: string;
  description: string;
  keywords: string[];
  heroLead: string;
  seoTitle: string;
  seoBody: string;
  introPanel: { kicker: string; headline: string; tiles: { label: string; sub: string }[] };
  why: { title: string; text: string }[];
  howPhases: { title: string; weeks: string; body: string }[];
  priceRows: { phase: string; includes: string; timeline: string; fromPrice: string }[];
  priceFootnote: string;
  deliveryHeading: string;
  deliveryLead: string;
  deliveryTags: string[];
  faq: { q: string; a: string }[];
  relatedSlugs?: ServiceDetailSlug[];
  roiFit?: {
    title: string;
    intro: string;
    worksWell: string[];
    proceedCarefully: string[];
  };
  platformGuide?: {
    intro: string;
    platforms: { name: string; bestFor: string; watchOuts: string; ourApproach: string }[];
  };
};

const DEFAULT_PRICE_FOOTNOTE =
  "Assumed bands are typical before unusual integrations, heavy compliance, or bespoke UI — we confirm fees in writing after a short brief. Most engagements are milestone-invoiced in USD.";

export const SERVICE_DETAIL_LANDINGS: Record<ServiceDetailSlug, ServiceDetailLandingConfig> = {
  "ai-development": {
    slug: "ai-development",
    practiceId: "ai",
    metaTitle: "Custom AI development services — production LLM features | BalochDev",
    description:
      "Hire BalochDev for production AI development: OpenAI, Claude, and Gemini integrations with guardrails, evaluation, and clear pricing — not slide-deck experiments.",
    keywords: [
      "custom AI development services",
      "AI software development company",
      "LLM integration developers",
      "OpenAI API integration agency",
      "Claude API development",
      "Gemini AI integration",
      "AI feature development cost",
      "production AI vs prototype",
      "BalochDev AI development",
    ],
    heroLead:
      "We build AI features your users actually touch: structured outputs, safe tool access, tracing, and budgets — scoped so stakeholders know what ships and what it costs.",
    seoTitle: "What “AI development” means when you need it in production",
    seoBody:
      "Search traffic around AI development often mixes demos with shipping. We treat AI development as product engineering: prompts alone, retrieval over your documents, or agentic flows each get acceptance tests, staging routes, and observability. Before we commit, we align on whether the job is “model API behind a button” or a longer-running agent — because timelines and risk differ. Content on this page mirrors how we explain scope to technical and non-technical buyers, similar in depth to established AI service pages in the industry.",
    introPanel: {
      kicker: "Service snapshot",
      headline: "How this offering shows up on roadmaps",
      tiles: [
        { label: "Model routing", sub: "Pick models for quality, latency, and price — with fallbacks when providers brown out." },
        { label: "Guardrails", sub: "Structured outputs, moderation, and human review for high-stakes paths." },
        { label: "Evaluation", sub: "Small golden sets so you see regressions before users do." },
        { label: "Cost visibility", sub: "Token budgets, caching, and tracing hooks your finance team can read." },
      ],
    },
    why: [
      { title: "Product shipping habits", text: "We integrate AI into your existing app surfaces — not isolated Jupyter-style experiments." },
      { title: "Security-minded defaults", text: "PII boundaries and retention choices are explicit before we touch production data." },
      { title: "Plain-language milestones", text: "Written phases with demos — easier for legal and procurement reviewers." },
      { title: "Provider flexibility", text: "OpenAI, Anthropic, Google, or open weights — matched to your constraints, not our favorite logo." },
    ],
    howPhases: [
      {
        title: "Discovery & scope",
        weeks: "1–2 wks",
        body: "Outcomes, data access, channels, and risk — you receive a phased quote with assumed hours, not a vague roadmap.",
      },
      {
        title: "Vertical slice",
        weeks: "1–3 wks",
        body: "One real workflow on real data proves the model choice and UX before a wide build.",
      },
      {
        title: "Production build",
        weeks: "3–10 wks",
        body: "Auth, monitoring, and rollout — depth scales with integrations and compliance.",
      },
      {
        title: "Handoff & tuning",
        weeks: "Ongoing optional",
        body: "Runbooks, prompt/config ownership, and optional retainer for drift and model upgrades.",
      },
    ],
    priceRows: [
      { phase: "Discovery & written plan", includes: "Brief workshops, integration map, acceptance criteria, assumed fee table", timeline: "1–2 wks", fromPrice: "~$2.5k–$6k" },
      { phase: "MVP AI feature", includes: "One shipped workflow: API, UI, staging, basic eval hooks", timeline: "4–8 wks", fromPrice: "~$12k–$45k" },
      { phase: "Multi-workflow / agents", includes: "Tooling, audits, expanded channels, stronger eval & monitoring", timeline: "8–16+ wks", fromPrice: "~$45k–$120k+" },
    ],
    priceFootnote: DEFAULT_PRICE_FOOTNOTE,
    deliveryHeading: "Typical deliverables in an AI development engagement",
    deliveryLead: "Exact outputs depend on your stack — below is what procurement and eng leads usually expect in statements of work.",
    deliveryTags: [
      "Backend routes & feature flags for model calls",
      "Admin toggles for models, temperature, and limits",
      "Logging/tracing dashboards or exports",
      "Unit + integration tests on critical paths",
      "Staging checklist and rollback notes",
      "Short Loom or written handoff for your team",
    ],
    relatedSlugs: ["ai-agents", "rag-llm", "chatbots", "voice-ai"],
    roiFit: {
      title: "When custom AI development pays off (and when it does not)",
      intro:
        "If you are comparing vendors, these patterns keep SEO honest and set expectations — we would rather decline than ship the wrong category of project.",
      worksWell: [
        "High-volume tasks with light judgment: triage, drafting with review, classification, and summarization.",
        "Surfacing answers from docs or tickets where citations matter.",
        "Internal copilots that accelerate staff instead of replacing policy decisions.",
      ],
      proceedCarefully: [
        "Fully replacing licensed professionals without human oversight.",
        "“AI transformation” with no concrete workflow — scope needs a named task and owner.",
        "Buying before data access is settled — we pause until we can test on real inputs.",
      ],
    },
    faq: [
      {
        q: "Do you only use OpenAI?",
        a: "No. We integrate OpenAI, Anthropic (Claude), Google Gemini, and open models where hosting and licensing fit. The choice is driven by quality, latency, and your risk posture.",
      },
      {
        q: "How is this priced versus hiring in-house?",
        a: "You pay for defined milestones and artifacts instead of a long salary runway. Complex agent or compliance work moves bands upward; a narrow API integration moves them down.",
      },
      {
        q: "What do you need from us to start?",
        a: "A stakeholder who can approve scope, access to representative data under NDA, and clarity on which systems the AI may call. Without those, discovery stalls.",
      },
      {
        q: "Can you work inside our VPC or private cloud?",
        a: "Often yes, but it changes timeline and cost. We flag that in discovery so security reviews do not surprise the budget late.",
      },
    ],
  },

  "ai-agents": {
    slug: "ai-agents",
    practiceId: "ai",
    metaTitle: "AI agent development — tool use, workflows & MCP | BalochDev",
    description:
      "BalochDev builds AI agents that call your APIs, respect permissions, and escalate to humans — with audit trails and assumed pricing for discovery, slice, and production.",
    keywords: [
      "AI agent development company",
      "build AI agents for business",
      "LLM agent tool use",
      "MCP AI integration",
      "autonomous workflow agent",
      "AI agent cost estimate",
      "agentic systems development",
      "BalochDev agents",
    ],
    heroLead:
      "Agents that take real actions in your stack — with least-privilege credentials, human approval on risky writes, and traces you can replay when something looks wrong.",
    seoTitle: "AI agent development explained for buyers comparing agencies",
    seoBody:
      "People search AI agent development when they want software that plans steps, calls tools, and finishes tasks. We scope whether you need a single-purpose agent (support refunds, sales research) or orchestration across many tools — each has different failure modes. Our pages stay close to how we actually build: explicit tool contracts, retries, and kill switches, because that is what makes agents trustworthy in production.",
    introPanel: {
      kicker: "Service snapshot",
      headline: "What we ship under “agent” scope",
      tiles: [
        { label: "Tool contracts", sub: "JSON schemas or OpenAPI-aligned calls — no mystery prompts hitting raw SQL." },
        { label: "Human gates", sub: "Approvals before refunds, emails, or large purchases." },
        { label: "Tracing", sub: "Step logs and replay so ops can debug without reading model prose." },
        { label: "Policies", sub: "Rate limits, allow-lists, and separation of dev/prod keys." },
      ],
    },
    why: [
      { title: "Least privilege by default", text: "Agents get the smallest credential scope that still completes the job." },
      { title: "Operational clarity", text: "Dashboards or exports for failures, not only “the model said no.”" },
      { title: "Incremental rollout", text: "Read-only phases before write-capable automation." },
      { title: "Honest feasibility", text: "If your data or APIs are not ready, we say so in discovery." },
    ],
    howPhases: [
      { title: "Task graph workshop", weeks: "3–7 days", body: "Name the happy path, edge cases, and who approves exceptions." },
      { title: "Read-only agent slice", weeks: "1–2 wks", body: "Tool calls that do not mutate state — validates planning quality." },
      { title: "Write paths + guards", weeks: "2–6 wks", body: "Idempotency, confirmations, and audit trails for mutations." },
      { title: "Hardening + playbooks", weeks: "1–3 wks", body: "Runbooks for support and on-call expectations." },
    ],
    priceRows: [
      { phase: "Agent discovery", includes: "Task map, tool inventory, risk register, pricing bands", timeline: "1 wk", fromPrice: "~$3k–$8k" },
      { phase: "Single-domain agent MVP", includes: "2–4 tools, tracing, staging, human escalation", timeline: "4–8 wks", fromPrice: "~$18k–$55k" },
      { phase: "Multi-tool / regulated", includes: "Stronger audits, SSO, segregation, extended testing", timeline: "10–18+ wks", fromPrice: "~$55k–$140k+" },
    ],
    priceFootnote: DEFAULT_PRICE_FOOTNOTE,
    deliveryHeading: "Deliverables common in agent projects",
    deliveryLead: "Agents fail in ops, not demos — documentation and tracing are first-class.",
    deliveryTags: [
      "Tool/router code with tests",
      "Prompt + policy configuration repo",
      "Trace export or lightweight admin UI",
      "Deployment notes and env templates",
      "Incident response outline",
      "Training notes for internal admins",
    ],
    relatedSlugs: ["ai-development", "rag-llm", "workflow-automation", "api-integrations"],
    roiFit: {
      title: "When AI agents are the right tool",
      intro: "Agents help when tasks have repeatable steps but need judgment between steps — not when a simple API script suffices.",
      worksWell: [
        "Internal ops: filing tickets, drafting replies, fetching records across 2–3 systems with checks.",
        "Research or prep workflows where human polish happens at the end.",
        "Sales/support copilots that propose actions but wait for approval.",
      ],
      proceedCarefully: [
        "Unbounded internet browsing with brand risk.",
        "Fully autonomous financial transactions without dual control.",
        "Teams with no owner for prompt/policy changes — agents need governance.",
      ],
    },
    faq: [
      { q: "Is this the same as RAG?", a: "RAG improves grounding; agents decide which tools to call and in what order. Many projects use both." },
      { q: "What stacks do you integrate?", a: "REST/GraphQL APIs, webhooks, CRMs, Supabase/Postgres, telephony, and common SaaS — we document assumptions per tool." },
      { q: "How do you test agents?", a: "Scenario sets plus replay traces; risky tools get contract tests like any backend service." },
      { q: "Can agents run on a schedule?", a: "Yes — batch and event-driven runners are common; pricing reflects monitoring and alert coverage." },
    ],
  },

  "rag-llm": {
    slug: "rag-llm",
    practiceId: "ai",
    metaTitle: "RAG & LLM development — pgvector, citations & enterprise search | BalochDev",
    description:
      "RAG and LLM implementation with permission-aware retrieval, hybrid search, and Supabase/pgvector-friendly patterns — clear timelines and pricing bands from BalochDev.",
    keywords: [
      "RAG development services",
      "LLM retrieval augmented generation",
      "pgvector RAG developers",
      "enterprise ChatGPT search",
      "hybrid vector search",
      "document AI citations",
      "RAG vs fine tuning",
      "BalochDev RAG",
    ],
    heroLead:
      "Retrieval that respects who can see what: chunking, embeddings, citations, and filters in one query — so support and sales answers trace to real sources.",
    seoTitle: "RAG & LLM development for teams comparing vendors",
    seoBody:
      "Searchers often compare RAG versus fine-tuning. Most production knowledge assistants start with RAG plus good chunking and metadata filters. We explain ingestion, re-ranking options, and evaluation so SEO pages match the questions CTOs actually ask. If your content is messy or permissions are complex, we surface that in discovery — it affects cost more than model choice.",
    introPanel: {
      kicker: "Service snapshot",
      headline: "Retrieval architecture we stand behind",
      tiles: [
        { label: "Chunking & metadata", sub: "Structure-aware splits and tags for filtering by product, region, or role." },
        { label: "Hybrid search", sub: "Keyword + vector where either alone would miss recall." },
        { label: "Citations", sub: "Answers point to filenames, URLs, or ticket IDs users can verify." },
        { label: "Drift checks", sub: "Scheduled re-embeds when docs change materially." },
      ],
    },
    why: [
      { title: "Permission-aware", text: "We mirror your access model — not a flat corpus if your org is not flat." },
      { title: "Measurable quality", text: "Starter evaluation sets so updates do not silently degrade answers." },
      { title: "Stack fit", text: "Postgres + pgvector, managed vector DBs, or Cloud edge patterns — chosen for your ops." },
      { title: "Cost-aware pipelines", text: "Batch embeddings and caching so monthly bills stay predictable." },
    ],
    howPhases: [
      { title: "Source audit", weeks: "3–10 days", body: "Where content lives, refresh cadence, and legal retention rules." },
      { title: "Ingestion MVP", weeks: "1–3 wks", body: "Pipeline for a representative slice with filters and citations." },
      { title: "Product integration", weeks: "2–8 wks", body: "UI, auth, analytics, and rate limits in your app." },
      { title: "Tune & expand", weeks: "Iterative", body: "Re-rankers, synonyms, admin tools, and new sources." },
    ],
    priceRows: [
      { phase: "RAG discovery", includes: "Corpus map, permission model sketch, eval plan", timeline: "1 wk", fromPrice: "~$2.5k–$7k" },
      { phase: "MVP RAG assistant", includes: "Ingestion, hybrid search API, chat UI or widget, basic eval", timeline: "4–8 wks", fromPrice: "~$15k–$48k" },
      { phase: "Enterprise RAG", includes: "SSO, multi-tenant filters, SLAs, monitoring, expanded corpora", timeline: "8–16+ wks", fromPrice: "~$48k–$120k+" },
    ],
    priceFootnote: DEFAULT_PRICE_FOOTNOTE,
    deliveryHeading: "What “done” looks like on a RAG program",
    deliveryLead: "Buyers should know which artifacts they receive — not just “a chatbot.”",
    deliveryTags: [
      "Ingestion jobs or streaming connectors",
      "Vector + metadata schema",
      "Query API with logging",
      "Admin screen or scripts for reindex",
      "Evaluation spreadsheet or notebook + pass criteria",
      "Deployment guide for your infra",
    ],
    relatedSlugs: ["ai-development", "chatbots", "ai-agents", "voice-ai"],
    roiFit: {
      title: "When RAG is the right LLM pattern",
      intro: "RAG fits when answers must cite internal knowledge that changes often.",
      worksWell: [
        "Support deflection with links to policy and ticketing context.",
        "Sales enablement across brochures, decks, and win/loss notes.",
        "Internal research assistants for engineers reading long specs.",
      ],
      proceedCarefully: [
        "If there is no authoritative source — models will invent plausible structure.",
        "If permissions are undefined, delaying RAG is cheaper than leaking data.",
      ],
    },
    faq: [
      { q: "pgvector or a dedicated vector database?", a: "Often pgvector when you already run Postgres — simpler ops and joins. Dedicated DBs help at very large scale; we model trade-offs in discovery." },
      { q: "Do we need fine-tuning?", a: "Sometimes for tone or domain phrasing — but most teams win first with better chunks, filters, and eval." },
      { q: "Can users upload files?", a: "Yes with virus scanning, quotas, and per-tenant isolation — each adds scope." },
      { q: "How fast is retrieval?", a: "We target p95 latency budgets per channel; voice and web differ." },
    ],
  },

  chatbots: {
    slug: "chatbots",
    practiceId: "ai",
    metaTitle: "AI chatbot development — web, CRM & omnichannel | BalochDev",
    description:
      "Conversational AI and chatbots for lead capture, support, and onboarding — channel integrations, CRM hooks, and assumed pricing from BalochDev.",
    keywords: [
      "AI chatbot development company",
      "custom chatbot for website",
      "customer support chatbot integration",
      "WhatsApp business chatbot AI",
      "HubSpot chatbot integration",
      "Zendesk AI chatbot",
      "lead qualification chatbot",
      "BalochDev chatbot",
    ],
    heroLead:
      "Chat experiences that match your brand voice, hand off to humans cleanly, and log outcomes in your CRM or helpdesk — not generic widgets bolted on at the end.",
    seoTitle: "AI chatbot development for marketing and support leaders",
    seoBody:
      "People search chatbots when they want 24/7 capture or deflection. We separate marketing bots (qualify, book) from support bots (triage, knowledge). SEO copy here reflects that split because pricing and guardrails differ. Integrations — HubSpot, Salesforce, Zendesk, WhatsApp — are spelled out in scope so you are not billed for “we will figure it out later.”",
    introPanel: {
      kicker: "Service snapshot",
      headline: "How we scope chatbot work",
      tiles: [
        { label: "Channel fit", sub: "Web, mobile, WhatsApp, Slack — latency and UX differ per surface." },
        { label: "Handoff", sub: "Seamless human takeover with transcript context." },
        { label: "Grounding option", sub: "FAQ-only, RAG, or hybrid depending on ticket volume and risk." },
        { label: "Analytics", sub: "Funnel events your marketing team can read." },
      ],
    },
    why: [
      { title: "Brand-safe tone", text: "Style guides and blocked-topic lists where you need them." },
      { title: "Operational wiring", text: "Tickets, tags, and SLAs respected — bots are part of ops, not side projects." },
      { title: "Modular expansion", text: "Start with one locale or one product line, then widen." },
      { title: "Transparent limits", text: "We document when the bot must stop and defer to staff." },
    ],
    howPhases: [
      { title: "Use-case workshop", weeks: "3–7 days", body: "Scenarios, languages, and escalation paths." },
      { title: "Conversational MVP", weeks: "2–4 wks", body: "Single channel, core flows, staging review." },
      { title: "Integrations", weeks: "2–6 wks", body: "CRM/helpdesk + optional RAG corpus." },
      { title: "Launch + tuning", weeks: "1–3 wks", body: "Monitoring scripts and weekly review cadence optional." },
    ],
    priceRows: [
      { phase: "Chatbot discovery", includes: "Flow map, channel pick, integration list", timeline: "3–7 days", fromPrice: "~$2k–$5k" },
      { phase: "MVP bot", includes: "1–2 channels, core intents, analytics hooks", timeline: "3–6 wks", fromPrice: "~$10k–$35k" },
      { phase: "Omnichannel + RAG", includes: "Multi-channel, retrieval, SSO, heavier moderation", timeline: "6–14 wks", fromPrice: "~$35k–$90k+" },
    ],
    priceFootnote: DEFAULT_PRICE_FOOTNOTE,
    deliveryHeading: "Artifacts teams expect in chatbot engagements",
    deliveryLead: "Marketing wants attribution; support wants deflection metrics — we build both when requested.",
    deliveryTags: [
      "Hosted widget or API for your frontend",
      "Intent/flow configuration or code",
      "CRM / helpdesk mapping document",
      "Moderation and escalation rules",
      "Basic dashboard or event export",
      "Launch checklist and owner roster",
    ],
    relatedSlugs: ["voice-ai", "rag-llm", "ai-development", "workflow-automation"],
    roiFit: {
      title: "When a custom chatbot beats a off-the-shelf widget",
      intro: "Buy off-the-shelf for generic FAQ. Build custom when integrations, languages, or grounded answers matter.",
      worksWell: [
        "High-intent pages that need qualification before a call.",
        "Support queues where 30–50% questions repeat with documented answers.",
        "Regional go-to-market needing localized flows.",
      ],
      proceedCarefully: [
        "No knowledge source and expectation of zero hallucinations.",
        "Channels without owner staffing — bots amplify silence too.",
      ],
    },
    faq: [
      { q: "Do you build voice and chat together?", a: "Often as separate phases — latency and telephony compliance add work. See our Voice AI service for telephony-specific scope." },
      { q: "Which CRMs?", a: "Common REST providers; we confirm field mapping in writing during discovery." },
      { q: "Languages?", a: "Yes, with translation budget and evaluation per locale." },
      { q: "Content updates?", a: "Managed via CMS, help center sync, or re-ingest jobs depending on architecture." },
    ],
  },

  "voice-ai": {
    slug: "voice-ai",
    practiceId: "ai",
    metaTitle: "Voice AI development — telephony, STT/TTS & call flows | BalochDev",
    description:
      "Voice agents and IVR-style AI with real telephony constraints: Twilio-class providers, latency-aware prompts, logging — scoped with BalochDev pricing bands.",
    keywords: [
      "voice AI development agency",
      "AI phone agent Twilio",
      "STT TTS voice bot",
      "inbound voice assistant",
      "outbound AI calling compliance",
      "real-time voice LLM latency",
      "call center AI integration",
      "BalochDev voice AI",
    ],
    heroLead:
      "Voice stacks where milliseconds matter: turn-taking, barge-in, handoff to humans, and CRM notes that survive audit — not text bots read aloud.",
    seoTitle: "Voice AI services explained for operations teams",
    seoBody:
      "Voice AI searches often mix consumer assistants with business telephony. We focus on operational calls: consent cues, recording rules, failover to human reps, and provider redundancy. Pages like this exist so SEO captures long-tail comparisons (latency, cost per minute, integration depth) that generic “AI agency” copy skips.",
    introPanel: {
      kicker: "Service snapshot",
      headline: "Telephony-first design choices",
      tiles: [
        { label: "Latency budget", sub: "Model + codec + region choices to keep conversations natural." },
        { label: "Compliance hooks", sub: "Recording disclosures and retention aligned to your legal review." },
        { label: "Human bridge", sub: "Warm transfer with context blob, not a cold redirect." },
        { label: "Analytics", sub: "Call outcomes mapped to your CRM fields." },
      ],
    },
    why: [
      { title: "Ops realism", text: "We prototype on staging numbers before customer traffic." },
      { title: "Provider fit", text: "STT/TTS/vendors matched to accent coverage and budget." },
      { title: "Failure design", text: "Busy signals, retries, and spoken apologies that are scripted." },
      { title: "Documentation", text: "Runbooks your night shift can follow." },
    ],
    howPhases: [
      { title: "Call scenario design", weeks: "3–10 days", body: "Scripts, disclosures, data capture, CRM targets." },
      { title: "PSTN prototype", weeks: "1–3 wks", body: "Staging numbers, basic STT/LLM/TTS loop." },
      { title: "Hardening", weeks: "2–6 wks", body: "Edge cases, monitoring, load assumptions." },
      { title: "Pilot & iterate", weeks: "Ongoing", body: "Gradual traffic ramps with weekly reviews." },
    ],
    priceRows: [
      { phase: "Voice discovery", includes: "Provider shortlist, latency note, compliance checklist", timeline: "1 wk", fromPrice: "~$3k–$8k" },
      { phase: "Pilot line", includes: "Single flow, CRM note, basic dashboards", timeline: "4–8 wks", fromPrice: "~$18k–$52k" },
      { phase: "Scaled program", includes: "Multi-flow, redundancy, richer analytics, after-hours coverage patterns", timeline: "8–16+ wks", fromPrice: "~$52k–$130k+" },
    ],
    priceFootnote: DEFAULT_PRICE_FOOTNOTE,
    deliveryHeading: "Delivery package for voice programs",
    deliveryLead: "We align telephony, model, and app layers — each owned in the statement of work.",
    deliveryTags: [
      "Call flow definition + version control",
      "Integration with CRM or ticketing",
      "Observability on drop-offs and errors",
      "Load/region notes for your carrier setup",
      "Disaster recovery: human failover path",
      "Training deck for supervisors",
    ],
    relatedSlugs: ["chatbots", "ai-agents", "workflow-automation", "api-integrations"],
    roiFit: {
      title: "When voice AI is worth the complexity",
      intro: "Voice shines for high-urgency interactions where typing is friction — but telephony adds compliance and latency work.",
      worksWell: [
        "Appointment confirmations and reschedules with structured outcomes.",
        "Tier-1 triage with clear scripts and fast human escalation.",
        "Outbound reminders where consent and quiet hours are already handled.",
      ],
      proceedCarefully: [
        "Heavily regulated advice without counsel-approved scripts.",
        "Extremely low-margin campaigns where per-minute AI cost dominates.",
      ],
    },
    faq: [
      { q: "Twilio only?", a: "Twilio-class providers are common; we evaluate SIP trunk partners already on your account." },
      { q: "Languages and accents?", a: "We test STT on real samples — marketing claims differ from warehouse floor audio." },
      { q: "Do you handle PCI?", a: "We design DTMF or tokenized flows; raw card data in the LLM path is avoided." },
      { q: "Model choice?", a: "Real-time often uses faster models with tighter prompts; we benchmark before launch." },
    ],
  },

  web: {
    slug: "web",
    practiceId: "build",
    metaTitle: "Web development — Next.js, React, SEO & Cloudflare-ready | BalochDev",
    description:
      "Performance-minded web development with Next.js, React, and solid SEO foundations — milestones, hosting notes, and assumed budgets from BalochDev.",
    keywords: [
      "Next.js development agency",
      "React web development company",
      "SEO friendly web development",
      "Core Web Vitals optimization",
      "Cloudflare Next.js deployment",
      "marketing site development",
      "web app development cost",
      "BalochDev web development",
    ],
    heroLead:
      "Sites and apps that load fast, rank honestly, and deploy without mystery — from marketing pages to authenticated dashboards.",
    seoTitle: "Web development services with clear technical scope",
    seoBody:
      "Buyers compare web agencies on stack, SEO, and maintainability. We articulate SSR/ISR choices, structured data, and analytics so your page content matches the engineering plan. If you need a pure CMS marketing site versus a product shell, we separate scopes — it affects both price and timeline.",
    introPanel: {
      kicker: "Service snapshot",
      headline: "What “web” covers here",
      tiles: [
        { label: "Rendering plan", sub: "Server, edge, or static — chosen per page type, not vibes." },
        { label: "SEO baseline", sub: "Metadata, sitemaps, and perf budgets your marketing team can track." },
        { label: "Design handoff", sub: "Figma → components with tokens that engineering keeps." },
        { label: "Observability", sub: "Error reporting and basic RUM hooks where you want them." },
      ],
    },
    why: [
      { title: "Editorial speed", text: "Component libraries so marketing iterations do not break layout." },
      { title: "Security headers", text: "Sensible defaults discussed early, not bolted on post-launch." },
      { title: "Deploy clarity", text: "We document environments and who can promote builds." },
      { title: "Honest hosting fit", text: "Vercel, Cloudflare, Node hosts — matched to your compliance and traffic." },
    ],
    howPhases: [
      { title: "IA + tech plan", weeks: "3–10 days", body: "Sitemap, auth needs, integrations, and performance goals." },
      { title: "UI build", weeks: "2–6 wks", body: "Key templates, design system alignment, CMS wiring if any." },
      { title: "App features", weeks: "2–10 wks", body: "Auth, dashboards, or APIs — depending on product scope." },
      { title: "Launch + hardening", weeks: "1–3 wks", body: "Checklists, redirects, analytics QA." },
    ],
    priceRows: [
      { phase: "Planning sprint", includes: "Architecture note, milestone table, hosting recommendation", timeline: "1 wk", fromPrice: "~$2.5k–$7k" },
      { phase: "Marketing site / lead site", includes: "5–12 templates, CMS, SEO baseline, forms", timeline: "4–8 wks", fromPrice: "~$12k–$45k" },
      { phase: "Product web app", includes: "Auth, roles, data dashboards, integrations", timeline: "8–18+ wks", fromPrice: "~$45k–$120k+" },
    ],
    priceFootnote: DEFAULT_PRICE_FOOTNOTE,
    deliveryHeading: "Web delivery checklist themes",
    deliveryLead: "We mirror how strong agencies package handoffs — repo, docs, and environment parity.",
    deliveryTags: [
      "Code repo with README",
      "CI pipeline or documented build steps",
      "Environment variable template",
      "Analytics + SEO verification steps",
      "404/redirect matrix",
      "Ownership map for DNS and domains",
    ],
    relatedSlugs: ["saas-development", "mvp-development", "ecommerce", "ux-ui"],
    faq: [
      { q: "Next.js only?", a: "It is our default for SEO + React velocity, but we evaluate Astro or SPA shells when fit is better." },
      { q: "Do you write copy?", a: "We can partner with your writer or recommend structured outlines — copy scope is separate unless contracted." },
      { q: "Ongoing maintenance?", a: "Yes — see Maintenance & support or retainer blocks in your proposal." },
      { q: "Accessibility?", a: "WCAG-oriented component patterns by default; formal audits can be added." },
    ],
  },

  "android-app-development": {
    slug: "android-app-development",
    practiceId: "build",
    metaTitle: "Android app development — Kotlin, Play-ready releases | BalochDev",
    description:
      "Android application development for business and consumer use cases: Material UI, offline patterns, notifications, API integration — with BalochDev pricing bands.",
    keywords: [
      "Android app development company",
      "hire Android developers MVP",
      "Kotlin Android app agency",
      "enterprise Android application",
      "Android app development cost",
      "Firebase Android integration",
      "Play Store release support",
      "BalochDev Android",
    ],
    heroLead:
      "Android builds that feel native where it matters: sensible navigation, notification discipline, and APIs that fail gracefully on flaky networks.",
    seoTitle: "Android development services for product owners",
    seoBody:
      "Android app development searches mix consumer MVPs with internal field tools. We clarify device targets (phone, tablet, kiosk), offline needs, and MDM context early — those choices swing estimates more than “number of screens.” SEO wording here targets buyers comparing agencies on release discipline, not just UI mockups.",
    introPanel: {
      kicker: "Service snapshot",
      headline: "Android scope we actually estimate",
      tiles: [
        { label: "API contract", sub: "Versioned endpoints, auth, and error semantics before UI polish." },
        { label: "Release train", sub: "Internal tracks, staged rollout, crash dashboards." },
        { label: "Material patterns", sub: "Expectations for navigation, theming, and accessibility." },
        { label: "Device matrix", sub: "OS floor, manufacturers if relevant, and size classes." },
      ],
    },
    why: [
      { title: "Store-ready releases", text: "Play policies, signing, and update strategy spelled out." },
      { title: "Realistic offline design", text: "Queues, retries, and user messaging when sync is delayed." },
      { title: "Integration clarity", text: "Push, maps, payments — each is a line item in scope." },
      { title: "Handoff readability", text: "Gradle modules and docs another team can inherit." },
    ],
    howPhases: [
      { title: "Product & API alignment", weeks: "3–10 days", body: "Stories, auth flows, and backend readiness." },
      { title: "MVP build", weeks: "4–10 wks", body: "Core journeys, analytics, internal testing." },
      { title: "Beta & polish", weeks: "2–5 wks", body: "Crash fixes, performance passes, Play review prep." },
      { title: "Post-launch", weeks: "Optional retainer", body: "Bug SLAs, small features, OS migration support." },
    ],
    priceRows: [
      { phase: "Mobile discovery", includes: "Wire-level scope, integration list, store assumptions", timeline: "1 wk", fromPrice: "~$2.5k–$6k" },
      { phase: "Single-role Android MVP", includes: "Auth, core flows, push optional, release pipeline", timeline: "6–12 wks", fromPrice: "~$20k–$58k" },
      { phase: "Multi-module / offline-heavy", includes: "Sync engine, kiosk/MDM notes, broader QA", timeline: "12–22+ wks", fromPrice: "~$58k–$140k+" },
    ],
    priceFootnote: DEFAULT_PRICE_FOOTNOTE,
    deliveryHeading: "Android delivery artifacts",
    deliveryLead: "Buying mobile means buying releases — artifacts reflect that.",
    deliveryTags: [
      "Source repo + build instructions",
      "Keystore handling guide (never committed secrets)",
      "Firebase/project configs as applicable",
      "Crash + analytics wiring",
      "Release checklist for Play Console",
      "Known issues log at handoff",
    ],
    relatedSlugs: ["mvp-development", "web", "saas-development", "ux-ui"],
    faq: [
      { q: "Kotlin or Flutter?", a: "This service is native-leaning Kotlin/Android. If you want cross-platform, we discuss Flutter separately — different staffing." },
      { q: "Backend included?", a: "We can build APIs or integrate yours; estimates split build vs integration clearly." },
      { q: "MDM / kiosk?", a: "Supported when requirements are explicit — device owner modes change test plans." },
      { q: "Maintenance?", a: "Android OS upgrades and dependency bumps benefit from retainers — see Maintenance & support." },
    ],
  },

  "saas-development": {
    slug: "saas-development",
    practiceId: "build",
    metaTitle: "SaaS product development — multi-tenant, billing & admin | BalochDev",
    description:
      "B2B SaaS builds: auth, roles, billing hooks, admin tooling, and observability — scoped milestones and assumed pricing from BalochDev.",
    keywords: [
      "SaaS development company",
      "B2B SaaS MVP development",
      "Stripe subscription integration developers",
      "multi-tenant SaaS architecture",
      "SaaS admin dashboard development",
      "SaaS product development cost",
      "Supabase SaaS",
      "BalochDev SaaS",
    ],
    heroLead:
      "Tenant boundaries, billing alignment, and admin transparency from early sprints — so you are not retrofitting multi-tenancy after launch.",
    seoTitle: "SaaS development services with honest architecture commentary",
    seoBody:
      "People searching SaaS development need more than a login screen. We document tenant model (row-level, schema, or hybrid), billing events, and audit trails that enterprise buyers ask about in diligence. SEO copy references those decision points because they match high-intent queries (Stripe webhooks, org roles, SSO later).",
    introPanel: {
      kicker: "Service snapshot",
      headline: "SaaS pillars in proposals",
      tiles: [
        { label: "Tenancy model", sub: "How data isolates per customer — with migration risks called out." },
        { label: "Billing events", sub: "Webhooks, proration, and audit-friendly subscription state." },
        { label: "Admin & support", sub: "Impersonation, exports, and safe operational tools." },
        { label: "Observability", sub: "Metrics that explain usage, not only uptime pings." },
      ],
    },
    why: [
      { title: "Reduce rework", text: "Billing and roles designed before hundreds of screens exist." },
      { title: "Security posture", text: "Least privilege defaults for admin and automation tokens." },
      { title: "Upgrade paths", text: "Feature flags and migration scripts as first-class tasks." },
      { title: "Commercial realism", text: "We connect engineering scope to pricing tiers you can sell." },
    ],
    howPhases: [
      { title: "Domain modeling", weeks: "1–2 wks", body: "Entities, roles, billing assumptions, integration map." },
      { title: "Foundation sprint", weeks: "2–4 wks", body: "Auth, tenancy enforcement, skeleton admin." },
      { title: "Core product", weeks: "4–12 wks", body: "Differentiating workflows, dashboards, APIs." },
      { title: "Hardening", weeks: "2–6 wks", body: "Backups, alerting, pen-test fixes, launch checklist." },
    ],
    priceRows: [
      { phase: "SaaS discovery", includes: "Tenancy + billing narrative, milestone quote", timeline: "1–2 wks", fromPrice: "~$4k–$12k" },
      { phase: "MVP SaaS", includes: "Auth, roles, core workflow, Stripe-style billing hook, admin basics", timeline: "10–16 wks", fromPrice: "~$55k–$130k" },
      { phase: "Growth SaaS", includes: "SSO, usage-based billing, deeper integrations, SLA features", timeline: "16–30+ wks", fromPrice: "~$130k–$280k+" },
    ],
    priceFootnote: DEFAULT_PRICE_FOOTNOTE,
    deliveryHeading: "SaaS deliverables you can diligence",
    deliveryLead: "Enterprise pilots ask for specifics — we build the list alongside you.",
    deliveryTags: [
      "Tenant isolation tests",
      "Billing webhook handling + replay strategy",
      "Admin audit logs",
      "DR backup notes",
      "Incident response cheat sheet",
      "Data export / GDPR-oriented tooling where scoped",
    ],
    relatedSlugs: ["web", "api-integrations", "ux-ui", "maintenance-support"],
    faq: [
      { q: "Stripe only?", a: "Stripe is common; Paddle or custom invoicing changes webhook work — scoped explicitly." },
      { q: "Can you inherit a codebase?", a: "Yes after a short audit sprint priced separately — surprises become line items, not surprises." },
      { q: "SSO day one?", a: "Often phase two unless enterprise deals are already signed — SAML work has real test cost." },
      { q: "Mobile apps?", a: "Possible via API sharing; mobile scopes are quoted as their own track." },
    ],
  },

  "mvp-development": {
    slug: "mvp-development",
    practiceId: "build",
    metaTitle: "MVP development — scoped first release & validation | BalochDev",
    description:
      "MVP builds that cut scope deliberately: one core loop, staging, analytics, and handoff — with transparent assumed pricing from BalochDev.",
    keywords: [
      "MVP development agency",
      "startup MVP cost",
      "lean product development",
      "MVP scope workshop",
      "validate product idea development",
      "2 month MVP timeline",
      "MVP web app",
      "BalochDev MVP",
    ],
    heroLead:
      "An MVP should embarrass you a little on polish, not on ethics or architecture — we target the smallest release that still teaches you something true about users.",
    seoTitle: "MVP development without overbuilding or under-shipping",
    seoBody:
      "MVP searches come from founders comparing timelines and burn. We document what is explicitly out of scope, what metrics prove success, and what tech debt is acceptable for phase one. SEO language here mirrors common founder questions so pages rank for intent-heavy phrases, not buzzwords alone.",
    introPanel: {
      kicker: "Service snapshot",
      headline: "How we protect MVPs from scope creep",
      tiles: [
        { label: "One hero loop", sub: "The single journey that validates pricing or retention." },
        { label: "Cuts list", sub: "Written deferrals product agrees to — protects timeline." },
        { label: "Instrumentation", sub: "Minimum analytics to learn, not a data lake." },
        { label: "Handoff option", sub: "Docs for an internal hire if you graduate the build." },
      ],
    },
    why: [
      { title: "Speed with guardrails", text: "Fast does not mean silent on security basics." },
      { title: "Stakeholder alignment", text: "Weekly demos and a shared board — fewer “surprise” requests." },
      { title: "Pricing honesty", text: "If the idea needs a much bigger foundation, we say so early." },
      { title: "Path to v1", text: "Architecture that can grow without full rewrite — within budget." },
    ],
    howPhases: [
      { title: "Scope duel", weeks: "3–7 days", body: "Pick the one loop; kill the rest for now." },
      { title: "Build sprint", weeks: "3–8 wks", body: "Core UX, backend, minimal admin if needed." },
      { title: "Beta window", weeks: "1–3 wks", body: "Feedback, bug burn-down, copy tweaks." },
      { title: "Learn & plan v1", weeks: "Workshop", body: "Metrics readout and next-phase estimate." },
    ],
    priceRows: [
      { phase: "MVP workshop", includes: "Loop definition, risk list, quote", timeline: "3–7 days", fromPrice: "~$1.5k–$4k" },
      { phase: "Focused MVP", includes: "Web or mobile slice, auth optional, analytics", timeline: "4–10 wks", fromPrice: "~$18k–$55k" },
      { phase: "MVP+", includes: "Extra integrations, light compliance, polish pass", timeline: "8–14 wks", fromPrice: "~$55k–$95k" },
    ],
    priceFootnote: DEFAULT_PRICE_FOOTNOTE,
    deliveryHeading: "What you receive at MVP handoff",
    deliveryLead: "MVPs still deserve a runway story for whoever codes next.",
    deliveryTags: [
      "Deployed staging + production",
      "Issue tracker snapshot",
      "README + local setup",
      "Metrics definitions doc",
      "Post-mortem on cuts and debt",
      "Optional Loom walkthrough",
    ],
    relatedSlugs: ["web", "no-code-custom-code", "ux-ui", "android-app-development"],
    faq: [
      { q: "Fixed price?", a: "We often fixed-price MVPs after a paid discovery when scope is stable — otherwise time-and-materials with caps." },
      { q: "Equity instead of cash?", a: "Rarely — cash + clear IP assignment keeps both sides safer." },
      { q: "Design included?", a: "Light UX is typical; full brand systems route to Branding / UX services." },
      { q: "After MVP?", a: "Many clients roll into SaaS or Web scopes — we sequence phases instead of vague retainers." },
    ],
  },

  "no-code-custom-code": {
    slug: "no-code-custom-code",
    practiceId: "build",
    metaTitle: "No-code + custom code — Webflow, Bubble & escape hatches | BalochDev",
    description:
      "Hybrid builds: Webflow, Bubble, or similar for speed, plus custom APIs and scripts where templates stop — migration-friendly patterns from BalochDev.",
    keywords: [
      "Webflow custom code developer",
      "Bubble.io agency custom API",
      "no code with custom backend",
      "when to leave Webflow for code",
      "no code MVP with integrations",
      "low code automation bridge",
      "BalochDev no code",
    ],
    heroLead:
      "Ship fast in visual builders, then harden with real services — without painting yourself into a corner when you outgrow the template.",
    seoTitle: "No-code plus custom code: how we blend speed and flexibility",
    seoBody:
      "Buyers search comparisons like Webflow vs custom builds. We document exportability, where Bubble or Webflow ends, and what inevitably moves to Node/Python workers. SEO sections name those trade-offs because they match how serious founders research — not generic ‘we do everything’ claims.",
    introPanel: {
      kicker: "Service snapshot",
      headline: "Hybrid guardrails",
      tiles: [
        { label: "Boundary map", sub: "What stays visual, what becomes code — written down." },
        { label: "API layer", sub: "Thin server routes for secrets and heavy logic." },
        { label: "Data ownership", sub: "Where records live and how you extract them." },
        { label: "Scale triggers", sub: "Signals that mean it is time to split services." },
      ],
    },
    why: [
      { title: "Speed first", text: "Launch marketing and early workflows without waiting for full custom UI." },
      { title: "Honest ceilings", text: "We flag editor limits before you have 200 users depending on a hack." },
      { title: "Cleaner escape hatches", text: "APIs and naming that survive a partial rebuild." },
      { title: "Ops docs", text: "Zaps, webhooks, and credentials listed for your team." },
    ],
    howPhases: [
      { title: "Builder fit", weeks: "3–7 days", body: "Pick platform based on auth, roles, and data shape." },
      { title: "Hybrid MVP", weeks: "2–6 wks", body: "Visual app + tiny backend for secrets/integration." },
      { title: "Harden", weeks: "1–4 wks", body: "Queues, error alerts, and logging on glue code." },
      { title: "Graduate plan", weeks: "Optional", body: "Roadmap to code-first modules without big-bang rewrite." },
    ],
    priceRows: [
      { phase: "Hybrid discovery", includes: "Boundary doc + quote", timeline: "3–7 days", fromPrice: "~$1.8k–$5k" },
      { phase: "Builder MVP + API", includes: "Core screens, auth pattern, 1–2 integrations", timeline: "3–8 wks", fromPrice: "~$12k–$38k" },
      { phase: "Scale bridge", includes: "Workers, better data model, monitoring, partial UI escape", timeline: "6–14 wks", fromPrice: "~$38k–$95k+" },
    ],
    priceFootnote: DEFAULT_PRICE_FOOTNOTE,
    deliveryHeading: "Hybrid delivery themes",
    deliveryLead: "We treat glue code like product — with tests where failures cost money.",
    deliveryTags: [
      "Webhook endpoints with validation",
      "Secret storage outside the builder",
      "Job logs for nightly syncs",
      "Backups/export recipes",
      "Owner runbook for Zaps/workflows",
      "Migration notes for v2",
    ],
    relatedSlugs: ["workflow-automation", "mvp-development", "web", "ecommerce"],
    faq: [
      { q: "Webflow or Bubble?", a: "Webflow shines for marketing + CMS; Bubble when you need internal app logic without React yet — we pick with you." },
      { q: "Can we own code?", a: "Custom repos are yours under contract; builder assets follow their export rules — explained upfront." },
      { q: "SEO on Webflow?", a: "Generally strong for marketing sites; app-heavy SEO may still prefer Next.js — we advise per project." },
      { q: "Long-term support?", a: "Retainers available — see Maintenance & support." },
    ],
  },

  ecommerce: {
    slug: "ecommerce",
    practiceId: "build",
    metaTitle: "Ecommerce development — Shopify, WooCommerce, Wix & WordPress | BalochDev",
    description:
      "Ecommerce builds and migrations with platform comparison: Shopify, WordPress, Wix, WooCommerce — SEO-focused storefronts, integrations, and BalochDev pricing guides.",
    keywords: [
      "Shopify vs WooCommerce which to choose",
      "Shopify development agency",
      "WooCommerce custom development",
      "Wix ecommerce vs Shopify SEO",
      "WordPress ecommerce development",
      "ecommerce platform migration services",
      "headless Shopify Next.js",
      "BalochDev ecommerce",
    ],
    heroLead:
      "We help you pick the stack honestly, then implement catalog, checkout, operations, and SEO — so organic search and ops both work after launch.",
    seoTitle: "Ecommerce development with platform clarity (Shopify, WordPress, Wix, WooCommerce)",
    seoBody:
      "Many ecommerce searches are comparison intent: Shopify vs Wix vs WordPress vs WooCommerce. We publish how we decide — not just logos — because that matches real buying research and helps SEO capture long-tail queries. Our implementations cover product data, shipping/tax assumptions, analytics, and speed budgets. Custom or headless paths are quoted when catalog complexity, international rules, or content velocity demand them.",
    introPanel: {
      kicker: "Service snapshot",
      headline: "Commerce delivery beyond a theme install",
      tiles: [
        { label: "Catalog modeling", sub: "Variants, bundles, subscriptions — structured before pixels." },
        { label: "Ops integrations", sub: "ERP, 3PL, or CSV bridges spelled out in scope." },
        { label: "SEO-ready templates", sub: "Structured data, clean URL patterns, and perf budgets." },
        { label: "Payments reality", sub: "Local methods, retries, and fraud basics discussed early." },
      ],
    },
    why: [
      { title: "Platform-fit advice", text: "We lose deals by saying no to the wrong stack — not by overselling." },
      { title: "Implementation depth", text: "Metafields, webhooks, and automation — not only drag-and-drop." },
      { title: "Launch discipline", text: "Checklists for DNS, feeds, and monitoring before ads spend." },
      { title: "Migration sobriety", text: "URL and redirect plans so rankings survive moves." },
    ],
    howPhases: [
      { title: "Commerce discovery", weeks: "1 wk", body: "Channels, catalog complexity, international rules, platform shortlist." },
      { title: "Build or migrate", weeks: "3–10 wks", body: "Theme/app, data import, core integrations." },
      { title: "Ops hardening", weeks: "1–4 wks", body: "Fulfillment webhooks, error queues, admin training." },
      { title: "Growth iter", weeks: "Retainer optional", body: "CRO tweaks, SEO passes, new markets." },
    ],
    priceRows: [
      { phase: "Commerce strategy + stack pick", includes: "Written comparison, integration map, sitemap", timeline: "3–10 days", fromPrice: "~$2.5k–$8k" },
      { phase: "Store implementation", includes: "Theme/dev, catalog setup, payments/shipping basics, analytics", timeline: "4–10 wks", fromPrice: "~$15k–$55k" },
      { phase: "Complex / headless / multi-region", includes: "Custom app, enrichment pipelines, multi-store, deeper ERP", timeline: "10–22+ wks", fromPrice: "~$55k–$150k+" },
    ],
    priceFootnote: DEFAULT_PRICE_FOOTNOTE,
    deliveryHeading: "Ecommerce program deliverables",
    deliveryLead: "Content below mirrors comparison articles buyers read — tightened for action and quoting.",
    deliveryTags: [
      "Theme + component documentation",
      "Webhook/integration list with owners",
      "Product feed QA checklist",
      "Structured data validation notes",
      "Redirect matrix for migrations",
      "Support escalation paths for ops",
    ],
    relatedSlugs: ["web", "workflow-automation", "ux-ui", "api-integrations"],
    platformGuide: {
      intro:
        "If you are searching Shopify vs Wix vs WordPress vs WooCommerce, you are really optimizing for time-to-launch, catalog complexity, total cost of ownership, and SEO/content velocity. Our job is to translate your constraints — SKUs, markets, team skills, integrations — into a stack recommendation and an implementation plan with assumed fees.",
      platforms: [
        {
          name: "Shopify",
          bestFor: "Growing D2C brands, rich app ecosystem, predictable SaaS ops, international payments with fewer custom servers.",
          watchOuts: "Monthly platform + apps add up; heavy B2B quoting may need Plus; deep content marketing sometimes wants a paired CMS strategy.",
          ourApproach: "We map apps vs custom, use metafields cleanly, and plan redirects/SEO before theme work so you do not rebuild IA twice.",
        },
        {
          name: "WooCommerce (WordPress)",
          bestFor: "Content-heavy brands already on WordPress, hybrid editorial + shop, and teams comfortable hosting PHP.",
          watchOuts: "Hosting, security patches, and plugin conflicts are yours to operate — performance needs discipline.",
          ourApproach: "We narrow plugins, automate backups, define staging workflow, and document update cadence so Woo does not rot quietly.",
        },
        {
          name: "Wix eCommerce",
          bestFor: "Smaller catalogs, fast launches, operators who want an all-in-one editor without devops.",
          watchOuts: "Platform constraints on edge workflows; migration out later is harder than Shopify or Woo — plan for the 3-year horizon.",
          ourApproach: "We maximize native features first, integrate only where necessary, and document what must wait until you graduate platforms.",
        },
        {
          name: "WordPress (content-led / hybrid)",
          bestFor: "Editorial velocity, landing-page factories, and marketing sites that may bolt commerce via plugins or headless feeds.",
          watchOuts: "Commerce is not native — pairing plugins or a second system adds glue; roles and permissions need clarity.",
          ourApproach: "We separate content models from commerce data, automate sync where required, and keep SEO templates consistent across both.",
        },
      ],
    },
    faq: [
      { q: "Which platform is best for SEO?", a: "All can rank; winners execute IA, Core Web Vitals, and structured data. Shopify and disciplined WordPress stacks are common for large editorial + commerce blends." },
      { q: "Do you do headless commerce?", a: "Yes when catalog scale, personalization, or multi-surface experiences justify the ops cost — priced as custom + web app scope." },
      { q: "Migrations without dropping traffic?", a: "Redirects, sitemaps, and monitored Search Console windows — migration planning is a billed line item, not an afterthought." },
      { q: "Who runs the store after launch?", a: "We train your ops team and optionally retain monthly for updates, CRO, and incident response." },
    ],
  },

  "workflow-automation": {
    slug: "workflow-automation",
    practiceId: "automate",
    metaTitle: "Workflow automation — n8n, Zapier/Make & reliable glue | BalochDev",
    description:
      "Automation that survives real operations: idempotent flows, alerts, and docs — n8n, Zapier, Make, and custom workers — with BalochDev pricing bands.",
    keywords: [
      "workflow automation agency",
      "n8n workflow development",
      "Zapier consulting agency",
      "Make.com automation experts",
      "business process automation integration",
      "reliable Zapier alternatives",
      "automation monitoring alerts",
      "BalochDev automation",
    ],
    heroLead:
      "Pipelines that retry safely, log failures, and tell someone when money-moving steps break — automations your ops team trusts at 2am.",
    seoTitle: "Workflow automation services for teams outgrown manual glue",
    seoBody:
      "Automation searches spike after a brittle Zap takes down renewals. We write playbooks, idempotency notes, and owner lists alongside flows. SEO wording targets tool names (n8n, Zapier, Make) and reliability phrases because that is how buyers research fixes, not just ‘save time’ platitudes.",
    introPanel: {
      kicker: "Service snapshot",
      headline: "Automation engineering habits",
      tiles: [
        { label: "Failure design", sub: "Dead-letter paths, retries with caps, human paging." },
        { label: "Data contracts", sub: "Field mapping tables — not mystery transforms." },
        { label: "Secrets hygiene", sub: "Vaulted creds, scoped OAuth, rotated keys." },
        { label: "Auditability", sub: "Logs that explain which record failed and why." },
      ],
    },
    why: [
      { title: "Ops-friendly", text: "Non-dev owners get runbooks with screenshots and triggers." },
      { title: "Tool-agnostic", text: "Self-hosted n8n versus SaaS glue — recommendations come from constraints." },
      { title: "Scale awareness", text: "We flag when a flow should become code on a worker." },
      { title: "Monitoring", text: "Heartbeat checks or queue depth alerts where volume matters." },
    ],
    howPhases: [
      { title: "Process mapping", weeks: "2–7 days", body: "Systems, owners, SLAs, volume estimates." },
      { title: "MVP automation", weeks: "1–3 wks", body: "Single high-value path, with logging." },
      { title: "Reliability pass", weeks: "1–2 wks", body: "Retries, dedupe keys, alert routes." },
      { title: "Handoff training", weeks: "2–5 days", body: "Docs + tabletop failure drill." },
    ],
    priceRows: [
      { phase: "Automation audit", includes: "Map + risk list + quote", timeline: "2–5 days", fromPrice: "~$1.5k–$4k" },
      { phase: "Core flow build", includes: "3–8 steps, error alerts, documentation", timeline: "1–3 wks", fromPrice: "~$6k–$22k" },
      { phase: "Program (many flows / n8n)", includes: "Self-hosting, branching, backfills, monitoring", timeline: "3–10+ wks", fromPrice: "~$22k–$75k+" },
    ],
    priceFootnote: DEFAULT_PRICE_FOOTNOTE,
    deliveryHeading: "Automation deliverables",
    deliveryLead: "Automations are software — we package them like software.",
    deliveryTags: [
      "Exported flow definitions where possible",
      "Credential inventory with owners",
      "Replay/recovery procedure",
      "Monitoring hooks or emails",
      "Change log template",
      "Volume/scaling notes",
    ],
    relatedSlugs: ["api-integrations", "ai-agents", "maintenance-support", "no-code-custom-code"],
    faq: [
      { q: "n8n vs Zapier?", a: "Zapier for speed on common SaaS; n8n when you need self-hosting, branching, or cost at volume — we model both." },
      { q: "Can AI steps live inside flows?", a: "Yes with guardrails — often a separate review gate before customer-facing sends." },
      { q: "HIPAA / finance?", a: "Possible with environment segregation; compliance work adds review time." },
      { q: "Who maintains after?", a: "Retainers with monthly check-ins — see Maintenance & support." },
    ],
  },

  "api-integrations": {
    slug: "api-integrations",
    practiceId: "automate",
    metaTitle: "API development & integrations — webhooks, middleware & contracts | BalochDev",
    description:
      "API layers, webhooks, and integrations between CRMs, payments, AI, and your product — versioning, retries, and assumed pricing from BalochDev.",
    keywords: [
      "API integration company",
      "custom middleware development",
      "webhook integration developers",
      "REST API contract design",
      "Stripe webhook integration",
      "Salesforce integration developers",
      "API development cost estimate",
      "BalochDev APIs",
    ],
    heroLead:
      "Clean boundaries between systems: explicit schemas, auth patterns, and failure behavior your on-call can reason about.",
    seoTitle: "API and integration services for SaaS and internal tools",
    seoBody:
      "Integration searches often mean ‘make two SaaS tools talk.’ We treat integrations like product work: contracts, versioning, observability, and rollbacks. SEO copy names concrete providers because due diligence teams literally search them while checking vendor fit.",
    introPanel: {
      kicker: "Service snapshot",
      headline: "Integration scope we sign",
      tiles: [
        { label: "Contract-first", sub: "OpenAPI or typed payloads — surprises caught in CI." },
        { label: "Auth patterns", sub: "OAuth, signed webhooks, mTLS when warranted." },
        { label: "Idempotency", sub: "Safe replays for payments and provisioning." },
        { label: "Observability", sub: "Trace IDs crossing service hops." },
      ],
    },
    why: [
      { title: "Fewer midnight pages", text: "Alerts tied to business metrics, not generic 500 spam." },
      { title: "Vendor reality", text: "Rate limits and flaky sandboxes planned for." },
      { title: "Future you", text: "Versioned endpoints so mobile and partners are not broken silently." },
      { title: "Security", text: "Secret rotation and least-privilege service accounts." },
    ],
    howPhases: [
      { title: "Integration discovery", weeks: "3–7 days", body: "Systems, objects, directionality, SLAs." },
      { title: "Spike", weeks: "3–10 days", body: "Prove auth + happy path in sandbox." },
      { title: "Build + tests", weeks: "2–8 wks", body: "Handlers, retries, monitoring, docs." },
      { title: "Cutover support", weeks: "As needed", body: "Shadow mode, parallel runs, rollback plan." },
    ],
    priceRows: [
      { phase: "Integration plan", includes: "Sequence diagram-level map + quote", timeline: "3–7 days", fromPrice: "~$2k–$6k" },
      { phase: "Single high-value bridge", includes: "Bi-directional or event-driven sync with monitoring", timeline: "2–6 wks", fromPrice: "~$10k–$35k" },
      { phase: "Platform program", includes: "Many partners, admin UI, webhook portal, SLAs", timeline: "6–16+ wks", fromPrice: "~$35k–$120k+" },
    ],
    priceFootnote: DEFAULT_PRICE_FOOTNOTE,
    deliveryHeading: "Integration artifacts",
    deliveryLead: "Docs are part of reliability — not a PDF afterthought.",
    deliveryTags: [
      "OpenAPI / schema repo",
      "Postman or curl collections",
      "Runbook for credential rotation",
      "Monitoring dashboards or log queries",
      "Load/throughput notes",
      "Cutover checklist",
    ],
    relatedSlugs: ["workflow-automation", "saas-development", "ai-development", "maintenance-support"],
    faq: [
      { q: "Can you work legacy SOAP/XML?", a: "Often yes — priced after discovery because tooling differs from greenfield REST." },
      { q: "Who owns SLAs with SaaS vendors?", a: "You maintain vendor contracts; we document dependencies and failure messaging." },
      { q: "GraphQL or REST?", a: "Either — we document chosen style, caching rules, and client expectations. Batching and N+1 risks are called out for GraphQL." },
      { q: "Mobile SDK work?", a: "Possible when paired with a documented backend contract; mobile scopes are often parallel tracks in the same program." },
    ],
  },

  "maintenance-support": {
    slug: "maintenance-support",
    practiceId: "automate",
    metaTitle: "Maintenance & support — upgrades, incidents & steady shipping | BalochDev",
    description:
      "Post-launch care: dependency upgrades, incidents, small features — clear SLAs, cadence, and retainer assumptions from BalochDev.",
    keywords: [
      "software maintenance retainer",
      "application support SLA",
      "devops light monthly support",
      "dependency upgrade service",
      "on-call developer retainer",
      "post launch product support agency",
      "BalochDev support",
    ],
    heroLead:
      "Keep shipping safely: predictable release rhythm, transparent backlog triage, and incident response that does not gaslight your users.",
    seoTitle: "Software maintenance and support retainers explained",
    seoBody:
      "Support searches come after launch pain — mystery outages, dependency drift, or founders who can not get their old agency on the phone. We structure retainers with response targets, included hours, and how emergencies escalate. SEO language targets retainers and SLAs because finance approves those phrases.",
    introPanel: {
      kicker: "Service snapshot",
      headline: "How retainers work with us",
      tiles: [
        { label: "Backlog triage", sub: "Shared priority rules — fixes before nice-to-haves." },
        { label: "Release train", sub: "Scheduled deploy windows with rollback notes." },
        { label: "Health checks", sub: "Dependencies, certs, and basic perf regressions." },
        { label: "Quarterly review", sub: "Roadmap and risk readout for leadership." },
      ],
    },
    why: [
      { title: "Continuity", text: "Same engineers who know the sharp edges — when staffing allows." },
      { title: "Budgetable", text: "Monthly blocks with overage rates published." },
      { title: "Honest limits", text: "We say when you need a full-time hire instead of a fractional retainer." },
      { title: "Security hygiene", text: "Patch cadence tied to severity, not luck." },
    ],
    howPhases: [
      { title: "Onboarding audit", weeks: "3–7 days", body: "Repos, envs, monitors, incident history." },
      { title: "Stabilize sprint", weeks: "2–4 wks", body: "Top crashers, dependency bumps, alerting gaps." },
      { title: "Steady state", weeks: "Monthly", body: "SLA-tracked requests + scheduled releases." },
      { title: "Annual planning", weeks: "Optional", body: "Upgrade roadmap (runtime, framework majors)." },
    ],
    priceRows: [
      { phase: "Audit + plan", includes: "Risk note, recommended tier, access checklist", timeline: "3–7 days", fromPrice: "~$1.5k–$5k" },
      { phase: "Essential retainer", includes: "8–15 hrs/mo, business-day response, minor releases", timeline: "Monthly", fromPrice: "~$3.5k–$9k / mo" },
      { phase: "Growth retainer", includes: "25–40+ hrs/mo, tighter response, feature mix", timeline: "Monthly", fromPrice: "~$9k–$22k+ / mo" },
    ],
    priceFootnote:
      "Retainers assume code access and civil handoffs; hostile takeovers from unknown repos may require a paid rescue sprint first. Hours roll under caps described in your MSA; emergency blocks billed per agreement.",
    deliveryHeading: "Support program expectations",
    deliveryLead: "We align language between founders, finance, and eng leads.",
    deliveryTags: [
      "Ticket or Slack workflow",
      "Monthly status note",
      "Incident template",
      "Dependency report",
      "Release calendar",
      "Escalation phone tree",
    ],
    relatedSlugs: ["web", "saas-development", "workflow-automation", "api-integrations"],
    faq: [
      { q: "24/7 on-call?", a: "Available for some stacks at higher tiers — priced for pager burden." },
      { q: "Can you inherit a mess?", a: "Often after a rescue audit; we quote stabilization separately." },
      { q: "What is out of scope?", a: "Net-new product phases get their own statements of work — retainers cover care and incremental improvements." },
      { q: "Cancel anytime?", a: "Per contract notice windows; knowledge transfer included." },
    ],
  },

  "ux-ui": {
    slug: "ux-ui",
    practiceId: "design",
    metaTitle: "UX/UI design — product interfaces, systems-ready handoff | BalochDev",
    description:
      "Product UX and UI design: research-light flows, accessible components, Figma handoff to engineering — packaged milestones and pricing from BalochDev.",
    keywords: [
      "product UX UI agency",
      "Figma to development handoff",
      "design system UI kit",
      "SaaS dashboard design",
      "mobile app UI design services",
      "accessible UI design WCAG",
      "UX UI design pricing",
      "BalochDev design",
    ],
    heroLead:
      "Interfaces that read fast on mobile, respect accessibility baselines, and translate cleanly into components engineers can ship — not pretty pictures detached from states.",
    seoTitle: "UX/UI design services with engineering-aware handoff",
    seoBody:
      "UX/UI searches split between marketing site prettiness and product complexity. We clarify which we are doing, how many roles and states exist, and what research is in scope. SEO text mentions accessibility and design systems because reviewers Ctrl+F those terms in RFPs.",
    introPanel: {
      kicker: "Service snapshot",
      headline: "Design deliverables in proposals",
      tiles: [
        { label: "Journey clarity", sub: "Flows with error, empty, and loading brains." },
        { label: "Component thinking", sub: "Pieces map to code, not one-off JPGs." },
        { label: "Accessibility", sub: "Focus order, contrast, motion expectations documented." },
        { label: "Token-ready", sub: "Color, type, spacing scales engineering can adopt." },
      ],
    },
    why: [
      { title: "Engineering empathy", text: "We talk to your devs early — fewer redraws." },
      { title: "Speed where allowed", text: "Libraries for standard patterns; custom only where differentiated." },
      { title: "Brand respect", text: "Visuals align with your voice — we coordinate with Branding when bundled." },
      { title: "Measurable UX", text: "Success metrics named, not assumed." },
    ],
    howPhases: [
      { title: "UX sweep", weeks: "1–2 wks", body: "Flows, IA adjustments, low-fi prototypes." },
      { title: "UI kit pass", weeks: "2–4 wks", body: "Hi-fi screens, states, tokens." },
      { title: "Handoff sprint", weeks: "1 wk", body: "Specs, redlines, Loom walkthroughs." },
      { title: "Build support", weeks: "Optional", body: "Office hours with engineering during implementation." },
    ],
    priceRows: [
      { phase: "UX audit / small flow", includes: "Heuristic review + prioritized fixes", timeline: "3–10 days", fromPrice: "~$2k–$6k" },
      { phase: "Product UI (single platform)", includes: "Core journeys, component library draft, handoff kit", timeline: "3–7 wks", fromPrice: "~$12k–$38k" },
      { phase: "Multi-surface / complex admin", includes: "Dense tables, roles, many states, motion system", timeline: "7–14+ wks", fromPrice: "~$38k–$95k+" },
    ],
    priceFootnote: DEFAULT_PRICE_FOOTNOTE,
    deliveryHeading: "Design package ingredients",
    deliveryLead: "We list Figma structure, tokens, and ownership to prevent endless tweak loops.",
    deliveryTags: [
      "Organized Figma file + cover",
      "Component specs with variants",
      "Prototype links for key flows",
      "Accessibility notes per pattern",
      "Asset export conventions",
      "Engineering Q&A block",
    ],
    relatedSlugs: ["design-systems", "branding", "web", "android-app-development"],
    faq: [
      { q: "Research included?", a: "Light interviews or analytics review can be added; deep research is its own line item." },
      { q: "Developer handoff tools?", a: "Figma-first; additional tools if your team already adopted them." },
      { q: "Can you implement?", a: "Often via our Web / Android / SaaS teams — design+build quotes available." },
      { q: "Iterations?", a: "Rounds are capped per phase to keep schedules honest — expansions are change orders." },
    ],
  },

  branding: {
    slug: "branding",
    practiceId: "design",
    metaTitle: "Branding services — voice, visual identity & web-ready assets | BalochDev",
    description:
      "Brand direction for product-led teams: narrative, logo concepts, palette, type, and reusable assets — milestone pricing from BalochDev.",
    keywords: [
      "startup branding agency",
      "product branding package",
      "tech company visual identity",
      "brand guidelines design",
      "logo and color system SaaS",
      "branding for web launch",
      "BalochDev branding",
    ],
    heroLead:
      "Identity that survives favicons, slide decks, and your marketing site — coherent story, not a random gradient kit from a template.",
    seoTitle: "Branding for technology products and launches",
    seoBody:
      "Branding searches from startups often want ‘everything yesterday.’ We separate brand strategy essentials from nice-to-have illustration systems. SEO mentions guidelines and product launches because those are buys with clear procurement language.",
    introPanel: {
      kicker: "Service snapshot",
      headline: "Brand milestones we sell",
      tiles: [
        { label: "Positioning", sub: "Who you help and why you win — in plain words." },
        { label: "Visual north star", sub: "Logo, color, type direction with rationales." },
        { label: "Application rules", sub: "How marks live on web, social, decks." },
        { label: "Handoff kit", sub: "Exports engineers and marketers can actually open." },
      ],
    },
    why: [
      { title: "Product-aware", text: "Brand meets UI constraints — not just poster design." },
      { title: "Editable systems", text: "Figma libraries your team can extend." },
      { title: "Launch pairing", text: "Coordinates with UX/UI when you bundle." },
      { title: "Honest timeline", text: "Real critique cycles — not fake one-week ‘full rebrands.’" },
    ],
    howPhases: [
      { title: "Stakeholder interviews", weeks: "3–7 days", body: "Markets, competitors, taboo topics." },
      { title: "Directions", weeks: "1–2 wks", body: "2–3 visual territories with rationale." },
      { title: "Refine + guidelines", weeks: "1–2 wks", body: "Chosen path, rules, asset pack." },
      { title: "Apply support", weeks: "Optional", body: "Help implementing on site or app." },
    ],
    priceRows: [
      { phase: "Brand sprint", includes: "Positioning doc + mood + core palette/type", timeline: "2–3 wks", fromPrice: "~$6k–$18k" },
      { phase: "Full identity kit", includes: "Logo system, guidelines, social/deck templates", timeline: "4–7 wks", fromPrice: "~$18k–$45k" },
      { phase: "Scale / sub-brands", includes: "Multi-product architecture, deeper illustration, motion basics", timeline: "8–14+ wks", fromPrice: "~$45k–$110k+" },
    ],
    priceFootnote: DEFAULT_PRICE_FOOTNOTE,
    deliveryHeading: "Branding deliverables",
    deliveryLead: "Every PDF claims ‘strategy’ — ours lists filenames and owners.",
    deliveryTags: [
      "Logo pack (vector/raster)",
      "Color + type tokens",
      "Brand guidelines PDF/Notion",
      "Social templates",
      "Deck master",
      "Naming guardrails doc",
    ],
    relatedSlugs: ["ux-ui", "design-systems", "web", "ecommerce"],
    faq: [
      { q: "Naming / trademark legal?", a: "We support creative naming; legal clearance is yours with counsel." },
      { q: "Illustration or 3D?", a: "Available as extensions — scoped after identity lock." },
      { q: "Existing messy brand?", a: "Evolution tracks reduce risk — we audit before promising revolution." },
      { q: "How many rounds?", a: "Defined per phase; extra rounds are change orders to protect calendar." },
    ],
  },

  "design-systems": {
    slug: "design-systems",
    practiceId: "design",
    metaTitle: "Design systems — tokens, components & Storybook alignment | BalochDev",
    description:
      "Design systems that speed releases: Figma libraries, React (or your stack) components, documentation — with BalochDev pricing for audit, build, and adoption.",
    keywords: [
      "design system development agency",
      "Figma component library setup",
      "Storybook design system",
      "design tokens implementation",
      "enterprise UI consistency",
      "component library for React",
      "design system audit cost",
      "BalochDev design systems",
    ],
    heroLead:
      "A system your team actually adopts — documented components, tokens, and governance so PMs stop filing ‘another button’ tickets.",
    seoTitle: "Design system services for scaling product teams",
    seoBody:
      "Design system RFPs mention tokens, accessibility, and Storybook because engineering leads search those terms. We split audits from build vs adoption programs — many failed systems shipped code nobody used. Our SEO copy states that upfront to attract serious buyers.",
    introPanel: {
      kicker: "Service snapshot",
      headline: "System scopes we quote",
      tiles: [
        { label: "Inventory", sub: "What exists, duplications, tech debt cost." },
        { label: "Token layer", sub: "Color, space, type with naming discipline." },
        { label: "Components", sub: "Variants, docs, and usage do/don’t." },
        { label: "Adoption", sub: "Training, linting hooks, contribution rules." },
      ],
    },
    why: [
      { title: "Fewer one-offs", text: "Pull requests reference system issues — not mystery CSS." },
      { title: "Accessible defaults", text: "Components ship with baseline a11y notes." },
      { title: "Cross-functional", text: "Design and eng share a roadmap for the library." },
      { title: "Incremental", text: "We can pilot on one product surface before org-wide mandates." },
    ],
    howPhases: [
      { title: "Audit", weeks: "1–2 wks", body: "Coverage metrics, quick wins, roadmap." },
      { title: "Foundation", weeks: "2–4 wks", body: "Tokens + primitives wired in code." },
      { title: "Expand", weeks: "4–10 wks", body: "Composite components, docs site or Storybook." },
      { title: "Governance", weeks: "Ongoing", body: "RFC process, deprecations, contribution guide." },
    ],
    priceRows: [
      { phase: "System audit", includes: "Metrics deck + phased quote", timeline: "1–2 wks", fromPrice: "~$5k–$14k" },
      { phase: "MVP system", includes: "Tokens, 12–25 components, docs baseline", timeline: "6–12 wks", fromPrice: "~$28k–$75k" },
      { phase: "Enterprise program", includes: "Multi-brand, internationalization, visual regression CI", timeline: "14–30+ wks", fromPrice: "~$75k–$200k+" },
    ],
    priceFootnote: DEFAULT_PRICE_FOOTNOTE,
    deliveryHeading: "System delivery ingredients",
    deliveryLead: "Docs and code ship together — or teams wander off fork.",
    deliveryTags: [
      "Token JSON / Style Dictionary pipeline",
      "Component package in monorepo or library",
      "Usage guidelines site",
      "Theming strategy notes",
      "Lint/visual regression hooks",
      "Adoption workshop deck",
    ],
    relatedSlugs: ["ux-ui", "web", "saas-development", "branding"],
    faq: [
      { q: "React only?", a: "React is common; web components or other stacks after technical assessment." },
      { q: "Can you rescue an abandoned library?", a: "Yes — audits price the cleanup before promising dates." },
      { q: "Who maintains?", a: "We offer retainers for version alignment with frameworks." },
      { q: "Figma ↔ code sync?", a: "We define boundaries — full bi-directional sync is rare and priced as tooling work." },
    ],
  },
};

export function isValidServiceDetailSlug(s: string | undefined): s is ServiceDetailSlug {
  return !!s && Object.prototype.hasOwnProperty.call(SERVICE_DETAIL_LANDINGS, s);
}

export function getServiceDetailLanding(slug: string | undefined): ServiceDetailLandingConfig | null {
  if (!slug || !isValidServiceDetailSlug(slug)) return null;
  return SERVICE_DETAIL_LANDINGS[slug];
}
