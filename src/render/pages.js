/**
 * Die einzelnen Seiten. Jede Funktion liefert den <main>-Inhalt sowie
 * Titel und Beschreibung fuer den <head>.
 */

import { html, raw, telHref } from '../lib/html.js';
import { picture, PHOTOS, LEGAL_NAV } from './layout.js';
import { fillPlaceholders, kursMeta, sichtbareKurse } from '../lib/content.js';

const SCHRITTE = [
  ['01', 'Lernen', 'Gemeinsam positiv lernen – abgestimmt auf euren Trainingsstand.'],
  ['02', 'Wissen', 'Training auf aktuellem Wissensstand und Antworten auf deine Fragen.'],
  ['03', 'Verstehen', 'Die individuellen Bedürfnisse deines Hundes erkennen und einordnen.'],
  ['04', 'Vertrauen', 'So wächst gegenseitiges Vertrauen – ihr werdet ein unschlagbares Team.'],
];

const ERWARTUNGEN = [
  'Abgestimmtes Training auf dich und deinen Hund',
  'Gewaltfreies Training',
  'Training auf aktuellem Wissensstand',
  'Antworten auf deine Fragen rund um das Thema Hund',
  'Respektvoller Umgang mit Mensch & Hund',
  'Kleine Kursgrößen für bestmöglichen Lernerfolg',
  'Alltagsnahes Training',
  'Freude am gemeinsamen Trainieren',
];

const EINZEL_SCHRITTE = [
  ['Erstgespräch', 'Wir klären telefonisch, worum es geht und was ihr erreichen möchtet.'],
  ['Trainingsplan', 'Abgestimmt auf euren Trainingsstand und euren Alltag.'],
  [
    'Gemeinsames Training',
    'Wir arbeiten Schritt für Schritt an den Zielen – mit Empathie und Kompetenz.',
  ],
];

function breadcrumb(items) {
  return html`<nav class="wrap breadcrumb" aria-label="Brotkrumen-Navigation">
    ${items.map((item) =>
      item.href
        ? html`<a href="${item.href}">${item.label}</a><span aria-hidden="true">/</span>`
        : html`<span>${item.label}</span>`
    )}
  </nav>`;
}

function checkList(items, twoCols = false) {
  return html`<ul class="check-list ${twoCols ? 'check-list--2' : ''}">
    ${items.map(
      (item) => html`<li><span class="tick" aria-hidden="true">✓</span><span>${item}</span></li>`
    )}
  </ul>`;
}

function kursKarte(kurs) {
  const meta = kursMeta(kurs);
  return html`<article class="card course-card">
    ${kurs.badge ? html`<span class="badge">${kurs.badge}</span>` : ''}
    <h2 class="course-card__title">${kurs.title}</h2>
    <p>${kurs.teaser || kurs.claim}</p>
    ${meta ? html`<p class="course-card__meta">${meta}</p>` : ''}
    <a class="btn btn--dark btn--sm" style="align-self:flex-start" href="/kurse/${kurs.slug}"
      >Kursdetails →</a
    >
  </article>`;
}

