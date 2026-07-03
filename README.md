# LA-Studio — Webbyrån (NGLAWEBB)

One-page-sajt för LA Studio (lastudio.se) — Lars Asplunds webbyrå. Fullskärms-videohero,
team-kort med hover-overlay (Dallas-ensemblen), masonry-galleri över skapade hemsidor,
prispaket och kontakt. Moderniserad 2026-07: responsiv, dark mode, effektväljare i tre nivåer.

## Tech Stack

| Del | Val |
|---|---|
| Grund | Vanilla HTML/CSS/JS — inga byggverktyg |
| Typografi | Georgia (`.font-alt`, uppercase + letter-spacing) + Trebuchet MS (brödtext) |
| Smooth scroll | Lenis 1.1.14 via CDN — **endast i Cinematic-läget** |
| Scroll-reveals | Egen IntersectionObserver (ersätter gamla WOW.js) |
| Ikoner | Inline SVG (nav/tema/effekter) + lokala icons8-PNG:er |
| Hero-video | `stad2-web.mp4` (4,3 MB, 1080p, x264 crf28) + `img/hero-poster.jpg`. Originalet `stad2.mp4` (34 MB) ligger kvar som källa |
| Deploy | Azure Static Web Apps via GitHub Actions |

## Projektstruktur

```
NGLAWEBB/
├── index.html          # Hela sajten, alla sektioner
├── css/style.css       # All styling (custom properties, dark mode, perf-lägen)
├── js/main.js          # Nav, mobilmeny, reveals, tema, effektväljare, FPS-test
├── stad2-web.mp4       # Komprimerad herovideo (används)
├── stad2.mp4           # Original 34 MB (används EJ — behålls som källa)
└── img/                # Lokala bilder (icons/, pepole/, Projekt/, hero-poster.jpg)
```

## Sektioner

| # | Sektion (id) | Innehåll |
|---|---|---|
| 1 | Hero (`#home`) | Fullskärmsvideo, "webbyrån / Lars Asplund", CTA, scroll-pil |
| 2 | Om (`#intro`) | Citat + två textspalter + 4 team-kort med hover-overlay |
| 3 | Hörnstenar (`#getStarted`) | Kreativitet / Teknisk expertis / Engagemang |
| 4 | Koncept (`#transfer`) | Mörk sektion, bild + text + CTA |
| 5 | LA-Studio (`#portfolio`) | Text + laptopbild + CTA |
| 6 | Skapade hemsidor (`#demo`) | Masonry-galleri (CSS `columns`), länkar till livesajter |
| 7 | Pris (`#pricing`) | Mörk rubriksektion + 3 priskort (Silver/Gold/Ultimate) |
| 8 | Kontakt (`#about`) | Mörk sektion med mailadress |
| 9 | Footer | Yxlogga, sociala ikoner, copyright, till-toppen-pil |

## Designsystem

- **Custom properties** i `:root`, dark mode via `:root[data-theme="dark"]` — allt temaberoende går genom variabler
- Ljust läge: varm off-white `#faf9f7`, text `#141312`; mörkt: `#100f0e` / `#ece9e4`
- Accent: guld `#b8960c` (matchar yxloggan) — hover-understrykningar, flanklinjer, aktiv effektnivå
- Skuggor: flerskikts, brandtonade (`--shadow-card`) — egna mörka värden i dark mode
- `border-radius: 2px` på knappar/kort, hover max `translateY(-3px)`
- Rubriker med flankerande guldlinjer (`.section-title::before/::after`)

## Effektlägen (`data-perf` på `<html>`)

| Läge | Innehåll |
|---|---|
| **Essential** | Ingen video (poster-stillbild), inga reveals, transitions avstängda |
| **Balanced** | Video + reveals + hover-zoom, men ingen Lenis/Ken Burns. Auto-default på svag hårdvara |
| **Cinematic** | Allt: Lenis smooth scroll + långsam zoom på herovideon |

- Väljs i den flytande knappen nere till vänster; sparas i `localStorage: ngla:perfMode`
- Auto-detektering i inline-`<head>`-script (före paint): `prefers-reduced-motion` → Essential,
  svaga kärnor/minne/save-data → Balanced, annars Cinematic (+ `data-perf-auto`)
- FPS-test 1,5 s efter load när Cinematic auto-valts: under ~45 fps → toast som föreslår Balanced
- Tema sparas i `localStorage: theme` (oprefixat, standard för portföljen)

## How to Run

Öppna `index.html` direkt, eller `npx serve .`

## Customization

- Färger/skuggor: variablerna överst i `css/style.css`
- Nav-länkar: listorna i både `.nav-links` och `.mobile-links` i `index.html`
- Galleriet: lägg bilder i `img/Projekt/` och `<img>`/`<a>` i `.masonry`
- Herovideo: byt `stad2-web.mp4` + regenerera `img/hero-poster.jpg`

## Mobile / Responsive

- Breakpoints: **1200 / 1024 / 768 / 480** (desktop-first)
- Hamburgermeny under 1024px — slide-in-panel från höger med **X-stängknapp**, overlay, Esc, scroll-lås
- Masonry: 4 → 3 → 2 → 1 kolumner; team-grid 4 → 2; split-sektioner staplas med bilden överst
- Team-overlay togglas med tapp på touch (`(hover: none)` + `.js-active`)
- `overflow-x: hidden` på **både** `html` och `body` (fixed-element-fällan)

## Browser support

Chrome 90+, Firefox 88+, Safari 14+
