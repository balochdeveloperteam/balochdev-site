import { useState, useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { usePageMeta } from "../hooks/usePageMeta";
import projects from "../data/projects";

/* ─── Animated border square ─────────────────────────────────────────────── */
/*
 * A single large rounded square whose border appears to carry a wave of
 * coloured light travelling clockwise — two strokes at different offsets
 * and colours give the "wave" effect. The SVG viewBox is 16:9 to match
 * the carousel so the border hugs it when the SVG is stretched to fill.
 */

const VB_W = 800;
const VB_H = 450;
const RX = 28;          // border-radius of the square
const SQ_X = 5;
const SQ_Y = 5;
const SQ_W = VB_W - 10;
const SQ_H = VB_H - 10;
// Perimeter of rounded rect (approx)
const PERIM = Math.round(2 * (SQ_W - 2 * RX) + 2 * (SQ_H - 2 * RX) + 2 * Math.PI * RX);
// PERIM ≈ 2*(790-56) + 2*(440-56) + 175.9 = 1468 + 768 + 176 ≈ 2412
const DASH1 = 200;   // primary light length
const DASH2 = 90;    // secondary (trailing) light length

/*
 * Animation strategy — "move, ease, pause, move":
 *   keyTimes  0 ─────────────── 0.72 ──── 1
 *   values    PERIM ────────→   0    ────  0   (stays at 0 = pause)
 *   easing    cubic ease-in-out on the travel segment, instant hold at end
 *
 * The light accelerates slowly from rest, reaches full speed mid-path,
 * then gently brakes to a stop, holds for ~28% of the cycle, then restarts.
 * Both lights share identical easing — orange is bold, blue is thin.
 */
const TRAVEL_STOP = "0.72"; // 72 % of cycle is travel, 28 % is pause

function AnimatedBorderSquare() {
  const sharedAnimate = (dur: string, begin: string) => (
    <animate
      attributeName="stroke-dashoffset"
      values={`${PERIM};0;0`}
      keyTimes={`0;${TRAVEL_STOP};1`}
      keySplines="0.42 0.0 0.58 1.0;0 0 1 1"
      calcMode="spline"
      dur={dur}
      begin={begin}
      repeatCount="indefinite"
    />
  );

  return (
    <svg
      aria-hidden
      width="100%"
      height="100%"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      fill="none"
      preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      {/* Dim static base — shows the full rounded square outline at all times */}
      <rect x={SQ_X} y={SQ_Y} width={SQ_W} height={SQ_H} rx={RX} ry={RX}
        stroke="#f97316" strokeWidth="0.8" strokeOpacity="0.12" />

      {/* Orange light — primary beam */}
      <rect x={SQ_X} y={SQ_Y} width={SQ_W} height={SQ_H} rx={RX} ry={RX}
        stroke="#f97316"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={`${DASH1} ${PERIM - DASH1}`}
        strokeOpacity="0.88"
      >
        {sharedAnimate("9s", "0s")}
      </rect>

      {/* Blue light — trailing beam, half-cycle offset */}
      <rect x={SQ_X} y={SQ_Y} width={SQ_W} height={SQ_H} rx={RX} ry={RX}
        stroke="#3b82f6"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={`${DASH2} ${PERIM - DASH2}`}
        strokeOpacity="0.82"
      >
        {sharedAnimate("9s", "-4.5s")}
      </rect>
    </svg>
  );
}

/* ─── Image carousel ─────────────────────────────────────────────────────── */

function Carousel({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    /*
     * Outer wrapper: padding of 18px top/bottom, 56px left/right.
     * The extra horizontal padding creates a zone where the prev/next
     * buttons live — completely outside the image area.
     * The animated border fills inset:0 (the full outer wrapper).
     */
    <div style={{ position: "relative", padding: "18px 56px" }}>
      <AnimatedBorderSquare />

      {/* Prev / Next — outside the image, in the horizontal padding zone */}
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
            style={{
              position: "absolute",
              [side]: 10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid var(--ndx-border)",
              background: "var(--ndx-bg-elev)",
              color: "var(--ndx-text)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              zIndex: 3,
              lineHeight: 1,
              transition: "background 0.18s, transform 0.18s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--ndx-bg)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scale(1.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--ndx-bg-elev)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scale(1)";
            }}
          >
            {icon}
          </button>
        ))}

      {/* Carousel shell — image only, no overlapping buttons */}
      <div
        style={{
          position: "relative",
          width: "100%",
          borderRadius: "var(--ndx-radius-lg)",
          overflow: "hidden",
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
              { name: "Jaber Ali", role: "Full Stack Developer" },
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