/* ------------------------------------------------------------------ Start */
export function startseite(content) {
  const k = content.kontakt;
  return {
    title: 'Hundeschule Hülben – Training für Mensch & Hund | Alexandra Goller',
    description:
      'Gewaltfreies Hundetraining in Hülben auf der Schwäbischen Alb. Einzeltraining und Gruppenkurse in kleinen Gruppen mit 5–7 Mensch-Hund-Teams.',
    body: html`
      <div class="wrap" style="padding-top:clamp(20px,3vw,40px)">
        <section class="hero">
          ${picture({
            ...PHOTOS.hero,
            className: 'hero__img',
            sizes: '100vw',
            loading: 'eager',
            fetchpriority: 'high',
          })}
          <div class="hero__body">
            <p class="hero__tag">Hundeschule Hülben · Schwäbische Alb</p>
            <h1>Training für Mensch &amp; Hund.</h1>
            <p>
              Gewaltfrei, alltagsnah und in kleinen Gruppen. Ich bin ${k.name} und begleite euch, bis
              ihr ein Team seid.
            </p>
            <div class="btn-row">
              <a class="btn btn--lime" href="/kurse">Kurse ansehen</a>
              <a class="btn btn--ghost" href="/einzeltraining">Einzeltraining</a>
            </div>
          </div>
        </section>
      </div>

      <div class="wrap section--tight">
        <div class="grid grid--4">
          <div class="fact">
            <p class="eyebrow">Gruppengröße</p>
            <p class="fact__value">5 – 7 Teams</p>
          </div>
          <div class="fact">
            <p class="eyebrow">Kurse</p>
            <p class="fact__value">Einzeln buchbar</p>
          </div>
          <div class="fact">
            <p class="eyebrow">Trainingsgelände</p>
            <p class="fact__value">${(k.plzOrt || '').split(' ').slice(1).join(' ') || 'Hülben'}</p>
          </div>
          <a class="fact fact--dark" href="${telHref(k.mobil)}">
            <p class="eyebrow">Direkt fragen</p>
            <p class="fact__value">${k.mobil}</p>
          </a>
        </div>
      </div>

      <section class="wrap section">
        <div
          style="display:flex;align-items:flex-end;justify-content:space-between;gap:30px;flex-wrap:wrap"
        >
          <h2 style="max-width:620px">Lernen. Wissen. Verstehen. Vertrauen.</h2>
          <p class="lead" style="max-width:460px">
            …das sind die vier Grundpfeiler meines Trainings. Auf diesen baut mein Training, meine
            Profession und meine Begeisterung für gewaltfreies Training auf.
          </p>
        </div>
        <div class="grid grid--4" style="margin-top:34px">
          ${SCHRITTE.map(
            ([num, titel, text]) => html`<article class="card step">
              <p class="step__num">${num}</p>
              <p class="step__title">${titel}</p>
              <p>${text}</p>
            </article>`
          )}
        </div>
      </section>

      <section class="wrap section--tight">
        <div class="grid grid--2">
          <a class="photo-card" href="/einzeltraining">
            ${picture({
              ...PHOTOS.puppy,
              className: 'photo-card__img',
              sizes: '(max-width: 760px) 100vw, 50vw',
            })}
            <div class="photo-card__body">
              <h3>Maßgeschneidertes Einzeltraining</h3>
              <p>
                Individuell abgestimmt auf dich und deinen Hund. Beim Einzeltraining erarbeiten wir
                gemeinsam das passende Training für euch – auch bei speziellen Verhaltensweisen.
              </p>
              <p class="arrow-link">zum Einzeltraining →</p>
            </div>
          </a>
          <a class="photo-card" href="/kurse">
            ${picture({
              ...PHOTOS.twoDogs,
              className: 'photo-card__img',
              sizes: '(max-width: 760px) 100vw, 50vw',
            })}
            <div class="photo-card__body">
              <h3>Gruppenkurse</h3>
              <p>
                Tolle Lernerfahrungen gemeinsam in der Gruppe sammeln – vom Junghundekurs bis zu
                Alltags- und Beschäftigungskursen. Einzeln buchbare Module, kleine Gruppen.
              </p>
              <p class="arrow-link">zum Kursangebot →</p>
            </div>
          </a>
        </div>
      </section>

      <section class="wrap section">
        <div class="panel">
          <h2>Das erwartet dich bei mir</h2>
          <div style="margin-top:20px">${checkList(ERWARTUNGEN, true)}</div>
        </div>
      </section>
    `,
  };
}

/* --------------------------------------------------------- Einzeltraining */
export function einzeltraining(content) {
  return {
    title: 'Einzeltraining',
    description:
      'Maßgeschneidertes Einzeltraining für dich und deinen Hund – individuell abgestimmt, auch bei speziellen Verhaltensweisen. Auch mobil in Hülben und Umgebung.',
    body: html`
      ${breadcrumb([{ href: '/', label: 'Start' }, { label: 'Einzeltraining' }])}
      <section class="wrap section--tight">
        <div class="grid grid--split">
          <div class="stack gap-24">
            <h1>Maßgeschneidertes Einzeltraining</h1>
            <p class="lead">
              Individuell abgestimmtes Training auf dich und deinen Hund. Beim Einzeltraining
              erarbeiten wir gemeinsam das passende Training für euch.
            </p>
            <div class="prose measure">
              <p>
                Ich biete dir maßgeschneiderte Einzeltrainings an, wenn du an speziellen
                Verhaltensweisen deines Hundes arbeiten möchtest oder du ein abgestimmtes Training
                auf euren individuellen Trainingsstand haben möchtest.
              </p>
            </div>
            <ol class="steps-list">
              ${EINZEL_SCHRITTE.map(
                ([titel, text], i) => html`<li>
                  <span class="num" aria-hidden="true">${i + 1}</span>
                  <span><strong>${titel}</strong>${text}</span>
                </li>`
              )}
            </ol>
            <div class="btn-row">
              <a class="btn btn--dark" href="/kontakt?thema=Einzeltraining"
                >Einzeltraining anfragen</a
              >
              <a class="btn btn--outline" href="${telHref(content.kontakt.mobil)}"
                >${content.kontakt.mobil}</a
              >
            </div>
          </div>
          <div class="stack gap-16">
            ${picture({
              ...PHOTOS.puppy,
              className: 'side-photo',
              sizes: '(max-width: 1080px) 100vw, 420px',
            })}
            <div class="panel">
              <p class="panel__title">Auch mobil</p>
              <p style="margin-top:8px;color:var(--muted);font-size:16px;line-height:1.6">
                Gerne komme ich für das Einzeltraining zu euch nach Hause – vor allem in Hülben und
                Umgebung. So trainieren wir direkt dort, wo der Alltag stattfindet.
              </p>
            </div>
          </div>
        </div>
      </section>
    `,
  };
}

