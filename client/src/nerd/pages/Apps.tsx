import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { IconType } from "react-icons";
import { SiAndroid, SiFlutter, SiReact, SiSwift } from "react-icons/si";
import {
  TbApi,
  TbDeviceMobile,
  TbRocket,
  TbSparkles,
  TbShieldCheck,
  TbBolt,
} from "react-icons/tb";
import Seo from "../seo/Seo";
import { ORGANIZATION_GRAPH_ID, SITE_URL } from "../seo/siteSeo";
import { STATIC_PUBLIC_PAGES_SEO } from "../seo/staticPublicPagesSeo.js";
import { capDescription, metaTitleFromPublicBrief } from "../seo/seoFromData";
import RichSectionIntro from "../components/RichSectionIntro";
import AppsHeroPhoneIllustration from "../components/AppsHeroPhoneIllustration";
import AiEstimatePromo from "../components/AiEstimatePromo";
import SelectedWorkGrid from "../components/SelectedWorkGrid";
import FaqAccordion from "../components/FaqAccordion";
import { stackToolLandingPath } from "../data/stackLandings";

const APPS_INDEX_SEO = STATIC_PUBLIC_PAGES_SEO["/apps"];

const PATH_FLUTTER = stackToolLandingPath("frontend", "flutter") ?? "/technologies";
const PATH_RN = stackToolLandingPath("frontend", "react_native") ?? "/technologies";

const heroStats = [
  { label: "Founded", value: "2024" },
  { label: "Shipped shapes", value: "150+" },
  { label: "Engagement", value: "Fixed-scope · Retainer" },
  { label: "Typical slice", value: "2–8 wks" },
];

type BuildCard = {
  num: string;
  title: string;
  blurb: string;
  bullets: string[];
  stack: string;
  href: string;
  cta: string;
  Icon: IconType;
};

const whatWeBuild: BuildCard[] = [
  {
    num: "/01",
    title: "Native Android",
    blurb: "Production Android in Kotlin with Jetpack Compose (or mature View-based codebases), Play Console pipelines, ProGuard rules, and billing where you need it.",
    bullets: ["Internal & Play tracks", "Background work & notifications", "Material 3 UX"],
    stack: "Kotlin · Jetpack Compose · Gradle",
    href: "/services/android-app-development",
    cta: "Android development →",
    Icon: SiAndroid,
  },
  {
    num: "/02",
    title: "Native iOS",
    blurb: "iPhone and iPad apps in Swift and SwiftUI: Apple Sign-In, push, subscriptions, and TestFlight before App Store review — aligned with your Apple developer accounts.",
    bullets: ["TestFlight & App Store listings", "StoreKit flows", "Privacy labels documented"],
    stack: "Swift · SwiftUI · Xcode",
    href: "/contact",
    cta: "Discuss an iOS build →",
    Icon: SiSwift,
  },
  {
    num: "/03",
    title: "Flutter",
    blurb: "One Dart codebase for iOS and Android when pixel-consistent UI and fast iteration matter — with platform channels only where the OS demands it.",
    bullets: ["iOS + Android from one repo", "Offline-first patterns", "Dev & release tooling"],
    stack: "Dart · Flutter · pub.dev",
    href: PATH_FLUTTER,
    cta: "Flutter on our stack →",
    Icon: SiFlutter,
  },
  {
    num: "/04",
    title: "React Native",
    blurb: "Cross-platform apps sharing TypeScript with your web team — Expo when it fits, native modules when you outgrow the defaults.",
    bullets: ["OTA-friendly workflows when scoped", "Native bridges for SDK gaps", "Shared design tokens"],
    stack: "React Native · TypeScript · Expo",
    href: PATH_RN,
    cta: "React Native on our stack →",
    Icon: SiReact,
  },
  {
    num: "/05",
    title: "APIs for mobile products",
    blurb: "Backends mobile clients rely on: auth-aware REST or GraphQL, versioning, idempotent webhooks, and logs you can trace when a build fails in the field.",
    bullets: ["Mobile-friendly payloads", "Push & device registration", "Rate limits & backoff"],
    stack: "Node · Python · Postgres",
    href: "/services/api-integrations",
    cta: "API & integrations →",
    Icon: TbApi,
  },
  {
    num: "/06",
    title: "Ship, stabilize, extend",
    blurb: "Store submissions, phased rollouts, crash and ANR triage, dependency bumps, and small feature lanes after v1 — so your app does not rot after launch week.",
    bullets: ["Release trains", "Monitoring hooks", "Retainer-friendly backlog"],
    stack: "Play Console · App Store Connect",
    href: "/services/maintenance-support",
    cta: "Maintenance & support →",
    Icon: TbRocket,
  },
];

