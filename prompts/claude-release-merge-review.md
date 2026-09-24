# Overdracht aan Claude — onafhankelijke release- en mergereview

Je haakte eerder af rond stap 4 van de oplevering van vier Werkgroup-sites.
Inmiddels zijn stappen 4 t/m 7b voor de drie nieuwe sites uitgevoerd en door
een tweede reviewer gecontroleerd. Pak de draad niet op vanuit aannames: lees
de onderstaande context, inspecteer daarna zelf de repositories en geef een
onafhankelijk, kritisch mergeadvies.

**Datum van deze momentopname:** 23 september 2026.

## Harde opdrachtgrens

Werk in deze ronde uitsluitend analyserend en read-only.

- Niet mergen, rebasen, cherry-picken, committen of pushen.
- Geen branches, worktrees, tags of bestanden verwijderen.
- Geen `git reset`, `git clean`, `git add -A` of vergelijkbare mutaties.
- Geen Vercel-environmentvariabelen, DNS, GTM of Google-configuratie wijzigen.
- Geen secrets of volledige environmentwaarden afdrukken.
- `git fetch origin --prune` om remote refs te actualiseren is toegestaan,
  maar controleer vooraf de status en raak geen working-treebestanden aan.
- Corrigeer dit voorgestelde plan nadrukkelijk als jouw eigen controle laat
  zien dat het onveilig, onvolledig of onnodig complex is.

## Overkoepelend plan en repositories

Lees eerst:

- `00-STAPPENPLAN-oplevering.md`
- `prompts/Agent 1/stap4b-fixes.md` t/m `stap7b-fixes.md`
- `prompts/Agent 2/stap4b-fixes.md` t/m `stap7b-fixes.md`
- `prompts/Agent 3/stap4b-fixes.md` t/m `stap7b-fixes.md`

De vier repositories zijn:

| Site | Hoofdrepository |
|---|---|
| Werkreturn | `Werkreturn/Werkreturn website/website-werkreturn` |
| Werkgroup | `Werkgroup/Werkgroup-website` |
| Werkassist | `Werkassist/werkassist-website` |
| Werkverzuim | `Werkverzuim website/website-werkverzuim` |

De drie agentworktrees zijn:

| Site | Branch | Worktree | Huidige head |
|---|---|---|---|
| Werkreturn | `fase3-werkreturn` | `/private/tmp/fase3-werkreturn` | `2890e36` |
| Werkgroup | `fase3-werkgroup` | `Werkgroup/Werkgroup-website/Werkgroup/fase3-werkgroup` | `a053dc6` |
| Werkassist | `fase3-werkassist` | `/private/tmp/fase3-werkassist` | `fde7ebd` |

Deze fase-3-branches zijn lokaal en nog niet gepusht.

## Wat sinds stap 4 is uitgevoerd

### Stap 4 en 4b — tracking, consent en formulieren

Over de drie sites zijn onder meer uitgevoerd:

- formulier- en sollicitatie-events voorzien van het juiste `formulier`-type;
- `pagina_context` ontdubbeld zodat rerenders, Strict Mode en
  doelgroepwijzigingen geen tweede event voor hetzelfde pad geven;
- kennisartikelklikken en routes gecontroleerd;
- consentvolgorde en reCAPTCHA-fail-closedgedrag aangescherpt;
- dynamische GA4-cookiecontrole toegevoegd/gecorrigeerd;
- bestaande eventnamen bewust niet hernoemd vanwege het GTM-contract.

Belangrijke finale trackingcommits zijn onder andere:

- Werkreturn: `a099694`, `cffc765`, `61f8375`
- Werkgroup: `aeb338c`, `f3ac8db` plus de eerdere formuliercommits in de
  `fase3-werkgroup`-reeks
- Werkassist: `4770076`, `fad4ceb` plus de eerdere formuliercommits in de
  `fase3-werkassist`-reeks

### Stap 5 en 5b — mediabibliotheek

- Werkreturn: alle 49 lokale afbeeldingen waren al geregistreerd; niets
  verwijderd.
