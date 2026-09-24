# Overkoepelende map voor de vier Werk-websites — ontwerp

**Datum:** 2026-09-24
**Status:** ontwerp goedgekeurd in gesprek, spec ter review

## Doel

Eén lichte werkmap van waaruit agents (Claude Code, Codex) snel een wijziging aan
één of meer van de vier sites (Werkgroup, Werkreturn, Werkassist, Werkverzuim)
kunnen doen, zonder dat de volledige codebases permanent op de MacBook staan.

**Succescriteria**
- Een agent die in deze map start weet uit `CLAUDE.md`/`AGENTS.md` welke repo bij
  een vraag hoort en hoe hij die lokaal krijgt.
- Een repo staat alleen lokaal zolang eraan gewerkt wordt; opruimen kan nooit
  ongepusht werk kosten.
- Repo's die 7 dagen niet zijn aangeraakt worden automatisch gesignaleerd (niet
  automatisch verwijderd).
- Na de overstap is de map een paar MB plus wat er op dat moment open staat
  (was 6,7 GB).

## Uitgangssituatie (gemeten 2026-09-24)

- Per site ~1–1,2 GB, waarvan ~90% `node_modules` (~550 MB) en `.next`
  (250–570 MB); `.git` 50–90 MB.
- Ongepushte commits: Werkgroup 6 (branches `feat/analytics-cookies`,
  `seo-link-network-2026-09`, `ticket-4-media-upload-werkgroup`), Werkreturn 1
  (`ticket-4-media-upload-werkreturn`), Werkassist 1 (`batch-3-contact-email`).
  Werkverzuim schoon. Overige lokale branches bevatten geen unieke commits.
- `Werkgroup/Werkgroup-poort` en `Werkassist/werkassist-website-batch3` zijn
  worktrees waarvan de koppeling na de mapverhuizing is gebroken. Poort wijkt
  licht af van `feat/poort-en-beveiliging`; batch3 lijkt geen nieuw werk te
  bevatten t.o.v. `batch-3-contact-email`.
- Geheimen buiten git: `.env.local` (root, AI Gateway-key), Werkreturn
  `.env.local`, `client_secret_*.json` per label, `google-api/{client_secret,token}.json`.

## Werkwijze per soort verzoek

| Verzoek | Route |
|---|---|
| Tekst/content | Claude Code op het web (claude.ai/code) op de site-repo → branch → PR → Vercel-preview → merge. Staat de tekst in het CMS (`/beheer`), dan meldt de index dat. |
| Layout/viewport | Lokaal: `site open` → `site install` → `npm run dev` + in-app browser → push → `site close`. |
| Meerdere sites | Lokale sessie in deze map, betrokken repo's openen met `site open`. |

## Structuur

```
Werkgroup websites overkoepelend/     git: helloprofs/werkgroup-websites (privé)
├── CLAUDE.md          index + werkregels
├── AGENTS.md          verwijst naar CLAUDE.md (voor Codex)
├── sites.json         bron van waarheid per site
├── bin/site           script
├── .claude/settings.json   SessionStart-hook: bin/site status --stale
├── docs/              stappenplan, specs
├── prompts/
├── link-analyse/      zonder node_modules
├── repos/             gitignored — lokale clones: repos/<label>/
└── _lokaal/           gitignored — geheimen
```

`.gitignore`: `repos/`, `_lokaal/`, `.env*`, `client_secret*.json`,
`token.json`, `node_modules/`, `.DS_Store`, `__pycache__/`.

### sites.json

Per site (sleutel = label in kleine letters: `werkgroup`, `werkreturn`,
`werkassist`, `werkverzuim`):

- `naam` — weergavenaam
- `repo` — GitHub-URL
- `domein` — productiedomein
- `vercelProject` — projectnaam in Vercel
- `productieBranch` — branch die naar productie deployt
- `check` — commando voor volledige controle (bijv. `npm run check`)
- `teksten` — korte omschrijving waar teksten staan (codebestanden en/of CMS)

Waarden worden bij de implementatie uit de repo's en Vercel gehaald, niet
geraden.

### CLAUDE.md

Kort. Bevat: tabel van de vier sites (uit sites.json), de werkwijze-tabel
hierboven, de regel "eerst `bin/site open <label>`, daarna binnen die repo de
eigen AGENTS.md/CLAUDE.md volgen", de regel "na afloop pushen en `site close`
voorstellen", en dat geheimen in `_lokaal/` staan en nooit gecommit worden.

## bin/site

