# HA Home Status Grid Card

Én JavaScript-pakke med et konfigurerbart knapkort. Indsæt kortet så mange gange som ønsket, og vælg den funktion der passer til hver knap.

```yaml
type: custom:ha-home-status-card
preset: home_energy
```

Indbyggede funktioner: `home_energy`, `ev`, `electricity_price`, `pool`, `pet`, `security`, `heating`, `settings` og generisk `entity`. Alle standardværdier kan overskrives på det enkelte kort.

Sikkerhedsknappen understøtter `gate_lock_inverted` og `terrace_lock_inverted`.
Sæt værdien til `true`, når kontaktens aktive/åbne tilstand betyder låst. For
den indbyggede portkonfiguration er `gate_lock_inverted` slået til som standard
og kan ændres i den visuelle editor.
