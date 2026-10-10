# LA-Studio — Webbyrån (NGLAWEBB)

One-page-sajt för LA Studio (www.larsasplund.com) — Lars Asplunds webbyrå (testsida/demo). Fullskärms-videohero med
split-text-reveal, team-kort med hover-overlay, kurerat arbetsgalleri i webbläsarramar, omdömeskarusell,
process i fyra steg, prispaket i kr, kontaktformulär och AI-chatt. Moderniserad + premiumuppgraderad 2026-07:
responsiv, dark mode, effektväljare i tre nivåer, preloader, egen 404.

## Tech Stack

| Del | Val |
|---|---|
| Grund | Vanilla HTML/CSS/JS — inga byggverktyg |
| Typografi | Cormorant Garamond (`.font-alt`, rubriker `--track: 0.12em`, etiketter `--track-label: 0.08em`) + Trebuchet MS (brödtext). Georgia är reserv om typsnittet inte laddar |
| Smooth scroll | Lenis 1.1.14 via CDN — **endast i Cinematic-läget** |
| Karusell | Swiper 11 via CDN (omdömen) |
| Scroll-reveals | Egen IntersectionObserver (ersatte WOW.js) |
| Ikoner | Endast inline SVG (guldlinjeikoner, stroke 1.2–1.6) — inga icons8-PNG:er längre |
| Hero-video | `stad2-web.mp4` (2,1 MB, 1080p) för liggande skärm, `stad2-mobil.mp4` (1,1 MB, stående 720×1280-beskärning) för stående. 4K-originalet `stad2.mp4` (34 MB) är källan |
| Deploy | Azure Static Web Apps via GitHub Actions (`staticwebapp.config.json` styr 404) |

## Projektstruktur

```
NGLAWEBB/
├── index.html                 # Hela sajten
├── 404.html                   # Egen 404 (kopplad via staticwebapp.config.json)
├── staticwebapp.config.json   # Azure SWA: 404-override
├── css/style.css              # All styling (variabler, dark mode, perf-lägen)
├── js/main.js                 # All logik (se Features nedan)
├── stad2-web.mp4              # Herovideo, liggande 1080p (används)
├── stad2-mobil.mp4            # Herovideo, stående 720×1280 (används på stående skärm)
├── stad2.mp4                  # 4K-original 34 MB (används EJ — källa för nya kodningar)
└── img/
    ├── work/                  # Galleriets skärmdumpar (WebP 1280 px)
    ├── logo/                  # Logovarianter (signatur, cirkel, guld) — sparade, används inte just nu
    ├── icons/lagul2.png       # Textloggan (nav, preloader, footer, 404)
    ├── pepole/                # Team-korten. Visas som utklippta PNG:er; .jfif är källorna
    └── lars.jpg, hero-poster.jpg, koncept-mote.jpg, laptop-kod.jpg
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
| 7 | Omdömen (`#testimonials`) | Swiper-karusell, 4 påhittade citat **tydligt märkta som exempel** (ingress + "Exempel"-etikett på varje kort + "Exempelkund · bransch"). Byt mot riktiga citat och ta bort märkningen när sådana finns |
| 8 | Så går det till (`#process`) | 4 steg: Första mötet / Design / Utveckling / Lansering. Guldringar med siffror + tunn linje som ritas in (scaleX); 2×2 <1024, lodrät tidslinje ≤768 |
| 9 | Pris (`#pricing`) | Start 4 900 / Företag 12 900 (Populärast-badge på kortkanten) / Premium 24 900 — guld-SVG: dokument / portfölj / diamant |
| 10 | Kalkylator (`#kalkyl`) | Offertkalkylator: paket + tillval → live-summa → mailto med förifylld förfrågan |
| 11 | FAQ (`#faq`) | Accordion, 6 vanliga frågor (en öppen åt gången) |
| 12 | Kontakt (`#about`) | Om mig med porträtt (`img/lars.jpg`, 148 px + förskjuten guldram), bokningsknapp (stub), kontaktformulär (demo) |
| 13 | Footer | Textlogga, GitHub + e-postikon, rund till-toppen-knapp (SVG) uppe till höger |

