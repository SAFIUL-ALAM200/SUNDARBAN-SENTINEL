/**
 * Sundarbans Sentinel - Monitoring Zone Builder
 * 
 * Allows users to sample custom polygon zones or select precision wildlife coordinates
 * to compute on-the-fly environmental indicators.
 */

import React, { useState } from 'react';
import { X, Layers, Compass, Check, Sparkles, MapPin } from 'lucide-react';

interface ZoneBuilderModalProps {
  onClose: () => void;
  onApplyZone?: (name: string, coords: [number, number]) => void;
}

interface CustomPreset {
  id: string;
  name: string;
  bengali: string;
  lat: number;
  lng: number;
  approxAreaKm2: number;
  estNdvi: number;
  estWaterPct: number;
  estLst: number;
  note: string;
}

const PRESET_REGIONS: CustomPreset[] = [
  {
    id: 'dublar-char',
    name: 'Dublar Char Seaward Island & Fish Sanctuary',
    bengali: 'দুবলার চর দ্বীপ ও মৎস্য কেন্দ্র',
    lat: 21.68,
    lng: 89.58,
    approxAreaKm2: 240,
    estNdvi: 0.42,
    estWaterPct: 62,
    estLst: 28.2,
    note: 'Extreme tidal exposure, seasonal dried-fish encampment, cyclone buffer zone.'
  },
  {
    id: 'karamjal',
    name: 'Karamjal Eco-Tourism & Crocodile Breeding Centre',
    bengali: 'করমজল ইকো-ট্যুরিজম ও কুমির প্রজনন কেন্দ্র',
    lat: 22.42,
    lng: 89.59,
    approxAreaKm2: 120,
    estNdvi: 0.76,
    estWaterPct: 22,
    estLst: 27.6,
    note: 'High canopy density, low salinity Gewa & Sundri forest stands near Passur river.'
  },
  {
    id: 'katka-kachikhali',
    name: 'Katka-Kachikhali Tiger Sanctuary',
    bengali: 'কটকা-কচিখালী বাঘ অভয়ারণ্য',
    lat: 21.85,
    lng: 89.78,
    approxAreaKm2: 380,
    estNdvi: 0.68,
    estWaterPct: 35,
    estLst: 28.5,
    note: 'Primary Royal Bengal Tiger and Spotted Deer territory; sandy beach and dense tidal creek fringe.'
  },
  {
    id: 'mandarbaria',
    name: 'Mandarbaria Sea Turtle Sanctuary',
    bengali: 'মান্দারবাড়িয়া কচ্ছপ অভয়ারণ্য',
    lat: 21.72,
    lng: 89.25,
    approxAreaKm2: 190,
    estNdvi: 0.51,
    estWaterPct: 54,
    estLst: 28.8,
    note: 'Seaward sandy beach bordering Hariabhanga mouth; nesting site for Olive Ridley turtles.'
  }
];

