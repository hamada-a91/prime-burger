# Deployment (Produktion)

`docker-compose.prod.yml` startet drei Container: `frontend` (nginx mit gebautem SPA, Proxy `/api` und `/storage` zum Backend), `api` (php-fpm) und `mysql`. `deploy.sh` zieht den Code, baut die Images, migriert und räumt auf.

## Erstinstallation auf dem Server

```bash
git clone git@github.com:hamada-a91/prime-burger.git && cd prime-burger
cp backend/.env.example backend/.env
```

In `backend/.env` setzen:

```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://prime-burger.de
FRONTEND_URL=https://prime-burger.de
SANCTUM_STATEFUL_DOMAINS=prime-burger.de
SESSION_SECURE_COOKIE=true

DB_CONNECTION=mysql
DB_HOST=mysql
DB_DATABASE=prime_burger
DB_USERNAME=prime
DB_PASSWORD=<sicheres Passwort>
DB_ROOT_PASSWORD=<sicheres Passwort>

MAIL_MAILER=smtp
MAIL_HOST=<smtp-host>
MAIL_PORT=587
MAIL_USERNAME=<benutzer>
MAIL_PASSWORD=<passwort>
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@prime-burger.de
MAIL_FROM_NAME="Prime Burger Leipzig"
MAIL_RESERVATION_ADDRESS=Kontakt@prime-burger.de

ADMIN_NAME=Prime Burger
ADMIN_EMAIL=<admin-mail>
ADMIN_PASSWORD=<sicheres Passwort>
```

Dann im Projektroot eine `.env` für Compose (`COMPOSE_PROJECT_NAME=prime-burger`, `FRONTEND_PORT=8080`, `DB_*` wie oben) und:

```bash
./deploy.sh
docker compose -f docker-compose.prod.yml exec api php artisan key:generate --force
docker compose -f docker-compose.prod.yml exec api php artisan db:seed --force
```

Der Seed importiert Speisekarte, Einstellungen und die Galeriefotos aus `material/gallery/` (Ordner muss im Deployment vorhanden sein, liegt im Repo).

Ein Reverse-Proxy (Caddy, Traefik, nginx) mit TLS terminiert auf `127.0.0.1:8080`.

## Updates

```bash
./deploy.sh
```

führt `git pull`, Build, `migrate --force`, `storage:link` und `optimize` aus. Seeder laufen nicht erneut, Inhalte bleiben erhalten.

## Backups

- Datenbank: `docker compose -f docker-compose.prod.yml exec mysql mysqldump -u root -p"$DB_ROOT_PASSWORD" prime_burger > backup.sql`
- Bilder: das Volume `storage_public` (`docker volume inspect prime-burger_storage_public`) oder `docker compose ... exec api tar czf - storage/app/public > storage.tgz`

## E-Mail-Versand

Beide Mails (`ReservationRequestMail`, `ReservationReceivedMail`) sind queue-fähig. Mit `QUEUE_CONNECTION=sync` werden sie im Request versendet (einfach, leicht verzögert). Für einen Queue-Worker: `QUEUE_CONNECTION=database`, dann `php artisan queue:work` als zusätzlichen Container/Prozess betreiben.

Absender-Domain mit SPF/DKIM beim Mail-Provider einrichten, sonst landen Gast-Mails im Spam.

## Checkliste vor dem Livegang

- [ ] Impressum-Platzhalter in `src/config/website.config.ts` ersetzt (Rechtsform, Vertreter, Register, USt-ID)
- [ ] `site.url` in `website.config.ts` = echte Domain (Sitemap, hreflang, OG-URLs)
- [ ] Lieferplattform-Links im Admin auf die echten Restaurant-Seiten gesetzt
- [ ] Social-Links im Admin eingetragen
- [ ] Testreservierung durchgeführt, beide Mails angekommen
- [ ] Admin-Passwort geändert
