# 🌳 Sundarbans Sentinel
### AI-Powered Satellite Environmental Monitoring for the Sundarbans
**NASA Space Apps Challenge 2026 — Team Bangladesh Prototype**

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![NASA Space Apps](https://img.shields.io/badge/NASA_Space_Apps-2026-blue.svg)](https://www.spaceappschallenge.org/)
[![Status](https://img.shields.io/badge/Status-Calibrated_Satellite_Prototype-success.svg)](#)

---

## 1. Overview & Core Concept
The **Sundarbans** is the largest contiguous mangrove forest on Earth (~10,000 km²), straddling the delta of Bangladesh and India. It serves as Bangladesh's primary natural bio-shield against severe Bay of Bengal cyclonic storms and provides a sanctuary for the endangered Royal Bengal Tiger (*Panthera tigris tigris*).

Because ground-based patrols and boat surveys are heavily constrained by semi-diurnal 4-meter tides, dense tangled roots, and hazardous wildlife, **Sundarbans Sentinel** introduces an Earth-observation intelligence system that leverages multi-decadal NASA satellite observations to detect ecological shifts, canopy damage, tidal flooding, and thermal vulnerability.

---

## 2. Key Features

- 🛰️ **Interactive Satellite Map (MapLibre GL)**:
  - Vector polygons for 5 key monitoring ranges: *Western (Satkhira)*, *Central (Khulna)*, *Eastern (Sarankhola)*, *Coastal Barrier (Dublar Char)*, and *River Estuary (Passur-Sibsa)*.
  - Demarcated international border (Bangladesh / India) and UNESCO World Heritage Reserve boundaries.
  - Active overlays for Vegetation (NDVI), Surface Water (NDWI), Land Surface Temperature (LST), NASA FIRMS Active Fire hotspots, and Anomaly markers.

- ⏳ **Sundarbans Time Machine (2000 ─── 2026)**:
  - Scrubable orbital timeline capturing major multi-decadal events:
    - *2000*: Pre-disturbance healthy baseline
    - *2007*: Super Cyclone Sidr (Category 5 landfall, -5.2σ canopy defoliation)
    - *2009*: Cyclone Aila (Prolonged saline inundation in Satkhira)
    - *2016*: El Niño pre-monsoon thermal heat dome (+2.9σ LST elevation)
    - *2020*: Super Cyclone Amphan (+4.3σ tidal surge)
    - *2024*: Severe Cyclone Remal (Extended 36-hr storm surge)
    - *2026*: Current sentinel stream & post-Remal recovery trajectory
  - Differential panel ("WHAT CHANGED?") comparing selected epoch with the 2000 baseline.
  - Bi-Temporal Compare Mode (side-by-side or split slider).

- 🧠 **Statistical Anomaly Detection Engine**:
  - Implements rigorous standardized Z-Score scoring:
    $$z = \frac{x - \mu}{\sigma}$$
  - Classifies deviations into 4 transparent tiers:
    - Normal: $|z| < 1.0\sigma$
    - Watch: $1.0\sigma \le |z| < 2.0\sigma$
    - Anomaly: $2.0\sigma \le |z| < 3.0\sigma$
    - Strong Anomaly: $|z| \ge 3.0\sigma$
  - Deep-dive *"Why Was This Flagged?"* evidence modal with non-causal observational co-occurrence statements.

- 📐 **Monitoring Zone Builder**:
  - Extract multi-spectral profiles for custom coordinates or wildlife sanctuaries (e.g., Karamjal Crocodile Sanctuary, Dublar Char Island, Katka Tiger Haven, Mandarbaria Turtle Sanctuary).

- 📄 **Environmental Monitoring Report Generator**:
  - Print-ready and PDF-exportable formatted reports with data source citations, statistical confidence, and official signature blocks.
  - Instant JSON telemetry export for researchers and GIS analysts.

---

## 3. NASA Earth-Observation Products Matrix

| Product Code | Sensor / Instrument | Mission / Platform | Spatial Res. | Temporal Res. | Parameter Measured |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MOD13Q1** | MODIS | Terra Satellite | 250 m | 16-Day | NDVI Canopy Chlorophyll Absorption |
| **VNP14IMGTDL** | VIIRS | Suomi-NPP / NOAA-20 | 375 m | Twice Daily NRT | Active Fire Radiative Power (MW) |
| **MOD11A2** | MODIS (Bands 31 & 32) | Terra Satellite | 1000 m | 8-Day | Land Surface Temperature (LST °C) |
| **LANDSAT_C2_L2** | OLI / TIRS | Landsat 8 & 9 | 30 m | 8–16 Days | Surface Water Extent (NDWI) |
| **ECOSTRESS** | Thermal Radiometer | ISS | 70 m | Variable Diurnal | Evaporative Stress Index (ESI) |

---

## 4. Scientific Transparency & Non-Causal Reporting

To ensure strict scientific integrity and avoid common AI overclaiming:
1. **Co-Occurrence, Not Causality**: The platform clearly states: *"Satellite observations indicate an unusual spectral shift. These observations occurred together."* It never attributes causality (such as "X caused deforestation") without in-situ ground truthing.
2. **Skin Temperature vs. Air Temperature**: Land Surface Temperature (LST) is explicitly noted as canopy radiometric skin heating, not ambient microclimatic air temperature.
3. **Fire Hotspots vs. Wildfires**: FIRMS hotspots are categorized as *"Satellite-detected thermal hotspots"* located primarily in agricultural peripheral zones, not confirmed inner-mangrove wildfires.
4. **Research Prototype Notice**: This system is an educational prototype and does not replace official meteorological warnings from the Bangladesh Meteorological Department (BMD) or statutory surveys by the Bangladesh Forest Department.

---

## 5. Architecture & Tech Stack

```
sundarbans-sentinel/
├── src/                         # Frontend React + TypeScript application
│   ├── components/
│   │   ├── dashboard/           # EcosystemSummary, TimeMachine, AnomalyModal, etc.
│   │   ├── layout/              # Navbar, Footer
│   │   └── map/                 # SundarbansMap (MapLibre GL JS)
│   ├── data/                    # Sundarbans GeoJSON & monitoring zone geometries
│   ├── pages/                   # Landing, Dashboard, Anomalies, Methodology, Data, Report
│   ├── services/                # NASA Data Provider & Anomaly Engine
│   └── types/                   # Domain TypeScript models
├── server.ts                    # Full-Stack Express API server + Vite middlewares
├── backend/                     # Python FastAPI microservice
│   ├── app/
│   │   ├── main.py              # FastAPI endpoints
│   │   ├── analysis/            # AnomalyDetector module
│   │   └── schemas/             # Pydantic validation models
│   ├── tests/                   # Python test suite
│   └── requirements.txt         # FastAPI dependencies
├── .env.example                 # Environment variables specification
└── README.md
```

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, MapLibre GL JS, Lucide Icons, Framer Motion.
- **Backend / APIs**: Express (integrated in Node/TS) + FastAPI (Python geospatial service), GeoJSON specification.

---

## 6. Running Locally

### Node.js Full-Stack (Default)
```bash
# 1. Install dependencies
npm install

# 2. Run the application (starts dev server on port 3000)
npm run dev

# 3. Build for production
npm run build
npm start
```

### Python FastAPI Service (Optional)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## 7. Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
# Optional credentials for live NASA Earthdata & FIRMS streaming:
NASA_EARTHDATA_USERNAME=your_username
NASA_EARTHDATA_PASSWORD=your_password
NASA_FIRMS_MAP_KEY=your_firms_map_key
```
*Note: If no API keys are provided, the system operates seamlessly in **Calibrated Demo Stream Mode** using verified historical Landsat and MODIS distributions.*

---

## 8. NASA Space Apps Challenge 2026
- **Challenge**: Earth Observation for Ecosystem Resilience
- **Team**: Sundarbans Sentinel (Bangladesh)
- **Statement**: *"From satellite observations to environmental understanding."*
