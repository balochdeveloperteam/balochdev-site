import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroGraphBackground from '../components/home/HeroGraphBackground';
import RecognitionBadges from '../components/home/RecognitionBadges';
import ClientStories from '../components/home/ClientStories';
import PartnerBrandsGrid from '../components/PartnerBrandsGrid';
import AiEstimatePromo from '../components/AiEstimatePromo';
import SocialLinksRow from '../components/SocialLinksRow';
import BookCallButton from '../components/bookCall/BookCallButton';
import FaqAccordion, { faqPageJsonLd } from '../components/FaqAccordion';
import Seo from '../seo/Seo';
import { organizationJsonLd } from '../seo/siteSeo';
import projects from '../data/projects';
import { HOME_FAQS } from '../data/homeFaqs';
import { TEAM_MEMBERS } from '../data/team.js';

/** Face stack for the “Why it works” team card (photos only). */
const WHY_TEAM_FACES = TEAM_MEMBERS.filter((m) => m.image).slice(0, 8);

/** Short alt for team photos — ~name + role, not full bios. */
function teamPhotoAlt(name, role) {
  const short = String(role || '')
    .split(/[&/]/)[0]
    .replace(/\(.*?\)/g, '')
    .trim()
    .toLowerCase();
  return `${name} — ${short}, BalochDev`;
}

const HERO_WORDS = ['clarity.', 'speed.', 'craft.', 'trust.', 'impact.'];

const HERO_AVATARS = [
  { initials: 'AR', tone: '#ff6b4a' },
  { initials: 'MK', tone: '#7c5cff' },
  { initials: 'SB', tone: '#22c55e' },
  { initials: 'JL', tone: '#0ea5e9' },
  { initials: 'ND', tone: '#f59e0b' },
  { initials: '50+', tone: '#ff6b4a', plus: true },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
}

function useRotatingWord(words, reducedMotion) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (reducedMotion || words.length < 2) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [words, reducedMotion]);
  return words[index] ?? words[0];
}

const RECORD_STATS = [
  { label: 'Repeat clients', value: '80', suffix: '%' },
  { label: 'Biggest launch', value: '$330K', suffix: null },
  { label: 'Projects', value: '80', suffix: '+' },
  {
    label: 'Fiverr + Upwork · Clutch · Trustpilot · GoodFirms',
    value: '5.0',
    suffix: '/ 5',
  },
];

const SERVICES = [
  {
    to: '/apps',
    title: 'Mobile applications',
    desc: 'Native-quality experiences: React Native / Flutter patterns, stores, and offline-ready flows.',
    tag: 'Mobile',
    icon: 'bx-mobile-alt',
  },
  {
    to: '/services/web',
    title: 'Websites',
    desc: 'Marketing sites, landing systems, and content architectures tuned for SEO and Core Web Vitals.',
    tag: 'Web',
    icon: 'bx-globe',
  },
  {
    to: '/services/web',
    title: 'Web applications',
    desc: 'Dashboards, internal tools, and multi-role products on React with secure APIs.',
    tag: 'App',
    icon: 'bx-grid-alt',
  },
  {
    to: '/services/chatbots',
    title: 'Chatbots',
    desc: 'Support bots and assistants grounded in your docs with traces, evals, and guardrails.',
    tag: 'Chat',
    icon: 'bx-bot',
  },
  {
    to: '/contact',
    title: 'Large-scale applications',
    desc: 'Event-driven backends, multi-tenant data, and reliability patterns for serious traffic.',
    tag: 'Scale',
    icon: 'bx-server',
  },
  {
    to: '/services/ecommerce',
    title: 'E-commerce',
    desc: 'Shopify to headless commerce — catalogs, checkout, subscriptions, and ops integrations.',
    tag: 'Commerce',
    icon: 'bx-cart-alt',
  },
  {
    to: '/services/rag-llm',
    title: 'LLM integration',
    desc: 'RAG, custom models, and agent workflows inside your existing product — not a bolt-on demo.',
    tag: 'AI',
    icon: 'bx-brain',
  },
  {
    to: '/projects/soroz',
    title: 'Soroz AI',
    desc: 'Coming soon — multilingual AI music generation, stronger where global tools fall short. Featured product by BalochDev.',
    tag: 'Featured',
    icon: 'bx-music',
    featured: true,
  },
];

