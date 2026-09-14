/**
 * Gemeinsames Seitengeruest: <head>, Kopfzeile, Fusszeile, Cookie-Banner.
 */

import { html, raw, esc, telHref } from '../lib/html.js';

/**
 * Wird an Stylesheet und Skript angehängt. Bei jeder Änderung an site.css oder
 * site.js hochzählen – sonst liefern Browser tagelang die alte Datei aus.
 */
export const ASSET_VERSION = '4';

export const NAV = [
  { href: '/', label: 'Start' },
  { href: '/einzeltraining', label: 'Einzeltraining' },
  { href: '/kurse', label: 'Kurse' },
  { href: '/preise', label: 'Preise' },
  { href: '/trainingsgelaende', label: 'Gelände' },
  { href: '/ueber-mich', label: 'Über mich' },
];

export const LEGAL_NAV = [
  { href: '/impressum', label: 'Impressum' },
  { href: '/datenschutz', label: 'Datenschutz' },
  { href: '/agb', label: 'AGB' },
];

export const PAW_SVG = raw(
  '<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><ellipse cx="10" cy="19" rx="5.6" ry="7.4" transform="rotate(-18 10 19)"/><ellipse cx="20" cy="12" rx="5.4" ry="7.6" transform="rotate(-7 20 12)"/><ellipse cx="30.5" cy="12.6" rx="5.4" ry="7.6" transform="rotate(8 30.5 12.6)"/><ellipse cx="39.5" cy="20.5" rx="5.6" ry="7.2" transform="rotate(20 39.5 20.5)"/><path d="M24.4 24c6.6 0 12.4 5.1 12.4 11 0 4.4-3.3 7-7.7 7-2.3 0-3.6-.8-4.7-.8s-2.4.8-4.7.8c-4.4 0-7.9-2.6-7.9-7 0-5.9 6-11 12.6-11Z"/></svg>'
);

/** <picture> mit WebP und JPEG-Fallback. */
export function picture({ name, widths, jpegWidth, alt, className, sizes, loading = 'lazy', fetchpriority }) {
  const srcset = widths.map((w) => `/photos/${name}-${w}.webp ${w}w`).join(', ');
  const fallback = `/photos/${name}-${jpegWidth}.jpg`;
  return html`<picture>
    <source type="image/webp" srcset="${srcset}" sizes="${sizes || '100vw'}" />
    <img
      src="${fallback}"
      alt="${alt}"
      class="${className || ''}"
      loading="${loading}"
      decoding="async"
      ${fetchpriority ? raw(`fetchpriority="${esc(fetchpriority)}"`) : ''}
    />
  </picture>`;
}

export const PHOTOS = {
  hero: { name: 'hero-run', widths: [640, 920], jpegWidth: 920, alt: 'Schwarz-brauner Hund rennt über eine Wiese auf die Kamera zu' },
  puppy: { name: 'puppy', widths: [640, 960, 1440], jpegWidth: 1440, alt: 'Junger weiß-brauner Hund sitzt im Gras und schaut freudig nach oben' },
  twoDogs: { name: 'two-dogs', widths: [640, 960, 1440], jpegWidth: 1440, alt: 'Zwei Hunde sitzen nebeneinander auf einer Bank am Waldrand' },
};

function jsonLd(content, siteUrl) {
  const k = content.kontakt;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#hundeschule`,
    name: k.betrieb || k.name,
    description:
      'Gewaltfreies Hundetraining in Hülben auf der Schwäbischen Alb: Einzeltraining und Gruppenkurse in kleinen Gruppen.',
    url: siteUrl + '/',
    telephone: k.mobil,
    email: k.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: k.strasse,
      postalCode: (k.plzOrt || '').split(' ')[0],
      addressLocality: (k.plzOrt || '').split(' ').slice(1).join(' '),
      addressCountry: 'DE',
    },
    areaServed: 'Hülben, Schwäbische Alb',
    image: `${siteUrl}/photos/hero-run-920.jpg`,
    sameAs: [k.instagram, k.facebook].filter(Boolean),
  };
  return JSON.stringify(data);
}

function header(content, path) {
  const k = content.kontakt;
  const isActive = (href) => (href === '/' ? path === '/' : path.startsWith(href));
  return html`<header class="site-header">
    <div class="wrap site-header__inner">
      <a class="brand" href="/">
        <span class="brand__mark">${PAW_SVG}</span>
        <span class="brand__name">${k.name}</span>
      </a>
      <nav class="nav" aria-label="Hauptnavigation">
        ${NAV.map(
          (item) =>
            html`<a href="${item.href}" ${isActive(item.href) ? raw('aria-current="page"') : ''}
              >${item.label}</a
            >`
        )}
      </nav>
      <div class="header-actions">
        <a class="header-phone" href="${telHref(k.mobil)}" aria-label="Anrufen: ${k.mobil}">☎</a>
        <a class="btn btn--dark btn--sm" href="/kontakt">Termin anfragen</a>
        <button
          class="nav-toggle"
          type="button"
          id="navToggle"
          aria-expanded="false"
          aria-controls="navSheet"
        >
          <span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>
          <span class="label">Menü</span>
        </button>
      </div>
    </div>
    <div class="nav-sheet" id="navSheet" hidden>
      <div class="nav-sheet__panel" role="dialog" aria-modal="true" aria-label="Menü">
        <div class="nav-sheet__head">
          <span class="nav-sheet__title">Menü</span>
          <button class="nav-sheet__close" type="button" id="navClose" aria-label="Menü schließen">
            ✕
          </button>
        </div>
        ${NAV.map(
          (item) =>
            html`<a href="${item.href}" ${isActive(item.href) ? raw('aria-current="page"') : ''}
              >${item.label}</a
            >`
        )}
        <a href="/kontakt" ${isActive('/kontakt') ? raw('aria-current="page"') : ''}
          >Kontakt &amp; Anfrage</a
        >
        <div class="nav-sheet__legal">
          ${LEGAL_NAV.map((item) => html`<a href="${item.href}">${item.label}</a>`)}
        </div>
      </div>
    </div>
  </header>`;
}

