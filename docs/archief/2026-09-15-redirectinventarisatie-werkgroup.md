# Technische redirectinventarisatie Werkgroup

Datum: 15 september 2026  
Status: technisch voorstel, geen zakelijke goedkeuring

Deze inventarisatie brengt de bestaande URL's van de live Werkgroup-site en de
relevante inkomende Werkreturn-koppelingen in kaart. Er zijn geen redirects
geïmplementeerd en er zijn geen productieroutes gewijzigd.

## Scope en normalisatie

De live Werkgroup-sitemap is opgehaald via beide varianten van
`sitemap_index.xml`. Beide endpoints verwezen naar dezelfde
`page-sitemap.xml`, met dezelfde 26 `<loc>`-waarden. De URL's hieronder zijn
voor vergelijking genormaliseerd naar een pad zonder domein, querystring of
afsluitende slash. De sitemap bevatte wel afsluitende slashes.

Een controle van de 26 paden en hun niet-afsluitende-slashvarianten gaf HTTP
200 na eventuele servernormalisatie. De `www`-aanvragen eindigden tijdens deze
meting op een niet-`www` URL. Dat is een waarneming van de live server, geen
besluit over de canonieke host. De keuze tussen `werkgroup.nl` en
`www.werkgroup.nl` blijft open.

## Bronnen en aantallen

| Bron | Ruwe omvang | Genormaliseerde omvang | Status / gebruik |
|---|---:|---:|---|
| Live `werkgroup.nl/sitemap_index.xml` en `www.werkgroup.nl/sitemap_index.xml` | 2 indexaanvragen, 1 child-sitemap | 26 URL's | Beide indexvarianten gaven dezelfde set terug op 15-09-2026. |
| Live HTTP-crawl van de sitemap-URL's | 26 paden plus slash/`www`-varianten | 26 URL's | Alle geteste eindresultaten waren HTTP 200. |
| Bestaande `next.config.ts` op lokale `main` | 119 redirectregels | 38 relevante cross-domainregels | 26 naar de oude homepage, 11 naar het vacatureoverzicht en 1 naar solliciteren. Niet gewijzigd. |
| `docs/werkgroup-voortgang.md` | 26 eerder gedocumenteerde URL's | 26 | Komt overeen met de actuele sitemapset. |
| `docs/live-urls.txt` | 119 Werkreturn-sitemap-URL's | 119 | Bestaande snapshot van 09-09-2026: 53 page, 37 post, 15 category, 10 tag, 4 author. |
| Werkreturn `.xlsx`-export | 123 regels in `Oude URL's` | 123 | Search Console 09-05-2025 t/m 08-09-2026 plus sitemapbronnen; dit is geen Werkgroup-export. |
| Read-only GSC API-audit | 2 page-queries, 31/27 rijen | 21 unieke sitemappaden gematcht | Domeinproperty en URL-prefixproperty over 15-09-2025 t/m 14-09-2026; details en niet-sitemappaden staan in de Google API-audit. |

De laatste twee Werkreturn-bronnen zijn niet opnieuw tot 123 afzonderlijke
Werkreturn-redirectbesluiten uitgewerkt. Alleen de 38 bestaande regels die
naar Werkgroup wijzen zijn als inkomende afhankelijkheid opgenomen. De overige
Werkreturn-URL's blijven beschreven in `docs/url-inventaris.md` en
`docs/2026-09-14-redirects-migratie.md`.

## A. Bestaande live Werkgroup-URL's

In deze tabel betekent `evident 1-op-1` alleen dat de route en de inhoudelijke
functie uit de bestaande informatie zonder inhoudelijke herinterpretatie
terugkomen. `Inhoudelijk voorstel` is geen akkoord. `Besluit nodig` houdt de
bestemming bewust open voor Nick/Wendy.

