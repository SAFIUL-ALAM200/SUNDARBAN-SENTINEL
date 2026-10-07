/**
 * Sundarbans Sentinel - Salinity Intrusion & Fresh Water Dynamics Page
 * 
 * Features:
 * - Upstream Gorai/Ganges freshwater flow tracking vs marine intrusion wedge
 * - Real-time gauge station salinity monitoring
 * - Interactive upstream discharge simulation slider
 * - Sundri (Heritiera fomes) Top-Dying disease risk evaluation
 * - Full bilingual English/Bangla localization
 */

import React, { useState } from 'react';
import { 
  SalinityService, 
  GAUGE_STATIONS, 
  ANNUAL_DISCHARGE_CYCLE, 
  SALINITY_ZONES_SUMMARY 
} from '../services/salinityService';
import { Language, getTranslation } from '../services/i18n';
import { 
  Droplets, 
  Gauge, 
  ArrowDownRight, 
  Compass, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Waves,
  TrendingDown
} from 'lucide-react';

interface SalinityTrackerPageProps {
  language: Language;
}

export const SalinityTrackerPage: React.FC<SalinityTrackerPageProps> = ({ language }) => {
  const [goraiFlow, setGoraiFlow] = useState<number>(350); // Initial flow in m³/s
  
  const simulation = SalinityService.simulateIntrusion(goraiFlow);
  const stations = SalinityService.getStations();
  const annualCycle = SalinityService.getAnnualCycle();
  const zoneStats = SalinityService.getZoneStats();

  const t = (key: string) => getTranslation(key, language);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07110F] text-[#EAF7F2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header Bar */}
        <div className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#50E3A4] uppercase tracking-wider mb-1">
              <Droplets className="h-4 w-4" />
              <span>{t('salinityTitle')}</span>
            </div>
            <h1 className="text-2xl font-bold font-mono text-[#EAF7F2]">
              {language === 'bn' 
                ? 'লবণাক্ততা অনুপ্রবেশ ও মিষ্টি পানির গতিবিদ্যা নিরীক্ষণ' 
                : 'Salinity Intrusion & Fresh Water Dynamics Tracker'}
            </h1>
            <p className="text-xs text-[#8FA7A0] max-w-3xl mt-1">
              {t('salinitySubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[#1C3630] bg-[#112420] px-3.5 py-2 text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-[#50E3A4] animate-pulse" />
            <span className="text-[#8FA7A0]">{language === 'bn' ? 'উজানের গেজ:' : 'Upstream Gauge:'}</span>
            <span className="font-bold text-[#50E3A4]">Gorai Railway Bridge (BWDB)</span>
          </div>
        </div>

        {/* SIMULATOR & TOP-DYING RISK SECTION */}
        <div className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1C3630] pb-3">
            <div>
              <h2 className="text-sm font-bold font-mono text-[#50E3A4] uppercase tracking-wider flex items-center gap-2">
                <Gauge className="h-4 w-4" />
                <span>{language === 'bn' ? 'উজানের পানি প্রবাহ ও লবণাক্ততা মডেলিং' : 'Upstream Discharge Sensitivity Model'}</span>
              </h2>
              <p className="text-xs text-[#8FA7A0]">
                {language === 'bn' 
                  ? 'গড়াই নদীর মিঠা পানির প্রবাহ পরিবর্তন করে দেখুন সুন্দরবনের ভেতরে লোনা পানির বিস্তার কতদূর পর্যন্ত পৌঁছায়।' 
                  : 'Adjust upstream Gorai River discharge to observe real-time marine wedge penetration and Sundri top-dying risk.'}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono text-[#8FA7A0]">{t('upstreamDischarge')}: </span>
              <span className="text-base font-bold font-mono text-[#50E3A4]">{goraiFlow} m³/s</span>
            </div>
          </div>

          {/* Flow Slider */}
          <div className="space-y-1.5">
            <input
              type="range"
              min="20"
              max="3500"
              step="20"
              value={goraiFlow}
              onChange={(e) => setGoraiFlow(parseInt(e.target.value))}
              className="w-full h-2 bg-[#1C3630] rounded-lg appearance-none cursor-pointer accent-[#50E3A4]"
            />
            <div className="flex justify-between text-[11px] font-mono text-[#8FA7A0]">
              <span className="text-[#FF6B6B]">20 m³/s (Acute Dry Season Deficit)</span>
              <span>400 m³/s (Transitional)</span>
              <span className="text-[#60A5FA]">1,800 m³/s (Monsoon Peak)</span>
              <span className="text-[#50E3A4]">3,500 m³/s (Maximum Flush)</span>
            </div>
          </div>

          {/* Model Output Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            <div className="rounded-xl border border-[#1C3630] bg-[#112420] p-3.5">
              <div className="text-[10px] font-mono text-[#8FA7A0] uppercase">
                {language === 'bn' ? 'মংলা বন্দরে লবণাক্ততা' : 'Passur / Mongla Salinity'}
              </div>
              <div className="text-xl font-bold font-mono text-[#60A5FA] mt-1">
                {simulation.salinityAtMongla} ppt
              </div>
              <div className="text-[10px] text-[#8FA7A0] font-mono">
                {simulation.salinityAtMongla > 18 ? 'Hyper-saline' : 'Mesohaline'}
              </div>
            </div>

            <div className="rounded-xl border border-[#1C3630] bg-[#112420] p-3.5">
              <div className="text-[10px] font-mono text-[#8FA7A0] uppercase">
                {language === 'bn' ? 'হিরণ পয়েন্টে লবণাক্ততা' : 'Hiron Point Coastal Salinity'}
              </div>
              <div className="text-xl font-bold font-mono text-[#EAF7F2] mt-1">
                {simulation.salinityAtHironPoint} ppt
              </div>
              <div className="text-[10px] text-[#8FA7A0] font-mono">
                Bay of Bengal oceanic margin
              </div>
            </div>

            <div className="rounded-xl border border-[#1C3630] bg-[#112420] p-3.5">
              <div className="text-[10px] font-mono text-[#8FA7A0] uppercase">
                {language === 'bn' ? 'অভ্যন্তরীণ লবণাক্ততার অনুপ্রবেশ' : 'Inland Saline Wedge'}
              </div>
              <div className="text-xl font-bold font-mono text-[#F5C451] mt-1">
                {simulation.inlandPenetrationKm} km
              </div>
              <div className="text-[10px] text-[#8FA7A0] font-mono">
                From southern coastline
              </div>
            </div>

            <div className="rounded-xl border border-[#1C3630] bg-[#112420] p-3.5">
              <div className="text-[10px] font-mono text-[#8FA7A0] uppercase">
                {t('topDyingRisk')}
              </div>
              <div className={`text-base font-bold font-mono mt-1 ${
                simulation.topDyingRisk === 'CRITICAL' ? 'text-[#FF6B6B]' :
                simulation.topDyingRisk === 'HIGH' ? 'text-[#F5C451]' : 'text-[#50E3A4]'
              }`}>
                {simulation.topDyingRisk} RISK
              </div>
              <div className="text-[10px] text-[#8FA7A0] font-mono">
                Heritiera fomes vascular health
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#1C3630] bg-[#07110F] p-3.5 text-xs font-mono text-[#8FA7A0]">
            <span className="text-[#50E3A4] font-bold">Ecological Model Finding: </span>
            {simulation.interpretation}
          </div>
        </div>

        {/* TWO-COLUMN: GAUGE STATIONS (LEFT) + ANNUAL DISCHARGE CYCLE (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Gauge Stations Table (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-[#1C3630] pb-2">
                <h3 className="text-xs font-mono font-bold text-[#50E3A4] uppercase tracking-wider">
                  {language === 'bn' ? 'সুন্দরবন নদী গেজ স্টেশনসমূহ' : 'Estuarine Salinity Gauge Stations'}
                </h3>
                <span className="text-[10px] font-mono text-[#8FA7A0]">In-Situ Telemetry</span>
              </div>

              <div className="divide-y divide-[#1C3630]">
                {stations.map(st => (
                  <div key={st.id} className="py-3 flex items-center justify-between gap-3 text-xs font-mono">
                    <div>
                      <div className="font-bold text-[#EAF7F2]">
                        {language === 'bn' ? st.bengaliName : st.name}
                      </div>
                      <div className="text-[10px] text-[#8FA7A0]">
                        {st.river} · {st.distanceFromSeaKm} km {language === 'bn' ? 'সমুদ্র থেকে' : 'from sea'}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-[#60A5FA]">
                        {st.currentSalinityPpt} ppt
                      </div>
                      <div className="text-[10px] text-[#8FA7A0]">
                        Peak: {st.drySeasonPeakPpt} | Low: {st.monsoonLowPpt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Annual Cycle & Salinity Zones (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-[#1C3630] pb-2">
                <h3 className="text-xs font-mono font-bold text-[#50E3A4] uppercase tracking-wider">
                  {language === 'bn' ? 'সুন্দরবনের ৩টি প্রধান লবণাক্ততা অঞ্চল' : 'Mangrove Salinity Zones & Forest Succession'}
                </h3>
                <span className="text-[10px] font-mono text-[#8FA7A0]">Landsat NDWI & Soil Moisture</span>
              </div>

              <div className="space-y-3">
                {zoneStats.map(z => (
                  <div key={z.zone} className="rounded-lg border border-[#1C3630] bg-[#112420] p-3 space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#EAF7F2]">{z.zone}</span>
                      <span className="text-[#50E3A4] font-bold">{z.areaPercentage}% ({z.areaKm2} km²)</span>
                    </div>
                    <div className="text-[11px] text-[#8FA7A0]">
                      <span className="text-[#50E3A4]">Dominant Species: </span>
                      {z.dominantSpecies.join(', ')}
                    </div>
                    <div className="text-[10px] text-[#F5C451]">
                      {z.historicalShiftTrend}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Annual River Discharge Timeline */}
            <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-5 shadow-xl space-y-3">
              <div className="text-xs font-mono font-bold text-[#50E3A4] uppercase tracking-wider border-b border-[#1C3630] pb-2">
                {language === 'bn' ? 'বার্ষিক পানি প্রবাহ ও সুন্দরবনের ওপর প্রভাব' : '12-Month Gorai Flow vs Ecosystem Dynamics'}
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-center text-xs font-mono">
                {annualCycle.slice(0, 6).map(m => (
                  <div key={m.month} className="p-2 rounded bg-[#112420] border border-[#1C3630]">
                    <div className="text-[#8FA7A0] font-bold">{language === 'bn' ? m.bengaliMonth : m.month}</div>
                    <div className="text-[#50E3A4] font-bold mt-0.5">{m.goraiDischargeM3s}</div>
                    <div className="text-[9px] text-[#8FA7A0]">m³/s</div>
                  </div>
                ))}
                {annualCycle.slice(6, 12).map(m => (
                  <div key={m.month} className="p-2 rounded bg-[#112420] border border-[#1C3630]">
                    <div className="text-[#8FA7A0] font-bold">{language === 'bn' ? m.bengaliMonth : m.month}</div>
                    <div className="text-[#60A5FA] font-bold mt-0.5">{m.goraiDischargeM3s}</div>
                    <div className="text-[9px] text-[#8FA7A0]">m³/s</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
