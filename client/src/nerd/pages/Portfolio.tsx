import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Seo from "../seo/Seo";
import { ORGANIZATION_GRAPH_ID, SITE_URL } from "../seo/siteSeo";
import { STATIC_PUBLIC_PAGES_SEO } from "../seo/staticPublicPagesSeo.js";
import { capDescription, metaTitleFromPublicBrief } from "../seo/seoFromData";
import projects, { type Project } from "../data/projects";
import portfolioVideo from "../../assets/BalochDevLogo/portfolio.mp4";
import AiEstimatePromo from "../components/AiEstimatePromo";

/* ─── Static data ────────────────────────────────────────────────────────── */

const filters = [
  { id: "all",       label: "All projects" },
  { id: "client",    label: "Client delivery" },
  { id: "partner",   label: "Partner" },
  { id: "balochdev", label: "BalochDev" },
] as const;

const PORT_SEO = STATIC_PUBLIC_PAGES_SEO["/portfolio"];

const catLabel: Record<Project["category"], string> = {
  client:    "Client delivery",
  partner:   "Partner",
  balochdev: "BalochDev",
};

const process = [
  {
    num: "01",
    title: "Discovery & scoping",
    body: "We start with a focused call to understand your goals, constraints, and budget. We map the scope, identify risks, and produce a fixed-milestone plan — no surprises.",
  },
  {
    num: "02",
    title: "Design & prototype",
    body: "UI/UX mockups before a line of code is written. You review and approve every screen, so the build phase has zero ambiguity about what we are shipping.",
  },
  {
    num: "03",
    title: "Build in milestones",
    body: "We build in short, reviewable milestones with weekly demos. Code lives in your repository from day one. Staging environments are set up before anything reaches production.",
  },
  {
    num: "04",
    title: "Launch & handover",
    body: "We handle deployment, run pre-launch checks, and hand over full documentation, access credentials, and repo ownership. Post-launch support included.",
  },
];

