# Prime Burger Leipzig: Design System (Master)

Quelle der Wahrheit für alle öffentlichen Seiten. Seitenspezifische Abweichungen liegen in `pages/`.

## Identität

- Marke: Prime Burger, Grill & Bar, Leipzig, seit 2015. Ehrlich, frisch, kein Schnickschnack.
- Abgeleitet aus dem Logo: Anthrazit, Amber-Orange, Rot-Orange, Grunge-Stencil-Typo.
- Ein Theme: dunkel. Kein Hell/Dunkel-Umschalter auf der Website. Admin ist hell.

## Farben (`src/styles/globals.css`, `.theme-dark`)

| Token | Wert | Verwendung |
|---|---|---|
| `--background` | `#0e0e0e` | Seitenhintergrund |
| `--surface` | `#181818` | Abgesetzte Sektionen, Footer |
| `--card` | `#1c1c1c` | Karten, Formulare |
| `--surface-elevated` | `#232323` | Hover, Chips |
| `--foreground` | `#f5f1ea` | Text |
| `--muted-foreground` | `#b8b2a8` | Sekundärtext (Kontrast ≥ 4.5:1 auf allen Flächen) |
| `--primary` | `#f5a11a` | CTAs, Preise, aktive Zustände (Text darauf: `#0e0e0e`) |
| `--primary-hover` | `#ffb63b` | |
| `--brand-red` | `#e8501e` | Nur Signature-Badge und "Scharf"-Icon |
| `--success` | `#5cc48a` | Geöffnet-Status, vegan/vegetarisch-Icon |
| `--destructive` | `#ef5a4c` | Formularfehler |
| `--border` | `rgba(255,255,255,.09)` | |

Regeln: eine Akzentfarbe (Amber) auf der ganzen Seite. Rot nur als semantische Markierung. Kein reines Schwarz, keine Neon-Glows, kein Gradient-Text.

## Typografie

- Display: **Bebas Neue** (`.font-display`), immer Versalien, Tracking 0.02em, Zeilenhöhe 0.95.
  - `.display-hero` clamp(3.25rem, 9vw, 7rem), `.display-xl`, `.display-lg`, `.display-md`, `.display-sm`.
- Body/UI: **Manrope Variable**, 17px Basis, Zeilenhöhe 1.6. Buttons 700, Labels 600.
- Eyebrow (`.eyebrow`): 12px, Amber, Tracking 0.18em. Maximal 1 Eyebrow pro 3 Sektionen.
- Preise: `tabular-nums`, Amber, 700.
- Keine Gedankenstriche (– —) in sichtbaren Texten; Bindestrich oder Punkt.

## Form, Abstände, Motion

- Radius `0.375rem` überall (Buttons, Karten, Inputs). Chips/Filter sind Pills (`rounded-full`).
- Container 1280px, Seitenrand 20px (Mobil) / 32px. Sektionen `py-20 md:py-28`.
- Buttons: 48px (lg) / 56px (xl), Versalien, Tracking 0.08em. Primary Amber gefüllt, Secondary Amber-Outline. `active:translate-y-px`.
- Bilder: `object-cover`, Hover `scale(1.04)` 500ms, Caption-Overlay als Verlauf von unten. Immer `width`/`height` setzen (kein CLS).
- Motion: `Reveal` (IntersectionObserver, 700ms), `.fade-up` beim Laden, `.stagger` für Grids. `prefers-reduced-motion` schaltet alles ab.
- Dekor: `.grain` (SVG-Rauschen, 4.5 %) und `.glow-amber` nur auf Hero und CTA-Band.

## Layout-Familien (je Seite höchstens einmal wiederholen)

Split Text/Bild · Info-Leiste mit Trennlinien · Bento (1 groß + Raster) · Listen-Reihen · Full-Bleed-Foto mit Overlay · Zentriertes CTA-Band · Zweispaltige Preisliste mit Punktlinie · Masonry (CSS columns).

## Komponenten

`src/components/site/`: `PageHero`, `SectionHeading`, `OpeningStatus`, `HoursTable`, `DeliveryPlatforms`, `Lightbox`, `Reveal`, `LanguageSwitch`, `LocaleLink`.

## Checkliste vor Livegang

- [ ] Kontrast ≥ 4.5:1 (Text), ≥ 3:1 (große Typo, Icons)
- [ ] Touch-Ziele ≥ 44px, sichtbare Fokus-Ringe
- [ ] 375 / 768 / 1024 / 1440 ohne horizontales Scrollen
- [ ] Alle Bilder WebP mit Maßen, Hero mit `fetchpriority="high"`
- [ ] Beide Sprachen geprüft, keine Platzhalter im Impressum
