# Werkgroup — voortgang en faseplan

Dit bestand is het startpunt van elke sessie. Lees het eerst; de takenlijst in
`2026-09-14-werkgroup-takenlijst.md` bevat het detail en wordt alleen gelezen
wanneer de batch erom vraagt. De regels staan in `AGENTS.md` en worden
automatisch geladen.

**Rolverdeling.** Claude plant, bundelt en reviewt. Codex implementeert. Nick is
de koerier tussen beide en neemt de zakelijke beslissingen. Claude schrijft geen
productiecode; documentatie en het afvinken hieronder doet Claude wel zelf, in
een eigen `docs:`-commit.

**Cyclus per batch.** Claude schrijft de Codex-prompt → Nick voert uit en plakt
het resultaat terug → Claude controleert zelf (lezen, `npx tsc --noEmit`,
`npx next build`, de `check:`-scripts, grep op merkresten) → Claude vinkt af en
commit de docs → daarna kan de sessiecontext gewist worden.

---

## Stand

Herordend op 14 september 2026. De oude volgorde zette drie controlebatches en
het merkfundament vóór de eerste pagina; de eerste pagina stond op batch 10.
Gemeten in de Werkreturn-repo ging het daar andersom: spec om 10:07, tokenlaag
om 10:21, fundament om 10:43, homepage compleet om 11:35, alle pagina's binnen
één dag — en de controlescripts pas de dag erna, toen er iets te controleren
viel. Die volgorde is hier overgenomen.

| # | Batch | Hoofdstuk | Status |
|---|---|---|---|
| 1 | Merkveilige staat — blog dicht, 18 logo's uit, pakketnaam | 0 | ✅ `f1798ef` |
| 2 | Repo-identiteit en domeinveiligheid — `site.ts`, `.env.example` | 0, 8, 9 | ✅ `96f8708` |
| 3 | Merkfundament — tokenlaag, doelgroepschuif eruit, header, footer, favicon, drie routes | 3, 4 | ✅ `f3ba0e9`, gemerged in `32d7b0b` |
| 4 | Pagina `/` | 5, 6 | ✅ `da913ec`, `feat/homepage` |
| 5 | Pagina `/expertise/` | 5, 6 | ✅ `ccae23c`, gemerged in `main` |
| 6 | Pagina `/over-werkgroup/` | 5, 6 | ✅ `a6dab97` + correctie `1103419`, gemerged in `main` |
| 7a | Pagina `/werken-bij/` + vacatures als CMS-contenttype, `/vacatures/` en `/vacatures/<slug>/` | 5, 6 | ✅ `3ce6ddb` + correcties `ce64368`, `c26c733`, gemerged in `main` |
| 7b | Open sollicitatie: formulier, cv-upload, e-mail | 7 | verplaatst naar batch 13 |
| 7c | Vacaturedetailontwerp, modeluitbreiding en de vijf vacatures invoeren | 5, 6 | open |
| 14a | Cookiebanner, consent en de overgeërfde meet-ID's | 8 | ✅ `63f060b`, in `main` |
| 8 | Pagina `/contact/` | 5, 6 | ✅ `22a6d3d`, gemerged in `main` |
| 9 | Oude routes slopen en de volledige redirecttabel: werkreturn.nl-migratie **en** de 26 bestaande werkgroup.nl-URL's | 2 | ✅ `f717e25` (`a46f60f`), gemerged in `main` |
| 10 | SEO-fundament — metadata, sitemap, robots, `check-seo` omzetten | 9 | open |
| 11 | De poort — placeholdercontrole, interne linkchecker, één `npm run check` | 0 | open |
| 12 | CMS opschonen — editor-navigatie, cookienamen, media | 6 | open |
| 13 | Formulieren en e-mail — contact, open sollicitatie, cv-upload | 7 | ✅ `14bdd79`, gemerged in `main` |
| 14 | Analytics en consent — GTM, cookiebanner, meet-ID's | 8 | ✅ `63f060b` + `71814fa`, gemerged in `main` |
| 15 | Juridisch + kwaliteitsronde | 10, 11 | geblokkeerd (teksten) |

Hoofdstukken 12 (Vercel) en 13 (livegang) doet Nick.

