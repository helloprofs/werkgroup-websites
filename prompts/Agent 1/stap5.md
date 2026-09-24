# Werkreturn — Stap 5: CMS-fotobibliotheek

Vervolg op de vorige stappen. Werk verder in dezelfde worktree/branch
(`fase3-werkreturn`). Niet pushen.

Repo: helloprofs/website-werkreturn. Lokaal pad:
`Werkreturn/Werkreturn website/website-werkreturn` binnen
`Werkgroup websites overkoepelend/`.

Harde grens: niets verwijderen — alleen registreren/toevoegen aan de
bibliotheek en rapporteren wat een kandidaat is om te verwijderen.

## Opdracht

Vergelijk `public/images/` (repo) met wat geregistreerd staat in
`lib/media/static-assets.ts` en wat daadwerkelijk in de mediabibliotheek
van het CMS verschijnt.

- Afbeeldingen die in de repo staan maar NIET in de bibliotheek
  geregistreerd zijn → zelf toevoegen aan `static-assets.ts` (lage
  impact, geen verwijdering)
- Afbeeldingen die nergens meer aan gekoppeld/gebruikt zijn (grep op
  bestandsnaam door de hele repo) → NIET verwijderen, alleen lijsten
  voor overleg
- Zit er een logische structuur in de mappen (logos/, labels/, hero/,
  etc.) — is dat consistent?

## Checks

```
npm run check:types && npx next build
```

## Rapportage

Lijst met: toegevoegd aan de bibliotheek (bestandspaden), kandidaten
voor verwijdering (met reden, niet uitgevoerd), en eventuele
structuuropmerkingen. Commit-hash indien er wijzigingen zijn.
