/**
 * Kleine HTML-Helfer. Interpolationen im `html`-Template werden automatisch
 * escaped – nur was durch raw() geht, wird unveraendert eingesetzt.
 */

const ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function esc(value) {
  if (value === null || value === undefined || value === false) return '';
  return String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

const RAW = Symbol('raw');

export function raw(value) {
  return { [RAW]: true, value: value === null || value === undefined ? '' : String(value) };
}

function render(value) {
  if (value === null || value === undefined || value === false || value === true) return '';
  if (Array.isArray(value)) return value.map(render).join('');
  if (typeof value === 'object' && value[RAW]) return value.value;
  return esc(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) {
    out += render(values[i]) + strings[i + 1];
  }
  return raw(out);
}

/** Fertiges Markup als String (fuer new Response(...)). */
export function toString(node) {
  return render(node);
}

/**
 * Sehr einfacher Zeilen-Formatter: wandelt Absaetze eines mehrzeiligen Textes
 * in <p>-Tags um und escaped dabei.
 */
export function paragraphs(text, className = '') {
  const cls = className ? ` class="${esc(className)}"` : '';
  return raw(
    String(text || '')
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p${cls}>${esc(p).replace(/\n/g, '<br>')}</p>`)
      .join('')
  );
}

/**
 * Maskiert den Text und macht enthaltene http(s)-Adressen anklickbar.
 * Fuer Rechtstexte, in denen Behoerden- und Anbieterlinks im Fliesstext stehen.
 */
export function linkify(text) {
  const sicher = esc(text);
  return raw(
    sicher.replace(
      /https?:\/\/[^\s<>"']+[^\s<>"'.,;:)]/g,
      (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    )
  );
}

/** Telefonnummer -> tel:-URL (Leerzeichen und Trennzeichen entfernen). */
export function telHref(number) {
  return 'tel:' + String(number || '').replace(/[^\d+]/g, '');
}
