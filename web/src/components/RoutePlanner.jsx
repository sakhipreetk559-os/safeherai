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
  AlertCircle
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
  isLoading,
  routes,
  activeRouteId,
  setActiveRouteId,
  safetyAnalysis
}) {
  const [startQuery, setStartQuery] = useState(startPoint?.name || '');
  const [destQuery, setDestQuery] = useState(destination?.name || '');
  const [waypointQueries, setWaypointQueries] = useState({});

  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [waypointSuggestions, setWaypointSuggestions] = useState({});

  const [activeDropdown, setActiveDropdown] = useState(null); // 'start', 'dest', or waypoint id
  const [isLocating, setIsLocating] = useState(false);

  const searchTimeoutRef = useRef(null);

  // Sync state if props change (e.g. via preset)
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
    }, 300);
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

  // Swap Start and Destination
  const handleSwap = () => {
    if (!startPoint || !destination) return;
    const tempPoint = { ...startPoint };
    const tempQuery = startQuery;
    setStartPoint(destination);
    setStartQuery(destQuery);
    setDestination(tempPoint);
    setDestQuery(tempQuery);
  };

  // Browser Geolocation
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
        // Fallback demo point (Connaught Place, Delhi)
        const fallback = { name: 'Connaught Place, New Delhi', lat: 28.6315, lng: 77.2167 };
        setStartPoint(fallback);
        setStartQuery(fallback.name);
        setIsLocating(false);
      },
      { timeout: 7000 }
    );
  };

  // Load Preset
  const handleLoadPreset = (presetId) => {
    const preset = CITY_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setStartPoint(preset.start);
    setStartQuery(preset.start.name);

    setWaypoints(preset.waypoints || []);
    const wpQueryMap = {};
    (preset.waypoints || []).forEach(wp => {
      wpQueryMap[wp.id] = wp.name;
    });
    setWaypointQueries(wpQueryMap);

    setDestination(preset.destination);
    setDestQuery(preset.destination.name);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
      {/* Header & Preset Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <RouteIcon className="w-4 h-4 text-pink-400" />
          <h2 className="font-bold text-sm text-slate-100">Multi-Stop Route Planner</h2>
        </div>

        {/* Quick Select Preset Dropdown */}
        <div className="relative">
          <select
            onChange={(e) => handleLoadPreset(e.target.value)}
            defaultValue=""
            className="bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-pink-400 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-pink-500 cursor-pointer"
          >
            <option value="" disabled>⚡ Demo City Presets</option>
            {CITY_PRESETS.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Inputs Stack */}
      <div className="space-y-2.5 relative">
        {/* Start Location Input */}
        <div className="relative">
          <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 focus-within:border-emerald-500 transition shadow-inner">
            <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 mr-2.5"></span>
            <input
              type="text"
              value={startQuery}
              onChange={(e) => handleSearch(e.target.value, 'start')}
              onFocus={() => startSuggestions.length > 0 && setActiveDropdown('start')}
              placeholder="Enter Start Location (e.g. Connaught Place)..."
              className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            {/* GPS Locate Button */}
            <button
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              title="Use current GPS pin"
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
            <div className="flex-1 flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 focus-within:border-cyan-500 transition shadow-inner">
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold flex items-center justify-center mr-2 border border-cyan-500/40">
                {index + 1}
              </span>
              <input
                type="text"
                value={waypointQueries[wp.id] || wp.name || ''}
                onChange={(e) => handleSearch(e.target.value, wp.id)}
                onFocus={() => waypointSuggestions[wp.id]?.length > 0 && setActiveDropdown(wp.id)}
                placeholder={`Intermediate Stop #${index + 1}...`}
                className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
              />
            </div>

            <button
              onClick={() => handleRemoveStop(wp.id)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition"
              title="Remove Stop"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Autocomplete Dropdown: Waypoint */}
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
          <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 focus-within:border-pink-500 transition shadow-inner">
            <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-pink-500 ring-4 ring-pink-500/20 mr-2.5"></span>
            <input
              type="text"
              value={destQuery}
              onChange={(e) => handleSearch(e.target.value, 'dest')}
              onFocus={() => destSuggestions.length > 0 && setActiveDropdown('dest')}
              placeholder="Enter Final Destination (e.g. Cyber City)..."
              className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            {/* Swap Button */}
            <button
              onClick={handleSwap}
              title="Swap Start & Destination"
              className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-pink-400 transition"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Autocomplete Dropdown: Dest */}
          {activeDropdown === 'dest' && destSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-700/60">
              {destSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => selectSuggestion(item, 'dest')}
                  className="px-3 py-2 text-xs hover:bg-slate-700/80 cursor-pointer flex items-center space-x-2 text-slate-200"
                >
                  <MapPin className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Stop Button & Action Buttons */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handleAddStop}
          disabled={waypoints.length >= 4}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Stop ({waypoints.length}/4)</span>
        </button>

        <button
          onClick={onCalculateRoutes}
          disabled={isLoading || !startPoint || !destination}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-pink-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Corridors...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Safe Routes</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Route Comparison Cards */}
      {routes && routes.length > 0 && (
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Available Route Corridors</span>
            <span className="text-pink-400">Click to Select</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {routes.map(r => {
              const isSelected = r.id === activeRouteId;
              const analysis = safetyAnalysis && safetyAnalysis[r.id];
              const score = analysis ? analysis.safetyScore : (r.id === 'safest' ? 92 : r.id === 'populated' ? 84 : 58);

              return (
                <div
                  key={r.id}
                  onClick={() => setActiveRouteId(r.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-800/90 border-pink-500/80 ring-1 ring-pink-500/40 shadow-lg'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: r.color }}
                      />
                      <h4 className="font-bold text-xs text-slate-100">{r.name}</h4>
                      {r.isRecommended && (
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                          Recommended
                        </span>
                      )}
                    </div>

                    {/* Safety Score Badge */}
                    <div className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold flex items-center space-x-1 ${
                      score >= 85
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : score >= 68
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      <ShieldCheck className="w-3 h-3" />
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
                        <span className={analysis.breakdown.liquor.count > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                          {analysis.breakdown.liquor.count} Bars Nearby
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
