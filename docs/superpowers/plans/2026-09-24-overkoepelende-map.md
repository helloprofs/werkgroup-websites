# Overkoepelende map — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** De overkoepelende map ombouwen tot een lichte hub-repo met index, `site`-script en 7-dagen-check, en de vier lokale site-clones veilig opruimen.

**Architecture:** Eén bash-script (`bin/site`) leest `sites.json` en beheert clones in `repos/<label>`. Een SessionStart-hook draait `bin/site status --stale`. Ongepushte commits en losgeraakte worktree-kopieën gaan eerst als `archief/*`-branches naar GitHub; pas daarna worden oude mappen verwijderd, elk na dezelfde veiligheidscheck als `site close`.

**Tech Stack:** bash 3.2 (macOS-standaard — geen associatieve arrays, geen `mapfile`), `jq`, `git`, BSD `stat`/`date`, `gh`.

**Spec:** `docs/superpowers/specs/2026-09-24-overkoepelende-map-design.md`

**Werkmap:** `ROOT="/Users/nickderidder/Projecten & werk/Werkgroup websites overkoepelend"` — alle paden hieronder relatief daaraan.

## Global Constraints

- Hub-repo: privé, `helloprofs/werkgroup-websites`, branch `main`.
- Clones in `repos/<label>`, labels: `werkgroup`, `werkreturn`, `werkassist`, `werkverzuim`.
- Clone met `git clone --filter=blob:none`.
- Stale-drempel: 7 dagen (`SITE_STALE_DAGEN`, default 7), vergelijking `>=`.
- Nooit iets automatisch verwijderen buiten `site close`; `site close` weigert bij gewijzigde/untracked bestanden, stash, ongepushte commits, mislukte fetch, of `.env.local` die niet gelijk in `_lokaal/<label>.env.local` staat.
- Archief: alleen pushen naar `archief/*`, geen PR's, geen merges, geen force-push.
- Geheimen (`.env*`, `client_secret*.json`, `token.json`) nooit committen; ze gaan naar `_lokaal/`.
- Oude labelmappen pas verwijderen na groene veiligheidscheck; bronmateriaal pas na bevestiging dat de gebruiker het naar Drive heeft verplaatst.
- Commits eindigen met `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- **Clone met `.env.local` maar verder schoon** → `close` moet weigeren tot het bestand in `_lokaal/` staat. (Test in Task 1: `env_local_blokkeert`.)
- **Offline bij `close`** → weigeren, niet stilletjes verwijderen. (Test: `offline_blokkeert`.)
- **Lokale branch zonder upstream met eigen commit, terwijl de huidige branch schoon is** → weigeren. (Test: `ongepushte_commit_andere_branch`.)
- **Label met typfout** → nette melding met geldige labels, exit 1, niets aangemaakt. (Test: `onbekend_label`.)
- **Pad met spaties** (de hub-map heeft er twee) → alle commando's werken. (Test-SITE_HOME bevat een spatie.)

---

### Task 1: `bin/site` met tests

**Files:**
- Create: `bin/site`
- Create: `tests/site.test.sh`

**Interfaces:**
- Produces: CLI `bin/site {list|open|install|close|status}`; env `SITE_HOME` (default: map boven `bin/`), `SITE_STALE_DAGEN` (default 7). Exitcodes: 0 ok, 1 gebruiksfout, 2 `close` geweigerd. Tijdstempels in `repos/.gebruikt/<label>`.

- [ ] **Step 1: Schrijf de test**

`tests/site.test.sh`:

```bash
#!/usr/bin/env bash
# Tests voor bin/site. Tijdelijke SITE_HOME (met spatie in het pad) en een lokale
# bare repo als remote; raakt de echte hub niet aan.
set -uo pipefail

HIER="$(cd "$(dirname "$0")/.." && pwd)"
SITE="$HIER/bin/site"
T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1
export GIT_AUTHOR_NAME=t GIT_AUTHOR_EMAIL=t@t GIT_COMMITTER_NAME=t GIT_COMMITTER_EMAIL=t@t
export SITE_HOME="$T/hub met spatie"
D="$SITE_HOME/repos/test"
mkdir -p "$SITE_HOME"

