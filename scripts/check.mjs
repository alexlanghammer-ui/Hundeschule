/**
 * Prueft die Logik, die nicht vom Cloudflare-Runtime abhaengt.
 * Aufruf: npm run check
 */

import assert from 'node:assert/strict';
import { sanitize, slugify, kursMeta, fillPlaceholders, DEFAULTS } from '../src/lib/content.js';
import { esc, html, raw, toString, telHref } from '../src/lib/html.js';
import { anfrageMail, bestaetigungsMail, sendMail, mailConfigured } from '../src/lib/mail.js';

let bestanden = 0;
const fehler = [];

function test(name, fn) {
  try {
    fn();
    bestanden++;
  } catch (err) {
    fehler.push(`${name}: ${err.message}`);
  }
}

async function testAsync(name, fn) {
  try {
    await fn();
    bestanden++;
  } catch (err) {
    fehler.push(`${name}: ${err.message}`);
  }
}

/* ------------------------------------------------------------------- HTML */
test('esc maskiert HTML-Sonderzeichen', () => {
  assert.equal(esc('<script>"x"&\'y\''), '&lt;script&gt;&quot;x&quot;&amp;&#39;y&#39;');
});

test('html-Template maskiert eingesetzte Werte', () => {
  const ausgabe = toString(html`<p>${'<b>böse</b>'}</p>`);
  assert.equal(ausgabe, '<p>&lt;b&gt;böse&lt;/b&gt;</p>');
});

test('raw() bleibt unveraendert', () => {
  assert.equal(toString(html`<p>${raw('<b>ok</b>')}</p>`), '<p><b>ok</b></p>');
});

test('Arrays werden zusammengefuegt, false/null verschwinden', () => {
  assert.equal(toString(html`${['a', 'b']}${false}${null}${undefined}`), 'ab');
});

test('telHref entfernt Trennzeichen', () => {
  assert.equal(telHref('+49 176 4319 88-63'), 'tel:+4917643198863');
});

/* --------------------------------------------------------------- Inhalte */
test('slugify macht deutsche Umlaute web-tauglich', () => {
  assert.equal(slugify('Beschäftigung & Alltag'), 'beschaeftigung-alltag');
  assert.equal(slugify('DUMMY-Training für Einsteiger'), 'dummy-training-fuer-einsteiger');
});

test('kursMeta baut die Kartenzeile', () => {
  assert.equal(
    kursMeta({ umfang: '7 x 60 Min.', start: 'ab 13.04.2026', preis: '195,- €' }),
    '7 x 60 Min. · ab 13.04.2026 · 195,- €'
  );
  assert.equal(kursMeta({ umfang: '', start: 'ab morgen', preis: '' }), 'ab morgen');
});

test('fillPlaceholders ersetzt Kontaktdaten in Rechtstexten', () => {
  assert.equal(
    fillPlaceholders('E-Mail: {{email}}, Tel: {{mobil}}', {
      email: 'a@b.de',
      mobil: '+49 1',
    }),
    'E-Mail: a@b.de, Tel: +49 1'
  );
  assert.equal(fillPlaceholders('{{unbekannt}}', {}), '{{unbekannt}}');
});

test('sanitize akzeptiert die Auslieferungswerte unveraendert', () => {
  const rein = sanitize(DEFAULTS);
  assert.equal(rein.kurse.length, DEFAULTS.kurse.length);
  assert.equal(rein.kontakt.mobil, DEFAULTS.kontakt.mobil);
  assert.equal(rein.preise.items.length, DEFAULTS.preise.items.length);
  assert.equal(rein.recht.impressum.blocks.length, DEFAULTS.recht.impressum.blocks.length);
});

test('sanitize wirft unbekannte Felder weg', () => {
  const rein = sanitize({ ...DEFAULTS, boese: 'weg', kontakt: { ...DEFAULTS.kontakt, hack: 'x' } });
  assert.equal(rein.boese, undefined);
  assert.equal(rein.kontakt.hack, undefined);
});

test('sanitize kuerzt zu lange Werte', () => {
  const rein = sanitize({ ...DEFAULTS, kontakt: { ...DEFAULTS.kontakt, mobil: 'x'.repeat(5000) } });
  assert.equal(rein.kontakt.mobil.length, 200);
});

test('sanitize vergibt eindeutige Slugs', () => {
  const rein = sanitize({
    kurse: [
      { title: 'Junghundekurs' },
      { title: 'Junghundekurs' },
      { slug: 'junghundekurs', title: 'Noch einer' },
    ],
  });
  const slugs = rein.kurse.map((k) => k.slug);
  assert.deepEqual(slugs, ['junghundekurs', 'junghundekurs-2', 'junghundekurs-3']);
});

