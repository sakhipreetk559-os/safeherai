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
  Check,
  Compass
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
  activePresetId,
  setActivePresetId
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
    if (setActivePresetId) setActivePresetId(null);
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
    if (setActivePresetId) setActivePresetId(null);
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
    if (setActivePresetId) setActivePresetId(null);
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
    if (setActivePresetId) setActivePresetId(null);
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
    if (setActivePresetId) setActivePresetId(null);
    const tempPoint = { ...startPoint };
    const tempQuery = startQuery;
    setStartPoint(destination);
    setStartQuery(destQuery);
    setDestination(tempPoint);
    setDestQuery(tempQuery);
  };

  // GPS Locate
  const handleUseCurrentLocation = () => {
    if (setActivePresetId) setActivePresetId(null);
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

  // Preset Selection Handler
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
    <div className="glass-panel rounded-3xl p-5 shadow-glass space-y-4">
      {/* Header & City Presets */}
      <div className="space-y-3 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 text-cyan-300 border border-cyan-500/30">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white tracking-wide">Multi-Stop Route Sentinel</h2>
              <p className="text-[11px] text-slate-400">Add waypoints & analyze real-time corridors</p>
            </div>
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-obsidian-800 text-slate-300 border border-white/10">
            {waypoints.length}/4 STOPS
          </span>
        </div>

        {/* Metro Presets Segmented Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap pl-1">
            Presets:
          </span>
          {CITY_PRESETS.map(p => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePresetSelect(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border-cyan-400/50 text-cyan-200 shadow-glow-cyan'
                    : 'bg-obsidian-900/60 hover:bg-obsidian-800 text-slate-400 hover:text-white border-white/[0.06]'
                }`}
              >
                <span>{p.city}</span>
                {isSelected && <Check className="w-3 h-3 text-cyan-400 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stepper Input Fields with Glowing Rail */}
      <div className="relative pl-7 space-y-3 before:content-[''] before:absolute before:left-3 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-emerald-400 before:via-cyan-400 before:to-rose-400 before:opacity-75">
        {/* Origin Input (Node A) */}
        <div className="relative">
          <div className="absolute -left-7 top-2.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-obsidian-950 text-obsidian-950 text-[10px] font-black flex items-center justify-center shadow-glow-emerald">
            A
          </div>

          <div className="flex items-center bg-obsidian-900/80 hover:bg-obsidian-800/90 border border-white/[0.08] rounded-xl px-3.5 py-2.5 focus-within:border-emerald-400/80 focus-within:ring-1 focus-within:ring-emerald-400/30 transition-all shadow-inner">
            <input
              type="text"
              value={startQuery}
              onChange={(e) => handleSearch(e.target.value, 'start')}
              onFocus={() => startSuggestions.length > 0 && setActiveDropdown('start')}
              placeholder="Enter Origin Point..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none font-medium"
            />
            {/* GPS Locate */}
            <button
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              title="Use current GPS location"
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition"
            >
              {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <Crosshair className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Autocomplete Dropdown: Start */}
          {activeDropdown === 'start' && startSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-obsidian-800 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-white/[0.06] backdrop-blur-xl">
              {startSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => selectSuggestion(item, 'start')}
                  className="px-3.5 py-2.5 text-xs hover:bg-white/[0.06] cursor-pointer flex items-center space-x-2.5 text-slate-200 transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Intermediate Waypoints */}
        {waypoints.map((wp, index) => (
          <div key={wp.id} className="relative flex items-center space-x-2">
            <div className="absolute -left-7 top-2.5 w-5 h-5 rounded-full bg-cyan-500 border-2 border-obsidian-950 text-obsidian-950 text-[10px] font-black flex items-center justify-center shadow-glow-cyan">
              {index + 1}
            </div>

            <div className="flex-1 flex items-center bg-obsidian-900/80 hover:bg-obsidian-800/90 border border-white/[0.08] rounded-xl px-3.5 py-2.5 focus-within:border-cyan-400/80 focus-within:ring-1 focus-within:ring-cyan-400/30 transition-all shadow-inner">
              <input
                type="text"
                value={waypointQueries[wp.id] || wp.name || ''}
                onChange={(e) => handleSearch(e.target.value, wp.id)}
                onFocus={() => waypointSuggestions[wp.id]?.length > 0 && setActiveDropdown(wp.id)}
                placeholder={`Intermediate Stop #${index + 1}...`}
                className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none font-medium"
              />
            </div>

            <button
              onClick={() => handleRemoveStop(wp.id)}
              className="p-2.5 rounded-xl bg-obsidian-900 hover:bg-rose-500/20 border border-white/[0.08] hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition"
              title="Remove Stop"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown: Waypoint */}
            {activeDropdown === wp.id && waypointSuggestions[wp.id]?.length > 0 && (
              <div className="absolute left-0 right-10 top-full mt-1.5 bg-obsidian-800 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-white/[0.06] backdrop-blur-xl">
                {waypointSuggestions[wp.id].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectSuggestion(item, wp.id)}
                    className="px-3.5 py-2.5 text-xs hover:bg-white/[0.06] cursor-pointer flex items-center space-x-2.5 text-slate-200 transition"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Destination Input (Node B) */}
        <div className="relative">
          <div className="absolute -left-7 top-2.5 w-5 h-5 rounded-full bg-rose-500 border-2 border-obsidian-950 text-white text-[10px] font-black flex items-center justify-center shadow-glow-rose">
            B
          </div>

          <div className="flex items-center bg-obsidian-900/80 hover:bg-obsidian-800/90 border border-white/[0.08] rounded-xl px-3.5 py-2.5 focus-within:border-rose-400/80 focus-within:ring-1 focus-within:ring-rose-400/30 transition-all shadow-inner">
            <input
              type="text"
              value={destQuery}
              onChange={(e) => handleSearch(e.target.value, 'dest')}
              onFocus={() => destSuggestions.length > 0 && setActiveDropdown('dest')}
              placeholder="Enter Destination Point..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none font-medium"
            />
            {/* Swap Button */}
            <button
              onClick={handleSwap}
              title="Swap Origin & Destination"
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-cyan-400 transition"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dropdown: Dest */}
          {activeDropdown === 'dest' && destSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-obsidian-800 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-white/[0.06] backdrop-blur-xl">
              {destSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => selectSuggestion(item, 'dest')}
                  className="px-3.5 py-2.5 text-xs hover:bg-white/[0.06] cursor-pointer flex items-center space-x-2.5 text-slate-200 transition"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons: Add Stop & Analyze Corridors */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleAddStop}
          disabled={waypoints.length >= 4}
          className="text-xs font-bold text-cyan-300 hover:text-cyan-200 flex items-center space-x-1.5 py-1.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Stop</span>
        </button>

        <button
          onClick={onCalculateRoutes}
          disabled={isLoading || !startPoint || !destination}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-black text-xs flex items-center space-x-2 shadow-glow-cyan transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="pt-3 border-t border-white/[0.08] space-y-2.5">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
            <span>AVAILABLE CORRIDORS</span>
            <span className="text-cyan-400 font-bold">CLICK TO SWITCH</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {routes.map(r => {
              const isSelected = r.id === activeRouteId;
              const analysis = safetyAnalysis && safetyAnalysis[r.id];
              const score = analysis ? analysis.safetyScore : (r.id === 'safest' ? 95 : r.id === 'populated' ? 82 : 55);

              return (
                <div
                  key={r.id}
                  onClick={() => setActiveRouteId(r.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all select-none relative overflow-hidden ${
                    isSelected
                      ? 'bg-obsidian-800/90 border-cyan-400/80 shadow-glow-cyan ring-1 ring-cyan-400/40'
                      : 'bg-obsidian-900/50 border-white/[0.06] hover:border-white/20 hover:bg-obsidian-800/60'
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
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/40">
                          RECOMMENDED
                        </span>
                      )}
                    </div>

                    {/* Safety Badge */}
                    <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-black flex items-center space-x-1 ${
                      score >= 85
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                        : score >= 68
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-500/15 text-rose-300 border border-rose-500/40'
                    }`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{score}% Safe</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-1">{r.tagline}</p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-300 mt-2 font-medium">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <strong className="text-white font-bold">{r.durationMin} mins</strong>
                    </span>
                    <span>•</span>
                    <span>{r.distanceKm} km</span>
                    {analysis?.breakdown?.liquor && (
                      <>
                        <span>•</span>
                        <span className={analysis.breakdown.liquor.count > 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                          {analysis.breakdown.liquor.count} Bars / Liquor
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
