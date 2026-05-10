/** @type {Record<string, import('../technologyAiLandings.js').AiLandingConfig>} */
export const DESIGN_TECH_LANDINGS = {
  figma: {
    iconKey: "figma",
    title: "Figma product design",
    metaTitle: "Figma design systems & dev handoff — BalochDev",
    description:
      "BalochDev collaborates on Figma libraries — components, variables, auto-layout, and dev-ready specs that map cleanly into Tailwind tokens and React implementations.",
    keywords: [
      "Figma design system consulting",
      "Figma dev mode handoff",
      "Figma variables Tailwind",
      "component library Figma React",
      "BalochDev Figma workflows",
    ],
    heroLead:
      "Figma works when tokens stay disciplined — BalochDev aligns naming so engineers are not guessing margins from screenshots.",
    seoTitle: "How BalochDev bridges Figma into maintainable code",
    seoBody:
      "Teams investing in Figma design systems want variables that survive light/dark modes, accessibility annotations reviewers trust, and libraries structured so variants stay manageable. BalochDev ties naming workshops across disciplines, exports tokens engineers can consume as CSS variables or Tailwind themes, and pairs deliverables with Storybook docs where visuals meet runtime.",
    introPanel: {
      kicker: "Design ops",
      headline: "BalochDev’s Figma collaboration habits",
      tiles: [
        { label: "Token discipline", sub: "Spacing, color, and type scales centralized." },
        { label: "Variant sanity", sub: "Components structured — props map to code APIs." },
        { label: "Accessibility notes", sub: "Contrast and focus order flagged early." },
        { label: "Dev Mode hygiene", sub: "Measurements trustworthy — fewer rework loops." },
      ],
    },
    deliveryHeading: "Design systems — Figma engagements BalochDev co-delivers.",
    why: [
      { title: "Single source", text: "Design truth centralized versus Slack PNG archaeology." },
      { title: "Fast iteration", text: "Branches accelerate exploration without orphan files." },
      { title: "Developer parity", text: "Tokens translate mechanically into themes." },
      { title: "Stakeholder clarity", text: "Prototypes align exec expectations before build spikes." },
    ],
    deliveryTags: ["Component audits", "Token rollouts", "Responsive spec packs", "Marketing alignment", "A11y annotations", "Handoff workshops"],
    deliveryLead:
      "Libraries get owners — BalochDev documents who merges additions so systems stay tended after launch.",
    faq: [
      { q: "Figma vs Penpot?", a: "Figma cloud dominance wins ecosystem; Penpot when self-host governance demands." },
      { q: "Design tokens tooling?", a: "Style Dictionary or native exports — BalochDev matches client toolchain." },
    ],
  },

  canva: {
    iconKey: "canva",
    title: "Canva brand collateral",
    metaTitle: "Canva design workflows for marketing — BalochDev",
    description:
      "BalochDev sets up Canva brand kits and templates — export pipelines feeding web assets, social packs, and dev-ready SVGs without losing typography discipline.",
    keywords: [
      "Canva brand kit setup",
      "Canva templates enterprise",
      "marketing design operations Canva",
      "Canva to web asset pipeline",
      "BalochDev Canva workflows",
    ],
    heroLead:
      "Canva accelerates marketing iteration — BalochDev defines brand kits so exports stay consistent once developers reuse assets.",
    seoTitle: "How BalochDev operationalizes Canva beside engineering stacks",
    seoBody:
      "Marketing teams adopting Canva for speed still need naming, folder hygiene, and export formats compatible with Next.js or WordPress fronts. BalochDev configures brand kits, trains editors on accessible contrast defaults, and scripts export conventions (SVG cleanup, responsive image derivatives) so engineering does not inherit invisible maintenance debt.",
    introPanel: {
      kicker: "Brand velocity",
      headline: "BalochDev’s Canva guardrails",
      tiles: [
        { label: "Brand kits locked", sub: "Typography and palettes centralized — drift controlled." },
        { label: "Export realism", sub: "Formats chosen per channel — heavy PNG chains avoided." },
        { label: "Accessibility basics", sub: "Contrast guidance baked into templates." },
        { label: "Engineering bridge", sub: "Assets land in repos or DAMs with predictable naming." },
      ],
    },
    deliveryHeading: "Collateral at scale — Canva lanes BalochDev enables.",
    why: [
      { title: "Marketing autonomy", text: "Stakeholders ship iterations without blocking engineers daily." },
      { title: "Template reuse", text: "Campaign rhythm accelerates measurably." },
      { title: "Cost leverage", text: "Avoids bespoke Photoshop cycles for every social resize." },
      { title: "Hybrid stacks", text: "Pairs with Webflow or Next marketing fronts cleanly." },
    ],
    deliveryTags: ["Social packs", "Pitch decks", "Email hero batches", "Event collateral", "Localization variants", "Asset DAM imports"],
    deliveryLead:
      "Versioning documented — BalochDev ties template updates to analytics milestones when possible.",
    faq: [
      { q: "Canva vs Figma?", a: "Canva wins marketer-led velocity; Figma wins component-system depth — often both coexist." },
      { q: "Print?", a: "Export bleed settings validated — BalochDev coordinates vendor specs early." },
    ],
  },

  photoshop: {
    iconKey: "photoshop",
    title: "Adobe Photoshop",
    metaTitle: "Photoshop compositing & asset pipelines — BalochDev",
    description:
      "BalochDev supports Photoshop-heavy pipelines — photo compositing, texture work, batch exports into modern SVG/WebP stacks, preserving layers for localization where needed.",
    keywords: [
      "Photoshop web asset consulting",
      "Photoshop to SVG workflow",
      "marketing photo compositing services",
      "Adobe Photoshop automation scripts",
      "BalochDev Photoshop pipelines",
    ],
    heroLead:
      "Photoshop remains unmatched for raster craft — BalochDev connects comps to production formats without bloating pages.",
    seoTitle: "How BalochDev integrates Photoshop into web delivery",
    seoBody:
      "Brands with Photoshop-centric workflows need disciplined export ladders — responsive srcsets, AVIF/WebP derivatives, and licensing metadata tracked. BalochDev automates repetitive exports where Actions/scripts help, preserves PSD sources responsibly, and coordinates handoffs into Next/Image or CMS media libraries so designers retain flexibility without wrecking LCP.",
    introPanel: {
      kicker: "Raster craft",
      headline: "BalochDev’s Photoshop production discipline",
      tiles: [
        { label: "Export ladders", sub: "Responsive derivatives scripted — one-off uploads minimized." },
        { label: "Non-destructive flows", sub: "Smart objects preserved — iterations cheaper." },
        { label: "Color management", sub: "Profiles honored cross-print/digital — surprises reduced." },
        { label: "Legal hygiene", sub: "Stock licensing tracked — audits survivable." },
      ],
    },
    deliveryHeading: "Campaign-ready imagery — Photoshop pipelines BalochDev coordinates.",
    why: [
      { title: "Pixel control", text: "Fine masking and compositing unmatched by purely vector stacks." },
      { title: "Legacy compatibility", text: "Huge archived PSD ecosystems remain workable." },
      { title: "Marketing synergy", text: "Photographers and designers stay in familiar tooling." },
      { title: "Automation paths", text: "Batch exports integrate CI-friendly folders." },
    ],
    deliveryTags: ["Hero imagery", "Retouch pipelines", "Texture libraries", "Batch exports", "Localization PSD variants", "Print-to-web bridges"],
    deliveryLead:
      "Performance budgets respected — BalochDev refuses uploading 6MB heroes without derivatives.",
    faq: [
      { q: "Photoshop vs Figma?", a: "Photoshop for raster-heavy campaigns; Figma for UI systems — workflows often overlap deliberately." },
      { q: "CDN integration?", a: "Images route through optimizers — caching headers tuned per asset class." },
    ],
  },

  design_alt: {
    iconKey: "design_alt",
    title: "Penpot · open design tooling",
    metaTitle: "Penpot open-source design tooling — BalochDev",
    description:
      "BalochDev implements Penpot for teams needing self-hosted design parity — libraries, prototypes, and export flows respectful of data residency policies.",
    keywords: [
      "Penpot consulting setup",
      "open source design tool enterprise",
      "self hosted Figma alternative Penpot",
      "design collaboration GDPR hosting",
      "BalochDev Penpot integration",
    ],
    heroLead:
      "Penpot gains traction where SaaS design clouds face residency scrutiny — BalochDev scopes hosting realistically.",
    seoTitle: "How BalochDev adopts Penpot alongside engineering stacks",
    seoBody:
      "Organizations evaluating Penpot want SSO, backups, and library governance comparable to familiar SaaS tools — plus clarity on plugin ecosystems still maturing. BalochDev provisions hosting with sane SMTP/auth integrations, defines migration workshops from Figma exports where feasible, and pairs interactive prototypes with accessibility reviews identical to commercial stacks.",
    introPanel: {
      kicker: "Open tooling",
      headline: "BalochDev’s Penpot rollout mindset",
      tiles: [
        { label: "Hosting realism", sub: "Capacity planned — designers hate sluggish canvases." },
        { label: "Library governance", sub: "Owners assigned — contributions structured." },
        { label: "Migration honesty", sub: "Complex Figma files may need rebuild segments." },
        { label: "Accessibility parity", sub: "Reviews unchanged — OSS label does not relax WCAG goals." },
      ],
    },
    deliveryHeading: "Self-hosted design — Penpot programs BalochDev supports.",
    why: [
      { title: "Data residency", text: "Runs inside boundaries procurement demands." },
      { title: "Open formats", text: "Interop mentality aligns with engineering cultures." },
      { title: "Cost transparency", text: "Infra bills understandable versus per-seat SaaS creep." },
      { title: "Community velocity", text: "Roadmap improving rapidly — viable for many teams now." },
    ],
    deliveryTags: ["Gov/edu collaborations", "OSS-heavy orgs", "EU-hosted workflows", "Prototype reviews", "Developer-design pairing", "Library migrations"],
    deliveryLead:
      "Support contracts planned — BalochDev advises staffing before self-host surprises pile up.",
    faq: [
      { q: "Penpot vs Figma?", a: "Feature parity differs — BalochDev audits must-have workflows before committing." },
      { q: "Plugins?", a: "Evaluate carefully — ecosystem younger than incumbents." },
    ],
  },

  "storybook-chromatic": {
    iconKey: "storybook",
    title: "Storybook · Chromatic QA",
    metaTitle: "Storybook Chromatic visual testing — BalochDev",
    description:
      "BalochDev wires Storybook with Chromatic or comparable visual diff CI — bridging designers and engineers with reviewable UI states before merges ship regressions.",
    keywords: [
      "Chromatic visual regression consulting",
      "Storybook CI pipeline setup",
      "visual testing design handoff",
      "Storybook accessibility addon audit",
      "BalochDev Chromatic Storybook",
    ],
    heroLead:
      "Design handoff succeeds when UI states are reviewable — Chromatic turns Storybook into enforced visual QA.",
    seoTitle: "How BalochDev connects Storybook and Chromatic for shipping confidence",
    seoBody:
      "Teams investing in Chromatic want baselines per branch, deterministic waits for animations, and RBAC so stakeholders approve without Git credentials chaos. BalochDev configures TurboSnap-style optimizations when repos qualify, integrates accessibility checks in CI, and ensures stories reflect realistic data loaders — not mocked fantasies diverging from production.",
    introPanel: {
      kicker: "Visual QA",
      headline: "BalochDev’s Chromatic adoption checklist",
      tiles: [
        { label: "Baseline strategy", sub: "Main branch golden — feature branches diff cleanly." },
        { label: "Flake control", sub: "Animations/waits stabilized — reviewers trust pixels." },
        { label: "Story realism", sub: "States mirror production variants — not hollow shells." },
        { label: "RBAC clarity", sub: "Designers approve without compromising repos." },
      ],
    },
    deliveryHeading: "Design ↔ engineering QA bridges — Chromatic workflows BalochDev runs.",
    why: [
      { title: "Regression shield", text: "Pixel diffs catch unintended shifts quickly." },
      { title: "Async reviews", text: "Distributed teams comment with grounded URLs." },
      { title: "Documentation synergy", text: "Living catalogs reduce outdated screenshots." },
      { title: "Release confidence", text: "Hotfixes shrink when UI surprises surface pre-merge." },
    ],
    deliveryTags: ["Design-system CI gates", "Cross-browser snapshots", "Dark mode baselines", "Interaction testing addons", "Reviewer onboarding", "Monorepo publishing"],
    deliveryLead:
      "Ownership explicit — BalochDev ties Chromatic baselines to teams willing to triage diffs promptly.",
    faq: [
      { q: "Chromatic alternatives?", a: "Percy, Lost Pixel, custom Playwright screenshot harnesses — BalochDev picks per budget." },
      { q: "Private packages?", a: "Auth tokens configured securely — never embedded in client Storybook builds publicly accidentally." },
    ],
  },
};
