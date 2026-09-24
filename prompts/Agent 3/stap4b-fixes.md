# Werkassist — Stap 4b: Fixes uit de review van stap 4

Vervolg op stap 4. Werk verder in dezelfde worktree/branch
(`fase3-werkassist`, commit `c76b7e6` is het laatste punt). Niet pushen.

Repo: helloprofs/werkassist-website. Lokaal pad:
`Werkassist/werkassist-website` binnen `Werkgroup websites overkoepelend/`.

## Context die je moet kennen voordat je begint

De GTM-container van Werkassist (GTM-WPXGM4SD) bleek grotendeels leeg: twee
tags, maar nul triggers en nul variabelen, en in het eventName-veld stond de
letterlijke tekst `analytics_storage` in plaats van `{{Event}}`. Er ging dus
bij elke paginaweergave een verzonnen event naar GA4 en geen enkele conversie.
Alle `trackEvent`-aanroepen uit deze repo kwamen nergens aan.

Dat is hersteld. Wat er nu live staat (versie 3):

- Een Google-tag en een GA4-eventtag, beide naar `G-S5QRG4MP0B`, beide met
  `consentStatus: needed [analytics_storage]`.
- Een trigger op custom events met deze regex:
  `^(cta_primair_klik|cta_secundair_klik|formulier_start|formulier_verzonden|formulier_fout|telefoon_klik|email_klik)$`
- Vijf dataLayer-variabelen: `pagina`, `doelgroep`, `dienst`, `cta_type`,
  `positie`, gekoppeld als event-parameters.
- In GA4 staan `formulier_verzonden`, `telefoon_klik` en `email_klik` nu als
  key event.

**Die regex is een contract.** Hij bevat exact de zeven namen uit
`lib/analytics/events.ts`. Hernoem er geen enkele: een naam die niet in de
regex staat wordt genegeerd, zonder foutmelding. Dat is de reden dat
`contact_verstuurd` is teruggedraaid naar `formulier_verzonden`. Wil je een
event toevoegen, meld dat dan in je rapportage in plaats van het door te
voeren — de container moet dan mee.

## Opdracht

1. **Formuliertype meesturen.** Het contactformulier
   (`components/sections/contact-form.tsx`) pusht `formulier_verzonden` zonder
   aan te geven om welk formulier het gaat. Bij de zustersites wordt dat
   onderscheid met een `formulier`-parameter gemaakt in plaats van met aparte
   eventnamen, zodat de drie sites in GA4 op dezelfde manier te rapporteren
   zijn. Voeg `formulier: 'contact'` toe aan de `trackEvent`-aanroepen bij
   `formulier_verzonden`, `formulier_start` en `formulier_fout`.

   Overweeg of `formulier` als expliciet optioneel veld in het
   `EventParams`-type thuishoort in plaats van via de
   `[extra: string]`-indexsignatuur.

2. **Controleer de events die je repo pusht tegen de zeven uit de regex.**
   Werkassist heeft er zeven waar Werkreturn en Werkgroup er tien hebben; die
   drie extra (`doelgroep_keuze`, `dienstpagina_klik`, `kennisartikel_klik`)
   horen bij paginatypes die Werkassist mogelijk niet heeft. Ga na of dat
   klopt, of dat er functionaliteit is die wél zo'n event zou moeten sturen.
   Voeg niets toe — rapporteer alleen wat je vindt, dan gaat de container in
   dezelfde beweging mee.

3. **Losse opmerking, geen opdracht:** de custom events in
   `components/ui/cookie-banner.tsx` en `cookie-preferences-button.tsx` heten
   `werkgroup-cookie-consent-updated` en `werkgroup-open-cookie-preferences`,
   een restant uit de gedeelde basis. Ze zijn consistent met elkaar dus het
   werkt, maar het is verwarrend. Hernoemen mag, in een eigen commit, mits je
   zeker weet dat je alle verwijzingen te pakken hebt.

## Checks

```
npm run check:types && npm run lint && npx next build && npm run check:conversie
```

3. **Fix: `pagina_context` vuurt meermaals per paginagroep, inclusief op
   doelgroep-toggle.** De GTM `page_view`-tag draait nu op die events, dus
   elke toggle telt als extra pageview — fout telt de pagina's over. Los op
   door `pagina_context` alleen te pushen bij een echte route-wissel (vergelijk
   `usePathname` of `useRouter`), niet bij state-wijzigingen. Dubbel geen event
   opnieuw om die state-updates af te vangen.

## Rapportage

Per punt wat je hebt gewijzigd, met bestandspaden. Voor punt 3: verklaar hoe
de meervoudige `pagina_context`-fires voorkomen. Meld expliciet of je
eventnamen ongemoeid hebt gelaten, plus je bevinding bij punt 2. Commit-hash.
Niet pushen.
