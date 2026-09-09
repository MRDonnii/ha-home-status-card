const VERSION = "0.1.6";

const PRESETS = {
  home_energy: {
    name: "Hus",
    icon: "mdi:home-lightning-bolt-outline",
    color: "var(--state-info-icon, #38bdf8)",
    entity: "sensor.teknikrum_hovedmaler_power",
    vehicle_power_entity: "sensor.th_charger_effekt_normaliseret_kw",
    phase_entities: [
      "sensor.teknikrum_fase_a_power",
      "sensor.teknikrum_fase_b_power",
      "sensor.teknikrum_fase_c_power",
    ],
    phase_max: 3000,
    daily_entity: "sensor.dagligt_husforbrug_uden_bil",
    navigation_path: "/energi-overblik/energy",
    value_unit: "kW",
  },
  ev: {
    name: "Bil",
    icon: "mdi:car-electric-outline",
    color: "var(--state-on-icon, #20e3a2)",
    entity: "sensor.energitte_battery",
    power_entity: "sensor.th_charger_effekt_normaliseret_kw",
    phase_entities: [
      "sensor.th_charger_current_phase_1",
      "sensor.th_charger_current_phase_2",
      "sensor.th_charger_current_phase_3",
    ],
    phase_max_entity: "sensor.th_charger_allocated_charge_current",
    phase_max: 16,
    daily_entity: "sensor.tesla_daglig_ladning",
    navigation_path: "/teknik-overblik/ev-overblik",
    value_unit: "%",
  },
  electricity_price: {
    name: "Strømpris",
    icon: "mdi:cash-multiple",
    color: "var(--state-on-icon, #20e3a2)",
    entity: "sensor.stromligning_current_price_vat",
    navigation_path: "/energi-overblik/pris-eksempler",
    value_unit: "kr",
  },
  pool: {
    name: "Pool",
    icon: "mdi:pool",
    color: "var(--state-info-icon, #38bdf8)",
    entity: "sensor.pool_vandtemperatur",
    status_entity: "sensor.poolpumpe_driftstatus",
    active_entity: "binary_sensor.poolpumpe_korer",
    daily_entity: "sensor.poolpumpe_koeretid_i_dag",
    navigation_path: "/hjem-overblik/pool",
    value_unit: "°C",
  },
  pet: {
    name: "Foder",
    icon: "mdi:dog",
    color: "var(--state-on-icon, #20e3a2)",
    entity: "select.hundefoder_mode",
    error_entity: "binary_sensor.hundefoder_error",
    status_entities: [
      "input_select.hundefoder_morgen_status",
      "input_select.hundefoder_middag_status",
      "input_select.hundefoder_aften_status",
    ],
    navigation_path: "/hjem-overblik/fie",
  },
  security: {
    name: "Sikkerhed",
    icon: "mdi:shield-home",
    color: "var(--state-on-icon, #20e3a2)",
    entity: "lock.hoveddoren",
    lock_entities: ["lock.bryggersdor", "lock.hoveddoren", "lock.garagedoren"],
    terrace_lock_entity: "binary_sensor.terrassedor_las_contact",
    gate_lock_entity: "binary_sensor.port_las_contact",
    open_count_entity: "sensor.open_windows",
    alarm_entity: "alarm_control_panel.verisure_alarm",
    secondary_alarm_entity: "alarm_control_panel.dinsikring_dk",
    door_entities: [
      "binary_sensor.stue_terrassedor",
      "binary_sensor.hoveddoren_contact",
      "binary_sensor.bryggersdor_contact",
      "binary_sensor.mads_terrassedor",
      "binary_sensor.skur_contact",
      "binary_sensor.garageport_contact",
      "binary_sensor.garagedor_contact",
    ],
    navigation_path: "/hjem-overblik/sikkerhed",
  },
  heating: {
    name: "Varme",
    icon: "mdi:radiator",
    color: "var(--state-info-icon, #38bdf8)",
    entity: "sensor.wavin_calefa_2_brugsvand_status",
    heating_entity: "sensor.wavin_calefa_2_heating_state_ch",
    pressure_entity: "sensor.wavin_calefa_2_anlaegstryk",
    source_entity: "sensor.billigste_opvarmning_status",
    daily_entity: "sensor.kamstrup_multical_energi_dag",
    fallback_daily_entity: "sensor.fjernvarme_dagligt_forbrug",
    water_regulator_entity: "sensor.wavin_calefa_2_dhw_regulator_state",
    blocked_by_entity: "sensor.wavin_calefa_2_bvv_blokeret_af",
    navigation_path: "/energi-overblik/varme-center",
  },
  settings: {
    name: "Indstillinger",
    icon: "mdi:cog",
    color: "var(--state-info-icon, #38bdf8)",
    entity: "input_boolean.kiosk_mode",
    off_count_entity: "sensor.off_automations_count",
    appliance_entities: [
      "binary_sensor.vaskemaskine_korer",
      "binary_sensor.torretumbler_korer",
      "binary_sensor.opvaskemaskine_korer",
    ],
    navigation_path: "/hjem-overblik/indstillinger",
  },
};

class HaHomeStatusCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  setConfig(config) {
    if (!config.preset && !config.entity)
      throw new Error("Vælg preset eller entity");
    this.config = { ...config };
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  state(id) {
    return id ? this._hass?.states?.[id] : undefined;
  }
  text(id, fallback = "—") {
    const s = this.state(id)?.state;
    return !s || ["unknown", "unavailable"].includes(s) ? fallback : s;
  }
  number(id) {
    return Number(String(this.state(id)?.state ?? "").replace(",", "."));
  }
  on(id) {
    return this.state(id)?.state === "on";
  }
  fmt(value, digits = 1) {
    return Number.isFinite(value)
      ? value.toLocaleString("da-DK", { maximumFractionDigits: digits })
      : "—";
  }

  view(item) {
    const type = item.type || "entity";
    const cfg = { ...(PRESETS[type] || {}), ...item };
    let value = this.text(cfg.entity);
    let label =
      cfg.name || this.state(cfg.entity)?.attributes?.friendly_name || "Status";
    let meter = 0;
    let color = cfg.color || "var(--state-info-icon, #38bdf8)";
    let detail = "";

    if (type === "home_energy") {
      const watts = this.number(cfg.entity);
      const vehicleKw = this.number(cfg.vehicle_power_entity);
      const houseWatts = Math.max(
        0,
        watts - (Number.isFinite(vehicleKw) ? vehicleKw * 1000 : 0),
      );
      value =
        houseWatts < 1000
          ? `${this.fmt(houseWatts, 0)} W`
          : `${this.fmt(houseWatts / 1000, 2)} kW`;
      detail = `${this.fmt(this.number(cfg.daily_entity), 1)} kWh`;
      meter =
        houseWatts < 500
          ? 1
          : houseWatts < 1200
            ? 2
            : houseWatts < 2500
              ? 3
              : houseWatts < 5000
                ? 4
                : 5;
    } else if (type === "ev") {
      const battery = this.number(cfg.entity);
      value = `${this.fmt(battery, 0)}%`;
      const power = this.number(cfg.power_entity);
      detail =
        power > 0
          ? `${this.fmt(power, 1)} kW lader`
          : `${this.fmt(this.number(cfg.daily_entity), 1)} kWh`;
      meter = Math.ceil((battery || 0) / 20);
      if (battery < 20) color = "var(--error-color, #f43f5e)";
      else if (battery < 45) color = "var(--warning-color, #f59e0b)";
    } else if (type === "electricity_price") {
      const price = this.number(cfg.entity);
      value = `${this.fmt(price, 2)} kr`;
      detail = price < 1 ? "Lav pris" : price < 2 ? "Normal pris" : "Høj pris";
      meter =
        price < 1 ? 1 : price < 1.5 ? 2 : price < 2 ? 3 : price < 2.5 ? 4 : 5;
      color =
        price < 1
          ? "var(--state-on-icon, #20e3a2)"
          : price < 2
            ? "var(--warning-color, #f59e0b)"
            : "var(--error-color, #f43f5e)";
    } else if (type === "pool") {
      value = `${this.fmt(this.number(cfg.entity), 1)}°C`;
      const active = this.on(cfg.active_entity);
      detail = active
        ? "Pumpen kører"
        : this.text(cfg.status_entity, "Pumpen står");
      meter = active ? 4 : 1;
      color = active
        ? "var(--state-info-icon, #38bdf8)"
        : "var(--dashboard-icon-muted, #64748b)";
      cfg.icon = this.on("binary_sensor.pool_person_i_vandet")
        ? "mdi:account-swim"
        : "mdi:pool";
    } else if (type === "pet") {
      const statuses = (cfg.status_entities || []).map((id) =>
        this.text(id, "").toLowerCase(),
      );
      const done = statuses.filter((s) => /givet|færdig|done/.test(s)).length;
      const error = this.on(cfg.error_entity);
      const mode = this.text(cfg.entity, "Auto");
      value = error ? "Fejl" : mode === "schedule" ? "Auto" : mode;
      detail = `${done}/${statuses.length} måltider`;
      meter = done;
      color = error
        ? "var(--error-color, #f43f5e)"
        : "var(--state-on-icon, #20e3a2)";
      cfg.icon = error
        ? "mdi:dog-side-off"
        : mode === "manual"
          ? "mdi:dog-side"
          : "mdi:dog";
    } else if (type === "security") {
      const statuses = (cfg.lock_entities || []).map(
        (id) => this.state(id)?.state === "locked",
      );
      statuses.push(
        ["off", "closed", "false", "0"].includes(
          this.text(cfg.terrace_lock_entity, "").toLowerCase(),
        ),
      );
      statuses.push(
        ["on", "open", "true", "1"].includes(
          this.text(cfg.gate_lock_entity, "").toLowerCase(),
        ),
      );
      const locked = statuses.filter(Boolean).length;
      const open = this.number(cfg.open_count_entity);
      value = locked === statuses.length ? "Låst" : "Åben";
      detail = "";
      meter = locked;
      color =
        value === "Låst"
          ? "var(--state-on-icon, #20e3a2)"
          : "var(--warning-color, #f59e0b)";
      cfg.icon = value === "Låst" ? "mdi:home-lock" : "mdi:home-lock-open";
      const alarmIcon = (id) => {
        const state = this.text(id, "unknown");
        if (state === "armed_away")
          return ["mdi:shield-lock-outline", "var(--state-on-icon)"];
        if (["armed_home", "armed_night"].includes(state))
          return ["mdi:shield-home-outline", "var(--state-warn-icon)"];
        if (state === "triggered")
          return ["mdi:shield-alert-outline", "var(--state-off-icon)"];
        if (state === "disarmed")
          return ["mdi:shield-off-outline", "var(--state-alert-icon)"];
        return ["mdi:shield-question-outline", "var(--dashboard-icon-muted)"];
      };
      const [vIcon, vColor] = alarmIcon(cfg.alarm_entity);
      const [aIcon, aColor] = alarmIcon(cfg.secondary_alarm_entity);
      const doors = (cfg.door_entities || []).filter((id) =>
        this.on(id),
      ).length;
      const windows = Number.isFinite(open) ? open : 0;
      label = `<span class="security-row"><span><img src="/local/billeder/security-status/verisure-brand-icon.png"><ha-icon icon="${vIcon}" style="color:${vColor}"></ha-icon></span><span><img src="/local/billeder/security-status/ajax-brand-icon.png"><ha-icon icon="${aIcon}" style="color:${aColor}"></ha-icon></span><span><ha-icon icon="${windows ? "mdi:window-open-variant" : "mdi:window-closed-variant"}"></ha-icon><b>${windows}</b></span><span><ha-icon icon="${doors ? "mdi:door-open" : "mdi:door-closed"}"></ha-icon><b>${doors}</b></span></span>`;
    } else if (type === "heating") {
      const heating = /opvarm|til|heat/.test(
        this.text(cfg.heating_entity, "").toLowerCase(),
      );
      value = heating ? "Varmer" : this.text(cfg.entity, "Klar");
      const pressure = this.number(cfg.pressure_entity);
      const heatDayPrimary = this.number(cfg.daily_entity);
      const heatDayFallback = this.number(cfg.fallback_daily_entity);
      const heatDay = Number.isFinite(heatDayPrimary)
        ? heatDayPrimary
        : heatDayFallback;
      detail = Number.isFinite(heatDay)
        ? heatDay >= 100
          ? `${this.fmt(heatDay / 1000, 1)} MWh`
          : `${this.fmt(heatDay, 0)} kWh`
        : Number.isFinite(pressure)
          ? `${this.fmt(pressure, 1)} bar`
          : "Afventer";
      const cheapest = this.text(cfg.source_entity, "").toLowerCase();
      let sourceIcon = "mdi:help-circle-outline";
      let sourceText = "?";
      let sourceColor = "var(--secondary-text-color)";
      if (cheapest.includes("mix") || cheapest.includes("begge")) {
        sourceIcon = "mdi:shuffle-variant";
        sourceText = "Mix";
        sourceColor = "var(--state-on-icon)";
      } else if (
        cheapest.includes("varmepumpe") ||
        cheapest.includes("ac") ||
        cheapest === "vp"
      ) {
        sourceIcon = "mdi:air-conditioner";
        sourceText = "VP";
        sourceColor = "var(--state-info-icon)";
      } else if (cheapest.includes("fjernvarme") || cheapest === "fj") {
        sourceIcon = "mdi:pipe-valve";
        sourceText = "FJ";
        sourceColor = "var(--warning-color)";
      }
      const waterState = this.text(cfg.entity, "").toLowerCase();
      const regulator = this.text(cfg.water_regulator_entity, "").toLowerCase();
      const blockedBy = this.text(cfg.blocked_by_entity, "").toLowerCase();
      const bypass =
        waterState.includes("bypass") || regulator.includes("bypass");
      const water =
        waterState.includes("opvarm") ||
        waterState.includes("varmt") ||
        regulator.includes("varm");
      const blocked =
        waterState.includes("blokeret") ||
        (blockedBy &&
          !["ingen", "0", "unknown", "unavailable"].includes(blockedBy));
      const waterIcon = blocked
        ? "mdi:water-off"
        : bypass
          ? "mdi:water-sync"
          : water
            ? "mdi:water"
            : "mdi:water-outline";
      const waterColor = blocked
        ? "var(--warning-color)"
        : bypass || water
          ? "var(--state-info-icon)"
          : "var(--dashboard-icon-muted)";
      label = `<span class="source-row"><ha-icon icon="${sourceIcon}" style="color:${sourceColor}"></ha-icon><b>${sourceText}</b><ha-icon icon="${waterIcon}" style="color:${waterColor}"></ha-icon></span>`;
      meter = heating ? 4 : 1;
      color = heating
        ? "var(--error-color, #f43f5e)"
        : "var(--state-info-icon, #38bdf8)";
      cfg.icon = heating ? "mdi:radiator" : "mdi:radiator-off";
    } else if (type === "settings") {
      const editing = this.on(cfg.entity);
      const off = this.number(cfg.off_count_entity);
      const active = (cfg.appliance_entities || []).filter((id) =>
        this.on(id),
      ).length;
      value = editing ? "Edit" : "Klar";
      detail = active
        ? `${active} maskiner kører`
        : Number.isFinite(off) && off > 0
          ? `${off} autom. slukket`
          : "Indstillinger";
      meter = Math.min(5, Number.isFinite(off) ? off : 0);
      color = editing
        ? "var(--state-off-icon, #f59e0b)"
        : "var(--state-info-icon, #38bdf8)";
    } else {
      const numeric = this.number(cfg.entity);
      value = `${Number.isFinite(numeric) ? this.fmt(numeric, cfg.decimals ?? 1) : this.text(cfg.entity)}${cfg.unit ? ` ${cfg.unit}` : ""}`;
      detail = cfg.secondary_entity
        ? this.text(cfg.secondary_entity)
        : cfg.label || "";
      meter = cfg.meter ?? 0;
    }
    return {
      ...cfg,
      type,
      value,
      label,
      detail,
      meter: Math.min(5, Math.max(0, meter)),
      color,
    };
  }