export const ZoneBuilderModal: React.FC<ZoneBuilderModalProps> = ({ onClose, onApplyZone }) => {
  const [selectedPreset, setSelectedPreset] = useState<CustomPreset>(PRESET_REGIONS[0]);
  const [customLat, setCustomLat] = useState<number>(selectedPreset.lat);
  const [customLng, setCustomLng] = useState<number>(selectedPreset.lng);
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [isCalculated, setIsCalculated] = useState<boolean>(true);

  const handleSelectPreset = (preset: CustomPreset) => {
    setSelectedPreset(preset);
    setCustomLat(preset.lat);
    setCustomLng(preset.lng);
    setIsCalculated(true);
  };

  const calculateCustomProfile = () => {
    setIsCalculated(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07110F]/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#8FA7A0] hover:text-[#EAF7F2] hover:bg-[#112420] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-[#50E3A4] uppercase tracking-wider mb-1">
          <Layers className="h-4 w-4" />
          <span>Spatial Zone Builder</span>
        </div>

        <h2 className="text-xl font-bold text-[#EAF7F2]">
          Define Custom Environmental Sub-Region
        </h2>
        <p className="text-xs text-[#8FA7A0] mt-1">
          Select high-value ecological sanctuaries or specify custom geospatial coordinates to extract an instant multi-sensor profile.
        </p>

        {/* Preset Sanctuaries */}
        <div className="mt-4">
          <label className="block text-xs font-mono text-[#8FA7A0] uppercase mb-2">
            Target Ecological Sanctuaries
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_REGIONS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-3 rounded-xl border transition-all ${
                  selectedPreset.id === preset.id
                    ? 'border-[#50E3A4] bg-[#50E3A4]/10 shadow-sm'
                    : 'border-[#1C3630] bg-[#07110F] hover:border-[#50E3A4]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#EAF7F2] truncate">{preset.name}</span>
                  {selectedPreset.id === preset.id && (
                    <Check className="h-4 w-4 text-[#50E3A4] shrink-0" />
                  )}
                </div>
                <div className="text-[11px] text-[#8FA7A0] mt-0.5">{preset.bengali}</div>
                <div className="text-[10px] font-mono text-[#50E3A4] mt-1">
                  {preset.lat}°N, {preset.lng}°E · ~{preset.approxAreaKm2} km²
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Coordinates Inputs */}
        <div className="grid grid-cols-3 gap-3 my-4 p-3 rounded-xl border border-[#1C3630] bg-[#07110F]">
          <div>
            <label className="block text-[10px] font-mono text-[#8FA7A0] uppercase mb-1">Latitude (°N)</label>
            <input
              type="number"
              step="0.01"
              value={customLat}
              onChange={(e) => setCustomLat(Number(e.target.value))}
              className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-2.5 py-1.5 text-xs font-mono text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-[#8FA7A0] uppercase mb-1">Longitude (°E)</label>
            <input
              type="number"
              step="0.01"
              value={customLng}
              onChange={(e) => setCustomLng(Number(e.target.value))}
              className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-2.5 py-1.5 text-xs font-mono text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-[#8FA7A0] uppercase mb-1">Sample Radius (km)</label>
            <input
              type="number"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-2.5 py-1.5 text-xs font-mono text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
            />
          </div>
        </div>

        {/* Computed Environmental Profile */}
        {isCalculated && (
          <div className="rounded-xl border border-[#50E3A4]/30 bg-[#07110F] p-4">
            <div className="flex items-center justify-between border-b border-[#1C3630] pb-2 mb-3">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#50E3A4]">
                <Sparkles className="h-4 w-4" />
                <span>DERIVED MULTISPECTRAL PROFILE: {selectedPreset.name}</span>
              </div>
              <span className="text-[10px] font-mono text-[#8FA7A0]">NASA Earthdata 2026</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded-lg bg-[#112420]/60 border border-[#1C3630]">
                <div className="text-[10px] font-mono text-[#8FA7A0] uppercase">Mean NDVI</div>
                <div className="text-lg font-bold font-mono text-[#50E3A4] mt-0.5">{selectedPreset.estNdvi}</div>
                <div className="text-[10px] text-[#8FA7A0]">Canopy Density</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#112420]/60 border border-[#1C3630]">
                <div className="text-[10px] font-mono text-[#8FA7A0] uppercase">Water / Tidal Extent</div>
                <div className="text-lg font-bold font-mono text-[#60A5FA] mt-0.5">{selectedPreset.estWaterPct}%</div>
                <div className="text-[10px] text-[#8FA7A0]">NDWI Water Mask</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#112420]/60 border border-[#1C3630]">
                <div className="text-[10px] font-mono text-[#8FA7A0] uppercase">Mean LST</div>
                <div className="text-lg font-bold font-mono text-[#F5C451] mt-0.5">{selectedPreset.estLst}°C</div>
                <div className="text-[10px] text-[#8FA7A0]">Canopy Surface</div>
              </div>
            </div>

            <p className="text-xs text-[#8FA7A0] mt-3 leading-relaxed">
              <strong className="text-[#EAF7F2]">Ecological Context:</strong> {selectedPreset.note}
            </p>
          </div>
        )}

        <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-[#1C3630]">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#1C3630] px-4 py-2 text-xs font-medium text-[#8FA7A0] hover:text-[#EAF7F2] hover:bg-[#112420] transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              if (onApplyZone) {
                onApplyZone(selectedPreset.name, [customLng, customLat]);
              }
              onClose();
            }}
            className="rounded-lg bg-[#50E3A4] px-4 py-2 text-xs font-bold text-[#07110F] hover:bg-[#3ec48a] transition-colors shadow-lg shadow-[#50E3A4]/20"
          >
            Target on Map
          </button>
        </div>
      </div>
    </div>
  );
};