| Oude genormaliseerde URL | Bron en status | Vermoedelijke nieuwe bestemming | Type relatie | Toelichting |
|---|---|---|---|---|
| `/` | Live page-sitemap; GET 200 | `/` | evident 1-op-1 | Zelfde homepagepad. Geen redirect nodig als de route behouden blijft. |
| `/overige-partners` | Live page-sitemap; GET 200 | — | besluit nodig | Oude losse partnerspagina; geen veilige directe tegenhanger in de nieuwe routekaart. |
| `/cookiebeleid-eu` | Live page-sitemap; GET 200; bestaande redirecttabel kent dezelfde naamswijziging | `/cookiebeleid` | evident 1-op-1 | Duidelijke route-naamswijziging. Juridische inhoud moet nog definitief zijn. |
| `/ontwikkelingen-binnen-de-werkgroup` | Live page-sitemap; GET 200 | `/over-werkgroup` | inhoudelijk voorstel | Onderwerp lijkt bij het moedermerk te horen, maar de inhoudelijke dekking is niet 1-op-1 vastgesteld. |
| `/vacature-online-marketeer` | Live page-sitemap; GET 200 | `/vacatures` | besluit nodig | Oude vacature staat niet in de vijf gekozen vacature-slugs; bepalen of bewaren, vacatureoverzicht of verval. |
| `/vacatures/vacature` | Live page-sitemap; GET 200 | `/vacatures` | besluit nodig | In de voortgang als restant aangemerkt; geen inhoudelijke vacaturebestemming vastgesteld. |
| `/vacatures/test-vacature` | Live page-sitemap; GET 200 | `/vacatures` | besluit nodig | Test-/restantpagina; niet als redirectbesluit invullen zonder zakelijke keuze. |
| `/over-werkgroup` | Live page-sitemap; GET 200 | `/over-werkgroup` | evident 1-op-1 | Bestaande route staat in de nieuwe Werkgroup-structuur. |
| `/vacatures/teamleider-werkverzuim` | Live page-sitemap; GET 200 | `/vacatures` | besluit nodig | Vacature staat niet in de vijf gekozen vacature-slugs. |
| `/bedankt` | Live page-sitemap; GET 200 | `/bedankt` | evident 1-op-1 | Bestaande route is in de nieuwe app aanwezig; noindex-/formuliergedrag staat los van de redirectkeuze. |
| `/meer-over-werkgroup` | Live page-sitemap; GET 200 | `/over-werkgroup` | inhoudelijk voorstel | Waarschijnlijke inhoudelijke verwantschap, maar oude en nieuwe copy zijn niet gelijkgesteld. |
| `/hoe-werkt-het-beter` | Live page-sitemap; GET 200 | `/expertise` | inhoudelijk voorstel | Mogelijke inhoudelijke aansluiting op expertise; zakelijke inhoudscontrole nodig. |
| `/interview-werkgroup-dga` | Live page-sitemap; GET 200 | `/over-werkgroup` | inhoudelijk voorstel | Verhaal over Werkgroup, maar geen evident gelijkwaardige nieuwe pagina. |
| `/contact` | Live page-sitemap; GET 200 | `/contact` | evident 1-op-1 | Bestaande route staat in de nieuwe Werkgroup-structuur. |
| `/vacatures/accountmanager-new-business-aalsmeer` | Live page-sitemap; GET 200 | `/vacatures` | besluit nodig | Vacature is niet gekozen voor overname; bestemming van vervallen vacature apart goedkeuren. |
| `/vacatures/junior-hr-adviseur` | Live page-sitemap; GET 200 | `/vacatures` | besluit nodig | Vacature is niet gekozen voor overname; bestemming van vervallen vacature apart goedkeuren. |
| `/vacatures/junior-hr-professional` | Live page-sitemap; GET 200 | `/vacatures/junior-hr-professional` | evident 1-op-1 | Gekozen vacature; slug blijft volgens de voortgang ongewijzigd. Publicatie in het nieuwe CMS blijft een technische voorwaarde. |
| `/vacatures/commercieel-intercedent` | Live page-sitemap; GET 200 | `/vacatures` | besluit nodig | Vacature is niet gekozen voor overname; bestemming van vervallen vacature apart goedkeuren. |
| `/vacatures/open-sollicitatie` | Live page-sitemap; GET 200 | `/vacatures/solliciteren` | besluit nodig | Nieuwe open-sollicitatieflow en route zijn nog niet als werkende eindbestemming vastgesteld. |
| `/vacatures/solliciteren` | Live page-sitemap; GET 200 | `/vacatures/solliciteren` | besluit nodig | Zelfde pad is inhoudelijk aannemelijk, maar de route bestaat op dit moment niet in de nieuwe app. |
| `/blog` | Live page-sitemap; GET 200 | — | besluit nodig | De nieuwe blog blijft volgens de voortgang dicht; behouden, noindexen of redirecten is nog open. |
| `/vacatures/bedrijfsarts-werkverzuim` | Live page-sitemap; GET 200 | `/vacatures/bedrijfsarts-werkverzuim` | evident 1-op-1 | Gekozen vacature; slug blijft volgens de voortgang ongewijzigd. Publicatie in het nieuwe CMS blijft een technische voorwaarde. |
| `/vacatures/basisarts-bedrijfsgeneeskunde-anios-werkverzuim-16-24-uur-loondienst-of-zzp` | Live page-sitemap; GET 200 | `/vacatures/basisarts-bedrijfsgeneeskunde-anios-werkverzuim-16-24-uur-loondienst-of-zzp` | evident 1-op-1 | Gekozen vacature; lange slug blijft volgens de voortgang ongewijzigd. |
| `/vacatures` | Live page-sitemap; GET 200 | `/vacatures` | evident 1-op-1 | Bestaand vacatureoverzicht en nieuwe route hebben dezelfde functie en slug. |
| `/vacatures/re-integratiecoach-arbeidsdeskundige-werkreturn` | Live page-sitemap; GET 200 | `/vacatures/re-integratiecoach-arbeidsdeskundige-werkreturn` | evident 1-op-1 | Gekozen vacature; slug blijft volgens de voortgang ongewijzigd. |
| `/vacatures/casemanager-verzuim` | Live page-sitemap; GET 200 | `/vacatures/casemanager-verzuim` | evident 1-op-1 | Gekozen vacature; slug blijft volgens de voortgang ongewijzigd. |

