# Werkreturn — Stap 4: Tracking (GTM/GA4/GSC — codecheck)

Vervolg op de vorige stappen. Werk verder in dezelfde worktree/branch
(`fase3-werkreturn`). Niet pushen.

Repo: helloprofs/website-werkreturn. Lokaal pad:
`Werkreturn/Werkreturn website/website-werkreturn` binnen
`Werkgroup websites overkoepelend/`.

GA4-ID: `G-0WMTMVH1ER`, geladen via env (`NEXT_PUBLIC_GTM_ID`/
`NEXT_PUBLIC_GA4_ID`) in `components/analytics/gtm.tsx`. Consent Mode v2
zit in `components/analytics/consent-default.tsx` +
`components/ui/cookie-banner.tsx`.

Dit is een codecheck, geen live-test — live testen (Tag Assistant/GA4
DebugView) gebeurt door de opdrachtgever zelf.

**Eerst opruimen voordat je begint**: uit onafhankelijke review van stap 3
komen twee concrete punten in de reCAPTCHA-afhandeling van het
contactformulier (los van tracking, maar klein genoeg om hier mee te
pakken):

1. `.env.example` documenteert de publieke sleutel als
   `RECAPTCHA_SITE_KEY`, maar de code
   (`components/sections/contact-form.tsx`) leest hem als
   `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`. Zonder de `NEXT_PUBLIC_`-prefix is een
   env-var in Next.js niet beschikbaar in de client-bundle — wie het
   voorbeeldbestand volgt, zet dus de verkeerde variabelenaam en reCAPTCHA
   laadt clientside stilzwijgend nooit. Herstel de naam in `.env.example`
   naar `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`.
2. In `app/api/contact/route.ts` wordt reCAPTCHA-verificatie alleen
   uitgevoerd `if (RECAPTCHA_SECRET_KEY)` — ontbreekt die variabele, dan
   wordt de inzending gewoon doorgelaten zonder verificatie (fail-open).
   Werkgroup had exact hetzelfde patroon en heeft dat bewust omgedraaid
   naar fail-closed in productie (zie `lib/forms/recaptcha.ts` in de
   Werkgroup-worktree: zonder sleutel wordt in productie geweigerd, lokaal
   blijft het wel werken zodat je kan blijven ontwikkelen). Pas hetzelfde
   patroon hier toe: zonder `RECAPTCHA_SECRET_KEY` in productie de
   inzending weigeren (503 of vergelijkbaar), niet stilzwijgend
   doorlaten. Dit voorkomt dat één vergeten env-var de spambescherming
   uitschakelt zonder dat iemand het merkt.

Rapporteer kort wat je hebt aangepast, vóór de rapportage over tracking
hieronder.

## Opdracht

- Consent Mode: vuurt GTM pas na toestemming, en updatet correct bij
  accepteren/weigeren?
- Welke events worden gepusht (`lib/analytics/events.ts`,
  `lib/analytics/data-layer.ts`) — komt dit overeen met wat verwacht
  wordt: page_view, form_start, form_submit/generate_lead,
  telefoon-klik, mail-klik, contact_verstuurd?
- Zit er een duidelijke stream-URL/property-koppeling, of ontbreekt die
  nog (verwacht, want het definitieve domein is er nog niet)?
- Zorg dat er een preview-deploy-URL van deze branch beschikbaar is (of
  meld hoe je lokaal getest hebt) zodat er zelf met Tag Assistant/GA4
  DebugView meegekeken kan worden.

## Checks

```
npm run check:types && npx next build
```

## Rapportage

Bevindingen per punt hierboven, plus de preview-deploy-URL (of instructie
hoe lokaal te testen). Commit-hash indien er wijzigingen zijn. Geen
live-tests nodig van jouw kant.
