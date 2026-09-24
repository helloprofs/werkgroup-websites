# Werkassist — Stap 7: Repo-opschoning (ANALYSE, niet uitvoeren)

Vervolg op de vorige stappen. Werk verder in dezelfde worktree/branch
(`fase3-werkassist`). Niet pushen.

Repo: helloprofs/werkassist-website. Lokaal pad:
`Werkassist/werkassist-website` binnen `Werkgroup websites overkoepelend/`.

Belangrijk: dit is een ANALYSE-stap. Niets verwijderen of herstructureren
— alleen inventariseren en een voorstel opleveren dat later apart wordt
besproken en pas dan uitgevoerd.

## Opdracht

- Ongebruikte componenten/bestanden (geen imports/referenties meer)
- Dode/onbereikbare code
- Ongebruikte npm-dependencies
- Restanten van andere labels — er is eerder al een grote opschoning
  geweest van geërfde Werkgroup-content, check of er nog iets is blijven
  liggen
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
