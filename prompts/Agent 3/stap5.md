# Werkassist — Stap 5: CMS-fotobibliotheek

Vervolg op de vorige stappen. Werk verder in dezelfde worktree/branch
(`fase3-werkassist`). Niet pushen.

Repo: helloprofs/werkassist-website. Lokaal pad:
`Werkassist/werkassist-website` binnen `Werkgroup websites overkoepelend/`.

Harde grens: niets verwijderen — alleen registreren/toevoegen aan de
bibliotheek en rapporteren wat een kandidaat is om te verwijderen.

## Opdracht

Werkassist heeft weinig lokale afbeeldingen (~13 bestanden in
`public/images/`). Vergelijk met `lib/media/static-assets.ts`:

- Afbeeldingen in de repo maar niet geregistreerd → zelf toevoegen
- Ongebruikte afbeeldingen → NIET verwijderen, alleen rapporteren
- Check ook `public/images/labels/` — er is recent een nieuw
  headerlogo (`werkassist-header.png`) toegevoegd naast het bestaande
  `werkassist.png` (footer/opengraph/JSON-LD) — bevestig dat beide
  correct en bewust naast elkaar bestaan, geen verwarring/dubbeling
- Gezien het kleine aantal: is de bibliotheek te mager voor een
  contentmaker die straks nieuwe pagina's/secties wil samenstellen?
  Rapporteer of aanvulling vanuit een ander lokaal beeldmateriaal-archief
  zinvol is (niet zelf beelden verzinnen of van internet halen)

## Checks

```
npm run check:types && npx next build
```

## Rapportage

Lijst met: toegevoegd aan de bibliotheek (bestandspaden), kandidaten
voor verwijdering (met reden, niet uitgevoerd), en of aanvulling van de
bibliotheek zinvol lijkt. Commit-hash indien er wijzigingen zijn.