### Evidente voorstellen uit tabel A

Er zijn 11 technische voorstellen met een duidelijke 1-op-1-relatie: `/`,
`/cookiebeleid-eu` → `/cookiebeleid`, `/over-werkgroup`, `/bedankt`,
`/contact`, het vacatureoverzicht en de vijf gekozen vacature-slugs. De vier
nieuwe bestemmingen die geen redirect nodig hebben (`/`, `/over-werkgroup`,
`/bedankt`, `/contact`) zijn behoudbeslissingen; de cookie- en vacaturepaden
zijn de enige feitelijke padwijzigingen binnen deze evidente groep.

## B. Bestaande Werkreturn-verwijzingen naar Werkgroup

Deze 38 regels zijn geen nieuwe Werkgroup-URL's. Het zijn bestaande bronnen in
de Werkreturn-redirecttabel die bij de domeinswitch hun huidige Werkgroup-
bestemming moeten blijven volgen of opnieuw moeten worden vastgesteld. De
bestaande bestemming is hieronder als pad weergegeven; daarmee leg ik geen
host vast.

### B1. Bestaande vacaturebestemming

| Oude Werkreturn-bron | Bron/status | Vermoedelijke nieuwe bestemming | Type relatie | Toelichting |
|---|---|---|---|---|
| `/vacatures` | `next.config.ts` main; 301-regel; bestemming live GET 200 | `/vacatures` | evident 1-op-1 | Bestaande expliciete koppeling naar het vacatureoverzicht; lokale nieuwe route bestaat. |
| `/vacatures/page/3` | `next.config.ts` main; 301-regel; bestemming live GET 200 | `/vacatures` | evident 1-op-1 | Oude paginering heeft geen nieuwe pagineringsroute; vacatureoverzicht is de bestaande doelrelatie. |
| `/category/solliciteren` | `next.config.ts` main; 301-regel; bestemming live GET 200 | `/vacatures` | evident 1-op-1 | Bestaande expliciete vacaturekoppeling; taxonomiebron verandert niet de eindbestemming. |
| `/vacature-recruiter` | `next.config.ts` main; 301-regel; bestemming live GET 200 | `/vacatures` | evident 1-op-1 | Bestaande expliciete koppeling naar vacatureoverzicht. |
| `/social-return-recruiter` | `next.config.ts` main; 301-regel; bestemming live GET 200 | `/vacatures` | evident 1-op-1 | Bestaande expliciete koppeling naar vacatureoverzicht. |
| `/administratieve-vacatures-van-werkreturn` | `next.config.ts` main; 301-regel; bestemming live GET 200 | `/vacatures` | evident 1-op-1 | Bestaande expliciete vacaturekoppeling. |
| `/bouwvacatures-van-werkreturn` | `next.config.ts` main; 301-regel; bestemming live GET 200 | `/vacatures` | evident 1-op-1 | Bestaande expliciete vacaturekoppeling. |
| `/gww-vacatures-van-werkreturn` | `next.config.ts` main; 301-regel; bestemming live GET 200 | `/vacatures` | evident 1-op-1 | Bestaande expliciete vacaturekoppeling. |
| `/techniek-vacatures-van-werkreturn` | `next.config.ts` main; 301-regel; bestemming live GET 200 | `/vacatures` | evident 1-op-1 | Bestaande expliciete vacaturekoppeling. |
| `/category/vacatures` | `next.config.ts` main; 301-regel; bestemming live GET 200 | `/vacatures` | evident 1-op-1 | Bestaande expliciete vacaturekoppeling. |
| `/category/vacatures/vacature` | `next.config.ts` main; 301-regel; bestemming live GET 200 | `/vacatures` | evident 1-op-1 | Bestaande expliciete vacaturekoppeling. |

