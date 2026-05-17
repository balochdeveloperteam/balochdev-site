import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import VantaNetBackground from '../components/home/VantaNetBackground';
import PartnerBrandsGrid from '../components/PartnerBrandsGrid';
import Seo from '../seo/Seo';
import { organizationJsonLd } from '../seo/siteSeo';

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

const TRUSTED = [
  { icon: 'bx bxl-google', label: 'Google Cloud' },
  { icon: 'bx bxl-microsoft', label: 'Microsoft' },
  { icon: 'bx bxl-aws', label: 'AWS' },
  { icon: 'bx bx-grid-alt', label: 'Kubernetes' },
  { icon: 'bx bxl-stripe', label: 'Stripe' },
  { icon: 'bx bxl-figma', label: 'Figma' },
];

const SERVICES = [
  {
    to: '/apps',
    title: 'Mobile applications',
    desc: 'Native-quality experiences: React Native / Flutter patterns, stores, and offline-ready flows.',
    tag: 'Mobile',
  },
  {
    to: '/services/web',
    title: 'Websites',
    desc: 'Marketing sites, landing systems, and content architectures tuned for SEO and Core Web Vitals.',
    tag: 'Web',
  },
  {
    to: '/services/web',
    title: 'Web applications',
    desc: 'Dashboards, internal tools, and multi-role products on React with secure APIs.',
    tag: 'App',
  },
  {
    to: '/services/chatbots',
    title: 'Chatbots',
    desc: 'Support bots and assistants grounded in your docs with traces, evals, and guardrails.',
    tag: 'Chat',
  },
  {
    to: '/contact',
    title: 'Large-scale applications',
    desc: 'Event-driven backends, multi-tenant data, and reliability patterns for serious traffic.',
    tag: 'Scale',
  },
  {
    to: '/services',
    title: 'E-commerce',
    desc: 'Shopify to headless commerce — catalogs, checkout, subscriptions, and ops integrations.',
    tag: 'Commerce',
  },
  {
    to: '/services/rag-llm',
    title: 'LLM integration',
    desc: 'RAG, custom models, and agent workflows inside your existing product — not a bolt-on demo.',
    tag: 'AI',
  },
  {
    to: '/portfolio',
    title: 'Balochi AI music generation',
    desc: 'Our flagship culture-meets-AI build — generative music with Balochi-first UX (project #4).',
    tag: 'Featured',
    featured: true,
  },
];

const FLOW_STEPS = [
  {
    n: '01',
    channel: '#discovery',
    title: 'Kickoff in Slack',
    text: 'Goals, constraints, and a shared Notion or Canvas — everything dated and searchable.',
    chips: ['Scope doc', 'Risk log'],
  },
  {
    n: '02',
    channel: '#design-demos',
    title: 'Design & clickable previews',
    text: 'Figma + staged builds so stakeholders approve flows before we pour concrete.',
    chips: ['Weekly clip', 'API sketch'],
  },
  {
    n: '03',
    channel: '#ship-it',
    title: 'Build, review, deploy',
    text: 'Preview URLs per PR, automated checks, and staged rollouts (Cloudflare / Supabase-friendly).',
    chips: ['CI previews', 'Changelog'],
  },
  {
    n: '04',
    channel: '#handover',
    title: 'Launch & own the roadmap',
    text: 'Runbooks, admin training, and optional retainer — your team keeps the keys.',
    chips: ['Docs', 'Support'],
  },
];

const PROJECTS = [
  {
    slug: '/portfolio',
    title: 'Portfolio & case studies',
    desc: 'Selected product work across AI, dashboards, and multilingual apps.',
  },
  {
    slug: '/apps',
    title: 'Apps & platforms',
    desc: 'Mobile-friendly PWA patterns and admin tools you can run yourself.',
  },
  {
    slug: '/industries',
    title: 'Industries',
    desc: 'From local language tech to global SaaS — patterns we reuse safely.',
  },
];

