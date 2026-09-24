# Werkgroup — Stap 6b: correcte sitemap-mutatiegegevens

Vervolg op stap 6 in dezelfde worktree/branch (`fase3-werkgroup`). Niet
pushen. Werk uitsluitend aan deze gerichte sitemapcorrectie.

## Bevinding

`app/sitemap.ts` gebruikt `vacature.datePosted` als `lastModified`. Een
publicatiedatum is niet automatisch de laatste inhoudelijke wijziging van de
vacaturepagina. De database heeft wel `updated_at`, maar
`getPublishedVacatures()` levert die waarde nu niet mee. Het huidige
`lastModified`-signaal wordt dus onbetrouwbaar zodra een vacature wordt
bijgewerkt.

`changeFrequency` en `priority` leveren Google geen bruikbaar signaal op en
zijn bij de andere twee sites in deze ronde bewust weggelaten.

## Opdracht

- Verwijder `parseVacatureDate()` en de `lastModified`-toekenning op basis van
  `datePosted` uit `app/sitemap.ts`.
- Laat `lastModified` voor vacatures weg totdat de storage-laag een echt
  `updatedAt`-veld teruggeeft. Breid de database/storage-laag hiervoor niet
  uit in deze stap.
- Verwijder ook `changeFrequency` en `priority` uit alle sitemap-items;
  behoud uitsluitend absolute URL's en bewezen `lastModified`-waarden van
  CMS-artikelen.
- Houd de bestaande dynamische opname van gepubliceerde vacatures en de
  blogschakelaar intact.

## Checks

```sh
npm run check:types && npx next build && npm run check:seo
```

Rapporteer de aangepaste bestanden en commit-hash. Niet pushen.
