# Admin-Handbuch

Anmeldung unter `https://<domain>/admin` mit E-Mail und Passwort. Alle Änderungen sind sofort auf der Website sichtbar.

## Dashboard

Zeigt neue Reservierungsanfragen, Anfragen der Woche, Anzahl der Gerichte und Galeriebilder sowie die fünf neuesten Anfragen. Die Zahl im roten Kreis neben „Reservierungen“ ist die Anzahl der noch nicht bearbeiteten Anfragen.

## Reservierungen

Jede Anfrage über das Website-Formular erscheint hier und geht gleichzeitig per E-Mail an die Adresse aus Einstellungen → Kontakt → „Empfänger für Reservierungsanfragen“. Der Gast bekommt automatisch eine Eingangsbestätigung („wir melden uns in Kürze“), aber **keine** verbindliche Zusage.

Ablauf:

1. Anfrage anklicken. Im Dialog stehen Termin, Personenzahl, Telefon, E-Mail und Wünsche.
2. Verfügbarkeit prüfen und den Gast per E-Mail (Link öffnet das Mailprogramm mit Betreff) oder Telefon bestätigen bzw. absagen.
3. Status setzen: **Bestätigt**, **Abgelehnt** oder **Archiviert**. Der Status dient nur der internen Übersicht.

Filter oben: Status, Datum, Suche nach Name/E-Mail/Telefon. Löschen entfernt die Anfrage endgültig.

## Speisekarte

Links die Kategorien, rechts die Gerichte der ausgewählten Kategorie.

**Kategorien**: „Neu“ legt eine Kategorie an (Name Deutsch ist Pflicht, Englisch optional). Über die Pfeile wird die Reihenfolge auf der Website geändert. „Auf der Website anzeigen“ aus = Kategorie samt Gerichten ausgeblendet. Löschen entfernt auch alle Gerichte darin.

**Gerichte**: „Gericht“ öffnet den Editor.

- Name und Beschreibung jeweils Deutsch/Englisch. Fehlt Englisch, wird Deutsch angezeigt.
- Preis: entweder **ein Preis** oder **Varianten** (z. B. 0,2 l / 0,4 l mit eigenem Preis). Preishinweis für Aufpreise („Mit Süßkartoffelpommes +2,30 €“).
- Allergene: Buchstaben A bis R anklicken; die Legende steht automatisch unter der Speisekarte.
- Kennzeichnung: Vegan, Vegetarisch, Scharf (Filter auf der Website), Signature (rotes Badge), Neu.
- Der Schalter in der Liste blendet ein Gericht kurzfristig aus (z. B. ausverkauft), ohne es zu löschen.

Die Speisekarte hat bewusst keine Fotos; Bilder gehören in die Galerie.

Der aktuelle Stand der importierten Karte liegt zum Gegenlesen in [material/speisekarte-2026-09.md](../material/speisekarte-2026-09.md).

## Galerie

**Hochladen**: Bilder in das gestrichelte Feld ziehen oder „Auswählen“. Mehrere Dateien gleichzeitig möglich (JPG, PNG, WebP, max. 15 MB). Die Kategorie neben dem Button gilt für alle hochgeladenen Bilder. Bilder werden automatisch verkleinert und als WebP gespeichert.

**Pro Bild** (Symbole erscheinen beim Überfahren):

- Pfeile: Reihenfolge ändern
- Stern: auf der **Startseite** unter „Unsere Signature-Burger“ zeigen. Das erste Bild mit Stern wird groß dargestellt. Für Startseiten-Bilder im Stift-Dialog Titel und Untertitel (DE/EN) eintragen, z. B. „The Real Big Prime“ / „Unser Signature Burger“.
- Stift: Bildunterschrift (DE/EN) und Kategorie ändern
- Papierkorb: Bild endgültig löschen

Kategorien: Burger, Food, Ambiente, Drinks, Weitere. Sie erscheinen als Filter auf der Galerieseite.

## Einstellungen

Oben rechts „Speichern“ nicht vergessen; die Reiter teilen nur die Ansicht.

- **Kontakt**: Name, Telefon, öffentliche E-Mail, Empfänger für Reservierungen, Adresse, Google-Maps-Link. Erscheint in Footer, Startseite, Reservierungsseite und Impressum-Kontakt.
- **Öffnungszeiten**: pro Wochentag Öffnen/Schließen oder „Geschlossen“. Daraus berechnet die Website „Jetzt geöffnet bis 22:00“ und die gruppierte Anzeige (Mo - Do usw.).
- **Lieferservice**: Links zu Lieferando, Uber Eats und Wolt, angezeigte Lieferzeit und Badge (Beliebt/Schnell/Neu).
- **Texte**: Hero-Überschrift und -Unterzeile der Startseite, „Unsere Geschichte“, „Unsere Philosophie“ (Startseite und Über uns), Hinweis auf der Reservierungsseite. Immer Deutsch und Englisch.
- **Social**: Instagram, Facebook, Tripadvisor. Leere Felder werden nicht angezeigt.

## Nicht im Admin

Impressum, Datenschutz und die festen UI-Texte werden vom Entwickler in `src/config/website.config.ts` bzw. `src/i18n/` gepflegt.
