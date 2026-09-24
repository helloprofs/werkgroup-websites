# Werkreturn — Stap 4b: Fixes uit de review van stap 4

Vervolg op stap 4. Werk verder in dezelfde worktree/branch
(`fase3-werkreturn`, commit `1b029f2` is het laatste punt). Niet pushen.

Repo: helloprofs/website-werkreturn. Lokaal pad:
`Werkreturn/Werkreturn website/website-werkreturn` binnen
`Werkgroup websites overkoepelend/`.

## Context die je moet kennen voordat je begint

De GTM-container van Werkreturn (GTM-K7C5VQ57) is inmiddels geïnspecteerd en
hersteld. Wat daar nu live staat (versie 3):

- Een GA4-configuratietag en een GA4-eventtag, beide naar `G-0WMTMVH1ER`,
  beide met `consentStatus: needed [analytics_storage]`.
- Een trigger die vuurt op custom events die matchen met deze regex:
  `^(cta_primair_klik|cta_secundair_klik|formulier_start|formulier_verzonden|formulier_fout|telefoon_klik|email_klik|doelgroep_keuze|dienstpagina_klik|kennisartikel_klik)$`
- Vijf dataLayer-variabelen: `pagina`, `doelgroep`, `dienst`, `cta_type`,
  `positie`, die als event-parameters aan de eventtag hangen.

**Die regex is een contract.** Hernoem geen enkel bestaand event in
`lib/analytics/events.ts`. Een naam die niet in die regex staat, wordt door de
container genegeerd: geen foutmelding, geen waarschuwing, het event komt
gewoon nooit in GA4 aan. In een eerdere ronde is precies dat bijna misgegaan.
Wil je een event toevoegen of hernoemen, meld dat dan in je rapportage in
plaats van het door te voeren — de container moet dan mee.

## Opdracht

1. **Formuliertype meesturen.** Het contactformulier
   (`components/sections/contact-form.tsx`) pusht `formulier_verzonden` zonder
   aan te geven om welk formulier het gaat. Bij Werkgroup stuurt het
   sollicitatieformulier wel `formulier: 'sollicitatie'` mee. Om die twee in
   GA4 uit elkaar te kunnen houden zonder aparte eventnamen, moet elk
   formulier zijn type meesturen. Voeg `formulier: 'contact'` toe aan de
   `trackEvent('formulier_verzonden', ...)`-aanroep. Doe hetzelfde bij
   `formulier_start` en `formulier_fout`, zodat je in GA4 een volledige
   trechter per formuliertype kunt bouwen.

   Overweeg of `formulier` als expliciet veld in het `EventParams`-type thuis
   hoort in plaats van via de `[extra: string]`-indexsignatuur. Als je dat
   doet: houd het optioneel, want niet elk event hoort bij een formulier.

2. **Bestaande lintfout opruimen.** `npm run lint` faalt op
   `components/ui/fixed-call-button.tsx:16` met
   `react-hooks/set-state-in-effect`: er wordt synchroon `setObstructed(false)`
   aangeroepen in de body van een effect. Die fout staat er al sinds commit
   `d62b6a9` en is niet van stap 4, maar hij blokkeert wel de lintstap van het
   check-harnas. Los hem echt op (de guard hoort waarschijnlijk in de
   afleiding van de state, niet in een effect), niet met een
   eslint-disable-regel.

## Checks

```
npm run check:types && npm run lint && npx next build && npm run check:conversie
```

Alle vier moeten slagen, lint dus inbegrepen.

3. **Fix: `kennisartikel_klik` vuurt nooit.** De regex in
   `components/analytics/click-listener.tsx` matcht `/kennisbank/<slug>`, maar
   [blog-search-list.tsx:133](components/blog/blog-search-list.tsx#L133) linkt
   artikelen naar `/blog/<slug>`. Beide routes bestaan; het overzicht gebruikt
   alleen `/blog/`. Beslis met de PO: linken naar `/kennisbank/` in plaats van
   `/blog/`, of de regex updaten naar beide? Noteer je keuze in de rapportage.
   (De router mag je niet helemaal aanpassen zonder contact.)

4. **Fix: `pagina_context` vuurt 11 keer per paginagroep, inclusief op
   doelgroep-toggle.** Daardoor telt de nieuwe GA4 `page_view` ook elke toggle
   als extra pageview. Los op door `pagina_context` alleen te pushen bij een
   echte route-wissel (vergelijk `usePathname` of `useRouter`), niet bij state-
   wijzigingen. Iet geen event opnieuw om die state-wijzigingen af te vangen.

## Rapportage

Per punt wat je hebt gewijzigd, met bestandspaden. Voor punt 3: meld je keuze
(linkpad of regex) en waarom. Voor punt 4: verklaar hoe de dubbele
`pagina_context`-fires voorkomen. Meld expliciet of je eventnamen ongemoeid
hebt gelaten. Commit-hash. Niet pushen.