- Werkgroup: ontbrekende statische afbeeldingen zijn geregistreerd in
  `3e4e66d`. De byte-identieke kopie
  `public/images/werkgroup/suzanne-website.jpg` is daarna op expliciet akkoord
  verwijderd. De 18 klantlogo's zijn behouden en de LogoBar is geactiveerd in
  `dc4d237`.
- Werkassist: het aparte headerlogo
  `/images/labels/werkassist-header.png` is geregistreerd in `32b1417`; het
  bestaande `werkassist.png` blijft bewust voor footer/OG/JSON-LD.
- Andere mogelijke ongebruikte beelden zijn bewust behouden.
- Een verwijderfunctie in de CMS-mediabibliotheek is besproken maar nog niet
  gebouwd. Dat is een afzonderlijke verbetering, geen onderdeel van deze
  merge.

### Stap 6 en 6b — sitemap, robots en preview-noindex

- Publieke routes en uitsluitingen zijn per site gecontroleerd.
- Previewdeploys zijn via `VERCEL_ENV=preview` gehard naar noindex en
  `Disallow: /`.
- Verzonnen/onbetrouwbare `lastModified`, `changeFrequency` en `priority`
  zijn weer verwijderd.
- Werkreturn-broncopy van vijf juridische/bedanktdescriptions is hersteld;
  alleen die routes hebben een gerichte uitzondering in de SEO-check.

Finale correctiecommits:

- Werkreturn: `79e7e5a`
- Werkgroup: `696a7e6`
- Werkassist: `fc0039e`

### Stap 7 en 7b — veilige repo-opruiming

De eerste stap was analyse-only. Daarna is alleen expliciet veilige cleanup
uitgevoerd:

- alle drie: `@hookform/resolvers`, `@tailwindcss/typography` en
  `tw-animate-css` verwijderd;
- Werkassist aanvullend: `playwright` verwijderd omdat daar geen imports,
  scripts, tests of configuratie voor bestaan;
- Werkreturn en Werkgroup behouden Playwright omdat `scripts/shot.mjs` het
  importeert;
- redundante `.eslintrc.json` verwijderd;
- ongebruikte `node:path`/`node:url`-imports en bijbehorende constanten uit
  `eslint.config.mjs` verwijderd;
- losse `zz` uit de README's van Werkreturn en Werkgroup verwijderd;
- componenten, CMS, media, analytics, routes en docs bewust behouden.

Finale heads:

- Werkreturn: `2890e36`
- Werkgroup: `a053dc6`
- Werkassist: `fde7ebd`

Een onafhankelijke tweede controle heeft op alle drie opnieuw succesvol
gedraaid:

```bash
npm run check:types && npm run lint && npx next build && git diff --check
```

De drie fase-3-worktrees waren daarna schoon. Controleer dit zelf opnieuw.

## Actuele branches en bekende divergentie

Controleer dit tegen de actuele remotes; onderstaande SHA's waren op
23 september 2026 via `git ls-remote` bevestigd.

### Werkreturn

- `origin/main`: `3dfa622`
- lokale `fase3-werkreturn`: `2890e36`
- divergentie ten opzichte van main: main heeft 3 andere commits,
  fase-3 heeft 11 commits.
- De Werkreturn-link-networkwijzigingen zitten al in `origin/main`.
- De remote branch `seo-link-network-2026-09` loopt achter en hoeft niet
  afzonderlijk te worden gemerged.
- Een eerdere `git merge-tree`-simulatie gaf geen conflictmarkers; overlap zat
  in `app/blog/[slug]/page.tsx` en `app/blog/page.tsx`.

### Werkgroup

- `origin/main`: `09a411c`
- `origin/seo-link-network-2026-09`: `71ace31` — 2 commits boven main
- lokale `fase3-werkgroup`: `a053dc6` — 17 commits boven main
- Een gecombineerde mergesimulatie gaf geen conflictmarkers; overlap zat in
  `app/home-content.tsx` en `app/vacatures/[slug]/page.tsx`.
- De hoofdworktree bevat als niet-getrackte map `Werkgroup/`, omdat de
  fase-3-worktree onhandig binnen de hoofdrepo staat. Voer daar beslist geen
  brede staging- of cleanupcommando's uit.

### Werkassist

