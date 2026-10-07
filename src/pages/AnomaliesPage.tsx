/**
 * Sundarbans Sentinel - Environmental Anomalies Intelligence Center
 * 
 * Filterable feed of statistical deviations calculated from multi-sensor baselines.
 */

import React, { useState } from 'react';
import { defaultNASAProvider, HISTORICAL_ANOMALIES } from '../services/nasaDataProvider';
import type { AnomalyEvent, AnomalySeverity, IndicatorType } from '../types/index.ts';
import { getSeverityBadgeClass } from '../services/anomalyEngine';
import { AnomalyModal } from '../components/dashboard/AnomalyModal';
import { MONITORING_ZONES } from '../data/sundarbansGeo';
import { AlertTriangle, Filter, Search, ArrowRight, Eye, ShieldCheck } from 'lucide-react';

interface AnomaliesPageProps {
  onOpenReport: () => void;
  onNavigateToDashboard: () => void;
}

export const AnomaliesPage: React.FC<AnomaliesPageProps> = ({
  onOpenReport,
  onNavigateToDashboard
}) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [activeAnomaly, setActiveAnomaly] = useState<AnomalyEvent | null>(null);

  const allAnomalies = defaultNASAProvider.getAnomalies();

  const filtered = allAnomalies.filter((item) => {
    if (selectedIndicator !== 'all' && item.indicator !== selectedIndicator) return false;
    if (selectedSeverity !== 'all' && item.severity !== selectedSeverity) return false;
    if (selectedZone !== 'all' && item.zoneId !== selectedZone) return false;
    return true;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07110F] text-[#EAF7F2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C3630] pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#F5C451] uppercase tracking-wider mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span>Statistical Anomaly Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-[#EAF7F2]">
              Detected Environmental Anomalies
            </h1>
            <p className="text-xs sm:text-sm text-[#8FA7A0] mt-1">
              Statistical deviations (|z| ≥ 1.0σ) isolated from multi-decadal NASA Earth-observation records.
            </p>
          </div>

          <button
            onClick={onNavigateToDashboard}
            className="flex items-center gap-2 rounded-xl border border-[#1C3630] bg-[#0D1B18] px-4 py-2.5 text-xs font-mono text-[#50E3A4] hover:bg-[#112420] transition-colors self-start sm:self-auto"
          >
            <span>Open Spatial Map</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#1C3630] bg-[#0D1B18] p-4 mb-6 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8FA7A0]">
            <Filter className="h-3.5 w-3.5 text-[#50E3A4]" />
            <span>FILTERS:</span>
          </div>

          {/* Indicator filter */}
          <select
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
            className="rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-1.5 text-xs font-mono text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
          >
            <option value="all">All Indicators</option>
            <option value="vegetation">🌿 Vegetation (NDVI)</option>
            <option value="water">💧 Water Extent (NDWI)</option>
            <option value="temperature">🌡️ Temperature (LST)</option>
            <option value="fire">🔥 Fire Hotspots</option>
          </select>

          {/* Severity filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-1.5 text-xs font-mono text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
          >
            <option value="all">All Severities</option>
            <option value="STRONG_ANOMALY">Strong Anomaly (&gt;3σ)</option>
            <option value="ANOMALY">Anomaly (2–3σ)</option>
            <option value="WATCH">Watch (1–2σ)</option>
          </select>

          {/* Zone filter */}
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-1.5 text-xs font-mono text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
          >
            <option value="all">All Monitoring Zones</option>
            {MONITORING_ZONES.map(z => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>

          <span className="ml-auto text-xs font-mono text-[#8FA7A0]">
            Showing <strong className="text-[#50E3A4]">{filtered.length}</strong> flagged events
          </span>
        </div>

        {/* Anomalies List */}
        <div className="space-y-4">
          {filtered.map((anomaly) => {
            const isNegative = anomaly.zScore < 0;

            return (
              <div
                key={anomaly.id}
                className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-5 hover:border-[#50E3A4]/40 transition-all shadow-md group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadgeClass(anomaly.severity)}`}>
                        {anomaly.severity.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-mono text-[#50E3A4] font-semibold">
                        {anomaly.indicator.toUpperCase()} ANOMALY
                      </span>
                      <span className="text-xs font-mono text-[#8FA7A0]">·</span>
                      <span className="text-xs font-mono text-[#8FA7A0]">
                        {anomaly.timestamp}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#EAF7F2] mt-1">
                      {anomaly.title}
                    </h3>

                    <div className="text-xs text-[#8FA7A0] font-mono">
                      Zone: <strong className="text-[#EAF7F2]">{anomaly.zoneName}</strong> ({anomaly.coordinates[1]}°N, {anomaly.coordinates[0]}°E)
                    </div>
                  </div>

                  {/* Deviation metric */}
                  <div className="flex items-center gap-4">
                    <div className="text-right font-mono">
                      <div className="text-[10px] text-[#8FA7A0] uppercase">Baseline Deviation</div>
                      <div className={`text-xl font-bold ${
                        anomaly.severity === 'STRONG_ANOMALY' ? 'text-[#FF6B6B]' : 'text-[#F5C451]'
                      }`}>
                        {anomaly.zScore > 0 ? '+' : ''}{anomaly.zScore}σ
                      </div>
                      <div className="text-[10px] text-[#8FA7A0]">
                        {anomaly.observedValue} observed vs {anomaly.historicalBaseline} μ
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveAnomaly(anomaly)}
                      className="flex items-center gap-1.5 rounded-lg bg-[#50E3A4] px-4 py-2 text-xs font-bold text-[#07110F] hover:bg-[#3ec48a] transition-all shadow-md shadow-[#50E3A4]/10 shrink-0"
                    >
                      <Eye className="h-4 w-4" />
                      <span>VIEW EVIDENCE</span>
                    </button>
                  </div>
                </div>

                {/* Evidence preview chips */}
                <div className="mt-4 pt-3 border-t border-[#1C3630]/60 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                  {anomaly.evidence.slice(0, 3).map((e, idx) => (
                    <div key={idx} className="rounded-lg bg-[#07110F] p-2 border border-[#1C3630]">
                      <div className="text-[10px] text-[#8FA7A0]">{e.indicator}</div>
                      <div className="text-[#EAF7F2] font-semibold truncate">{e.description}</div>
                      <div className="text-[#50E3A4] text-[10px]">{e.deviation}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Scientific Transparency note */}
        <div className="mt-8 rounded-xl border border-[#1C3630] bg-[#07110F] p-4 text-xs text-[#8FA7A0] flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-[#50E3A4] shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-[#EAF7F2] mb-0.5 font-mono">
              SCIENTIFIC OBSERVATION RESPONSIBILITY PRINCIPLE
            </div>
            <p>
              Anomalies indicate numerical statistical outliers when satellite-derived metrics fall outside normal seasonal variations. They do not automatically establish environmental crimes or irreversible damage without verified forest ground surveys.
            </p>
          </div>
        </div>
      </div>

      {activeAnomaly && (
        <AnomalyModal
          anomaly={activeAnomaly}
          onClose={() => setActiveAnomaly(null)}
          onOpenReport={onOpenReport}
        />
      )}
    </div>
  );
};
