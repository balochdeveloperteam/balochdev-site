import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { usePageMeta } from "../hooks/usePageMeta";

const team = [
  { name: "Adeel Baloch", role: "Founder + Project manager · Full stack developer" },
  { name: "Fazi Baloch", role: "Team manager" },
  { name: "Shees Baloch", role: "Full stack developer (mobile app development)" },
  { name: "Sohail Baloch", role: "Frontend developer · Trainer for team B" },
  { name: "Shams Baloch", role: "Social media manager · Graphic designer" },
  { name: "Hafsa Baloch", role: "Social media content creator (onboarding pending)" },
  { name: "Iqra Baloch", role: "YouTube content manager" },
  { name: "Nabeel Baloch", role: "Junior frontend developer" },
  { name: "Jwad Baloch", role: "Junior frontend developer" },
  { name: "Digital marketing", role: "Role pending — we are hiring" },
  { name: "Data management", role: "Role pending — we are hiring" },
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

export default function AboutPage() {
  const reduced = useReducedMotion();
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About BalochDev",
      description:
        "BalochDev is a product and services team advancing Balochi language technology alongside international web, mobile, and AI delivery.",
      url: "https://balochdev.com/about",
      mainEntity: {
        "@type": "Organization",
        name: "BalochDev",
        description: "AI-first software studio and Balochi language technology partner.",
      },
    }),
    [],
  );

  usePageMeta({
    title: "About us — BalochDev",
    description:
      "BalochDev: product and services team advancing Balochi language tech alongside international web, mobile, and AI delivery — weekly demos, clear milestones, secure hosting.",
    path: "/about",
    jsonLd,
  });

  return (
    <section className="ndx-section ndx-page-rich" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
      <div className="ndx-container">
        <motion.div className="ndx-rich-pill" initial={reduced ? false : { opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.55 }}>
          <span className="ndx-rich-pill-dot" aria-hidden />
          About BalochDev
        </motion.div>

        <motion.h1
          className="ndx-h1 mx-auto max-w-[52rem] text-center sm:mx-0 sm:text-left"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.62, delay: reduced ? 0 : 0.06 }}
        >
          Promoting Baloch <em>tech</em> — worldwide.
        </motion.h1>

        <motion.p
          className="ndx-lead mx-auto max-w-[48rem] text-center sm:mx-0 sm:text-left"
          style={{ marginBottom: "2rem" }}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.58, delay: reduced ? 0 : 0.14 }}
        >
          We are a focused product and services team. <strong>High priority</strong> is partner work that advances Balochi language and culture in
          mainstream software — alongside international web and mobile delivery for clients who need speed, clarity, and security.
        </motion.p>

        <motion.div
          className="ndx-card-grid"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.58, delay: reduced ? 0 : 0.22 }}
        >
          <div className="ndx-card">
            <p className="ndx-tech-meta">Mission</p>
            <p className="ndx-tech-blurb" style={{ marginTop: "0.65rem", fontSize: "0.9375rem", lineHeight: 1.6 }}>
              Digitise and promote Balochi: keyboards, office tools, browsers, and ethical AI that speaks with and for the community — always in
              partnership with educators and native speakers.
            </p>
          </div>
          <div className="ndx-card">
            <p className="ndx-tech-meta">How we deliver</p>
            <p className="ndx-tech-blurb" style={{ marginTop: "0.65rem", fontSize: "0.9375rem", lineHeight: 1.6 }}>
              Weekly demos, fixed milestones, protected Git branches, staging before production. Tools: modern JS and Flutter stacks, Supabase,
              Cloudflare-first hosting when you need edge speed and strong TLS.
            </p>
          </div>
        </motion.div>

        <div className="ndx-rich-block">
          <h2 className="ndx-h2">Team</h2>
          <p className="ndx-group-sub" style={{ marginTop: "0.5rem", maxWidth: "40rem" }}>
            Core contributors and open roles — say hello if you want to collaborate.
          </p>
          <div className="ndx-card-grid" style={{ marginTop: "1.5rem" }}>
            {team.map((m, i) => (
              <motion.article
                key={m.name}
                className="ndx-card"
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.03 * i }}
              >
                <h3 className="ndx-tech-name" style={{ fontSize: "1.05rem" }}>
                  {m.name}
                </h3>
                <p className="ndx-tech-blurb" style={{ marginTop: "0.5rem" }}>
                  {m.role}
                </p>
              </motion.article>
            ))}
          </div>
        </div>

        <div className="ndx-rich-block">
          <h2 className="ndx-h2">Brand partners</h2>
          <div className="ndx-pill-row" style={{ marginTop: "1rem", marginBottom: 0 }}>
            <span className="ndx-pill" style={{ fontSize: "0.875rem", padding: "0.45rem 1rem", fontFamily: "var(--ndx-font-sans)", textTransform: "none", letterSpacing: "normal" }}>
              Balochi Academy
            </span>
            <span className="ndx-pill" style={{ fontSize: "0.875rem", padding: "0.45rem 1rem", fontFamily: "var(--ndx-font-sans)", textTransform: "none", letterSpacing: "normal" }}>
              Taheer team
            </span>
          </div>
        </div>

        <div className="ndx-rich-block">
          <h2 className="ndx-h2">Initiatives in motion</h2>
          <ul className="ndx-group-sub" style={{ marginTop: "1rem", listStyle: "none", padding: 0, maxWidth: "48rem" }}>
            {initiatives.map((line) => (
              <li key={line} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", fontSize: "0.9375rem", lineHeight: 1.55 }}>
                <span style={{ color: "var(--ndx-accent)", flexShrink: 0 }} aria-hidden>
                  ›
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <motion.div className="ndx-rich-actions" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.2 }}>
          <Link to="/proposal" className="ndx-btn ndx-btn-primary">
            Partner with us
          </Link>
          <Link to="/portfolio" className="ndx-btn">
            Projects
          </Link>
          <Link to="/contact" className="ndx-btn">
            Contact
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
