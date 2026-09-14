# Hundeschule Alexandra Goller – Website

Website für die Hundeschule in Hülben, umgesetzt aus dem Entwurf `4steps4dogs Website v2`.
Läuft als **Cloudflare Worker mit statischen Assets** – ohne Build-Schritt, ohne Framework,
ohne externe Abhängigkeiten zur Laufzeit.

* **Öffentliche Seiten** werden am Edge gerendert. Preise, Kurstermine und Kontaktdaten stehen
  damit direkt im HTML – gut für Google und ohne Flackern beim Laden.
* **Admin-Bereich** unter `/admin`: Preise, Kurstage, Kursgebühren, Handynummer und E-Mail-Adresse
  pflegen, außerdem alle eingegangenen Formularanfragen einsehen.
* **Kontaktformular** stellt per [Resend](https://resend.com) zu und legt jede Anfrage zusätzlich im
  Speicher ab, damit nichts verloren geht.
* **Cookie-Banner**, das seinen Namen verdient: Es werden tatsächlich nur technisch notwendige
  Daten gespeichert, alle Schriften liegen auf dem eigenen Server (kein Google-Fonts-Aufruf).

---

## 1. Schnellstart (lokal)

```bash
npm install
cp .dev.vars.example .dev.vars   # Passwort und Secrets für die lokale Entwicklung
npm run dev                      # http://localhost:8788
npm run check                    # Tests
```

Der Admin-Bereich läuft lokal unter <http://localhost:8788/admin> mit dem Passwort aus `.dev.vars`.
Lokal wird ein simulierter KV-Speicher unter `.wrangler/` genutzt – die echten Daten bleiben unberührt.

---

## 2. Deployment auf Cloudflare

### 2.1 Worker anlegen

1. Cloudflare-Dashboard → **Compute (Workers)** bzw. **Workers & Pages** → **Create application**
   → **Connect to Git** → dieses Repository auswählen.
2. Einstellungen auf der Seite „Set up your application":
   | Feld | Wert |
   | --- | --- |
   | Project name | `hundeschule` (muss mit `name` in `wrangler.toml` übereinstimmen) |
   | Build command | `node scripts/prepare-kv.mjs` |
   | Deploy command | `npx wrangler deploy` |

   Einen echten Build-Schritt gibt es nicht: `wrangler deploy` lädt `public/` als statische Assets
   hoch und `src/worker.js` als Worker-Code. Das Build command verbindet nur den Speicher
   (siehe 2.2).
3. Cloudflare baut aus dem **Standard-Branch** des Repositories (`main`). Der Branch lässt sich
   nachträglich unter **Settings → Builds** ändern.

### 2.2 Speicher (KV)

Ohne KV läuft die Seite mit den Standardinhalten, aber **Speichern im Admin-Bereich ist dann nicht
möglich** und Formularanfragen werden nicht zwischengespeichert.

Das übernimmt `scripts/prepare-kv.mjs` als Build command: Es sucht vor jedem Deploy einen
KV-Namespace namens `hundeschule-inhalte`, legt ihn an, falls es ihn noch nicht gibt, und trägt ihn
in `wrangler.toml` ein. Es bricht den Build nie ab – klappt etwas nicht, wird die Website ohne
Speicher ausgeliefert und im Admin-Bereich steht unter „System", dass er fehlt.

> ⚠️ Warum nicht einfach im Dashboard binden? Beim Git-Deployment ist `wrangler.toml` die
> maßgebliche Quelle. Bindings, die nur im Dashboard gesetzt sind, werden bei jedem Deploy
> überschrieben. Secrets sind davon **nicht** betroffen.

Wer es lieber fest verdrahtet, trägt die Namespace-ID (Dashboard → Storage & Databases → KV →
Namespace → **Settings**) direkt in `wrangler.toml` ein:

```toml
[[kv_namespaces]]
binding = "SITE_KV"
id = "…"
```

Dann lässt das Skript die Datei unangetastet, und das Build command kann leer bleiben.

### 2.3 Passwort für den Admin-Bereich

**Es ist nichts einzurichten.** Beim ersten Aufruf von `/admin` erscheint ein Bildschirm
„Willkommen", auf dem das Passwort selbst vergeben wird. Es landet als PBKDF2-Hash im KV und
übersteht damit jeden Deploy. Ändern lässt es sich später im Admin-Bereich unter **System**.

> ⚠️ **Warum nicht als Secret?** Bei Git-gekoppelten Workers ist `wrangler.toml` die maßgebliche
> Quelle. Jeder Deploy erzeugt eine neue Version, und im Dashboard gesetzte Secrets gehören zu
> einer Version, die dabei überholt wird – das Passwort war nach jedem Build wieder weg. Ein im
> KV hinterlegtes Passwort hat dieses Problem nicht.

Der Einrichtungsbildschirm erscheint nur, solange **kein** Passwort existiert; danach antwortet
der Endpunkt dauerhaft mit 403. Die Seite sollte deshalb direkt nach dem ersten Deploy aufgerufen
werden.

`ADMIN_PASSWORD` funktioniert weiterhin und hat Vorrang, falls es gesetzt ist – dann entfällt der
Einrichtungsbildschirm und das Passwort lässt sich nur im Dashboard ändern.

### 2.3b Optionale Variablen

**Settings → Variables and Secrets.** Alle optional; ohne sie läuft die Seite.

| Name | Typ | Bedeutung |
| --- | --- | --- |
| `SITE_URL` | Text | Öffentliche Adresse ohne Schrägstrich am Ende. Fehlt sie, wird die Adresse des Aufrufs verwendet – nötig erst bei eigener Domain. |
| `RESEND_API_KEY` | Secret | API-Key aus Resend, für den Mailversand. |
| `CONTACT_FROM` | Text | Absender, z. B. `Hundeschule <anfrage@4steps4dogs.de>`. Die Domain muss in Resend verifiziert sein. |
| `CONTACT_TO` | Text | Empfängeradresse. Leer lassen = die im Admin-Bereich gepflegte E-Mail-Adresse. |
| `SEND_CONFIRMATION` | Text | `false` schaltet die automatische Eingangsbestätigung an Anfragende ab. |
| `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Text / Secret | Zusätzlicher Spamschutz. |
| `ADMIN_PASSWORD` | Secret | Überschreibt das selbst vergebene Passwort. |
| `SESSION_SECRET` | Secret | Schlüssel zum Signieren der Anmeldung. Ohne ihn wird einer erzeugt und im KV abgelegt. |

> ⚠️ Auch diese Werte verschwinden bei jedem Deploy wieder, solange sie nur im Dashboard stehen.
> Dauerhaft gehören Klartext-Werte in `wrangler.toml` unter `[vars]`; echte Geheimnisse
> (`RESEND_API_KEY`) müssen nach jedem Deploy neu gesetzt oder per
> `npx wrangler secret put` gepflegt werden.

### 2.4 Eigene Domain

**Settings → Domains & Routes → Add → Custom domain** und die Domain (z. B. `4steps4dogs.de` plus
`www`) verbinden. Danach `SITE_URL` auf die neue Adresse setzen und erneut deployen.

---

## 3. Mailversand mit Resend

**Warum Resend?** In der Workers-Runtime gibt es kein SMTP – es geht nur über eine HTTPS-API.
Resend ist dafür die praktischste Wahl: kostenloses Kontingent (3.000 Mails/Monat, 100/Tag),
DKIM/SPF über die eigene Domain und eine sehr einfache API. MailChannels, früher der kostenlose
Standardweg für Cloudflare Workers, ist seit 2024 kostenpflichtig; Cloudflare Email Routing kann
nur empfangen, nicht senden.

**Einrichtung:**

1. Bei [resend.com](https://resend.com) registrieren.
2. **Domains → Add Domain**, die eigene Domain eintragen und die angezeigten DNS-Einträge
   (SPF, DKIM, optional DMARC) bei Cloudflare DNS hinterlegen. Nach der Verifizierung ist der
   Versand freigeschaltet.
3. **API Keys → Create API Key** (Berechtigung „Sending access“ genügt) und als `RESEND_API_KEY`
   im Worker-Projekt hinterlegen.
4. `CONTACT_FROM` auf eine Adresse dieser Domain setzen.

**Ohne diese Einrichtung funktioniert das Formular trotzdem**: Die Anfrage wird gespeichert und ist
im Admin-Bereich unter „Anfragen“ sichtbar – sie wird nur nicht per Mail zugestellt. Im Reiter
„System“ steht jederzeit, was noch fehlt.

**Spamschutz** ist dreifach eingebaut und ohne weitere Einrichtung aktiv: ein unsichtbares
Honeypot-Feld, eine Mindest-Ausfüllzeit und ein Limit von 5 Anfragen pro Stunde und IP-Adresse.
Wer mehr möchte, legt unter Cloudflare **Turnstile** eine Site an (Widget-Typ „Managed“) und trägt
`TURNSTILE_SITE_KEY` und `TURNSTILE_SECRET_KEY` ein – dann erscheint das Widget automatisch im
Formular. Turnstile setzt keine Tracking-Cookies und ist damit ohne Einwilligung nutzbar.

---

## 4. Inhalte pflegen

Siehe **[docs/anleitung-admin.md](docs/anleitung-admin.md)** – eine Schritt-für-Schritt-Anleitung
ohne Technik für die tägliche Pflege.

Kurz: <https://DEINE-DOMAIN/admin> aufrufen, Passwort eingeben, ändern, **Speichern**.
Änderungen sind innerhalb einer Minute auf der Website sichtbar (Cloudflare gleicht den Speicher
weltweit ab).

Was im Admin-Bereich gepflegt wird:

* **Kontakt** – Handynummer, Festnetz, E-Mail, Anschrift, Navigationsadresse, Instagram/Facebook,
  USt-IdNr. Diese Angaben erscheinen automatisch überall, auch in Impressum und Datenschutz.
* **Preise** – Zeilen der Preisliste, beliebig hinzufügen, sortieren, löschen.
* **Kurse & Termine** – pro Kurs Name, Kurstage, Preis, Gebührentext, Ort, Beschreibung und
  Inhalte. Kurse lassen sich anlegen, ausblenden, sortieren und löschen.
* **Anfragen** – alle Formularanfragen der letzten 180 Tage.

---

## 5. Aufbau des Projekts

```
public/                 statische Dateien (von Cloudflare direkt ausgeliefert)
  admin/index.html      Oberfläche des Admin-Bereichs
  assets/css|js|fonts   Stylesheet, Skripte, selbst gehostete Schriften
  photos/               Bilder in WebP (mehrere Breiten) + JPEG-Fallback
  _headers              Cache- und Sicherheits-Header

src/
  worker.js             Einstiegspunkt: verteilt auf Seiten und /api/
  routes/site.js        rendert alle Seiten, robots.txt und sitemap.xml
  routes/kontakt.js     Kontaktformular (Prüfung, Speicherung, Resend)
  routes/admin.js       Login, Session, Inhalte, Anfragen
  data/defaults.js      Auslieferungsinhalte (greifen, solange nichts gespeichert wurde)
  lib/                  content (KV + Prüfung), auth, mail, html-Helfer
  render/               layout.js (Kopf/Fuß/Cookie) und pages.js (die einzelnen Seiten)

scripts/check.mjs       Tests (npm run check)
scripts/prepare-kv.mjs  verbindet den KV-Speicher beim Deploy automatisch
wrangler.toml           Worker-Konfiguration
```

**Routing:** Cloudflare prüft zuerst, ob eine statische Datei zum Pfad passt (`/assets/…`,
`/photos/…`, `/admin`, `/favicon.svg`). Nur wenn keine passt, läuft `src/worker.js` – also für
`/`, `/kurse/…`, `/api/…` und alles Weitere. Dadurch kosten Bilder und Stylesheets keine
Worker-Aufrufe.

**Datenfluss:** `src/routes/site.js` lädt bei jedem Aufruf den Inhalt aus KV (`site:content`),
legt ihn über die Defaults und rendert daraus HTML. Speichert jemand im Admin-Bereich, prüft und
kürzt `sanitize()` in `src/lib/content.js` jedes Feld, bevor es in den KV geschrieben wird – die
Website kann also nicht durch fehlerhafte Eingaben kaputtgehen.

**Sicherheit des Admin-Bereichs:** Passwort per zeitkonstantem Vergleich, Session als
HMAC-SHA256-signiertes Cookie (`HttpOnly`, `Secure`, `SameSite=Strict`, 8 Stunden gültig),
zusätzlich Origin- und Header-Prüfung gegen Cross-Site-Requests sowie ein Limit von
10 Anmeldeversuchen je 15 Minuten und IP-Adresse.

## 6. Bilder austauschen

Die Fotos liegen in `public/photos/` als WebP in mehreren Breiten plus ein JPEG als Rückfallebene.
Neue Bilder nach demselben Muster benennen (`name-BREITE.webp`) und in `src/render/layout.js` unter
`PHOTOS` eintragen – dort stehen auch die Alternativtexte für Screenreader.

> **Hinweis:** Das Startbild `hero-run` liegt im Original nur in 920 × 417 px vor. Auf großen
> Bildschirmen wird es dadurch leicht weich. Falls das Originalfoto in höherer Auflösung existiert,
> lohnt sich ein Austausch – Breiten bis 1920 px sind sinnvoll.

---

## 7. Rechtliches – vor dem Start prüfen

Impressum, Datenschutz und AGB sind vollständig ausformuliert, enthalten aber zwei Platzhalter,
die zwingend ersetzt werden müssen:

* **E-Mail-Adresse** `kontakt@deine-domain.de` → im Admin-Bereich unter „Kontakt“ eintragen.
* **USt-IdNr.** `DE000000000` → im Admin-Bereich unter „Kontakt“ eintragen. Bei
  Kleinunternehmerregelung nach § 19 UStG das Feld leeren und stattdessen die Steuernummer bzw.
  einen entsprechenden Hinweis ergänzen.

Die Texte sind sorgfältig, aber ohne juristische Prüfung erstellt. Eine kurze Durchsicht durch eine
Rechtsberatung ist vor dem Livegang empfehlenswert – insbesondere zu AGB und Haftung.

---

## 8. Schriften

`Bricolage Grotesque` und `Instrument Sans` stehen unter der
[SIL Open Font License 1.1](https://openfontlicense.org) und werden vom eigenen Server ausgeliefert
(`public/assets/fonts/`). Dadurch wird beim Seitenaufruf keine Verbindung zu Google hergestellt.
