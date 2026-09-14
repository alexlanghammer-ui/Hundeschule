/** Eingegangene Formularanfragen ansehen und loeschen (nur angemeldet). */

import { jsonResponse, requireAdmin, sameOrigin } from '../../../src/lib/auth.js';

const PRAEFIX = 'anfrage:';

export async function onRequestGet(context) {
  const { request, env } = context;
  const abgelehnt = await requireAdmin(request, env);
  if (abgelehnt) return abgelehnt;

  if (!env.SITE_KV) {
    return jsonResponse({ anfragen: [], hinweis: 'Kein KV-Namespace gebunden.' });
  }

  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor') || undefined;
  const liste = await env.SITE_KV.list({ prefix: PRAEFIX, limit: 100, cursor });

  const anfragen = await Promise.all(
    liste.keys.map(async (eintrag) => {
      const daten = await env.SITE_KV.get(eintrag.name, { type: 'json' });
      return daten ? { id: eintrag.name, ...daten } : null;
    })
  );

  return jsonResponse({
    anfragen: anfragen.filter(Boolean).sort((a, b) => (a.ts < b.ts ? 1 : -1)),
    cursor: liste.list_complete ? null : liste.cursor,
  });
}

export async function onRequestDelete(context) {
  const { request, env } = context;
  const abgelehnt = await requireAdmin(request, env);
  if (abgelehnt) return abgelehnt;
  if (!sameOrigin(request)) return jsonResponse({ error: 'Ungültige Anfrage.' }, { status: 403 });
  if (!env.SITE_KV) return jsonResponse({ error: 'Kein KV-Namespace gebunden.' }, { status: 503 });

  const id = new URL(request.url).searchParams.get('id') || '';
  if (!id.startsWith(PRAEFIX)) {
    return jsonResponse({ error: 'Unbekannte Anfrage.' }, { status: 400 });
  }

  await env.SITE_KV.delete(id);
  return jsonResponse({ ok: true });
}
