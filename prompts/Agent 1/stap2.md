# Werkreturn — Stap 2: Redirects (check)

Vervolg op stap 1. Werk verder in dezelfde worktree/branch
(`fase3-werkreturn`) als stap 1 — als die er niet meer is, maak hem
opnieuw op basis van de huidige main. Niet pushen.

Repo: helloprofs/website-werkreturn. Lokaal pad:
`Werkreturn/Werkreturn website/website-werkreturn` binnen
`Werkgroup websites overkoepelend/`.

Context: redirects zijn voor Werkreturn al eerder volledig doorgelicht
(129 URL's gecontroleerd, 121 redirects, 0 ontbrekend, geen
ketens/loops). Jij doet een hercheck — is er sindsdien iets bijgekomen?

Harde grenzen: niets verwijderen, geen content-wijzigingen buiten
`next.config.ts`/`middleware.ts`/redirect-gerelateerde docs.

## Opdracht

- Draai `npm run check:redirects` en bekijk het resultaat
- Kijk nog eens in `docs/url-inventaris.md` en eventuele nieuwe Search
  Console-exports (als die er zijn) of er sinds de laatste ronde nieuwe
  oude URL's zijn opgedoken
- Voeg ontbrekende redirects toe (301, nooit 302)
- Check opnieuw op ketens (A→B→C) en loops
- Query-strings en trailing slashes meenemen

Als alles nog klopt: meld dat kort, geen onnodige wijzigingen forceren.

## Checks

```
npm run check:types && npx next build && npm run check:redirects && npm run check:links
```

## Rapportage

Wat gecontroleerd, wat toegevoegd/gewijzigd (of bevestiging dat alles nog
klopt), en de commit-hash (indien van toepassing). Sluit af met de
resultaten van het check-harnas.
