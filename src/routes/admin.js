/** Alle Endpunkte unter /api/admin/ */

import {
  clearSessionCookie,
  clientIp,
  createSessionCookie,
  einrichtungMoeglich,
  isAuthenticated,
  jsonResponse,
  MIN_PASSWORT_LAENGE,
  passwortQuelle,
  pruefePasswort,
  rateLimit,
  requireAdmin,
  sameOrigin,
  setzePasswort,
} from '../lib/auth.js';
import { DEFAULTS, getContent, putContent } from '../lib/content.js';
import { getMailConfig, saveMailConfig, sendMail } from '../lib/mail.js';
import { ladeManifest, loescheBild, SLOTS, speichereBild } from '../lib/bilder.js';

const PRAEFIX = 'anfrage:';

async function login(request, env) {
  if ((await passwortQuelle(env)) === 'keins') {
    return jsonResponse(
      {
        error: 'Es ist noch kein Passwort vergeben. Bitte lege zuerst eines fest.',
        einrichtungNoetig: true,
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

  if (!(await pruefePasswort(env, password))) {
    return jsonResponse({ error: 'Passwort stimmt nicht.' }, { status: 401 });
  }

  return jsonResponse({ ok: true }, { headers: { 'Set-Cookie': await createSessionCookie(env) } });
}

/**
 * Erstmalige Vergabe des Passworts – nur moeglich, solange noch keines
 * existiert. Danach antwortet der Endpunkt dauerhaft mit 403.
 */
async function einrichten(request, env) {
  if (!sameOrigin(request)) {
    return jsonResponse({ error: 'Ungültige Anfrage.' }, { status: 403 });
  }
  if (!(await einrichtungMoeglich(env))) {
    return jsonResponse(
      { error: 'Es ist bereits ein Passwort vergeben. Bitte melde dich an.' },
      { status: 403 }
    );
  }

  let passwort = '';
  let wiederholung = '';
  try {
    const body = await request.json();
    passwort = String(body.passwort || '');
    wiederholung = String(body.wiederholung || '');
  } catch {
    return jsonResponse({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  if (passwort !== wiederholung) {
    return jsonResponse({ error: 'Die beiden Passwörter stimmen nicht überein.' }, { status: 400 });
  }

  const fehler = await setzePasswort(env, passwort);
  if (fehler) return jsonResponse({ error: fehler }, { status: 400 });

  return jsonResponse({ ok: true }, { headers: { 'Set-Cookie': await createSessionCookie(env) } });
}

/** Passwort aendern – nur angemeldet und nur mit dem bisherigen Passwort. */
async function passwortAendern(request, env) {
  const abgelehnt = await requireAdmin(request, env);
  if (abgelehnt) return abgelehnt;
  if (!sameOrigin(request)) {
    return jsonResponse({ error: 'Ungültige Anfrage.' }, { status: 403 });
  }
  if ((await passwortQuelle(env)) === 'secret') {
    return jsonResponse(
      {
        error:
          'Das Passwort stammt aus dem Secret ADMIN_PASSWORD und lässt sich nur im ' +
          'Cloudflare-Dashboard ändern.',
      },
      { status: 409 }
    );
  }

  let aktuell = '';
  let neu = '';
  let wiederholung = '';
  try {
    const body = await request.json();
    aktuell = String(body.aktuell || '');
    neu = String(body.neu || '');
    wiederholung = String(body.wiederholung || '');
  } catch {
    return jsonResponse({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  if (!(await pruefePasswort(env, aktuell))) {
    return jsonResponse({ error: 'Das bisherige Passwort stimmt nicht.' }, { status: 401 });
  }
  if (neu !== wiederholung) {
    return jsonResponse({ error: 'Die beiden neuen Passwörter stimmen nicht überein.' }, { status: 400 });
  }

  const fehler = await setzePasswort(env, neu);
  if (fehler) return jsonResponse({ error: fehler }, { status: 400 });

  return jsonResponse(
    { ok: true },
    { headers: { 'Set-Cookie': await createSessionCookie(env) } }
  );
}

/** Sagt der Admin-Oberflaeche, ob angemeldet und ob alles eingerichtet ist. */
async function session(request, env) {
  const quelle = await passwortQuelle(env);
  const mailConfig = await getMailConfig(env);
  return jsonResponse({
    angemeldet: quelle === 'keins' ? false : await isAuthenticated(request, env),
    einrichtungNoetig: quelle === 'keins' && Boolean(env.SITE_KV),
    passwortQuelle: quelle,
    minPasswortLaenge: MIN_PASSWORT_LAENGE,
    eingerichtet: {
      passwort: quelle !== 'keins',
      kv: Boolean(env.SITE_KV),
      mail: Boolean(mailConfig.apiKey && mailConfig.from),
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

/** Einstellungen fuer den Mailversand lesen und speichern. */
async function mail(request, env) {
  const abgelehnt = await requireAdmin(request, env);
  if (abgelehnt) return abgelehnt;

  const config = await getMailConfig(env);

  if (request.method === 'GET') {
    return jsonResponse({
      // Der Schluessel selbst wird nie zurueckgegeben.
      apiKeyGesetzt: Boolean(config.apiKey),
      from: config.from,
      to: config.to,
      bestaetigung: config.bestaetigung,
      quelle: config.quelle,
      ausUmgebung: {
        apiKey: Boolean(env.RESEND_API_KEY),
        from: Boolean(env.CONTACT_FROM),
        to: Boolean(env.CONTACT_TO),
      },
    });
  }

  if (!sameOrigin(request)) return jsonResponse({ error: 'Ungültige Anfrage.' }, { status: 403 });

  let eingabe;
  try {
    eingabe = await request.json();
  } catch {
    return jsonResponse({ error: 'Ungültige Daten.' }, { status: 400 });
  }

  const fehler = await saveMailConfig(env, eingabe);
  if (fehler) return jsonResponse({ error: fehler }, { status: 400 });

  const neu = await getMailConfig(env);
  return jsonResponse({
    ok: true,
    apiKeyGesetzt: Boolean(neu.apiKey),
    from: neu.from,
    to: neu.to,
    bestaetigung: neu.bestaetigung,
  });
}

/** Testmail an die hinterlegte Adresse schicken. */
async function mailtest(request, env) {
  const abgelehnt = await requireAdmin(request, env);
  if (abgelehnt) return abgelehnt;
  if (!sameOrigin(request)) return jsonResponse({ error: 'Ungültige Anfrage.' }, { status: 403 });

  const config = await getMailConfig(env);
  const content = await getContent(env);
  const empfaenger = config.to || content.kontakt.email;

  if (!config.apiKey || !config.from) {
    return jsonResponse(
      { error: 'Bitte zuerst Schlüssel und Absenderadresse eintragen und speichern.' },
      { status: 400 }
    );
  }
  if (!empfaenger) {
    return jsonResponse(
      { error: 'Es ist keine Empfängeradresse hinterlegt – weder hier noch unter „Kontakt".' },
      { status: 400 }
    );
  }

  const versand = await sendMail(env, {
    to: empfaenger,
    subject: 'Testmail von deiner Website',
    text:
      'Diese Nachricht kommt aus dem Admin-Bereich deiner Website.\n\n' +
      'Wenn du sie liest, funktioniert der Mailversand – Anfragen aus dem Kontaktformular ' +
      'landen ab jetzt in diesem Postfach.',
    html:
      '<p style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.6">' +
      'Diese Nachricht kommt aus dem Admin-Bereich deiner Website.<br><br>' +
      'Wenn du sie liest, funktioniert der Mailversand – Anfragen aus dem Kontaktformular ' +
      'landen ab jetzt in diesem Postfach.</p>',
  });

  if (!versand.ok) {
    return jsonResponse(
      { error: versand.error || 'Der Versand hat nicht geklappt.', empfaenger },
      { status: 502 }
    );
  }
  return jsonResponse({ ok: true, empfaenger });
}

/** Fotos hochladen, ansehen und entfernen. */
async function bilder(request, env) {
  const abgelehnt = await requireAdmin(request, env);
  if (abgelehnt) return abgelehnt;

  if (request.method === 'GET') {
    const manifest = await ladeManifest(env);
    return jsonResponse({
      slots: SLOTS.map((slot) => ({
        ...slot,
        eigenes: manifest[slot.id] || null,
      })),
    });
  }

  if (!sameOrigin(request)) return jsonResponse({ error: 'Ungültige Anfrage.' }, { status: 403 });

  if (request.method === 'DELETE') {
    const slot = new URL(request.url).searchParams.get('slot') || '';
    const fehler = await loescheBild(env, slot);
    if (fehler) return jsonResponse({ error: fehler }, { status: 400 });
    return jsonResponse({ ok: true });
  }

  let eingabe;
  try {
    eingabe = await request.json();
  } catch {
    return jsonResponse({ error: 'Ungültige Daten.' }, { status: 400 });
  }

  // Das Bild kommt als Data-URL aus dem Browser, dort bereits verkleinert.
  const treffer = /^data:(image\/[a-z+]+);base64,(.+)$/i.exec(String(eingabe.datei || ''));
  if (!treffer) return jsonResponse({ error: 'Kein gültiges Bild empfangen.' }, { status: 400 });

  let bytes;
  try {
    const binaer = atob(treffer[2]);
    bytes = new Uint8Array(binaer.length);
    for (let i = 0; i < binaer.length; i++) bytes[i] = binaer.charCodeAt(i);
  } catch {
    return jsonResponse({ error: 'Das Bild konnte nicht gelesen werden.' }, { status: 400 });
  }

  const fehler = await speichereBild(env, eingabe.slot, bytes, treffer[1], eingabe.alt);
  if (fehler) return jsonResponse({ error: fehler }, { status: 400 });

  const manifest = await ladeManifest(env);
  return jsonResponse({ ok: true, eigenes: manifest[eingabe.slot] || null });
}

const ROUTEN = {
  login: { POST: login },
  einrichten: { POST: einrichten },
  passwort: { POST: passwortAendern },
  logout: { POST: () => jsonResponse({ ok: true }, { headers: { 'Set-Cookie': clearSessionCookie() } }) },
  session: { GET: session },
  content: { GET: content, PUT: content, DELETE: content },
  mail: { GET: mail, POST: mail },
  bilder: { GET: bilder, POST: bilder, DELETE: bilder },
  mailtest: { POST: mailtest },
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
