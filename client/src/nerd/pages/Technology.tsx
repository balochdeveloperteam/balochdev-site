import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { IconType } from "react-icons";
import { usePageMeta } from "../hooks/usePageMeta";
import {
  technologyGroups,
  techStats,
  principles,
  stackCombos,
  faqItems,
} from "../data/technologies";
import {
  SiOpenai,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiPhp,
  SiNodedotjs,
  SiTailwindcss,
  SiFigma,
  SiZapier,
  SiMongodb,
  SiFirebase,
  SiSupabase,
  SiAndroid,
  SiGooglecloud,
  SiVercel,
  SiDocker,
  SiFlutter,
} from "react-icons/si";
import { FaRobot } from "react-icons/fa";
import { TbApi, TbDatabase, TbBrain, TbWorldWww } from "react-icons/tb";

function SystemBadge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`ndx-rich-sys-badge ${className}`.trim()}>{children}</div>;
}

type RingItem = { icon: IconType; label: string; size: number };

function TechnologyWheelStatic() {
  const picks: RingItem[] = [
    { icon: SiOpenai, label: "OpenAI", size: 44 },
    { icon: SiSupabase, label: "Supabase", size: 44 },
    { icon: SiReact, label: "React", size: 44 },
    { icon: SiNextdotjs, label: "Next.js", size: 44 },
    { icon: SiTypescript, label: "TypeScript", size: 42 },
    { icon: SiTailwindcss, label: "Tailwind", size: 42 },
    { icon: SiFlutter, label: "Flutter", size: 42 },
    { icon: SiDocker, label: "Docker", size: 40 },
    { icon: SiVercel, label: "Vercel", size: 40 },
  ];
  return (
    <div className="ndx-card ndx-rich-wheel-static">
      <p className="ndx-tech-meta" style={{ textAlign: "center", marginBottom: "0.35rem" }}>
        Stack snapshot
      </p>
      <p className="ndx-group-sub" style={{ textAlign: "center", marginTop: "0.5rem", marginBottom: 0 }}>
        {techStats.total} curated tools across {techStats.groups} disciplines — same stack we use on client builds.
      </p>
      <div className="ndx-rich-wheel-grid">
        {picks.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="ndx-rich-wheel-cell">
              <Icon size={item.size * 0.72} style={{ color: "var(--ndx-text)" }} aria-hidden />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TechnologyWheelAnimated() {
  const outerOrbitItems: RingItem[] = [
    { icon: SiFigma, label: "Figma", size: 46 },
    { icon: SiDocker, label: "Docker", size: 46 },
    { icon: SiTailwindcss, label: "Tailwind", size: 50 },
    { icon: SiTypescript, label: "TypeScript", size: 56 },
    { icon: SiJavascript, label: "JavaScript", size: 58 },
    { icon: SiZapier, label: "Zapier", size: 48 },
    { icon: SiPython, label: "Python", size: 54 },
    { icon: SiGooglecloud, label: "Cloud", size: 54 },
    { icon: SiReact, label: "React", size: 52 },
    { icon: SiNextdotjs, label: "Next.js", size: 50 },
    { icon: SiFirebase, label: "Firebase", size: 48 },
    { icon: SiMongodb, label: "MongoDB", size: 48 },
  ];

  const middleOrbitItems: RingItem[] = [
    { icon: SiOpenai, label: "OpenAI", size: 48 },
    { icon: TbBrain, label: "AI", size: 44 },
    { icon: SiPhp, label: "PHP", size: 44 },
    { icon: SiSupabase, label: "Supabase", size: 44 },
    { icon: SiNodedotjs, label: "Node.js", size: 44 },
    { icon: TbApi, label: "API", size: 42 },
    { icon: TbDatabase, label: "Database", size: 42 },
    { icon: SiVercel, label: "Vercel", size: 42 },
    { icon: TbWorldWww, label: "Web", size: 42 },
  ];

  const innerOrbitItems: RingItem[] = [
    { icon: FaRobot, label: "Bot", size: 34 },
    { icon: SiAndroid, label: "Android", size: 34 },
    { icon: SiReact, label: "React", size: 34 },
    { icon: SiOpenai, label: "OpenAI", size: 34 },
    { icon: SiTailwindcss, label: "Tailwind", size: 32 },
    { icon: SiNextdotjs, label: "Next.js", size: 32 },
  ];

  const OUTER_RADIUS = 43;
  const MIDDLE_RADIUS = 31;
  const INNER_RADIUS = 21;

  const renderOrbit = (items: RingItem[], radius: number, duration: number, reverse = false) => (
    <motion.div
      className="absolute inset-0"
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {items.map((item, index) => {
        const angle = (index / items.length) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;
        const Icon = item.icon;

        return (
          <motion.div
            key={`${item.label}-${radius}-${index}`}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{
              duration: 3.2 + (index % 4) * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.06,
            }}
          >
            <motion.div
              className="flex items-center justify-center text-[var(--ndx-text)]"
              style={{ width: item.size, height: item.size }}
              animate={{ rotate: reverse ? 360 : -360 }}
              transition={{ duration, repeat: Infinity, ease: "linear" }}
            >
              <Icon size={item.size * 0.78} className="text-[var(--ndx-text)]" />
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[min(100%,320px)] sm:max-w-[400px] lg:max-w-[min(460px,calc(100%-0.5rem))] xl:max-w-[520px]">
      <SystemBadge className="left-[6%] top-[5%]">SYS NH-STACK/V26</SystemBadge>
      <SystemBadge className="right-[6%] top-[5%]">REV 04·26</SystemBadge>
      <SystemBadge className="bottom-[5%] left-[6%]">
        <span className="text-[var(--ndx-accent)]">●</span> LIVE
      </SystemBadge>
      <SystemBadge className="bottom-[5%] right-[6%]">LOC BALOCH DEV</SystemBadge>

      <motion.div
        className="absolute left-1/2 top-1/2 h-[64%] w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "color-mix(in srgb, var(--ndx-accent) 22%, transparent)" }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.45, 0.85, 0.45] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-[8%] rounded-full border border-[var(--ndx-border)] opacity-40"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-[21%] rounded-full border border-dashed border-[var(--ndx-border)] opacity-40"
        animate={{ rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-[35%] rounded-full border border-[var(--ndx-border-strong)] opacity-55"
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 130, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-[40%] w-px origin-top bg-gradient-to-b from-[color-mix(in_srgb,var(--ndx-border)_85%,transparent)] via-[color-mix(in_srgb,var(--ndx-accent)_14%,transparent)] to-transparent"
            style={{ transform: `rotate(${i * (360 / 28)}deg)` }}
          />
        ))}
      </motion.div>

      {renderOrbit(outerOrbitItems, OUTER_RADIUS, 56, false)}
      {renderOrbit(middleOrbitItems, MIDDLE_RADIUS, 42, true)}
      {renderOrbit(innerOrbitItems, INNER_RADIUS, 28, false)}

      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const ringRadius = i % 3 === 0 ? OUTER_RADIUS - 3 : i % 3 === 1 ? MIDDLE_RADIUS - 2 : INNER_RADIUS - 1;
          const x = 50 + Math.cos(angle) * ringRadius;
          const y = 50 + Math.sin(angle) * ringRadius;

          return (
            <motion.span
              key={i}
              className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--ndx-accent)] shadow-[0_0_16px_color-mix(in_srgb,var(--ndx-accent)_50%,transparent)]"
              style={{ left: `${x}%`, top: `${y}%` }}
              animate={{ opacity: [0.25, 1, 0.25], scale: [0.7, 1.35, 0.7] }}
              transition={{
                duration: 2.3 + (i % 4) * 0.25,
                repeat: Infinity,
                delay: i * 0.05,
              }}
            />
          );
        })}
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-1/2 h-[29%] w-[29%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[8px] border-[color-mix(in_srgb,var(--ndx-bg)_78%,var(--ndx-border))]"
        animate={{ rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[24%] w-[24%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-[color-mix(in_srgb,var(--ndx-bg)_78%,var(--ndx-border))]"
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 flex h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-transparent"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="text-center">
          <div className="text-[12px] font-black uppercase tracking-[0.08em] text-[var(--ndx-text)] sm:text-sm">BALOCH DEV</div>
          <div className="mt-1 flex items-end justify-center gap-2">
            <span className="text-[13px] uppercase tracking-[0.35em] text-[var(--ndx-muted)]">STACK</span>
            <span className="font-serif text-5xl italic text-[var(--ndx-text)] sm:text-6xl">{techStats.total}</span>
          </div>
          <div className="mt-2 text-[11px] text-[var(--ndx-muted)] sm:text-sm">
            <span className="mr-1 text-[var(--ndx-accent)]">›</span>
            AI · web · mobile · data
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function TechnologyWheel({ reduced }: { reduced: boolean }) {
  return reduced ? <TechnologyWheelStatic /> : <TechnologyWheelAnimated />;
}

function ToolCard({ abbr, name, role, blurb, since }: { abbr: string; name: string; role: string; blurb: string; since?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.article
      className="ndx-card"
      style={{ padding: 0, overflow: "hidden" }}
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <div
        style={{
          position: "relative",
          height: "10rem",
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--ndx-accent) 22%, transparent), color-mix(in srgb, var(--ndx-accent-2) 14%, transparent), color-mix(in srgb, var(--ndx-bg) 65%, transparent))",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.35,
            backgroundImage:
              "linear-gradient(var(--ndx-border) 1px, transparent 1px), linear-gradient(90deg, var(--ndx-border) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "5rem",
            height: "5rem",
            marginLeft: "-2.5rem",
            marginTop: "-2.5rem",
            borderRadius: "999px",
            border: "1px solid color-mix(in srgb, var(--ndx-accent) 25%, transparent)",
            boxShadow: "0 0 40px color-mix(in srgb, var(--ndx-accent) 18%, transparent)",
          }}
          animate={reduced ? false : { rotate: 360 }}
          transition={reduced ? undefined : { duration: 22, repeat: Infinity, ease: "linear" }}
        />
        <div
          className="ndx-tech-abbr"
          style={{
            position: "absolute",
            left: "1rem",
            top: "1rem",
            width: "3rem",
            height: "3rem",
            fontSize: "0.7rem",
            boxShadow: "0 1px 4px color-mix(in srgb, var(--ndx-shadow-card) 40%, transparent)",
          }}
        >
          {abbr}
        </div>
      </div>

      <div style={{ padding: "1.25rem 1.35rem" }}>
        <p className="ndx-tech-meta">{role}</p>
        <h3 className="ndx-tech-name" style={{ fontSize: "1.15rem", marginTop: "0.35rem" }}>
          {name}
        </h3>
        <p className="ndx-tech-blurb" style={{ marginTop: "0.5rem" }}>
          {blurb}
        </p>
        {since ? (
          <p className="ndx-tech-meta" style={{ marginTop: "0.75rem", marginBottom: 0 }}>
            In active use <span style={{ color: "var(--ndx-muted)", fontWeight: 600 }}>since {since}</span>
          </p>
        ) : null}
        <div className="ndx-tech-arrow" style={{ textAlign: "right", marginTop: "1rem" }}>
          →
        </div>
      </div>
    </motion.article>
  );
}

function TechFaqItem({ item, index }: { item: (typeof faqItems)[number]; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className="ndx-faq-item">
      <button type="button" className="ndx-faq-q" onClick={() => setOpen(!open)}>
        <span>{item.q}</span>
        <span style={{ color: "var(--ndx-accent)", fontSize: "1.35rem" }}>{open ? "−" : "+"}</span>
      </button>
      {open ? <div className="ndx-faq-a">{item.a}</div> : null}
    </div>
  );
}

export default function TechnologiesPage() {
  const reduced = useReducedMotion();
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Technologies — BalochDev",
      description:
        "BalochDev technology stack: AI models, agents, React, Next.js, Flutter, Supabase, Postgres, automation with n8n, and edge deploys on Vercel and Cloudflare.",
      url: "https://balochdev.com/technologies",
    }),
    [],
  );

  const heroStats = useMemo(
    () => [
      { label: "Curated tools", value: String(techStats.total) },
      { label: "Disciplines", value: String(techStats.groups) },
      ...technologyGroups.slice(0, 4).map((g) => ({
        label: g.title.split(" ·")[0].split(" &")[0],
        value: String(g.count),
      })),
    ],
    [],
  );

  usePageMeta({
    title: "Technologies — BalochDev",
    description:
      "BalochDev stack: AI and agents, React and Next.js, Flutter, Supabase and Postgres, automation, and production deploy patterns — curated for real client work.",
    path: "/technologies",
    jsonLd,
  });

  return (
    <section className="ndx-section ndx-page-rich" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
      <div className="ndx-container">
        <motion.div className="ndx-rich-pill" initial={reduced ? false : { opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.55 }}>
          <span className="ndx-rich-pill-dot" aria-hidden />
          Technologies · {techStats.total} tools · {techStats.groups} groups
        </motion.div>

        <div className="ndx-rich-hero">
          <div className="ndx-rich-hero__copy">
            <motion.h1 className="ndx-h1" initial={reduced ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : 0.06 }}>
              Software built with <em>technologies</em> you can trust.
            </motion.h1>
            <motion.p
              className="ndx-lead"
              style={{ maxWidth: "62ch" }}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.14 }}
            >
              This is our working library — not a trophy wall. We pair leading AI APIs with React, Next.js, Flutter, Supabase, Postgres,
              automation (n8n, Zapier, MCP), and edge-ready hosting. Below, every group lists tools we actually ship, with short blurbs from the
              same source we use in proposals.
            </motion.p>
            <motion.div className="ndx-rich-actions" initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.22 }}>
              <Link to="/contact" className="ndx-btn ndx-btn-primary">
                Get in touch →
              </Link>
              <a href="#tech-stack" className="ndx-btn">
                See the stack
              </a>
            </motion.div>
            <motion.div className="ndx-rich-stats" initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.28 }}>
              {heroStats.map((item) => (
                <div key={item.label}>
                  <div className="ndx-rich-stat-label">{item.label}</div>
                  <div className="ndx-rich-stat-value">{item.value}</div>
                </div>
              ))}
            </motion.div>
          </div>
          <motion.div className="ndx-rich-hero__viz" initial={reduced ? false : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0 : 0.75, delay: reduced ? 0 : 0.1 }}>
            <TechnologyWheel reduced={!!reduced} />
          </motion.div>
        </div>

        <div id="tech-stack" className="ndx-rich-block scroll-mt-24">
          <div className="ndx-rich-prose--wide ndx-rich-prose">
            <p className="ndx-tech-meta">By discipline</p>
            <h2 className="ndx-h2">Tools grouped the way we scope work.</h2>
            <p className="ndx-group-sub" style={{ marginTop: "0.75rem" }}>
              Each card is a real vendor or pattern from our playbooks — AI, automation, frontends, backends, data, no-code when speed wins,
              languages we hand-write, deploy targets, and design handoff.
            </p>
          </div>
          <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {technologyGroups.map((section, idx) => (
              <div
                key={section.id}
                style={idx === 0 ? undefined : { borderTop: "1px solid var(--ndx-border)", paddingTop: "2rem", marginTop: "0.25rem" }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "1rem 2rem", marginBottom: "1.5rem" }}>
                  <div style={{ fontFamily: "var(--ndx-font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", fontStyle: "italic", color: "var(--ndx-accent)" }}>
                    {String(section.count).padStart(2, "0")}
                  </div>
                  <div style={{ flex: "1 1 14rem", minWidth: 0 }}>
                    <h3 className="ndx-h2" style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.85rem)", marginBottom: "0.35rem" }}>
                      {section.title}
                    </h3>
                    <p className="ndx-group-sub" style={{ marginTop: 0, marginBottom: 0 }}>
                      {section.subtitle}
                    </p>
                  </div>
                </div>
                <div className="ndx-rich-service-grid">
                  {section.items.map((item) => (
                    <ToolCard key={item.name} abbr={item.abbr} name={item.name} role={item.role} blurb={item.blurb} since={item.since} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ndx-rich-block">
          <div className="ndx-rich-prose">
            <p className="ndx-tech-meta">Principles</p>
            <h2 className="ndx-h2">How we pick from this menu.</h2>
          </div>
          <div className="ndx-principles" style={{ marginTop: "1.5rem" }}>
            {principles.map((p) => (
              <div key={p.n} className="ndx-principle">
                <div style={{ fontFamily: "var(--ndx-font-serif)", fontSize: "2rem", fontStyle: "italic", color: "var(--ndx-accent)", marginBottom: "0.35rem" }}>
                  {p.n}
                </div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="ndx-rich-block">
          <div className="ndx-rich-prose">
            <p className="ndx-tech-meta">Recipes</p>
            <h2 className="ndx-h2">Common stacks for common products.</h2>
          </div>
          <div className="ndx-rich-stack-panel">
            {stackCombos.map((row) => (
              <div key={row.product} className="ndx-rich-stack-row">
                <div style={{ fontWeight: 700, color: "var(--ndx-text)" }}>{row.product}</div>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--ndx-accent)" }}>{row.stack}</div>
                <div style={{ fontSize: "0.875rem", lineHeight: 1.55, color: "var(--ndx-muted)" }}>{row.why}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="ndx-rich-block">
          <div className="ndx-rich-prose">
            <p className="ndx-tech-meta">FAQ</p>
            <h2 className="ndx-h2">Quick answers before a call.</h2>
          </div>
          <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {faqItems.map((item, index) => (
              <TechFaqItem key={item.q} item={item} index={index} />
            ))}
          </div>
        </div>

        <div className="ndx-rich-cta-box" style={{ position: "relative", overflow: "hidden" }}>
          <div
            aria-hidden
            style={{
              position: "absolute",
              right: "-4rem",
              top: "-4rem",
              width: "14rem",
              height: "14rem",
              borderRadius: "999px",
              background: "color-mix(in srgb, var(--ndx-accent) 15%, transparent)",
              filter: "blur(48px)",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p className="ndx-tech-meta">Next step</p>
            <h2 className="ndx-h2" style={{ fontSize: "clamp(1.85rem, 3.5vw, 2.75rem)", marginTop: "0.35rem" }}>
              Tell us what you are shipping — we will map tools to milestones.
            </h2>
            <p className="ndx-lead" style={{ marginTop: "0.75rem", marginBottom: 0, maxWidth: "42rem" }}>
              Bring constraints: budget, timeline, compliance, and who edits content after launch. We will propose the smallest stack that still
              fits 12 months of growth.
            </p>
          </div>
          <div className="ndx-hero-btns" style={{ position: "relative", zIndex: 1 }}>
            <Link to="/contact" className="ndx-btn ndx-btn-primary">
              Book a call →
            </Link>
            <Link to="/services" className="ndx-btn">
              View services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
