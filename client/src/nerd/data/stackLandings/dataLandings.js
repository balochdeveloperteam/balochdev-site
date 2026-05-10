/** @type {Record<string, import('../technologyAiLandings.js').AiLandingConfig>} */
export const DATA_TECH_LANDINGS = {
  postgresql: {
    iconKey: "postgresql",
    title: "PostgreSQL databases",
    metaTitle: "PostgreSQL development & Supabase Postgres — BalochDev",
    description:
      "BalochDev engineers PostgreSQL schemas with migrations, indexing strategy, Row-Level Security with Supabase, JSONB patterns, pgvector search, and full-text tuning — boring relational cores done right.",
    keywords: [
      "PostgreSQL consulting services",
      "Supabase Postgres RLS",
      "PostgreSQL performance tuning",
      "pgvector RAG database",
      "BalochDev PostgreSQL",
    ],
    heroLead:
      "PostgreSQL remains our default relational anchor — JSONB when schemas evolve, RLS when tenants share one cluster safely.",
    seoTitle: "How BalochDev architects PostgreSQL for SaaS and AI workloads",
    seoBody:
      "Teams hiring PostgreSQL expertise want indexing discipline, migration workflows that tolerate zero downtime, and pragmatic pgvector adoption without ignoring planner realities. BalochDev scripts migrations via tools teams already trust — Flyway, Prisma, Drizzle, or SQL — and validates backups/restores before launches matter. For multitenant SaaS, RLS policies are paired with integration tests so regressions surface before fraud attempts.",
    introPanel: {
      kicker: "Relational truth",
      headline: "BalochDev’s Postgres fundamentals",
      tiles: [
        { label: "Migration hygiene", sub: "Expand-contract — destructive DDL gated behind dual-write phases." },
        { label: "Indexing realism", sub: "Explain plans verified — no vanity indexes cluttering writes." },
        { label: "JSONB boundaries", sub: "Typed constraints still applied — documents aren’t junk drawers forever." },
        { label: "Extensions thoughtfully", sub: "pgvector/pg_trgm added when workloads justify ops overhead." },
      ],
    },
    deliveryHeading: "SaaS data cores — Postgres programs BalochDev stewards.",
    why: [
      { title: "Rock-solid SQL", text: "Predictable joins survive scrutiny better than bespoke engines early." },
      { title: "Rich extensions", text: "Vectors + FTS coexist beside transactional rows." },
      { title: "Managed hosts abound", text: "RDS, Supabase, Neon — portability preserved via SQL discipline." },
      { title: "Operational tooling", text: "Replication, PITR, and observability mature." },
    ],
    deliveryTags: ["Multi-tenant schemas", "Billing ledger modeling", "RAG vector tiers", "Full-text catalogs", "Read replicas", "Performance remediation"],
    deliveryLead:
      "Backup drills are non-negotiable — teams discover weaknesses during rehearsals, not ransomware headlines.",
    faq: [
      { q: "Postgres vs MySQL?", a: "Postgres when extensions/advanced SQL matter; MySQL when legacy estates dictate." },
      { q: "Vectors?", a: "pgvector first — isolated engines when cardinality demands specialization." },
    ],
  },

  mysql: {
    iconKey: "mysql",
    title: "MySQL · MariaDB",
    metaTitle: "MySQL MariaDB database consulting — BalochDev",
    description:
      "BalochDev maintains MySQL and MariaDB tiers — replication hygiene, InnoDB tuning, migration lifts toward Postgres when warranted, and secure privileges aligned with least-privilege app roles.",
    keywords: [
      "MySQL database consulting",
      "MariaDB performance tuning",
      "MySQL replication migration",
      "InnoDB optimization services",
      "BalochDev MySQL expert",
    ],
    heroLead:
      "MySQL powers countless LAMP estates — we stabilize slow queries and tighten grants before lift-and-shift debates.",
    seoTitle: "How BalochDev operates MySQL estates responsibly",
    seoBody:
      "Organizations searching MySQL consulting need guidance on isolation levels, replication lag triage, and character set pitfalls during migrations. BalochDev profiles hotspots with slow logs and metrics, removes overly privileged application users, and scripts upgrades through staging clusters. When JSON workloads dominate without rigorous constraints, we evaluate Postgres migration ROI honestly.",
    introPanel: {
      kicker: "Operational SQL",
      headline: "BalochDev’s MySQL maintenance posture",
      tiles: [
        { label: "Privilege audits", sub: "Applications never share root — blast radius minimized." },
        { label: "Replication health", sub: "Lag alarms before reads serve stale financial data." },
        { label: "Schema migrations", sub: "Online DDL strategies chosen per risk appetite." },
        { label: "Exit strategies", sub: "Document paths toward Postgres without risky big-bangs." },
      ],
    },
    deliveryHeading: "Legacy stacks & commerce DBs — MySQL/MariaDB support by BalochDev.",
    why: [
      { title: "Ubiquity", text: "Hosting and tooling universally understood." },
      { title: "Performance culture", text: "InnoDB tuning playbook mature." },
      { title: "Replication patterns", text: "Read scaling paths well traveled." },
      { title: "Cost-effective", text: "Runs lean on modest hardware when tuned." },
    ],
    deliveryTags: ["LAMP modernization", "Magento/Woo DB hygiene", "Reporting replicas", "Backup verification", "Grant reductions", "Charset migrations"],
    deliveryLead:
      "Upgrade windows planned — skipping minor releases accumulates CVE debt nobody wants explain at board meetings.",
    faq: [
      { q: "MySQL vs Postgres?", a: "Capabilities converge — BalochDev chooses based on workload + existing estate." },
      { q: "Cloud RDS?", a: "Parameter groups + monitoring tuned — vendor defaults rarely suffice forever." },
    ],
  },

  mongodb: {
    iconKey: "mongodb",
    title: "MongoDB document data",
    metaTitle: "MongoDB development & Atlas consulting — BalochDev",
    description:
      "BalochDev designs MongoDB document models — indexing reviews, aggregation pipelines, Atlas-tier sizing, and guardrails so flexible schemas do not become schema-less chaos.",
    keywords: [
      "MongoDB consulting services",
      "MongoDB Atlas optimization",
      "MongoDB aggregation pipeline developer",
      "document database design",
      "BalochDev MongoDB",
    ],
    heroLead:
      "MongoDB fits evolving payloads — we enforce conventions so engineers still know where billing IDs live.",
    seoTitle: "How BalochDev ships MongoDB without mystery documents",
    seoBody:
      "Teams evaluating MongoDB development worry about unindexed scans and ambiguous schemas that debugging nightmares breed from. BalochDev defines collection conventions, applies schema validation where stability demands, and builds aggregation pipelines with explain plans tracked in CI when feasible. Atlas migrations receive VPC/peering reviews — secrets never checked into repos.",
    introPanel: {
      kicker: "Document modeling",
      headline: "BalochDev’s MongoDB guardrails",
      tiles: [
        { label: "Indexing discipline", sub: "Compound indexes aligned with real queries — not cargo cult." },
        { label: "Validation boundaries", sub: "JSON Schema hooks protect critical fields." },
        { label: "Aggregation hygiene", sub: "$lookup budgets monitored — cross-collection storms flagged." },
        { label: "Operational tooling", sub: "Backup snapshots tested — restores scripted quarterly." },
      ],
    },
    deliveryHeading: "Telemetry & catalogs — MongoDB workloads BalochDev architects.",
    why: [
      { title: "Flexible shapes", text: "Adapt when sources evolve weekly." },
      { title: "Atlas ops", text: "Managed upgrades reduce pager fatigue." },
      { title: "Aggregation power", text: "Rich pipelines replace brittle app joins occasionally." },
      { title: "Geo & search helpers", text: "Indexes beyond relational basics available natively." },
    ],
    deliveryTags: ["Event catalogs", "IoT telemetry", "Content blobs", "Gaming profiles", "Mobile offline sync backends", "Analytics staging"],
    deliveryLead:
      "Transactions exist — BalochDev uses them when multi-document consistency truly matters.",
    faq: [
      { q: "Mongo vs Postgres JSONB?", a: "Mongo when document workflows dominate; Postgres when relational integrity joins ML/feature stores." },
      { q: "ODM?", a: "Mongoose/Prisma chosen per team — conventions documented regardless." },
    ],
  },

  firebase: {
    iconKey: "firebase",
    title: "Firebase · Firestore",
    metaTitle: "Firebase Firestore development — BalochDev",
    description:
      "BalochDev implements Firebase Auth + Firestore mobile backends — security rules reviews, offline caching patterns, and Cloud Functions hooks aligned with quota realities.",
    keywords: [
      "Firebase development agency",
      "Firestore security rules consulting",
      "Firebase Auth mobile integration",
      "Firebase scalability patterns",
      "BalochDev Firebase",
    ],
    heroLead:
      "Firebase accelerates mobile MVPs — BalochDev hardens rules before attackers discover permissive reads.",
    seoTitle: "How BalochDev secures Firebase-backed apps",
    seoBody:
      "Teams searching Firebase development services need realistic scaling conversations — compound queries limits, cold starts on Functions, and billing surprises from reads. BalochDev models rules with simulation harnesses, structures collections for efficient pagination, and pairs Blaze plans with budgets/alerts. When relational modeling dominates later, we stage migrations toward Postgres without freezing features.",
    introPanel: {
      kicker: "Mobile-native data",
      headline: "BalochDev’s Firebase checklist",
      tiles: [
        { label: "Rules-first security", sub: "Least privilege tested — not guessed." },
        { label: "Offline UX", sub: "Reads cached thoughtfully — conflict strategies documented." },
        { label: "Callable boundaries", sub: "Sensitive writes behind Functions — not client SDK-only." },
        { label: "Quota literacy", sub: "Indexing + pagination tuned — invoices predictable." },
      ],
    },
    deliveryHeading: "Realtime mobile apps — Firebase stacks BalochDev ships.",
    why: [
      { title: "Realtime UX", text: "Listeners keep UX fresh without socket boilerplate." },
      { title: "Auth integration", text: "Phone/email/OAuth flows accelerate onboarding." },
      { title: "Flutter synergy", text: "Natural pairing BalochDev deploys often." },
      { title: "Managed scaling", text: "Ops offload early — focus stays product." },
    ],
    deliveryTags: ["Chat features", "Field apps", "Live dashboards", "Gamification", "Subscriptions via Stripe bridges", "Prototype MVPs"],
    deliveryLead:
      "Rules deployments staged — BalochDev tests denials as aggressively as allows.",
    faq: [
      { q: "Firestore vs RTDB?", a: "Firestore default — RTDB only when legacy or latency profiles justify." },
      { q: "HIPAA?", a: "Requires Firebase GCP contractual configs — BalochDev verifies prerequisites early." },
    ],
  },

  "supabase-postgres": {
    iconKey: "supabase",
    title: "Supabase Postgres platform",
    metaTitle: "Supabase Postgres auth realtime consulting — BalochDev",
    description:
      "BalochDev delivers Supabase projects — Postgres with Auth, Row-Level Security, Storage signed URLs, and Realtime channels — migrations automated and policies tested.",
    keywords: [
      "Supabase development agency",
      "Supabase RLS consulting",
      "Supabase realtime subscriptions",
      "Supabase auth integration",
      "BalochDev Supabase expert",
    ],
    heroLead:
      "Supabase bundles Postgres superpowers — BalochDev treats RLS as security architecture, not an afterthought.",
    seoTitle: "How BalochDev builds production SaaS on Supabase",
    seoBody:
      "Teams adopting Supabase want Postgres without reinventing auth — but multi-tenant isolation demands disciplined policies. BalochDev authors migrations in SQL-first tooling, writes RLS tests mirroring attacker scenarios, and configures Storage buckets with tight MIME/size controls. Realtime usage receives subscribe scopes audited — no accidental broad listeners leaking competitor data.",
    introPanel: {
      kicker: "Managed Postgres",
      headline: "BalochDev’s Supabase delivery stance",
      tiles: [
        { label: "RLS everywhere", sub: "Policies enforced per tenant — service roles segmented." },
        { label: "Migration pipelines", sub: "CI-applied SQL — drift rejected automatically." },
        { label: "Auth pairing", sub: "JWT claims mapped cleanly into policies across web/mobile." },
        { label: "Realtime scopes", sub: "Channels filtered — subscriptions align with authorization." },
      ],
    },
    deliveryHeading: "Modern SaaS cores — Supabase programs BalochDev architects.",
    why: [
      { title: "Velocity", text: "Auth + DB + storage unified reduces glue months." },
      { title: "SQL openness", text: "Escape hatch to standard Postgres anytime." },
      { title: "Realtime UX", text: "Broadcast-friendly channels built-in." },
      { title: "Edge hooks", text: "Functions integrate where latency-sensitive transforms belong." },
    ],
    deliveryTags: ["B2B multitenant apps", "Collaborative editors", "Community platforms", "Mobile offline-first sync patterns", "AI apps with pgvector", "Billing-adjacent metadata"],
    deliveryLead:
      "Cost dashboards monitored — Supabase shines until naive reads spike invoices; BalochDev engineers pagination early.",
    faq: [
      { q: "Supabase vs Firebase?", a: "Supabase when SQL/relations dominate; Firebase when document realtime UX drives MVP speed." },
      { q: "Self-host?", a: "Possible — BalochDev evaluates ops maturity before recommending forks." },
    ],
  },

  redis: {
    iconKey: "redis",
    title: "Redis caching & queues",
    metaTitle: "Redis caching queues consulting — BalochDev",
    description:
      "BalochDev configures Redis for caches, rate limits, sessions, and queues — eviction policies tuned, cluster sizing honest, and fallback paths when Redis blips.",
    keywords: [
      "Redis consulting services",
      "Redis caching strategies",
      "Redis rate limiting API",
      "Redis queue patterns",
      "BalochDev Redis expert",
    ],
    heroLead:
      "Redis trims latency dramatically — BalochDev documents TTL rationale so caches cannot silently serve stale financial truths.",
    seoTitle: "How BalochDev operates Redis without cache lies",
    seoBody:
      "Teams introducing Redis need clarity on persistence modes, memory ceilings, and serialization formats impacting CPU. BalochDev chooses LRU vs LFU deliberately, isolates heavy workloads into dedicated instances, and scripts failover drills for clustered setups. For rate limiting, token buckets align with product tiers — no naive counters hammering single hot keys without sharding.",
    introPanel: {
      kicker: "In-memory ops",
      headline: "BalochDev’s Redis playbook",
      tiles: [
        { label: "TTL transparency", sub: "Stale reads documented — finance/legal consulted." },
        { label: "Memory budgets", sub: "Alerts before eviction storms erase sessions unexpectedly." },
        { label: "Serialization discipline", sub: "Pick formats balancing CPU vs payload size." },
        { label: "HA readiness", sub: "Replication/topologies validated — promote drills practiced." },
      ],
    },
    deliveryHeading: "Latency trims — Redis layers BalochDev integrates.",
    why: [
      { title: "Speed", text: "Microsecond-class reads reshape UX latencies." },
      { title: "Versatility", text: "Cache, pub/sub, rate limiting — multi-role engine." },
      { title: "Operational familiarity", text: "Teams hire Redis literacy broadly." },
      { title: "Vendor options", text: "Elasticache, Redis Cloud, self-hosted — BalochDev adapts." },
    ],
    deliveryTags: ["Session stores", "API rate limits", "Leaderboards", "Ephemeral locks", "Job queues", "GraphQL response caches"],
    deliveryLead:
      "Single-region reliance acknowledged — BalochDev plans degraded modes when Redis unavailable briefly.",
    faq: [
      { q: "Redis vs Memcached?", a: "Redis multi-structure wins usually — Memcached when absurdly simple caches suffice." },
      { q: "Persistence?", a: "Depends on data loss tolerance — BalochDev documents RPO honestly." },
    ],
  },

  prisma: {
    iconKey: "prisma",
    title: "Prisma · Drizzle ORMs",
    metaTitle: "Prisma Drizzle ORM consulting — BalochDev",
    description:
      "BalochDev implements Prisma and Drizzle for type-safe SQL — migration pipelines, connection pooling guidance, and raw-SQL escape paths when ORMs fight analytics queries.",
    keywords: [
      "Prisma ORM consulting",
      "Drizzle ORM TypeScript",
      "database migrations Prisma",
      "Node SQL type safety",
      "BalochDev Prisma developer",
    ],
    heroLead:
      "ORMs accelerate TS backends — BalochDev ensures migrations remain reviewable and pools sized for serverless realities.",
    seoTitle: "How BalochDev keeps Prisma/Drizzle maintainable",
    seoBody:
      "Teams adopting Prisma want schema drift eliminated via CI — BalochDev wires migrate deploy hooks safely across staging/production with backups gated. Connection pooling strategies respect serverless vs long-lived workers; naive defaults exhaust DB connections fast. When analytical workloads dominate, raw SQL modules coexist cleanly without abandoning typed cores.",
    introPanel: {
      kicker: "Typed SQL",
      headline: "BalochDev’s ORM discipline",
      tiles: [
        { label: "Migration reviews", sub: "Destructive changes flagged — reviewers accountable." },
        { label: "Pooling literacy", sub: "PgBouncer/supavisor patterns applied — connections bounded." },
        { label: "Escape hatches", sub: "Tagged SQL for heavy queries — ORM not a religion." },
        { label: "Shared models", sub: "DTO boundaries align FE/BE — fewer serialization bugs." },
      ],
    },
    deliveryHeading: "Type-safe data layers — Prisma/Drizzle integrations BalochDev ships.",
    why: [
      { title: "DX", text: "Autocomplete queries accelerate delivery." },
      { title: "Safety", text: "Compile-time catches reduce prod exceptions." },
      { title: "Migration tooling", text: "Repeatable deploy pipelines reduce fear." },
      { title: "Framework-neutral", text: "Works with Nest/Express/Fastify interchangeably." },
    ],
    deliveryTags: ["Greenfield APIs", "Monorepo packages", "Supabase + Prisma hybrids", "Read-model projections", "Soft-delete patterns", "Audit trails"],
    deliveryLead:
      "We watch introspection drift — multi-schema Postgres setups need explicit configuration.",
    faq: [
      { q: "Prisma vs Drizzle?", a: "Prisma when codegen maturity wins; Drizzle when SQL-first minimalism preferred." },
      { q: "Planetscale/MySQL quirks?", a: "BalochDev validates FK assumptions — vendor differences bite newcomers." },
    ],
  },

  qdrant: {
    iconKey: "qdrant",
    title: "Qdrant · pgvector search",
    metaTitle: "Vector database Qdrant pgvector consulting — BalochDev",
    description:
      "BalochDev implements vector retrieval for RAG — pgvector inside Postgres first; Qdrant when throughput/isolation demands specialized clusters — evaluation harnesses and hybrid lexical + vector ranking.",
    keywords: [
      "vector database consulting",
      "Qdrant integration developer",
      "pgvector RAG implementation",
      "semantic search production",
      "BalochDev vector search",
    ],
    heroLead:
      "Vector search powers modern assistants — BalochDev benchmarks recall/latency on your corpus before picking engines.",
    seoTitle: "How BalochDev architects vector retrieval responsibly",
    seoBody:
      "Teams exploring vector databases often underestimate embedding drift and filtering needs — naive cosine similarity demos collapse under domain synonyms. BalochDev defines chunking strategies, hybrid retrieval paths with Postgres FTS or OpenSearch, and observability on embedding pipelines. Qdrant enters when horizontal shard demands or advanced quantization outweigh Postgres simplicity.",
    introPanel: {
      kicker: "Semantic retrieval",
      headline: "BalochDev’s vector rollout stages",
      tiles: [
        { label: "Baseline metrics", sub: "Precision/recall measured — not vibes." },
        { label: "Hybrid ranking", sub: "Vectors + keywords reduce hallucinated misses." },
        { label: "Filtering discipline", sub: "ACL-aware retrieval — vectors respect tenancy." },
        { label: "Ops realism", sub: "Backfill jobs monitored — clusters sized honestly." },
      ],
    },
    deliveryHeading: "RAG & search UX — vector stacks BalochDev tunes.",
    why: [
      { title: "Better assistants", text: "Ground answers in retrieved passages users trust." },
      { title: "Flex paths", text: "Start Postgres-native — isolate engines only when metrics demand." },
      { title: "Hybrid UX", text: "Keywords still matter — pure vectors rarely suffice alone." },
      { title: "Privacy hooks", text: "Chunk redaction before embeddings where compliance demands." },
    ],
    deliveryTags: ["Customer support bots", "Internal knowledge portals", "Catalog discovery", "Compliance-aware doc search", "Dedup pipelines", "Embedding pipeline monitoring"],
    deliveryLead:
      "Embeddings age — BalochDev schedules refresh windows tied to content churn.",
    faq: [
      { q: "pgvector vs Qdrant?", a: "pgvector simplifies ops; Qdrant scales isolated vector traffic — decide with metrics." },
      { q: "Chunk size?", a: "Domain-dependent — legal vs code chunks differ; BalochDev prototypes multiple strategies." },
    ],
  },

  neo4j: {
    iconKey: "neo4j",
    title: "Neo4j graph databases",
    metaTitle: "Neo4j graph database consulting — BalochDev",
    description:
      "BalochDev models graph domains in Neo4j — fraud rings, recommendations, org hierarchies — with Cypher query tuning and sync patterns back to relational systems of record.",
    keywords: [
      "Neo4j consulting services",
      "graph database development",
      "Neo4j fraud detection patterns",
      "knowledge graph Neo4j",
      "BalochDev Neo4j expert",
    ],
    heroLead:
      "Graphs excel when relationships are the product — BalochDev integrates them without pretending every table belongs in Neo4j.",
    seoTitle: "How BalochDev applies Neo4j to relationship-heavy problems",
    seoBody:
      "Organizations evaluating Neo4j need clarity on memory sizing, modeling pitfalls (supernodes), and consistency boundaries versus Postgres truth. BalochDev prototypes traversals with realistic datasets, applies indexes thoughtfully, and defines sync jobs when relational CRM remains authoritative. Graph algorithms run with budgets — not unlimited exploratory queries in prod.",
    introPanel: {
      kicker: "Relationship intelligence",
      headline: "BalochDev’s Neo4j guardrails",
      tiles: [
        { label: "Domain fit proof", sub: "Traversals beat SQL joins measurably — validated early." },
        { label: "Supernode avoidance", sub: "Model celebrity nodes deliberately — latencies preserved." },
        { label: "Operational pairing", sub: "Relational stores remain sources of truth where sensible." },
        { label: "Algo budgets", sub: "PageRank-style jobs isolated — production OLTP protected." },
      ],
    },
    deliveryHeading: "Fraud & discovery graphs — Neo4j deliveries BalochDev architects.",
    why: [
      { title: "Natural modeling", text: "Networks map cleanly — fewer awkward join tables." },
      { title: "Traversal speed", text: "Deep hops outperform naive relational recursion." },
      { title: "Insight algorithms", text: "Built-in graph data science tooling mature." },
      { title: "Visualization synergy", text: "Stakeholders grasp fraud/community patterns faster." },
    ],
    deliveryTags: ["Fraud investigations", "Recommendation engines", "Org charts & permissions", "Supply chain tracing", "Identity resolution", "Partner ecosystem maps"],
    deliveryLead:
      "Graph backups tested — relationship corruption harder to eyeball than flat rows.",
    faq: [
      { q: "Neo4j vs Postgres recursive CTEs?", a: "Neo4j when traversals dominate latency; Postgres when graphs ancillary." },
      { q: "Aura vs self-host?", a: "Aura reduces ops; self-host when compliance demands VPC control." },
    ],
  },

  elastic: {
    iconKey: "elastic",
    title: "Elasticsearch · OpenSearch",
    metaTitle: "Elasticsearch OpenSearch consulting — BalochDev",
    description:
      "BalochDev builds search indices with Elasticsearch or OpenSearch — analyzers tuned per locale, relevance scoring iterated with click logs, and cluster sizing grounded in retention policies.",
    keywords: [
      "Elasticsearch consulting services",
      "OpenSearch managed migration",
      "enterprise search relevance tuning",
      "ELK stack integration developer",
      "BalochDev Elasticsearch",
    ],
    heroLead:
      "Full-text search is never fire-and-forget — BalochDev tunes analyzers and synonyms until conversion metrics move.",
    seoTitle: "How BalochDev delivers Elasticsearch/OpenSearch you can operate",
    seoBody:
      "Teams hiring Elasticsearch expertise struggle with shard explosions, mapping churn, and relevance that feels random. BalochDev defines index templates, handles multilingual analyzers deliberately, and integrates observability for JVM heap pressure. OpenSearch forks receive pragmatic licensing conversations — BalochDev migrates when AWS alignment or cost models dictate.",
    introPanel: {
      kicker: "Search relevance",
      headline: "BalochDev’s Elasticsearch playbook",
      tiles: [
        { label: "Analyzer truth", sub: "Stemming/stopwords aligned per locale — not English-default guesses." },
        { label: "Synonym governance", sub: "Retail/domain synonyms curated — not infinite spreadsheets unmanaged." },
        { label: "Shard realism", sub: "Daily volumes modeled — oversharded clusters cost fortunes." },
        { label: "Hybrid retrieval", sub: "Vectors optional — lexical baseline honored." },
      ],
    },
    deliveryHeading: "Catalog & site search — Elasticsearch/OpenSearch by BalochDev.",
    why: [
      { title: "Relevance tooling", text: "Fine-grained scoring beats naive DB LIKE queries." },
      { title: "Analytics synergy", text: "Aggregations power merchandising insights." },
      { title: "Scaling patterns", text: "Horizontal shard stories mature." },
      { title: "OpenSearch option", text: "Community/AWS alignment without losing Elastic API familiarity." },
    ],
    deliveryTags: ["Ecommerce search", "Docs portals", "Support KB search", "Logging adjacent discovery", "Faceted navigation", "Click-through relevance tuning"],
    deliveryLead:
      "Security includes index ACLs — BalochDev prevents multi-tenant leaks via filtering layers.",
    faq: [
      { q: "Elastic vs Algolia?", a: "Elastic when customization/control dominate; Algolia when SaaS speed paramount." },
      { q: "Vectors?", a: "Hybrid setups increasingly common — BalochDev evaluates ROI versus pgvector." },
    ],
  },
};
