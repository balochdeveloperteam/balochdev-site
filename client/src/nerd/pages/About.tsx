import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Seo from "../seo/Seo";
import { aboutPageJsonLd } from "../seo/siteSeo";
import FaqAccordion from "../components/FaqAccordion";
import { STATIC_PUBLIC_PAGES_SEO } from "../seo/staticPublicPagesSeo.js";
import { capDescription, metaTitleFromPublicBrief } from "../seo/seoFromData";

const ABOUT_SEO = STATIC_PUBLIC_PAGES_SEO["/about"];

/* ─── Data ──────────────────────────────────────────────────────────────── */

const stats = [
  { value: "11+", label: "Team members", sub: "Engineers, designers & creators" },
  { value: "2024", label: "Since", sub: "Balochistan · remote-first" },
  { value: "2+", label: "Brand partners", sub: "Balochi Academy · Taheer" },
  { value: "100%", label: "Client ownership", sub: "Code in your repo from day one" },
];

const team: { name: string; role: string; hiring?: boolean }[] = [
  { name: "Adeel Baloch", role: "Founder · Project Manager · Full Stack Developer" },
  { name: "Fazi Baloch", role: "Team Manager" },
  { name: "Shees Baloch", role: "Full Stack Developer · Mobile App Development" },
  { name: "Sohail Baloch", role: "Frontend Developer · Team Trainer" },
  { name: "Jaber Ali", role: "Full Stack Developer" },
  { name: "Shams Baloch", role: "Social Media Manager · Graphic Designer" },
  { name: "Maryam Baloch", role: "Social Media Content Creator" },
  { name: "Hafsa Baloch", role: "Video Editor" },
  { name: "Iqra Baloch", role: "YouTube Content Manager" },
  { name: "Nabeel Baloch", role: "Junior Frontend Developer" },
  { name: "Jwad Baloch", role: "Junior Frontend Developer" },
  { name: "Afsheen Baloch", role: "Senior Digital Marketing Specialist" },
  { name: "Digital Marketing", role: "Role pending — we are hiring", hiring: true },
  { name: "Data Management", role: "Role pending — we are hiring", hiring: true },
];

const principles = [
  {
    num: "/01",
    title: "Ship the product, not the deck.",
    body: "We measure our work by what is in production — not by slides or unstarted boards. Every engagement ends with working software.",
  },
  {
    num: "/02",
    title: "Promote Balochi — always.",
    body: "Digitising Balochi keyboards, browsers, office tools, and AI models is our highest-priority mission. Client work funds it; the mission keeps us honest.",
  },
  {
    num: "/03",
    title: "Senior people on every project.",
    body: "No bench, no junior-on-junior handoffs. The developers in the kickoff are the same developers in the standups three months later.",
  },
  {
    num: "/04",
    title: "You own everything from day one.",
    body: "Code lives in your repository from the first commit. We retain no rights to client work and do not reuse client code across projects.",
  },
  {
    num: "/05",
    title: "Community partnership, not extraction.",
    body: "All Balochi language work is done with educators and native speakers — never over them. Technology must serve the community.",
  },
  {
    num: "/06",
    title: "Transparent milestones, weekly demos.",
    body: "Fixed milestones, protected branches, staging before production. You see real progress every week — no surprise invoices.",
  },
];

const initiatives = [
  "Balochi in Microsoft Office (partner)",
  "Balochi in Google Keyboard (partner)",
  "LLM / chatbot for Balochi Academy — answers in Balochi",
  "Balochi Music AI — ethical promotion of Balochi music globally",
  "Large-scale Balochi foundation model (research track)",
  "Voice-forward Balochi music & learning device concept",
  "Balochi typography & input in Chrome and other browsers",
];

