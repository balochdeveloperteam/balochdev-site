import { useState, useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import projects from "../data/projects";
import { initialsFromName, reviewsForProject } from "../data/projectReviews";
import Seo from "../seo/Seo";
import { SITE_URL } from "../seo/siteSeo";
import { capDescription, capTitle } from "../seo/seoFromData";

/* ─── Image carousel ─────────────────────────────────────────────────────── */

function Carousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div className="ndx-project-carousel">
      {images.length > 1 &&
        ([
          { fn: prev, side: "left" as const, label: "Previous", icon: "‹" },
          { fn: next, side: "right" as const, label: "Next", icon: "›" },
        ] as const).map(({ fn, side, label, icon }) => (
          <button
            key={side}
            type="button"
            onClick={fn}
            aria-label={`${label} screenshot`}
            className="ndx-project-carousel__nav"
            style={{
              position: "absolute",
              [side]: 4,
              top: "50%",
              transform: "translateY(-50%)",
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1px solid var(--ndx-border)",
              background: "var(--ndx-bg-elev)",
              color: "var(--ndx-text)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
              zIndex: 3,
              lineHeight: 1,
            }}
          >
            {icon}
          </button>
        ))}

      <div
        style={{
          position: "relative",
          width: "100%",
          borderRadius: "var(--ndx-radius-lg)",
          overflow: "hidden",
          background: "var(--ndx-bg-elev)",
          aspectRatio: "16 / 9",
          border: "1px solid var(--ndx-border)",
        }}
      >
        {/* Slides */}
        {images.map((src, i) => (
          <div
            key={src}
            style={{
              position: "absolute",
              inset: 0,
              opacity: i === idx ? 1 : 0,
              transition: "opacity 0.42s ease",
              pointerEvents: i === idx ? "auto" : "none",
            }}
          >
            <img
              src={src}
              alt={`Screenshot ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        ))}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "0.75rem",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "0.35rem",
              zIndex: 3,
            }}
          >
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Screenshot ${i + 1}`}
                style={{
                  width: i === idx ? 20 : 7,
                  height: 7,
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  background: i === idx ? "var(--ndx-accent)" : "rgba(0,0,0,0.22)",
                  transition: "all 0.22s",
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}

        {/* Slide counter */}
        <span
          style={{
            position: "absolute",
            top: "0.65rem",
            right: "0.75rem",
            fontSize: "0.65rem",
            fontFamily: "var(--ndx-font-mono)",
            fontWeight: 700,
            color: "rgba(0,0,0,0.55)",
            background: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(6px)",
            borderRadius: 999,
            padding: "0.18rem 0.55rem",
            zIndex: 3,
          }}
        >
          {idx + 1} / {images.length}
        </span>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const reduced = useReducedMotion();

  const project = useMemo(() => projects.find((p) => p.slug === slug) ?? null, [slug]);

  const seoHead = useMemo(() => {
    if (!project || !project.slug) return null;
    const named = project as (typeof project) & { name?: string };
    const recordName = typeof named.name === "string" ? named.name.trim() : "";
    const displayName = recordName || (typeof project.title === "string" ? project.title.trim() : "");
    if (!displayName) return null;
    const title = capTitle(`${displayName} — Project | BalochDev`, 60);
    const descRaw =
      (typeof project.seoDescription === "string" && project.seoDescription.trim()) ||
      (typeof project.tagline === "string" && project.tagline.trim()) ||
      "";
    if (!descRaw) return null;
    const description = capDescription(descRaw, 155);
    const canonicalPath = `/projects/${project.slug}`;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: displayName,
      url: `${SITE_URL}${canonicalPath}`,
      description,
    };
    return { title, description, canonicalPath, jsonLd };
  }, [project]);

  if (!project) return <Navigate to="/portfolio" replace />;

  const clientReviews = reviewsForProject(project.slug);

  return (
    <section className="ndx-section ndx-page-rich ndx-page-rich--apps" style={{ paddingTop: "1.65rem", paddingBottom: "3.5rem" }}>
      {seoHead ? (
        <Seo title={seoHead.title} description={seoHead.description} canonicalPath={seoHead.canonicalPath} jsonLd={seoHead.jsonLd} />
      ) : null}
      <div className="ndx-container">

        {/* ── Back ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: "1.25rem" }}
        >
          <Link
            to="/portfolio"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.8125rem",
              color: "var(--ndx-muted)",
              textDecoration: "none",
              fontFamily: "var(--ndx-font-sans)",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--ndx-text)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--ndx-muted)")}
          >
            ← All projects
          </Link>
        </motion.div>

        {/* ── Hero panel ───────────────────────────────────────────────── */}
        <div className="ndx-rich-hero">
          <div className="ndx-rich-hero__copy">
            <div className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1rem" }}>
              <span className="ndx-rich-pill-dot" aria-hidden />
              {project.industry} · {project.year}
            </div>

            <motion.h1
              className="ndx-h1"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.55 }}
            >
              {project.title}
            </motion.h1>

            <motion.p
              className="ndx-lead"
              style={{ maxWidth: "52ch" }}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.07 }}
            >
              {project.tagline}
            </motion.p>

            {/* Meta strip */}
            <motion.div
              style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: "1.35rem" }}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.14 }}
            >
              {[
                { label: "Year", value: project.year },
                ...(project.duration ? [{ label: "Delivered in", value: project.duration }] : []),
                ...(project.clientLocation ? [{ label: "Client region", value: project.clientLocation }] : []),
                { label: "Category", value: project.industry },
              ].map((m) => (
                <div key={m.label}>
                  <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ndx-dim)", fontFamily: "var(--ndx-font-mono)", marginBottom: "0.25rem" }}>
                    {m.label}
                  </p>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--ndx-text)" }}>{m.value}</p>
                </div>
              ))}

              {project.underDevelopment ? (
                <div>
                  <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ndx-dim)", fontFamily: "var(--ndx-font-mono)", marginBottom: "0.25rem" }}>Status</p>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#d97706", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#d97706", display: "inline-block" }} />
                    Under development
                  </p>
                </div>
              ) : project.live ? (
                <div>
                  <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ndx-dim)", fontFamily: "var(--ndx-font-mono)", marginBottom: "0.25rem" }}>Status</p>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#22c55e", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                    Live in production
                  </p>
                </div>
              ) : null}
            </motion.div>

            <motion.div
              className="ndx-rich-actions"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.22 }}
            >
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ndx-btn ndx-btn-primary"
                >
                  Open live preview →
                </a>
              ) : (
                <Link to="/proposal" className="ndx-btn ndx-btn-primary">Build something similar →</Link>
              )}
              {project.liveUrl ? (
                <Link to="/proposal" className="ndx-btn">Build something similar →</Link>
              ) : null}
              <Link to="/contact" className="ndx-btn">Get in touch</Link>
            </motion.div>
          </div>

          {/* Right — cover image */}
          {project.cover && (
            <motion.div
              className="ndx-rich-hero__viz"
              initial={reduced ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.08 }}
            >
              <div style={{ width: "100%", borderRadius: "var(--ndx-radius-lg)", overflow: "hidden", border: "1px solid var(--ndx-border)", background: "transparent" }}>
                <img
                  src={project.cover}
                  alt={project.title}
                  style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Screenshot carousel ──────────────────────────────────────── */}
        {project.images && project.images.length > 0 && (
          <div className="ndx-rich-block">
            <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1.25rem" }}>
              <span className="ndx-rich-pill-dot" aria-hidden />
              Screenshots &amp; previews
            </p>
            <h2 className="ndx-h2" style={{ maxWidth: "42rem", marginBottom: "1.5rem" }}>
              See it <em>in action.</em>
            </h2>
            <Carousel images={project.images} />
            <p style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "var(--ndx-dim)", fontFamily: "var(--ndx-font-mono)", textAlign: "center" }}>
              Use ‹ › or click the dots to browse · {project.images.length} screenshots
            </p>
          </div>
        )}

        {/* ── Image + text spotlight (one panel; gallery above stays as-is) ─ */}
        {(() => {
          const panel = project.caseStudyPanel ?? (
            project.images && project.images.length > 1 && project.challenge
              ? {
                  image: project.images[1],
                  heading: "Inside the product",
                  body: project.challenge.length > 340
                    ? `${project.challenge.slice(0, 340).trim()}…`
                    : project.challenge,
                }
              : null
          );
          if (!panel) return null;
          return (
            <div
              className="ndx-rich-block ndx-glass-section"
              style={{
                marginTop: "2.5rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                gap: "1.75rem",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  borderRadius: "var(--ndx-radius-lg)",
                  overflow: "hidden",
                  border: "1px solid var(--ndx-border)",
                  background: "var(--ndx-bg-elev)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.65rem",
                  minHeight: 200,
                }}
              >
                <img
                  src={panel.image}
                  alt=""
                  loading="lazy"
                  style={{
                    width: "100%",
                    maxHeight: 320,
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>
              <div>
                <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "0.85rem" }}>
                  <span className="ndx-rich-pill-dot" aria-hidden />
                  Case study
                </p>
                <h2 className="ndx-h2" style={{ maxWidth: "28rem", marginBottom: "0.85rem" }}>
                  {panel.heading}
                </h2>
                {panel.body.split(/\n\n+/).map((para, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: 1.75,
                      color: "var(--ndx-muted)",
                      margin: "0 0 0.85rem",
                      maxWidth: "40rem",
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ── The challenge ────────────────────────────────────────────── */}
        {project.challenge && (
          <div className="ndx-rich-block ndx-glass-section" style={{ marginTop: "3rem" }}>
            <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1rem" }}>
              <span className="ndx-rich-pill-dot" aria-hidden />
              The challenge
            </p>
            <h2 className="ndx-h2" style={{ maxWidth: "48rem", marginBottom: "1.15rem" }}>
              The problem we <em>set out to solve.</em>
            </h2>
            <p style={{ fontSize: "0.975rem", lineHeight: 1.8, color: "var(--ndx-muted)", maxWidth: "68rem" }}>
              {project.challenge}
            </p>
          </div>
        )}

        {/* ── What we built ────────────────────────────────────────────── */}
        {project.solution && project.solution.length > 0 && (
          <div className="ndx-rich-block">
            <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1rem" }}>
              <span className="ndx-rich-pill-dot" aria-hidden />
              The solution
            </p>
            <h2 className="ndx-h2" style={{ maxWidth: "48rem", marginBottom: "1.35rem" }}>
              How we <em>engineered it.</em>
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, maxWidth: "68rem" }}>
              {project.solution.map((item, i) => (
                <motion.li
                  key={i}
                  style={{
                    display: "flex",
                    gap: "0.85rem",
                    paddingBottom: "0.9rem",
                    marginBottom: "0.9rem",
                    borderBottom: i < project.solution!.length - 1 ? "1px solid var(--ndx-border)" : "none",
                    alignItems: "flex-start",
                  }}
                  initial={reduced ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.04 * i }}
                >
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      color: "var(--ndx-accent)",
                      fontFamily: "var(--ndx-font-mono)",
                      letterSpacing: "0.05em",
                      marginTop: "0.3rem",
                      flexShrink: 0,
                      minWidth: 28,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p style={{ fontSize: "0.9375rem", lineHeight: 1.72, color: "var(--ndx-muted)", margin: 0 }}>{item}</p>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Features ─────────────────────────────────────────────────── */}
        {project.features && project.features.length > 0 && (
          <div className="ndx-rich-block">
            <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1rem" }}>
              <span className="ndx-rich-pill-dot" aria-hidden />
              Features shipped
            </p>
            <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "1.5rem" }}>
              Every feature <em>in production.</em>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
              {project.features.map((f, i) => (
                <motion.div
                  key={f}
                  className="ndx-card"
                  style={{ padding: "0.85rem 1rem", display: "flex", gap: "0.65rem", alignItems: "flex-start" }}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.035 * i }}
                >
                  <span style={{ color: "var(--ndx-accent)", fontSize: "0.85rem", marginTop: "0.1em", flexShrink: 0, fontWeight: 700 }} aria-hidden>✓</span>
                  <span style={{ fontSize: "0.8125rem", color: "var(--ndx-text)", lineHeight: 1.5, fontWeight: 500 }}>{f}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tech stack ───────────────────────────────────────────────── */}
        {project.stack && project.stack.length > 0 && (
          <div className="ndx-rich-block">
            <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1rem" }}>
              <span className="ndx-rich-pill-dot" aria-hidden />
              {project.underDevelopment ? "Model" : "Technology stack"}
            </p>
            <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "0.65rem" }}>
              {project.underDevelopment ? (
                <>Powered by <em>a music LLM.</em></>
              ) : (
                <>Built with <em>the right tools.</em></>
              )}
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--ndx-muted)", maxWidth: "46rem", marginBottom: "1.35rem", lineHeight: 1.65 }}>
              {project.underDevelopment
                ? "Still under development — we are not listing a full engineering stack yet. The core is a large-level LLM model for music, built to generate in any language and excel where global tools fall short. Powered by BalochDev."
                : "Every technology was chosen deliberately — either to maximise performance, eliminate infrastructure cost, or accelerate delivery without compromising production quality."}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem" }}>
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="ndx-pill"
                  style={{ fontFamily: "var(--ndx-font-sans)", textTransform: "none", letterSpacing: "normal", fontSize: "0.8125rem", padding: "0.4rem 0.95rem" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Results ──────────────────────────────────────────────────── */}
        {project.results && project.results.length > 0 && (
          <div className="ndx-rich-block ndx-glass-section" style={{ marginTop: "3rem" }}>
            <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1rem" }}>
              <span className="ndx-rich-pill-dot" aria-hidden />
              Results
            </p>
            <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "1.25rem" }}>
              Outcomes that <em>speak for themselves.</em>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.75rem" }}>
              {project.results.map((r, i) => (
                <div
                  key={i}
                  className="ndx-card"
                  style={{ padding: "0.9rem 1rem", display: "flex", gap: "0.65rem", alignItems: "flex-start" }}
                >
                  <span style={{ color: "#22c55e", flexShrink: 0, fontWeight: 700, fontSize: "0.85rem", marginTop: "0.1em" }} aria-hidden>✓</span>
                  <span style={{ fontSize: "0.8125rem", color: "var(--ndx-text)", lineHeight: 1.55, fontWeight: 500 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Client stories (dummy until platform links) ─────────────── */}
        {clientReviews.length > 0 && (
          <div className="ndx-rich-block ndx-glass-section ndx-project-reviews" style={{ marginTop: "3rem" }}>
            <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1rem" }}>
              <span className="ndx-rich-pill-dot" aria-hidden />
              Client stories
            </p>
            <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "0.45rem" }}>
              What clients said about <em>this build.</em>
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--ndx-muted)", maxWidth: "40rem", marginBottom: "1.35rem", lineHeight: 1.65 }}>
              Placeholder quotes for layout — we will replace these with live Clutch, Upwork, GoodFirms, Trustpilot, and Fiverr reviews.
            </p>
            <div className="ndx-project-reviews__grid">
              {clientReviews.map((r) => (
                <blockquote key={r.id} className="ndx-project-reviews__card">
                  <p className="ndx-project-reviews__stars" aria-label={`${r.rating} out of 5`}>
                    {"★".repeat(r.rating)}
                  </p>
                  <p className="ndx-project-reviews__quote">“{r.quote}”</p>
                  <footer className="ndx-project-reviews__author">
                    <span className="ndx-project-reviews__avatar" aria-hidden>
                      {initialsFromName(r.name)}
                    </span>
                    <span>
                      <strong>{r.name}</strong>
                      <span>
                        {r.role} — {r.company}
                      </span>
                      <span className="ndx-project-reviews__platform">{r.platform} · draft</span>
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        )}

        {/* ── Team ─────────────────────────────────────────────────────── */}
        {project.team && project.team.length > 0 && (
          <div className="ndx-rich-block">
            <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1rem" }}>
              <span className="ndx-rich-pill-dot" aria-hidden />
              Team
            </p>
            <h2 className="ndx-h2" style={{ maxWidth: "32rem", marginBottom: "0.5rem" }}>Who <em>built it.</em></h2>
            <p style={{ fontSize: "0.875rem", color: "var(--ndx-muted)", maxWidth: "40rem", marginBottom: "1.35rem", lineHeight: 1.65 }}>
              Senior contributors only — the people in the kickoff call are the same people writing code.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
              {project.team.map((m) => (
                <div key={m.name} className="ndx-card" style={{ padding: "0.85rem 1rem" }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--ndx-text)", marginBottom: "0.25rem" }}>{m.name}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--ndx-muted)" }}>{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Related ──────────────────────────────────────────────────── */}
        <div className="ndx-rich-block">
          <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1rem" }}>
            <span className="ndx-rich-pill-dot" aria-hidden />
            More work
          </p>
          <h2 className="ndx-h2" style={{ maxWidth: "42rem", marginBottom: "1.35rem" }}>
            Explore <em>other projects.</em>
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
              gap: "1rem",
            }}
          >
            {projects
              .filter((p) => p.slug && p.slug !== slug && p.cover)
              .slice(0, 4)
              .map((p) => (
                <Link
                  key={p.slug}
                  to={`/projects/${p.slug}`}
                  className="ndx-card ndx-card-link"
                  style={{ overflow: "hidden", padding: 0, display: "block", textDecoration: "none" }}
                >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "4 / 3",
                      background: "var(--ndx-bg-elev)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0.65rem",
                    }}
                  >
                    <img
                      src={p.cover!}
                      alt=""
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        maxHeight: 148,
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </div>
                  <div style={{ padding: "0.85rem 0.95rem 1rem" }}>
                    <p
                      style={{
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--ndx-accent)",
                        fontFamily: "var(--ndx-font-mono)",
                        marginBottom: "0.35rem",
                      }}
                    >
                      {p.industry}
                    </p>
                    <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--ndx-text)", marginBottom: "0.35rem" }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: "0.78rem", color: "var(--ndx-muted)", lineHeight: 1.55, marginBottom: "0.55rem" }}>
                      {p.tagline.length > 90 ? `${p.tagline.slice(0, 90)}…` : p.tagline}
                    </p>
                    <span style={{ fontSize: "0.75rem", color: "var(--ndx-accent)", fontWeight: 600 }}>
                      View case study →
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <div
          className="ndx-rich-block"
          style={{ textAlign: "center", borderTop: "1px solid var(--ndx-border)", paddingTop: "2.5rem", marginTop: "3rem" }}
        >
          <h2 className="ndx-h2" style={{ maxWidth: "38rem", margin: "0 auto 0.7rem" }}>
            Want a system <em>like this?</em>
          </h2>
          <p className="ndx-group-sub" style={{ maxWidth: "36rem", margin: "0 auto 1.6rem" }}>
            Tell us what you need to build. We will tell you honestly what it would take — and whether we are the right team to build it.
          </p>
          <div className="ndx-rich-actions" style={{ justifyContent: "center" }}>
            <Link to="/proposal" className="ndx-btn ndx-btn-primary">Send a proposal</Link>
            <Link to="/estimate" className="ndx-btn">AI estimate</Link>
            <Link to="/portfolio" className="ndx-btn">All projects</Link>
          </div>
        </div>

      </div>
    </section>
  );
}
