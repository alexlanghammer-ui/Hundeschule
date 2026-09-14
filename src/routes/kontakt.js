/**
 * Kontaktformular (/api/kontakt).
 *
 * Ablauf: pruefen -> im KV ablegen -> per Resend zustellen.
 * Die Ablage im KV passiert zuerst, damit keine Anfrage verloren geht, falls
 * der Mailversand gerade klemmt. Im Admin-Bereich sind alle Anfragen sichtbar.
 */

import { getContent } from '../lib/content.js';
import { anfrageMail, bestaetigungsMail, getMailConfig, sendMail } from '../lib/mail.js';
import { clientIp, jsonResponse, rateLimit } from '../lib/auth.js';

const MAX_BODY = 20_000;
const ANFRAGE_TTL = 60 * 60 * 24 * 180; // 180 Tage
const MIN_FILL_SECONDS = 3;

function str(value, max) {
  return String(value === undefined || value === null ? '' : value)
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, max);
}

function istEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value);
}

function istTelefon(value) {
  const ziffern = value.replace(/[^\d]/g, '');
  return ziffern.length >= 6 && /^[\d\s+()/.-]+$/.test(value);
}

async function leseEingabe(request) {
  const typ = request.headers.get('Content-Type') || '';
  if (typ.includes('application/json')) {
    const text = await request.text();
    if (text.length > MAX_BODY) throw new Error('Anfrage zu groß');
    return { daten: JSON.parse(text), alsFormular: false };
  }
  const form = await request.formData();
  const daten = {};
  for (const [key, value] of form.entries()) daten[key] = value;
  return { daten, alsFormular: true };
}

async function pruefeTurnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET_KEY) return { ok: true, skipped: true };
  if (!token) return { ok: false, error: 'Bitte bestätige die Sicherheitsabfrage.' };
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
    });
    const data = await res.json();
    return data.success
      ? { ok: true }
      : { ok: false, error: 'Die Sicherheitsabfrage ist fehlgeschlagen. Bitte erneut versuchen.' };
  } catch {
    // Lieber durchlassen als eine echte Anfrage blockieren
    return { ok: true, error: 'Turnstile nicht erreichbar' };
  }
}