**Deze sessie bijgewerkt op 15 september 2026.** De batchtabel is
gelijkgetrokken met de actuele staat van `main`: batch 8 (contact), 9
(redirects), 13 (formulieren en e-mail) en 14 (analytics en consent) zijn al
afgerond en gemerged. In deze sessie is alleen dit voortgangsdocument
bijgewerkt; de genoemde implementaties stonden al in `main`.

**Volgorde-logica, voor als iemand ervan af wil wijken.** De tokenlaag gaat vóór
de pagina's, anders worden 27 secties in Werkreturn-kleuren gebouwd en daarna
opnieuw — dat is de enige volgorde-eis die overeind bleef. De redirecttabel (9)
gaat pas als de nieuwe routes bestaan en de oude sneuvelen, anders wijst hij
naar niets. De poort (11) staat achteraan omdat een linkchecker die
Werkreturn-routes valideert die in batch 9 verdwijnen, werk controleert dat we
weggooien. `check-seo` heeft een `EXPECTED`-tabel met exacte routes en kan pas
na batch 8.


**Batch 5 gecontroleerd op 15 september 2026.** `npx tsc --noEmit` schoon,
`npx next build` slaagt, `check:conversie` groen, `eslint` één bestaande
waarschuwing (`consent-default.tsx`, van vóór deze batch). De zeven blokken van
hoofdstuk 4 staan letterlijk in `defaults.ts`; titel en metabeschrijving komen
woordelijk uit hoofdstuk 9. Geen Werkreturn-resten in de nieuwe bestanden.
`check:seo` meldt 10 afwijkingen, alle tien op de overgeërfde
Werkreturn-routes die in batch 9 sneuvelen — niets uit deze batch.

**`feat/expertise` staat nog niet in `main`.** De Vercel-deploy hangt aan
`main`, dus tot die merge staat `/expertise/` niet online.

**Batch 6 gecontroleerd op 15 september 2026.** `npx tsc --noEmit` schoon,
`npx next build` slaagt, `npm run lint` schoon, `check:conversie` groen,
`check:seo` tien bekende Werkreturn-afwijkingen en geen regel over
`/over-werkgroup/`. De acht blokken van hoofdstuk 5 staan in de juiste volgorde,
de copy is letterlijk, titel en metabeschrijving komen woordelijk uit
hoofdstuk 9.

**Eén echte fout, gemeten in de gerenderde HTML.** `uitgangspunten` levert zijn
tekst aan als `paragraphs`, maar `PrincipleGrid` leest alleen `description`.
De twee zinnen "Werkgroup wil werkgevers helpen om vraagstukken rond mens, werk
en werkgeverschap werkbaar te maken…" en "Daarbij werken we vanuit vier vaste
uitgangspunten:" staan daardoor **niet op de pagina**. `tsc` ziet dit niet: bij
een spread doet TypeScript geen excess-property-controle, dus de prop valt
stilzwijgend weg. De editor bíedt het veld wel aan ("Inleidende alinea's"),
dus er kan tekst ingevoerd worden die nooit verschijnt. Gaat als eerste punt
mee in batch 7.

Controlemethode voor een volgende keer: grep op de HTML-bestanden in
`.next/server/app/` vindt de tekst ook terug in de RSC-payload onderaan, ook
als die niet gerenderd is. Knip daarom eerst alles vanaf
`<script>self.__next_f` weg en strip dan pas de tags.

**Twee dingen buiten de opdracht gewijzigd.** Codex heeft ook
`components/analytics/consent-default.tsx` aangepast — `next/script` met
`beforeInteractive` vervangen door een gewone inline `<script>`. Dat is
inhoudelijk juist (`beforeInteractive` mag niet in de app router) en in de
gebouwde HTML staat het script als eerste in de `<body>`, dus vóór GTM. Het is
wel batch 14-terrein en moet daar opnieuw bekeken worden met een echte
`NEXT_PUBLIC_GTM_ID`. Daarnaast is `ondertitel` op de labelkaarten optioneel
gemaakt; op `/over-werkgroup/` staan de kaarten daardoor zonder gekleurd
blokje. Op de homepage verandert er niets.