const phases = [
  {
    n: "01",
    w: "1–2 wks",
    title: "Discovery & scope",
    body: "Personas, platforms (iOS/Android/both), offline needs, and store constraints — you get a written plan with assumed fees before we commit to a long build.",
  },
  {
    n: "02",
    w: "1–3 wks",
    title: "UX & vertical slice",
    body: "Figma flows and a thin build on real devices so stakeholders feel latency, navigation, and auth — not slides.",
  },
  {
    n: "03",
    w: "3–12 wks",
    title: "Product build",
    body: "Sprint demos from device installs, feature flags, and staging tracks; depth scales with integrations and compliance.",
  },
  {
    n: "04",
    w: "1–2 wks",
    title: "QA & store prep",
    body: "Device matrix, accessibility baselines, screenshots and listing copy — then Play and App Store submissions on your accounts.",
  },
  {
    n: "05",
    w: "1 wk",
    title: "Launch",
    body: "Phased rollout, crash dashboards, analytics sanity checks, and a short warranty window.",
  },
  {
    n: "06",
    w: "Ongoing",
    title: "Roadmap & care",
    body: "Retainers for upgrades and incidents, or a documented handoff for your in-house team.",
  },
];

const whyItems = [
  {
    title: "Releases you can install",
    text: "Demos ship to TestFlight, Play internal tracks, or staging builds — the same paths your users will eventually take.",
    Icon: TbBolt,
  },
  {
    title: "AI-accelerated delivery",
    text: "We use modern AI-assisted development for speed on boilerplate; architects still own security, performance, and store policy.",
    Icon: TbSparkles,
  },
  {
    title: "Mobile + API in one thread",
    text: "Screens, endpoints, and integrations stay aligned — fewer ‘works on my machine’ handoffs between vendors.",
    Icon: TbDeviceMobile,
  },
  {
    title: "Security-minded defaults",
    text: "Token storage, cert pinning when warranted, and minimal data on device — discussed before you scale downloads.",
    Icon: TbShieldCheck,
  },
];

const decisions = [
  {
    title: "Fully native vs Flutter / React Native?",
    body: "Swift + Kotlin win when you lean on cutting-edge OS features, heavy media on-device, or long-lived platform-specific code. Flutter and React Native win when one team must ship both stores and most screens are business logic, lists, and API-driven layouts.",
    take: "Default to cross-platform when timelines and budget are tight; split native only when the feature list forces it.",
  },
  {
    title: "React Native vs Flutter?",
    body: "React Native fits teams already strong in TypeScript and React. Flutter fits when you want one opinionated UI engine, strong offline rendering, and Dart end-to-end.",
    take: "RN when you share people with web; Flutter when mobile is the center of gravity and you want fewer layout surprises across devices.",
  },
  {
    title: "Ship iOS first or Android first?",
    body: "Market choice: regions, payment methods, and review friction differ. Technical choice: which SDKs, testers, and hardware you already have.",
    take: "Lead with the platform your paying users are already on; parallelize only when budget matches two store pipelines.",
  },
  {
    title: "Build in-house or with a studio?",
    body: "In-house works when you can hire senior mobile, design, and release engineers inside a quarter. A studio works when you need all three skill sets next month.",
    take: "Studios for speed and coordinated releases; in-house when the app is decade-long core IP.",
  },
];

