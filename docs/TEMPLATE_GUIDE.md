# Landing Page Template - Benutzerhandbuch

Dieses Dokument erklärt die Architektur, Logik und wie Sie dieses Template für neue Projekte verwenden können.

---

## Inhaltsverzeichnis

1. [Architektur-Übersicht](#architektur-übersicht)
2. [Frontend-Struktur](#frontend-struktur)
3. [Backend-Struktur](#backend-struktur)
4. [Konfigurationssystem](#konfigurationssystem)
5. [Dynamische Settings](#dynamische-settings)
6. [Block-System](#block-system)
7. [Neues Projekt starten](#neues-projekt-starten)
8. [Anpassungen vornehmen](#anpassungen-vornehmen)

---

## Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                 │
├─────────────────────────────────────────────────────────────────┤
│  React Frontend (Vite)           │   Admin Dashboard           │
│  - Public Pages                  │   - Blog CRUD               │
│  - Block Renderer                │   - Jobs CRUD               │
│  - SEO Components                │   - Settings                │
├──────────────────────────────────┼──────────────────────────────┤
│                    API (fetch / React Query)                    │
├─────────────────────────────────────────────────────────────────┤
│                    Laravel Backend (Sail/Docker)                │
│  - REST API                      │   - Auth (Sanctum)          │
│  - Models (Blog, Jobs, Settings) │   - Mail                    │
├─────────────────────────────────────────────────────────────────┤
│                         MySQL Database                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend-Struktur

```
src/
├── components/
│   ├── blocks/          # Content-Blöcke (Hero, Features, FAQ, etc.)
│   ├── layout/          # Header, Footer, Layout
│   ├── legal/           # Cookie Banner, Legal Pages
│   ├── seo/             # SEOHead, JsonLd
│   ├── ui/              # Button, Card, Input (shadcn/ui)
│   └── admin/           # Admin-spezifische Komponenten
├── config/
│   ├── website.config.ts       # Hauptkonfiguration
│   ├── website.config.schema.ts # TypeScript Types
│   └── tokens.config.ts        # Design Tokens (CSS Variables)
├── hooks/
│   ├── useConfig.tsx           # Config Context
│   ├── useAuth.tsx             # Auth Context
│   └── api/                    # React Query Hooks
├── lib/
│   ├── api.ts                  # API Client
│   └── utils.ts                # Utilities
├── pages/                      # Seiten-Komponenten
└── styles/
    └── globals.css             # Global Styles
```

---

## Backend-Struktur

```
backend/
├── app/
│   ├── Http/Controllers/
│   │   ├── Api/          # Public API (Blog, Jobs, Contact)
│   │   ├── Admin/        # Admin CRUD
│   │   └── Auth/         # Login/Logout
│   ├── Models/           # BlogPost, JobListing, Setting, ContactSubmission
│   └── Mail/             # ContactFormMail
├── database/
│   ├── migrations/       # Tabellen-Schema
│   └── seeders/          # Demo-Daten
├── routes/
│   └── api.php           # API-Routen
└── docker-compose.yml    # Sail-Konfiguration
```

---

## Konfigurationssystem

Die statische Konfiguration befindet sich in `src/config/website.config.ts`:

```typescript
export const websiteConfig: WebsiteConfig = {
  site: {
    name: 'Firmenname',
    url: 'https://example.com',
    // ...
  },
  navigation: { items: [...] },
  pages: {
    home: { seo: {...}, blocks: [...] },
    about: { seo: {...}, blocks: [...] },
  },
  // ...
};
```

### Verwendung im Code

```tsx
import { useSiteConfig, usePageConfig } from '@/hooks';

function MyComponent() {
  const site = useSiteConfig();
  const homePage = usePageConfig('home');
  
  return <h1>{site.name}</h1>;
}
```

---

## Dynamische Settings

Das Settings-System ermöglicht es, Werte zur Laufzeit über das Admin-Panel zu ändern.

### API-Endpunkte

| Methode | Endpunkt | Beschreibung |
|---------|----------|--------------|
| GET | `/api/settings` | Alle Settings laden |
| PUT | `/api/admin/settings` | Settings aktualisieren (Auth) |

### Frontend-Hook

```tsx
import { useSettings } from '@/hooks/api';

function Footer() {
  const { data: settings } = useSettings();
  
  const email = settings?.contact_email || 'fallback@example.com';
  return <a href={`mailto:${email}`}>{email}</a>;
}
```

### Verfügbare Settings

| Key | Typ | Beschreibung |
|-----|-----|--------------|
| `contact_email` | string | Kontakt-E-Mail |
| `contact_phone` | string | Telefonnummer |
| `contact_address` | JSON | `{ street, city, zip, country }` |
| `opening_hours` | JSON | `{ "Mo-Fr": "9-18", "Sa": "10-14" }` |
| `label_phone` | string | Label für Telefon-Anzeige |
| `label_email` | string | Label für E-Mail-Anzeige |
| `label_address` | string | Label für Adresse-Anzeige |

### Im Admin bearbeiten

1. Einloggen unter `/admin/login`
2. Navigieren zu "Einstellungen"
3. Werte anpassen und speichern


---

## Block-System

Seiten bestehen aus wiederverwendbaren **Blöcken**. Der `BlockRenderer` rendert Blöcke basierend auf ihrem Typ:

```tsx
// In einer Page-Komponente
<BlockRenderer blocks={pageConfig.blocks} />
```

### Verfügbare Block-Typen

| Block | Beschreibung |
|-------|--------------|
| `hero` | Hero-Section mit Headline, CTA |
| `social-proof` | Logos von Kunden/Partnern |
| `feature-grid` | Feature-Karten im Grid |
| `testimonials` | Kundenbewertungen |
| `pricing` | Preistabellen |
| `faq` | Akkordeon mit FAQ |
| `team` | Team-Mitglieder |
| `cta` | Call-to-Action Section |
| `contact-form` | Kontaktformular |
| `blog-preview` | Blog-Vorschau |

### Neuen Block hinzufügen

1. **Typ definieren** in `website.config.schema.ts`:
```typescript
export interface MyNewBlock {
  type: 'my-new-block';
  title: string;
  items: string[];
}
```

2. **Komponente erstellen** in `src/components/blocks/MyNewBlock.tsx`

3. **Im BlockRenderer registrieren**:
```typescript
case 'my-new-block':
  return <MyNewBlock key={i} {...block} />;
```

4. **In Config verwenden**:
```typescript
pages: {
  home: {
    blocks: [
      { type: 'my-new-block', title: 'Test', items: ['A', 'B'] }
    ]
  }
}
```

---

## Neues Projekt starten

### 1. Repository klonen

```bash
git clone <repo-url> mein-neues-projekt
cd mein-neues-projekt
```

### 2. Frontend einrichten

```bash
npm install
cp .env.example .env
# VITE_API_URL anpassen
```

### 3. Backend einrichten

```bash
cd backend
cp .env.example .env
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate
./vendor/bin/sail artisan db:seed
```

### 4. Admin-User erstellen

```bash
./vendor/bin/sail artisan tinker
>>> User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => bcrypt('password')])
```

### 5. Entwicklungsserver starten

```bash
# Terminal 1: Backend
cd backend && ./vendor/bin/sail up

# Terminal 2: Frontend
npm run dev
```

---

## Anpassungen vornehmen

### Firmenname & Branding ändern

1. `src/config/website.config.ts`:
```typescript
site: {
  name: 'Neue Firma GmbH',
  url: 'https://neuefirma.de',
  // ...
}
```

2. Design Tokens in `src/config/tokens.config.ts`:
```typescript
colors: {
  primary: { h: 220, s: 80, l: 50 }, // Neue Farbe
}
```

### Navigation anpassen

```typescript
navigation: {
  items: [
    { label: 'Startseite', href: '/' },
    { label: 'Leistungen', href: '/services' },
    { label: 'Kontakt', href: '/contact' },
  ],
}
```

### Neue Seite hinzufügen

1. **Route in App.tsx**:
```tsx
<Route path="neue-seite" element={<NeuePage />} />
```

2. **Page-Komponente erstellen**:
```tsx
// src/pages/NeuePage.tsx
export function NeuePage() {
  const page = usePageConfig('neue-seite');
  return <BlockRenderer blocks={page.blocks} />;
}
```

3. **Config erweitern**:
```typescript
pages: {
  'neue-seite': {
    seo: { title: 'Neue Seite', description: '...' },
    blocks: [...]
  }
}
```

### API-Endpunkte erweitern

1. **Migration erstellen**:
```bash
./vendor/bin/sail artisan make:migration create_neue_tabelle_table
```

2. **Model erstellen**:
```bash
./vendor/bin/sail artisan make:model NeuesModel
```

3. **Controller erstellen**:
```bash
./vendor/bin/sail artisan make:controller Api/NeuerController
```

4. **Route registrieren** in `routes/api.php`

---

## Deployment

### Production Build

```bash
# Frontend
npm run build  # Erstellt /dist

# Backend
./vendor/bin/sail artisan config:cache
./vendor/bin/sail artisan route:cache
```

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables (Production)

```env
# Frontend .env.production
VITE_API_URL=https://api.meinedomain.de

# Backend .env
APP_ENV=production
APP_DEBUG=false
```

---

## Häufige Aufgaben

| Aufgabe | Befehl/Aktion |
|---------|---------------|
| Dev-Server starten | `npm run dev` |
| Backend starten | `./vendor/bin/sail up` |
| Neue Migration | `sail artisan make:migration` |
| Tests ausführen | `npm run test` / `sail artisan test` |
| Build erstellen | `npm run build` |
| Cache leeren | `sail artisan cache:clear` |

---

## Support

Bei Fragen oder Problemen:
- Issues im Repository erstellen
- Dokumentation in `/docs` lesen
- Phase-Specs für Implementierungsdetails


## change shadcn styling

npm config set legacy-peer-deps false

then -> 

npx shadcn@latest init "https://ui.shadcn.com/init?base=radix&style=nova&baseColor=stone&theme=rose&iconLibrary=remixicon&font=jetbrains-mono&menuAccent=bold&menuColor=inverted&radius=large&template=vite"



## Neue Features (v1.1)

### 1. UI/UX Enhancements
- **Dark Mode**: Vollständige Unterstützung für Hell/Dunkel-Modus. Wechselbar über den Toggle im Header (System/Light/Dark).
  - Implementiert mit `next-themes` (via `useTheme`-Hook)
  - Nutzt CSS-Variablen für Farben (z.B. `--background`, `--foreground`)
- **Scroll Reveal**: Elemente fliegen beim Scrollen sanft ein (siehe `src/components/ui/scroll-reveal.tsx`)
- **Scroll-to-Top**: Button erscheint nach 300px Scroll

### 2. Admin Features
- **Bild-Upload**: 
  - Drag & Drop Upload in Blog-Posts
  - Automatische Optimierung zu WebP (Backend)
  - Fehlerbehandlung für Laravel-Validierung (z.B. "Max. 10MB")
- **Analytics Dashboard**:
  - Übersichtskarten (Kontakte, Posts, Jobs)
  - 14-Tage Trend-Chart für Kontaktanfragen
  - Zusammenfassung offener Anfragen und Entwürfe

### 3. Neue Block-Varianten

**Hero Block (`type: 'hero'`)**
- `variant: 'fullscreen'`: Bildschirmfüllender Hero mit Hintergrundbild, dunklem Overlay und Scroll-Indikator
- `variant: 'parallax'`: Hero mit Parallax-Hintergrundbild (CSS `fixed`)
- `variant: 'centered'`: Klassischer zentrierter Hero
- `variant: 'split'`: Text links, Bild/Inhalt rechts

**Testimonials Block (`type: 'testimonials'`)**
- `variant: 'wall'`: Animierte "Wall of Love" (zwei Reihen, scrollen entgegengesetzt)
- `variant: 'grid'`: Klassisches Gitter-Layout