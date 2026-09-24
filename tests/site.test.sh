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
  printf '.env.local\nnode_modules/\n.next/\nshots/\n*.tsbuildinfo\n.DS_Store\n' > .gitignore
  echo hoi > README.md
  git add . && git commit -qm init && git push -q origin main
  git switch -qc feature && echo f > f.txt && git add . && git commit -qm f && git push -q origin feature
)
printf '{"test":{"naam":"Test","repo":"file://%s/remote.git","domein":"test.nl"}}\n' "$T" > "$SITE_HOME/sites.json"

fails=0
check() { local naam=$1; shift; if "$@" >/dev/null 2>&1; then echo "ok   $naam"; else echo "FAIL $naam"; fails=$((fails+1)); fi; }
# close moet weigeren met exit 2, de clone laten staan en de reden ($1) noemen.
weigert() { local out rc; out=$("$SITE" close test 2>&1); rc=$?; [ "$rc" -eq 2 ] && [ -d "$D" ] && echo "$out" | grep -q -- "$1"; }

check onbekend_label          bash -c '! "$0" open bestaatniet && [ ! -d "$1" ]' "$SITE" "$SITE_HOME/repos/bestaatniet"
check list_toont_site         bash -c '"$0" list | grep -q test.nl' "$SITE"
check open_kloont             bash -c '"$0" open test && [ -f "$1/README.md" ]' "$SITE" "$D"
(cd "$T/seed" && git switch -q main && echo 2 >> README.md && git commit -qam twee && git push -q origin main)
check open_fetcht             bash -c '"$0" open test && [ "$(git -C "$1" rev-parse origin/main)" = "$(git -C "$2" rev-parse main)" ]' "$SITE" "$D" "$T/seed"
check open_branch             bash -c '"$0" open test feature && [ "$(git -C "$1" branch --show-current)" = feature ]' "$SITE" "$D"
(cd "$T/seed" && git switch -q feature && echo nieuw >> f.txt && git commit -qam nieuw && git push -q origin feature)
check open_werkt_branch_bij   bash -c '"$0" open test && [ "$(git -C "$1" rev-parse HEAD)" = "$(git -C "$2" rev-parse feature)" ]' "$SITE" "$D" "$T/seed"
(cd "$T/seed" && echo nog >> f.txt && git commit -qam nog && git push -q origin feature)
echo lokaal >> "$D/README.md"
check open_laat_wijzigingen_staan bash -c '"$0" open test && grep -q lokaal "$1/README.md" && [ "$(git -C "$1" rev-parse HEAD)" != "$(git -C "$2" rev-parse feature)" ]' "$SITE" "$D" "$T/seed"
git -C "$D" checkout -q -- README.md && git -C "$D" merge -q --ff-only origin/feature
check status_toont_branch     bash -c '"$0" status | grep test | grep -q feature' "$SITE"

touch "$D/los.txt"
check untracked_blokkeert     weigert untracked
rm "$D/los.txt"

echo x >> "$D/f.txt"; git -C "$D" stash -q
check stash_blokkeert         weigert stash
git -C "$D" stash drop -q

git -C "$D" switch -qc lokaal && echo l > "$D/l.txt" && git -C "$D" add . && git -C "$D" commit -qm lokaal && git -C "$D" switch -q feature
check ongepushte_commit_andere_branch weigert ongepushte
git -C "$D" branch -qD lokaal

echo GEHEIM=1 > "$D/.env.local"
check env_local_blokkeert     weigert .env.local
mkdir -p "$SITE_HOME/_lokaal" && cp "$D/.env.local" "$SITE_HOME/_lokaal/test.env.local"
check env_local_na_kopie_ok   bash -c '! "$0" close test 2>&1 | grep -q env.local' "$SITE"
# (bovenstaande close kan slagen; herstel clone voor de rest van de tests)
"$SITE" open test feature >/dev/null 2>&1; echo GEHEIM=1 > "$D/.env.local"

git -C "$D" remote set-url origin "file:///bestaat/niet"
check offline_blokkeert       weigert "fetch mislukt"
git -C "$D" remote set-url origin "file://$T/remote.git"

git -C "$D" switch -q --detach && echo d > "$D/d.txt" && git -C "$D" add d.txt && git -C "$D" commit -qm d
check detached_commit_blokkeert weigert detached
git -C "$D" switch -q feature

git -C "$D" worktree add -q -b wt "$T/wt buiten"
check worktree_blokkeert      weigert worktree
git -C "$D" worktree remove --force "$T/wt buiten"; git -C "$D" branch -qD wt

mkdir -p "$D/shots" && touch "$D/shots/a.png"
check genegeerd_bestand_blokkeert weigert shots/
rm -rf "$D/shots"

touch "$D/.git/MERGE_HEAD"
check merge_bezig_blokkeert   weigert bezig
rm "$D/.git/MERGE_HEAD"

git -C "$D" branch -q --set-upstream-to=main
git -C "$D" remote set-url origin "file:///bestaat/niet"
check offline_lokale_upstream_blokkeert weigert "fetch mislukt"
git -C "$D" remote set-url origin "file://$T/remote.git"
git -C "$D" branch -q --set-upstream-to=origin/feature

check licht_typo_weigert      bash -c '! "$0" close test --lich && [ -d "$1" ]' "$SITE" "$D"

mkdir -p "$D/node_modules/x" "$D/.next"
check close_licht             bash -c '"$0" close test --licht && [ ! -d "$1/node_modules" ] && [ ! -d "$1/.next" ] && [ -f "$1/README.md" ]' "$SITE" "$D"

oud=$(date -v-8d +%Y%m%d%H%M)
touch -t "$oud" "$SITE_HOME/repos/.gebruikt/test" "$D/.git/logs/HEAD"
check stale_meldt             bash -c '"$0" status --stale | grep -q "test.*8 dagen"' "$SITE"
"$SITE" open test >/dev/null 2>&1
check vers_is_stil            bash -c '[ -z "$("$0" status --stale)" ]' "$SITE"

mkdir -p "$D/node_modules/x" "$D/.next" "$D/public" && touch "$D/x.tsbuildinfo" "$D/public/.DS_Store"
check close_schoon_verwijdert bash -c '"$0" close test && [ ! -d "$1" ]' "$SITE" "$D"

echo; [ "$fails" -eq 0 ] && echo "alle tests groen" || { echo "$fails test(s) rood"; exit 1; }
