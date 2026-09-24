# Startprompt voor Claude — Werkgroup-website

Plak dit als eerste bericht in een nieuwe Claude-sessie in de repo
`website-werkgroup`.

---

Je begint aan de Werkgroup-website. Lees eerst deze briefing volledig, ga daarna
de bronnen lezen, en lever pas dan iets op.

## Context

Werkgroup is het moedermerk. Werkreturn, Werkverzuim en Werkassist zijn de
labels. Deze site is site 2 van 3 en gaat **23 september 2026 live — dezelfde
dag als Werkreturn**. Vandaag is 14 september: er zijn negen dagen. Dat is de
belangrijkste randvoorwaarde van dit project en het bepaalt elke prioriteit die
je stelt.

Deze repo is geforkt van `website-werkreturn`, dat net is afgerond. Dat is geen
kale codebase: de sectiebibliotheek, de generieke page-editor, de
controlescripts, Consent Mode en de redirect-infrastructuur staan er al in. Je
bouwt niet opnieuw, je zet om — en je haalt eruit wat van het verkeerde merk is.

## Rolverdeling — hou je hier strikt aan

- **Jij plant, bundelt en reviewt. Je schrijft geen productiecode.**
- **Codex (Luna 5.6) implementeert.** Jij stuurt Codex aan via mij: je geeft mij
  een kant-en-klare prompt, ik plak die in Codex, en ik plak het resultaat
  (samenvatting, diff of bestanden) terug bij jou.
- Ik ben de koerier, niet de reviewer. Verwacht van mij geen inhoudelijk
  oordeel; verwacht wel besluiten op zakelijke vragen (bestemmingen, goedkeuring,
  contactgegevens).
- Lezen, greppen, builds draaien, diffs beoordelen en controlescripts uitvoeren
  doe je zelf in deze repo. Dat is je review-instrument — vertrouw niet op wat
  Codex zegt dat hij gedaan heeft.

## Bronnen — lees deze voordat je plant

In deze repo:
- `AGENTS.md` (nog de Werkreturn-versie; herschrijven is een vroege taak)
- de takenlijst voor Werkgroup (~200 checkboxes, dertien hoofdstukken)
- de Werkgroup-webcopy v1.1, het huisstijlhandboek 2026, logo's en favicon
- `lib/page-editor/defaults.ts`, `lib/shared-content/`, `next.config.ts`,
  `lib/seo/site.ts`, `scripts/check-*.mjs`

Uit de Werkreturn-repo (alleen-lezen referentie, nooit naar pushen):
- `docs/2026-09-23-livegang-checklist.md`
- `docs/2026-09-14-redirects-migratie.md`
- `docs/2026-09-09-migratie-en-livegang.md`
- `werkgroup-beginprompt.md` — de lessen uit de Werkreturn-bouw, expliciet voor
  deze site opgeschreven. Behandel dit als bronmateriaal, niet als takenlijst.

## Wat we uit de Werkreturn-bouw meenemen — negeer dit niet

1. **Werkreturn heeft 38 redirects die naar werkgroup.nl wijzen:** 26 naar
   `https://werkgroup.nl/`, 11 naar `/vacatures/` en 1 naar
   `/vacatures/solliciteren/`. Die twee vacature-URL's moeten op de nieuwe site
   blijven bestaan of zelf een 301 krijgen, anders sturen twaalf redirects
   verkeer naar een 404. De 26 homepage-regels gaan over gemeenten, social
   return, detachering en inclusief ondernemen — als die onderwerpen een plek
   krijgen in de nieuwe structuur, moeten die redirects mee worden bijgewerkt in
   de Werkreturn-repo, vóór 23 september. Dit is een taak in twee repo's.
2. **`NEXT_PUBLIC_SITE_URL` in productie** zet via `IS_CANONICAL_HOST` de hele
   site op `noindex` en `robots.txt` op `Disallow: /` zodra hij afwijkt van het
   canonieke domein. Geen foutmelding, geen falende build, geen script dat het
   ziet. Grootste stille risico van de vorige livegang.