**Batch 7a gecontroleerd op 15 september 2026.** `tsc`, `next build`, `lint` en
`check:conversie` schoon; `check:seo` tien bekende Werkreturn-afwijkingen, en
`werken-bij` en `vacatures` staan in `EXPECTED`. Alle zes blokken van
hoofdstuk 6 staan gerenderd in de HTML — deze keer per blok gemeten, met de
RSC-payload eraf geknipt. De regel uit hoofdstuk 10 is nagekomen: op
`/werken-bij/` staat nergens een verkennend-gesprek-CTA, ook niet in de header;
`components/site-header.tsx` onderdrukt hem daar expliciet. Er is geen
open-sollicitatieblok gebouwd, zoals afgesproken. Onbekende of
niet-gepubliceerde vacatureslugs geven een 404, en `gepubliceerd` stuurt zowel
het overzicht als de sitemap. Geen verzonnen velden of placeholders.

Buiten de letterlijke opdracht, maar terecht: `app/robots.ts` sluit
`/vacatures-builder/` uit, `middleware.ts` en `lib/builder-auth.ts` beveiligen
de builder en `/api/vacatures`, `app/sitemap.ts` neemt gepubliceerde vacatures
op en `app/beheer/page.tsx` kreeg een tegel.

**Eén echte fout: de lege staat toont de kop een tweede keer.**
`components/vacatures/vacature-list.tsx` rendert bij nul vacatures `{title}` in
het lege-staatvak — dezelfde string als de `<h2>` erboven. Gemeten: op zowel
`/vacatures/` als `/werken-bij/` staat "Bekijk waar we op dit moment
versterking zoeken" twee keer achter elkaar, en er staat geen zin die uitlegt
dat er nu niets openstaat. Dat is precies de stand waarin de site livegaat,
want er is nog niet besloten welke vacatures meegaan. De lege-staattekst is
nieuwe copy die niet in de webcopy staat en hoort als eigen veld in het
contenttype `werken-bij`, beheerbaar via de page editor.

**Openstaande beslissing: de verkennend-gesprek-CTA op de vacatureroutes.**
Hoofdstuk 10 verbiedt die CTA op `/werken-bij/` en dat is gebouwd. Maar
`/vacatures/` en `/vacatures/<slug>/` bestonden nog niet toen de webcopy
geschreven werd, en daar staat de CTA nu wél in de header — dezelfde doelgroep,
dezelfde conversies. Voorstel: `showMeetingCta` in `site-header.tsx` uitbreiden
naar alle routes onder `/vacatures`. Ligt bij Nick.

**JobPosting weggelaten, met reden.** Het vacaturemodel heeft geen
publicatiedatum en `datePosted` is verplicht voor JobPosting. Codex heeft
terecht niets verzonnen. Wil je die rich results wel, dan moet er een
publicatiedatum bij in `lib/vacatures/types.ts`. Kan in batch 10 mee.

**Beide correcties zijn afgerond en gemeten op 15 september 2026.**
`ce64368` geeft de lege staat een eigen, beheerbaar `leegTekst`-veld;
`c26c733` verbergt de werkgevers-CTA op alle vacatureroutes. Gemeten in de
gerenderde HTML: op `/vacatures/` en `/werken-bij/` staat de lege tekst één
keer, de vacaturekop één keer en de verkennend-gesprek-CTA nul keer, terwijl
die CTA op `/`, `/expertise/` en `/over-werkgroup/` gewoon blijft staan.

**SEO-titels voor de nieuwe routes, ter bevestiging:** `/vacatures/` krijgt
"Vacatures | Werkgroup", `/vacatures/<slug>/` krijgt
"<functietitel> | Werkgroup". Hoofdstuk 9 kent deze routes niet.

## De twee zustersites als naslag — wat er wel en niet te halen valt

Vaste werkwijze: kijk vóór je iets nieuws schrijft of Werkverzuim of Werkreturn
het al opgelost heeft. De remotes staan ingesteld en zijn read-only:

    git show werkverzuim/main:<pad>
    git ls-tree -r --name-only werkreturn/main | grep -i <term>

Maar wees hier gericht in, want de winst is kleiner dan hij lijkt en zoeken
kost tokens. Twee redenen:

