# Werkassist — Stap 3: Formulieren (gedeeltelijk)

Vervolg op de vorige stappen. Werk verder in dezelfde worktree/branch
(`fase3-werkassist`). Niet pushen.

Repo: helloprofs/werkassist-website. Lokaal pad:
`Werkassist/werkassist-website` binnen `Werkgroup websites overkoepelend/`.

Belangrijk: SMTP-gegevens ontbreken nog (wacht op ICT-partner Joteck),
dus een echte testverzending kan nu niet. Deze stap gaat alleen over wat
al wél kan.

Werkassist heeft één formulier: `app/api/contact`.

## Opdracht

- Env-vars (`SMTP_HOST/PORT/USER/PASS`, `CONTACT_TO`) — nette
  foutafhandeling als ze ontbreken
- Let op de eerder geconstateerde ontbrekende
  `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` lokaal — dit is verwacht (env-var pas
  in Vercel gezet), niet iets om zelf te "fixen", wel te bevestigen dat
  de graceful fallback (geen crash, alleen reCAPTCHA die niet laadt) nog
  klopt
- Foutafhandeling: duidelijke melding aan de bezoeker bij mislukte
  verzending
- Verzin geen SMTP-gegevens en probeer niet zelf te "raden" wat de
  waarden zouden moeten zijn.

## Checks

```
npm run check:types && npx next build
```

## Rapportage

Rapporteer of de code "klaar voor SMTP-koppeling" is, of noem concreet
wat nog moet gebeuren zodra de SMTP-gegevens er zijn. Commit-hash indien
van toepassing.
