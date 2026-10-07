/**
 * Sundarbans Sentinel - Ecosystem Summary Dashboard Panel
 * 
 * Displays derived satellite indicators for the selected monitoring zone:
 * - Vegetation Health (NDVI)
 * - Surface Water Extent (NDWI)
 * - Thermal Stress (Land Surface Temperature LST)
 * - Fire Activity (NASA FIRMS 375m hotspots)
 * - Environmental Anomalies & Confidence ratings
 */

import React from 'react';
import type { MonitoringZone, ZoneObservations, AnomalyEvent } from '../../types/index.ts';
import { getSeverityBadgeClass } from '../../services/anomalyEngine';
import { ArrowDown, ArrowUp, Minus, AlertTriangle, Info, Satellite, CheckCircle2 } from 'lucide-react';

interface EcosystemSummaryProps {
  zone: MonitoringZone;
  observations: ZoneObservations;
  anomalies: AnomalyEvent[];
  onInspectAnomaly: (anomaly: AnomalyEvent) => void;
  onOpenReport: () => void;
  onOpenZoneBuilder: () => void;
}

export const EcosystemSummary: React.FC<EcosystemSummaryProps> = ({
  zone,
  observations,
  anomalies,
  onInspectAnomaly,
  onOpenReport,
  onOpenZoneBuilder
}) => {
  const { vegetation, water, temperature, fire, overallHealthScore } = observations;
  const zoneAnomalies = anomalies.filter(a => a.zoneId === zone.id);

  return (
    <div className="flex flex-col h-full gap-4 overflow-y-auto pr-1">
      {/* Zone Header Card */}
      <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-4 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-mono text-[#50E3A4] tracking-wider uppercase">
              Selected Monitoring Zone
            </div>
            <h2 className="text-lg font-bold text-[#EAF7F2] mt-0.5 leading-snug">
              {zone.name}
            </h2>
            <div className="text-xs text-[#8FA7A0] font-sans mt-0.5">
              {zone.bengaliName} · {zone.range}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-[10px] font-mono text-[#8FA7A0] uppercase">Total Area</div>
            <div className="text-sm font-mono font-semibold text-[#EAF7F2]">
              {zone.areaKm2.toLocaleString()} km²
            </div>
          </div>
        </div>

        <p className="text-xs text-[#8FA7A0] mt-2.5 leading-relaxed line-clamp-2">
          {zone.description}
        </p>

        {/* Overall Ecosystem Index Bar */}
        <div className="mt-3.5 pt-3 border-t border-[#1C3630]">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-[#8FA7A0]">COMPOSITE ECOSYSTEM INDEX</span>
            <span className={`font-bold ${
              overallHealthScore >= 75 ? 'text-[#50E3A4]' : overallHealthScore >= 50 ? 'text-[#F5C451]' : 'text-[#FF6B6B]'
            }`}>
              {overallHealthScore}/100
            </span>
          </div>
          <div className="w-full bg-[#112420] h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 rounded-full ${
                overallHealthScore >= 75 ? 'bg-[#50E3A4]' : overallHealthScore >= 50 ? 'bg-[#F5C451]' : 'bg-[#FF6B6B]'
              }`}
              style={{ width: `${overallHealthScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Environmental Indicators */}
      <div className="space-y-3">
        {/* 1. VEGETATION HEALTH */}
        <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-3.5 hover:border-[#50E3A4]/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🌿</span>
              <div>
                <div className="text-xs font-bold text-[#EAF7F2]">VEGETATION HEALTH (NDVI)</div>
                <div className="text-[10px] text-[#8FA7A0] font-mono">MODIS 250m / Landsat 9</div>
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadgeClass(vegetation.status)}`}>
              {vegetation.status.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 text-center border-y border-[#1C3630]/60 py-2">
            <div>
              <div className="text-[10px] text-[#8FA7A0] uppercase font-mono">Current</div>
              <div className="text-base font-bold font-mono text-[#EAF7F2]">{vegetation.currentValue}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#8FA7A0] uppercase font-mono">Baseline</div>
              <div className="text-base font-medium font-mono text-[#8FA7A0]">{vegetation.historicalBaseline}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#8FA7A0] uppercase font-mono">Change</div>
              <div className={`text-base font-bold font-mono flex items-center justify-center gap-0.5 ${
                vegetation.changePercent < 0 ? 'text-[#FF6B6B]' : 'text-[#50E3A4]'
              }`}>
                {vegetation.changePercent < 0 ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}
                {Math.abs(vegetation.changePercent)}%
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#8FA7A0] mt-2 font-mono">
            <span>z-score: {vegetation.zScore > 0 ? '+' : ''}{vegetation.zScore}σ</span>
            <span>Confidence: {vegetation.confidence}%</span>
          </div>
        </div>

        {/* 2. WATER EXTENT */}
        <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-3.5 hover:border-[#60A5FA]/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">💧</span>
              <div>
                <div className="text-xs font-bold text-[#EAF7F2]">SURFACE WATER EXTENT (NDWI)</div>
                <div className="text-[10px] text-[#8FA7A0] font-mono">Landsat 8-9 OLI / Sentinel-2</div>
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadgeClass(water.status)}`}>
              {water.status.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 text-center border-y border-[#1C3630]/60 py-2">
            <div>
              <div className="text-[10px] text-[#8FA7A0] uppercase font-mono">Current</div>
              <div className="text-base font-bold font-mono text-[#EAF7F2]">{water.currentValue} km²</div>
            </div>
            <div>
              <div className="text-[10px] text-[#8FA7A0] uppercase font-mono">Baseline</div>
              <div className="text-base font-medium font-mono text-[#8FA7A0]">{water.historicalBaseline} km²</div>
            </div>
            <div>
              <div className="text-[10px] text-[#8FA7A0] uppercase font-mono">Change</div>
              <div className={`text-base font-bold font-mono flex items-center justify-center gap-0.5 ${
                Math.abs(water.changePercent) > 10 ? 'text-[#F5C451]' : 'text-[#60A5FA]'
              }`}>
                {water.changePercent > 0 ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
                {Math.abs(water.changePercent)}%
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#8FA7A0] mt-2 font-mono">
            <span>z-score: {water.zScore > 0 ? '+' : ''}{water.zScore}σ</span>
            <span>Confidence: {water.confidence}%</span>
          </div>
        </div>

        {/* 3. THERMAL STRESS */}
        <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-3.5 hover:border-[#F5C451]/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🌡️</span>
              <div>
                <div className="text-xs font-bold text-[#EAF7F2]">LAND SURFACE TEMP (LST)</div>
                <div className="text-[10px] text-[#8FA7A0] font-mono">MODIS MOD11A2 1km Thermal</div>
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadgeClass(temperature.status)}`}>
              {temperature.status.replace('_', ' ')}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 text-center border-y border-[#1C3630]/60 py-2">
            <div>
              <div className="text-[10px] text-[#8FA7A0] uppercase font-mono">Current</div>
              <div className="text-base font-bold font-mono text-[#EAF7F2]">{temperature.currentValue}°C</div>
            </div>
            <div>
              <div className="text-[10px] text-[#8FA7A0] uppercase font-mono">Baseline</div>
              <div className="text-base font-medium font-mono text-[#8FA7A0]">{temperature.historicalBaseline}°C</div>
            </div>
            <div>
              <div className="text-[10px] text-[#8FA7A0] uppercase font-mono">Change</div>
              <div className={`text-base font-bold font-mono flex items-center justify-center gap-0.5 ${
                temperature.changePercent > 5 ? 'text-[#FF6B6B]' : 'text-[#8FA7A0]'
              }`}>
                {temperature.changePercent > 0 ? '+' : ''}{temperature.changePercent}%
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#8FA7A0] mt-2 font-mono">
            <span>z-score: {temperature.zScore > 0 ? '+' : ''}{temperature.zScore}σ</span>
            <span>Confidence: {temperature.confidence}%</span>
          </div>
        </div>

        {/* 4. FIRE ACTIVITY */}
        <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-3.5 hover:border-[#FF6B6B]/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🔥</span>
              <div>
                <div className="text-xs font-bold text-[#EAF7F2]">ACTIVE FIRE HOTSPOTS</div>
                <div className="text-[10px] text-[#8FA7A0] font-mono">NASA FIRMS VIIRS 375m NRT</div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#50E3A4]/40 bg-[#50E3A4]/10 text-[#50E3A4]">
              LOW ACTIVITY
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 text-center border-y border-[#1C3630]/60 py-2">
            <div>
              <div className="text-[10px] text-[#8FA7A0] uppercase font-mono">Detected</div>
              <div className="text-base font-bold font-mono text-[#EAF7F2]">{fire.currentValue}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#8FA7A0] uppercase font-mono">Baseline Avg</div>
              <div className="text-base font-medium font-mono text-[#8FA7A0]">{fire.historicalBaseline}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#8FA7A0] uppercase font-mono">Thermal State</div>
              <div className="text-xs font-semibold font-mono text-[#50E3A4] mt-0.5">NOMINAL</div>
            </div>
          </div>

          <div className="text-[10px] text-[#8FA7A0] mt-2 italic">
            *Satellite-detected thermal hotspots (agricultural buffer/fringes); not unverified ground wildfire.
          </div>
        </div>
      </div>

      {/* Detected Anomalies Card in Zone */}
      {zoneAnomalies.length > 0 ? (
        <div className="rounded-xl border border-[#F5C451]/30 bg-[#F5C451]/5 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F5C451]">
            <AlertTriangle className="h-4 w-4" />
            <span>ACTIVE ANOMALY DETECTED IN ZONE</span>
          </div>
          <p className="text-xs text-[#EAF7F2] mt-1.5 leading-snug">
            {zoneAnomalies[0].summary}
          </p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#F5C451]">
              Deviation: {zoneAnomalies[0].zScore}σ
            </span>
            <button
              onClick={() => onInspectAnomaly(zoneAnomalies[0])}
              className="text-xs font-semibold text-[#50E3A4] hover:underline flex items-center gap-1"
            >
              <span>Inspect Evidence</span>
              <span>→</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18]/50 p-3 flex items-center gap-2 text-xs text-[#8FA7A0]">
          <CheckCircle2 className="h-4 w-4 text-[#50E3A4]" />
          <span>No extreme statistical outliers detected in this immediate zone window.</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
        <button
          onClick={onOpenZoneBuilder}
          className="rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-xs font-medium text-[#EAF7F2] hover:bg-[#1C3630] hover:text-[#50E3A4] transition-colors flex items-center justify-center gap-1.5"
        >
          <span>📐</span>
          <span>Zone Builder</span>
        </button>
        <button
          onClick={onOpenReport}
          className="rounded-lg bg-[#50E3A4] px-3 py-2 text-xs font-bold text-[#07110F] hover:bg-[#3ec48a] transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-[#50E3A4]/15"
        >
          <span>📄</span>
          <span>Generate Report</span>
        </button>
      </div>
    </div>
  );
};
