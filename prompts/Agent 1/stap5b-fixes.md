# Werkreturn — Stap 5b: review CMS-fotobibliotheek

Vervolg op stap 5. Werk verder in dezelfde worktree/branch
(`fase3-werkreturn`, huidige HEAD `61f8375`). Niet pushen.

Repo: helloprofs/website-werkreturn. Lokaal pad:
`Werkreturn/Werkreturn website/website-werkreturn` binnen
`Werkgroup websites overkoepelend/`.

De harde grens uit stap 5 blijft gelden: **verwijder niets**. Registreer of
corrigeer alleen wat hieronder expliciet staat; rapporteer opruimkandidaten.

## Reviewresultaat

De inventarisatie van stap 5 is inhoudelijk goed:

- `public/images/` bevat **49** bestanden en `STATIC_IMAGE_PATHS` bevat exact
  dezelfde 49 paden; er zijn geen ontbrekende of stale registraties.
- `listMedia()` voegt `STATIC_MEDIA` altijd toe, ook als er geen Blob-configuratie
  is. De beschermde API-route vormt dus geen gat in de statische bibliotheek.
- De mountain-vista-bestanden zijn terecht geen opruimkandidaten: hun paden
  worden dynamisch opgebouwd vanuit `layersData`.
- De gemelde kandidaten uit stap 5 zijn correct als ze buiten de
  mediaregistratie geen runtime-verwijzing hebben. Niet verwijderen.

## Opdracht

1. **Favicon als logo categoriseren.**
   In `lib/media/static-assets.ts` valt
   `/images/cropped-favicon-werkreturn.png` nu in categorie `foto`, terwijl
   het in `app/layout.tsx` als favicon/app-icoon wordt gebruikt. Breid
   `categoryForPath()` uit zodat paden met `favicon` categorie `logo` krijgen
   (dezelfde benadering als bij Werkgroup). Verwijder of verplaats geen bestand.

2. **Alleen rapporteren: slapende kapotte fallback.**
   `components/ui/return-scroll-story.tsx` verwijst zonder `content.image`
   naar `/images/werkreturn-preventieve.png`; dat bestand bestaat niet in deze
   repo en is niet als asset geregistreerd. De component wordt momenteel
   nergens geïmporteerd, dus dit veroorzaakt nu geen live 404. Voeg geen beeld
   uit een andere site toe en verander of verwijder de component niet binnen
   deze stap. Neem dit als technische-schuldpunt op in je rapportage voor een
   afzonderlijk content-/opschoonticket.

## Checks

```bash
npm run check:types && npx next build
```

## Rapportage

Meld de categorisatiefix met bestandspad, bevestig expliciet dat de inventaris
49/49 blijft, en herhaal dat er niets verwijderd is. Vermeld de ontbrekende,
momenteel slapende fallback als openstaand vervolgpunt. Commit-hash indien er
een wijziging is; niet pushen.
