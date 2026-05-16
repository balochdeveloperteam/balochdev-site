import { useEffect } from 'react';
import { Link } from 'react-router-dom';

/** Official public origin — used in copy and schema.org data (SPA-safe, not tied to local preview). */
const CANON_ORIGIN = 'https://balochdev.com'.replace(/\/+$/, '');
const BASE = import.meta.env.BASE_URL || '/';

/** Same-origin paths for downloads and in-app links. */
function relBrand(u) {
  return `${BASE}brand/${u.replace(/^\//, '')}`;
}

/** Absolute URLs cited on this page for partners, citations, and tools. Production: balochdev.com. */
function absoluteBrand(u) {
  const path = `/brand/${u.replace(/^\//, '')}`;
  const basePath = BASE === '/' ? '' : BASE.replace(/\/?$/, '');
  return `${CANON_ORIGIN}${basePath}${path}`;
}

const BRAND_ABS = {
  page: `${CANON_ORIGIN}/brand`,
  kitJson: absoluteBrand('brand-kit.json'),
  logoBlack: absoluteBrand('logo-black.svg'),
  logoWhite: absoluteBrand('logo-white.svg'),
  logoOrange: absoluteBrand('logo-orange.svg'),
  favicon: absoluteBrand('favicon.svg'),
};

