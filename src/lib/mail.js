/**
 * E-Mail-Versand ueber Resend (https://resend.com).
 *
 * Gewaehlt, weil der Versand eine reine HTTPS-API ist und damit in der
 * Workers-Runtime funktioniert (SMTP ist dort nicht moeglich). Fehlt der
 * API-Key, wird nicht versendet – die Anfrage liegt dann trotzdem im KV und
 * ist im Admin-Bereich unter „Anfragen“ sichtbar.
 */

import { esc } from './html.js';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export function mailConfigured(env) {
  return Boolean(env && env.RESEND_API_KEY && env.CONTACT_FROM);
}

/**
 * @returns {Promise<{ok: boolean, id?: string, skipped?: boolean, error?: string}>}
 */
export async function sendMail(env, { to, replyTo, subject, html, text }) {
  if (!mailConfigured(env)) {
    return { ok: false, skipped: true, error: 'RESEND_API_KEY oder CONTACT_FROM nicht gesetzt' };
  }
  if (!to) return { ok: false, error: 'Keine Empfaengeradresse hinterlegt' };

  const payload = {
    from: env.CONTACT_FROM,
    to: [to],
    subject,
    html,
    text,
  };
  if (replyTo) payload.reply_to = replyTo;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: data.message || `Resend antwortete mit ${res.status}` };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : 'Netzwerkfehler' };
  }
}

/** Baut die Benachrichtigungs-Mail zu einer Formularanfrage. */
export function anfrageMail(anfrage, siteName) {
  const rows = [
    ['Name', anfrage.name],
    ['Kontakt', anfrage.kontakt],
    ['Thema', anfrage.thema],
    ['Eingegangen', new Date(anfrage.ts).toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })],
  ];

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nNachricht:\n${anfrage.nachricht}\n`;

  const html = `<!doctype html><html lang="de"><body style="margin:0;background:#F1F5EE;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#16241D">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #E6EBE4;border-radius:16px;padding:24px">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6A8A76;font-weight:700">Neue Anfrage</p>
    <h1 style="margin:0 0 18px;font-size:22px;line-height:1.25">${esc(siteName)}</h1>
    <table style="width:100%;border-collapse:collapse;font-size:15px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:7px 0;color:#57685C;width:120px;vertical-align:top">${esc(
              k
            )}</td><td style="padding:7px 0;font-weight:600">${esc(v || '–')}</td></tr>`
        )
        .join('')}
    </table>
    <div style="margin-top:18px;padding-top:18px;border-top:1px solid #EDF1EA">
      <p style="margin:0 0 6px;color:#57685C;font-size:14px">Nachricht</p>
      <p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap">${esc(
        anfrage.nachricht
      )}</p>
    </div>
  </div>
</body></html>`;

  return {
    subject: `Neue Anfrage von ${anfrage.name}${anfrage.thema ? ` · ${anfrage.thema}` : ''}`,
    html,
    text,
  };
}

/** Automatische Eingangsbestaetigung an die anfragende Person. */
export function bestaetigungsMail(anfrage, kontakt) {
  const text = `Hallo ${anfrage.name},

vielen Dank für deine Nachricht! Ich habe deine Anfrage erhalten und melde mich so schnell wie möglich bei dir zurück.

Deine Nachricht:
${anfrage.nachricht}

Viele Grüße
${kontakt.name}
${kontakt.mobil}
${kontakt.email}`;

  const html = `<!doctype html><html lang="de"><body style="margin:0;background:#F1F5EE;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#16241D">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #E6EBE4;border-radius:16px;padding:24px">
    <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3">Danke für deine Nachricht!</h1>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6">Hallo ${esc(anfrage.name)},</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6">ich habe deine Anfrage erhalten und melde mich so schnell wie möglich bei dir zurück.</p>
    <div style="margin:18px 0;padding:14px 16px;background:#F1F5EE;border-radius:12px">
      <p style="margin:0 0 6px;color:#57685C;font-size:13px">Deine Nachricht</p>
      <p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap">${esc(
        anfrage.nachricht
      )}</p>
    </div>
    <p style="margin:0;font-size:15px;line-height:1.6">Viele Grüße<br>${esc(kontakt.name)}<br>
      <a href="tel:${esc(String(kontakt.mobil).replace(/[^\d+]/g, ''))}" style="color:#12855A">${esc(
        kontakt.mobil
      )}</a><br>
      <a href="mailto:${esc(kontakt.email)}" style="color:#12855A">${esc(kontakt.email)}</a>
    </p>
  </div>
</body></html>`;

  return { subject: 'Deine Anfrage ist angekommen', html, text };
}
