import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import BookCallButton from "../components/bookCall/BookCallButton";
import type { IconType } from "react-icons";
import RichSectionIntro from "../components/RichSectionIntro";
import SelectedWorkGrid from "../components/SelectedWorkGrid";
import Seo from "../seo/Seo";
import FaqAccordion from "../components/FaqAccordion";
import { capDescription, capTitle } from "../seo/seoFromData";
import { getStackLandingPage, isValidStackCategory, STACK_CATEGORY_LABELS } from "../data/stackLandings";
import { TECH_ICON_MAP } from "../data/technologyIcons";
import {
  TbBrain,
  TbBolt,
  TbRocket,
  TbApi,
  TbGauge,
  TbShieldCheck,
  TbSparkles,
  TbPuzzle,
  TbRobot,
  TbLayoutDashboard,
  TbBrowser,
  TbLock,
  TbFileText,
  TbCpu,
  TbGitBranch,
  TbBuilding,
  TbPackages,
  TbPhoto,
  TbCloud,
  TbUsers,
  TbActivity,
  TbMessageChatbot,
  TbDatabase,
  TbPlugConnected,
} from "react-icons/tb";

const WHY_FALLBACK_ICONS: IconType[] = [TbSparkles, TbRocket, TbBrain, TbCpu];

function whyIconFor(title: string, index: number): IconType {
  const t = title.toLowerCase();
  if (/tool|api|function|schema|plugin/.test(t)) return TbApi;
  if (/latency|stream|cache|batch|ux|pattern/.test(t)) return TbActivity;
  if (/operational|budget|fallback|eval|realism|hook/.test(t)) return TbGauge;
  if (/safety|policy|harm|kill|gate|secure/.test(t)) return TbShieldCheck;
  if (/context|chunk|document|long/.test(t)) return TbFileText;
  if (/code|repo|pr|commit|review|convention|lint/.test(t)) return TbGitBranch;
  if (/tenant|procurement|azure|microsoft|governance/.test(t)) return TbBuilding;
  if (/multimodal|vision|image/.test(t)) return TbPhoto;
  if (/interop|connector|teams|sharepoint/.test(t)) return TbPlugConnected;
  if (/cloud|google-native|gcp/.test(t)) return TbCloud;
  if (/team|shared|human/.test(t)) return TbUsers;
  if (/batch|throughput|offline|pipeline/.test(t)) return TbPackages;
  return WHY_FALLBACK_ICONS[index % WHY_FALLBACK_ICONS.length];
}

function deliveryIconFor(tag: string): IconType {
  const t = tag.toLowerCase();
  if (/plugin|tool/.test(t)) return TbPuzzle;
  if (/agent|orchestr/.test(t)) return TbRobot;
  if (/web app|dashboard|portal/.test(t)) return TbLayoutDashboard;
  if (/chrome|extension/.test(t)) return TbBrowser;
  if (/\bapi\b/.test(t)) return TbApi;
  if (/oauth|sso|auth/.test(t)) return TbLock;
  if (/rag|doc|support|copilot/.test(t)) return TbMessageChatbot;
  if (/security|compliance/.test(t)) return TbShieldCheck;
  if (/batch|extraction|pipelin/.test(t)) return TbPackages;
  if (/review autom/.test(t)) return TbGitBranch;
  if (/test|fixture|ci/.test(t)) return TbBolt;
  if (/migration|legacy|modern/.test(t)) return TbRocket;
  if (/accelerat|branch|feature/.test(t)) return TbGitBranch;
  if (/developer portal|internal/.test(t)) return TbLayoutDashboard;
  return TbSparkles;
}

function reviewerInitials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean).slice(0, 2);
  const s = parts.map((w) => w[0]?.toUpperCase() ?? "").join("");
  return s || "?";
}