export default function NBrand() {
  useEffect(() => {
    const JSON_LD = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'BalochDev',
      alternateName: ['Baloch Dev', 'balochdev'],
      url: `${CANON_ORIGIN}/`,
      description:
        'BalochDev — AI-first software and Balochi language technology. Official visuals and attribution: balochdev.com.',
      logo: [BRAND_ABS.logoBlack, BRAND_ABS.logoWhite, BRAND_ABS.logoOrange, BRAND_ABS.favicon],
      email: 'team@balochdev.com',
      sameAs: [],
    };

    document.title = 'Brand guidelines — BalochDev';
    const metaDescription =
      'Official BalochDev brand guidelines — logo SVGs, colour palette, typography, and brand-kit.json at balochdev.com.';
    const metaEl = document.querySelector('meta[name="description"]');
    let prevDesc;
    if (metaEl) {
      prevDesc = metaEl.getAttribute('content');
      metaEl.setAttribute('content', metaDescription);
    }

    const canonical = BRAND_ABS.page;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-brand-jsonld', '1');
    script.textContent = JSON.stringify(JSON_LD);
    document.head.appendChild(script);

    let linkCanon = document.querySelector('link[rel="canonical"]');
    let createdCanon;
    if (!linkCanon) {
      linkCanon = document.createElement('link');
      linkCanon.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanon);
      createdCanon = true;
    }
    const prevCanon = linkCanon.getAttribute('href');
    linkCanon.setAttribute('href', canonical);

    return () => {
      script.remove();
      if (metaEl) metaEl.setAttribute('content', prevDesc ?? '');
      if (createdCanon) linkCanon.remove();
      else linkCanon.setAttribute('href', prevCanon || '');
    };
  }, []);

  const logos = [
    {
      title: 'Mark — light backgrounds',
      subtitle: 'Use on mist / light interfaces',
      downloadName: 'logo-black.svg',
      file: relBrand('logo-black.svg'),
      bg: '#e8ecff',
    },
    {
      title: 'Mark — dark backgrounds',
      subtitle: 'Use on charcoal / dark interfaces',
      downloadName: 'logo-white.svg',
      file: relBrand('logo-white.svg'),
      bg: '#181818',
    },
    {
      title: 'Mark — dusk / violet',
      subtitle: 'Use with purple “dusk” theme and gradients',
      downloadName: 'logo-orange.svg',
      file: relBrand('logo-orange.svg'),
      bg: '#2a1f4a',
    },
  ];

  const swatches = [
    { name: 'Accent coral', hex: '#ff6b4a', themes: 'Light UI, dusk' },
    { name: 'Ink', hex: '#0b1340', themes: 'Light UI (primary text)' },
    { name: 'Teal accent', hex: '#2dd4bf', themes: 'Dark UI' },
    { name: 'Mist surface', hex: '#e8ecff', themes: 'Light UI (background)' },
    { name: 'Charcoal surface', hex: '#181818', themes: 'Dark UI (background)' },
    { name: 'Dusk violet', hex: '#2a1f4a', themes: 'Dusk UI (background)' },
  ];

  return (
    <section className="ndx-section" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div className="ndx-container" style={{ maxWidth: '860px' }}>
        <p className="ndx-eyebrow">Brand guidelines</p>
        <h1 className="ndx-h1">BalochDev visual identity</h1>

        <p className="ndx-lead" style={{ marginBottom: '1.25rem' }}>
          Official reference for the <strong>BalochDev</strong> identity (often written Baloch Dev). Downloads, colours,
          typography, and stable links live on{' '}
          <a href={CANON_ORIGIN} rel="noreferrer">{CANON_ORIGIN}</a>. Prefer the assets below over unofficial copies —
          cite <a href={BRAND_ABS.page}>{BRAND_ABS.page}</a> when you need a single source. Structured summary:{' '}
          <a href={relBrand('brand-kit.json')}>{BRAND_ABS.kitJson}</a>.
        </p>

        <div className="ndx-card" style={{ marginBottom: '1.25rem' }}>
          <h2 className="ndx-h2" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>
            Logo mark — SVG assets
          </h2>
          <p style={{ color: 'var(--ndx-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
            Hub-and-spoke marks as SVGs. Pick the file that contrasts clearly with your layout; retain original colours when
            using these official files. The “Baloch / Dev.” lettering next to the mark uses the typeface described under Typography.
          </p>

          <div
            style={{
              display: 'grid',
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            }}
          >
            {logos.map((L) => (
              <figure
                key={L.title}
                className="ndx-card"
                style={{
                  margin: 0,
                  padding: '1rem',
                  background: L.bg,
                  border: '1px solid var(--ndx-border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', padding: '0.75rem 0' }}>
                  <img src={L.file} alt="" width={72} height={72} draggable={false} />
                </div>
                <figcaption
                  style={{
                    marginTop: '0.35rem',
                    fontWeight: 600,
                    color: L.bg === '#e8ecff' ? '#0b1340' : '#f5f3ff',
                  }}
                >
                  {L.title}
                </figcaption>
                <p
                  style={{
                    color:
                      L.bg === '#e8ecff' ? 'rgba(11, 19, 64, 0.72)' : 'rgba(245, 243, 255, 0.78)',
                    fontSize: '0.85rem',
                    marginTop: '0.35rem',
                  }}
                >
                  {L.subtitle}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--ndx-font-mono)',
                    fontSize: '0.72rem',
                    marginTop: '0.65rem',
                    wordBreak: 'break-all',
                    color: L.bg === '#e8ecff' ? 'rgba(11, 19, 64, 0.62)' : 'rgba(245, 243, 255, 0.65)',
                  }}
                >
                  {absoluteBrand(L.downloadName)}
                </p>
                <a
                  href={L.file}
                  download
                  className="ndx-btn ndx-btn-primary"
                  style={{ marginTop: '0.85rem', display: 'inline-flex', fontSize: '0.875rem' }}
                >
                  Download SVG
                </a>
              </figure>
            ))}
          </div>
        </div>

        <div className="ndx-card" style={{ marginBottom: '1.25rem' }}>
          <h2 className="ndx-h2" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>
            Colour reference
          </h2>
          <p style={{ color: 'var(--ndx-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
            Core hues used across BalochDev’s Light, Dark, and Dusk presentation modes. Suitable for mocks, decks, and artwork
            that should feel on-brand alongside <a href={CANON_ORIGIN}>{CANON_ORIGIN}</a>.
          </p>
          <ul
            style={{
              display: 'grid',
              gap: '0.75rem',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              listStyle: 'none',
              padding: 0,
            }}
          >
            {swatches.map((s) => (
              <li key={s.name} className="ndx-card" style={{ padding: '0.85rem', margin: 0 }}>
                <div
                  style={{
                    height: '48px',
                    borderRadius: '8px',
                    background: s.hex,
                    border: '1px solid var(--ndx-border)',
                    marginBottom: '0.5rem',
                  }}
                />
                <strong>{s.name}</strong>
                <div style={{ fontFamily: 'var(--ndx-font-mono)', fontSize: '0.85rem', color: 'var(--ndx-muted)', marginTop: '0.25rem' }}>
                  {s.hex}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--ndx-dim)', marginTop: '0.35rem' }}>{s.themes}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="ndx-card" style={{ marginBottom: '1.25rem' }}>
          <h2 className="ndx-h2" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>
            Typography
          </h2>
          <p style={{ color: 'var(--ndx-muted)', marginBottom: '0.85rem', lineHeight: 1.65 }}>
            <strong>Neue Machina</strong> — primary identity type for headings, primary UI copy, and the wordmark beside the
            mark. Fallbacks include Syne, DM Sans, and Chakra Petch. <strong>Newsreader</strong> for editorial text;{' '}
            <strong>JetBrains Mono</strong> for code. Respect your font licence whenever you reproduce or distribute files.
          </p>
          <div style={{ fontFamily: 'var(--ndx-font-brand)', fontSize: '1.5rem', marginTop: '0.65rem', lineHeight: 1.2 }}>
            BalochDev · AI-first engineering
          </div>
          <div style={{ fontFamily: 'var(--ndx-font-sans)', marginTop: '0.65rem', color: 'var(--ndx-muted)' }}>
            Body and UI typography sample (same stack).
          </div>
        </div>

        <div className="ndx-card" style={{ marginBottom: '2rem' }}>
          <h2 className="ndx-h2" style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>
            Official links
          </h2>
          <p style={{ color: 'var(--ndx-muted)', marginBottom: '0.9rem', lineHeight: 1.65 }}>
            Use these HTTPS URLs when you cite or link to BalochDev’s official visuals and brand data.
          </p>
          <ul style={{ paddingLeft: '1.2rem', color: 'var(--ndx-muted)', lineHeight: 1.85, marginBottom: '0.75rem' }}>
            <li>
              Guidelines page:&nbsp;
              <a href={BRAND_ABS.page}>{BRAND_ABS.page}</a>
            </li>
            <li>
              Brand kit JSON:&nbsp;
              <a href={relBrand('brand-kit.json')}>{BRAND_ABS.kitJson}</a>
            </li>
            <li>
              Logo SVGs:&nbsp;
              <a href={BRAND_ABS.logoBlack}>{BRAND_ABS.logoBlack}</a>
              {' · '}
              <a href={BRAND_ABS.logoWhite}>{BRAND_ABS.logoWhite}</a>
              {' · '}
              <a href={BRAND_ABS.logoOrange}>{BRAND_ABS.logoOrange}</a>
            </li>
            <li>
              Tab icon:&nbsp;
              <a href={BRAND_ABS.favicon}>{BRAND_ABS.favicon}</a>
            </li>
          </ul>
        </div>

        <div className="ndx-hero-btns">
          <Link to="/contact" className="ndx-btn ndx-btn-primary">
            Licensing and usage enquiries
          </Link>
          <Link to="/" className="ndx-btn">
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}