test('sanitize entfernt Kurse ohne Namen', () => {
  const rein = sanitize({ kurse: [{ title: '' }, { title: 'Bleibt' }] });
  assert.equal(rein.kurse.length, 1);
});

test('sanitize behaelt bewusst geleerte Kontaktfelder', () => {
  const rein = sanitize({ kontakt: { ...DEFAULTS.kontakt, facebook: '', festnetz: '' } });
  assert.equal(rein.kontakt.festnetz, '');
});

test('sanitize haelt sichtbar=false fest', () => {
  const rein = sanitize({ kurse: [{ title: 'Versteckt', sichtbar: false }] });
  assert.equal(rein.kurse[0].sichtbar, false);
});

test('sanitize vertraegt komplett leere Eingaben', () => {
  const rein = sanitize(null);
  assert.equal(rein.kurse.length, DEFAULTS.kurse.length);
  assert.equal(rein.version, 1);
});

/* ------------------------------------------------------------------- Mail */
test('anfrageMail maskiert HTML aus dem Formular', () => {
  const mail = anfrageMail(
    {
      ts: new Date().toISOString(),
      name: 'Anna',
      kontakt: 'anna@example.com',
      thema: 'Kurs',
      nachricht: '<img src=x onerror=alert(1)>',
    },
    'Hundeschule'
  );
  assert.ok(!mail.html.includes('<img src=x'));
  assert.ok(mail.html.includes('&lt;img src=x'));
  assert.ok(mail.subject.includes('Anna'));
});

test('bestaetigungsMail nennt Name und Rueckrufnummer', () => {
  const mail = bestaetigungsMail(
    { name: 'Bernd', nachricht: 'Hallo' },
    { name: 'Alexandra Goller', mobil: '+49 176 43198863', email: 'a@b.de' }
  );
  assert.ok(mail.text.includes('Bernd'));
  assert.ok(mail.html.includes('tel:+4917643198863'));
});

test('mailConfigured erkennt fehlende Konfiguration', () => {
  assert.equal(mailConfigured({}), false);
  assert.equal(mailConfigured({ RESEND_API_KEY: 'k' }), false);
  assert.equal(mailConfigured({ RESEND_API_KEY: 'k', CONTACT_FROM: 'a@b.de' }), true);
});

await testAsync('sendMail ohne Konfiguration versendet nichts', async () => {
  const res = await sendMail({}, { to: 'a@b.de', subject: 's', html: 'h', text: 't' });
  assert.equal(res.ok, false);
  assert.equal(res.skipped, true);
});

await testAsync('sendMail schickt die richtige Nutzlast an Resend', async () => {
  const echt = globalThis.fetch;
  let gesehen = null;
  globalThis.fetch = async (url, init) => {
    gesehen = { url, init };
    return new Response(JSON.stringify({ id: 'abc123' }), { status: 200 });
  };
  try {
    const res = await sendMail(
      { RESEND_API_KEY: 'geheim', CONTACT_FROM: 'Hundeschule <a@b.de>' },
      { to: 'ziel@example.com', replyTo: 'gast@example.com', subject: 'Betreff', html: '<p>x</p>', text: 'x' }
    );
    assert.equal(res.ok, true);
    assert.equal(res.id, 'abc123');
    assert.equal(gesehen.url, 'https://api.resend.com/emails');
    assert.equal(gesehen.init.headers.Authorization, 'Bearer geheim');
    const body = JSON.parse(gesehen.init.body);
    assert.equal(body.from, 'Hundeschule <a@b.de>');
    assert.deepEqual(body.to, ['ziel@example.com']);
    assert.equal(body.reply_to, 'gast@example.com');
    assert.equal(body.subject, 'Betreff');
  } finally {
    globalThis.fetch = echt;
  }
});

await testAsync('sendMail meldet einen Fehler von Resend zurueck', async () => {
  const echt = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({ message: 'Domain nicht verifiziert' }), { status: 403 });
  try {
    const res = await sendMail(
      { RESEND_API_KEY: 'k', CONTACT_FROM: 'a@b.de' },
      { to: 'z@example.com', subject: 's', html: 'h', text: 't' }
    );
    assert.equal(res.ok, false);
    assert.equal(res.error, 'Domain nicht verifiziert');
  } finally {
    globalThis.fetch = echt;
  }
});

/* --------------------------------------------------------------- Ergebnis */
if (fehler.length) {
  console.error(`\n${fehler.length} Test(s) fehlgeschlagen:`);
  fehler.forEach((f) => console.error('  ✗ ' + f));
  process.exit(1);
}
console.log(`✓ ${bestanden} Tests bestanden`);
