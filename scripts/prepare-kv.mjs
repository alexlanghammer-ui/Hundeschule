/**
 * Verbindet den Speicher (KV) automatisch – laeuft im Cloudflare-Build vor dem
 * Deploy.
 *
 * Hintergrund: Beim Git-Deployment ist wrangler.toml die maßgebliche Quelle für
 * Bindings; ein nur im Dashboard gesetztes KV-Binding würde überschrieben. Die
 * Namespace-ID von Hand einzutragen ist fehleranfällig, deshalb sucht dieses
 * Skript den Namespace (und legt ihn an, falls es ihn noch nicht gibt) und
 * schreibt ihn in die Konfiguration.
 *
 * Wichtig: Das Skript bricht den Build nie ab. Klappt etwas nicht, bleibt
 * wrangler.toml unverändert – die Website läuft dann mit den Standardinhalten
 * weiter und im Admin-Bereich steht unter „System“, dass der Speicher fehlt.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const NAMESPACE_NAME = 'hundeschule-inhalte';
const BINDING = 'SITE_KV';
const CONFIG = 'wrangler.toml';

function log(zeile) {
  console.log(`[speicher] ${zeile}`);
}

function wrangler(args) {
  return execFileSync('npx', ['--yes', 'wrangler', ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 120000,
  });
}

/** Alle KV-Namespaces des Kontos, oder null wenn der Aufruf nicht klappt. */
function listeNamespaces() {
  try {
    const ausgabe = wrangler(['kv', 'namespace', 'list']);
    const json = ausgabe.slice(ausgabe.indexOf('['));
    const liste = JSON.parse(json);
    return Array.isArray(liste) ? liste : null;
  } catch (err) {
    log(`Namespaces konnten nicht gelesen werden: ${err.message.split('\n')[0]}`);
    return null;
  }
}

/** Passenden Namespace finden: erst exakter Name, sonst irgendeiner der Hundeschule. */
function findeNamespace(liste) {
  return (
    liste.find((n) => n.title === NAMESPACE_NAME) ||
    liste.find((n) => String(n.title || '').toLowerCase().includes('hundeschule')) ||
    null
  );
}

function main() {
  const config = readFileSync(CONFIG, 'utf8');

  // Schon von Hand eingetragen? Dann nichts tun.
  if (/^\s*\[\[kv_namespaces\]\]/m.test(config)) {
    log('KV-Binding steht bereits in wrangler.toml – nichts zu tun.');
    return;
  }

  const liste = listeNamespaces();
  if (!liste) {
    log('Überspringe die Einrichtung. Die Website läuft mit den Standardinhalten.');
    return;
  }

  let namespace = findeNamespace(liste);

  if (!namespace) {
    log(`Kein passender Namespace gefunden, lege „${NAMESPACE_NAME}“ an.`);
    try {
      wrangler(['kv', 'namespace', 'create', NAMESPACE_NAME]);
      namespace = findeNamespace(listeNamespaces() || []);
    } catch (err) {
      log(`Anlegen fehlgeschlagen: ${err.message.split('\n')[0]}`);
      return;
    }
  }

  if (!namespace || !namespace.id) {
    log('Kein Namespace verfügbar. Die Website läuft mit den Standardinhalten.');
    return;
  }

  const block = `\n[[kv_namespaces]]\nbinding = "${BINDING}"\nid = "${namespace.id}"\n`;
  writeFileSync(CONFIG, config + block);
  log(`Speicher verbunden: „${namespace.title}“ (${namespace.id}).`);
}

try {
  main();
} catch (err) {
  log(`Unerwarteter Fehler, übersprungen: ${err && err.message}`);
}
