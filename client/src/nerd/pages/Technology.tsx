import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import type { IconType } from "react-icons";
import {
  TbCpu2,
  TbAutomation,
  TbDeviceDesktopCode,
  TbLayersLinked,
  TbDatabase,
  TbBlocks,
  TbCode,
  TbPackages,
  TbPalette,
} from "react-icons/tb";
import { usePageMeta } from "../hooks/usePageMeta";
import { useDataTheme } from "../hooks/useDataTheme";
import { useLiteMotionProfile } from "../hooks/useLiteMotionProfile";
import logoBlack from "../../assets/BalochDevLogo/logo_black.svg";
import logoWhite from "../../assets/BalochDevLogo/logo_white.svg";
import logoOrange from "../../assets/BalochDevLogo/logo_orange.svg";
import {
  technologyGroups,
  principles,
  stackCombos,
  faqItems,
} from "../data/technologies";
import { TECH_ICON_MAP } from "../data/technologyIcons";
import { stackToolLandingPath } from "../data/stackLandings";
import { selectedWorkTeasers } from "../data/selectedWorkTeasers";
import PartnerBrandsGrid from "../components/PartnerBrandsGrid";
import RichSectionIntro from "../components/RichSectionIntro";

type TechItem = {
  iconKey: string;
  name: string;
  role: string;
  blurb: string;
  since?: string;
};

type TechGroup = {
  id: string;
  title: string;
  subtitle: string;
  items: TechItem[];
};

/**
 * Discipline headings that pair copy + one large generic glyph on the right (bundled SVG).
 * AI is omitted — the hero wheel above already carries model/tool branding.
 */
const TECH_SECTION_IDS_WITH_SIDE_VISUAL: ReadonlySet<string> = new Set([
  "automation",
  "frontend",
  "backend",
  "data",
  "nocode",
  "languages",
  "ops",
  "design",
]);

/** Intro glyph — AI / compute & chips (bundled SVG; Flaticon-style metaphors without hotlinking). */
const TECH_DISCIPLINE_GENERAL_ICON_INTRO = TbCpu2;

const TECH_DISCIPLINE_GENERAL_ICON_BY_SECTION: Record<string, IconType> = {
  automation: TbAutomation,
  frontend: TbDeviceDesktopCode,
  backend: TbLayersLinked,
  data: TbDatabase,
  nocode: TbBlocks,
  languages: TbCode,
  ops: TbPackages,
  design: TbPalette,
};

const HERO_HUB_MARKS: Record<string, string> = {
  light: logoBlack,
  dark: logoWhite,
  dusk: logoOrange,
};

/** Larger glyphs on Technologies ghost orbit (Services hero keeps smaller orbit icons). */
const TECH_ORBIT_ICON_GLYPH = Math.round(52 * 0.6);

const SPOKE_TRAIN_DOTS = 3;
const SPOKE_LEG_SEC = 1.4;

type OrbitRadiusVar = "--ndx-hero-orbit-a" | "--ndx-hero-orbit-b" | "--ndx-hero-orbit-c";

type TechOrbitGlyph = { Icon: IconType; label: string };

/** Inner + outer icons share one hub→outer spoke (clockwise layer). */
const TECH_HERO_PAIRED: { inner: TechOrbitGlyph; outer: TechOrbitGlyph }[] = [
  { inner: { Icon: TECH_ICON_MAP.openai, label: "OpenAI" }, outer: { Icon: TECH_ICON_MAP.anthropic, label: "Anthropic" } },
  { inner: { Icon: TECH_ICON_MAP.react, label: "React" }, outer: { Icon: TECH_ICON_MAP.nextjs, label: "Next.js" } },
  { inner: { Icon: TECH_ICON_MAP.flutter, label: "Flutter" }, outer: { Icon: TECH_ICON_MAP.dart, label: "Dart" } },
  { inner: { Icon: TECH_ICON_MAP.supabase, label: "Supabase" }, outer: { Icon: TECH_ICON_MAP.firebase, label: "Firebase" } },
  { inner: { Icon: TECH_ICON_MAP.python, label: "Python" }, outer: { Icon: TECH_ICON_MAP.java, label: "Java" } },
  { inner: { Icon: TECH_ICON_MAP.docker, label: "Docker" }, outer: { Icon: TECH_ICON_MAP.kubernetes, label: "Kubernetes" } },
  { inner: { Icon: TECH_ICON_MAP.figma, label: "Figma" }, outer: { Icon: TECH_ICON_MAP.tailwind, label: "Tailwind CSS" } },
  { inner: { Icon: TECH_ICON_MAP.typescript, label: "TypeScript" }, outer: { Icon: TECH_ICON_MAP.vercel, label: "Vercel" } },
];

