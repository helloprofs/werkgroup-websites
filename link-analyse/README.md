# Link-analyse

Los analyseproject naast de vier websites. Dit project gaat de publieke preview-URL's
van Werkgroup, Werkassist, Werkreturn en Werkverzuim inventariseren en met Jev
beoordelen op relevante interne en onderlinge links.

## Eerste keer instellen

Voer de commando's uit vanuit deze map, niet vanuit de grote root:

```bash
cd "link-analyse"
npm install
cp .env.example .env.local
```

Zet daarna de aangemaakte `AI_GATEWAY_API_KEY` in `.env.local`. Zet de sleutel niet
in Git, frontendcode of de chat.

Als je de sleutel al in de grote workspace-root hebt gezet, wordt die tijdelijk ook
gevonden. Voor een nette definitieve setup kun je hem later verplaatsen naar
`link-analyse/.env.local`.

## Stap 1 en 2: sitemaps en pagina-analysekaarten

De crawler gebruikt de drie Vercel-previews en de live Werkverzuim-site als
standaard. Je kunt deze later overschrijven via de vier `*_BASE_URL`-variabelen in
`.env.local`.

```bash
npm run crawl
```

Dit maakt lokaal aan:

- `results/sitemap-inventory.json` — gevonden pagina-URL's per website;
- `results/page-cards.json` — titel, omschrijving, headings, hoofdcontent, bloglabel
  en bestaande links in de hoofdcontent.

Contact-, bedank-, login-, privacy-, voorwaarden- en andere technische pagina's
worden voorlopig uitgesloten. Navigatie en footer worden niet als inhoud gebruikt.

## Stap 3: scoren met Jev

Nadat `npm run crawl` succesvol is afgerond:

```bash
npm run score
```

De eerste scorer beoordeelt alle gerichte bron-doelcombinaties met één inhoudelijke
relevantievraag en slaat de resultaten op in `results/link-scores.json`. Bestaande
links in de hoofdcontent worden niet als nieuwe kans voorgesteld. De Jev-score wordt
door de eigen code genormeerd naar `score100` voor sortering; dat is een
prioriteitsindex en geen kanspercentage. Een tweede, gerichte pass kan daarna voor
de shortlist bepalen of de link echt wenselijk is en waar hij in de hoofdcontent
past.

De scorepass schrijft tussentijds checkpoints naar
`results/link-scores.partial.json`. Bij een rate-limit of tijdelijke storing kun je
`npm run score` opnieuw uitvoeren; afgeronde batches worden dan overgeslagen.

## Jev-verbinding testen

```bash
npm run typecheck
npm run jev:smoke
```

`typecheck` geeft bij succes geen tekst. `jev:smoke` moet na het invullen van de
API-sleutel een antwoord met `relevance` en `shouldLink` tonen.

De smoke test gebruikt voorbeeldinhoud. De volgende stap is de crawler die de vier
sitemaps en pagina-inhoud ophaalt en de resultaten wegschrijft naar `results/`.

## Beoogde analyse

Per bronpagina worden mogelijke doelpagina's beoordeeld op een vaste schaal. We
bewaren naast de score ook de confidence en de site/URL-combinatie. De uiteindelijke
scorelijst wordt door code gerangschikt; Jev beslist niet zelfstandig welke links
worden gepubliceerd.
