/**
 * Sundarbans Sentinel - Landing Page
 * 
 * Tells the compelling story:
 * PROBLEM -> CHALLENGE -> SOLUTION -> DATA -> AI -> INSIGHT -> ACTION
 */

import React from 'react';
import { ArrowRight, Satellite, ShieldCheck, Compass, Sparkles, Activity, Clock, Layers, Globe, ExternalLink, Wind, Bell, Droplets, Gauge } from 'lucide-react';
import { MONITORING_ZONES } from '../data/sundarbansGeo';

interface LandingPageProps {
  onExplore: () => void;
  onOpenTimeMachine: () => void;
  onSelectTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExplore,
  onOpenTimeMachine,
  onSelectTab
}) => {
  return (
    <div className="min-h-screen bg-[#07110F] text-[#EAF7F2]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#1C3630] py-20 lg:py-28 scientific-grid">
        {/* Radar subtle sweep backdrop */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="h-[600px] w-[600px] rounded-full border border-[#50E3A4]/10 radar-sweep animate-[spin_18s_linear_infinite]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            {/* NASA Space Apps 2026 Kicker (Clean unboxed text, no candy pill) */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#50E3A4] mb-3">
              <span>NASA SPACE APPS CHALLENGE 2026</span>
              <span aria-hidden="true">·</span>
              <span>EARTH OBSERVATION PROTOTYPE</span>
              <span aria-hidden="true">·</span>
              <span>BANGLADESH</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#EAF7F2] font-mono">
              SUNDARBANS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#50E3A4] to-[#60A5FA]">
                SENTINEL
              </span>
            </h1>

            <p className="mt-4 text-xl sm:text-2xl font-light text-[#EAF7F2]/90 leading-snug">
              Monitoring a changing ecosystem from space.
            </p>

            <p className="mt-4 text-sm sm:text-base text-[#8FA7A0] leading-relaxed max-w-2xl font-sans">
              An AI-powered environmental intelligence platform combining multi-decadal NASA Landsat, MODIS, and VIIRS observations to track mangrove canopy resilience, tidal inundation, and thermal stress across the world's largest mangrove delta.
            </p>

            {/* CTA Group */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onExplore}
                className="flex items-center gap-2.5 rounded-xl bg-[#50E3A4] px-6 py-3.5 text-sm font-bold text-[#07110F] hover:bg-[#3ec48a] transition-all shadow-xl shadow-[#50E3A4]/20 hover:scale-105"
              >
                <span>EXPLORE THE SUNDARBANS</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onOpenTimeMachine}
                className="flex items-center gap-2 rounded-xl border border-[#1C3630] bg-[#0D1B18] px-5 py-3.5 text-sm font-semibold text-[#EAF7F2] hover:border-[#50E3A4]/50 hover:bg-[#112420] transition-all"
              >
                <Clock className="h-4 w-4 text-[#50E3A4]" />
                <span>VIEW TIME MACHINE (2000–2026)</span>
              </button>
            </div>

            {/* Quick Live Indicators ticker */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#1C3630] pt-6 font-mono text-xs">
              <div>
                <div className="text-[10px] text-[#8FA7A0] uppercase">MANGROVE EXTENT</div>
                <div className="text-base font-bold text-[#EAF7F2] mt-0.5">~10,000 km²</div>
                <div className="text-[10px] text-[#50E3A4]">60% Bangladesh / 40% India</div>
              </div>

              <div>
                <div className="text-[10px] text-[#8FA7A0] uppercase">CANOPY INDEX (NDVI)</div>
                <div className="text-base font-bold text-[#50E3A4] mt-0.5">0.63 Mean</div>
                <div className="text-[10px] text-[#8FA7A0]">Post-Remal Recovery</div>
              </div>

              <div>
                <div className="text-[10px] text-[#8FA7A0] uppercase">SATELLITE DATASETS</div>
                <div className="text-base font-bold text-[#60A5FA] mt-0.5">5 Missions</div>
                <div className="text-[10px] text-[#8FA7A0]">MODIS, VIIRS, Landsat, Sentinel</div>
              </div>

              <div>
                <div className="text-[10px] text-[#8FA7A0] uppercase">HISTORICAL DEPTH</div>
                <div className="text-base font-bold text-[#F5C451] mt-0.5">26 Years</div>
                <div className="text-[10px] text-[#8FA7A0]">2000 Baseline to 2026</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE STORY FLOW: Problem -> Challenge -> Solution -> Data -> AI -> Insight -> Action */}
      <section className="py-20 border-b border-[#1C3630] bg-[#07110F]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-mono text-[#50E3A4] uppercase tracking-wider mb-1">
              Scientific Narrative
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[#EAF7F2]">
              From Spaceborne Radiation to Ecological Understanding
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 font-sans">
            {/* Step 1 */}
            <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#50E3A4] font-bold">01 / PROBLEM</div>
                <h3 className="text-sm font-bold text-[#EAF7F2] mt-2">Vast & Dynamic</h3>
                <p className="text-xs text-[#8FA7A0] mt-2 leading-relaxed">
                  The Sundarbans spans 10,000 square kilometers of tidal rivers, mudflats, and impenetrable mangrove jungle.
                </p>
              </div>
              <div className="text-[10px] font-mono text-[#8FA7A0] mt-4 pt-2 border-t border-[#1C3630]">
                Ecosystem Scale
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#F5C451] font-bold">02 / CHALLENGE</div>
                <h3 className="text-sm font-bold text-[#EAF7F2] mt-2">Ground Limits</h3>
                <p className="text-xs text-[#8FA7A0] mt-2 leading-relaxed">
                  Foot patrols and boat-based monitoring are constrained by extreme tides, tiger hazards, and sheer physical distance.
                </p>
              </div>
              <div className="text-[10px] font-mono text-[#8FA7A0] mt-4 pt-2 border-t border-[#1C3630]">
                Logistical Barrier
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#60A5FA] font-bold">03 / SOLUTION</div>
                <h3 className="text-sm font-bold text-[#EAF7F2] mt-2">NASA Earth View</h3>
                <p className="text-xs text-[#8FA7A0] mt-2 leading-relaxed">
                  Polar-orbiting satellites capture multi-spectral reflectance, thermal emission, and active fire radiances continuously.
                </p>
              </div>
              <div className="text-[10px] font-mono text-[#8FA7A0] mt-4 pt-2 border-t border-[#1C3630]">
                Orbital Surveillance
              </div>
            </div>

            {/* Step 4 */}
            <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#50E3A4] font-bold">04 / DATA</div>
                <h3 className="text-sm font-bold text-[#EAF7F2] mt-2">Indices Derived</h3>
                <p className="text-xs text-[#8FA7A0] mt-2 leading-relaxed">
                  Raw bands convert into physical indicators: NDVI for canopy greenness, NDWI for water, LST for thermal stress.
                </p>
              </div>
              <div className="text-[10px] font-mono text-[#8FA7A0] mt-4 pt-2 border-t border-[#1C3630]">
                Spectral Science
              </div>
            </div>

            {/* Step 5 */}
            <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#F5C451] font-bold">05 / AI & STATS</div>
                <h3 className="text-sm font-bold text-[#EAF7F2] mt-2">Z-Score Engine</h3>
                <p className="text-xs text-[#8FA7A0] mt-2 leading-relaxed">
                  Current values are compared to a 26-year historical baseline, isolating abnormal standard deviations (σ &gt; 2.0).
                </p>
              </div>
              <div className="text-[10px] font-mono text-[#8FA7A0] mt-4 pt-2 border-t border-[#1C3630]">
                Anomaly Detection
              </div>
            </div>

            {/* Step 6 */}
            <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#50E3A4] font-bold">06 / ACTION</div>
                <h3 className="text-sm font-bold text-[#EAF7F2] mt-2">Evidence-Driven</h3>
                <p className="text-xs text-[#8FA7A0] mt-2 leading-relaxed">
                  Transparent evidence and printable reports give forest rangers, scientists, and decision-makers actionable clarity.
                </p>
              </div>
              <div className="text-[10px] font-mono text-[#8FA7A0] mt-4 pt-2 border-t border-[#1C3630]">
                Empowering Action
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE INDICATORS BREAKDOWN */}
      <section className="py-20 border-b border-[#1C3630] bg-[#0D1B18]/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-mono text-[#50E3A4] uppercase tracking-wider mb-1">
              Derived Indicators
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[#EAF7F2]">
              NASA Earth-Observation Indicators
            </h2>
            <p className="text-sm text-[#8FA7A0] mt-2">
              Every metric in Sundarbans Sentinel is grounded in peer-reviewed remote sensing equations and validated against official NASA mission products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Vegetation */}
            <div className="rounded-2xl border border-[#1C3630] bg-[#07110F] p-5 hover:border-[#50E3A4]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🌿</span>
                <span className="text-[10px] font-mono text-[#50E3A4] bg-[#50E3A4]/10 border border-[#50E3A4]/30 px-2 py-0.5 rounded">
                  MODIS / Landsat
                </span>
              </div>
              <h3 className="text-base font-bold text-[#EAF7F2] mt-3">Vegetation Health (NDVI)</h3>
              <p className="text-xs text-[#8FA7A0] mt-1.5 leading-relaxed">
                Measures chlorophyll absorption in near-infrared vs red wavelengths to quantify mangrove canopy density and detect defoliation following cyclones.
              </p>
              <div className="mt-4 pt-3 border-t border-[#1C3630] font-mono text-xs">
                <div className="text-[10px] text-[#8FA7A0] uppercase">Formula</div>
                <div className="text-[#50E3A4] font-bold mt-0.5">(NIR - Red) / (NIR + Red)</div>
              </div>
            </div>

            {/* 2. Water */}
            <div className="rounded-2xl border border-[#1C3630] bg-[#07110F] p-5 hover:border-[#60A5FA]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-2xl">💧</span>
                <span className="text-[10px] font-mono text-[#60A5FA] bg-[#60A5FA]/10 border border-[#60A5FA]/30 px-2 py-0.5 rounded">
                  Landsat 8-9 / Sentinel-2
                </span>
              </div>
              <h3 className="text-base font-bold text-[#EAF7F2] mt-3">Surface Water Extent (NDWI)</h3>
              <p className="text-xs text-[#8FA7A0] mt-1.5 leading-relaxed">
                Delineates tidal river networks, coastal mudflats, and seasonal storm-surge inundation over low-lying mangrove forest floors.
              </p>
              <div className="mt-4 pt-3 border-t border-[#1C3630] font-mono text-xs">
                <div className="text-[10px] text-[#8FA7A0] uppercase">Formula</div>
                <div className="text-[#60A5FA] font-bold mt-0.5">(Green - NIR) / (Green + NIR)</div>
              </div>
            </div>

            {/* 3. Thermal */}
            <div className="rounded-2xl border border-[#1C3630] bg-[#07110F] p-5 hover:border-[#F5C451]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🌡️</span>
                <span className="text-[10px] font-mono text-[#F5C451] bg-[#F5C451]/10 border border-[#F5C451]/30 px-2 py-0.5 rounded">
                  MOD11A2 1km LST
                </span>
              </div>
              <h3 className="text-base font-bold text-[#EAF7F2] mt-3">Thermal Stress (LST)</h3>
              <p className="text-xs text-[#8FA7A0] mt-1.5 leading-relaxed">
                Derives radiometric land surface temperature from split-window thermal infrared bands to identify canopy heat vulnerability during pre-monsoon dry spells.
              </p>
              <div className="mt-4 pt-3 border-t border-[#1C3630] font-mono text-xs">
                <div className="text-[10px] text-[#8FA7A0] uppercase">Unit</div>
                <div className="text-[#F5C451] font-bold mt-0.5">Degrees Celsius (°C)</div>
              </div>
            </div>

            {/* 4. Fire */}
            <div className="rounded-2xl border border-[#1C3630] bg-[#07110F] p-5 hover:border-[#FF6B6B]/50 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🔥</span>
                <span className="text-[10px] font-mono text-[#FF6B6B] bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 px-2 py-0.5 rounded">
                  NASA FIRMS VIIRS 375m
                </span>
              </div>
              <h3 className="text-base font-bold text-[#EAF7F2] mt-3">Active Fire Hotspots</h3>
              <p className="text-xs text-[#8FA7A0] mt-1.5 leading-relaxed">
                Identifies 375-meter thermal radiative anomalies in agricultural buffer peripheries, preventing human-induced burns from penetrating the core forest.
              </p>
              <div className="mt-4 pt-3 border-t border-[#1C3630] font-mono text-xs">
                <div className="text-[10px] text-[#8FA7A0] uppercase">Resolution</div>
                <div className="text-[#FF6B6B] font-bold mt-0.5">375m Twice-Daily NRT</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 ACTION-ORIENTED CONSERVATION & EARLY-WARNING SUITE */}
      <section className="py-20 border-b border-[#1C3630] bg-[#0D1B18]/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-xs font-mono text-[#50E3A4] uppercase tracking-wider mb-2">
              Action-Oriented Conservation Suite
            </div>
            <h2 className="text-3xl font-bold font-mono text-[#EAF7F2]">
              From Passive Analytics to Early-Warning Action
            </h2>
            <p className="text-sm text-[#8FA7A0] mt-3 leading-relaxed">
              Equipping coastal rangers, UNESCO monitors, and disaster response teams with predictive cyclone physics, in-situ ground-truthing, automated policy triggers, and freshwater salinity models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Cyclone Impact Modeling */}
            <div 
              onClick={() => onSelectTab('cyclone-simulation')}
              className="rounded-2xl border border-[#1C3630] bg-[#07110F] p-5 hover:border-[#50E3A4] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#50E3A4]/15 border border-[#50E3A4]/30 text-[#50E3A4] mb-4 group-hover:scale-105 transition-transform">
                  <Wind className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#EAF7F2] group-hover:text-[#50E3A4] transition-colors">
                  Cyclone & Surge Simulation
                </h3>
                <p className="text-xs text-[#8FA7A0] mt-2 leading-relaxed">
                  Model pre-landfall storm surge heights, wind shear, and species mortality (Sundri vs Gewa vs Goran) using NOAA SST and tidal harmonics.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#1C3630] flex items-center justify-between text-xs font-mono text-[#50E3A4]">
                <span>Launch Simulator</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 2. Ground-Truthing */}
            <div 
              onClick={() => onSelectTab('ground-truthing')}
              className="rounded-2xl border border-[#1C3630] bg-[#07110F] p-5 hover:border-[#60A5FA] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#60A5FA]/15 border border-[#60A5FA]/30 text-[#60A5FA] mb-4 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#EAF7F2] group-hover:text-[#60A5FA] transition-colors">
                  Ground-Truthing Mobile Layer
                </h3>
                <p className="text-xs text-[#8FA7A0] mt-2 leading-relaxed">
                  Crowdsourced in-situ ranger observations cross-validated against satellite passes to eliminate cloud shadows and confirm real dieback.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#1C3630] flex items-center justify-between text-xs font-mono text-[#60A5FA]">
                <span>Explore Field Data</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 3. Alert Dispatcher */}
            <div 
              onClick={() => onSelectTab('alerts')}
              className="rounded-2xl border border-[#1C3630] bg-[#07110F] p-5 hover:border-[#FF6B6B] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 text-[#FF6B6B] mb-4 group-hover:scale-105 transition-transform">
                  <Bell className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#EAF7F2] group-hover:text-[#FF6B6B] transition-colors">
                  Automated Alert Dispatcher
                </h3>
                <p className="text-xs text-[#8FA7A0] mt-2 leading-relaxed">
                  Configurable threshold rules triggering automated webhooks and alerts to BFD SMART Patrols and UNESCO World Heritage monitors.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#1C3630] flex items-center justify-between text-xs font-mono text-[#FF6B6B]">
                <span>Manage Triggers</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 4. Salinity Tracker */}
            <div 
              onClick={() => onSelectTab('salinity')}
              className="rounded-2xl border border-[#1C3630] bg-[#07110F] p-5 hover:border-[#F5C451] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5C451]/15 border border-[#F5C451]/30 text-[#F5C451] mb-4 group-hover:scale-105 transition-transform">
                  <Droplets className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-[#EAF7F2] group-hover:text-[#F5C451] transition-colors">
                  Salinity & Fresh Water Dynamics
                </h3>
                <p className="text-xs text-[#8FA7A0] mt-2 leading-relaxed">
                  Track upstream Gorai/Ganges flow against coastal saltwater wedge penetration and evaluate Sundri Top-Dying disease risk.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-[#1C3630] flex items-center justify-between text-xs font-mono text-[#F5C451]">
                <span>View Salinity Model</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "WHY THE SUNDARBANS?" SECTION */}
      <section className="py-20 border-b border-[#1C3630] bg-[#07110F]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-mono text-[#50E3A4] uppercase tracking-wider mb-1">
                Ecosystem Significance
              </div>
              <h2 className="text-3xl font-bold font-mono text-[#EAF7F2] leading-tight">
                Why the Sundarbans Demands Space-Based Sentinel Surveillance
              </h2>
              <p className="text-sm text-[#8FA7A0] mt-4 leading-relaxed">
                The Sundarbans is the world's single largest contiguous mangrove forest and a UNESCO World Heritage site. It serves as Bangladesh's primary natural green shield against Bay of Bengal super cyclones like Sidr, Aila, Amphan, and Remal.
              </p>

              <div className="mt-6 space-y-3 text-xs">
                <div className="flex items-start gap-3 rounded-lg border border-[#1C3630] bg-[#0D1B18] p-3">
                  <span className="text-base">🛡️</span>
                  <div>
                    <strong className="text-[#EAF7F2]">Natural Cyclone Bio-Shield: </strong>
                    <span className="text-[#8FA7A0]">Dense mangrove root networks dissipate up to 66% of cyclonic wave energy, shielding tens of millions of coastal residents.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-[#1C3630] bg-[#0D1B18] p-3">
                  <span className="text-base">🐅</span>
                  <div>
                    <strong className="text-[#EAF7F2]">Royal Bengal Tiger Stronghold: </strong>
                    <span className="text-[#8FA7A0]">Harbors one of the last genetically viable wild populations of Panthera tigris tigris, adapted to swimming tidal rivers.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-[#1C3630] bg-[#0D1B18] p-3">
                  <span className="text-base">🌊</span>
                  <div>
                    <strong className="text-[#EAF7F2]">Salinity Intrusion Barrier: </strong>
                    <span className="text-[#8FA7A0]">Changes in freshwater upstream flows directly alter tree species composition (Sundri vs Gewa), visible through spectral NDVI monitoring.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Monitoring Zones Preview Card */}
            <div className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#1C3630] pb-3 mb-4">
                <div className="text-xs font-mono font-bold text-[#50E3A4] uppercase">
                  5 Key Monitoring Zones Tracked
                </div>
                <span className="text-[10px] font-mono text-[#8FA7A0]">Geospatial Polygons</span>
              </div>

              <div className="space-y-2.5">
                {MONITORING_ZONES.map((zone) => (
                  <div key={zone.id} className="p-3 rounded-xl border border-[#1C3630] bg-[#07110F]/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#EAF7F2]">{zone.name}</div>
                      <div className="text-[11px] text-[#8FA7A0]">{zone.range}</div>
                    </div>
                    <div className="text-right font-mono text-xs">
                      <div className="text-[#50E3A4] font-semibold">{zone.areaKm2} km²</div>
                      <div className="text-[10px] text-[#8FA7A0]">{zone.center[1]}°N, {zone.center[0]}°E</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={onExplore}
                  className="w-full rounded-xl bg-[#50E3A4] py-3 text-xs font-bold text-[#07110F] hover:bg-[#3ec48a] transition-all flex items-center justify-center gap-2"
                >
                  <span>Launch Interactive Map</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