async function anfrageEmpfangen(request, env) {
  const ip = clientIp(request);

  let daten;
  let alsFormular = false;
  try {
    const eingabe = await leseEingabe(request);
    daten = eingabe.daten;
    alsFormular = eingabe.alsFormular;
  } catch {
    return jsonResponse({ ok: false, error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const antwort = (ok, payload, status) => {
    if (alsFormular) {
      const ziel = new URL('/kontakt', request.url);
      ziel.searchParams.set('status', ok ? 'ok' : 'error');
      ziel.hash = 'kontaktForm';
      return Response.redirect(ziel.toString(), 303);
    }
    return jsonResponse({ ok, ...payload }, { status: status || (ok ? 200 : 400) });
  };

  // Honeypot: von Menschen nie ausgefuellt
  if (str(daten.webseite, 100)) {
    return antwort(true, { gespeichert: false });
  }

  // Zu schnell abgeschickt = sehr wahrscheinlich ein Bot
  const ts = parseInt(daten.ts, 10);
  if (ts && Date.now() - ts < MIN_FILL_SECONDS * 1000) {
    return antwort(false, { error: 'Bitte nimm dir einen Moment und sende die Anfrage erneut.' });
  }

  const name = str(daten.name, 100);
  const kontaktweg = str(daten.kontakt, 120);
  const thema = str(daten.thema, 120);
  const nachricht = str(daten.nachricht, 3000);
  const einwilligung = ['ja', 'on', 'true', '1'].includes(String(daten.datenschutz).toLowerCase());

  if (name.length < 2) return antwort(false, { error: 'Bitte trage deinen Namen ein.' });
  if (!istEmail(kontaktweg) && !istTelefon(kontaktweg)) {
    return antwort(false, {
      error: 'Bitte trage eine gültige E-Mail-Adresse oder Telefonnummer ein.',
    });
  }
  if (nachricht.length < 10) {
    return antwort(false, { error: 'Bitte schreib mir ein paar Sätze zu deinem Anliegen.' });
  }
  if (!einwilligung) {
    return antwort(false, { error: 'Bitte stimme den Datenschutzhinweisen zu.' });
  }

  const limit = await rateLimit(env, 'kontakt', ip, 5, 60 * 60);
  if (!limit.allowed) {
    return antwort(
      false,
      { error: 'Es sind bereits mehrere Anfragen eingegangen. Bitte melde dich telefonisch.' },
      429
    );
  }

  const turnstile = await pruefeTurnstile(env, daten['cf-turnstile-response'], ip);
  if (!turnstile.ok) return antwort(false, { error: turnstile.error });

  const anfrage = {
    ts: new Date().toISOString(),
    name,
    kontakt: kontaktweg,
    thema,
    nachricht,
    ip,
    userAgent: str(request.headers.get('User-Agent'), 200),
    mail: 'offen',
  };

  const key = `anfrage:${Date.now()}:${crypto.randomUUID().slice(0, 8)}`;
  if (env.SITE_KV) {
    try {
      await env.SITE_KV.put(key, JSON.stringify(anfrage), { expirationTtl: ANFRAGE_TTL });
    } catch (err) {
      console.error('Anfrage konnte nicht gespeichert werden:', err && err.message);
    }
  }

  const content = await getContent(env);
  const mailConfig = await getMailConfig(env);
  const empfaenger = mailConfig.to || content.kontakt.email;
  const mail = anfrageMail(anfrage, content.kontakt.betrieb || content.kontakt.name);
  const versand = await sendMail(env, {
    to: empfaenger,
    replyTo: istEmail(kontaktweg) ? kontaktweg : undefined,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });

  if (!versand.ok) {
    console.error('Mailversand fehlgeschlagen:', versand.error);
  }

  // Eingangsbestaetigung an die anfragende Person (nur bei E-Mail-Adresse)
  if (versand.ok && istEmail(kontaktweg) && mailConfig.bestaetigung) {
    const best = bestaetigungsMail(anfrage, content.kontakt);
    const bestVersand = await sendMail(env, {
      to: kontaktweg,
      replyTo: content.kontakt.email,
      subject: best.subject,
      html: best.html,
      text: best.text,
    });
    if (!bestVersand.ok) console.error('Bestätigungsmail fehlgeschlagen:', bestVersand.error);
  }

  if (env.SITE_KV) {
    anfrage.mail = versand.ok ? 'gesendet' : versand.skipped ? 'nicht eingerichtet' : 'fehlgeschlagen';
    if (!versand.ok && versand.error) anfrage.mailFehler = versand.error;
    try {
      await env.SITE_KV.put(key, JSON.stringify(anfrage), { expirationTtl: ANFRAGE_TTL });
    } catch {
      /* Status ist nur zusaetzliche Information */
    }
  }

  // Wenn weder Mail noch Speicher funktioniert haben, ist die Anfrage verloren –
  // das muss die Besucherin oder der Besucher erfahren.
  if (!versand.ok && !env.SITE_KV) {
    return antwort(
      false,
      {
        error:
          'Die Anfrage konnte nicht zugestellt werden. Bitte ruf mich an oder schreib mir direkt eine E-Mail.',
      },
      502
    );
  }

  return antwort(true, {
    gespeichert: Boolean(env.SITE_KV),
    zugestellt: versand.ok,
    hinweis: mailConfig.apiKey && mailConfig.from ? undefined : 'Mailversand ist noch nicht eingerichtet.',
  });
}

/** Einstieg aus dem Worker: POST nimmt die Anfrage an, GET fuehrt zur Kontaktseite. */
export function handleKontakt(request, env) {
  if (request.method === 'POST') return anfrageEmpfangen(request, env);
  if (request.method === 'GET') {
    return Response.redirect(new URL('/kontakt', request.url).toString(), 302);
  }
  return jsonResponse(
    { ok: false, error: 'Methode nicht erlaubt.' },
    { status: 405, headers: { Allow: 'GET, POST' } }
  );
}