**Tjänster i team-korten:** Design (`persona_29469`) / Utveckling (`personal_blue`) / Synlighet (`applebla`) / Support (`skadespelaren`). Porträtten är utklippta mot transparent bakgrund så att `--team-frame` syns i både ljust och mörkt läge. Jfif-originalen ligger kvar i `img/pepole/`. De gamla Dallas-PNG:erna (`pngegg - 2024-01-14T…`) ligger också kvar men används inte.
**E-post:** `lars@lastudio.se` används överallt — **skapa adressen hos domänleverantören före skarp lansering.**
**SEO:** OG-taggar + twitter-card + JSON-LD ProfessionalService, alla på `https://www.larsasplund.com/` (lastudio.se är bara en parkeringssida hos one.com).
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
- **Herovideon** har `data-src` + `data-src-portrait` — main.js sätter `src` utom i Essential, och väljer den stående
  beskärningen när `(orientation: portrait)` matchar (en stående telefon visar ändå bara mitten av den liggande videon)
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
- Porträtt: `img/lars.jpg` är bara 280×280 — visas max 148 px (112 px på mobil) så den inte blir suddig
- `border-radius: 2px`, hover max `translateY(-3px)`, brandtonade flerskiktsskuggor
- Rubriker med flankerande guldlinjer

## Uppdatera galleriet (Skapade hemsidor)

1. Ta en skärmdump av sajten: 1440×900-viewport, scrolla igenom (för lazy-innehåll), dölj cookie-banner och
   flytande knappar, `fullPage`-skärmdump → beskär till de översta **2700 px** (3 skärmar) → skala till
   **1280 px bredd** → WebP q76 i `img/work/`. (Puppeteer-core + sharp; `prefers-reduced-motion: reduce`
   gör att reveals syns direkt.)
2. Kopiera ett `<article class="work-item work-card">` i `index.html`, byt bild, `width/height`, `data-*`,
   namn, kategori och numrering. Håll antalet kort i rutnätet jämnt (2×2) så nederkanten blir rak.

## Koda om herovideon

Från 4K-originalet med ffmpeg (t.ex. `npm i ffmpeg-static` i en temp-mapp). Faststart gör att videon börjar
spela direkt medan resten laddas (progressiv strömning — HLS behövs inte för en 13 s bakgrundsloop):

```
ffmpeg -i stad2.mp4 -an -vf "scale=1920:1080:flags=lanczos" -c:v libx264 -preset veryslow -tune film -crf 33 -pix_fmt yuv420p -movflags +faststart stad2-web.mp4
ffmpeg -i stad2.mp4 -an -vf "crop=1216:2160,scale=720:1280:flags=lanczos" -c:v libx264 -preset veryslow -tune film -crf 32 -pix_fmt yuv420p -movflags +faststart stad2-mobil.mp4
```

crf 33 är gränsen — vid 35 syns suddig text i fasaderna. H.264 (inte AV1/VP9) för att avkodningen ska vara lätt på äldre datorer.

## How to Run

Öppna `index.html` direkt, eller `npx serve .`

## Mobile / Responsive

- Breakpoints: **1200 / 1024 / 768 / 480**; hamburgermeny <1024 med X-stängknapp
- Arbetsgalleriet: utvalt projekt staplas <1024; 2×2-rutnätet blir svepbar rad med scroll-snap ≤768 (kort `min(84%, 440px)`)
- Team-overlay togglas med tapp
- Chatten blir nästan fullbredd <480; `overflow-x: hidden` på html + body

## Browser support

Chrome 90+, Firefox 88+, Safari 14+

## Designanteckning 2026-10-02

På användarens begäran har typografin gjorts mer lättläst: tätare bokstavsavstånd på rubriker (vanligen 0,1–0,12em), viktig text omkring 15–16 px och brödtext 16 px även på mobil. Korta etiketter behåller viss spärrning.

Två bilder skapades med imagegen. `img/koncept-design.jpg` (webbskisser och färgprover) ligger kvar till vänster om Vårt koncept. `img/studio-webbdesign.jpg` finns kvar på disk men används inte längre.

2026-10-02, fyra justeringar (kan backas, se minnet `senaste-andring`):
- `text-align: justify` bort från intro, hörnstenar och koncept.
- Teamkorten delar ram: `--team-frame`, proportion 4:5, samma kant.
- Rubriker är Cormorant Garamond. `--track` 0.12em på rubriker, `--track-label` 0.08em på etiketter.
- LA-Studio-bilden är `img/studio-borderoak.jpg`, övre delen av `img/work/borderoak.webp` beskuren till 3:2. Filen `studio-webbdesign.jpg` är orörd.

2026-10-10: team-korten bytte bild. Design `persona_29469.png`, Utveckling `personal_blue.png`, Synlighet `applebla.png`, Support `skadespelaren.png`. Studiofonden är borttagen så ramen fungerar i båda temana.
