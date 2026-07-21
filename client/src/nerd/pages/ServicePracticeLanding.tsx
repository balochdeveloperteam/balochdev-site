import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import type { IconType } from "react-icons";
import {
  TbApi,
  TbBolt,
  TbBrain,
  TbRocket,
  TbAutomation,
  TbPalette,
  TbSparkles,
  TbLayoutDashboard,
  TbPackages,
  TbMessageChatbot,
  TbShieldCheck,
} from "react-icons/tb";
import Seo from "../seo/Seo";
import FaqAccordion from "../components/FaqAccordion";
import { SITE_URL } from "../seo/siteSeo";
import { capDescription, capTitle } from "../seo/seoFromData";
import {
  getServicePracticeLanding,
  isValidServicePracticeId,
  type ServicePracticeId,
  type ServicePracticeLandingConfig,
} from "../data/servicePracticeLandings";

const PRACTICE_HERO_ICONS: Record<ServicePracticeId, IconType> = {
  ai: TbBrain,
  build: TbRocket,
  automate: TbAutomation,
  design: TbPalette,
};

const WHY_FALLBACK: IconType[] = [TbSparkles, TbRocket, TbBrain, TbShieldCheck];

function whyIconFor(title: string, index: number): IconType {
  const t = title.toLowerCase();
  if (/security|credential|safe|default/.test(t)) return TbShieldCheck;
  if (/milestone|scope|procurement|accept/.test(t)) return TbBolt;
  if (/hour|roi|maintain|ops|sustainable/.test(t)) return TbPackages;
  if (/team|one team|handoff|engineering/.test(t)) return TbLayoutDashboard;
  return WHY_FALLBACK[index % WHY_FALLBACK.length];
}

function deliveryTagIcon(tag: string): IconType {
  const t = tag.toLowerCase();
  if (/api|webhook|integration/.test(t)) return TbApi;
  if (/dashboard|portal|web/.test(t)) return TbLayoutDashboard;
  if (/chat|voice|bot/.test(t)) return TbMessageChatbot;
  if (/monitor|alert|observability/.test(t)) return TbBolt;
  return TbSparkles;
}