function kursBeschreibung(kurs) {
  const meta = kursMeta(kurs);
  const text = kurs.teaser || kurs.claim || `${kurs.title} in Hülben`;
  const voll = meta ? `${text} (${meta})` : text;
  if (voll.length <= 160) return voll;
  return voll.slice(0, 157).replace(/\s+\S*$/, '') + '…';
}

/* ------------------------------------------------------------------ Kurse */
export function kurseUebersicht(content) {
  const kurse = sichtbareKurse(content);
  const k = content.kontakt;
  return {
    title: 'Kurse',
    description:
      'Gruppenkurse in Hülben: Junghundekurs, Beschäftigung & Alltag und Dummy-Training. Einzeln buchbare Module mit 5–7 Mensch-Hund-Teams.',
    body: html`
      ${breadcrumb([{ href: '/', label: 'Start' }, { label: 'Kurse' }])}
      <section class="wrap section--tight">
        <div class="hero hero--compact">
          ${picture({ ...PHOTOS.twoDogs, className: 'hero__img', sizes: '100vw' })}
          <div class="hero__body">
            <h1>Gruppentraining – Freude am gemeinsamen Lernen</h1>
            <p>
              Die Kursangebote sind abgeschlossene, einzeln buchbare Module und bauen teilweise
              aufeinander auf. 5 – 7 Mensch-Hund-Teams pro Kurs.
            </p>
          </div>
        </div>

        ${kurse.length
          ? html`<div class="grid grid--3" style="margin-top:26px">${kurse.map(kursKarte)}</div>`
          : html`<div class="panel" style="margin-top:26px">
              <p class="panel__title">Aktuell sind keine Kurse ausgeschrieben</p>
              <p style="margin-top:8px;color:var(--muted)">
                Melde dich gerne direkt – ich sage dir, wann der nächste Kurs startet.
              </p>
            </div>`}

        <div class="grid grid--split-even" style="margin-top:26px">
          <div class="panel">
            <p class="panel__title">Noch nicht das Richtige gefunden?</p>
            <p style="margin-top:10px;color:var(--muted);font-size:16px;line-height:1.65">
              Meine Hundeschule wurde erst neu eröffnet – das Kursangebot erweitert sich nach und
              nach. Schau gerne ab und zu vorbei oder melde dich, wenn du Interesse an bestimmten
              Kursinhalten hast, die du hier noch nicht findest.
            </p>
          </div>
          <div class="panel--dark stack gap-12">
            <p class="panel__title">Anmeldung</p>
            <p>Du hast dich entschieden? Dann freue ich mich auf deine Anmeldung.</p>
            <a class="btn btn--lime" href="/kontakt">Anfrage senden</a>
            ${k.mobil
              ? html`<a class="btn btn--ghost" href="${telHref(k.mobil)}">${k.mobil}</a>`
              : ''}
          </div>
        </div>
      </section>
    `,
  };
}