1. **Deze repo ís een fork van Werkreturn.** Alles wat Werkreturn heeft, staat
   hier al — inclusief `lib/blog-builder/`, de hele `lib/analytics/`-laag en de
   secties. `git show werkreturn/main:<pad>` levert in de regel het bestand dat
   je al open hebt. Werkreturn is dus zelden een bron; het is meestal precies
   de merkrest die we aan het opruimen zijn.
2. **Werkverzuim is ouder, niet beter.** Op analytics loopt het achter: een
   hardgecodeerde `GA_ID = 'G-J29SVT4RHX'` in
   `components/ui/google-analytics.tsx`, geen Consent Mode, geen GTM. Als
   voorbeeld voor consent is het een waarschuwing, geen model.

Waar ze wél helpen:

- **Naamconventies over de drie sites heen.** De cookiesleutel is
  `werkverzuim-cookie-consent` en `werkreturn-cookie-consent-v2`; het patroon is
  `<merk>-cookie-consent`. Dezelfde logica geldt voor de custom events.
- **Werkverzuim als eindbeeld.** Die site is af en draait op een eigen domein.
  Voor de vraag "hoe ziet een voltooide merkmigratie eruit" is dat de enige
  referentie die we hebben.
- **Gemeten: geen van beide heeft vacatures.** Geen `vacature`-, `job`- of
  `werken-bij`-bestanden in beide repo's. Voor batch 7a is er niets te kopiëren;
  het bestaande `lib/blog-builder/` in deze repo is het enige model voor een
  eigen contenttype.
- **Gemeten: beide hardcoderen hun meet-ID in de privacyverklaring.**
  Werkverzuim `G-J29SVT4RHX`, Werkreturn `G-0WMTMVH1ER`. Er is dus géén
  bestaand patroon om het ID uit de omgeving te lezen; dat is in 14a nieuw.

## Twee Codex-sessies tegelijk — afgesproken op 15 september 2026

Vanaf hier kunnen twee Codex-sessies parallel draaien, elk op een eigen branch.
De regel die dat veilig houdt: **ze mogen geen bestand delen.** De meeste
batches delen wél bestanden, want vrijwel alles loopt via `defaults.ts`,
`types.ts`, de page-editor en `scripts/check-seo.mjs`.

| Sessie | Branch | Batch |
|---|---|---|
| 1 | `feat/over-werkgroup` | correctie batch 6, daarna 7a |
| 2 | `feat/analytics-cookies` | 14a, vertakt van `1103419` |

**Waarom sessie 2 van `1103419` vertakt en niet van `main`.** Batch 6 heeft
`components/analytics/consent-default.tsx` gewijzigd, en die commit zit nog
niet in `main`. Vertakt sessie 2 van `main` en raakt zij dat bestand, dan is
er een merge-conflict op precies het bestand dat het lastigst te beoordelen is.

**Welke batches níet parallel kunnen, en waarom.**

- **8 (`/contact/`)** — deelt `defaults.ts`, `types.ts`, de page-editor en
  `check-seo.mjs` met 7a. Botst gegarandeerd.
- **9 (routes slopen en redirects)** — verwijdert page-editor-sleutels en
  `EXPECTED`-regels die 7a op datzelfde moment toevoegt. En de redirecttabel
  kan pas als de nieuwe routes bestaan.
- **10 (SEO-fundament)** — `check-seo.mjs` is van 7a.
- **11 (de poort)** — hoort per afspraak achteraan.
- **12 (CMS opschonen)** — de editor-navigatie is `app/page-editor/page.tsx`,
  die 7a uitbreidt.
- **13 (formulieren)** — hangt aan 7a en 8.

**Batch 14 is gesplitst.** 14a is het deel dat nu al kan; 14b wacht op batch 8.

14a — geen enkel bestand gedeeld met 7a:
`components/ui/cookie-banner.tsx`, `components/ui/cookie-preferences-button.tsx`,
`app/cookiebeleid/page.tsx`, `app/privacyverklaring/page.tsx`, `.env.example`.

