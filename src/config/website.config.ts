import type { WebsiteConfig } from './website.config.schema';

const contact = {
    email: 'Kontakt@prime-burger.de',
    phone: '0341 30853717',
    street: 'Große Fleischergasse 4',
    zip: '04109',
    city: 'Leipzig',
};

// Platzhalter in eckigen Klammern bitte vor dem Livegang ersetzen.
const legal = {
    owner: 'Prime Burger Leipzig',
    legalForm: '[Rechtsform, z. B. GmbH oder Einzelunternehmen]',
    representative: '[Name der vertretungsberechtigten Person]',
    registerNumber: '[HRB-Nummer, falls vorhanden]',
    registerCourt: '[Registergericht, z. B. Amtsgericht Leipzig]',
    vatId: '[USt-IdNr.]',
    lastUpdated: '2026-09-01',
};

export const websiteConfig: WebsiteConfig = {
    site: {
        name: 'Prime Burger Leipzig',
        url: 'https://prime-burger.de',
        logo: '/assets/logo.png',
        favicon: '/assets/favicon-32.png',
        ogImage: '/assets/og-image.jpg',
        contact,
        themeColor: '#0e0e0e',
    },
    legal: {
        ...legal,
        imprint: {
            de: [
                {
                    heading: 'Angaben gemäß § 5 DDG',
                    content: `<p>${legal.owner}<br>${legal.legalForm}<br>${contact.street}<br>${contact.zip} ${contact.city}</p><p>Vertreten durch: ${legal.representative}</p>`,
                },
                {
                    heading: 'Kontakt',
                    content: `<p>Telefon: ${contact.phone}<br>E-Mail: ${contact.email}</p>`,
                },
                {
                    heading: 'Registereintrag und Umsatzsteuer',
                    content: `<p>Registergericht: ${legal.registerCourt}<br>Registernummer: ${legal.registerNumber}<br>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: ${legal.vatId}</p>`,
                },
                {
                    heading: 'Verbraucherstreitbeilegung',
                    content: '<p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>',
                },
                {
                    heading: 'Haftung für Inhalte',
                    content: '<p>Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Preise und Öffnungszeiten können sich ändern.</p>',
                },
            ],
            en: [
                {
                    heading: 'Information pursuant to § 5 DDG',
                    content: `<p>${legal.owner}<br>${legal.legalForm}<br>${contact.street}<br>${contact.zip} ${contact.city}, Germany</p><p>Represented by: ${legal.representative}</p>`,
                },
                {
                    heading: 'Contact',
                    content: `<p>Phone: ${contact.phone}<br>Email: ${contact.email}</p>`,
                },
                {
                    heading: 'Register entry and VAT',
                    content: `<p>Register court: ${legal.registerCourt}<br>Register number: ${legal.registerNumber}<br>VAT ID pursuant to § 27a UStG: ${legal.vatId}</p>`,
                },
                {
                    heading: 'Consumer dispute resolution',
                    content: '<p>We are neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board.</p>',
                },
                {
                    heading: 'Liability for content',
                    content: '<p>The content of these pages was created with great care. We cannot guarantee that the content is accurate, complete or up to date. Prices and opening hours are subject to change.</p>',
                },
            ],
        },
        privacy: {
            de: [
                {
                    heading: '1. Verantwortlicher',
                    content: `<p>${legal.owner}, ${contact.street}, ${contact.zip} ${contact.city}<br>E-Mail: ${contact.email}, Telefon: ${contact.phone}</p>`,
                },
                {
                    heading: '2. Hosting und Server-Logfiles',
                    content: '<p>Beim Aufruf dieser Website verarbeitet der Server automatisch technische Daten (IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browsertyp). Diese Daten dienen ausschließlich dem sicheren Betrieb der Website (Art. 6 Abs. 1 lit. f DSGVO) und werden nach kurzer Zeit gelöscht.</p>',
                },
                {
                    heading: '3. Reservierungsanfragen',
                    content: '<p>Wenn Sie das Reservierungsformular nutzen, verarbeiten wir Name, E-Mail-Adresse, Telefonnummer, Datum, Uhrzeit, Gästezahl und Ihre optionalen Wünsche, um Ihre Anfrage zu bearbeiten und zu bestätigen (Art. 6 Abs. 1 lit. b DSGVO). Sie erhalten eine automatische Eingangsbestätigung per E-Mail. Die Daten werden nach Abschluss der Reservierung und Ablauf gesetzlicher Aufbewahrungsfristen gelöscht.</p>',
                },
                {
                    heading: '4. Cookies',
                    content: '<p>Die öffentliche Website setzt keine Tracking- oder Marketing-Cookies. Ihre Sprachwahl wird lokal in Ihrem Browser gespeichert (Local Storage) und nicht an uns übertragen.</p>',
                },
                {
                    heading: '5. Externe Links',
                    content: '<p>Links zu Lieferdiensten (Lieferando, Uber Eats, Wolt) und Kartendiensten führen auf externe Websites. Für deren Datenverarbeitung gelten die Datenschutzhinweise der jeweiligen Anbieter.</p>',
                },
                {
                    heading: '6. Ihre Rechte',
                    content: '<p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Wenden Sie sich dazu an die oben genannte Kontaktadresse. Außerdem haben Sie das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.</p>',
                },
            ],
            en: [
                {
                    heading: '1. Controller',
                    content: `<p>${legal.owner}, ${contact.street}, ${contact.zip} ${contact.city}, Germany<br>Email: ${contact.email}, Phone: ${contact.phone}</p>`,
                },
                {
                    heading: '2. Hosting and server logs',
                    content: '<p>When you visit this website the server automatically processes technical data (IP address, date and time, requested page, browser type). This data is used solely to operate the website securely (Art. 6 (1) (f) GDPR) and is deleted after a short period.</p>',
                },
                {
                    heading: '3. Reservation requests',
                    content: '<p>When you use the reservation form we process your name, email address, phone number, date, time, number of guests and optional requests to handle and confirm your booking (Art. 6 (1) (b) GDPR). You receive an automatic acknowledgement by email. The data is deleted once the reservation is completed and statutory retention periods have expired.</p>',
                },
                {
                    heading: '4. Cookies',
                    content: '<p>The public website does not set tracking or marketing cookies. Your language choice is stored locally in your browser (local storage) and is not transmitted to us.</p>',
                },
                {
                    heading: '5. External links',
                    content: '<p>Links to delivery services (Lieferando, Uber Eats, Wolt) and map services lead to external websites. Their own privacy policies apply to the processing of your data there.</p>',
                },
                {
                    heading: '6. Your rights',
                    content: '<p>You have the right to access, rectification, erasure, restriction of processing, data portability and objection. Please contact the address above. You also have the right to lodge a complaint with a data protection supervisory authority.</p>',
                },
            ],
        },
    },
};