  decoration(item) {
    if (item.type === "home_energy" || item.type === "ev") {
      const maxFromEntity = this.number(item.phase_max_entity);
      const maximum =
        Number.isFinite(maxFromEntity) && maxFromEntity > 0
          ? maxFromEntity
          : item.phase_max;
      const values = (item.phase_entities || []).map((id) =>
        Math.max(0, this.number(id) || 0),
      );
      const colors = values.map((value) => {
        const load = Math.min(1, value / maximum);
        if (load < 0.08) return "var(--state-cool-icon)";
        if (load < 0.22) return "var(--state-info-icon)";
        if (load < 0.48) return "var(--state-success-icon)";
        if (load < 0.72) return "var(--state-warning-icon)";
        if (load < 0.88) return "var(--state-heat-icon)";
        return "var(--state-error-icon)";
      });
      const paths = values.map((value, phase) => {
        const load = Math.min(1, value / maximum);
        const amplitude =
          item.type === "ev" ? 1 + Math.pow(load, 1.8) * 23 : 3 + load * 26;
        const cycles = 1.1 + load * 1.9;
        const offset = (phase * Math.PI * 2) / 3;
        const points = [];
        for (let step = 0; step <= 120; step += 1) {
          const progress = step / 120;
          points.push(
            `${(progress * 300).toFixed(1)},${(42.5 + Math.sin(progress * Math.PI * 2 * cycles + offset) * amplitude).toFixed(1)}`,
          );
        }
        const opacity = (0.1 + load * 0.35).toFixed(2);
        const width = (1 + load).toFixed(2);
        return `<polyline class="phase phase-${phase + 1}" points="${points.join(" ")}" style="stroke:${colors[phase]};stroke-width:${width};opacity:${opacity}"/>`;
      });
      return `<svg class="phase-waves ${item.type}" viewBox="0 0 300 85" preserveAspectRatio="none"><line x1="0" y1="42.5" x2="300" y2="42.5"/>${paths.join("")}</svg>`;
    }
    if (item.type === "electricity_price") {
      return `<div class="price-bars">${[32, 46, 25, 58, 38, 65, 29].map((h, i) => `<i style="height:${h}%;animation-delay:-${i * 0.25}s"></i>`).join("")}</div>`;
    }
    if (item.type === "pool") {
      return `<svg class="pool-waves" viewBox="0 0 220 85" preserveAspectRatio="none"><path d="M0 55 Q22 40 44 55 T88 55 T132 55 T176 55 T220 55"/><path d="M0 68 Q22 53 44 68 T88 68 T132 68 T176 68 T220 68"/></svg>`;
    }
    if (item.type === "settings") {
      const icons = [
        [
          "binary_sensor.vaskemaskine_korer",
          "/local/hvidevarer/vaskemaskine2_running.png",
        ],
        [
          "binary_sensor.torretumbler_korer",
          "/local/hvidevarer/toerretumbler2_running.png",
        ],
        [
          "binary_sensor.opvaskemaskine_korer",
          "/local/hvidevarer/opvaskemaskine2_running.png",
        ],
      ].filter(([id]) => this.on(id));
      return icons.length
        ? `<div class="appliances">${icons.map(([, src]) => `<img src="${src}">`).join("")}</div>`
        : "";
    }
    if (
      item.type === "heating" &&
      /cool|heat|fan/.test(
        this.text("sensor.ac_combined_state", "").toLowerCase(),
      )
    ) {
      return `<div class="airflow"><i></i><i></i><i></i></div>`;
    }
    return "";
  }

