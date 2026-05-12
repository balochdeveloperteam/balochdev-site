import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { IconType } from "react-icons";
import { FaPaintBrush } from "react-icons/fa";
import {
  SiAndroid,
  SiDocker,
  SiGooglegemini,
  SiLangchain,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiShopify,
  SiStorybook,
  SiSupabase,
  SiWebflow,
  SiZapier,
} from "react-icons/si";
import {
  TbApi,
  TbBolt,
  TbBrain,
  TbLayoutDashboard,
  TbMessageChatbot,
  TbPackages,
  TbPalette,
  TbPhoneCall,
  TbRocket,
  TbShieldCheck,
  TbSparkles,
  TbAutomation,
} from "react-icons/tb";
import { usePageMeta } from "../hooks/usePageMeta";
import RichSectionIntro from "../components/RichSectionIntro";
import { selectedWorkTeasers as selectedWork } from "../data/selectedWorkTeasers";
import {
  getServiceDetailLanding,
  isValidServiceDetailSlug,
  type ServiceDetailLandingConfig,
  type ServiceDetailSlug,
} from "../data/serviceDetailLandings";
import { getServicePracticeLanding } from "../data/servicePracticeLandings";

const SERVICE_DETAIL_HERO_ICONS: Record<ServiceDetailSlug, IconType> = {
  "ai-development": TbBrain,
  "ai-agents": SiLangchain,
  "rag-llm": SiGooglegemini,
  chatbots: SiOpenai,
  "voice-ai": TbPhoneCall,
  web: SiNextdotjs,
  "android-app-development": SiAndroid,
  "saas-development": SiSupabase,
  "mvp-development": TbRocket,
  "no-code-custom-code": SiWebflow,
  ecommerce: SiShopify,
  "workflow-automation": SiZapier,
  "api-integrations": SiNodedotjs,
  "maintenance-support": SiDocker,
  "ux-ui": TbPalette,
  branding: FaPaintBrush,
  "design-systems": SiStorybook,
};

const WHY_FALLBACK: IconType[] = [TbSparkles, TbRocket, TbBrain, TbShieldCheck];

function whyIconFor(title: string, index: number): IconType {
  const t = title.toLowerCase();
  if (/security|credential|safe|default|brand|trust/.test(t)) return TbShieldCheck;
  if (/milestone|scope|procurement|accept|speed|launch/.test(t)) return TbBolt;
  if (/hour|roi|maintain|ops|sustainable|cost/.test(t)) return TbPackages;
  if (/team|one team|handoff|engineering|workflow/.test(t)) return TbLayoutDashboard;
  return WHY_FALLBACK[index % WHY_FALLBACK.length];
}

function deliveryTagIcon(tag: string): IconType {
  const t = tag.toLowerCase();
  if (/api|webhook|integration/.test(t)) return TbApi;
  if (/dashboard|portal|web|admin/.test(t)) return TbLayoutDashboard;
  if (/chat|voice|bot/.test(t)) return TbMessageChatbot;
  if (/monitor|alert|observability|uptime/.test(t)) return TbBolt;
  if (/automation|zapier|n8n|pipeline/.test(t)) return TbAutomation;
  return TbSparkles;
}

function ServiceIntroPanel({ config, HeroIcon }: { config: ServiceDetailLandingConfig; HeroIcon: IconType }) {
  const slugSafe = config.slug.replace(/[^a-z0-9-]/gi, "") || "service";
  return (
    <div className={`ndx-tech-landing__intro-panel ndx-tech-landing__intro-panel--service-${slugSafe}`}>
      <div className="ndx-tech-landing__intro-panel__header">
        <span className="ndx-tech-landing__intro-panel__brand" aria-hidden>
          <HeroIcon size={26} />
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

function LandingFaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="ndx-faq-item">
      <button type="button" className="ndx-faq-q" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span style={{ color: "var(--ndx-accent)", fontSize: "1.35rem" }}>{open ? "−" : "+"}</span>
      </button>
      {open ? <div className="ndx-faq-a">{a}</div> : null}
    </div>
  );
}

