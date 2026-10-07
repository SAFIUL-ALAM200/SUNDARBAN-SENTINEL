/**
 * Sundarbans Sentinel - Time Machine Component
 * 
 * Interactive satellite historical scrubber spanning 2000 to 2026.
 * Features:
 * - Slider scrubbing
 * - Play/Pause animation
 * - Key landmark events (Sidr 2007, Aila 2009, Amphan 2020, Remal 2024)
 * - "WHAT CHANGED?" differential analysis against the 2000 baseline
 * - Year comparison toggle
 */

import React, { useState, useEffect } from 'react';
import { TIMELINE_MILESTONES } from '../../services/nasaDataProvider';
import { Play, Pause, RotateCcw, Clock, ArrowRight, Sparkles, AlertCircle, Split } from 'lucide-react';

interface TimeMachineProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  onOpenCompareYears: () => void;
}

export const TimeMachine: React.FC<TimeMachineProps> = ({
  currentYear,
  onYearChange,
  onOpenCompareYears
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const years = [2000, 2004, 2007, 2009, 2013, 2016, 2020, 2022, 2024, 2026];
  
  // Baseline (2000) data
  const baseline = TIMELINE_MILESTONES[0];
  const currentMilestone = TIMELINE_MILESTONES.find(m => m.year === currentYear) || TIMELINE_MILESTONES[TIMELINE_MILESTONES.length - 1];

  // Auto-play interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        const currentIndex = years.indexOf(currentYear);
        const nextIndex = (currentIndex + 1) % years.length;
        onYearChange(years[nextIndex]);
      }, 2200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentYear]);

  // Differential calculations
  const vegDiff = Number((currentMilestone.ndviAverage - baseline.ndviAverage).toFixed(2));
  const vegDiffPercent = Number((((currentMilestone.ndviAverage - baseline.ndviAverage) / baseline.ndviAverage) * 100).toFixed(1));

  const waterDiff = currentMilestone.waterCoverageKm2 - baseline.waterCoverageKm2;
  const tempDiff = Number((currentMilestone.meanLstCelsius - baseline.meanLstCelsius).toFixed(1));
  const fireDiff = currentMilestone.fireHotspotCount - baseline.fireHotspotCount;

  return (
    <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-3.5 shadow-2xl backdrop-blur-md">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#50E3A4]/10 text-[#50E3A4] border border-[#50E3A4]/30">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#50E3A4]">
              Orbital Historical Replay
            </div>
            <h3 className="text-sm font-bold text-[#EAF7F2]">
              SUNDARBANS TIME MACHINE (2000 ─ 2026)
            </h3>
          </div>
        </div>

        {/* Playback Controls & Compare Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCompareYears}
            className="flex items-center gap-1.5 rounded-lg border border-[#1C3630] bg-[#112420] px-2.5 py-1 text-xs font-medium text-[#8FA7A0] hover:text-[#50E3A4] hover:border-[#50E3A4]/50 transition-colors"
            title="Side-by-side satellite image comparison"
          >
            <Split className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Compare 2 Years</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 rounded-lg bg-[#50E3A4] px-3 py-1 text-xs font-bold text-[#07110F] hover:bg-[#3ec48a] transition-all shadow-md shadow-[#50E3A4]/20"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Play History</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Timeline Scrubber */}
      <div className="relative my-4 px-2">
        {/* Track Line */}
        <div className="relative h-1.5 w-full rounded-full bg-[#112420]">
          {/* Active progress fill */}
          <div
            className="absolute h-full rounded-full bg-gradient-to-r from-[#50E3A4]/40 to-[#50E3A4] transition-all duration-300"
            style={{
              width: `${((currentYear - 2000) / (2026 - 2000)) * 100}%`
            }}
          />
        </div>

        {/* Milestone Tick Buttons */}
        <div className="relative flex justify-between mt-[-9px]">
          {years.map((y) => {
            const isSelected = currentYear === y;
            const milestone = TIMELINE_MILESTONES.find(m => m.year === y);
            const hasDisaster = y === 2007 || y === 2009 || y === 2020 || y === 2024;

            return (
              <div key={y} className="flex flex-col items-center">
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    onYearChange(y);
                  }}
                  className={`group relative flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    isSelected
                      ? 'scale-125 border-[#50E3A4] bg-[#50E3A4] shadow-[0_0_12px_rgba(80,227,164,0.6)]'
                      : hasDisaster
                      ? 'border-[#FF6B6B] bg-[#07110F] hover:scale-110'
                      : 'border-[#1C3630] bg-[#0D1B18] hover:border-[#50E3A4]'
                  }`}
                  title={`${y}: ${milestone?.notableEvent || ''}`}
                >
                  {isSelected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#07110F]" />
                  )}
                </button>

                <span className={`mt-2 font-mono text-[10px] transition-colors cursor-pointer ${
                  isSelected ? 'font-bold text-[#50E3A4]' : 'text-[#8FA7A0] hover:text-[#EAF7F2]'
                }`}
                onClick={() => {
                  setIsPlaying(false);
                  onYearChange(y);
                }}
                >
                  {y}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* "WHAT CHANGED?" Differential Panel */}
      <div className="mt-3 rounded-lg border border-[#1C3630] bg-[#07110F]/80 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1C3630]/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#50E3A4] uppercase">
              WHAT CHANGED ({currentYear} vs 2000 Baseline)?
            </span>
            <span className="text-[11px] text-[#8FA7A0] hidden sm:inline">
              · Multi-decadal satellite delta
            </span>
          </div>

          <div className="text-[11px] font-mono text-[#8FA7A0]">
            Active Satellite Feeds: <span className="text-[#EAF7F2]">{currentMilestone.satelliteCoverages.join(', ')}</span>
          </div>
        </div>

        {/* Change Indicators Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-2.5">
          {/* Vegetation Delta */}
          <div className="rounded-md border border-[#1C3630] bg-[#112420]/60 p-2">
            <div className="text-[10px] font-mono text-[#8FA7A0] uppercase flex items-center justify-between">
              <span>Vegetation (NDVI)</span>
              <span>🌿</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={`text-sm font-bold font-mono ${vegDiff < 0 ? 'text-[#FF6B6B]' : 'text-[#50E3A4]'}`}>
                {vegDiff > 0 ? '+' : ''}{vegDiff}
              </span>
              <span className="text-[10px] text-[#8FA7A0] font-mono">
                ({vegDiffPercent > 0 ? '+' : ''}{vegDiffPercent}%)
              </span>
            </div>
            <div className="text-[10px] text-[#8FA7A0] truncate mt-0.5">
              Current: {currentMilestone.ndviAverage} vs 0.74
            </div>
          </div>

          {/* Water Delta */}
          <div className="rounded-md border border-[#1C3630] bg-[#112420]/60 p-2">
            <div className="text-[10px] font-mono text-[#8FA7A0] uppercase flex items-center justify-between">
              <span>Water Extent</span>
              <span>💧</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={`text-sm font-bold font-mono ${waterDiff > 300 ? 'text-[#60A5FA]' : 'text-[#EAF7F2]'}`}>
                {waterDiff > 0 ? '+' : ''}{waterDiff} km²
              </span>
            </div>
            <div className="text-[10px] text-[#8FA7A0] truncate mt-0.5">
              Total: {currentMilestone.waterCoverageKm2} km²
            </div>
          </div>

          {/* Temperature Delta */}
          <div className="rounded-md border border-[#1C3630] bg-[#112420]/60 p-2">
            <div className="text-[10px] font-mono text-[#8FA7A0] uppercase flex items-center justify-between">
              <span>Surface Temp (LST)</span>
              <span>🌡️</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={`text-sm font-bold font-mono ${tempDiff > 1.5 ? 'text-[#FF6B6B]' : 'text-[#EAF7F2]'}`}>
                {tempDiff > 0 ? '+' : ''}{tempDiff}°C
              </span>
            </div>
            <div className="text-[10px] text-[#8FA7A0] truncate mt-0.5">
              Recorded: {currentMilestone.meanLstCelsius}°C
            </div>
          </div>

          {/* Fire Activity Delta */}
          <div className="rounded-md border border-[#1C3630] bg-[#112420]/60 p-2">
            <div className="text-[10px] font-mono text-[#8FA7A0] uppercase flex items-center justify-between">
              <span>FIRMS Hotspots</span>
              <span>🔥</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={`text-sm font-bold font-mono ${fireDiff > 3 ? 'text-[#FF6B6B]' : 'text-[#50E3A4]'}`}>
                {fireDiff > 0 ? '+' : ''}{fireDiff}
              </span>
              <span className="text-[10px] text-[#8FA7A0] font-mono">hotspots</span>
            </div>
            <div className="text-[10px] text-[#8FA7A0] truncate mt-0.5">
              Buffer zones: {currentMilestone.fireHotspotCount}
            </div>
          </div>
        </div>

        {/* Milestone Context Banner */}
        {currentMilestone.notableEvent && (
          <div className="mt-2.5 flex items-start gap-2 rounded-md bg-[#50E3A4]/5 border border-[#50E3A4]/20 p-2 text-xs text-[#EAF7F2]">
            <Sparkles className="h-4 w-4 text-[#50E3A4] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#50E3A4]">{currentMilestone.label}: </span>
              <span>{currentMilestone.notableEvent}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
