# Werkassist — batchplan

Eén document. Geen aparte takenlijst met checkboxes eronder: bij Werkgroup
stonden er 277 regels detail naast een faseplan, en elke Codex-opdracht begon
met het opnieuw bundelen van tien tot twintig regels tot iets uitvoerbaars.
Dat bundelwerk zit hier al in de batch.

**Een batch = één Codex-prompt = één commit.** Acht batches. Wat er binnen een
batch precies moet gebeuren bepaalt Claude op het moment zelf uit de bron; dit
plan legt alleen vast *wat* er af moet zijn, *waarom het nu aan de beurt is* en
*waaraan je ziet dat het klaar is*.

Site: onepage `/` plus `/contact/`, met `/bedankt/`, `/privacyverklaring/`,
`/cookiebeleid/` en een 404 eronder. Basis: kloon van `werkgroup-website`.

| # | Batch | Klaar als | Status |
|---|---|---|---|
| 0 | Sloop en repo-identiteit | merkgrep schoon, `npm run check` groen op twee lege pagina's | open |
| 1 | Merkfundament | tokens, logo, favicon, OG, header, footer, zes routes bestaan | open |
| 2 | De onepage | alle secties uit de copy staan gerenderd in de HTML | open |
| 3 | Contact en e-mail | testmail aantoonbaar aangekomen | open |
| 4 | CMS | twee formulieren, tekst wisselt aantoonbaar op de site | open |
| 5 | SEO en meting | `check:seo` groen na verse build, events gemeten in GA4 | open |
| 6 | Oude URL's | elke URL met verkeer geeft één hop naar een 200 | open |
| 7 | Livegang | go/no-go afgevinkt, productie indexeerbaar | open |

---

## 0. Sloop en repo-identiteit

Vóór alles, want elke batch daarna kost dubbel zolang de Werkreturn- en
Werkgroup-erfenis er nog in zit. De tabel "Wat blijft en wat er uit gaat" in
de startprompt is de opdracht. Daarbij: pakketnaam, `README.md`, `AGENTS.md`,
cookienaam `werkassist-cookie-consent`, beheercookie `werkassist_builder_auth`,
het `build`-script zonder `seed-blob`, en de redirecttabel in `next.config.ts`
leeg.

Klaar als: `grep -ril "werkgroup\|werkreturn\|werkverzuim"` over `app`,
`components`, `lib`, `public` en `data` alleen nog de bewuste footer-links naar
de zusterlabels geeft, en `npm run check` groen is.

## 1. Merkfundament

De tokenlaag gaat vóór de pagina's — dat is de enige harde volgorde-eis uit de
drie eerdere bouwrondes. Anders bouw je de secties twee keer.

Werkassist erft de typografie en de neutrale tokens van het huisstijlhandboek
2026 en zet `#8F4191` als eigen labelkleur. Die kleur haalt wél tekstcontrast
op wit, dus hij mag als vlak onder tekst — dat is het verschil met het
Werkgroup-oranje. Verder: logo, favicon, OG-afbeelding, header met één CTA,
footer met de links naar de zusterlabels, en de zes routes als lege schillen.

Klaar als: geen hardgecodeerde kleur meer buiten de tokenlaag, en alle zes
routes geven 200 met de juiste header en footer.

## 2. De onepage

De hele `/` in één keer, sectie voor sectie uit de webcopy. Neem per sectie het
dichtstbijzijnde bestaande component uit `components/sections/` en verwijder in
dezelfde commit wat je niet gebruikt.

Klaar als: elke sectie uit de copy staat letterlijk in de gerenderde HTML
(gemeten met de RSC-payload eraf geknipt), de H1-H2-hiërarchie klopt, en er
staat geen zin op de pagina die niet uit de copy komt.

## 3. Contact en e-mail

Contactpagina, formulier, `/api/contact/`, bedankpagina, reCAPTCHA v3, rate
limiting en de SMTP-mailbox. Dit is de batch die bij alle drie de vorige sites
het langst open bleef; begin er daarom vroeg aan en niet pas in de week van de
livegang.

Klaar als: een echte testmail is aangekomen op het Werkassist-adres, en een
inzending zonder geldig reCAPTCHA-token wordt geweigerd.

## 4. CMS

De dunne kern van de page editor: `defaults.ts` als schema én live tekst,
Postgres, login, en twee handgeschreven formulieren voor `/` en `/contact/`.
Geen mediabibliotheek, geen gedeelde content, geen concept/publicatiestatus.

Klaar als: een tekstwijziging via `/page-editor/` verschijnt op productie, en
`/beheer/` en de beheer-API's geven 401 of een redirect naar de login zonder
sessie.

## 5. SEO en meting

Titels, metabeschrijvingen, canonicals, sitemap, robots, Organization-schema,
de `EXPECTED`-tabel in `check-seo.mjs`, en aan de meetkant: GTM-container,
Consent Mode v2 vóór de loader, cookiebanner, en de events die de twee
pagina's kennen (CTA, telefoon, e-mail, formulierstart, -succes, -fout).

Klaar als: `npx next build && npm run check:seo` groen is, en elk event
zichtbaar in GA4 Realtime met een gewone browser — niet headless, en wacht
tien seconden.

## 6. Oude URL's

werkassist.nl draait nu al. Haal de paden met vertoningen over de laatste
zestien maanden uit Search Console (de tooling staat in `Werkgroup/google-api`),
leg ze aan Wendy voor met klikken en vertoningen erbij, en zet het akkoord om
in redirects in `next.config.ts` — alle 301, `destination` mét slash.

Bij een onepage komen de meeste oude URL's op `/` uit. Dat is een besluit van
Wendy, geen aanname van Claude.

Klaar als: `npm run check:redirects` groen, en `check:routes` tegen de
draaiende site laat voor elke oude URL precies één hop naar een 200 zien.

## 7. Livegang

Domein koppelen, `NEXT_PUBLIC_SITE_URL` uit productie halen, sitemap indienen,
en de go/no-go langslopen: juridische documenten definitief, formulieren getest
op productie, consent en GA4 gecontroleerd, redirects getest, productie
indexeerbaar, rollback beschikbaar (het A-record heeft TTL 600, dus terug is
binnen tien minuten zichtbaar).

Klaar als: productie is indexeerbaar, `robots.txt` bevat geen `Disallow: /`
meer, en een volledige crawl geeft nul 4xx en 5xx.

---

## Wat er nog van Nick of Wendy moet komen

Dit blokkeert batches, niet het starten.

| Wat | Voor welke batch | Van wie |
|---|---|---|
| Goedgekeurde webcopy voor de onepage en contact | 2 | Wendy |
| Logo op volle resolutie, favicon en beeldmateriaal Werkassist | 1 | Nick |
| Mailbox, SMTP-gegevens met SMTP AUTH aan, ontvanger van het formulier | 3 | Nick / Wendy |
| GitHub-repo, Vercel-project, Postgres, env-variabelen | 0 en 4 | Nick |
| reCAPTCHA-site voor de Werkassist-domeinen | 3 | Nick |
| GA4-property en GTM-container voor Werkassist | 5 | Nick |
| Search Console-toegang op werkassist.nl en akkoord op de bestemmingen | 6 | Nick / Wendy |
| Privacyverklaring en cookiebeleid op naam van Werkassist | 7 | Nick |
| Livegangdatum | 7 | Nick |