git init -q --bare -b main "$T/remote.git"
git -C "$T/remote.git" config uploadpack.allowFilter true
git clone -q "file://$T/remote.git" "$T/seed" 2>/dev/null
(
  cd "$T/seed"
  printf '.env.local\nnode_modules/\n.next/\n' > .gitignore
  echo hoi > README.md
  git add . && git commit -qm init && git push -q origin main
  git switch -qc feature && echo f > f.txt && git add . && git commit -qm f && git push -q origin feature
)
printf '{"test":{"naam":"Test","repo":"file://%s/remote.git","domein":"test.nl"}}\n' "$T" > "$SITE_HOME/sites.json"

fails=0
check() { local naam=$1; shift; if "$@" >/dev/null 2>&1; then echo "ok   $naam"; else echo "FAIL $naam"; fails=$((fails+1)); fi; }
weigert() { ! "$SITE" close test && [ -d "$D" ]; }

check onbekend_label          bash -c '! "$0" open bestaatniet && [ ! -d "$1" ]' "$SITE" "$SITE_HOME/repos/bestaatniet"
check list_toont_site         bash -c '"$0" list | grep -q test.nl' "$SITE"
check open_kloont             bash -c '"$0" open test && [ -f "$1/README.md" ]' "$SITE" "$D"
(cd "$T/seed" && git switch -q main && echo 2 >> README.md && git commit -qam twee && git push -q origin main)
check open_fetcht             bash -c '"$0" open test && [ "$(git -C "$1" rev-parse origin/main)" = "$(git -C "$2" rev-parse main)" ]' "$SITE" "$D" "$T/seed"
check open_branch             bash -c '"$0" open test feature && [ "$(git -C "$1" branch --show-current)" = feature ]' "$SITE" "$D"
check status_toont_branch     bash -c '"$0" status | grep test | grep -q feature' "$SITE"

touch "$D/los.txt"
check untracked_blokkeert     weigert
rm "$D/los.txt"

git -C "$D" stash -q -u 2>/dev/null || true
echo x >> "$D/f.txt"; git -C "$D" stash -q
check stash_blokkeert         weigert
git -C "$D" stash drop -q

git -C "$D" switch -qc lokaal && echo l > "$D/l.txt" && git -C "$D" add . && git -C "$D" commit -qm lokaal && git -C "$D" switch -q feature
check ongepushte_commit_andere_branch weigert
git -C "$D" branch -qD lokaal

echo GEHEIM=1 > "$D/.env.local"
check env_local_blokkeert     weigert
mkdir -p "$SITE_HOME/_lokaal" && cp "$D/.env.local" "$SITE_HOME/_lokaal/test.env.local"
check env_local_na_kopie_ok   bash -c '! "$0" close test 2>&1 | grep -q env.local' "$SITE"
# (bovenstaande close kan slagen; herstel clone voor de rest van de tests)
"$SITE" open test feature >/dev/null 2>&1; echo GEHEIM=1 > "$D/.env.local"

git -C "$D" remote set-url origin "file:///bestaat/niet"
check offline_blokkeert       weigert
git -C "$D" remote set-url origin "file://$T/remote.git"

mkdir -p "$D/node_modules/x" "$D/.next"
check close_licht             bash -c '"$0" close test --licht && [ ! -d "$1/node_modules" ] && [ ! -d "$1/.next" ] && [ -f "$1/README.md" ]' "$SITE" "$D"

oud=$(date -v-8d +%Y%m%d%H%M)
touch -t "$oud" "$SITE_HOME/repos/.gebruikt/test" "$D/.git/logs/HEAD"
check stale_meldt             bash -c '"$0" status --stale | grep -q "test.*8 dagen"' "$SITE"
"$SITE" open test >/dev/null 2>&1
check vers_is_stil            bash -c '[ -z "$("$0" status --stale)" ]' "$SITE"

check close_schoon_verwijdert bash -c '"$0" close test && [ ! -d "$1" ]' "$SITE" "$D"

echo; [ "$fails" -eq 0 ] && echo "alle tests groen" || { echo "$fails test(s) rood"; exit 1; }
```

- [ ] **Step 2: Draai de test, verwacht rood**

Run: `bash tests/site.test.sh`
Expected: FAIL-regels (bin/site bestaat nog niet), exit 1.

- [ ] **Step 3: Schrijf `bin/site`**

```bash
#!/usr/bin/env bash
# site — lokale clones van de Werk-websites openen, bekijken en veilig opruimen.
# Zie CLAUDE.md in de hub voor de werkwijze.
set -euo pipefail