14b — kan pas na batch 8, want het hangt aan het oude `/contact/`:
het opruimen van het eventmodel. `lib/analytics/events.ts` heeft nog
`doelgroep_keuze`, het type `Doelgroep` en een `Dienst`-type met de drie
Werkreturn-diensten. Dat wordt nu nog gebruikt door
`app/contact/contact-content.tsx`, en die pagina wordt in batch 8 herbouwd.
Nu weghalen breekt de bestaande pagina voor niets.

**Gevonden bij de inventarisatie, hoort in 14a.** Het meet-ID `G-0WMTMVH1ER`
staat hardgecodeerd in twee juridische pagina's: `app/cookiebeleid/page.tsx`
regel 84 en `app/privacyverklaring/page.tsx` regel 177. Dat is de
GA4-property van Werkreturn, meegekomen met de fork. Een privacyverklaring die
de verkeerde property noemt is niet alleen slordig maar feitelijk onjuist.
Dit is een feitencorrectie, geen nieuwe juridische tekst — het valt dus niet
onder de blokkade van batch 15. De cookiebanner draagt daarnaast nog drie
`werkreturn-`namen: de localStorage-sleutel `werkreturn-cookie-consent-v2` en
de events `werkreturn-cookie-consent-updated` en
`werkreturn-open-cookie-preferences`.

## Waar deze site vandaan komt

Drie merken, drie WordPress-sites, één verbouwing in etappes.

| Merk | Oude site | Nieuwe site | Stand |
|---|---|---|---|
| Werkverzuim | WordPress | eigen codebase | **live op eigen domein** |
| Werkreturn | WordPress, draait nog | fork van Werkverzuim | op een Vercel-adres, nog niet omgezet |
| Werkgroup | WordPress, draait nog | fork van Werkreturn | deze repo |

Werkverzuim was de eerste eigen bouw. Werkreturn is daarvan geforkt en staat op
een Vercel-adres omdat de WordPress-versie nog draait. Werkgroup is vervolgens
van de Werkreturn-codebase geforkt. Vandaar dat er in deze repo nog complete
Werkreturn-routes, -secties en -redirects staan: dat is de fork, geen bedoeling.

**Gevolg voor het werk hier:** twee domeinen draaien tegelijk. `werkgroup.nl`
is een levende WordPress-site, en `werkgroup-website.vercel.app` is deze
nieuwe site. Zolang dat zo is, mag de Vercel-versie zich niet voordoen als
werkgroup.nl — zie `NEXT_PUBLIC_SITE_URL` hieronder.

## De bestaande werkgroup.nl — niet eerder geïnventariseerd

Gemeten op 14 september 2026 op de live site. WordPress met Yoast,
`sitemap_index.xml` → `page-sitemap.xml`, **26 URL's**, titel
"Werkgroup | HR en Arbo dienstverlening Regio Aalsmeer."

Veertien daarvan zijn vacatures onder `/vacatures/<slug>/`:

    /vacatures/                /vacatures/solliciteren/
    /vacatures/open-sollicitatie/
    /vacatures/casemanager-verzuim/
    /vacatures/junior-hr-adviseur/
    /vacatures/junior-hr-professional/
    /vacatures/commercieel-intercedent/
    /vacatures/teamleider-werkverzuim/
    /vacatures/bedrijfsarts-werkverzuim/
    /vacatures/accountmanager-new-business-aalsmeer/
    /vacatures/re-integratiecoach-arbeidsdeskundige-werkreturn/
    /vacatures/basisarts-bedrijfsgeneeskunde-anios-werkverzuim-16-24-uur-loondienst-of-zzp/
    /vacatures/vacature/            (lijkt een restant)
    /vacatures/test-vacature/       (lijkt een restant)

De overige twaalf:

    /                          /over-werkgroup/          /contact/
    /bedankt/                  /blog/                    /overige-partners/
    /cookiebeleid-eu/          /meer-over-werkgroup/     /hoe-werkt-het-beter/
    /interview-werkgroup-dga/  /ontwikkelingen-binnen-de-werkgroup/
    /vacature-online-marketeer/

**Livegangblokkade.** Hoofdstuk 2 van de takenlijst gaat over de migratie van
werkreturn.nl naar werkgroup.nl. Maar de domeinswitch vervangt óók deze
levende werkgroup.nl. Zonder redirecttabel breken 26 geïndexeerde URL's op
23 september. Alleen `/`, `/over-werkgroup/`, `/contact/` en `/bedankt/` komen
1-op-1 terug in de nieuwe structuur; `/expertise/` en `/werken-bij/` zijn nieuw.
Wat er met `/blog/` gebeurt is open — de blog blijft in de nieuwe site dicht.