const termDefs = [
  {
    term: "Native mobile development",
    text: "Apps built with each platform’s primary tooling — Kotlin and Jetpack Compose on Android, Swift and SwiftUI on iOS — with full access to OS APIs and store distribution.",
  },
  {
    term: "Cross-platform (Flutter / React Native)",
    text: "One shared codebase producing binaries for both stores, with native modules or plugins only where the framework boundary ends.",
  },
  {
    term: "App Store & Play Console",
    text: "Apple and Google developer programs used to distribute betas, manage signing, and publish listing metadata reviewers see.",
  },
  {
    term: "Minimum viable product (MVP)",
    text: "The smallest mobile release that proves retention or revenue with real installs — still includes analytics, auth if needed, and a post-launch fix path.",
  },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "Do you offer affordable mobile app development?",
    a: "Yes. After a short brief we quote phased work with assumed bands. Entry discovery and planning often starts around a few thousand USD; full dual-platform apps scale with scope, not hidden hourly black boxes.",
  },
  {
    q: "Which stacks do you use for mobile?",
    a: "Kotlin and Jetpack Compose on Android, Swift and SwiftUI on iOS, Flutter for cross-platform Dart apps, and React Native or Expo when TypeScript sharing with web is the goal. We pair them with Node or Python APIs and Postgres or Supabase as needed.",
  },
  {
    q: "Can you publish under our developer accounts?",
    a: "Yes — TestFlight, Play internal testing, and production listings run on your Apple and Google accounts; we prepare binaries, metadata, and reviewer notes.",
  },
  {
    q: "How long does an MVP take?",
    a: "A focused single-platform MVP might ship in several weeks; dual-platform or compliance-heavy products take longer. Timelines come from scope, not slogans.",
  },
  {
    q: "Can you inherit an existing app?",
    a: "Often, after a read-only audit and stabilization plan. We slice refactors behind feature flags instead of risky big-bang rewrites.",
  },
  {
    q: "Who owns the code?",
    a: "You do, per contract — repositories, signing assets, and deployment credentials are transferred at the agreed milestone.",
  },
];

