# Werkreturn — Stap 1: SEO/GEO (vergelijk en verbeter)

Je werkt aan de Werkreturn-website (Next.js), onderdeel van een groep van
vier labelsites (Werkreturn, Werkgroup, Werkassist, Werkverzuim) die
gezamenlijk worden opgeleverd. Repo: helloprofs/website-werkreturn.
Lokaal pad: `Werkreturn/Werkreturn website/website-werkreturn` binnen
`Werkgroup websites overkoepelend/`.

Context: stap 1 (SEO/GEO) is voor Werkreturn al eerder gedaan en gereviewd
(op main, t/m commit b9b05e8). Jij doet nu een kritische tweede blik en
verbeterslag — niet opnieuw vanaf nul.

Werk in een NIEUWE worktree op basis van de huidige main (niet main zelf
bewerken). Branch: `fase3-werkreturn`. Commit deze stap apart met een
duidelijke boodschap. Niet pushen — er wordt apart gereviewd en gemerged.

Harde grenzen:
- Raak geen content/tekst aan die met KvK, contractspartij (Werkreturn
  B.V. vs Werkgroup B.V.) of juridische goedkeuring te maken heeft — dat
  ligt nog open bij de opdrachtgever.
- Verzin geen NAW-gegevens, telefoonnummers, testimonials of
  openingstijden. Bestaande placeholders/TODO's in
  `lib/page-editor/defaults.ts` blijven staan (bekend, wacht op content
  van Marketing).
- Geen wijzigingen aan `components/ui/` of `components/sections/` zonder
  dit expliciet te melden in je rapport.
- Niets verwijderen.

## Wat er al staat

Het fundament staat al goed: unieke titles/descriptions, canonicals,
structured data, `public/llms.txt`, AI-crawlers toegestaan in
`app/robots.ts`, `font-display: swap`.

## Opdracht

- Titles ≤60 tekens, descriptions 150-160 tekens — check de exacte
  lengtes nu, niet alleen "ongeveer goed"
- JSON-LD: klopt ProfessionalService/Organization met de actuele NAW?
  Ontbreken er FAQPage-blokken op pagina's die wel FAQ-achtige content
  hebben?
- Interne links: is elke publieke pagina vanuit navigatie of footer
  bereikbaar?
- Performance/CWV: LCP-afbeeldingen `priority`? Onnodig grote
  afbeeldingen? Draai Lighthouse (mobiel + desktop) tegen een lokale
  productiebuild en rapporteer de scores.
- Voer kleine, veilige verbeteringen meteen door. Twijfelgevallen
  rapporteren, niet zelf beslissen.

## Checks

```
npm run check:types && npm run lint && npx next build && npm run check:links && npm run check:seo
```

## Rapportage

Wat gevonden, wat gefixt (met bestandspaden), wat bewust laten liggen en
waarom, Lighthouse-scores, en de commit-hash. Sluit af met de resultaten
van het check-harnas.
