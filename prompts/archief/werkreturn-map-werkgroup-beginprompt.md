# Werkgroup — beginprompt voor de nieuwe repo

Gebruik dit als startpunt voor `AGENTS.md`/`CLAUDE.md` in `website-werkgroup`, en
als briefing voor de eerste sessie daar.

## 0. Setup van de repo

- **Niet clonen vanaf werkverzuim.** Fork vanaf `website-werkreturn` — dat is nu
  het fundament (sectiebibliotheek, generiek CMS, doelgroepschuif zijn daar al
  gebouwd, in tegenstelling tot de kale Werkverzuim-codebase).
- Nieuwe GitHub-repo `website-werkgroup`. Remote `werkreturn` erbij als
  **alleen-lezen referentie** (zoals nu `werkverzuim` in website-werkreturn
  staat) — nooit naar pushen.
- Nieuw Vercel-project. Kopieer
  `.github/workflows/deploy-vercel.yml` 1-op-1 (bevat geen projectspecifieke
  waarden) en vul `VERCEL_TOKEN`/`VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` opnieuw in
  als GitHub-secrets van de nieuwe repo.
- Eigen Postgres + eigen Vercel Blob-store (env-vars per project, zie
  `.env.example` in website-werkreturn als sjabloon). `NEXT_PUBLIC_GTM_ID` en
  de domeinvariabele zijn al env-gebaseerd opgezet — dat patroon overnemen,
  dan hoeft forken alleen env-vars te wisselen, geen code.

## 1. Wat je 1-op-1 hergebruikt

- `AGENTS.md`-structuur (dit document, kleurenparagraaf, SEO-checklist,
  "Nooit doen"-sectie) — inhoud vervangen, opzet houden.
- `components/sections/*` — de sectiebibliotheek is er speciaal op gebouwd om
  door Werkgroup en Werkassist te worden hergebruikt.
- De generieke page-editor-renderer (`lib/page-editor/`,
  `components/page-editor/`) — géén handgeschreven formulieren per pagina meer
  bouwen.
- `lib/audience/context.tsx` (doelgroepschuif) — check eerst of Werkgroup
  überhaupt een werkgever/werknemer-schuif nodig heeft; dat was een
  Werkreturn-eis uit het copydoc, geen automatisme.
- `scripts/check-seo.mjs`, `scripts/check-redirects.mjs` — **bouw/valideer
  deze vóór het paginawerk begint**, niet achteraf als audit. Dat was bij
  Werkreturn een losse noodreparatie.

## 2. Wat ontbreekt en eerst geregeld moet worden

- **Webcopy-document voor Werkgroup.** Voor Werkreturn was er
  `Werkreturn_webcopy_webbouwer_v3_2.pdf` als bron voor élke paginatekst. Voor
  Werkgroup vind ik dat document nog niet. Zonder dat kun je geen pagina's
  bouwen — dit is de eerste blokkade, eerder dan kleuren of logo.
- Werkgroup-favicon (alleen Werkreturn-favicon aanwezig).
- Bevestiging van Wendy over kleurgebruik — zie hieronder.

## 3. Kleuren — makkelijker dan bij Werkreturn

Bij Werkreturn moest een hele tokenset via HSL-shift worden afgeleid uit
Werkverzuim. Voor Werkgroup is dat niet nodig: het huisstijlhandboek zegt
`Werkgroup (altijd leidend) = #FF6816`. Werkgroup **is** de accentkleur zelf.

Werk uit:
- Of Werkgroup een aparte "labelkleur" naast het oranje krijgt, of dat oranje
  zelf de enige merkkleur is met neutrale grijzen eromheen (bij Werkreturn was
  "grote vlakken blijven neutraal" een handboekregel die bewust is losgelaten
  voor de labelsites — voor Werkgroup zelf geldt die regel vermoedelijk wél,
  check het handboek p.16 opnieuw specifiek voor het moedermerk).
- WCAG AA op wit: `#FF6816` haalt AA niet (2,90) — dezelfde
  `-button`-variant-aanpak nodig als bij Werkreturn (`--color-accent-button`).
- Gebruik tokens uit `app/globals.css`, geen losse hex in componenten.

## 4. Bouwvolgorde (aangepast op basis van de Werkreturn-ervaring)

Afwijkend van de oorspronkelijke lijst: **navbar + footer (skelet) komt vóór
de homepage**, niet erna — bij Werkreturn was dat stap 0 omdat alle andere
pagina's eraan hangen.

1. Webcopy + kleuren vaststellen (zie boven — beide zijn blokkerend)
2. Logo + favicon toevoegen
3. Navbar + footer skelet
4. Homepage
5. CMS-koppeling (generieke renderer overnemen, content in `defaults.ts`, nooit
   inline in JSX — dat laatste gebeurde bij Werkreturn per ongeluk op
   "Over Werkreturn" en "Kennis" en viel buiten het CMS)
