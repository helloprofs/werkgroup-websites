# Werkassist — Stap 4: Tracking (GTM/GA4/GSC — codecheck)

Vervolg op de vorige stappen. Werk verder in dezelfde worktree/branch
(`fase3-werkassist`). Niet pushen.

Repo: helloprofs/werkassist-website. Lokaal pad:
`Werkassist/werkassist-website` binnen `Werkgroup websites overkoepelend/`.

GA4-ID: `G-S5QRG4MP0B`, geladen via env (`NEXT_PUBLIC_GTM_ID`/
`NEXT_PUBLIC_GA4_ID`) in `components/analytics/gtm.tsx`. Consent Mode v2
zit in `components/analytics/consent-default.tsx` +
`components/ui/cookie-banner.tsx`.

Dit is een codecheck, geen live-test — live testen (Tag Assistant/GA4
DebugView) gebeurt door de opdrachtgever zelf.

## Opdracht

- Consent Mode: vuurt pas na toestemming, update correct bij
  accepteren/weigeren
- Events in `lib/analytics/events.ts` — zit `contact_verstuurd` erin
  naast de generieke events (page_view, telefoon-klik, mail-klik)?
- Klopt de env-var setup voor productie?
- Zorg dat er een preview-deploy-URL van deze branch beschikbaar is (of
  meld hoe lokaal getest is) zodat er zelf met Tag Assistant/GA4
  DebugView meegekeken kan worden.

## Checks

```
npm run check:types && npx next build
```

## Rapportage

Bevindingen per punt hierboven, plus de preview-deploy-URL (of instructie
hoe lokaal te testen). Commit-hash indien er wijzigingen zijn. Geen
live-tests nodig van jouw kant.