Deze groep bevat 11 bronnen. De koppeling naar het nieuwe lokale
`/vacatures`-pad is technisch aannemelijk, maar de definitieve host moet nog
worden gekozen voordat absolute cross-domainbestemmingen worden aangepast.

### B2. Bestaande sollicitatiebestemming

| Oude Werkreturn-bron | Bron/status | Vermoedelijke nieuwe bestemming | Type relatie | Toelichting |
|---|---|---|---|---|
| `/solliciteren` | `next.config.ts` main; 301-regel; bestemming live GET 200 | `/vacatures/solliciteren` | besluit nodig | De bestaande expliciete bestemming is inhoudelijk logisch, maar de lokale nieuwe route bestaat nu nog niet. Routegarantie of alternatief nodig. |

### B3. Huidige homepagebestemming, apart voor zakelijke goedkeuring

Alle 26 onderstaande bronnen wijzen nu naar de live Werkgroup-homepage. Dat is
geen voorstel voor de nieuwe site. De meest waarschijnlijke inhoudelijke
richting is meestal `/expertise`, maar dat volgt niet automatisch uit de
slug. Deze regels blijven daarom expliciet in de categorie `besluit nodig`.

| Oude Werkreturn-bron | Bron/status | Vermoedelijke nieuwe bestemming | Type relatie | Toelichting |
|---|---|---|---|---|
| `/gemeenten` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Homepagebestemming uit bestaande tabel; inhoudelijke nieuwe Werkgroup-bestemming ontbreekt. |
| `/gemeente` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Homepagebestemming uit bestaande tabel; enkelvoudige variant apart controleren. |
| `/gemeenten/medisch-advies` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Onderwerp kan bij expertise horen, maar geen inhoudelijke 1-op-1-bestemming vastgesteld. |
| `/gemeenten/re-integratie-participatie` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Onderwerp kan bij expertise horen, maar geen inhoudelijke 1-op-1-bestemming vastgesteld. |
| `/gemeenten/arbeidsdeskundigonderzoek` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Onderwerp kan bij expertise horen, maar geen inhoudelijke 1-op-1-bestemming vastgesteld. |
| `/gemeenten/sroi-participatie` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Social-return-/gemeentecontext vraagt zakelijke bestemming. |
| `/gemeenten/sociaal-detacheren` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Detachering-/gemeentecontext vraagt zakelijke bestemming. |
| `/gemeenten-als-aanjager-van-de-inclusieve-arbeidsmarkt` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Inhoudelijk Werkgroup-onderwerp; homepage niet als eindbesluit overnemen. |
| `/de-participatiewet` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Inhoudelijk Werkgroup-onderwerp; nieuwe inhoudelijke dekking ontbreekt. |
| `/social-return` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Social-returnbestemming en eventuele expertise-URL moeten zakelijk worden gekozen. |
| `/social-return-doelgroepen` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Doelgroepinhoud; geen veilige 1-op-1-bestemming. |
| `/social-return-verhalen` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Verhalen-/contentbestemming; blog blijft bovendien inhoudelijk open. |
| `/alles-over-social-return` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Inhoudelijk voorstel vereist, homepage niet automatisch behouden. |
| `/wat-is-inclusief-ondernemen` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Inhoudelijk onderwerp; nieuwe pagina of expertisebestemming moet worden bepaald. |
| `/detachering` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Werkgroup-onderwerp, maar nieuwe bestemming niet vastgesteld. |
| `/detacheringsbureau-aalsmeer` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Lokale/merkcontext vraagt inhoudelijke controle. |
| `/detacheren-begeleiden-en-zekerheiddat-werkt-beter` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Artikel-/propositiebestemming niet 1-op-1 vastgesteld. |
| `/van-nieuwkomer-naar-toegewijde-medewerker` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Inhoudelijk verhaal; homepage niet als voorstel overnemen. |
| `/op-bezoek-bij-mixt-creations` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Case-/verhaalpagina; nieuwe contentstatus is onbekend. |
| `/doorzetters-in-het-lab` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Verhaalpagina; geen nieuwe gelijkwaardige route vastgesteld. |
| `/wsp-hr-at-the-movies` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Event-/verhaalpagina; geen nieuwe gelijkwaardige route vastgesteld. |
| `/category/sroi` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Taxonomiebron; inhoudelijke nieuwe bestemming ontbreekt. |
| `/tag/sroi` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Taxonomiebron; inhoudelijke nieuwe bestemming ontbreekt. |
| `/tag/aanbestedingen` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Taxonomiebron; inhoudelijke nieuwe bestemming ontbreekt. |
| `/tag/gemeenten` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Taxonomiebron; inhoudelijke nieuwe bestemming ontbreekt. |
| `/tag/inclusieve-arbeidsmarkt` | `next.config.ts` main; 301-regel; huidige homepage GET 200 | — | besluit nodig | Taxonomiebron; inhoudelijke nieuwe bestemming ontbreekt. |

