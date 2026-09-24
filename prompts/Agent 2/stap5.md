# Werkgroup — Stap 5: CMS-fotobibliotheek

Vervolg op de vorige stappen. Werk verder in dezelfde worktree/branch
(`fase3-werkgroup`). Niet pushen.

Repo: helloprofs/werkgroup-website. Lokaal pad:
`Werkgroup/Werkgroup-website` binnen `Werkgroup websites overkoepelend/`.

Harde grens: niets verwijderen — alleen registreren/toevoegen aan de
bibliotheek en rapporteren wat een kandidaat is om te verwijderen.

## Opdracht

Werkgroup heeft de meeste afbeeldingen van de drie sites (~69 bestanden
in `public/images/`). Vergelijk met `lib/media/static-assets.ts`:

- Afbeeldingen in de repo maar niet geregistreerd → zelf toevoegen aan
  `static-assets.ts`
- Ongebruikte afbeeldingen (grep op bestandsnaam door de hele repo,
  inclusief klantlogo's in `logos/` — check of die allemaal nog ergens
  getoond worden) → NIET verwijderen, alleen rapporteren
- Zijn er dubbele/vergelijkbare afbeeldingen die opgeruimd kunnen
  worden?

## Checks

```
npm run check:types && npx next build
```

## Rapportage

Lijst met: toegevoegd aan de bibliotheek (bestandspaden), kandidaten
voor verwijdering (met reden, niet uitgevoerd), en eventuele
structuuropmerkingen. Commit-hash indien er wijzigingen zijn.