SITE_HOME="${SITE_HOME:-$(cd "$(dirname "$0")/.." && pwd)}"
SITES_JSON="$SITE_HOME/sites.json"
REPOS="$SITE_HOME/repos"
STAMPS="$REPOS/.gebruikt"
LOKAAL="$SITE_HOME/_lokaal"
STALE_DAGEN="${SITE_STALE_DAGEN:-7}"

fout() { echo "site: $*" >&2; exit 1; }

command -v jq  >/dev/null || fout "jq ontbreekt (brew install jq)"
command -v git >/dev/null || fout "git ontbreekt"
[ -f "$SITES_JSON" ] || fout "sites.json niet gevonden in $SITE_HOME"

labels() { jq -r 'keys[]' "$SITES_JSON"; }
veld()   { jq -r --arg l "$1" --arg v "$2" '.[$l][$v] // empty' "$SITES_JSON"; }

check_label() {
  [ -n "${1:-}" ] || fout "geef een site op: $(labels | tr '\n' ' ')"
  jq -e --arg l "$1" 'has($l)' "$SITES_JSON" >/dev/null \
    || fout "onbekende site '$1'. Geldig: $(labels | tr '\n' ' ')"
}

dir_van()  { echo "$REPOS/$1"; }
stempel()  { mkdir -p "$STAMPS"; touch "$STAMPS/$1"; }
mtime()    { stat -f %m "$1" 2>/dev/null || echo 0; }
grootte()  { du -sh "$1" 2>/dev/null | cut -f1; }
dagen_geleden() { echo $(( ( $(date +%s) - $1 ) / 86400 )); }

laatst_gebruikt() {
  local d a b; d=$(dir_van "$1")
  a=$(mtime "$STAMPS/$1"); b=$(mtime "$d/.git/logs/HEAD")
  if [ "$a" -gt "$b" ]; then echo "$a"; else echo "$b"; fi
}

cmd_list() {
  jq -r 'to_entries[] | "\(.key)\t\(.value.domein // "-")\t\(.value.repo)"' "$SITES_JSON" \
    | column -t -s $'\t'
}

cmd_open() {
  check_label "${1:-}"
  local l=$1 branch=${2:-} d; d=$(dir_van "$l")
  if [ -d "$d/.git" ]; then
    git -C "$d" fetch --prune --quiet
  else
    mkdir -p "$REPOS"
    git clone --quiet --filter=blob:none "$(veld "$l" repo)" "$d"
  fi
  if [ -n "$branch" ]; then git -C "$d" switch --quiet "$branch"; fi
  stempel "$l"
  echo "$d"
}

cmd_install() {
  check_label "${1:-}"
  local l=$1 d; d=$(dir_van "$l")
  [ -d "$d/.git" ] || fout "$l staat niet lokaal; eerst: bin/site open $l"
  (cd "$d" && npm ci)
  if [ ! -f "$d/.env.local" ]; then
    if [ -f "$LOKAAL/$l.env.local" ]; then
      cp "$LOKAAL/$l.env.local" "$d/.env.local"; echo ".env.local gekopieerd uit _lokaal/"
    else
      echo "Let op: geen .env.local. Haal op met: cd \"$d\" && vercel env pull .env.local"
    fi
  fi
  stempel "$l"
}

# Print wat opruimen in de weg staat; lege uitvoer = veilig.
openstaand() {
  local l=$1 d s; d=$(dir_van "$l")
  git -C "$d" fetch --prune --quiet 2>/dev/null \
    || echo "- fetch mislukt (offline?): push-status niet te bevestigen"
  s=$(git -C "$d" status --porcelain)
  [ -z "$s" ] || printf -- '- niet-gecommitte of untracked bestanden:\n%s\n' "$(echo "$s" | sed 's/^/    /')"
  s=$(git -C "$d" stash list)
  [ -z "$s" ] || printf -- '- stash:\n%s\n' "$(echo "$s" | sed 's/^/    /')"
  s=$(git -C "$d" log --branches --not --remotes --format='    %h %s')
  [ -z "$s" ] || printf -- '- ongepushte commits:\n%s\n' "$s"
  if [ -f "$d/.env.local" ] && ! cmp -s "$d/.env.local" "$LOKAAL/$l.env.local"; then
    echo "- .env.local staat niet (gelijk) in _lokaal/$l.env.local; eerst: cp \"$d/.env.local\" \"$LOKAAL/$l.env.local\""
  fi
}

