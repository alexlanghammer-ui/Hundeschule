import {
  clientIp,
  createSessionCookie,
  jsonResponse,
  rateLimit,
  safeEqual,
  sameOrigin,
} from '../../../src/lib/auth.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.ADMIN_PASSWORD) {
    return jsonResponse(
      {
        error:
          'Der Admin-Bereich ist noch nicht eingerichtet. Bitte das Secret ADMIN_PASSWORD im Cloudflare-Dashboard setzen.',
      },
      { status: 503 }
    );
  }
  if (!sameOrigin(request)) {
    return jsonResponse({ error: 'Ungültige Anfrage.' }, { status: 403 });
  }

  const ip = clientIp(request);
  const limit = await rateLimit(env, 'login', ip, 10, 15 * 60);
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

  return jsonResponse(
    { ok: true },
    { headers: { 'Set-Cookie': await createSessionCookie(env) } }
  );
}
