/* Admin-Oberflaeche: Inhalte laden, bearbeiten, speichern. Ohne Framework. */
(function () {
  'use strict';

  var state = { content: null, dirty: false, setup: null, passwortQuelle: null };

  var el = function (id) { return document.getElementById(id); };

  /* ------------------------------------------------------------ API-Zugriff */
  function api(pfad, optionen) {
    var opts = optionen || {};
    opts.headers = Object.assign(
      { 'X-Requested-With': 'hundeschule-admin' },
      opts.body ? { 'Content-Type': 'application/json' } : {},
      opts.headers || {}
    );
    opts.credentials = 'same-origin';
    return fetch(pfad, opts).then(function (res) {
      return res
        .json()
        .catch(function () { return {}; })
        .then(function (data) {
          if (!res.ok) {
            var fehler = new Error(data.error || 'Fehler ' + res.status);
            fehler.status = res.status;
            throw fehler;
          }
          return data;
        });
    });
  }

  function zeigeFehler(text) {
    var box = el('globalError');
    box.textContent = text;
    box.hidden = !text;
    if (text) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* --------------------------------------------------------------- Anmeldung */
  /**
   * Sichtbarkeit nicht allein dem hidden-Attribut ueberlassen: Liefert ein
   * Browser eine aeltere, zwischengespeicherte CSS-Datei aus, kann ein
   * display-Wert das Attribut ueberstimmen – dann staenden beide Formulare
   * gleichzeitig da. Der inline gesetzte Stil gilt in jedem Fall.
   */
  function setzeSichtbar(id, sichtbar) {
    var node = el(id);
    if (!node) return;
    node.hidden = !sichtbar;
    node.style.display = sichtbar ? '' : 'none';
  }

  function zeigeLogin(fehler) {
    setzeSichtbar('appView', false);
    setzeSichtbar('loginView', true);
    setzeSichtbar('setupForm', false);
    setzeSichtbar('loginForm', true);
    var box = el('loginError');
    box.textContent = fehler || '';
    setzeSichtbar('loginError', Boolean(fehler));
    el('password').focus();
  }

  /** Erstes Mal: Passwort selbst vergeben. */
  function zeigeEinrichtung(fehler) {
    setzeSichtbar('appView', false);
    setzeSichtbar('loginView', true);
    setzeSichtbar('loginForm', false);
    setzeSichtbar('setupForm', true);
    var box = el('setupError');
    box.textContent = fehler || '';
    setzeSichtbar('setupError', Boolean(fehler));
    el('setupPassword').focus();
  }

  el('setupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = el('setupSubmit');
    var pw = el('setupPassword').value;
    var wdh = el('setupRepeat').value;
    if (pw !== wdh) { zeigeEinrichtung('Die beiden Passwörter stimmen nicht überein.'); return; }
    btn.disabled = true;
    api('/api/admin/einrichten', {
      method: 'POST',
      body: JSON.stringify({ passwort: pw, wiederholung: wdh }),
    })
      .then(function () {
        el('setupPassword').value = '';
        el('setupRepeat').value = '';
        setzeSichtbar('setupError', false);
        start();
      })
      .catch(function (err) { zeigeEinrichtung(err.message); })
      .then(function () { btn.disabled = false; });
  });

  el('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = el('loginSubmit');
    btn.disabled = true;
    api('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password: el('password').value }),
    })
      .then(function () {
        el('password').value = '';
        setzeSichtbar('loginError', false);
        start();
      })
      .catch(function (err) { zeigeLogin(err.message); })
      .then(function () { btn.disabled = false; });
  });

  el('logoutBtn').addEventListener('click', function () {
    if (state.dirty && !confirm('Es gibt ungespeicherte Änderungen. Wirklich abmelden?')) return;
    api('/api/admin/logout', { method: 'POST' }).then(function () {
      state.dirty = false;
      location.reload();
    });
  });

  /* ------------------------------------------------------------------ Tabs */
  el('tabs').addEventListener('click', function (e) {
    var btn = e.target.closest('.admin-tab');
    if (!btn) return;
    var ziel = btn.getAttribute('data-tab');
    document.querySelectorAll('.admin-tab').forEach(function (t) {
      t.setAttribute('aria-current', t === btn ? 'true' : 'false');
    });
    document.querySelectorAll('.panel-section').forEach(function (s) {
      s.hidden = s.getAttribute('data-panel') !== ziel;
    });
    if (ziel === 'anfragen') ladeAnfragen();
    if (ziel === 'system') ladeMail();
    if (ziel === 'bilder') ladeBilder();
  });

  /* ------------------------------------------------------------ Änderungen */
  function markiereGeaendert() {
    state.dirty = true;
    if (!state.setup || state.setup.kv) el('saveBtn').disabled = false;
    var s = el('saveState');
    s.textContent = 'Nicht gespeichert';
    s.className = 'save-state is-dirty';
  }

  function markiereGespeichert() {
    state.dirty = false;
    el('saveBtn').disabled = true;
    var s = el('saveState');
    s.textContent = 'Gespeichert';
    s.className = 'save-state is-ok';
    setTimeout(function () {
      if (!state.dirty) { s.textContent = ''; s.className = 'save-state'; }
    }, 4000);
  }

  window.addEventListener('beforeunload', function (e) {
    if (!state.dirty) return;
    e.preventDefault();
    e.returnValue = '';
  });

  /* ---------------------------------------------------------------- Kontakt */
  var KONTAKT_FELDER = [
    ['name', 'Name (Kopfzeile)', 'Alexandra Goller'],
    ['betrieb', 'Firmierung (Impressum)', 'Alexandra Goller – Hundetraining'],
    ['mobil', 'Handynummer', '+49 176 43198863'],
    ['festnetz', 'Festnetz', '+49 7125 3096919'],
    ['email', 'E-Mail-Adresse', 'kontakt@deine-domain.de'],
    ['strasse', 'Straße und Hausnummer', 'Robert-Kempel-Straße 8'],
    ['plzOrt', 'PLZ und Ort', '72584 Hülben'],
    ['navAdresse', 'Adresse für die Navigation', 'Kaltentalstraße 30, 72584 Hülben'],
    ['instagram', 'Instagram (vollständige URL)', 'https://www.instagram.com/…'],
    ['facebook', 'Facebook (vollständige URL, optional)', ''],
    ['ustId', 'USt-IdNr. (Impressum)', 'DE000000000'],
  ];

  function baueKontakt() {
    var ziel = el('kontaktFelder');
    ziel.innerHTML = '';
    KONTAKT_FELDER.forEach(function (feld) {
      var key = feld[0];
      var wrap = document.createElement('div');
      wrap.className = 'field';
      var id = 'kontakt-' + key;
      wrap.innerHTML =
        '<label for="' + id + '"></label><input id="' + id + '" type="text">';
      wrap.querySelector('label').textContent = feld[1];
      var input = wrap.querySelector('input');
      input.value = state.content.kontakt[key] || '';
      input.placeholder = feld[2];
      input.addEventListener('input', function () {
        state.content.kontakt[key] = input.value;
        markiereGeaendert();
      });
      ziel.appendChild(wrap);
    });
  }

  /* ----------------------------------------------------------------- Preise */
  function bauePreise() {
    var ziel = el('preisRows');
    ziel.innerHTML = '';
    state.content.preise.items.forEach(function (item, index) {
      var knoten = el('preisRowTpl').content.cloneNode(true);
      var zeile = knoten.querySelector('.row');
      zeile.querySelectorAll('input').forEach(function (input) {
        var feld = input.getAttribute('data-field');
        input.value = item[feld] || '';
        input.addEventListener('input', function () {
          item[feld] = input.value;
          markiereGeaendert();
        });
      });
      zeile.querySelector('[data-act="up"]').addEventListener('click', function () {
        verschiebe(state.content.preise.items, index, -1); bauePreise(); markiereGeaendert();
      });
      zeile.querySelector('[data-act="down"]').addEventListener('click', function () {
        verschiebe(state.content.preise.items, index, 1); bauePreise(); markiereGeaendert();
      });
      zeile.querySelector('[data-act="del"]').addEventListener('click', function () {
        if (!confirm('Diese Preiszeile entfernen?')) return;
        state.content.preise.items.splice(index, 1); bauePreise(); markiereGeaendert();
      });
      ziel.appendChild(knoten);
    });

    var hinweise = el('preisHinweise');
    hinweise.value = (state.content.preise.hinweise || []).join('\n');
    hinweise.oninput = function () {
      state.content.preise.hinweise = hinweise.value.split('\n').map(trim).filter(Boolean);
      markiereGeaendert();
    };
  }

  el('preisAdd').addEventListener('click', function () {
    state.content.preise.items.push({ l: '', r: '' });
    bauePreise();
    markiereGeaendert();
    var inputs = el('preisRows').querySelectorAll('input[data-field="l"]');
    if (inputs.length) inputs[inputs.length - 1].focus();
  });

  /* ------------------------------------------------------------------ Kurse */
  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
  }

  function trim(s) { return String(s).trim(); }

  function verschiebe(liste, index, richtung) {
    var ziel = index + richtung;
    if (ziel < 0 || ziel >= liste.length) return;
    var element = liste.splice(index, 1)[0];
    liste.splice(ziel, 0, element);
  }

  function kursMetaText(kurs) {
    return [kurs.umfang, kurs.start, kurs.preis].map(trim).filter(Boolean).join(' · ');
  }

  function baueKurse() {
    var ziel = el('kursListe');
    ziel.innerHTML = '';
    state.content.kurse.forEach(function (kurs, index) {
      var knoten = el('kursTpl').content.cloneNode(true);
      var box = knoten.querySelector('.kurs');
      var titel = box.querySelector('.kurs__title');
      var meta = box.querySelector('.kurs__meta');
      var flag = box.querySelector('.kurs__flag');

      function kopfAktualisieren() {
        titel.textContent = kurs.title || 'Neuer Kurs';
        meta.textContent = kursMetaText(kurs);
        flag.hidden = kurs.sichtbar !== false;
      }

      box.querySelectorAll('[data-field]').forEach(function (input) {
        var feld = input.getAttribute('data-field');
        if (feld === 'sichtbar') {
          input.checked = kurs.sichtbar !== false;
          input.addEventListener('change', function () {
            kurs.sichtbar = input.checked;
            kopfAktualisieren();
            markiereGeaendert();
          });
          return;
        }
        if (feld === 'body') {
          input.value = (kurs.body || []).join('\n\n');
        } else if (feld === 'inhalte') {
          input.value = (kurs.inhalte || []).join('\n');
        } else {
          input.value = kurs[feld] || '';
        }
        input.addEventListener('input', function () {
          if (feld === 'body') {
            kurs.body = input.value.split(/\n{2,}/).map(trim).filter(Boolean);
          } else if (feld === 'inhalte') {
            kurs.inhalte = input.value.split('\n').map(trim).filter(Boolean);
          } else {
            kurs[feld] = input.value;
          }
          if (feld === 'slug') {
            var vorschau = box.querySelector('[data-preview="slug"]');
            if (vorschau) vorschau.textContent = slugify(input.value);
          }
          if (feld === 'title' && !kurs.slug) {
            var slugInput = box.querySelector('[data-field="slug"]');
            slugInput.value = slugify(input.value);
            kurs.slug = slugInput.value;
            box.querySelector('[data-preview="slug"]').textContent = slugInput.value;
          }
          kopfAktualisieren();
          markiereGeaendert();
        });
      });

      var vorschau = box.querySelector('[data-preview="slug"]');
      if (vorschau) vorschau.textContent = slugify(kurs.slug || kurs.title);

      box.querySelector('[data-act="up"]').addEventListener('click', function () {
        verschiebe(state.content.kurse, index, -1); baueKurse(); markiereGeaendert();
      });
      box.querySelector('[data-act="down"]').addEventListener('click', function () {
        verschiebe(state.content.kurse, index, 1); baueKurse(); markiereGeaendert();
      });
      box.querySelector('[data-act="del"]').addEventListener('click', function () {
        if (!confirm('Kurs „' + (kurs.title || 'ohne Namen') + '“ wirklich löschen?')) return;
        state.content.kurse.splice(index, 1); baueKurse(); markiereGeaendert();
      });

      kopfAktualisieren();
      ziel.appendChild(knoten);
    });
  }

  el('kursAdd').addEventListener('click', function () {
    state.content.kurse.push({
      slug: '', sichtbar: false, badge: '', title: 'Neuer Kurs', claim: '', teaser: '',
      umfang: '', start: '', preis: '', termine: '', ort: '', gebuehr: '',
      trainerin: '', voraussetzung: '', body: [], inhalte: [],
    });
    baueKurse();
    markiereGeaendert();
    var alle = el('kursListe').querySelectorAll('.kurs');
    var neu = alle[alle.length - 1];
    neu.open = true;
    neu.scrollIntoView({ behavior: 'smooth', block: 'center' });
    neu.querySelector('[data-field="title"]').focus();
  });

  /* --------------------------------------------------------------- Speichern */
  el('saveBtn').addEventListener('click', function () {
    var btn = el('saveBtn');
    btn.disabled = true;
    zeigeFehler('');
    api('/api/admin/content', { method: 'PUT', body: JSON.stringify(state.content) })
      .then(function (data) {
        state.content = data.content;
        baueKontakt(); bauePreise(); baueKurse();
        markiereGespeichert();
      })
      .catch(function (err) {
        zeigeFehler('Speichern fehlgeschlagen: ' + err.message);
        btn.disabled = false;
      });
  });

  el('resetBtn').addEventListener('click', function () {
    if (!confirm('Wirklich alle Inhalte auf den Auslieferungszustand zurücksetzen?')) return;
    api('/api/admin/content', { method: 'DELETE' })
      .then(function (data) {
        state.content = data.content;
        baueKontakt(); bauePreise(); baueKurse();
        markiereGespeichert();
      })
      .catch(function (err) { zeigeFehler('Zurücksetzen fehlgeschlagen: ' + err.message); });
  });

  /* ---------------------------------------------------------------- Anfragen */
  function formatiereZeit(iso) {
    try {
      return new Date(iso).toLocaleString('de-DE', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    } catch (e) { return iso; }
  }

  function ladeAnfragen() {
    var ziel = el('anfragenListe');
    ziel.innerHTML = '<p class="hint">Wird geladen…</p>';
    api('/api/admin/anfragen')
      .then(function (data) {
        if (!data.anfragen.length) {
          ziel.innerHTML = '<p class="hint">Noch keine Anfragen eingegangen.</p>';
          return;
        }
        ziel.innerHTML = '';
        data.anfragen.forEach(function (anfrage) {
          var box = document.createElement('article');
          box.className = 'anfrage';

          var kopf = document.createElement('div');
          kopf.className = 'anfrage__head';
          var name = document.createElement('span');
          name.className = 'anfrage__name';
          name.textContent = anfrage.name;
          var zeit = document.createElement('span');
          zeit.className = 'anfrage__time';
          zeit.textContent = formatiereZeit(anfrage.ts);
          kopf.appendChild(name);
          kopf.appendChild(zeit);
          if (anfrage.thema) {
            var thema = document.createElement('span');
            thema.className = 'anfrage__tag';
            thema.textContent = anfrage.thema;
            kopf.appendChild(thema);
          }
          var mail = document.createElement('span');
          mail.className =
            'anfrage__tag ' +
            (anfrage.mail === 'gesendet'
              ? ''
              : anfrage.mail === 'fehlgeschlagen'
                ? 'anfrage__tag--error'
                : 'anfrage__tag--warn');
          mail.textContent = 'Mail: ' + (anfrage.mail || 'unbekannt');
          kopf.appendChild(mail);
          box.appendChild(kopf);

          var kontakt = document.createElement('p');
          kontakt.className = 'anfrage__contact';
          var istMail = /@/.test(anfrage.kontakt);
          var link = document.createElement('a');
          link.href = (istMail ? 'mailto:' : 'tel:') + anfrage.kontakt.replace(/\s/g, '');
          link.textContent = anfrage.kontakt;
          kontakt.appendChild(link);
          box.appendChild(kontakt);

          var text = document.createElement('p');
          text.className = 'anfrage__msg';
          text.textContent = anfrage.nachricht;
          box.appendChild(text);

          var tools = document.createElement('div');
          tools.className = 'anfrage__tools';
          var antworten = document.createElement('a');
          antworten.className = 'btn btn--outline btn--sm';
          antworten.href =
            (istMail ? 'mailto:' : 'tel:') + anfrage.kontakt.replace(/\s/g, '') +
            (istMail ? '?subject=' + encodeURIComponent('Deine Anfrage') : '');
          antworten.textContent = istMail ? 'Antworten' : 'Anrufen';
          tools.appendChild(antworten);

          var loeschen = document.createElement('button');
          loeschen.type = 'button';
          loeschen.className = 'btn btn--outline btn--sm';
          loeschen.textContent = 'Löschen';
          loeschen.addEventListener('click', function () {
            if (!confirm('Diese Anfrage löschen?')) return;
            api('/api/admin/anfragen?id=' + encodeURIComponent(anfrage.id), { method: 'DELETE' })
              .then(ladeAnfragen)
              .catch(function (err) { zeigeFehler('Löschen fehlgeschlagen: ' + err.message); });
          });
          tools.appendChild(loeschen);
          box.appendChild(tools);

          ziel.appendChild(box);
        });
      })
      .catch(function (err) {
        ziel.innerHTML = '';
        zeigeFehler('Anfragen konnten nicht geladen werden: ' + err.message);
      });
  }

  el('anfragenReload').addEventListener('click', ladeAnfragen);

  /* ------------------------------------------------------------------ Fotos */
  var MAX_BREITE = 1600;
  var MAX_HOEHE = 1600;

  /**
   * Verkleinert ein Foto im Browser auf eine web-taugliche Größe.
   * Ein Handyfoto hat schnell 4 MB – ungekürzt hochgeladen würde es die Seite
   * für Besucher spürbar langsamer machen. JPEG, weil das jeder Browser anzeigt.
   */
  function verkleinern(datei) {
    return new Promise(function (fertig, fehlgeschlagen) {
      var leser = new FileReader();
      leser.onerror = function () { fehlgeschlagen(new Error('Die Datei ließ sich nicht lesen.')); };
      leser.onload = function () {
        var img = new Image();
        img.onerror = function () { fehlgeschlagen(new Error('Das ist kein lesbares Bild.')); };
        img.onload = function () {
          var faktor = Math.min(1, MAX_BREITE / img.width, MAX_HOEHE / img.height);
          var breite = Math.round(img.width * faktor);
          var hoehe = Math.round(img.height * faktor);
          var leinwand = document.createElement('canvas');
          leinwand.width = breite;
          leinwand.height = hoehe;
          var ctx = leinwand.getContext('2d');
          ctx.drawImage(img, 0, 0, breite, hoehe);
          try {
            fertig({
              datenUrl: leinwand.toDataURL('image/jpeg', 0.85),
              breite: breite,
              hoehe: hoehe,
            });
          } catch (e) {
            fehlgeschlagen(new Error('Das Bild ließ sich nicht umwandeln.'));
          }
        };
        img.src = leser.result;
      };
      leser.readAsDataURL(datei);
    });
  }

  function bildMeldung(art, text) {
    setzeSichtbar('bildOk', art === 'ok');
    setzeSichtbar('bildError', art === 'fehler');
    if (art === 'ok') el('bildOk').textContent = text;
    if (art === 'fehler') el('bildError').textContent = text;
  }

  function ladeBilder() {
    var ziel = el('bilderListe');
    ziel.innerHTML = '<p class="hint">Wird geladen…</p>';
    api('/api/admin/bilder')
      .then(function (data) {
        ziel.innerHTML = '';
        data.slots.forEach(function (slot) {
          var knoten = el('bildTpl').content.cloneNode(true);
          var box = knoten.querySelector('.bild');
          var vorschau = box.querySelector('.bild__vorschau img');
          var status = box.querySelector('[data-role="status"]');
          var altFeld = box.querySelector('[data-field="alt"]');

          box.querySelector('.bild__label').textContent = slot.label;
          box.querySelector('.bild__hinweis').textContent = slot.hinweis;

          function zeigeStand(eigenes) {
            if (eigenes && eigenes.hash) {
              vorschau.src = '/bilder/' + slot.id + '?v=' + eigenes.hash;
              vorschau.hidden = false;
              altFeld.value = eigenes.alt || '';
              status.textContent = 'Eigenes Foto aktiv.';
              box.querySelector('[data-act="del"]').disabled = false;
            } else {
              vorschau.hidden = true;
              vorschau.removeAttribute('src');
              status.textContent = 'Es wird das mitgelieferte Bild angezeigt.';
              box.querySelector('[data-act="del"]').disabled = true;
            }
          }
          zeigeStand(slot.eigenes);

          box.querySelector('input[type="file"]').addEventListener('change', function (e) {
            var datei = e.target.files && e.target.files[0];
            if (!datei) return;
            bildMeldung('', '');
            status.textContent = 'Wird verkleinert…';
            verkleinern(datei)
              .then(function (ergebnis) {
                status.textContent = 'Wird hochgeladen…';
                return api('/api/admin/bilder', {
                  method: 'POST',
                  body: JSON.stringify({
                    slot: slot.id,
                    datei: ergebnis.datenUrl,
                    alt: altFeld.value,
                  }),
                }).then(function (antwort) {
                  zeigeStand(antwort.eigenes);
                  bildMeldung(
                    'ok',
                    'Foto gespeichert (' + ergebnis.breite + ' × ' + ergebnis.hoehe +
                      ' Pixel). Auf der Website in etwa einer Minute sichtbar.'
                  );
                });
              })
              .catch(function (err) {
                status.textContent = '';
                bildMeldung('fehler', err.message);
              })
              .then(function () { e.target.value = ''; });
          });

          box.querySelector('[data-act="alt"]').addEventListener('click', function () {
            if (vorschau.hidden) {
              bildMeldung('fehler', 'Lade zuerst ein eigenes Foto hoch.');
              return;
            }
            // Bild unverändert lassen, nur die Beschreibung neu schreiben:
            // dafür laden wir das aktuelle Bild und schicken es zurück.
            fetch(vorschau.src)
              .then(function (r) { return r.blob(); })
              .then(function (blob) {
                return new Promise(function (fertig) {
                  var leser = new FileReader();
                  leser.onload = function () { fertig(leser.result); };
                  leser.readAsDataURL(blob);
                });
              })
              .then(function (datenUrl) {
                return api('/api/admin/bilder', {
                  method: 'POST',
                  body: JSON.stringify({ slot: slot.id, datei: datenUrl, alt: altFeld.value }),
                });
              })
              .then(function (antwort) {
                zeigeStand(antwort.eigenes);
                bildMeldung('ok', 'Beschreibung gespeichert.');
              })
              .catch(function (err) { bildMeldung('fehler', err.message); });
          });

          box.querySelector('[data-act="del"]').addEventListener('click', function () {
            if (!confirm('Eigenes Foto entfernen? Danach erscheint wieder das mitgelieferte Bild.'))
              return;
            api('/api/admin/bilder?slot=' + encodeURIComponent(slot.id), { method: 'DELETE' })
              .then(function () {
                zeigeStand(null);
                bildMeldung('ok', 'Eigenes Foto entfernt.');
              })
              .catch(function (err) { bildMeldung('fehler', err.message); });
          });

          ziel.appendChild(knoten);
        });
      })
      .catch(function (err) {
        ziel.innerHTML = '';
        bildMeldung('fehler', 'Fotos konnten nicht geladen werden: ' + err.message);
      });
  }

  /* -------------------------------------------------------------- Mailversand */
  function mailMeldung(art, text) {
    setzeSichtbar('mailOk', art === 'ok');
    setzeSichtbar('mailError', art === 'fehler');
    if (art === 'ok') el('mailOk').textContent = text;
    if (art === 'fehler') el('mailError').textContent = text;
  }

  /** Feld sperren und erklären, wenn der Wert aus der Cloudflare-Umgebung kommt. */
  function sperreWennAusUmgebung(id, ausUmgebung, bezeichnung) {
    var feld = el(id);
    feld.disabled = Boolean(ausUmgebung);
    var hinweisId = id + 'Hint';
    var hinweis = el(hinweisId);
    if (ausUmgebung && hinweis) {
      hinweis.textContent =
        bezeichnung + ' ist in der Cloudflare-Umgebung gesetzt und hat Vorrang – ' +
        'hier lässt er sich deshalb nicht ändern.';
    } else if (ausUmgebung && !hinweis) {
      var neuerHinweis = document.createElement('p');
      neuerHinweis.className = 'hint';
      neuerHinweis.id = hinweisId;
      neuerHinweis.textContent =
        bezeichnung + ' ist in der Cloudflare-Umgebung gesetzt und hat Vorrang.';
      feld.parentNode.appendChild(neuerHinweis);
    }
  }

  function ladeMail() {
    api('/api/admin/mail')
      .then(function (data) {
        el('mailFrom').value = data.from || '';
        el('mailTo').value = data.to || '';
        el('mailBestaetigung').checked = data.bestaetigung !== false;
        el('mailKey').placeholder = data.apiKeyGesetzt ? '•••••••• (hinterlegt)' : 're_...';
        el('mailKeyHint').textContent = data.apiKeyGesetzt
          ? 'Ein Schlüssel ist hinterlegt. Feld leer lassen = unverändert; neuen eintragen = ersetzen.'
          : 'Aus resend.com unter „API Keys“. Wird gespeichert und nie wieder angezeigt.';
        // Werte aus der Cloudflare-Umgebung haben Vorrang. Dann das Feld sperren,
        // statt eine Eingabe anzunehmen, die anschließend wirkungslos wäre.
        var umgebung = data.ausUmgebung || {};
        sperreWennAusUmgebung('mailKey', umgebung.apiKey, 'Der Schlüssel');
        sperreWennAusUmgebung('mailFrom', umgebung.from, 'Der Absender');
        sperreWennAusUmgebung('mailTo', umgebung.to, 'Der Empfänger');
      })
      .catch(function (err) { mailMeldung('fehler', err.message); });
  }

  el('mailForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = el('mailSubmit');
    btn.disabled = true;
    mailMeldung('', '');
    api('/api/admin/mail', {
      method: 'POST',
      body: JSON.stringify({
        apiKey: el('mailKey').value,
        from: el('mailFrom').value,
        to: el('mailTo').value,
        bestaetigung: el('mailBestaetigung').checked,
      }),
    })
      .then(function () {
        el('mailKey').value = '';
        mailMeldung('ok', 'Gespeichert. Schick dir am besten gleich eine Testmail.');
        ladeMail();
      })
      .catch(function (err) { mailMeldung('fehler', err.message); })
      .then(function () { btn.disabled = false; });
  });

  el('mailTest').addEventListener('click', function () {
    var btn = el('mailTest');
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Wird geschickt…';
    mailMeldung('', '');
    api('/api/admin/mailtest', { method: 'POST' })
      .then(function (data) {
        mailMeldung(
          'ok',
          'Testmail an ' + data.empfaenger + ' geschickt. Schau ins Postfach – und in den Spam-Ordner.'
        );
      })
      .catch(function (err) { mailMeldung('fehler', 'Versand fehlgeschlagen: ' + err.message); })
      .then(function () { btn.disabled = false; btn.textContent = label; });
  });

  /* ------------------------------------------------------------ Passwort */
  el('passwortForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = el('pwSubmit');
    el('pwOk').hidden = true;
    el('pwError').hidden = true;
    if (el('pwNeu').value !== el('pwWdh').value) {
      el('pwError').textContent = 'Die beiden neuen Passwörter stimmen nicht überein.';
      el('pwError').hidden = false;
      return;
    }
    btn.disabled = true;
    api('/api/admin/passwort', {
      method: 'POST',
      body: JSON.stringify({
        aktuell: el('pwAktuell').value,
        neu: el('pwNeu').value,
        wiederholung: el('pwWdh').value,
      }),
    })
      .then(function () {
        el('passwortForm').reset();
        el('pwOk').textContent = 'Passwort geändert. Beim nächsten Anmelden gilt das neue.';
        el('pwOk').hidden = false;
      })
      .catch(function (err) {
        el('pwError').textContent = err.message;
        el('pwError').hidden = false;
      })
      .then(function () { btn.disabled = false; });
  });

  /* ----------------------------------------------------------------- System */
  var STATUS_TEXTE = {
    passwort: ['Admin-Passwort', 'Ohne Passwort ist keine Anmeldung möglich.'],
    kv: [
      'Speicher (KV)',
      'Speichert Inhalte, Passwort und eingegangene Anfragen. Fehlt er, läuft die Website mit ' +
        'den Standardinhalten weiter, Änderungen hier lassen sich aber nicht sichern.',
    ],
    mail: [
      'Mailversand',
      'Trägt Anfragen aus dem Kontaktformular in dein Postfach. Einzurichten weiter unten ' +
        'auf dieser Seite. Fehlt er, gehen keine Anfragen verloren – sie stehen dann nur im ' +
        'Reiter „Anfragen“.',
    ],
    turnstile: ['Spamschutz Turnstile', 'TURNSTILE_SITE_KEY und TURNSTILE_SECRET_KEY (optional).'],
  };

  function baueStatus(setup) {
    // Aus dem Secret stammende Passwörter lassen sich hier nicht ändern.
    el('passwortForm').hidden = state.passwortQuelle === 'secret';

    var ziel = el('statusListe');
    ziel.innerHTML = '';
    Object.keys(STATUS_TEXTE).forEach(function (key) {
      var ok = Boolean(setup[key]);
      var item = document.createElement('div');
      item.className = 'status-item';
      item.innerHTML =
        '<span class="status-item__dot ' + (ok ? 'ok' : 'miss') + '"></span><div><strong></strong><span></span></div>';
      item.querySelector('strong').textContent =
        STATUS_TEXTE[key][0] + (ok ? ' · eingerichtet' : ' · fehlt');
      item.querySelector('span:last-child').textContent = STATUS_TEXTE[key][1];
      ziel.appendChild(item);
    });

    var warnung = el('setupWarning');
    if (!setup.kv) {
      // Ohne Speicher geht gar nichts – das ist die wichtigere Meldung.
      warnung.textContent =
        'Der Speicher ist noch nicht verbunden. Die Website läuft, aber Änderungen hier ' +
        'lassen sich noch nicht speichern. Was zu tun ist, steht im Reiter „System“.';
      warnung.hidden = false;
    } else if (!setup.mail) {
      warnung.textContent =
        'Der Mailversand ist noch nicht eingerichtet. Anfragen aus dem Formular werden ' +
        'gespeichert und erscheinen im Reiter „Anfragen“, kommen aber noch nicht per E-Mail an.';
      warnung.hidden = false;
    } else {
      warnung.hidden = true;
    }
  }

  /* -------------------------------------------------------------------- Start */
  function start() {
    api('/api/admin/session')
      .then(function (sitzung) {
        state.setup = sitzung.eingerichtet;
        state.passwortQuelle = sitzung.passwortQuelle;

        if (sitzung.einrichtungNoetig) { zeigeEinrichtung(''); return; }

        if (!sitzung.eingerichtet.passwort) {
          zeigeLogin(
            'Es ist noch kein Passwort vergeben und der Speicher ist nicht verbunden. ' +
              'Ohne Speicher lässt sich keines festlegen.'
          );
          return;
        }
        if (!sitzung.angemeldet) { zeigeLogin(''); return; }

        return api('/api/admin/content').then(function (data) {
          state.content = data.content;
          setzeSichtbar('loginView', false);
          setzeSichtbar('appView', true);
          baueKontakt();
          bauePreise();
          baueKurse();
          baueStatus(state.setup);
          markiereGespeichert();
          el('saveState').textContent = '';
          el('saveState').className = 'save-state';
        });
      })
      .catch(function (err) {
        if (err.status === 401) { zeigeLogin(''); return; }
        zeigeLogin(err.message);
      });
  }

  start();
})();