const timeline = [
  {
    year: "2024",
    title: "The beginning.",
    body: "BalochDev is founded with a clear dual mission: deliver world-class web and mobile products for international clients, while advancing Balochi language technology in mainstream software.",
  },
  {
    year: "2025",
    title: "Partners & recognition.",
    body: "We formalise partnerships with Balochi Academy and the Taheer team. Work begins on keyboard input and Microsoft Office integration. The team grows to include designers, content creators, and junior developers.",
  },
  {
    year: "2025",
    title: "AI & mobile depth.",
    body: "Mobile development and AI-assisted delivery become core offerings. We ship React Native and Flutter products, and integrate Claude Code into our build toolchain.",
  },
  {
    year: "2026",
    title: "Full-stack AI studio.",
    body: "Supabase, Cloudflare-first hosting, and AI agents are now standard on every project. Balochi language model research accelerates. The studio ships software 3× faster.",
  },
];

const faqs = [
  {
    q: "Where is BalochDev based?",
    a: "We are a remote-first team rooted in Balochistan. We work with clients across the Middle East, Europe, and beyond.",
  },
  {
    q: "What is your highest-priority work?",
    a: "Advancing Balochi language technology — keyboards, browser support, office tools, and ethical AI that speaks with the community. Client product work funds and runs alongside this mission.",
  },
  {
    q: "What industries do you serve?",
    a: "We have shipped products across e-commerce, media, education, real estate, and social platforms. We say yes when the product fits a pattern we have shipped and the scope is clear.",
  },
  {
    q: "How do you price projects?",
    a: "Fixed milestones, not hourly rate cards. You get an all-in number before the contract — no surprise invoices after the build.",
  },
  {
    q: "Who owns the source code?",
    a: "You do, always. Code lives in your GitHub from the first commit. We retain no rights to client work.",
  },
  {
    q: "How do we start?",
    a: "Send us a proposal or book a call. Bring the product idea and a rough timeline — we will tell you honestly whether we are the right fit.",
  },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function TeamPhotoPlaceholder({ name, hiring }: { name: string; hiring?: boolean }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "4 / 3",
        background: hiring
          ? "linear-gradient(145deg, rgba(100,116,139,0.10) 0%, rgba(100,116,139,0.06) 100%)"
          : "linear-gradient(145deg, rgba(59,130,246,0.13) 0%, rgba(99,102,241,0.10) 50%, rgba(45,212,191,0.08) 100%)",
        borderBottom: "1px solid var(--ndx-border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.35rem",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
      aria-hidden
    >
      {/* subtle radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hiring
            ? "radial-gradient(ellipse at 50% 60%, rgba(100,116,139,0.10) 0%, transparent 70%)"
            : "radial-gradient(ellipse at 50% 60%, rgba(59,130,246,0.14) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* person silhouette SVG */}
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        aria-hidden
        style={{ opacity: hiring ? 0.25 : 0.45, zIndex: 1 }}
      >
        <circle cx="28" cy="20" r="11" fill={hiring ? "#94a3b8" : "#3b82f6"} />
        <path
          d="M6 50 C6 34 15 30 28 30 C41 30 50 34 50 50"
          fill={hiring ? "#94a3b8" : "#3b82f6"}
        />
      </svg>
      {/* initials */}
      <span
        style={{
          fontSize: "0.875rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          color: hiring ? "var(--ndx-dim)" : "var(--ndx-accent)",
          fontFamily: "var(--ndx-font-sans)",
          zIndex: 1,
          opacity: hiring ? 0.5 : 0.85,
        }}
      >
        {initials}
      </span>
      {/* photo coming soon badge */}
      {!hiring && (
        <span
          style={{
            position: "absolute",
            bottom: "0.55rem",
            right: "0.65rem",
            fontSize: "0.6rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ndx-accent)",
            opacity: 0.55,
            fontFamily: "var(--ndx-font-mono)",
            zIndex: 2,
          }}
        >
          photo soon
        </span>
      )}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  const reduced = useReducedMotion();

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
      <section className="ndx-section ndx-page-rich ndx-page-rich--apps" style={{ paddingTop: "1.65rem", paddingBottom: "3rem" }}>
      <div className="ndx-container">

        {/* ── Eyebrow pill ─────────────────────────────────────────────── */}
        <motion.div
          className="ndx-rich-pill ndx-rich-pill--minimal"
          initial={reduced ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.55 }}
        >
          <span className="ndx-rich-pill-dot" aria-hidden />
          BD · About us · Balochistan · Remote-first · Est. 2024
        </motion.div>

        {/* ── Hero panel ───────────────────────────────────────────────── */}
        <div className="ndx-rich-hero">
          {/* Left — copy */}
          <div className="ndx-rich-hero__copy">
            <motion.h1
              className="ndx-h1"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.55 }}
            >
              Promoting Baloch{" "}
              <em>tech</em> — worldwide.
            </motion.h1>

            <motion.p
              className="ndx-lead"
              style={{ maxWidth: "54ch" }}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.07 }}
            >
              We are a focused product and services team with a dual mission: deliver world-class web,
              mobile, and AI products for international clients — and advance <strong>Balochi language
              and culture</strong> in mainstream software through genuine community partnership.
            </motion.p>

            <motion.div
              className="ndx-rich-actions"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.13 }}
            >
              <Link to="/proposal" className="ndx-btn ndx-btn-primary">Partner with us →</Link>
              <Link to="/contact" className="ndx-btn">Book a call</Link>
              <Link to="/portfolio" className="ndx-btn">View our work</Link>
            </motion.div>
          </div>

          {/* Right — stat grid */}
          <motion.div
            className="ndx-rich-hero__viz"
            style={{ alignItems: "stretch" }}
            initial={reduced ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduced ? 0 : 0.62, delay: reduced ? 0 : 0.08 }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                width: "100%",
              }}
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="ndx-card"
                  style={{ padding: "1.25rem 1rem", textAlign: "center" }}
                >
                  <p
                    style={{
                      fontSize: "2rem",
                      fontWeight: 800,
                      color: "var(--ndx-accent)",
                      lineHeight: 1,
                      marginBottom: "0.3rem",
                      fontFamily: "var(--ndx-font-sans)",
                    }}
                  >
                    {s.value}
                  </p>
                  <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--ndx-text)", marginBottom: "0.2rem" }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "var(--ndx-muted)", lineHeight: 1.4 }}>
                    {s.sub}
                  </p>
                </div>
              ))}
              {/* Partners mini-card spanning both cols */}
              <div
                className="ndx-card"
                style={{
                  gridColumn: "1 / -1",
                  padding: "0.9rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ndx-muted)" }}>
                  Partners
                </span>
                {["Balochi Academy", "Taheer team"].map((p) => (
                  <span
                    key={p}
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: "var(--ndx-accent)",
                      background: "color-mix(in srgb, var(--ndx-accent) 10%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--ndx-accent) 25%, transparent)",
                      borderRadius: 999,
                      padding: "0.2rem 0.7rem",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Founder note ─────────────────────────────────────────────── */}
        <div className="ndx-rich-block ndx-glass-section">
          <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1.1rem" }}>
            <span className="ndx-rich-pill-dot" aria-hidden />
            A note from the founder
          </p>
          <h2 className="ndx-h2" style={{ maxWidth: "38rem", marginBottom: "1.25rem" }}>
            Why we built BalochDev <em>the way we did.</em>
          </h2>
          <p style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "var(--ndx-muted)", maxWidth: "52rem", marginBottom: "1rem" }}>
            I started BalochDev because I wanted to prove two things at once: that a team from Balochistan
            can ship world-class software, and that Balochi language technology does not have to wait for a
            large institution to fund it. Client work gives us the resources; the mission gives us the reason.
          </p>
          <p style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "var(--ndx-muted)", maxWidth: "52rem", marginBottom: "1rem" }}>
            Every partnership we have built — with Balochi Academy, with the Taheer team, with educators and
            native speakers — is built on the same principle: technology must serve the community, not extract
            from it. We do not ship a keyboard or an AI model and walk away. We stay in the conversation.
          </p>
          <p style={{ fontSize: "0.9375rem", lineHeight: 1.75, color: "var(--ndx-muted)", maxWidth: "52rem", marginBottom: "1.5rem" }}>
            If you are reading this far, thank you. The fastest way to know if we are a fit is a short call —
            tell us what you want to ship, and we will tell you honestly whether we can help. — Adeel
          </p>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--ndx-text)" }}>
            Adeel Baloch · Founder &amp; Project Manager
          </p>
        </div>

        {/* ── What we believe ──────────────────────────────────────────── */}
        <div className="ndx-rich-block">
          <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1.1rem" }}>
            <span className="ndx-rich-pill-dot" aria-hidden />
            What we believe
          </p>
          <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "1.5rem" }}>
            Most studios sell hours. <em>We ship product.</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            <div className="ndx-card">
              <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ndx-muted)", marginBottom: "0.65rem" }}>
                How most studios work
              </p>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.6rem", color: "var(--ndx-text)" }}>
                Hours billed. Decks delivered.
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--ndx-muted)", lineHeight: 1.65 }}>
                Most agencies sell time. Engagements end with a slide deck, a board of unstarted tasks, and
                an invoice for hours nobody can audit. AI shows up in the pitch — not in the toolchain.
              </p>
            </div>
            <div
              className="ndx-card"
              style={{
                borderColor: "color-mix(in srgb, var(--ndx-accent) 40%, var(--ndx-border))",
                background: "color-mix(in srgb, var(--ndx-accent) 5%, var(--ndx-bg-elev))",
              }}
            >
              <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ndx-accent)", marginBottom: "0.65rem" }}>
                How BalochDev works
              </p>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.6rem", color: "var(--ndx-text)" }}>
                Code in production. Every time.
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--ndx-muted)", lineHeight: 1.65 }}>
                We sell shipped software. Weekly demos, fixed milestones, staging before production.
                AI is in our toolchain — not in our pitch. Every engagement ends with software in your
                repo, owned by your team.
              </p>
            </div>
          </div>
        </div>

        {/* ── Timeline ─────────────────────────────────────────────────── */}
        <div className="ndx-rich-block">
          <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1.1rem" }}>
            <span className="ndx-rich-pill-dot" aria-hidden />
            The arc, in four moments
          </p>
          <h2 className="ndx-h2" style={{ maxWidth: "32rem", marginBottom: "2rem" }}>
            From first commit <em>to full studio.</em>
          </h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {timeline.map((item, i) => (
              <motion.div
                key={item.year + item.title}
                style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: "1.15rem", position: "relative" }}
                initial={reduced ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: reduced ? 0 : 0.42, delay: reduced ? 0 : 0.07 * i }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "0.4rem" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--ndx-accent)", flexShrink: 0, zIndex: 1 }} />
                  {i < timeline.length - 1 && (
                    <div style={{ width: 1, flex: 1, minHeight: 36, background: "var(--ndx-border)", marginTop: 4 }} />
                  )}
                </div>
                <div style={{ paddingBottom: i < timeline.length - 1 ? "1.75rem" : 0 }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--ndx-accent)", letterSpacing: "0.08em", fontFamily: "var(--ndx-font-sans)" }}>
                    {item.year}
                  </span>
                  <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--ndx-text)", margin: "0.18rem 0 0.45rem" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--ndx-muted)", lineHeight: 1.65, maxWidth: "44rem" }}>
                    {item.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Team ─────────────────────────────────────────────────────── */}
        <div className="ndx-rich-block">
          <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1.1rem" }}>
            <span className="ndx-rich-pill-dot" aria-hidden />
            Meet our team
          </p>
          <h2 className="ndx-h2" style={{ marginBottom: "0.4rem" }}>Built by people who care.</h2>
          <p className="ndx-group-sub" style={{ maxWidth: "42rem", marginBottom: "1.75rem" }}>
            Core contributors and open roles. Photos will be added soon — say hello if you want to collaborate.
          </p>
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
            }}
          >
            {team.map((m, i) => (
              <motion.article
                key={m.name}
                className="ndx-card"
                style={{
                  padding: 0,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  opacity: m.hiring ? 0.75 : 1,
                }}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: m.hiring ? 0.75 : 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.38, delay: reduced ? 0 : 0.04 * i }}
              >
                <TeamPhotoPlaceholder name={m.name} hiring={m.hiring} />
                <div style={{ padding: "0.8rem 0.9rem 0.9rem", flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "var(--ndx-text)",
                      marginBottom: "0.3rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {m.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.76rem",
                      color: m.hiring ? "var(--ndx-dim)" : "var(--ndx-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {m.role}
                  </p>
                  {m.hiring && (
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: "0.45rem",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--ndx-accent)",
                        background: "color-mix(in srgb, var(--ndx-accent) 10%, transparent)",
                        border: "1px solid color-mix(in srgb, var(--ndx-accent) 22%, transparent)",
                        borderRadius: 999,
                        padding: "0.15rem 0.55rem",
                        fontFamily: "var(--ndx-font-mono)",
                      }}
                    >
                      Hiring
                    </span>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* ── Initiatives ──────────────────────────────────────────────── */}
        <div className="ndx-rich-block ndx-glass-section" style={{ marginTop: "3rem" }}>
          <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1.1rem" }}>
            <span className="ndx-rich-pill-dot" aria-hidden />
            Initiatives in motion
          </p>
          <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "1rem" }}>
            Balochi language technology — <em>in progress.</em>
          </h2>
          <p style={{ fontSize: "0.9375rem", color: "var(--ndx-muted)", maxWidth: "48rem", marginBottom: "1.35rem", lineHeight: 1.65 }}>
            Active or research-track initiatives, all developed in genuine partnership with Balochi educators
            and native speakers.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, maxWidth: "48rem" }}>
            {initiatives.map((line) => (
              <li
                key={line}
                style={{ display: "flex", gap: "0.6rem", marginBottom: "0.55rem", fontSize: "0.9375rem", lineHeight: 1.55, color: "var(--ndx-muted)" }}
              >
                <span style={{ color: "var(--ndx-accent)", flexShrink: 0, marginTop: "0.05em" }} aria-hidden>›</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Studio principles ────────────────────────────────────────── */}
        <div className="ndx-rich-block">
          <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1.1rem" }}>
            <span className="ndx-rich-pill-dot" aria-hidden />
            Studio principles · v2025
          </p>
          <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "1.75rem" }}>
            Six rules we run <em>the studio by.</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {principles.map((p, i) => (
              <motion.div
                key={p.num}
                className="ndx-card"
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.38, delay: reduced ? 0 : 0.05 * i }}
              >
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--ndx-accent)", letterSpacing: "0.08em", marginBottom: "0.5rem", fontFamily: "var(--ndx-font-sans)" }}>
                  {p.num}
                </p>
                <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--ndx-text)", marginBottom: "0.45rem" }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--ndx-muted)", lineHeight: 1.62 }}>{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <div className="ndx-rich-block ndx-glass-section" style={{ marginTop: "3rem" }}>
          <p className="ndx-rich-pill ndx-rich-pill--minimal" style={{ marginBottom: "1.1rem" }}>
            <span className="ndx-rich-pill-dot" aria-hidden />
            Before you reach out
          </p>
          <h2 className="ndx-h2" style={{ maxWidth: "36rem", marginBottom: "1.5rem" }}>
            Questions, <em>plainly answered.</em>
          </h2>
          <div style={{ maxWidth: "52rem" }}>
            <FaqAccordion items={faqs} />
          </div>
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <div className="ndx-rich-block" style={{ textAlign: "center" }}>
          <h2 className="ndx-h2" style={{ maxWidth: "38rem", margin: "0 auto 0.75rem" }}>
            Ready to ship something <em>that matters?</em>
          </h2>
          <p className="ndx-group-sub" style={{ maxWidth: "36rem", margin: "0 auto 1.75rem" }}>
            Send us a proposal or book a call. We will tell you honestly whether we are the right fit.
          </p>
          <motion.div
            className="ndx-rich-actions"
            style={{ justifyContent: "center" }}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.15 }}
          >
            <Link to="/proposal" className="ndx-btn ndx-btn-primary">Send a proposal</Link>
            <Link to="/portfolio" className="ndx-btn">View our work</Link>
            <Link to="/contact" className="ndx-btn">Contact us</Link>
          </motion.div>
        </div>

      </div>
    </section>
    </>
  );
}
