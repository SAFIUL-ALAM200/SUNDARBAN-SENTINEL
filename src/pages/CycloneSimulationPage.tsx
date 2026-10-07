/**
 * Sundarbans Sentinel - Cyclone & Disaster Impact Simulator
 * NASA Space Apps Challenge 2026: "Be An Earth System Trend Detective!"
 * 
 * CORE SCIENTIFIC POSITIONING:
 * "NASA observes. Sundarbans Sentinel detects. AI explains. Simulation explores."
 * 
 * IMPORTANT:
 * This is presented strictly as a SCENARIO SIMULATION / DECISION-SUPPORT TOOL,
 * NOT as a real cyclone prediction or official disaster-warning system.
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  CycloneSimulationEngine, 
  CycloneScenarioParams, 
  CycloneSimulationResult, 
  CycloneIntensityCategory, 
  CycloneTrackWaypoint, 
  GeoPoint, 
  HISTORICAL_CYCLONES, 
  PRESET_STORM_TRACKS,
  LANDFALL_LOCATIONS,
  HistoricalCycloneEvent,
  LandfallLocationOption
} from '../services/cycloneSimulationEngine';
import { MONITORING_ZONES } from '../data/sundarbansGeo';
import { Language, getTranslation } from '../services/i18n';
import { 
  Wind, 
  Waves, 
  AlertTriangle, 
  TreePine, 
  Play, 
  Pause, 
  RotateCcw, 
  Info, 
  Sliders, 
  History, 
  HelpCircle,
  Activity,
  Droplets,
  Thermometer,
  ShieldAlert,
  Printer,
  ChevronRight,
  ChevronLeft,
  Navigation,
  Sparkles,
  MapPin,
  CheckCircle2,
  Compass,
  FileText
} from 'lucide-react';

interface CycloneSimulationPageProps {
  language: Language;
  onOpenReport?: () => void;
}

export const CycloneSimulationPage: React.FC<CycloneSimulationPageProps> = ({ 
  language,
  onOpenReport 
}) => {
  // Navigation mode within Simulator: 'SIMULATOR' | 'HISTORICAL' | 'TREND_DETECTIVE'
  const [activeSimulatorTab, setActiveSimulatorTab] = useState<'SIMULATOR' | 'HISTORICAL' | 'TREND_DETECTIVE'>('SIMULATOR');

  // Core Scenario Inputs
  const [category, setCategory] = useState<CycloneIntensityCategory>('CAT_4');
  const [maxWindSpeed, setMaxWindSpeed] = useState<number>(215);
  const [stormSurge, setStormSurge] = useState<number>(4.5);
  const [rainfallMm, setRainfallMm] = useState<number>(280);
  const [forwardSpeed, setForwardSpeed] = useState<number>(22);
  const [simulationDuration, setSimulationDuration] = useState<number>(48);
  const [astronomicalTide, setAstronomicalTide] = useState<number>(1.4); // Spring High Tide bonus
  
  // Track Mode: 'PRESET' | 'LANDFALL_TARGET' | 'CUSTOM_DRAW'
  const [trackMode, setTrackMode] = useState<'PRESET' | 'LANDFALL_TARGET' | 'CUSTOM_DRAW'>('LANDFALL_TARGET');
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('track-east-sarankhola');
  const [selectedLandfallId, setSelectedLandfallId] = useState<string>('eastern-sarankhola');
  const [customPoints, setCustomPoints] = useState<GeoPoint[]>([]);

  // Simulation running status & calculation feedback
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [calculationFeedback, setCalculationFeedback] = useState<string | null>(null);

  // Selected Historical Event for comparison
  const [selectedHistoricalId, setSelectedHistoricalId] = useState<string>('sidr-2007');

  // Active Zone Highlight in Result
  const [inspectedZoneId, setInspectedZoneId] = useState<string>('eastern-sarankhola');

  // Timeline Animation State (0 to 4: T-24h, T-12h, T-6h, Landfall 0h, T+12h)
  const [timelineStep, setTimelineStep] = useState<number>(3); // 3 = Landfall Peak
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const animationTimer = useRef<NodeJS.Timeout | null>(null);

  // Basemap style: 'analytical' (dark vector grid) vs 'satellite' (spaceborne satellite texture)
  const [basemapStyle, setBasemapStyle] = useState<'analytical' | 'satellite'>('analytical');

  // Map Layer Visibility Toggles (10 Layers)
  const [mapLayers, setMapLayers] = useState({
    boundary: true,
    cycloneTrack: true,
    windSwath: true,
    stormSurge: true,
    lowElevation: true,
    waterNDWI: true,
    vegetationNDVI: false,
    temperatureLST: false,
    historicalTracks: false,
    currentAnomalies: true
  });

  // Cursor coords in draw mode
  const [hoverCoords, setHoverCoords] = useState<{ lng: number; lat: number } | null>(null);

  // Active track waypoints
  const activeWaypoints: CycloneTrackWaypoint[] = useMemo(() => {
    if (trackMode === 'CUSTOM_DRAW' && customPoints.length > 0) {
      return CycloneSimulationEngine.buildCustomTrack(customPoints, maxWindSpeed);
    }
    if (trackMode === 'LANDFALL_TARGET') {
      return CycloneSimulationEngine.generateTrackForLandfall(selectedLandfallId, maxWindSpeed);
    }
    const preset = PRESET_STORM_TRACKS.find(p => p.id === selectedCorridorId) || PRESET_STORM_TRACKS[0];
    return preset.waypoints;
  }, [trackMode, customPoints, selectedLandfallId, selectedCorridorId, maxWindSpeed]);

  // Landfall location label
  const landfallLocationLabel = useMemo(() => {
    if (trackMode === 'LANDFALL_TARGET') {
      const loc = LANDFALL_LOCATIONS.find(l => l.id === selectedLandfallId);
      return loc?.name || 'Selected Coastal Zone';
    }
    const pt = activeWaypoints.find(w => w.timestampOffsetHours === 0) || activeWaypoints[Math.min(3, activeWaypoints.length - 1)];
    return pt?.label || 'Sundarbans Coastline';
  }, [trackMode, selectedLandfallId, activeWaypoints]);

  // Execute Simulation Calculation
  const simulationResult: CycloneSimulationResult = useMemo(() => {
    const params: CycloneScenarioParams = {
      scenarioId: `scen-${Date.now()}`,
      scenarioName: `Hypothetical Scenario: ${maxWindSpeed} km/h · ${stormSurge}m Surge`,
      category,
      maxWindSpeedKmh: maxWindSpeed,
      stormSurgeMeters: stormSurge,
      rainfallMm,
      forwardSpeedKmh: forwardSpeed,
      simulationDurationHours: simulationDuration,
      landfallLocation: landfallLocationLabel,
      trackWaypoints: activeWaypoints,
      astronomicalTideBonusMeters: astronomicalTide
    };

    return CycloneSimulationEngine.simulateCyclone(params);
  }, [
    category,
    maxWindSpeed,
    stormSurge,
    rainfallMm,
    forwardSpeed,
    simulationDuration,
    landfallLocationLabel,
    activeWaypoints,
    astronomicalTide
  ]);

  // Historical Event comparison data
  const historicalComparison = useMemo(() => {
    return CycloneSimulationEngine.compareHistoricalEvent(simulationResult, selectedHistoricalId);
  }, [simulationResult, selectedHistoricalId]);

  // Timeline Animation Loop
  useEffect(() => {
    if (isPlaying) {
      animationTimer.current = setInterval(() => {
        setTimelineStep(prev => {
          if (prev >= activeWaypoints.length - 1) {
            setIsPlaying(false);
            return activeWaypoints.length - 1;
          }
          return prev + 1;
        });
      }, 1600);
    } else {
      if (animationTimer.current) clearInterval(animationTimer.current);
    }
    return () => {
      if (animationTimer.current) clearInterval(animationTimer.current);
    };
  }, [isPlaying, activeWaypoints.length]);

  // Sync category with preset wind speeds
  const handleCategoryChange = (cat: CycloneIntensityCategory) => {
    setCategory(cat);
    if (cat === 'CAT_1') { setMaxWindSpeed(135); setStormSurge(2.2); setRainfallMm(180); }
    else if (cat === 'CAT_2') { setMaxWindSpeed(165); setStormSurge(2.9); setRainfallMm(220); }
    else if (cat === 'CAT_3') { setMaxWindSpeed(190); setStormSurge(3.8); setRainfallMm(260); }
    else if (cat === 'CAT_4') { setMaxWindSpeed(220); setStormSurge(4.6); setRainfallMm(310); }
    else if (cat === 'CAT_5') { setMaxWindSpeed(260); setStormSurge(5.6); setRainfallMm(380); }
    else if (cat === 'DEPRESSION') { setMaxWindSpeed(85); setStormSurge(1.2); setRainfallMm(120); }
  };

  // Run Simulation Scenario with calculation feedback & animation start
  const handleRunSimulation = () => {
    setIsCalculating(true);
    setCalculationFeedback(
      language === 'bn'
        ? 'হাইড্রোডাইনামিক মডেল ও উচ্চতা গ্রিড বিশ্লেষণ সম্পন্ন...'
        : 'Spatial impact model executed: coastal elevation & hydrodynamic grids computed.'
    );

    setTimeout(() => {
      setIsCalculating(false);
      setTimelineStep(0);
      setIsPlaying(true);
    }, 450);
  };

  // Reset to Baseline
  const handleReset = () => {
    setCategory('CAT_4');
    setMaxWindSpeed(215);
    setStormSurge(4.5);
    setRainfallMm(280);
    setForwardSpeed(22);
    setSimulationDuration(48);
    setAstronomicalTide(1.4);
    setTrackMode('LANDFALL_TARGET');
    setSelectedLandfallId('eastern-sarankhola');
    setSelectedCorridorId('track-east-sarankhola');
    setCustomPoints([]);
    setTimelineStep(3);
    setIsPlaying(false);
    setCalculationFeedback(null);
  };

  // Coordinate Projection Helpers
  // In the SVG:
  // Lng bounds: 87.5 to 90.5 (span = 3.0)
  // Lat bounds: 19.5 to 23.0 (span = 3.5)
  // svgX = ((lng - 87.5) / 3.0) * 100
  // svgY = 95 - ((lat - 19.5) / 3.5) * 80
  const getSvgCoords = (lng: number, lat: number) => {
    const x = ((lng - 87.5) / 3.0) * 100;
    const y = 95 - ((lat - 19.5) / 3.5) * 80;
    return { x, y };
  };

  // Precise Map Click Handler in Custom Draw Mode
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (trackMode !== 'CUSTOM_DRAW') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const relX = Math.max(0, Math.min(1, clickX / rect.width));
    const relY = Math.max(0, Math.min(1, clickY / rect.height));

    const svgX = relX * 100;
    const svgY = relY * 100;

    // Exact inverse mapping
    const lng = Number((87.5 + (svgX / 100) * 3.0).toFixed(2));
    const lat = Number((19.5 + ((95 - svgY) / 80) * 3.5).toFixed(2));

    setCustomPoints(prev => [...prev, { lng, lat }]);
  };

  const handleMapMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (trackMode !== 'CUSTOM_DRAW') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const relX = Math.max(0, Math.min(1, clickX / rect.width));
    const relY = Math.max(0, Math.min(1, clickY / rect.height));
    const svgX = relX * 100;
    const svgY = relY * 100;
    const lng = Number((87.5 + (svgX / 100) * 3.0).toFixed(2));
    const lat = Number((19.5 + ((95 - svgY) / 80) * 3.5).toFixed(2));
    setHoverCoords({ lng, lat });
  };

  // Print Report Handler
  const handlePrint = () => {
    window.print();
  };

  // Current active step waypoint coordinates for dynamic layers
  const currentStepPoint = activeWaypoints[Math.min(timelineStep, activeWaypoints.length - 1)] || activeWaypoints[0];
  const eyeCoords = getSvgCoords(currentStepPoint.lng, currentStepPoint.lat);

  // Dynamic surge coordinates (follows eye during approach, anchors to landfall on coast)
  const isOverLand = currentStepPoint.lat >= 21.8;
  const surgeCenterY = isOverLand ? eyeCoords.y : Math.min(92, eyeCoords.y + 4);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07110F] text-[#EAF7F2] p-3 sm:p-5 lg:p-7 print:bg-white print:text-black print:p-2">
      <div className="mx-auto max-w-7xl space-y-5">
        
        {/* ==================================================================== */}
        {/* 1. TOP HEADER & SCIENTIFIC POSITIONING BANNER */}
        {/* ==================================================================== */}
        <div className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-5 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:border-none print:shadow-none print:p-0">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="flex items-center gap-1.5 rounded-md bg-[#FF6B6B]/20 border border-[#FF6B6B]/50 px-2.5 py-0.5 text-[#FF6B6B] font-bold uppercase tracking-wider">
                <Wind className="h-3.5 w-3.5" />
                <span>{language === 'bn' ? 'দৃশ্যকল্প সিমুলেটর' : 'SCENARIO SIMULATOR'}</span>
              </span>

              {/* Data tags distinguishing reality vs simulation */}
              <span className="rounded bg-[#50E3A4]/15 border border-[#50E3A4]/30 px-2 py-0.5 text-[#50E3A4] text-[10px] font-bold">
                {language === 'bn' ? 'লাইভ নাসা ডেটা সংযুক্ত' : 'LIVE NASA DATA'}
              </span>
              <span className="rounded bg-[#60A5FA]/15 border border-[#60A5FA]/30 px-2 py-0.5 text-[#60A5FA] text-[10px]">
                {language === 'bn' ? 'ঐতিহাসিক আর্কাইভ' : 'HISTORICAL SATELLITE ARCHIVE'}
              </span>
              <span className="rounded bg-[#F5C451]/15 border border-[#F5C451]/40 px-2 py-0.5 text-[#F5C451] text-[10px] font-bold">
                {language === 'bn' ? 'সিমুলেশন মডেল' : 'SIMULATION SCENARIO'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-mono text-[#EAF7F2] print:text-black">
              {language === 'bn' ? 'ঘূর্ণিঝড় ও দুর্যোগ প্রভাব সিমুলেটর' : 'Cyclone & Disaster Impact Simulator'}
            </h1>

            {/* NASA Space Apps Positioning USP */}
            <p className="text-xs text-[#8FA7A0] font-sans print:text-gray-700">
              <strong className="text-[#50E3A4]">
                {language === 'bn' 
                  ? 'নাসা পর্যবেক্ষণ করে। সুন্দরবন সেন্টিনেল শনাক্ত করে। এআই ব্যাখ্যা করে। সিমুলেশন অন্বেষণ করে।' 
                  : 'NASA observes. Sundarbans Sentinel detects. AI explains. Simulation explores.'}
              </strong>{' '}
              {language === 'bn'
                ? 'হাইড্রোডাইনামিক ও উচ্চতা তথ্যের ভিত্তিতে কাল্পনিক দুর্যোগ দৃশ্যকল্প অন্বেষণ করুন।'
                : 'Decision-support exploratory tool using explicit geospatial elevation & hydrodynamic model assumptions.'}
            </p>
          </div>

          {/* Action & Mode Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto print:hidden">
            <div className="flex items-center gap-1 bg-[#07110F] border border-[#1C3630] p-1 rounded-xl text-xs font-mono">
              <button
                onClick={() => setActiveSimulatorTab('SIMULATOR')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeSimulatorTab === 'SIMULATOR'
                    ? 'bg-[#50E3A4] text-[#07110F] font-bold shadow-md'
                    : 'text-[#8FA7A0] hover:text-[#EAF7F2]'
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>{language === 'bn' ? 'সিমুলেটর' : 'Simulator'}</span>
              </button>

              <button
                onClick={() => setActiveSimulatorTab('HISTORICAL')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeSimulatorTab === 'HISTORICAL'
                    ? 'bg-[#50E3A4] text-[#07110F] font-bold shadow-md'
                    : 'text-[#8FA7A0] hover:text-[#EAF7F2]'
                }`}
              >
                <History className="h-3.5 w-3.5" />
                <span>{language === 'bn' ? 'ঐতিহাসিক ঘটনা' : 'Historical Events'}</span>
              </button>

              <button
                onClick={() => setActiveSimulatorTab('TREND_DETECTIVE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeSimulatorTab === 'TREND_DETECTIVE'
                    ? 'bg-[#50E3A4] text-[#07110F] font-bold shadow-md'
                    : 'text-[#8FA7A0] hover:text-[#EAF7F2]'
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                <span>{language === 'bn' ? 'ট্রেন্ড ডিটেকটিভ' : 'Trend Detective'}</span>
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#1C3630] bg-[#112420] text-xs font-mono text-[#50E3A4] hover:border-[#50E3A4] transition-all shadow-md"
              title="Print scenario summary or save as PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>{language === 'bn' ? 'প্রিন্ট / PDF সংরক্ষণ' : 'Print / Save PDF'}</span>
            </button>
          </div>
        </div>

        {/* MANDATORY SCIENTIFIC DISCLAIMER NOTICE */}
        <div className="rounded-xl border border-[#F5C451]/30 bg-[#F5C451]/10 px-4 py-2.5 text-xs font-mono text-[#EAF7F2] flex items-start gap-3 print:border-gray-300 print:text-black">
          <HelpCircle className="h-4 w-4 text-[#F5C451] shrink-0 mt-0.5 print:text-gray-800" />
          <div className="leading-relaxed">
            <span className="text-[#F5C451] font-bold uppercase tracking-wider print:text-gray-900">
              {language === 'bn' ? 'বৈজ্ঞানিক সিদ্ধান্ত-সহায়তা বিজ্ঞপ্তি: ' : 'SCIENTIFIC DECISION-SUPPORT NOTICE: '}
            </span>
            {language === 'bn'
              ? 'এই সিমুলেটরটি গবেষণা ও শিক্ষামূলক উদ্দেশ্যে কাল্পনিক দৃশ্যকল্পের অনুমিত হিসাব প্রদান করে। এটি বাস্তব ঘূর্ণিঝড় সৃষ্টি, ভূমি স্পর্শ, জলোচ্ছ্বাস বা ক্ষয়ক্ষতির পূর্বাভাস দেয় না এবং কোনো সরকারি সতর্কীকরণ ব্যবস্থা নয়। ফলাফলসমূহ সরলীকৃত মডেল অনুসিদ্ধান্তের ওপর নির্ভরশীল।'
              : 'This simulator provides experimental scenario estimates for research and educational purposes. It does not predict cyclone formation, landfall, storm surge, flooding, or actual damage, and it is not an official early-warning system. Results depend on simplified model assumptions and available data.'}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* VIEW 1: SCENARIO SIMULATOR (CONTROLS + INTERACTIVE MAP + RESULTS) */}
        {/* ==================================================================== */}
        {activeSimulatorTab === 'SIMULATOR' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* LEFT: SIMULATION CONTROLS PANEL (5 cols) */}
            <div className="lg:col-span-5 space-y-4 print:hidden">
              <div className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#1C3630] pb-2">
                  <h2 className="text-xs font-mono font-bold text-[#50E3A4] uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="h-4 w-4" />
                    <span>{language === 'bn' ? 'সিমুলেশন কন্ট্রোল প্যানেল' : 'CYCLONE SIMULATOR CONTROLS'}</span>
                  </h2>
                  <span className="text-[10px] font-mono text-[#8FA7A0]">
                    {language === 'bn' ? 'স্পষ্ট গাণিতিক সমীকরণ' : 'Deterministic Model'}
                  </span>
                </div>

                {/* 1. Intensity Category Selector */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#8FA7A0]">{language === 'bn' ? 'তীব্রতা বিভাগ:' : 'Cyclone Intensity:'}</span>
                    <span className="text-[#50E3A4] font-bold">{category}</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {(['DEPRESSION', 'CAT_1', 'CAT_2', 'CAT_3', 'CAT_4', 'CAT_5'] as CycloneIntensityCategory[]).map(c => (
                      <button
                        key={c}
                        onClick={() => handleCategoryChange(c)}
                        className={`py-1.5 text-center text-xs font-mono rounded border transition-all ${
                          category === c
                            ? 'border-[#50E3A4] bg-[#50E3A4] text-[#07110F] font-bold shadow-md'
                            : 'border-[#1C3630] bg-[#112420] text-[#8FA7A0] hover:text-[#EAF7F2]'
                        }`}
                      >
                        {c === 'DEPRESSION' ? 'DEPR' : c.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Maximum Wind Speed Slider */}
                <div className="bg-[#112420]/70 p-3 rounded-xl border border-[#1C3630]">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-[#8FA7A0] flex items-center gap-1.5">
                      <Wind className="h-3.5 w-3.5 text-[#50E3A4]" />
                      <span>{language === 'bn' ? 'সর্বোচ্চ বাতাসের গতিবেগ:' : 'Maximum Wind Speed:'}</span>
                    </span>
                    <span className="text-base font-bold text-[#50E3A4] font-mono">{maxWindSpeed} km/h</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="280"
                    step="5"
                    value={maxWindSpeed}
                    onChange={(e) => {
                      setMaxWindSpeed(parseInt(e.target.value, 10));
                      setCategory('CUSTOM');
                    }}
                    className="w-full h-2 bg-[#1C3630] rounded-lg appearance-none cursor-pointer accent-[#50E3A4]"
                  />
                  <div className="flex justify-between text-[10px] text-[#8FA7A0] font-mono mt-1">
                    <span>60 km/h</span>
                    <span>120 km/h (Cat 1)</span>
                    <span className="text-[#F5C451]">215 km/h (Sidr)</span>
                    <span className="text-[#FF6B6B]">260 km/h (Amphan)</span>
                  </div>
                </div>

                {/* 3. Storm Surge Level Slider */}
                <div className="bg-[#112420]/70 p-3 rounded-xl border border-[#1C3630]">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-[#8FA7A0] flex items-center gap-1.5">
                      <Waves className="h-3.5 w-3.5 text-[#60A5FA]" />
                      <span>{language === 'bn' ? 'জলোচ্ছ্বাসের উচ্চতা:' : 'Storm Surge Height:'}</span>
                    </span>
                    <span className="text-base font-bold text-[#60A5FA] font-mono">+{stormSurge.toFixed(1)} m</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="7.0"
                    step="0.1"
                    value={stormSurge}
                    onChange={(e) => setStormSurge(parseFloat(e.target.value))}
                    className="w-full h-2 bg-[#1C3630] rounded-lg appearance-none cursor-pointer accent-[#60A5FA]"
                  />
                  <div className="flex justify-between text-[10px] text-[#8FA7A0] font-mono mt-1">
                    <span>0.5m</span>
                    <span>2.5m</span>
                    <span className="text-[#F5C451]">4.5m (Sidr)</span>
                    <span className="text-[#FF6B6B]">7.0m (Extreme)</span>
                  </div>
                </div>

                {/* 4. Rainfall & Duration (Dual Row) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#112420]/70 p-2.5 rounded-xl border border-[#1C3630]">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-[#8FA7A0]">{language === 'bn' ? 'বৃষ্টিপাত:' : 'Rainfall:'}</span>
                      <span className="text-[#60A5FA] font-bold">{rainfallMm} mm</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="500"
                      step="10"
                      value={rainfallMm}
                      onChange={(e) => setRainfallMm(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-[#1C3630] rounded-lg appearance-none cursor-pointer accent-[#60A5FA]"
                    />
                    <div className="text-[10px] text-[#8FA7A0] font-mono mt-0.5">Cumulative 48h Runoff</div>
                  </div>

                  <div className="bg-[#112420]/70 p-2.5 rounded-xl border border-[#1C3630]">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-[#8FA7A0]">{language === 'bn' ? 'সময়কাল:' : 'Duration:'}</span>
                      <span className="text-[#EAF7F2] font-bold">{simulationDuration}h</span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      {[24, 48, 72].map(hrs => (
                        <button
                          key={hrs}
                          onClick={() => setSimulationDuration(hrs)}
                          className={`flex-1 py-1 text-center text-xs font-mono rounded border transition-all ${
                            simulationDuration === hrs
                              ? 'border-[#50E3A4] bg-[#50E3A4] text-[#07110F] font-bold'
                              : 'border-[#1C3630] bg-[#07110F] text-[#8FA7A0]'
                          }`}
                        >
                          {hrs}h
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. Landfall Location & Storm Track Selector */}
                <div className="space-y-2.5 bg-[#112420]/70 p-3 rounded-xl border border-[#1C3630]">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#8FA7A0] font-bold">{language === 'bn' ? 'ল্যান্ডফল ও পথ নির্বাচন:' : 'Landfall & Storm Track:'}</span>
                    <div className="flex gap-1 text-[11px]">
                      <button
                        onClick={() => setTrackMode('LANDFALL_TARGET')}
                        className={`px-2 py-0.5 rounded border ${
                          trackMode === 'LANDFALL_TARGET'
                            ? 'border-[#50E3A4] bg-[#50E3A4]/20 text-[#50E3A4] font-bold'
                            : 'border-[#1C3630] text-[#8FA7A0]'
                        }`}
                      >
                        {language === 'bn' ? 'উপকূল জোন' : 'Landfall Zone'}
                      </button>
                      <button
                        onClick={() => setTrackMode('PRESET')}
                        className={`px-2 py-0.5 rounded border ${
                          trackMode === 'PRESET'
                            ? 'border-[#50E3A4] bg-[#50E3A4]/20 text-[#50E3A4] font-bold'
                            : 'border-[#1C3630] text-[#8FA7A0]'
                        }`}
                      >
                        {language === 'bn' ? 'করিডোর' : 'Corridor'}
                      </button>
                      <button
                        onClick={() => setTrackMode('CUSTOM_DRAW')}
                        className={`px-2 py-0.5 rounded border ${
                          trackMode === 'CUSTOM_DRAW'
                            ? 'border-[#FF6B6B] bg-[#FF6B6B]/20 text-[#FF6B6B] font-bold'
                            : 'border-[#1C3630] text-[#8FA7A0]'
                        }`}
                      >
                        {language === 'bn' ? '✏️ মানচিত্রে আঁকুন' : '✏️ Draw Track'}
                      </button>
                    </div>
                  </div>

                  {trackMode === 'LANDFALL_TARGET' && (
                    <div className="space-y-1.5">
                      <select
                        value={selectedLandfallId}
                        onChange={(e) => setSelectedLandfallId(e.target.value)}
                        className="w-full rounded-lg border border-[#1C3630] bg-[#07110F] px-3 py-2 text-xs font-mono text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
                      >
                        {LANDFALL_LOCATIONS.map(loc => (
                          <option key={loc.id} value={loc.id}>
                            {language === 'bn' ? loc.bengaliName : loc.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-[#8FA7A0]">
                        {LANDFALL_LOCATIONS.find(l => l.id === selectedLandfallId)?.description}
                      </p>
                    </div>
                  )}

                  {trackMode === 'PRESET' && (
                    <div className="space-y-1.5">
                      <select
                        value={selectedCorridorId}
                        onChange={(e) => setSelectedCorridorId(e.target.value)}
                        className="w-full rounded-lg border border-[#1C3630] bg-[#07110F] px-3 py-2 text-xs font-mono text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
                      >
                        {PRESET_STORM_TRACKS.map(tr => (
                          <option key={tr.id} value={tr.id}>{tr.name}</option>
                        ))}
                      </select>
                      <p className="text-[11px] text-[#8FA7A0]">
                        {PRESET_STORM_TRACKS.find(t => t.id === selectedCorridorId)?.corridor}
                      </p>
                    </div>
                  )}

                  {trackMode === 'CUSTOM_DRAW' && (
                    <div className="p-2.5 rounded-lg border border-[#FF6B6B]/40 bg-[#FF6B6B]/10 text-xs font-mono space-y-1.5">
                      <div className="text-[#FF6B6B] font-bold flex items-center justify-between">
                        <span>{language === 'bn' ? 'ইন্টারেক্টিভ ড্রয়িং মোড সক্রিয়:' : 'INTERACTIVE DRAW MODE ACTIVE:'}</span>
                        <span>{customPoints.length} {language === 'bn' ? 'পয়েন্ট' : 'points'}</span>
                      </div>
                      <p className="text-[11px] text-[#8FA7A0]">
                        {language === 'bn'
                          ? 'বঙ্গোপসাগর (দক্ষিণ) থেকে সুন্দরবন উপকূলের দিকে ক্লিক করে আপনার পছন্দের ট্র্যাক তৈরি করুন।'
                          : 'Click anywhere on the map from Bay of Bengal (south) northward toward land to place waypoints.'}
                      </p>
                      {hoverCoords && (
                        <div className="text-[10px] text-[#50E3A4]">
                          Cursor: {hoverCoords.lng}°E, {hoverCoords.lat}°N
                        </div>
                      )}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setCustomPoints([])}
                          className="text-[10px] text-[#FF6B6B] underline"
                        >
                          {language === 'bn' ? 'পয়েন্ট মুছুন' : 'Clear Points'}
                        </button>
                        <button
                          onClick={() => setTrackMode('LANDFALL_TARGET')}
                          className="text-[10px] text-[#50E3A4] bg-[#50E3A4]/20 border border-[#50E3A4]/40 px-2 py-0.5 rounded"
                        >
                          {language === 'bn' ? 'ড্রয়িং সম্পন্ন করুন' : 'Finish Drawing'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Calculation progress banner */}
                {calculationFeedback && (
                  <div className="rounded-xl border border-[#50E3A4]/40 bg-[#50E3A4]/15 px-3 py-2 text-xs font-mono text-[#50E3A4] flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{calculationFeedback}</span>
                  </div>
                )}

                {/* 6. Buttons: RUN SIMULATION, RESET, COMPARE WITH HISTORY */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1C3630]">
                  <button
                    onClick={handleRunSimulation}
                    disabled={isCalculating}
                    className="flex-1 rounded-xl bg-[#50E3A4] py-3 px-4 text-xs font-bold font-mono text-[#07110F] hover:bg-[#3ec48a] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#50E3A4]/20 active:scale-95 disabled:opacity-50"
                  >
                    {isCalculating ? (
                      <div className="h-4 w-4 border-2 border-[#07110F] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 fill-current" />
                    )}
                    <span>{language === 'bn' ? 'সিমুলেশন চালান (RUN SCENARIO)' : 'RUN SIMULATION'}</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="rounded-xl border border-[#1C3630] bg-[#112420] p-3 text-xs font-mono text-[#8FA7A0] hover:text-[#EAF7F2] transition-colors"
                    title="Reset to Baseline"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setActiveSimulatorTab('TREND_DETECTIVE')}
                    className="rounded-xl border border-[#1C3630] bg-[#112420] px-3 py-3 text-xs font-mono text-[#60A5FA] hover:border-[#60A5FA] transition-colors flex items-center gap-1.5"
                    title="Compare scenario with historical events"
                  >
                    <History className="h-4 w-4" />
                    <span>{language === 'bn' ? 'ইতিহাস তুলনা' : 'COMPARE WITH HISTORY'}</span>
                  </button>
                </div>
              </div>

              {/* ESTIMATED EXPOSURE RESULT CARD */}
              <div className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#1C3630] pb-2">
                  <h3 className="text-xs font-mono font-bold text-[#50E3A4] uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    <span>{language === 'bn' ? 'সিমুলেশন ফলাফল' : 'SIMULATION RESULT'}</span>
                  </h3>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    simulationResult.overallRiskLevel === 'EXTREME' ? 'border-[#FF6B6B]/40 bg-[#FF6B6B]/20 text-[#FF6B6B]' :
                    simulationResult.overallRiskLevel === 'HIGH' ? 'border-[#F5C451]/40 bg-[#F5C451]/20 text-[#F5C451]' :
                    'border-[#50E3A4]/40 bg-[#50E3A4]/20 text-[#50E3A4]'
                  }`}>
                    {simulationResult.overallRiskLevel} RISK
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                  <div className="bg-[#112420] p-2.5 rounded-xl border border-[#1C3630]">
                    <div className="text-[10px] text-[#8FA7A0] uppercase">
                      {language === 'bn' ? 'প্রভাবিত এলাকা' : 'Estimated Impact Area'}
                    </div>
                    <div className="text-lg font-bold text-[#FF6B6B] mt-0.5">{simulationResult.totalExposedAreaKm2} km²</div>
                    <div className="text-[9px] text-[#8FA7A0]">~{Math.round((simulationResult.totalExposedAreaKm2 / 6017) * 100)}% of Delta</div>
                  </div>

                  <div className="bg-[#112420] p-2.5 rounded-xl border border-[#1C3630]">
                    <div className="text-[10px] text-[#8FA7A0] uppercase">
                      {language === 'bn' ? 'প্লাবিত এলাকা' : 'Estimated Flood Exposure'}
                    </div>
                    <div className="text-lg font-bold text-[#60A5FA] mt-0.5">{simulationResult.floodExposure.totalFloodedAreaKm2} km²</div>
                    <div className="text-[9px] text-[#8FA7A0]">Avg Depth: {simulationResult.floodExposure.floodDepthAverageMeters}m</div>
                  </div>

                  <div className="bg-[#112420] p-2.5 rounded-xl border border-[#1C3630]">
                    <div className="text-[10px] text-[#8FA7A0] uppercase">
                      {language === 'bn' ? 'নিচু এলাকা (<৩মি)' : 'Low-Elevation (<3m)'}
                    </div>
                    <div className="text-lg font-bold text-[#F5C451] mt-0.5">{simulationResult.floodExposure.lowElevationFloodedAreaKm2} km²</div>
                    <div className="text-[9px] text-[#8FA7A0]">High Surge Inrush</div>
                  </div>

                  <div className="bg-[#112420] p-2.5 rounded-xl border border-[#1C3630]">
                    <div className="text-[10px] text-[#8FA7A0] uppercase">
                      {language === 'bn' ? 'উদ্ভিদ উন্মোচন' : 'Vegetation Exposure'}
                    </div>
                    <div className="text-lg font-bold text-[#50E3A4] mt-0.5">{simulationResult.vegetationExposure.exposedCanopyAreaKm2} km²</div>
                    <div className="text-[9px] text-[#8FA7A0]">{simulationResult.vegetationExposure.exposedPercentOfForest}% of Forest Canopy</div>
                  </div>

                  <div className="bg-[#112420] p-2.5 rounded-xl border border-[#1C3630]">
                    <div className="text-[10px] text-[#8FA7A0] uppercase">
                      {language === 'bn' ? 'পানি সম্প্রসারণ' : 'Water Expansion'}
                    </div>
                    <div className="text-lg font-bold text-[#60A5FA] mt-0.5">+{simulationResult.waterExpansion.expansionPercent}%</div>
                    <div className="text-[9px] text-[#8FA7A0]">+{simulationResult.waterExpansion.expandedSurfaceWaterKm2} km² surface</div>
                  </div>

                  <div className="bg-[#112420] p-2.5 rounded-xl border border-[#1C3630]">
                    <div className="text-[10px] text-[#8FA7A0] uppercase">
                      {language === 'bn' ? 'ক্ষতিগ্রস্ত অঞ্চল' : 'Monitoring Zones Affected'}
                    </div>
                    <div className="text-lg font-bold text-[#EAF7F2] mt-0.5">{simulationResult.affectedMonitoringZoneIds.length} of 5</div>
                    <div className="text-[9px] text-[#8FA7A0]">Monitoring Sectors</div>
                  </div>
                </div>

                {/* Mathematical "WHY?" Explanation */}
                <div className="rounded-xl border border-[#1C3630] bg-[#07110F] p-3 text-xs font-mono space-y-1">
                  <div className="text-[#50E3A4] font-bold flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5" />
                    <span>WHY? (DETERMINISTIC MODEL EXPLANATION)</span>
                  </div>
                  <p className="text-[#8FA7A0] text-[11px] leading-relaxed font-sans">
                    {simulationResult.explanation.geospatialWhy}
                  </p>
                </div>

                {/* AI Explanation Card (Clear, Non-Hallucinatory) */}
                <div className="rounded-xl border border-[#60A5FA]/30 bg-[#60A5FA]/10 p-3 text-xs font-mono space-y-1">
                  <div className="text-[#60A5FA] font-bold flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>AI SCENARIO EXPLANATION:</span>
                  </div>
                  <p className="text-[#EAF7F2] text-[11px] leading-relaxed font-sans">
                    "Under this simulated scenario, the selected cyclone track overlaps several low-elevation areas of the Sundarbans ({landfallLocationLabel}). The model estimates increased inundation exposure in these zones. This is a scenario-based estimate, not a prediction of an actual future cyclone."
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: INTERACTIVE MAP & ANIMATED LAYERS (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* INTERACTIVE GEOSPATIAL MAP CANVAS */}
              <div className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-5 shadow-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1C3630] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#50E3A4] animate-ping" />
                    <h3 className="text-xs font-mono font-bold text-[#50E3A4] uppercase tracking-wider">
                      {language === 'bn' ? 'ইন্টারেক্টিভ দুর্যোগ সিমুলেশন মানচিত্র' : 'Interactive Disaster Simulation Map'}
                    </h3>
                  </div>

                  {/* Basemap toggle & play buttons */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <button
                      onClick={() => setBasemapStyle(prev => prev === 'analytical' ? 'satellite' : 'analytical')}
                      className="px-2 py-1 rounded bg-[#112420] border border-[#1C3630] text-[#50E3A4] hover:border-[#50E3A4] text-[10px]"
                    >
                      {basemapStyle === 'analytical' ? '🛰️ Satellite Basemap' : '🌑 Matrix GIS'}
                    </button>

                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#112420] border border-[#1C3630] text-[#50E3A4] hover:border-[#50E3A4]"
                    >
                      {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                      <span>{isPlaying ? 'Pause' : 'Play Track'}</span>
                    </button>
                    <span className="text-[#8FA7A0] text-[11px]">Step {timelineStep + 1}/{activeWaypoints.length}</span>
                  </div>
                </div>

                {/* MAP LAYER TOGGLE BUTTONS (10 Layers) */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono border-b border-[#1C3630] pb-2.5">
                  <span className="text-[#8FA7A0] font-bold">LAYERS:</span>
                  {[
                    { key: 'boundary', label: '1. Boundary' },
                    { key: 'cycloneTrack', label: '2. Track' },
                    { key: 'windSwath', label: '3. Wind Swath' },
                    { key: 'stormSurge', label: '4. Storm Surge' },
                    { key: 'lowElevation', label: '5. Low Elevation' },
                    { key: 'waterNDWI', label: '6. Water (NDWI)' },
                    { key: 'vegetationNDVI', label: '7. Vegetation (NDVI)' },
                    { key: 'temperatureLST', label: '8. Thermal (LST)' },
                    { key: 'historicalTracks', label: '9. Historical Tracks' },
                    { key: 'currentAnomalies', label: '10. Anomalies' }
                  ].map(layer => (
                    <button
                      key={layer.key}
                      onClick={() => setMapLayers(prev => ({ ...prev, [layer.key]: !prev[layer.key as keyof typeof prev] }))}
                      className={`px-2 py-0.5 rounded border transition-all ${
                        mapLayers[layer.key as keyof typeof mapLayers]
                          ? 'border-[#50E3A4] bg-[#50E3A4]/15 text-[#50E3A4] font-bold'
                          : 'border-[#1C3630] bg-[#112420] text-[#8FA7A0]'
                      }`}
                    >
                      {layer.label}
                    </button>
                  ))}
                </div>

                {/* THE MAP CANVAS (Interactive SVG GIS Projection) */}
                <div className="relative w-full h-[380px] sm:h-[440px] rounded-xl border border-[#1C3630] bg-[#07110F] overflow-hidden select-none">
                  <svg 
                    className={`w-full h-full ${trackMode === 'CUSTOM_DRAW' ? 'cursor-crosshair' : 'cursor-default'}`} 
                    viewBox="0 0 100 100" 
                    preserveAspectRatio="none"
                    onClick={handleMapClick}
                    onMouseMove={handleMapMouseMove}
                  >
                    {/* Basemap Textures */}
                    {basemapStyle === 'analytical' ? (
                      <>
                        <rect x="0" y="0" width="100" height="100" fill="#07110F" />
                        <rect x="0" y="55" width="100" height="45" fill="#09181F" />
                      </>
                    ) : (
                      <>
                        {/* Simulated high-resolution spaceborne imagery composite */}
                        <rect x="0" y="0" width="100" height="100" fill="#0D221D" />
                        <rect x="0" y="55" width="100" height="45" fill="#041219" />
                      </>
                    )}

                    {/* Graticule Grid */}
                    <line x1="0" y1="20" x2="100" y2="20" stroke="#1C3630" strokeWidth="0.25" strokeDasharray="1,2" />
                    <line x1="0" y1="40" x2="100" y2="40" stroke="#1C3630" strokeWidth="0.25" strokeDasharray="1,2" />
                    <line x1="0" y1="60" x2="100" y2="60" stroke="#1C3630" strokeWidth="0.25" strokeDasharray="1,2" />
                    <line x1="0" y1="80" x2="100" y2="80" stroke="#1C3630" strokeWidth="0.25" strokeDasharray="1,2" />
                    <line x1="20" y1="0" x2="20" y2="100" stroke="#1C3630" strokeWidth="0.25" strokeDasharray="1,2" />
                    <line x1="40" y1="0" x2="40" y2="100" stroke="#1C3630" strokeWidth="0.25" strokeDasharray="1,2" />
                    <line x1="60" y1="0" x2="60" y2="100" stroke="#1C3630" strokeWidth="0.25" strokeDasharray="1,2" />
                    <line x1="80" y1="0" x2="80" y2="100" stroke="#1C3630" strokeWidth="0.25" strokeDasharray="1,2" />

                    {/* LAYER 1: Sundarbans UNESCO Boundary & Forest Landmass */}
                    {mapLayers.boundary && (
                      <path
                        d="M 5 54 Q 22 47 38 49 T 72 44 Q 88 47 95 53 L 95 14 Q 72 8 48 10 Q 20 8 5 14 Z"
                        fill="#0D2D23"
                        stroke="#50E3A4"
                        strokeWidth="0.6"
                        strokeDasharray="2,1"
                      />
                    )}

                    {/* LAYER 7: Dense Vegetation (NDVI Canopy) */}
                    {mapLayers.vegetationNDVI && (
                      <path
                        d="M 8 50 Q 25 45 42 47 T 72 42 Q 88 45 92 50 L 92 18 Q 70 12 45 13 Q 20 12 8 18 Z"
                        fill="#154B3A"
                        opacity={0.65}
                      />
                    )}

                    {/* LAYER 6: River Channels (Passur, Sibsa, Baleswar, Malancha, Raimangal) */}
                    {mapLayers.waterNDWI && (
                      <g>
                        <path d="M 22 14 Q 24 35 22 54" stroke="#60A5FA" strokeWidth="1.6" fill="none" opacity="0.8" />
                        <path d="M 45 10 Q 48 30 46 52" stroke="#60A5FA" strokeWidth="2.0" fill="none" opacity="0.8" />
                        <path d="M 68 11 Q 70 29 72 48" stroke="#60A5FA" strokeWidth="1.8" fill="none" opacity="0.8" />
                        <path d="M 85 13 Q 86 31 88 50" stroke="#60A5FA" strokeWidth="2.2" fill="none" opacity="0.8" />
                      </g>
                    )}

                    {/* LAYER 8: Temperature (LST Thermal Gradient) */}
                    {mapLayers.temperatureLST && (
                      <ellipse cx="50" cy="30" rx="35" ry="18" fill="url(#thermalAnomalyGradient)" opacity="0.45" />
                    )}

                    {/* LAYER 5: Low Elevation Zones (< 3m MSL) */}
                    {mapLayers.lowElevation && (
                      <path
                        d="M 8 52 Q 25 46 42 49 T 75 43 Q 88 46 93 52 L 93 36 Q 70 30 45 32 Q 20 30 8 36 Z"
                        fill="#F5C451"
                        opacity={0.3}
                        stroke="#F5C451"
                        strokeWidth="0.4"
                      />
                    )}

                    {/* LAYER 4: Dynamic Storm Surge Inundation Swath (Follows storm & landfall) */}
                    {mapLayers.stormSurge && (
                      <ellipse
                        cx={eyeCoords.x}
                        cy={surgeCenterY}
                        rx={Math.min(48, stormSurge * 7.5)}
                        ry={Math.min(32, stormSurge * 4.8)}
                        fill="url(#surgeInundationGradient)"
                        opacity={0.82}
                      />
                    )}

                    {/* Gradient Definitions */}
                    <defs>
                      <radialGradient id="surgeInundationGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.85" />
                        <stop offset="45%" stopColor="#F5C451" stopOpacity="0.55" />
                        <stop offset="85%" stopColor="#60A5FA" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.0" />
                      </radialGradient>
                      <radialGradient id="cycloneEyeGlowEffect" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FF6B6B" stopOpacity="1" />
                        <stop offset="40%" stopColor="#F5C451" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#50E3A4" stopOpacity="0" />
                      </radialGradient>
                      <radialGradient id="thermalAnomalyGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* LAYER 9: Historical Cyclone Tracks (Sidr, Aila, Amphan) */}
                    {mapLayers.historicalTracks && (
                      <g opacity="0.65">
                        {/* Sidr 2007 (East) */}
                        <path d="M 48 95 Q 65 70 82 43" stroke="#F5C451" strokeWidth="0.8" strokeDasharray="1,1" fill="none" />
                        <text x="83" y="40" fontSize="2.5" fill="#F5C451" fontFamily="monospace">Sidr 2007</text>
                        {/* Amphan 2020 (West) */}
                        <path d="M 35 95 Q 28 68 22 42" stroke="#60A5FA" strokeWidth="0.8" strokeDasharray="1,1" fill="none" />
                        <text x="18" y="40" fontSize="2.5" fill="#60A5FA" fontFamily="monospace">Amphan 2020</text>
                        {/* Aila 2009 (Central) */}
                        <path d="M 40 95 Q 46 68 49 43" stroke="#50E3A4" strokeWidth="0.8" strokeDasharray="1,1" fill="none" />
                        <text x="50" y="40" fontSize="2.5" fill="#50E3A4" fontFamily="monospace">Aila 2009</text>
                      </g>
                    )}

                    {/* LAYER 3: Wind Influence Radius (Swath Buffers centering on active eye) */}
                    {mapLayers.windSwath && (
                      <g>
                        {/* Hurricane Force Wind Radius (>118 km/h) */}
                        <circle
                          cx={eyeCoords.x}
                          cy={eyeCoords.y}
                          r={Math.max(10, simulationResult.impactZone.hurricaneWindRadiusKm * 0.32)}
                          fill="none"
                          stroke="#FF6B6B"
                          strokeWidth="0.6"
                          strokeDasharray="2,2"
                          opacity="0.85"
                        />
                        {/* Gale Force Radius (>62 km/h) */}
                        <circle
                          cx={eyeCoords.x}
                          cy={eyeCoords.y}
                          r={Math.max(18, simulationResult.impactZone.galeWindRadiusKm * 0.26)}
                          fill="none"
                          stroke="#F5C451"
                          strokeWidth="0.5"
                          strokeDasharray="1,2"
                          opacity="0.65"
                        />
                      </g>
                    )}

                    {/* LAYER 2: Current Cyclone Track & Animation Eye */}
                    {mapLayers.cycloneTrack && (
                      <g>
                        {/* Track Path Line */}
                        <polyline
                          points={activeWaypoints.map(w => {
                            const c = getSvgCoords(w.lng, w.lat);
                            return `${c.x},${c.y}`;
                          }).join(' ')}
                          stroke="#50E3A4"
                          strokeWidth="1.2"
                          strokeDasharray="2,2"
                          fill="none"
                        />

                        {/* Waypoints */}
                        {activeWaypoints.map((w, idx) => {
                          const c = getSvgCoords(w.lng, w.lat);
                          return (
                            <g key={idx}>
                              <circle cx={c.x} cy={c.y} r="1.4" fill="#50E3A4" stroke="#07110F" strokeWidth="0.4" />
                              <text x={c.x} y={c.y - 2.5} fontSize="2.4" fill="#8FA7A0" textAnchor="middle" fontFamily="monospace">
                                {w.label.split(' ')[0]}
                              </text>
                            </g>
                          );
                        })}

                        {/* Animated Eye Position according to timelineStep */}
                        <g transform={`translate(${eyeCoords.x}, ${eyeCoords.y})`}>
                          <circle r="12" fill="url(#cycloneEyeGlowEffect)" />
                          <circle r="6" fill="none" stroke="#F5C451" strokeWidth="0.6" strokeDasharray="1,1" />
                          <circle r="2.2" fill="#FF6B6B" stroke="#FFFFFF" strokeWidth="0.6" />
                          <text x="0" y="5.5" fontSize="3" fill="#FFFFFF" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
                            {currentStepPoint.windSpeedKmh} km/h
                          </text>
                        </g>
                      </g>
                    )}

                    {/* LAYER 10: Current Anomaly Zones & Monitoring Stations */}
                    {mapLayers.currentAnomalies && MONITORING_ZONES.map(z => {
                      const c = getSvgCoords(z.center[0], z.center[1]);
                      const isAffected = simulationResult.affectedMonitoringZoneIds.includes(z.id);

                      return (
                        <g 
                          key={z.id} 
                          className="cursor-pointer" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectedZoneId(z.id);
                          }}
                        >
                          <circle
                            cx={c.x}
                            cy={c.y}
                            r={inspectedZoneId === z.id ? 2.8 : 1.8}
                            fill={isAffected ? '#FF6B6B' : '#50E3A4'}
                            stroke="#07110F"
                            strokeWidth="0.5"
                          />
                          <text
                            x={c.x}
                            y={c.y - 3.5}
                            fontSize="2.6"
                            fill={isAffected ? '#FF6B6B' : '#EAF7F2'}
                            textAnchor="middle"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {z.name.split(' ')[0]}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* VISUAL RADAR HUD OVERLAY */}
                  <div className="absolute top-2.5 left-2.5 rounded-lg border border-[#1C3630] bg-[#07110F]/90 px-3 py-2 text-[10px] font-mono backdrop-blur-md shadow-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-[#50E3A4] font-bold">
                      <span className="h-2 w-2 rounded-full bg-[#50E3A4] animate-pulse" />
                      <span>SIMULATED SCENARIO RADAR: {category}</span>
                    </div>
                    <div className="text-[#8FA7A0]">
                      Track: <strong className="text-[#EAF7F2]">{landfallLocationLabel}</strong> · Winds: <strong className="text-[#FF6B6B]">{currentStepPoint.windSpeedKmh} km/h</strong>
                    </div>
                    <div className="text-[#8FA7A0]">
                      Peak Surge: <strong className="text-[#60A5FA]">+{simulationResult.floodExposure.peakSurgeLevelMeters}m</strong> · Rainfall: <strong className="text-[#60A5FA]">{rainfallMm}mm</strong>
                    </div>
                  </div>

                  {/* VISUAL STYLES LEGEND */}
                  <div className="absolute bottom-2.5 right-2.5 rounded-lg border border-[#1C3630] bg-[#07110F]/90 px-3 py-1.5 text-[9px] font-mono text-[#8FA7A0] backdrop-blur-md hidden sm:flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-[#50E3A4]" />
                      <span>NORMAL BASELINE</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-[#60A5FA]" />
                      <span>WATCH / WATER</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-[#F5C451]" />
                      <span>ANOMALY</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-[#FF6B6B]" />
                      <span>SIMULATED IMPACT</span>
                    </div>
                  </div>
                </div>

                {/* TIMELINE PROGRESS CONTROLS (T-24h to T+12h) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[#8FA7A0]">
                      Scenario Progression Timeline:{' '}
                      <strong className="text-[#50E3A4]">
                        {currentStepPoint.label} ({currentStepPoint.timestampOffsetHours >= 0 ? `+${currentStepPoint.timestampOffsetHours}h` : `${currentStepPoint.timestampOffsetHours}h`})
                      </strong>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setTimelineStep(prev => Math.max(0, prev - 1))}
                        disabled={timelineStep === 0}
                        className="p-1 rounded bg-[#112420] border border-[#1C3630] text-[#8FA7A0] hover:text-[#EAF7F2] disabled:opacity-40"
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setTimelineStep(prev => Math.min(activeWaypoints.length - 1, prev + 1))}
                        disabled={timelineStep >= activeWaypoints.length - 1}
                        className="p-1 rounded bg-[#112420] border border-[#1C3630] text-[#8FA7A0] hover:text-[#EAF7F2] disabled:opacity-40"
                      >
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5">
                    {activeWaypoints.map((wp, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setTimelineStep(idx);
                          setIsPlaying(false);
                        }}
                        className={`py-1.5 px-1 text-center rounded border transition-all text-xs font-mono ${
                          timelineStep === idx
                            ? 'border-[#50E3A4] bg-[#50E3A4] text-[#07110F] font-bold shadow-md'
                            : idx < timelineStep
                            ? 'border-[#1C3630] bg-[#112420] text-[#50E3A4]'
                            : 'border-[#1C3630] bg-[#07110F] text-[#8FA7A0] hover:text-[#EAF7F2]'
                        }`}
                      >
                        <div>{wp.label.split(' ')[0]}</div>
                        <div className="text-[9px] opacity-75">{wp.timestampOffsetHours > 0 ? `+${wp.timestampOffsetHours}h` : `${wp.timestampOffsetHours}h`}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* "WHAT COULD CHANGE?" - ENVIRONMENTAL INDICATORS PANEL */}
              <div className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#1C3630] pb-2">
                  <h3 className="text-xs font-mono font-bold text-[#50E3A4] uppercase tracking-wider flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span>What Could Change? (Environmental Indicator Shift)</span>
                  </h3>
                  <span className="text-[10px] font-mono text-[#8FA7A0]">NASA Trend Detective Mode</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {simulationResult.explanation.environmentalIndicatorChanges.map((ind, i) => (
                    <div key={i} className="rounded-xl border border-[#1C3630] bg-[#112420] p-3.5 space-y-1.5 text-xs font-mono">
                      <div className="font-bold text-[#EAF7F2] flex items-center justify-between">
                        <span>{ind.indicator}</span>
                      </div>
                      <div className="text-[11px] text-[#50E3A4]">{ind.baseline}</div>
                      <div className="text-[11px] text-[#FF6B6B] font-bold">{ind.simulatedShift}</div>
                      <p className="text-[10px] text-[#8FA7A0] font-sans pt-1 border-t border-[#1C3630]/60 leading-relaxed">
                        {ind.physicalMechanism}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SPECIES VULNERABILITY MATRIX */}
              <div className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-[#1C3630] pb-2">
                  <h3 className="text-xs font-mono font-bold text-[#50E3A4] uppercase tracking-wider flex items-center gap-2">
                    <TreePine className="h-4 w-4" />
                    <span>Mangrove Species Vulnerability (Sundri vs Gewa vs Goran)</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {simulationResult.vegetationExposure.mangroveSpeciesVulnerability.map(sp => (
                    <div key={sp.species} className="rounded-xl border border-[#1C3630] bg-[#112420] p-3 space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#EAF7F2]">{sp.bengaliName} ({sp.species.split(' ')[0]})</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                          sp.vulnerability === 'CRITICAL' ? 'border-[#FF6B6B]/40 bg-[#FF6B6B]/20 text-[#FF6B6B]' :
                          sp.vulnerability === 'HIGH' ? 'border-[#F5C451]/40 bg-[#F5C451]/20 text-[#F5C451]' :
                          'border-[#50E3A4]/40 bg-[#50E3A4]/20 text-[#50E3A4]'
                        }`}>
                          {sp.vulnerability}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#8FA7A0] leading-snug">{sp.dominantRisk}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 2: HISTORICAL CYCLONE EVENTS MODE */}
        {/* ==================================================================== */}
        {activeSimulatorTab === 'HISTORICAL' && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-5 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C3630] pb-3">
                <div>
                  <h2 className="text-sm font-bold font-mono text-[#50E3A4] uppercase tracking-wider flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <span>NASA Satellite-Observed Historical Cyclone Archive</span>
                  </h2>
                  <p className="text-xs text-[#8FA7A0] mt-0.5">
                    Empirical before-vs-after evidence of past major cyclones that struck the Sundarbans.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {HISTORICAL_CYCLONES.map(h => (
                    <button
                      key={h.id}
                      onClick={() => setSelectedHistoricalId(h.id)}
                      className={`px-3 py-1.5 rounded-lg border transition-all ${
                        selectedHistoricalId === h.id
                          ? 'border-[#50E3A4] bg-[#50E3A4] text-[#07110F] font-bold'
                          : 'border-[#1C3630] bg-[#112420] text-[#8FA7A0] hover:text-[#EAF7F2]'
                      }`}
                    >
                      {h.name.split(' (')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Historical Event Deep-Dive */}
              {(() => {
                const event = HISTORICAL_CYCLONES.find(h => h.id === selectedHistoricalId) || HISTORICAL_CYCLONES[0];

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="bg-[#112420] p-3 rounded-xl border border-[#1C3630]">
                        <div className="text-[10px] text-[#8FA7A0] uppercase">Category & Intensity</div>
                        <div className="text-base font-bold text-[#EAF7F2] mt-0.5">{event.category}</div>
                        <div className="text-[10px] text-[#50E3A4] mt-0.5">{event.maxWindsKmh} km/h sustained</div>
                      </div>

                      <div className="bg-[#112420] p-3 rounded-xl border border-[#1C3630]">
                        <div className="text-[10px] text-[#8FA7A0] uppercase">Observed Storm Surge</div>
                        <div className="text-base font-bold text-[#60A5FA] mt-0.5">+{event.stormSurgeMeters} meters</div>
                        <div className="text-[10px] text-[#8FA7A0] mt-0.5">Rainfall: {event.rainfallMm} mm</div>
                      </div>

                      <div className="bg-[#112420] p-3 rounded-xl border border-[#1C3630]">
                        <div className="text-[10px] text-[#8FA7A0] uppercase">Canopy Defoliation (NDVI)</div>
                        <div className="text-base font-bold text-[#FF6B6B] mt-0.5">{event.baselineNdvi} → {event.postEventNdvi}</div>
                        <div className="text-[10px] text-[#FF6B6B] mt-0.5">Delta: {(event.postEventNdvi - event.baselineNdvi).toFixed(2)}σ</div>
                      </div>

                      <div className="bg-[#112420] p-3 rounded-xl border border-[#1C3630]">
                        <div className="text-[10px] text-[#8FA7A0] uppercase">Recovery Trajectory</div>
                        <div className="text-base font-bold text-[#50E3A4] mt-0.5">{event.recoveryTimelineYears} years</div>
                        <div className="text-[10px] text-[#8FA7A0] mt-0.5">To Baseline Biomass</div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#1C3630] bg-[#07110F] p-4 text-xs font-mono space-y-2">
                      <div className="text-[#50E3A4] font-bold">NASA Sensor Observation Documentation:</div>
                      <p className="text-[#EAF7F2] text-xs font-sans leading-relaxed">
                        {event.nasaSensorObservation}
                      </p>
                      <div className="text-[#8FA7A0] text-xs font-sans pt-1 border-t border-[#1C3630]">
                        <strong>Ground Impact Report: </strong> {event.observedImpactSummary}
                      </div>
                    </div>

                    {/* Historical Comparison Narrative vs Current Simulation */}
                    <div className="rounded-xl border border-[#60A5FA]/40 bg-[#60A5FA]/10 p-4 text-xs font-mono space-y-1">
                      <div className="text-[#60A5FA] font-bold">COMPARISON WITH CURRENT SIMULATED SCENARIO:</div>
                      <p className="text-[#EAF7F2] leading-relaxed font-sans">
                        {historicalComparison.comparisonNarrative}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 3: TREND DETECTIVE 3-WAY COMPARISON MATRIX */}
        {/* ==================================================================== */}
        {activeSimulatorTab === 'TREND_DETECTIVE' && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-5 shadow-xl space-y-4">
              <div className="border-b border-[#1C3630] pb-3">
                <h2 className="text-sm font-bold font-mono text-[#50E3A4] uppercase tracking-wider flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>NASA Space Apps Challenge 2026: Be An Earth System Trend Detective!</span>
                </h2>
                <p className="text-xs text-[#8FA7A0] mt-0.5">
                  Three-way comparative matrix connecting baseline satellite trends, historical storm disturbance, and hypothetical scenario exploration.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border border-[#1C3630]">
                  <thead className="bg-[#07110F] text-[#8FA7A0] border-b border-[#1C3630]">
                    <tr>
                      <th className="py-2.5 px-3">Ecosystem Dimension</th>
                      <th className="py-2.5 px-3 text-[#50E3A4]">1. NORMAL BASELINE (2000-2026)</th>
                      <th className="py-2.5 px-3 text-[#F5C451]">2. HISTORICAL CYCLONE ({historicalComparison.historicalEvent.name.split(' (')[0]})</th>
                      <th className="py-2.5 px-3 text-[#FF6B6B]">3. SIMULATED SCENARIO ({maxWindSpeed} km/h)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C3630] text-xs">
                    <tr>
                      <td className="py-3 px-3 font-bold text-[#EAF7F2]">🌿 Vegetation Health (NDVI)</td>
                      <td className="py-3 px-3 text-[#50E3A4]">0.70 ± 0.04 (Dense Canopy)</td>
                      <td className="py-3 px-3 text-[#F5C451]">{historicalComparison.historicalEvent.postEventNdvi} (-{(0.70 - historicalComparison.historicalEvent.postEventNdvi).toFixed(2)})</td>
                      <td className="py-3 px-3 text-[#FF6B6B] font-bold">~{simulationResult.vegetationExposure.postScenarioEstimatedNdvi} ({simulationResult.vegetationExposure.estimatedNdviDelta})</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-[#EAF7F2]">💧 Surface Water Extent (NDWI)</td>
                      <td className="py-3 px-3 text-[#50E3A4]">1,850 km² (Normal Tides)</td>
                      <td className="py-3 px-3 text-[#F5C451]">{historicalComparison.historicalEvent.postEventWaterKm2} km² (+{Math.round(((historicalComparison.historicalEvent.postEventWaterKm2 - 1850) / 1850) * 100)}%)</td>
                      <td className="py-3 px-3 text-[#FF6B6B] font-bold">{simulationResult.waterExpansion.projectedWaterAreaKm2} km² (+{simulationResult.waterExpansion.expansionPercent}%)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-[#EAF7F2]">🌊 Storm Surge Height</td>
                      <td className="py-3 px-3 text-[#50E3A4]">0.0m (Tidal baseline)</td>
                      <td className="py-3 px-3 text-[#F5C451]">+{historicalComparison.historicalEvent.stormSurgeMeters}m observed</td>
                      <td className="py-3 px-3 text-[#FF6B6B] font-bold">+{simulationResult.floodExposure.peakSurgeLevelMeters}m modeled</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-[#EAF7F2]">🛡️ Inundated Forest Area</td>
                      <td className="py-3 px-3 text-[#50E3A4]">Intertidal fringing mudflats only</td>
                      <td className="py-3 px-3 text-[#F5C451]">{historicalComparison.historicalEvent.affectedAreaKm2} km²</td>
                      <td className="py-3 px-3 text-[#FF6B6B] font-bold">{simulationResult.floodExposure.totalFloodedAreaKm2} km²</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-bold text-[#EAF7F2]">⏳ Recovery Horizon</td>
                      <td className="py-3 px-3 text-[#50E3A4]">Steady state equilibrium</td>
                      <td className="py-3 px-3 text-[#F5C451]">{historicalComparison.historicalEvent.recoveryTimelineYears} years recorded</td>
                      <td className="py-3 px-3 text-[#FF6B6B] font-bold">~{Number((1.5 + (simulationResult.floodExposure.peakSurgeLevelMeters * 0.8) + (maxWindSpeed * 0.02)).toFixed(1))} years projected</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="rounded-xl border border-[#1C3630] bg-[#112420] p-4 text-xs font-mono text-[#8FA7A0] leading-relaxed">
                <span className="text-[#50E3A4] font-bold">Trend Detective Conclusion: </span>
                Satellite records demonstrate that the Sundarbans possesses exceptional biological resilience when tidal flushing is preserved. However, when storm surges coincide with astronomical spring tides and low upstream freshwater discharge, hypersalinity and prolonged water ponding represent the primary long-term mortality factors rather than physical wind felling alone.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
