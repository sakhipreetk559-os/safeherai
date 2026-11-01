# 🛡️ SafeHer AI — Real-Time Women's Safety & Intelligent Navigation System

[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Ready-black?logo=vercel&logoColor=white)](https://vercel.com)
[![Render Ready](https://img.shields.io/badge/Render-Ready-46E3B7?logo=render&logoColor=black)](https://render.com)

**SafeHer AI** is an intelligent, real-time women's safety multi-stop route navigation web application and analytical risk platform. It runs completely out-of-the-box with **zero paid API keys**, utilizing open-source geospatial services (**Leaflet.js**, **OpenStreetMap Nominatim**, **OSRM**, and **Overpass API**).

---

## 🚀 Instant Deployment Guide

The repository is pre-configured with `vercel.json`, `render.yaml`, `Procfile`, and root delegates so you can deploy to both **Vercel** and **Render** in just a few clicks.

### 🌐 Deploy Frontend to Vercel (Recommended for Web App)

1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New Project** and import: `sakhipreetk559-os/safeherai`.
3. Vercel automatically detects the root [`vercel.json`](./vercel.json):
   - **Framework Preset**: Vite
   - **Build Command**: `cd web && npm install && npm run build`
   - **Output Directory**: `web/dist`
4. Click **Deploy**. Your app will be live on a `*.vercel.app` URL with automatic SSL and CDN caching!

---

### ☁️ Deploy to Render

The repository includes a ready-to-use [`render.yaml`](./render.yaml) Blueprint that configures both the **FastAPI Backend** and the **Vite Frontend Static Site**.

#### Option A: One-Click Render Blueprint (Deploys Both Backend & Frontend)
1. Sign in to [Render](https://render.com).
2. Go to **Dashboard > New > Blueprint**.
3. Connect your repository: `sakhipreetk559-os/safeherai`.
4. Render will read `render.yaml` and provision:
   - `safeher-api`: Python 3.11 Web Service running FastAPI (`uvicorn backend.main:app`).
   - `safeher-web`: Fast Static Site hosting the Vite/React application.
5. Click **Apply**.

#### Option B: Deploy Only the FastAPI Backend on Render
1. In Render, select **New > Web Service**.
2. Connect `sakhipreetk559-os/safeherai`.
3. Configure settings:
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Click **Create Web Service**.

#### Option C: Deploy Frontend Static Site on Render
1. In Render, select **New > Static Site**.
2. Connect `sakhipreetk559-os/safeherai`.
3. Configure settings:
   - **Build Command**: `cd web && npm install && npm run build`
   - **Publish Directory**: `web/dist`
4. Click **Create Static Site**.

---

## 🌟 Core Features

### 1. Multi-Stop Route Planner (A to B with Waypoints)
- **Dynamic Waypoint Insertion**: Add up to 4 intermediate stops with live re-ordering, removal, and start/destination swapping.
- **OpenStreetMap Nominatim Search**: Live geocoding with instant debouncing and curated fallback for Indian metro locations.
- **1-Click Demo Metro Presets**: Pre-configured real-world corridors for *Delhi NCR*, *Bengaluru*, *Mumbai*, *Pune*, and *Hyderabad*.
- **Multi-Route Corridor Engine**: Generates 3 differentiated routes displayed as color-coded interactive polylines:
  - 🟢 **Safest Corridor** (Optimized for maximum police & hospital density; avoids unlit alleys).
  - 🔵 **Well-Lit & Populated Route** (High pedestrian traffic, late-night cafes & family dining).
  - 🔴 **Fastest Direct Route** (Shortest transit path, highlighting caution stretches and blindspots).

### 2. Live Route & Destination Safety Analyzer (0–100% Score)
- **SafeHer AI Scorecard**: Real-time circular percentage meter and safety tier assessment (*Level 1: Shielded*, *Level 2: Moderate Precaution*, *Level 3: High Alert*).
- **Corridor Safety Breakdown**:
  - 🍷 **Liquor Shops & Bars** (`shop=alcohol`, `amenity=bar`, `amenity=pub`): Warning icons to avoid alcohol-heavy clusters.
  - ⚠️ **Accident-Prone Zones**: Highlights blind turns, heavy merging zones, and highway blackspots.
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
├── vercel.json              # Vercel deployment configuration
├── render.yaml              # Render Infrastructure-as-Code Blueprint
├── Procfile                 # Standard PaaS process definition
├── runtime.txt              # Python runtime lock (3.11.9)
├── package.json             # Root monorepo delegate
├── requirements.txt         # Root Python requirements
├── web/                     # Modern Vite + React + Leaflet + Tailwind CSS Web App
│   ├── vercel.json          # Subdirectory Vercel override
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── components/      # Navbar, RoutePlanner, MapView, SafetyScoreCard, Modals
│       ├── services/        # Nominatim, OSRM routing, SafetyEngine, EmergencyAudio
│       └── data/            # Presets & verified helplines
├── backend/                 # FastAPI Analytical Backend & Predictive APIs
│   ├── requirements.txt
│   └── main.py
├── data/                    # Geospatial zone metadata & incident history
│   └── raw/
├── ml/                      # XGBoost risk models, feature encoders, evaluation scripts
│   └── models/
└── tests/                   # Pytest test suite for validation & guardrails
```

---

## 💻 Local Development

### 1. Web Application (Vite + React)
```bash
cd web
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Analytical Backend
```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```
Interactive Swagger docs available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 📄 License
MIT License. Built for women's safety and public benefit.
