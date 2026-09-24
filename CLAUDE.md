# Werk-websites — hub

Vanuit deze map werk je aan de vier labelsites. De code staat **niet** permanent
lokaal: haal een site binnen als je hem nodig hebt en ruim hem daarna op.

Deze map is zelf een repo (`helloprofs/werkgroup-websites`) met alleen de
werkwijze eromheen — **geen websitecode**. Commits hier raken de sites niet;
wijzigingen aan een site commit en push je altijd binnen `repos/<site>`.

## Hoe de map in elkaar zit

| Pad | Wat | In git? |
|---|---|---|
| `bin/site` | script: sites ophalen, status, veilig opruimen | ja |
| `sites.json` | repo, domein en checkcommando per site | ja |
| `repos/<site>/` | lokale clone van een site, alleen zolang je eraan werkt | nee (eigen repo) |
| `_lokaal/` | geheimen (`<site>.env.local`, Google-API-scripts en -tokens), bronmateriaal (`_lokaal/bronmateriaal/<site>/`: foto's, voorwaarden, webcopy), bundles met oude stashes | nee |
| `docs/` | stappenplan oplevering, overstaplog (archief-branches) | ja |
| `tests/site.test.sh` | tests voor `bin/site` | ja |

Staat `repos/` leeg? Dat is normaal: er wordt nu aan geen enkele site gewerkt.

## De sites

| Site | Domein | Repo | Lokaal pad |
|---|---|---|---|
| Werkgroup (moedermerk) | werkgroup.nl | helloprofs/werkgroup-website | `repos/werkgroup` |
| Werkreturn | werkreturn.nl | helloprofs/website-werkreturn | `repos/werkreturn` |
| Werkassist | werkassist.nl | helloprofs/werkassist-website | `repos/werkassist` |
| Werkverzuim | verzuimopwerk.nl | helloprofs/website-werkverzuim | `repos/werkverzuim` |

Details per site: `sites.json`. Productie deployt vanaf `main` via Vercel.

## Waar teksten staan

- **Paginateksten** (en blogs, behalve bij Werkassist dat geen blog heeft) staan
  in het CMS (`/beheer` op de site), opgeslagen in Postgres. `data/pages/*.json`
  in de repo wordt alleen bij lokale dev gelezen — wijzigen daar verandert de
  live site **niet**. Zeg dat tegen de gebruiker in plaats van de JSON aan te passen.
- **Vaste teksten** (navigatie, footer, knoppen, formulieren, metadata,
  juridische pagina's) staan in code: `components/`, `app/`, `lib/`.
- Twijfel? Lees de `AGENTS.md` van de betreffende repo.

## Werkwijze

1. Bepaal welke site(s) het betreft.
2. `bin/site open <site>` — clonet, of haalt bij en werkt de huidige branch
   bij (alleen fast-forward, alleen als er geen lokale wijzigingen zijn); print
   het pad. Meldt hij dat hij niet kon bijwerken, los dat eerst op.
3. **Nieuwe wijziging = nieuwe branch vanaf de actuele `main`:**
   `git switch -c <korte-naam> origin/main` (na `bin/site open`, dus na een
   fetch). Nooit verder bouwen op een oude branch uit een vorige klus — zo
   voorkom je conflicten met werk dat intussen live is gegaan.
   Werk binnen die repo en volg **de eigen AGENTS.md/CLAUDE.md van die repo**.
4. Lokaal draaien of bouwen nodig? `bin/site install <site>`, dan `npm run dev`.
5. Committen op die branch, pushen, PR — nooit direct op `main`. Is `main`
   intussen verder? `git fetch && git rebase origin/main` vóór de PR.
6. Klaar? Stel `bin/site close <site>` voor. Die weigert bij alles wat
   verloren zou gaan (ongecommit, ongepusht, stash, detached HEAD, extra
   worktrees, genegeerde bestanden zoals `shots/`, `.env.local` niet in
   `_lokaal/`) en noemt wat er openstaat. Los dat bewust op; forceer nooit met
   `rm -rf`.
   - Branch na een squash-merge nog "ongepusht"? Controleer met
     `gh pr view <branch>` dat hij gemerged is, dan `git branch -D <branch>`.

`bin/site` staat in de hub-root; zit je in `repos/<site>`, gebruik dan
`"$CLAUDE_PROJECT_DIR"/bin/site`.

Alleen een tekstwijziging zonder lokaal te kijken? Dan kan het ook in een
Claude Code-websessie (claude.ai/code) direct op de site-repo.

`bin/site status` geeft het overzicht; bij de start van een sessie meldt de
hook sites die 7+ dagen niet gebruikt zijn — noem die aan de gebruiker.

## Regels

- Geheimen staan in `_lokaal/` (niet in git): `.env.local`-bestanden per site
  (`<site>.env.local`), Google OAuth client secrets. Nooit committen of printen.
- Niet-gepushte commits bewaar je door te pushen, niet door de clone te laten staan.
- Oude werk-branches zonder PR staan op GitHub als `archief/*`
  (zie `docs/overstap-2026-09-24.md`).
