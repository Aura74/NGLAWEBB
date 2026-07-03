# LA-Studio — Webbyrån (NGLAWEBB)

One-page-sajt för LA Studio (lastudio.se) — Lars Asplunds webbyrå. Fullskärms-videohero med
split-text-reveal, team-kort med hover-overlay, filtrerbart kundcase-galleri, omdömeskarusell,
prispaket i kr, kontaktformulär och AI-chatt. Moderniserad + premiumuppgraderad 2026-07:
responsiv, dark mode, effektväljare i tre nivåer, preloader, egen 404.

## Tech Stack

| Del | Val |
|---|---|
| Grund | Vanilla HTML/CSS/JS — inga byggverktyg |
| Typografi | Georgia (`.font-alt`, uppercase + letter-spacing) + Trebuchet MS (brödtext) |
| Smooth scroll | Lenis 1.1.14 via CDN — **endast i Cinematic-läget** |
| Karusell | Swiper 11 via CDN (omdömen) |
| Scroll-reveals | Egen IntersectionObserver (ersatte WOW.js) |
| Ikoner | Inline SVG + lokala icons8-PNG:er |
| Hero-video | `stad2-web.mp4` (4,3 MB, 1080p crf28) + poster. Original `stad2.mp4` (34 MB) kvar som källa |
| Deploy | Azure Static Web Apps via GitHub Actions (`staticwebapp.config.json` styr 404) |

## Projektstruktur

```
NGLAWEBB/
├── index.html                 # Hela sajten
├── 404.html                   # Egen 404 (kopplad via staticwebapp.config.json)
├── staticwebapp.config.json   # Azure SWA: 404-override
├── css/style.css              # All styling (variabler, dark mode, perf-lägen)
├── js/main.js                 # All logik (se Features nedan)
├── stad2-web.mp4              # Komprimerad herovideo (används)
├── stad2.mp4                  # Original 34 MB (används EJ)
└── img/                       # icons/, pepole/, Projekt/, hero-poster.jpg
```

## Sektioner

| # | Sektion (id) | Innehåll |
|---|---|---|
| 1 | Hero (`#home`) | Video, split-text-titel "webbyrån", CTA |
| 2 | Om (`#intro`) | Citat + textspalter + 4 team-kort med hover-overlay |
| 3 | Hörnstenar (`#getStarted`) | 3 features + statistikband med räknare (60+ sajter…) |
| 4 | Koncept (`#transfer`) | Mörk split-sektion |
| 5 | LA-Studio (`#portfolio`) | Split-sektion med laptop |
| 6 | Kundcase (`#demo`) | Filterbar + masonry med case-kort; klick öppnar **lightbox** (stor bild, `data-tech`-taggar, "Besök sajten", piltangenter) |
| 7 | Omdömen (`#testimonials`) | Swiper-karusell, 4 citat (demoinnehåll) |
| 8 | Pris (`#pricing`) | Start 4 900 / Företag 12 900 (Populärast-badge) / Premium 24 900 — "från", engångspris |
| 9 | Kalkylator (`#kalkyl`) | Offertkalkylator: paket + tillval → live-summa → mailto med förifylld förfrågan |
| 10 | FAQ (`#faq`) | Accordion, 6 vanliga frågor (en öppen åt gången) |
| 11 | Kontakt (`#about`) | Om mig + signaturlogga, bokningsknapp (stub), kontaktformulär (demo) |
| 12 | Footer | Textlogga, GitHub + e-postikon (endast verifierade kanaler), till-toppen uppe till höger |

**Tjänster i team-korten:** Design / Utveckling / Synlighet / Support — Dallas-bilderna är medveten charm.
**E-post:** `lars@lastudio.se` används överallt — **skapa adressen hos domänleverantören före skarp lansering.**
**SEO:** OG-taggar + twitter-card (domän `lastudio.se` — uppdatera vid flytt) + JSON-LD ProfessionalService.
**Cinematic-extra:** guld scroll-progressbar + filmgrain på heron.

## Features i js/main.js

- **Effektlägen** (`data-perf`): Essential / Balanced / Cinematic — flytande knapp **nere till vänster**, `localStorage: ngla:perfMode`, FPS-test föreslår Balanced
- **Dark mode**: toggle i nav, `localStorage: theme`, before-paint-script
- **Split-text-hero**: tecken-för-tecken (28 ms stagger) i Balanced+Cinematic
- **Magnetiska CTA-knappar**: endast Cinematic + mus (`translate(x*0.18, y*0.32)`)
- **Masonry-parallax**: endast Cinematic, djup −16/0/+16 px per kolumnindex
- **Case-filter**: `data-cat` på korten, `.is-hidden` togglas
- **Statistikräknare**: IO-triggad count-up (`data-count`)
- **Kontaktformulär**: demo — validering + toast. Skarpt läge: Formspree/Web3Forms
- **Bokningsknapp**: stub-toast. Skarpt läge: Cal.com/Calendly
- **AI-chatt** ("LA Assistent"): lokal kunskapsbank (priser/tid/bokning/AI-kurs). Gemini kan
  aktiveras genom att sätta `GEMINI_API_KEY` i main.js (mönster från AI_ChatBot_Liten_Version)
- **Preloader**: pulserande yxa; hoppas över vid perf-byte (`sessionStorage: ngla:skipPreloader`) och i Essential
- **Lenis-integration**: alla ankarlänkar går via `lenis.scrollTo`; instansen exponeras som `window.__lenis`

## Designsystem

- CSS-variabler i `:root`, dark mode via `:root[data-theme="dark"]`
- Ljust: varm off-white `#faf9f7`; mörkt: `#100f0e`. Accent: guld `#b8960c` (+ `#8a7009` för text)
- Loggan (`lagul2.png`, nästan svart) görs **vit med `filter: brightness(0) invert(1)`** på mörk nav/mobilpanel,
  och **champagneguld** i mörkt läge för intro-loggan (invert + sepia-kedja)
- Hörnstenar-ikoner: inline SVG-linjeikoner i guld (sparkles / kod / hjärta), stroke 1.4
- Foton: `img/koncept-mote.jpg` + `img/laptop-kod.jpg` — Unsplash, nedladdade lokalt (ersatte tecknade illustrationer)
- `border-radius: 2px`, hover max `translateY(-3px)`, brandtonade flerskiktsskuggor
- Rubriker med flankerande guldlinjer

## How to Run

Öppna `index.html` direkt, eller `npx serve .`

## Mobile / Responsive

- Breakpoints: **1200 / 1024 / 768 / 480**; hamburgermeny <1024 med X-stängknapp
- Masonry 4→3→2→1 kolumner; case-bildtexter alltid synliga på touch; team-overlay togglas med tapp
- Galleriet visar bara 3 case + "Visa alla"-knapp på ≤768px (filterklick expanderar också)
- Chatten blir nästan fullbredd <480; `overflow-x: hidden` på html + body

## Browser support

Chrome 90+, Firefox 88+, Safari 14+
