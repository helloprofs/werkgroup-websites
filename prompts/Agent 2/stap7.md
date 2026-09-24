# Werkgroup — Stap 7: Repo-opschoning (ANALYSE, niet uitvoeren)

Vervolg op de vorige stappen. Werk verder in dezelfde worktree/branch
(`fase3-werkgroup`). Niet pushen.

Repo: helloprofs/werkgroup-website. Lokaal pad:
`Werkgroup/Werkgroup-website` binnen `Werkgroup websites overkoepelend/`.

Belangrijk: dit is een ANALYSE-stap. Niets verwijderen of herstructureren
— alleen inventariseren en een voorstel opleveren dat later apart wordt
besproken en pas dan uitgevoerd.

## Opdracht

- Ongebruikte componenten/bestanden (geen imports/referenties meer)
- Dode/onbereikbare code
- Ongebruikte npm-dependencies
- Losse restanten van de fork — check specifiek of
  `images.remotePatterns` in `next.config.ts` nog een `werkreturn.nl`-
  restant bevat, en of er nog meer van dat soort sporen zijn
- Rommelige/inconsistente mapstructuur

## Checks

```
npm run check:types && npx next build
```

(alleen ter bevestiging dat er geen wijzigingen zijn gedaan)

## Rapportage

Een duidelijke lijst met voorstellen: wat, waar (bestandspad), waarom
(reden/bewijs dat het ongebruikt is), en het risiconiveau van
verwijderen. Geen commit nodig als er niets gewijzigd is.