Zsh/bash-script, leest `sites.json` met `jq`. Lokale clone: `repos/<label>`.
Gebruik-tijdstempel: `repos/.gebruikt/<label>` (mtime).

| Commando | Gedrag |
|---|---|
| `site list` | Labels, repo's, domeinen. |
| `site open <label> [branch]` | Niet aanwezig → `git clone --filter=blob:none <repo> repos/<label>`. Wel aanwezig → `git fetch --prune`. Met branch: `git switch <branch>` (maakt tracking-branch aan als die alleen remote bestaat). Raakt tijdstempel aan. Print pad. |
| `site install <label>` | `npm ci` in de clone; meldt `vercel env pull .env.local` als `.env.local` ontbreekt. Raakt tijdstempel aan. |
| `site close <label>` | Veiligheidscheck (zie onder). Faalt → exit ≠ 0 en lijst van wat openstaat. Slaagt → `rm -rf repos/<label>` + tijdstempel. |
| `site close <label> --licht` | Verwijdert alleen `node_modules` en `.next`. Geen check nodig. |
| `site status [label]` | Tabel: aanwezig, branch, # gewijzigde bestanden, # ongepushte commits, stashes, laatst gebruikt, grootte. |
| `site status --stale` | Alleen sites aanwezig > 7 dagen niet gebruikt; één regel per site met advies (`site close` of `--licht`). Niets aan de hand → geen uitvoer. |

**Veiligheidscheck** (faalt bij één van):
- `git status --porcelain` niet leeg (gewijzigd of untracked, niet-genegeerd)
- `git stash list` niet leeg
- `git rev-list --branches --not --remotes` niet leeg (na `git fetch`)
- Genegeerd `.env.local` aanwezig dat niet in `_lokaal/<label>.env.local` staat
  of ervan afwijkt → melding om eerst te kopiëren

**Laatst gebruikt** = max(mtime tijdstempelbestand, mtime `.git/logs/HEAD`).

**Fouten:** onbekend label → lijst geldige labels, exit 1. `jq`/`git` ontbreekt →
duidelijke melding. Fetch mislukt (offline) bij `close` → weigeren, want
push-status is dan niet te bevestigen.

## Eenmalige overstap

1. **Archiveren naar GitHub** (geen PR's, geen merges):
   - Branches met unieke commits pushen als `archief/<branch>` naar origin.
   - Poort en batch3: in een tijdelijke worktree van de dichtstbijzijnde branch
     (`feat/poort-en-beveiliging` resp. `batch-3-contact-email`) de bestanden
     van de kopie overnemen (zonder `node_modules`, `.next`, `.git`, genegeerde
     bestanden), committen en pushen als `archief/werkgroup-poort` resp.
     `archief/werkassist-batch3`. Geen verschil → geen branch, noteren.
2. **Geheimen veiligstellen** naar `_lokaal/`: root `.env.local`, Werkreturn
   `.env.local` (als `werkreturn.env.local`), `client_secret_*.json`,
   `google-api/*.json`.
3. **Map opzetten:** `.gitignore`, `sites.json`, `bin/site`, `CLAUDE.md`,
   `AGENTS.md`, hook; stappenplan naar `docs/`; `link-analyse/node_modules`
   weg. `git init`, privé-repo `helloprofs/werkgroup-websites` aanmaken, pushen.
4. **Bronmateriaal:** lijst aan gebruiker voor Google Drive (beeldmateriaal,
   bronmateriaal, wetransfer-map, redirectinventarisatie, docx/pdf/csv,
   startprompts). Gebruiker verplaatst; daarna pas verwijderen.
5. **Opruimen:** per oude clone de veiligheidscheck; alleen bij groen de
   labelmap verwijderen. Worktree-kopieën pas na stap 1.
6. **Verwijzingen:** paden in het stappenplan en in de geheugennotities
   bijwerken naar `repos/<label>`.

## Testen

- `bin/site` handmatig doorlopen op één site: `open` (clone), `open` (fetch),
  `open <branch>`, `status`, `close` met een ongecommit bestand (moet weigeren),
  met een lokale commit (moet weigeren), schoon (moet verwijderen),
  `close --licht`.
- `status --stale` met een tijdstempel van 8 dagen oud (`touch -t`) → melding;
  vers → geen uitvoer.
- Hook: nieuwe Claude-sessie in de map toont de stale-melding.

## Buiten scope

- Monorepo / gedeelde componenten tussen de sites.
- Automatisch verwijderen zonder bevestiging.
- pnpm-migratie.