export function kursDetail(content, kurs) {
  const k = content.kontakt;
  const rows = [
    ['Neue Kurstermine', kurs.termine],
    ['Trainingsort', kurs.ort],
    ['Deine Trainerin', kurs.trainerin],
    ['Kursgebühr', kurs.gebuehr || kurs.preis],
  ].filter(([, value]) => value);

  return {
    title: kurs.title,
    description: kursBeschreibung(kurs),
    body: html`
      ${breadcrumb([
        { href: '/', label: 'Start' },
        { href: '/kurse', label: 'Kurse' },
        { label: kurs.title },
      ])}
      <section class="wrap section--tight">
        <div class="grid grid--split">
          <div class="stack gap-24">
            <div class="stack gap-12">
              ${kurs.badge ? html`<span class="badge">${kurs.badge}</span>` : ''}
              <h1>${kurs.title}</h1>
              ${kurs.claim ? html`<p class="lead">${kurs.claim}</p>` : ''}
            </div>
            <div class="prose measure">${kurs.body.map((p) => html`<p>${p}</p>`)}</div>
            ${kurs.voraussetzung
              ? html`<div class="note">
                  <p class="note__title">Voraussetzungen</p>
                  <p>${kurs.voraussetzung}</p>
                </div>`
              : ''}
            ${kurs.inhalte.length
              ? html`<div>
                  <h2 style="font-size:clamp(22px,2.6vw,28px)">
                    Folgende Inhalte sind Teil des Kurses
                  </h2>
                  <div style="margin-top:18px">${checkList(kurs.inhalte)}</div>
                </div>`
              : ''}
          </div>

          <div class="stack gap-16">
            <aside class="info-box" aria-label="Kursdaten">
              ${rows.map(
                ([label, value], i) => html`
                  ${i > 0 ? html`<hr />` : ''}
                  <div class="info-row">
                    <p class="info-row__label">${label}</p>
                    <p class="info-row__value">${value}</p>
                  </div>
                `
              )}
              <a class="btn btn--dark btn--block" href="/kontakt?thema=${kurs.title}"
                >Zur Anmeldung</a
              >
              ${k.mobil
                ? html`<a
                    class="btn btn--outline btn--block btn--sm"
                    href="${telHref(k.mobil)}"
                    >Erst kurz fragen: anrufen</a
                  >`
                : ''}
            </aside>
            <a class="arrow-link" href="/kurse" style="padding-inline:6px">← alle Kurse</a>
          </div>
        </div>
      </section>
    `,
  };
}

/* ----------------------------------------------------------------- Preise */
export function preise(content) {
  const p = content.preise;
  const k = content.kontakt;
  return {
    title: 'Preise',
    description:
      'Preisliste für Einzelstunden, Welpenkurs und Junghundekurs der Hundeschule Alexandra Goller in Hülben. Alle Preise inklusive MwSt.',
    body: html`
      ${breadcrumb([{ href: '/', label: 'Start' }, { label: 'Preise' }])}
      <section class="wrap section--tight">
        <div class="grid grid--split">
          <div class="stack gap-24">
            <h1>Preisliste</h1>
            <div class="price-list">
              ${p.items.map(
                (item) => html`<div class="price-row">
                  <span class="price-row__label">${item.l}</span>
                  <span class="price-row__value">${item.r}</span>
                </div>`
              )}
            </div>
            <div class="stack gap-8">
              ${p.hinweise.map((hinweis) => html`<p class="price-hint">${hinweis}</p>`)}
            </div>
          </div>
          <div class="stack gap-16">
            <div class="panel stack gap-12">
              <p class="panel__title">Noch unsicher, was passt?</p>
              <p style="color:var(--muted);font-size:16px;line-height:1.6">
                Melde dich einfach – wir finden gemeinsam heraus, ob ein Kurs oder ein Einzeltraining
                der bessere Start für euch ist.
              </p>
              <a class="btn btn--dark" href="/kontakt">Termin anfragen</a>
              ${k.mobil ? html`<a class="btn btn--outline" href="${telHref(k.mobil)}">${k.mobil}</a>` : ''}
            </div>
            <a class="arrow-link" href="/kurse" style="padding-inline:6px">Alle Kurse ansehen →</a>
          </div>
        </div>
      </section>
    `,
  };
}

