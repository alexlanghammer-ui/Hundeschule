/**
 * Standard-Inhalte der Website.
 *
 * Diese Werte werden ausgeliefert, solange im Admin-Bereich nichts gespeichert
 * wurde. Sobald etwas gespeichert wird, liegt der Inhalt im KV-Store und wird
 * beim Ausliefern ueber diese Defaults gelegt (siehe src/lib/content.js).
 */

export const KONTAKT = {
  name: 'Alexandra Goller',
  betrieb: 'Alexandra Goller – Hundetraining',
  mobil: '+49 176 43198863',
  festnetz: '+49 7125 3096919',
  email: 'kontakt@deine-domain.de',
  strasse: 'Robert-Kempel-Straße 8',
  plzOrt: '72584 Hülben',
  navAdresse: 'Kaltentalstraße 30, 72584 Hülben',
  instagram: 'https://www.instagram.com/4steps4dogs_alexandra_goller/',
  facebook: '',
  ustId: 'DE000000000',
};

export const PREISE = {
  items: [
    { l: 'Einzelstunde + schriftliche Unterlagen', r: '70,- € / 60 Min.' },
    {
      l: 'Welpenkurs 7 Einheiten (à 45 Min.) + 1 Einzelcoaching (ca. 60 Min.) + schriftliche Unterlagen',
      r: '220,- €',
    },
    {
      l: 'Junghundekurs 7 Einheiten (à 60 Min.) + 1 Theorieeinheit (ca. 60 Min.) schriftliche Unterlagen',
      r: '220,- €',
    },
  ],
  hinweise: [
    'Preise aller weiteren Kursangebote findest du direkt bei der jeweiligen Kursausschreibung',
    'Alle Preise incl. MwSt.',
  ],
};

