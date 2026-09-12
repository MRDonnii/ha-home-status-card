# Handover

## 2026-09-12 — v0.8.17 kabelstyret Tesla-popup

- Bil-kortet åbner en kompakt `ha-tesla-charge-popup-card`, når `binary_sensor.monta_th_bil_lader_cable_plugged_in` er `on`; ellers navigerer det fortsat direkte til `/teknik-overblik/tesla`.
- Popup’en viser pris nu, planlagt start/slut, ladetid og beregnet sluttid ved start nu samt Lad nu, Stop og navigation til hele Tesla-siden.
- Almindelige `hass`-opdateringer genbruger forsidekortets og popup’ens eksisterende DOM. Popup’en lukkes og eventlisteners fjernes ved disconnect.
- Livefil og HTTP-resource matcher repo med SHA-256 `a881b5a52cbb0d1fe99d7092e312f6ff117b56ff217cb9adfa706f46a7bf3ac2`.
- Backup: `/mnt/ha-config/_archive/backups/lovelace/tesla-home-charge-popup-20260912-110259`.

## 2026-09-12 — v0.8.16 Tesla-link

- EV-presetets navigation er rettet fra `/teknik-overblik/ev-overblik` til `/teknik-overblik/tesla`.
- Ingen renderlogik eller DOM-struktur er ændret; EV-planens node-stabilitetstest består.
- Livefil og HTTP-resource matcher repo med SHA-256 `116e635aefc8297bf7d854166f1b7a448cb668e36f931e5dbe9b77aa855540f5`.
- Commit `a891a4c`, tag og GitHub Release `v0.8.16` er pushed/publiceret.
- Backup: `/mnt/ha-config/_archive/backups/lovelace/home-status-tesla-link-20260912-104820`.

- Version 0.8.13 komprimerer statusrækkerne til 72 px på korte PC-viewports
  og giver kalenderen mere bredde (1,25/0,75 i stedet for 1,7/0,55), mens
  temperaturerne fortsat står i tre kolonner. Mobil er uændret.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.8.13`.

- Version 0.8.12 retter PC-layout ved 100 % browserzoom og lavere skærmhøjde.
  Desktop-wrapperen bruger nu en eksakt højde ud fra den aktuelle visuelle
  viewport, kortets faktiske top og `bottom_gap`, så indholdet ikke kan vokse
  bag navbaren. Ved højst 950 CSS-pixels i højden bliver husoverblikket
  kompaktere, og de 12 rum vises i tre kolonner. Mobilreglerne er uændrede.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.8.12`.
- Backup: `/mnt/ha-config/_archive/backups/lovelace/home-desktop-zoom-fit-20260911-182000`.

- Version 0.8.11 fjerner den visuelle yder-container omkring `Husets
  overblik`: ingen baggrund, skygge, radius, kant eller indvendig padding.
  Overskrift og underkort ligger nu frit i kolonnen, mens de enkelte fliser og
  paneler beholder egne overflader og statusaccenter.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.8.11`.
- Backup: `/mnt/ha-config/_archive/backups/lovelace/home-summary-open-layout-20260911-181000`.

- Version 0.8.10 matcher de store højre ikoners dæmpning og bevægelse med
  dashboardets eksisterende statuskort: opacity 0,12, fem sekunders rolig drift
  og opacity 0,22 ved animationens toppunkt. Reduceret bevægelse respekteres.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.8.10`.
- Backup: `/mnt/ha-config/_archive/backups/lovelace/home-summary-icon-animation-20260911-180000`.

- Version 0.8.9 fjerner det lille venstre ikon fra temperaturfliserne, så
  navn, setpunkt og fugtighed starter direkte ved venstre indholdskant. Det
  store afdæmpede ikon nederst til højre bevares. Teksten `Intet setpunkt` er
  fjernet; uden setpunkt vises kun fugtighed, når den findes.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.8.9`.
- Backup: `/mnt/ha-config/_archive/backups/lovelace/home-summary-room-cleanup-20260911-175500`.

- Version 0.8.8 giver temperaturfliserne samme neutrale overflade som de
  øvrige kort. Det lille ikon er gjort mere kompakt, så navn, setpunkt og
  temperatur starter længere mod venstre, og hvert rum har nu et stort,
  afdæmpet rumikon nederst til højre. Statusfarven bruges fortsat kun i
  venstre accent og ikoner. Luftfugtighed vises kompakt ved siden af
  setpunktet for alle rum med en tilgængelig fugtsensor.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.8.8`.