**Wat dit oplost:** de vacaturestructuur is hiermee beslist in plaats van
bedacht. `/vacatures/<slug>/` bestaat al en is geïndexeerd. Nemen we die
structuur en die slugs over, dan blijven alle veertien URL's werken én landen
de twaalf cross-domain redirects vanaf werkreturn.nl correct. Geen enkele
redirect nodig voor het vacaturedeel.

## Beslissingen — genomen

- **De vijf over te nemen vacatures.** Beslist op 15 september 2026. Van de
  acht op de live site gaan er vijf mee: casemanager-verzuim,
  re-integratiecoach-arbeidsdeskundige-werkreturn, basisarts-bedrijfsgeneeskunde
  (lange slug), bedrijfsarts-werkverzuim en junior-hr-professional. Niet mee:
  Accountmanager New Business, Intercedent/Recruiter en Junior HR adviseur.
  Slugs blijven ongewijzigd; dat scheelt vijf redirects. De teksten staan als
  werkkopie in `bronnen/werkgroup/vacatures/`.
- **Werkconnect wordt uitgefaseerd.** Daarom noemt de nieuwe webcopy vier
  labels. De vacatureteksten van de bedrijfsarts en de re-integratiecoach
  noemen Werkconnect nog wel, en de eerste spreekt van "vijf labels onder één
  dak". Die passages worden aangepast: Werkconnect eruit, "vijf" wordt "vier".
  Dit is de enige plek waar van 1:1 overnemen wordt afgeweken.
- **Contactgegevens per vacature gaan mee.** Dat zijn de gespecialiseerde
  contactpersonen per label, inclusief hun eigen telefoonnummer en
  label-e-mailadres. Ze staan dus náást het algemene `085 489 58 79` en
  `info@werkgroup.nl`, niet in plaats daarvan.
- **Salaris en opleidingsniveau komen in het datamodel.** De live site toont ze
  en bij vacatures helpen ze de conversie. Zie
  `2026-09-15-vacaturepagina-ontwerp.md`.
- **Het salaris van de junior HR professional is 2.500 - 3.500.** De bron
  spreekt zichzelf tegen: het metablok zegt 2.500 - 3.500, de lopende tekst
  €2500 - €3000. De hoogste is bevestigd; pas ook de lopende tekst aan.
- **De vacaturedetailpagina volgt het WordPress-ontwerp.** Nick vindt dat
  ontwerp fris en wil het benaderen. Uitgewerkt in
  `2026-09-15-vacaturepagina-ontwerp.md`.

Genomen door Nick op 14 september 2026. Ze staan hier zodat een volgende sessie
ze niet opnieuw voorlegt.

- **Vacature-URL's.** `/vacatures/<slug>/` blijft, precies zoals de live
  werkgroup.nl het al doet. Elke vacature krijgt een eigen deelbare URL.
- **Hoe vacatures worden ontsloten.** Eigen contenttype in het CMS, invoerbaar
  en aanpasbaar. `/vacatures/` is het overzicht, `/werken-bij/` toont dezelfde
  lijst als blok. Wendy bepaalt welke van de veertien bestaande vacatures mee
  overgaan.
- **Cv-upload.** Wordt gebouwd, geen mailto. Vercel Blob en nodemailer zitten
  al in de dependencies; het is upload plus type- en groottecontrole plus
  bijlage.
- **Favicon.** Aangeleverd. `public/favicon-werkgroup.png` (512x512), bronnen in
  `docs/bronnen/logos/favicon-werkgroup-512.png` en `-88.png`.
- **Klantlogo's.** De 18 bestaande logo's zijn ook voor Werkgroup goedgekeurd
  en mogen aan.