/* -------------------------------------------------------- Trainingsgelände */
export function gelaende(content) {
  const g = content.gelaende;
  const k = content.kontakt;
  return {
    title: 'Trainingsgelände',
    description:
      'Das Trainingsgelände in Hülben: 1.300 qm eingezäuntes Gelände in ruhiger Waldrandlage, direkt neben der Rietenlauhalle.',
    body: html`
      ${breadcrumb([{ href: '/', label: 'Start' }, { label: 'Trainingsgelände' }])}
      <section class="wrap section--tight">
        <div class="grid grid--split">
          <div class="stack gap-16">
            <p class="eyebrow">Trainingsgelände</p>
            <h1>Herzlich Willkommen</h1>
            <div class="prose measure">${g.text.map((t) => html`<p>${t}</p>`)}</div>
          </div>
          <div class="stack gap-16">
            <div class="panel">
              <p class="panel__title">Das Trainingsgelände</p>
              <div style="margin-top:16px">${checkList(g.liste)}</div>
            </div>
            <div class="panel--dark stack gap-12">
              <p class="panel__title">Navigation</p>
              <p style="font-family:var(--font-head);font-size:19px;color:#fff">${k.navAdresse}</p>
              <p>
                Direkt neben der Rietenlauhalle – für die Navigation bitte die Adresse der Halle
                verwenden.
              </p>
              <a class="btn btn--lime" href="/kontakt">Termin anfragen</a>
            </div>
          </div>
        </div>
      </section>
    `,
  };
}

/* -------------------------------------------------------------- Über mich */
export function ueberMich(content) {
  const k = content.kontakt;
  return {
    title: 'Über mich',
    description:
      'Alexandra Goller – Hundetrainerin (ATN AG), Mitglied im IBH e.V., Erlaubnis gemäß § 11 TierSchG. Gewaltfreies Training für Mensch und Hund.',
    body: html`
      ${breadcrumb([{ href: '/', label: 'Start' }, { label: 'Über mich' }])}
      <section class="wrap section--tight">
        <div class="grid grid--split">
          <div class="stack gap-16">
            <h1>Herzlich willkommen</h1>
            <div class="prose measure">
              <p>
                Meine Erfahrungen mit meinen eigenen Hunden sowie mit unterschiedlichsten
                Mensch-Hund-Teams zeigen mir immer wieder aufs Neue, dass erfolgreiches Training vor
                allem auf einem gegenseitigen vertrauensvollen Umgang und einem gemeinsamen positiven
                Lernen basiert.
              </p>
              <p>
                Mit meinem Trainingsangebot für Mensch &amp; Hund zeige ich Wege und
                Trainingsmöglichkeiten auf, die euch helfen, die Herausforderungen des Alltags
                gemeinsam zu meistern. Mein Ziel ist es, euch dabei zu unterstützen, die individuellen
                Bedürfnisse eures Hundes zu erkennen und das Verhalten besser zu verstehen, so dass
                das gegenseitige Vertrauen wachsen kann.
              </p>
              <p>
                Ich begleite euch bei eurem gemeinsamen Weg mit viel Empathie und Kompetenz, so dass
                du und dein Hund zu einem vertrauten und unschlagbaren Team werdet.
              </p>
            </div>
            <div class="panel stack gap-8">
              <p class="eyebrow">Mitgliedschaft &amp; Qualifikation</p>
              <p style="font-family:var(--font-head);font-size:19px;line-height:1.4">
                Internationaler Berufsverband der Hundetrainer &amp; Hundeunternehmer (IBH) e.V.
              </p>
              <p style="color:var(--muted);font-size:16px">
                Hundetrainerin ATN AG · Erlaubnis gemäß § 11 Abs. 1 Satz 1 Nr. 8f TierSchG
              </p>
            </div>
          </div>
          <div class="stack gap-16">
            ${picture({
              ...PHOTOS.twoDogs,
              className: 'side-photo',
              sizes: '(max-width: 1080px) 100vw, 420px',
            })}
            <div class="panel--dark stack gap-12">
              <p class="panel__title">Lass uns sprechen</p>
              <p>Du hast Fragen zu eurem Training? Melde dich gerne jederzeit.</p>
              <a class="btn btn--lime" href="/kontakt">Termin anfragen</a>
              ${k.mobil ? html`<a class="btn btn--ghost" href="${telHref(k.mobil)}">${k.mobil}</a>` : ''}
            </div>
          </div>
        </div>
      </section>
    `,
  };
}

