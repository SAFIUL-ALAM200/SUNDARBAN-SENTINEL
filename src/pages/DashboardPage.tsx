/**
 * Sundarbans Sentinel - Main Monitoring Dashboard
 * 
 * Layout:
 * - Top: Zone Selector, Layer Selector, Date/Year selector
 * - Main Left: MapLibre GL Interactive Sundarbans Map
 * - Main Right: Ecosystem Summary (NDVI, NDWI, LST, FIRMS, Health Score)
 * - Bottom: Sundarbans Time Machine (2000 - 2026 historical slider)
 */

import React, { useState, useEffect } from 'react';
import { SundarbansMap } from '../components/map/SundarbansMap';
import { EcosystemSummary } from '../components/dashboard/EcosystemSummary';
import { TimeMachine } from '../components/dashboard/TimeMachine';
import { AnomalyModal } from '../components/dashboard/AnomalyModal';
import { CompareYearsModal } from '../components/dashboard/CompareYearsModal';
import { ZoneBuilderModal } from '../components/dashboard/ZoneBuilderModal';
import { MONITORING_ZONES } from '../data/sundarbansGeo';
import { defaultNASAProvider } from '../services/nasaDataProvider';
import type { IndicatorType, MonitoringZone, AnomalyEvent, FireHotspot } from '../types/index.ts';
import { ChevronDown, MapPin, Calendar, Layers, Split, AlertTriangle, Radio, Printer } from 'lucide-react';

interface DashboardPageProps {
  onOpenReport: () => void;
  onSelectTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onOpenReport, onSelectTab }) => {
  const [selectedZone, setSelectedZone] = useState<MonitoringZone>(MONITORING_ZONES[1]); // Default to Central Sundarbans
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [activeLayer, setActiveLayer] = useState<IndicatorType | 'satellite' | 'anomalies'>('satellite');
  
  // Modals state
  const [activeAnomalyModal, setActiveAnomalyModal] = useState<AnomalyEvent | null>(null);
  const [isCompareYearsOpen, setIsCompareYearsOpen] = useState<boolean>(false);
  const [isZoneBuilderOpen, setIsZoneBuilderOpen] = useState<boolean>(false);

  // Observations & Live Hotspots
  const observations = defaultNASAProvider.getZoneObservations(selectedZone.id, currentYear);
  const anomalies = defaultNASAProvider.getAnomalies();
  const [fireHotspots, setFireHotspots] = useState<FireHotspot[]>(defaultNASAProvider.getFireHotspots());
  const [isLiveNASAConnected, setIsLiveNASAConnected] = useState<boolean>(true);

  // Fetch live NASA FIRMS data on mount
  useEffect(() => {
    let isMounted = true;
    defaultNASAProvider.fetchLiveFIRMSHotspots().then((spots) => {
      if (isMounted && spots && spots.length > 0) {
        setFireHotspots(spots);
        setIsLiveNASAConnected(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectZone = (zone: MonitoringZone) => {
    setSelectedZone(zone);
  };

  const handleSelectAnomaly = (anomaly: AnomalyEvent) => {
    setActiveAnomalyModal(anomaly);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#07110F] text-[#EAF7F2] p-3 sm:p-4 lg:p-6 gap-4">
      {/* TOP CONTROLS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1C3630] bg-[#0D1B18] p-3 shadow-lg">
        {/* Left: Zone Dropdown Selector */}
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[#50E3A4]" />
          <div className="relative">
            <select
              value={selectedZone.id}
              onChange={(e) => {
                const z = MONITORING_ZONES.find(item => item.id === e.target.value);
                if (z) setSelectedZone(z);
              }}
              className="appearance-none rounded-lg border border-[#1C3630] bg-[#112420] py-1.5 pl-3 pr-8 text-xs font-mono font-bold text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4] cursor-pointer"
            >
              {MONITORING_ZONES.map(zone => (
                <option key={zone.id} value={zone.id}>
                  {zone.name} ({zone.areaKm2} km²)
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8FA7A0] pointer-events-none" />
          </div>
        </div>

        {/* Center: Observation Year & Data Mode */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#8FA7A0]">
            <Calendar className="h-3.5 w-3.5 text-[#50E3A4]" />
            <span>OBSERVATION WINDOW:</span>
            <span className="font-bold text-[#50E3A4]">{currentYear}</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <Radio className="h-3 w-3 text-[#50E3A4] animate-pulse" />
            <span className="text-[11px] text-[#50E3A4] font-semibold">
              LIVE NASA FIRMS ACTIVE
            </span>
            <span className="text-[10px] text-[#8FA7A0] font-mono hidden sm:inline">
              (fc431e...)
            </span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCompareYearsOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#1C3630] bg-[#112420] px-2.5 py-1.5 text-xs font-mono text-[#8FA7A0] hover:text-[#50E3A4] hover:border-[#50E3A4]/40 transition-colors"
          >
            <Split className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Compare 2 Years</span>
          </button>

          <button
            onClick={() => setIsZoneBuilderOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#1C3630] bg-[#112420] px-2.5 py-1.5 text-xs font-mono text-[#8FA7A0] hover:text-[#50E3A4] hover:border-[#50E3A4]/40 transition-colors"
          >
            <span>📐</span>
            <span className="hidden sm:inline">Zone Builder</span>
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 rounded-lg bg-[#50E3A4] px-3 py-1.5 text-xs font-mono font-bold text-[#07110F] hover:bg-[#3ec48a] transition-all shadow-md shadow-[#50E3A4]/20"
            title="Generate Environmental Report & Save PDF"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN SPLIT: MAP (LEFT) + ECOSYSTEM SUMMARY (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left: Interactive MapLibre GL Map (Takes 7 cols on desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-[520px] lg:h-[620px]">
          <SundarbansMap
            selectedZoneId={selectedZone.id}
            onSelectZone={handleSelectZone}
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
            anomalies={anomalies}
            fireHotspots={fireHotspots}
            onSelectAnomaly={handleSelectAnomaly}
            year={currentYear}
          />
        </div>

        {/* Right: Ecosystem Summary Panel (Takes 5 cols on desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-[520px] lg:h-[620px] overflow-hidden">
          <EcosystemSummary
            zone={selectedZone}
            observations={observations}
            anomalies={anomalies}
            onInspectAnomaly={handleSelectAnomaly}
            onOpenReport={onOpenReport}
            onOpenZoneBuilder={() => setIsZoneBuilderOpen(true)}
          />
        </div>
      </div>

      {/* BOTTOM: HISTORICAL TIME MACHINE SCRUBBER */}
      <div className="w-full">
        <TimeMachine
          currentYear={currentYear}
          onYearChange={setCurrentYear}
          onOpenCompareYears={() => setIsCompareYearsOpen(true)}
        />
      </div>

      {/* MODALS */}
      {activeAnomalyModal && (
        <AnomalyModal
          anomaly={activeAnomalyModal}
          onClose={() => setActiveAnomalyModal(null)}
          onOpenReport={onOpenReport}
        />
      )}

      {isCompareYearsOpen && (
        <CompareYearsModal
          onClose={() => setIsCompareYearsOpen(false)}
        />
      )}

      {isZoneBuilderOpen && (
        <ZoneBuilderModal
          onClose={() => setIsZoneBuilderOpen(false)}
        />
      )}
    </div>
  );
};