  action(item) {
    if (item.navigation_path) {
      history.pushState(null, "", item.navigation_path);
      window.dispatchEvent(new Event("location-changed"));
    } else if (item.entity) {
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          bubbles: true,
          composed: true,
          detail: { entityId: item.entity },
        }),
      );
    }
  }

  render() {
    if (!this.config || !this._hass) return;
    const item = this.view({
      ...this.config,
      type: this.config.preset || this.config.type_name || "entity",
    });
    this.shadowRoot.innerHTML = `<style>
      :host{display:block}
      .item{display:block;width:100%;min-width:0;max-width:100%;height:85px;box-sizing:border-box;position:relative;overflow:hidden;padding:10px 12px;border:0;border-left:3px solid color-mix(in srgb,var(--accent) 78%,transparent);border-radius:15px;background:var(--surface,var(--ha-card-background,var(--card-background-color,#172536)));box-shadow:var(--dashboard-shadow-strong,0 8px 22px rgba(0,0,0,.22));color:var(--gray800,var(--primary-text-color,#f8fafc));font:inherit;text-align:left;cursor:pointer}
      .value{position:relative;z-index:2;font-size:18px;font-weight:750;line-height:21px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:38px}.meter{position:relative;z-index:2;display:flex;gap:4px;height:8px;margin:5px 0}.seg{width:14px;height:6px;border-radius:99px;background:color-mix(in srgb,var(--dashboard-icon-muted,#64748b) 25%,transparent)}.seg.on{background:var(--accent);box-shadow:0 0 7px color-mix(in srgb,var(--accent) 28%,transparent)}
      .detail{display:block;min-width:0;max-width:100%;position:relative;z-index:2;color:var(--gray600,var(--secondary-text-color,#a7b2c2));font-size:11px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:35px;box-sizing:border-box}.label{display:block;min-width:0;max-width:100%;position:relative;z-index:2;color:var(--gray700,var(--secondary-text-color,#cbd5e1));font-size:11px;font-weight:700;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:35px;box-sizing:border-box}.source-row{display:flex;align-items:center;gap:5px;height:14px}.source-row ha-icon{position:static;width:13px;height:13px;--mdc-icon-size:13px;flex:0 0 13px}.source-row b{line-height:1}.item.security .detail{display:none}.item.security .label{position:absolute;left:12px;bottom:4px;width:80px;height:38px;padding:0;overflow:visible}.security-row{display:grid;grid-template-columns:repeat(2,38px);grid-template-rows:repeat(2,18px);gap:2px 4px;width:80px;height:38px;justify-content:start;align-content:start}.security-row>span{display:flex;align-items:center;justify-content:center;gap:1px;width:38px;height:18px;padding:0 2px;box-sizing:border-box;border-radius:6px;background:color-mix(in srgb,var(--dashboard-icon-muted,#64748b) 9%,transparent);border:1px solid color-mix(in srgb,var(--dashboard-icon-muted,#64748b) 18%,transparent)}.security-row img,.security-row ha-icon{position:static;width:12px;height:12px;--mdc-icon-size:12px;object-fit:contain}.security-row b{font-size:9px;line-height:1}
      .bg-icon{position:absolute;right:-10px;bottom:-10px;width:58px;height:58px;--mdc-icon-size:58px;color:var(--accent);opacity:.12;animation:drift 5s ease-in-out infinite;z-index:1;pointer-events:none;filter:saturate(1.05) drop-shadow(0 0 10px color-mix(in srgb,var(--accent) 10%,transparent))}@keyframes drift{50%{transform:translate(-4px,-3px) scale(1.04) rotate(-4deg);opacity:.22}}
      .phase-waves,.pool-waves{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}.phase-waves .phase{fill:none;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke;animation:phaseBreathe 3s ease-in-out infinite}.phase-waves .phase-2{animation-delay:-1.4s}.phase-waves .phase-3{animation-delay:-2.8s}.phase-waves line{stroke:var(--secondary-text-color);stroke-width:1;stroke-dasharray:3 3;opacity:.16;vector-effect:non-scaling-stroke}@keyframes phaseBreathe{50%{filter:brightness(1.24) saturate(1.15)}}.pool-waves{opacity:.2}.pool-waves path{fill:none;stroke:var(--accent);stroke-width:1.7;stroke-linecap:round;animation:linePulse 3s ease-in-out infinite}.pool-waves path+path{animation-delay:-1.4s;opacity:.65}@keyframes linePulse{50%{opacity:.35;transform:translateY(-2px)}}
      .price-bars{position:absolute;inset:10px 42px 8px 12px;display:flex;align-items:flex-end;gap:5px;opacity:.2;z-index:0}.price-bars i{display:block;width:3px;border-radius:9px 9px 0 0;background:var(--accent);animation:barPulse 2.8s ease-in-out infinite}@keyframes barPulse{50%{transform:scaleY(.72);opacity:.4}}
      .appliances{position:absolute;right:8px;top:4px;display:flex;gap:3px;z-index:3}.appliances img{width:24px;height:24px;object-fit:contain}.airflow{position:absolute;right:10px;top:8px;z-index:3;color:var(--accent)}.airflow i{display:block;border-top:2px solid currentColor;border-radius:50%;height:4px;margin:1px 0;animation:air 1.9s ease-in-out infinite}.airflow i:nth-child(1){width:11px}.airflow i:nth-child(2){width:17px;animation-delay:-.3s}.airflow i:nth-child(3){width:23px;animation-delay:-.6s}@keyframes air{50%{transform:translateX(-3px);opacity:.45}}
      @media(max-width:600px){.item{padding:9px 9px}.value{font-size:16px}.detail,.label{font-size:10px}.meter{gap:3px}.seg{width:12px}}
    </style><button class="item ${item.type}" style="--accent:${item.color}" aria-label="${item.name || item.type}">${this.decoration(item)}<div class="value">${item.value}</div><div class="meter">${[1, 2, 3, 4, 5].map((n) => `<i class="seg ${n <= item.meter ? "on" : ""}"></i>`).join("")}</div><div class="detail">${item.detail || "&nbsp;"}</div><div class="label">${item.label}</div><ha-icon class="bg-icon" icon="${item.icon || "mdi:information-outline"}"></ha-icon></button>`;
    this.shadowRoot
      .querySelector(".item")
      .addEventListener("click", () => this.action(item));
  }

  getCardSize() {
    return 2;
  }
  static getConfigElement() {
    return document.createElement("ha-home-status-card-editor");
  }
  static getStubConfig() {
    return { preset: "home_energy" };
  }
}

