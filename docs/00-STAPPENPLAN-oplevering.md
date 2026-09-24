# Stappenplan oplevering 4 Werk-websites

**Laatst bijgewerkt:** 2026-09-21
**Doel:** de vier labelsites definitief opleveren en live zetten, met alles gecontroleerd op SEO/AI, redirects, formulieren, tracking, CMS, sitemap, viewports, dode links en DNS.

## De vier sites

| Label | Status nu | Lokaal (via `bin/site open`) | Repo |
|---|---|---|---|
| Werkverzuim | **Live** (bestaande site) | `repos/werkverzuim` | helloprofs/website-werkverzuim |
| Werkreturn | Vercel klaar, WordPress nog live | `repos/werkreturn` | helloprofs/website-werkreturn |
| Werkgroup | Vercel klaar, WordPress nog live | `repos/werkgroup` | helloprofs/werkgroup-website |
| Werkassist | Vercel klaar, WordPress nog live | `repos/werkassist` | helloprofs/werkassist-website |

Punten 1 t/m 6 en 8 gelden voor **Werkreturn, Werkgroup, Werkassist**.
Voor **Werkverzuim** geldt alleen het viewport-probleem — die site staat al
live en de rest wordt niet opnieuw doorlopen. Dat viewport-punt pakt de
gebruiker zelf op, los van dit stappenplan, met een eigen prompt in een
sessie met in-app browser.

**Volgorde:** zie "Volgorde van uitvoeren" onderaan — samengevat: eerst
Werkverzuim-viewports (los, door de gebruiker), dan stap 5 en 8 breed over de
drie repo's, dan per site (Werkreturn → Werkgroup → Werkassist) de stappen
1, 2, 3, 4, 6, 7, en pas als alle drie klaar zijn de DNS-mail (stap 9).

---

## Stap 0 — Mappenstructuur — **afgerond**

> **Bijgewerkt 2026-09-24:** de map is nu een hub-repo (zie
> `CLAUDE.md`). Clones staan niet meer vast in labelmappen maar worden met
> `bin/site open <site>` in `repos/<site>` gezet en na afloop opgeruimd. Paden
> hieronder als `Werkgroup/Werkgroup-website/...` lees je als `repos/werkgroup/...`.
> Geheimen staan in `_lokaal/`. Zie `docs/overstap-2026-09-24.md`.

Alles staat onder `Werkgroup websites overkoepelend/`. `git status` werkt in
alle vier de repo's, node_modules overleefde de verplaatsing. Werkverzuim is
gekloond vanaf `helloprofs/website-werkverzuim` naar
`Werkverzuim website/website-werkverzuim`.