/* ---------------------------------------------------------------- Kontakt */
export function kontakt(content, { thema = '', status = '', turnstileSiteKey = '' } = {}) {
  const k = content.kontakt;
  const themen = ['Einzeltraining', ...sichtbareKurse(content).map((kurs) => kurs.title), 'Sonstiges'];
  const gewaehlt = themen.includes(thema) ? thema : '';

  return {
    title: 'Kontakt & Anfrage',
    description:
      'Kontakt zur Hundeschule Alexandra Goller in Hülben: Anfrage über das Formular, per E-Mail oder telefonisch.',
    body: html`
      ${breadcrumb([{ href: '/', label: 'Start' }, { label: 'Kontakt' }])}
      <section class="wrap section--tight">
        <div class="grid grid--split">
          <div class="stack gap-16">
            <h1>Schreib' mir oder ruf einfach an</h1>
            <p class="lead measure">
              Ich freue mich auf unser gemeinsames Training! Wenn du noch Fragen hast, melde dich
              gerne jederzeit.
            </p>
            <div class="stack gap-12">
              ${k.mobil
                ? html`<a class="contact-link" href="${telHref(k.mobil)}">
                    <span>${k.mobil}</span><span>anrufen →</span>
                  </a>`
                : ''}
              ${k.email
                ? html`<a class="contact-link" href="mailto:${k.email}">
                    <span>${k.email}</span><span>E-Mail →</span>
                  </a>`
                : ''}
            </div>
            <div class="panel stack gap-8">
              <p class="eyebrow">Trainingsgelände &amp; Anschrift</p>
              <p style="font-family:var(--font-head);font-size:19px;line-height:1.45">
                ${k.name}<br />${k.strasse} · ${k.plzOrt}
              </p>
              ${k.festnetz
                ? html`<p style="color:var(--muted);font-size:16px">
                    Festnetz <a href="${telHref(k.festnetz)}">${k.festnetz}</a>
                  </p>`
                : ''}
            </div>
            <div class="panel stack gap-12">
              <p class="panel__title">Dein Weg zu mir</p>
              <p style="color:var(--muted);font-size:16px;line-height:1.65">
                Mein Trainingsgelände befindet sich in der Gemeinde Hülben, direkt neben der
                Rietenlauhalle. Für die Navigation kannst du daher die Adresse der Rietenlauhalle
                verwenden:
              </p>
              <p style="font-family:var(--font-head);font-size:19px">${k.navAdresse}</p>
              <p style="color:var(--muted);font-size:16px;line-height:1.65">
                Die Treffpunkte für das mobile Einzeltraining vereinbaren wir jeweils individuell.
                Solltest du mich telefonisch nicht direkt erreichen, hinterlass' mir einfach eine
                Nachricht mit deinem Namen und deiner Rufnummer – ich melde mich so schnell wie
                möglich zurück.
              </p>
              ${k.instagram || k.facebook
                ? html`<p style="display:flex;gap:16px;flex-wrap:wrap">
                    ${k.instagram
                      ? html`<a href="${k.instagram}" target="_blank" rel="noopener noreferrer"
                          >Instagram</a
                        >`
                      : ''}
                    ${k.facebook
                      ? html`<a href="${k.facebook}" target="_blank" rel="noopener noreferrer"
                          >Facebook</a
                        >`
                      : ''}
                  </p>`
                : ''}
            </div>
          </div>

          <div class="card">
            <h2 style="font-size:clamp(22px,2.4vw,26px)">Anfrage senden</h2>
            <form class="form" id="kontaktForm" method="post" action="/api/kontakt" style="margin-top:18px">
              <div
                class="form-status ${status === 'ok' ? 'form-status--ok' : 'form-status--error'}"
                id="formStatus"
                role="status"
                ${status ? raw('') : raw('hidden')}
              >
                ${status === 'ok'
                  ? 'Vielen Dank! Deine Anfrage ist angekommen – ich melde mich so schnell wie möglich bei dir.'
                  : status === 'error'
                    ? 'Das hat leider nicht geklappt. Bitte versuche es erneut oder ruf mich einfach an.'
                    : ''}
              </div>

              <div class="field">
                <label for="name">Dein Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  maxlength="100"
                  autocomplete="name"
                  placeholder="Vor- und Nachname"
                />
              </div>

              <div class="field">
                <label for="kontakt">E-Mail oder Telefon</label>
                <input
                  id="kontakt"
                  name="kontakt"
                  type="text"
                  required
                  maxlength="120"
                  autocomplete="email"
                  placeholder="So erreiche ich dich"
                />
              </div>

              <fieldset class="field" style="border:0;padding:0;margin:0">
                <legend class="fieldset__legend">Worum geht es?</legend>
                <div class="chips" style="margin-top:6px">
                  ${themen.map(
                    (t, i) => html`<label class="chip"
                      ><input
                        type="radio"
                        name="thema"
                        value="${t}"
                        ${gewaehlt === t || (!gewaehlt && i === 0) ? raw('checked') : ''}
                      /><span>${t}</span></label
                    >`
                  )}
                </div>
              </fieldset>

              <div class="field">
                <label for="nachricht">Deine Nachricht</label>
                <textarea
                  id="nachricht"
                  name="nachricht"
                  required
                  minlength="10"
                  maxlength="3000"
                  placeholder="Erzähl mir kurz von dir und deinem Hund…"
                ></textarea>
              </div>

              <label class="consent">
                <input type="checkbox" name="datenschutz" value="ja" required />
                <span
                  >Ich habe die <a href="/datenschutz">Datenschutzhinweise</a> gelesen und bin
                  einverstanden, dass meine Angaben zur Bearbeitung der Anfrage gespeichert
                  werden.</span
                >
              </label>

              <div class="hp-field" aria-hidden="true">
                <label for="webseite">Webseite (bitte frei lassen)</label>
                <input id="webseite" name="webseite" type="text" tabindex="-1" autocomplete="off" />
              </div>
              <input type="hidden" name="ts" id="formTs" value="" />
              ${turnstileSiteKey
                ? html`<div
                    class="cf-turnstile"
                    data-sitekey="${turnstileSiteKey}"
                    data-language="de"
                  ></div>`
                : ''}

              <button class="btn btn--dark btn--block" type="submit" id="formSubmit">
                Anfrage abschicken
              </button>
              <p class="form__note">
                Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher
                Inhalte eine SSL-Verschlüsselung. Daten, die du übermittelst, können somit nicht von
                Dritten mitgelesen werden.
              </p>
            </form>
          </div>
        </div>
      </section>
      ${turnstileSiteKey
        ? raw(
            '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>'
          )
        : ''}
    `,
  };
}