class HaHomeStatusCardEditor extends HTMLElement {
  setConfig(config) {
    this.config = structuredClone(config);
    this.render();
  }
  set hass(hass) {
    this._hass = hass;
  }
  render() {
    const options = Object.keys(PRESETS)
      .map(
        (key) =>
          `<option value="${key}" ${this.config?.preset === key ? "selected" : ""}>${PRESETS[key].name}</option>`,
      )
      .join("");
    this.innerHTML = `<style>select{box-sizing:border-box;width:100%;padding:10px}label{display:block;margin:8px 0 4px}</style><label>Kortfunktion</label><select>${options}</select>`;
    this.querySelector("select").addEventListener("change", (event) =>
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          bubbles: true,
          composed: true,
          detail: { config: { ...this.config, preset: event.target.value } },
        }),
      ),
    );
  }
}

if (!customElements.get("ha-home-status-card"))
  customElements.define("ha-home-status-card", HaHomeStatusCard);
if (!customElements.get("ha-home-status-card-editor"))
  customElements.define("ha-home-status-card-editor", HaHomeStatusCardEditor);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "ha-home-status-card",
  name: "HA Home Status Card",
  description: "Knapkort med valgfri specialfunktion",
  preview: true,
});
console.info(
  `%c HA-HOME-STATUS-GRID-CARD %c ${VERSION} `,
  "color:#fff;background:#38bdf8;font-weight:700",
  "color:#38bdf8;background:#102030",
);