/** Middle ring: own spokes, rotates counter-clockwise. */
const TECH_HERO_MIDDLE: TechOrbitGlyph[] = [
  { Icon: TECH_ICON_MAP.zapier, label: "Zapier" },
  { Icon: TECH_ICON_MAP.make, label: "Make" },
  { Icon: TECH_ICON_MAP.google_apps_script, label: "Google" },
  { Icon: TECH_ICON_MAP.langchain, label: "LangChain" },
  { Icon: TECH_ICON_MAP.githubcopilot, label: "GitHub Copilot" },
  { Icon: TECH_ICON_MAP.javascript, label: "JavaScript" },
  { Icon: TECH_ICON_MAP.redis, label: "Redis" },
  { Icon: TECH_ICON_MAP.graphql, label: "GraphQL" },
  { Icon: TECH_ICON_MAP.stripe, label: "Stripe" },
  { Icon: TECH_ICON_MAP.mongodb, label: "MongoDB" },
];

function OrbitSpoke({
  angleDeg,
  radiusVar,
  reduced,
}: {
  angleDeg: number;
  radiusVar: OrbitRadiusVar;
  reduced: boolean;
}) {
  const pause = (SPOKE_TRAIN_DOTS - 1) * SPOKE_LEG_SEC;
  const cycle = SPOKE_TRAIN_DOTS * SPOKE_LEG_SEC;
  const phase = useMemo(() => Math.random() * cycle, []);

  return (
    <div
      className="ndx-hero-orbit-spoke pointer-events-none absolute left-1/2 top-1/2"
      style={{
        height: `calc(var(${radiusVar}) - var(--ndx-hero-hub-rim))`,
        transformOrigin: "50% 100%",
        transform: `translate(-50%, -100%) rotate(${angleDeg}deg) translateY(calc(-1 * var(--ndx-hero-hub-rim)))`,
      }}
    >
      {Array.from({ length: SPOKE_TRAIN_DOTS }, (_, di) => (
        <motion.span
          key={di}
          className="ndx-hero-orbit-dot absolute left-1/2 block size-[4.5px] -translate-x-1/2 rounded-full sm:size-[5.5px]"
          animate={
            reduced
              ? {}
              : {
                  bottom: ["10%", "90%", "90%"],
                  opacity: [0, 1, 0],
                }
          }
          transition={
            reduced
              ? { duration: 0 }
              : {
                  duration: SPOKE_LEG_SEC,
                  delay: phase + di * SPOKE_LEG_SEC,
                  repeat: Infinity,
                  repeatDelay: pause,
                  ease: "linear",
                  times: [0, 0.92, 1],
                }
          }
        />
      ))}
    </div>
  );
}