const FLOW_STEPS = [
  {
    n: '01',
    title: 'Discord kickoff',
    text: 'We lock goals and constraints, then open a Discord for files, decisions, and every project update in one place.',
    meta: 'DAY 0 · DISCORD',
    icon: 'bxl-discord-alt',
  },
  {
    n: '02',
    title: 'Design & share',
    text: 'We design the flows, share details for feedback, then start building once you’re aligned — no guesswork.',
    meta: 'WEEK 1 · DESIGN',
    icon: 'bx-palette',
  },
  {
    n: '03',
    title: 'Preview & ship',
    text: 'You review a live preview, request revisions or go final. We test, build, and deploy when it’s ready.',
    meta: 'WEEK 1–N · PREVIEW',
    icon: 'bx-rocket',
  },
  {
    n: '04',
    title: 'Support & growth',
    text: 'First-week checks, SEO and maintenance docs, growth guides — or keep us on for ongoing care.',
    meta: 'ONGOING · SUPPORT',
    icon: 'bx-shield-quarter',
  },
];

const RECENT_WORK_META = [
  {
    slug: 'soroz',
    stack: ['LLM', 'Music AI', 'Studio'],
    size: 'wide',
    imageIndex: 2,
    fit: 'contain',
  },
  {
    slug: 'shabash',
    stack: ['NestJS', 'Next.js', 'Supabase'],
    size: 'side',
    imageIndex: 0,
    fit: 'contain',
    blurb:
      'Custom Bahrain storefront, admin, and NestJS API — rewards, BenefitPay, Apple Pay, and bilingual AR/EN after Shopify outgrew the brand.',
  },
  {
    slug: 'mango-restaurant',
    stack: ['React', 'Firebase', 'PWA'],
    size: 'base',
    imageIndex: 1,
    fit: 'contain',
  },
  {
    slug: 'theory-of-you',
    stack: ['Next.js', 'Supabase', 'Stripe'],
    size: 'base',
    imageIndex: 0,
    fit: 'contain',
  },
  {
    slug: 'iinta',
    stack: ['Shopify', 'Liquid', 'Payments'],
    size: 'base',
    imageIndex: 0,
    fit: 'contain',
  },
];

const RECENT_WORK = RECENT_WORK_META.map((meta, index) => {
  const p = projects.find((item) => item.slug === meta.slug);
  if (!p?.slug) return null;
  const gallery = p.images?.length ? p.images : p.cover ? [p.cover] : [];
  const homeCover = gallery[meta.imageIndex] ?? gallery[0] ?? p.cover;
  const category = (p.industry.split('·')[0] || p.industry).trim().toUpperCase();
  const source = meta.blurb || p.tagline;
  const maxLen = meta.size === 'wide' ? 120 : 110;
  const desc = source.length > maxLen ? `${source.slice(0, maxLen - 1).trim()}…` : source;
  return {
    slug: p.slug,
    title: p.title,
    desc,
    cover: homeCover,
    category,
    stack: meta.stack,
    size: meta.size,
    fit: meta.fit,
    focus: meta.focus ?? 'center',
    underDevelopment: Boolean(p.underDevelopment),
    n: String(index + 1).padStart(2, '0'),
  };
}).filter(Boolean);

const WHY_PROTECTED = [
  { label: 'Code ownership', value: 'Your repo · day 1' },
  { label: 'Global agreements', value: 'SOW · NDA · clear scope' },
  { label: 'Confidentiality', value: 'Client work stays yours' },
];

const WHY_STACK = [
  { label: 'Web', value: 'React · Next.js · NestJS' },
  { label: 'Mobile', value: 'React Native · Flutter' },
  { label: 'AI', value: 'RAG · agents · LLMs' },
  { label: 'Cloud', value: 'Supabase · Cloudflare' },
];

const WHY_PAY = [
  { label: 'Milestones', value: 'Fixed checkpoints · no surprise invoices' },
  { label: 'Prepayment', value: 'Deposit + SOW before kickoff' },
  { label: 'Freelance platforms', value: 'Upwork · Fiverr when you prefer' },
];

const WHY_MEET = [
  'Qatar',
  'Dubai',
  'Bahrain',
  'Russia',
  'Balochistan',
  'Iran',
];

