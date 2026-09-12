# HA Home Status Grid Card

Aktuel version: **0.8.18**. Bil-preset åbner en lade-popup, når Monta-kablet er tilsluttet, og ellers det samlede Tesla Vehicle Center på `/teknik-overblik/tesla`. Popupens luk-knap ligger frit over kortet og dækker ikke statusbadgen.

Én JavaScript-pakke med et konfigurerbart knapkort. Indsæt kortet så mange gange som ønsket, og vælg den funktion der passer til hver knap.

```yaml
type: custom:ha-home-status-card
preset: home_energy
```

Indbyggede funktioner: `home_energy`, `ev`, `electricity_price`, `pool`, `pet`, `security`, `heating`, `settings` og generisk `entity`. Alle standardværdier kan overskrives på det enkelte kort.

Pakken indeholder også `custom:ha-home-summary-card`, der supplerer forsiden med tre ens månedsblokke for strøm, vand og fjernvarme. Hver blok viser både forbrug og månedspris; strømprisen markeres som estimeret, når der ikke er konfigureret en eksakt månedlig prissensor. Under forbruget vises seks kompakte rumfliser med aktuel temperatur, termostatens setpunkt og farvet afvigelsesstatus ved siden af en tæt datobaseret kalendertidslinje. Det undgår at gentage forsidens eksisterende effekt-, pris-, person- og sikkerhedskort.

```yaml
type: custom:ha-home-summary-card
title: Husstatus
```

`custom:ha-home-desktop-layout-card` kan samle to PC-kolonner i samme
stretch-layout. Kolonnerne får altid samme totalhøjde, og det sidste kort i den
korteste kolonne udfylder automatisk resten. Mobilkort skal fortsat ligge uden
for layoutkortet med deres egen screen visibility.

Rumfliserne reserverer mindst 160 px pr. flise og bruger en separat fuldbredde
til rumnavnet. Lange navne som Soveværelse og Badeværelse afkortes derfor ikke
af temperaturfeltet. Temperatur, setpunkt og fugtværdi bruger en større,
kontraststærk typografi, men uden at øge flisernes højde.

Layoutkortet måler selv sin placering og browserens aktuelle højde. Med
`bottom_gap` reserveres den ønskede afstand over navbaren (110 px som
standard), og højden genberegnes ved enhver ændring af vinduesstørrelsen.
Naturligt indhold kan stadig gøre layoutet højere.

På korte PC-viewports (højst 950 CSS-pixels) komprimeres statusrækkerne
automatisk. Den frigivne højde tilfalder det sidste grow-kort, typisk grafen;
mobilvisningen og høje PC-viewports er uændrede.

Kalenderdelen viser som standard op til 40 hændelser fra de næste 14 dage i en
selvstændig scrollbar. `event_days` og `max_events` kan ændres i GUI-editoren,
uden at kortets eller PC-layoutets samlede højde vokser.

Listen bruger `flex-basis: 0`, `height: 0` og et skjult ydre panel-overflow, så
antallet af hændelser ikke bidrager til kortets naturlige minimumshøjde.

Bilfunktionen viser `Planlagt`, når Monta melder en aktiv ladeplan via
`schedule_entity` eller `charger_state_entity`. Ved aktiv opladning vises den
aktuelle ladeeffekt i stedet. Entiteterne kan overskrives på kortet til andre
Monta-navne eller tilsvarende sensorer.

Sikkerhedsknappen understøtter `gate_lock_inverted` og `terrace_lock_inverted`.
Sæt værdien til `true`, når kontaktens aktive/åbne tilstand betyder låst. For
den indbyggede portkonfiguration er `gate_lock_inverted` slået til som standard
og kan ændres i den visuelle editor.
