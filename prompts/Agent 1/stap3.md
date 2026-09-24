# Werkreturn — Stap 3: Formulieren (gedeeltelijk)

Vervolg op de vorige stappen. Werk verder in dezelfde worktree/branch
(`fase3-werkreturn`). Niet pushen.

Repo: helloprofs/website-werkreturn. Lokaal pad:
`Werkreturn/Werkreturn website/website-werkreturn` binnen
`Werkgroup websites overkoepelend/`.

Belangrijk: SMTP-gegevens ontbreken nog (wacht op ICT-partner Joteck),
dus een echte testverzending kan nu niet. Deze stap gaat alleen over wat
al wél kan.

## Opdracht

- Env-vars die nodig zijn: `SMTP_HOST/PORT/USER/PASS`,
  `CONTACT_TO_WERKGEVER`, `CONTACT_TO_WERKNEMER` — check dat de code er
  correct op reageert als ze ontbreken (nette foutmelding, geen crash)
- Foutafhandeling: wat ziet de bezoeker als het versturen mislukt? Is de
  melding duidelijk en gebruiksvriendelijk?
- Werkgever/werknemer-routing: klopt de logica dat het juiste mailadres
  wordt gekozen op basis van het gekozen formuliertype?
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
