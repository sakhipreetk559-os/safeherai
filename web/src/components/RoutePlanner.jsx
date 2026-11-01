import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Plus, 
  Trash2, 
  ArrowUpDown, 
  Crosshair, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Route as RouteIcon,
  ChevronDown,
  Loader2,
  AlertCircle,
  Building2,
  Check
} from 'lucide-react';
import { searchLocations, reverseGeocode } from '../services/nominatimService';
import { CITY_PRESETS } from '../data/presets';

export function RoutePlanner({
  startPoint,
  setStartPoint,
  waypoints,
  setWaypoints,
  destination,
  setDestination,
  onCalculateRoutes,
  onSelectPreset,
  isLoading,
  routes,
  activeRouteId,
  setActiveRouteId,
  safetyAnalysis,
  activePresetId
}) {
  const [startQuery, setStartQuery] = useState(startPoint?.name || '');
  const [destQuery, setDestQuery] = useState(destination?.name || '');
  const [waypointQueries, setWaypointQueries] = useState({});

  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [waypointSuggestions, setWaypointSuggestions] = useState({});

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const searchTimeoutRef = useRef(null);

  // Sync state if props change
  useEffect(() => {
    if (startPoint?.name) setStartQuery(startPoint.name);
  }, [startPoint]);

  useEffect(() => {
    if (destination?.name) setDestQuery(destination.name);
  }, [destination]);

  // Handle Autocomplete Search
  const handleSearch = (query, target) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (target === 'start') setStartQuery(query);
    else if (target === 'dest') setDestQuery(query);
    else {
      setWaypointQueries(prev => ({ ...prev, [target]: query }));
    }

    if (!query || query.length < 2) {
      if (target === 'start') setStartSuggestions([]);
      else if (target === 'dest') setDestSuggestions([]);
      else setWaypointSuggestions(prev => ({ ...prev, [target]: [] }));
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      const results = await searchLocations(query);
      if (target === 'start') {
        setStartSuggestions(results);
        setActiveDropdown('start');
      } else if (target === 'dest') {
        setDestSuggestions(results);
        setActiveDropdown('dest');
      } else {
        setWaypointSuggestions(prev => ({ ...prev, [target]: results }));
        setActiveDropdown(target);
      }
    }, 280);
  };

  const selectSuggestion = (item, target) => {
    if (target === 'start') {
      setStartPoint(item);
      setStartQuery(item.name);
      setStartSuggestions([]);
    } else if (target === 'dest') {
      setDestination(item);
      setDestQuery(item.name);
      setDestSuggestions([]);
    } else {
      setWaypoints(prev => prev.map(wp => wp.id === target ? { ...wp, ...item } : wp));
      setWaypointQueries(prev => ({ ...prev, [target]: item.name }));
      setWaypointSuggestions(prev => ({ ...prev, [target]: [] }));
    }
    setActiveDropdown(null);
  };

  // Add Waypoint
  const handleAddStop = () => {
    if (waypoints.length >= 4) return;
    const newId = `wp-${Date.now()}`;
    const newWp = {
      id: newId,
      name: '',
      lat: (startPoint?.lat || 28.6139) + 0.02,
      lng: (startPoint?.lng || 77.2090) + 0.02
    };
    setWaypoints([...waypoints, newWp]);
    setWaypointQueries(prev => ({ ...prev, [newId]: '' }));
  };

  // Remove Waypoint
  const handleRemoveStop = (id) => {
    setWaypoints(waypoints.filter(wp => wp.id !== id));
    setWaypointQueries(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // Swap Start & Destination
  const handleSwap = () => {
    if (!startPoint || !destination) return;
    const tempPoint = { ...startPoint };
    const tempQuery = startQuery;
    setStartPoint(destination);
    setStartQuery(destQuery);
    setDestination(tempPoint);
    setDestQuery(tempQuery);
  };

  // GPS Locate
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const geoResult = await reverseGeocode(latitude, longitude);
        setStartPoint(geoResult);
        setStartQuery(geoResult.name);
        setIsLocating(false);
      },
      () => {
        const fallback = { name: 'Connaught Place, New Delhi', lat: 28.6315, lng: 77.2167 };
        setStartPoint(fallback);
        setStartQuery(fallback.name);
        setIsLocating(false);
      },
      { timeout: 6000 }
    );
  };

  // Select Preset Handler
  const handlePresetSelect = (presetId) => {
    const preset = CITY_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setStartQuery(preset.start.name);
    setDestQuery(preset.destination.name);
    const wpQueryMap = {};
    (preset.waypoints || []).forEach(wp => {
      wpQueryMap[wp.id] = wp.name;
    });
    setWaypointQueries(wpQueryMap);

    if (onSelectPreset) {
      onSelectPreset(preset);
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-4 shadow-2xl space-y-4">
      {/* Header & City Corridor Presets */}
      <div className="space-y-2.5 pb-3 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <RouteIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">Multi-Stop Route Sentinel</h2>
              <p className="text-[11px] text-slate-400">Add waypoints & simulate real commute corridors</p>
            </div>
          </div>

          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Waypoints: {waypoints.length}/4
          </span>
        </div>

        {/* Demo Metro Preset Quick Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 whitespace-nowrap pl-0.5">
            Presets:
          </span>
          {CITY_PRESETS.map(p => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePresetSelect(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center space-x-1 border ${
                  isSelected
                    ? 'bg-pink-500/20 border-pink-500/60 text-pink-300 shadow-sm'
                    : 'bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700/60'
                }`}
              >
                <span>{p.city}</span>
                {isSelected && <Check className="w-3 h-3 text-pink-400 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Inputs Stack with Stepper Connector Line */}
      <div className="relative pl-6 space-y-2.5 before:content-[''] before:absolute before:left-2.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-cyan-500 before:to-rose-500 before:opacity-60">
        {/* Start Location Input */}
        <div className="relative">
          {/* Stepper Node A */}
          <div className="absolute -left-6 top-2.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-lg shadow-emerald-500/40">
            A
          </div>

          <div className="flex items-center bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 focus-within:border-emerald-500 transition shadow-inner">
            <input
              type="text"
              value={startQuery}
              onChange={(e) => handleSearch(e.target.value, 'start')}
              onFocus={() => startSuggestions.length > 0 && setActiveDropdown('start')}
              placeholder="Enter Origin Point..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
            />
            {/* GPS Locate */}
            <button
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              title="Use current GPS location"
              className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-emerald-400 transition"
            >
              {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <Crosshair className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Autocomplete Dropdown: Start */}
          {activeDropdown === 'start' && startSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-700/60">
              {startSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => selectSuggestion(item, 'start')}
                  className="px-3 py-2 text-xs hover:bg-slate-700/80 cursor-pointer flex items-center space-x-2 text-slate-200"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Waypoints (Intermediate Stops) */}
        {waypoints.map((wp, index) => (
          <div key={wp.id} className="relative flex items-center space-x-1.5">
            {/* Stepper Node # */}
            <div className="absolute -left-6 top-2.5 w-4 h-4 rounded-full bg-cyan-500 border-2 border-slate-900 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-lg shadow-cyan-500/40">
              {index + 1}
            </div>

            <div className="flex-1 flex items-center bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 focus-within:border-cyan-500 transition shadow-inner">
              <input
                type="text"
                value={waypointQueries[wp.id] || wp.name || ''}
                onChange={(e) => handleSearch(e.target.value, wp.id)}
                onFocus={() => waypointSuggestions[wp.id]?.length > 0 && setActiveDropdown(wp.id)}
                placeholder={`Intermediate Stop #${index + 1}...`}
                className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <button
              onClick={() => handleRemoveStop(wp.id)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition"
              title="Remove Stop"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown: Waypoint */}
            {activeDropdown === wp.id && waypointSuggestions[wp.id]?.length > 0 && (
              <div className="absolute left-0 right-10 top-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-700/60">
                {waypointSuggestions[wp.id].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectSuggestion(item, wp.id)}
                    className="px-3 py-2 text-xs hover:bg-slate-700/80 cursor-pointer flex items-center space-x-2 text-slate-200"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Destination Input */}
        <div className="relative">
          {/* Stepper Node B */}
          <div className="absolute -left-6 top-2.5 w-4 h-4 rounded-full bg-rose-500 border-2 border-slate-900 text-white text-[9px] font-black flex items-center justify-center shadow-lg shadow-rose-500/40">
            B
          </div>

          <div className="flex items-center bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 focus-within:border-rose-500 transition shadow-inner">
            <input
              type="text"
              value={destQuery}
              onChange={(e) => handleSearch(e.target.value, 'dest')}
              onFocus={() => destSuggestions.length > 0 && setActiveDropdown('dest')}
              placeholder="Enter Final Destination..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
            />
            {/* Swap Button */}
            <button
              onClick={handleSwap}
              title="Swap Origin & Destination"
              className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-pink-400 transition"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dropdown: Dest */}
          {activeDropdown === 'dest' && destSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-700/60">
              {destSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => selectSuggestion(item, 'dest')}
                  className="px-3 py-2 text-xs hover:bg-slate-700/80 cursor-pointer flex items-center space-x-2 text-slate-200"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Stop Button & Generate Routes Action */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handleAddStop}
          disabled={waypoints.length >= 4}
          className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1.5 py-1 px-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Intermediate Stop</span>
        </button>

        <button
          onClick={onCalculateRoutes}
          disabled={isLoading || !startPoint || !destination}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs flex items-center space-x-2 shadow-xl shadow-pink-600/30 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Risk Matrix...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Safe Corridors</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Route Choice Cards */}
      {routes && routes.length > 0 && (
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Available Route Corridors</span>
            <span className="text-pink-400 text-[10px]">Select to Navigate</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {routes.map(r => {
              const isSelected = r.id === activeRouteId;
              const analysis = safetyAnalysis && safetyAnalysis[r.id];
              const score = analysis ? analysis.safetyScore : (r.id === 'safest' ? 94 : r.id === 'populated' ? 82 : 55);

              return (
                <div
                  key={r.id}
                  onClick={() => setActiveRouteId(r.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition relative overflow-hidden select-none ${
                    isSelected
                      ? 'bg-slate-800/95 border-pink-500/80 ring-1 ring-pink-500/50 shadow-xl'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0 ring-2 ring-white/20"
                        style={{ backgroundColor: r.color }}
                      />
                      <h4 className="font-extrabold text-xs text-white">{r.name}</h4>
                      {r.isRecommended && (
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-500/30">
                          Recommended
                        </span>
                      )}
                    </div>

                    {/* Safety Score Badge */}
                    <div className={`px-2 py-0.5 rounded-full text-[11px] font-black flex items-center space-x-1 ${
                      score >= 85
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/40'
                        : score >= 68
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/40'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/40'
                    }`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{score}% Safe</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{r.tagline}</p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-300 mt-2 font-medium">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <strong className="text-white">{r.durationMin} mins</strong>
                    </span>
                    <span>•</span>
                    <span>{r.distanceKm} km</span>
                    {analysis?.breakdown?.liquor && (
                      <>
                        <span>•</span>
                        <span className={analysis.breakdown.liquor.count > 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                          {analysis.breakdown.liquor.count} Liquor Outlets
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