function footer(content) {
  const k = content.kontakt;
  const year = new Date().getFullYear();
  return html`<footer class="site-footer">
    <div class="wrap">
      <div class="site-footer__grid">
        <div class="site-footer__col">
          <p class="site-footer__claim">Lernen. Wissen. Verstehen. Vertrauen.</p>
          <p>
            Auf diesem Weg der 4 Schritte möchte ich dich und deinen Hund gerne begleiten. Ich freue
            mich auf dich.
          </p>
        </div>
        <nav class="site-footer__col" aria-label="Seiten">
          <h2>Seiten</h2>
          ${NAV.slice(1).map((item) => html`<a href="${item.href}">${item.label}</a>`)}
          <a href="/kontakt">Kontakt</a>
        </nav>
        <div class="site-footer__col">
          <h2>Kontakt</h2>
          <p>${k.strasse}<br />${k.plzOrt}</p>
          ${k.mobil ? html`<a class="hi" href="${telHref(k.mobil)}">${k.mobil}</a>` : ''}
          ${k.email ? html`<a class="hi" href="mailto:${k.email}">${k.email}</a>` : ''}
        </div>
        <nav class="site-footer__col" aria-label="Rechtliches">
          <h2>Rechtliches</h2>
          ${LEGAL_NAV.map((item) => html`<a href="${item.href}">${item.label}</a>`)}
          ${k.instagram
            ? html`<a class="hi" href="${k.instagram}" target="_blank" rel="noopener noreferrer"
                >Instagram</a
              >`
            : ''}
          ${k.facebook
            ? html`<a class="hi" href="${k.facebook}" target="_blank" rel="noopener noreferrer"
                >Facebook</a
              >`
            : ''}
        </nav>
      </div>
      <div class="site-footer__bottom">
        <span>©${year} ${k.name} · Mitglied im IBH e.V.</span>
        <button type="button" id="cookieReopen">Cookie-Einstellungen</button>
      </div>
    </div>
  </footer>`;
}

function cookieBanner() {
  return html`<div class="cookie" id="cookieBanner" hidden aria-label="Cookie-Hinweis">
    <div class="cookie__panel">
      <div>
        <p class="cookie__title">Cookies auf dieser Seite</p>
        <p>
          Ich verwende nur technisch notwendige Cookies, damit die Seite funktioniert. Optionale
          Cookies für Statistik setze ich erst nach deiner Zustimmung. Mehr dazu im
          <a href="/datenschutz">Datenschutz</a>.
        </p>
      </div>
      <div class="cookie__actions">
        <button class="btn btn--outline" type="button" data-cookie="necessary">Nur notwendige</button>
        <button class="btn btn--dark" type="button" data-cookie="all">Alle akzeptieren</button>
      </div>
    </div>
  </div>`;
}

function actionBar(content) {
  const k = content.kontakt;
  return html`<div class="action-bar">
    <a class="btn btn--outline" href="${telHref(k.mobil)}">Anrufen</a>
    <a class="btn btn--dark" href="/kontakt">Schreib' mir!</a>
  </div>`;
}

/**
 * Baut die komplette HTML-Seite.
 * @param {object} options title, description, path, content, siteUrl, body, noindex
 */
export function layout({ title, description, path, content, siteUrl, body, noindex = false }) {
  const fullTitle = path === '/' ? title : `${title} · ${content.kontakt.name}`;
  const canonical = `${siteUrl}${path === '/' ? '/' : path}`;
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : ''}
<meta name="theme-color" content="#0F3D2E">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:site_name" content="${esc(content.kontakt.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(siteUrl)}/photos/hero-run-920.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/instrument-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/bricolage-grotesque-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css?v=${ASSET_VERSION}">
<script type="application/ld+json">${jsonLd(content, siteUrl)}</script>
</head>
<body class="has-action-bar">
<a class="skip-link" href="#inhalt">Zum Inhalt springen</a>
${header(content, path).value}
<main id="inhalt">
${typeof body === 'string' ? body : body.value}
</main>
${footer(content).value}
${actionBar(content).value}
${cookieBanner().value}
<script src="/assets/js/site.js?v=${ASSET_VERSION}" defer></script>
</body>
</html>`;
}
