const VERSION = "0.1.1";

const PRESETS = {
  home_energy: {
    name: "Hus",
    icon: "mdi:transmission-tower",
    color: "var(--state-info-icon, #38bdf8)",
    entity: "sensor.teknikrum_hovedmaler_power",
    vehicle_power_entity: "sensor.th_charger_effekt_normaliseret_kw",
    daily_entity: "sensor.dagligt_husforbrug_uden_bil",
    navigation_path: "/energi-overblik/energy",
    value_unit: "kW",
  },
  ev: {
    name: "Bil",
    icon: "mdi:car-electric",
    color: "var(--state-on-icon, #20e3a2)",
    entity: "sensor.energitte_battery",
    power_entity: "sensor.th_charger_effekt_normaliseret_kw",
    daily_entity: "sensor.tesla_daglig_ladning",
    navigation_path: "/teknik-overblik/ev-overblik",
    value_unit: "%",
  },
  electricity_price: {
    name: "Strømpris",
    icon: "mdi:cash",
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
    open_count_entity: "sensor.open_windows",
    alarm_entity: "alarm_control_panel.verisure_alarm",
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
    } else if (type === "security") {
      const locks = cfg.lock_entities || [];
      const locked = locks.filter(
        (id) => this.state(id)?.state === "locked",
      ).length;
      const open = this.number(cfg.open_count_entity);
      value =
        locked === locks.length && (!Number.isFinite(open) || open === 0)
          ? "Sikret"
          : "Åben";
      detail =
        Number.isFinite(open) && open > 0
          ? `${this.fmt(open, 0)} åbne`
          : `${locked}/${locks.length} låst`;
      meter = locked;
      color =
        value === "Sikret"
          ? "var(--state-on-icon, #20e3a2)"
          : "var(--warning-color, #f59e0b)";
    } else if (type === "heating") {
      const heating = /opvarm|til|heat/.test(
        this.text(cfg.heating_entity, "").toLowerCase(),
      );
      value = heating ? "Varmer" : this.text(cfg.entity, "Klar");
      const pressure = this.number(cfg.pressure_entity);
      detail = Number.isFinite(pressure)
        ? `${this.fmt(pressure, 1)} bar · ${this.text(cfg.source_entity, "")}`
        : this.text(cfg.source_entity, "Varmeanlæg");
      meter = heating ? 4 : 1;
      color = heating
        ? "var(--error-color, #f43f5e)"
        : "var(--state-info-icon, #38bdf8)";
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
      .item{height:85px;box-sizing:border-box;position:relative;overflow:hidden;padding:10px 12px;border:0;border-left:3px solid color-mix(in srgb,var(--accent) 78%,transparent);border-radius:15px;background:var(--surface,var(--ha-card-background,var(--card-background-color,#172536)));box-shadow:var(--dashboard-shadow-strong,0 8px 22px rgba(0,0,0,.22));color:var(--gray800,var(--primary-text-color,#f8fafc));font:inherit;text-align:left;cursor:pointer}
      .value{position:relative;z-index:2;font-size:18px;font-weight:750;line-height:21px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:38px}.meter{position:relative;z-index:2;display:flex;gap:4px;height:8px;margin:5px 0}.seg{width:14px;height:6px;border-radius:99px;background:color-mix(in srgb,var(--dashboard-icon-muted,#64748b) 25%,transparent)}.seg.on{background:var(--accent);box-shadow:0 0 7px color-mix(in srgb,var(--accent) 28%,transparent)}
      .detail{position:relative;z-index:2;color:var(--gray600,var(--secondary-text-color,#a7b2c2));font-size:11px;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:35px}.label{position:relative;z-index:2;color:var(--gray700,var(--secondary-text-color,#cbd5e1));font-size:11px;font-weight:700;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:35px}
      ha-icon{position:absolute;right:-10px;bottom:-10px;width:58px;height:58px;color:var(--accent);opacity:.15;animation:drift 5s ease-in-out infinite}@keyframes drift{50%{transform:translate(-4px,-3px) scale(1.04) rotate(-4deg);opacity:.23}}
      @media(max-width:600px){.item{padding:9px 9px}.value{font-size:16px}.detail,.label{font-size:10px}.meter{gap:3px}.seg{width:12px}}
    </style><button class="item" style="--accent:${item.color}" aria-label="${item.label}"><div class="value">${item.value}</div><div class="meter">${[1, 2, 3, 4, 5].map((n) => `<i class="seg ${n <= item.meter ? "on" : ""}"></i>`).join("")}</div><div class="detail">${item.detail || "&nbsp;"}</div><div class="label">${item.label}</div><ha-icon icon="${item.icon || "mdi:information-outline"}"></ha-icon></button>`;
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
