# Lokale Einrichtung

## Voraussetzungen

- Node.js 22 (npm)
- PHP 8.3 mit den Erweiterungen `gd`, `sqlite3`, `pdo_sqlite`, `mbstring`, `xml`
- Composer 2
- (Nur Produktion) Docker + Docker Compose

Prüfen:

```bash
node -v && php -v && php -m | grep -E "gd|sqlite" && composer --version
```

## 1. Backend (Laravel, SQLite)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
php artisan serve --port=8000
```

`migrate --seed` legt an:

- Admin-Benutzer (`ADMIN_EMAIL` / `ADMIN_PASSWORD` aus `.env`, Standard `admin@example.com` / `password`)
- Einstellungen (Kontakt, Öffnungszeiten, Lieferplattformen, Texte)
- die komplette Speisekarte (11 Kategorien, 70 Gerichte)
- die Galerie: alle Fotos aus `material/gallery/` werden nach `storage/app/public/gallery/` als WebP (max. 1920 px) plus Thumbnail (480 px) importiert

Die Seeder laufen nur, wenn die jeweilige Tabelle leer ist. Änderungen im Admin werden bei erneutem `db:seed` nicht überschrieben. Alles zurücksetzen: `php artisan migrate:fresh --seed`.

## 2. Frontend (Vite)

Im Projektroot:

```bash
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:8000/api
npm run dev                 # http://localhost:5173
```

- `/` leitet auf `/de` oder `/en` (Browsersprache, gemerkte Wahl).
- Admin: http://localhost:5173/admin

## Ports

| Dienst | Port | Hinweis |
|---|---|---|
| Vite | 5173 | `strictPort: true`: Ist der Port belegt, bricht Vite ab, statt still auf 5174 auszuweichen. |
| Laravel | 8000 | Ist 8000 belegt, nimmt `php artisan serve` automatisch 8001. Dann `VITE_API_URL` anpassen. |

Belegte Ports finden und beenden (WSL/Linux):

```bash
ss -ltnp | grep -E ":5173|:8000"
kill <PID>
```

## E-Mails lokal

`MAIL_MAILER=log`: alle Mails landen in `backend/storage/logs/laravel.log`. Für echten Versand SMTP-Daten in `backend/.env` eintragen (siehe [DEPLOYMENT.md](DEPLOYMENT.md)).

## Tests

```bash
npm run lint                    # ESLint
npm run test:run                # Vitest (Unit)
cd backend && php artisan test  # PHPUnit (Feature-Tests, SQLite in-memory)
npm run test:e2e                # Playwright, Backend muss auf :8000 laufen
```

Beim ersten Playwright-Lauf: `npx playwright install chromium`.

## Typische Fehler

**CORS-Fehler im Browser (`blocked by CORS policy`)**
Das Frontend läuft auf einem Port, den das Backend nicht kennt (z. B. 5175, weil 5173 belegt war). Lokal (`APP_ENV=local`) erlaubt `backend/config/cors.php` inzwischen jeden `localhost`-Port. Wenn der Fehler trotzdem auftritt: `php artisan config:clear` und prüfen, ob `VITE_API_URL` auf den laufenden Backend-Port zeigt. Ein CORS-Fehler erscheint auch, wenn das Backend gar nicht läuft oder mit 500 antwortet: `backend/storage/logs/laravel.log` prüfen.

**Admin-Login schlägt fehl (419 / 401)**
`SANCTUM_STATEFUL_DOMAINS` in `backend/.env` muss den Frontend-Host samt Port enthalten (`localhost:5173`). Danach `php artisan config:clear`.

**Bilder fehlen (404 unter /storage/...)**
`php artisan storage:link` ausführen und `APP_URL` auf den Backend-Host setzen (`http://localhost:8000`), sonst zeigen die Bild-URLs auf den falschen Port.

**Galerie leer nach Seed**
Der Ordner `material/gallery/` muss vorhanden sein (liegt im Repo). Der Import braucht etwas RAM; der Seeder setzt `memory_limit` selbst auf 1 GB.