const MARQUEE_ROW1 = [
  'bxl-react',
  'bxl-typescript',
  'bxl-nodejs',
  'bxl-python',
  'bxl-flutter',
  'bxl-docker',
  'bxl-postgresql',
  'bxl-mongodb',
  'bxl-firefox',
  'bxl-tailwind-css',
];
const MARQUEE_ROW2 = [
  'bx-chip',
  'bx-brain',
  'bx-code-alt',
  'bx-cloud',
  'bx-data',
  'bx-bot',
  'bx-extension',
  'bx-line-chart',
  'bx-wrench',
  'bx-layout',
];
const MARQUEE_ROW3 = [
  'bxl-vuejs',
  'bxl-google',
  'bx-server',
  'bx-git-branch',
  'bx-code-block',
  'bx-layer',
  'bxl-html5',
  'bxl-css3',
  'bxl-javascript',
  'bxl-git',
];

function MarqueeRow({ reverse, icons, labels }) {
  const segment = (suffix) =>
    icons.map((iconClass, i) => (
      <span key={`${suffix}-${iconClass}-${i}`} className="ndx-home-marquee__item">
        <i className={iconClass} aria-hidden />
        <span>{labels?.[i] ?? ''}</span>
      </span>
    ));
  return (
    <div className={`ndx-home-marquee__viewport ${reverse ? 'ndx-home-marquee__viewport--rev' : ''}`}>
      <div className="ndx-home-marquee__track">
        {segment('m0')}
        {segment('m1')}
      </div>
    </div>
  );
}

