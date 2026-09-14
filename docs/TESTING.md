# Testing Guide

Dieses Projekt verwendet eine umfassende Test-Strategie mit **Vitest** (Unit Tests), **Playwright** (End-to-End Tests) und **Laravel Tests** (Backend Feature Tests).

## 1. Voraussetzungen

Stelle sicher, dass alle Abhängigkeiten installiert sind.
Aufgrund von React 19 Kompatibilitätsproblemen mancher Libraries (z.B. `react-helmet-async`) muss zwingend `--legacy-peer-deps` genutzt werden:

```bash
npm install --legacy-peer-deps
```

Für Playwright müssen zusätzlich die Browser-Binaries und Systemabhängigkeiten installiert sein:

```bash
# Systemabhängigkeiten (nur einmalig nötig, erfordert sudo)
sudo npx playwright install-deps

# Browser herunterladen
npx playwright install
```

---

## 2. Unit Tests (Frontend)

Wir nutzen **Vitest** für isolierte Tests von Komponenten und Hooks. Diese Tests laufen schnell und benötigen keinen echten Browser.

### Tests ausführen
```bash
npm run test:run
```

### Coverage Report
```bash
npm run test:coverage
```

### Neue Tests hinzufügen
Erstelle Dateien mit der Endung `.test.tsx` oder `.test.ts` im `src` Ordner.
Beispiel: `src/components/ui/button.test.tsx`

---

## 3. End-to-End Tests (Frontend + Integration)

Wir nutzen **Playwright**, um die Anwendung wie ein echter Benutzer im Browser zu testen.

### Tests ausführen (Headless)
```bash
npm run test:e2e
```

### Tests mit UI ausführen (Debugging)
```bash
npm run test:e2e:ui
```

### Wichtig für Admin-Tests
Damit der Admin-Login Test (`e2e/admin.spec.ts`) funktioniert, muss die Datenbank die korrekten Seed-Daten enthalten:

```bash
# Im Backend Ordner
php artisan db:seed
```

Daten für den Login:
- Email: `admin@example.com`
- Passwort: `password`

---

## 4. Backend Tests (Laravel API)

Das Laravel Backend hat eigene Feature-Tests, um die API-Endpoints zu prüfen.

### Tests ausführen
```bash
# Im Backend Ordner
php artisan test
```

### Neue Tests hinzufügen
```bash
php artisan make:test Feature/MeinNeuerTest
```

---

## 5. Troubleshooting (WSL / Linux)

### Fehler: `sh: 1: vitest: not found` oder `playwright: not found`
Wenn du Befehle über `wsl npm ...` von Windows aus ausführst, kann es zu Pfad-Problemen kommen.
**Lösung:** Öffne ein echtes Terminal in WSL und führe die Befehle dort direkt aus.

### Fehler: `System is missing dependencies to run browsers`
Playwright benötigt unter Linux (und WSL) bestimmte System-Bibliotheken.
**Lösung:**
```bash
sudo npx playwright install-deps
```

### Fehler: `ERESOLVE could not resolve` bei `npm install`
Dies liegt an React 19 Peer Dependencies.
**Lösung:** Immer `npm install --legacy-peer-deps` verwenden.
