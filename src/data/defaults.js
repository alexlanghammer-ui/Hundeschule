/**
 * Standard-Inhalte der Website.
 *
 * Diese Werte werden ausgeliefert, solange im Admin-Bereich nichts gespeichert
 * wurde. Sobald etwas gespeichert wird, liegt der Inhalt im KV-Store und wird
 * beim Ausliefern ueber diese Defaults gelegt (siehe src/lib/content.js).
 */

export const KONTAKT = {
  "name": "Alexandra Goller",
  "betrieb": "4steps4dogs – Alexandra Goller",
  "mobil": "+49 176 43198863",
  "festnetz": "+49 7125 3096919",
  "email": "alex@4steps4dogs.de",
  "strasse": "Robert-Kempel-Straße 8",
  "plzOrt": "72584 Hülben",
  "navAdresse": "Kaltentalstraße 30, 72584 Hülben",
  "instagram": "https://www.instagram.com/4steps4dogs_alexandra_goller/",
  "facebook": "",
  "ustId": "DE344766215"
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
 *
 * Inhaltlich uebernommen von der bisherigen Website; Hosting-, Mail- und
 * Cookie-Abschnitte wurden an die tatsaechliche Technik dieser Seite angepasst.
 */
export const RECHT = {
  "impressum": {
    "title": "Impressum",
    "lead": "Angaben gemäß § 5 DDG",
    "blocks": [
      {
        "h": "Anbieterin",
        "p": [
          "{{betrieb}}",
          "{{name}}",
          "{{strasse}}",
          "{{plzOrt}}"
        ]
      },
      {
        "h": "Kontakt",
        "p": [
          "Telefon: {{festnetz}}",
          "Mobil: {{mobil}}",
          "E-Mail: {{email}}"
        ]
      },
      {
        "h": "Umsatzsteuer",
        "p": [
          "Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: {{ustId}}"
        ]
      },
      {
        "h": "Aufsichtsbehörde",
        "p": [
          "Kreisveterinäramt Reutlingen, Aulbergstraße 32, 72764 Reutlingen",
          "https://www.kreis-reutlingen.de"
        ]
      },
      {
        "h": "Erlaubnis",
        "p": [
          "Die Erlaubnis gemäß § 11 Abs. 1 Satz 1 Nr. 8f TierSchG wurde mir durch das Kreisveterinäramt Reutlingen erteilt."
        ]
      },
      {
        "h": "Berufsbezeichnung und berufsrechtliche Regelungen",
        "p": [
          "Berufsbezeichnung: Hundetrainerin ATN AG",
          "Verliehen durch: Kreisveterinäramt Reutlingen, Aulbergstraße 32, 72764 Reutlingen",
          "Es gelten folgende berufsrechtliche Regelungen: § 11 Abs. 1 Satz 1 Nr. 8f TierSchG, einsehbar unter https://www.gesetze-im-internet.de/tierschg/__11.html"
        ]
      },
      {
        "h": "Mitgliedschaft",
        "p": [
          "Mitglied im Internationalen Berufsverband der Hundetrainer & Hundeunternehmer (IBH) e.V."
        ]
      },
      {
        "h": "Streitschlichtung",
        "p": [
          "Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."
        ]
      },
      {
        "h": "Haftung für Inhalte",
        "p": [
          "Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.",
          "Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen."
        ]
      },
      {
        "h": "Haftung für Links",
        "p": [
          "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.",
          "Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen."
        ]
      },
      {
        "h": "Urheberrecht",
        "p": [
          "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.",
          "Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen."
        ]
      }
    ]
  },
  "datenschutz": {
    "title": "Datenschutzerklärung",
    "lead": "Informationen zur Verarbeitung personenbezogener Daten auf dieser Website",
    "blocks": [
      {
        "h": "1. Datenschutz auf einen Blick",
        "p": [
          "Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.",
          "Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen – etwa Angaben, die Sie in das Kontaktformular eingeben. Andere Daten werden beim Besuch der Website automatisch durch technische Systeme erfasst, vor allem technische Daten wie Browsertyp, Betriebssystem oder Uhrzeit des Seitenaufrufs.",
          "Diese Website setzt keine Analyse- oder Werbe-Werkzeuge ein. Ihr Surfverhalten wird nicht ausgewertet, es findet kein Tracking statt und es werden keine Daten an Dritte zu Werbezwecken weitergegeben."
        ]
      },
      {
        "h": "2. Hosting: Cloudflare",
        "p": [
          "Diese Website wird bei Cloudflare gehostet. Anbieter ist die Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA, bzw. die Cloudflare Germany GmbH, Rosental 7, 80331 München.",
          "Cloudflare bietet ein weltweit verteiltes Netzwerk, über das die Inhalte dieser Website ausgeliefert werden. Dabei verarbeitet Cloudflare technisch notwendige Verbindungsdaten, um die Auslieferung sicher und stabil zu ermöglichen und Angriffe abzuwehren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; wir haben ein berechtigtes Interesse an einer möglichst zuverlässigen und sicheren Darstellung unserer Website.",
          "Eine Übermittlung von Daten in die USA kann dabei nicht ausgeschlossen werden. Sie wird auf die Standardvertragsklauseln der EU-Kommission gestützt. Details: https://www.cloudflare.com/privacypolicy/",
          "Die im Kontaktformular übermittelten Angaben sowie die pflegbaren Inhalte der Website werden im Speicherdienst Cloudflare Workers KV abgelegt. Formularanfragen werden dort nach 180 Tagen automatisch gelöscht."
        ]
      },
      {
        "h": "3. Hinweis zur verantwortlichen Stelle",
        "p": [
          "Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:",
          "{{betrieb}}, {{name}}, {{strasse}}, {{plzOrt}}",
          "Telefon: {{festnetz}} · E-Mail: {{email}}",
          "Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet."
        ]
      },
      {
        "h": "Speicherdauer",
        "p": [
          "Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung haben – etwa steuer- oder handelsrechtliche Aufbewahrungsfristen."
        ]
      },
      {
        "h": "Rechtsgrundlagen der Verarbeitung",
        "p": [
          "Sofern Sie in die Datenverarbeitung eingewilligt haben, verarbeiten wir Ihre personenbezogenen Daten auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO. Sofern Sie in die Speicherung von Cookies oder in den Zugriff auf Informationen in Ihrem Endgerät eingewilligt haben, erfolgt die Verarbeitung zusätzlich auf Grundlage von § 25 Abs. 1 TDDDG. Die Einwilligung ist jederzeit widerrufbar.",
          "Sind Ihre Daten zur Vertragserfüllung oder zur Durchführung vorvertraglicher Maßnahmen erforderlich, verarbeiten wir sie auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO. Weiter verarbeiten wir Ihre Daten, sofern dies zur Erfüllung einer rechtlichen Verpflichtung erforderlich ist, auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO, sowie auf Grundlage unseres berechtigten Interesses nach Art. 6 Abs. 1 lit. f DSGVO."
        ]
      },
      {
        "h": "Hinweis zur Datenweitergabe in die USA",
        "p": [
          "Für den Betrieb dieser Website setzen wir Dienste von Unternehmen mit Sitz in den USA ein (Cloudflare für das Hosting, Resend für den Versand von E-Mails). Dabei können personenbezogene Daten in die USA übertragen und dort verarbeitet werden. Wir weisen darauf hin, dass dort kein mit der EU vergleichbares Datenschutzniveau garantiert werden kann. Die Übermittlung wird auf die Standardvertragsklauseln der EU-Kommission nach Art. 46 DSGVO gestützt."
        ]
      },
      {
        "h": "Widerruf Ihrer Einwilligung zur Datenverarbeitung",
        "p": [
          "Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt."
        ]
      },
      {
        "h": "Widerspruchsrecht (Art. 21 DSGVO)",
        "p": [
          "Wenn die Datenverarbeitung auf Grundlage von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, haben Sie jederzeit das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, gegen die Verarbeitung Ihrer personenbezogenen Daten Widerspruch einzulegen; dies gilt auch für ein auf diese Bestimmungen gestütztes Profiling. Wenn Sie Widerspruch einlegen, werden wir Ihre betroffenen personenbezogenen Daten nicht mehr verarbeiten, es sei denn, wir können zwingende schutzwürdige Gründe für die Verarbeitung nachweisen, die Ihre Interessen, Rechte und Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.",
          "Werden Ihre personenbezogenen Daten verarbeitet, um Direktwerbung zu betreiben, haben Sie das Recht, jederzeit Widerspruch gegen die Verarbeitung einzulegen. Nach einem Widerspruch werden Ihre Daten nicht mehr zum Zwecke der Direktwerbung verwendet."
        ]
      },
      {
        "h": "Beschwerderecht bei der zuständigen Aufsichtsbehörde",
        "p": [
          "Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde zu, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes. Zuständig ist für uns der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg."
        ]
      },
      {
        "h": "Recht auf Datenübertragbarkeit",
        "p": [
          "Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen. Sofern Sie die direkte Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch machbar ist."
        ]
      },
      {
        "h": "Auskunft, Löschung und Berichtigung",
        "p": [
          "Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und gegebenenfalls ein Recht auf Berichtigung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit an uns wenden."
        ]
      },
      {
        "h": "Recht auf Einschränkung der Verarbeitung",
        "p": [
          "Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Das Recht besteht insbesondere, wenn Sie die Richtigkeit Ihrer bei uns gespeicherten Daten bestreiten, wenn die Verarbeitung unrechtmäßig geschah oder geschieht, wenn wir Ihre Daten nicht mehr benötigen, Sie sie jedoch zur Ausübung oder Verteidigung von Rechtsansprüchen brauchen, oder wenn Sie Widerspruch nach Art. 21 Abs. 1 DSGVO eingelegt haben und die Abwägung noch nicht abgeschlossen ist.",
          "Wenn Sie die Verarbeitung eingeschränkt haben, dürfen diese Daten – von ihrer Speicherung abgesehen – nur mit Ihrer Einwilligung oder zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen oder zum Schutz der Rechte einer anderen Person oder aus Gründen eines wichtigen öffentlichen Interesses verarbeitet werden."
        ]
      },
      {
        "h": "SSL- bzw. TLS-Verschlüsselung",
        "p": [
          "Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Anfragen, die Sie an uns senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers „https://“ anzeigt und am Schloss-Symbol in Ihrer Browserzeile. Wenn die Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden."
        ]
      },
      {
        "h": "Widerspruch gegen Werbe-E-Mails",
        "p": [
          "Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen vor."
        ]
      },
      {
        "h": "4. Cookies und lokale Speicherung",
        "p": [
          "Diese Website setzt nur technisch notwendige Einträge im Speicher Ihres Browsers. Konkret merken wir uns Ihre Entscheidung aus dem Cookie-Hinweis, damit dieser nicht bei jedem Besuch erneut erscheint. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO in Verbindung mit § 25 Abs. 2 TDDDG; es handelt sich um für den Betrieb erforderliche Speicherung.",
          "Optionale Cookies für Statistik oder Werbung setzen wir nicht. Sollten wir künftig solche einsetzen, geschieht dies erst nach Ihrer ausdrücklichen Einwilligung, die Sie über den Link „Cookie-Einstellungen“ im Fußbereich jederzeit ändern oder widerrufen können.",
          "Für die Anmeldung im nicht öffentlichen Verwaltungsbereich der Website wird ein technisch notwendiges Sitzungs-Cookie gesetzt. Es betrifft ausschließlich die Betreiberin und keine Besucherinnen und Besucher."
        ]
      },
      {
        "h": "Server-Log-Dateien",
        "p": [
          "Beim Aufruf dieser Website werden durch den Hosting-Anbieter automatisch Zugriffsdaten verarbeitet: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer-URL, Uhrzeit der Serveranfrage und IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO; wir haben ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Sicherheit unserer Website."
        ]
      },
      {
        "h": "Kontaktformular",
        "p": [
          "Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.",
          "Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO).",
          "Zur Abwehr von Missbrauch speichern wir zu jeder Formularanfrage zusätzlich Zeitpunkt, IP-Adresse und Browserkennung. Die Anfrage wird für bis zu 180 Tage im Speicher des Hosting-Anbieters vorgehalten und danach automatisch gelöscht – früher, wenn Sie uns zur Löschung auffordern oder der Zweck entfällt. Zwingende gesetzliche Aufbewahrungsfristen bleiben unberührt."
        ]
      },
      {
        "h": "Anfrage per E-Mail oder Telefon",
        "p": [
          "Wenn Sie uns per E-Mail oder Telefon kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Rechtsgrundlagen entsprechen denen des Kontaktformulars."
        ]
      },
      {
        "h": "5. Versand von E-Mails: Resend",
        "p": [
          "Für die Zustellung der Nachrichten aus dem Kontaktformular sowie der automatischen Eingangsbestätigung nutzen wir den Dienst Resend. Anbieter ist die Resend, Inc., 2261 Market Street #5039, San Francisco, CA 94114, USA.",
          "An Resend werden dabei die von Ihnen im Formular angegebenen Daten übermittelt, soweit sie Bestandteil der Nachricht sind – also Name, Kontaktangabe, Thema und Ihre Nachricht. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b bzw. f DSGVO zur Bearbeitung Ihrer Anfrage. Die Übermittlung in die USA wird auf die Standardvertragsklauseln der EU-Kommission gestützt.",
          "Weitere Informationen: https://resend.com/legal/privacy-policy"
        ]
      },
      {
        "h": "6. Schriftarten",
        "p": [
          "Diese Seite nutzt zur einheitlichen Darstellung die Schriftarten „Bricolage Grotesque“ und „Instrument Sans“. Beide sind lokal auf unserem Server installiert und werden von dort ausgeliefert. Eine Verbindung zu Servern von Google oder anderen Anbietern findet dabei nicht statt."
        ]
      },
      {
        "h": "7. Keine Analyse-Werkzeuge, keine eingebetteten Karten",
        "p": [
          "Diese Website verwendet weder Google Analytics noch vergleichbare Analysedienste, kein Facebook-Pixel und keine sonstigen Werkzeuge zur Reichweitenmessung oder Werbung. Es sind auch keine Karten-, Video- oder Social-Media-Dienste eingebettet, die beim Seitenaufruf Daten an Dritte übertragen würden. Links zu sozialen Netzwerken sind einfache Verweise und stellen erst beim Anklicken eine Verbindung her."
        ]
      },
      {
        "h": "Fotos aus dem Training",
        "p": [
          "Aufnahmen aus Kursen und Einzeltrainings werden nur mit vorheriger Einwilligung der abgebildeten Personen veröffentlicht. Eine erteilte Einwilligung kann jederzeit mit Wirkung für die Zukunft widerrufen werden."
        ]
      }
    ]
  },
  "agb": {
    "title": "AGB",
    "lead": "Allgemeine Geschäftsbedingungen von {{betrieb}}",
    "blocks": [
      {
        "h": "1. Teilnahme auf eigene Gefahr",
        "p": [
          "Die Teilnahme am Angebot von {{betrieb}} erfolgt auf eigene Gefahr. {{betrieb}} haftet nicht für Schäden, die durch den Umgang mit den Hunden oder durch diese entstehen. Auf jeglichen Haftungsanspruch gegen {{betrieb}} und die Trainer bzw. Referenten wird bei der Teilnahme am Programm verzichtet."
        ]
      },
      {
        "h": "2. Impfschutz und Versicherung",
        "p": [
          "Teilnehmende Hunde müssen über einen gültigen Impfschutz (Staupe, Hepatitis, Leptospirose und Tollwut) verfügen und es muss eine gültige Hundehaftpflichtversicherung für den teilnehmenden Hund abgeschlossen sein. Auf Verlangen sind die nötigen Unterlagen vorzulegen. Die Teilnahme an den Seminaren mit Hund kann nur mit vorheriger Absprache stattfinden."
        ]
      },
      {
        "h": "3. Kurs- und Seminargebühr",
        "p": [
          "Die Kurs- und Seminargebühr wird mit der Bestätigung der Anmeldung fällig. Du kannst den Betrag entweder in bar begleichen oder auf folgendes Konto überweisen:",
          "Volksbank Plochingen e.G. · IBAN: DE66 6119 1310 0857 4260 01 · BIC: GENODES1VBP",
          "Da die Teilnehmerzahl beim Angebot von {{betrieb}} beschränkt ist, entscheidet der Eingang der Kurs- bzw. Seminargebühr über die Teilnahme. Der Rechnungsbetrag des Einzeltrainings wird nach Erhalt der Rechnung fällig."
        ]
      },
      {
        "h": "4. Stornierung",
        "p": [
          "Nicht in Anspruch genommene Seminare und Kurse werden nicht erstattet. Bei Stornierung eines Seminars sind folgende Stornogebühren zu entrichten:",
          "Stornierung bis zu 30 Tagen vor Veranstaltungsbeginn: Es wird die gesamte Teilnahmegebühr fällig.",
          "Stornierung bis zu 45 Tagen vor Veranstaltungsbeginn: Es werden 50 % der Teilnahmegebühr fällig.",
          "Stornierung bis zu 60 Tagen vor Veranstaltungsbeginn: Wir zahlen die bereits gezahlten Teilnahmegebühren in voller Höhe abzüglich einer Bearbeitungsgebühr von 15,00 € zurück.",
          "Selbstverständlich besteht die Möglichkeit, ohne weitere Zusatzgebühren einen Ersatzteilnehmer für die gebuchte Veranstaltung anzumelden."
        ]
      },
      {
        "h": "5. Rücktritt und Ausfall",
        "p": [
          "{{betrieb}} hält sich das Recht vor, ohne Einhaltung einer Frist vom Vertrag zurückzutreten, wenn der Teilnehmer sich vertragswidrig verhält.",
          "Sollte eine Veranstaltung aufgrund zu geringer Teilnehmerzahl, Wetterverhältnissen, Krankheit oder anderen Gründen abgesagt werden müssen, wird zunächst – wenn möglich – ein Ersatztermin gestellt. Kann dieser vom Teilnehmer nicht wahrgenommen werden, wird die Veranstaltungsgebühr zurückerstattet. Weitere Unkosten des Teilnehmers, die im Zusammenhang mit der Seminarbuchung und -stornierung entstehen, sind vom Teilnehmer selbst zu tragen."
        ]
      },
      {
        "h": "6. Versäumte Stunden",
        "p": [
          "Vom Teilnehmer nicht wahrgenommene Stunden eines Kurses oder einer Veranstaltung werden nicht erstattet."
        ]
      },
      {
        "h": "7. Gerichtsstand",
        "p": [
          "Gerichtsstand ist der Sitz von {{betrieb}}."
        ]
      }
    ]
  }
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