- **De vier label-URL's.** Elk label linkt naar de homepage van het eigen
  domein. Gemeten op 14 september 2026, dit zijn de adressen ná redirect:
  Werkassist `https://werkassist.nl/`, Werkverzuim
  `https://www.verzuimopwerk.nl/`, Werkreturn `https://werkreturn.nl/` en
  helloprofs.nl `https://www.helloprofs.nl/`. Werkverzuim draait niet op
  `werkverzuim.nl` — dat domein staat geparkeerd bij een domeinhandelaar.
  Deze vier waarden moeten nog op drie plaatsen worden ingevuld: de
  labelkaarten in `lib/page-editor/defaults.ts`, de vier expertiseblokken van
  `/expertise/` en `components/ui/footer-service-links.tsx`. Ingevuld op alle
  drie de plaatsen in batch 5 (`ccae23c`) en daar gemeten.
- **GA4, GTM en Search Console.** Nick richt dit samen met Codex in. Meet-ID's
  komen uit omgevingsvariabelen, nooit hardgecodeerd.
- **Contactgegevens, deels.** Bevestigd: `085 489 58 79`,
  `info@werkgroup.nl`, LinkedIn `https://www.linkedin.com/company/werkgroup/`,
  Instagram `https://www.instagram.com/werkgroup/`. Het Bodegraven-adres is van
  Werkreturn en hoort hier niet.
- **Bezoekadres Aalsmeer.** Bevestigd door Nick op 15 september 2026:
  **Zwarteweg 110 D, 1431 VM Aalsmeer**. Het adres stond al in de repo, maar
  als Werkreturn-gegeven (`defaults.ts`, het `adressen`-blok van `/contact/`),
  en was daarom nog niet als Werkgroup-waarde bevestigd. Het is het pand waar
  de labels samen zitten — de gevelfoto toont Werkverzuim, Werkreturn en
  Werkassist. Het gaat dus mee als het bezoekadres van Werkgroup.
  De naam erboven wordt `Werkgroup`, niet `Werkreturn Aalsmeer`.
  Nog in te vullen op drie plaatsen, in batch 8:
  `CONTACT.adres` in `components/site-footer.tsx` (staat nu bewust op `null`),
  het `adressen`-blok van `/contact/` in `lib/page-editor/defaults.ts`, en
  `app/klachtenprocedure/page.tsx`, dat het adres nu hardgecodeerd heeft.
  Het tweede adres, **Tjalk 17A, 2411 NZ Bodegraven**, is van Werkreturn en
  gaat eruit — inclusief de paginatitel "Aalsmeer en Bodegraven" in
  `app/contact/layout.tsx` en de `EXPECTED`-regel in `scripts/check-seo.mjs`.

## Beslissingen — nog open

- **Wordmerk van helloprofs.nl.** De drie andere labelkaarten tonen het
  wordmerk uit `docs/bronnen/logos/labels/`; helloprofs.nl heeft er geen en
  staat daarom typografisch.
- **Canonieke host:** `werkgroup.nl` of `www.werkgroup.nl`.
- **Beeld.** De webcopy verbiedt stock en vraagt echte teamfotografie. De
  homepage gebruikt de bestaande teamfoto
  (`/images/werkgroup/werkgroup-team-breed-1.png`) in de hero; de overige
  blokken zijn zonder foto ontworpen. Komt er nieuwe teamfotografie, dan kan
  die er via het CMS in.
- **Redirects voor de bestaande werkgroup.nl.** Zie de inventaris hierboven:
  26 geïndexeerde URL's, waarvan er vier 1-op-1 terugkomen. De rest heeft een
  bestemming nodig. Dit is een livegangblokkade die nog geen batch heeft.
- **Wat er met `/blog/` gebeurt.** Bestaat op de live werkgroup.nl, blijft in de
  nieuwe site dicht.
- **Levert Nick aan, zonder datum:** privacyverklaring, cookiebeleid,
  algemene voorwaarden.

**Als het knelt, dit eerst schrappen:** blog en kennisbank blijven dicht (staat
al zo in de takenlijst), en de niet-vacaturepagina's van de oude werkgroup.nl
krijgen een 301 naar de dichtstbijzijnde nieuwe pagina in plaats van een eigen
bestemming.

## `NEXT_PUBLIC_SITE_URL` — waarom dit er is

Twee domeinen draaien tegelijk: de levende WordPress-site op `werkgroup.nl` en
deze nieuwe site op `werkgroup-website.vercel.app`.

