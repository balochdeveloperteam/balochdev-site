/** @type {Record<string, import('../technologyAiLandings.js').AiLandingConfig>} */
export const AUTOMATION_TECH_LANDINGS = {
  n8n: {
    iconKey: "n8n",
    title: "n8n workflow automation",
    metaTitle: "n8n automation & self-hosted workflows — BalochDev",
    description:
      "BalochDev designs and ships n8n workflows with code nodes, queues, retries, and secrets hygiene — ideal when Zapier limits, compliance, or AI steps need a server you control.",
    keywords: [
      "n8n workflow automation",
      "self-hosted n8n consulting",
      "n8n integration developer",
      "n8n AI automation",
      "replace Zapier with n8n",
      "BalochDev n8n integration",
    ],
    heroLead:
      "n8n gives you visual workflows with escape hatches to JavaScript — we use it when integrations outgrow click-only tools but still need ops-friendly visibility.",
    seoTitle: "How BalochDev builds production n8n automations",
    seoBody:
      "Teams searching for n8n workflow automation often hit Zapier row caps, need EU-only hosting, or want AI nodes beside Postgres without vendor lock-in. BalochDev maps triggers (webhooks, CRM events, queues), models failure modes with retries and dead-letter paths, and wires credentials through vault patterns instead of pasted secrets. We pair n8n with lightweight APIs when visual graphs alone cannot express branching business rules.",
    introPanel: {
      kicker: "Operational glue",
      headline: "Where n8n earns its place beside BalochDev stacks",
      tiles: [
        { label: "Self-hosted control", sub: "Your network boundary, your retention policy — fewer surprises at audit time." },
        { label: "Code nodes & complexity", sub: "JavaScript where IF/ELSE trees explode — still readable for ops." },
        { label: "AI + CRM safely", sub: "Structured tool calls and scoped tokens — assistants never get raw admin passwords." },
        { label: "Observability", sub: "Execution logs, alerting hooks, and dashboards before traffic doubles." },
      ],
    },
    deliveryHeading: "Event bridges & internal ops — BalochDev’s n8n delivery lane.",
    why: [
      { title: "Escape from SaaS caps", text: "Fair pricing at volume versus per-task calculators that spike invoices." },
      { title: "Hybrid stacks", text: "REST + webhooks + queues — n8n sits between systems without rewriting apps." },
      { title: "Self-host option", text: "Meets residency and infosec asks click-only vendors struggle with." },
      { title: "Human-readable graphs", text: "Ops can trace failures without reading thousands of lines of glue code." },
    ],
    deliveryTags: ["CRM → Slack/Teams alerts", "Billing & subscription hooks", "Lead routing & enrichment", "Back-office reconciliation", "Incident response playbooks", "AI-assisted triage"],
    deliveryLead:
      "We scope workflows around idempotency — duplicate webhooks should not double-charge or spam customers — and document rollback paths when upstream APIs change.",
    faq: [
      { q: "n8n vs Zapier?", a: "Zapier wins fastest MVPs; n8n wins when volume, privacy, or code nodes matter — many clients keep both with clear boundaries." },
      { q: "Can n8n call our internal APIs?", a: "Yes — behind VPN or mTLS gateways with scoped service accounts — never shared passwords in flow variables." },
      { q: "How do you handle secrets?", a: "Environment vaults, runner secrets, rotation checklists — flows reference names, not literals." },
    ],
  },

  make: {
    iconKey: "make",
    title: "Make (Integromat) orchestration",
    metaTitle: "Make scenario automation & integrations — BalochDev",
    description:
      "BalochDev builds Make scenarios with routers, iterators, and error handlers — pairing visual speed with APIs when branching logic outgrows simple Zaps.",
    keywords: [
      "Make Integromat developer",
      "Make automation scenarios",
      "Make integration consultant",
      "Make vs Zapier enterprise",
      "BalochDev Make integrations",
    ],
    heroLead:
      "Make shines when marketing and ops teams want powerful branching without maintaining servers — we harden scenarios before they become silent failures.",
    seoTitle: "How BalochDev ships reliable Make scenarios",
    seoBody:
      "Prospects exploring Make Integromat integration want multi-branch routing, bulk operations, and transparent billing versus simpler Zapier paths. BalochDev structures scenarios with routers instead of duplicated flows, adds datastore steps for deduplication, and documents API quotas so launches do not hit midnight failures. When latency or compliance demands owned infra, we migrate critical paths to n8n or code while keeping Make for marketing glue.",
    introPanel: {
      kicker: "Scenario design",
      headline: "BalochDev’s playbook for maintainable Make flows",
      tiles: [
        { label: "Routers over copies", sub: "One scenario spine — fewer drift bugs when APIs bump versions." },
        { label: "Error branches", sub: "Explicit fallback paths — retries without infinite loops." },
        { label: "Rate-limit awareness", sub: "Batching and backoff tuned to vendor docs — not guesswork." },
        { label: "Hybrid exits", sub: "Webhook out to Node/Python when iterators hit complexity walls." },
      ],
    },
    deliveryHeading: "Marketing ops & CRM automation — Make inside BalochDev engagements.",
    why: [
      { title: "Deep branching", text: "Routers and iterators beat nested single-path tools for messy CRM reality." },
      { title: "Fast iteration", text: "Visual authoring keeps stakeholders in the loop during discovery." },
      { title: "Wide connector catalog", text: "Thousands of modules reduce bespoke OAuth work on day one." },
      { title: "Operational clarity", text: "Execution history helps debug production without SSH." },
    ],
    deliveryTags: ["Lead lifecycle automation", "HubSpot/Salesforce sync patterns", "Slack approval loops", "Sheet reporting pipelines", "Webhook ingress", "Iterator-heavy bulk jobs"],
    deliveryLead:
      "We treat OAuth tokens like production secrets — scoped refresh flows, monitoring on auth errors, and human-readable naming so handoffs do not orphan integrations.",
    faq: [
      { q: "Make vs n8n?", a: "Make for managed speed; n8n when you must run inside your VPC or need heavier code — we recommend based on residency and team skill mix." },
      { q: "Can scenarios survive API deprecations?", a: "We version scenarios, pin modules where needed, and schedule vendor changelog reviews for mission-critical paths." },
    ],
  },

  zapier: {
    iconKey: "zapier",
    title: "Zapier integrations",
    metaTitle: "Zapier automation & Zaps — BalochDev",
    description:
      "BalochDev wires Zapier Zaps for CRM, forms, billing, and Slack — with deduping, filters, and escalation paths before complexity demands self-hosted automation.",
    keywords: [
      "Zapier integration developer",
      "Zapier automation consultant",
      "Zapier CRM workflows",
      "Zapier webhook integration",
      "BalochDev Zapier setup",
    ],
    heroLead:
      "Zapier remains the fastest honest path from form submit to CRM note — we keep Zaps readable and monitored so they do not rot silently.",
    seoTitle: "How BalochDev implements Zapier without operational debt",
    seoBody:
      "Teams searching Zapier integration services usually need proven connectors, OAuth handled safely, and realistic task budgets. BalochDev dedupes webhook-heavy triggers, adds Formatter steps only when necessary, and documents owner contacts per Zap so turnover does not freeze ops. When task math stops making sense, we graduate heavy paths to Make or n8n while leaving Zapier for crisp marketing triggers.",
    introPanel: {
      kicker: "Speed layer",
      headline: "BalochDev’s Zapier hygiene checklist",
      tiles: [
        { label: "Filters first", sub: "Stop noisy triggers before they burn tasks and obscure failures." },
        { label: "Auth clarity", sub: "Reconnect paths documented — fewer mystery outages after password rotations." },
        { label: "Owner maps", sub: "Every Zap has a named maintainer and business purpose — no zombie flows." },
        { label: "Exit ramps", sub: "When volume spikes, BalochDev ports hot paths to code or self-hosted runners." },
      ],
    },
    deliveryHeading: "Lead capture & SaaS glue — Zapier where velocity beats servers.",
    why: [
      { title: "Fastest time-to-value", text: "Huge connector catalog means fewer bespoke OAuth projects." },
      { title: "Low ops overhead", text: "Managed runtime keeps SMB and startup stacks lightweight." },
      { title: "Readable audits", text: "History per Zap simplifies ‘what broke?’ conversations." },
      { title: "Predictable limits", text: "Task budgeting conversations early — avoids invoice shock." },
    ],
    deliveryTags: ["Typeform/Webflow → CRM", "Stripe/Paddle hooks", "Calendar scheduling automations", "Email sequencing triggers", "Support ticket routing", "Slack notifications"],
    deliveryLead:
      "Security means least-privilege scopes on each connected account and quarterly reviews of unused Zaps — attack surface shrinks as stacks mature.",
    faq: [
      { q: "When should we leave Zapier?", a: "High task volume, strict data residency, or multi-step AI graphs usually push teams toward n8n or custom APIs." },
      { q: "Do you build private Zapier integrations?", a: "When needed we expose stable REST first — partner apps follow once endpoints are trustworthy." },
    ],
  },

  google_apps_script: {
    iconKey: "google_apps_script",
    title: "Google Apps Script automation",
    metaTitle: "Google Apps Script development — Sheets, Drive, Gmail — BalochDev",
    description:
      "BalochDev builds Apps Script extensions for Sheets, Gmail, and Drive — secured OAuth, quotas respected, and pathways to a ‘real’ backend when macros become products.",
    keywords: [
      "Google Apps Script developer",
      "Apps Script Sheets automation",
      "Gmail automation Apps Script",
      "Workspace automation consultant",
      "BalochDev Apps Script",
    ],
    heroLead:
      "Apps Script is the quickest way to turn a spreadsheet workflow into scheduled automation — until it needs tests and staging; we plan that boundary upfront.",
    seoTitle: "How BalochDev ships Apps Script without spreadsheet spaghetti",
    seoBody:
      "Organizations searching Google Apps Script development want invoicing macros, mail merges with Drive attachments, or Sheet dashboards fed by HTTP APIs. BalochDev namespaces functions, avoids triggers firing storms during edits, and respects Workspace quotas with batching. When logic turns into a pseudo-database, we migrate core paths to Cloud Functions or Node APIs while keeping Scripts as thin UI glue.",
    introPanel: {
      kicker: "Workspace native",
      headline: "BalochDev’s Apps Script guardrails",
      tiles: [
        { label: "Trigger discipline", sub: "Time-driven vs on-edit — fewer accidental infinite loops." },
        { label: "Secrets never in cells", sub: "Script properties + least scopes — spreadsheets are not vaults." },
        { label: "Quota-aware batches", sub: "Backed-off retries when Gmail or Drive throttles burst jobs." },
        { label: "Exit to APIs", sub: "Clear handoff when relational data belongs in Postgres — not row 40,000." },
      ],
    },
    deliveryHeading: "Internal tooling & reporting — Apps Script where Workspace already lives.",
    why: [
      { title: "Zero extra hosting", text: "Runs inside Google — perfect for teams living in Sheets." },
      { title: "Rapid ROI", text: "Hours-to-days wins on repetitive finance and ops tasks." },
      { title: "Familiar surfaces", text: "Stakeholders see logic adjacent to data — less abstraction tax." },
      { title: "Gateway to cloud", text: "Natural stepping stone before full Apps Script → Cloud migration." },
    ],
    deliveryTags: ["Invoice & payout helpers", "CRM hygiene imports", "Automated PDF generation", "Approval emails", "Scheduled dashboards", "Lightweight internal portals"],
    deliveryLead:
      "We document editors and viewers separately — Apps Script often touches sensitive rows; role separation prevents accidental data leaks.",
    faq: [
      { q: "Apps Script vs Appsheet?", a: "Script suits developer-led automation; AppSheet suits guardrailed citizen dev — we pick based on governance maturity." },
      { q: "Can Apps Script call our ERP?", a: "Yes via authenticated HTTPS endpoints — preferably service accounts rather than personal OAuth where policy allows." },
    ],
  },

  mcp: {
    iconKey: "mcp",
    title: "Model Context Protocol (MCP)",
    metaTitle: "Model Context Protocol MCP servers & AI tooling — BalochDev",
    description:
      "BalochDev builds MCP servers that expose CRMs, ticket systems, and internal APIs as typed tools — structured AI integrations instead of brittle copy-paste prompts.",
    keywords: [
      "Model Context Protocol developer",
      "MCP server integration",
      "MCP AI tools enterprise",
      "Anthropic MCP connectors",
      "BalochDev MCP consulting",
    ],
    heroLead:
      "MCP standardizes how assistants discover and call tools — we implement servers so models stop hallucinating SQL against spreadsheets.",
    seoTitle: "How BalochDev implements MCP for enterprise assistants",
    seoBody:
      "Teams researching Model Context Protocol integration want assistants that query tickets or docs with auditing — not ad hoc browser automation. BalochDev defines tool schemas, scopes OAuth per tenant, and adds policy gates on writes. MCP complements REST gateways: same auth patterns BalochDev uses for OpenAI function calling, packaged for MCP-compatible clients.",
    introPanel: {
      kicker: "Tooling layer",
      headline: "BalochDev’s MCP implementation focus",
      tiles: [
        { label: "Typed tools", sub: "Contracts machines and humans can read — fewer silent argument bugs." },
        { label: "Scoped OAuth", sub: "Assistants inherit role boundaries — not god-mode API keys." },
        { label: "Audit trails", sub: "Who asked the tool to change what — parity with enterprise SIEM asks." },
        { label: "Progressive rollout", sub: "Read-only tools first; writes behind approvals — staged trust." },
      ],
    },
    deliveryHeading: "Internal copilots & support bots — MCP as the integration spine.",
    why: [
      { title: "Standard interface", text: "Reduces one-off assistant adapters every quarter." },
      { title: "Security posture", text: "Forces explicit tool lists instead of infinite prompt injections." },
      { title: "Composable stacks", text: "Pairs with LangGraph and frontier APIs without rewriting clients." },
      { title: "Vendor-neutral shape", text: "Swap models while keeping tool servers stable." },
    ],
    deliveryTags: ["CRM lookup tools", "Ticketing integrations", "Knowledge-base retrieval", "Provisioning workflows", "Analytics queries", "Human approval bridges"],
    deliveryLead:
      "We threat-model each tool: could an adversarial prompt invoke destructive combinations? Rate limits and confirmation steps close those loops.",
    faq: [
      { q: "MCP vs REST wrappers?", a: "MCP gives discovery + schema ergonomics for AI hosts — REST alone works but fragments client-specific glue." },
      { q: "Hosting?", a: "Servers can run beside your APIs — VPC, mTLS, or tunnel patterns depending on risk appetite." },
    ],
  },
};