export default function AppsPage() {
  const reduced = useReducedMotion();

  const seoTitle = useMemo(() => metaTitleFromPublicBrief(APPS_INDEX_SEO.metaTitle), []);

  const seoDescription = useMemo(() => capDescription(APPS_INDEX_SEO.metaDescription), []);

  const jsonLd = useMemo(() => {
    const pageUrl = `${SITE_URL}${APPS_INDEX_SEO.canonicalPath}`;
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${pageUrl}#webpage`,
          url: pageUrl,
          name: seoTitle,
          description: seoDescription,
          isPartOf: { "@type": "WebSite", url: SITE_URL },
        },
        {
          "@type": "ProfessionalService",
          "@id": `${pageUrl}#service`,
          name: seoTitle.replace(/\s\|\sBalochDev$/u, '').trim(),
          description: seoDescription,
          url: pageUrl,
          serviceType: "Mobile application development",
          areaServed: "Worldwide",
          provider: { "@id": ORGANIZATION_GRAPH_ID },
        },
        {
          "@type": "FAQPage",
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        },
      ],
    };
  }, [seoTitle, seoDescription]);

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        canonicalPath={APPS_INDEX_SEO.canonicalPath}
        jsonLd={jsonLd}
      />
      <section className="ndx-section ndx-page-rich ndx-page-rich--apps" style={{ paddingTop: "1.65rem", paddingBottom: "2.5rem" }}>
      <div className="ndx-container">
        <motion.div
          className="ndx-rich-pill ndx-rich-pill--minimal"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="ndx-rich-pill-dot" aria-hidden />
          BD · Mobile apps · Kotlin · Swift · Flutter · RN · Remote
        </motion.div>

        <div className="ndx-rich-hero">
          <div className="ndx-rich-hero__copy">
            <motion.h1 className="ndx-h1" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.55 }}>
              Mobile apps,
              <br />
              engineered to <em>ship</em>.
            </motion.h1>
            <motion.p
              className="ndx-lead"
              style={{ maxWidth: "52ch" }}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.06 }}
            >
              We build <strong>Android</strong> (Kotlin, Jetpack Compose), <strong>iOS</strong> (Swift, SwiftUI), and cross-platform apps with{" "}
              <strong>Flutter</strong> or <strong>React Native</strong> — plus the <strong>APIs</strong>, auth, and store releases those clients need in the real world.
            </motion.p>
            <motion.div className="ndx-rich-actions" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.12 }}>
              <Link to="/contact" className="ndx-btn ndx-btn-primary">
                Start a project →
              </Link>
              <Link to="/estimate" className="ndx-btn">
                AI estimate
              </Link>
              <a href="#what-we-build" className="ndx-btn">
                What we build
              </a>
            </motion.div>
            <motion.table
              className="ndx-rich-hero-offer ndx-apps-hero-offer-unified"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.16 }}
            >
              <tbody>
                <tr>
                  <th scope="row">Assumed entry</th>
                  <td>
                    <strong>From ~USD $2,500</strong>
                    <span className="ndx-rich-hero-offer-note">Typical discovery and first scoped slice; dual-platform programs quoted after brief.</span>
                  </td>
                </tr>
                {heroStats.map((item) => (
                  <tr key={item.label}>
                    <th scope="row">{item.label}</th>
                    <td>
                      <strong>{item.value}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </motion.table>
          </div>
          <motion.div
            className="ndx-rich-hero__viz ndx-apps-hero-viz-wrap"
            initial={reduced ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : 0.08 }}
          >
            <div className="ndx-apps-hero-viz-inner">
              <AppsHeroPhoneIllustration />
            </div>
          </motion.div>
        </div>

        <div className="ndx-apps-wayfinding scroll-mt-24" style={{ marginTop: "1.75rem" }}>
          <span className="ndx-apps-wayfinding-label">Also visit</span>
          <nav className="ndx-apps-wayfinding-links" aria-label="Site sections">
            <Link to="/">Home</Link>
            <span aria-hidden className="ndx-apps-wayfinding-sep">
              ·
            </span>
            <Link to="/services">Services</Link>
            <span aria-hidden className="ndx-apps-wayfinding-sep">
              ·
            </span>
            <Link to="/technologies">Technologies</Link>
            <span aria-hidden className="ndx-apps-wayfinding-sep">
              ·
            </span>
            <Link to="/portfolio">Portfolio</Link>
            <span aria-hidden className="ndx-apps-wayfinding-sep">
              ·
            </span>
            <Link to="/contact">Contact</Link>
            <span aria-hidden className="ndx-apps-wayfinding-sep">
              ·
            </span>
            <Link to="/estimate">AI estimate</Link>
          </nav>
        </div>

        <div id="what-we-build" className="ndx-rich-block scroll-mt-24" style={{ marginTop: "2rem" }}>
          <RichSectionIntro eyebrow="/01 · What we build" title="Six ways we help you ship mobile">
            Native Android and iOS, Flutter, React Native, the APIs your apps call, and ongoing releases — each card links to a service page, stack page, or a direct conversation so you can plan both stores in one place.
          </RichSectionIntro>
          <div className="ndx-card-grid ndx-apps-what-grid" style={{ marginTop: "1.5rem" }}>
            {whatWeBuild.map((card) => {
              const Icon = card.Icon;
              return (
                <div key={card.title} className="ndx-card" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "280px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
                    <span style={{ fontFamily: "var(--ndx-font-serif)", fontSize: "1.85rem", fontStyle: "italic", color: "var(--ndx-accent)", lineHeight: 1 }}>{card.num}</span>
                    <span className="ndx-tech-abbr" style={{ width: 48, height: 48 }}>
                      <Icon size={24} aria-hidden />
                    </span>
                  </div>
                  <h3 className="ndx-tech-name" style={{ fontSize: "1.2rem", marginTop: "0.75rem" }}>
                    {card.title}
                  </h3>
                  <p className="ndx-tech-blurb" style={{ marginTop: "0.45rem", flex: 1, lineHeight: 1.55 }}>
                    {card.blurb}
                  </p>
                  <ul className="ndx-list-muted" style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>
                    {card.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <p className="ndx-tech-meta" style={{ marginTop: "0.85rem", fontWeight: 600 }}>
                    {card.stack}
                  </p>
                  <Link to={card.href} className="ndx-service-card-cta" style={{ marginTop: "1rem", display: "inline-flex" }}>
                    {card.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div id="how-we-ship" className="ndx-rich-block ndx-glass-section scroll-mt-24" style={{ marginTop: "2rem" }}>
          <RichSectionIntro eyebrow="/02 · How we ship" title="Phases stores and users actually see">
            Discovery through Play and App Store releases — demos on hardware, not mockups alone.
          </RichSectionIntro>
          <div className="ndx-card-grid ndx-apps-phase-grid" style={{ marginTop: "1.5rem" }}>
            {phases.map((ph) => (
              <div key={ph.title} className="ndx-card">
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <span className="ndx-tech-meta">{ph.n}</span>
                  <span className="ndx-pill">{ph.w}</span>
                </div>
                <h3 className="ndx-tech-name">{ph.title}</h3>
                <p className="ndx-tech-blurb" style={{ marginTop: "0.45rem", lineHeight: 1.55 }}>
                  {ph.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="ndx-rich-block scroll-mt-24" style={{ marginTop: "2rem" }}>
          <RichSectionIntro eyebrow="/03 · Stack" title="Tools we ship in production">
            Dive into stack pages for Flutter, React Native, backends, and data — or ask us to map your exact mix on a call.
          </RichSectionIntro>
          <div style={{ marginTop: "1.25rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {["Kotlin", "Jetpack Compose", "Swift", "SwiftUI", "Flutter", "Dart", "React Native", "TypeScript", "Firebase", "Supabase", "PostgreSQL"].map((t) => (
              <Link key={t} to="/technologies" className="ndx-pill" style={{ textDecoration: "none", color: "inherit", fontWeight: 600 }}>
                {t}
              </Link>
            ))}
          </div>
          <Link to="/technologies" className="ndx-btn" style={{ marginTop: "1.25rem", display: "inline-flex" }}>
            Browse technologies →
          </Link>
        </div>

        <div className="ndx-rich-block ndx-glass-section scroll-mt-24" style={{ marginTop: "2rem" }}>
          <RichSectionIntro eyebrow="/04 · Domains" title="Apps in real industries">
            Compliance, logistics, and operations vary — our industry hub ties mobile work to how your sector actually runs.
          </RichSectionIntro>
          <div className="ndx-hero-btns" style={{ marginTop: "1rem", flexWrap: "wrap" }}>
            <Link to="/services" className="ndx-btn ndx-btn-primary">
              View services →
            </Link>
            <Link to="/services/practice/build" className="ndx-btn">
              Build practice →
            </Link>
          </div>
        </div>

        <div id="why-balochdev" className="ndx-rich-block scroll-mt-24" style={{ marginTop: "2rem" }}>
          <RichSectionIntro eyebrow="/05 · Why BalochDev" title="What we mean by shipping">
            Store-ready builds, honest scope, and engineers who have published before — not a generic dev shop blurb.
          </RichSectionIntro>
          <div className="ndx-card-grid ndx-apps-grid-why">
            {whyItems.map((w) => {
              const I = w.Icon;
              return (
                <div key={w.title} className="ndx-card" style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1.35rem 1.45rem" }}>
                  <div className="ndx-tech-abbr" style={{ width: 48, height: 48, flexShrink: 0 }}>
                    <I size={24} aria-hidden />
                  </div>
                  <div>
                    <h3 className="ndx-tech-name" style={{ fontSize: "1.1rem" }}>
                      {w.title}
                    </h3>
                    <p className="ndx-tech-blurb" style={{ marginTop: "0.4rem", lineHeight: 1.55 }}>
                      {w.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div id="decisions" className="ndx-rich-block ndx-glass-section scroll-mt-24" style={{ marginTop: "2rem" }}>
          <RichSectionIntro eyebrow="/06 · Decisions" title="Choices buyers ask about on day one">
            Short, opinionated reads — the same questions we cover in a scoping call.
          </RichSectionIntro>
          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {decisions.map((d) => (
              <div key={d.title} className="ndx-card" style={{ padding: "1.25rem 1.35rem" }}>
                <h3 className="ndx-tech-name">{d.title}</h3>
                <p className="ndx-tech-blurb" style={{ marginTop: "0.45rem", lineHeight: 1.55 }}>
                  {d.body}
                </p>
                <p style={{ marginTop: "0.85rem", fontSize: "0.92rem", fontWeight: 600, color: "var(--ndx-accent)" }}>
                  Our take: {d.take}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="ndx-rich-block ndx-glass-section scroll-mt-24" style={{ marginTop: "2rem" }}>
          <RichSectionIntro eyebrow="/07 · Definitions" title="Terms we use on mobile projects">
            Quick definitions so product, finance, and engineering share the same vocabulary.
          </RichSectionIntro>
          <div className="ndx-card-grid ndx-apps-grid-terms" style={{ marginTop: "1.35rem" }}>
            {termDefs.map((t) => (
              <div key={t.term} className="ndx-card" style={{ padding: "1.35rem 1.45rem" }}>
                <h3 className="ndx-tech-name" style={{ fontSize: "1.05rem" }}>
                  {t.term}
                </h3>
                <p className="ndx-tech-blurb" style={{ marginTop: "0.45rem", lineHeight: 1.55 }}>
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div id="faq" className="ndx-rich-block ndx-glass-section scroll-mt-24" style={{ marginTop: "2rem" }}>
          <RichSectionIntro eyebrow="/08 · FAQ" title="Before you sign">
            Cost, stacks, store accounts, and ownership — ask anything missing on a call.
          </RichSectionIntro>
          <div style={{ marginTop: "1.25rem" }}>
            <FaqAccordion items={faqs} />
          </div>
        </div>

        <div id="recent-work" className="ndx-rich-block ndx-glass-section ndx-glass-section--recent-work ndx-apps-recent-work scroll-mt-24">
          <RichSectionIntro eyebrow="Recent work" title="What shipping looks like">
            Real client and BalochDev builds — open a case study for the full story.
          </RichSectionIntro>
          <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            <Link to="/portfolio" className="ndx-btn">
              Full portfolio →
            </Link>
            <Link to="/contact" className="ndx-btn">
              Discuss yours →
            </Link>
          </div>
          <SelectedWorkGrid className="ndx-card-grid ndx-apps-recent-grid" mediaHeight="12rem" />
        </div>

        <AiEstimatePromo />

        <div className="ndx-rich-cta-box" style={{ marginTop: "2.25rem" }}>
          <div>
            <p className="ndx-tech-meta">Let&apos;s ship</p>
            <h2 className="ndx-h2" style={{ fontSize: "clamp(1.35rem, 3vw, 1.85rem)", marginTop: "0.35rem" }}>
              Tell us what you are building for iOS and Android — we reply with stack, milestones, and cost options.
            </h2>
            <p className="ndx-tech-blurb" style={{ marginTop: "0.65rem", maxWidth: "50ch", lineHeight: 1.55 }}>
              Start from{" "}
              <Link to="/services/android-app-development" style={{ color: "var(--ndx-accent)", fontWeight: 600 }}>
                Android
              </Link>
              ,{" "}
              <Link to={PATH_FLUTTER} style={{ color: "var(--ndx-accent)", fontWeight: 600 }}>
                Flutter
              </Link>
              , or{" "}
              <Link to={PATH_RN} style={{ color: "var(--ndx-accent)", fontWeight: 600 }}>
                React Native
              </Link>{" "}
              — or go straight to{" "}
              <Link to="/contact" style={{ color: "var(--ndx-accent)", fontWeight: 600 }}>
                contact
              </Link>{" "}
              if you need native iOS and a single proposal across both stores.
            </p>
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
      </div>
    </section>
    </>
  );
}
