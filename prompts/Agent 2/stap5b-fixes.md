# Werkgroup — Stap 5b: review CMS-fotobibliotheek

Vervolg op stap 5. Werk verder in dezelfde worktree/branch
(`fase3-werkgroup`, huidige HEAD `3e4e66d`). Niet pushen.

Repo: helloprofs/werkgroup-website. Lokaal pad:
`Werkgroup/Werkgroup-website` binnen `Werkgroup websites overkoepelend/`.

De harde grens uit stap 5 blijft gelden: **verwijder niets**.

## Reviewresultaat

De codewijziging in commit `3e4e66d` is goed:

- `public/images/` bevat **71** bestanden en `STATIC_IMAGE_PATHS` registreert
  exact dezelfde 71 paden. Er ontbreken geen registraties en er zijn geen
  verouderde registraties.
- De twaalf toegevoegde paden bestaan allemaal; de categorie voor
  `favicon-werkgroup.png` is correct `logo`.
- `team/deborah.png` en `werkgroup/werkgroup-team-breed-1.png` zijn zinvolle
  opruimkandidaten naast de gebruikte WebP-varianten.
- `werkgroup/suzanne-website.jpg` is inderdaad byte-identiek aan
  `team/suzanne.jpg`; niets verwijderen.
- De klantlogo's zijn wel geregistreerd als CMS-defaults, maar staan allemaal
  op `active: false` en `LogoBar` wordt niet gerenderd. Dat is terecht alleen
  gerapporteerd, niet aangepast.

## Opdracht

Er is geen aanvullende codewijziging nodig. Vul wel je rapportage aan: de
opruimlijst uit stap 5 is niet volledig. Deze paden hebben buiten
`static-assets.ts` geen runtime-verwijzing en horen daarom als **kandidaten
voor overleg** vermeld te worden (niet verwijderen):

- `/images/afbeelding.jpg`
- `/images/cta-professional.jpg`
- `/images/favicon-werkgroup.png`
- `/images/hero/home.jpg`
- `/images/oval-logo-removebg-preview.png`
- `/images/partnership.jpg`
- `/images/team/deborah.png`
- `/images/team/lindsey.png`
- `/images/vitaly-gariev-Iq-9YjCEHJo-unsplash.jpg`
- `/images/vooraanzicht-buitenkant.jpg`
- `/images/werkgroup-gevel-labels.jpg`

De bestanden onder `mountain-vista/` zijn hiervan expliciet uitgezonderd: ze
worden dynamisch opgebouwd in `RegionVista`. Het 88×88-bestand
`/images/favicon-werkgroup.png` is geen byte-dubbel van de 512×512 favicon in
`public/`, maar heeft nu ook geen runtime-verwijzing; daarom alleen als
kandidaat rapporteren, niet verwijderen of deregistreren.

## Checks

Geen codewijziging nodig; de review heeft `npm run check:types` en
`npx next build` al succesvol opnieuw uitgevoerd. Als je toch code wijzigt,
draai beide checks opnieuw.

## Rapportage

Rapporteer de aangevulde, volledige kandidatenlijst en bevestig dat er niets
is verwijderd. Geen commit nodig wanneer uitsluitend de rapportage verandert;
niet pushen.