6. Landingpages — component voor component, van boven naar beneden door de
   webcopy: eerst beeld vragen, dan copy 1-op-1 overnemen, dan door
7. GA4, GTM, Search Console
8. Overige pagina's + redirect-inventarisatie (aparte werkstroom, zie §5)
9. Resterende pagina's
10. Tracking-check, SEO-check, CMS-check (zie checklists §6–8)

## 5. Redirects/migratie — apart traject, vroeg beginnen

- Live URL-inventaris eerst maken (bij Werkreturn bleek dit 119 URL's over 5
  sitemaps — pagina's, posts, categorieën, tags, auteurs; aanvankelijk werden
  archiefpagina's gemist). Doe dit als eigen stap, niet terloops.
- Expliciete bak-indeling (bouwen / 301 / geen actie) per URL, geen aannames
  bij ontbrekende data.
- Nooit standaard naar de homepage redirecten; altijd naar de inhoudelijk
  dichtstbijzijnde pagina; geen ketens of lussen — laat
  `check-redirects.mjs` dit bewaken.

## 6. Merkresten voorkomen — grep-lijst vooraf en herhaald

Dit was de grootste terugkerende fout bij Werkreturn: gekopieerde bestanden
die toevallig werkten maar het oude merk uitstraalden. Grep hier expliciet op,
niet alleen in zichtbare content maar ook in metadata-bestanden
(`opengraph-image.tsx`, `defaults.ts`, juridische pagina's, `robots.ts`,
`sitemap.ts`):

- Oude domeinnaam (werkreturn.nl / verzuimopwerk.nl)
- Oude hex-kleuren buiten tokens om
- Oude GA4-measurement-ID (hardcoded, niet via env)
- Oude e-mailadressen in leadrouting (`over-ons.json`, `defaults.ts`,
  content-bestanden)
- Juridische pagina's (privacyverklaring, algemene voorwaarden,
  klachtenprocedure) zijn **inhoudelijk** anders per bedrijfsmodel — niet
  alleen naam/kleur vervangen, de hele tekst beoordelen.

## 7. Componenten — les uit hergebruik

- Sectiecomponenten met een vast koppniveau (`StepFlow`, `TrajectTimeline`
  renderden ooit subtitels als `<p>` i.p.v. `<h3>`) breken de H-structuur
  onzichtbaar. Maak koppniveau een prop, niet hardcoded.
- Varieer bewust in sectievorm. Bij Werkreturn werd `ReasonBlock` op één
  pagina 4× gebruikt na het samenvoegen van content — monotone pagina's als
  gevolg. Kies per pagina bewust een andere opbouw uit de bibliotheek.
- Check op dubbele content na copy-paste binnen `defaults.ts` (gebeurde
  letterlijk: gedupliceerde H2+alinea op één pagina).
- Vergeet interne cross-linking tussen dienstpagina's niet — bij Werkreturn
  was dit een expliciete eis die er niet vanzelf uit kwam.

## 8. Conversie/tracking — les uit Werkreturn

- Eén gedeelde `CtaLink`/`data-cta`-component vanaf het begin, niet losse
  `<button>`-implementaties per pagina (Werkreturn eindigde met 7
  button-varianten + 74 losse implementaties, onmeetbaar).
- FAQ-antwoorden moeten in de zichtbare HTML staan, niet alleen in JSON-LD —
  een dichte accordion die pas bij `open` rendert, laat schema.org liegen
  over de pagina-inhoud.
- Contactformulier: herkomstveld (welke pagina) vanaf het begin meenemen,
  geen overbodige velden voor de verkeerde doelgroep.
- GA4 met Consent Mode vanaf dag 1, niet pas laden na consent zonder fallback
  — anders is elke weigeraar volledig onzichtbaar in plaats van gemodelleerd.
- Custom dimensions in GA4 moeten los in de GA4-UI geregistreerd worden —
  zet dit als apart checklist-item, het is niet in code te vangen.

## 9. Livegang-checklist (niet-geautomatiseerd, expliciet bewaken)

- `NEXT_PUBLIC_SITE_URL` moet bij livegang op het echte domein staan — staat
  hij nog op het Vercel-domein, gaat de site stilzwijgend `noindex` de lucht
  in zonder dat er iets faalt. Grootste "stille" risico uit de Werkreturn-bouw.
- `BLOG_IS_PUBLIC`/kennisbank-schakelaar pas aanzetten als er echte content
  staat.
- Placeholder-/voorbeeldcontent (verzonnen testimonials, scores) vervangen
  vóór livegang — stond bij Werkreturn tot vlak voor het einde nog live.
- Audit als losse sessie op een schone branch draaien, niet vermengd met
  feature-branches — voorkomt dat bevindingen en fixes door elkaar lopen.

## Werkwijze (ongewijzigd overnemen)

Claude plant en reviewt, Codex implementeert. Pagina's component voor
component van boven naar beneden door de webcopy: per component eerst het
beeld vragen, dan de copy 1-op-1 overnemen, dan door.
