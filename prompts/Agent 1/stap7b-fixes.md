# Werkreturn — Stap 7b: veilige harde opschoning

Werk verder in dezelfde worktree/branch (`fase3-werkreturn`). Niet pushen.

De analyse van stap 7 is beoordeeld. Dit is een **uitvoer-stap**, maar alleen
voor de hieronder expliciet goedgekeurde, aantoonbaar veilige opschoning.

## Uitvoeren

1. Verwijder met npm, inclusief lockfile, deze aantoonbaar ongebruikte
   dependencies:

   - `@hookform/resolvers`
   - `@tailwindcss/typography`
   - `tw-animate-css`

   Er is geen import, Tailwind-pluginconfiguratie, `prose`-gebruik of
   React-Hook-Form-gebruik buiten manifests.

2. Ruim de redundant geworden ESLint-configuratie op:

   - verwijder `.eslintrc.json`; de actieve flat config is
     `eslint.config.mjs`;
   - verwijder in `eslint.config.mjs` de ongebruikte imports van `node:path`
     en `node:url`, plus de ongebruikte `__filename`/`__dirname`-constanten.

3. Verwijder uitsluitend de losse, accidentele regel `zz` aan het einde van
   `README.md`.

## Expliciet niet doen

- **Geen componenten verwijderen, verplaatsen of herstructureren.** Ook de
  ongebruikte UI- en page-editorcomponenten blijven vooralsnog als interne
  componentbibliotheek beschikbaar.
- Laat daarom ook `@radix-ui/react-slot` en
  `class-variance-authority` staan: zij horen bij die bewaarde
  componentbibliotheek.
- `playwright` blijft staan: `scripts/shot.mjs` importeert het werkelijk.
- Verwijder geen media, `metadata.json`, CMS-/page-editorfunctionaliteit,
  analytics-schema's, docs of outputs.
- Pas geen video-cacheheaders aan. De poster-framebestanden bestaan en worden
  gebruikt in metadata en blog/kennis-routes; de eerdere analyse dat ze
  ontbraken was onjuist.
- Geen wijzigingen aan routes, SEO, redirects, tracking of formulieren.

## Verplicht controleren

```bash
npm run check:types && npm run lint && npx next build && git diff --check
```

Rapporteer de exacte verwijderingen, checks en commit-hash. Geen push.