const PORTFOLIO_DRAFT_ITEMS: { Icon: IconType; role: string; title: string; blurb: string }[] = [
  {
    Icon: TbLayoutDashboard,
    role: "Draft · B2B SaaS",
    title: "Role-aware customer portal",
    blurb:
      "Scoped modules per tenant, audit-friendly activity, and pragmatic SLIs — a representative engagement shape until the published case study lands.",
  },
  {
    Icon: TbDatabase,
    role: "Draft · Ops-heavy product",
    title: "Reporting pipeline & reconciliation",
    blurb: "Idempotent jobs, dead-letter paths, and dashboards engineers trust — representative of how BalochDev ships data-heavy workflows.",
  },
  {
    Icon: TbApi,
    role: "Draft · Platform",
    title: "Partner-facing APIs",
    blurb: "Versioned contracts, OAuth client isolation, and sane rate limits — stable boundaries before integrations multiply.",
  },
];

function PortfolioDraftCard({
  Icon: CardIcon,
  role,
  title,
  blurb,
}: {
  Icon: IconType;
  role: string;
  title: string;
  blurb: string;
}) {
  return (
    <article className="ndx-card ndx-tech-tool-card ndx-tech-landing__portfolio-card">
      <div className="ndx-tech-landing__portfolio-card__hero">
        <div className="ndx-tech-landing__portfolio-card__hero-grid" aria-hidden />
        <div className="ndx-tech-landing__portfolio-card__icon-wrap">
          <CardIcon size={24} aria-hidden />
        </div>
      </div>
      <div className="ndx-tech-tool-card__body ndx-tech-landing__portfolio-card__body">
        <p className="ndx-tech-meta">{role}</p>
        <h3 className="ndx-tech-name ndx-tech-tool-card__title" style={{ fontSize: "1.05rem" }}>
          {title}
        </h3>
        <p className="ndx-tech-blurb ndx-tech-tool-card__blurb">{blurb}</p>
        <p className="ndx-tech-meta ndx-tech-landing__portfolio-draft-badge">Draft preview</p>
      </div>
    </article>
  );
}

function introTileIconFor(label: string, index: number): IconType {
  return whyIconFor(label, index);
}

const DEFAULT_DELIVERY_SECTION_HEADING = "Integrations, APIs, and products — shipped with security in mind";

const CATEGORY_FOCUS_CHIPS: Record<string, string[]> = {
  ai: ["Agents", "RAG", "Edge APIs", "OAuth", "Observability", "CI/CD"],
  automation: ["Webhooks", "Queues", "Retries", "Secrets", "Monitoring", "Approvals"],
  frontend: ["Performance", "Accessibility", "SSR", "Tokens", "Testing", "DX"],
  backend: ["REST", "GraphQL", "Auth", "Observability", "Queues", "Security"],
  data: ["Postgres", "Indexes", "Backups", "Search", "Vectors", "Migrations"],
  nocode: ["CMS", "Themes", "SEO", "Performance", "Commerce", "Integrations"],
  ops: ["CI/CD", "Containers", "Edge", "Rollbacks", "SLOs", "Cost"],
  design: ["Systems", "Tokens", "Handoff", "A11y", "Visual QA", "Docs"],
};

const AI_DELIVERY_FOOTNOTE =
  "OAuth-connected assistants use least-privilege tokens, server-held secrets, and audited tool scopes — especially for CRMs, billing, and internal admin APIs. Large-scale rollouts get staged releases, tracing, and cost dashboards before traffic spikes.";

const DEFAULT_DELIVERY_FOOTNOTE =
  "Production integrations use environment-scoped secrets, staged rollouts, and observability hooks — BalochDev aligns SLIs with your hosting story before scaling traffic.";

