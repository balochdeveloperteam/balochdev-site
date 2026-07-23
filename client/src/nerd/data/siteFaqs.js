/**
 * Dedicated /faq page — competitor-breadth Q&As adapted for BalochDev.
 * Shape matches FaqAccordion: { q, a }.
 */

/** @typedef {{ q: string, a: string }} FaqItem */
/** @typedef {{ id: string, title: string, blurb?: string, items: FaqItem[] }} FaqCategory */

/** @type {FaqCategory[]} */
export const FAQ_CATEGORIES = [
  {
    id: 'company',
    title: 'About BalochDev',
    blurb: 'Who we are, where we’re based, and how we work.',
    items: [
      {
        q: 'What is BalochDev?',
        a: 'BalochDev is an AI-first custom software studio. We design and build web apps, mobile apps, and AI products for international clients — and we advance Balochi language technology with community partners. Claude Code, agents, and modern frameworks sit inside our toolchain so a focused senior team ships faster without skipping review.',
      },
      {
        q: 'Where is BalochDev based?',
        a: 'We are a remote-first studio rooted in Balochistan, working with clients across the Middle East, Europe, North America, and beyond. Optional meetups in Qatar, Dubai, Bahrain, and the region when face-to-face helps.',
      },
      {
        q: 'When was BalochDev founded?',
        a: 'BalochDev has been shipping since 2024 — client products, AI systems, and Balochi language technology in parallel. The studio is young by design: modern stack, AI in the toolchain, and a clear dual mission from day one.',
      },
      {
        q: 'How big is the team?',
        a: 'We work with 20+ senior specialists across engineering, design, content, and ops. Our core delivery team is 14+ people — the same faces in kickoff as in standups months later. No junior bench shuffled onto your project.',
      },
      {
        q: 'What does “AI-first” actually mean here?',
        a: 'Claude Code, agents, and modern frameworks sit inside our toolchain on every project. They compress scoping, build, and review loops — they do not replace senior architecture, compliance judgment, or code ownership.',
      },
      {
        q: 'Do you work with startups or established companies?',
        a: 'Both. We ship MVPs for founders and production features for operators inside larger companies. The scoping conversation is the same: clear problem, honest fit, fixed milestones when scope is stable.',
      },
      {
        q: 'Do you only work on Balochi language projects?',
        a: 'No. Most engagements are commercial web, mobile, and AI products for international clients. Balochi language technology is our highest-priority community mission — funded alongside client work, not a requirement for hiring us.',
      },
      {
        q: 'Why choose BalochDev over a larger agency?',
        a: 'Senior people on every project, AI in the toolchain (not just the pitch), code in your repo from day one, and honest “no” when we are not the right fit. You get continuity and ownership — not a B-team handoff.',
      },
    ],
  },
  {
    id: 'services-ai',
    title: 'Services & AI',
    blurb: 'What we build — web, mobile, agents, RAG, and automation.',
    items: [
      {
        q: 'What services does BalochDev offer?',
        a: 'Custom software across web, mobile, and AI: web applications, cross-platform apps, LLM integrations, RAG, agents, chatbots, UX/UI, MVPs, workflow automation, and production hosting on modern stacks.',
      },
      {
        q: 'What types of AI applications do you build?',
        a: 'LLM integrations, RAG over your documents, AI agents, chatbots, extraction pipelines, recommendations, and intelligent workflow automation — for first AI features and for teams adding AI to mature products.',
      },
      {
        q: 'What is RAG and why does it matter?',
        a: 'RAG (Retrieval Augmented Generation) connects large language models to your own data — docs, databases, knowledge bases — so answers are grounded in company-specific information instead of generic web knowledge.',
      },
      {
        q: 'What is an AI agent and how is it different from a chatbot?',
        a: 'A chatbot answers and routes conversations. An agent can plan steps, call tools (CRM, docs, calendars, APIs), and complete multi-step work with guardrails. Many products need both.',
      },
      {
        q: 'How are BalochDev chatbots different from template bots?',
        a: 'We build custom LLM chatbots that understand context, handle complex queries, and answer from your data — far beyond rigid decision-tree templates. Deploy on your site, app, or messaging channels with consistent context.',
      },
      {
        q: 'Can you integrate AI into our existing application?',
        a: 'Yes — that is a large share of the work. We add search, assistants, generation, or automation without breaking what already works, with staging reviews and guardrails.',
      },
      {
        q: 'Do you build workflow automation?',
        a: 'Yes — automation that replaces repetitive ops glue (spreadsheets, ad-hoc Zapier chains) with purpose-built flows, often combining AI with your existing tools and APIs.',
      },
      {
        q: 'What kinds of business apps do you build?',
        a: 'Dashboards, CRMs, marketplaces, internal tools, customer portals, MVPs, RAG platforms, and AI-enabled products — custom builds on modern infrastructure, not configured templates.',
      },
      {
        q: 'Can you redesign an existing application?',
        a: 'Yes. We start with a quick audit (and analytics when available) before redesigning. Most failed redesigns treat the UI as the problem when the real issue is inconsistent patterns or unclear information architecture.',
      },
      {
        q: 'Do you design and develop end-to-end?',
        a: 'Yes. From discovery and design through frontend, backend, and deployment — you get a production-ready product, not a deck someone else has to build.',
      },
    ],
  },
  {
    id: 'ai-first',
    title: 'AI-first development',
    blurb: 'How AI actually shows up in the work — honestly.',
    items: [
      {
        q: 'What is AI-assisted development at BalochDev?',
        a: 'Engineers use production-grade tools — Claude Code, Cursor, Copilot — inside the codebase. AI handles boilerplate and first drafts; senior engineers own architecture, business logic, and quality.',
      },
      {
        q: 'Isn’t this just pasting from ChatGPT?',
        a: 'No. Tools like Claude Code operate in the repo — not copy-paste from a chat window. Every meaningful change is reviewed by an experienced engineer before it ships.',
      },
      {
        q: 'How much faster is AI-assisted delivery?',
        a: 'Typically much faster on the mechanical layer — scaffolding, boilerplate, tests, and first-draft code — so focused MVPs that once took months can land in weeks when scope is clear. Quality gates stay the same.',
      },
      {
        q: 'Will my code be buggy because AI wrote it?',
        a: 'Every line that ships is reviewed. Most bugs come from ambiguous requirements, not the tool — which is why we invest in a clear spec before accelerating the build.',
      },
      {
        q: 'Is AI-assisted software production-ready?',
        a: 'Yes. Code review, testing, staging, and security-minded checks still apply. AI accelerates writing; humans ensure quality and ownership.',
      },
      {
        q: 'Which AI coding tools do you use?',
        a: 'Primarily Claude Code, with Cursor and GitHub Copilot as needed. They accelerate work across React, Next.js, Node, Python, and the rest of our stack.',
      },
      {
        q: 'Which AI models do you build products on?',
        a: 'We pick per project — commonly Claude, OpenAI, Gemini, and others when fit. You keep ownership of accounts and billing where that matters for compliance.',
      },
      {
        q: 'What does AI NOT do in your process?',
        a: 'It does not own architecture decisions, compliance docs, senior reviews, or final UX judgment. Engineers own those; AI compresses the loops between them.',
      },
      {
        q: 'Will AI replace my team if we hire BalochDev?',
        a: 'No. You keep your repo, product, and org chart. We compress delivery loops with senior people still accountable.',
      },
    ],
  },
  {
    id: 'web-mobile',
    title: 'Web & mobile',
    blurb: 'Websites, web apps, PWAs, and store-ready mobile.',
    items: [
      {
        q: 'Do you build websites or web applications?',
        a: 'Both. Marketing sites and SEO-aware brochure experiences, plus multi-role web apps with auth, dashboards, payments, and APIs — typically React/Next.js with a production backend.',
      },
      {
        q: 'What’s the difference between web, mobile, and PWA?',
        a: 'Web apps live in the browser with logins and business logic. Native/cross-platform apps ship to App Store / Play Store with device APIs. PWAs install to the home screen, can work offline, and skip store review — a fit when store fees or review friction hurt the product.',
      },
      {
        q: 'What platforms do you build mobile apps for?',
        a: 'iOS and Android — usually React Native or Flutter for one codebase, both stores. Native Swift/Kotlin when platform-specific APIs demand it; PWAs when stores are optional.',
      },
      {
        q: 'React Native or Flutter — which should we choose?',
        a: 'Depends on your team, timeline, and existing stack. React Native fits JS/TS shops; Flutter shines for highly custom UI consistency. We recommend after discovery, not a slogan.',
      },
      {
        q: 'Do you publish apps to the App Store and Google Play?',
        a: 'Yes — listings, screenshots, privacy labels, and submission. First submissions are rarely approved on both stores the same day, so we budget a resubmit cycle into timelines.',
      },
      {
        q: 'Do you build the backend too, or just the app?',
        a: 'Both. Most projects include API, database, auth, and cloud deploy. We do not hand off half an app.',
      },
      {
        q: 'Is SEO included in web builds?',
        a: 'Technical SEO foundations are part of delivery: clean structure, performance awareness, metadata, and crawlable routes. Ongoing content SEO can be added after launch.',
      },
      {
        q: 'Do you design mobile-first?',
        a: 'Yes. Responsive, mobile-first layouts are standard — every critical flow is checked across phone, tablet, and desktop breakpoints.',
      },
      {
        q: 'Can you redesign an existing website?',
        a: 'Yes. We audit conversion and UX bottlenecks, then modernize for speed, clarity, and mobile performance — with your brand intact.',
      },
    ],
  },
  {
    id: 'process',
    title: 'Process & engagement',
    blurb: 'Sprints, discovery, timelines, and how builds run.',
    items: [
      {
        q: 'What engagement models do you offer?',
        a: 'Fixed-milestone builds, discovery/scoping sprints, embedded work inside your repo, and ongoing retainers when feasible. Most clients start with discovery or a fixed MVP once scope is clear.',
      },
      {
        q: 'How do you run a build?',
        a: 'Clear milestones with working software you can click — weekly demos, staging before production, and reviews in your repo rather than status decks alone.',
      },
      {
        q: 'What happens in discovery?',
        a: 'Discovery turns a rough idea into a concrete scope — typically days to about two weeks — producing a brief stable enough to estimate and fix-price the build.',
      },
      {
        q: 'What if my project isn’t scoped enough for a fixed price?',
        a: 'Common. We run a short Scope + Spec phase first. If scope stays genuinely ambiguous, we use milestone time-and-materials with transparent logging until it stabilizes.',
      },
      {
        q: 'Can you embed inside our existing team?',
        a: 'Yes. We can work in your repo, match conventions, and hand off to your engineers — embedded delivery without locking you into a forever maintenance contract.',
      },
      {
        q: 'How long does an MVP usually take?',
        a: 'Focused MVPs often land in weeks to about 1.5 months from a clear brief. Larger SaaS, commerce, or AI platforms run longer with fixed milestones and weekly demos.',
      },
      {
        q: 'How long does a custom AI feature take?',
        a: 'A single AI feature into an existing app can ship in a few weeks. Broader AI products (RAG, agents, multi-channel) commonly run 6–12+ weeks depending on data and integrations.',
      },
      {
        q: 'How long does a mobile app take?',
        a: 'Cross-platform MVPs typically land in the multi-week to few-month range including store prep. PWAs can be faster when stores are not required. Complexity and integrations drive the range.',
      },
      {
        q: 'How is the project managed?',
        a: 'A clear owner on our side, async updates (Discord or your channel), and demos on a predictable cadence. Budgets are tracked per milestone, not as open-ended hourly fog.',
      },
    ],
  },
  {
    id: 'pricing',
    title: 'Pricing & estimates',
    blurb: 'How we quote — and how to get a fast range.',
    items: [
      {
        q: 'How do you price projects?',
        a: 'Loaded, all-in milestone numbers — not opaque rate cards. When scope is locked you get a fixed quote. Use the free AI estimate for a fast ballpark, then we refine on a call or proposal.',
      },
      {
        q: 'Is the AI estimate free?',
        a: 'Yes. It gives a fast cost range for websites, web apps, mobile, or AI features. It is a starting point — discovery turns it into a concrete quote.',
      },
      {
        q: 'Why is AI-assisted delivery often more affordable?',
        a: 'AI accelerates boilerplate and first drafts — the hours that usually inflate agency bills. You still pay for engineering judgment, architecture, and review; fewer wasted hours to the same output.',
      },
      {
        q: 'Do you require a deposit?',
        a: 'Typically yes — milestones start after agreement and an initial payment or platform escrow (e.g. Upwork) when you prefer that path.',
      },
      {
        q: 'How do international payments and contracts work?',
        a: 'Clear SOW/NDA, then milestones, deposit, or freelance platforms. International clients are normal — written English delivery and timezone overlap are standard.',
      },
      {
        q: 'Are there surprise invoices?',
        a: 'Not for locked scope. If you change scope mid-build, we re-estimate the delta before work continues — no silent burn.',
      },
      {
        q: 'Who owns the source code and IP?',
        a: 'You do. Code lives in your repository from the first commit. We retain no rights to client work and do not reuse your code across other clients.',
      },
    ],
  },
  {
    id: 'stack',
    title: 'Technology & stack',
    blurb: 'What we ship with — and what we take over.',
    items: [
      {
        q: 'What stack do you ship with?',
        a: 'React, Next.js, TypeScript, Node, Python/FastAPI, Supabase/Postgres, Cloudflare Workers & Pages, Vercel, and major LLM APIs. Boring, proven tools for the parts that must not fail.',
      },
      {
        q: 'Do you work with Supabase and Cloudflare?',
        a: 'Yes — Supabase for Auth, Postgres, RLS, and realtime; Cloudflare for Workers, Pages, and edge delivery. A common pairing on BalochDev products.',
      },
      {
        q: 'Can you take over an existing codebase?',
        a: 'Often yes, after a short audit. We stabilize what is salvageable, then ship milestones — better than a full rewrite when the core is sound.',
      },
      {
        q: 'Do you support no-code tools?',
        a: 'When they fit a fast MVP or migration path. For long-lived products we usually recommend owned code so you are not locked into a platform’s ceiling.',
      },
      {
        q: 'Will we be locked into your hosting?',
        a: 'No. We prefer infrastructure you control — your Cloudflare, Vercel, or cloud accounts — with credentials and runbooks handed over.',
      },
      {
        q: 'How do you handle security and secrets?',
        a: 'Environment isolation, least-privilege keys, and no secrets in the client. Sensitive work gets staging reviews and sensible defaults before production.',
      },
    ],
  },
  {
    id: 'working',
    title: 'Working with us',
    blurb: 'Communication, handoff, and post-launch support.',
    items: [
      {
        q: 'How do remote projects stay on track?',
        a: 'Weekly demos, staging URLs, Discord (or your channel), and protected branches. You see real progress every week — not a black-box dump at the end.',
      },
      {
        q: 'What time zones do you cover?',
        a: 'Remote-first with overlap for Middle East, Europe, and many US hours. Async updates fill the gaps so progress does not wait on a single standup.',
      },
      {
        q: 'Do you offer ongoing maintenance after launch?',
        a: 'Yes, when scoped — monitoring, dependency updates, small features, and hosting ops. Hand-off to your team is always available; maintenance is optional.',
      },
      {
        q: 'What does handoff include?',
        a: 'Your repo, environments, credentials you own, deploy notes, and a walkthrough. The goal is that your team (or a future hire) can continue without us.',
      },
      {
        q: 'Can you work alongside our in-house engineers?',
        a: 'Yes. We match conventions, leave clear PRs, and teach the workflow so someone internal can continue after we leave.',
      },
      {
        q: 'What if something breaks after launch?',
        a: 'Warranty windows and retainer support can be scoped per project. Critical production issues get priority when we are on a support agreement.',
      },
    ],
  },
  {
    id: 'mission',
    title: 'Balochi mission',
    blurb: 'Language technology with the community — not over it.',
    items: [
      {
        q: 'What is BalochDev’s highest-priority community work?',
        a: 'Advancing Balochi language technology — keyboards, browser and office support, ethical AI, and community partnership — while delivering client software that funds the mission.',
      },
      {
        q: 'How do you partner with the Balochi community?',
        a: 'With educators and native speakers — never over them. Work with partners like Balochi Academy stays grounded in real usage, not extractive data grabs.',
      },
      {
        q: 'Can client work and the language mission coexist on one roadmap?',
        a: 'Yes. Client delivery has clear milestones; language initiatives run as parallel tracks with their own partners and goals. One does not silently steal budget from the other.',
      },
    ],
  },
  {
    id: 'start',
    title: 'Getting started',
    blurb: 'The fastest paths from idea to first milestone.',
    items: [
      {
        q: 'How do we start?',
        a: 'Run the AI estimate, send a proposal, or contact us for a short discovery call. Bring the product idea, constraints, and a rough budget — we will say honestly whether we are the right fit.',
      },
      {
        q: 'What should I prepare before the first call?',
        a: 'The problem you are solving, who the users are, any must-have integrations, timeline pressure, and a budget range. Rough wires or competitor links help — polish is optional.',
      },
      {
        q: 'Can you help validate an idea before we build?',
        a: 'Yes — discovery, competitive scans, and clickable prototypes so you can test assumptions before committing to a full build.',
      },
      {
        q: 'What if you are not the right fit?',
        a: 'We will say so early and, when we can, point you toward a better path. A bad engagement costs both sides more than an honest no.',
      },
      {
        q: 'Where can I see your work?',
        a: 'Browse the portfolio for selected products, or start on About to meet the team. Live links are listed when clients allow public demos.',
      },
    ],
  },
];

/** Flat list for FAQPage JSON-LD. */
export const SITE_FAQS = FAQ_CATEGORIES.flatMap((c) => c.items);

/** Short teaser set for the About page. */
export const ABOUT_FAQ_TEASER = [
  FAQ_CATEGORIES[0].items[1], // where based
  FAQ_CATEGORIES[0].items[3], // team size
  FAQ_CATEGORIES[0].items[4], // AI-first
  FAQ_CATEGORIES[5].items[0], // pricing
  FAQ_CATEGORIES[5].items[6], // IP
  FAQ_CATEGORIES[9].items[0], // how to start
];