- actuele `origin/main`: `f68e7ee`
- lokale `main` en de lokaal genoemde `seo-link-network-2026-09` staan nog op
  `fbbd5dc` en lopen één triviale README-commit achter.
- lokale `fase3-werkassist`: `fde7ebd`, 12 eigen commits boven `fbbd5dc`.
- Gebruik dus `origin/main`, niet de achterlopende lokale `main`, als basis.
- De eerdere mergesimulatie tegen `origin/main` gaf geen overlap of
  conflictmarkers.
- De branchnaam `seo-link-network-2026-09` bevat bij Werkassist geen unieke
  commit en staat niet op origin.

### Werkverzuim

- `origin/main`: `180165c`
- `origin/seo-link-network-2026-09`: `7af776f` — 2 commits boven main
- Technisch fast-forwardbaar.
- De huidige hoofdworktree heeft een lokale wijziging in
  `tsconfig.tsbuildinfo`. Deze gegenereerde wijziging niet stagen, herstellen
  of meenemen zonder eerst eigendom en noodzaak vast te stellen.

## Oude branches die niet opnieuw gemerged moeten worden

Een eerdere `git cherry`-controle liet zien dat onderstaande niet-ancestor
branches patch-equivalent al aanwezig zijn in de relevante hoofd-/fasebranch:

- `ticket-4-media-upload-werkreturn`
- `ticket-4-media-upload-werkgroup`
- `batch-3-contact-email` bij Werkassist
- `feat/analytics-cookies` bij Werkgroup

Controleer dit zelf opnieuw met `git cherry -v`, maar merge deze branches niet
alleen omdat `git branch --no-merged` ze noemt. De overige ticketbranches zijn
via de eerdere integratiebranches al in main terechtgekomen.

## Open inhoudelijk punt: Werkassist-kruislinks

Werkreturn, Werkgroup en Werkverzuim bevatten een nieuwe
`ContentLinkNetwork`. Werkassist niet. Bovendien linkt de actieve
Werkassist-footer momenteel naar Werkverzuim, Werkreturn en helloprofs.nl,
maar niet naar het moedermerk Werkgroup.

Onderzoek en adviseer expliciet:

1. Was de cross-site link-networkronde bedoeld voor alle vier sites?
2. Is het ontbreken bij de kleine Werkassist-site een bewuste uitzondering of
   een gemiste wijziging?
3. Moet vóór de release minimaal Werkgroup aan de Werkassist-footer worden
   toegevoegd?
4. Is een compacte `ContentLinkNetwork` op de Werkassist-homepage inhoudelijk
   en SEO-technisch verantwoord, of zou dat geforceerd/dunne content zijn?

Voer de fix nu niet uit; geef een concreet pre-mergeadvies.

## Externe releaseblokkades en runtimecontext

- Werkassist heeft in Vercel zowel
  `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` als `RECAPTCHA_SECRET_KEY` voor Production
  en Preview. Een Production-deploy na de env-update serveerde aantoonbaar de
  Google reCAPTCHA-script-URL. Er was toen nog geen Preview-deploy om Preview
  runtime te bewijzen.
- Werkreturn en Werkgroup misten bij de laatste controle beide reCAPTCHA-vars
  voor Production en Preview. Controleer alleen aanwezigheid/scope als je daar
  veilig toegang toe hebt; toon nooit waarden.
- Definitieve SMTP-gegevens van Joteck/ICT ontbreken nog. Daardoor kan de
  volledige formulierketen tot ontvangen e-mail nog niet worden bewezen.
- GTM laadde op de toenmalige productiealiases van alle drie nieuwe sites,
  maar consent- en formulier-events moeten na reCAPTCHA/SMTP nog via Tag
  Assistant en GA4 DebugView worden getest.
- DNS voor de drie nieuwe sites is nog niet omgezet. MX/SPF/DKIM/DMARC moeten
  bij de latere web-DNS-swap ongemoeid blijven.
- Deze externe punten hoeven een codemerge naar Vercel Production niet per se
  te blokkeren zolang de definitieve domeinen nog niet zijn omgezet, maar ze
  blokkeren wel een volledige live-goedkeuring. Beoordeel dat onderscheid.

