# Werkassist — Stap 6b: correcte sitemap-mutatiegegevens

Vervolg op stap 6 in dezelfde worktree/branch (`fase3-werkassist`). Niet
pushen. Werk uitsluitend aan deze gerichte sitemapcorrectie.

## Bevinding

`PUBLIC_CONTENT_LAST_MODIFIED = '2026-09-22'` in `app/sitemap.ts` is een
controle-/auditdatum, geen aantoonbare wijzigingsdatum van elk van de vier
pagina's. Een sitemap `lastModified` moet de daadwerkelijke laatste
inhoudelijke wijziging van de individuele URL weergeven; een controledatum
geeft crawlers een fout signaal.

`changeFrequency` en `priority` zijn bovendien geen bruikbare Google-signalen
en zijn bij de andere sites in deze ronde bewust weggelaten.

## Opdracht

- Verwijder `PUBLIC_CONTENT_LAST_MODIFIED` en `lastModified` uit alle vier
  statische sitemapitems.
- Verwijder `changeFrequency` en `priority` uit de sitemapitems.
- Laat uitsluitend de vier bestaande publieke, absolute URL's over.
- De preview-noindex-wijziging in `lib/seo/site.ts`, `robots.ts` en
  `scripts/check-seo.mjs` is correct: niet terugdraaien.

## Checks

Voer beide omgevingen uit, met voor elke omgeving een eigen build:

```sh
env -u VERCEL_ENV npm run check:types && env -u VERCEL_ENV npx next build && env -u VERCEL_ENV npm run check:seo
VERCEL_ENV=preview npx next build && VERCEL_ENV=preview npm run check:seo
```

Rapporteer de aangepaste bestanden en commit-hash. Niet pushen.