> **Let op:** in elke labelmap staat een `client_secret_*.apps.googleusercontent.com.json`
> (Google OAuth client secret). Die bestanden staan buiten de website-mappen
> (dus buiten de repo's) — geen actief lek. Werkgroup en Werkassist hebben
> `client_secret_*.json` in hun `.gitignore` als vangnet; Werkreturn miste die
> regel en heeft hem nu ook.

---

## Stap 1 — SEO + AI-optimalisatie (SEO/GEO)

**Waar:** VS Code, per repo. **Sites:** Werkreturn, Werkgroup, Werkassist.

Per site controleren en scoren:

- [ ] **Metadata**: unieke `title` + `description` op élke pagina, lengte binnen limiet, canonical correct, `metadataBase` gezet
- [ ] **OG/Twitter**: `opengraph-image.tsx` aanwezig en rendert (alle drie hebben er één)
- [ ] **Koppenstructuur**: precies één `h1` per pagina, logische h2/h3
- [ ] **Structured data (JSON-LD)**: `Organization`, `LocalBusiness`/`ProfessionalService` (met NAW), `BreadcrumbList`, `FAQPage` waar FAQ's staan, `JobPosting` voor Werkgroup-vacatures
- [ ] **Interne links**: elke belangrijke pagina is bereikbaar vanuit navigatie/footer
- [ ] **Alt-teksten** op alle afbeeldingen
- [ ] **AI/GEO-specifiek**:
  - `llms.txt` in `public/` (korte beschrijving van het bedrijf + belangrijkste URL's)
  - `robots.ts`: AI-crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) bewust toestaan of blokkeren — per label dezelfde keuze
  - antwoord-klare content: duidelijke definities, FAQ-blokken, concrete NAW/contactgegevens in tekst (niet alleen in een afbeelding)
  - consistente NAW + bedrijfsnaam over alle labels (Werkassist: Zwarteweg 110 D, 1431 VM Aalsmeer — bevestigd correct)
- [ ] **Performance/CWV**: Lighthouse of PageSpeed per site (mobiel + desktop), LCP-afbeeldingen `priority`, fonts `display: swap`

**Klaar als:** per site een kort rapportje met score + lijst openstaande punten, en de quick wins doorgevoerd.

---

## Stap 2 — Redirects naast de oude URL-inventarisatie — **afgerond** (bevestigd 2026-09-24)

**Waar:** VS Code, per repo. **Sites:** Werkreturn, Werkgroup, Werkassist.

Bronmateriaal dat er al ligt:
- `Werkassist/batch6-oude-urls.csv` (nu `_lokaal/bronmateriaal/werkassist/`)
- redirectinventarisatie Werkgroup 15-09 (opgeruimd; staat in de git-geschiedenis van de hub)
- `Werkgroup/Werkgroup-website/outputs/werkverzuim-sitemap-redirects-2026-09-15/`
- Redirects staan in `next.config.ts` (Werkassist: 21 regels, Werkgroup: 44) en deels in `middleware.ts`

Per site:

- [ ] Volledige lijst oude URL's verzamelen (CSV/inventarisatie + oude WordPress sitemap + Search Console "pagina's" export)
- [ ] Script draaien dat elke oude URL langs `next.config.ts` + `middleware.ts` legt en per URL zegt: heeft redirect / geen redirect / redirect naar 404
- [ ] Ontbrekende redirects toevoegen (301, niet 302)
- [ ] Geen redirect-ketens (A→B→C) en geen loops
- [ ] Query-strings en trailing slashes meegenomen
- [ ] Na deploy: dezelfde lijst nogmaals draaien tegen de live Vercel-URL (echte HTTP-status, niet alleen de config)

**Klaar als:** 100% van de oude URL's een 301 naar een bestaande 200-pagina geeft, met een afvinkbaar CSV-resultaat per site.

---

## Stap 3 — Formulieren / SMTP

**Waar:** VS Code + Vercel dashboard. **Sites:** alle vier.

Wat er in code staat (al gecontroleerd):

| Site | Route(s) | Verzendmethode | Env-vars |
|---|---|---|---|
| Werkassist | `app/api/contact` | SMTP (nodemailer) | `SMTP_HOST/PORT/USER/PASS`, `CONTACT_TO` |
| Werkgroup | `app/api/contact`, `app/api/solliciteren` | SMTP (nodemailer) | idem + `CONTACT_TO` |
| Werkreturn | `app/api/contact` | SMTP (nodemailer) | idem + `CONTACT_TO_WERKGEVER`, `CONTACT_TO_WERKNEMER` |
| Werkverzuim | ? | **nog uitzoeken** | ? |

→ Het vermoeden klopt: de drie nieuwe sites gaan allemaal via SMTP. Openstaande vraag bij de ICT-partner: **welke SMTP-gegevens** (host/poort/gebruiker/wachtwoord, en mag dat één account voor alle labels zijn of per label?). Die vraag is al eerder gesteld en blijft waarschijnlijk lang openstaan — de herinnering gaat mee in de DNS-mail aan het eind (stap 9), niet apart.

- [ ] Antwoord ICT-partner over SMTP-account(s) binnen — **blokkerend voor de rest van deze stap**, dus dit onderdeel per site blijft "open" totdat dat antwoord er is; de overige stap-3-punten (foutafhandeling, bijlage-upload-logica) kunnen al wel
- [ ] Per site in Vercel: env-vars gezet voor Production **én** Preview
- [ ] Testformulier ingestuurd per site → mail daadwerkelijk ontvangen op het juiste adres (Werkreturn: check dat werkgever/werknemer naar het juiste adres gaan)
- [ ] Afzender/SPF/DKIM in orde zodat mails niet in spam belanden
- [ ] Bijlage-upload bij Werkgroup `solliciteren` getest (CV-bestand)
- [ ] Foutafhandeling: wat ziet de bezoeker als SMTP faalt
- [ ] Werkverzuim: uitzoeken hoe het formulier daar verstuurt en of het werkt

**Klaar als:** op alle vier de sites een testinzending aantoonbaar in de juiste mailbox landt.

---

## Stap 4 — Tracking (GTM → GA4 → Search Console)

**Waar:** browser (Tag Assistant / GA4 DebugView). **Sites:** alle vier.

Gevonden in code: Werkassist `G-S5QRG4MP0B`, Werkreturn `G-0WMTMVH1ER`, Werkgroup geen hardcoded id (loopt vermoedelijk via env of GTM) — verifiëren.

Per site:

- [ ] GTM-container laadt op productie (Tag Assistant verbinden)
- [ ] Consent Mode / cookiebanner: tags vuren pas ná toestemming, en vuren wél ná toestemming
- [ ] Events die binnen moeten komen: `page_view`, `form_start`, `form_submit`/`generate_lead`, telefoon-klik, mail-klik, (Werkgroup) `sollicitatie_verstuurd`, (Werkassist/Werkreturn) `contact_verstuurd` — vergelijk met `lib/analytics/events.ts`
- [ ] GA4 DebugView: alle bovenstaande events zichtbaar met de juiste parameters
- [ ] GA4-property gekoppeld aan de juiste stream-URL (na livegang het definitieve domein, niet de vercel.app-URL)
- [ ] Search Console: property aangemaakt, eigendom geverifieerd, **gekoppeld aan GA4**
- [ ] Sitemap ingediend in Search Console (zie stap 6)

**Klaar als:** per site een screenshot van DebugView met de kernevents + GSC-koppeling bevestigd.

---

## Stap 5 — CMS-systemen gelijktrekken

**Waar:** VS Code met scope op `Werk-labels/` (daarom stap 0 eerst). **Sites:** Werkreturn, Werkgroup, Werkassist.

Alle drie hebben: `beheer`, `beheer-login`, `page-editor`, `api/media`, `api/page-editor`. Werkgroup heeft extra: `blog-builder`, `vacatures-builder`, `api/shared-content`.

- [ ] Diff maken van `app/beheer`, `app/page-editor`, `app/api/page-editor`, `app/api/media` tussen de drie repo's
- [ ] Per verschil bepalen: **label-specifiek** (vacatures/blog bij Werkgroup — laten staan) of **algemene fix** (overzetten naar de andere twee)
- [ ] Lijst algemene verbeteringen maken en per repo toepassen (denk aan: login/sessie-afhandeling, upload-validatie, foutmeldingen, autosave, afbeeldingsoptimalisatie, toegankelijkheid van de editor)
- [ ] Login/beveiliging van `beheer-login` is op alle drie even streng (rate limiting, wachtwoord niet in code, `noindex` op beheerpagina's)
- [ ] Per repo apart committen met duidelijke boodschap

**Klaar als:** de gedeelde CMS-onderdelen functioneel gelijk zijn en de verschillenlijst alleen nog bewuste label-verschillen bevat.

---

## Stap 6 — Sitemap & robots

**Waar:** VS Code + live check. **Sites:** Werkreturn, Werkgroup, Werkassist (+ Werkverzuim live controleren).

- [ ] `app/sitemap.ts`: bevat alle publieke pagina's, inclusief CMS-pagina's/blogs/vacatures; géén `beheer`, `page-editor`, `bedankt`, API-routes
- [ ] Absolute URL's met het **definitieve domein** (niet `*.vercel.app`)
- [ ] `lastModified` klopt en is niet voor elke pagina "nu"
- [ ] `app/robots.ts`: `Disallow` op `/beheer`, `/beheer-login`, `/page-editor`, `/api/`; `Sitemap:`-regel aanwezig
- [ ] Preview-deploys op `noindex` (Vercel `x-robots-tag` of env-check)
- [ ] Na livegang: `/sitemap.xml` en `/robots.txt` in de browser openen en indienen in Search Console

---

## Stap 7 — Viewports

**Waar:** **Claude web/Codex met in-app browser** (screenshots) — niet in VS Code, die sessie heeft geen in-app browser. **Sites:** steekproef per site, uit te voeren als onderdeel van de per-site ronde (Werkreturn → Werkgroup → Werkassist).

- [ ] Home + contact + één dienstpagina screenshotten op 320, 375, 768, 1024, 1440 px
- [ ] Concreet vastleggen wát er misgaat (horizontale scroll, afgekapte tekst, overlappende elementen, te kleine tapdoelen)
- [ ] Geen horizontale overflow op 320px op geen enkele geteste pagina

**Prompt voor de Codex/Claude-sessie:** "Open [URL] in de browser, maak screenshots op 320/375/768/1024/1440px breed, en rapporteer per breedte wat er visueel misgaat."

> **Werkverzuim's viewport-probleem staat hier los van.** Dat is de bestaande,
> al gemelde bug op de live site (4 pagina's) en wordt door de gebruiker zelf
> opgepakt, met een eigen prompt, buiten dit stappenplan om.

---

## Stap 8 — Dode URL's van andere labels opruimen

**Waar:** VS Code met scope op `Werk-labels/`. **Sites:** Werkreturn, Werkgroup, Werkassist.

Er staan nog verwijzingen naar andere labels kris-kras door de repo's (bijvoorbeeld `Algemene Voorwaarden Werkverzuim 3.1 PDF.pdf` in `Werkgroup/Werkgroup-website/public/` en `werkverzuim-sitemap-redirects` in `Werkgroup/.../outputs/`).

- [ ] Per repo grep op: `werkverzuim`, `werkreturn`, `werkgroup`, `werkassist`, en op de oude WordPress-domeinen
- [ ] Per treffer beoordelen:
  - **bewuste kruislink** (bijv. "onderdeel van Werkgroup" met een werkende link) → laten staan, wel controleren dat de URL 200 geeft
  - **restant van kopiëren/scaffolding** (verkeerde PDF, verkeerd adres, verkeerd telefoonnummer, dood pad) → weghalen of vervangen
- [ ] Alle externe links in de drie sites een keer op status controleren (linkchecker over de build)
- [ ] Contactgegevens, KvK en algemene voorwaarden per site controleren op het **juiste** label

> Zorgvuldig zijn: niet blind zoeken-en-vervangen — sommige verwijzingen naar zusterlabels zijn bedoeld.

---

## Stap 9 — Eindmail naar de ICT-partner (SMTP-herinnering + DNS)

**Waar:** Vercel dashboard + mail. **Wanneer:** pas als Werkreturn, Werkgroup én Werkassist alle stappen 1 t/m 8 doorlopen hebben. **Sites:** Werkreturn, Werkgroup, Werkassist.

Eén mail, twee onderdelen:

- [ ] **SMTP-herinnering** — het antwoord over de SMTP-gegevens (stap 3) is al
      eerder gevraagd; dit is het opnieuw onder de aandacht brengen. Blijft
      waarschijnlijk nog even openstaan; de formulieren werken pas als dit
      binnen is.
- [ ] **DNS-overzicht**, per domein:
  - [ ] Domein in Vercel toevoegen aan het juiste project → Vercel geeft de
        benodigde records (dit is het moment waarop de gegevens er zijn, niet
        eerder)
  - [ ] Huidige DNS uitlezen (`dig +short A/AAAA/CNAME/MX/TXT <domein>`) en
        vastleggen als "voor"-situatie
  - [ ] Overzicht per domein: huidig record → nieuw record (van Vercel), met
        TTL. **Alleen web-records**: A/ALIAS voor apex + CNAME voor `www`.
        **MX en mail-TXT (SPF/DKIM/DMARC) blijven ongemoeid** — anders valt
        de mail uit
  - [ ] Overzicht + gevraagde uitvoerdatum in de mail

**Na akkoord van de ICT-partner op een datum** (dus niet nu, dat is een
losse vervolgstap):

- [ ] TTL's een dag vóór de switch verlagen naar 300s
- [ ] Na switch: HTTPS-certificaat actief, `www` → apex (of andersom)
      redirect, oude WordPress uit de lucht of op redirect, stap 2 opnieuw
      draaien tegen het live domein, stap 4 stream-URL bijwerken

---

## Volgorde van uitvoeren

**1. Werkverzuim-viewports** — los van dit stappenplan, door de gebruiker
zelf opgepakt met een eigen prompt in een sessie met in-app browser. Geen
afhankelijkheid met de rest.

**2. Breed over de drie repo's, vóór er per site verder gegaan wordt:**
- **Stap 5** — CMS-systemen gelijktrekken (diff tussen de drie `beheer`/`page-editor`-implementaties)
- **Stap 8** — dode URL's / kruisverwijzingen tussen de labels opruimen (grep over alle drie de repo's)

  Dit één keer breed doen, niet per site herhalen — anders vergelijk je drie
  keer dezelfde bestanden met een wisselende uitkomst.

  *Al gedaan als onderdeel van de voorbereiding:* het controle-harnas van
  Werkreturn is gelijkgetrokken met Werkgroup/Werkassist (`check:types`,
  `check:placeholders`, `check:links`, `check:routes`, gecombineerde `check`,
  en de CI-workflow deployt daar nu ook pas ná die controle). Dat leverde nu
  al twee reële bevindingen op, voor Werkreturn zelf op te pakken bij stap 1/2:
  ~35 redirects in `next.config.ts` die een dubbele hop maken (bestemming
  mist de afsluitende slash, 301→308) en twee beheer-API's
  (`/api/page-editor/homepage/`, `/api/blog-builder/posts/`) die op GET
  zonder login 200 geven in plaats van 401 — exact het lek dat in de
  Werkgroup-fork al gedicht is (zie het commentaar in `Werkgroup-website/middleware.ts`).

**3. Per site, met 3 agents parallel: 1 agent per site (Werkreturn,
Werkgroup, Werkassist), niet sequentieel.** (Gewijzigd 2026-09-22 t.o.v. de
oorspronkelijke sequentiële volgorde hierboven — zie
[[oplevering-werkvolgorde]] in memory voor de volledige onderbouwing.) De
gebruiker levert per agent de prompt, ik review elke uitkomst zelf (echte
builds/checks, niet op vertrouwen) en vergelijk de drie onderling zodat een
goede aanpak bij de één ook bij de andere twee terechtkomt. Per site de
stappen 1, 2, 3 (deels), 4, 6, 7 — plus twee nieuwe substappen die in deze
ronde zijn toegevoegd:

- **CMS-fotobibliotheek**: welke afbeeldingen staan lokaal/in de repo maar
  niet in de mediabibliotheek (aanvullen), welke zijn ongebruikt en mogen
  weg (na overleg, niet blind verwijderen).
- **Repo-opschoning**: ongebruikte bestanden/structuur — eerst analyse en
  overleg, dan pas opschonen.

Werkreturn had stap 1 (SEO/GEO) en 2 (redirects) al vóór deze ronde gedaan
(zie [[stap5-en-8-tickets]]); de Werkreturn-agent doet die twee nu als een
lichtere vergelijk-en-verbeterslag i.p.v. helemaal opnieuw. Stap 3 (SMTP)
blijft per site voor het testonderdeel "open" totdat de ICT-partner
(Joteck) reageert — de rest van stap 3 (env-vars klaarzetten,
foutafhandeling) kan wel gewoon door. DNS + de SMTP-vraag aan Joteck (stap
9) blijven bij de gebruiker, niet bij de agents.

**4. Stap 9 — de eindmail** — pas als alle drie de sites hierboven klaar
zijn: DNS-gegevens per domein uit Vercel ophalen, overzicht maken, en in
**1 mail** naar de ICT-partner sturen samen met de herinnering over de
SMTP-gegevens. TTL's verlagen en de daadwerkelijke switch zijn een losse
vervolgstap, pas na akkoord van de ICT-partner op een uitvoerdatum.
