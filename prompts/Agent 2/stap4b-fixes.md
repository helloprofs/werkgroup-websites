# Werkgroup — Stap 4b: Fixes uit de review van stap 4

Vervolg op stap 4. Werk verder in dezelfde worktree/branch
(`fase3-werkgroup`, commit `bfda95f` is het laatste punt). Niet pushen.

Repo: helloprofs/werkgroup-website. Lokaal pad:
`Werkgroup/Werkgroup-website` binnen `Werkgroup websites overkoepelend/`.

## Context die je moet kennen voordat je begint

De GTM-container van Werkgroup (GTM-58NH3JRP) is geïnspecteerd en hersteld.
Wat daar nu live staat (versie 4):

- Een GA4-configuratietag en een GA4-eventtag, beide naar `G-QX4JZ179DE`,
  beide met `consentStatus: needed [analytics_storage]`. Die stonden eerder op
  `notNeeded`, waardoor ze ook vuurden als de bezoeker toestemming weigerde —
  de consent-laag in de code deed daardoor niets. Dat is nu rechtgezet.
- Een trigger op custom events met deze regex:
  `^(cta_primair_klik|cta_secundair_klik|formulier_start|formulier_verzonden|formulier_fout|telefoon_klik|email_klik|doelgroep_keuze|dienstpagina_klik|kennisartikel_klik)$`
- Vijf dataLayer-variabelen: `pagina`, `doelgroep`, `dienst`, `cta_type`,
  `positie`, gekoppeld als event-parameters.

**Die regex is een contract.** Hernoem geen enkel bestaand event in
`lib/analytics/events.ts`. Een naam die niet in die regex staat, wordt door de
container genegeerd: geen foutmelding, het event komt gewoon nooit in GA4 aan.
Dat is precies waarom `sollicitatie_verstuurd` is teruggedraaid. Wil je een
event toevoegen, meld dat dan in je rapportage in plaats van het door te
voeren — de container moet dan mee.

## Opdracht

1. **Formuliertype meesturen bij het contactformulier.** Het
   sollicitatieformulier stuurt al `formulier: 'sollicitatie'` mee, het
   contactformulier stuurt niets. In GA4 levert dat `formulier = (not set)`
   op, waardoor de conditie "dit is een contactaanvraag" geformuleerd moet
   worden als "formulier is niet sollicitatie". Dat klopt stilletjes niet meer
   zodra er een derde formulier bijkomt.

   Voeg `formulier: 'contact'` toe aan de `trackEvent`-aanroepen van het
   contactformulier: bij `formulier_verzonden`, en ook bij `formulier_start`
   en `formulier_fout`, zodat er per formuliertype een volledige trechter te
   bouwen is. Doe hetzelfde voor `formulier_start`/`formulier_fout` van het
   sollicitatieformulier als die daar nog ontbreken.

   Overweeg of `formulier` als expliciet optioneel veld in het
   `EventParams`-type thuishoort in plaats van via de
   `[extra: string]`-indexsignatuur.

2. **Controleer of `NEXT_PUBLIC_GA4_ID` overeenkomt.** De cookiebeleidpagina
   leidt de `_ga_<id>`-cookienaam af uit die variabele. De juiste waarde voor
   Werkgroup is `G-QX4JZ179DE`, dus de pagina hoort `_ga_QX4JZ179DE` te tonen.
   Verifieer dat de afleiding die naam oplevert; de check die je in stap 4 aan
   `check:conversie` hebt toegevoegd bewaakt alleen dat de variabele gezet is,
   niet dat hij klopt. Als je het strenger kunt maken zonder de waarde hard te
   coderen, doe dat.

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
eventnamen ongemoeid hebt gelaten. Commit-hash. Niet pushen.
