/**
 * Sundarbans Sentinel - Compare Two Years Modal
 * 
 * Side-by-side comparative analysis between two historical satellite observation epochs.
 */

import React, { useState } from 'react';
import { TIMELINE_MILESTONES } from '../../services/nasaDataProvider';
import { X, Split, ArrowRight, ArrowDown, ArrowUp } from 'lucide-react';

interface CompareYearsModalProps {
  onClose: () => void;
}

export const CompareYearsModal: React.FC<CompareYearsModalProps> = ({ onClose }) => {
  const [yearA, setYearA] = useState<number>(2000);
  const [yearB, setYearB] = useState<number>(2026);

  const dataA = TIMELINE_MILESTONES.find(m => m.year === yearA) || TIMELINE_MILESTONES[0];
  const dataB = TIMELINE_MILESTONES.find(m => m.year === yearB) || TIMELINE_MILESTONES[TIMELINE_MILESTONES.length - 1];

  const vegDiff = Number((dataB.ndviAverage - dataA.ndviAverage).toFixed(2));
  const vegPercent = Number((((dataB.ndviAverage - dataA.ndviAverage) / dataA.ndviAverage) * 100).toFixed(1));

  const waterDiff = dataB.waterCoverageKm2 - dataA.waterCoverageKm2;
  const tempDiff = Number((dataB.meanLstCelsius - dataA.meanLstCelsius).toFixed(1));
  const fireDiff = dataB.fireHotspotCount - dataA.fireHotspotCount;

  const years = [2000, 2004, 2007, 2009, 2013, 2016, 2020, 2022, 2024, 2026];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07110F]/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#8FA7A0] hover:text-[#EAF7F2] hover:bg-[#112420] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[#50E3A4] uppercase tracking-wider mb-1">
          <Split className="h-4 w-4" />
          <span>Bi-Temporal Change Detection</span>
        </div>

        <h2 className="text-xl font-bold text-[#EAF7F2]">
          Compare Two Observation Epochs
        </h2>
        <p className="text-xs text-[#8FA7A0] mt-1">
          Inspect multi-sensor shift across major cyclonic landfalls, regeneration phases, and climate oscillations.
        </p>

        {/* Year Selectors */}
        <div className="grid grid-cols-2 gap-4 my-5 p-4 rounded-xl border border-[#1C3630] bg-[#07110F]">
          {/* Epoch A */}
          <div>
            <label className="block text-xs font-mono text-[#8FA7A0] uppercase mb-1.5">
              Reference Epoch (Year A)
            </label>
            <select
              value={yearA}
              onChange={(e) => setYearA(Number(e.target.value))}
              className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-sm font-mono font-bold text-[#50E3A4] focus:outline-none focus:border-[#50E3A4]"
            >
              {years.map(y => (
                <option key={y} value={y}>{y} {y === 2000 ? '(Baseline)' : y === 2007 ? '(Sidr)' : y === 2020 ? '(Amphan)' : ''}</option>
              ))}
            </select>
            <div className="text-[11px] text-[#8FA7A0] mt-2 italic">
              {dataA.notableEvent}
            </div>
          </div>

          {/* Epoch B */}
          <div>
            <label className="block text-xs font-mono text-[#8FA7A0] uppercase mb-1.5">
              Comparison Epoch (Year B)
            </label>
            <select
              value={yearB}
              onChange={(e) => setYearB(Number(e.target.value))}
              className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-sm font-mono font-bold text-[#60A5FA] focus:outline-none focus:border-[#60A5FA]"
            >
              {years.map(y => (
                <option key={y} value={y}>{y} {y === 2026 ? '(Current Sentinel)' : y === 2024 ? '(Remal)' : ''}</option>
              ))}
            </select>
            <div className="text-[11px] text-[#8FA7A0] mt-2 italic">
              {dataB.notableEvent}
            </div>
          </div>
        </div>

        {/* Change Comparison Grid */}
        <div className="space-y-3">
          {/* 1. Vegetation */}
          <div className="rounded-xl border border-[#1C3630] bg-[#07110F] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🌿</span>
              <div>
                <div className="text-xs font-bold text-[#EAF7F2]">VEGETATION CANOPY (NDVI)</div>
                <div className="text-[11px] text-[#8FA7A0] font-mono">
                  {yearA}: <strong className="text-[#50E3A4]">{dataA.ndviAverage}</strong> → {yearB}: <strong className="text-[#60A5FA]">{dataB.ndviAverage}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <span className={`text-sm font-bold flex items-center ${vegDiff < 0 ? 'text-[#FF6B6B]' : 'text-[#50E3A4]'}`}>
                {vegDiff < 0 ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
                {vegDiff > 0 ? '+' : ''}{vegDiff} ({vegPercent}%)
              </span>
              <span className="text-xs text-[#8FA7A0]">net shift</span>
            </div>
          </div>

          {/* 2. Water */}
          <div className="rounded-xl border border-[#1C3630] bg-[#07110F] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">💧</span>
              <div>
                <div className="text-xs font-bold text-[#EAF7F2]">WATER EXTENT (NDWI)</div>
                <div className="text-[11px] text-[#8FA7A0] font-mono">
                  {yearA}: <strong className="text-[#50E3A4]">{dataA.waterCoverageKm2} km²</strong> → {yearB}: <strong className="text-[#60A5FA]">{dataB.waterCoverageKm2} km²</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <span className="text-sm font-bold text-[#60A5FA]">
                {waterDiff > 0 ? '+' : ''}{waterDiff} km²
              </span>
              <span className="text-xs text-[#8FA7A0]">inundation delta</span>
            </div>
          </div>

          {/* 3. Thermal */}
          <div className="rounded-xl border border-[#1C3630] bg-[#07110F] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🌡️</span>
              <div>
                <div className="text-xs font-bold text-[#EAF7F2]">LAND SURFACE TEMPERATURE (LST)</div>
                <div className="text-[11px] text-[#8FA7A0] font-mono">
                  {yearA}: <strong className="text-[#50E3A4]">{dataA.meanLstCelsius}°C</strong> → {yearB}: <strong className="text-[#60A5FA]">{dataB.meanLstCelsius}°C</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <span className={`text-sm font-bold ${tempDiff > 1.0 ? 'text-[#FF6B6B]' : 'text-[#EAF7F2]'}`}>
                {tempDiff > 0 ? '+' : ''}{tempDiff}°C
              </span>
              <span className="text-xs text-[#8FA7A0]">thermal anomaly</span>
            </div>
          </div>

          {/* 4. Fire Hotspots */}
          <div className="rounded-xl border border-[#1C3630] bg-[#07110F] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🔥</span>
              <div>
                <div className="text-xs font-bold text-[#EAF7F2]">ACTIVE FIRMS HOTSPOTS</div>
                <div className="text-[11px] text-[#8FA7A0] font-mono">
                  {yearA}: <strong className="text-[#50E3A4]">{dataA.fireHotspotCount}</strong> → {yearB}: <strong className="text-[#60A5FA]">{dataB.fireHotspotCount}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <span className="text-sm font-bold text-[#8FA7A0]">
                {fireDiff > 0 ? '+' : ''}{fireDiff} hotspots
              </span>
              <span className="text-xs text-[#8FA7A0]">frequency</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#50E3A4] px-4 py-2 text-xs font-bold text-[#07110F] hover:bg-[#3ec48a] transition-colors"
          >
            Done Inspecting
          </button>
        </div>
      </div>
    </div>
  );
};
