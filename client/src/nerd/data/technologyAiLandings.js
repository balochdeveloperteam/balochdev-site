/**
 * SEO-focused AI vendor landing pages (route: /technologies/ai/:slug — merged in stackLandings/index.js).
 * Content is intentionally compact vs long competitor templates.
 */

/** Maps AI stack iconKey → URL slug */
export function aiIconKeyToLandingSlug(iconKey) {
  const map = {
    googlegemini: "gemini",
    vercel_ai_sdk: "vercel-ai-sdk",
    githubcopilot: "github-copilot",
    microsoft: "microsoft-ai",
    xai: "xai-grok",
    claude_code: "claude-code",
  };
  return map[iconKey] ?? iconKey;
}

/**
 * @typedef {{
 *   iconKey: string,
 *   title: string,
 *   metaTitle: string,
 *   description: string,
 *   keywords: string[],
 *   heroLead: string,
 *   seoTitle: string,
 *   seoBody: string,
 *   introPanel: { kicker: string, headline: string, tiles: { label: string, sub: string }[] },
 *   deliveryHeading?: string,
 *   why: { title: string; text: string }[],
 *   deliveryTags: string[],
 *   deliveryLead: string,
 *   faq: { q: string; a: string }[],
 * }} AiLandingConfig
 */

/** @type {Record<string, AiLandingConfig>} */
export const AI_TECH_LANDINGS = {
  openai: {
    iconKey: "openai",
    title: "OpenAI integration",
    metaTitle: "OpenAI development & GPT integration — BalochDev",
    description:
      "BalochDev ships production OpenAI APIs: GPT chat, structured outputs, agents, RAG, and secure OAuth flows — with review, observability, and sensible budgets.",
    keywords: [
      "OpenAI development services",
      "GPT-4 API integration",
      "ChatGPT API production",
      "AI agents OpenAI",
      "structured outputs API",
      "enterprise AI integration",
      "BalochDev OpenAI integration",
    ],
    heroLead:
      "We wire GPT-class models into products you own: assistants, extractors, copilots, and agents — with token budgets, guardrails, and human review where it matters.",
    seoTitle: "How BalochDev uses OpenAI in production",
    seoBody:
      "BalochDev builds OpenAI API integrations for teams that need GPT-powered chatbots, document summarization, or retrieval-augmented generation in production — not demos only. We implement streaming responses, tool calling, JSON schemas for structured extraction, and rate-aware retries so features stay fast under load. For regulated workloads we pair OpenAI with your identity provider, scoped OAuth, audit logs, and data minimization — never leaking customer payloads into prompts without explicit policy.",
    introPanel: {
      kicker: "Stack snapshot",
      headline: "How BalochDev ships OpenAI in production",
      tiles: [
        {
          label: "GPT-class UX & streaming",
          sub: "BalochDev’s usual lane for chat, extraction, embeddings, and tool-use agents — tuned latency and guardrails.",
        },
        {
          label: "Structured outputs & tools",
          sub: "JSON schemas, function calling, and retries so integrations stay deterministic where business logic demands it.",
        },
        {
          label: "Agents & RAG patterns",
          sub: "Retrieval you can cite, human gates on writes, and evaluation hooks — not demo-only chains.",
        },
        {
          label: "OAuth & least-privilege scopes",
          sub: "Assistants that respect SSO boundaries: server-held secrets, audited tool scopes, kill switches.",
        },
      ],
    },
    deliveryHeading: "Assistants, plugins & APIs — BalochDev’s playbook for GPT-class production AI.",
    why: [
      { title: "Mature tool APIs", text: "Function calling and strict schemas reduce brittle prompt hacks." },
      { title: "Latency patterns", text: "Streaming UX, caching, and batch routes tuned for real users." },
      { title: "Operational realism", text: "Budget caps, fallbacks, and evaluation hooks — not demo-tier AI." },
      { title: "Safety defaults", text: "Policy filters, red-team prompts, and kill switches for production." },
    ],
    deliveryTags: ["Custom plugins & tools", "Agents & orchestration", "Web apps & dashboards", "Chrome extensions", "Large-scale APIs", "OAuth & SSO-aware flows"],
    deliveryLead:
      "From internal copilots to customer-facing assistants, we shorten delivery with reusable patterns: typed tool interfaces, traceable runs, and CI checks — while keeping security review explicit for anything that touches PII or payments.",
    faq: [
      { q: "Do you only use OpenAI?", a: "No — we maintain a provider ladder. OpenAI is often primary for quality and tooling, with Anthropic, Gemini, or Groq as failover or specialty picks." },
      { q: "Can you keep data off model training?", a: "We architect flows around enterprise API settings and minimization. Exact retention depends on your agreement with the provider — we document what crosses each boundary." },
      { q: "How do you control cost?", a: "Model routing, prompt compaction, caching where allowed, and usage dashboards tied to product surfaces — not surprise invoices." },
      { q: "What about OAuth with AI features?", a: "We treat assistants like any sensitive scope: least-privilege tokens, refresh hygiene, and server-side secret handling — never embedding long-lived keys in clients." },
    ],
  },

  anthropic: {
    iconKey: "anthropic",
    title: "Anthropic Claude integration",
    metaTitle: "Anthropic Claude API development — BalochDev",
    description:
      "BalochDev delivers Claude API integration for long-context workflows, document AI, coding assistants, and safety-conscious assistants beside customer data.",
    keywords: [
      "Anthropic API developer",
      "Claude integration services",
      "Claude long context",
      "enterprise Claude deployment",
      "AI document analysis Claude",
      "BalochDev Claude integration",
    ],
    heroLead:
      "Claude shines when context depth matters: legal packs, product specs, multi-file code reviews, and assistants that must refuse cleanly.",
    seoTitle: "How BalochDev integrates Anthropic Claude",
    seoBody:
      "BalochDev implements Anthropic Claude API integrations when organizations need summarization across large PDF sets, multi-turn support bots with grounded answers, or developer tooling that edits whole repos. We pair Claude with retrieval stores, citation-friendly prompts, and evaluation suites so quality holds week two — not only day one. Where Gemini or OpenAI run better on latency or modalities, BalochDev routes intelligently instead of forcing one vendor.",
    introPanel: {
      kicker: "Stack snapshot",
      headline: "How BalochDev engineers Claude API work",
      tiles: [
        {
          label: "Long-context documents",
          sub: "Legal packs, specs, and research dumps — fewer chunking mistakes when the model can hold more truth.",
        },
        {
          label: "Grounded assistants",
          sub: "Citations, retrieval stores, and eval suites so answers stay honest after launch week.",
        },
        {
          label: "Safety-sensitive workflows",
          sub: "Clean refusals, policy-aware prompts, and human review where customer content is messy.",
        },
        {
          label: "Smart routing",
          sub: "When latency or modality favors Gemini or OpenAI, BalochDev swaps endpoints — not product logic.",
        },
      ],
    },
    deliveryHeading: "Claude assistants, RAG & copilots — BalochDev’s long-context delivery lane.",
    why: [
      { title: "Long-context wins", text: "Pack more source truth per request — fewer chunking mistakes." },
      { title: "Harmlessness posture", text: "Better baseline behavior when assistants face messy user content." },
      { title: "Coding strength", text: "Strong refactors and explanations across multi-file patches." },
      { title: "Hybrid stacks", text: "Pairs cleanly with LangGraph agents and your existing auth." },
    ],
    deliveryTags: ["RAG over docs", "Support copilots", "Engineering assistants", "Batch extraction", "Security reviews", "Compliance-aware flows"],
    deliveryLead:
      "We ship Claude behind the same engineering standards as the rest of our stack: typed boundaries, observability, staged rollouts, and explicit data routing — especially when assistants can propose writes or call external tools.",
    faq: [
      { q: "Claude vs OpenAI for my product?", a: "If your workload is document-heavy or needs very wide context, Claude often leads. If you need the broadest third-party examples and ecosystem, OpenAI can lead. We prototype both when unclear." },
      { q: "Can Claude call our internal APIs?", a: "Yes — via tool/function patterns with authenticated gateways, never by exposing raw DB credentials to the model." },
      { q: "Do you fine-tune Claude?", a: "Most wins come from retrieval, evaluation, and prompting. When fine-tuning fits, we align with vendor-supported paths and your data policy." },
    ],
  },

  "claude-code": {
    iconKey: "claude_code",
    title: "Claude Code workflows",
    metaTitle: "Claude Code development & AI-assisted shipping — BalochDev",
    description:
      "BalochDev embeds Claude Code in disciplined pipelines: codebase-aware edits, reviews, tests, and docs — without skipping CI or security gates.",
    keywords: [
      "Claude Code development",
      "AI coding assistant workflow",
      "Anthropic Claude Code enterprise",
      "AI assisted software delivery",
      "BalochDev Claude Code consulting",
    ],
    heroLead:
      "Claude Code is an accelerator, not a substitute for architecture. We embed it in branches, checklists, and reviewers so velocity compounds safely.",
    seoTitle: "How BalochDev runs Claude Code in delivery pipelines",
    seoBody:
      "Teams searching for Claude Code development services want safer acceleration than copy-paste from chat. BalochDev standardizes how AI edits land: small PRs, mandatory CI, secret scanning, and explicit restrictions around infra keys and customer data. That keeps Claude Code useful for refactors, tests, migrations, and documentation — while reducing the classic AI foot-guns in large repos.",
    introPanel: {
      kicker: "Delivery rhythm",
      headline: "How BalochDev runs Claude Code with reviewers",
      tiles: [
        {
          label: "Repo-aware diffs",
          sub: "Edits sized for humans — fewer hallucinated file trees and easier code review.",
        },
        {
          label: "CI as authority",
          sub: "Tests, linters, and scanners gate merges so acceleration doesn’t bypass safety nets.",
        },
        {
          label: "Secret discipline",
          sub: "No prod tokens in prompts — hooks and policies keep leaks out of chat traces.",
        },
        {
          label: "Velocity you can audit",
          sub: "Refactors, fixtures, migrations, and docs — speed shows up in merged commits.",
        },
      ],
    },
    deliveryHeading: "Accelerated branches & chores — Claude Code inside BalochDev’s PR rails.",
    why: [
      { title: "Repo-aware edits", text: "Less hallucinated file glue — changes align with tree structure." },
      { title: "Review-friendly PRs", text: "We train workflows toward human-diff-sized commits." },
      { title: "Shared conventions", text: "Lint and format stay authoritative — AI adapts to them." },
      { title: "Security gates", text: "Blocked paths for env secrets, tokens, and unsafe deps." },
    ],
    deliveryTags: ["Accelerated feature branches", "Test & fixture generation", "Legacy migrations", "Internal developer portals", "Docs-from-code", "Review automation assists"],
    deliveryLead:
      "Whether you are modernizing a monolith or shipping a new SaaS surface, we pair Claude Code with pragmatic automation: codegen scripts, typed SDKs, and dashboards — so speed gains show up in merged commits, not slide decks.",
    faq: [
      { q: "Will AI replace our engineers?", a: "No — it removes repetition so seniors focus on trade-offs and juniors ship with guardrails." },
      { q: "How do you prevent leaked secrets?", a: "Pre-commit hooks, CI secret scanners, and policies that never paste prod credentials into prompts." },
      { q: "Does this work with our stack?", a: "Yes — TypeScript, Python, Go, Dart/Flutter, and typical CI hosts are all compatible." },
    ],
  },

  "microsoft-ai": {
    iconKey: "microsoft",
    title: "Microsoft AI & Azure OpenAI",
    metaTitle: "Azure OpenAI & Microsoft AI integration — BalochDev",
    description:
      "BalochDev ships enterprise AI on Azure OpenAI with tenant-aware auth, Microsoft-aligned governance, and integrations beside Entra ID and Microsoft 365 patterns.",
    keywords: [
      "Azure OpenAI integration",
      "Microsoft Copilot extensibility",
      "enterprise AI Azure",
      "Entra ID AI apps",
      "BalochDev Azure OpenAI development",
    ],
    heroLead:
      "When procurement wants Microsoft on the contract line, we still ship modern UX — assistants, extractors, and APIs grounded in your tenancy model.",
    seoTitle: "How BalochDev integrates Azure OpenAI & Microsoft AI",
    seoBody:
      "Azure OpenAI integration projects usually require private endpoints, usage quotas per environment, and identity tied to Entra ID. BalochDev implements backends that respect conditional access, managed identities where possible, and minimal-secret architectures so operators sleep at night. For hybrid stacks we keep portability — swapping endpoints without rewriting product logic.",
    introPanel: {
      kicker: "Enterprise envelope",
      headline: "How BalochDev lands Microsoft & Azure AI",
      tiles: [
        {
          label: "Entra-ready auth",
          sub: "OAuth/OIDC patterns assistants can live beside — conditional access aware.",
        },
        {
          label: "Networking & quotas",
          sub: "Private endpoints, environment quotas, and observability ops teams expect.",
        },
        {
          label: "Tenant isolation",
          sub: "Per-org keys, segregated stores, and auditable scopes for regulated workloads.",
        },
        {
          label: "Interop without lock-in",
          sub: "Teams, SharePoint, CRM glue when workflows demand — core logic stays portable.",
        },
      ],
    },
    deliveryHeading: "Line-of-business copilots & Azure AI — procurement-friendly builds by BalochDev.",
    why: [
      { title: "Procurement fit", text: "Aligns with common enterprise sourcing paths." },
      { title: "Tenant isolation", text: "Per-org keys, segregated stores, and auditable access." },
      { title: "Governance hooks", text: "Policies for retention, logging, and escalation paths." },
      { title: "Interop", text: "Teams, SharePoint, and CRM connectors when workflows demand them." },
    ],
    deliveryTags: ["Private connectivity patterns", "Admin consoles", "Line-of-business copilots", "Bulk document pipelines", "Monitoring & cost dashboards"],
    deliveryLead:
      "We treat Azure AI like any regulated subsystem: threat modeling for OAuth scopes, least-privilege service principals, and measurable SLIs once live.",
    faq: [
      { q: "Azure OpenAI vs OpenAI direct?", a: "Often identical models — different billing, networking, and policy envelopes. We help pick based on your compliance story." },
      { q: "Can users sign in with Microsoft?", a: "Yes — OAuth/OIDC against Entra is a common pattern for internal tools." },
    ],
  },

  gemini: {
    iconKey: "googlegemini",
    title: "Google Gemini integration",
    metaTitle: "Gemini API & multimodal AI development — BalochDev",
    description:
      "BalochDev integrates Gemini for multimodal apps: text, code, images, and batch workloads — with Google Cloud-native patterns where clients already live.",
    keywords: [
      "Gemini API integration",
      "Google Gemini development",
      "multimodal AI apps",
      "Vertex AI Gemini",
      "BalochDev Gemini integration",
    ],
    heroLead:
      "Gemini fits when inputs mix modalities or Google Cloud is already home — without bolting on extra glue than necessary.",
    seoTitle: "How BalochDev integrates Google Gemini",
    seoBody:
      "Prospects searching Gemini development services often want summarization with charts, image-informed support bots, or batch labeling across Drive exports. BalochDev implements Gemini with clear modality boundaries: what gets sent where, how images are redacted, and how outputs are validated before writes. When latency dominates, we route lighter prompts to faster models within the same family.",
    introPanel: {
      kicker: "Multimodal lane",
      headline: "How BalochDev integrates Gemini features",
      tiles: [
        {
          label: "Messy inputs welcome",
          sub: "PDFs, charts, images, and long docs — one stack path without brittle adapters.",
        },
        {
          label: "GCP-native ops",
          sub: "Quotas, billing, and service accounts your cloud team already understands.",
        },
        {
          label: "Validation before writes",
          sub: "Redaction rules and checks so multimodal outputs don’t autoship risky edits.",
        },
        {
          label: "Latency-aware routing",
          sub: "Pick lighter Gemini tiers when speed beats maximal reasoning.",
        },
      ],
    },
    deliveryHeading: "Vision-aware workflows & batch Gemini jobs — BalochDev ships with clear modality boundaries.",
    why: [
      { title: "Native multimodal", text: "Single stack path for text + visuals without stitching fragile adapters." },
      { title: "Google-native ops", text: "Billing and quotas familiar to GCP teams." },
      { title: "Batch throughput", text: "Good fit for large offline pipelines paired with queues." },
      { title: "Portable prompts", text: "We keep core logic vendor-swappable behind interfaces." },
    ],
    deliveryTags: ["Vision-augmented workflows", "Workspace-aware glue", "Batch enrichment", "Customer portals", "Analytics copilots"],
    deliveryLead:
      "Security stays boring-in-the-best-way: scoped service accounts, VPC considerations when needed, and minimal retention of user media.",
    faq: [
      { q: "Gemini vs ChatGPT for my app?", a: "Multimodal + Google Cloud affinity pushes Gemini; ecosystem breadth sometimes pushes OpenAI — we prototype cheaply before committing." },
      { q: "Can Gemini call tools?", a: "Yes — we wrap tools with authenticated gateways mirroring our OpenAI patterns." },
    ],
  },

  deepseek: {
    iconKey: "deepseek",
    title: "DeepSeek APIs & deployments",
    metaTitle: "DeepSeek AI integration — BalochDev",
    description:
      "BalochDev integrates DeepSeek where cost or open-weight flexibility matters — with careful evaluation, routing, and governance beside frontier providers.",
    keywords: ["DeepSeek API integration", "cost-efficient LLM", "DeepSeek coding assistant", "alternative LLM provider", "BalochDev DeepSeek integration"],
    heroLead:
      "DeepSeek can punch above its price class for coding and reasoning — we validate quality on your domains before trading vendor maturity.",
    seoTitle: "How BalochDev evaluates & integrates DeepSeek",
    seoBody:
      "Teams exploring DeepSeek integration usually want cheaper inference on Llama-class behaviors or less vendor lock-in — often paired with self-hosted or regional constraints. BalochDev benchmarks against your evaluation sets, measures latency at your scale, and defines rollback routes to OpenAI or Anthropic when quality dips.",
    introPanel: {
      kicker: "Evaluation-first",
      headline: "How BalochDev trials DeepSeek seriously",
      tiles: [
        {
          label: "Benchmarks on your domains",
          sub: "No vanity demos — we score against your eval harness before widening traffic.",
        },
        {
          label: "Spend vs quality",
          sub: "Honest trade-offs when unit economics matter more than frontier prestige.",
        },
        {
          label: "Fallback routing",
          sub: "One adapter layer so swaps back to OpenAI or Anthropic stay operational.",
        },
        {
          label: "Compliance posture",
          sub: "Hosting path, logging, and SOC expectations documented early — no surprises.",
        },
      ],
    },
    deliveryHeading: "Cost-aware routing & hybrid prompts — BalochDev maps where DeepSeek earns its seat.",
    why: [
      { title: "Cost leverage", text: "Better unit economics on bursty or batch workloads." },
      { title: "Coding workloads", text: "Strong where repetition and codegen dominate." },
      { title: "Provider diversity", text: "Reduces single-vendor operational risk." },
      { title: "Honest limits", text: "We document where frontier models still win." },
    ],
    deliveryTags: ["Routing layers", "Hybrid prompts", "Offline-ish batch jobs", "Developer tooling", "Eval harnesses"],
    deliveryLead:
      "Security reviews focus on data residency, logging policies, and whether hosted endpoints meet your SOC expectations.",
    faq: [
      { q: "Is DeepSeek enterprise-ready?", a: "Depends on hosting path and contract — we map technical and legal constraints early." },
      { q: "Can we switch models later?", a: "Yes — we implement adapters so swaps are configuration-level where possible." },
    ],
  },

  groq: {
    iconKey: "groq",
    title: "Groq inference",
    metaTitle: "Groq LLM inference integration — BalochDev",
    description:
      "BalochDev wires Groq inference for streaming UX and bursty workloads — with sensible fallback when ultra-low latency is not the only KPI.",
    keywords: ["Groq API integration", "fast LLM inference", "streaming AI UX", "Groq Llama", "BalochDev Groq integration"],
    heroLead:
      "When milliseconds shape UX — live copilots, previews, and assistants — Groq inference can feel instantaneous.",
    seoTitle: "How BalochDev uses Groq for latency-first AI UX",
    seoBody:
      "Groq integration appeals when teams measure time-to-first-token as a product feature. BalochDev pairs fast endpoints with caching, prompt compaction, and graceful degradation when queues spike — so chat never flashes awkward silence.",
    introPanel: {
      kicker: "Latency lane",
      headline: "How BalochDev uses Groq for snappy UX",
      tiles: [
        {
          label: "Time-to-first-token",
          sub: "Copilots and previews that feel instant — BalochDev tunes streams for humans.",
        },
        {
          label: "Burst handling",
          sub: "Queues spike at launches — compaction and backoff keep UX composed.",
        },
        {
          label: "Caching where allowed",
          sub: "Repeatable prompts get smarter reuse without violating retention rules.",
        },
        {
          label: "Measured routing",
          sub: "Groq where speed pays; cheaper endpoints elsewhere — dashboards keep spend honest.",
        },
      ],
    },
    deliveryHeading: "Live assistants & inline editors — Groq when milliseconds shape BalochDev builds.",
    why: [
      { title: "Streaming feel", text: "Snappy tokens improve perceived intelligence." },
      { title: "Burst-friendly", text: "Handles spikes when launches spike traffic." },
      { title: "Cost-aware routing", text: "Use Groq where speed pays; cheaper endpoints elsewhere." },
    ],
    deliveryTags: ["Live assistants", "Inline editors", "Playgrounds", "Demos & sales tooling"],
    deliveryLead:
      "Security posture mirrors other providers: scoped keys, server-side calls, and rate limits aligned with product tiers.",
    faq: [
      { q: "Groq vs hosted GPUs?", a: "Groq wins operationally when you want API simplicity at extreme inference speeds." },
    ],
  },

  "xai-grok": {
    iconKey: "xai",
    title: "xAI Grok APIs",
    metaTitle: "xAI Grok integration — BalochDev",
    description:
      "BalochDev connects xAI Grok as part of a resilient provider ladder — failover and experimentation alongside OpenAI and Anthropic stacks.",
    keywords: ["xAI Grok API", "Grok integration developer", "multi-provider AI routing", "BalochDev Grok integration"],
    heroLead:
      "We treat Grok as part of a resilient provider ladder — not a monoculture bet.",
    seoTitle: "How BalochDev adds Grok to a multi-provider AI stack",
    seoBody:
      "Teams searching Grok integration often want diversification or unique model behaviors while preserving prompts and tools. BalochDev wraps providers behind interfaces, captures comparative evaluations, and exposes routing controls for ops teams.",
    introPanel: {
      kicker: "Provider ladder",
      headline: "How BalochDev trials Grok without rewrites",
      tiles: [
        {
          label: "Vendor abstraction",
          sub: "Prompts and tools stay stable — endpoints swap behind adapters BalochDev owns.",
        },
        {
          label: "Comparative evals",
          sub: "Side-by-side quality metrics before Grok graduates past canary cohorts.",
        },
        {
          label: "Ops routing controls",
          sub: "Config-level switches when incidents or pricing shift provider priority.",
        },
        {
          label: "Identity parity",
          sub: "OAuth, secrets, and rate limits identical across ladder slots.",
        },
      ],
    },
    deliveryHeading: "Router services & failover — BalochDev diversifies frontier APIs responsibly.",
    why: [
      { title: "Vendor diversity", text: "Reduce outage and pricing shock risk." },
      { title: "Routing controls", text: "Switch endpoints via config and telemetry." },
      { title: "Measured rollout", text: "Canary cohorts before broad exposure." },
    ],
    deliveryTags: ["Router services", "Eval dashboards", "Failover paths"],
    deliveryLead:
      "OAuth and secret hygiene stay identical across vendors — models swap; governance does not.",
    faq: [
      { q: "Should Grok be primary?", a: "Usually no initially — we prove fit with benchmarks tied to your success metrics." },
    ],
  },

  langchain: {
    iconKey: "langchain",
    title: "LangChain & LangGraph",
    metaTitle: "LangChain LangGraph agents — BalochDev",
    description:
      "BalochDev builds LangChain & LangGraph agent graphs, durable workflows, and tool orchestration — structured patterns beyond single-shot prompts.",
    keywords: ["LangChain developer", "LangGraph agents", "AI orchestration Python TypeScript", "tool calling agents", "BalochDev LangChain developers"],
    heroLead:
      "Agents fail loudly without graphs, retries, and traces — LangGraph helps us keep automation inspectable.",
    seoTitle: "How BalochDev builds agents with LangChain & LangGraph",
    seoBody:
      "BalochDev uses LangChain and LangGraph to turn brittle scripts into state machines: explicit branches for errors, human approvals on risky writes, and telemetry across nodes. That is how assistants graduate from demos to weekly ops.",
    introPanel: {
      kicker: "Orchestration",
      headline: "How BalochDev debugs agents with LangChain",
      tiles: [
        {
          label: "Graphs over vibes",
          sub: "Branches, retries, and traces replace spaghetti prompts — incidents become searchable.",
        },
        {
          label: "Typed tools",
          sub: "CRM, ticketing, and internal APIs behind gateways models never bypass silently.",
        },
        {
          label: "Human-in-loop pauses",
          sub: "High-stakes writes wait for approval — automation resumes cleanly.",
        },
        {
          label: "Regression on traces",
          sub: "Eval harness hooks before prompts mutate weekly ops reliability.",
        },
      ],
    },
    deliveryHeading: "Ticket triage & ops bots — LangGraph flows BalochDev can operate.",
    why: [
      { title: "Structured flows", text: "Branching beats spaghetti prompts." },
      { title: "Tool discipline", text: "Typed interfaces for CRMs, tickets, and internal APIs." },
      { title: "Human-in-loop", text: "Pause/resume patterns when stakes rise." },
      { title: "Eval hooks", text: "Regression tests on agent traces." },
    ],
    deliveryTags: ["Customer ops bots", "Ticket triage", "Research copilots", "Internal admin agents"],
    deliveryLead:
      "Security means sandboxed tools, audited scopes, and no silent privilege escalation — especially when OAuth connects SaaS systems.",
    faq: [
      { q: "LangChain vs rolling our own?", a: "We adopt libraries where they reduce risk — and peel back when they obscure control." },
      { q: "Python or JS?", a: "Both — matched to your backend and team skills." },
    ],
  },

  "github-copilot": {
    iconKey: "githubcopilot",
    title: "GitHub Copilot in delivery",
    metaTitle: "GitHub Copilot development workflows — BalochDev",
    description:
      "BalochDev applies GitHub Copilot inside disciplined SDLC: faster boilerplate, tests, and refactors — with review, CI, and security scanners as non-negotiables.",
    keywords: ["GitHub Copilot enterprise", "AI pair programming workflow", "Copilot CI integration", "BalochDev Copilot workflows"],
    heroLead:
      "Copilot shines on repetition — we keep architects owning invariants and juniors shipping confidently.",
    seoTitle: "How BalochDev uses GitHub Copilot on client projects",
    seoBody:
      "GitHub Copilot integration for agencies means consistency across repos: shared snippets, test skeletons, and conventions enforced by lint — Copilot accelerates inside those rails. BalochDev avoids generating secrets, tightens `.copilot` guidance per repo, and ensures license-aware usage for clients.",
    introPanel: {
      kicker: "IDE leverage",
      headline: "How BalochDev uses Copilot in client repos",
      tiles: [
        {
          label: "Boilerplate & tests",
          sub: "Faster first drafts for CRUD, adapters, and test suites — humans merge semantics.",
        },
        {
          label: "Conventions win",
          sub: "Lint and formatting remain authoritative — Copilot adapts to your rails.",
        },
        {
          label: "Org-safe defaults",
          sub: "Enterprise controls respected — prompts stay clear of prod secrets.",
        },
        {
          label: "License hygiene",
          sub: "Client-facing codebases get guidance BalochDev can defend in review.",
        },
      ],
    },
    deliveryHeading: "Copilot-accelerated SDLC — BalochDev pairs completions with mandatory CI.",
    why: [
      { title: "IDE-native", text: "Low friction adoption for most engineers." },
      { title: "Boilerplate killer", text: "Tests, CRUD, adapters — faster first drafts." },
      { title: "Org policies", text: "Business controls where enterprises require them." },
    ],
    deliveryTags: ["PR templates", "Unit/integration tests", "Migration chores", "Docs scaffolding"],
    deliveryLead:
      "OAuth-connected features never rely on Copilot seeing prod tokens — generation stays in dev contexts only.",
    faq: [
      { q: "Copilot vs Cursor?", a: "Copilot is lighter-touch completions; Cursor targets deeper repo edits — many teams use both." },
    ],
  },

  cursor: {
    iconKey: "cursor",
    title: "Cursor IDE acceleration",
    metaTitle: "Cursor AI IDE development workflows — BalochDev",
    description:
      "BalochDev uses Cursor for repo-aware AI editing — grounded in PR hygiene, CI, and security review rather than wholesale automated commits.",
    keywords: ["Cursor IDE development", "AI codebase editor workflow", "Cursor enterprise", "BalochDev Cursor workflows"],
    heroLead:
      "Cursor speeds exploration and multi-file edits — we channel it into mergeable PRs with reviewers accountable.",
    seoTitle: "How BalochDev accelerates delivery with Cursor IDE",
    seoBody:
      "Cursor development workflows emphasize indexing boundaries, avoiding secret leakage into prompts, and splitting giant AI patches into reviewable chunks — BalochDev pairs this with Copilot or Claude Code where roles clarify exploration vs completion vs batch refactors.",
    introPanel: {
      kicker: "Deep edits",
      headline: "How BalochDev wields Cursor safely",
      tiles: [
        {
          label: "Repo-wide context",
          sub: "Multi-file refactors with intent — split into reviewer-sized patches.",
        },
        {
          label: "Secret boundaries",
          sub: "Indexing excludes sensitive paths — prompts never meet prod credentials.",
        },
        {
          label: "Role clarity",
          sub: "Exploration in Cursor, completions elsewhere — fewer conflicting assumptions.",
        },
        {
          label: "Merge-ready outputs",
          sub: "BalochDev channels drafts into CI-backed PRs, not silent commits.",
        },
      ],
    },
    deliveryHeading: "Brown-field refactors & spikes — Cursor inside BalochDev’s PR hygiene.",
    why: [
      { title: "Whole-repo context", text: "Better cross-file consistency than line-only completion." },
      { title: "Natural-language edits", text: "Translate intent into diffs — still reviewed." },
      { title: "Team alignment", text: "Shared rules files keep outputs stylistically consistent." },
    ],
    deliveryTags: ["Feature spikes", "Refactors", "Framework migrations", "Bug hunts"],
    deliveryLead:
      "Large-scale apps benefit most when Cursor sits beside modular architecture — bounded contexts the AI cannot accidentally violate.",
    faq: [
      { q: "Does Cursor replace code review?", a: "Never — it reduces draft time; humans approve semantics and security." },
    ],
  },

  "vercel-ai-sdk": {
    iconKey: "vercel_ai_sdk",
    title: "Vercel AI SDK",
    metaTitle: "Vercel AI SDK streaming & Next.js AI — BalochDev",
    description:
      "BalochDev ships streaming AI UIs and tool calling on Next.js with Vercel AI SDK — edge-ready patterns aligned with modern deploys.",
    keywords: ["Vercel AI SDK developer", "Next.js streaming AI chat", "AI SDK tool calling", "React server actions AI", "BalochDev Vercel AI SDK"],
    heroLead:
      "When the surface is web-first, AI SDK gets prototypes to production streaming fast — still backed by solid auth.",
    seoTitle: "How BalochDev ships streaming AI with Vercel AI SDK",
    seoBody:
      "Teams searching Vercel AI SDK integration want resilient streaming endpoints, structured outputs in React, and hooks that fail gracefully offline. BalochDev pairs SDK primitives with session handling, rate limits, and provider adapters — so changing models later does not mean rewriting UI.",
    introPanel: {
      kicker: "Product UX",
      headline: "How BalochDev streams AI with the AI SDK",
      tiles: [
        {
          label: "Resilient streaming",
          sub: "Chat UX that degrades gracefully — retries and placeholders BalochDev users trust.",
        },
        {
          label: "Tool calling in React",
          sub: "Typed tools mirrored server-side — schemas stay aligned end-to-end.",
        },
        {
          label: "Sessions & limits",
          sub: "Auth-aware sessions, quotas per tier, and abuse-aware rate ceilings.",
        },
        {
          label: "Model adapters",
          sub: "Swap vendors via configuration — UI survives roadmap churn.",
        },
      ],
    },
    deliveryHeading: "Customer-facing chat & consoles — BalochDev’s Next.js streaming playbook.",
    why: [
      { title: "Streaming ergonomics", text: "Great DX for chat and incremental rendering." },
      { title: "Framework fit", text: "Natural pairing with App Router patterns." },
      { title: "Composable tools", text: "Typed tools mirror backend contracts." },
    ],
    deliveryTags: ["Customer-facing chat", "Internal consoles", "Marketing assistants", "Preview deployments"],
    deliveryLead:
      "OAuth flows stay server-side; browsers receive scoped tokens only where appropriate.",
    faq: [
      { q: "AI SDK vs raw fetch?", a: "SDK saves weeks on streaming UX and retries — we drop to fetch only when necessary." },
    ],
  },
};

export function getAiLandingSlugs() {
  return Object.keys(AI_TECH_LANDINGS);
}

export function getAiLandingPage(slug) {
  return slug ? AI_TECH_LANDINGS[slug] ?? null : null;
}
