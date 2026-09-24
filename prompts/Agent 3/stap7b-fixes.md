# Werkassist — Stap 7b: veilige harde opschoning

Werk verder in dezelfde worktree/branch (`fase3-werkassist`). Niet pushen.

De analyse van stap 7 is beoordeeld. Dit is een **uitvoer-stap**, maar alleen
voor de hieronder expliciet goedgekeurde, aantoonbaar veilige opschoning.

## Uitvoeren

1. Verwijder met npm, inclusief lockfile, deze aantoonbaar ongebruikte
   dependencies:

   - `@hookform/resolvers`
   - `@tailwindcss/typography`
   - `tw-animate-css`
   - `playwright`

   Voor Playwright zijn hier geen imports, scripts, tests of configuratie
   aanwezig. (Dit geldt nadrukkelijk niet als algemeen voorschrift voor de
   andere twee repos.)

2. Ruim de redundant geworden ESLint-configuratie op:

   - verwijder `.eslintrc.json`; de actieve flat config is
     `eslint.config.mjs`;
   - verwijder in `eslint.config.mjs` de ongebruikte imports van `node:path`
     en `node:url`, plus de ongebruikte `__filename`/`__dirname`-constanten.

## Expliciet niet doen

- **Geen componenten verwijderen, verplaatsen of herstructureren.** Ook de
  ongebruikte UI-, sectie- en page-editorcomponenten blijven vooralsnog als
  interne componentbibliotheek beschikbaar.
- Laat daarom ook `@radix-ui/react-slot` en
  `class-variance-authority` staan: zij horen bij die bewaarde
  componentbibliotheek.
- Verwijder geen media, `metadata.json`, CMS-/page-editorfunctionaliteit,
  analytics-schema's, docs of outputs.
- Laat `lib/analytics/events.ts` volledig ongemoeid: afgeleide doelgroep- en
  dienstwaarden kunnen deel zijn van het GTM-contract en zijn geen veilige
  cleanup.
- Geen wijzigingen aan routes, SEO, redirects, tracking of formulieren.

## Verplicht controleren

```bash
npm run check:types && npm run lint && npx next build && git diff --check
```

Let op: de bestaande lokale waarschuwing over een ontbrekende
`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` mag alleen lokaal optreden wanneer die niet
in de lokale env staat; verander geen reCAPTCHA-code of -keys in deze stap.

Rapporteer de exacte verwijderingen, checks en commit-hash. Geen push.
