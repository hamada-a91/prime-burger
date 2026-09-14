# Architektur

## Überblick

```
Browser ──► Vite/React SPA (src/)  ──HTTP/JSON──►  Laravel API (backend/)  ──► SQLite / MySQL
                                                        │
                                                        ├─► storage/app/public/gallery (WebP + Thumbs)
                                                        └─► Mail (Restaurant + Gast)
```

Zwei getrennte Anwendungen im selben Repo:

- `src/`: React 19 + TypeScript, gebaut mit Vite 7, gestylt mit Tailwind CSS 4 (Tokens in `src/styles/globals.css`).
- `backend/`: Laravel 12, nur JSON-API unter `/api`. Auth für den Admin per Sanctum-Session (HttpOnly-Cookie, kein Token im LocalStorage).

## Frontend-Struktur

```
src/
├── App.tsx                 Routing: / → Sprache, /:locale/<slug>, /admin/*
├── i18n/                   de.ts, en.ts (typisiert), routes.ts (Slugs je Sprache), index.ts (useT, usePick, formatPrice)
├── config/website.config.ts  Statische Site-Daten, Impressum/Datenschutz (DE/EN)
├── hooks/
│   ├── api/                TanStack-Query-Hooks je Ressource (useMenu, useGallery, useReservations, useSettings, useStats)
│   ├── useAuth.tsx         Login/Logout/Session
│   └── useSiteInfo.ts      Kontaktdaten aus Settings mit Config-Fallback
├── lib/api.ts              Fetch-Client (CSRF, X-Locale-Header, Fehlerklasse)
├── lib/opening-hours.ts    Öffnungsstatus, Gruppierung, tel:-Links
├── components/
│   ├── layout/             Header, MobileNav, MobileBar, Footer, LocaleLayout
│   ├── site/               Wiederverwendbare Sektionen (PageHero, SectionHeading, Lightbox, Reveal, …)
│   ├── admin/              AdminLayout, TranslatedInput, StatusBadge, ConfirmDialog
│   ├── seo/                SEOHead (hreflang, OG), RestaurantJsonLd
│   └── ui/                 shadcn-Basis (Button, Input, Dialog, Switch, …)
├── pages/                  Home, About, Menu, Gallery, Reservation, Privacy, Imprint, NotFound
└── pages/admin/            AdminLogin, Dashboard, Reservations, MenuAdmin, GalleryAdmin, Settings
```

### Routing und Sprachen

- Jede öffentliche Seite existiert unter `/de/<slug-de>` und `/en/<slug-en>`; die Zuordnung steht in `src/i18n/routes.ts` (`ROUTE_SLUGS`). Neue Seite: Key + Slugs dort ergänzen, Komponente in `App.tsx` unter `PAGES` registrieren.
- `LocaleLayout` validiert `:locale`, setzt `<html lang>`, den `X-Locale`-Header des API-Clients und merkt die Sprache im LocalStorage. `/` leitet über `detectLocale()` weiter.
- UI-Texte: `useT()('reservation.form.name')`. `en.ts` ist als `typeof de` typisiert, fehlende Keys sind Compile-Fehler; ein Vitest prüft zusätzlich die Key-Parität.
- Inhalte aus der Datenbank sind JSON-Objekte `{ de, en }`; `usePick()` wählt die aktuelle Sprache mit Fallback auf Deutsch.

### Theme

Die Website ist immer dunkel: `LocaleLayout` setzt `.theme-dark` auf den Wurzelknoten, dort sind die Farb-Tokens definiert. Der Admin nutzt die helle `:root`-Palette. Details und Regeln in `design-system/prime-burger/MASTER.md`.

## Backend-Struktur

```
backend/
├── routes/api.php                    alle Endpunkte (siehe API.md)
├── app/Http/Controllers/Api/         öffentlich: Menu, Gallery, Reservation, PublicSettings
├── app/Http/Controllers/Admin/       auth:sanctum: MenuCategory, MenuItem, Gallery, Reservation, Settings, Stats
├── app/Http/Middleware/SetLocale.php X-Locale-Header → app()->setLocale()
├── app/Models/                       MenuCategory, MenuItem, GalleryImage, Reservation, Setting, User
├── app/Models/Concerns/HasTranslations.php  translate('name', 'en')
├── app/Support/ImageProcessor.php    Upload → WebP (max 1920 px) + Thumb (480 px)
├── app/Mail/                         ReservationRequestMail (Restaurant), ReservationReceivedMail (Gast)
├── resources/views/emails/           Markdown-Mailtemplates
├── lang/de, lang/en                  messages.php (Mail- und API-Texte)
├── database/migrations/              menu_categories, menu_items, gallery_images, reservations, settings
└── database/seeders/                 Admin, Settings, Menu, Gallery
```

### Datenmodell

| Tabelle | Wichtige Felder |
|---|---|
| `menu_categories` | `name` json, `description` json, `sort_order`, `is_active` |
| `menu_items` | `category_id`, `name` json, `description` json, `price` decimal nullable, `variants` json `[{label:{de,en}, price}]`, `price_note` json, `allergens` json `["A","G"]`, `tags` json `["vegan","spicy","signature","vegetarian","new"]`, `is_available`, `sort_order` |
| `gallery_images` | `path`, `thumb_path`, `caption` json, `category` (burger/food/ambience/drinks/misc), `is_featured`, `featured_title` json, `featured_subtitle` json, `sort_order`, `width`, `height` |
| `reservations` | `name`, `email`, `phone`, `guests`, `date`, `time`, `notes`, `locale`, `status` (new/confirmed/declined/archived) |
| `settings` | `key` unique, `value` json. Öffentliche Keys in `Setting::PUBLIC_KEYS`, nur-Admin-Keys in `PRIVATE_KEYS` (`reservation_email`) |

### Reservierungsablauf

1. `POST /api/reservations` validiert (Datum ≥ heute, Uhrzeit aus `Reservation::TIME_SLOTS`, Honeypot-Feld `website` muss leer sein), Rate-Limit 3/min pro IP.
2. Datensatz mit `locale` des Gastes wird gespeichert.
3. `ReservationRequestMail` an `MAIL_RESERVATION_ADDRESS` bzw. Setting `reservation_email` bzw. `contact_email`; `ReservationReceivedMail` an den Gast in dessen Sprache. Beide sind `ShouldQueue`; mit `QUEUE_CONNECTION=sync` werden sie sofort versendet.
4. Admin sieht die Anfrage, bestätigt manuell und setzt den Status.

### Bilder

Uploads (Admin) und der Seeder laufen durch `ImageProcessor::store()`. Ergebnis liegt auf der `public`-Disk (`storage/app/public/gallery`), erreichbar über `storage:link` unter `/storage/gallery/...`. `GalleryImage` hängt `url` und `thumb_url` an jede API-Antwort. Statische Assets der Website (Logo, Hero, Badges, OG-Bild) liegen in `public/assets/` und sind unabhängig von der Galerie.

## Tests

- `backend/tests/Feature`: Reservierung (Mails, Validierung, Honeypot, Admin-Status), Menü (Sichtbarkeit, Varianten), Galerie (Filter, Upload/Update/Delete), Settings.
- `src/**/*.test.ts`: Öffnungszeiten-Logik, i18n-Parität und Routen.
- `e2e/`: Playwright, öffentliche Seiten und Admin-Login gegen laufendes Backend.
- CI (`.github/workflows/ci.yml`): Frontend-Lint/Tests/Build, Backend-Tests, E2E mit gestartetem Backend.
