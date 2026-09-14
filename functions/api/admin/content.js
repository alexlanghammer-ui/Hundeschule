/** Inhalte lesen und speichern (nur angemeldet). */

import { jsonResponse, requireAdmin, sameOrigin } from '../../../src/lib/auth.js';
import { DEFAULTS, getContent, putContent } from '../../../src/lib/content.js';

export async function onRequestGet(context) {
  const { request, env } = context;
  const abgelehnt = await requireAdmin(request, env);
  if (abgelehnt) return abgelehnt;

  const content = await getContent(env);
  return jsonResponse({ content, quelle: content._source, updatedAt: content.updatedAt || null });
}

export async function onRequestPut(context) {
  const { request, env } = context;
  const abgelehnt = await requireAdmin(request, env);
  if (abgelehnt) return abgelehnt;
  if (!sameOrigin(request)) return jsonResponse({ error: 'Ungültige Anfrage.' }, { status: 403 });

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

/** Setzt alles auf die Auslieferungswerte zurueck. */
export async function onRequestDelete(context) {
  const { request, env } = context;
  const abgelehnt = await requireAdmin(request, env);
  if (abgelehnt) return abgelehnt;
  if (!sameOrigin(request)) return jsonResponse({ error: 'Ungültige Anfrage.' }, { status: 403 });

  try {
    const gespeichert = await putContent(env, DEFAULTS);
    return jsonResponse({ ok: true, content: gespeichert });
  } catch (err) {
    return jsonResponse({ error: err.message || 'Zurücksetzen fehlgeschlagen.' }, { status: 500 });
  }
}