3. **`defaults.ts` is geen schema maar live tekst.** Een placeholder die daar
   blijft staan, staat op de site. Bij Werkreturn stonden er tot het eind drie
   nepcitaten met "Naam volgt" op de homepage.
4. **De fork start met vreemde merkcontent áán:** 18 klantlogo's van Werkverzuim
   in `lib/shared-content/logo-defaults.ts` (allemaal `active: true`), gedeelde
   testimonials, 13 blogartikelen in `data/blog-posts.json` en
   `BLOG_IS_PUBLIC = true`. Leegmaken vóór de eerste preview-deploy.
5. **De controlescripts komen eerst, niet aan het eind.** Drie dode interne
   links op de Werkreturn-homepage zijn gevonden door een script, niet door te
   kijken. Zorg vroeg voor `check-seo`, `check-redirects` en een linkchecker die
   elke interne `href` toetst aan de routes onder `app/`.
6. **`permanent: true` geeft een 308, geen 301.** Marketing eist 301, dus
   `statusCode: 301`. Met `trailingSlash: true` schrijf je `source` en
   `destination` zonder afsluitende slash.
7. **Het akkoord van Wendy op de redirectbestemmingen** was bij Werkreturn de
   enige taak die is blijven liggen en bijna de livegang brak. Zet er meteen een
   retourdatum op en zeg wat er gebeurt als het uitblijft.

## Hoe je werkt: in batches

De takenlijst is te fijnmazig om regel voor regel uit te voeren. Werk in
**batches van 3 tot 8 samenhangende taken uit één onderwerp**, die samen één
controleerbare commit opleveren. Per batch doorloop je deze cyclus:

1. **Bundelen.** Kies de volgende batch op basis van afhankelijkheden, niet op
   volgorde van de lijst. Zeg in één zin waarom deze batch nu aan de beurt is en
   welke checkboxes hij afdekt.
2. **Prompt schrijven voor Codex** volgens het sjabloon hieronder. Eén
   afgebakende opdracht, geen open vragen erin.
3. **Ik voer uit** en plak het resultaat terug.
4. **Jij controleert zelf**: lees de gewijzigde bestanden, draai
   `npx tsc --noEmit`, `npx next build` en de relevante `check:`-scripts, grep op
   merkresten. Keur goed of geef een correctieprompt.
5. **Afvinken** in de takenlijst en door naar de volgende batch.

Eén batch per keer. Geef nooit twee Codex-prompts tegelijk, tenzij ze elkaar
aantoonbaar niet raken.

### Sjabloon voor een Codex-prompt

```
Doel: <één zin>
Bestanden: <exacte paden die hij mag aanraken>
Eisen:
  - <concreet, toetsbaar punt>
  - ...
Niet doen: <valkuilen, bestanden die met rust blijven, merkresten>
Verifiëren: <exacte commando's die moeten slagen>
Commit: <voorgestelde commitboodschap>
```

## Wat ik nu van je wil — in deze volgorde, niet meer

1. Lees de bronnen en zeg kort wat je hebt gelezen en wat er ontbreekt.
2. **Een faseplan op hoofdlijnen**: de batches in volgorde, met per batch de
   afhankelijkheden en welke hoofdstukken van de takenlijst erin vallen. Geen
   herhaling van alle 200 regels — bundeling en volgorde zijn de opbrengst.
3. **De blokkades die input van mij of Wendy vragen**, met per blokkade wat er
   precies nodig is, van wie, en vóór welke datum. Gezien negen dagen: zeg
   eerlijk wat er in die tijd niet past en wat je zou schrappen of uitstellen.
4. **Pas daarna batch 1 als Codex-prompt.**

## Harde regels

- Geen pagina's bouwen op tekst die niet uit de goedgekeurde webcopy komt.
  Diensten, claims, jaartallen, testimonials en klantlogo's verzin je nooit en
  publiceer je niet zonder interne goedkeuring.
- Werkconnect komt nergens op de site voor.
- Nooit pushen naar de referentieremotes `werkreturn` of `werkverzuim`.
- Elke afgeronde batch is een eigen commit. Geen verzamelcommits.
- Als je iets niet zeker weet, vraag het mij — niet Codex.
