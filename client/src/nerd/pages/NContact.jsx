import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Seo from '../seo/Seo';
import { STATIC_PUBLIC_PAGES_SEO } from '../seo/staticPublicPagesSeo.js';
import { capDescription, metaTitleFromPublicBrief } from '../seo/seoFromData';
import BookCallButton from '../components/bookCall/BookCallButton';
import PartnerBrandsGrid from '../components/PartnerBrandsGrid';
import FaqAccordion from '../components/FaqAccordion';
import { TEAM_MEMBERS, TEAM_STATS } from '../data/team.js';
import { apiUrl } from '../../lib/api';

const CONTACT_SEO = STATIC_PUBLIC_PAGES_SEO['/contact'];
const CONTACT_EMAIL = 'team@balochdev.com';

const WORK_SHAPES = [
  'Greenfield build',
  'AI agent / RAG',
  'Web / mobile app',
  'Stack migration',
  'Embedded pod',
  'Just exploring',
];

const BUDGETS = ['From $300', '$300–5k', '$5–25k', '$25–75k', '$75k +', 'Not sure yet'];
const TIMELINES = ['ASAP', '< 1 month', '1–3 months', '3–6 months', 'Just planning'];

const CONTACT_FACES = ['Adeel Baloch', 'Jaber Baloch', 'Makhdoom Baloch', 'Tayaab Baloch']
  .map((name) => TEAM_MEMBERS.find((m) => m.name === name))
  .filter(Boolean);

const CONTACT_REPLY_TEAM = [
  {
    member: CONTACT_FACES[0],
    blurb:
      'I read the inbox. If your message lands late, you still hear back from the right person — usually the same business day.',
    meta: 'Remote-first · Balochistan',
  },
  {
    member: CONTACT_FACES[1],
    blurb:
      'If you only have a half-formed idea, that is the cheapest week to fix. We will whiteboard it before anyone touches code.',
    meta: 'Engineering lead · Full-stack',
  },
  {
    member: CONTACT_FACES[2],
    blurb:
      'I keep the pipeline honest. By the second call you will have a path you can defend — not a wish list.',
    meta: 'Growth · Client intake',
  },
  {
    member: CONTACT_FACES[3],
    blurb:
      'Brand and product design sit in the same room as engineering. You get clarity on look, voice, and UX early.',
    meta: 'Brand · Product design',
  },
].filter((r) => r.member);

const TRUST_STATS = [
  {
    label: 'First reply',
    value: '< 24 hours',
    note: 'From the team inbox — not a router. Usually sooner.',
    accent: true,
  },
  {
    label: 'On the first call',
    value: 'You + senior',
    note: 'Founder or lead engineer most likely to own the build.',
    accent: true,
  },
  {
    label: 'Repeat clients',
    value: '80%',
    note: 'Clients who come back for the next milestone.',
    accent: true,
  },
  {
    label: 'Your repo',
    value: 'Code ownership',
    note: 'Day-one ownership. No hostage handoff.',
    accent: false,
  },
];

const CONTACT_FAQS = [
  {
    q: "What if I don't have a budget figured out yet?",
    a: 'Fine. Most discovery calls happen before there is a number. Focused work starts from about $300 — we give you a range based on scope, and you can take it to whoever signs.',
  },
  {
    q: 'Do you sign NDAs before the first call?',
    a: 'Yes — mutual NDA, short, e-signable. Send a draft or ask for ours; usually back the same day.',
  },
  {
    q: 'Can you take over a project from another studio?',
    a: 'Often yes. We do a short read of the codebase, write an honest report, and you decide what to do with it — with or without us.',
  },
  {
    q: 'How quickly can you start?',
    a: 'Focused MVPs often land in about 1.5 months from signed brief. Discovery calls can often start within days depending on the calendar.',
  },
  {
    q: "What if we're not the right fit?",
    a: 'You get a clear email that says so — and when we can, we point you toward a better fit. We would rather hand you off than waste your week.',
  },
];

const RECORD_STATS = [
  { label: 'Repeat clients', value: '80', suffix: '%' },
  { label: 'Biggest launch', value: '$330K', suffix: null },
  { label: 'Projects', value: '80', suffix: '+' },
  { label: 'Avg rating', value: '5.0', suffix: '/5' },
];

