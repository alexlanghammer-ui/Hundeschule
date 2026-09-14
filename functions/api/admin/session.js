import { isAuthenticated, jsonResponse } from '../../../src/lib/auth.js';

/** Sagt der Admin-Oberflaeche, ob angemeldet und ob alles eingerichtet ist. */
export async function onRequestGet(context) {
  const { request, env } = context;
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
