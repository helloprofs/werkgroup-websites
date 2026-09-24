# Werkreturn — Stap 1b: Fixes uit de review van stap 1

Vervolg op stap 1. Werk verder in dezelfde worktree/branch (`fase3-werkreturn`,
commit `b45568f` is het laatste punt). Niet pushen.

Repo: helloprofs/website-werkreturn. Lokaal pad:
`Werkreturn/Werkreturn website/website-werkreturn` binnen
`Werkgroup websites overkoepelend/`.

Dit zijn concrete punten uit een onafhankelijke review van je stap 1-rapport
(niet zomaar aannames — elk punt is met `git diff`/live checks geverifieerd).

## Opdracht

1. **Redirect-ketens (`check:routes`)**: er zijn 57 bronredirects die naar een
   pad wijzen dat zelf óók nog een 308 geeft (bijv. `/nieuws/` → `/kennis` →
   nogmaals 308 naar `/kennis/`). Elke bronredirect moet direct naar de
   uiteindelijke, trailing-slash-correcte URL wijzen — geen tussenstop.
   Los dit op in de redirectconfiguratie (waarschijnlijk `next.config`/
   middleware/redirects-bestand) en draai `check:routes` opnieuw tot alle
   ✗-regels weg zijn.
2. **OG-afbeelding rendert kapot**: op de live homepage-OG-card (via
   `/opengraph-image`) staan 4 onleesbare kadertjes/tofu-tekens vóór
   "WERKRETURN". Kijk in `app/opengraph-image.tsx` — waarschijnlijk een
   icoon/emoji-teken dat het lettertype van de edge-image-renderer niet
   ondersteunt. Verwijder of vervang dat teken zodat de kaart schoon
   rendert.
3. **`check-seo.mjs` gelijktrekken met Werkgroup**: Werkgroup's versie van dit
   script checkt (naast titel/description-string-match) ook: titel ≤60
   tekens, description 150–160 tekens, exact 1 `<h1>` per pagina, en een
   niet-lege `alt`-tekst op elke `<img>`. Werkreturn's script mist deze
   checks. Voeg dezelfde logica toe (zie
   `Werkgroup/Werkgroup-website/scripts/check-seo.mjs` als referentie als je
   er toegang toe hebt, anders leid je de patronen af uit de beschrijving
   hierboven).
4. **Robots.ts**: voeg `Applebot-Extended` toe aan de `AI_CRAWLERS`-lijst in
   `app/robots.ts`, naast de bestaande GPTBot/ClaudeBot/PerplexityBot/
   Google-Extended.

## Checks

```
npm run check:types && npx next build && npm run check:seo && npm run check:routes
```

## Rapportage

Per punt: wat gefixt (bestandspaden), en de nieuwe uitkomst van
`check:routes` (aantal ✗ nu). Commit-hash.
