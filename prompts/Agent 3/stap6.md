# Werkassist — Stap 6: Sitemap & robots

Vervolg op de vorige stappen. Werk verder in dezelfde worktree/branch
(`fase3-werkassist`). Niet pushen.

Repo: helloprofs/werkassist-website. Lokaal pad:
`Werkassist/werkassist-website` binnen `Werkgroup websites overkoepelend/`.

## Opdracht

- `app/sitemap.ts`: alle publieke pagina's erin, geen beheer/
  page-editor/bedankt/API-routes, absolute URL's met het echte domein,
  kloppende `lastModified`
- `app/robots.ts`: disallow compleet, sitemap-regel aanwezig, preview op
  noindex
- Kijk naar enterprise-standaarden zoals bij de andere twee sites in
  deze ronde. Rapporteer en voer veilige verbeteringen door.

## Checks

```
npm run check:types && npx next build && npm run check:seo
```

## Rapportage

Wat gevonden, wat gefixt (met bestandspaden), grotere aanbevelingen die
je hebt laten liggen en waarom. Commit-hash.
