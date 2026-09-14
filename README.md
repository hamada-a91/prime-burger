# Prime Burger Leipzig

Website und Verwaltung für das Restaurant Prime Burger (Große Fleischergasse 4, Leipzig).

- **Website** (DE/EN): Startseite, Über uns, Speisekarte, Galerie, Reservieren, Impressum, Datenschutz
- **Admin** (`/admin`): Reservierungsanfragen, Speisekarte (Kategorien, Gerichte, Preise, Allergene), Galerie (Upload, Startseiten-Highlights), Einstellungen (Kontakt, Öffnungszeiten, Lieferservice, Texte, Social)
- **Reservierung**: Anfrage per Formular, E-Mail ans Restaurant + Eingangsbestätigung an den Gast, Status-Pflege im Admin

## Stack

- Frontend: React 19, Vite 7, TypeScript, Tailwind CSS 4, shadcn/Radix, TanStack Query, react-hook-form + zod
- Backend: Laravel 12, Sanctum (Session-Auth), Intervention Image (WebP-Pipeline), SQLite (lokal) / MySQL (Produktion)
- Tests: Vitest (Unit), PHPUnit (Backend), Playwright (E2E)

## Lokal starten

Voraussetzungen: Node 22, PHP 8.3 mit `gd`, `sqlite3`, `pdo_sqlite`, Composer.

```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed      # legt Admin, Einstellungen, Speisekarte und Galerie (aus material/) an
php artisan storage:link
php artisan serve --port=8000
```

```bash
# Frontend (im Projektroot)
npm install
cp .env.example .env            # VITE_API_URL=http://localhost:8000/api
npm run dev
```

- Website: http://localhost:5173 (leitet auf `/de` oder `/en` weiter)
- Admin: http://localhost:5173/admin, Zugang aus `backend/.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`, Standard `admin@example.com` / `password`)
- Mails landen lokal in `backend/storage/logs/laravel.log` (`MAIL_MAILER=log`). Für echten Versand SMTP in `backend/.env` eintragen und `MAIL_RESERVATION_ADDRESS` setzen.

## Tests

```bash
npm run lint && npm run test:run          # Frontend
cd backend && php artisan test            # Backend
npm run test:e2e                          # Playwright (Backend muss auf :8000 laufen)
```

## Dokumentation

Ausführliche Anleitungen liegen in [docs/](docs/README.md): Setup und Fehlerbehebung, Admin-Handbuch, Architektur, API, Deployment.

## Inhalte pflegen

Alles außer Impressum/Datenschutz wird im Admin gepflegt. Rechtstexte und Firmendaten liegen in `src/config/website.config.ts` (Platzhalter in eckigen Klammern vor dem Livegang ersetzen). UI-Texte in `src/i18n/de.ts` und `src/i18n/en.ts`, Design-Regeln in `design-system/prime-burger/MASTER.md`.

Die Originalfotos, das Logo und die Texte der alten Website liegen in `material/`.

## Produktion

`docker-compose.prod.yml` baut Frontend (nginx), API (php-fpm) und MySQL. Ablauf siehe `deploy.sh`:

```bash
cp backend/.env.example backend/.env      # DB_*, MAIL_*, APP_URL, FRONTEND_URL, SANCTUM_STATEFUL_DOMAINS, ADMIN_* setzen
./deploy.sh
```

Beim ersten Deploy zusätzlich `docker compose -f docker-compose.prod.yml exec api php artisan db:seed`.
