# 🛡️ SafeHer AI — Real-Time Women's Safety & Intelligent Navigation

A complete, production-grade women's safety navigation web application built with **React**, **Vite**, **Tailwind CSS**, **Lucide Icons**, and open-source geospatial services (**Leaflet.js**, **OpenStreetMap Nominatim**, **OSRM**, and **Overpass API**).

---

## 🌟 Key Features

### 1. Multi-Stop Route Planner (A to B with Intermediate Stops)
- **Waypoints Engine**: Add up to 4 intermediate stops along the route with dynamic re-ordering, individual removal, and quick swap between Origin & Destination.
- **OpenStreetMap Nominatim Autocomplete**: Real-time geocoding with instant debouncing and resilient fallback for Indian metro locations.
- **One-Click Demo City Presets**:
  - *Delhi NCR Commuter Corridor*: Connaught Place ➔ Hauz Khas Village ➔ DLF Cyber City Gurugram
  - *Bengaluru Tech Corridor*: Indiranagar 100ft Rd ➔ Koramangala ➔ Electronic City
  - *Mumbai Coastal Commute*: BKC ➔ Lower Parel Palladium ➔ Marine Drive
  - *Pune Night Transit*: Koregaon Park ➔ Kalyani Nagar ➔ Viman Nagar
  - *Hyderabad Cyber Corridor*: HITEC City ➔ Jubilee Hills ➔ Gachibowli

### 2. Multi-Route Corridor Generation
- **Safest Corridor (Green)**: Maximizes proximity to 24/7 Police Stations and Hospitals; strictly avoids liquor clusters and unlit blindspots.
- **Well-Lit & Populated Route (Cyan)**: Prioritizes active commercial arteries, late-night cafes, and family restaurants with high pedestrian density.
- **Fastest Direct Route (Rose/Red)**: Direct transit path, highlighting caution zones and accident blackspots for transparent risk awareness.

### 3. Live Route & Destination Safety Analyzer (0–100% Score)
- **SafeHer AI Scorecard**: Circular percentage gauge with Safety Tiers (*Level 1: Shielded*, *Level 2: Moderate Precaution*, *Level 3: High Alert*).
- **Corridor Safety Breakdown**:
  - 🍷 **Liquor Shops & Bars** (`shop=alcohol`, `amenity=bar`, `amenity=pub`): Plotted with amber warning pins to avoid alcohol-heavy zones.
  - ⚠️ **Accident Blackspots**: Highlighting sharp blind turns and highway conflict stretches.
  - 🛡️ **Police Stations & Women Desks** (`amenity=police`): Verified law enforcement posts along the corridor.
  - 🏥 **24/7 Emergency Hospitals** (`amenity=hospital`): Trauma centers within immediate reach.
  - ☕ **Safe Public Facilities** (`tourism=hotel`, `amenity=restaurant`, `amenity=cafe`): Well-lit shelters, 24/7 fuel marts, and family dining.
- **Destination Area Audit**: Proximity analysis around the final destination point (within 1.5 km).

### 4. Smart Safety Filters (Interactive Toggles)
- `Strictly Avoid Liquor Shops`: Reroutes or heavily penalizes routes passing drinking clusters.
- `Prioritize Police & Hospital Corridors`: Maximizes emergency support proximity.
- `Low Road Accident Risk Only`: Filters out routes with accident blackspots.
- `Show Safe Stopovers`: Highlights open, populated rest stops.
- `Interactive Map Intel Layers`: Toggle individual marker categories on and off directly from the map.

### 5. Women's Helpline & Emergency SOS Command Bar
- **Verified Official Directory Hub**: One-tap calling and copying for **1091** (Women Helpline), **112** (National Emergency), **100** (Police), **108** (Ambulance), **7827170170** (NCW), **181** (Women in Distress), and **1090** (Women Power Line).
- **Floating Red SOS Emergency Modal**:
  - Synthesizes realistic dual-tone emergency siren using standard Web Audio API (zero audio assets required).
  - 5-second countdown with immediate cancel or dispatch.
  - One-tap SMS trigger (`sms:112?body=...`) with user's exact GPS distress coordinates.
- **Share Live Trip**: Generates a live tracking link with origin, destination, ETA, and safety grade for 1-click sharing via WhatsApp or clipboard.
- **Nearest Safe Haven Guide**: Automatically locates the closest Police Station, Hospital, or Shelter from the current pin, calculates walking distance and ETA, and displays a direct path.

---

## 🚀 How to Run

The dev server is currently running at:
```
http://localhost:5173/
```

To run manually in any terminal:
```bash
cd safeher-ai/web
npm run dev
```

To produce an optimized production bundle:
```bash
npm run build
```