export default function NHome() {
  const reducedMotion = usePrefersReducedMotion();
  const rotatingWord = useRotatingWord(HERO_WORDS, reducedMotion);

  const r1Labels = ['React', 'TypeScript', 'Node', 'Python', 'Flutter', 'Docker', 'Postgres', 'Mongo', 'WebGPU', 'Tailwind'];
  const r2Labels = ['RAG', 'Agents', 'Code', 'Edge', 'Data', 'Bots', 'Plugins', 'Analytics', 'DevOps', 'UI'];
  const r3Labels = ['Vue', 'GCP', 'Linux', 'Flow', 'Graph', 'React', 'HTML5', 'CSS', 'JS', 'Git'];

  return (
    <div className="ndx-home">
      <Seo
        title="BalochDev — AI, Web & Mobile Development Studio"
        description="BalochDev builds AI-native products, web and mobile apps, RAG systems and chatbots for global clients — plus open Balochi language technology."
        canonicalPath="/"
        jsonLd={[organizationJsonLd, faqPageJsonLd(HOME_FAQS)]}
      />
      <section className="ndx-home-hero">
        <HeroGraphBackground reducedMotion={reducedMotion} />
        <div className="ndx-home-hero__veil" aria-hidden />
        <div className="ndx-home-hero__content ndx-container">
          <p className="ndx-home-hero__eyebrow">
            <span className="ndx-home-hero__dot" />
            BalochDev · AI engineering studio
          </p>
          <h1 className="ndx-home-hero__h1">
            Software at the speed of <em>ideas</em> —{' '}
            <span className="ndx-home-hero__accent ndx-home-hero__rotate" key={rotatingWord}>
              {rotatingWord}
            </span>
          </h1>
          <p className="ndx-home-hero__lead">
            We design and ship AI-native products, multilingual experiences, and cloud-ready platforms. One team, clear
            communication, production patterns borrowed from the best global products.
          </p>
          <div className="ndx-home-hero__actions">
            <Link to="/estimate/" className="ndx-btn ndx-btn-primary ndx-home-hero__btn">
              AI estimate
            </Link>
            <BookCallButton className="ndx-btn ndx-home-hero__btn">Book a call</BookCallButton>
            <Link to="/portfolio/" className="ndx-btn ndx-home-hero__btn ndx-home-hero__btn--ghost">
              View work
            </Link>
          </div>

          <div className="ndx-home-hero__proof">
            <div className="ndx-home-hero__avatars" aria-hidden>
              {HERO_AVATARS.map((a) => (
                <span
                  key={a.initials}
                  className={`ndx-home-hero__avatar${a.plus ? ' ndx-home-hero__avatar--plus' : ''}`}
                  style={{ background: `color-mix(in srgb, ${a.tone} 78%, #111)` }}
                >
                  {a.initials}
                </span>
              ))}
            </div>
            <div className="ndx-home-hero__proof-copy">
              <p className="ndx-home-hero__stars" aria-label="5.0 out of 5 stars">
                ★★★★★ <strong>5.0</strong>
              </p>
              <p className="ndx-home-hero__proof-text">
                80+ Founders &amp; Startups · Fiverr + Upwork + Brand Partners
              </p>
            </div>
          </div>

          <div className="ndx-home-hero__social">
            <SocialLinksRow
              className="ndx-social-links--hero"
              label="Studio Presence"
              showLabel
            />
          </div>
        </div>

        <div className="ndx-home-record ndx-home-record--in-hero" aria-label="The record">
          <div className="ndx-container ndx-home-record__inner">
            <p className="ndx-home-record__kicker">
              <span className="ndx-home-record__dot" aria-hidden />
              The record · 2024 → 2026 · Built in public
            </p>
            <div className="ndx-home-record__grid" role="list">
              {RECORD_STATS.map((stat) => (
                <div key={stat.label} className="ndx-home-record__stat" role="listitem">
                  <span className="ndx-home-record__label">{stat.label}</span>
                  <span className="ndx-home-record__value">
                    <span className="ndx-home-record__numeral">{stat.value}</span>
                    {stat.suffix ? (
                      <span className="ndx-home-record__suffix">{stat.suffix}</span>
                    ) : null}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ndx-section ndx-home-recog" aria-label="Awards and recognition">
        <div className="ndx-container">
          <p className="ndx-eyebrow">Recognition · Trusted worldwide</p>
          <p className="ndx-home-recog__lead">
            Certified Shopify Partner. Top Rated on Fiverr. 5.0 across Clutch, Upwork, Trustpilot &amp; GoodFirms.
          </p>
          <RecognitionBadges />
          <p className="ndx-home-recog__foot">
            Clutch · Trustpilot · Upwork · GoodFirms — aggregate <strong>5.0 / 5</strong>
          </p>
        </div>
      </section>

      <section className="ndx-section ndx-section-tight ndx-home-services">
        <div className="ndx-container">
          <div className="ndx-home-services__head">
            <div>
              <p className="ndx-eyebrow">Services</p>
              <h2 className="ndx-h2">From mobile to LLMs — we ship the full surface</h2>
              <p className="ndx-group-sub">
                Apps, web, commerce, agents, and cultural AI — scoped with the same rigor as top product orgs.
              </p>
            </div>
            <Link to="/services/" className="ndx-btn ndx-btn-primary">
              All services
            </Link>
          </div>
          <div className="ndx-home-services__board">
            <div className="ndx-home-services__grid ndx-home-services__grid--8">
              {SERVICES.map((s) => (
                <Link
                  key={s.title}
                  to={s.to}
                  className={`ndx-home-service-card ${s.featured ? 'ndx-home-service-card--featured' : ''}`}
                >
                  <span className="ndx-home-service-card__body">
                    <span className="ndx-home-service-card__tag">{s.tag}</span>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <span className="ndx-home-service-card__more">
                      {s.featured ? 'Coming soon' : 'Details'}{' '}
                      <i className="bx bx-right-arrow-alt" aria-hidden />
                    </span>
                  </span>
                  <span className="ndx-home-service-card__icon" aria-hidden>
                    <i className={`bx ${s.icon}`} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <p className="ndx-home-services__foot">
            This is a snapshot — not the full catalogue.{' '}
            <Link to="/services/">See every service we offer →</Link>
          </p>
        </div>
      </section>

      <section className="ndx-section ndx-home-flow">
        <div className="ndx-container">
          <div className="ndx-home-flow__intro">
            <div className="ndx-home-flow__intro-copy">
              <p className="ndx-eyebrow">How we work</p>
              <h2 className="ndx-h2 ndx-home-flow__title">
                Four steps, <em>easy ship.</em>
              </h2>
            </div>
            <p className="ndx-home-flow__lead">
              From Discord kickoff to deploy and ongoing support — shared live, priced clearly, no mystery inbox.
            </p>
          </div>

          <div className="ndx-home-flow__steps">
            {FLOW_STEPS.map((s) => (
              <article key={s.n} className="ndx-home-flow-card">
                <div className="ndx-home-flow-card__body">
                  <span className="ndx-home-flow-card__n">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <span className="ndx-home-flow-card__meta">{s.meta}</span>
                </div>
                <span className="ndx-home-flow-card__icon" aria-hidden>
                  <i className={`bx ${s.icon}`} />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ndx-section ndx-section-tight ndx-home-recent">
        <div className="ndx-container">
          <div className="ndx-home-recent__intro">
            <div className="ndx-home-recent__intro-copy">
              <p className="ndx-eyebrow">Recent work</p>
              <h2 className="ndx-h2 ndx-home-recent__title">
                Real products, <em>real outcomes.</em>
              </h2>
            </div>
            <p className="ndx-home-recent__lead">
              Explore outcomes, not buzzwords — a slice of the 80+ builds we&apos;ve shipped for founders we still talk to.
            </p>
          </div>

          <div className="ndx-home-recent__grid">
            {RECENT_WORK.map((p) => (
              <Link
                key={p.slug}
                to={`/projects/${p.slug}/`}
                className={`ndx-home-recent-card ndx-home-recent-card--${p.size} ndx-home-recent-card--${p.slug}`}
              >
                <div
                  className={`ndx-home-recent-card__media ndx-home-recent-card__media--${p.fit}`}
                >
                  {p.cover ? (
                    <img
                      src={p.cover}
                      alt={`${p.title} — ${p.category}`}
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: p.focus }}
                    />
                  ) : null}
                  <span className="ndx-home-recent-card__shade" aria-hidden />
                  {p.underDevelopment ? (
                    <span className="ndx-home-recent-card__badge">Coming soon</span>
                  ) : null}
                </div>
                <div className="ndx-home-recent-card__body">
                  <div className="ndx-home-recent-card__meta">
                    <span>{p.category}</span>
                    <span className="ndx-home-recent-card__n">{p.n}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="ndx-home-recent-card__stack" aria-label="Stack">
                    {p.stack.map((tech, i) => (
                      <span key={tech}>
                        {i > 0 ? <span className="ndx-home-recent-card__dot" aria-hidden>·</span> : null}
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="ndx-home-recent__foot">
            <Link to="/portfolio/" className="ndx-btn">
              View all work
            </Link>
          </div>
        </div>
      </section>

      <AiEstimatePromo />

      <section className="ndx-section ndx-home-why">
        <div className="ndx-container">
          <div className="ndx-home-why__intro">
            <div className="ndx-home-why__intro-copy">
              <p className="ndx-eyebrow">About us · Why it works</p>
              <h2 className="ndx-h2 ndx-home-why__title">
                Senior team. <em>Honest timelines.</em>
              </h2>
            </div>
            <p className="ndx-home-why__lead">
              Technology that respects language, privacy, and pace — a remote-first studio from Balochistan shipping for
              clients worldwide.
            </p>
          </div>

          <div className="ndx-home-why__grid">
            <article className="ndx-home-why-card ndx-home-why-card--team">
              <p className="ndx-home-why-card__label">01 · The whole team</p>
              {/* aria-hidden: adjacent copy covers the team; avoid SR reading 8 names + “14”. Alts still clear Ahrefs. */}
              <div className="ndx-home-why-card__avatars" aria-hidden>
                {WHY_TEAM_FACES.map((m, i) => (
                  <span
                    key={m.name}
                    className="ndx-home-why-card__avatar ndx-home-why-card__avatar--photo"
                    style={{ zIndex: WHY_TEAM_FACES.length - i }}
                    title={m.name}
                  >
                    <img
                      src={m.image}
                      alt={teamPhotoAlt(m.name, m.role)}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                ))}
                <span className="ndx-home-why-card__avatar ndx-home-why-card__avatar--more">14</span>
              </div>
              <p className="ndx-home-why-card__quote">
                A senior remote core of fourteen — PMs, engineers, designers, and creators on every engagement. Same
                people from kickoff to launch. No anonymous subcontractors.
              </p>
            </article>

            <article className="ndx-home-why-card ndx-home-why-card--pace">
              <p className="ndx-home-why-card__label">02 · Pace</p>
              <div className="ndx-home-why-card__stat">
                <span className="ndx-home-why-card__stat-num">1.5</span>
                <span className="ndx-home-why-card__stat-unit">mo</span>
              </div>
              <p className="ndx-home-why-card__note">Typical MVP from signed brief to a deployable build — weekly demos in Discord.</p>
            </article>

            <article className="ndx-home-why-card ndx-home-why-card--meet">
              <p className="ndx-home-why-card__label">03 · Meet us</p>
              <h3 className="ndx-home-why-card__headline">Remote-first · in person where we are</h3>
              <p className="ndx-home-why-card__note">
                Video and Discord by default. When it helps, we meet clients where our team already works:
              </p>
              <ul className="ndx-home-why-card__places">
                {WHY_MEET.map((place) => (
                  <li key={place}>{place}</li>
                ))}
              </ul>
            </article>

            <article className="ndx-home-why-card ndx-home-why-card--protected">
              <p className="ndx-home-why-card__label">04 · Protected</p>
              <ul className="ndx-home-why-card__rows">
                {WHY_PROTECTED.map((row) => (
                  <li key={row.label}>
                    <strong>{row.label}</strong>
                    <span>{row.value}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="ndx-home-why-card ndx-home-why-card--stack">
              <p className="ndx-home-why-card__label">05 · Stack</p>
              <ul className="ndx-home-why-card__rows">
                {WHY_STACK.map((row) => (
                  <li key={row.label}>
                    <strong>{row.label}</strong>
                    <span>{row.value}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="ndx-home-why-card ndx-home-why-card--pay">
              <p className="ndx-home-why-card__label">06 · Payment</p>
              <ul className="ndx-home-why-card__rows">
                {WHY_PAY.map((row) => (
                  <li key={row.label}>
                    <strong>{row.label}</strong>
                    <span>{row.value}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="ndx-home-why__foot">
            <Link to="/about/" className="ndx-btn ndx-btn-primary">
              Full about us
            </Link>
          </div>
        </div>
      </section>

      <ClientStories />

      <section className="ndx-section ndx-section-tight ndx-home-marquee-section">
        <div className="ndx-container">
          <p className="ndx-eyebrow">Stack in motion</p>
          <h2 className="ndx-h2">Languages, AI primitives, and platforms we compose daily</h2>
        </div>
        <div className="ndx-home-marquee">
          <MarqueeRow icons={MARQUEE_ROW1.map((x) => `bx ${x}`)} labels={r1Labels} />
          <MarqueeRow reverse icons={MARQUEE_ROW2.map((x) => `bx ${x}`)} labels={r2Labels} />
          <MarqueeRow icons={MARQUEE_ROW3.map((x) => `bx ${x}`)} labels={r3Labels} />
        </div>
      </section>

      <section className="ndx-section ndx-section-tight ndx-home-faq" id="faq">
        <div className="ndx-container">
          <div className="ndx-home-faq__intro">
            <div className="ndx-home-faq__intro-copy">
              <p className="ndx-eyebrow">FAQ</p>
              <h2 className="ndx-h2 ndx-home-faq__title">
                Questions founders ask before they <em>ship with us.</em>
              </h2>
            </div>
            <p className="ndx-home-faq__lead">
              Straight answers on web development, AI chatbots, cost, timelines, and working with a global remote team.
            </p>
          </div>
          <FaqAccordion items={HOME_FAQS} />
        </div>
      </section>

      <section className="ndx-section ndx-home-partners">
        <div className="ndx-container ndx-home-partners__wrap">
          <p className="ndx-eyebrow ndx-home-partners__eyebrow">Partners &amp; clients</p>
          <h2 className="ndx-h2 ndx-home-partners__h2">Organizations we build with</h2>
          <p className="ndx-group-sub" style={{ margin: '-0.5rem auto 0', maxWidth: '40rem' }}>
            Academy partners, client brands, and platforms we ship beside — hover a logo for its name; click to open the site.
          </p>
          <PartnerBrandsGrid className="ndx-home-partners__logoGrid" />
        </div>
      </section>

      <section className="ndx-section ndx-section-tight ndx-home-about-cta">
        <div className="ndx-container ndx-home-about-cta__box">
          <div>
            <h2 className="ndx-h2">Ready when you are</h2>
            <p className="ndx-group-sub">
              Send a brief, ask for an estimate, or book a call — we respond with next steps, not a sales maze.
            </p>
          </div>
          <div className="ndx-home-about-cta__actions">
            <Link to="/proposal/" className="ndx-btn ndx-btn-primary">
              Send proposal
            </Link>
            <Link to="/technologies/" className="ndx-btn">
              Our stack
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
