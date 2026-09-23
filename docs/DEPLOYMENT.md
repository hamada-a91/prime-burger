# Deployment (Produktion)

## Kurz zeigen statt deployen

Für Kundenvorführungen reicht `npm run demo` (Cloudflare Quick Tunnel oder ngrok, siehe [SETUP.md](SETUP.md#öffentliche-demo-tunnel)). Für einen dauerhaft erreichbaren Stand ohne eigenen Server sind kostenlose Optionen mit Laravel + SQLite z. B. Render (Free Web Service, schläft nach Inaktivität), Fly.io (kleines Kontingent) oder Koyeb (Free-Instanz); alle bauen das `backend/Dockerfile`. Persistente Uploads brauchen dort ein Volume, sonst gehen Galerie-Uploads beim Neustart verloren. Für den echten Betrieb ist ein kleiner VPS (Hetzner, netcup) mit dem Docker-Setup unten die einfachste, stabile Variante.


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

Der Seed importiert Speisekarte, Einstellungen und die Galeriefotos aus `material/gallery/`. Der Ordner wird per Compose als `/var/www/material` (read-only) in den API-Container gemountet; er muss also auf dem Server neben `docker-compose.prod.yml` liegen (ist im Repo enthalten).

Ein `php artisan storage:link` ist in Produktion nicht nötig: nginx liefert `/storage/` direkt aus dem Volume `storage_public`.

Ein Reverse-Proxy (Caddy, Traefik, nginx) mit TLS terminiert auf `127.0.0.1:8080`.

## Updates

```bash
./deploy.sh
```

führt `git pull`, Build, `migrate --force` und `optimize` aus. Seeder laufen nicht erneut, Inhalte bleiben erhalten.

## Backups

- Datenbank: `docker compose -f docker-compose.prod.yml exec mysql mysqldump -u root -p"$DB_ROOT_PASSWORD" prime_burger > backup.sql`
- Bilder: das Volume `storage_public` (`docker volume inspect prime-burger_storage_public`) oder `docker compose ... exec api tar czf - storage/app/public > storage.tgz`

## E-Mail-Versand

### IONOS-Postfach des Kunden

```
MAIL_MAILER=smtp
MAIL_SCHEME=smtp
MAIL_HOST=smtp.ionos.de
MAIL_PORT=587
MAIL_USERNAME=kontakt@kundendomain.de
MAIL_PASSWORD=<Passwort des Postfachs>
MAIL_FROM_ADDRESS="kontakt@kundendomain.de"
MAIL_FROM_NAME="Prime Burger Leipzig"
MAIL_RESERVATION_ADDRESS=kontakt@kundendomain.de
```

Empfänger der Reservierungsanfragen: Vorrang hat **Admin → Einstellungen → Kontakt → „Empfänger für Reservierungsanfragen“**, danach `MAIL_RESERVATION_ADDRESS`, danach die öffentliche Kontaktadresse. Am besten überall dieselbe, existierende Adresse eintragen.

Wichtig: `MAIL_USERNAME` ist die vollständige E-Mail-Adresse, und `MAIL_FROM_ADDRESS` muss dasselbe Postfach sein. IONOS weist Mails mit fremdem Absender ab. Port 587 nutzt STARTTLS (`MAIL_SCHEME=smtp`); alternativ Port 465 mit `MAIL_SCHEME=smtps`.

Nach jeder Änderung an `backend/.env` muss der Container neu erzeugt werden, `env_file` wird nur beim Start gelesen:

```bash
docker compose -f docker-compose.prod.yml up -d api
docker compose -f docker-compose.prod.yml exec api php artisan optimize
```

Testmail:

```bash
docker compose -f docker-compose.prod.yml exec api php artisan tinker --execute='Mail::raw("Testmail von der Website", fn ($m) => $m->to("kontakt@kundendomain.de")->subject("SMTP-Test")); echo "gesendet", PHP_EOL;'
```



Beide Mails (`ReservationRequestMail`, `ReservationReceivedMail`) sind queue-fähig. Mit `QUEUE_CONNECTION=sync` werden sie im Request versendet (einfach, leicht verzögert). Für einen Queue-Worker: `QUEUE_CONNECTION=database`, dann `php artisan queue:work` als zusätzlichen Container/Prozess betreiben.

Absender-Domain mit SPF/DKIM beim Mail-Provider einrichten, sonst landen Gast-Mails im Spam.

## Checkliste vor dem Livegang

- [ ] Impressum-Platzhalter in `src/config/website.config.ts` ersetzt (Rechtsform, Vertreter, Register, USt-ID)
- [ ] `site.url` in `website.config.ts` = echte Domain (Sitemap, hreflang, OG-URLs)
- [ ] Lieferplattform-Links im Admin auf die echten Restaurant-Seiten gesetzt
- [ ] Social-Links im Admin eingetragen
- [ ] Testreservierung durchgeführt, beide Mails angekommen
- [ ] Admin-Passwort geändert


change-password: docker compose -f docker-compose.prod.yml exec -e HOME=/tmp -e XDG_CONFIG_HOME=/tmp api php artisan tinker --execute='App\Models\User::where("email","admin@example.com")->update(["email" => "Kontakt@prime-burger.de"]); echo "ok", PHP_EOL;'