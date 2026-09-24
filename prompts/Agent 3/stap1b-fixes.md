# Werkassist — Stap 1b: Fixes uit de review van stap 1

Vervolg op stap 1. Werk verder in dezelfde worktree/branch
(`fase3-werkassist`, commit `12609cb` is het laatste punt). Niet pushen.

Repo: helloprofs/werkassist-website. Lokaal pad:
`Werkassist/werkassist-website` binnen `Werkgroup websites overkoepelend/`.

Dit zijn concrete punten uit een onafhankelijke review van je stap 1-rapport
(niet zomaar aannames — elk punt is met bestandsinspectie geverifieerd).
Goed nieuws vooraf: de nieuwe OG-kaart die je al hebt gemaakt (met titel,
subtekst en kleuraccent) is een duidelijke verbetering t.o.v. de huidige
live kaart (die toont alleen het logo op wit) — daar hoeft niets meer aan te
gebeuren.

## Opdracht

1. **`public/llms.txt` — 6 van de 7 "Diensten"-links wijzen naar hetzelfde
   anchor**: `#hr-ondersteuning` op de homepage. Voor AI-crawlers ziet dat
   eruit als 6 keer dezelfde pagina in plaats van 6 losse onderwerpen om te
   citeren, wat de GEO-waarde van dat bestand verzwakt. Geef elk onderwerp
   (HR-ondersteuning, HR-structuur en processen, Arbeidsvoorwaarden en
   personeelsbeleid, Functies/functioneren/ontwikkeling, Leidinggevenden en
   medewerkers, Tijdelijke HR-ondersteuning) een eigen, vindbaar anchor met
   een echte kop op de pagina (`#hr-structuur-en-processen` etc. — geen
   nieuwe pagina's nodig, wel losse `id`-attributen op de bijbehorende
   sectiekoppen), en werk `llms.txt` bij met die specifieke anchors.
2. **`check-seo.mjs` gelijktrekken met Werkgroup**: jouw script checkt al
   titel-lengte (≤60) en description-lengte (150–160). Werkgroup's versie
   checkt daarnaast ook: exact 1 `<h1>` per pagina en een niet-lege
   `alt`-tekst op elke `<img>`. Voeg diezelfde twee checks toe.
3. **Robots.ts**: voeg `Applebot-Extended` toe aan de `AI_CRAWLERS`-lijst in
   `app/robots.ts`, naast de bestaande GPTBot/ClaudeBot/PerplexityBot/
   Google-Extended.

## Checks

```
npm run check:types && npm run lint && npx next build && npm run check:seo
```

## Rapportage

Per punt: wat gefixt (bestandspaden), en of de nieuwe anchors in `llms.txt`
kloppen met de daadwerkelijke `id`'s op de pagina. Commit-hash.