## Open besluitpunten en ontbrekende data

1. Kies de canonieke host (`werkgroup.nl` of `www.werkgroup.nl`) voordat
   absolute cross-domainbestemmingen worden aangepast. Deze inventarisatie
   neemt daar geen besluit over.
2. Laat de 15 niet-evidente live Werkgroup-paden uit tabel A zakelijk bepalen:
   vier inhoudelijke voorstellen, de niet-geselecteerde/restantvacatures,
   `/vacatures/open-sollicitatie`, `/vacatures/solliciteren`, `/blog` en
   `/overige-partners`.
3. Laat de 26 bestaande Werkreturn-homepagebestemmingen uit tabel B3 apart
   goedkeuren. De bestaande homepagekoppeling is als bron vastgelegd, niet als
   nieuw voorstel.
4. Garandeer de route `/vacatures/solliciteren` of kies een alternatief voordat
   de ene bestaande sollicitatiekoppeling kan worden behouden.
5. Bevestig voor de vijf gekozen vacature-slugs dat CMS-publicatie en de
   dynamische route vóór livegang werken.
6. De read-only GSC API-audit heeft voor de laatste auditperiode wel page-data
   opgehaald. De domeinproperty bevat 674 klikken en 26.098 vertoningen over
   31 rijen; de URL-prefixproperty bevat 547 klikken en 20.998 vertoningen
   over 27 rijen. De aanvullende paden en assets buiten de sitemap staan apart
   in `docs/redirects/raw/2026-09-15-gsc-unmatched-pages.tsv`.
7. De live sitemap is geen volledige crawl. Inkomende links buiten de sitemap,
   robotsblokkades, canonicals en analyticsdata zijn niet volledig vastgesteld.
   De bestaande 38 Werkreturn-regels zijn wel meegenomen als bekende
   afhankelijkheid.

## Search Console bij de domeinswitch — vooruitblik

