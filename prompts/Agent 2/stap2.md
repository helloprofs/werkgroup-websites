# Werkgroup — Stap 2: Redirects

Vervolg op stap 1. Werk verder in dezelfde worktree/branch
(`fase3-werkgroup`) als stap 1 — als die er niet meer is, maak hem
opnieuw op basis van de huidige main. Niet pushen.

Repo: helloprofs/werkgroup-website. Lokaal pad:
`Werkgroup/Werkgroup-website` binnen `Werkgroup websites overkoepelend/`.

Bronmateriaal ligt er al:
`Werkgroup/Werkgroup-redirectinventarisatie-2026-09-15/` en
`Werkgroup-website/outputs/` (let op: dit bevat ook Werkverzuim-
gerelateerde exports — alleen Werkgroup-eigen URL's meenemen).

Harde grenzen: niets verwijderen, geen content-wijzigingen buiten
`next.config.ts`/`middleware.ts`/redirect-gerelateerde docs. Let op de
bestaande `/blog`-redirect-schaduw (blog staat momenteel "dicht" —
bewuste keuze, niet per ongeluk herstellen).

**Eerst opruimen voordat je begint**: de worktree bevat nog niet-gecommitte
wijzigingen uit stap 1b die niet in dat rapport stonden — `deborah.png` is
al omgezet naar `deborah.webp` en verwerkt in `data/vacatures.json` en twee
docs-bestanden (dit bestand wordt écht gebruikt op de vacaturepagina's).
Daarnaast staan er twee ongebruikte, niet-gekoppelde losse conversies
(`public/images/team/lindsey.webp`, `public/images/werkgroup/
casemanager-header.webp`) en een wijziging in `lib/media/static-assets.ts`.
Doe dit voordat je aan de redirects begint:
1. Commit de `deborah.webp`-wijziging apart (eigen commit, duidelijke
   boodschap) — dit is een echte, geteste fix die per ongeluk niet is
   gecommit.
2. Verwijder de ongebruikte `lindsey.webp`/`casemanager-header.webp`-
   bestanden weer (ze zitten nergens aan gekoppeld) en zet de bijbehorende
   regel in `static-assets.ts` terug, tenzij je ze alsnog aan een pagina
   koppelt — in dat geval: apart committen en in de rapportage vermelden.
3. Rapporteer kort wat je hier hebt aangetroffen en hoe je het hebt
   afgehandeld, vóór de rapportage over de redirects hieronder.

## Opdracht

- Volledige lijst oude URL's verzamelen
- Script/check die elke oude URL langs `next.config.ts` + `middleware.ts`
  legt: heeft redirect / geen redirect / naar 404
- Ontbrekende 301-redirects toevoegen (nooit 302)
- Geen ketens (A→B→C) en geen loops
- Query-strings en trailing slashes meenemen

## Checks

```
npm run check:types && npx next build && npm run check:redirects && npm run check:links
```

## Rapportage

Hoeveel URL's gecontroleerd, hoeveel redirects toegevoegd, resterende
ketens/loops (indien nog aanwezig), en de commit-hash.
