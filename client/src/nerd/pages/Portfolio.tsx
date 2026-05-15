import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { usePageMeta } from "../hooks/usePageMeta";
import projects, { type Project } from "../data/projects";

/* ─── Filter config ──────────────────────────────────────────────────────── */

const filters = [
  { id: "all", label: "All projects" },
  { id: "client", label: "Client delivery" },
  { id: "partner", label: "Partner" },
  { id: "balochdev", label: "BalochDev" },
] as const;

const catLabel: Record<Project["category"], string> = {
  client: "Client delivery",
  partner: "Partner",
  balochdev: "BalochDev",
};

/* ─── Card ───────────────────────────────────────────────────────────────── */

function ProjectCard({ p, i, reduced }: { p: Project; i: number; reduced: boolean | null }) {
  const isComingSoon = !p.slug;

  return (
    <motion.div
      className="ndx-card"
      style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.42, delay: reduced ? 0 : 0.05 * i }}
    >
      {/* Cover image or placeholder */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
          background: isComingSoon
            ? "linear-gradient(135deg, rgba(100,116,139,0.08) 0%, rgba(100,116,139,0.04) 100%)"
            : "var(--ndx-bg-elev)",
        }}
      >
        {p.cover ? (
          <img
            src={p.cover}
            alt={p.title}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--ndx-dim)",
                fontFamily: "var(--ndx-font-mono)",
              }}
            >
              Coming soon
            </span>
          </div>
        )}

        {/* Category badge */}
        <span
          style={{
            position: "absolute",
            top: "0.65rem",
            left: "0.65rem",
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "color-mix(in srgb, var(--ndx-bg) 85%, transparent)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--ndx-border)",
            borderRadius: 999,
            padding: "0.2rem 0.6rem",
            color: "var(--ndx-accent)",
            fontFamily: "var(--ndx-font-mono)",
          }}
        >
          {catLabel[p.category]}
        </span>

        {p.live && (
          <span
            style={{
              position: "absolute",
              top: "0.65rem",
              right: "0.65rem",
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "color-mix(in srgb, #22c55e 15%, transparent)",
              border: "1px solid color-mix(in srgb, #22c55e 40%, transparent)",
              borderRadius: 999,
              padding: "0.2rem 0.6rem",
              color: "#22c55e",
              fontFamily: "var(--ndx-font-mono)",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
            Live
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "1rem 1.1rem 1.2rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
          <span
            style={{
              fontSize: "0.68rem",
              color: "var(--ndx-muted)",
              fontFamily: "var(--ndx-font-mono)",
              letterSpacing: "0.04em",
            }}
          >
            {p.industry}
          </span>
          {p.year && (
            <>
              <span style={{ color: "var(--ndx-dim)", fontSize: "0.68rem" }}>·</span>
              <span style={{ fontSize: "0.68rem", color: "var(--ndx-dim)", fontFamily: "var(--ndx-font-mono)" }}>
                {p.year}
              </span>
            </>
          )}
        </div>

        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--ndx-text)",
            marginBottom: "0.4rem",
            lineHeight: 1.3,
          }}
        >
          {p.title}
        </h3>

        <p style={{ fontSize: "0.8125rem", color: "var(--ndx-muted)", lineHeight: 1.6, flex: 1, marginBottom: "0.9rem" }}>
          {p.tagline}
        </p>

        {/* Stack pills */}
        {p.stack && p.stack.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.9rem" }}>
            {p.stack.slice(0, 4).map((s) => (
              <span
                key={s}
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  background: "color-mix(in srgb, var(--ndx-accent) 8%, var(--ndx-bg-elev))",
                  border: "1px solid color-mix(in srgb, var(--ndx-accent) 18%, var(--ndx-border))",
                  borderRadius: 4,
                  padding: "0.15rem 0.45rem",
                  color: "var(--ndx-accent)",
                  fontFamily: "var(--ndx-font-mono)",
                }}
              >
                {s}
              </span>
            ))}
            {p.stack.length > 4 && (
              <span
                style={{
                  fontSize: "0.62rem",
                  color: "var(--ndx-dim)",
                  fontFamily: "var(--ndx-font-mono)",
                  padding: "0.15rem 0.3rem",
                }}
              >
                +{p.stack.length - 4}
              </span>
            )}
          </div>
        )}

        {p.slug ? (
          <Link
            to={`/projects/${p.slug}`}
            className="ndx-btn ndx-btn-primary"
            style={{ fontSize: "0.8125rem", alignSelf: "flex-start" }}
          >
            View case study →
          </Link>
        ) : (
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--ndx-dim)",
              fontFamily: "var(--ndx-font-mono)",
              letterSpacing: "0.06em",
            }}
          >
            Case study coming soon
          </span>
        )}
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

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Portfolio — BalochDev",
      description:
        "BalochDev project portfolio: client delivery, partner language technology initiatives, and internal BalochDev products.",
      url: "https://balochdev.com/portfolio",
    }),
    [],
  );

  usePageMeta({
    title: "Portfolio — BalochDev",
    description:
      "Explore BalochDev's shipped projects: restaurant management systems, mobile apps, e-commerce platforms, and Balochi language technology — real case studies with real results.",
    path: "/portfolio",
    jsonLd,
  });

  return (
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

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <div className="ndx-rich-hero">
          <div className="ndx-rich-hero__copy">
            <motion.h1
              className="ndx-h1"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.55 }}
            >
              Work we're <em>proud of.</em>
            </motion.h1>
            <motion.p
              className="ndx-lead"
              style={{ maxWidth: "52ch" }}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.07 }}
            >
              Client deliveries, partner language technology, and internal BalochDev products — all shipped, all in production.
              Real case studies with real results.
            </motion.p>
            <motion.div
              className="ndx-rich-actions"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.14 }}
            >
              <Link to="/proposal" className="ndx-btn ndx-btn-primary">Start a project →</Link>
              <Link to="/contact" className="ndx-btn">Get in touch</Link>
            </motion.div>
          </div>

          {/* Right — stats */}
          <motion.div
            className="ndx-rich-hero__viz"
            style={{ alignItems: "stretch" }}
            initial={reduced ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.1 }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", width: "100%" }}>
              {[
                { v: projects.filter((p) => p.live).length + "+", l: "Live projects", s: "In production today" },
                { v: "1.5mo", l: "Avg. delivery", s: "MVP to production" },
                { v: "3+", l: "Industries", s: "Hospitality, EdTech, Logistics" },
                { v: "100%", l: "Client ownership", s: "Code in your repo from day one" },
              ].map((s) => (
                <div key={s.l} className="ndx-card" style={{ padding: "1.1rem 0.9rem", textAlign: "center" }}>
                  <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--ndx-accent)", lineHeight: 1, marginBottom: "0.25rem", fontFamily: "var(--ndx-font-sans)" }}>
                    {s.v}
                  </p>
                  <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ndx-text)", marginBottom: "0.15rem" }}>{s.l}</p>
                  <p style={{ fontSize: "0.68rem", color: "var(--ndx-muted)", lineHeight: 1.4 }}>{s.s}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Filter tabs ──────────────────────────────────────────────── */}
        <div
          className="ndx-rich-block"
          style={{ borderTop: "1px solid var(--ndx-border)", paddingTop: "2rem", marginTop: "2rem" }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActive(f.id)}
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  fontFamily: "var(--ndx-font-sans)",
                  padding: "0.45rem 1.05rem",
                  borderRadius: 999,
                  border: "1px solid",
                  cursor: "pointer",
                  transition: "all 0.18s",
                  background: active === f.id ? "var(--ndx-accent)" : "transparent",
                  borderColor: active === f.id ? "var(--ndx-accent)" : "var(--ndx-border)",
                  color: active === f.id ? "#fff" : "var(--ndx-muted)",
                }}
              >
                {f.label}
                <span
                  style={{
                    marginLeft: "0.4rem",
                    fontSize: "0.7rem",
                    opacity: 0.7,
                    fontFamily: "var(--ndx-font-mono)",
                  }}
                >
                  {f.id === "all" ? projects.length : projects.filter((p) => p.category === f.id).length}
                </span>
              </button>
            ))}
          </div>

          {/* ── Project grid ─────────────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gap: "1.25rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            }}
          >
            {filtered.map((p, i) => (
              <ProjectCard key={p.slug ?? p.title} p={p} i={i} reduced={reduced} />
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <div
          className="ndx-rich-block"
          style={{ textAlign: "center", borderTop: "1px solid var(--ndx-border)", paddingTop: "2.5rem", marginTop: "3rem" }}
        >
          <h2 className="ndx-h2" style={{ maxWidth: "36rem", margin: "0 auto 0.65rem" }}>
            Have a project in mind?
          </h2>
          <p className="ndx-group-sub" style={{ maxWidth: "34rem", margin: "0 auto 1.5rem" }}>
            Tell us what you want to build — we will tell you honestly whether we are the right fit and what it would take.
          </p>
          <div className="ndx-rich-actions" style={{ justifyContent: "center" }}>
            <Link to="/proposal" className="ndx-btn ndx-btn-primary">Send a proposal</Link>
            <Link to="/estimate" className="ndx-btn">AI estimate</Link>
          </div>
        </div>

      </div>
    </section>
  );
}
