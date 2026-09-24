# Werkassist — Stap 2: Redirects

Vervolg op stap 1. Werk verder in dezelfde worktree/branch
(`fase3-werkassist`) als stap 1 — als die er niet meer is, maak hem
opnieuw op basis van de huidige main. Niet pushen.

Repo: helloprofs/werkassist-website. Lokaal pad:
`Werkassist/werkassist-website` binnen `Werkgroup websites overkoepelend/`.

Bronmateriaal: `Werkassist/batch6-oude-urls.csv` en eventuele oudere
WordPress-sitemap/Search Console-exports die je in de repo of
`Werkassist/`-map vindt.

Harde grenzen: niets verwijderen, geen content-wijzigingen buiten
`next.config.ts`/`middleware.ts`/redirect-gerelateerde docs.

## Opdracht

- Volledige lijst oude URL's verzamelen
- Elke oude URL langs `next.config.ts` + `middleware.ts` leggen: heeft
  redirect / geen redirect / naar 404
- Ontbrekende 301-redirects toevoegen (nooit 302)
- Geen ketens (A→B→C) en geen loops, query-strings en trailing slashes
  meenemen

## Checks

```
npm run check:types && npx next build && npm run check:redirects && npm run check:links
```

## Rapportage

Hoeveel URL's gecontroleerd, hoeveel redirects toegevoegd, resterende
ketens/loops (indien nog aanwezig), en de commit-hash.
