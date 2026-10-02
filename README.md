# LA-Studio — Webbyrån (NGLAWEBB)

One-page-sajt för LA Studio (lastudio.se) — Lars Asplunds webbyrå. Fullskärms-videohero med
split-text-reveal, team-kort med hover-overlay, kurerat arbetsgalleri i webbläsarramar, omdömeskarusell,
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
└── img/                       # icons/, pepole/, work/ (galleriets skärmdumpar), hero-poster.jpg
                               # (Projekt/ = gamla galleribilder, används inte längre)
```

## Sektioner

| # | Sektion (id) | Innehåll |
|---|---|---|
| 1 | Hero (`#home`) | Video med gradient-scrim, eyebrow + split-text-titel + guldlinje + CTA (inga textplattor) |
| 2 | Om (`#intro`) | Citat + textspalter + 4 team-kort med hover-overlay |
| 3 | Hörnstenar (`#getStarted`) | 3 features + statistikband med räknare (60+ sajter…) |
| 4 | Koncept (`#transfer`) | Mörk split-sektion |
| 5 | LA-Studio (`#portfolio`) | Split-sektion med laptop |
| 6 | Skapade hemsidor (`#demo`) | 5 utvalda sajter i webbläsarramar: 1 "utvalt projekt" (stor ram + text) + 2×2-rutnät (svepbar rad på mobil). Hover rullar skärmdumpen förbi i ramen; klick öppnar **lightbox** med hela skärmdumpen (rullbar), teknik och "Besök sajten" |
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
- **Arbetsgalleri**: `.work-item` bär `data-title`/`data-tech`/`data-url`; alla `[data-work-open]` öppnar lightboxen.
  Hover-rullningen är ren CSS: `translateY(calc(-100% + 62.5cqw))` (62.5cqw = 16:10-fönstrets höjd), så den
  fungerar för skärmdumpar av alla längder. Av i Essential, på touch och vid `prefers-reduced-motion`
- **Scroll-lås**: `lockScroll()` sätter `html.is-locked` + `lenis.stop()` (body-overflow räcker inte eftersom html har `overflow-x: hidden`)
- **Rullbara rutor** (chatt, mobilmeny, lightbox) har `data-lenis-prevent` så att Lenis inte kapar mushjulet
- **Herovideon** har `data-src` — main.js sätter `src` utom i Essential, så 4,3 MB inte laddas i onödan
- **Statistikräknare**: IO-triggad count-up (`data-count`)
- **Kontaktformulär**: demo — validering + toast. Skarpt läge: Formspree/Web3Forms
- **Bokningsknapp**: stub-toast. Skarpt läge: Cal.com/Calendly
- **AI-chatt** ("LA Assistent"): lokal kunskapsbank (priser/tid/bokning/AI-kurs), matchar ordbörjan.
  Gemini aktiveras med en gitignorerad `js/apikey.js` som sätter `window.GEMINI_API_KEY` (laddas före main.js).
  Modellordning flash-lite → flash, 12 s timeout per modell, sedan lokal fallback
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

## Uppdatera galleriet (Skapade hemsidor)

1. Ta en skärmdump av sajten: 1440×900-viewport, scrolla igenom (för lazy-innehåll), dölj cookie-banner och
   flytande knappar, `fullPage`-skärmdump → beskär till de översta **2700 px** (3 skärmar) → skala till
   **1280 px bredd** → WebP q76 i `img/work/`. (Puppeteer-core + sharp; `prefers-reduced-motion: reduce`
   gör att reveals syns direkt.)
2. Kopiera ett `<article class="work-item work-card">` i `index.html`, byt bild, `width/height`, `data-*`,
   namn, kategori och numrering. Håll antalet kort i rutnätet jämnt (2×2) så nederkanten blir rak.

## How to Run

Öppna `index.html` direkt, eller `npx serve .`

## Mobile / Responsive

- Breakpoints: **1200 / 1024 / 768 / 480**; hamburgermeny <1024 med X-stängknapp
- Arbetsgalleriet: utvalt projekt staplas <1024; 2×2-rutnätet blir svepbar rad med scroll-snap ≤768 (kort `min(84%, 440px)`)
- Team-overlay togglas med tapp
- Chatten blir nästan fullbredd <480; `overflow-x: hidden` på html + body

## Browser support

Chrome 90+, Firefox 88+, Safari 14+
