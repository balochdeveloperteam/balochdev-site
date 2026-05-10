/** @type {Record<string, import('../technologyAiLandings.js').AiLandingConfig>} */
export const BACKEND_TECH_LANDINGS = {
  nodejs: {
    iconKey: "nodejs",
    title: "Node.js backends",
    metaTitle: "Node.js API development & backend services — BalochDev",
    description:
      "BalochDev builds Node.js HTTP services, webhooks, and BFF layers — structured logging, typed boundaries, and deployment profiles suited for serverless or container hosts.",
    keywords: [
      "Node.js development agency",
      "Node.js API consulting",
      "Express Fastify production",
      "Node backend scalability",
      "BalochDev Node.js",
    ],
    heroLead:
      "Node.js remains the fastest path from JavaScript frontends to cohesive backends — we keep IO patterns observable before traffic spikes.",
    seoTitle: "How BalochDev engineers Node.js services for production",
    seoBody:
      "Teams searching Node.js development services need clarity on event-loop pitfalls, memory profiling, and dependency hygiene. BalochDev structures modules around domain boundaries, favors Fastify or Express deliberately, and wires OpenTelemetry-style tracing where SLOs matter. For AI-heavy stacks, Node workers coordinate streaming responses without blocking the loop on CPU-heavy tasks — those belong in queues or Python sidecars.",
    introPanel: {
      kicker: "Runtime craft",
      headline: "BalochDev’s Node.js reliability habits",
      tiles: [
        { label: "Structured logging", sub: "Correlation IDs across async hops — incidents debuggable." },
        { label: "Schema validation", sub: "Zod/JSON Schema at edges — garbage never reaches domain logic." },
        { label: "Background jobs", sub: "Heavy work offloaded — event loop stays responsive." },
        { label: "Secure defaults", sub: "Helmet/CORS tuned intentionally — not copy-paste wildcards." },
      ],
    },
    deliveryHeading: "APIs & integration hubs — Node.js lanes BalochDev ships.",
    why: [
      { title: "JS symmetry", text: "Share types and utilities with React/Next teams." },
      { title: "Ecosystem depth", text: "OAuth, queues, and observability libs mature." },
      { title: "Serverless fit", text: "Lambda/Workers-friendly handlers when architectures demand." },
      { title: "Webhook velocity", text: "Fast iteration on SaaS event ingestion." },
    ],
    deliveryTags: ["REST & webhook ingress", "Billing event processors", "Auth gateways", "Realtime fan-out", "Admin APIs", "Edge BFF layers"],
    deliveryLead:
      "We load-test unhappy paths — webhook retries and poison queues — before partners send bursty traffic.",
    faq: [
      { q: "Node vs Python for APIs?", a: "Node when teams are TS-heavy and IO-bound; Python when ML/science libs dominate — hybrids are common." },
      { q: "Monolith or microservices?", a: "Start modular monoliths; split when scaling axes differ — premature microservices hurt velocity." },
    ],
  },

  express: {
    iconKey: "express",
    title: "Express & Fastify APIs",
    metaTitle: "Express.js Fastify API development — BalochDev",
    description:
      "BalochDev delivers lean Express and Fastify services — routing clarity, middleware hygiene, and throughput tuning when microservices handle ingress spikes.",
    keywords: [
      "Express.js development services",
      "Fastify API consulting",
      "Node microservices Express",
      "REST API Node production",
      "BalochDev Express Fastify",
    ],
    heroLead:
      "Express and Fastify excel at boring HTTP — we invest in typed handlers and tests so ‘simple’ routers stay safe at scale.",
    seoTitle: "How BalochDev builds Express & Fastify production APIs",
    seoBody:
      "Organizations hiring Express.js developers often need CRM connectors, payment webhooks, or mobile backends with predictable latency. BalochDev standardizes error envelopes, documents OpenAPI contracts, and chooses Fastify when serialization benchmarks justify switching costs. Security reviews cover SSRF-prone fetch proxies and JWT verification pitfalls common in quick prototypes.",
    introPanel: {
      kicker: "HTTP routers",
      headline: "BalochDev’s Express/Fastify conventions",
      tiles: [
        { label: "Predictable errors", sub: "Unified Problem Details-style responses — clients integrate cleanly." },
        { label: "Middleware stacks", sub: "Auth, rate limiting, and parsing layered explicitly." },
        { label: "Throughput tuning", sub: "Fastify schemas accelerate serialization — measured not guessed." },
        { label: "Observability", sub: "Metrics on routes — hotspots visible before users complain." },
      ],
    },
    deliveryHeading: "Microservices & webhook routers — Express/Fastify by BalochDev.",
    why: [
      { title: "Minimal surface", text: "Easy to reason about compared to mega-frameworks." },
      { title: "Fastify speed", text: "Great fit for JSON-heavy services under load." },
      { title: "Portable patterns", text: "Runs on VMs, containers, or Functions with thin adapters." },
      { title: "Community familiarity", text: "Wide hiring pool maintains velocity." },
    ],
    deliveryTags: ["Payment webhooks", "Partner APIs", "Mobile backends", "Internal tooling APIs", "Queue consumers", "Legacy decomposition"],
    deliveryLead:
      "Public routers receive threat modeling — SSRF, abusive payloads, and auth bypass attempts covered in review gates.",
    faq: [
      { q: "Express vs Nest?", a: "Express/Fastify for tight services; Nest when DI/guards/modules justify ceremony." },
      { q: "GraphQL here?", a: "Often separate gateway — BalochDev avoids cramming GraphQL into every REST router." },
    ],
  },

  nestjs: {
    iconKey: "nestjs",
    title: "NestJS APIs",
    metaTitle: "NestJS development & enterprise Node APIs — BalochDev",
    description:
      "BalochDev implements NestJS modules with guards, interceptors, and DI patterns — maintainable REST and GraphQL services aligned with enterprise testing expectations.",
    keywords: [
      "NestJS development agency",
      "NestJS GraphQL consulting",
      "enterprise Node NestJS",
      "NestJS microservices patterns",
      "BalochDev NestJS",
    ],
    heroLead:
      "NestJS borrows backend ergonomics from mature ecosystems — we keep modules bounded so DI graphs stay navigable.",
    seoTitle: "How BalochDev scales NestJS codebases responsibly",
    seoBody:
      "Teams adopting NestJS want guardrails similar to Spring — decorators, pipes, and testing utilities — without drowning in boilerplate. BalochDev defines module seams around domains, applies Swagger/OpenAPI generation where REST outward-facing, and integrates queues for long-running jobs instead of blocking HTTP threads. GraphQL deployments receive dataloaders and complexity limits to prevent abusive queries.",
    introPanel: {
      kicker: "Structured Node",
      headline: "BalochDev’s NestJS guardrails",
      tiles: [
        { label: "Module seams", sub: "Domains stay isolated — circular imports flagged early." },
        { label: "Auth guards", sub: "JWT/session strategies centralized — fewer copy-paste gaps." },
        { label: "Testing toolkit", sub: "Supertest harnesses per module — regressions caught early." },
        { label: "Async boundaries", sub: "Queues for heavy jobs — HTTP stays responsive." },
      ],
    },
    deliveryHeading: "Enterprise REST/GraphQL — NestJS programs BalochDev leads.",
    why: [
      { title: "Enterprise familiarity", text: "Decorators map cleanly for JVM-experienced teams." },
      { title: "Strong testing story", text: "Providers injectable — integration tests realistic." },
      { title: "GraphQL option", text: "Schema-first or code-first paths supported." },
      { title: "Observability hooks", text: "Interceptors centralize logging/tracing concerns." },
    ],
    deliveryTags: ["Multi-tenant SaaS APIs", "Billing service boundaries", "Partner integrations", "Role-based admin APIs", "GraphQL BFFs", "Cron + queue workers"],
    deliveryLead:
      "We enforce pagination and filtering constraints — unconstrained list endpoints become outages.",
    faq: [
      { q: "Nest vs Express?", a: "Nest when structure pays dividends across dozens of engineers; Express when teams want ultra-light routers." },
      { q: "Monolith Nest?", a: "Often yes internally — microservices only when scaling/independence demands." },
    ],
  },

  python: {
    iconKey: "python",
    title: "Python · FastAPI backends",
    metaTitle: "Python FastAPI development — BalochDev",
    description:
      "BalochDev ships FastAPI services for ML gateways, data ingestion, and async APIs — Pydantic models, OpenAPI docs, and worker queues when CPU-heavy tasks appear.",
    keywords: [
      "FastAPI development services",
      "Python API consulting",
      "async Python production",
      "ML gateway FastAPI",
      "BalochDev Python",
    ],
    heroLead:
      "Python shines beside notebooks and ML stacks — FastAPI gives typed HTTP boundaries without Django ceremony unless domains demand admin surfaces.",
    seoTitle: "How BalochDev delivers FastAPI services beside ML workloads",
    seoBody:
      "Teams searching FastAPI development want automatic OpenAPI, pydantic validation, and asyncio correctness under load. BalochDev separates inference workloads behind queues, instruments latency percentiles, and avoids blocking loops when calling synchronous libs — thread pools or subprocess isolation instead. When ORM-heavy domains appear, we evaluate Django or SQLModel thoughtfully.",
    introPanel: {
      kicker: "Async APIs",
      headline: "BalochDev’s FastAPI checklist",
      tiles: [
        { label: "Typed IO", sub: "Pydantic models shared with workers — fewer mismatches." },
        { label: "Docs out of the box", sub: "OpenAPI keeps frontend integrations honest." },
        { label: "Isolation for ML", sub: "GPUs/queues separated from public replicas." },
        { label: "Observability", sub: "Prometheus/OpenTelemetry patterns wired early." },
      ],
    },
    deliveryHeading: "AI gateways & data APIs — Python services BalochDev runs.",
    why: [
      { title: "ML adjacency", text: "Share libraries with notebooks and batch jobs." },
      { title: "Typed contracts", text: "Pydantic reduces runtime surprises." },
      { title: "Async throughput", text: "Great for IO-heavy integrations." },
      { title: "Rapid iteration", text: "Excellent for spikes validating ML UX." },
    ],
    deliveryTags: ["RAG orchestrators", "Embedding pipelines", "ETL HTTP ingress", "Batch scoring APIs", "Admin reporting endpoints", "Webhook receivers"],
    deliveryLead:
      "Dependency pinning matters — ML stacks rot fast; BalochDev locks versions with automated bump strategies.",
    faq: [
      { q: "FastAPI vs Django?", a: "FastAPI for APIs + ML glue; Django when admin/auth batteries justify." },
      { q: "Performance?", a: "Profile before blaming Python — often IO or model latency dominates." },
    ],
  },

  django: {
    iconKey: "django",
    title: "Django · Flask services",
    metaTitle: "Django Flask Python web development — BalochDev",
    description:
      "BalochDev maintains Django and Flask backends — ORM migrations, admin tooling, and pragmatic Flask microservices when microsurface APIs suffice.",
    keywords: [
      "Django development agency",
      "Flask microservices consulting",
      "Django REST framework production",
      "Python web application security",
      "BalochDev Django Flask",
    ],
    heroLead:
      "Django accelerates admin-heavy domains — Flask stays ideal for tight JSON services — BalochDev picks based on UX for operators vs raw throughput.",
    seoTitle: "How BalochDev ships Django & Flask with operational maturity",
    seoBody:
      "Buyers seeking Django development services often need user auth, migrations, and admin workflows ready week one. BalochDev configures settings splits per environment, uses Django REST Framework or Ninja deliberately, and schedules migration reviews before deploys. Flask projects receive application factories, typed configs, and structured logging so microservices do not become tribal scripts.",
    introPanel: {
      kicker: "Python web",
      headline: "BalochDev’s Django/Flask guardrails",
      tiles: [
        { label: "Migrations discipline", sub: "Expand-contract patterns — zero-downtime deploys." },
        { label: "Admin value", sub: "Operators get usable CRUD — fewer bespoke tickets." },
        { label: "Security defaults", sub: "CSRF, sessions, and password flows reviewed — not disabled casually." },
        { label: "Service extraction", sub: "When endpoints sprawl, boundaries migrate cleanly to services." },
      ],
    },
    deliveryHeading: "Admin-heavy platforms — Django/Flask lanes BalochDev maintains.",
    why: [
      { title: "Batteries included", text: "Auth and admin accelerate internal tooling." },
      { title: "ORM maturity", text: "Migrations and relational modeling proven at scale." },
      { title: "Flask simplicity", text: "Microservices that should stay small stay small." },
      { title: "Talent availability", text: "Large Python hiring pool sustains teams." },
    ],
    deliveryTags: ["Content ops platforms", "Membership portals", "Marketplace backends", "Reporting stacks", "Webhook processors", "Legacy Python modernization"],
    deliveryLead:
      "Dependency and CVE hygiene is scheduled — Python ecosystems move quickly; reactive patching accumulates risk.",
    faq: [
      { q: "Django REST vs GraphQL?", a: "REST/DRF default; GraphQL when selective fetching saves measurable bandwidth." },
      { q: "Async Django?", a: "Evaluate per workload — sometimes separate FastAPI async tier is clearer." },
    ],
  },

  java: {
    iconKey: "java",
    title: "Java · Spring Boot",
    metaTitle: "Java Spring Boot development — BalochDev",
    description:
      "BalochDev delivers Spring Boot microservices and monolith modules — tracing, actuator health, and JVM tuning aligned with enterprise release trains.",
    keywords: [
      "Spring Boot development consulting",
      "Java microservices agency",
      "enterprise Java modernization",
      "Spring Security OAuth integration",
      "BalochDev Spring Boot",
    ],
    heroLead:
      "Spring Boot remains the pragmatic JVM default — we embrace actuator metrics and bounded contexts so services stay operable for years.",
    seoTitle: "How BalochDev runs Spring Boot in enterprises",
    seoBody:
      "Organizations hiring Spring Boot developers need clarity on dependency injection boundaries, transactional semantics, and GraalVM/native feasibility where startup time matters. BalochDev integrates Spring Security with OIDC providers, defines repository layers that respect migrations, and wires OpenTelemetry exporters consistent with platform teams. Where ML joins the stack, we isolate Python sidecars rather than forcing JNI complexity prematurely.",
    introPanel: {
      kicker: "JVM services",
      headline: "BalochDev’s Spring Boot foundations",
      tiles: [
        { label: "Modular monoliths", sub: "Extract services only when scaling axes diverge." },
        { label: "Observability", sub: "Actuator + traces — not printf debugging at 2am." },
        { label: "Security integration", sub: "OAuth2 resource server patterns done deliberately." },
        { label: "Schema migrations", sub: "Flyway/Liquibase reviewed — destructive changes gated." },
      ],
    },
    deliveryHeading: "Banking-grade integrations — Spring Boot programs BalochDev supports.",
    why: [
      { title: "Enterprise alignment", text: "Matches procurement stacks and ops tooling." },
      { title: "Mature ecosystem", text: "Integrations for LDAP, Kafka, batch, and messaging abound." },
      { title: "Performance knobs", text: "GC and pool tuning when SLAs demand." },
      { title: "Long-term stability", text: "Backward-compatible APIs valued by regulated domains." },
    ],
    deliveryTags: ["Core banking adapters", "ERP connectors", "Batch settlements", "OAuth/OIDC resource APIs", "Kafka consumers", "Containerized Spring services"],
    deliveryLead:
      "We coordinate release calendars — JVM services often sit beside slower enterprise change windows.",
    faq: [
      { q: "Spring vs Quarkus?", a: "Quarkus when startup/memory budgets dominate cloud-native targets — Spring default otherwise." },
      { q: "Microservices?", a: "Only when teams can operate them — BalochDev favors incremental extraction." },
    ],
  },

  dotnet: {
    iconKey: "dotnet",
    title: ".NET · ASP.NET Core",
    metaTitle: "ASP.NET Core .NET development — BalochDev",
    description:
      "BalochDev builds ASP.NET Core APIs and services — Identity integration, EF Core data access, and Azure-friendly deployment profiles when Microsoft stacks anchor the estate.",
    keywords: [
      "ASP.NET Core development agency",
      ".NET API consulting",
      "Entity Framework Core production",
      "Azure AD integration NET",
      "BalochDev dotnet development",
    ],
    heroLead:
      "ASP.NET Core pairs cleanly with Azure AD and enterprise libraries — we standardize minimal APIs or controllers based on team familiarity.",
    seoTitle: "How BalochDev delivers ASP.NET Core backends",
    seoBody:
      "Teams investing in .NET development want EF Core migrations reviewed, authentication aligned with Entra patterns, and containers sized realistically. BalochDev configures OpenAPI generation, applies caching strategies where Redis fits, and integrates Application Insights or OTLP exporters for traces. Interop with JavaScript frontends uses explicit DTOs — never leaking EF entities across wire formats.",
    introPanel: {
      kicker: "Microsoft stack",
      headline: "BalochDev’s ASP.NET Core habits",
      tiles: [
        { label: "Identity-aware APIs", sub: "JWT bearer vs cookie schemes chosen per threat model." },
        { label: "EF discipline", sub: "Mapping boundaries — migrations reviewed like production code." },
        { label: "Performance testing", sub: "Load tests on warm pools — cold start myths avoided." },
        { label: "Interop clarity", sub: "React/Next clients consume versioned DTOs." },
      ],
    },
    deliveryHeading: "Line-of-business APIs — ASP.NET Core deliveries BalochDev runs.",
    why: [
      { title: "Azure affinity", text: "Deploy templates and managed identities integrate smoothly." },
      { title: "Strong typing", text: "C# catches integration drift early." },
      { title: "Enterprise libraries", text: "Battle-tested crypto and identity primitives." },
      { title: "Cross-platform runtime", text: "Linux containers welcomed — not legacy Windows-only assumptions." },
    ],
    deliveryTags: ["Entra-integrated portals", "Internal ERP APIs", "Billing integrations", "SignalR realtime", "Worker services", "Hybrid cloud gateways"],
    deliveryLead:
      "Licensing and package feeds are documented — NuGet governance prevents shadow dependencies.",
    faq: [
      { q: ".NET vs Java?", a: "Often procurement + existing skill dictate — BalochDev delivers either with equal rigor." },
      { q: "Minimal APIs?", a: "Great for tight services; controllers when conventions help larger teams." },
    ],
  },

  "supabase-edge-functions": {
    iconKey: "supabase",
    title: "Supabase Edge Functions",
    metaTitle: "Supabase Edge Functions development — BalochDev",
    description:
      "BalochDev authors Supabase Edge Functions for low-latency hooks beside Postgres — JWT-aware handlers, secret management, and pairing with RLS-first data models.",
    keywords: [
      "Supabase Edge Functions developer",
      "Supabase serverless functions",
      "Supabase Deno edge hooks",
      "Supabase webhook integration",
      "BalochDev Supabase functions",
    ],
    heroLead:
      "Edge Functions place logic milliseconds from your users — we keep them thin and auditable versus duplicating domain rules randomly.",
    seoTitle: "How BalochDev uses Supabase Edge Functions beside RLS",
    seoBody:
      "Teams adopting Supabase Edge Functions often need Stripe webhooks, signed transforms, or geo-aware routing without standing up separate Kubernetes. BalochDev validates JWT claims from Supabase Auth, isolates secrets via Supabase secrets APIs, and pushes heavy compute back to queues or dedicated workers when Deno limits bite. Policies remain anchored in Postgres RLS — functions augment, not replace, authorization.",
    introPanel: {
      kicker: "Edge hooks",
      headline: "BalochDev’s Edge Function guardrails",
      tiles: [
        { label: "Auth-aware", sub: "JWT verification patterns consistent with mobile/web clients." },
        { label: "Thin orchestration", sub: "Business rules stay testable — functions glue IO." },
        { label: "Secrets hygiene", sub: "No plaintext keys committed — managed secrets only." },
        { label: "Observability", sub: "Structured logs exported — incidents trace across regions." },
      ],
    },
    deliveryHeading: "Realtime hooks & payments — Supabase Edge Functions by BalochDev.",
    why: [
      { title: "Low latency", text: "Runs globally distributed beside users." },
      { title: "Supabase-native", text: "Pairs with Auth, DB, and Storage without bespoke VPC plumbing." },
      { title: "Deno safety", text: "Restricted runtime reduces dangerous syscall habits." },
      { title: "Iteration speed", text: "Deploy functions independent of mobile release cadence." },
    ],
    deliveryTags: ["Stripe/Paddle webhooks", "Signed URL transforms", "Geo routing", "Realtime triggers", "Cron augmentations", "Mobile secure gates"],
    deliveryLead:
      "We avoid duplicating authorization — RLS remains source of truth; functions enforce gateway-specific checks only.",
    faq: [
      { q: "Edge vs database functions?", a: "Edge for HTTP/geo/webhooks; SQL functions when logic belongs beside data referentially." },
      { q: "Local dev?", a: "CLI workflows documented — parity issues caught before prod regions diverge." },
    ],
  },

  graphql: {
    iconKey: "graphql",
    title: "GraphQL · Apollo",
    metaTitle: "GraphQL API development — Apollo — BalochDev",
    description:
      "BalochDev designs GraphQL schemas with Apollo-style gateways — persisted queries, dataloaders, and complexity limits protecting mobile and web clients.",
    keywords: [
      "GraphQL development agency",
      "Apollo Server consulting",
      "GraphQL federation microservices",
      "GraphQL security best practices",
      "BalochDev GraphQL",
    ],
    heroLead:
      "GraphQL empowers selective fetching — we enforce budgets so enthusiastic mobile queries cannot melt databases.",
    seoTitle: "How BalochDev ships GraphQL without outage archetypes",
    seoBody:
      "Teams evaluating GraphQL development services need guidance on N+1 elimination, auth at field level, and caching realities versus REST CDNs. BalochDev applies dataloaders, persisted queries for production mobile builds, and rate limiting keyed by operation name. Federation enters only when service boundaries already exist — schema design workshops precede microservice fan-out.",
    introPanel: {
      kicker: "Schema discipline",
      headline: "BalochDev’s GraphQL operational playbook",
      tiles: [
        { label: "Complexity limits", sub: "Depth/cost caps — abusive queries rejected fast." },
        { label: "Loader patterns", sub: "Batching avoids accidental storms — traces prove it." },
        { label: "Auth clarity", sub: "Resolver scopes documented — no mystery overrides." },
        { label: "Caching realism", sub: "HTTP caches rarely suffice — plan DataLoader + CDN thoughtfully." },
      ],
    },
    deliveryHeading: "Mobile & web gateways — GraphQL stacks BalochDev architects.",
    why: [
      { title: "Selective fetching", text: "Mobile bandwidth wins versus verbose REST." },
      { title: "Strong typing", text: "Schemas contract frontend/backend drift." },
      { title: "Tooling", text: "Codegen improves DX across stacks." },
      { title: "Evolution paths", text: "@deprecated fields ease migrations." },
    ],
    deliveryTags: ["Mobile app gateways", "BFF layers", "Federated subgraphs", "Analytics APIs", "Partner developer portals", "Realtime subscriptions"],
    deliveryLead:
      "Authorization belongs in the domain — GraphQL must not become authorization bypass theater.",
    faq: [
      { q: "GraphQL vs REST?", a: "GraphQL when clients diverge strongly; REST when caching/CDN simplicity dominates." },
      { q: "Apollo Router?", a: "Often yes at scale — BalochDev evaluates infra complexity honestly." },
    ],
  },

  xano: {
    iconKey: "xano",
    title: "Xano backend-as-a-service",
    metaTitle: "Xano API backend development — BalochDev",
    description:
      "BalochDev implements Xano backends for no-code frontends — structured schemas, secure authentication bridges, and escape paths to custom code when visual logic caps appear.",
    keywords: [
      "Xano developer consultant",
      "Xano FlutterFlow backend",
      "no-code backend Xano",
      "Xano API authentication",
      "BalochDev Xano integration",
    ],
    heroLead:
      "Xano accelerates CRUD APIs beside FlutterFlow or Bubble — BalochDev ensures schemas remain migration-safe when products mature.",
    seoTitle: "How BalochDev hardens Xano backends for production",
    seoBody:
      "Teams searching Xano integration want GDPR-aware endpoints, predictable authentication flows, and logging before citizen-developed stacks reach revenue. BalochDev defines environment separation, documents API versioning, and integrates external OAuth providers where marketing promises demand. When complexity spikes — ML scoring or intricate workflows — we extend with dedicated microservices rather than forcing visual function stacks.",
    introPanel: {
      kicker: "Visual backend",
      headline: "BalochDev’s Xano production checklist",
      tiles: [
        { label: "Schema governance", sub: "Naming + relation discipline — fewer refactor nightmares." },
        { label: "Auth bridging", sub: "JWT/session flows aligned with mobile/web clients." },
        { label: "Limits awareness", sub: "Rate limits and pagination documented — clients behave." },
        { label: "Exit ramps", sub: "Plan migrations to Postgres services before hitting ceilings." },
      ],
    },
    deliveryHeading: "No-code mobile stacks — Xano backends BalochDev implements.",
    why: [
      { title: "Launch velocity", text: "Backend endpoints without provisioning VMs." },
      { title: "Operational GUI", text: "Operators tweak CRUD without redeploy lag." },
      { title: "FlutterFlow synergy", text: "Popular pairing BalochDev delivers repeatedly." },
      { title: "Incremental maturity", text: "Grow toward code without throwing away early wins." },
    ],
    deliveryTags: ["FlutterFlow APIs", "Bubble extensions", "Membership apps", "Booking platforms", "MVPs with auth", "Webhook integrations"],
    deliveryLead:
      "Secrets and API keys stay server-side — mobile bundles never embed admin tokens.",
    faq: [
      { q: "Xano vs Supabase?", a: "Xano suits visual-first builders; Supabase when Postgres + SQL depth dominates." },
      { q: "Custom code?", a: "BalochDev introduces Node/Python workers when functions exceed maintainability." },
    ],
  },
};