## Voorlopig voorgestelde integratiestrategie

De tweede reviewer stelde voor de bestaande main- en agentworktrees niet als
integratieplek te gebruiken. Maak pas na expliciete goedkeuring vier schone,
tijdelijke releaseworktrees/branches vanaf de actuele `origin/main`:

1. Werkreturn: merge alleen `fase3-werkreturn`.
2. Werkgroup: merge eerst `seo-link-network-2026-09`, daarna
   `fase3-werkgroup`.
3. Werkassist: merge alleen `fase3-werkassist` op de actuele `origin/main`.
4. Werkverzuim: merge alleen `seo-link-network-2026-09`.

Voordelen van dit voorstel:

- de agentbranches blijven als controleerbare bron intact;
- lokale rommel en de geneste Werkgroup-worktree komen niet in staging;
- de achterlopende lokale Werkassist-main wordt omzeild;
- de gecombineerde toestand kan vóór push en productie volledig worden
  gebouwd en getest;
- iedere repo krijgt een afzonderlijke Preview/PR en rollbackpunt.

Voorgestelde checks op de uiteindelijke gecombineerde releasebranches:

- Werkreturn, Werkgroup en Werkassist:

  ```bash
  npm ci
  npm run check
  git diff --check origin/main...HEAD
  ```

- Werkgroup aanvullend:

  ```bash
  npm run check:redirect-inventory
  ```

- Werkverzuim:

  ```bash
  npm ci
  npm run lint
  npm run build
  git diff --check origin/main...HEAD
  ```

Daarna zouden de releasebranches worden gepusht om Vercel Preview-deploys te
maken, gevolgd door browser-/runtimecontrole. Pas daarna via PR naar main.
Oude branches en prunable worktrees blijven bestaan tot de productieversies
zijn goedgekeurd.

## Wat jij nu zelfstandig moet controleren

1. Actualiseer veilig de origin-refs en maak per repo een branch-/worktreematrix.
2. Controleer status, heads, upstreams, merge-bases en divergentie.
3. Lees de volledige commitreeksen van de relevante fase- en SEO-branches.
4. Controleer met `git cherry -v` dat de genoemde oude branches inderdaad
   patch-equivalent zijn en niet opnieuw nodig zijn.
5. Simuleer de voorgestelde gecombineerde merges met `git merge-tree` of een
   andere niet-muterende methode.
6. Controleer niet alleen tekstconflicten, maar ook semantische conflicten:
   routes, redirects, metadata, trackingevents, consent, formulieren,
   mediaregistratie, LogoBar, sitemap/robots, package- en lockfilewijzigingen.
7. Controleer of de voorgestelde testcommando's volledig genoeg zijn en of
   `npm ci` in schone worktrees bijzonderheden oplevert.
8. Beoordeel de Werkassist-kruislinkvraag expliciet.
9. Beoordeel of vier aparte releasebranches/worktrees de beste aanpak zijn,
   of stel een aantoonbaar veiligere/eenvoudigere aanpak voor.
10. Geef een rollback- en opruimvolgorde, maar voer die niet uit.

## Gewenste rapportage

Begin met bevindingen, gerangschikt op ernst. Geef daarna:

1. een geverifieerde branchmatrix met exacte SHA's;
2. afwijkingen ten opzichte van bovenstaande context;
3. echte en potentiële mergeconflicten per repo;
4. ontbrekende fixes die vóór integratie moeten gebeuren;
5. jouw definitieve aanbevolen mergevolgorde;
6. exacte commando's die na goedkeuring uitgevoerd kunnen worden, maar voer
   ze nu niet uit;
7. checks per releasebranch en daarna per Vercel Preview;
8. scheiding tussen:
   - code-mergeblokkerend;
   - preview-/runtimeblokkerend;
   - DNS/livegangblokkerend;
   - niet-blokkerende verbeteringen;
9. een expliciet **GO**, **GO MITS**, of **NO-GO** voor het starten van de
   release-integratie, met korte onderbouwing.

Wees kritisch: neem eerdere agentrapportages en deze overdracht niet op
vertrouwen aan. Meld ook wanneer een waarschuwing alleen lokaal/structureel is
en geen productieregressie vormt.