function PracticeIntroPanel({ config, PracticeIcon }: { config: ServicePracticeLandingConfig; PracticeIcon: IconType }) {
  const slugSafe = config.id.replace(/[^a-z0-9-]/gi, "") || "practice";
  return (
    <div className={`ndx-tech-landing__intro-panel ndx-tech-landing__intro-panel--practice-${slugSafe}`}>
      <div className="ndx-tech-landing__intro-panel__header">
        <span className="ndx-tech-landing__intro-panel__brand" aria-hidden>
          <PracticeIcon size={26} />
        </span>
        <div>
          <span className="ndx-tech-landing__intro-panel__kicker">{config.introPanel.kicker}</span>
          <span className="ndx-tech-landing__intro-panel__title">{config.introPanel.headline}</span>
        </div>
      </div>
      <div className="ndx-tech-landing__intro-panel__tiles">
        {config.introPanel.tiles.map(({ label, sub }, index) => {
          const TileIcon = whyIconFor(label, index);
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

export default function ServicePracticeLanding() {
  const { practiceId } = useParams<{ practiceId: string }>();
  const idOk = isValidServicePracticeId(practiceId);
  const page = idOk && practiceId ? getServicePracticeLanding(practiceId) : null;
  const PracticeIcon = page ? PRACTICE_HERO_ICONS[page.id] : TbSparkles;

  const canonicalPath = page && practiceId ? `/services/practice/${practiceId}` : "/services";

  const seoHead = useMemo(() => {
    if (!page || !practiceId) return null;
    const named = page as ServicePracticeLandingConfig & { name?: string };
    const recordName = typeof named.name === "string" ? named.name.trim() : "";
    const metaRaw = typeof page.metaTitle === "string" ? page.metaTitle.trim() : "";
    const titleBase = page.title.trim();
    const titleSource = metaRaw || (titleBase ? `${titleBase} | BalochDev` : "");
    if (!titleSource) return null;
    const title = capTitle(titleSource, 60);
    const descRaw = (typeof page.description === "string" && page.description.trim()) || "";
    if (!descRaw) return null;
    const description = capDescription(descRaw, 155);
    const serviceName = recordName || titleBase;
    if (!serviceName) return null;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: serviceName,
      url: `${SITE_URL}${canonicalPath}`,
      provider: { "@type": "Organization", name: "BalochDev", url: SITE_URL },
    };
    return { title, description, canonicalPath, jsonLd };
  }, [page, practiceId, canonicalPath]);

  const chips = useMemo(() => page?.keywords.slice(0, 8) ?? [], [page]);

  if (!page || !practiceId || !idOk) {
    return (
      <section className="ndx-section ndx-page-rich" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <div className="ndx-container">
          <h1 className="ndx-h1">Practice not found</h1>
          <p className="ndx-lead" style={{ marginTop: "0.75rem" }}>
            This services practice page does not exist — browse all offerings on the main services page.
          </p>
          <Link to="/services" className="ndx-btn ndx-btn-primary" style={{ marginTop: "1.25rem", display: "inline-flex" }}>
            All services
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="ndx-section ndx-page-rich ndx-tech-landing" style={{ paddingTop: "1.35rem", paddingBottom: "2.5rem" }}>
      {seoHead ? (
        <Seo title={seoHead.title} description={seoHead.description} canonicalPath={seoHead.canonicalPath} jsonLd={seoHead.jsonLd} />
      ) : null}
      <div className="ndx-container">
        <nav className="ndx-tech-landing__crumb" aria-label="Breadcrumb">
          <Link to="/services">Services</Link>
          <span aria-hidden className="ndx-tech-landing__crumb-sep">
            /
          </span>
          <span>{page.title}</span>
        </nav>

        <header className="ndx-tech-landing__hero ndx-tech-landing__hero--split">
          <div className="ndx-tech-landing__hero-glow" aria-hidden />
          <div className="ndx-tech-landing__hero-copy">
            <p className="ndx-tech-meta" style={{ marginBottom: "0.35rem" }}>
              Practice {page.number}
            </p>
            <h1 className="ndx-h1 ndx-tech-landing__h1">{page.metaTitle.replace(/\s\|\sBalochDev$/, "").replace(/\s—\sBalochDev$/, "")}</h1>
            <p className="ndx-lead ndx-tech-landing__lead">{page.heroLead}</p>
            <div className="ndx-hero-btns ndx-tech-landing__hero-actions">
              <Link to="/contact" className="ndx-btn ndx-btn-primary">
                Discuss this practice →
              </Link>
              <Link to="/estimate" className="ndx-btn">
                AI estimate
              </Link>
              <Link to={`/services#${page.id}`} className="ndx-btn">
                View cards on services →
              </Link>
            </div>
          </div>
          <div className="ndx-tech-landing__hero-art">
            <div className="ndx-tech-landing__hero-icon-stage">
              <PracticeIcon className="ndx-tech-landing__hero-mega-icon" aria-hidden />
            </div>
          </div>
        </header>

        <div className="ndx-tech-landing__split ndx-tech-landing__split--intro">
          <div className="ndx-tech-landing__split-copy">
            <p className="ndx-tech-meta">What this practice covers</p>
            <h2 id="practice-overview" className="ndx-h2 ndx-tech-landing__h2">
              {page.seoTitle}
            </h2>
            <p className="ndx-group-sub ndx-tech-landing__prose">{page.seoBody}</p>
            <ul className="ndx-tech-landing__kw" aria-label="Topics we optimize for">
              {chips.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
          <PracticeIntroPanel config={page} PracticeIcon={PracticeIcon} />
        </div>

        <section className="ndx-tech-landing__section" aria-labelledby="why-practice">
          <p className="ndx-tech-meta">Why work with us here</p>
          <h2 id="why-practice" className="ndx-h2 ndx-tech-landing__h2">
            What buyers get in {page.title}
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

        <section className="ndx-tech-landing__section" aria-labelledby="how-we-work">
          <p className="ndx-tech-meta">How we work</p>
          <h2 id="how-we-work" className="ndx-h2 ndx-tech-landing__h2">
            Phases from brief to handoff
          </h2>
          <p className="ndx-group-sub ndx-tech-landing__prose-tight" style={{ maxWidth: "48rem" }}>
            Every program adapts to what you already know — but this rhythm keeps scope, risk, and demos legible for stakeholders (similar to how we run fixed-scope product work elsewhere on the site).
          </p>
          <div className="ndx-tech-landing__why-grid" style={{ marginTop: "1.25rem" }}>
            {page.howPhases.map((ph) => (
              <div key={ph.title} className="ndx-tech-landing__why-card">
                <div className="ndx-tech-landing__why-card__body">
                  <p className="ndx-tech-meta" style={{ marginBottom: "0.35rem" }}>
                    {ph.weeks}
                  </p>
                  <h3>{ph.title}</h3>
                  <p>{ph.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ndx-tech-landing__section" aria-labelledby="price-guide">
          <p className="ndx-tech-meta">Assumed pricing</p>
          <h2 id="price-guide" className="ndx-h2 ndx-tech-landing__h2">
            Typical bands before your final quote
          </h2>
          <div className="ndx-table-wrap" style={{ marginTop: "1rem", maxWidth: "56rem" }}>
            <table className="ndx-table">
              <thead>
                <tr>
                  <th scope="col">Phase / package</th>
                  <th scope="col">What is included</th>
                  <th scope="col">Typical timeline</th>
                  <th scope="col">Assumed from</th>
                </tr>
              </thead>
              <tbody>
                {page.priceRows.map((row) => (
                  <tr key={row.phase}>
                    <td style={{ fontWeight: 600, color: "var(--ndx-text)" }}>{row.phase}</td>
                    <td>{row.includes}</td>
                    <td>{row.timeline}</td>
                    <td style={{ color: "var(--ndx-accent)", fontWeight: 600 }}>{row.fromPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="ndx-tech-landing__fine" style={{ marginTop: "0.85rem", maxWidth: "48rem" }}>
            {page.priceFootnote}
          </p>
        </section>

        <section className="ndx-tech-landing__section" aria-labelledby="offerings">
          <p className="ndx-tech-meta">Offerings</p>
          <h2 id="offerings" className="ndx-h2 ndx-tech-landing__h2">
            Scoped services inside this practice
          </h2>
          <p className="ndx-group-sub ndx-tech-landing__prose-tight" style={{ maxWidth: "48rem" }}>
            Each link opens a focused service page with bullets and next steps — good for sharing with procurement or technical reviewers.
          </p>
          <div className="ndx-rich-service-grid" style={{ marginTop: "1.25rem" }}>
            {page.offerings.map((o) => (
              <Link key={o.slug} to={`/services/${o.slug}`} className="ndx-card ndx-card-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <h3 className="ndx-tech-name" style={{ fontSize: "1.05rem", marginBottom: "0.35rem" }}>
                  {o.title}
                </h3>
                <p className="ndx-tech-meta" style={{ marginBottom: "0.25rem" }}>
                  Est. {o.timeline} · Assumed from {o.fromPrice}
                </p>
                <span className="ndx-service-card-cta" style={{ marginTop: "0.65rem", display: "inline-flex" }}>
                  View service<span aria-hidden> →</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="ndx-tech-landing__section ndx-tech-landing__delivery-section" aria-labelledby="delivery-heading">
          <p className="ndx-tech-meta">What we build</p>
          <h2 id="delivery-heading" className="ndx-h2 ndx-tech-landing__h2">
            {page.deliveryHeading}
          </h2>
          <div className="ndx-tech-landing__delivery-panel">
            <p className="ndx-group-sub ndx-tech-landing__prose-tight ndx-tech-landing__delivery-panel__intro">{page.deliveryLead}</p>
            <ul className="ndx-tech-landing__delivery-list" aria-label="Delivery themes">
              {page.deliveryTags.map((t) => {
                const DelIcon = deliveryTagIcon(t);
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
          </div>
        </section>

        <section className="ndx-tech-landing__section" aria-labelledby="faq-heading">
          <p className="ndx-tech-meta">FAQ</p>
          <h2 id="faq-heading" className="ndx-h2 ndx-tech-landing__h2">
            Questions specific to this practice
          </h2>
          <div className="ndx-tech-landing__faq">
            <FaqAccordion items={page.faq} />
          </div>
        </section>

        <p className="ndx-group-sub ndx-tech-landing__prose-tight" style={{ marginTop: "2rem" }}>
          For shipped work and credits, see the{" "}
          <Link to="/portfolio" style={{ color: "var(--ndx-accent)", fontWeight: 600 }}>
            portfolio
          </Link>
          .
        </p>

        <div className="ndx-rich-cta-box ndx-tech-landing__cta" style={{ marginTop: "2rem" }}>
          <div>
            <p className="ndx-tech-meta">Next step</p>
            <h2 className="ndx-h2" style={{ fontSize: "clamp(1.35rem, 3vw, 1.85rem)", marginTop: "0.35rem" }}>
              Tell us the outcome — we map offerings, milestones, and price options.
            </h2>
          </div>
          <div className="ndx-hero-btns">
            <Link to="/contact" className="ndx-btn ndx-btn-primary">
              Book a call →
            </Link>
            <Link to="/estimate" className="ndx-btn">
              Get estimate
            </Link>
          </div>
        </div>

        <p className="ndx-tech-landing__back" style={{ marginTop: "1.5rem" }}>
          <Link to="/services">← Back to all services</Link>
        </p>
      </div>
    </section>
  );
}
