# Werkgroup — Stap 1: SEO/GEO

Je werkt aan de Werkgroup-website (Next.js), onderdeel van een groep van
vier labelsites (Werkreturn, Werkgroup, Werkassist, Werkverzuim) die
gezamenlijk worden opgeleverd. Repo: helloprofs/werkgroup-website.
Lokaal pad: `Werkgroup/Werkgroup-website` binnen
`Werkgroup websites overkoepelend/`.

Context: dit is de eerste volledige SEO/GEO-ronde voor Werkgroup.
Werkreturn heeft dit al gehad; enkele patronen die daar zijn neergezet
gelden ook hier (llms.txt, AI-crawlers expliciet in robots.ts,
font-display: swap, canonicals met afsluitende slash, titles ≤60
tekens, descriptions 150-160 tekens) — gebruik die als referentiestijl,
niet als letterlijke kopie (Werkgroup heeft eigen content/diensten/
vacatures).

Werk in een NIEUWE worktree op basis van de huidige main (niet main zelf
bewerken). Branch: `fase3-werkgroup`. Commit deze stap apart met een
duidelijke boodschap. Niet pushen — er wordt apart gereviewd en gemerged.

Harde grenzen:
- Werkgroup heeft als enige `blog-builder`, `vacatures-builder` en
  `api/shared-content` — dat is bewust label-specifiek.
- Verzin geen NAW-gegevens, telefoonnummers, testimonials, vacatureteksten
  of openingstijden.
- Geen wijzigingen aan `components/ui/` of `components/sections/` zonder
  dit expliciet te melden in je rapport.
- Niets verwijderen.

## Opdracht

- Metadata: unieke title (≤60 tekens) + description (150-160 tekens) op
  élke pagina inclusief vacature-detailpagina's en blogposts, canonical
  correct, `metadataBase` gezet
- OG/Twitter: `opengraph-image.tsx` rendert correct
- Koppenstructuur: precies één h1 per pagina
- Structured data: Organization, ProfessionalService (NAW),
  BreadcrumbList, FAQPage waar relevant, en `JobPosting` voor elke
  vacature (dit is Werkgroup-specifiek, de andere twee hebben dit niet)
- Interne links: alle belangrijke pagina's (incl. vacatures) bereikbaar
  vanuit navigatie/footer
- Alt-teksten op alle afbeeldingen, ook vacature- en bloggerelateerde
- AI/GEO: `public/llms.txt` toevoegen (diensten, vacatures-overzicht,
  contact, belangrijkste routes), `robots.ts` AI-crawlers (GPTBot,
  ClaudeBot, PerplexityBot, Google-Extended) bewust toestaan/blokkeren —
  zelfde keuze als Werkreturn maakte (toestaan), tenzij je een goede
  reden ziet om af te wijken — motiveer dat dan expliciet
- Performance/CWV: Lighthouse mobiel + desktop tegen lokale
  productiebuild, LCP-afbeeldingen `priority`, fonts `display: swap`
- Voer quick wins meteen door; grotere content-keuzes rapporteren

## Checks

```
npm run check:types && npm run lint && npx next build && npm run check:links && npm run check:seo
```

## Rapportage

Wat gevonden, wat gefixt (met bestandspaden), wat bewust laten liggen en
waarom, Lighthouse-scores, en de commit-hash. Sluit af met de resultaten
van het check-harnas.
