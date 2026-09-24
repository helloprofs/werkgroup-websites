# Werkassist — Stap 5b: review CMS-fotobibliotheek

Vervolg op stap 5. Werk verder in dezelfde worktree/branch
(`fase3-werkassist`, huidige HEAD `32b1417`). Niet pushen.

Repo: helloprofs/werkassist-website. Lokaal pad:
`Werkassist/werkassist-website` binnen `Werkgroup websites overkoepelend/`.

De harde grens uit stap 5 blijft gelden: **verwijder niets**.

## Reviewresultaat

Stap 5 is code-technisch goed afgerond:

- `public/images/` bevat **13** bestanden en `STATIC_IMAGE_PATHS` registreert
  exact dezelfde 13 paden; er zijn geen ontbrekende of stale registraties.
- `werkassist-header.png` staat terecht in de bibliotheek en wordt werkelijk
  door `components/site-header.tsx` gebruikt.
- `werkassist.png` blijft terecht naast het headerlogo bestaan: het wordt door
  de footer en de JSON-LD gebruikt. De bestanden zijn niet dubbel (respectievelijk
  1989×655 en 1936×546, met verschillende hashes).
- De zeven gemelde niet-runtime-gebruikte foto's vormen een correcte
  overleglijst. De conclusie dat gerichte aanvulling vanuit lokaal materiaal
  zinvol is, is ook juist; niet zelf toevoegen zonder inhoudelijke,
  licentie- en merkcontrole.

## Opdracht

Er is geen aanvullende bibliotheek- of codewijziging nodig. Voeg alleen dit
technische-schuldpunt toe aan je rapportage:

- `components/ui/return-scroll-story.tsx` heeft als fallback
  `/images/werkreturn-preventieve.png`. Dat bestand bestaat niet in Werkassist
  en is niet als asset geregistreerd. De component wordt momenteel nergens
  geïmporteerd, dus er is geen actuele live 404.

Maak in deze stap **geen** vervangend beeld, kopieer geen Werkreturn-asset en
verwijder of wijzig de component niet. Dit hoort in een apart content-/legacy-
opschoonticket thuis, zodra is bepaald of het bouwblok behouden blijft.

## Checks

De review heeft `npm run check:types` en `npx next build` succesvol opnieuw
uitgevoerd. Bij een codewijziging moeten beide checks opnieuw slagen.

## Rapportage

Bevestig de 13/13-inventaris, beide bewuste logo-rollen, de bestaande
opruimkandidaten en de nieuwe technische-schuldnotitie. Geen commit nodig
wanneer uitsluitend de rapportage verandert; niet pushen.