export const KURSE = [
  {
    slug: 'junghundekurs',
    sichtbar: true,
    badge: 'Junghunde',
    title: 'Junghundekurs',
    claim: 'Die Zeit der Veränderungen…',
    teaser:
      'Die Zeit der Veränderungen… ich begleite und unterstütze euch in der oft turbulenten, aber auch faszinierenden Zeit der Junghundeentwicklung.',
    umfang: '7 x 60 Min.',
    start: 'ab 13.04.2026',
    preis: '195,- €',
    termine:
      'Montag, den 13.04., 27.04., 11.05., 18.05., 01.06., 15.06., und 29.06.2026 um 18 Uhr',
    ort: 'Trainingsgelände an der Rietenlauhalle (Kaltentalstraße), 72584 Hülben',
    gebuehr: '7 x Praxis á 60 Min., schriftliche Unterlagen: 195,- € inkl. MwSt.',
    trainerin: '',
    voraussetzung: '',
    body: [
      'Die Jugendentwicklung ist ein sehr wichtiger Lebensabschnitt eures Hundes. Schon ab dem 5. Lebensmonat befinden sich eure Hunde in der Pubertät. In der Zeit zwischen der Pubertät und Erwachsenwerden (bis etwa zum 24. Lebensmonat) durchläuft euer Junghund sehr viele wichtige Entwicklungsphasen. In dieser Zeit befindet sich das Hundegehirn in einer Umstrukturierungsphase und es finden ebenfalls viele hormonelle sowie körperliche Veränderungen bei euren Hunden statt. All diese biologischen Prozesse haben meist deutliche Auswirkungen auf das Verhalten eures Hundes. Diese biologischen Entwicklungsschritte und die daraus entstehenden Verhaltensveränderungen möchte ich dir im Junghundekurs näher bringen, damit du deinen Hund in dieser spannenden Zeit bestmöglich unterstützen und trotzdem ein erfolgreiches Training in den Alltag integrieren kannst.',
    ],
    inhalte: [
      'Ich begleite euch bei verschiedenen Alltagssituationen',
      'Wir lernen und üben nützliche Grundsignale wie beispielsweise den Rückruf, Ausgeben und Bleib',
      'Wir gehen gemeinsam das große Thema Leinenführigkeit an',
      'Wir lernen verschiedene Entspannungstechniken kennen',
      'Neben den praktischen Übungen gehen wir auch auf verschiedene lerntheoretische Hintergründe ein',
      'Und wir besprechen die verschiedenen biologischen Entwicklungsvorgänge, die dein Hund in der Jugendentwicklung durchläuft',
      'Ein wichtiges Thema ist natürlich auch die Kommunikation – hierbei ist vor allem auch die Kommunikation Mensch zu Hund ein wichtiger Bestandteil',
      'Wir lernen die Körpersprache deines Hundes zu verstehen',
      'Zeit für Fragen: Ihr erhaltet Antworten auf eure Fragen rund um das Leben mit Junghund',
    ],
  },
  {
    slug: 'beschaeftigung-und-alltag',
    sichtbar: true,
    badge: 'Alltag',
    title: 'Beschäftigung & Alltag',
    claim: 'Nur keine Langeweile im Alltag…',
    teaser:
      'Wir bringen Abwechslung in den Alltag und ins Training mit vielfältigen Beschäftigungen.',
    umfang: '7 x 60 Min.',
    start: 'ab 09.07.2025',
    preis: '180,- €',
    termine:
      'Mittwoch, den 09.07., 23.07., 06.08., 20.08., 03.09., 17.09. und 01.10.2025 um 18 Uhr',
    ort: 'Trainingsgelände an der Rietenlauhalle (Kaltentalstraße), 72584 Hülben',
    gebuehr: '7 Einheiten á 60 Min.: 180,- € inkl. MwSt.',
    trainerin: '',
    voraussetzung: '',
    body: [
      'Dieser Kurs ist ein bunter Mix aus unterschiedlichsten Lernbereichen mit dem Ziel, dir und deinem Hund für unterwegs sowie für Zuhause vielseitige Beschäftigungsvarianten aufzuzeigen. Dabei stehen die Bedürfnisse und Hobbys eurer Hunde im Mittelpunkt. Langeweile kommt hier sicherlich nicht auf.',
      'Außerdem werden wir im Kurs die erlernten Beschäftigungen ins Alltags-Training einfließen lassen, so dass euer Hund beispielsweise jede Menge Freude bei der Leinenführigkeit entwickelt.',
    ],
    inhalte: [
      'Wir üben verschiedene Tricks',
      'Lösen unterschiedliche Suchaufgaben',
      'Ich trainiere auch das Apportieren verschiedenster Dinge mit euch',
      'Target-Training und Übungen zum Thema Distanzkontrolle stehen ebenfalls auf dem Lehrplan',
      'Verschiedene Kombiaufgaben, das heißt wir können verschiedene Kursinhalte nach und nach miteinander kombinieren',
      'Darüber hinaus frischen wir natürlich auch verschiedene Grundsignale auf',
      'Wir erarbeiten vielfältige Belohnungsmöglichkeiten',
      'Und berücksichtigen natürlich die individuellen Hobbys eurer Hunde',
    ],
  },
  {
    slug: 'dummy-training',
    sichtbar: true,
    badge: 'Einsteiger',
    title: 'DUMMY-Training für Einsteiger',
    claim: 'Für alle Hunde, die gerne suchen und apportieren',
    teaser:
      'Für Einsteiger – ideal für alle Hunde, die Freude am Suchen und Apportieren haben.',
    umfang: '7 Einheiten',
    start: 'ab 11.07.2025',
    preis: '225,- €',
    termine:
      'Fr., den 11.07., 25.07., 08.08., 22.08., 05.09., 12.09. und 19.09.25 um 18:30 Uhr',
    ort: 'An der Rietenlauhalle (Kaltentalstraße 50), 72584 Hülben',
    gebuehr: '225,- EUR für 7 Kurseinheiten und eine Webinaraufzeichnung',
    trainerin: 'Lena Maier, IBH lizenzierte Dummytrainerin',
    voraussetzung: 'Dein Hund sollte gerne Dinge ins Maul nehmen',
    body: [
      'In diesem Kurs entdecken Mensch und Hund gemeinsam die Grundlagen des Dummy-Trainings – ideal für alle Hunde, die Freude am Suchen und Tragen haben. Neben dem Erarbeiten der Grundlagen im Dummy-Training stärkt der Kurs die Beziehung zum Menschen sowie die Kooperationsbereitschaft des Hundes und bietet dem Hund die Möglichkeit, seine jagdlichen Fähigkeiten gemeinsam mit seinem Menschen als Hobby auszuleben.',
      'Alltagsfähigkeiten wie entspanntes Bei-Fuß-Gehen, ruhiges Warten sowie selbstständiges Arbeiten in Verbindung mit enger Zusammenarbeit werden dabei gezielt gefördert – stets auf Basis positiver Verstärkung und mit Blick auf die Bedürfnisse des jeweiligen Mensch-Hund-Teams.',
    ],
    inhalte: [],
  },
];