- Backup: `/mnt/ha-config/_archive/backups/lovelace/home-summary-room-style-20260911-175000`.

- Version 0.8.6 fjerner statusfarvens toning fra de tre forbrugsflisers
  baggrund. Fliserne bruger nu samme neutrale temaoverflade og skygge som de
  øvrige kort, mens statusfarven kun bruges i venstre accent og ikoner. Hver
  flise har desuden et stort, afdæmpet fagikon nederst til højre.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.8.6`.
- Backup: `/mnt/ha-config/_archive/backups/lovelace/home-summary-utility-style-20260911-174000`.

- Version 0.8.5 fjerner huskortets faste blå 1 px-ramme. Yderkort,
  forbrugsfliser og rumfliser bruger nu kun en 3 px venstre statusaccent:
  grøn ved normal/gyldig status, orange ved opmærksomhed, rød ved manglende
  data og blå/orange for rum, der reelt er under/over setpunkt.
- Mobilens layout og breakpoints er ikke ændret.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.8.5`.
- Backup: `/mnt/ha-config/_archive/backups/lovelace/home-summary-status-accents-20260911-173000`.

- Version 0.8.4 retter at 14-dages kalenderlisten gjorde hele huskortet meget
  højt. Kalenderpanelet har nu `overflow: hidden`, mens listen bruger
  `flex: 1 1 0`, `height: 0` og intern overflow. Hændelser påvirker dermed ikke
  kortets naturlige minimumshøjde.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.8.4`.
- Backup: `/mnt/ha-config/_archive/backups/lovelace/home-summary-calendar-height-fix-20260911-195000`.

- Version 0.8.3 udvider kalenderen fra 7 dage/6 hændelser til 14 dage/op til
  40 hændelser. Hændelserne scroller inde i kalenderpanelet med en diskret
  accentfarvet scrollbar, så PC-layoutets totalhøjde ikke ændres.
- `event_days` og `max_events` kan ændres i GUI-editoren. Kalendercache-nøglen
  inkluderer begge værdier, så ændringer hentes korrekt.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.8.3`.
- Backup: `/mnt/ha-config/_archive/backups/lovelace/home-summary-scroll-calendar-20260911-194000`.

- Version 0.8.2 lader PC-layoutet måle sin faktiske topplacering og browserens
  `innerHeight`. Det beregner automatisk den ledige højde ned mod navbaren og
  reserverer `bottom_gap` (110 px på forsiden). Beregningen køres igen ved
  enhver resize og findes kun i desktopkortet.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.8.2`.
- Backup: `/mnt/ha-config/_archive/backups/lovelace/home-desktop-navbar-fit-20260911-172500`.

- Version 0.8.1 gør rumfliserne mindst 160 px brede og reserverer hele den
  øverste tekstlinje til rumnavnet. Temperatur og setpunkt ligger sammen på
  nederste linje, så Spisestue, Soveværelse, Badeværelse, Bryggers og Lille WC
  ikke længere afkortes.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.8.1`.
- Backup: `/mnt/ha-config/_archive/backups/lovelace/home-summary-room-names-20260911-171500`.

- Version 0.8.0 tilføjer `custom:ha-home-desktop-layout-card`: et PC-only
  stretch-layout med to fælles kolonner. Sidste kort i hver kolonne udfylder
  automatisk resthøjden, så kolonnerne altid får samme bundlinje uden faste
  pixeljusteringer. Kortet har GUI-felter til kolonner og responsivt gap.
- Husoverblikket viser nu 12 temperaturzoner: Stue, Spisestue, Køkken,
  Kontor, Mads, Viggo, Soveværelse, Badeværelse, Bryggers, Lille WC, Garage og
  Loft. Zoner uden climate-entity viser `Intet setpunkt`.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.8.0`.
- Backup: `/mnt/ha-config/_archive/backups/lovelace/home-balanced-desktop-all-rooms-20260911-172000`.

- Version 0.7.0 erstatter tekniklisten med seks kompakte rumfliser inspireret
  af Temperaturer & termostatmål: aktuel temperatur, setpunkt, rumikon og
  blå/orange afvigelsesaccent. Temperaturdelen har nu mere bredde end den
  komprimerede kalendertidslinje.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.7.0`.
- Backup: `/mnt/ha-config/_archive/backups/lovelace/home-summary-temperature-price-height-20260911-170500`.

- Version 0.6.0 bygger husoverblikket om i samme flise-/statussprog som de
  øvrige forsidekort. Tre ens månedsfliser viser strøm (399,48 kWh), vand
  (4,635 m3) og fjernvarme (301 kWh) med tilhørende månedspris.
