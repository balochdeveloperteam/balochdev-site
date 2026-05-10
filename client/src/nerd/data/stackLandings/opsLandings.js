/** @type {Record<string, import('../technologyAiLandings.js').AiLandingConfig>} */
export const OPS_TECH_LANDINGS = {
  vercel: {
    iconKey: "vercel",
    title: "Vercel deployments",
    metaTitle: "Vercel deployment & Next.js hosting — BalochDev",
    description:
      "BalochDev configures Vercel projects — preview deployments, environment isolation, edge middleware, fluid compute budgets, and rollback drills aligned with Next.js App Router caching semantics.",
    keywords: [
      "Vercel consulting Next.js",
      "Vercel preview deployments CI",
      "Vercel edge middleware consulting",
      "serverless Next.js production",
      "BalochDev Vercel expert",
    ],
    heroLead:
      "Vercel pairs tightly with Next.js — BalochDev ensures env vars, previews, and caching tags match how teams actually ship.",
    seoTitle: "How BalochDev runs Vercel for serious Next.js programs",
    seoBody:
      "Teams adopting Vercel hosting want realistic conversations about function durations, data locality, and cost dashboards tied to routes — not surprise invoices post-launch. BalochDev wires OIDC previews where enterprises demand, integrates Analytics/Speed Insights selectively, and documents rollback paths beyond redeploy hope. When workloads exceed platform sweet spots, we isolate databases and workers deliberately.",
    introPanel: {
      kicker: "Deploy ergonomics",
      headline: "BalochDev’s Vercel operational checklist",
      tiles: [
        { label: "Preview fidelity", sub: "Branches mirror prod secrets discipline — staging tokens stay scoped." },
        { label: "Caching literacy", sub: "Tags and revalidation honored — incidents traceable." },
        { label: "Budget telemetry", sub: "Fluid compute and bandwidth monitored with humane alerting." },
        { label: "Rollback readiness", sub: "Promotions rehearsed — mean time to recovery drops." },
      ],
    },
    deliveryHeading: "Streaming Next apps — Vercel pipelines BalochDev stewards.",
    why: [
      { title: "DX excellence", text: "Preview URLs accelerate stakeholder QA." },
      { title: "Edge-ready", text: "Middleware and regional routing patterns mature." },
      { title: "Framework synergy", text: "Official Next integration reduces bespoke infra." },
      { title: "Operational tooling", text: "Analytics and alerts integrate cleanly." },
    ],
    deliveryTags: ["Marketing Next apps", "AI streaming endpoints", "Preview QA workflows", "Enterprise SSO previews", "ISR-heavy catalogs", "Global latency tuning"],
    deliveryLead:
      "Portability hooks remain documented — BalochDev avoids tight coupling surprises during roadmap pivots.",
    faq: [
      { q: "Vercel vs Cloudflare?", a: "Vercel when Next synergy dominates; Cloudflare when Workers and edge security weigh heavier." },
      { q: "Self-hosted Next?", a: "Docker hosts feasible — BalochDev maps ops burden upfront honestly." },
    ],
  },

  cloudflare: {
    iconKey: "cloudflare",
    title: "Cloudflare Workers · Pages",
    metaTitle: "Cloudflare Workers Pages consulting — BalochDev",
    description:
      "BalochDev implements Cloudflare Workers and Pages — edge middleware, security headers, caching layers, and Durable Objects when coordination demands exceed trivial redirects.",
    keywords: [
      "Cloudflare Workers developer",
      "Cloudflare Pages deployment consulting",
      "edge middleware Cloudflare",
      "Cloudflare security headers",
      "BalochDev Cloudflare expert",
    ],
    heroLead:
      "Cloudflare excels when latency and security intersect globally — BalochDev keeps Worker complexity observable.",
    seoTitle: "How BalochDev engineers Cloudflare edge stacks",
    seoBody:
      "Organizations exploring Cloudflare Workers often seek JWT or API gateway patterns at the edge, bot tightening, or cache-aware HTML rewrites balancing personalization versus TTL realities. BalochDev configures wrangler pipelines across environments, instruments Workers Analytics and structured logs, and integrates KV, R2, or D1 when workloads justify operational overhead.",
    introPanel: {
      kicker: "Edge platform",
      headline: "BalochDev’s Cloudflare rollout habits",
      tiles: [
        { label: "Security defaults", sub: "Headers and WAF tuned deliberately." },
        { label: "Caching truth", sub: "Bypass rules documented — shopper versus editor flows isolated." },
        { label: "Stateful realism", sub: "Durable Objects when coordination justified — not by default." },
        { label: "CI/CD parity", sub: "Wrangler deploy previews reproducible — drift minimized." },
      ],
    },
    deliveryHeading: "Edge middleware and static fronts — Cloudflare programs BalochDev builds.",
    why: [
      { title: "Global latency", text: "Users served close to POPs logically." },
      { title: "Security breadth", text: "WAF and bot tools integrate stack-native." },
      { title: "Pricing leverage", text: "Workers pricing predictable when workloads bounded." },
      { title: "Hybrid architectures", text: "Protect origins hosted elsewhere cleanly." },
    ],
    deliveryTags: ["Edge auth middleware", "HTML rewriting experiments", "Rate limiting APIs", "Global caches", "R2 media pipelines", "Tunnel prototypes"],
    deliveryLead:
      "Stateful Workers escalate cautiously — BalochDev documents consistency semantics replicas impose.",
    faq: [
      { q: "Workers vs Lambda?", a: "Workers excel latency-sensitive routing globally; Lambda when AWS glue dominates." },
      { q: "D1 or KV?", a: "Match consistency expectations — BalochDev prototypes honestly." },
    ],
  },

  docker: {
    iconKey: "docker",
    title: "Docker · Compose",
    metaTitle: "Docker container consulting — BalochDev",
    description:
      "BalochDev authors Dockerfiles and Compose stacks — multi-stage builds, smaller bases, healthchecks, and parity across laptops, CI, and production clusters.",
    keywords: [
      "Docker consulting services",
      "Docker Compose development workflow",
      "Dockerfile security review",
      "Kubernetes Docker migration",
      "BalochDev Docker expert",
    ],
    heroLead:
      "Containers unify environments — BalochDev shrinks images and documents Compose boundaries before orchestrator complexity compounds.",
    seoTitle: "How BalochDev operationalizes Docker without container chaos",
    seoBody:
      "Teams hiring Docker consultants want reproducible builds across laptops and CI, multi-stage images that trim attack surfaces, and Compose stacks that onboard juniors without endless tribal README rituals. BalochDev integrates image scanning on PRs, defines CPU and memory limits that tame noisy-neighbor dev machines, and plans Kubernetes migrations only after Compose workflows stabilize observably.",
    introPanel: {
      kicker: "Portable workloads",
      headline: "BalochDev’s container fundamentals",
      tiles: [
        { label: "Multi-stage builds", sub: "Smaller runtime artifacts — faster pulls everywhere." },
        { label: "Healthchecks wired", sub: "Orchestrators route traffic intelligently." },
        { label: "Secrets posture", sub: "Never bake credentials — runtime mounts documented." },
        { label: "Compose ergonomics", sub: "Profiles for selective services — laptops stay fast." },
      ],
    },
    deliveryHeading: "Microservices and local parity — Docker lanes BalochDev engineers.",
    why: [
      { title: "Dev/prod parity", text: "Reduces works-on-my-machine surprises drastically." },
      { title: "CI/CD portability", text: "Images fingerprint deterministic pipelines." },
      { title: "Security posture", text: "Lean bases reduce CVE blast radius." },
      { title: "Orchestrator-ready", text: "Kubernetes adoption inherits sane Dockerfile lineage." },
    ],
    deliveryTags: ["API containers", "Worker queues", "Data pipelines", "Review environments", "On-prem parity packs", "ARM builds"],
    deliveryLead:
      "SBOM and base-image pinning tracked — BalochDev budgets quarterly CVE remediation realistically.",
    faq: [
      { q: "Docker vs VMs?", a: "Containers emphasize portability density — VMs when kernels diverge sharply compliance-wise." },
      { q: "Compose vs Kubernetes?", a: "Compose for developer fidelity daily — Kubernetes when replicas dominate uptime calculus." },
    ],
  },

  railway: {
    iconKey: "railway",
    title: "Railway · Render PaaS",
    metaTitle: "Railway Render PaaS deployment — BalochDev",
    description:
      "BalochDev deploys Railway and Render services — Postgres add-ons, background workers, autoscale realism, and cost dashboards grounded in measured workloads.",
    keywords: [
      "Railway app deployment consulting",
      "Render platform developer",
      "PaaS PostgreSQL hosting",
      "Railway Docker deploy",
      "BalochDev Railway Render",
    ],
    heroLead:
      "Railway and Render accelerate backends without Kubernetes committees — BalochDev aligns replicas and database tiers with traffic you have measured, not imagined.",
    seoTitle: "How BalochDev runs Railway and Render for lean teams",
    seoBody:
      "Teams choosing Railway or Render want Git-backed deploys, managed Postgres add-ons, and realistic autoscaling conversations — without surprise cold starts or idle billing spikes. BalochDev wires environment separation, healthchecks, and structured logs into observability stacks early. When workloads exceed PaaS ceilings, we migrate containers to Kubernetes or bare VMs with documented cutovers.",
    introPanel: {
      kicker: "Lean PaaS",
      headline: "BalochDev’s Railway/Render checklist",
      tiles: [
        { label: "Sizing honesty", sub: "Load tests before assuming autoscale fixes architecture gaps." },
        { label: "Add-on discipline", sub: "Postgres backups and connection pools validated — not defaulted blindly." },
        { label: "Worker isolation", sub: "Background jobs separated — queues monitored deliberately." },
        { label: "Spend telemetry", sub: "Alerts when idle services leak dollars weekly unnoticed." },
      ],
    },
    deliveryHeading: "Fast backends — Railway and Render pipelines BalochDev operates.",
    why: [
      { title: "Velocity", text: "Ship APIs hours after repo creation when stacks fit." },
      { title: "Managed data", text: "Postgres add-ons reduce ops distraction early." },
      { title: "Git-native deploys", text: "Branches map cleanly to preview environments." },
      { title: "Kubernetes deferral", text: "Avoid orchestrator tax until replication demands it." },
    ],
    deliveryTags: ["Node/Python APIs", "Workers and cron", "Managed Postgres services", "Staging parity", "Dockerfile deploys", "Cost guardrails"],
    deliveryLead:
      "Portability preserved — BalochDev keeps Dockerfiles deployable elsewhere before PaaS affinity deepens.",
    faq: [
      { q: "Railway vs Render?", a: "Both viable — BalochDev chooses based on pricing fit, region availability, and addon maturity." },
      { q: "When to leave PaaS?", a: "Strict tenancy, GPU needs, or bespoke networking often trigger migrations — BalochDev plans milestones." },
    ],
  },

  custom_vm: {
    iconKey: "custom_vm",
    title: "Custom VMs · bare metal",
    metaTitle: "Custom VM bare-metal DevOps consulting — BalochDev",
    description:
      "BalochDev provisions and hardens VMs on Hetzner, DigitalOcean, AWS EC2, and similar — systemd services, firewall baselines, backups, patching cadences, and observability that survives turnover.",
    keywords: [
      "Linux server administration consulting",
      "AWS EC2 deployment hardening",
      "bare metal DevOps services",
      "self-hosted infrastructure consultant",
      "BalochDev VM provisioning",
    ],
    heroLead:
      "Some GPUs, compliance envelopes, or legacy adapters demand owned servers — BalochDev treats patching and backups as product features, not folklore.",
    seoTitle: "How BalochDev operates self-managed servers responsibly",
    seoBody:
      "Organizations searching VM hosting consultants want SSH bastions, least-privilege sudo, automated upgrades with rollback paths, and backup restores rehearsed quarterly. BalochDev installs metrics exporters, configures firewall allowlists thoughtfully, and documents disk encryption posture where regulators ask. Containers may sit atop VMs — kernel hygiene stays explicit.",
    introPanel: {
      kicker: "Owned infra",
      headline: "BalochDev’s VM baseline posture",
      tiles: [
        { label: "Reproducible provisioning", sub: "Ansible or cloud-init scripts — fewer snowflakes." },
        { label: "Firewall defaults", sub: "Explicit allowlists — services never accidentally world-open." },
        { label: "Backup drills", sub: "Restore exercises logged — RPO/RTO claimed honestly." },
        { label: "Observability", sub: "Metrics plus logs shipped centrally — incidents stay bounded." },
      ],
    },
    deliveryHeading: "Dedicated workloads — VM estates BalochDev maintains.",
    why: [
      { title: "Control", text: "Tune kernels and GPUs without managed-platform ceilings." },
      { title: "Compliance stories", text: "Regional or air-gapped boundaries achievable clearly." },
      { title: "Cost leverage", text: "Committed instances beat elastic markup when workloads steady." },
      { title: "Legacy coexistence", text: "Odd adapters sometimes VM-only practical." },
    ],
    deliveryTags: ["GPU inference hosts", "High-memory workers", "Database replicas", "Jump bastions", "Hybrid VPN bridges", "Compliance-heavy estates"],
    deliveryLead:
      "On-call runbooks live beside repos — BalochDev refuses undocumented hero-dependent paging cultures.",
    faq: [
      { q: "Cloud VMs vs bare metal?", a: "Bare metal when latency jitter or licensing dictates — clouds when elasticity dominates." },
      { q: "Kubernetes on VMs?", a: "Often yes — BalochDev validates etcd backups and upgrade cadences early." },
    ],
  },

  github: {
    iconKey: "github",
    title: "GitHub Actions · CI",
    metaTitle: "GitHub Actions CI/CD consulting — BalochDev",
    description:
      "BalochDev engineers GitHub Actions workflows — lint/test matrices, cache hygiene, OIDC deploy roles, preview environments, and branch protections humans actually follow.",
    keywords: [
      "GitHub Actions consulting",
      "CI/CD pipeline GitHub",
      "GitHub Actions OIDC AWS",
      "repository branch protection strategy",
      "BalochDev GitHub Actions",
    ],
    heroLead:
      "GitHub Actions sits beside code review — BalochDev keeps workflows deterministic so flaky pipelines stop training teams to ignore red builds.",
    seoTitle: "How BalochDev hardens GitHub Actions pipelines",
    seoBody:
      "Teams adopting GitHub Actions want reusable workflows, cache discipline that avoids stale artifacts, and OIDC federation replacing long-lived cloud secrets on runners. BalochDev segments workflows per concern — PR verification versus deploy — pins action versions with Renovate-style hygiene when budgets allow, and integrates deployment protections aligned with SOC expectations.",
    introPanel: {
      kicker: "Delivery rails",
      headline: "BalochDev’s Actions playbook",
      tiles: [
        { label: "Reusable workflows", sub: "Matrix builds centralized — drift shrinks across repos." },
        { label: "Secret posture", sub: "OIDC roles preferred — long-lived tokens minimized." },
        { label: "Artifact hygiene", sub: "Caches invalidated deliberately — mysterious flakes reduced." },
        { label: "Deploy gates", sub: "Required reviewers plus passing checks — merges trustworthy." },
      ],
    },
    deliveryHeading: "Shipping discipline — GitHub Actions stacks BalochDev implements.",
    why: [
      { title: "Native proximity", text: "Workflows live beside pull requests — friction drops." },
      { title: "Marketplace depth", text: "Thousands of actions accelerate integrations cautiously curated." },
      { title: "Matrix builds", text: "Cross-version testing automated realistically." },
      { title: "Preview synergy", text: "Pairs naturally with Vercel/Cloudflare preview URLs." },
    ],
    deliveryTags: ["PR verification pipelines", "Release trains", "Semantic versioning automation", "Mobile signing workflows", "Docker publish pipelines", "Infrastructure drift checks"],
    deliveryLead:
      "Malicious action supply-chain risk acknowledged — BalochDev pins SHA commits for sensitive workflows.",
    faq: [
      { q: "GitHub vs GitLab CI?", a: "BalochDev delivers both — choice follows tenancy and procurement realities." },
      { q: "Self-hosted runners?", a: "When confidentiality demands — hardened images and network segmentation documented." },
    ],
  },
};
