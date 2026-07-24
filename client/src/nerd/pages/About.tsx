import { useMemo } from "react";
import { Link } from "react-router-dom";
import BookCallButton from "../components/bookCall/BookCallButton";
import { motion, useReducedMotion } from "framer-motion";
import Seo from "../seo/Seo";
import { aboutPageJsonLd } from "../seo/siteSeo";
import FaqAccordion from "../components/FaqAccordion";
import BrandLogo from "../components/BrandLogo";
import AboutWorldMap, {
  MEET_LOCATIONS,
  CLIENT_LOCATIONS,
  usePresenceHover,
} from "../components/AboutWorldMap";
import { STATIC_PUBLIC_PAGES_SEO } from "../seo/staticPublicPagesSeo.js";
import { capDescription, metaTitleFromPublicBrief } from "../seo/seoFromData";
import { TEAM_MEMBERS, FOUNDER } from "../data/team.js";
import { ABOUT_FAQ_TEASER } from "../data/siteFaqs.js";

const ABOUT_SEO = STATIC_PUBLIC_PAGES_SEO["/about"];

const RECORD_STATS = [
  { label: "Repeat clients", value: "80", suffix: "%" },
  { label: "Biggest launch", value: "$330K", suffix: null },
  { label: "Projects", value: "80", suffix: "+" },
  {
    label: "Fiverr + Upwork · Clutch · Trustpilot · GoodFirms",
    value: "5.0",
    suffix: "/ 5",
  },
];

const principles = [
  {
    num: "/01",
    title: "Ship the product, not the deck.",
    body: "We measure our work by what is in production — not by slides or unstarted boards. Every engagement ends with working software.",
  },
  {
    num: "/02",
    title: "AI is in the toolchain, not in the pitch.",
    body: "Claude Code, agents, and modern frameworks compress scoping, build, and review. Senior engineers still own architecture and ship quality.",
  },
  {
    num: "/03",
    title: "Promote Balochi — always.",
    body: "Digitising Balochi keyboards, browsers, office tools, and AI models is our highest-priority mission. Client work funds it; the mission keeps us honest.",
  },
  {
    num: "/04",
    title: "Senior people on every project.",
    body: "No bench, no junior-on-junior handoffs. The developers in the kickoff are the same developers in the standups three months later.",
  },
  {
    num: "/05",
    title: "You own everything from day one.",
    body: "Code lives in your repository from the first commit. We retain no rights to client work and do not reuse client code across projects.",
  },
  {
    num: "/06",
    title: "Transparent milestones, weekly demos.",
    body: "Fixed milestones, protected branches, staging before production. You see real progress every week — no surprise invoices.",
  },
];

const timeline = [
  {
    year: "2024",
    label: "Origin",
    title: "Origin.",
    body: "BalochDev is founded with a dual mission: deliver world-class web, mobile, and AI products for international clients, and advance Balochi language technology in mainstream software.",
  },
  {
    year: "2025",
    label: "Partners",
    title: "Partners & depth.",
    body: "Partnerships with Balochi Academy and the Taheer team take shape. Keyboard and Office work begins. The core team grows across engineering, design, and content.",
  },
  {
    year: "2025",
    label: "AI & mobile",
    title: "AI & mobile.",
    body: "React Native, Flutter, and AI-assisted delivery become core offerings. Claude Code and agents enter the daily toolchain — not just the pitch deck.",
  },
  {
    year: "2026",
    label: "AI studio",
    title: "AI-native studio.",
    body: "Supabase, Cloudflare-first hosting, and production agents are standard. Balochi language research accelerates. The studio ships software markedly faster — with senior review intact.",
  },
];