/* ------------------------------------------------------------ Rechtliches */
export function rechtSeite(content, key) {
  const page = content.recht[key];
  const k = content.kontakt;
  return {
    title: page.title,
    description: `${page.title} – ${k.betrieb || k.name}, ${k.plzOrt}.`,
    body: html`
      ${breadcrumb([{ href: '/', label: 'Start' }, { label: page.title }])}
      <section class="wrap section--tight">
        <div class="grid grid--split">
          <div class="stack gap-16">
            <h1>${page.title}</h1>
            ${page.lead ? html`<p class="lead">${fillPlaceholders(page.lead, k)}</p>` : ''}
            <div class="stack gap-24" style="margin-top:8px">
              ${page.blocks.map(
                (block) => html`<div>
                  <h2 style="font-size:clamp(19px,2vw,22px);font-weight:600">${block.h}</h2>
                  <div class="prose" style="margin-top:8px">
                    ${block.p.map((line) => html`<p>${fillPlaceholders(line, k)}</p>`)}
                  </div>
                </div>`
              )}
            </div>
          </div>
          <nav class="panel stack gap-8" aria-label="Rechtliche Seiten">
            <p class="eyebrow">Rechtliches</p>
            ${LEGAL_NAV.map(
              (item) =>
                html`<a
                  href="${item.href}"
                  style="font-weight:600;font-size:17px;color:${item.href === `/${key}`
                    ? 'var(--leaf)'
                    : 'var(--ink)'}"
                  >${item.label}</a
                >`
            )}
          </nav>
        </div>
      </section>
    `,
  };
}

/* ---------------------------------------------------------------- 404 */
export function nichtGefunden(content) {
  return {
    title: 'Seite nicht gefunden',
    description: 'Diese Seite gibt es leider nicht.',
    noindex: true,
    body: html`
      <section class="wrap section">
        <div class="panel stack gap-16" style="text-align:center;padding-block:clamp(40px,8vw,80px)">
          <p class="eyebrow">Fehler 404</p>
          <h1>Diese Seite gibt es leider nicht</h1>
          <p class="lead" style="margin-inline:auto;max-width:48ch">
            Vielleicht hat sich die Adresse geändert. Schau gerne im Kursangebot vorbei oder melde
            dich direkt bei mir.
          </p>
          <div class="btn-row" style="justify-content:center">
            <a class="btn btn--dark" href="/">Zur Startseite</a>
            <a class="btn btn--outline" href="/kurse">Kurse ansehen</a>
          </div>
        </div>
      </section>
    `,
  };
}