export const GELAENDE = {
  text: [
    'Direkt neben der Rietenlauhalle in Hülben befindet sich mein Hundetrainingsgelände. Ich freue mich darauf, euch und euren Hunden unterschiedlichste Gruppenkurse sowie individuelle Einzeltrainings anzubieten.',
    'Seit September 2021 wurde fleißig an der Entstehung eines Trainingsgeländes gearbeitet. Nun sind fast alle Umbaumaßnahmen abgeschlossen und ich freue mich, euch auf meinem tollen neuen Trainingsgelände begrüßen zu dürfen. Das Trainingsgelände bietet auf ca. 1.300 qm genug Raum, um auch in Gruppenkursen den benötigten Individualfreiraum für die Mensch-Hund-Teams zu bieten. Aufgrund der wunderschönen Waldrandlage sind auch im Sommer ausreichend Schattenplätze vorhanden.',
    'Mein Trainingsgelände befindet sich in einer sehr ruhigen Lage, direkt im Freizeit- und Sportgelände außerorts von Hülben. Es stehen genügend öffentliche Parkplätze zur Verfügung und es ist die perfekte Ausgangslage, um vor oder nach dem Training mit eurem Hund einen schönen Spaziergang ins Grüne zu machen.',
    'Weiterhin biete ich euch gerne mobile Einzeltrainings an, vor allem in Hülben und Umgebung. Das heißt, ich komme zu euch nach Hause und wir gehen das Training gemeinsam direkt bei euch im Alltag an.',
  ],
  liste: [
    '1.300 qm eingezäuntes Grundstück mit Sichtschutz',
    'Vielfältige Trainingsgeräte',
    'Sanitäre Anlagen',
    'Barrierefreie Räumlichkeiten',
    'Öffentliche Parkplätze vorhanden',
    'Direkte Feld- und Waldlage',
  ],
};

/**
 * Rechtstexte. {{mobil}}, {{festnetz}}, {{email}}, {{strasse}}, {{plzOrt}},
 * {{name}}, {{betrieb}} und {{ustId}} werden beim Rendern durch die aktuellen
 * Kontaktdaten ersetzt – so muss eine geaenderte Nummer nur einmal gepflegt werden.
 */