const stackPillars = [
  {
    title: "Frontend",
    subtitle: "React · Next · TypeScript",
    icons: ["bx-code-alt", "bx-layer", "bx-palette"],
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"],
  },
  {
    title: "Backend",
    subtitle: "Node · Python · Supabase",
    icons: ["bx-server", "bx-data", "bx-cube"],
    items: ["Node.js", "Python · FastAPI", "Supabase", "PostgreSQL", "REST & realtime APIs", "Auth · RLS"],
  },
  {
    title: "AI layer",
    subtitle: "Claude Code · Agents · RAG",
    icons: ["bx-bulb", "bx-bot", "bx-sitemap"],
    items: ["Claude (Anthropic)", "Claude Code", "OpenAI · Gemini", "RAG systems", "AI agents", "Chatbots & tooling"],
  },
  {
    title: "Cloud",
    subtitle: "Cloudflare · Vercel · CI",
    icons: ["bx-cloud", "bx-rocket", "bx-git-branch"],
    items: ["Cloudflare Workers · Pages", "Vercel", "Edge delivery", "GitHub Actions", "Staging → production", "Observability basics"],
  },
  {
    title: "Mobile",
    subtitle: "iOS · Android · Cross-platform",
    icons: ["bx-mobile-alt", "bx-devices", "bx-store"],
    items: ["React Native", "Flutter", "Expo", "App Store · Play Store", "Push & offline flows", "Shared APIs with web"],
  },
  {
    title: "Delivery",
    subtitle: "Ownership · Security · Ops",
    icons: ["bx-shield-quarter", "bx-lock-alt", "bx-badge-check"],
    items: ["Code in your repo", "Env isolation", "Least-privilege secrets", "Staging reviews", "Weekly demos", "Clean handoff"],
  },
];

function TeamPhoto({ name, image }: { name: string; image: string | null }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (image) {
    return (
      <div className="ndx-about-team-photo">
        <img src={image} alt="" loading="lazy" decoding="async" />
      </div>
    );
  }

  return (
    <div className="ndx-about-team-photo ndx-about-team-photo--placeholder" aria-hidden>
      <span className="ndx-about-team-photo__initials">{initials}</span>
      <span className="ndx-about-team-photo__soon">Photo soon</span>
    </div>
  );
}

