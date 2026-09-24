# Werkgroup — Stap 3: Formulieren (gedeeltelijk)

Vervolg op de vorige stappen. Werk verder in dezelfde worktree/branch
(`fase3-werkgroup`). Niet pushen.

Repo: helloprofs/werkgroup-website. Lokaal pad:
`Werkgroup/Werkgroup-website` binnen `Werkgroup websites overkoepelend/`.

Belangrijk: SMTP-gegevens ontbreken nog (wacht op ICT-partner Joteck),
dus een echte testverzending kan nu niet. Deze stap gaat alleen over wat
al wél kan.

Werkgroup heeft twee formulieren: `app/api/contact` en
`app/api/solliciteren` (met CV-bijlage-upload).

**Eerst opruimen voordat je begint**: uit stap 2 komt een architecturaal
punt uit onafhankelijke review. De legacy-redirects staan nu op twee
plekken: als losse array in `next.config.ts` (`permanentRedirects`) én
vrijwel 1-op-1 gedupliceerd in een `LEGACY_REDIRECTS`-map in
`middleware.ts`. Daarnaast is de middleware-`matcher` daarvoor verbreed
van een handvol beheerpaden naar `/:path*`, waardoor middleware nu op
élk request draait (ook statische assets), in plaats van alleen
beheer/editor-routes. Dat is geen bug — `check:redirects`/`check:links`
zijn groen en de redirects werken (getest) — maar het is dubbel
onderhoud en onnodige overhead die een goed opgezette site niet zou
hebben. Los dit echt op, niet er omheen werken:

1. Ga na of `next.config.ts`'s native `redirects()` — met
   `skipTrailingSlashRedirect: true` — alle gevallen zelf aankan,
   inclusief de encoded/spatie-variant (`/vacatures/teamleider%20
   werkverzuim`) en trailing-slash-varianten. Verwijder de
   `LEGACY_REDIRECTS`-duplicatie en de verbrede matcher uit
   `middleware.ts` en zet de matcher terug naar alleen de
   beheer/editor/API-paden (zoals bij Werkreturn/Werkassist).
2. Draai daarna `check:redirects`, `check:links` en test handmatig
   (curl) een paar representatieve oude URL's — inclusief de
   encoded-spatie-variant — om te bevestigen dat alles nog steeds in
   één hop naar de juiste bestemming gaat.
3. Mocht er een concreet geval zijn dat `next.config.ts` aantoonbaar
   niet zelf kan afhandelen: houd dan alléén dát specifieke geval in
   `middleware.ts`, met een matcher die beperkt is tot dat pad — niet
   een volledige duplicaat-lijst en niet `/:path*`.
4. Rapporteer kort wat je hebt aangepast/verwijderd en het resultaat van
   de hertest, vóór de rapportage over de formulieren hieronder.

## Opdracht

- Env-vars (`SMTP_HOST/PORT/USER/PASS`, `CONTACT_TO`) — nette
  foutafhandeling als ze ontbreken
- Bijlage-upload bij solliciteren: bestandstype/grootte-validatie
  aanwezig en correct?
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