function ChipGroup({ label, options, value, onChange }) {
  return (
    <fieldset className="ndx-contact-chips">
      <legend className="ndx-contact-chips__legend">{label}</legend>
      <div className="ndx-contact-chips__row">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              className={`ndx-contact-chip${active ? ' is-active' : ''}`}
              aria-pressed={active}
              onClick={() => onChange(active ? '' : opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function NContact() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  const [shape, setShape] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');

  const seoTitle = useMemo(() => metaTitleFromPublicBrief(CONTACT_SEO.metaTitle), []);
  const seoDescription = useMemo(() => capDescription(CONTACT_SEO.metaDescription), []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const fd = new FormData(e.target);
    const baseMessage = String(fd.get('message') || '').trim();
    const metaBits = [
      shape && `Shape: ${shape}`,
      budget && `Budget: ${budget}`,
      timeline && `Timeline: ${timeline}`,
    ].filter(Boolean);
    const message = metaBits.length
      ? `${baseMessage}\n\n—\n${metaBits.join('\n')}`
      : baseMessage;

    try {
      const res = await fetch(apiUrl(`/api/forms/submit`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_type: 'contact',
          name: fd.get('name'),
          email: fd.get('email'),
          phone: fd.get('phone'),
          company: fd.get('company'),
          message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setErr(data.error || 'Something went wrong');
      else setSent(true);
    } catch {
      setErr(`Network error — email ${CONTACT_EMAIL}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title={seoTitle} description={seoDescription} canonicalPath={CONTACT_SEO.canonicalPath} />

      <section className="ndx-section ndx-contact-hero">
        <div className="ndx-container ndx-contact-hero__wrap">
          <div className="ndx-contact-hero__meta">
            <a className="ndx-contact-hero__email" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            <span className="ndx-contact-hero__dot" aria-hidden>
              ·
            </span>
            <span>Booking open · 30‑min slots</span>
            <span className="ndx-contact-hero__dot" aria-hidden>
              ·
            </span>
            <span>Remote-first</span>
            <span className="ndx-contact-hero__dot" aria-hidden>
              ·
            </span>
            <span>Reply &lt; 24 hours</span>
          </div>

          <p className="ndx-eyebrow">Contact</p>
          <h1 className="ndx-h1 ndx-contact-hero__title">
            Tell us what&apos;s <em>on your roadmap.</em>
          </h1>
          <p className="ndx-lead ndx-contact-hero__lead">
            A 30‑minute discovery call, a real scope inside a week, and a senior team that ships. You talk to people who
            build — not a qualifying funnel.
          </p>

          <div className="ndx-contact-faces" aria-label="Who you may speak with">
            <div className="ndx-contact-faces__stack" aria-hidden>
              {CONTACT_FACES.map((m) => (
                <span key={m.name} className="ndx-contact-faces__avatar" title={m.name}>
                  {m.image ? <img src={m.image} alt="" loading="lazy" decoding="async" /> : null}
                </span>
              ))}
            </div>
            <p className="ndx-contact-faces__label">
              <strong>{CONTACT_FACES.map((m) => m.name.split(' ')[0]).join(' · ')}</strong> — senior team on call
            </p>
          </div>
        </div>
      </section>

      <section className="ndx-section ndx-section-tight ndx-contact-form-sec">
        <div className="ndx-container ndx-contact-form-layout">
          <div className="ndx-contact-form-intro">
            <p className="ndx-eyebrow">Start the conversation</p>
            <h2 className="ndx-h2">
              Same form · <em>two paths.</em>
            </h2>
            <p className="ndx-group-sub">
              ~90 seconds. Book a call, or send a note — we reply from{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>

          <div className="ndx-contact-card ndx-card">
            {sent ? (
              <div className="ndx-contact-card__success">
                <p className="ndx-eyebrow">Received</p>
                <h3 className="ndx-h2">Thanks — we got your note.</h3>
                <p className="ndx-lead">We will follow up shortly from {CONTACT_EMAIL}.</p>
                <div className="ndx-contact-card__actions">
                  <BookCallButton className="ndx-btn ndx-btn-primary">Book a call anyway</BookCallButton>
                  <Link to="/estimate" className="ndx-btn">
                    AI estimate
                  </Link>
                </div>
              </div>
            ) : (
              <form className="ndx-contact-card__form" onSubmit={onSubmit}>
                {err ? (
                  <p className="ndx-contact-card__error" role="alert">
                    {err}
                  </p>
                ) : null}

                <div className="ndx-contact-card__grid">
                  <label className="ndx-contact-field">
                    <span>01 · Your name</span>
                    <input name="name" required autoComplete="name" placeholder="Full name" />
                  </label>
                  <label className="ndx-contact-field">
                    <span>02 · Work email</span>
                    <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
                  </label>
                  <label className="ndx-contact-field">
                    <span>03 · Company &amp; role</span>
                    <input name="company" autoComplete="organization" placeholder="Optional" />
                  </label>
                  <label className="ndx-contact-field">
                    <span>Phone</span>
                    <input name="phone" type="tel" autoComplete="tel" placeholder="Optional" />
                  </label>
                </div>

                <ChipGroup label="04 · What shape of work?" options={WORK_SHAPES} value={shape} onChange={setShape} />
                <ChipGroup
                  label="05 · Budget · ballpark (from $300)"
                  options={BUDGETS}
                  value={budget}
                  onChange={setBudget}
                />
                <ChipGroup label="06 · Timeline · rough" options={TIMELINES} value={timeline} onChange={setTimeline} />

                <label className="ndx-contact-field ndx-contact-field--full">
                  <span>07 · What are you building?</span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="A paragraph is plenty — problem, users, and what “done” looks like."
                  />
                </label>

                <p className="ndx-contact-card__paths">
                  // Pick a path · same fields · two ways to use them
                </p>
                <div className="ndx-contact-card__actions">
                  <button type="submit" className="ndx-btn ndx-btn-primary" disabled={busy}>
                    {busy ? 'Sending…' : 'Send to the team'}
                  </button>
                  <BookCallButton className="ndx-btn" type="button">
                    Book a call →
                  </BookCallButton>
                  <Link to="/estimate" className="ndx-btn ndx-contact-card__ghost">
                    Instant AI estimate
                  </Link>
                </div>
                <p className="ndx-contact-card__fine">
                  By sending you agree we may reply by email. <strong>No newsletter. No drip.</strong>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="ndx-section ndx-section-tight ndx-contact-trust-sec">
        <div className="ndx-container">
          <div className="ndx-contact-trust" role="list">
            {TRUST_STATS.map((s) => (
              <article
                key={s.label}
                className={`ndx-contact-trust__item${s.accent ? ' ndx-contact-trust__item--accent' : ''}`}
                role="listitem"
              >
                <p className="ndx-contact-trust__label">{s.label}</p>
                <p className="ndx-contact-trust__value">{s.value}</p>
                <p className="ndx-contact-trust__note">{s.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ndx-section">
        <div className="ndx-container">
          <p className="ndx-eyebrow">// Who replies</p>
          <h2 className="ndx-h2 ndx-contact-reply__title">
            Four humans, <em>one inbox.</em> One of them writes you back.
          </h2>
          <p className="ndx-group-sub ndx-contact-reply__lead">
            We rotate so you reach a decision-maker on day one — no SDRs, no funnel.
          </p>
          <div className="ndx-contact-reply-grid">
            {CONTACT_REPLY_TEAM.map(({ member, blurb, meta }) => (
              <article key={member.name} className="ndx-contact-reply-card">
                <div className="ndx-contact-reply-card__media">
                  {member.image ? (
                    <img src={member.image} alt="" loading="lazy" decoding="async" />
                  ) : null}
                </div>
                <div className="ndx-contact-reply-card__body">
                  <h3>{member.name}</h3>
                  <p className="ndx-contact-reply-card__role">{member.role}</p>
                  <p className="ndx-contact-reply-card__quote">“{blurb}”</p>
                  <p className="ndx-contact-reply-card__meta">{meta}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ndx-section ndx-section-tight ndx-contact-faq-sec">
        <div className="ndx-container ndx-contact-faq-sec__inner">
          <p className="ndx-eyebrow">// Before you write</p>
          <h2 className="ndx-h2">
            Likely answers <em>upfront.</em>
          </h2>
          <p className="ndx-group-sub">
            If none of these match, write us anyway —{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
          <div className="ndx-contact-faq">
            <FaqAccordion items={CONTACT_FAQS} />
          </div>
        </div>
      </section>

      <section className="ndx-section ndx-contact-numbers">
        <div className="ndx-container">
          <p className="ndx-eyebrow">By the numbers</p>
          <h2 className="ndx-h2">
            Proof that travels <em>with the brief.</em>
          </h2>
          <div className="ndx-contact-numbers__grid">
            {RECORD_STATS.map((stat) => (
              <article key={stat.label} className="ndx-contact-numbers__item">
                <p className="ndx-contact-numbers__value">
                  {stat.value}
                  {stat.suffix ? <span>{stat.suffix}</span> : null}
                </p>
                <p className="ndx-contact-numbers__label">{stat.label}</p>
              </article>
            ))}
          </div>
          <div className="ndx-contact-numbers__team">
            {TEAM_STATS.map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
                <em>{s.sub}</em>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ndx-section ndx-home-partners">
        <div className="ndx-container ndx-home-partners__wrap">
          <p className="ndx-eyebrow ndx-home-partners__eyebrow">Partners &amp; clients</p>
          <h2 className="ndx-h2 ndx-home-partners__h2">Organizations we build with</h2>
          <p className="ndx-group-sub" style={{ margin: '-0.5rem auto 0', maxWidth: '40rem' }}>
            Academy partners, client brands, and platforms we ship beside — hover a logo for its name.
          </p>
          <PartnerBrandsGrid className="ndx-home-partners__logoGrid" />
        </div>
      </section>

      <section className="ndx-section ndx-section-tight ndx-contact-inbox">
        <div className="ndx-container ndx-contact-inbox__box">
          <div>
            <p className="ndx-eyebrow">Inbox open · team-monitored</p>
            <h2 className="ndx-h2">
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </h2>
            <p className="ndx-group-sub">Remote-first · Balochistan roots · clients worldwide</p>
          </div>
          <div className="ndx-contact-inbox__actions">
            <BookCallButton className="ndx-btn ndx-btn-primary">Book a call</BookCallButton>
            <a href={`mailto:${CONTACT_EMAIL}`} className="ndx-btn">
              Email the team
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