function VendorIntroPanel({
  slug,
  panel,
  BrandIcon,
}: {
  slug: string;
  panel: { kicker: string; headline: string; tiles: { label: string; sub: string }[] };
  BrandIcon: IconType | null;
}) {
  const slugSafe = slug.replace(/[^a-z0-9-]/gi, "") || "vendor";
  return (
    <div className={`ndx-tech-landing__intro-panel ndx-tech-landing__intro-panel--${slugSafe}`}>
      <div className="ndx-tech-landing__intro-panel__header">
        <span className="ndx-tech-landing__intro-panel__brand" aria-hidden>
          {BrandIcon ? <BrandIcon size={26} /> : null}
        </span>
        <div>
          <span className="ndx-tech-landing__intro-panel__kicker">{panel.kicker}</span>
          <span className="ndx-tech-landing__intro-panel__title">{panel.headline}</span>
        </div>
      </div>
      <div className="ndx-tech-landing__intro-panel__tiles">
        {panel.tiles.map(({ label, sub }, index) => {
          const TileIcon = introTileIconFor(label, index);
          return (
            <div key={label} className="ndx-tech-landing__intro-panel__tile">
              <div className="ndx-tech-landing__intro-panel__tile-icon" aria-hidden>
                <TileIcon size={22} strokeWidth={1.65} />
              </div>
              <div className="ndx-tech-landing__intro-panel__tile-body">
                <span className="ndx-tech-landing__intro-panel__tile-label">{label}</span>
                <span className="ndx-tech-landing__intro-panel__tile-sub">{sub}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PLACEHOLDER_REVIEWS = [
  {
    quote:
      "They wired integrations that respected our auth boundaries — uncommon discipline versus slap-dash MVPs.",
    name: "Product lead",
    role: "B2B SaaS · confidential",
  },
  {
    quote:
      "Monitoring and rollback paths showed up early — not after demos silently broke in production.",
    name: "Engineering manager",
    role: "Fintech · confidential",
  },
];

export default function TechnologyAiLanding() {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const categoryOk = !!(category && isValidStackCategory(category));
  const categoryLabel =
    categoryOk && category ? STACK_CATEGORY_LABELS[category as keyof typeof STACK_CATEGORY_LABELS] : "";

  const page = categoryOk && category && slug ? getStackLandingPage(category, slug) : null;
  const Icon = page?.iconKey ? (TECH_ICON_MAP[page.iconKey] ?? null) : null;

  const seoHead = useMemo(() => {
    if (!page || !slug || !category || !categoryLabel) return null;
    const named = page as typeof page & { name?: string };
    const recordName = typeof named.name === "string" ? named.name.trim() : "";
    const metaRaw = typeof page.metaTitle === "string" ? page.metaTitle.trim() : "";
    const headPart = recordName || (typeof page.title === "string" ? page.title.trim() : "");
    const titleSource = metaRaw || (headPart && categoryLabel ? `${headPart} ${categoryLabel} | BalochDev` : "");
    if (!titleSource) return null;
    const title = capTitle(titleSource, 60);
    const descRaw = (typeof page.description === "string" && page.description.trim()) || "";
    if (!descRaw) return null;
    const description = capDescription(descRaw, 155);
    const canonicalPath = `/technologies/${category}/${slug}`;
    return { title, description, canonicalPath };
  }, [page, slug, category, categoryLabel]);

  const chips = useMemo(() => page?.keywords.slice(0, 8) ?? [], [page]);

  if (!page || !slug || !categoryOk || !category) {
    return (
      <section className="ndx-section ndx-page-rich" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <div className="ndx-container">
          <h1 className="ndx-h1">Page not found</h1>
          <p className="ndx-lead" style={{ marginTop: "0.75rem" }}>
            This technology detail page does not exist — check the URL or browse all stack disciplines.
          </p>
          <Link to="/technologies" className="ndx-btn ndx-btn-primary" style={{ marginTop: "1.25rem", display: "inline-flex" }}>
            All technologies
          </Link>
        </div>
      </section>
    );
  }

  const deliveryFootnote = category === "ai" ? AI_DELIVERY_FOOTNOTE : DEFAULT_DELIVERY_FOOTNOTE;
  const focusRow = CATEGORY_FOCUS_CHIPS[category] ?? [];

  return (
    <section className="ndx-section ndx-page-rich ndx-tech-landing" style={{ paddingTop: "1.35rem", paddingBottom: "2.5rem" }}>
      {seoHead ? <Seo title={seoHead.title} description={seoHead.description} canonicalPath={seoHead.canonicalPath} /> : null}
      <div className="ndx-container">
        <nav className="ndx-tech-landing__crumb" aria-label="Breadcrumb">
          <Link to="/technologies">Technologies</Link>
          <span aria-hidden className="ndx-tech-landing__crumb-sep">
            /
          </span>
          <span className="ndx-tech-landing__crumb-muted">{categoryLabel}</span>
          <span aria-hidden className="ndx-tech-landing__crumb-sep">
            /
          </span>
          <span>{page.title}</span>
        </nav>

        <header className="ndx-tech-landing__hero ndx-tech-landing__hero--split">
          <div className="ndx-tech-landing__hero-glow" aria-hidden />
          <div className="ndx-tech-landing__hero-copy">
            <h1 className="ndx-h1 ndx-tech-landing__h1">{page.metaTitle.replace(/\s—\sBalochDev$/, "")}</h1>
            <p className="ndx-lead ndx-tech-landing__lead">{page.heroLead}</p>
            <div className="ndx-hero-btns ndx-tech-landing__hero-actions">
              <Link to="/contact" className="ndx-btn ndx-btn-primary">
                Discuss this stack →
              </Link>
              <Link to="/estimate" className="ndx-btn">
                {category === "ai" ? "AI estimate" : "Project estimate"}
              </Link>
            </div>
          </div>
          <div className="ndx-tech-landing__hero-art">
            <div className="ndx-tech-landing__hero-icon-stage">
              {Icon ? <Icon className="ndx-tech-landing__hero-mega-icon" aria-hidden /> : null}
            </div>
          </div>
        </header>

        <div className="ndx-tech-landing__split ndx-tech-landing__split--intro">
          <div className="ndx-tech-landing__split-copy">
            <p className="ndx-tech-meta">How BalochDev uses it</p>
            <h2 id="balochdev-stack-approach" className="ndx-h2 ndx-tech-landing__h2">
              {page.seoTitle}
            </h2>
            <p className="ndx-group-sub ndx-tech-landing__prose">{page.seoBody}</p>
            <ul className="ndx-tech-landing__kw" aria-label="Topics we optimize for">
              {chips.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
          {"introPanel" in page && page.introPanel ? (
            <VendorIntroPanel slug={slug} panel={page.introPanel} BrandIcon={Icon} />
          ) : (
            <div className="ndx-tech-landing__visual" role="img" aria-label={`Visual placeholder for ${page.title}`} />
          )}
        </div>

        <section className="ndx-tech-landing__section" aria-labelledby="why-heading">
          <p className="ndx-tech-meta">Why BalochDev uses it</p>
          <h2 id="why-heading" className="ndx-h2 ndx-tech-landing__h2">
            Where it earns space in our delivery stack
          </h2>
          <div className="ndx-tech-landing__why-grid">
            {page.why.map((w, index) => {
              const WhyIcon = whyIconFor(w.title, index);
              return (
                <div key={w.title} className="ndx-tech-landing__why-card">
                  <div className="ndx-tech-landing__why-card__icon" aria-hidden>
                    <WhyIcon size={20} strokeWidth={1.65} />
                  </div>
                  <div className="ndx-tech-landing__why-card__body">
                    <h3>{w.title}</h3>
                    <p>{w.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="ndx-tech-landing__section ndx-tech-landing__delivery-section" aria-labelledby="delivery-heading">
          <p className="ndx-tech-meta">What we build</p>
          <h2 id="delivery-heading" className="ndx-h2 ndx-tech-landing__h2">
            {"deliveryHeading" in page && typeof page.deliveryHeading === "string"
              ? page.deliveryHeading
              : DEFAULT_DELIVERY_SECTION_HEADING}
          </h2>
          <div className="ndx-tech-landing__delivery-panel">
            <p className="ndx-group-sub ndx-tech-landing__prose-tight ndx-tech-landing__delivery-panel__intro">{page.deliveryLead}</p>
            <ul className="ndx-tech-landing__delivery-list" aria-label="Things we ship with this stack">
              {page.deliveryTags.map((t) => {
                const DelIcon = deliveryIconFor(t);
                return (
                  <li key={t} className="ndx-tech-landing__delivery-row">
                    <span className="ndx-tech-landing__delivery-row__icon" aria-hidden>
                      <DelIcon size={18} strokeWidth={1.65} />
                    </span>
                    <span className="ndx-tech-landing__delivery-row__label">{t}</span>
                  </li>
                );
              })}
            </ul>
            <p className="ndx-tech-landing__fine ndx-tech-landing__delivery-panel__footnote">{deliveryFootnote}</p>
          </div>
        </section>

        <section className="ndx-tech-landing__section" aria-labelledby="faq-heading">
          <p className="ndx-tech-meta">FAQ</p>
          <h2 id="faq-heading" className="ndx-h2 ndx-tech-landing__h2">
            What buyers ask BalochDev before a build
          </h2>
          <div className="ndx-tech-landing__faq">
            <FaqAccordion items={page.faq} />
          </div>
        </section>

        <section className="ndx-tech-landing__section" aria-labelledby="reviews-heading">
          <p className="ndx-tech-meta">Signals</p>
          <h2 id="reviews-heading" className="ndx-h2 ndx-tech-landing__h2">
            How teams describe working with us
          </h2>
          <div className="ndx-tech-landing__reviews">
            {PLACEHOLDER_REVIEWS.map((r) => (
              <blockquote key={r.quote} className="ndx-tech-landing__review ndx-tech-landing__review--styled">
                <span className="ndx-tech-landing__review__quote-mark" aria-hidden>
                  &ldquo;
                </span>
                <p>{r.quote}</p>
                <footer className="ndx-tech-landing__review__footer-row">
                  <span className="ndx-tech-landing__review__avatar" aria-hidden>
                    {reviewerInitials(r.name)}
                  </span>
                  <div className="ndx-tech-landing__review__meta">
                    <strong>{r.name}</strong>
                    <span className="ndx-tech-landing__review__role">{r.role}</span>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <div className="ndx-tech-landing__logos" aria-label="Delivery focus areas">
          {focusRow.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <section className="ndx-tech-landing__portfolio-shell" aria-labelledby="projects-heading">
          <p className="ndx-tech-meta">Work</p>
          <h2 id="projects-heading" className="ndx-h2 ndx-tech-landing__h2">
            Recent directions (portfolio)
          </h2>
          <p className="ndx-group-sub ndx-tech-landing__prose-tight">
            Case studies and shipped surfaces live on the portfolio — each engagement mixes product discipline with the stack lane above. Draft placeholders below mirror the Technologies grid rhythm until published case studies replace them.
          </p>
          <div className="ndx-rich-service-grid ndx-tech-landing__portfolio-grid">
            {PORTFOLIO_DRAFT_ITEMS.map((item) => (
              <PortfolioDraftCard key={item.title} Icon={item.Icon} role={item.role} title={item.title} blurb={item.blurb} />
            ))}
          </div>
          <Link to="/portfolio" className="ndx-btn ndx-btn-primary ndx-tech-landing__portfolio-cta">
            View portfolio →
          </Link>
        </section>

        <div className="ndx-rich-cta-box ndx-tech-landing__cta">
          <div>
            <p className="ndx-tech-meta">Next step</p>
            <h2 className="ndx-h2" style={{ fontSize: "clamp(1.35rem, 3vw, 1.85rem)", marginTop: "0.35rem" }}>
              {category === "ai"
                ? "Tell us the workflow — we map models, tools, and timelines."
                : "Tell us the product surface — we map architecture, integrations, and timelines."}
            </h2>
          </div>
          <div className="ndx-hero-btns">
            <BookCallButton className="ndx-btn ndx-btn-primary">Book a call →</BookCallButton>
          </div>
        </div>

        <p className="ndx-tech-landing__back">
          <Link to="/technologies">← Back to all technologies</Link>
        </p>
      </div>
    </section>
  );
}
