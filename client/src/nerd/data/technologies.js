/** Curated stack groups — vendor blurbs for SEO + proposals; counts derive from items.length */

export const technologyGroups = [
  {
    id: 'ai',
    title: 'AI & Intelligence',
    subtitle: 'Foundation models and agent tools we wire into production.',
    items: [
      {
        iconKey: 'openai',
        name: 'OpenAI',
        role: 'AI models',
        since: '2022',
        blurb:
          'GPT-class models for chat, extraction, structured outputs, and agents — our default when latency and tooling maturity matter.',
      },
      {
        iconKey: 'anthropic',
        name: 'Anthropic',
        role: 'AI models',
        since: '2023',
        blurb:
          'Claude for long-context reasoning, document-heavy workflows, and safety-conscious assistants beside customer data.',
      },
      {
        iconKey: 'claude_code',
        name: 'Claude Code',
        role: 'AI coding',
        since: '2025',
        blurb:
          'Anthropic’s agentic coding workflow — we embed it in branches, CI, and review habits so speed gains land as mergeable work.',
      },
      {
        iconKey: 'microsoft',
        name: 'Microsoft AI · Azure OpenAI',
        role: 'Enterprise AI',
        since: '2023',
        blurb:
          'Azure OpenAI and Copilot-era APIs when clients need Microsoft-aligned tenancy, compliance paths, and Entra-style governance.',
      },
      {
        iconKey: 'googlegemini',
        name: 'Google Gemini',
        role: 'Multimodal AI',
        since: '2024',
        blurb:
          'Gemini for multimodal prompts, large batches, and Google-cloud-native integrations alongside Workspace and Vertex-style setups.',
      },
      {
        iconKey: 'deepseek',
        name: 'DeepSeek',
        role: 'Open weights · APIs',
        since: '2024',
        blurb:
          'Cost-efficient reasoning and coding-oriented models when self-hosted or vendor APIs fit your data residency plans.',
      },
      {
        iconKey: 'groq',
        name: 'Groq',
        role: 'Inference',
        since: '2024',
        blurb:
          'Groq inference for ultra-fast token delivery on Llama-class checkpoints — great for streaming UX and bursty workloads.',
      },
      {
        iconKey: 'xai',
        name: 'xAI · Grok',
        role: 'Frontier APIs',
        since: '2024',
        blurb:
          'Grok-family endpoints when teams want an alternative provider ladder alongside OpenAI and Anthropic for failover.',
      },
      {
        iconKey: 'langchain',
        name: 'LangChain · LangGraph',
        role: 'Agents · graphs',
        since: '2023',
        blurb:
          'Agent graphs, tool routing, and eval hooks — we use these patterns for reliable multi-step automation and RAG.',
      },
      {
        iconKey: 'githubcopilot',
        name: 'GitHub Copilot',
        role: 'AI coding',
        since: '2023',
        blurb:
          'IDE-native acceleration for boilerplate, tests, and refactors while humans review architecture and security.',
      },
      {
        iconKey: 'cursor',
        name: 'Cursor',
        role: 'AI IDE',
        since: '2024',
        blurb:
          'Repo-aware edits and chat inside the editor — speeds delivery without skipping code review or CI gates.',
      },
      {
        iconKey: 'vercel_ai_sdk',
        name: 'Vercel AI SDK',
        role: 'Streaming AI SDK',
        since: '2024',
        blurb:
          'Streaming chat UIs, tool calling, and structured outputs on Next.js — matches how we deploy edge-ready AI surfaces.',
      },
    ],
  },
  {
    id: 'automation',
    title: 'Automation & Workflows',
    subtitle: 'Orchestration and operational glue between SaaS, data, and AI.',
    items: [
      {
        iconKey: 'n8n',
        name: 'n8n',
        role: 'Workflow',
        since: '2023',
        blurb: 'Self-hostable automation with code nodes, queues, and AI steps — ideal when Zapier limits or privacy bite.',
      },
      {
        iconKey: 'make',
        name: 'Make',
        role: 'Orchestration',
        since: '2022',
        blurb:
          'Scenario builder for multi-branch integrations — we pair it with webhooks and lightweight APIs for hybrid stacks.',
      },
      {
        iconKey: 'zapier',
        name: 'Zapier',
        role: 'Integrations',
        since: '2022',
        blurb: 'Fast CRM → Slack → sheet triggers when visual authoring beats bespoke code for v1.',
      },
      {
        iconKey: 'google_apps_script',
        name: 'Google Apps Script',
        role: 'Workspace glue',
        since: '2022',
        blurb:
          'Sheets, Drive, and Gmail automation — perfect internal tooling without spinning a full backend.',
      },
      {
        iconKey: 'mcp',
        name: 'Model Context Protocol',
        role: 'AI integration',
        since: '2024',
        blurb:
          'MCP servers expose CRMs, docs, and internal APIs safely to assistants — structured tools instead of brittle prompts.',
      },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend Frameworks',
    subtitle: 'UI layers we ship and maintain in production.',
    items: [
      {
        iconKey: 'react',
        name: 'React',
        role: 'UI library',
        since: '2022',
        blurb: 'Component-first SPAs and islands — default choice with strict linting and accessible primitives.',
      },
      {
        iconKey: 'nextjs',
        name: 'Next.js',
        role: 'React framework',
        since: '2022',
        blurb: 'App Router, streaming, server actions — deployed at the edge with observability baked in.',
      },
      {
        iconKey: 'tailwind',
        name: 'Tailwind CSS',
        role: 'Styling',
        since: '2022',
        blurb: 'Design-token-driven utility styling — pairs with shadcn-style composition when projects demand it.',
      },
      {
        iconKey: 'bootstrap',
        name: 'Bootstrap',
        role: 'CSS framework',
        since: '2022',
        blurb:
          'Rapid marketing dashboards and admin shells where familiarity beats bespoke CSS — still semantic and responsive.',
      },
      {
        iconKey: 'typescript',
        name: 'TypeScript',
        role: 'Typed UI',
        since: '2022',
        blurb: 'Strict TS across React and Next — fewer runtime surprises on large component trees.',
      },
      {
        iconKey: 'react_native',
        name: 'React Native',
        role: 'Mobile',
        since: '2022',
        blurb: 'Cross-platform native surfaces sharing logic with web repos via monorepos.',
      },
      {
        iconKey: 'flutter',
        name: 'Flutter',
        role: 'Cross-platform',
        since: '2022',
        blurb: 'Dart-rendered mobile + web when pixel parity and offline UX dominate.',
      },
      {
        iconKey: 'vite',
        name: 'Vite',
        role: 'Build tool',
        since: '2023',
        blurb: 'Fast dev server + Rollup builds for SPA stacks outside Next.js.',
      },
      {
        iconKey: 'storybook',
        name: 'Storybook',
        role: 'UI QA',
        since: '2023',
        blurb: 'Component docs and visual regression hooks before merging risky UI refactors.',
      },
      {
        iconKey: 'googlegemini',
        name: 'Google AI Studio · MakerSuite',
        role: 'Front-end labs',
        since: '2024',
        blurb:
          'Prompt labs and Gemini snippets for marketing widgets and lightweight AI previews inside landing experiences.',
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backends & APIs',
    subtitle: 'Runtimes, frameworks, and managed platforms behind our apps.',
    items: [
      {
        iconKey: 'nodejs',
        name: 'Node.js',
        role: 'Runtime',
        since: '2022',
        blurb: 'HTTP APIs, webhooks, BFF layers — pairs with Next route handlers and serverless runners.',
      },
      {
        iconKey: 'express',
        name: 'Express · Fastify',
        role: 'HTTP frameworks',
        since: '2022',
        blurb:
          'Lean routers for microservices and webhook ingress — Fastify when throughput spikes.',
      },
      {
        iconKey: 'nestjs',
        name: 'NestJS',
        role: 'Structured APIs',
        since: '2023',
        blurb:
          'Opinionated modules for enterprise-grade REST + GraphQL services with DI and guards.',
      },
      {
        iconKey: 'python',
        name: 'Python · FastAPI',
        role: 'Python APIs',
        since: '2022',
        blurb:
          'Async ML gateways, RAG workers, and data ingestion — FastAPI default for typed endpoints.',
      },
      {
        iconKey: 'django',
        name: 'Django · Flask',
        role: 'Python web',
        since: '2022',
        blurb:
          'Admin-heavy APIs or pragmatic Flask microservices when batteries-included ORM wins.',
      },
      {
        iconKey: 'java',
        name: 'Java · Spring Boot',
        role: 'Enterprise JVM',
        since: '2022',
        blurb:
          'Spring Boot services for clients standardizing on JVM ops, tracing, and long-lived integrations.',
      },
      {
        iconKey: 'dotnet',
        name: '.NET · ASP.NET Core',
        role: 'Microsoft stack',
        since: '2023',
        blurb:
          'ASP.NET Core APIs where Azure AD and enterprise libraries already anchor your org.',
      },
      {
        iconKey: 'supabase',
        name: 'Supabase Edge Functions',
        role: 'Serverless API',
        since: '2023',
        blurb:
          'Edge JS/Deno functions beside Postgres auth — great for low-latency hooks next to RLS.',
      },
      {
        iconKey: 'graphql',
        name: 'GraphQL · Apollo',
        role: 'API layer',
        since: '2022',
        blurb:
          'Graph gateways when mobile + web need selective fields and persisted queries.',
      },
      {
        iconKey: 'xano',
        name: 'Xano · Backend-as-a-service',
        role: 'Managed backend',
        since: '2022',
        blurb:
          'Visual schemas when FlutterFlow or no-code builders need a compliant REST surface.',
      },
    ],
  },
  {
    id: 'data',
    title: 'Databases & Search',
    subtitle: 'Relational, document, vector, and graph patterns.',
    items: [
      {
        iconKey: 'postgresql',
        name: 'PostgreSQL',
        role: 'Relational',
        since: '2022',
        blurb: 'JSONB, pgvector, FTS — boring default for SaaS with Supabase or RDS-class hosts.',
      },
      {
        iconKey: 'mysql',
        name: 'MySQL · MariaDB',
        role: 'SQL',
        since: '2022',
        blurb:
          'Lift-and-shift LAMP stacks and managed relational tiers where InnoDB tuning matters.',
      },
      {
        iconKey: 'mongodb',
        name: 'MongoDB',
        role: 'Document',
        since: '2022',
        blurb:
          'Flexible catalogs and telemetry blobs — paired with strict indexing reviews.',
      },
      {
        iconKey: 'firebase',
        name: 'Firebase · Firestore',
        role: 'Realtime DB',
        since: '2022',
        blurb:
          'Realtime mobile sync and auth-backed documents — great with Flutter/React Native MVPs.',
      },
      {
        iconKey: 'supabase',
        name: 'Supabase Postgres',
        role: 'Managed Postgres',
        since: '2023',
        blurb:
          'Auth, RLS, storage, realtime channels — our everyday Postgres control plane.',
      },
      {
        iconKey: 'redis',
        name: 'Redis · caching',
        role: 'In-memory',
        since: '2022',
        blurb:
          'Queues, rate limits, session caches — trims latency on Node and Python APIs.',
      },
      {
        iconKey: 'prisma',
        name: 'Prisma · Drizzle',
        role: 'ORM · SQL toolkit',
        since: '2023',
        blurb:
          'Schema migrations and type-safe queries across Postgres/MySQL — fewer drift bugs.',
      },
      {
        iconKey: 'qdrant',
        name: 'Qdrant · pgvector',
        role: 'Vector search',
        since: '2024',
        blurb:
          'Embeddings for RAG — pgvector first; Qdrant when billions of vectors need isolation.',
      },
      {
        iconKey: 'neo4j',
        name: 'Neo4j · graph patterns',
        role: 'Graph intelligence',
        since: '2023',
        blurb:
          'Relationship-heavy domains — fraud graphs, recommendations, and policy traversal APIs.',
      },
      {
        iconKey: 'elastic',
        name: 'Elastic · OpenSearch',
        role: 'Search indices',
        since: '2022',
        blurb:
          'Full-text + faceted search layers beside Postgres — tuned relevance for catalogs.',
      },
    ],
  },
  {
    id: 'nocode',
    title: 'No-Code & CMS',
    subtitle: 'Platforms when launch speed beats bespoke engineering.',
    items: [
      {
        iconKey: 'shopify',
        name: 'Shopify · Liquid',
        role: 'Commerce themes',
        since: '2022',
        blurb:
          'Liquid sections, checkout UX, and app bridges — headless only when SEO demands it.',
      },
      {
        iconKey: 'wordpress',
        name: 'WordPress · WooCommerce',
        role: 'CMS · commerce',
        since: '2022',
        blurb:
          'Editor-friendly landing stacks with Woo flows — hardened plugins and staging pipelines.',
      },
      {
        iconKey: 'webflow',
        name: 'Webflow',
        role: 'Visual CMS',
        since: '2022',
        blurb:
          'Marketing sites your team edits — interactions without throwing away accessibility.',
      },
      {
        iconKey: 'wix',
        name: 'Wix Studio',
        role: 'Site builder',
        since: '2022',
        blurb:
          'Business templates + Velo hooks — fastest route for SMB launches with booking flows.',
      },
      {
        iconKey: 'squarespace',
        name: 'Squarespace',
        role: 'Portfolio CMS',
        since: '2022',
        blurb:
          'Brand-forward brochure sites when clients want polish without a dev seat.',
      },
      {
        iconKey: 'weebly',
        name: 'Weebly · Square Online',
        role: 'Light ecommerce',
        since: '2022',
        blurb:
          'Tiny SKU catalogs or scheduling storefronts — pragmatic when budgets are tight.',
      },
      {
        iconKey: 'bubble',
        name: 'Bubble · FlutterFlow',
        role: 'Visual apps',
        since: '2022',
        blurb:
          'Visual CRUD apps shipping fast — we extend with plugins/APIs when logic caps appear.',
      },
    ],
  },
  {
    id: 'languages',
    title: 'Languages',
    subtitle: 'Languages we hand-write — typed where it pays off.',
    items: [
      {
        iconKey: 'typescript',
        name: 'TypeScript · JavaScript',
        role: 'JS ecosystem',
        since: '2022',
        blurb:
          'Strict TS on servers + browsers; JS where legacy demands pragmatic looseness.',
      },
      {
        iconKey: 'python',
        name: 'Python',
        role: 'General purpose',
        since: '2022',
        blurb:
          'ML stacks, scripts, ETL — shared tooling with FastAPI and notebooks.',
      },
      {
        iconKey: 'dart',
        name: 'Dart',
        role: 'Flutter native',
        since: '2022',
        blurb:
          'Platform channels and performant widgets outside generic Material defaults.',
      },
      {
        iconKey: 'kotlin',
        name: 'Kotlin',
        role: 'Android · JVM',
        since: '2022',
        blurb:
          'Android-native modules and JVM services interoperating with Spring ecosystems.',
      },
      {
        iconKey: 'java',
        name: 'Java',
        role: 'Enterprise services',
        since: '2022',
        blurb:
          'Interop with banks and ERP adapters — stable bytecode targets on Linux VMs.',
      },
      {
        iconKey: 'csharp',
        name: 'C# · .NET',
        role: 'Microsoft ecosystem',
        since: '2023',
        blurb:
          'ASP.NET microservices and tooling integrations alongside Azure-hosted estates.',
      },
      {
        iconKey: 'php',
        name: 'PHP · Laravel',
        role: 'Web scripting',
        since: '2022',
        blurb:
          'WordPress extensions and Laravel APIs — hardened deployments behind proxies.',
      },
      {
        iconKey: 'html_css',
        name: 'HTML · CSS · modern specs',
        role: 'Foundations',
        since: '2022',
        blurb:
          'Semantic markup, responsive layouts, and progressive enhancement — baseline for every UI.',
      },
    ],
  },
  {
    id: 'ops',
    title: 'Deploy & Ops',
    subtitle: 'Hosts, containers, and reliability rails.',
    items: [
      {
        iconKey: 'vercel',
        name: 'Vercel',
        role: 'Edge deploy',
        since: '2022',
        blurb:
          'Preview URLs, fluid compute, instant rollbacks — aligned with Next.js workflows.',
      },
      {
        iconKey: 'cloudflare',
        name: 'Cloudflare Workers · Pages',
        role: 'Edge network',
        since: '2022',
        blurb:
          'Workers for middleware, security, and globe-spanning latency tricks.',
      },
      {
        iconKey: 'docker',
        name: 'Docker · Compose',
        role: 'Containers',
        since: '2022',
        blurb:
          'Identical images across dev, CI, and prod VMs — Compose for local parity.',
      },
      {
        iconKey: 'railway',
        name: 'Railway · Render',
        role: 'PaaS',
        since: '2023',
        blurb:
          'Managed services with Postgres add-ons — speedy backends without k8s overhead.',
      },
      {
        iconKey: 'custom_vm',
        name: 'Custom VMs · bare metal',
        role: 'Self-managed',
        since: '2022',
        blurb:
          'Provisioned servers (Hetzner, DO, AWS EC2) when compliance or GPUs demand owned infra.',
      },
      {
        iconKey: 'github',
        name: 'GitHub Actions · CI',
        role: 'Delivery',
        since: '2022',
        blurb:
          'Lint, test, preview deploys — integrated branch protections humans actually respect.',
      },
    ],
  },
  {
    id: 'design',
    title: 'Design & Handoff',
    subtitle: 'From exploration to dev-ready specs.',
    items: [
      {
        iconKey: 'figma',
        name: 'Figma',
        role: 'Product design',
        since: '2022',
        blurb:
          'Components, variables, dev mode — single source for tokens feeding Tailwind themes.',
      },
      {
        iconKey: 'canva',
        name: 'Canva',
        role: 'Brand collateral',
        since: '2023',
        blurb:
          'Marketing-ready layouts clients can iterate — exported cleanly for dev reuse.',
      },
      {
        iconKey: 'photoshop',
        name: 'Adobe Photoshop',
        role: 'Raster craft',
        since: '2022',
        blurb:
          'Photo comps, texture work, and legacy PSD pipelines feeding modern SVG stacks.',
      },
      {
        iconKey: 'design_alt',
        name: 'Penpot · Design alternatives',
        role: 'Open tooling',
        since: '2024',
        blurb:
          'OSS-friendly handoff when teams want self-hosted design parity outside Figma-only stacks.',
      },
      {
        iconKey: 'storybook',
        name: 'Storybook · Chromatic',
        role: 'UI QA handoff',
        since: '2023',
        blurb:
          'Living documentation bridging designers and engineers with visual diff gates.',
      },
    ],
  },
];

export const principles = [
  {
    n: '01',
    title: 'Speed to revenue first',
    text: 'Pick the fastest tool that holds 12 months of growth. Re-platform later if needed.',
  },
  {
    n: '02',
    title: 'Boring where it matters',
    text: 'Postgres, TypeScript, proven runtimes. Novelty belongs in the UX.',
  },
  {
    n: '03',
    title: 'Own the edit layer',
    text: 'Whatever we ship, your team can run it — CMS, no-code, or a clean admin.',
  },
  {
    n: '04',
    title: 'AI as a teammate',
    text: 'Agents scaffold, test, and review. Humans decide what ships.',
  },
];

export const stackCombos = [
  { product: 'Marketing site', stack: 'Webflow + Figma', why: 'Fast launch, marketing-owned, SEO-ready.' },
  { product: 'AI-first SaaS', stack: 'Next.js + Supabase + OpenAI', why: 'Custom UX, RLS, pgvector for RAG.' },
  { product: 'Native mobile', stack: 'FlutterFlow + Xano', why: 'One codebase, editable surface for ops.' },
  { product: 'Workflow automation', stack: 'n8n + Python', why: 'Event-driven agents with self-hosted control.' },
];

export const faqItems = [
  {
    q: 'What technologies do you use?',
    a: 'We pair frontier AI APIs with React/Next.js, Flutter, Supabase, Firebase, Postgres, automation (n8n, Make, Apps Script), and deploy across Vercel, Cloudflare, Railway, and dedicated VMs — plus no-code when speed wins.',
  },
  {
    q: 'No-code, custom code, or both?',
    a: 'Both. We pick the fastest path per milestone, then harden with code where scale or security demands it.',
  },
  {
    q: 'How do you deploy?',
    a: 'Typically Vercel or Cloudflare for edge-ready frontends, Dockerized services on Railway/Render or customer VMs, with observability from day one.',
  },
  {
    q: 'Do you build web applications with React and Next.js?',
    a: 'Yes. We ship production React and Next.js apps with server components or SPA patterns where appropriate, TypeScript by default, and SEO-aware routing when marketing pages live in the same codebase.',
  },
  {
    q: 'What backend stack do you use for APIs and databases?',
    a: 'We commonly use Node (Nest/Express), Python (Django and scripts), GraphQL or REST, and Postgres via Supabase or managed Postgres — plus Redis, Firebase, or MongoDB when the data model fits.',
  },
  {
    q: 'How do you add AI or ChatGPT-style features to a web application?',
    a: 'We integrate frontier APIs such as OpenAI and Anthropic, structure prompts and guardrails, add retrieval (RAG) over your Postgres or vector store when needed, and keep latency and cost under control with caching and streaming.',
  },
  {
    q: 'Which programming languages do your developers write in?',
    a: 'Day to day: TypeScript and JavaScript for web, Dart for Flutter, Python for backends and automation, plus Kotlin, Java, PHP, and C# when a codebase or integration demands it.',
  },
  {
    q: 'How do you help teams choose a technology stack for an MVP?',
    a: 'We anchor on time-to-market, team skill, compliance, and 12-month scale — then recommend a narrow stack (usually listed on this page), explicit boundaries between services, and a migration path if we start with no-code.',
  },
  {
    q: 'Do you provide DevOps, CI/CD, and cloud hosting?',
    a: 'We wire repositories to CI/CD, environment previews, secrets handling, and production deploy targets (Vercel, Cloudflare, Railway, Kubernetes or VMs) so releases stay repeatable without one-off manual deploys.',
  },
];
