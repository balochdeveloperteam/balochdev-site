/** Curated stack groups — short blurbs for launch; expand later. */
export const techStats = { total: 48, groups: 9 };

export const technologyGroups = [
  {
    id: 'ai',
    title: 'AI & Intelligence',
    subtitle: 'Foundation models and agent tools.',
    count: 12,
    items: [
      { abbr: 'O', name: 'OpenAI', role: 'AI models', since: '2022', blurb: 'GPT-class models for chat, extraction, and agents in production.' },
      { abbr: 'A', name: 'Anthropic', role: 'AI models', since: '2023', blurb: 'Claude for long-context reasoning and safety-critical workflows.' },
      { abbr: '⌘', name: 'Cursor', role: 'AI IDE', since: '2024', blurb: 'AI-native editor for faster refactors and full-stack work.' },
      { abbr: '✦', name: 'Google Gemini', role: 'AI models', since: '2024', blurb: 'Multimodal tasks — documents, images, huge context.' },
      { abbr: 'GH', name: 'GitHub Copilot', role: 'AI coding', since: '2023', blurb: 'Pair programming in the IDE alongside your team.' },
      { abbr: 'AI', name: 'Vercel AI SDK', role: 'AI SDK', since: '2024', blurb: 'Streaming UIs, tool calls, structured outputs in TypeScript.' },
    ],
  },
  {
    id: 'automation',
    title: 'Automation & Workflows',
    subtitle: 'Orchestration and operational glue.',
    count: 5,
    items: [
      { abbr: 'n8', name: 'n8n', role: 'Workflow', since: '2023', blurb: 'Self-hostable automations with code nodes and AI primitives.' },
      { abbr: 'Z', name: 'Zapier', role: 'Integrations', since: '2022', blurb: 'Fast triggers between CRMs, email, and chat.' },
      { abbr: 'MCP', name: 'MCP', role: 'AI integration', since: '2024', blurb: 'Structured tool access for assistants and agents.' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend Frameworks',
    subtitle: 'UI layers we ship to production.',
    count: 5,
    items: [
      { abbr: '⚛', name: 'React', role: 'UI', since: '2022', blurb: 'Default UI layer for custom web products.' },
      { abbr: 'N', name: 'Next.js', role: 'React framework', since: '2022', blurb: 'App Router, RSC, streaming — deployed at the edge.' },
      { abbr: 'RN', name: 'React Native', role: 'Mobile', since: '2022', blurb: 'Native iOS + Android from one TypeScript codebase.' },
      { abbr: '~', name: 'Tailwind CSS', role: 'Styling', since: '2022', blurb: 'Utility-first styling with design tokens.' },
      { abbr: '◣', name: 'Flutter', role: 'Cross-platform', since: '2022', blurb: 'Dart SDK for mobile, web, and desktop from one repo.' },
    ],
  },
  {
    id: 'backend',
    title: 'Backends & APIs',
    subtitle: 'Runtimes and managed platforms.',
    count: 4,
    items: [
      { abbr: '⬢', name: 'Node.js', role: 'Runtime', since: '2022', blurb: 'APIs, real-time, and Next.js backends.' },
      { abbr: '⚡', name: 'FastAPI', role: 'Python API', since: '2022', blurb: 'Async Python when ML, data, or RAG is core.' },
      { abbr: 'S', name: 'Supabase', role: 'Postgres platform', since: '2023', blurb: 'Auth, RLS, realtime, storage — our default data layer.' },
      { abbr: 'X', name: 'Xano', role: 'Managed backend', since: '2022', blurb: 'Visual backend for no-code and hybrid builds.' },
    ],
  },
  {
    id: 'data',
    title: 'Databases & Search',
    subtitle: 'Relational, document, and vector stores.',
    count: 6,
    items: [
      { abbr: 'Pg', name: 'PostgreSQL', role: 'Relational', since: '2022', blurb: 'JSONB, vectors, FTS — the boring default we love.' },
      { abbr: 'M', name: 'MongoDB', role: 'Document', since: '2022', blurb: 'When the schema is genuinely unstructured.' },
      { abbr: 'Q', name: 'Qdrant', role: 'Vector DB', since: '2024', blurb: 'Production RAG when pgvector needs more scale.' },
    ],
  },
  {
    id: 'nocode',
    title: 'No-Code & CMS',
    subtitle: 'Speed-to-market when it matters.',
    count: 5,
    items: [
      { abbr: 'B', name: 'Bubble', role: 'No-code apps', since: '2022', blurb: 'CRUD-heavy products on a tight deadline.' },
      { abbr: 'W', name: 'Webflow', role: 'CMS', since: '2022', blurb: 'Marketing sites your team can actually edit.' },
      { abbr: 'FF', name: 'FlutterFlow', role: 'No-code mobile', since: '2023', blurb: 'Ship to App Store and Play from one builder.' },
    ],
  },
  {
    id: 'languages',
    title: 'Languages',
    subtitle: 'Typed and dynamic code we hand-write.',
    count: 5,
    items: [
      { abbr: 'TS', name: 'TypeScript', role: 'Language', since: '2022', blurb: 'Strict mode everywhere in our JS stack.' },
      { abbr: 'py', name: 'Python', role: 'Language', since: '2022', blurb: 'Pipelines, AI, and backends that crunch data.' },
      { abbr: '◢', name: 'Dart', role: 'Language', since: '2022', blurb: 'Flutter native modules and custom widgets.' },
    ],
  },
  {
    id: 'ops',
    title: 'Deploy & Ops',
    subtitle: 'Hosts, edge, and quality gates.',
    count: 5,
    items: [
      { abbr: '▲', name: 'Vercel', role: 'Deploy', since: '2022', blurb: 'Next.js previews, edge functions, instant rollbacks.' },
      { abbr: '☁', name: 'Cloudflare', role: 'Edge', since: '2022', blurb: 'CDN, Workers, security in front of your users.' },
      { abbr: '⊞', name: 'Docker', role: 'Containers', since: '2022', blurb: 'Same image in dev, CI, and production.' },
    ],
  },
  {
    id: 'design',
    title: 'Design & Handoff',
    subtitle: 'From pixel to shippable UI.',
    count: 1,
    items: [
      { abbr: 'Fi', name: 'Figma', role: 'Design', since: '2022', blurb: 'Components, tokens, and dev-ready handoff.' },
    ],
  },
];

export const principles = [
  { n: '01', title: 'Speed to revenue first', text: 'Pick the fastest tool that holds 12 months of growth. Re-platform later if needed.' },
  { n: '02', title: 'Boring where it matters', text: 'Postgres, TypeScript, proven runtimes. Novelty belongs in the UX.' },
  { n: '03', title: 'Own the edit layer', text: 'Whatever we ship, your team can run it — CMS, no-code, or a clean admin.' },
  { n: '04', title: 'AI as a teammate', text: 'Agents scaffold, test, and review. Humans decide what ships.' },
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
    a: 'We pair leading AI APIs with React/Next.js, Flutter, Supabase, Postgres, and automation tools like n8n — plus no-code when speed wins.',
  },
  {
    q: 'No-code, custom code, or both?',
    a: 'Both. We pick the fastest path per milestone, then harden with code where scale or security demands it.',
  },
  {
    q: 'How do you deploy?',
    a: 'Typically Vercel or Cloudflare for frontends, containers for services, with observability from day one.',
  },
];