cmd_close() {
  check_label "${1:-}"
  local l=$1 d p; d=$(dir_van "$l")
  [ -d "$d" ] || { echo "$l staat niet lokaal"; return 0; }
  if [ "${2:-}" = "--licht" ]; then
    rm -rf "$d/node_modules" "$d/.next"
    echo "$l: node_modules en .next verwijderd"; return 0
  fi
  [ -d "$d/.git" ] || fout "$d is geen git-repo; ruim handmatig op"
  p=$(openstaand "$l")
  if [ -n "$p" ]; then
    { echo "$l NIET verwijderd:"; echo "$p"; } >&2
    exit 2
  fi
  rm -rf "$d" "$STAMPS/$l"
  echo "$l verwijderd"
}

status_regel() {
  local l=$1 d; d=$(dir_van "$l")
  if [ ! -d "$d/.git" ]; then printf '%s\t-\t-\t-\t-\t-\t-\n' "$l"; return; fi
  printf '%s\t%s\t%s\t%s\t%s\t%sd\t%s\n' "$l" \
    "$(git -C "$d" branch --show-current)" \
    "$(git -C "$d" status --porcelain | wc -l | tr -d ' ')" \
    "$(git -C "$d" rev-list --count --branches --not --remotes)" \
    "$(git -C "$d" stash list | wc -l | tr -d ' ')" \
    "$(dagen_geleden "$(laatst_gebruikt "$l")")" \
    "$(grootte "$d")"
}

cmd_stale() {
  local l d dg
  for l in $(labels); do
    d=$(dir_van "$l"); [ -d "$d/.git" ] || continue
    dg=$(dagen_geleden "$(laatst_gebruikt "$l")")
    [ "$dg" -ge "$STALE_DAGEN" ] || continue
    echo "site: $l staat lokaal en is $dg dagen niet gebruikt ($(grootte "$d")). Opruimen: bin/site close $l (of: bin/site close $l --licht)"
  done
}

cmd_status() {
  if [ "${1:-}" = "--stale" ]; then cmd_stale; return; fi
  local lijst l
  if [ -n "${1:-}" ]; then check_label "$1"; lijst=$1; else lijst=$(labels); fi
  {
    printf 'site\tbranch\tgewijzigd\tongepusht\tstash\tgebruikt\tgrootte\n'
    for l in $lijst; do status_regel "$l"; done
  } | column -t -s $'\t'
}

case "${1:-help}" in
  list)    cmd_list ;;
  open)    shift; cmd_open "$@" ;;
  install) shift; cmd_install "$@" ;;
  close)   shift; cmd_close "$@" ;;
  status)  shift; cmd_status "$@" ;;
  *) cat <<'EOF'
gebruik: bin/site <commando>
  list                       sites, domeinen en repo's
  open <site> [branch]       clone (of fetch als hij er al staat); print het pad
  install <site>             npm ci, en .env.local uit _lokaal/ als die er is
  close <site>               verwijder de clone — alleen als alles gecommit en gepusht is
  close <site> --licht       verwijder alleen node_modules en .next
  status [<site>]            overzicht per site
  status --stale             sites die 7+ dagen niet gebruikt zijn
EOF
  ;;
