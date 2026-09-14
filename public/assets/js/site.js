/* Menue, Cookie-Hinweis und Kontaktformular. Bewusst ohne Framework. */
(function () {
  'use strict';

  /* ---------------------------------------------------------- Mobiles Menü */
  var toggle = document.getElementById('navToggle');
  var sheet = document.getElementById('navSheet');
  var closeBtn = document.getElementById('navClose');

  function setMenu(open) {
    if (!sheet || !toggle) return;
    sheet.hidden = !open;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      var first = sheet.querySelector('a');
      if (first) first.focus();
    }
  }

  if (toggle) toggle.addEventListener('click', function () { setMenu(sheet.hidden); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); toggle.focus(); });
  if (sheet) {
    sheet.addEventListener('click', function (e) {
      if (e.target === sheet) setMenu(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sheet && !sheet.hidden) { setMenu(false); toggle.focus(); }
  });

  /* ------------------------------------------------------------ Cookie-Hinweis */
  var STORAGE_KEY = 'hs-cookie-consent';
  var banner = document.getElementById('cookieBanner');
  var reopen = document.getElementById('cookieReopen');

  function readConsent() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
    catch (e) { return null; }
  }

  function writeConsent(statistik) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ statistik: statistik, ts: new Date().toISOString(), v: 1 })
      );
    } catch (e) { /* Speicher gesperrt – Hinweis erscheint dann erneut */ }
    applyConsent(statistik);
  }

  /* Hier lassen sich spaeter optionale Dienste (z. B. Statistik) einhaengen.
     Solange nichts registriert ist, passiert bewusst nichts. */
  function applyConsent(statistik) {
    if (statistik && typeof window.hsLoadStatistik === 'function') {
      try { window.hsLoadStatistik(); } catch (e) { /* ignorieren */ }
    }
    document.dispatchEvent(
      new CustomEvent('hs:consent', { detail: { statistik: !!statistik } })
    );
  }

  if (banner) {
    var saved = readConsent();
    if (saved) {
      applyConsent(saved.statistik);
    } else {
      banner.hidden = false;
    }
    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cookie]');
      if (!btn) return;
      writeConsent(btn.getAttribute('data-cookie') === 'all');
      banner.hidden = true;
    });
  }

  if (reopen && banner) {
    reopen.addEventListener('click', function () {
      banner.hidden = false;
      banner.scrollIntoView({ block: 'end' });
    });
  }

  /* ------------------------------------------------------------ Kontaktformular */
  var form = document.getElementById('kontaktForm');
  if (form) {
    var ts = document.getElementById('formTs');
    if (ts) ts.value = String(Date.now());

    // Thema aus der URL vorbelegen (z. B. /kontakt?thema=Junghundekurs)
    var wunsch = new URLSearchParams(location.search).get('thema');
    if (wunsch) {
      var passend = form.querySelector('input[name="thema"][value="' + CSS.escape(wunsch) + '"]');
      if (passend) passend.checked = true;
    }

    var status = document.getElementById('formStatus');
    var submit = document.getElementById('formSubmit');

    function showStatus(kind, text) {
      if (!status) return;
      status.className = 'form-status form-status--' + kind;
      status.textContent = text;
      status.hidden = false;
      status.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }

    form.addEventListener('submit', function (e) {
      if (!form.reportValidity()) return;
      e.preventDefault();
      submit.disabled = true;
      var label = submit.textContent;
      submit.textContent = 'Wird gesendet…';

      var payload = {};
      new FormData(form).forEach(function (value, key) { payload[key] = value; });

      fetch('/api/kontakt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'hundeschule-form' },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json().then(function (data) { return { ok: res.ok, data: data }; });
        })
        .then(function (result) {
          if (result.ok && result.data.ok) {
            form.reset();
            if (ts) ts.value = String(Date.now());
            showStatus(
              'ok',
              'Vielen Dank! Deine Anfrage ist angekommen – ich melde mich so schnell wie möglich bei dir.'
            );
            var absenden = form.querySelector('.btn--block');
            if (absenden) absenden.textContent = 'Anfrage abschicken';
          } else {
            showStatus(
              'error',
              (result.data && result.data.error) ||
                'Das hat leider nicht geklappt. Bitte versuche es erneut oder ruf mich einfach an.'
            );
          }
        })
        .catch(function () {
          showStatus(
            'error',
            'Verbindung fehlgeschlagen. Bitte versuche es erneut oder ruf mich einfach an.'
          );
        })
        .then(function () {
          submit.disabled = false;
          submit.textContent = label;
          if (window.turnstile && typeof window.turnstile.reset === 'function') {
            window.turnstile.reset();
          }
        });
    });
  }
})();
