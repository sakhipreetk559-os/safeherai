# 🛡️ SafeHer AI — Real-Time Women's Safety & Intelligent Navigation System

[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

**SafeHer AI** is an end-to-end women's safety ecosystem featuring a real-time intelligent route navigation web application and predictive analytical risk engine. It operates out-of-the-box with **zero paid API keys** or complex database configurations, utilizing open-source geospatial services (**Leaflet.js**, **OpenStreetMap Nominatim**, **OSRM**, and **Overpass API**).

---

## 🌟 Core Features

### 1. Multi-Stop Route Planner (A to B with Waypoints)
- **Dynamic Waypoint Insertion**: Add up to 4 intermediate stops with live drag/re-ordering, removal, and start/destination swapping.
- **OpenStreetMap Nominatim Search**: Live geocoding with instant debouncing and resilient fallback for Indian metro locations.
- **1-Click Demo Metro Presets**: Pre-configured real-world corridors for *Delhi NCR*, *Bengaluru*, *Mumbai*, *Pune*, and *Hyderabad*.
- **Multi-Route Corridor Engine**: Generates 3 differentiated routes displayed as color-coded interactive polylines:
  - 🟢 **Safest Corridor** (Optimized for maximum police & hospital density; avoids unlit alleys).
  - 🔵 **Well-Lit & Populated Route** (High pedestrian traffic, late-night cafes & family dining).
  - 🔴 **Fastest Direct Route** (Shortest transit path, highlighting caution stretches and blindspots).

### 2. Live Route & Destination Safety Analyzer (0–100% Score)
- **SafeHer AI Scorecard**: Real-time circular percentage meter and safety tier assessment (*Level 1: Shielded*, *Level 2: Moderate Precaution*, *Level 3: High Alert*).
- **Corridor Safety Breakdown**:
  - 🍷 **Liquor Shops & Bars** (`shop=alcohol`, `amenity=bar`, `amenity=pub`): Plotted with amber warning icons to help users steer clear of alcohol-heavy clusters.
  - ⚠️ **Accident-Prone Zones**: Highlights blind turns, heavy truck merging zones, and highway blackspots.
  - 🛡️ **Police Stations & Women Desks** (`amenity=police`): Verified law enforcement posts along the corridor.
  - 🏥 **24/7 Hospitals & Trauma** (`amenity=hospital`): Emergency medical response facilities within reach.
  - ☕ **Safe Public Facilities** (`tourism=hotel`, `amenity=restaurant`, `amenity=cafe`): Populated shelters, 24/7 fuel marts, and well-lit rest stops.
- **Destination Area Audit**: Safety score and proximity to police and hospitals within 1.5 km of the destination pin.

### 3. Smart Safety Filters (Interactive Toggles)
- `[Toggle]` **Strictly Avoid Liquor Shops** (penalizes routes passing alcohol clusters).
- `[Toggle]` **Prioritize Police & Hospital Corridors** (maximizes emergency response proximity).
- `[Toggle]` **Low Road Accident Risk Only** (prioritizes safe road geometries).
- `[Toggle]` **Show Safe Stopovers (Hotels, Restaurants & Cafes)**.
- **Map Intel Layers**: Toggle individual marker categories on and off directly on the map.

### 4. Women's Helpline & Emergency SOS Command Bar
- **Helpline Directory Hub**: One-tap quick dial and copy for:
  - `1091` — Women Police Helpline (24x7 Toll-Free)
  - `112` — National Emergency Response Support System (ERSS)
  - `100` — Police Control Room (PCR)
  - `108` — Emergency Medical Ambulance
  - `7827170170` — NCW 24/7 Women Helpline (Domestic violence & cyber distress)
  - `181` — Women in Distress Helpline (MWCD)
  - `1090` — Women Power Line (Anti-eve teasing)
- **Floating Red SOS Emergency Modal**:
  - Dual-tone synthesized emergency acoustic siren (Web Audio API, zero audio assets required).
  - 5-second countdown with immediate dispatch or false-alarm cancel.
  - One-tap SMS trigger (`sms:112?body=...`) containing user's exact GPS distress coordinates.
- **Share Live Trip**: Generates simulated live tracking link with ETA, start/destination, safety score, and 1-tap WhatsApp sharing.
- **Nearest Safe Haven Guide**: Automatically locates the closest Police Station, Hospital, or 24/7 shelter from the user's location with walking ETA and direction ray.

---

## 🏗️ Repository Architecture

```
safeherai/
├── web/                     # Modern Vite + React + Leaflet + Tailwind CSS Web App
│   ├── src/
│   │   ├── components/      # Navbar, RoutePlanner, MapView, SafetyScoreCard, Modals
│   │   ├── services/        # Nominatim, OSRM routing, SafetyEngine, EmergencyAudio
│   │   └── data/            # Presets & verified helplines
│   ├── index.html
│   └── vite.config.js
├── backend/                 # FastAPI Analytical Backend & Predictive APIs
│   └── main.py
├── data/                    # Geospatial zone metadata & incident history
│   └── raw/
├── ml/                      # XGBoost risk models, feature encoders, evaluation scripts
│   └── models/
└── tests/                   # Pytest test suite for validation & guardrails
```

---

## ⚡ Quick Start

### 1. Web Application (Vite + React)
```bash
cd web
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Analytical Backend (Optional)
```bash
cd backend
pip install -r requirements.txt  # or install fastapi uvicorn
uvicorn main:app --reload --port 8000
```

---

## 📄 License
MIT License. Built for women's safety and public benefit.
