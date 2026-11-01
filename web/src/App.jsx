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
  // Initial default scenario (Delhi NCR Night Commute)
  const defaultPreset = CITY_PRESETS[0];

  const [startPoint, setStartPoint] = useState(defaultPreset.start);
  const [waypoints, setWaypoints] = useState(defaultPreset.waypoints);
  const [destination, setDestination] = useState(defaultPreset.destination);

  const [routes, setRoutes] = useState([]);
  const [activeRouteId, setActiveRouteId] = useState('safest');
  const [safetyAnalysis, setSafetyAnalysis] = useState({});
  const [activePois, setActivePois] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Safety filter toggles
  const [filters, setFilters] = useState({
    avoidLiquor: true,
    prioritizePoliceHospital: true,
    lowAccidentRisk: false,
    showSafeStopovers: true
  });

  const [isNightMode, setIsNightMode] = useState(true);

  // Modals & Panels
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isHelplineOpen, setIsHelplineOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSafeHavenOpen, setIsSafeHavenOpen] = useState(false);
  const [nearestHaven, setNearestHaven] = useState(null);

  // Calculate & Analyze Routes
  const handleCalculateRoutes = useCallback(async () => {
    if (!startPoint || !destination) return;

    setIsLoading(true);
    try {
      // 1. Gather all ordered points [start, ...waypoints, destination]
      const validPoints = [startPoint, ...waypoints.filter(w => w.lat && w.lng), destination];
      
      // 2. Fetch or interpolate routes
      const fetchedRoutes = await getRoutes(validPoints);
      setRoutes(fetchedRoutes);

      // 3. Run safety engine for each route option
      const analysisMap = {};
      for (const r of fetchedRoutes) {
        const analysis = await analyzeRouteSafety(r, destination, filters, isNightMode);
        analysisMap[r.id] = analysis;
      }
      setSafetyAnalysis(analysisMap);

      // 4. Select best route based on user filters
      let defaultSelected = 'safest';
      if (filters.avoidLiquor && analysisMap['safest']) {
        defaultSelected = 'safest';
      }
      setActiveRouteId(defaultSelected);

      // 5. Set active corridor POIs
      const activeAnalysis = analysisMap[defaultSelected];
      if (activeAnalysis) {
        setActivePois(activeAnalysis.allCorridorPois || []);
        // Determine nearest haven from start position
        const haven = findNearestSafeHaven(startPoint.lat, startPoint.lng, activeAnalysis.allCorridorPois);
        setNearestHaven(haven);
      }
    } catch (err) {
      console.error('Error generating routes:', err);
    } finally {
      setIsLoading(false);
    }
  }, [startPoint, waypoints, destination, filters, isNightMode]);

  // Initial mount route calculation
  useEffect(() => {
    handleCalculateRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When active route changes, update corridor POIs
  useEffect(() => {
    if (safetyAnalysis[activeRouteId]) {
      const activeData = safetyAnalysis[activeRouteId];
      setActivePois(activeData.allCorridorPois || []);
      const haven = findNearestSafeHaven(startPoint?.lat || 28.6315, startPoint?.lng || 77.2167, activeData.allCorridorPois);
      setNearestHaven(haven);
    }
  }, [activeRouteId, safetyAnalysis, startPoint]);

  // Toggle filter with immediate recalculation
  const handleToggleFilter = (key) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      // Recalculate analysis with updated filter
      if (routes.length > 0) {
        const updatedAnalysis = {};
        for (const r of routes) {
          analyzeRouteSafety(r, destination, updated, isNightMode).then(res => {
            setSafetyAnalysis(old => ({ ...old, [r.id]: res }));
          });
        }
      }
      return updated;
    });
  };

  // Open nearest haven
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
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
        <div className="lg:col-span-5 space-y-4 flex flex-col">
          {/* Route Planner Box */}
          <RoutePlanner
            startPoint={startPoint}
            setStartPoint={setStartPoint}
            waypoints={waypoints}
            setWaypoints={setWaypoints}
            destination={destination}
            setDestination={setDestination}
            onCalculateRoutes={handleCalculateRoutes}
            isLoading={isLoading}
            routes={routes}
            activeRouteId={activeRouteId}
            setActiveRouteId={setActiveRouteId}
            safetyAnalysis={safetyAnalysis}
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
        <div className="lg:col-span-7 flex flex-col min-h-[500px] lg:min-h-[750px] relative">
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

      {/* Modals & Emergency Overlays */}
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
