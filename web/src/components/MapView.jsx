import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Shield, 
  Cross, 
  Wine, 
  AlertTriangle, 
  Coffee, 
  Hotel, 
  Layers, 
  Eye, 
  EyeOff,
  Navigation
} from 'lucide-react';

// Auto-Fit Map Bounds component
function MapController({ bounds, center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
    } else if (center) {
      map.setView(center, zoom || 13, { animate: true });
    }
  }, [bounds, center, zoom, map]);

  return null;
}

// Custom DivIcon Builders
function createPinIcon(type, label = '', number = null) {
  let bgClass = 'bg-slate-700 text-white';
  let innerHtml = '';

  if (type === 'start') {
    bgClass = 'bg-emerald-500 text-white shadow-emerald-500/50';
    innerHtml = `<span style="font-size: 11px; font-weight: 800;">A</span>`;
  } else if (type === 'destination') {
    bgClass = 'bg-pink-500 text-white shadow-pink-500/50';
    innerHtml = `<span style="font-size: 11px; font-weight: 800;">B</span>`;
  } else if (type === 'waypoint') {
    bgClass = 'bg-cyan-500 text-white shadow-cyan-500/50';
    innerHtml = `<span style="font-size: 10px; font-weight: 800;">${number || '•'}</span>`;
  } else if (type === 'police') {
    bgClass = 'bg-blue-600 text-white ring-2 ring-blue-300 shadow-blue-600/50';
    innerHtml = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    `;
  } else if (type === 'hospital') {
    bgClass = 'bg-emerald-600 text-white ring-2 ring-emerald-300 shadow-emerald-600/50';
    innerHtml = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    `;
  } else if (type === 'liquor') {
    bgClass = 'bg-amber-600 text-white ring-2 ring-amber-300 shadow-amber-600/50';
    innerHtml = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 22h8M12 11v11M19 3l-7 8-7-8h14z"/>
      </svg>
    `;
  } else if (type === 'accident') {
    bgClass = 'bg-zinc-900 text-yellow-400 ring-2 ring-yellow-400 shadow-yellow-500/50';
    innerHtml = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    `;
  } else if (type === 'shelter') {
    bgClass = 'bg-purple-600 text-white ring-2 ring-purple-300 shadow-purple-600/50';
    innerHtml = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 2h-3a4 4 0 0 0-4 4v14h7a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 2v20M6 10h5"/>
      </svg>
    `;
  } else if (type === 'nearest-target') {
    bgClass = 'bg-cyan-400 text-slate-900 ring-4 ring-cyan-400/60 shadow-cyan-400/80 animate-bounce';
    innerHtml = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    `;
  }

  const size = (type === 'start' || type === 'destination' || type === 'nearest-target') ? 32 : 26;

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
  // POI Layer Visibility Toggles
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

  // Calculate Map Bounds
  const mapBounds = useMemo(() => {
    const latLngs = [];
    if (startPoint?.lat) latLngs.push([startPoint.lat, startPoint.lng]);
    waypoints.forEach(wp => {
      if (wp?.lat) latLngs.push([wp.lat, wp.lng]);
    });
    if (destination?.lat) latLngs.push([destination.lat, destination.lng]);

    // Include route coordinates
    const activeRoute = routes.find(r => r.id === activeRouteId);
    if (activeRoute?.coordinates) {
      activeRoute.coordinates.forEach(c => latLngs.push(c));
    }

    if (latLngs.length >= 2) {
      return L.latLngBounds(latLngs);
    }
    return null;
  }, [startPoint, waypoints, destination, routes, activeRouteId]);

  // Center coordinate fallback (Connaught Place, Delhi)
  const defaultCenter = [28.6315, 77.2167];

  // Active route
  const activeRoute = routes.find(r => r.id === activeRouteId) || routes[0];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Floating Map Layer Visibility Bar */}
      <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2 shadow-xl flex flex-wrap items-center gap-1.5 max-w-[90vw]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 hidden sm:inline">
          Intel Layers:
        </span>

        <button
          onClick={() => toggleLayer('police')}
          className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
            layers.police
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700 opacity-60'
          }`}
          title="Toggle Police Stations"
        >
          <Shield className="w-3 h-3 text-blue-400" />
          <span>Police</span>
        </button>

        <button
          onClick={() => toggleLayer('hospital')}
          className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
            layers.hospital
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700 opacity-60'
          }`}
          title="Toggle 24/7 Hospitals"
        >
          <Cross className="w-3 h-3 text-emerald-400" />
          <span>Hospitals</span>
        </button>

        <button
          onClick={() => toggleLayer('liquor')}
          className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
            layers.liquor
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700 opacity-60'
          }`}
          title="Toggle Liquor Shops & Bars"
        >
          <Wine className="w-3 h-3 text-amber-400" />
          <span>Bars/Liquor</span>
        </button>

        <button
          onClick={() => toggleLayer('accident')}
          className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
            layers.accident
              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700 opacity-60'
          }`}
          title="Toggle Accident Blackspots"
        >
          <AlertTriangle className="w-3 h-3 text-yellow-400" />
          <span>Blackspots</span>
        </button>

        <button
          onClick={() => toggleLayer('shelter')}
          className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
            layers.shelter
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700 opacity-60'
          }`}
          title="Toggle Safe Havens & Cafes"
        >
          <Coffee className="w-3 h-3 text-purple-400" />
          <span>Shelters</span>
        </button>
      </div>

      {/* Main Leaflet Map */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapController bounds={mapBounds} center={defaultCenter} zoom={13} />

        {/* Map Tiles (OpenStreetMap CartoDB Dark/Voyager) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={
            isNightMode
              ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
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
                dashArray: '4, 8'
              }}
              eventHandlers={{
                click: () => onSelectRoute(r.id)
              }}
            />
          ))}

        {/* Active Route Polyline */}
        {activeRoute && (
          <>
            {/* Glow outer stroke */}
            <Polyline
              positions={activeRoute.coordinates}
              pathOptions={{
                color: activeRoute.color,
                weight: 10,
                opacity: 0.25
              }}
            />
            {/* Solid sharp route path */}
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

        {/* Emergency Nearest Safe Haven Direct Ray */}
        {nearestSafeHaven && startPoint && (
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
              <div className="text-xs">
                <span className="font-bold text-emerald-400 block mb-0.5">Journey Start Point</span>
                <p className="text-slate-200">{startPoint.name}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Waypoint Markers (#1, #2, ...) */}
        {waypoints.map((wp, idx) => (
          wp.lat && (
            <Marker
              key={wp.id}
              position={[wp.lat, wp.lng]}
              icon={createPinIcon('waypoint', '', idx + 1)}
            >
              <Popup>
                <div className="text-xs">
                  <span className="font-bold text-cyan-400 block mb-0.5">Intermediate Stop #{idx + 1}</span>
                  <p className="text-slate-200">{wp.name || 'Waystation'}</p>
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
              <div className="text-xs">
                <span className="font-bold text-pink-400 block mb-0.5">Final Destination</span>
                <p className="text-slate-200">{destination.name}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Nearest Haven Pulse Marker */}
        {nearestSafeHaven && (
          <Marker
            position={[nearestSafeHaven.lat, nearestSafeHaven.lng]}
            icon={createPinIcon('nearest-target')}
          >
            <Popup>
              <div className="text-xs space-y-1">
                <span className="font-bold text-cyan-400 block">🚨 Nearest Emergency Safe Haven</span>
                <p className="text-white font-semibold">{nearestSafeHaven.title}</p>
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
                    {poi.category === 'liquor' && <span className="text-amber-400 font-bold uppercase text-[10px]">Warning: Alcohol Outlet</span>}
                    {poi.category === 'accident' && <span className="text-yellow-400 font-bold uppercase text-[10px]">Accident Blackspot</span>}
                    {poi.category === 'shelter' && <span className="text-purple-400 font-bold uppercase text-[10px]">Safe Rest Stop</span>}
                  </div>
                  <h5 className="font-bold text-slate-100">{poi.title}</h5>
                  <p className="text-slate-400 text-[11px]">
                    Corridor Distance: {poi.distanceToRouteMeters || 120}m from route path
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