const REVIEWS = [
  {
    quote: 'Clear scoping, fast iterations, and they actually understand RAG and product trade-offs.',
    who: 'Product lead',
    co: 'B2B SaaS',
  },
  {
    quote: 'Our Supabase + React stack was production-ready with RLS and docs we could hand to auditors.',
    who: 'CTO',
    co: 'Health tech startup',
  },
  {
    quote: 'Balochi keyboard and content workflows shipped without compromising performance.',
    who: 'Community org',
    co: 'Language & media',
  },
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

  const r1Labels = ['React', 'TypeScript', 'Node', 'Python', 'Flutter', 'Docker', 'Postgres', 'Mongo', 'WebGPU', 'Tailwind'];
  const r2Labels = ['RAG', 'Agents', 'Code', 'Edge', 'Data', 'Bots', 'Plugins', 'Analytics', 'DevOps', 'UI'];
  const r3Labels = ['Vue', 'GCP', 'Linux', 'Flow', 'Graph', 'React', 'HTML5', 'CSS', 'JS', 'Git'];

  return (
    <div className="ndx-home">
      <Seo
        title="BalochDev — AI, Web & Mobile Development Studio"
        description="BalochDev builds AI-native products, web and mobile apps, RAG systems and chatbots for global clients — plus open Balochi language technology. One focused team, production-grade delivery."
        canonicalPath="/"
        jsonLd={organizationJsonLd}
      />
      <section className="ndx-home-hero">
        <div className="ndx-home-vanta-scale">
          <div className="ndx-home-vanta-scale__inner">
            <VantaNetBackground
              className={`ndx-home-vanta ${reducedMotion ? 'ndx-home-vanta--off' : ''}`}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>
        <div className="ndx-home-hero__veil" aria-hidden />
        <div className="ndx-home-hero__blur" aria-hidden />
        <div className="ndx-home-hero__shadow" aria-hidden />
        <div className="ndx-home-hero__grid" aria-hidden />
        <div className="ndx-home-hero__content ndx-container">
          <p className="ndx-home-hero__eyebrow">
            <span className="ndx-home-hero__dot" />
            BalochDev · AI engineering studio
          </p>
          <h1 className="ndx-home-hero__h1">
            Software at the speed of <em>ideas</em> — <span className="ndx-home-hero__accent">without chaos.</span>
          </h1>
          <p className="ndx-home-hero__lead">
            We design and ship AI-native products, multilingual experiences, and cloud-ready platforms. One team, clear
            communication, production patterns borrowed from the best global products.
          </p>
          <div className="ndx-home-hero__actions">
            <Link to="/estimate" className="ndx-btn ndx-btn-primary ndx-home-hero__btn">
              AI estimate
            </Link>
            <Link to="/contact" className="ndx-btn ndx-home-hero__btn">
              Book a call
            </Link>
            <Link to="/portfolio" className="ndx-btn ndx-home-hero__btn ndx-home-hero__btn--ghost">
              View work
            </Link>
          </div>
          <p className="ndx-home-hero__hint">Scroll to see how we work — or jump in from the nav.</p>
        </div>
      </section>

      <section className="ndx-section ndx-home-trust">
        <div className="ndx-container">
          <p className="ndx-eyebrow">Trusted patterns</p>
          <p className="ndx-home-trust__title">Built with stacks teams already bet on</p>
          <div className="ndx-home-trust__row">
            {TRUSTED.map(({ icon, label }) => (
              <div key={label} className="ndx-home-trust__pill">
                <i className={`bx ${icon}`} aria-hidden />
                <span>{label}</span>
              </div>
            ))}
          </div>
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
            <Link to="/services" className="ndx-btn ndx-btn-primary">
              All services
            </Link>
          </div>
          <div className="ndx-home-services__grid ndx-home-services__grid--8">
            {SERVICES.map((s) => (
              <Link
                key={s.title}
                to={s.to}
                className={`ndx-home-service-card ${s.featured ? 'ndx-home-service-card--featured' : ''}`}
              >
                <span className="ndx-home-service-card__tag">{s.tag}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="ndx-home-service-card__more">
                  {s.featured ? 'See project' : 'Details'}{' '}
                  <i className="bx bx-right-arrow-alt" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ndx-section ndx-home-flow">
        <div className="ndx-container">
          <div className="ndx-home-flow__intro">
            <div>
              <p className="ndx-eyebrow">Delivery OS</p>
              <h2 className="ndx-h2">The same cadence you&apos;d expect in a top product team — in Slack.</h2>
              <p className="ndx-group-sub">
                Channels, written decisions, and demo clips — no mystery inbox. You always know what shipped and what&apos;s
                next.
              </p>
            </div>
            <div className="ndx-home-flow__slack-badge">
              <i className="bx bxl-slack" aria-hidden />
              <span>Slack-first collaboration</span>
            </div>
          </div>

          <div className="ndx-home-flow__board">
            <div className="ndx-home-flow__glow" aria-hidden />
            <div className="ndx-home-flow__rail" aria-hidden>
              <span className="ndx-home-flow__rail-dot" />
              <span className="ndx-home-flow__rail-line" />
              <span className="ndx-home-flow__rail-dot ndx-home-flow__rail-dot--end" />
            </div>
            <div className="ndx-home-flow__steps">
              {FLOW_STEPS.map((s) => (
                <article key={s.n} className="ndx-home-flow-card">
                  <header className="ndx-home-flow-card__top">
                    <span className="ndx-home-flow-card__n">{s.n}</span>
                    <span className="ndx-home-flow-card__channel">
                      <i className="bx bxl-slack" aria-hidden />
                      {s.channel}
                    </span>
                  </header>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  <ul className="ndx-home-flow-card__chips">
                    {s.chips.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ndx-section ndx-section-tight ndx-home-projects">
        <div className="ndx-container">
          <div className="ndx-home-services__head">
            <div>
              <p className="ndx-eyebrow">Projects</p>
              <h2 className="ndx-h2">Explore outcomes, not buzzwords</h2>
            </div>
            <Link to="/portfolio" className="ndx-btn">
              Portfolio
            </Link>
          </div>
          <div className="ndx-home-projects__grid">
            {PROJECTS.map((p) => (
              <Link key={p.slug} to={p.slug} className="ndx-home-project-card">
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <span className="ndx-home-project-card__link">Open</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ndx-section ndx-home-mission">
        <div className="ndx-container ndx-home-mission__inner">
          <div className="ndx-home-mission__card">
            <p className="ndx-eyebrow">Mission</p>
            <h2 className="ndx-h2">Technology that respects language, privacy, and pace.</h2>
            <p className="ndx-home-mission__text">
              BalochDev pairs frontier AI with ethical defaults: Balochi language tooling, keyboard UX, and international
              client work on Supabase, Cloudflare, and modern React. We document everything so your team owns the roadmap.
            </p>
            <Link to="/about" className="ndx-btn ndx-btn-primary">
              About us
            </Link>
          </div>
        </div>
      </section>

      <section className="ndx-section ndx-section-tight ndx-home-reviews">
        <div className="ndx-container">
          <p className="ndx-eyebrow">Reviews</p>
          <h2 className="ndx-h2">Teams we ship with</h2>
          <div className="ndx-home-reviews__grid">
            {REVIEWS.map((r) => (
              <blockquote key={r.who + r.co} className="ndx-home-review">
                <p>“{r.quote}”</p>
                <footer>
                  <strong>{r.who}</strong>
                  <span>{r.co}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

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

      <section className="ndx-section ndx-home-partners">
        <div className="ndx-container ndx-home-partners__wrap">
          <p className="ndx-eyebrow ndx-home-partners__eyebrow">Partners</p>
          <h2 className="ndx-h2 ndx-home-partners__h2">Organizations & platforms we build with</h2>
          <p className="ndx-group-sub" style={{ margin: '-0.5rem auto 0', maxWidth: '40rem' }}>
            Hover a logo for its name; click through to the partner site. Same set as on{' '}
            <Link to="/services">Services</Link>.
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
            <Link to="/proposal" className="ndx-btn ndx-btn-primary">
              Send proposal
            </Link>
            <Link to="/technologies" className="ndx-btn">
              Our stack
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
