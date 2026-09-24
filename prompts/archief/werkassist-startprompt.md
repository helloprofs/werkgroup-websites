# Startprompt voor Claude — Werkassist

Plak dit als eerste bericht in een nieuwe Claude-sessie, in de map
`Projecten & werk/Werkassist/werkassist-website`.

---

Je begint aan de Werkassist-site. Dit is site 3 van 3 in de Werkgroup-familie,
na Werkverzuim, Werkreturn en Werkgroup. Lees deze briefing, daarna
`werkassist-batchplan.md`, daarna de bronnen. Lever pas dan iets op.

## Wat Werkassist is

Werkgroup is het moedermerk; Werkverzuim, Werkreturn en Werkassist zijn de
labels. Werkassist is het label voor HR en organisatie. De goedgekeurde
omschrijving staat al op de Werkgroup-homepage en is leidend tot er eigen
webcopy ligt:

> Praktische ondersteuning bij HR-structuur, personeelsbeleid, functioneren,
> leidinggevenden en organisatievraagstukken.

Labelkleur uit het huisstijlhandboek 2026: `#8F4191` (wit erop meet 6.30, dus
die kleur mag wél onder tekst — anders dan het Werkgroup-oranje).

**De site is klein en blijft klein: één onepage plus een contactpagina.**
Publieke routes: `/` en `/contact/`. Ondersteunend: `/bedankt/`,
`/privacyverklaring/`, `/cookiebeleid/` en een eigen 404. Niets anders. Geen
blog, geen kennisbank, geen vacatures, geen mediabibliotheek, geen
doelgroepschuif. Als een voorstel meer routes oplevert, is het voorstel fout.

## Rolverdeling — hou je hier strikt aan

- **Jij plant, bundelt en reviewt. Je schrijft geen productiecode.**
- **Codex implementeert.** Jij geeft mij een kant-en-klare prompt, ik plak die
  in Codex, ik plak het resultaat terug.
- Ik ben koerier, geen reviewer. Ik lever wel zakelijke besluiten
  (bestemmingen, goedkeuring, contactgegevens, domeinen).
- Lezen, greppen, `npm run check` draaien en diffs beoordelen doe je zelf in
  deze repo. Vertrouw niet op wat Codex zegt dat hij gedaan heeft.

## De repo opzetten — dit is stap één

De basis is **werkgroup-website**, niet Werkreturn en niet Werkverzuim. Die
repo is de nieuwste in de lijn en heeft als enige de controlepoort, de
consent-laag, de beveiligde formulieren en een eigen 404.

```bash
cd "$HOME/Projecten & werk/Werkassist"
git clone https://github.com/helloprofs/werkgroup-website.git werkassist-website
cd werkassist-website
git remote rename origin werkgroup
git remote set-url --push werkgroup NO_PUSH_ALLOWED
git remote add origin https://github.com/helloprofs/werkassist-website.git
git push -u origin main
```

`werkgroup` blijft als alleen-lezen naslag staan (`git show werkgroup/main:<pad>`).
Werkreturn en Werkverzuim voeg je **niet** toe: alles wat daar staat zit al in
deze historie, en Werkverzuim is ouder, niet beter.

Nieuw aan te maken door mij: de GitHub-repo `helloprofs/werkassist-website`,
een Vercel-project, een eigen Postgres en de env-variabelen.

## Wat blijft en wat er meteen uit gaat

De erfenis slopen is **batch 0, vóór alles**. Bij Werkgroup gebeurde dat pas in
batch 16 en toen stonden er maandenlang een Werkreturn-deelafbeelding, een
Werkreturn-bedanktekst en een Werkreturn-logo in de structured data live.

| Blijft | Gaat eruit |
|---|---|
| `app/layout.tsx`, `page.tsx`, `globals.css`, `not-found.tsx`, `robots.ts`, `sitemap.ts`, `opengraph-image.tsx` | `app/expertise/`, `app/over-werkgroup/`, `app/werken-bij/`, `app/vacatures*/`, `app/blog*/`, `app/media/` |
| `app/contact/`, `app/bedankt/`, `app/privacyverklaring/`, `app/cookiebeleid/` | `app/api/{solliciteren,vacatures,media,blog-builder,shared-content}/` |
| `app/beheer/`, `app/beheer-login/`, `app/page-editor/`, `app/api/{contact,beheer-login,page-editor}/` | `lib/{blog-builder,media,shared-content,sollicitaties,vacatures}/`, `lib/seo/blog-visibility.ts` |
| `lib/{analytics,forms,page-editor,seo,db}/`, `lib/builder-auth.ts`, `lib/utils.ts` | `components/{blog,blog-builder,media,vacatures,vacatures-builder}/` |
| `components/analytics/`, `site-header.tsx`, `site-footer.tsx`, `components/page-editor/` | `scripts/{seed-blob,publish-posts,import-vacatures,check-redirect-inventory,crawl-live-urls}.mjs` |
| `scripts/check-{seo,conversie,redirects,links,placeholders,routes}.mjs`, `shot.mjs` | `data/`, alle Werkgroup-PDF's, -logo's en -beelden in `public/` |
| `middleware.ts`, `.github/workflows/`, `next.config.ts` (redirecttabel leeg) | de 119 redirects in `next.config.ts` en de `@vercel/blob`-dependency |

