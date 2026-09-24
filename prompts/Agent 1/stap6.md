# Werkreturn — Stap 6: Sitemap & robots

Vervolg op de vorige stappen. Werk verder in dezelfde worktree/branch
(`fase3-werkreturn`). Niet pushen.

Repo: helloprofs/website-werkreturn. Lokaal pad:
`Werkreturn/Werkreturn website/website-werkreturn` binnen
`Werkgroup websites overkoepelend/`.

## Opdracht

- `app/sitemap.ts`: alle publieke pagina's erin, geen beheer/
  page-editor/bedankt/API-routes, absolute URL's met het echte domein,
  `lastModified` klopt (niet overal "nu")
- `app/robots.ts`: disallow-regels compleet, sitemap-regel aanwezig,
  preview-deploys op noindex
- Kijk naar wat enterprise-sites (grote SaaS/dienstverleners) standaard
  goed doen op sitemap/robots-gebied — bijv. changefreq/priority
  weglaten als Google ze toch negeert, sitemap-index bij veel pagina's
  (hier waarschijnlijk niet relevant qua schaal, maar noem het als het
  wel relevant wordt), image-sitemap-hints voor belangrijke hero's.
  Rapporteer concrete verbeterpunten en voer de veilige ervan meteen
  door.

## Checks

```
npm run check:types && npx next build && npm run check:seo
```

## Rapportage

Wat gevonden, wat gefixt (met bestandspaden), grotere aanbevelingen die
je hebt laten liggen en waarom. Commit-hash.
