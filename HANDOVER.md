# Handover

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