Dit is een uitvoeringsplan voor het moment waarop de DNS-switch plaatsvindt;
er is nu niets ingediend of gewijzigd. Op dit moment staat in Search Console
nog de oude WordPress-sitemap `https://werkgroup.nl/sitemap_index.xml`,
laatst opgehaald op 4 september 2026. De nieuwe site serveert
`https://werkgroup.nl/sitemap.xml` met 22 URL's. Google beschrijft een sitemap
als een verwijzing naar een bestand dat op de site staat; indienen uploadt dus
niets naar Google. Zie de [Sitemaps-help](https://support.google.com/webmasters/answer/7451001).

### Exacte volgorde

1. **Vooraf: host en release vastzetten.** Kies definitief tussen
   `werkgroup.nl` en `www.werkgroup.nl`, controleer de 22 uiteindelijke URL's,
   canonicals, 301-mapping en de productiebuild. Verifieer in Search Console
   zowel de domeinproperty `sc-domain:werkgroup.nl` als de gekozen
   URL-prefixvariant; de domeinproperty blijft de hoofdmeting.
2. **Preflight op Vercel, zolang WordPress nog live is.** Laat Production
   voorlopig `NEXT_PUBLIC_SITE_URL` op het Vercel-adres houden. Daardoor is
   `IS_CANONICAL_HOST` in `lib/seo/site.ts` `false`: de preview/productiebuild
   blijft op `noindex` en `Disallow: /`, en `robots.ts` adverteert daar geen
   sitemap. Test `sitemap.xml` rechtstreeks op het Vercel-adres en controleer
   de 22 regels, maar dien die URL nog niet in.
3. **DNS omzetten naar de nieuwe productie.** Zet pas nu de gekozen
   canonieke host naar de nieuwe deployment. Controleer certificaat, HTTP
   200, de homepage, de kernroutes en de oude URL's met de afgesproken 301's.
   De korte tussenfase waarin de nog actieve build `noindex`/`Disallow: /`
   teruggeeft is veilig; maak de site niet vroegtijdig indexeerbaar op het
   Vercel-adres.
4. **Canonieke productiebuild activeren.** Nadat DNS naar de nieuwe site wijst,
   verwijder je `NEXT_PUBLIC_SITE_URL` uitsluitend uit de Vercel-omgeving
   **Production** en maak je een nieuwe productiebuild. Dan valt
   `lib/seo/site.ts` terug op `https://werkgroup.nl` en wordt
   `IS_CANONICAL_HOST` `true`. Kies je uiteindelijk `www`, pas dan eerst
   `FALLBACK_SITE_URL` aan en deploy opnieuw; laat de fallback en de gekozen
   host nooit uit elkaar lopen.
5. **HTTP-controle na de nieuwe build.** Controleer op de echte host:
   `robots.txt` moet `Allow: /` bevatten, alleen beheer-, API- en builderroutes
   disallowen en `Sitemap: https://werkgroup.nl/sitemap.xml` noemen. Er mag
   geen `Disallow: /`, Vercel-canonical of oude `sitemap_index.xml` meer staan.
   Controleer daarna `sitemap.xml` op HTTP 200, geldig XML, precies 22
   canonieke URL's, geen noindex-/beheerpagina's en bereikbare eindstatussen.
6. **Nieuwe sitemap indienen.** Dien in de Sitemaps-rapportage van de
   domeinproperty precies `https://werkgroup.nl/sitemap.xml` in en controleer
   dat de eerste fetch succesvol is en het verwachte aantal URL's toont.
   Gebruik URL-inspectie daarna voor de homepage en de belangrijkste nieuwe
   routes; vraag alleen voor die prioriteits-URL's indexering aan als dat nodig
   is. Een switch van WordPress naar een nieuwe hoster op hetzelfde domein is
   geen Change of Address.
7. **Oude sitemap opruimen.** Verwijder pas nadat de nieuwe sitemap succesvol
   is opgehaald de oude Search Console-inzending
   `https://werkgroup.nl/sitemap_index.xml`. De oude sitemap hoort na de DNS-
   switch niet meer op de canonieke host te bestaan; laat hem daar 404/410
   geven en dien hem niet opnieuw in. Een verwijderde inzending wist de oude
   URL's niet uit Google; de echte opruiming gebeurt door het oude bestand weg
   te halen en de pagina-URL's via 301, 404/410 of een inhoudelijk besluit af
   te handelen. Zie ook Google over [sitemap verwijderen](https://support.google.com/webmasters/answer/7451001)
   en [site moves](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).
8. **Nazorg.** Controleer dezelfde dag en dagelijks in de eerste week de
   Sitemaps-status, Page Indexing, crawl-/serverfouten, 404's, redirectketens,
   canonicals en de belangrijkste conversies. De redirectset en de sitemap
   blijven naast elkaar nodig: een sitemap vervangt geen redirects.

### Wat moet er in de code nog worden aangepast?

- **`lib/seo/site.ts`:** bij de gekozen niet-`www`-host is geen codewijziging
  nodig; het verwijderen van de productievariabele activeert de bestaande
  fallback. Bij een keuze voor `www` moet `FALLBACK_SITE_URL` eerst naar die
  host worden gezet. Een wijziging van een publieke environment variable
  vereist altijd een nieuwe build.
- **`app/robots.ts`:** geen aparte Search Console-wijziging nodig. De bestaande
  `IS_CANONICAL_HOST`-tak geeft op de canonieke host de sitemapregel door via
  `siteUrl('/') + 'sitemap.xml'`; voeg de oude WordPress-sitemap niet toe.
  Controleer wel het gegenereerde bestand na de switch.
- **`app/sitemap.ts`:** geen switch-specifieke codewijziging nodig. Het bestand
  gebruikt al `siteUrl()` en volgt dus dezelfde host als canonicals en robots.
  Pas alleen `staticRoutes` of de publicatiebron voor vacatures aan als de
  definitieve set niet exact de 22 canonieke, indexeerbare URL's oplevert. Het
  indienen zelf gebeurt in Search Console, niet in dit bestand.

## Verbeterpunten — voorstellen, niet uitgevoerd

- **Conversie-events en rapportage.** De code bevat de basis-events, maar de
  Werkgroup-property heeft volgens de read-only audit nog alleen `purchase` als
  key event en geen custom dimensions. Richt daarom minimaal
  `formulier_verzonden`, `telefoon_klik` en `email_klik` in als key events en
  registreer de vijf parameters (`pagina`, `doelgroep`, `dienst`, `cta_type`,
  `positie`). Voeg `formulier` als rapportageparameter toe om contact en
  sollicitatie uit elkaar te houden. Overweeg daarnaast
  `vacature_view`/`sollicitatie_start`, `download_klik` voor PDF's en een
  `label_klik` of `extern_link_klik` voor verwijzingen naar de zustersites.
- **Cross-domain meting.** Beslis eerst of Werkgroup, Werkreturn en Werkassist
  één gezamenlijke GA4-property en hetzelfde webstream-ID krijgen. Alleen met
  dezelfde Google-tag/measurement ID op alle domeinen kan GA4 één gebruiker en
  sessie over de domeinen heen behouden; configureer daarna de drie domeinen
  in *Configure your domains*, controleer `_gl` op de uitgaande link en sluit
  self-referrals uit. Zie [Google's cross-domain-instructies](https://support.google.com/analytics/answer/10071811).
  Bij aparte properties is dit geen echte één-sessie-meting; gebruik dan een
  expliciet extern-linkevent en consequente UTM's, en rapporteer de overdracht
  als twee datasets.
- **Intern verkeer.** Leg de kantoor-, VPN-, bureau- en ontwikkelaars-IP's
  vast, definieer in de webstream `traffic_type=internal` en zet het GA4-filter
  eerst op *Testing*. Activeer het pas na controle; uitsluiten is permanent
  voor nieuwe data en werkt niet terugwerkend. Gebruik voor ontwikkelaars ook
  de aparte developer/debug-filter. Zie [Google's uitleg over datafilters](https://support.google.com/analytics/answer/13296761)
  en [intern verkeer](https://support.google.com/analytics/answer/10104470).

## Reproduceerbaarheid en controles

De ruwe bronextracten staan in [`docs/redirects/raw/`](redirects/raw/). De
read-only controle valideert de TSV-structuur, de 52 ruwe sitemapobservaties,
26 genormaliseerde paden, de HTTP-statuskolom, dubbele paden en de 38
cross-domainregels:

```bash
npm run check:redirect-inventory
```

Uitgevoerd voor deze inventarisatie:

- actuele sitemap-indexen en child-sitemap read-only opgehaald via beide hostvarianten;
- 26 sitemap-URL's en hun slash-/`www`-varianten read-only gecontroleerd;
- `next.config.ts` op lokale `main` read-only geanalyseerd: 119 regels, waarvan 38 relevante Werkgroup-koppelingen;
- bestaande Werkreturn-documentatie en de `.xlsx`-inspectie read-only gecontroleerd;
- de nieuwe controle geslaagd;
- de read-only GSC-, GTM- en GA4-API-audit uitgevoerd; resultaten staan apart
  beschreven in [`docs/2026-09-15-google-api-audit-werkgroup.md`](2026-09-15-google-api-audit-werkgroup.md);
- `next.config.ts`, `app/`, `app/sitemap.ts` en bestaande productieroutes niet gewijzigd;
- niet gepusht en niet gedeployed.