`lib/seo/site.ts` doet een kale stringvergelijking: is `SITE_URL` gelijk aan
`FALLBACK_SITE_URL` (`https://werkgroup.nl`), dan is `IS_CANONICAL_HOST` waar en
is de site indexeerbaar met canonicals naar werkgroup.nl. Er faalt of
waarschuwt niets als dit verkeerd staat.

Zonder de variabele vertelt elke previewpagina aan Google dat de echte versie op
`werkgroup.nl/<pad>` staat — voor Werkreturn-routes die daar 404 geven. Dat
vervuilt een lopende, geïndexeerde site. Daarom moet de variabele het
vercel.app-adres bevatten zolang de site daar draait, en bij livegang juist uit
productie verdwijnen.

Stand op 14 september 2026: de variabele staat in Vercel met de juiste waarde,
maar de laatste deploy dateert van vóór batch 2 — `robots.txt` op het
vercel-adres gaf toen nog `Allow: /` met een sitemap naar werkreturn.nl. Een
nieuwe deploy lost dat op.

Controleren met `curl -s https://werkgroup-website.vercel.app/robots.txt`: daar
hoort `Disallow: /` te staan.


## Geverifieerde feiten

Gemeten in de repository, niet overgenomen uit een document.

- **38 cross-domain redirects** in `next.config.ts` wijzen naar werkgroup.nl:
  26 naar `/`, 11 naar `/vacatures/`, 1 naar `/vacatures/solliciteren/`.
  `2026-09-14-redirects-migratie.md` noemt 32 (22/10/1) en is op dat punt
  verouderd.
- `next.config.ts` bevat in totaal **119 redirects**, allemaal over oude
  werkreturn.nl-WordPress-URL's. Die horen niet bij deze site en gaan er in
  batch 7 uit.
- **URL-structuur** volgens de webcopy: `/`, `/expertise/`, `/over-werkgroup/`,
  `/werken-bij/`, `/contact/`. `trailingSlash: true`.
- **Kleuren:** `#FF6816` (accent), `#FFFFFF`, `#F6F6F6`, `#5D5D5D`.
  Montserrat Bold voor koppen, Open Sans voor de rest.
- **SEO-titels en metabeschrijvingen** voor de vijf pagina's staan letterlijk in
  hoofdstuk 9 van de webcopy — niet zelf verzinnen.
- **Gedeelde testimonials waren al leeg** (`quotes: []`, rating inactief); dat
  risico bestond hier niet.
- **Merkarchitectuur:** Werkgroup is het moedermerk; Werkassist, Werkverzuim,
  Werkreturn en helloprofs.nl zijn de labels. Werkconnect komt nergens voor.
- **Werken bij krijgt géén CTA naar het verkennende gesprek** — daar zijn
  vacaturereactie en open sollicitatie de conversies.

## Bronnen en waar je wat vindt

| Wat | Waar |
|---|---|
| Webcopy, platte werkkopie | `bronnen/werkgroup/webcopy-v1.1.txt` |
| Webcopy, bron | `bronnen/werkgroup/webcopy-webbouwer-v1.1.docx` |
| Huisstijlhandboek | `bronnen/werkgroup/huisstijlhandboek-2026-v1.pdf` |
| Logo's | `bronnen/logos/` |
| Takenlijst, ±200 vinkjes | `2026-09-14-werkgroup-takenlijst.md` |

De werkkopie van de webcopy is per hoofdstuk te lezen zonder het hele document
te verwerken:

| Hoofdstuk | Regel |
|---|---|
| 1 Uitgangspunten en sitemap | 34 |
| 2 Schrijf- en bouwritme | 58 |
| 3 Home | 69 |
| 4 Onze expertise | 146 |
| 5 Over Werkgroup | 196 |
| 6 Werken bij Werkgroup | 261 |
| 7 Contact | 320 |
| 8 Footer | 338 |
| 9 SEO-overzicht | 349 |
| 10 Algemene opmerkingen voor de webbouwer | 372 |
| 11 Technische en redactionele eindcontrole | 386 |

Bijvoorbeeld: `sed -n '69,146p' docs/bronnen/werkgroup/webcopy-v1.1.txt` geeft de
volledige homepagecopy.
