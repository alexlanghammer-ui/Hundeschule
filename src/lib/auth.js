/**
 * Login und Session fuer den Admin-Bereich.
 *
 * Es gibt keine Benutzerverwaltung: ein Passwort und ein signiertes
 * Session-Cookie (HMAC-SHA256).
 *
 * Das Passwort kann aus zwei Quellen kommen:
 *   1. Secret ADMIN_PASSWORD – hat Vorrang, falls gesetzt.
 *   2. Im KV hinterlegt – wird beim ersten Aufruf von /admin selbst vergeben.
 *
 * Weg 2 ist der Normalfall: Bei Git-gekoppelten Workers überschreibt jeder
 * Deploy die im Dashboard gesetzten Secrets, weil wrangler.toml die
 * maßgebliche Quelle ist. Ein im KV hinterlegtes Passwort übersteht dagegen
 * jeden Deploy.
 */

const COOKIE_NAME = 'hs_admin';
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 Stunden
const PASSWORT_KEY = 'admin:passwort';
const SESSION_SECRET_KEY = 'admin:session-secret';
const MIN_PASSWORT_LAENGE = 8;
/**
 * Durchläufe der Passwort-Ableitung. Bewusst niedrig gehalten: Cloudflare
 * erlaubt im Gratis-Tarif 10 ms Rechenzeit pro Aufruf, 20.000 Durchläufe
 * brauchen allein schon ~13 ms – die Anmeldung würde abgebrochen. 5.000
 * liegen bei ~3 ms.
 *
 * Vertretbar, weil der Hash den Worker nie verlässt (er liegt im privaten
 * KV-Speicher) und Rateversuche ohnehin auf 10 pro 15 Minuten und
 * IP-Adresse begrenzt sind. Die Zahl wird bei jedem Passwort mitgespeichert
 * und lässt sich später anheben, ohne bestehende Passwörter zu entwerten.
 */
const PBKDF2_ITERATIONEN = 5000;

const encoder = new TextEncoder();

function b64urlEncode(bytes) {
  let bin = '';
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(text) {
  const padded = text.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/** Zeitkonstanter Vergleich, damit das Passwort nicht erraten werden kann. */
export async function safeEqual(a, b) {
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(String(a))),
    crypto.subtle.digest('SHA-256', encoder.encode(String(b))),
  ]);
  const x = new Uint8Array(ha);
  const y = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

/* ------------------------------------------------------------------ Passwort */

async function ableiten(passwort, salt, iterationen) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(passwort), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: iterationen, hash: 'SHA-256' },
    key,
    256
  );
  return b64urlEncode(new Uint8Array(bits));
}

async function ladePasswortEintrag(env) {
  if (!env.SITE_KV) return null;
  try {
    return await env.SITE_KV.get(PASSWORT_KEY, { type: 'json' });
  } catch (err) {
    console.error('Passwort konnte nicht gelesen werden:', err && err.message);
    return null;
  }
}

/**
 * Woher kommt das Passwort?
 * 'secret' = aus ADMIN_PASSWORD, 'kv' = selbst vergeben, 'keins' = noch offen.
 */
export async function passwortQuelle(env) {
  if (env.ADMIN_PASSWORD) return 'secret';
  const eintrag = await ladePasswortEintrag(env);
  return eintrag && eintrag.hash ? 'kv' : 'keins';
}

/** Darf jetzt ein Passwort vergeben werden? Nur solange es noch keines gibt. */
export async function einrichtungMoeglich(env) {
  if (!env.SITE_KV) return false;
  return (await passwortQuelle(env)) === 'keins';
}

export async function pruefePasswort(env, eingabe) {
  if (env.ADMIN_PASSWORD) return safeEqual(eingabe, env.ADMIN_PASSWORD);
  const eintrag = await ladePasswortEintrag(env);
  if (!eintrag || !eintrag.hash || !eintrag.salt) return false;
  const hash = await ableiten(
    String(eingabe),
    b64urlDecode(eintrag.salt),
    eintrag.iterationen || PBKDF2_ITERATIONEN
  );
  return safeEqual(hash, eintrag.hash);
}

/** Passwort im KV hinterlegen. Gibt eine Fehlermeldung zurueck oder null. */
export async function setzePasswort(env, passwort) {
  const klartext = String(passwort || '');
  if (klartext.length < MIN_PASSWORT_LAENGE) {
    return `Das Passwort muss mindestens ${MIN_PASSWORT_LAENGE} Zeichen lang sein.`;
  }
  if (klartext.length > 200) return 'Das Passwort ist zu lang.';
  if (!env.SITE_KV) return 'Der Speicher ist nicht verbunden – das Passwort kann nicht abgelegt werden.';

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await ableiten(klartext, salt, PBKDF2_ITERATIONEN);
  await env.SITE_KV.put(
    PASSWORT_KEY,
    JSON.stringify({
      hash,
      salt: b64urlEncode(salt),
      iterationen: PBKDF2_ITERATIONEN,
      gesetztAm: new Date().toISOString(),
    })
  );
  return null;
}