export const RECHT = {
  impressum: {
    title: 'Impressum',
    lead: 'Angaben gemäß § 5 DDG',
    blocks: [
      { h: 'Anbieterin', p: ['{{betrieb}}', '{{strasse}}', '{{plzOrt}}'] },
      {
        h: 'Kontakt',
        p: ['Telefon: {{mobil}}', 'Festnetz: {{festnetz}}', 'E-Mail: {{email}}'],
      },
      {
        h: 'Erlaubnis',
        p: [
          'Erlaubnis gemäß § 11 Abs. 1 Satz 1 Nr. 8f TierSchG, erteilt durch das Landratsamt Reutlingen.',
          'Mitglied im Internationalen Berufsverband der Hundetrainer & Hundeunternehmer (IBH) e.V.',
        ],
      },
      {
        h: 'Umsatzsteuer',
        p: ['Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: {{ustId}}'],
      },
      { h: 'Verantwortlich für den Inhalt', p: ['{{name}}, Adresse wie oben.'] },
      {
        h: 'Haftung für Inhalte',
        p: [
          'Die Inhalte dieser Seiten werden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.',
        ],
      },
      {
        h: 'Haftung für Links',
        p: [
          'Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte kein Einfluss besteht. Für diese fremden Inhalte ist stets der jeweilige Anbieter verantwortlich.',
        ],
      },
      {
        h: 'Urheberrecht',
        p: [
          'Die durch die Anbieterin erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Eine Vervielfältigung oder Verwendung außerhalb der Grenzen des Urheberrechts bedarf der schriftlichen Zustimmung.',
        ],
      },
    ],
  },
  datenschutz: {
    title: 'Datenschutz',
    lead: 'Informationen zur Verarbeitung personenbezogener Daten',
    blocks: [
      {
        h: 'Verantwortliche',
        p: ['{{name}}, {{strasse}}, {{plzOrt}}, {{email}}'],
      },
      {
        h: 'Grundsatz',
        p: [
          'Personenbezogene Daten werden nur erhoben, wenn dies für die Erbringung des Trainingsangebots erforderlich ist oder eine Einwilligung vorliegt. Eine Weitergabe an Dritte erfolgt nicht ohne ausdrückliche Zustimmung.',
        ],
      },
      {
        h: 'Kontaktaufnahme',
        p: [
          'Bei einer Anfrage über das Kontaktformular, per E-Mail oder telefonisch werden die übermittelten Angaben zur Bearbeitung der Anfrage und für mögliche Anschlussfragen gespeichert (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Die Daten werden gelöscht, sobald sie nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungsfristen entgegenstehen.',
          'Die Anfrage wird zur Zustellung an den E-Mail-Versanddienst Resend (Resend, Inc., USA) übergeben und zusätzlich für bis zu 180 Tage verschlüsselt im Speicher des Hosting-Anbieters abgelegt, damit keine Anfrage verloren geht. Grundlage sind Standardvertragsklauseln nach Art. 46 DSGVO.',
        ],
      },
      {
        h: 'Kursanmeldungen',
        p: [
          'Für die Durchführung eines Kurses oder Einzeltrainings werden Name, Anschrift, Kontaktdaten sowie Angaben zum Hund verarbeitet. Rechtsgrundlage ist die Vertragserfüllung nach Art. 6 Abs. 1 lit. b DSGVO.',
        ],
      },
      {
        h: 'Cookies',
        p: [
          'Diese Website setzt nur technisch notwendige Cookies bzw. lokale Speichereinträge ein – etwa um deine Cookie-Entscheidung zu merken und um das Kontaktformular gegen Missbrauch zu schützen. Optionale Cookies für Statistik werden erst nach deiner ausdrücklichen Einwilligung gesetzt; diese kannst du über den Link „Cookie-Einstellungen“ im Fußbereich jederzeit ändern oder widerrufen.',
        ],
      },
      {
        h: 'Schriftarten und externe Inhalte',
        p: [
          'Alle Schriftarten werden vom eigenen Server ausgeliefert. Es findet keine Verbindung zu Google Fonts oder vergleichbaren Diensten statt. Beim Aufruf der Seite werden keine Daten an Dritte übertragen.',
        ],
      },
      {
        h: 'SSL-Verschlüsselung',
        p: [
          'Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL-Verschlüsselung. Daten, die du übermittelst, können somit nicht von Dritten mitgelesen werden.',
        ],
      },
      {
        h: 'Hosting und Server-Logfiles',
        p: [
          'Die Website wird bei Cloudflare (Cloudflare, Inc.) gehostet. Beim Aufruf der Website werden automatisch Zugriffsdaten (IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browsertyp) verarbeitet. Die Verarbeitung erfolgt zum sicheren und stabilen Betrieb der Website auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.',
        ],
      },
      {
        h: 'Fotos aus dem Training',
        p: [
          'Aufnahmen aus Kursen und Einzeltrainings werden nur mit vorheriger Einwilligung veröffentlicht. Eine erteilte Einwilligung kann jederzeit widerrufen werden.',
        ],
      },
      {
        h: 'Deine Rechte',
        p: [
          'Es besteht jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht auf Beschwerde bei einer Aufsichtsbehörde.',
        ],
      },
    ],
  },
  agb: {
    title: 'AGB',
    lead: 'Allgemeine Geschäftsbedingungen für Kurse und Einzeltrainings',
    blocks: [
      {
        h: '1. Geltungsbereich',
        p: [
          'Diese Bedingungen gelten für alle Gruppenkurse, Einzeltrainings und mobilen Trainings von {{betrieb}}.',
        ],
      },
      {
        h: '2. Anmeldung und Vertrag',
        p: [
          'Die Anmeldung erfolgt schriftlich, per E-Mail oder über das Kontaktformular. Der Vertrag kommt mit der Anmeldebestätigung zustande. Kursplätze werden in der Reihenfolge der Anmeldungen vergeben.',
        ],
      },
      {
        h: '3. Kursgebühren',
        p: [
          'Die Gebühren ergeben sich aus der jeweiligen Kursausschreibung bzw. der Preisliste und sind vor Kursbeginn fällig. Alle Preise verstehen sich inklusive Mehrwertsteuer.',
        ],
      },
      {
        h: '4. Rücktritt und Ausfall',
        p: [
          'Bei einem Rücktritt bis 14 Tage vor Kursbeginn wird die Gebühr vollständig zurückerstattet. Danach wird die Gebühr fällig, sofern der Platz nicht anderweitig besetzt werden kann. Versäumte Einheiten können nicht erstattet werden. Muss ein Termin von meiner Seite ausfallen, wird er nachgeholt.',
        ],
      },
      {
        h: '5. Teilnahmevoraussetzungen',
        p: [
          'Teilnehmende Hunde müssen frei von ansteckenden Krankheiten und ausreichend geimpft sein. Läufige Hündinnen bitte vorab melden. Für jeden Hund ist eine gültige Hundehalter-Haftpflichtversicherung erforderlich. Teilnehmende unter 18 Jahren benötigen die Zustimmung der Erziehungsberechtigten.',
        ],
      },
      {
        h: '6. Haftung',
        p: [
          'Die Aufsichtspflicht über den Hund bleibt während des Trainings bei der jeweiligen Halterin oder dem Halter. Für Schäden, die durch den eigenen Hund verursacht werden, haftet die Halterin bzw. der Halter. Die Teilnahme erfolgt auf eigene Gefahr.',
        ],
      },
      {
        h: '7. Trainingsmethoden',
        p: [
          'Trainiert wird ausschließlich gewaltfrei und auf Basis positiver Verstärkung. Der Einsatz von Stachelhalsbändern, Würgehalsbändern oder ähnlichen Hilfsmitteln ist auf dem Trainingsgelände nicht erlaubt.',
        ],
      },
      {
        h: '8. Schlussbestimmungen',
        p: [
          'Sollte eine Bestimmung unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt. Es gilt deutsches Recht.',
        ],
      },
    ],
  },
};

export const DEFAULTS = {
  version: 1,
  kontakt: KONTAKT,
  preise: PREISE,
  kurse: KURSE,
  gelaende: GELAENDE,
  recht: RECHT,
};

export default DEFAULTS;