- Vand og fjernvarme bruger eksisterende eksakte månedssensorer. Der findes
  ingen eksakt månedlig elprissensor, så elflisen beregner og mærker prisen som
  et estimat ud fra månedens kWh og den aktuelle samlede kWh-pris. En valgfri
  `electric_month_cost_entity` i GUI'en kan senere erstatte estimatet.
- Kalenderen er redesignet til en kompakt tidslinje med farvekodet datofelt,
  hændelsestitel, tidspunkt og kalendernavn.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.6.0`.
- Backup: `/mnt/ha-config/_archive/backups/lovelace/home-summary-monthly-redesign-20260911-184000`.

- Version 0.5.1 tilføjer `custom:ha-home-summary-card`, som kun bruges under
  de bevægelsesstyrede kameraer på PC-forsiden. Kortet viser supplerende data,
  der ikke allerede findes i forsidens højrekolonne: månedens el, dagens vand
  og fjernvarme, vandpris/flow, CO2/luftkvalitet, Protect-drift og kommende
  kalenderhændelser.
- Kortet opretter sin faste DOM én gang, opdaterer eksisterende felter ved
  relevante entity-skift og genopbygger kun hændelseslisten, når selve
  kalenderresultatet ændres. Kalenderen hentes højst hvert femte minut.
- Kalenderen bruger HA's verificerede REST-kalenderendpoint, da denne HA-version
  ikke tilbyder kalenderhentning som WebSocket-kommando.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.5.1`.
- Dashboard-backup før installation:
  `/mnt/ha-config/_archive/backups/lovelace/home-summary-card-20260911-181500`.

- Version 0.4.7: Bilkortet følger igen Monta-ladeplanen via
  `sensor.monta_th_bil_lader_last_charge` og
  `sensor.monta_th_bil_lader_state`. Når bilen ikke lader og en af sensorerne
  indeholder `scheduled`, vises `Planlagt`; reel ladeeffekt har altid prioritet.
- 0.4.7 retter samtidig kortets state-rendering, så den eksisterende kortnode
  genbruges ved almindelige `hass`-opdateringer. Isoleret Chrome-test dækker
  planlagt status, aktiv opladning samt node-stabilitet ved relevante og
  irrelevante stateændringer.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.4.7`.
- Backup før installation:
  `/mnt/ha-config/_archive/backups/lovelace/home-status-ev-schedule-20260911-153400`.

- Version: 0.3.0
- Formål: Én pakke med ét knapkort, der kan indsættes flere gange med en valgt specialfunktion.
- Det eksisterende 4-kolonne-grid bevares; hver gammel knap erstattes af `custom:ha-home-status-card` med sit eget `preset`.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.3.0`.
- 0.3.0 synkroniserer den komplette nyere liveudgave med repositoryet, herunder begrænset state-watching, dynamiske segmenter, alarmstatus og ventilbaseret varmemåler.
- 0.1.8 giver sikkerhedskortet tre absolutte, ikke-overlappende zoner: overskrift ved 7 px, måler ved 32 px og 2×2-grid ved 43 px.
- 0.1.7 flytter sikkerhedskortets overskrift op og reducerer kun målerens lodrette afstand, så 2×2-blokken kan være der uden overlap eller ændret korthøjde.
- 0.1.6 placerer sikkerhedskortets Verisure/Ajax og vindue/dør-indikatorer i et fast 2×2-grid i venstre side.
- 0.1.5 genskaber tre faseforskudte sinuskurver i både husstrøm- og Tesla-kortet. Hver kurves amplitude, frekvens, farve og opacitet følger sin egen fases aktuelle belastning.
- 0.1.4 genskaber varmekortets ikonrække: billigste varmekilde som VP/FJ/Mix-ikon og separat dynamisk brugsvandsikon. Linjen ovenover viser igen dagens varmeforbrug.
- 0.1.3 genskaber de oprindelige preset-specifikke bundikoner og visuelle effekter: energi-/ladebølger, prisbjælker, poolbølger, dynamiske hunde-, låse- og radiatorikoner, AC-luftstrøm og aktive hvidevareikoner.
- 0.1.2 låser knappen til gridcellens bredde og afkorter lange detaljetekster, så alle fire kort får samme størrelse.
- Live dashboard bruger otte forekomster omkring det separate personkort.
- GitHub: `https://github.com/MRDonnii/ha-home-status-card`; første push `6fd5b03`.