function OrbitTechInteractiveIcon({
  angleDeg,
  radiusVar,
  Icon,
  label,
  orbitId,
  activeOrbitId,
  onToggleOrbit,
}: {
  angleDeg: number;
  radiusVar: OrbitRadiusVar;
  Icon: IconType;
  label: string;
  orbitId: string;
  activeOrbitId: string | null;
  onToggleOrbit: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isActive = activeOrbitId === orbitId;
  const showLabel = isActive || hovered;

  return (
    <div
      className="pointer-events-auto absolute left-1/2 top-1/2 z-[3]"
      style={{
        width: "var(--ndx-hero-icon-box)",
        height: "var(--ndx-hero-icon-box)",
        transform: `translate(-50%, -50%) rotate(${angleDeg}deg) translateY(calc(-1 * var(${radiusVar}))) rotate(${-angleDeg}deg)`,
      }}
    >
      <div className="relative h-full w-full">
        <button
          type="button"
          className="ndx-hero-orbit-icon--ghost ndx-hero-orbit-icon--ghost-interactive flex h-full w-full items-center justify-center"
          aria-label={label}
          aria-pressed={isActive}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          onClick={() => onToggleOrbit(orbitId)}
        >
          <Icon size={TECH_ORBIT_ICON_GLYPH} aria-hidden />
        </button>
        <span
          className={`ndx-hero-orbit-label pointer-events-none absolute left-1/2 top-full z-[2] mt-0.5 max-w-[5rem] -translate-x-1/2 truncate text-center text-[6px] uppercase leading-tight tracking-[0.12em] sm:max-w-[5.5rem] sm:text-[7px] sm:tracking-[0.14em] ${showLabel ? "opacity-100" : "opacity-0"}`}
          aria-hidden={!showLabel}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function TechnologyHeroSurface({
  reduced,
  liteMotion,
}: {
  reduced: boolean;
  /** Skip blurred bloom layer on constrained GPUs */
  liteMotion?: boolean;
}) {
  const theme = useDataTheme();
  const hubMark = HERO_HUB_MARKS[theme] ?? logoWhite;
  const [activeOrbitId, setActiveOrbitId] = useState<string | null>(null);

  const toggleOrbit = useCallback((id: string) => {
    setActiveOrbitId((prev) => (prev === id ? null : id));
  }, []);

  const ringTransition = (durationSec: number) =>
    reduced ? { duration: 0 } : { duration: durationSec, repeat: Infinity, ease: "linear" as const };

  const orbitTracks: { r: OrbitRadiusVar; opacity: number }[] = [
    { r: "--ndx-hero-orbit-a", opacity: 0.62 },
    { r: "--ndx-hero-orbit-b", opacity: 0.54 },
    { r: "--ndx-hero-orbit-c", opacity: 0.48 },
  ];

  const pairedCwDur = 118;
  const middleCcwDur = 76;

  const nPaired = TECH_HERO_PAIRED.length;
  const nMid = TECH_HERO_MIDDLE.length;

  return (
    <div
      className={`ndx-hero-surface ndx-hero-surface--tech-wheel relative mx-auto aspect-square w-full overflow-hidden max-w-[min(100%,26rem)] sm:max-w-[min(100%,34rem)] lg:max-w-[min(100%,48rem)] xl:max-w-[min(100%,58rem)] min-[1400px]:max-w-[min(100%,min(78rem,94vw))] 2xl:max-w-[min(100%,min(82rem,94vw))]${liteMotion ? " ndx-hero-surface--tech-wheel-lite" : ""}`}
    >
      <div className="ndx-hero-wheel-bg-glow" aria-hidden />

      {orbitTracks.map((t) => (
        <div
          key={t.r}
          className="ndx-hero-orbit-track pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: `calc(2 * var(${t.r}))`,
            height: `calc(2 * var(${t.r}))`,
            opacity: t.opacity,
          }}
          aria-hidden
        />
      ))}

      {/* Rings 1 (inner) + 3 (outer): shared spokes to outer radius, clockwise */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1] origin-center"
        animate={reduced ? {} : { rotate: 360 }}
        transition={ringTransition(pairedCwDur)}
      >
        {TECH_HERO_PAIRED.map((pair, i) => {
          const angleDeg = (360 / nPaired) * i - 90;
          return (
            <React.Fragment key={`tech-pair-${i}`}>
              <OrbitSpoke angleDeg={angleDeg} radiusVar="--ndx-hero-orbit-a" reduced={reduced} />
              <OrbitTechInteractiveIcon
                angleDeg={angleDeg}
                radiusVar="--ndx-hero-orbit-c"
                Icon={pair.inner.Icon}
                label={pair.inner.label}
                orbitId={`cw-${i}-inner`}
                activeOrbitId={activeOrbitId}
                onToggleOrbit={toggleOrbit}
              />
              <OrbitTechInteractiveIcon
                angleDeg={angleDeg}
                radiusVar="--ndx-hero-orbit-a"
                Icon={pair.outer.Icon}
                label={pair.outer.label}
                orbitId={`cw-${i}-outer`}
                activeOrbitId={activeOrbitId}
                onToggleOrbit={toggleOrbit}
              />
            </React.Fragment>
          );
        })}
      </motion.div>

      {/* Ring 2 (middle): own spokes, counter-clockwise */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1] origin-center"
        animate={reduced ? {} : { rotate: -360 }}
        transition={ringTransition(middleCcwDur)}
      >
        {TECH_HERO_MIDDLE.map((slot, i) => {
          const angleDeg = (360 / nMid) * i - 90;
          return (
            <React.Fragment key={`mid-${i}`}>
              <OrbitSpoke angleDeg={angleDeg} radiusVar="--ndx-hero-orbit-b" reduced={reduced} />
              <OrbitTechInteractiveIcon
                angleDeg={angleDeg}
                radiusVar="--ndx-hero-orbit-b"
                Icon={slot.Icon}
                label={slot.label}
                orbitId={`mid-${i}`}
                activeOrbitId={activeOrbitId}
                onToggleOrbit={toggleOrbit}
              />
            </React.Fragment>
          );
        })}
      </motion.div>

      <div
        className="ndx-hero-hub pointer-events-none absolute left-1/2 top-1/2 z-[2] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        aria-hidden
      >
        <div className="ndx-hero-hub__fill absolute inset-0 rounded-full border-2 border-solid backdrop-blur-[2px]" />
        <div
          className="pointer-events-none absolute inset-[5px] rounded-full border border-solid sm:inset-[6px]"
          style={{ borderColor: "var(--ndx-hero-wheel-hub-border-inner)" }}
        />
        <span className={`ndx-hero-hub__mark-wrap relative z-[1] ${reduced ? "" : "ndx-hero-hub__mark-wrap--spin"}`}>
          <img
            src={hubMark}
            alt=""
            width={44}
            height={44}
            className="h-9 w-9 object-contain sm:h-10 sm:w-10 min-[1400px]:h-11 min-[1400px]:w-11"
            draggable={false}
          />
        </span>
      </div>
    </div>
  );
}

function TechDisciplineGlyph({
  variant,
  Icon,
  ariaLabel,
}: {
  variant: "intro" | "section";
  Icon: IconType;
  ariaLabel: string;
}) {
  return (
    <div
      className={`ndx-tech-discipline-icon-cluster ndx-tech-discipline-icon-cluster--${variant}`}
      role="img"
      aria-label={ariaLabel}
    >
      <Icon className="ndx-tech-discipline-icon-cluster__glyph" style={{ color: "inherit" }} aria-hidden />
    </div>
  );
}

function ToolCard({ item, landingHref }: { item: TechItem; landingHref?: string }) {
  const reduced = useReducedMotion();
  const liteMotion = useLiteMotionProfile();
  const calmMotion = reduced || liteMotion;
  const Icon = TECH_ICON_MAP[item.iconKey];
  const card = (
    <motion.article
      className="ndx-card ndx-tech-tool-card"
      style={{ padding: 0, overflow: "hidden" }}
      whileHover={calmMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <div className="ndx-tech-tool-card__top">
        <div className="ndx-tech-tool-card__icon-wrap" aria-hidden={Icon ? true : undefined}>
          {Icon ? <Icon size={30} aria-hidden /> : <span className="ndx-tech-meta">{item.name.slice(0, 2)}</span>}
        </div>
        {item.since ? (
          <p className="ndx-tech-meta ndx-tech-tool-card__since-corner">
            Since <span className="ndx-tech-tool-card__since-year">{item.since}</span>
          </p>
        ) : null}
      </div>

      <div className="ndx-tech-tool-card__body">
        <p className="ndx-tech-meta">{item.role}</p>
        <h3 className="ndx-tech-name ndx-tech-tool-card__title" style={{ fontSize: "1.05rem" }}>
          {item.name}
        </h3>
        <p className="ndx-tech-blurb ndx-tech-tool-card__blurb">{item.blurb}</p>
        <div className="ndx-tech-arrow ndx-tech-tool-card__arrow">{landingHref ? "View page →" : "→"}</div>
      </div>
    </motion.article>
  );

  if (landingHref) {
    return (
      <Link to={landingHref} className="ndx-tech-tool-card-link">
        {card}
      </Link>
    );
  }

  return card;
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
  const liteMotion = useLiteMotionProfile();
  const calmHeroMotion = !!reduced || liteMotion;
  const groups = technologyGroups as TechGroup[];

  const totalTools = useMemo(() => groups.reduce((sum, g) => sum + g.items.length, 0), [groups]);
  const disciplineCount = groups.length;

  const heroStatRows = useMemo(() => {
    const pick = (id: string) => groups.find((g) => g.id === id);
    const ai = pick("ai");
    const auto = pick("automation");
    const fe = pick("frontend");
    const be = pick("backend");
    return [
      { label: "Curated tools", value: String(totalTools) },
      { label: "Disciplines", value: String(disciplineCount) },
      { label: "AI & Intelligence", value: ai ? String(ai.items.length) : "—" },
      { label: "Automation & Workflows", value: auto ? String(auto.items.length) : "—" },
      { label: "Frontend frameworks", value: fe ? String(fe.items.length) : "—" },
      { label: "Backends & APIs", value: be ? String(be.items.length) : "—" },
    ];
  }, [groups, totalTools, disciplineCount]);

  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://balochdev.com/technologies#webpage",
          name: "Technologies — BalochDev",
          description:
            "BalochDev technology stack: AI models including OpenAI, Anthropic, Gemini, Groq, and Grok — paired with React, Next.js, Flutter, Supabase, Postgres, automation (n8n, Make, Apps Script), and deploy targets such as Vercel and Cloudflare.",
          url: "https://balochdev.com/technologies",
        },
        {
          "@type": "FAQPage",
          "@id": "https://balochdev.com/technologies#faq",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        },
      ],
    }),
    [faqItems],
  );

  usePageMeta({
    title: "Technologies — BalochDev",
    description:
      "BalochDev stack: frontier AI APIs, React and Next.js, Flutter, Supabase and Firebase, automation, and production deploy patterns — curated for real client work.",
    path: "/technologies",
    keywords: [
      "web development stack",
      "React developers",
      "Next.js agency",
      "AI integration",
      "OpenAI API",
      "Supabase Postgres",
      "Flutter app development",
      "DevOps CI/CD",
      "technology consulting",
    ],
    jsonLd,
  });

  return (
    <section className="ndx-section ndx-page-rich ndx-page-rich--technologies">
      <div className="ndx-container">
        <motion.div
          className="ndx-rich-pill ndx-rich-pill--minimal"
          initial={calmHeroMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: calmHeroMotion ? 0 : 0.55 }}
        >
          <span className="ndx-rich-pill-dot" aria-hidden />
          Technologies · {totalTools} tools · {disciplineCount} disciplines
        </motion.div>

        <div className="ndx-rich-hero ndx-rich-hero--tech-with-metrics">
          <div className="ndx-rich-hero__copy">
            <motion.h1
              className="ndx-h1"
              initial={calmHeroMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: calmHeroMotion ? 0 : 0.65, delay: calmHeroMotion ? 0 : 0.06 }}
            >
              Software built with <em>technologies</em> you can trust.
            </motion.h1>
            <motion.p
              className="ndx-lead"
              style={{ maxWidth: "62ch" }}
              initial={calmHeroMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: calmHeroMotion ? 0 : 0.6, delay: calmHeroMotion ? 0 : 0.14 }}
            >
              This is our working library — not a trophy wall. We pair frontier model APIs with React, Next.js, Flutter, Supabase, Postgres,
              automation (n8n, Make, Zapier, Apps Script, MCP), and edge-ready hosting. Below, every group lists tools we actually ship, with
              short blurbs drawn from the same language we use in proposals.
            </motion.p>
            <motion.div
              className="ndx-rich-actions"
              initial={calmHeroMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: calmHeroMotion ? 0 : 0.6, delay: calmHeroMotion ? 0 : 0.22 }}
            >
              <Link to="/contact" className="ndx-btn ndx-btn-primary">
                Get in touch →
              </Link>
              <a href="#tech-stack" className="ndx-btn">
                See the stack
              </a>
            </motion.div>
          </div>
          <motion.div
            className="ndx-rich-hero__viz"
            initial={calmHeroMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: calmHeroMotion ? 0 : 0.75, delay: calmHeroMotion ? 0 : 0.1 }}
          >
            <TechnologyHeroSurface reduced={calmHeroMotion} liteMotion={liteMotion} />
          </motion.div>
          <motion.div
            className="ndx-rich-hero__metrics"
            initial={calmHeroMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: calmHeroMotion ? 0 : 0.55, delay: calmHeroMotion ? 0 : 0.26 }}
          >
            <div className="ndx-tech-hero-stats-strip" role="region" aria-label="Technology overview metrics">
              {heroStatRows.map((row) => (
                <div key={row.label} className="ndx-tech-hero-stats-strip__cell">
                  <span className="ndx-tech-hero-stats-strip__label">{row.label}</span>
                  <span className="ndx-tech-hero-stats-strip__value">{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div id="tech-stack" className="ndx-rich-block scroll-mt-24">
          <div className="ndx-rich-split-head ndx-tech-discipline-intro">
            <div className="ndx-rich-split-head__lead">
              <div className="ndx-tech-discipline-intro__head-row">
                <p className="ndx-tech-meta">By discipline</p>
              </div>
              <h2 className="ndx-h2 ndx-rich-split-head__title">Tools grouped the way we scope work.</h2>
              <p className="ndx-group-sub ndx-rich-split-head__text">
                Each card is a real vendor or pattern from our playbooks — AI, automation, frontends, backends, data, no-code when speed wins,
                languages we hand-write, deploy targets, and design handoff.
              </p>
            </div>
            <div className="ndx-tech-discipline-visual-wrap">
              <TechDisciplineGlyph
                variant="intro"
                Icon={TECH_DISCIPLINE_GENERAL_ICON_INTRO}
                ariaLabel="Artificial intelligence, models, and compute in modern web and product software."
              />
            </div>
          </div>

          <div className="ndx-tech-groups">
            {groups.map((section, idx) => (
              <div
                key={section.id}
                className="ndx-tech-groups__section"
                style={idx === 0 ? undefined : { borderTop: "1px solid var(--ndx-border)", paddingTop: "1.35rem", marginTop: "0.15rem" }}
              >
                {TECH_SECTION_IDS_WITH_SIDE_VISUAL.has(section.id) ? (
                  <div className={`ndx-rich-split-head ndx-tech-section-intro ndx-tech-section-intro--${section.id}`}>
                    <div className="ndx-rich-split-head__lead">
                      <div className="ndx-tech-section-intro__index-tools">
                        <div className="ndx-tech-section-intro__num">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <p className="ndx-tech-meta">{section.items.length} tools</p>
                      </div>
                      <h3 className="ndx-h2 ndx-rich-split-head__title" style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.85rem)" }}>
                        {section.title}
                      </h3>
                      <p className="ndx-group-sub ndx-rich-split-head__text" style={{ marginTop: "0.5rem" }}>
                        {section.subtitle}
                      </p>
                    </div>
                    <div className="ndx-tech-discipline-visual-wrap ndx-tech-discipline-visual-wrap--section">
                      <TechDisciplineGlyph
                        variant="section"
                        Icon={
                          TECH_DISCIPLINE_GENERAL_ICON_BY_SECTION[section.id] ?? TECH_DISCIPLINE_GENERAL_ICON_INTRO
                        }
                        ariaLabel={`Category: ${section.title}`}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="ndx-group-head" style={{ paddingTop: idx === 0 ? "0.25rem" : undefined }}>
                    <div
                      style={{
                        fontFamily: "var(--ndx-font-serif)",
                        fontSize: "clamp(2rem, 4vw, 3rem)",
                        fontStyle: "italic",
                        color: "var(--ndx-accent)",
                        marginBottom: "0.35rem",
                      }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <p className="ndx-tech-meta">{section.items.length} tools</p>
                    <h3 className="ndx-h2" style={{ fontSize: "clamp(1.2rem, 2.2vw, 1.85rem)", marginBottom: "0.35rem" }}>
                      {section.title}
                    </h3>
                    <p className="ndx-group-sub" style={{ marginTop: 0, marginBottom: 0 }}>
                      {section.subtitle}
                    </p>
                  </div>
                )}
                <div className="ndx-rich-service-grid">
                  {section.items.map((item) => (
                    <ToolCard
                      key={`${section.id}-${item.name}`}
                      item={item}
                      landingHref={stackToolLandingPath(section.id, item.iconKey)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ndx-rich-block">
          <div className="ndx-rich-prose ndx-rich-prose--start">
            <p className="ndx-tech-meta">Principles</p>
            <h2 className="ndx-h2">How we pick from this menu.</h2>
          </div>
          <div className="ndx-principles" style={{ marginTop: "1.5rem" }}>
            {principles.map((p) => (
              <div key={p.n} className="ndx-principle">
                <div
                  style={{
                    fontFamily: "var(--ndx-font-serif)",
                    fontSize: "2rem",
                    fontStyle: "italic",
                    color: "var(--ndx-accent)",
                    marginBottom: "0.35rem",
                  }}
                >
                  {p.n}
                </div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="ndx-rich-block">
          <div className="ndx-rich-prose ndx-rich-prose--start">
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

        <div id="recent-work" className="ndx-rich-block scroll-mt-24">
          <RichSectionIntro eyebrow="Recent work" title="What shipping looks like">
            Representative project shapes — case studies and credits live on the portfolio.
          </RichSectionIntro>
          <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            <Link to="/portfolio" className="ndx-btn">
              Full portfolio →
            </Link>
          </div>
          <div className="ndx-card-grid" style={{ marginTop: "1.5rem" }}>
            {selectedWorkTeasers.map((item, index) => (
              <Link key={item.title} to="/portfolio" className="ndx-card ndx-card-link" style={{ overflow: "hidden", padding: 0, display: "block" }}>
                <div
                  style={{
                    position: "relative",
                    height: "11rem",
                    background: `linear-gradient(135deg, color-mix(in srgb, var(--ndx-accent) 26%, transparent), color-mix(in srgb, var(--ndx-accent-2) 18%, transparent), color-mix(in srgb, var(--ndx-bg) 72%, transparent))`,
                  }}
                >
                  <span className="ndx-pill" style={{ position: "absolute", left: "1.1rem", top: "1.1rem", color: "var(--ndx-accent)" }}>
                    {item.tag}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      right: "1.1rem",
                      bottom: "1rem",
                      fontFamily: "var(--ndx-font-serif)",
                      fontSize: "2.5rem",
                      fontStyle: "italic",
                      opacity: 0.45,
                    }}
                  >
                    0{index + 1}
                  </span>
                </div>
                <div style={{ padding: "1.35rem" }}>
                  <h3>{item.title}</h3>
                  <p className="ndx-tech-blurb" style={{ marginTop: "0.35rem" }}>
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div id="partners" className="ndx-rich-block scroll-mt-24">
          <RichSectionIntro eyebrow="Collaborators" title="Organizations we’ve shipped with">
            Language, publishing, AI platforms, and digital partners — hover a mark for its name; click to open the official site.
          </RichSectionIntro>
          <PartnerBrandsGrid />
        </div>

        <div className="ndx-rich-block">
          <div className="ndx-rich-prose ndx-rich-prose--start">
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
