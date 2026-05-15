import { useState, useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { usePageMeta } from "../hooks/usePageMeta";
import projects from "../data/projects";

/* ─── Image carousel ─────────────────────────────────────────────────────── */

function Carousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: "var(--ndx-radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--ndx-border)",
        background: "var(--ndx-bg-elev)",
        aspectRatio: "16 / 9",
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
            transition: "opacity 0.38s ease",
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

      {/* Prev / Next arrows */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous screenshot"
            style={{
              position: "absolute",
              left: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid var(--ndx-border)",
              background: "color-mix(in srgb, var(--ndx-bg) 80%, transparent)",
              backdropFilter: "blur(8px)",
              color: "var(--ndx-text)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              transition: "background 0.18s",
              zIndex: 2,
            }}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next screenshot"
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid var(--ndx-border)",
              background: "color-mix(in srgb, var(--ndx-bg) 80%, transparent)",
              backdropFilter: "blur(8px)",
              color: "var(--ndx-text)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
              transition: "background 0.18s",
              zIndex: 2,
            }}
          >
            ›
          </button>
        </>
      )}

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
            zIndex: 2,
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Go to screenshot ${i + 1}`}
              style={{
                width: i === idx ? 18 : 7,
                height: 7,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background: i === idx ? "var(--ndx-accent)" : "rgba(255,255,255,0.45)",
                transition: "all 0.22s",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      <span
        style={{
          position: "absolute",
          top: "0.65rem",
          right: "0.75rem",
          fontSize: "0.65rem",
          fontFamily: "var(--ndx-font-mono)",
          fontWeight: 700,
          color: "rgba(255,255,255,0.75)",
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(6px)",
          borderRadius: 999,
          padding: "0.18rem 0.55rem",
          zIndex: 2,
        }}
      >
        {idx + 1} / {images.length}
      </span>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const reduced = useReducedMotion();

  const project = useMemo(() => projects.find((p) => p.slug === slug) ?? null, [slug]);

  const jsonLd = useMemo(() => {
    if (!project) return null;
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${project.title} — BalochDev`,
      description: project.seoDescription ?? project.tagline,
      url: `https://balochdev.com/projects/${project.slug}`,
    };
  }, [project]);

  usePageMeta({
    title: project ? `${project.title} — BalochDev` : "Project — BalochDev",
    description: project?.seoDescription ?? project?.tagline ?? "Project case study by BalochDev.",
    path: `/projects/${slug}`,
    jsonLd: jsonLd ?? undefined,
  });

  if (!project) return <Navigate to="/portfolio" replace />;

  return (
    <section
      className="ndx-section ndx-page-rich ndx-page-rich--apps"
      style={{ paddingTop: "1.65rem", paddingBottom: "3.5rem" }}
    >
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
            ← Portfolio
          </Link>
        </motion.div>

        {/* ── Hero header ──────────────────────────────────────────────── */}
        <div className="ndx-rich-hero">
          <div className="ndx-rich-hero__copy">
            {/* Eyebrow */}
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
              style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", marginTop: "1.25rem" }}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.14 }}
            >
              {[
                { label: "Year", value: project.year },
                ...(project.duration ? [{ label: "Delivered in", value: project.duration }] : []),
                ...(project.clientLocation ? [{ label: "Client", value: project.clientLocation }] : []),
                { label: "Type", value: project.industry },
              ].map((m) => (
                <div key={m.label}>
                  <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ndx-dim)", fontFamily: "var(--ndx-font-mono)", marginBottom: "0.2rem" }}>
                    {m.label}
                  </p>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--ndx-text)" }}>{m.value}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              className="ndx-rich-actions"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.2 }}
            >
              <Link to="/proposal" className="ndx-btn ndx-btn-primary">Work with us →</Link>
              <Link to="/contact" className="ndx-btn">Get in touch</Link>
            </motion.div>
          </div>

          {/* Right — first image preview */}
          {project.cover && (
            <motion.div
              className="ndx-rich-hero__viz"
              initial={reduced ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.08 }}
            >
              <img
                src={project.cover}
                alt={project.title}
                style={{
                  width: "100%",
                  borderRadius: "var(--ndx-radius-lg)",
                  border: "1px solid var(--ndx-border)",
                  display: "block",
                  objectFit: "cover",
                  maxHeight: 360,
                }}
              />
            </motion.div>
          )}
        </div>

        {/* ── Screenshot carousel ──────────────────────────────────────── */}
        {project.images && project.images.length > 0 && (
          <div className="ndx-rich-block">
            <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1.1rem" }}>
              <span className="ndx-rich-pill-dot" aria-hidden />
              Screenshots
            </p>
            <Carousel images={project.images} />
          </div>
        )}

        {/* ── The challenge ────────────────────────────────────────────── */}
        {project.challenge && (
          <div className="ndx-rich-block ndx-glass-section" style={{ marginTop: "3rem" }}>
            <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1rem" }}>
              <span className="ndx-rich-pill-dot" aria-hidden />
              The challenge
            </p>
            <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "1.1rem" }}>
              What the client <em>needed.</em>
            </h2>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "var(--ndx-muted)", maxWidth: "52rem" }}>
              {project.challenge}
            </p>
          </div>
        )}

        {/* ── Solution ─────────────────────────────────────────────────── */}
        {project.solution && project.solution.length > 0 && (
          <div className="ndx-rich-block">
            <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1rem" }}>
              <span className="ndx-rich-pill-dot" aria-hidden />
              What we built
            </p>
            <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "1.25rem" }}>
              The <em>solution.</em>
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, maxWidth: "52rem" }}>
              {project.solution.map((item, i) => (
                <motion.li
                  key={i}
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    paddingBottom: "0.75rem",
                    marginBottom: "0.75rem",
                    borderBottom: i < project.solution!.length - 1 ? "1px solid var(--ndx-border)" : "none",
                    fontSize: "0.9375rem",
                    lineHeight: 1.65,
                    color: "var(--ndx-muted)",
                  }}
                  initial={reduced ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : 0.05 * i }}
                >
                  <span style={{ color: "var(--ndx-accent)", flexShrink: 0, marginTop: "0.15em", fontWeight: 700 }} aria-hidden>
                    ›
                  </span>
                  <span>{item}</span>
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
              Key features
            </p>
            <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "1.5rem" }}>
              Everything that <em>shipped.</em>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
              {project.features.map((f, i) => (
                <motion.div
                  key={f}
                  className="ndx-card"
                  style={{ padding: "0.85rem 1rem", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.32, delay: reduced ? 0 : 0.04 * i }}
                >
                  <span style={{ color: "var(--ndx-accent)", fontSize: "0.9rem", marginTop: "0.05em", flexShrink: 0 }} aria-hidden>✓</span>
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
              Tech stack
            </p>
            <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "1.25rem" }}>
              Built with <em>the right tools.</em>
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="ndx-pill"
                  style={{
                    fontFamily: "var(--ndx-font-sans)",
                    textTransform: "none",
                    letterSpacing: "normal",
                    fontSize: "0.875rem",
                    padding: "0.4rem 1rem",
                  }}
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
              What was <em>delivered.</em>
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, maxWidth: "48rem" }}>
              {project.results.map((r, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: "0.6rem",
                    marginBottom: "0.55rem",
                    fontSize: "0.9375rem",
                    lineHeight: 1.55,
                    color: "var(--ndx-muted)",
                  }}
                >
                  <span style={{ color: "#22c55e", flexShrink: 0, fontWeight: 700 }} aria-hidden>✓</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Team ─────────────────────────────────────────────────────── */}
        <div className="ndx-rich-block">
          <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1rem" }}>
            <span className="ndx-rich-pill-dot" aria-hidden />
            Team
          </p>
          <h2 className="ndx-h2" style={{ maxWidth: "32rem", marginBottom: "1.25rem" }}>
            Who <em>built it.</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
            {[
              { name: "Adeel Baloch", role: "Project Manager · Full Stack" },
              { name: "Shees Baloch", role: "Mobile & Backend Developer" },
              { name: "Sohail Baloch", role: "Frontend Developer" },
              { name: "Shams Baloch", role: "UI / UX Design" },
            ].map((m) => (
              <div key={m.name} className="ndx-card" style={{ padding: "0.85rem 1rem" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--ndx-text)", marginBottom: "0.25rem" }}>
                  {m.name}
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--ndx-muted)" }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <div
          className="ndx-rich-block"
          style={{ textAlign: "center", borderTop: "1px solid var(--ndx-border)", paddingTop: "2.5rem", marginTop: "3rem" }}
        >
          <h2 className="ndx-h2" style={{ maxWidth: "36rem", margin: "0 auto 0.65rem" }}>
            Want something <em>like this?</em>
          </h2>
          <p className="ndx-group-sub" style={{ maxWidth: "32rem", margin: "0 auto 1.5rem" }}>
            Tell us about your project — we'll tell you honestly what it would take.
          </p>
          <div className="ndx-rich-actions" style={{ justifyContent: "center" }}>
            <Link to="/proposal" className="ndx-btn ndx-btn-primary">Send a proposal</Link>
            <Link to="/portfolio" className="ndx-btn">All projects</Link>
          </div>
        </div>

      </div>
    </section>
  );
}
