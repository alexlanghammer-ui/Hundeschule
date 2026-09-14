# Hundeschule Alexandra Goller – Website

Website für die Hundeschule in Hülben, umgesetzt aus dem Entwurf `4steps4dogs Website v2`.
Läuft auf **Cloudflare Pages** – ohne Build-Schritt, ohne Framework, ohne externe Abhängigkeiten
zur Laufzeit.

* **Öffentliche Seiten** werden am Edge gerendert (Cloudflare Pages Functions). Preise, Kurstermine
  und Kontaktdaten stehen damit direkt im HTML – gut für Google und ohne Flackern beim Laden.
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

## 2. Deployment auf Cloudflare Pages

### 2.1 Projekt anlegen

1. Im Cloudflare-Dashboard: **Workers & Pages → Create → Pages → Connect to Git**
2. Dieses Repository und den Branch auswählen.
3. Build-Einstellungen:
   | Feld | Wert |
   | --- | --- |
   | Framework preset | `None` |
   | Build command | *(leer lassen)* |
   | Build output directory | `public` |

   Es gibt bewusst keinen Build-Schritt: `public/` wird direkt ausgeliefert, `functions/` wird von
   Cloudflare automatisch als Pages Functions erkannt.

### 2.2 Speicher (KV) anlegen und verbinden

Ohne KV läuft die Seite mit den Standardinhalten, aber **Speichern im Admin-Bereich ist dann nicht
möglich** und Anfragen werden nicht zwischengespeichert.

1. **Storage & Databases → KV → Create namespace**, Name z. B. `hundeschule-inhalte`.
2. Im Pages-Projekt: **Settings → Bindings → Add → KV namespace**
   * Variable name: `SITE_KV`
   * KV namespace: den eben angelegten auswählen
   * Für **Production** *und* **Preview** eintragen.
3. Optional die Namespace-ID in `wrangler.toml` eintragen (nur für `wrangler pages deploy` von Hand).

### 2.3 Variablen und Secrets setzen

**Settings → Variables and Secrets.** Alles, was ein Passwort oder Schlüssel ist, als Typ **Secret**
anlegen (dann ist es später nicht mehr lesbar).

| Name | Typ | Pflicht | Bedeutung |
| --- | --- | --- | --- |
| `ADMIN_PASSWORD` | Secret | ja | Passwort für `/admin`. Ohne das ist der Admin-Bereich gesperrt. |
| `SESSION_SECRET` | Secret | ja | Langer Zufallsstring zum Signieren der Anmeldung. Erzeugen z. B. mit `openssl rand -base64 32`. |
| `SITE_URL` | Text | ja | Öffentliche Adresse ohne Schrägstrich am Ende, z. B. `https://4steps4dogs.de`. Wird für canonical-Links, Sitemap und Social-Vorschau gebraucht. |
| `RESEND_API_KEY` | Secret | für Mailversand | API-Key aus Resend. |
| `CONTACT_FROM` | Text | für Mailversand | Absender, z. B. `Hundeschule <anfrage@4steps4dogs.de>`. Die Domain muss in Resend verifiziert sein. |
| `CONTACT_TO` | Text | optional | Empfängeradresse. Leer lassen = die im Admin-Bereich gepflegte E-Mail-Adresse. |
| `SEND_CONFIRMATION` | Text | optional | `false` schaltet die automatische Eingangsbestätigung an Anfragende ab. |
| `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Text / Secret | optional | Zusätzlicher Spamschutz, siehe unten. |

Nach dem Setzen von Variablen einmal **neu deployen**, damit sie greifen.

### 2.4 Eigene Domain

**Custom domains → Set up a domain** und die Domain (z. B. `4steps4dogs.de` plus `www`) verbinden.
Danach `SITE_URL` auf die neue Adresse setzen und erneut deployen.

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
   im Pages-Projekt hinterlegen.
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
public/                 statisch ausgeliefert (Pages „build output directory“)
  admin/index.html      Oberfläche des Admin-Bereichs
  assets/css|js|fonts   Stylesheet, Skripte, selbst gehostete Schriften
  photos/               Bilder in WebP (mehrere Breiten) + JPEG-Fallback
  _headers, _routes.json  Cache-/Sicherheits-Header, Routing-Ausnahmen

functions/              Cloudflare Pages Functions
  [[path]].js           rendert alle Seiten, robots.txt und sitemap.xml
  api/kontakt.js        Kontaktformular (Prüfung, Speicherung, Resend)
  api/admin/*.js        Login, Session, Inhalte, Anfragen

src/                    von den Functions importiert
  data/defaults.js      Auslieferungsinhalte (greifen, solange nichts gespeichert wurde)
  lib/                  content (KV + Prüfung), auth, mail, html-Helfer
  render/               layout.js (Kopf/Fuß/Cookie) und pages.js (die einzelnen Seiten)

scripts/check.mjs       Tests (npm run check)
```

**Datenfluss:** `functions/[[path]].js` lädt bei jedem Aufruf den Inhalt aus KV (`site:content`),
legt ihn über die Defaults und rendert daraus HTML. Speichert jemand im Admin-Bereich, prüft und
kürzt `sanitize()` in `src/lib/content.js` jedes Feld, bevor es in den KV geschrieben wird – die
Website kann also nicht durch fehlerhafte Eingaben kaputtgehen.

**Sicherheit des Admin-Bereichs:** Passwort per zeitkonstantem Vergleich, Session als
HMAC-SHA256-signiertes Cookie (`HttpOnly`, `Secure`, `SameSite=Strict`, 8 Stunden gültig),
zusätzlich Origin- und Header-Prüfung gegen Cross-Site-Requests sowie ein Limit von
10 Anmeldeversuchen je 15 Minuten und IP-Adresse.

---

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
