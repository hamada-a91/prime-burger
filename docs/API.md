# API

Basis-URL: `http://localhost:8000/api` (lokal) bzw. `/api` (Produktion hinter nginx). Alle Antworten sind JSON. Header `X-Locale: de|en` steuert Sprache von Validierungsfehlern und Gast-Mails.

Übersetzbare Felder haben die Form `{ "de": "…", "en": "…" }`.

## Öffentlich

### `GET /settings`

Öffentliche Einstellungen (`Setting::PUBLIC_KEYS`).

```json
{
  "site_name": "Prime Burger Leipzig",
  "contact_phone": "0341 30853717",
  "contact_address": { "street": "Große Fleischergasse 4", "zip": "04109", "city": "Leipzig" },
  "opening_hours": { "mon": { "open": "11:30", "close": "22:00", "closed": false }, "…": {} },
  "delivery_platforms": [{ "key": "lieferando", "name": "Lieferando", "url": "…", "eta": "30-45 Min.", "badge": { "de": "Beliebt", "en": "Popular" } }],
  "hero_headline": { "de": "…", "en": "…" }
}
```

### `GET /menu`

Aktive Kategorien mit verfügbaren Gerichten, sortiert.

```json
[
  {
    "id": 2,
    "name": { "de": "Beef Burger", "en": "Beef Burgers" },
    "items": [
      { "id": 12, "name": { "de": "BBQ Bacon" }, "price": "13.90", "allergens": ["N","A","C","G","M","L"], "tags": [], "variants": null }
    ]
  }
]
```

### `GET /gallery?category=burger&featured=1`

Bilder mit `url`, `thumb_url`, `caption`, `category`, `is_featured`, `featured_title`, `featured_subtitle`, `width`, `height`. Beide Query-Parameter optional.

### `POST /reservations`

```json
{ "name": "Lena Hartmann", "email": "lena@example.com", "phone": "0341 123456", "guests": 4, "date": "2026-09-20", "time": "19:00", "notes": "Fensterplatz" }
```

Antwort `201 { "success": true, "message": "…" }`. Validierungsfehler `422 { "message", "errors": { "date": ["…"] } }`. Uhrzeit muss einer der Slots 11:30 bis 13:30 / 17:00 bis 21:00 (halbstündlich) sein. Rate-Limit 3 Anfragen/Minute. Feld `website` ist ein Honeypot und muss leer bleiben.

### `POST /login`

`{ "email", "password", "remember" }` → `200 { "user" }`. Vorher `GET /sanctum/csrf-cookie` (macht `src/lib/api.ts` automatisch). Rate-Limit 5/min.

## Admin (Session-Cookie, `auth:sanctum`)

| Methode | Pfad | Beschreibung |
|---|---|---|
| POST | `/logout` | Session beenden |
| GET | `/user` | Angemeldeter Benutzer |
| GET | `/admin/stats` | Dashboard-Zahlen, `by_day` (30 Tage), `latest` (5 Anfragen) |
| GET | `/admin/settings` | Alle editierbaren Keys (inkl. `reservation_email`) |
| POST | `/admin/settings` | Beliebige Teilmenge der Keys speichern |
| GET/POST | `/admin/menu-categories` | Liste (mit `items_count`) / anlegen |
| PUT/DELETE | `/admin/menu-categories/{id}` | ändern / löschen (inkl. Gerichte) |
| POST | `/admin/menu-categories/reorder` | `{ "ids": [3,1,2] }` |
| GET | `/admin/menu-items?category_id=` | Gerichte (alle, auch ausgeblendete) |
| POST / PUT / DELETE | `/admin/menu-items[/{id}]` | Felder wie in `menu_items`; `variants` als Array oder `null` |
| POST | `/admin/menu-items/reorder` | `{ "ids": [] }` |
| GET | `/admin/gallery?category=` | Alle Bilder |
| POST | `/admin/gallery` | multipart: `images[]` (1 bis 20 Dateien, max. 15 MB), `category` |
| PUT | `/admin/gallery/{id}` | `caption`, `category`, `is_featured`, `featured_title`, `featured_subtitle`, `sort_order` |
| DELETE | `/admin/gallery/{id}` | Löscht Datensatz und Dateien |
| POST | `/admin/gallery/reorder` | `{ "ids": [] }` |
| GET | `/admin/reservations?status=&date=&search=&page=` | Paginiert (20/Seite) |
| GET | `/admin/reservations/{id}` | Detail |
| PATCH | `/admin/reservations/{id}/status` | `{ "status": "confirmed" }` |
| DELETE | `/admin/reservations/{id}` | Löschen |

Validierungsregeln stehen in den jeweiligen Controllern unter `backend/app/Http/Controllers/Admin/`.
