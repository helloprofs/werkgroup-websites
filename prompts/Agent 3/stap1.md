# Werkassist — Stap 1: SEO/GEO

Je werkt aan de Werkassist-website (Next.js), onderdeel van een groep van
vier labelsites (Werkreturn, Werkgroup, Werkassist, Werkverzuim) die
gezamenlijk worden opgeleverd. Repo: helloprofs/werkassist-website.
Lokaal pad: `Werkassist/werkassist-website` binnen
`Werkgroup websites overkoepelend/`.

Context: dit is de eerste volledige SEO/GEO-ronde voor Werkassist.
Werkreturn heeft dit al gehad; enkele patronen die daar zijn neergezet
gelden ook hier (llms.txt, AI-crawlers expliciet in robots.ts,
font-display: swap, canonicals met afsluitende slash, titles ≤60
tekens, descriptions 150-160 tekens) — gebruik die als referentiestijl.
Werkassist is de kleinste van de drie sites (10 publieke pagina's), dus
dit zou relatief snel moeten gaan.

Werk in een NIEUWE worktree op basis van de huidige main (niet main zelf
bewerken). Branch: `fase3-werkassist`. Commit deze stap apart met een
duidelijke boodschap. Niet pushen — er wordt apart gereviewd en gemerged.

Harde grenzen:
- Verzin geen NAW-gegevens of telefoonnummers. Bevestigd correct adres:
  Zwarteweg 110 D, 1431 VM Aalsmeer — gebruik dat overal consistent.
- Geen wijzigingen aan `components/ui/` of `components/sections/` zonder
  dit expliciet te melden. Bekende bewuste restanten die met opzet zijn
  laten staan: "Bel Werkgroup"-knoptekst in
  `components/ui/fixed-call-button.tsx:10`, en een ongebruikte
  Werkreturn-fallback in `components/ui/return-scroll-story.tsx:129` —
  laat die met rust tenzij je een expliciete reden hebt, en meld het dan
  apart.
- Niets verwijderen.
- Werkassist heeft geen mobiel hamburgermenu (bewuste keuze eerder
  geconstateerd) — dat hoort zo, niet "repareren".

## Opdracht

- Metadata: unieke title (≤60 tekens) + description (150-160 tekens) op
  élke pagina, canonical correct, `metadataBase` gezet
- OG/Twitter: `opengraph-image.tsx` rendert correct
- Koppenstructuur: precies één h1 per pagina
- Structured data: Organization, ProfessionalService (met het
  bevestigde Aalsmeer-adres), BreadcrumbList, FAQPage waar relevant
- Interne links: alle belangrijke pagina's bereikbaar vanuit
  navigatie/footer
- Alt-teksten op alle afbeeldingen
- AI/GEO: `public/llms.txt` toevoegen (diensten, contact, belangrijkste
  routes — zie Werkreturns `public/llms.txt` als voorbeeldformaat),
  `robots.ts` AI-crawlers (GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended) bewust toestaan — zelfde keuze als Werkreturn, tenzij
  je een goede reden ziet om af te wijken
- Performance/CWV: Lighthouse mobiel + desktop tegen lokale
  productiebuild, let specifiek op de homepage-hero-afbeeldingen (deze
  hadden recent al een `unoptimized`-fix nodig — check of dat nog
  steeds nodig is of dat het inmiddels anders opgelost kan worden),
  fonts `display: swap`
- Voer quick wins meteen door; grotere content-keuzes rapporteren

## Checks

```
npm run check:types && npm run lint && npx next build && npm run check:links && npm run check:seo
```

## Rapportage

Wat gevonden, wat gefixt (met bestandspaden), wat bewust laten liggen en
waarom, Lighthouse-scores, en de commit-hash. Sluit af met de resultaten
van het check-harnas.
