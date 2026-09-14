/**
 * Laden und Speichern der pflegbaren Inhalte.
 *
 * Quelle ist der KV-Namespace (Binding `SITE_KV`, Schluessel `site:content`).
 * Fehlt der Eintrag oder das Binding, greifen die Defaults aus
 * src/data/defaults.js – die Seite laeuft also auch ohne Konfiguration.
 */

import DEFAULTS from '../data/defaults.js';

export const CONTENT_KEY = 'site:content';

const LIMITS = {
  short: 200,
  line: 500,
  text: 6000,
  listItems: 60,
  kurse: 30,
  preise: 60,
};

function str(value, max) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/\r\n/g, '\n').trim().slice(0, max);
}

function strList(value, max, limit) {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => str(v, max))
    .filter(Boolean)
    .slice(0, limit);
}

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** Uebernimmt nur bekannte Felder und kuerzt zu lange Werte. */
export function sanitize(input) {
  const src = input && typeof input === 'object' ? input : {};
  const d = DEFAULTS;

  const kontaktIn = src.kontakt && typeof src.kontakt === 'object' ? src.kontakt : {};
  const kontakt = {};
  for (const key of Object.keys(d.kontakt)) {
    const value = str(kontaktIn[key], LIMITS.short);
    kontakt[key] = value || (key in kontaktIn ? '' : d.kontakt[key]);
  }

  const preiseIn = src.preise && typeof src.preise === 'object' ? src.preise : {};
  const preise = {
    items: Array.isArray(preiseIn.items)
      ? preiseIn.items
          .map((item) => ({
            l: str(item && item.l, LIMITS.line),
            r: str(item && item.r, LIMITS.short),
          }))
          .filter((item) => item.l || item.r)
          .slice(0, LIMITS.preise)
      : d.preise.items,
    hinweise: Array.isArray(preiseIn.hinweise)
      ? strList(preiseIn.hinweise, LIMITS.line, 10)
      : d.preise.hinweise,
  };

  const usedSlugs = new Set();
  const kurse = Array.isArray(src.kurse)
    ? src.kurse
        .map((k) => (k && typeof k === 'object' ? k : {}))
        .map((k) => {
          const title = str(k.title, LIMITS.short);
          let slug = slugify(k.slug) || slugify(title);
          if (!slug) slug = 'kurs';
          let unique = slug;
          let n = 2;
          while (usedSlugs.has(unique)) unique = `${slug}-${n++}`;
          usedSlugs.add(unique);
          return {
            slug: unique,
            sichtbar: k.sichtbar !== false,
            badge: str(k.badge, 40),
            title,
            claim: str(k.claim, LIMITS.line),
            teaser: str(k.teaser, LIMITS.text),
            umfang: str(k.umfang, 60),
            start: str(k.start, 60),
            preis: str(k.preis, 60),
            termine: str(k.termine, LIMITS.text),
            ort: str(k.ort, LIMITS.line),
            gebuehr: str(k.gebuehr, LIMITS.line),
            trainerin: str(k.trainerin, LIMITS.line),
            voraussetzung: str(k.voraussetzung, LIMITS.text),
            body: strList(k.body, LIMITS.text, 20),
            inhalte: strList(k.inhalte, LIMITS.line, LIMITS.listItems),
          };
        })
        .filter((k) => k.title)
        .slice(0, LIMITS.kurse)
    : d.kurse;

  const gelaendeIn = src.gelaende && typeof src.gelaende === 'object' ? src.gelaende : {};
  const gelaende = {
    text: Array.isArray(gelaendeIn.text)
      ? strList(gelaendeIn.text, LIMITS.text, 20)
      : d.gelaende.text,
    liste: Array.isArray(gelaendeIn.liste)
      ? strList(gelaendeIn.liste, LIMITS.line, LIMITS.listItems)
      : d.gelaende.liste,
  };

  const rechtIn = src.recht && typeof src.recht === 'object' ? src.recht : {};
  const recht = {};
  for (const key of Object.keys(d.recht)) {
    const page = rechtIn[key] && typeof rechtIn[key] === 'object' ? rechtIn[key] : null;
    if (!page || !Array.isArray(page.blocks)) {
      recht[key] = d.recht[key];
      continue;
    }
    recht[key] = {
      title: str(page.title, LIMITS.short) || d.recht[key].title,
      lead: str(page.lead, LIMITS.line),
      blocks: page.blocks
        .map((b) => ({
          h: str(b && b.h, LIMITS.short),
          p: strList(b && b.p, LIMITS.text, 20),
        }))
        .filter((b) => b.h || b.p.length)
        .slice(0, 60),
    };
  }

  return { version: 1, kontakt, preise, kurse, gelaende, recht };
}

/** Aktuellen Inhalt laden (KV ueber Defaults gelegt). */
export async function getContent(env) {
  const kv = env && env.SITE_KV;
  if (!kv) return { ...DEFAULTS, _source: 'defaults' };
  try {
    const stored = await kv.get(CONTENT_KEY, { type: 'json' });
    if (!stored) return { ...DEFAULTS, _source: 'defaults' };
    return { ...sanitize(stored), _source: 'kv', updatedAt: stored.updatedAt || null };
  } catch (err) {
    console.error('KV read failed, serving defaults:', err && err.message);
    return { ...DEFAULTS, _source: 'defaults' };
  }
}

/** Inhalt speichern. Gibt den bereinigten Datensatz zurueck. */
export async function putContent(env, input) {
  if (!env || !env.SITE_KV) {
    throw new Error(
      'Der Speicher ist noch nicht verbunden – Speichern ist deshalb nicht möglich. ' +
        'Details stehen im Reiter „System".'
    );
  }
  const clean = sanitize(input);
  clean.updatedAt = new Date().toISOString();
  await env.SITE_KV.put(CONTENT_KEY, JSON.stringify(clean));
  return clean;
}

/** Platzhalter wie {{email}} in Rechtstexten durch Kontaktdaten ersetzen. */
export function fillPlaceholders(text, kontakt) {
  return String(text || '').replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) =>
    key in kontakt ? kontakt[key] : match
  );
}

/** Nur sichtbare Kurse, in gepflegter Reihenfolge. */
export function sichtbareKurse(content) {
  return (content.kurse || []).filter((k) => k.sichtbar !== false);
}

/** Kartenzeile „7 x 60 Min. · ab 13.04.2026 · 195,- €“. */
export function kursMeta(kurs) {
  return [kurs.umfang, kurs.start, kurs.preis].map((v) => (v || '').trim()).filter(Boolean).join(' · ');
}

export { DEFAULTS };