function h1FromMeta(metaTitle: string) {
  return metaTitle.replace(/\s\|\sBalochDev$/, "").replace(/\s—\sBalochDev$/, "");
}

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const idOk = isValidServiceDetailSlug(slug);
  const page = idOk && slug ? getServiceDetailLanding(slug) : null;
  const practice = page ? getServicePracticeLanding(page.practiceId) : null;
  const HeroIcon = page ? SERVICE_DETAIL_HERO_ICONS[page.slug] : TbSparkles;

  const path = page && slug ? `/services/${slug}` : "/services";

  const jsonLd = useMemo(() => {
    if (!page || !practice) return undefined;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const pageUrl = origin ? `${origin}${path}` : path;
    const servicesUrl = origin ? `${origin}/services` : "/services";
    const practiceUrl = origin ? `${origin}/services/practice/${page.practiceId}` : `/services/practice/${page.practiceId}`;
    const breadcrumbId = `${pageUrl}#breadcrumb`;
    const webpageId = `${pageUrl}#webpage`;
    const serviceId = `${pageUrl}#service`;
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": webpageId,
          url: pageUrl,
          name: page.metaTitle,
          headline: page.seoTitle,
          description: page.description,
          isPartOf: { "@type": "WebSite", url: origin || undefined },
          breadcrumb: { "@id": breadcrumbId },
          publisher: {
            "@type": "Organization",
            name: "BalochDev",
            url: origin || undefined,
          },
          about: { "@type": "Thing", name: h1FromMeta(page.metaTitle) },
        },
        {
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Services", item: servicesUrl },
            { "@type": "ListItem", position: 2, name: practice.title, item: practiceUrl },
            { "@type": "ListItem", position: 3, name: h1FromMeta(page.metaTitle), item: pageUrl },
          ],
        },
        {
          "@type": "ProfessionalService",
          "@id": serviceId,
          name: `${h1FromMeta(page.metaTitle)} — BalochDev`,
          description: page.description,
          url: pageUrl,
          serviceType: h1FromMeta(page.metaTitle),
          areaServed: "Worldwide",
          provider: {
            "@type": "Organization",
            name: "BalochDev",
            url: origin || undefined,
          },
        },
        {
          "@type": "FAQPage",
          mainEntity: page.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        },
      ],
    };
  }, [page, practice, path]);

  usePageMeta({
    title: page?.metaTitle ?? "Services — BalochDev",
    description: page?.description,
    path,
    keywords: page?.keywords,
    ogTitle: page?.metaTitle,
    ogDescription: page?.description,
    jsonLd,
  });

  const chips = useMemo(() => page?.keywords.slice(0, 10) ?? [], [page]);

  if (!page || !slug || !idOk) {
    return (
      <section className="ndx-section ndx-page-rich" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <div className="ndx-container">
          <h1 className="ndx-h1">Service not found</h1>
          <p className="ndx-lead" style={{ marginTop: "0.75rem" }}>
            This service page does not exist — browse all offerings on the main services page.
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
      <div className="ndx-container">
        <nav className="ndx-tech-landing__crumb" aria-label="Breadcrumb">
          <Link to="/services">Services</Link>
          <span aria-hidden className="ndx-tech-landing__crumb-sep">
            /
          </span>
          <Link to={`/services/practice/${page.practiceId}`}>{practice?.title ?? page.practiceId}</Link>
          <span aria-hidden className="ndx-tech-landing__crumb-sep">
            /
          </span>
          <span>{h1FromMeta(page.metaTitle)}</span>
        </nav>

        <header className="ndx-tech-landing__hero ndx-tech-landing__hero--split">
          <div className="ndx-tech-landing__hero-glow" aria-hidden />
          <div className="ndx-tech-landing__hero-copy">
            <p className="ndx-tech-meta" style={{ marginBottom: "0.35rem" }}>
              {practice?.title ?? "BalochDev"} · Service
            </p>
            <h1 className="ndx-h1 ndx-tech-landing__h1">{h1FromMeta(page.metaTitle)}</h1>
            <p className="ndx-lead ndx-tech-landing__lead">{page.heroLead}</p>
            <div className="ndx-hero-btns ndx-tech-landing__hero-actions">
              <Link to="/contact" className="ndx-btn ndx-btn-primary">
                Discuss this service →
              </Link>
              <Link to="/estimate" className="ndx-btn">
                AI estimate
              </Link>
              <Link to={`/services#${page.practiceId}`} className="ndx-btn">
                View practice on services →
              </Link>
            </div>
          </div>
          <div className="ndx-tech-landing__hero-art">
            <div className="ndx-tech-landing__hero-icon-stage">
              <HeroIcon className="ndx-tech-landing__hero-mega-icon" aria-hidden />
            </div>
          </div>
        </header>

        <div className="ndx-tech-landing__split ndx-tech-landing__split--intro">
          <div className="ndx-tech-landing__split-copy">
            <p className="ndx-tech-meta">SEO & positioning</p>
            <h2 id="service-overview" className="ndx-h2 ndx-tech-landing__h2">
              {page.seoTitle}
            </h2>
            <p className="ndx-group-sub ndx-tech-landing__prose">{page.seoBody}</p>
            <ul className="ndx-tech-landing__kw" aria-label="Keywords people search for">
              {chips.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
          <ServiceIntroPanel config={page} HeroIcon={HeroIcon} />
        </div>

        {page.roiFit ? (
          <section className="ndx-tech-landing__section" aria-labelledby="roi-fit">
            <p className="ndx-tech-meta">Honest fit guide</p>
            <h2 id="roi-fit" className="ndx-h2 ndx-tech-landing__h2">
              {page.roiFit.title}
            </h2>
            <p className="ndx-group-sub ndx-tech-landing__prose-tight" style={{ maxWidth: "52rem" }}>
              {page.roiFit.intro}
            </p>
            <div className="ndx-tech-landing__why-grid" style={{ marginTop: "1.25rem" }}>
              <div className="ndx-tech-landing__why-card">
                <div className="ndx-tech-landing__why-card__body">
                  <h3>Usually works well</h3>
                  <ul className="ndx-tech-landing__plain-list">
                    {page.roiFit.worksWell.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="ndx-tech-landing__why-card">
                <div className="ndx-tech-landing__why-card__body">
                  <h3>Proceed carefully</h3>
                  <ul className="ndx-tech-landing__plain-list">
                    {page.roiFit.proceedCarefully.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {page.platformGuide ? (
          <section className="ndx-tech-landing__section" aria-labelledby="platform-guide">
            <p className="ndx-tech-meta">Shopify / WordPress / Wix / WooCommerce</p>
            <h2 id="platform-guide" className="ndx-h2 ndx-tech-landing__h2">
              How to choose a commerce stack (and how we help)
            </h2>
            <p className="ndx-group-sub ndx-tech-landing__prose-tight" style={{ maxWidth: "52rem" }}>
              {page.platformGuide.intro}
            </p>
            <div className="ndx-tech-landing__why-grid" style={{ marginTop: "1.25rem" }}>
              {page.platformGuide.platforms.map((p) => (
                <div key={p.name} className="ndx-tech-landing__why-card">
                  <div className="ndx-tech-landing__why-card__body">
                    <h3>{p.name}</h3>
                    <p className="ndx-tech-meta" style={{ marginBottom: "0.35rem" }}>
                      Best for
                    </p>
                    <p>{p.bestFor}</p>
                    <p className="ndx-tech-meta" style={{ margin: "0.75rem 0 0.35rem" }}>
                      Watch-outs
                    </p>
                    <p>{p.watchOuts}</p>
                    <p className="ndx-tech-meta" style={{ margin: "0.75rem 0 0.35rem" }}>
                      BalochDev approach
                    </p>
                    <p>{p.ourApproach}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="ndx-tech-landing__section" aria-labelledby="why-service">
          <p className="ndx-tech-meta">Why work with us</p>
          <h2 id="why-service" className="ndx-h2 ndx-tech-landing__h2">
            What buyers get on this engagement
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

        <section className="ndx-tech-landing__section" aria-labelledby="how-we-work-svc">
          <p className="ndx-tech-meta">How we work</p>
          <h2 id="how-we-work-svc" className="ndx-h2 ndx-tech-landing__h2">
            Phases from brief to handoff
          </h2>
          <p className="ndx-group-sub ndx-tech-landing__prose-tight" style={{ maxWidth: "48rem" }}>
            Like our practice hubs and technology stack pages, we keep scope readable: written milestones, demo checkpoints, and assumed budgets before long commits — so procurement and founders stay aligned.
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

        <section className="ndx-tech-landing__section" aria-labelledby="price-guide-svc">
          <p className="ndx-tech-meta">Assumed pricing</p>
          <h2 id="price-guide-svc" className="ndx-h2 ndx-tech-landing__h2">
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

        {page.relatedSlugs?.length ? (
          <section className="ndx-tech-landing__section" aria-labelledby="related-services">
            <p className="ndx-tech-meta">Related in this practice</p>
            <h2 id="related-services" className="ndx-h2 ndx-tech-landing__h2">
              Often paired services
            </h2>
            <div className="ndx-rich-service-grid" style={{ marginTop: "1.25rem" }}>
              {page.relatedSlugs.map((s) => {
                const rel = getServiceDetailLanding(s);
                if (!rel) return null;
                return (
                  <Link key={s} to={`/services/${s}`} className="ndx-card ndx-card-link" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                    <h3 className="ndx-tech-name" style={{ fontSize: "1.05rem", marginBottom: "0.35rem" }}>
                      {h1FromMeta(rel.metaTitle)}
                    </h3>
                    <span className="ndx-service-card-cta" style={{ marginTop: "0.65rem", display: "inline-flex" }}>
                      View service<span aria-hidden> →</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="ndx-tech-landing__section ndx-tech-landing__delivery-section" aria-labelledby="delivery-heading-svc">
          <p className="ndx-tech-meta">Delivery themes</p>
          <h2 id="delivery-heading-svc" className="ndx-h2 ndx-tech-landing__h2">
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

        <div
          id="recent-work"
          className="ndx-rich-block ndx-glass-section ndx-glass-section--recent-work ndx-tech-landing__recent-work-band scroll-mt-24"
        >
          <RichSectionIntro eyebrow="Recent work" title="What shipping looks like">
            Representative project shapes — case studies and credits live on the portfolio.
          </RichSectionIntro>
          <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            <Link to="/portfolio" className="ndx-btn">
              Full portfolio →
            </Link>
          </div>
          <div className="ndx-card-grid ndx-card-grid--cols-3" style={{ marginTop: "1.5rem" }}>
            {selectedWork.map((item, index) => (
              <Link key={item.title} to="/portfolio" className="ndx-card ndx-card-link" style={{ overflow: "hidden", padding: 0, display: "block" }}>
                <div
                  style={{
                    position: "relative",
                    height: "11rem",
                    background: `linear-gradient(135deg, color-mix(in srgb, var(--ndx-accent) 14%, transparent), color-mix(in srgb, var(--ndx-accent-2) 10%, transparent), color-mix(in srgb, var(--ndx-bg) 88%, transparent))`,
                  }}
                >
                  <span className="ndx-pill" style={{ position: "absolute", left: "1.1rem", top: "1.1rem", color: "var(--ndx-accent)" }}>
                    {item.tag}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      right: "1.1rem",
                      bottom: "1rem",
                      fontFamily: "var(--ndx-font-serif)",
                      fontSize: "2.5rem",
                      fontStyle: "italic",
                      opacity: 0.45,
                    }}
                  >
                    0{index + 1}
                  </span>
                </div>
                <div style={{ padding: "1.35rem" }}>
                  <h3>{item.title}</h3>
                  <p className="ndx-tech-blurb" style={{ marginTop: "0.35rem" }}>
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <section className="ndx-tech-landing__section" aria-labelledby="faq-heading-svc">
          <p className="ndx-tech-meta">FAQ</p>
          <h2 id="faq-heading-svc" className="ndx-h2 ndx-tech-landing__h2">
            Questions people ask before signing
          </h2>
          <div className="ndx-tech-landing__faq">
            {page.faq.map((item, index) => (
              <LandingFaqItem key={item.q} q={item.q} a={item.a} index={index} />
            ))}
          </div>
        </section>

        <p className="ndx-group-sub ndx-tech-landing__prose-tight" style={{ marginTop: "2rem" }}>
          For case studies, see the{" "}
          <Link to="/portfolio" style={{ color: "var(--ndx-accent)", fontWeight: 600 }}>
            portfolio
          </Link>{" "}
          — and the parent{" "}
          <Link to={`/services/practice/${page.practiceId}`} style={{ color: "var(--ndx-accent)", fontWeight: 600 }}>
            {practice?.title ?? "practice"} hub
          </Link>
          .
        </p>

        <div className="ndx-rich-cta-box ndx-tech-landing__cta" style={{ marginTop: "2rem" }}>
          <div>
            <p className="ndx-tech-meta">Next step</p>
            <h2 className="ndx-h2" style={{ fontSize: "clamp(1.35rem, 3vw, 1.85rem)", marginTop: "0.35rem" }}>
              Tell us outcomes and constraints — we reply with milestones, options, and a written fee plan.
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
