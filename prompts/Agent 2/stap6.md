# Werkgroup — Stap 6: Sitemap & robots

Vervolg op de vorige stappen. Werk verder in dezelfde worktree/branch
(`fase3-werkgroup`). Niet pushen.

Repo: helloprofs/werkgroup-website. Lokaal pad:
`Werkgroup/Werkgroup-website` binnen `Werkgroup websites overkoepelend/`.

## Opdracht

- `app/sitemap.ts`: alle publieke pagina's + vacatures + blogposts (als
  blog weer open gaat) erin, geen beheer/page-editor/bedankt/
  API-routes, absolute URL's met het echte domein, kloppende
  `lastModified`
- `app/robots.ts`: disallow compleet, sitemap-regel aanwezig, preview op
  noindex
- Kijk naar enterprise-standaarden (vergelijkbaar met wat bij Werkreturn
  al is gedaan): sitemap-index als het aantal pagina's groeit (vacatures
  kunnen snel groeien), consistent gebruik van priority/changefreq of ze
  juist weglaten. Rapporteer en voer veilige verbeteringen door.

## Checks

```
npm run check:types && npx next build && npm run check:seo
```

## Rapportage

Wat gevonden, wat gefixt (met bestandspaden), grotere aanbevelingen die
je hebt laten liggen en waarom. Commit-hash.