const techCategories = [
  {
    label: "Frontend",
    items: ["React 18", "Next.js", "TypeScript", "Tailwind CSS", "Vite", "Redux Toolkit", "Framer Motion"],
  },
  {
    label: "Mobile",
    items: ["Flutter", "React Native", "Dart", "Expo", "Firebase Cloud Messaging"],
  },
  {
    label: "Backend & Database",
    items: ["Node.js", "Express.js", "Firebase", "Firestore", "Supabase", "PostgreSQL"],
  },
  {
    label: "Cloud & DevOps",
    items: ["Firebase Hosting", "Cloud Functions", "Cloudflare Workers", "GitHub Actions", "Vercel"],
  },
  {
    label: "Integrations & AI",
    items: ["Telegram Bot API", "Google Sheets API", "Stripe", "OpenAI", "Claude (Anthropic)"],
  },
  {
    label: "Auth & Security",
    items: ["Firebase Auth", "RBAC", "JWT", "OAuth 2.0", "Supabase Auth"],
  },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function ProjectCard({
  p,
  i,
  reduced,
  layout = "card",
}: {
  p: Project;
  i: number;
  reduced: boolean | null;
  layout?: "card" | "hero";
}) {
  const isComingSoon = !p.slug;
  const isHero = layout === "hero";

  return (
    <motion.div
      className="ndx-card"
      style={{
        padding: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: isHero ? "row" : "column",
        flexWrap: isHero ? "wrap" : undefined,
        position: "relative",
        gridColumn: isHero ? "1 / -1" : undefined,
      }}
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.42, delay: reduced ? 0 : 0.05 * i }}
    >
      {/* Cover image / placeholder */}
      <div
        style={{
          width: isHero ? "min(100%, 50%)" : "100%",
          flex: isHero ? "1 1 420px" : undefined,
          aspectRatio: isHero ? "16 / 10" : "16 / 9",
          minHeight: isHero ? 260 : undefined,
          maxHeight: isHero ? 360 : undefined,
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
          display: isHero ? "flex" : undefined,
          alignItems: isHero ? "center" : undefined,
          justifyContent: isHero ? "center" : undefined,
          padding: isHero ? "1.15rem 1.05rem" : undefined,
          background: p.cover
            ? isHero
              ? "var(--ndx-bg-elev)"
              : "transparent"
            : "linear-gradient(135deg, rgba(100,116,139,0.08) 0%, rgba(100,116,139,0.04) 100%)",
        }}
      >
        {p.cover ? (
          <img
            src={p.cover}
            alt={p.title}
            loading="lazy"
            style={{
              width: "100%",
              height: isHero ? "auto" : "100%",
              maxHeight: isHero ? 320 : undefined,
              objectFit: isHero ? "contain" : "cover",
              display: "block",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
            {/* subtle nested squares inside placeholder */}
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden style={{ opacity: 0.15 }}>
              <rect x="1" y="1" width="50" height="50" stroke="currentColor" strokeWidth="1" style={{ color: "var(--ndx-accent)" }} />
              <rect x="9" y="9" width="34" height="34" stroke="currentColor" strokeWidth="1" style={{ color: "var(--ndx-accent)" }} />
              <rect x="17" y="17" width="18" height="18" stroke="currentColor" strokeWidth="1" style={{ color: "var(--ndx-accent)" }} />
            </svg>
            <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ndx-dim)", fontFamily: "var(--ndx-font-mono)" }}>
              Coming soon
            </span>
          </div>
        )}

      </div>

      {/* Body */}
      <div
        style={{
          padding: isHero ? "1.5rem 1.6rem 1.6rem" : "0.85rem 1.1rem 1.2rem",
          flex: isHero ? "1 1 420px" : 1,
          display: "flex",
          flexDirection: "column",
          minWidth: isHero ? "min(100%, 320px)" : undefined,
          justifyContent: isHero ? "center" : undefined,
        }}
      >

        {/* Badges row — below the image, no overlap */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.6rem", alignItems: "center" }}>
          {isHero && (
            <span style={{
              fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              background: "color-mix(in srgb, var(--ndx-accent) 12%, transparent)",
              border: "1px solid color-mix(in srgb, var(--ndx-accent) 35%, var(--ndx-border))",
              borderRadius: 999, padding: "0.2rem 0.6rem", color: "var(--ndx-accent)",
              fontFamily: "var(--ndx-font-mono)",
            }}>
              Featured
            </span>
          )}
          <span style={{
            fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            border: "1px solid var(--ndx-border)", borderRadius: 999,
            padding: "0.2rem 0.6rem", color: "var(--ndx-accent)", fontFamily: "var(--ndx-font-mono)",
          }}>
            {catLabel[p.category]}
          </span>
          {p.underDevelopment && (
            <span style={{
              fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.40)",
              borderRadius: 999, padding: "0.2rem 0.6rem", color: "#d97706",
              fontFamily: "var(--ndx-font-mono)", display: "flex", alignItems: "center", gap: "0.3rem",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#d97706", flexShrink: 0 }} />
              Under development
            </span>
          )}
          {!p.underDevelopment && p.live && (
            <span style={{
              fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.35)",
              borderRadius: 999, padding: "0.2rem 0.6rem", color: "#22c55e",
              fontFamily: "var(--ndx-font-mono)", display: "flex", alignItems: "center", gap: "0.3rem",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
              Live
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
          <span style={{ fontSize: "0.68rem", color: "var(--ndx-muted)", fontFamily: "var(--ndx-font-mono)", letterSpacing: "0.04em" }}>
            {p.industry}
          </span>
          {p.year && (
            <>
              <span style={{ color: "var(--ndx-dim)", fontSize: "0.68rem" }}>·</span>
              <span style={{ fontSize: "0.68rem", color: "var(--ndx-dim)", fontFamily: "var(--ndx-font-mono)" }}>{p.year}</span>
            </>
          )}
        </div>

        <h3 style={{
          fontSize: isHero ? "1.5rem" : "1rem",
          fontWeight: 700,
          color: "var(--ndx-text)",
          marginBottom: "0.4rem",
          lineHeight: 1.3,
        }}>
          {p.title}
        </h3>

        <p style={{
          fontSize: isHero ? "0.95rem" : "0.8125rem",
          color: "var(--ndx-muted)",
          lineHeight: 1.7,
          flex: 1,
          marginBottom: "0.9rem",
          maxWidth: isHero ? "58ch" : undefined,
        }}>
          {isHero
            ? p.tagline
            : p.tagline.length > 130
              ? p.tagline.slice(0, 130) + "…"
              : p.tagline}
        </p>

        {/* Stack pills */}
        {p.stack && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.9rem" }}>
            {p.stack.slice(0, 4).map((s) => (
              <span key={s} style={{
                fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.05em",
                background: "color-mix(in srgb, var(--ndx-accent) 8%, var(--ndx-bg-elev))",
                border: "1px solid color-mix(in srgb, var(--ndx-accent) 18%, var(--ndx-border))",
                borderRadius: 4, padding: "0.15rem 0.45rem",
                color: "var(--ndx-accent)", fontFamily: "var(--ndx-font-mono)",
              }}>
                {s}
              </span>
            ))}
            {p.stack.length > 4 && (
              <span style={{ fontSize: "0.62rem", color: "var(--ndx-dim)", fontFamily: "var(--ndx-font-mono)", padding: "0.15rem 0.3rem" }}>
                +{p.stack.length - 4}
              </span>
            )}
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", alignItems: "center", marginTop: "auto" }}>
          {p.slug ? (
            <Link to={`/projects/${p.slug}`} className="ndx-btn ndx-btn-primary" style={{ fontSize: "0.8125rem", alignSelf: "flex-start" }}>
              View case study →
            </Link>
          ) : (
            <span style={{ fontSize: "0.72rem", color: "var(--ndx-dim)", fontFamily: "var(--ndx-font-mono)", letterSpacing: "0.06em" }}>
              Case study coming soon
            </span>
          )}
          {p.liveUrl && (
            <a
              href={p.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ndx-btn"
              style={{ fontSize: "0.8125rem" }}
            >
              Open live preview →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function PortfolioPage() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.category === active)),
    [active],
  );

  const featuredHero = useMemo(
    () => filtered.filter((p) => p.featuredHero),
    [filtered],
  );

  const gridProjects = useMemo(
    () => filtered.filter((p) => !p.featuredHero),
    [filtered],
  );

  const seoTitle = useMemo(() => metaTitleFromPublicBrief(PORT_SEO.metaTitle), []);

  const seoDescription = useMemo(() => capDescription(PORT_SEO.metaDescription), []);

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: seoTitle,
      description: seoDescription,
      url: `${SITE_URL}${PORT_SEO.canonicalPath}`,
      author: { "@id": ORGANIZATION_GRAPH_ID },
    }),
    [seoTitle, seoDescription],
  );

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        canonicalPath={PORT_SEO.canonicalPath}
        jsonLd={jsonLd}
      />
      <section className="ndx-section ndx-page-rich ndx-page-rich--apps" style={{ paddingTop: "1.65rem", paddingBottom: "3rem" }}>
      <div className="ndx-container">

        {/* ── Eyebrow ─────────────────────────────────────────────────── */}
        <motion.div
          className="ndx-rich-pill ndx-rich-pill--minimal"
          initial={reduced ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.5 }}
        >
          <span className="ndx-rich-pill-dot" aria-hidden />
          BD · Portfolio · {projects.filter((p) => p.live).length} live · {projects.length} total
        </motion.div>

        {/* ── Hero panel ───────────────────────────────────────────────── */}
        <div className="ndx-rich-hero">
          {/* Left — copy */}
          <div className="ndx-rich-hero__copy">
            <motion.h1 className="ndx-h1" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.55 }}>
              Work we're <em>proud of.</em>
            </motion.h1>
            <motion.p className="ndx-lead" style={{ maxWidth: "52ch" }} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.07 }}>
              Client deliveries, partner language-technology initiatives, and internal BalochDev products — all shipped, all in production. Honest case studies with measurable outcomes.
            </motion.p>
            <motion.div className="ndx-rich-actions" initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.14 }}>
              <Link to="/proposal" className="ndx-btn ndx-btn-primary">Start a project →</Link>
              <Link to="/estimate" className="ndx-btn">AI estimate</Link>
            </motion.div>
          </div>

          {/* Right — video */}
          <motion.div
            className="ndx-rich-hero__viz"
            initial={reduced ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.1 }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              style={{
                width: "100%",
                height: "100%",
                maxHeight: "min(85vh, 760px)",
                objectFit: "cover",
                borderRadius: "var(--ndx-radius-lg)",
                display: "block",
                pointerEvents: "none",
              }}
            >
              <source src={portfolioVideo} type="video/mp4" />
            </video>
          </motion.div>

          {/* Bottom stats row — spans both columns */}
          <motion.div
            className="ndx-portfolio-stats"
            style={{
              gridColumn: "1 / -1",
              borderTop: "1px solid var(--ndx-border)",
              paddingTop: "1.25rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0",
            }}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.22 }}
          >
            {[
              { v: projects.filter((p) => p.live).length + "+", l: "Live projects",    s: "In production today" },
              { v: "1.5mo",                                      l: "Avg. delivery",   s: "MVP to production" },
              { v: "3+",                                         l: "Industries",       s: "Hospitality · EdTech · Logistics" },
              { v: "100%",                                       l: "Client ownership", s: "Code in your repo from day one" },
            ].map((stat, i, arr) => (
              <div
                key={stat.l}
                className="ndx-portfolio-stats__item"
                style={{
                  flex: "1 1 140px",
                  textAlign: "center",
                  padding: "0 1rem 0.25rem",
                  borderRight: i < arr.length - 1 ? "1px solid var(--ndx-border)" : "none",
                }}
              >
                <p className="ndx-portfolio-stats__value" style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--ndx-accent)", lineHeight: 1, marginBottom: "0.2rem" }}>
                  {stat.v}
                </p>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--ndx-text)", marginBottom: "0.15rem" }}>{stat.l}</p>
                <p style={{ fontSize: "0.7rem", color: "var(--ndx-muted)", lineHeight: 1.4 }}>{stat.s}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Filter + project grid ────────────────────────────────────── */}
        <div className="ndx-rich-block" style={{ borderTop: "none", paddingTop: 0, marginTop: "1.75rem" }}>
          <div className="ndx-portfolio-filters" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--ndx-muted)", fontFamily: "var(--ndx-font-sans)", marginRight: "0.25rem" }}>Filter:</span>
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActive(f.id)}
                style={{
                  fontSize: "0.8125rem", fontWeight: 600, fontFamily: "var(--ndx-font-sans)",
                  padding: "0.45rem 1.05rem", borderRadius: 999, border: "1px solid", cursor: "pointer", transition: "all 0.18s",
                  background: active === f.id ? "var(--ndx-accent)" : "transparent",
                  borderColor: active === f.id ? "var(--ndx-accent)" : "var(--ndx-border)",
                  color: active === f.id ? "#fff" : "var(--ndx-muted)",
                }}
              >
                {f.label}
                <span style={{ marginLeft: "0.4rem", fontSize: "0.7rem", opacity: 0.7, fontFamily: "var(--ndx-font-mono)" }}>
                  {f.id === "all" ? projects.length : projects.filter((p) => p.category === f.id).length}
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {featuredHero.map((p, i) => (
              <ProjectCard key={p.slug ?? p.title} p={p} i={i} reduced={reduced} layout="hero" />
            ))}
            <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 480px), 1fr))" }}>
              {gridProjects.map((p, i) => (
                <ProjectCard key={p.slug ?? p.title} p={p} i={i + featuredHero.length} reduced={reduced} />
              ))}
            </div>
          </div>
        </div>

        <AiEstimatePromo />

        {/* ── How we deliver ───────────────────────────────────────────── */}
        <div className="ndx-rich-block ndx-glass-section" style={{ marginTop: "3rem" }}>
          <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1.1rem" }}>
            <span className="ndx-rich-pill-dot" aria-hidden />
            Our process
          </p>
          <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "0.65rem" }}>
            How every project <em>gets shipped.</em>
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--ndx-muted)", maxWidth: "46rem", marginBottom: "1.75rem", lineHeight: 1.65 }}>
            The same four-phase approach on every engagement — whether it is a one-month MVP or a six-month production platform. No surprises, no scope creep, no mystery invoices.
          </p>
          <div className="ndx-portfolio-process-grid">
            {process.map((step, i) => (
              <motion.div
                key={step.num}
                className="ndx-card"
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.38, delay: reduced ? 0 : 0.08 * i }}
              >
                <p style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.12em", color: "var(--ndx-accent)", fontFamily: "var(--ndx-font-mono)", marginBottom: "0.5rem" }}>
                  {step.num}
                </p>
                <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--ndx-text)", marginBottom: "0.5rem" }}>{step.title}</h3>
                <p style={{ fontSize: "0.8125rem", color: "var(--ndx-muted)", lineHeight: 1.65 }}>{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Technologies we use ──────────────────────────────────────── */}
        <div className="ndx-rich-block">
          <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1.1rem" }}>
            <span className="ndx-rich-pill-dot" aria-hidden />
            Technology stack
          </p>
          <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "0.65rem" }}>
            What we build <em>with.</em>
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--ndx-muted)", maxWidth: "46rem", marginBottom: "1.75rem", lineHeight: 1.65 }}>
            Modern, production-proven tools — the same stack on small builds and large ones. No technology is added to a pitch deck without being used in production.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {techCategories.map((cat, i) => (
              <motion.div
                key={cat.label}
                className="ndx-card"
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.38, delay: reduced ? 0 : 0.06 * i }}
              >
                <p style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ndx-accent)", fontFamily: "var(--ndx-font-mono)", marginBottom: "0.65rem" }}>
                  {cat.label}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  {cat.items.map((item) => (
                    <span key={item} style={{
                      fontSize: "0.72rem", fontWeight: 500,
                      background: "color-mix(in srgb, var(--ndx-bg) 60%, var(--ndx-bg-elev))",
                      border: "1px solid var(--ndx-border)",
                      borderRadius: 4, padding: "0.15rem 0.45rem",
                      color: "var(--ndx-text)",
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Why clients choose us ────────────────────────────────────── */}
        <div className="ndx-rich-block">
          <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1.1rem" }}>
            <span className="ndx-rich-pill-dot" aria-hidden />
            Why BalochDev
          </p>
          <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "1.5rem" }}>
            What makes us <em>different.</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {[
              {
                title: "Cost-optimised by default",
                body: "We analyse your infrastructure before we write a line. The ManGo restaurant system runs at under $1/month on Firebase's free tier — without compromising reliability or features.",
              },
              {
                title: "You own everything, always",
                body: "Code lives in your GitHub from the first commit. We sign no NDAs to retain access, we carry no licensing claims, and we hand over all credentials at handoff.",
              },
              {
                title: "Senior engineers, not outsourcing",
                body: "The developers you meet in the kickoff call are the ones writing code on week six. No shuffling to a junior bench mid-project.",
              },
              {
                title: "Mission-driven team",
                body: "Alongside client work, we are actively advancing Balochi language technology — keyboards, browsers, AI models. That dual focus keeps our standards high.",
              },
              {
                title: "Integrations are a strength",
                body: "From Telegram bots and Google Sheets to Stripe and AI chatbots — we have shipped complex third-party integrations on every project. Nothing is left as an afterthought.",
              },
              {
                title: "Transparent from day one",
                body: "Fixed milestones, weekly demos, staging before production. Every deliverable is visible before it reaches you, and every invoice is agreed before it is raised.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="ndx-card"
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.38, delay: reduced ? 0 : 0.06 * i }}
              >
                <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--ndx-text)", marginBottom: "0.5rem" }}>{item.title}</h3>
                <p style={{ fontSize: "0.8125rem", color: "var(--ndx-muted)", lineHeight: 1.65 }}>{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <div
          className="ndx-rich-block ndx-glass-section"
          style={{ marginTop: "3rem", textAlign: "center" }}
        >
          <h2 className="ndx-h2" style={{ maxWidth: "38rem", margin: "0 auto 0.7rem" }}>
            Have a project in mind?
          </h2>
          <p className="ndx-group-sub" style={{ maxWidth: "36rem", margin: "0 auto 1.6rem" }}>
            Tell us what you need to build. We will tell you honestly whether we are the right team — and what it would realistically take.
          </p>
          <div className="ndx-rich-actions" style={{ justifyContent: "center" }}>
            <Link to="/proposal" className="ndx-btn ndx-btn-primary">Send a proposal</Link>
            <Link to="/estimate" className="ndx-btn">AI estimate</Link>
            <Link to="/contact" className="ndx-btn">Get in touch</Link>
          </div>
        </div>

      </div>
    </section>
    </>
  );
}
