/** Alle Endpunkte unter /api/admin/ */

import {
  clearSessionCookie,
  clientIp,
  createSessionCookie,
  isAuthenticated,
  jsonResponse,
  rateLimit,
  requireAdmin,
  safeEqual,
  sameOrigin,
} from '../lib/auth.js';
import { DEFAULTS, getContent, putContent } from '../lib/content.js';

const PRAEFIX = 'anfrage:';

async function login(request, env) {
  if (!env.ADMIN_PASSWORD) {
    return jsonResponse(
      {
        error:
          'Der Admin-Bereich ist noch nicht eingerichtet. Bitte im Cloudflare-Dashboard unter ' +
          'Settings → Variables and Secrets das Secret ADMIN_PASSWORD setzen. Ist es dort schon ' +
          'gesetzt, läuft noch eine ältere Version: einmal neu deployen, dann greift es.',
      },
      { status: 503 }
    );
  }
  if (!sameOrigin(request)) {
    return jsonResponse({ error: 'Ungültige Anfrage.' }, { status: 403 });
  }

  const limit = await rateLimit(env, 'login', clientIp(request), 10, 15 * 60);
  if (!limit.allowed) {
    return jsonResponse(
      { error: 'Zu viele Versuche. Bitte in 15 Minuten erneut probieren.' },
      { status: 429 }
    );
  }

  let password = '';
  try {
    const body = await request.json();
    password = String(body.password || '');
  } catch {
    return jsonResponse({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  if (!(await safeEqual(password, env.ADMIN_PASSWORD))) {
    return jsonResponse({ error: 'Passwort stimmt nicht.' }, { status: 401 });
  }

  return jsonResponse({ ok: true }, { headers: { 'Set-Cookie': await createSessionCookie(env) } });
}

/** Sagt der Admin-Oberflaeche, ob angemeldet und ob alles eingerichtet ist. */
async function session(request, env) {
  return jsonResponse({
    angemeldet: env.ADMIN_PASSWORD ? await isAuthenticated(request, env) : false,
    eingerichtet: {
      passwort: Boolean(env.ADMIN_PASSWORD),
      sessionSecret: Boolean(env.SESSION_SECRET),
      kv: Boolean(env.SITE_KV),
      mail: Boolean(env.RESEND_API_KEY && env.CONTACT_FROM),
      turnstile: Boolean(env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY),
    },
  });
}

async function content(request, env) {
  const abgelehnt = await requireAdmin(request, env);
  if (abgelehnt) return abgelehnt;

  if (request.method === 'GET') {
    const aktuell = await getContent(env);
    return jsonResponse({
      content: aktuell,
      quelle: aktuell._source,
      updatedAt: aktuell.updatedAt || null,
    });
  }

  if (!sameOrigin(request)) return jsonResponse({ error: 'Ungültige Anfrage.' }, { status: 403 });

  // Zuruecksetzen auf die Auslieferungswerte
  if (request.method === 'DELETE') {
    try {
      const gespeichert = await putContent(env, DEFAULTS);
      return jsonResponse({ ok: true, content: gespeichert });
    } catch (err) {
      return jsonResponse({ error: err.message || 'Zurücksetzen fehlgeschlagen.' }, { status: 500 });
    }
  }

  let eingabe;
  try {
    eingabe = await request.json();
  } catch {
    return jsonResponse({ error: 'Ungültige Daten.' }, { status: 400 });
  }

  try {
    const gespeichert = await putContent(env, eingabe);
    return jsonResponse({ ok: true, content: gespeichert, updatedAt: gespeichert.updatedAt });
  } catch (err) {
    return jsonResponse({ error: err.message || 'Speichern fehlgeschlagen.' }, { status: 500 });
  }
}

async function anfragen(request, env) {
  const abgelehnt = await requireAdmin(request, env);
  if (abgelehnt) return abgelehnt;

  if (request.method === 'DELETE') {
    if (!sameOrigin(request)) return jsonResponse({ error: 'Ungültige Anfrage.' }, { status: 403 });
    if (!env.SITE_KV) return jsonResponse({ error: 'Kein KV-Namespace gebunden.' }, { status: 503 });

    const id = new URL(request.url).searchParams.get('id') || '';
    if (!id.startsWith(PRAEFIX)) {
      return jsonResponse({ error: 'Unbekannte Anfrage.' }, { status: 400 });
    }
    await env.SITE_KV.delete(id);
    return jsonResponse({ ok: true });
  }

  if (!env.SITE_KV) {
    return jsonResponse({ anfragen: [], hinweis: 'Kein KV-Namespace gebunden.' });
  }

  const cursor = new URL(request.url).searchParams.get('cursor') || undefined;
  const liste = await env.SITE_KV.list({ prefix: PRAEFIX, limit: 100, cursor });

  const gefunden = await Promise.all(
    liste.keys.map(async (eintrag) => {
      const daten = await env.SITE_KV.get(eintrag.name, { type: 'json' });
      return daten ? { id: eintrag.name, ...daten } : null;
    })
  );

  return jsonResponse({
    anfragen: gefunden.filter(Boolean).sort((a, b) => (a.ts < b.ts ? 1 : -1)),
    cursor: liste.list_complete ? null : liste.cursor,
  });
}

const ROUTEN = {
  login: { POST: login },
  logout: { POST: () => jsonResponse({ ok: true }, { headers: { 'Set-Cookie': clearSessionCookie() } }) },
  session: { GET: session },
  content: { GET: content, PUT: content, DELETE: content },
  anfragen: { GET: anfragen, DELETE: anfragen },
};

export async function handleAdmin(request, env, pfad) {
  const name = pfad.slice('/api/admin/'.length);
  const route = ROUTEN[name];
  if (!route) return jsonResponse({ error: 'Unbekannter Endpunkt.' }, { status: 404 });

  const handler = route[request.method];
  if (!handler) {
    return jsonResponse(
      { error: 'Methode nicht erlaubt.' },
      { status: 405, headers: { Allow: Object.keys(route).join(', ') } }
    );
  }

  return handler(request, env);
}
