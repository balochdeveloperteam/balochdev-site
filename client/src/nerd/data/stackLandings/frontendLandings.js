/** @type {Record<string, import('../technologyAiLandings.js').AiLandingConfig>} */
export const FRONTEND_TECH_LANDINGS = {
  react: {
    iconKey: "react",
    title: "React development",
    metaTitle: "React.js development services — BalochDev",
    description:
      "BalochDev ships production React apps with strict TypeScript, accessible components, and performance budgets — SPAs, islands, and hybrid architectures tuned to your SEO and ops constraints.",
    keywords: [
      "React development agency",
      "React TypeScript consulting",
      "React performance optimization",
      "enterprise React applications",
      "BalochDev React developers",
    ],
    heroLead:
      "React stays our default UI runtime when teams want ecosystem depth, hiring familiarity, and gradual migration paths from legacy stacks.",
    seoTitle: "How BalochDev delivers React interfaces that survive scale",
    seoBody:
      "Buyers searching React development services usually need predictable component boundaries, tested state flows, and bundle discipline — not tutorial-tier folders. BalochDev applies lint rules that catch accessibility gaps early, splits routes for Core Web Vitals, and aligns SSR or SSG choices with SEO targets. When React Native shares logic, we structure packages so web and mobile do not fork business rules.",
    introPanel: {
      kicker: "Product UI",
      headline: "BalochDev’s React delivery baseline",
      tiles: [
        { label: "Strict typing", sub: "TypeScript-first props and hooks — fewer midnight prop-drilling bugs." },
        { label: "Accessible primitives", sub: "Keyboard flows and semantics baked in — not patched after launch." },
        { label: "Perf budgets", sub: "Code-splitting, memo discipline, and observability on slow interactions." },
        { label: "Design-system alignment", sub: "Tokens from Figma → Tailwind/CSS variables — consistent branding." },
      ],
    },
    deliveryHeading: "Dashboards & marketing apps — React production lanes by BalochDev.",
    why: [
      { title: "Hiring & ecosystem", text: "Largest pool of components, patterns, and integrations." },
      { title: "Incremental adoption", text: "Embed islands inside legacy PHP or WordPress without big-bang rewrites." },
      { title: "Strong tooling", text: "Vite/Next ecosystems mature — DX translates to velocity." },
      { title: "Portable logic", text: "Share packages with React Native or backend TS workers." },
    ],
    deliveryTags: ["Customer dashboards", "Internal admin consoles", "Auth-heavy portals", "Realtime collaboration UI", "Wizard onboarding flows", "Marketing microsites (SPA)"],
    deliveryLead:
      "We pair React with explicit data-fetch boundaries — stale states and cache bugs are where UX reputations die.",
    faq: [
      { q: "React vs Next.js?", a: "React alone suits embedded widgets; Next.js when SEO, routing, and server components matter — we advise per surface." },
      { q: "Do you migrate class components?", a: "Yes — incremental hooks refactors with tests so UX stays stable." },
    ],
  },

  nextjs: {
    iconKey: "nextjs",
    title: "Next.js development",
    metaTitle: "Next.js App Router development — BalochDev",
    description:
      "BalochDev builds Next.js apps with App Router, streaming, caching discipline, and edge-ready deploys — SSR/SSG choices aligned with SEO and conversion goals.",
    keywords: [
      "Next.js development agency",
      "Next.js App Router consulting",
      "Next.js SEO optimization",
      "server components production",
      "BalochDev Next.js",
    ],
    heroLead:
      "Next.js connects UI to data fetching and routing — we treat caching and auth as first-class so previews mirror production.",
    seoTitle: "How BalochDev ships Next.js with SEO and reliability",
    seoBody:
      "Teams evaluating Next.js development partners want route-level metadata, structured data, and honest caching semantics — not accidental SSR waterfalls. BalochDev maps App Router segments, chooses server vs client components deliberately, and wires middleware for auth without leaking cookies to static caches. Deploy targets typically include Vercel or Cloudflare with tracing enabled before launches.",
    introPanel: {
      kicker: "Framework depth",
      headline: "BalochDev’s Next.js implementation habits",
      tiles: [
        { label: "Caching literacy", sub: "Tags, revalidation windows, and invalidation hooks — no mystery staleness." },
        { label: "Streaming UX", sub: "Suspense boundaries tuned so skeletons match content shape." },
        { label: "Edge-ready auth", sub: "Middleware patterns that respect JWT/session realities." },
        { label: "SEO primitives", sub: "Metadata APIs + JSON-LD aligned with content ops workflows." },
      ],
    },
    deliveryHeading: "Marketing sites & SaaS consoles — Next.js end-to-end by BalochDev.",
    why: [
      { title: "SEO synergy", text: "Metadata and SSR paths beat SPA defaults for competitive SERPs." },
      { title: "Unified platform", text: "Routes, APIs, and edge logic coexist — fewer deploy seams." },
      { title: "Modern data APIs", text: "Server Actions where appropriate — typed validation end-to-end." },
      { title: "Deployment fit", text: "Aligned with Vercel fluid compute and preview workflows." },
    ],
    deliveryTags: ["Content-heavy marketing sites", "Authenticated SaaS apps", "Edge middleware", "Internationalization", "Headless CMS fronts", "AI streaming surfaces"],
    deliveryLead:
      "Performance reviews include LCP image strategies and third-party script containment — marketing stacks fail silently otherwise.",
    faq: [
      { q: "Pages Router vs App Router?", a: "New builds default App Router; we maintain Pages where migrations are staged — never rushed blindly." },
      { q: "Hosting?", a: "Vercel is common; Cloudflare or Docker hosts when egress or compliance dictates." },
    ],
  },

  tailwind: {
    iconKey: "tailwind",
    title: "Tailwind CSS",
    metaTitle: "Tailwind CSS development & design systems — BalochDev",
    description:
      "BalochDev implements Tailwind with tokens, plugins, and component libraries — consistent spacing, dark mode, and maintainable class patterns alongside Figma variables.",
    keywords: [
      "Tailwind CSS agency",
      "Tailwind design system",
      "Tailwind component library",
      "Tailwind dark mode production",
      "BalochDev Tailwind",
    ],
    heroLead:
      "Tailwind accelerates UI iteration when tokens map to design decisions — we ban magic numbers that fight future rebrands.",
    seoTitle: "How BalochDev keeps Tailwind scalable",
    seoBody:
      "Teams hiring Tailwind CSS development want fewer CSS regressions and faster experiments without abandoning accessibility. BalochDev configures theme extensions once, documents `@apply` usage sparingly, and pairs Tailwind with Radix/shadcn-style primitives when interaction complexity rises. We integrate Prettier plugins so class order stops becoming bike-shedding.",
    introPanel: {
      kicker: "Styling system",
      headline: "BalochDev’s Tailwind conventions",
      tiles: [
        { label: "Token-first config", sub: "Spacing, radii, and colors centralized — rebrand becomes configuration." },
        { label: "Component shells", sub: "Variants via `cva` or similar — predictable APIs for engineers." },
        { label: "Responsive discipline", sub: "Breakpoints aligned with design — not per-page guesses." },
        { label: "Dark mode strategy", sub: "Class or media toggles chosen upfront — fewer contrast bugs." },
      ],
    },
    deliveryHeading: "Marketing & app chrome — Tailwind systems BalochDev maintains.",
    why: [
      { title: "Speed", text: "Utility workflow removes context switching into giant CSS files." },
      { title: "Consistency", text: "Design tokens enforced through config — fewer rogue hex codes." },
      { title: "Bundle clarity", text: "JIT keeps CSS proportional to components actually shipped." },
      { title: "Ecosystem fit", text: "Natural pairing with React/Next component libraries." },
    ],
    deliveryTags: ["Landing pages", "Dashboard skins", "Design-system rollout", "Accessibility audits", "Dark mode launches", "CMS-driven themes"],
    deliveryLead:
      "We audit contrast and focus order — utility CSS still ships inaccessible UIs if semantics are skipped.",
    faq: [
      { q: "Tailwind vs CSS Modules?", a: "Tailwind wins velocity on component-heavy teams; modules when isolation from legacy CSS matters." },
      { q: "Can we migrate Bootstrap?", a: "Yes — phased component swaps with visual regression snapshots." },
    ],
  },

  bootstrap: {
    iconKey: "bootstrap",
    title: "Bootstrap UI",
    metaTitle: "Bootstrap development & admin dashboards — BalochDev",
    description:
      "BalochDev builds Bootstrap-based admin panels and marketing shells — semantic grids, accessible components, and theming that honors brand palettes without fighting defaults.",
    keywords: [
      "Bootstrap development services",
      "Bootstrap 5 dashboard",
      "Bootstrap admin template customization",
      "responsive Bootstrap consulting",
      "BalochDev Bootstrap",
    ],
    heroLead:
      "Bootstrap still wins when stakeholders want familiar patterns and rapid CRUD screens — we tame overrides before CSS specificity wars.",
    seoTitle: "When BalochDev chooses Bootstrap — and how we ship it cleanly",
    seoBody:
      "Organizations searching Bootstrap development often maintain internal tools where familiarity beats bespoke aesthetics. BalochDev leverages utility APIs introduced in Bootstrap 5, layers Sass variables for brand alignment, and documents extension points so plugins stay upgradable. When UX demands bespoke motion or atomic styling, we isolate Bootstrap boundaries rather than mixing paradigms unpredictably.",
    introPanel: {
      kicker: "Pragmatic UI",
      headline: "BalochDev’s Bootstrap guardrails",
      tiles: [
        { label: "Semantic grid", sub: "Layouts stay predictable — fewer fragile calc hacks." },
        { label: "Accessible widgets", sub: "Modals, dropdowns, and tabs wired with keyboard traps reviewed." },
        { label: "Theme tokens", sub: "Central Sass maps — stop copying hex into fifty overrides." },
        { label: "Upgrade paths", sub: "Track upstream Bootstrap releases — tech debt scheduled not denied." },
      ],
    },
    deliveryHeading: "Internal tools & rapid MVPs — Bootstrap lanes BalochDev delivers.",
    why: [
      { title: "Familiar UX", text: "Low training cost for business-heavy teams." },
      { title: "Documentation depth", text: "Stable patterns reduce bespoke CSS emergencies." },
      { title: "Responsive defaults", text: "Grid + utilities solve admin layouts quickly." },
      { title: "Interop", text: "Pairs with Laravel/Django templates without SPA overhead." },
    ],
    deliveryTags: ["Admin consoles", "Partner portals", "Reporting screens", "Legacy modernization", "Prototype dashboards", "Email-safe adjacent styling patterns"],
    deliveryLead:
      "Security-sensitive flows still deserve explicit component reviews — Bootstrap speeds layout, not threat modeling.",
    faq: [
      { q: "Bootstrap vs Tailwind?", a: "Bootstrap when familiarity and components beat atomic styling velocity — hybrid stacks exist but need discipline." },
      { q: "Bootstrap + React?", a: "Yes — react-bootstrap or headless hybrids depending on accessibility targets." },
    ],
  },

  typescript: {
    iconKey: "typescript",
    title: "TypeScript frontend",
    metaTitle: "TypeScript development for React & web apps — BalochDev",
    description:
      "BalochDev applies strict TypeScript across React and Next clients — shared DTOs with backends, safer refactors, and eslint/typescript pipelines that catch regressions pre-merge.",
    keywords: [
      "TypeScript React consulting",
      "strict TypeScript frontend",
      "TypeScript monorepo setup",
      "DTO typing API clients",
      "BalochDev TypeScript",
    ],
    heroLead:
      "TypeScript pays off when APIs evolve weekly — we align types with OpenAPI/tRPC/Zod so UI cannot drift silently.",
    seoTitle: "How BalochDev uses TypeScript to protect UX velocity",
    seoBody:
      "Teams adopting TypeScript on the frontend want gradual migrations without freezing features. BalochDev defines boundary modules, introduces `unknown` over `any`, and generates types from schemas where possible. Combined with CI type gates, large component trees stop accumulating silent breakage — especially important when AI assistants propose sweeping edits.",
    introPanel: {
      kicker: "Type safety",
      headline: "BalochDev’s TS habits on web surfaces",
      tiles: [
        { label: "Shared contracts", sub: "DTOs mirrored server-side — fewer serialization surprises." },
        { label: "Strict configs", sub: "Incremental strictness with timelines — not eternal `strict: false`." },
        { label: "Lint synergy", sub: "eslint-typescript rules tuned — noisy bans hurt adoption." },
        { label: "Refactor confidence", sub: "Rename props safely across monorepos — velocity compounds." },
      ],
    },
    deliveryHeading: "Typed React & Next apps — BalochDev’s TS-forward delivery.",
    why: [
      { title: "Regression shield", text: "Catch integration bugs before Cypress sees them." },
      { title: "Onboarding", text: "Self-documenting components reduce tribal knowledge." },
      { title: "AI-assisted coding", text: "Strong types steer assistants toward valid outputs." },
      { title: "Cross-stack parity", text: "Same language on workers and UI — shared utilities." },
    ],
    deliveryTags: ["Strict TS migrations", "OpenAPI client codegen", "Monorepo packages", "Zod/tRPC boundaries", "Storybook typed stories", "Performance-sensitive hooks typing"],
    deliveryLead:
      "We avoid ‘types as theater’ — generated sources must stay fresh via CI, not quarterly manual edits.",
    faq: [
      { q: "Can we migrate JS gradually?", a: "Yes — module boundaries and `allowJs` staging paths are standard BalochDev practice." },
      { q: "TS with REST?", a: "OpenAPI or hand-written Zod parsers bridge dynamic JSON safely." },
    ],
  },

  react_native: {
    iconKey: "react_native",
    title: "React Native mobile",
    metaTitle: "React Native app development — BalochDev",
    description:
      "BalochDev ships React Native apps with navigation discipline, native module boundaries, and release trains aligned with App Store policies — sharing logic with web repos when it reduces duplication.",
    keywords: [
      "React Native development agency",
      "React Native consulting",
      "expo vs bare workflow",
      "cross-platform mobile React",
      "BalochDev React Native",
    ],
    heroLead:
      "React Native fits teams that want one JS discipline across web and mobile — we keep native seams explicit where performance demands it.",
    seoTitle: "How BalochDev delivers React Native without compromise loops",
    seoBody:
      "Buyers evaluating React Native development services worry about bridge bottlenecks and upgrade pain. BalochDev chooses Expo or bare workflows based on native SDK needs, pins React Navigation structures early, and profiles startup time before polish. Shared packages hold business logic; platform folders isolate truly native behavior.",
    introPanel: {
      kicker: "Mobile delivery",
      headline: "BalochDev’s React Native fundamentals",
      tiles: [
        { label: "Navigation architecture", sub: "Stacks, tabs, modals planned — fewer rewrite spikes." },
        { label: "Performance profiling", sub: "Hermes + flipper-style traces — jank removed early." },
        { label: "OTA vs store releases", sub: "Policies honored — no sneaky bypass of Apple/Google rules." },
        { label: "Monorepo sharing", sub: "Typed packages reused with web — one source of validation rules." },
      ],
    },
    deliveryHeading: "Consumer & B2B apps — React Native pipelines by BalochDev.",
    why: [
      { title: "Shared talent pool", text: "React engineers ramp faster than fully separate native teams." },
      { title: "Cross-platform reach", text: "Ship iOS + Android from one codebase baseline." },
      { title: "Ecosystem modules", text: "Broad library coverage for maps, payments, analytics." },
      { title: "Incremental native", text: "Drop to Swift/Kotlin modules only where justified." },
    ],
    deliveryTags: ["MVP mobile launches", "Enterprise authenticated apps", "Push notification flows", "Offline-first caching", "Deep linking", "App Store submission support"],
    deliveryLead:
      "Privacy manifests and permission prompts are planned alongside UX — rejections are cheaper to prevent than appeal.",
    faq: [
      { q: "Expo?", a: "Default when native APIs fit Expo modules; eject/bare when SDK demands require." },
      { q: "Flutter instead?", a: "Flutter when rendering performance or design fidelity dominates; RN when JS sharing wins." },
    ],
  },

  flutter: {
    iconKey: "flutter",
    title: "Flutter development",
    metaTitle: "Flutter app development — BalochDev",
    description:
      "BalochDev builds Flutter apps with layered architecture, accessibility, and platform channels — suited for pixel-perfect UX, offline-first workflows, and rapid iteration across iOS, Android, and web.",
    keywords: [
      "Flutter development agency",
      "Flutter consulting services",
      "Flutter web mobile desktop",
      "Flutter Riverpod Bloc architecture",
      "BalochDev Flutter",
    ],
    heroLead:
      "Flutter’s renderer delivers consistent UI across platforms — we structure code so business logic stays testable beneath widgets.",
    seoTitle: "How BalochDev ships Flutter products with maintainable architecture",
    seoBody:
      "Teams hiring Flutter developers want opinionated state management, CI that runs golden tests, and performance profiling on low-end devices. BalochDev favors composable layers (domain/application/ui), integrates Firebase or Supabase backends where suitable, and uses platform channels sparingly but deliberately for SDK gaps. Web targets receive realistic SEO expectations — Flutter web complements apps rather than replacing marketing SSR stacks.",
    introPanel: {
      kicker: "Cross-platform",
      headline: "BalochDev’s Flutter engineering pillars",
      tiles: [
        { label: "Widget discipline", sub: "Composition over mega-build methods — readability preserved." },
        { label: "State clarity", sub: "Riverpod/Bloc chosen per team skill — documented patterns." },
        { label: "Golden & integration tests", sub: "Catch regressions CI cannot see via logic tests alone." },
        { label: "Perf realism", sub: "Profiling on budget hardware — animations survive real users." },
      ],
    },
    deliveryHeading: "Mobile-first products — Flutter delivery tracks by BalochDev.",
    why: [
      { title: "UI fidelity", text: "Custom layouts without fighting platform defaults." },
      { title: "Single codebase", text: "Ship multiple platforms from one Dart repo." },
      { title: "Fast iteration", text: "Hot reload accelerates design collaboration." },
      { title: "Growing ecosystem", text: "Packages for maps, payments, and ML inference mature yearly." },
    ],
    deliveryTags: ["Field service apps", "Consumer subscriptions", "Retail kiosks", "Companion apps for SaaS", "Offline queues", "FlutterFlow handoffs to code"],
    deliveryLead:
      "Store compliance (privacy nutrition labels, data safety forms) is tracked alongside features — especially for analytics SDKs.",
    faq: [
      { q: "Flutter vs React Native?", a: "Flutter when rendering control and consistency matter most; RN when maximizing JS sharing with existing web teams." },
      { q: "Backend?", a: "Supabase/FirebaseREST/GraphQL — BalochDev chooses based on auth and realtime needs." },
    ],
  },

  vite: {
    iconKey: "vite",
    title: "Vite build tooling",
    metaTitle: "Vite development & SPA builds — BalochDev",
    description:
      "BalochDev configures Vite for React/Vue SPAs — fast HMR, optimized Rollup production bundles, and environment-variable hygiene aligned with preview/staging workflows.",
    keywords: [
      "Vite consulting",
      "Vite React setup",
      "Vite production optimization",
      "SPA build tooling experts",
      "BalochDev Vite",
    ],
    heroLead:
      "Vite replaces sluggish webpack dev loops — we tune chunk splitting and asset pipelines so prod stays as snappy as local.",
    seoTitle: "How BalochDev uses Vite for modern SPAs",
    seoBody:
      "Engineering teams adopting Vite want instant feedback without sacrificing tree-shaking or SSR sibling paths. BalochDev aligns `vite.config` with hosting targets (Cloudflare Pages, static buckets, or Node adapters), pins dependency optimizations, and wires preview URLs into CI. When SSR becomes necessary later, we evaluate incremental migration toward frameworks rather than bolting SSR onto ad hoc setups.",
    introPanel: {
      kicker: "Developer experience",
      headline: "BalochDev’s Vite setup checklist",
      tiles: [
        { label: "Env separation", sub: "`.env` staging vs prod — secrets never bundled client-side." },
        { label: "Chunk strategy", sub: "Vendor splits tuned for HTTP/2 — fewer mega bundles." },
        { label: "Plugin hygiene", sub: "Minimal plugin stack — each adds upgrade burden." },
        { label: "CI previews", sub: "Every PR gets an artifact reviewers can click — not screenshots only." },
      ],
    },
    deliveryHeading: "Marketing SPAs & internal tools — Vite pipelines BalochDev runs.",
    why: [
      { title: "Speed", text: "Cold starts and HMR outperform legacy bundlers for most SPAs." },
      { title: "Modern defaults", text: "ESM-first aligns with browser realities." },
      { title: "Ecosystem", text: "Official React plugin maturity." },
      { title: "Flex hosting", text: "Static deploys fit edge caches cleanly." },
    ],
    deliveryTags: ["Greenfield SPAs", "Micro-frontends experiments", "Design system playgrounds", "Legacy webpack migrations", "Library packages", "Documentation sites"],
    deliveryLead:
      "Accessibility and SEO still need planning — Vite accelerates builds, not discovery strategy.",
    faq: [
      { q: "Vite vs Next?", a: "Vite for SPA/dashboard stacks not needing SSR; Next when SEO + routing integration matters." },
      { q: "Vitest?", a: "Often yes — unified toolchain reduces config drift." },
    ],
  },

  storybook: {
    iconKey: "storybook",
    title: "Storybook UI workshop",
    metaTitle: "Storybook development & UI documentation — BalochDev",
    description:
      "BalochDev implements Storybook for React/Next teams — MDX docs, visual regression hooks, and addon configs so designers and engineers share one component source of truth.",
    keywords: [
      "Storybook consulting",
      "Storybook React setup",
      "component driven development",
      "Storybook Chromatic CI",
      "BalochDev Storybook",
    ],
    heroLead:
      "Storybook is where UI truth becomes reviewable — we wire stories to tokens and props tables so drift is visible, not tribal.",
    seoTitle: "How BalochDev operationalizes Storybook",
    seoBody:
      "Teams investing in Storybook development want faster QA cycles and clearer design handoffs. BalochDev configures stories alongside tokens, integrates accessibility addons, and optionally connects Chromatic or similar for visual diffs on PRs. We avoid story-only mocks that diverge from production data loaders — stories should approximate real fetch boundaries.",
    introPanel: {
      kicker: "Component QA",
      headline: "BalochDev’s Storybook rollout steps",
      tiles: [
        { label: "Prop-driven stories", sub: "Controls map to real variants — not Photoshopped snapshots." },
        { label: "Docs generation", sub: "MDX where narratives help onboarding." },
        { label: "Visual regression", sub: "CI catches unintended pixel drift." },
        { label: "Publishing", sub: "Hosted Storybook per branch — stakeholders approve asynchronously." },
      ],
    },
    deliveryHeading: "Design-system foundations — Storybook workflows BalochDev enables.",
    why: [
      { title: "Parallelized QA", text: "Isolate components without spinning whole apps." },
      { title: "Living docs", text: "Reduces outdated Confluence screenshots." },
      { title: "Refactor safety", text: "Visual diffs highlight unintended UI shifts." },
      { title: "Cross-role clarity", text: "Designers comment with grounded examples." },
    ],
    deliveryTags: ["Design-system launches", "Accessibility addon audits", "Interaction tests", "Theme switching stories", "Integration with Figma tokens", "Monorepo publishing"],
    deliveryLead:
      "Ownership matters — untended Storybooks rot; BalochDev ties stories to merge gates only where teams commit maintainers.",
    faq: [
      { q: "Storybook vs Ladle?", a: "Storybook’s ecosystem still wins for docs + addons; alternates fit minimal setups." },
      { q: "Deployment?", a: "Static hosting or preview tunnels — secured when components expose sensitive states." },
    ],
  },

  "google-ai-studio": {
    iconKey: "googlegemini",
    title: "Google AI Studio & Gemini UI snippets",
    metaTitle: "Google AI Studio · Gemini front-end integration — BalochDev",
    description:
      "BalochDev prototypes Gemini-powered widgets with AI Studio patterns — prompt hygiene, API keys safeguarded server-side, and UX that degrades gracefully outside demos.",
    keywords: [
      "Google AI Studio integration",
      "Gemini API frontend",
      "Gemini widget development",
      "MakerSuite Gemini prototyping",
      "BalochDev Gemini UI",
    ],
    heroLead:
      "AI Studio accelerates Gemini experiments — we move winners into Next/React with proper auth instead of leaving keys in browser bundles.",
    seoTitle: "How BalochDev graduates Gemini experiments into production UI",
    seoBody:
      "Marketing and product teams exploring Google AI Studio want rapid prompts without trapping secrets in client-side bundles. BalochDev mirrors Studio flows behind server routes, applies streaming UX patterns, and validates modalities (text vs image inputs) against privacy policies. When Gemini graduates beyond landing-page toys, we unify routing with existing observability and rate limits.",
    introPanel: {
      kicker: "Prototype → prod",
      headline: "BalochDev’s Gemini UI bridge",
      tiles: [
        { label: "Server-held keys", sub: "Browsers talk to your API — not raw secrets." },
        { label: "Streaming UX", sub: "Skeletons + retries mirror BalochDev Next patterns." },
        { label: "Modality discipline", sub: "Explicit handling for uploads — redaction rules documented." },
        { label: "Evaluation hooks", sub: "Prompt versions tracked — regressions measurable." },
      ],
    },
    deliveryHeading: "Landing experiments & embeds — Gemini UI by BalochDev.",
    why: [
      { title: "Fast iteration", text: "Studio lowers friction before engineering hardening." },
      { title: "Google Cloud affinity", text: "Natural segue into Vertex-style governance when needed." },
      { title: "Multimodal previews", text: "Marketing teams validate UX before heavy backend builds." },
      { title: "Vendor parity", text: "BalochDev keeps adapters swappable with OpenAI routes." },
    ],
    deliveryTags: ["Marketing assistants", "Interactive demos", "Sales tooling embeds", "Support previews", "Batch enrichment UI", "Prompt/version dashboards"],
    deliveryLead:
      "Compliance reviews cover what user content is retained — multimodal inputs escalate privacy reviews quickly.",
    faq: [
      { q: "Studio vs Vertex?", a: "Studio for experiments; Vertex when enterprise IAM, VPC, and quotas dominate." },
      { q: "Keys in Next.js?", a: "Only server-side env — client bundles never embed service credentials." },
    ],
  },
};
