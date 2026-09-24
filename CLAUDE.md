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

- **Paginateksten** (en blogs, behalve bij Werkassist dat geen blog heeft) staan
  in het CMS (`/beheer` op de site), opgeslagen in Postgres. `data/pages/*.json`
  in de repo wordt alleen bij lokale dev gelezen — wijzigen daar verandert de
  live site **niet**. Zeg dat tegen de gebruiker in plaats van de JSON aan te passen.
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
- Oude werk-branches zonder PR staan op GitHub als `archief/*`
  (zie `docs/overstap-2026-09-24.md`).
