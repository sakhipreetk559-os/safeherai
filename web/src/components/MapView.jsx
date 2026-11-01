import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Shield, 
  Cross, 
  Wine, 
  AlertTriangle, 
  Coffee, 
  Layers, 
  Navigation,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { haversineKm } from '../services/osrmService.js';

// Auto-Fit Map Bounds component
function MapController({ bounds, center }) {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
    } else if (center) {
      map.setView(center, 13, { animate: true });
    }
  }, [bounds, center, map]);

  return null;
}

// Custom DivIcon Builders
function createPinIcon(type, label = '', number = null) {
  let bgClass = 'bg-slate-700 text-white';
  let innerHtml = '';

  if (type === 'start') {
    bgClass = 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/50 ring-2 ring-emerald-300';
    innerHtml = `<span style="font-size: 11px; font-weight: 900;">A</span>`;
  } else if (type === 'destination') {
    bgClass = 'bg-rose-500 text-white font-black shadow-lg shadow-rose-500/50 ring-2 ring-rose-300';
    innerHtml = `<span style="font-size: 11px; font-weight: 900;">B</span>`;
  } else if (type === 'waypoint') {
    bgClass = 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/50 ring-2 ring-cyan-200';
    innerHtml = `<span style="font-size: 10px; font-weight: 900;">${number || '•'}</span>`;
  } else if (type === 'police') {
    bgClass = 'bg-blue-600 text-white ring-2 ring-blue-300 shadow-lg shadow-blue-600/60';
    innerHtml = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    `;
  } else if (type === 'hospital') {
    bgClass = 'bg-emerald-600 text-white ring-2 ring-emerald-300 shadow-lg shadow-emerald-600/60';
    innerHtml = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    `;
  } else if (type === 'liquor') {
    bgClass = 'bg-amber-600 text-white ring-2 ring-amber-300 shadow-lg shadow-amber-600/60';
    innerHtml = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 22h8M12 11v11M19 3l-7 8-7-8h14z"/>
      </svg>
    `;
  } else if (type === 'accident') {
    bgClass = 'bg-zinc-950 text-amber-400 ring-2 ring-amber-400 shadow-lg shadow-amber-500/60';
    innerHtml = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    `;
  } else if (type === 'shelter') {
    bgClass = 'bg-violet-600 text-white ring-2 ring-violet-300 shadow-lg shadow-violet-600/60';
    innerHtml = `
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 2h-3a4 4 0 0 0-4 4v14h7a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 2v20M6 10h5"/>
      </svg>
    `;
  } else if (type === 'nearest-target') {
    bgClass = 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-300/80 shadow-2xl shadow-cyan-400 animate-bounce';
    innerHtml = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    `;
  }

  const size = (type === 'start' || type === 'destination' || type === 'nearest-target') ? 30 : 25;

  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div style="width: ${size}px; height: ${size}px;" class="custom-pin ${bgClass}">
        ${innerHtml}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
}

export function MapView({
  startPoint,
  waypoints = [],
  destination,
  routes = [],
  activeRouteId,
  onSelectRoute,
  corridorPois = [],
  nearestSafeHaven,
  isNightMode
}) {
  // Layer Visibility
  const [layers, setLayers] = useState({
    police: true,
    hospital: true,
    liquor: true,
    accident: true,
    shelter: true
  });

  const toggleLayer = (layerKey) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  // Compute POI counts for badges
  const poiCounts = useMemo(() => {
    return {
      police: corridorPois.filter(p => p.category === 'police').length,
      hospital: corridorPois.filter(p => p.category === 'hospital').length,
      liquor: corridorPois.filter(p => p.category === 'liquor').length,
      accident: corridorPois.filter(p => p.category === 'accident').length,
      shelter: corridorPois.filter(p => p.category === 'shelter').length,
    };
  }, [corridorPois]);

  // Calculate Map Bounds
  const mapBounds = useMemo(() => {
    const latLngs = [];
    if (startPoint?.lat && startPoint?.lng) latLngs.push([startPoint.lat, startPoint.lng]);
    waypoints.forEach(wp => {
      if (wp?.lat && wp?.lng) latLngs.push([wp.lat, wp.lng]);
    });
    if (destination?.lat && destination?.lng) latLngs.push([destination.lat, destination.lng]);

    // Active route points
    const active = routes.find(r => r.id === activeRouteId);
    if (active?.coordinates && active.coordinates.length > 0) {
      active.coordinates.forEach(c => latLngs.push(c));
    }

    if (latLngs.length >= 2) {
      return L.latLngBounds(latLngs);
    }
    return null;
  }, [startPoint, waypoints, destination, routes, activeRouteId]);

  const defaultCenter = useMemo(() => {
    if (startPoint?.lat) return [startPoint.lat, startPoint.lng];
    return [28.6315, 77.2167];
  }, [startPoint]);

  const activeRoute = routes.find(r => r.id === activeRouteId) || routes[0];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-800/90 shadow-2xl bg-slate-950 isolate z-0">
      {/* Floating Map Intelligence Bar (Controlled z-index within map canvas) */}
      <div className="absolute top-3 right-3 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1.5 shadow-2xl flex flex-wrap items-center gap-1.5 max-w-[95vw]">
        <div className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 hidden sm:flex items-center space-x-1">
          <Layers className="w-3 h-3 text-cyan-400" />
          <span>Intel:</span>
        </div>

        <button
          onClick={() => toggleLayer('police')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
            layers.police
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 shadow-sm'
              : 'bg-slate-800/80 text-slate-400 border border-slate-700 opacity-60'
          }`}
          title="Toggle Police Stations"
        >
          <Shield className="w-3 h-3 text-blue-400" />
          <span>Police</span>
          <span className="text-[10px] px-1 rounded-full bg-blue-500/30 text-blue-200 ml-0.5">{poiCounts.police}</span>
        </button>

        <button
          onClick={() => toggleLayer('hospital')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
            layers.hospital
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
              : 'bg-slate-800/80 text-slate-400 border border-slate-700 opacity-60'
          }`}
          title="Toggle Hospitals"
        >
          <Cross className="w-3 h-3 text-emerald-400" />
          <span>Hospitals</span>
          <span className="text-[10px] px-1 rounded-full bg-emerald-500/30 text-emerald-200 ml-0.5">{poiCounts.hospital}</span>
        </button>

        <button
          onClick={() => toggleLayer('liquor')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
            layers.liquor
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
              : 'bg-slate-800/80 text-slate-400 border border-slate-700 opacity-60'
          }`}
          title="Toggle Liquor Shops & Bars"
        >
          <Wine className="w-3 h-3 text-amber-400" />
          <span>Bars/Liquor</span>
          <span className="text-[10px] px-1 rounded-full bg-amber-500/30 text-amber-200 ml-0.5">{poiCounts.liquor}</span>
        </button>

        <button
          onClick={() => toggleLayer('accident')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
            layers.accident
              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 shadow-sm'
              : 'bg-slate-800/80 text-slate-400 border border-slate-700 opacity-60'
          }`}
          title="Toggle Accident Blackspots"
        >
          <AlertTriangle className="w-3 h-3 text-yellow-400" />
          <span>Blackspots</span>
          <span className="text-[10px] px-1 rounded-full bg-yellow-500/30 text-yellow-200 ml-0.5">{poiCounts.accident}</span>
        </button>

        <button
          onClick={() => toggleLayer('shelter')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
            layers.shelter
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50 shadow-sm'
              : 'bg-slate-800/80 text-slate-400 border border-slate-700 opacity-60'
          }`}
          title="Toggle Safe Havens & Cafes"
        >
          <Coffee className="w-3 h-3 text-violet-400" />
          <span>Shelters</span>
          <span className="text-[10px] px-1 rounded-full bg-violet-500/30 text-violet-200 ml-0.5">{poiCounts.shelter}</span>
        </button>
      </div>

      {/* Main Leaflet Map with Zero-Key Free OSM Tiles */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className={`w-full h-full ${isNightMode ? 'night-map' : 'day-map'}`}
      >
        <MapController bounds={mapBounds} center={defaultCenter} />

        {/* 100% Free OpenStreetMap Standard Tiles (Zero API key needed) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Inactive Alternative Route Polylines */}
        {routes
          .filter(r => r.id !== activeRouteId)
          .map(r => (
            <Polyline
              key={r.id}
              positions={r.coordinates}
              pathOptions={{
                color: r.color,
                weight: 4,
                opacity: 0.35,
                dashArray: '5, 8'
              }}
              eventHandlers={{
                click: () => onSelectRoute(r.id)
              }}
            />
          ))}

        {/* Active Route Polyline with Soft Outer Glow */}
        {activeRoute && (
          <>
            <Polyline
              positions={activeRoute.coordinates}
              pathOptions={{
                color: activeRoute.color,
                weight: 10,
                opacity: 0.3
              }}
            />
            <Polyline
              positions={activeRoute.coordinates}
              pathOptions={{
                color: activeRoute.color,
                weight: 5,
                opacity: 0.95
              }}
            />
          </>
        )}

        {/* Emergency Nearest Safe Haven Direct Ray (strictly local corridor <= 5km) */}
        {nearestSafeHaven && startPoint && haversineKm(startPoint.lat, startPoint.lng, nearestSafeHaven.lat, nearestSafeHaven.lng) <= 5.0 && (
          <Polyline
            positions={[
              [startPoint.lat, startPoint.lng],
              [nearestSafeHaven.lat, nearestSafeHaven.lng]
            ]}
            pathOptions={{
              color: '#06b6d4',
              weight: 3,
              opacity: 0.9,
              dashArray: '6, 6'
            }}
          />
        )}

        {/* Start Marker (A) */}
        {startPoint?.lat && (
          <Marker
            position={[startPoint.lat, startPoint.lng]}
            icon={createPinIcon('start')}
          >
            <Popup>
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-emerald-400 block text-[11px]">Journey Start (A)</span>
                <p className="text-slate-100 font-medium">{startPoint.name}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Waypoints */}
        {waypoints.map((wp, idx) => (
          wp.lat && (
            <Marker
              key={wp.id || idx}
              position={[wp.lat, wp.lng]}
              icon={createPinIcon('waypoint', '', idx + 1)}
            >
              <Popup>
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-cyan-400 block text-[11px]">Waypoint #{idx + 1}</span>
                  <p className="text-slate-100 font-medium">{wp.name || 'Waystation'}</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {/* Destination Marker (B) */}
        {destination?.lat && (
          <Marker
            position={[destination.lat, destination.lng]}
            icon={createPinIcon('destination')}
          >
            <Popup>
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-rose-400 block text-[11px]">Destination (B)</span>
                <p className="text-slate-100 font-medium">{destination.name}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Nearest Safe Haven Beacon Marker */}
        {nearestSafeHaven && (
          <Marker
            position={[nearestSafeHaven.lat, nearestSafeHaven.lng]}
            icon={createPinIcon('nearest-target')}
          >
            <Popup>
              <div className="text-xs space-y-1">
                <span className="font-extrabold text-cyan-400 block text-[11px]">🚨 Closest Safe Haven</span>
                <p className="text-white font-bold">{nearestSafeHaven.title}</p>
                <p className="text-slate-300">
                  {nearestSafeHaven.distanceMeters}m away (~{nearestSafeHaven.walkingTimeMin} min walking)
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Safety Corridor POIs */}
        {corridorPois.map(poi => {
          if (!layers[poi.category]) return null;

          return (
            <Marker
              key={poi.id}
              position={[poi.lat, poi.lng]}
              icon={createPinIcon(poi.category)}
            >
              <Popup>
                <div className="text-xs space-y-1">
                  <div className="flex items-center space-x-1.5">
                    {poi.category === 'police' && <span className="text-blue-400 font-bold uppercase text-[10px]">Police Station</span>}
                    {poi.category === 'hospital' && <span className="text-emerald-400 font-bold uppercase text-[10px]">24/7 Hospital</span>}
                    {poi.category === 'liquor' && <span className="text-amber-400 font-bold uppercase text-[10px]">Warning: Liquor Outlet</span>}
                    {poi.category === 'accident' && <span className="text-yellow-400 font-bold uppercase text-[10px]">Accident Blackspot</span>}
                    {poi.category === 'shelter' && <span className="text-violet-400 font-bold uppercase text-[10px]">Safe Rest Stop</span>}
                  </div>
                  <h5 className="font-bold text-slate-100">{poi.title}</h5>
                  <p className="text-slate-400 text-[11px]">
                    Corridor Distance: {poi.distanceToRouteMeters || 140}m from route path
                  </p>
                  <span className="text-[10px] text-slate-500 italic block">
                    Source: {poi.source}
                  </span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
