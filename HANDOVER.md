# Handover

- Version: 0.1.6
- Formål: Én pakke med ét knapkort, der kan indsættes flere gange med en valgt specialfunktion.
- Det eksisterende 4-kolonne-grid bevares; hver gammel knap erstattes af `custom:ha-home-status-card` med sit eget `preset`.
- Installeret resource: `/local/ha-home-status-card/ha-home-status-card.js?v=0.1.6`.
- 0.1.6 placerer sikkerhedskortets Verisure/Ajax og vindue/dør-indikatorer i et fast 2×2-grid i venstre side.
- 0.1.5 genskaber tre faseforskudte sinuskurver i både husstrøm- og Tesla-kortet. Hver kurves amplitude, frekvens, farve og opacitet følger sin egen fases aktuelle belastning.
- 0.1.4 genskaber varmekortets ikonrække: billigste varmekilde som VP/FJ/Mix-ikon og separat dynamisk brugsvandsikon. Linjen ovenover viser igen dagens varmeforbrug.
- 0.1.3 genskaber de oprindelige preset-specifikke bundikoner og visuelle effekter: energi-/ladebølger, prisbjælker, poolbølger, dynamiske hunde-, låse- og radiatorikoner, AC-luftstrøm og aktive hvidevareikoner.
- 0.1.2 låser knappen til gridcellens bredde og afkorter lange detaljetekster, så alle fire kort får samme størrelse.
- Live dashboard bruger otte forekomster omkring det separate personkort.
- GitHub: `https://github.com/MRDonnii/ha-home-status-card`; første push `6fd5b03`.