esac
```

Daarna: `chmod +x bin/site tests/site.test.sh`

- [ ] **Step 4: Draai de test, verwacht groen**

Run: `bash tests/site.test.sh`
Expected: alle regels `ok`, slotregel `alle tests groen`.

- [ ] **Step 5: Commit**

```bash
git add bin/site tests/site.test.sh
git commit -m "feat: site-script voor openen, status en veilig opruimen van clones"
```

---

### Task 2: Archiveren naar GitHub

**Files:** geen in de hub; pusht branches in de site-repo's. Log in `docs/overstap-2026-09-24.md` (Create).

**Interfaces:**
- Produces: remote branches `archief/*`; logbestand met per push de branch en commit-hash.

- [ ] **Step 1: Branches met unieke commits pushen**

```bash
cd "$ROOT"
arch() { git -C "$1" push origin "refs/heads/$2:refs/heads/archief/$2"; }
arch Werkgroup/Werkgroup-website feat/analytics-cookies
arch Werkgroup/Werkgroup-website seo-link-network-2026-09
arch Werkgroup/Werkgroup-website ticket-4-media-upload-werkgroup
arch "Werkreturn/Werkreturn website/website-werkreturn" ticket-4-media-upload-werkreturn
arch Werkassist/werkassist-website batch-3-contact-email
```

- [ ] **Step 2: Verifiëren dat niets meer alleen lokaal staat**

Run per repo: `git -C <repo> fetch -q && git -C <repo> rev-list --branches --not --remotes | wc -l`
Expected: `0` voor alle vier.

- [ ] **Step 3: Worktree-kopieën archiveren**

Per paar (kopie → basisbranch → archiefnaam):
- `Werkgroup/Werkgroup-poort` → `feat/poort-en-beveiliging` → `archief/werkgroup-poort`
- `Werkassist/werkassist-website-batch3` → `batch-3-contact-email` → `archief/werkassist-batch3`

```bash
kopie_archiveren() { # $1 repo  $2 kopie  $3 basisbranch  $4 archiefbranch
  local wt; wt="$(mktemp -d)/wt"
  git -C "$1" worktree add -q -b "$4" "$wt" "$3"
  rsync -a --delete --exclude .git --exclude node_modules --exclude .next \
    --exclude .env.local --exclude tsconfig.tsbuildinfo --exclude .DS_Store \
    "$2/" "$wt/"
  git -C "$wt" add -A
  if git -C "$wt" diff --cached --quiet; then
    echo "$2: geen verschil met $3 — geen archief nodig"
  else
    git -C "$wt" diff --cached --stat | tail -1
    git -C "$wt" commit -qm "archief: inhoud van losgeraakte worktree-kopie $(basename "$2")"
    git -C "$1" push -q origin "$4"
  fi
  git -C "$1" worktree remove --force "$wt"
}
kopie_archiveren Werkgroup/Werkgroup-website "$ROOT/Werkgroup/Werkgroup-poort" feat/poort-en-beveiliging archief/werkgroup-poort
kopie_archiveren Werkassist/werkassist-website "$ROOT/Werkassist/werkassist-website-batch3" batch-3-contact-email archief/werkassist-batch3
```

Let op: `rsync --delete` met `--exclude` laat genegeerde bestanden in de doel-worktree staan; `git add -A` respecteert `.gitignore`, dus genegeerde bestanden uit de kopie (shots, outputs) gaan niet mee. Controleer `git diff --cached --stat` vóór commit op onverwacht grote verwijderingen en meld die in het log.

- [ ] **Step 4: Log schrijven** — `docs/overstap-2026-09-24.md` met per archief-branch: repo, branch, hash (`git -C <repo> rev-parse origin/archief/<naam>`), en de diff-stat van de kopieën.

---

### Task 3: Geheimen naar `_lokaal/`

- [ ] **Step 1: Kopiëren**

```bash
cd "$ROOT"; mkdir -p _lokaal
cp .env.local _lokaal/hub.env.local
cp "Werkreturn/Werkreturn website/website-werkreturn/.env.local" _lokaal/werkreturn.env.local
for l in Werkgroup Werkreturn Werkassist; do cp "$l"/client_secret_*.json "_lokaal/$(echo "$l" | tr A-Z a-z)-$(basename "$l"/client_secret_*.json)"; done
cp Werkassist/google-api/client_secret.json _lokaal/werkassist-google-api-client_secret.json
cp Werkassist/google-api/token.json _lokaal/werkassist-google-api-token.json
cp Werkgroup/google-api/client_secret.json _lokaal/werkgroup-google-api-client_secret.json
ls Werkgroup/google-api/token.json 2>/dev/null && cp Werkgroup/google-api/token.json _lokaal/werkgroup-google-api-token.json
```

- [ ] **Step 2: Controleren** — `ls -la _lokaal` toont alle bestanden; `git status --short` toont niets uit `_lokaal/`.

---

### Task 4: Hub-inhoud (sites.json, CLAUDE.md, AGENTS.md, hook, docs)

**Files:**
- Create: `sites.json`, `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, `README.md`
- Move: `00-STAPPENPLAN-oplevering.md` → `docs/00-STAPPENPLAN-oplevering.md`
- Modify: `.gitignore` (label-mappen blijven genegeerd tot Task 6)

- [ ] **Step 1: `sites.json`**

```json
{
  "werkgroup": {
    "naam": "Werkgroup",
    "repo": "https://github.com/helloprofs/werkgroup-website.git",
    "domein": "werkgroup.nl",
    "productieBranch": "main",
    "check": "npm run check"
  },
  "werkreturn": {
    "naam": "Werkreturn",
    "repo": "https://github.com/helloprofs/website-werkreturn.git",
    "domein": "werkreturn.nl",
    "productieBranch": "main",
    "check": "npm run check"
  },
  "werkassist": {
    "naam": "Werkassist",
    "repo": "https://github.com/helloprofs/werkassist-website.git",
    "domein": "werkassist.nl",
    "productieBranch": "main",
    "check": "npm run check"
  },
  "werkverzuim": {
    "naam": "Werkverzuim",
    "repo": "https://github.com/helloprofs/website-werkverzuim.git",
    "domein": "verzuimopwerk.nl",
    "productieBranch": "main",
    "check": "npm run check"
  }
}
```

(Vercel-projectnaam weggelaten: de Vercel-koppeling in deze sessie ziet het team niet — niet raden. Vóór schrijven per repo `grep '"check"' package.json` bevestigen; ontbreekt `check`, dan het veld op de feitelijke scripts zetten.)

- [ ] **Step 2: `CLAUDE.md`**

```markdown
# Werk-websites — hub

Vanuit deze map werk je aan de vier labelsites. De code staat **niet** permanent
lokaal: haal een site binnen als je hem nodig hebt en ruim hem daarna op.

## De sites

| Site | Domein | Repo | Lokaal pad |
|---|---|---|---|
| Werkgroup (moedermerk) | werkgroup.nl | helloprofs/werkgroup-website | `repos/werkgroup` |
| Werkreturn | werkreturn.nl | helloprofs/website-werkreturn | `repos/werkreturn` |
| Werkassist | werkassist.nl | helloprofs/werkassist-website | `repos/werkassist` |
| Werkverzuim | verzuimopwerk.nl | helloprofs/website-werkverzuim | `repos/werkverzuim` |

Details per site: `sites.json`. Productie deployt vanaf `main` via Vercel.

## Waar teksten staan

- **Paginateksten en blogs** staan in het CMS (`/beheer` op de site), opgeslagen
  in Postgres. `data/pages/*.json` in de repo wordt alleen bij lokale dev gelezen —
  wijzigen daar verandert de live site **niet**. Zeg dat tegen de gebruiker in
  plaats van de JSON aan te passen.
- **Vaste teksten** (navigatie, footer, knoppen, formulieren, metadata,
  juridische pagina's) staan in code: `components/`, `app/`, `lib/`.
- Twijfel? Lees de `AGENTS.md` van de betreffende repo.

## Werkwijze

1. Bepaal welke site(s) het betreft.
2. `bin/site open <site> [branch]` — clonet of haalt bij; print het pad.
3. Werk binnen die repo en volg **de eigen AGENTS.md/CLAUDE.md van die repo**.
4. Lokaal draaien of bouwen nodig? `bin/site install <site>`, dan `npm run dev`.
5. Committen op een branch, pushen, PR — nooit direct op `main`.
6. Klaar? Stel `bin/site close <site>` voor. Die weigert als er iets niet
   gepusht is; los dat op, forceer nooit met `rm -rf`.

Alleen een tekstwijziging zonder lokaal te kijken? Dan kan het ook in een
Claude Code-websessie (claude.ai/code) direct op de site-repo.

`bin/site status` geeft het overzicht; bij de start van een sessie meldt de
hook sites die 7+ dagen niet gebruikt zijn — noem die aan de gebruiker.

## Regels

- Geheimen staan in `_lokaal/` (niet in git): `.env.local`-bestanden per site
  (`<site>.env.local`), Google OAuth client secrets. Nooit committen of printen.
- Niet-gepushte commits bewaar je door te pushen, niet door de clone te laten staan.
- Oude werk-branches zonder PR staan op GitHub als `archief/*`.
```

- [ ] **Step 3: `AGENTS.md`** — één regel: `Lees en volg CLAUDE.md in deze map; die geldt ook voor Codex.`

- [ ] **Step 4: `.claude/settings.json`**

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          { "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/bin/site status --stale" }
        ]
      }
    ]
  }
}
```

- [ ] **Step 5: `README.md`** — 5 regels: wat de hub is, `bin/site` zonder argumenten voor hulp, tests via `bash tests/site.test.sh`.

- [ ] **Step 6: Stappenplan verplaatsen, link-analyse opschonen**

```bash
git mv -k 00-STAPPENPLAN-oplevering.md docs/ 2>/dev/null || mv 00-STAPPENPLAN-oplevering.md docs/
rm -rf link-analyse/node_modules
```

- [ ] **Step 7: Verifiëren** — `bin/site list` toont vier sites; `bin/site status` toont vier regels met `-`; `SITE_STALE_DAGEN=0 bin/site status --stale` geeft niets (er staat nog niets in `repos/`).

- [ ] **Step 8: Commit**

```bash
git add sites.json CLAUDE.md AGENTS.md README.md .claude/settings.json docs/ prompts/ link-analyse/ .gitignore
git status --short   # controleer: geen .env, client_secret, token.json
git commit -m "feat: hub-index, sites.json en stale-hook"
```

---

### Task 5: Hub-repo op GitHub

- [ ] **Step 1:** `gh repo create helloprofs/werkgroup-websites --private --source . --push`
- [ ] **Step 2:** Verifiëren: `gh repo view helloprofs/werkgroup-websites --json visibility,defaultBranchRef` → `PRIVATE`, `main`.

Faalt het aanmaken (geen rechten in `helloprofs`), stop en vraag de gebruiker.

---

### Task 6: Oude clones opruimen

**Files:** Modify `.gitignore` (label-regels weg zodra de mappen weg zijn), `docs/overstap-2026-09-24.md` (aanvullen).

- [ ] **Step 1: Veiligheidscheck per oude clone** — dezelfde logica als `openstaand` in `bin/site`, op de huidige paden:

```bash
check_oud() { # $1 pad  $2 label
  local d=$1
  git -C "$d" fetch --prune -q || echo "FETCH MISLUKT"
  git -C "$d" status --porcelain
  git -C "$d" stash list
  git -C "$d" log --branches --not --remotes --oneline
  [ -f "$d/.env.local" ] && ! cmp -s "$d/.env.local" "_lokaal/$2.env.local" && echo ".env.local niet veilig"
}
check_oud Werkgroup/Werkgroup-website werkgroup
check_oud "Werkreturn/Werkreturn website/website-werkreturn" werkreturn
check_oud Werkassist/werkassist-website werkassist
check_oud "Werkverzuim website/website-werkverzuim" werkverzuim
```

Expected: geen uitvoer voor alle vier. Anders: stoppen en melden.

- [ ] **Step 2: Bronmateriaal-lijst aan gebruiker** — alles in de labelmappen buiten de clones en buiten wat naar `_lokaal/` ging (`ls` per labelmap). Wachten tot de gebruiker bevestigt dat het in Drive staat (of weg mag).

- [ ] **Step 3: Verwijderen** (pas na Step 1 groen én Step 2 bevestigd)

```bash
rm -rf Werkgroup Werkreturn Werkassist "Werkverzuim website"
```

- [ ] **Step 4: `.gitignore`** — het blok `# Oude labelmappen` weghalen. Commit + push:

```bash
git add .gitignore docs/overstap-2026-09-24.md
git commit -m "chore: oude labelmappen opgeruimd"
git push
```

- [ ] **Step 5: Verifiëren** — `du -sh "$ROOT"` (verwacht: enkele MB); `bin/site status` vier regels `-`.

---

### Task 7: Verwijzingen bijwerken + eindtest

- [ ] **Step 1:** In `docs/00-STAPPENPLAN-oplevering.md` de kolom "Codebase op deze Mac" en losse paden vervangen door `repos/<label>` (via `bin/site open`). Commit + push.
- [ ] **Step 2:** Geheugennotities in `~/.claude/projects/-Users-nickderidder-Projecten---werk-Werkgroup-websites-overkoepelend/memory/` met oude paden bijwerken naar `repos/<label>`; nieuwe notitie over de hub-werkwijze + `archief/*`-branches; pointer in `MEMORY.md`.
- [ ] **Step 3: Eindtest echt:** `bin/site open werkverzuim` → clone verschijnt, `bin/site status` toont hem; `bin/site close werkverzuim` → verwijderd. `bash tests/site.test.sh` groen.
