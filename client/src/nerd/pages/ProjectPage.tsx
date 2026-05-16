import { useState, useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { usePageMeta } from "../hooks/usePageMeta";
import projects from "../data/projects";

/* ─── Nested-square SVG decoration ──────────────────────────────────────── */

function SquareDeco({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: "50%",
        [isLeft ? "left" : "right"]: -28,
        transform: "translateY(-50%)",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.18,
      }}
    >
      <svg width="110" height="110" viewBox="0 0 110 110" fill="none" style={{ color: "var(--ndx-accent)" }}>
        <rect x="1"  y="1"  width="108" height="108" stroke="currentColor" strokeWidth="1.2" />
        <rect x="14" y="14" width="82"  height="82"  stroke="currentColor" strokeWidth="1" />
        <rect x="27" y="27" width="56"  height="56"  stroke="currentColor" strokeWidth="0.9" />
        <rect x="40" y="40" width="30"  height="30"  stroke="currentColor" strokeWidth="0.8" />
        <rect x="53" y="53" width="4"   height="4"   fill="currentColor" />
      </svg>
    </div>
  );
}

/* ─── Image carousel ─────────────────────────────────────────────────────── */

function Carousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    /* Outer wrapper — provides room for the square decorations */
    <div style={{ position: "relative", padding: "0 18px" }}>
      <SquareDeco side="left" />
      <SquareDeco side="right" />

      {/* Carousel shell */}
      <div
        style={{
          position: "relative",
          width: "100%",
          borderRadius: "var(--ndx-radius-lg)",
          overflow: "hidden",
          border: "1px solid var(--ndx-border)",
          background: "transparent",
          aspectRatio: "16 / 9",
          zIndex: 1,
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
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ))}

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            {[
              { fn: prev, side: "left", label: "Previous", icon: "‹" },
              { fn: next, side: "right", label: "Next", icon: "›" },
            ].map(({ fn, side, label, icon }) => (
              <button
                key={side}
                type="button"
                onClick={fn}
                aria-label={`${label} screenshot`}
                style={{
                  position: "absolute",
                  [side]: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(6px)",
                  color: "#1e293b",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  zIndex: 3,
                  lineHeight: 1,
                  transition: "background 0.18s, transform 0.18s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.95)";
                  (e.currentTarget as HTMLButtonElement).style.transform = `translateY(-50%) scale(1.07)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.7)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scale(1)";
                }}
              >
                {icon}
              </button>
            ))}
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

  const jsonLd = useMemo(() => {
    if (!project) return null;
    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${project.title} — BalochDev`,
      description: project.seoDescription ?? project.tagline,
      url: `https://balochdev.com/projects/${project.slug}`,
      author: { "@type": "Organization", name: "BalochDev" },
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
    <section className="ndx-section ndx-page-rich ndx-page-rich--apps" style={{ paddingTop: "1.65rem", paddingBottom: "3.5rem" }}>
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

              {project.live && (
                <div>
                  <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ndx-dim)", fontFamily: "var(--ndx-font-mono)", marginBottom: "0.25rem" }}>Status</p>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#22c55e", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                    Live in production
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div
              className="ndx-rich-actions"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.22 }}
            >
              <Link to="/proposal" className="ndx-btn ndx-btn-primary">Build something similar →</Link>
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
            <h2 className="ndx-h2" style={{ maxWidth: "30rem", marginBottom: "1.5rem" }}>
              See it <em>in action.</em>
            </h2>
            <Carousel images={project.images} />
            <p style={{ marginTop: "0.75rem", fontSize: "0.78rem", color: "var(--ndx-dim)", fontFamily: "var(--ndx-font-mono)", textAlign: "center" }}>
              Use ‹ › or click the dots to browse · {project.images.length} screenshots
            </p>
          </div>
        )}

        {/* ── The challenge ────────────────────────────────────────────── */}
        {project.challenge && (
          <div className="ndx-rich-block ndx-glass-section" style={{ marginTop: "3rem" }}>
            <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1rem" }}>
              <span className="ndx-rich-pill-dot" aria-hidden />
              The challenge
            </p>
            <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "1.15rem" }}>
              The problem we <em>set out to solve.</em>
            </h2>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.8, color: "var(--ndx-muted)", maxWidth: "54rem" }}>
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
            <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "1.35rem" }}>
              How we <em>engineered it.</em>
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, maxWidth: "56rem" }}>
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
              Technology stack
            </p>
            <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "0.65rem" }}>
              Built with <em>the right tools.</em>
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--ndx-muted)", maxWidth: "46rem", marginBottom: "1.35rem", lineHeight: 1.65 }}>
              Every technology was chosen deliberately — either to maximise performance, eliminate infrastructure cost, or accelerate delivery without compromising production quality.
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

        {/* ── Team ─────────────────────────────────────────────────────── */}
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
            {[
              { name: "Adeel Baloch", role: "Project Manager · Full Stack Developer" },
              { name: "Shees Baloch", role: "Mobile & Backend Developer" },
              { name: "Sohail Baloch", role: "Frontend Developer" },
              { name: "Shams Baloch", role: "UI / UX Design" },
            ].map((m) => (
              <div key={m.name} className="ndx-card" style={{ padding: "0.85rem 1rem" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--ndx-text)", marginBottom: "0.25rem" }}>{m.name}</p>
                <p style={{ fontSize: "0.78rem", color: "var(--ndx-muted)" }}>{m.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Related ──────────────────────────────────────────────────── */}
        <div className="ndx-rich-block">
          <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1rem" }}>
            <span className="ndx-rich-pill-dot" aria-hidden />
            More work
          </p>
          <h2 className="ndx-h2" style={{ maxWidth: "32rem", marginBottom: "1.35rem" }}>
            Explore <em>other projects.</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0.75rem" }}>
            {projects
              .filter((p) => p.slug !== slug)
              .slice(0, 3)
              .map((p) => (
                <div
                  key={p.title}
                  className="ndx-card"
                  style={{ padding: "1rem 1.1rem" }}
                >
                  <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ndx-accent)", fontFamily: "var(--ndx-font-mono)", marginBottom: "0.4rem" }}>
                    {p.industry}
                  </p>
                  <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--ndx-text)", marginBottom: "0.35rem" }}>{p.title}</h3>
                  <p style={{ fontSize: "0.78rem", color: "var(--ndx-muted)", lineHeight: 1.55, marginBottom: "0.75rem" }}>
                    {p.tagline.slice(0, 90)}…
                  </p>
                  {p.slug ? (
                    <Link to={`/projects/${p.slug}`} style={{ fontSize: "0.78rem", color: "var(--ndx-accent)", textDecoration: "none", fontWeight: 600 }}>
                      View case study →
                    </Link>
                  ) : (
                    <span style={{ fontSize: "0.72rem", color: "var(--ndx-dim)", fontFamily: "var(--ndx-font-mono)" }}>Coming soon</span>
                  )}
                </div>
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
