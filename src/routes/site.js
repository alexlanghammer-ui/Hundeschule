/**
 * Seiten-Router.
 *
 * Alle Seiten werden bei jedem Aufruf am Edge gerendert – damit stehen
 * gepflegte Preise, Termine und Kontaktdaten sofort im HTML (gut fuer
 * Suchmaschinen) und es gibt keinen Build-Schritt.
 *
 * Statische Dateien (CSS, Bilder, /admin) liefert Cloudflare direkt aus und
 * dieser Code wird dafuer gar nicht erst aufgerufen.
 */

import { getContent, sichtbareKurse } from '../lib/content.js';
import { layout, NAV } from '../render/layout.js';
import * as pages from '../render/pages.js';

const HTML_CACHE = 'public, max-age=0, s-maxage=60, stale-while-revalidate=600';

function siteUrlFor(request, env) {
  if (env.SITE_URL) return String(env.SITE_URL).replace(/\/+$/, '');
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

function htmlResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': status === 200 ? HTML_CACHE : 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'SAMEORIGIN',
    },
  });
}

function sitemap(content, siteUrl) {
  const paths = [
    ...NAV.map((n) => n.href),
    '/kontakt',
    ...sichtbareKurse(content).map((k) => `/kurse/${k.slug}`),
    '/impressum',
    '/datenschutz',
    '/agb',
  ];
  const lastmod = (content.updatedAt || new Date().toISOString()).slice(0, 10);
  const urls = paths
    .map(
      (p) =>
        `  <url><loc>${siteUrl}${p === '/' ? '/' : p}</loc><lastmod>${lastmod}</lastmod>` +
        `<changefreq>${p === '/' || p === '/kurse' ? 'weekly' : 'monthly'}</changefreq>` +
        `<priority>${p === '/' ? '1.0' : '0.7'}</priority></url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export async function handleSeite(request, env, path, url) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Methode nicht erlaubt', {
      status: 405,
      headers: { Allow: 'GET, HEAD' },
    });
  }

  // Abschließenden Schrägstrich entfernen (/kurse/ -> /kurse)
  if (path.length > 1 && path.endsWith('/')) {
    const ziel = path.replace(/\/+$/, '') + url.search;
    return Response.redirect(`${url.origin}${ziel}`, 301);
  }

  const content = await getContent(env);
  const siteUrl = siteUrlFor(request, env);

  if (path === '/robots.txt') {
    const body = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
    return new Response(body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=3600',
      },
    });
  }

  if (path === '/sitemap.xml') {
    return new Response(sitemap(content, siteUrl), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=3600',
      },
    });
  }

  let page = null;

  switch (path) {
    case '/':
      page = pages.startseite(content);
      break;
    case '/einzeltraining':
      page = pages.einzeltraining(content);
      break;
    case '/kurse':
      page = pages.kurseUebersicht(content);
      break;
    case '/preise':
      page = pages.preise(content);
      break;
    case '/trainingsgelaende':
      page = pages.gelaende(content);
      break;
    case '/ueber-mich':
      page = pages.ueberMich(content);
      break;
    case '/kontakt':
      page = pages.kontakt(content, {
        thema: url.searchParams.get('thema') || '',
        status: url.searchParams.get('status') || '',
        turnstileSiteKey: env.TURNSTILE_SITE_KEY || '',
      });
      break;
    case '/impressum':
      page = pages.rechtSeite(content, 'impressum');
      break;
    case '/datenschutz':
      page = pages.rechtSeite(content, 'datenschutz');
      break;
    case '/agb':
      page = pages.rechtSeite(content, 'agb');
      break;
    default:
      break;
  }

  if (!page && path.startsWith('/kurse/')) {
    const slug = path.slice('/kurse/'.length);
    const kurs = sichtbareKurse(content).find((k) => k.slug === slug);
    if (kurs) page = pages.kursDetail(content, kurs);
  }

  if (!page) {
    const notFound = pages.nichtGefunden(content);
    return htmlResponse(layout({ ...notFound, path, content, siteUrl, noindex: true }), 404);
  }

  return htmlResponse(layout({ ...page, path, content, siteUrl }));
}