/* ------------------------------------------------------------------- Session */

/**
 * Schluessel zum Signieren der Anmeldung. Bevorzugt das Secret SESSION_SECRET;
 * sonst wird beim ersten Mal einer erzeugt und im KV abgelegt, damit
 * Anmeldungen einen Deploy überleben.
 */
async function sessionSecret(env) {
  if (env.SESSION_SECRET) return env.SESSION_SECRET;

  if (env.SITE_KV) {
    try {
      const vorhanden = await env.SITE_KV.get(SESSION_SECRET_KEY);
      if (vorhanden) return vorhanden;
      const neu = b64urlEncode(crypto.getRandomValues(new Uint8Array(32)));
      await env.SITE_KV.put(SESSION_SECRET_KEY, neu);
      return neu;
    } catch (err) {
      console.error('Session-Schlüssel nicht verfügbar:', err && err.message);
    }
  }

  if (env.ADMIN_PASSWORD) return env.ADMIN_PASSWORD;
  throw new Error('Kein Schlüssel zum Signieren der Anmeldung verfügbar.');
}

export async function createSessionCookie(env) {
  const payload = { exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE, v: 1 };
  const body = b64urlEncode(encoder.encode(JSON.stringify(payload)));
  const key = await hmacKey(await sessionSecret(env));
  const sig = b64urlEncode(await crypto.subtle.sign('HMAC', key, encoder.encode(body)));
  return `${COOKIE_NAME}=${body}.${sig}; Path=/; Max-Age=${SESSION_MAX_AGE}; HttpOnly; Secure; SameSite=Strict`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

function readCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}

export async function isAuthenticated(request, env) {
  const token = readCookie(request, COOKIE_NAME);
  if (!token || !token.includes('.')) return false;
  const [body, sig] = token.split('.');
  try {
    const key = await hmacKey(await sessionSecret(env));
    const ok = await crypto.subtle.verify('HMAC', key, b64urlDecode(sig), encoder.encode(body));
    if (!ok) return false;
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(body)));
    return typeof payload.exp === 'number' && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

/* --------------------------------------------------------------- Hilfsmittel */

/**
 * Schutz gegen Cross-Site-Requests: schreibende Aufrufe muessen von der
 * eigenen Seite kommen und den Header X-Requested-With mitschicken.
 */
export function sameOrigin(request) {
  if (request.headers.get('X-Requested-With') !== 'hundeschule-admin') return false;
  const origin = request.headers.get('Origin');
  if (!origin) return true; // manche Clients senden keinen Origin bei same-origin GET
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export function clientIp(request) {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For') ||
    'unknown'
  );
}

/**
 * Einfaches Zaehl-Limit im KV. Gibt true zurueck, wenn der Aufruf erlaubt ist.
 * Ohne KV-Binding wird nicht limitiert (lokale Entwicklung).
 */
export async function rateLimit(env, bucket, id, max, windowSeconds) {
  if (!env || !env.SITE_KV) return { allowed: true, remaining: max };
  const key = `rl:${bucket}:${id}`;
  try {
    const current = parseInt((await env.SITE_KV.get(key)) || '0', 10) || 0;
    if (current >= max) return { allowed: false, remaining: 0 };
    await env.SITE_KV.put(key, String(current + 1), { expirationTtl: windowSeconds });
    return { allowed: true, remaining: max - current - 1 };
  } catch (err) {
    console.error('rateLimit failed:', err && err.message);
    return { allowed: true, remaining: max };
  }
}

export function jsonResponse(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...(init.headers || {}),
    },
  });
}

/** Wache fuer alle /api/admin/* Endpunkte. */
export async function requireAdmin(request, env) {
  if ((await passwortQuelle(env)) === 'keins') {
    return jsonResponse(
      { error: 'Der Admin-Bereich ist noch nicht eingerichtet.', einrichtungNoetig: true },
      { status: 503 }
    );
  }
  if (!(await isAuthenticated(request, env))) {
    return jsonResponse({ error: 'Nicht angemeldet.' }, { status: 401 });
  }
  return null;
}

export { COOKIE_NAME, SESSION_MAX_AGE, MIN_PASSWORT_LAENGE };
