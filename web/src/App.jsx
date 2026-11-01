import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { RoutePlanner } from './components/RoutePlanner';
import { MapView } from './components/MapView';
import { SafetyScoreCard } from './components/SafetyScoreCard';
import { SafetyFilters } from './components/SafetyFilters';
import { EmergencyHubModal } from './components/EmergencyHubModal';
import { SosAlertModal } from './components/SosAlertModal';
import { ShareTripModal } from './components/ShareTripModal';
import { SafeHavenDrawer } from './components/SafeHavenDrawer';
import { getRoutes } from './services/osrmService';
import { analyzeRouteSafety, findNearestSafeHaven } from './services/safetyEngine';
import { CITY_PRESETS } from './data/presets';

export default function App() {
  const defaultPreset = CITY_PRESETS[0];

  const [activePresetId, setActivePresetId] = useState(defaultPreset.id);
  const [startPoint, setStartPoint] = useState(defaultPreset.start);
  const [waypoints, setWaypoints] = useState(defaultPreset.waypoints);
  const [destination, setDestination] = useState(defaultPreset.destination);

  const [routes, setRoutes] = useState([]);
  const [activeRouteId, setActiveRouteId] = useState('safest');
  const [safetyAnalysis, setSafetyAnalysis] = useState({});
  const [activePois, setActivePois] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    avoidLiquor: true,
    prioritizePoliceHospital: true,
    lowAccidentRisk: false,
    showSafeStopovers: true
  });

  const [isNightMode, setIsNightMode] = useState(true);

  // Modals
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSafeHavenOpen, setIsSafeHavenOpen] = useState(false);
  const [nearestHaven, setNearestHaven] = useState(null);

  // Core route calculation executor
  const executeRouteCalculation = useCallback(async (points, dest, presetId = null) => {
    if (!points || points.length < 2 || !dest) return;

    setIsLoading(true);
    try {
      // 1. Fetch OSRM or street-level preset geometry
      const fetchedRoutes = await getRoutes(points, presetId);
      setRoutes(fetchedRoutes);

      // 2. Perform safety risk matrix analysis on all route options
      const analysisMap = {};
      for (const r of fetchedRoutes) {
        const analysis = await analyzeRouteSafety(r, dest, filters, isNightMode);
        analysisMap[r.id] = analysis;
      }
      setSafetyAnalysis(analysisMap);

      // 3. Set default active route
      let selected = 'safest';
      setActiveRouteId(selected);

      // 4. Update corridor POIs & Nearest Safe Haven
      const activeData = analysisMap[selected];
      if (activeData) {
        setActivePois(activeData.allCorridorPois || []);
        const haven = findNearestSafeHaven(points[0].lat, points[0].lng, activeData.allCorridorPois);
        setNearestHaven(haven);
      }
    } catch (err) {
      console.error('Route calculation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, isNightMode]);

  // Initial load
  useEffect(() => {
    const initialPoints = [defaultPreset.start, ...(defaultPreset.waypoints || []), defaultPreset.destination];
    executeRouteCalculation(initialPoints, defaultPreset.destination, defaultPreset.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When active route is switched by user
  useEffect(() => {
    if (safetyAnalysis[activeRouteId]) {
      const activeData = safetyAnalysis[activeRouteId];
      setActivePois(activeData.allCorridorPois || []);
      const haven = findNearestSafeHaven(startPoint?.lat, startPoint?.lng, activeData.allCorridorPois);
      setNearestHaven(haven);
    }
  }, [activeRouteId, safetyAnalysis, startPoint]);

  // When a preset is selected
  const handleSelectPreset = async (preset) => {
    setActivePresetId(preset.id);
    setStartPoint(preset.start);
    setWaypoints(preset.waypoints || []);
    setDestination(preset.destination);

    const points = [preset.start, ...(preset.waypoints || []), preset.destination];
    await executeRouteCalculation(points, preset.destination, preset.id);
  };

  // Manual Trigger
  const handleManualCalculate = () => {
    const validPoints = [startPoint, ...waypoints.filter(w => w.lat && w.lng), destination];
    executeRouteCalculation(validPoints, destination, activePresetId);
  };

  // Toggle filter
  const handleToggleFilter = (key) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      if (routes.length > 0) {
        for (const r of routes) {
          analyzeRouteSafety(r, destination, updated, isNightMode).then(res => {
            setSafetyAnalysis(old => ({ ...old, [r.id]: res }));
          });
        }
      }
      return updated;
    });
  };

  const handleOpenNearestHaven = () => {
    if (!nearestHaven && activePois.length > 0) {
      const haven = findNearestSafeHaven(startPoint?.lat || 28.6315, startPoint?.lng || 77.2167, activePois);
      setNearestHaven(haven);
    }
    setIsSafeHavenOpen(true);
  };

  const activeRoute = routes.find(r => r.id === activeRouteId) || routes[0];
  const activeAnalysis = safetyAnalysis[activeRouteId];

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Top Navigation & Status Bar */}
      <Navbar
        onOpenSos={() => setIsSosOpen(true)}
        onOpenHelpline={() => setIsHelplineOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenSafeHaven={handleOpenNearestHaven}
        isNightMode={isNightMode}
        setIsNightMode={setIsNightMode}
        activeRoute={activeRoute}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Route Planner & Safety Controls (5 Cols on Desktop) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col z-10">
          {/* Multi-Stop Route Planner */}
          <RoutePlanner
            startPoint={startPoint}
            setStartPoint={setStartPoint}
            waypoints={waypoints}
            setWaypoints={setWaypoints}
            destination={destination}
            setDestination={setDestination}
            onCalculateRoutes={handleManualCalculate}
            onSelectPreset={handleSelectPreset}
            isLoading={isLoading}
            routes={routes}
            activeRouteId={activeRouteId}
            setActiveRouteId={setActiveRouteId}
            safetyAnalysis={safetyAnalysis}
            activePresetId={activePresetId}
          />

          {/* Smart Safety Filters */}
          <SafetyFilters
            filters={filters}
            onToggleFilter={handleToggleFilter}
          />

          {/* Live Route & Destination Safety Analyzer Scorecard */}
          <SafetyScoreCard
            analysis={activeAnalysis}
            activeRoute={activeRoute}
            destination={destination}
          />
        </div>

        {/* Right Column: Full Interactive Leaflet Map (7 Cols on Desktop) */}
        <div className="lg:col-span-7 flex flex-col min-h-[500px] lg:min-h-[750px] relative z-0">
          <MapView
            startPoint={startPoint}
            waypoints={waypoints}
            destination={destination}
            routes={routes}
            activeRouteId={activeRouteId}
            onSelectRoute={(id) => setActiveRouteId(id)}
            corridorPois={activePois}
            nearestSafeHaven={nearestHaven}
            isNightMode={isNightMode}
          />
        </div>
      </main>

      {/* Modals & Overlays (Isolated in Portal/Top Layer at z-[99999]) */}
      <EmergencyHubModal
        isOpen={isHelplineOpen}
        onClose={() => setIsHelplineOpen(false)}
      />

      <SosAlertModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        currentCoords={startPoint}
        currentAddress={startPoint?.name}
      />

      <ShareTripModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        startPoint={startPoint}
        destination={destination}
        activeRoute={activeRoute}
        safetyScore={activeAnalysis?.safetyScore}
      />

      <SafeHavenDrawer
        isOpen={isSafeHavenOpen}
        onClose={() => setIsSafeHavenOpen(false)}
        haven={nearestHaven}
      />
    </div>
  );
}
