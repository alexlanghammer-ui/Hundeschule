/**
 * Selbst hochgeladene Fotos.
 *
 * Die Bilddaten liegen im KV unter `bild:<slot>`, ein schlankes Verzeichnis
 * aller belegten Plaetze unter `site:bilder`. Getrennt vom uebrigen Inhalt,
 * damit ein Speichern im Admin-Bereich ein frisch hochgeladenes Bild nicht
 * ueberschreiben kann.
 *
 * Verkleinert wird bereits im Browser (siehe public/assets/js/admin.js); hier
 * kommt nur noch ein fertiges, kleines JPEG an.
 */

export const MANIFEST_KEY = 'site:bilder';
export const MAX_BYTES = 3 * 1024 * 1024;
const ERLAUBTE_TYPEN = ['image/jpeg', 'image/webp', 'image/png'];

/**
 * Die Plaetze, an denen ein eigenes Foto stehen kann. `standard` verweist auf
 * das mitgelieferte Bild aus public/photos/.
 */
export const SLOTS = [
  {
    id: 'start',
    label: 'Startseite – großes Bild oben',
    hinweis: 'Das erste, was Besucher sehen. Querformat, am besten mindestens 1600 px breit.',
    standard: 'hero',
  },
  {
    id: 'einzeltraining',
    label: 'Einzeltraining',
    hinweis: 'Erscheint auf der Seite „Einzeltraining“ und auf der Startseite in der linken Kachel.',
    standard: 'puppy',
  },
  {
    id: 'kurse',
    label: 'Kurse',
    hinweis: 'Erscheint oben auf der Kursseite und auf der Startseite in der rechten Kachel.',
    standard: 'twoDogs',
  },
  {
    id: 'uebermich',
    label: 'Über mich',
    hinweis: 'Das Foto neben dem Begrüßungstext. Hochformat wird automatisch beschnitten.',
    standard: 'twoDogs',
  },
];

export const SLOT_IDS = SLOTS.map((s) => s.id);

/** Verzeichnis der belegten Plaetze: { uebermich: { hash, typ, alt } }. */
export async function ladeManifest(env) {
  if (!env || !env.SITE_KV) return {};
  try {
    return (await env.SITE_KV.get(MANIFEST_KEY, { type: 'json' })) || {};
  } catch (err) {
    console.error('Bilder-Verzeichnis nicht lesbar:', err && err.message);
    return {};
  }
}

/** Ein Bild ausliefern. */
export async function ladeBild(env, slot) {
  if (!env.SITE_KV || !SLOT_IDS.includes(slot)) return null;
  const { value, metadata } = await env.SITE_KV.getWithMetadata(`bild:${slot}`, {
    type: 'arrayBuffer',
  });
  if (!value) return null;
  return { body: value, typ: (metadata && metadata.typ) || 'image/jpeg' };
}

async function kurzHash(bytes) {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest).slice(0, 6))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Bild ablegen. Gibt eine Fehlermeldung zurueck oder null. */
export async function speichereBild(env, slot, bytes, typ, alt) {
  if (!env.SITE_KV) return 'Der Speicher ist nicht verbunden.';
  if (!SLOT_IDS.includes(slot)) return 'Unbekannter Bildplatz.';
  if (!ERLAUBTE_TYPEN.includes(typ)) return 'Nur JPEG, PNG oder WebP sind möglich.';
  if (!bytes || bytes.byteLength === 0) return 'Die Datei ist leer.';
  if (bytes.byteLength > MAX_BYTES) {
    return `Das Bild ist zu groß (${Math.round(bytes.byteLength / 1024)} kB, erlaubt sind ${
      MAX_BYTES / 1024 / 1024
    } MB).`;
  }

  const hash = await kurzHash(bytes);
  await env.SITE_KV.put(`bild:${slot}`, bytes, { metadata: { typ } });

  const manifest = await ladeManifest(env);
  manifest[slot] = {
    hash,
    typ,
    alt: String(alt || '').trim().slice(0, 300),
    updatedAt: new Date().toISOString(),
  };
  await env.SITE_KV.put(MANIFEST_KEY, JSON.stringify(manifest));
  return null;
}

/** Eigenes Bild entfernen – danach greift wieder das mitgelieferte. */
export async function loescheBild(env, slot) {
  if (!env.SITE_KV) return 'Der Speicher ist nicht verbunden.';
  if (!SLOT_IDS.includes(slot)) return 'Unbekannter Bildplatz.';
  await env.SITE_KV.delete(`bild:${slot}`);
  const manifest = await ladeManifest(env);
  delete manifest[slot];
  await env.SITE_KV.put(MANIFEST_KEY, JSON.stringify(manifest));
  return null;
}

/** Adresse, unter der ein eigenes Bild ausgeliefert wird. */
export function bildUrl(slot, eintrag) {
  return `/bilder/${slot}?v=${eintrag.hash}`;
}
