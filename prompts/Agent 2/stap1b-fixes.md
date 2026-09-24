# Werkgroup — Stap 1b: Fixes uit de review van stap 1

Vervolg op stap 1. Werk verder in dezelfde worktree/branch (`fase3-werkgroup`,
commit `e12cfdb` is het laatste punt). Niet pushen.

Repo: helloprofs/werkgroup-website. Lokaal pad:
`Werkgroup/Werkgroup-website` binnen `Werkgroup websites overkoepelend/`.

Dit zijn concrete punten uit een onafhankelijke review van je stap 1-rapport
(niet zomaar aannames — elk punt is met `git diff`/bestandsinspectie
geverifieerd).

## Opdracht

1. **Hero-foto is de waarschijnlijke oorzaak van de trage mobiele LCP
   (4,6s)**: `public/images/werkgroup/werkgroup-team-breed-1.png` is **1,04
   MB en als PNG opgeslagen** — een foto die als ongecomprimeerde PNG
   wegschrijft in plaats van JPG/WebP. Ter vergelijking: de vergelijkbare
   hero-foto's bij Werkreturn/Werkassist zijn ~130 KB JPG, dus ruim 8x
   kleiner. Dat zware bronbestand kost de Next.js image-optimizer merkbare
   tijd om te verwerken, wat de LCP van de homepage-hero direct raakt.
   Comprimeer/exporteer deze foto als JPG of WebP, streef naar <150–200 KB
   bij gelijke crop/aspect-ratio (1000×521), en vervang het bestand. Update
   het pad in `lib/page-editor/defaults.ts` als de bestandsnaam wijzigt.
   Draai daarna Lighthouse (mobiel) opnieuw tegen de lokale productie-build
   en rapporteer de nieuwe LCP.

   Achtergrond: dit bestand is nooit via de mediabibliotheek geüpload — de
   upload-pipeline in `lib/media/storage.ts` (`optimizeImage()`, sharp)
   resized/converteert elke upload via `/api/media` of
   `/api/page-editor/upload` automatisch naar WebP. Dit is dus een los
   repo-bestand dat buiten die pijplijn om is geplaatst, waarschijnlijk uit
   de begintijd van de site. Check terwijl je toch in `public/images/` zit
   of er nog meer van dat soort losse, ongeoptimaliseerde bestanden staan
   (grote PNG's die eigenlijk foto's zijn) — noteer die apart, dat hoort bij
   stap 5 (CMS-fotobibliotheek) maar is goed om nu alvast te signaleren.
2. **Robots.ts**: voeg `Applebot-Extended` toe aan de `AI_CRAWLERS`-lijst in
   `app/robots.ts`, naast de bestaande GPTBot/ClaudeBot/PerplexityBot/
   Google-Extended.

`check-seo.mjs` hoeft hier niet aangepast te worden — jouw versie (met
titel/description-lengte, h1-telling en alt-tekst-check) is juist de
referentie die bij Werkreturn en Werkassist wordt nagebouwd.

## Checks

```
npm run check:types && npm run lint && next build && npm run check:seo
```

Plus een herhaalde Lighthouse-run (mobiel) tegen de lokale productie-build
voor de homepage.

## Rapportage

Per punt: wat gefixt (bestandspaden), nieuwe bestandsgrootte van de
hero-foto, en de nieuwe Lighthouse-mobiel-score/LCP ter vergelijking met de
eerdere 81/4,6s. Commit-hash.
