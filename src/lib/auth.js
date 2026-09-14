/**
 * Login und Session fuer den Admin-Bereich.
 *
 * Es gibt keine Benutzerverwaltung: ein Passwort (Secret ADMIN_PASSWORD) und
 * ein signiertes Session-Cookie. Signiert wird mit HMAC-SHA256 und dem Secret
 * SESSION_SECRET.
 */

const COOKIE_NAME = 'hs_admin';
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 Stunden
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
  const ab = encoder.encode(String(a));
  const bb = encoder.encode(String(b));
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', ab),
    crypto.subtle.digest('SHA-256', bb),
  ]);
  const x = new Uint8Array(ha);
  const y = new Uint8Array(hb);
  let diff = ab.length === bb.length ? 0 : 1;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

function sessionSecret(env) {
  const secret = env.SESSION_SECRET || env.ADMIN_PASSWORD;
  if (!secret) throw new Error('SESSION_SECRET (oder ADMIN_PASSWORD) fehlt.');
  return secret;
}

export async function createSessionCookie(env) {
  const payload = { exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE, v: 1 };
  const body = b64urlEncode(encoder.encode(JSON.stringify(payload)));
  const key = await hmacKey(sessionSecret(env));
  const sig = b64urlEncode(await crypto.subtle.sign('HMAC', key, encoder.encode(body)));
  const token = `${body}.${sig}`;
  return `${COOKIE_NAME}=${token}; Path=/; Max-Age=${SESSION_MAX_AGE}; HttpOnly; Secure; SameSite=Strict`;
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
    const key = await hmacKey(sessionSecret(env));
    const ok = await crypto.subtle.verify(
      'HMAC',
      key,
      b64urlDecode(sig),
      encoder.encode(body)
    );
    if (!ok) return false;
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(body)));
    return typeof payload.exp === 'number' && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

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
  if (!env.ADMIN_PASSWORD) {
    return jsonResponse(
      { error: 'Admin-Bereich ist nicht eingerichtet (Secret ADMIN_PASSWORD fehlt).' },
      { status: 503 }
    );
  }
  if (!(await isAuthenticated(request, env))) {
    return jsonResponse({ error: 'Nicht angemeldet.' }, { status: 401 });
  }
  return null;
}

export { COOKIE_NAME, SESSION_MAX_AGE };
