import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Seo from "../seo/Seo";
import BookCallButton from "../components/bookCall/BookCallButton";
import FaqAccordion, { faqPageJsonLd } from "../components/FaqAccordion";
import { STATIC_PUBLIC_PAGES_SEO } from "../seo/staticPublicPagesSeo.js";
import { capDescription, metaTitleFromPublicBrief } from "../seo/seoFromData";
import { FAQ_CATEGORIES, SITE_FAQS } from "../data/siteFaqs.js";

const FAQ_SEO = STATIC_PUBLIC_PAGES_SEO["/faq"];

const HERO_STATS = [
  { value: "2024", label: "Founded" },
  { value: "20+", label: "Specialists" },
  { value: "14+", label: "Core team" },
  { value: "AI", label: "In the toolchain" },
];

export default function FaqPage() {
  const reduced = useReducedMotion();
  const seoTitle = useMemo(() => metaTitleFromPublicBrief(FAQ_SEO.metaTitle), []);
  const seoDescription = useMemo(() => capDescription(FAQ_SEO.metaDescription), []);
  const jsonLd = useMemo(() => faqPageJsonLd(SITE_FAQS), []);
  const totalQuestions = SITE_FAQS.length;

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        canonicalPath={FAQ_SEO.canonicalPath}
        jsonLd={jsonLd}
      />
      <section className="ndx-section ndx-page-rich ndx-page-rich--faq">
        {/* Centered hero */}
        <div className="ndx-faq-hero">
          <div className="ndx-faq-hero__glow" aria-hidden />
          <div className="ndx-container ndx-faq-hero__inner">
            <motion.p
              className="ndx-faq-hero__eyebrow"
              initial={reduced ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.45 }}
            >
              FAQ · {totalQuestions} answers · No gates
            </motion.p>
            <motion.h1
              className="ndx-faq-hero__title"
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.55 }}
            >
              Questions about building software <em>with BalochDev</em>
            </motion.h1>
            <motion.p
              className="ndx-faq-hero__lead"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.06 }}
            >
              Direct answers on services, AI, pricing, timelines, stack, and how we start — every answer on
              this page in full. Senior team. AI in the toolchain. Code you own.
            </motion.p>
            <motion.div
              className="ndx-faq-hero__actions"
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.12 }}
            >
              <Link to="/estimate" className="ndx-btn ndx-btn-primary">
                Get AI estimate
              </Link>
              <BookCallButton className="ndx-btn">Book a call</BookCallButton>
              <Link to="/about" className="ndx-btn">
                About us
              </Link>
            </motion.div>
            <motion.div
              className="ndx-faq-hero__stats"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.16 }}
            >
              {HERO_STATS.map((s) => (
                <div key={s.label} className="ndx-faq-hero__stat">
                  <span className="ndx-faq-hero__stat-value">{s.value}</span>
                  <span className="ndx-faq-hero__stat-label">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="ndx-container ndx-faq-body">
          <nav className="ndx-faq-jump" aria-label="FAQ sections">
            {FAQ_CATEGORIES.map((cat) => (
              <a key={cat.id} href={`#faq-${cat.id}`}>
                {cat.title}
                <span className="ndx-faq-jump__count">{cat.items.length}</span>
              </a>
            ))}
          </nav>

          {FAQ_CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              id={`faq-${cat.id}`}
              className="ndx-faq-category"
              style={{ scrollMarginTop: "5.5rem" }}
            >
              <header className="ndx-faq-category__head">
                <motion.h2
                  className="ndx-faq-category__title"
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.03 * Math.min(i, 4) }}
                >
                  {cat.title}
                </motion.h2>
                {cat.blurb ? <p className="ndx-faq-category__blurb">{cat.blurb}</p> : null}
              </header>
              <div className="ndx-faq-category__stack">
                <FaqAccordion items={cat.items} defaultOpenIndex={i === 0 ? 0 : null} />
              </div>
            </div>
          ))}

          <div className="ndx-faq-footer-cta">
            <h2>
              Still deciding? <em>Start with an estimate.</em>
            </h2>
            <p>Or tell us what you want to ship — we will say whether we are the right fit.</p>
            <div className="ndx-faq-hero__actions">
              <Link to="/estimate" className="ndx-btn ndx-btn-primary">
                Get AI estimate
              </Link>
              <BookCallButton className="ndx-btn">Book a call</BookCallButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
