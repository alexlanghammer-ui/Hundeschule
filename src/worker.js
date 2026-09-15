/**
 * Einstiegspunkt des Cloudflare Workers.
 *
 * Statische Dateien (CSS, Skripte, Schriften, Fotos, /admin) liefert Cloudflare
 * selbst aus – dieser Code laeuft nur fuer alles Uebrige: die gerenderten
 * Seiten und die Schnittstellen unter /api/.
 */

import { handleAdmin } from './routes/admin.js';
import { handleKontakt } from './routes/kontakt.js';
import { handleSeite } from './routes/site.js';
import { ladeBild } from './lib/bilder.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path;
    try {
      path = decodeURIComponent(url.pathname);
    } catch {
      path = url.pathname;
    }

    try {
      // Selbst hochgeladene Fotos
      if (path.startsWith('/bilder/')) {
        const bild = await ladeBild(env, path.slice('/bilder/'.length));
        if (!bild) return new Response('Nicht gefunden', { status: 404 });
        return new Response(bild.body, {
          headers: {
            'Content-Type': bild.typ,
            // Die Adresse enthält den Inhalts-Hash: Ändert sich das Bild,
            // ändert sich die Adresse – daher unbedenklich lange speicherbar.
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }

      if (path.startsWith('/api/admin/')) return await handleAdmin(request, env, path);
      if (path === '/api/kontakt') return await handleKontakt(request, env);
      if (path.startsWith('/api/')) {
        return new Response(JSON.stringify({ error: 'Unbekannter Endpunkt.' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        });
      }
      return await handleSeite(request, env, path, url);
    } catch (err) {
      console.error('Unerwarteter Fehler:', err && err.stack ? err.stack : err);
      return new Response(
        '<!doctype html><html lang="de"><meta charset="utf-8"><title>Fehler</title>' +
          '<body style="font-family:system-ui;padding:40px;max-width:40em;margin:0 auto">' +
          '<h1>Da ist etwas schiefgelaufen</h1>' +
          '<p>Bitte versuche es in ein paar Minuten erneut – oder ruf einfach an.</p>' +
          '<p><a href="/">Zur Startseite</a></p></body></html>',
        { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }
  },
};