Uit `components/sections/` en `components/ui/` neem je **alleen de secties over
die de webcopy vraagt**. Bij Werkgroup bleven er 23 secties zonder importeur
achter. Pak de lijst secties pas nadat de copy er is, en verwijder de rest in
dezelfde batch.

Twee dingen die je makkelijk vergeet mee te slopen: het `build`-script is
`next build && node scripts/seed-blob.mjs` — dat tweede deel moet weg, en
`app/opengraph-image.tsx` wint van `metadata.openGraph.images`, dus die moet
opnieuw of hij deelt de verkeerde merknaam.

Batch 0 is klaar als `grep -ril "werkgroup\|werkreturn\|werkverzuim" app components lib public data`
alleen nog treffers geeft die er bewust staan (de footer-links naar de
zusterlabels), en `npm run check` groen is op een site van twee lege pagina's.

## Het CMS — bewust klein

Twee pagina's rechtvaardigen geen mediabibliotheek, geen blog-builder en geen
gedeelde-contentlaag. Wat blijft is de dunne kern van de page editor: één
typebestand, `defaults.ts` als schema én live tekst, Postgres met een
JSON-kolom per pagina, en twee handgeschreven formulieren — `/page-editor/home/`
en `/page-editor/contact/`. Beeld komt statisch uit `public/`; wie een foto wil
wisselen, vraagt dat via een commit.

Let op: `defaults.ts` is geen schema maar live tekst. Een placeholder die daar
blijft staan, staat op de site. `check:placeholders` bewaakt dat.

## Wat er uit drie eerdere bouwrondes te leren viel — negeer dit niet

1. **`NEXT_PUBLIC_SITE_URL` zet de hele site stil op `noindex` met
   `Disallow: /`** zodra hij afwijkt van het canonieke domein. Niets faalt,
   niets waarschuwt. Op previews moet hij op het previewdomein staan, en bij
   livegang moet hij uit productie verdwijnen.
2. **`permanent: true` geeft een 308, geen 301.** Gebruik `statusCode: 301`.
   Met `trailingSlash: true` schrijf je `source` zonder en `destination` mét
   afsluitende slash, anders kost elke redirect een extra hop.
3. **`check:seo` is groen zonder iets te controleren** als er geen verse build
   ligt: het slaat routes zonder gebouwde HTML stilzwijgend over. Altijd
   `npx next build` ervoor, of `CHECK_BASE_URL` zetten.
4. **Meten in de gerenderde HTML, niet in de RSC-payload.** Knip alles vanaf
   `<script>self.__next_f` weg voor je grept; anders vind je tekst terug die
   helemaal niet op de pagina staat.
5. **SMTP is elke keer de laatste blokkade.** Werkgroup stond dagen op 503
   omdat Microsoft 365 SMTP AUTH per mailbox blokkeert en er een app-wachtwoord
   nodig is. Zet dit vroeg in gang en test het contactformulier vóór de rest.
6. **reCAPTCHA vereist het voorvoegsel `NEXT_PUBLIC_` op de site key**, anders
   laadt het script nooit en faalt de check fail-closed op elke inzending.
7. **Controleer de deelbare artefacten apart:** OG-afbeelding, bedankpagina,
   het logo in de structured data en de `keywords` in de root-metadata. Dat
   waren bij Werkgroup vier publiek zichtbare merkresten die geen enkel script
   zag.
8. **GA4 batcht events en filtert HeadlessChrome als bot.** Meet met een gewone
   browser en wacht ruim tien seconden voor je concludeert dat iets niet werkt.

## Hoe je werkt

`werkassist-batchplan.md` bevat acht batches. Eén batch is één Codex-prompt is
één commit. Per batch: bundelen → prompt schrijven → ik voer uit → jij
controleert zelf (`npm run check`, lezen, greppen) → afvinken in het batchplan.

Sjabloon voor een Codex-prompt:

```
Doel: <één zin>
Bestanden: <exacte paden die hij mag aanraken>
Eisen:
  - <concreet, toetsbaar punt>
Niet doen: <valkuilen, bestanden die met rust blijven, merkresten>
Verifiëren: npm run check
Commit: <voorgestelde commitboodschap>
```

Eén batch per keer. Schrijf geen deeltaken uit die het batchplan niet noemt:
het plan is bewust grofmazig, dat is een keuze en geen omissie.

## Wat ik nu van je wil, in deze volgorde

1. Zeg in vijf regels wat je hebt gelezen en wat er aan bronnen ontbreekt.
2. Loop het batchplan na tegen de webcopy en zeg alleen wat je zou **wijzigen**
   — niet het hele plan herhalen.
3. De blokkades die iets van mij of Wendy vragen: wat, van wie, vóór wanneer.
4. Pas daarna batch 0 als Codex-prompt.

## Harde regels

- Geen paginatekst die niet uit de goedgekeurde webcopy komt. Diensten,
  claims, jaartallen, testimonials en klantlogo's verzin je nooit.
- Werkconnect komt nergens voor.
- Nooit pushen naar de remote `werkgroup`.
- Elke afgeronde batch is een eigen commit. Geen verzamelcommits.
- Twijfel je, vraag het mij — niet Codex.