export default function AboutPage() {
  const reduced = useReducedMotion();
  const presence = usePresenceHover();
  const seoTitle = useMemo(() => metaTitleFromPublicBrief(ABOUT_SEO.metaTitle), []);
  const seoDescription = useMemo(() => capDescription(ABOUT_SEO.metaDescription), []);
  const jsonLd = useMemo(
    () => aboutPageJsonLd({ headline: seoTitle, description: seoDescription }),
    [seoTitle, seoDescription],
  );

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        canonicalPath={ABOUT_SEO.canonicalPath}
        jsonLd={jsonLd}
      />
      <section
        className="ndx-section ndx-page-rich ndx-page-rich--about"
        style={{ paddingTop: "1.65rem", paddingBottom: "3rem" }}
      >
        <div className="ndx-container">
          {/* Hero */}
          <div className="ndx-about-hero">
            <motion.div
              className="ndx-rich-pill ndx-rich-pill--minimal"
              initial={reduced ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.55 }}
            >
              <span className="ndx-rich-pill-dot" aria-hidden />
              About BalochDev · Balochistan · Remote-first · Est. 2024
            </motion.div>

            <div className="ndx-about-hero__row">
              <div className="ndx-about-hero__copy">
                <motion.h1
                  className="ndx-h1"
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.55 }}
                >
                  Custom software, shipped <em>faster</em> — by a senior team that uses AI well.
                </motion.h1>
                <motion.p
                  className="ndx-lead"
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.07 }}
                >
                  Since 2024 we have shipped production web, mobile, and AI products for clients worldwide —
                  while advancing <strong>Balochi language technology</strong> with community partners. 20+ senior
                  specialists. A 14+ core team you actually meet.
                </motion.p>
                <motion.div
                  className="ndx-rich-actions"
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.13 }}
                >
                  <Link to="/estimate" className="ndx-btn ndx-btn-primary">
                    Get AI estimate
                  </Link>
                  <Link to="/contact" className="ndx-btn">
                    Get in touch
                  </Link>
                  <Link to="/portfolio" className="ndx-btn">
                    View our work
                  </Link>
                </motion.div>
              </div>

              <motion.div
                className="ndx-about-hero__logo"
                initial={reduced ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : 0.08 }}
              >
                <BrandLogo variant="hero" />
              </motion.div>
            </div>

            <motion.div
              className="ndx-home-record ndx-home-record--about"
              aria-label="The record"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.16 }}
            >
              <div className="ndx-home-record__inner">
                <p className="ndx-home-record__kicker">
                  <span className="ndx-home-record__dot" aria-hidden />
                  The record · 2024 → 2026 · Built in public
                </p>
                <div className="ndx-home-record__grid" role="list">
                  {RECORD_STATS.map((stat) => (
                    <div key={stat.label} className="ndx-home-record__stat" role="listitem">
                      <span className="ndx-home-record__label">{stat.label}</span>
                      <span className="ndx-home-record__value">
                        <span className="ndx-home-record__numeral">{stat.value}</span>
                        {stat.suffix ? (
                          <span className="ndx-home-record__suffix">{stat.suffix}</span>
                        ) : null}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Founder */}
          <div className="ndx-rich-block ndx-glass-section ndx-about-founder">
            <div className="ndx-about-founder__media">
              <img
                src={FOUNDER.portrait}
                alt={`${FOUNDER.name}, ${FOUNDER.role}`}
                className="ndx-about-founder__img"
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="ndx-about-founder__copy">
              <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1.1rem" }}>
                <span className="ndx-rich-pill-dot" aria-hidden />
                A note from the founder
              </p>
              <h2 className="ndx-h2" style={{ maxWidth: "38rem", marginBottom: "1.25rem" }}>
                Why we built BalochDev <em>the way we did.</em>
              </h2>
              <p className="ndx-about-founder__story">
                I started BalochDev in 2024 because I was done watching talent from our region get treated as
                a footnote. The promise was simple: every engagement ends with software in production — and
                every month of client work also funds Balochi language technology that belongs with the
                community, not over it.
              </p>
              <p className="ndx-about-founder__story">
                What changed quickly was how we keep that promise. AI agents and Claude Code now sit inside
                our toolchain on every project — they compress the loops between scoping, building, and
                reviewing without replacing the senior engineers who own each decision. We ship faster because
                the process is tighter, not because we skip craft.
              </p>
              <p className="ndx-about-founder__story">
                The part I am proudest of is quieter: a core team of 14+ people who stay on the work, 20+
                senior specialists we can call in, and partners who trust us with real products. If you are
                reading this far, thank you. Tell us what you want to ship — we will tell you honestly whether
                we can help. — Adeel
              </p>
              <p className="ndx-about-founder__byline">
                {FOUNDER.name} · {FOUNDER.role}
              </p>
              <div className="ndx-about-ai-promo">
                <p className="ndx-about-ai-promo__eyebrow">AI in the toolchain</p>
                <p className="ndx-about-ai-promo__text">
                  Claude Code, agents, and modern frameworks on every build — so a focused senior team ships
                  like a large one, with review and ownership intact.
                </p>
                <Link to="/estimate" className="ndx-btn ndx-btn-primary">
                  Try the AI estimate
                </Link>
              </div>
            </div>
          </div>

          {/* Believe */}
          <div className="ndx-rich-block ndx-about-believe-block">
            <p className="ndx-rich-pill ndx-rich-pill--minimal">
              <span className="ndx-rich-pill-dot" aria-hidden />
              What we believe
            </p>
            <h2 className="ndx-h2 ndx-about-believe-block__title">
              Most studios sell hours. <em>We ship product.</em>
            </h2>
            <div className="ndx-about-believe">
              <div className="ndx-about-believe__card">
                <p className="ndx-about-believe__eyebrow">How most studios work</p>
                <h3>Hours billed. Decks delivered.</h3>
                <p>
                  Engagements end with a slide deck, a board of unstarted tasks, and an invoice for hours
                  nobody can audit. AI shows up in the pitch — not in the toolchain.
                </p>
              </div>
              <div className="ndx-about-believe__card ndx-about-believe__card--accent">
                <p className="ndx-about-believe__eyebrow ndx-about-believe__eyebrow--accent">How BalochDev works</p>
                <h3>Code in production. Every time.</h3>
                <p>
                  Weekly demos, fixed milestones, staging before production. AI is in our toolchain — not in
                  our pitch. Every engagement ends with software in your repo, owned by your team.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="ndx-rich-block">
            <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1.1rem" }}>
              <span className="ndx-rich-pill-dot" aria-hidden />
              The arc, in four moments
            </p>
            <h2 className="ndx-h2" style={{ maxWidth: "32rem", marginBottom: "2rem" }}>
              From first commit <em>to full studio.</em>
            </h2>
            <div className="ndx-about-timeline">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year + item.title}
                  className="ndx-about-timeline__row"
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.42, delay: reduced ? 0 : 0.07 * i }}
                >
                  <div className="ndx-about-timeline__rail">
                    <span className="ndx-about-timeline__dot" />
                    {i < timeline.length - 1 ? <span className="ndx-about-timeline__line" /> : null}
                  </div>
                  <div className="ndx-about-timeline__body">
                    <span className="ndx-about-timeline__year">
                      {item.year}
                      <span className="ndx-about-timeline__label"> · {item.label}</span>
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="ndx-rich-block">
            <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1.1rem" }}>
              <span className="ndx-rich-pill-dot" aria-hidden />
              Meet our team
            </p>
            <h2 className="ndx-h2" style={{ marginBottom: "0.4rem" }}>
              14+ core. <em>20+ specialists.</em>
            </h2>
            <p className="ndx-group-sub" style={{ maxWidth: "42rem", marginBottom: "1.75rem" }}>
              Senior people on every project. One client at a time when it matters. Photos are our real team —
              say hello if you want to collaborate.
            </p>
            <div className="ndx-about-team-grid">
              {TEAM_MEMBERS.map((m, i) => (
                <motion.article
                  key={m.name}
                  className="ndx-about-team-card"
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.38, delay: reduced ? 0 : 0.03 * i }}
                >
                  <TeamPhoto name={m.name} image={m.image} />
                  <div className="ndx-about-team-card__body">
                    <h3>{m.name}</h3>
                    <p className="ndx-about-team-card__role">{m.role}</p>
                    <p className="ndx-about-team-card__bio">{m.bio}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Where & how we work */}
          <div className="ndx-rich-block ndx-about-presence">
            <div className="ndx-about-presence__grid">
              <div className="ndx-about-presence__copy">
                <p className="ndx-rich-pill ndx-rich-pill--minimal">
                  <span className="ndx-rich-pill-dot" aria-hidden />
                  Where &amp; how we work
                </p>
                <h2 className="ndx-h2 ndx-about-presence__title">
                  Balochistan · Remote-first.{" "}
                  <em>80+ projects across the US, UK, Canada &amp; EU.</em>
                </h2>
                <p className="ndx-about-presence__lead">
                  BalochDev is a remote-first custom software studio based in Balochistan. We ship web, mobile,
                  and AI products for international clients — with async delivery across time zones and optional
                  in-person meetups in Qatar, Bahrain, UAE, Iran, Russia, and Balochistan. Most of our client
                  work comes from the United States, United Kingdom, Canada, and Europe, with 80+ projects
                  completed since 2024.
                </p>
                <p className="ndx-about-presence__hint">
                  Hover any location to pin it on the map.
                </p>

                <div className="ndx-about-presence__groups">
                  <div>
                    <p className="ndx-about-presence__group-label">Meet in person</p>
                    <div className="ndx-about-presence__pills" role="list">
                      {MEET_LOCATIONS.map((loc) => (
                        <button
                          key={loc.id}
                          type="button"
                          role="listitem"
                          className={`ndx-about-presence__pill ndx-about-presence__pill--meet${
                            presence.activeId === loc.id ? " is-active" : ""
                          }`}
                          onMouseEnter={() => presence.onEnter(loc.id)}
                          onMouseLeave={presence.onLeave}
                          onFocus={() => presence.onEnter(loc.id)}
                          onBlur={presence.onLeave}
                        >
                          {loc.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="ndx-about-presence__group-label">Client markets</p>
                    <div className="ndx-about-presence__pills" role="list">
                      {CLIENT_LOCATIONS.map((loc) => (
                        <button
                          key={loc.id}
                          type="button"
                          role="listitem"
                          className={`ndx-about-presence__pill ndx-about-presence__pill--client${
                            presence.activeId === loc.id ? " is-active" : ""
                          }`}
                          onMouseEnter={() => presence.onEnter(loc.id)}
                          onMouseLeave={presence.onLeave}
                          onFocus={() => presence.onEnter(loc.id)}
                          onBlur={presence.onLeave}
                        >
                          {loc.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                className="ndx-about-presence__map-wrap"
                initial={reduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: reduced ? 0 : 0.5 }}
              >
                <AboutWorldMap activeId={presence.activeId} />
              </motion.div>
            </div>
          </div>

          {/* Principles */}
          <div className="ndx-rich-block">
            <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1.1rem" }}>
              <span className="ndx-rich-pill-dot" aria-hidden />
              Studio principles · v2026
            </p>
            <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "1.75rem" }}>
              Six rules we run <em>the studio by.</em>
            </h2>
            <div className="ndx-about-principles">
              {principles.map((p, i) => (
                <motion.div
                  key={p.num}
                  className="ndx-about-principle"
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.38, delay: reduced ? 0 : 0.05 * i }}
                >
                  <p className="ndx-about-principle__num">{p.num}</p>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stack */}
          <div className="ndx-rich-block ndx-about-stack-block">
            <div className="ndx-about-stack-head">
              <div className="ndx-about-stack-head__copy">
                <p className="ndx-rich-pill ndx-rich-pill--minimal">
                  <span className="ndx-rich-pill-dot" aria-hidden />
                  What we ship with
                </p>
                <h2 className="ndx-h2">
                  Real stack, <em>shipped on every project.</em>
                </h2>
              </div>
              <p className="ndx-about-stack-head__lead">
                We use the same stack on the small builds and the big ones. Boring choices for the parts that
                don&apos;t matter; the right tool for the parts that do — with AI in the toolchain, not the pitch.
              </p>
            </div>
            <div className="ndx-about-stack">
              {stackPillars.map((col) => (
                <article key={col.title} className="ndx-about-stack__card">
                  <div className="ndx-about-stack__icons" aria-hidden>
                    {col.icons.map((icon) => (
                      <span key={icon} className="ndx-about-stack__icon">
                        <i className={`bx ${icon}`} />
                      </span>
                    ))}
                  </div>
                  <h3>{col.title}</h3>
                  <p className="ndx-about-stack__subtitle">{col.subtitle}</p>
                  <ul>
                    {col.items.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <div className="ndx-rich-actions ndx-about-stack-actions">
              <Link to="/technologies" className="ndx-btn">
                View technologies
              </Link>
              <Link to="/estimate" className="ndx-btn ndx-btn-primary">
                Get AI estimate
              </Link>
            </div>
          </div>

          {/* FAQ teaser */}
          <div className="ndx-rich-block ndx-about-faq" style={{ marginTop: "3rem" }}>
            <p className="ndx-rich-pill ndx-rich-pill--minimal">
              <span className="ndx-rich-pill-dot" aria-hidden />
              FAQ
            </p>
            <h2 className="ndx-about-faq__heading">
              Read these before you <em>book a call.</em>
            </h2>
            <p className="ndx-about-faq__sub">
              Straight answers on location, team size, AI-first delivery, pricing, and ownership — then jump to
              the full FAQ if you need more.
            </p>
            <div className="ndx-about-faq__stack">
              <FaqAccordion items={ABOUT_FAQ_TEASER} />
            </div>
            <p className="ndx-about-faq__more-wrap">
              <Link to="/faq" className="ndx-about-faq-more">
                Browse all FAQs →
              </Link>
            </p>
          </div>

          {/* Dual CTA */}
          <div className="ndx-about-cta-duo">
            <motion.article
              className="ndx-about-cta-card ndx-about-cta-card--primary"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: reduced ? 0 : 0.45 }}
            >
              <p className="ndx-about-cta-card__eyebrow">Ready to ship?</p>
              <h2 className="ndx-about-cta-card__title">
                Ready to ship something that ends with code in production?
              </h2>
              <BookCallButton className="ndx-about-cta-card__btn ndx-about-cta-card__btn--solid">Book a call →</BookCallButton>
            </motion.article>

            <motion.article
              className="ndx-about-cta-card ndx-about-cta-card--secondary"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.08 }}
            >
              <p className="ndx-about-cta-card__eyebrow">Not ready to talk?</p>
              <h2 className="ndx-about-cta-card__title">
                Get in touch with the founder, or run our AI Estimate tool first.
              </h2>
              <Link to="/estimate" className="ndx-about-cta-card__btn ndx-about-cta-card__btn--ghost">
                Get AI Estimate →
              </Link>
            </motion.article>
          </div>
        </div>
      </section>
    </>
  );
}
