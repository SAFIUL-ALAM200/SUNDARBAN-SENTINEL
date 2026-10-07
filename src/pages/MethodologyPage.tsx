/**
 * Sundarbans Sentinel - Scientific Methodology & Transparency
 * 
 * Peer-reviewed equations, algorithm derivations, sensor physics,
 * and scientific accountability disclosures.
 */

import React from 'react';
import { BookOpen, ShieldAlert, Cpu, CheckCircle2, AlertCircle, FileCode } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07110F] text-[#EAF7F2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Header */}
        <div className="border-b border-[#1C3630] pb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#50E3A4] uppercase tracking-wider mb-1">
            <BookOpen className="h-4 w-4" />
            <span>Scientific Transparency & Peer-Reviewed Algorithms</span>
          </div>
          <h1 className="text-3xl font-bold font-mono text-[#EAF7F2]">
            Methodology & Remote Sensing Framework
          </h1>
          <p className="text-sm text-[#8FA7A0] mt-2 leading-relaxed">
            Sundarbans Sentinel translates raw Earth-observation spectral radiances into transparent, reproducible ecological indicators and statistical anomaly alerts.
          </p>
        </div>

        {/* 1. What is NDVI? */}
        <section className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-mono font-bold text-[#50E3A4] uppercase">
            <span>🌿 01 / WHAT IS NDVI? (VEGETATION HEALTH)</span>
          </div>

          <p className="text-xs sm:text-sm text-[#8FA7A0] leading-relaxed">
            The Normalized Difference Vegetation Index (NDVI) is a standardized satellite-derived index used globally to quantify healthy green vegetation. Healthy mangrove leaves absorb visible red light for photosynthesis while vigorously reflecting Near-Infrared (NIR) light through the spongy mesophyll cell structure.
          </p>

          <div className="rounded-xl border border-[#1C3630] bg-[#07110F] p-4 font-mono">
            <div className="text-xs text-[#8FA7A0] uppercase mb-1">NDVI Mathematical Equation:</div>
            <div className="text-lg font-bold text-[#50E3A4]">
              NDVI = (NIR - Red) / (NIR + Red)
            </div>
            <div className="text-xs text-[#8FA7A0] mt-2 space-y-1">
              <div>· Landsat 8/9: Band 5 (NIR, 0.85-0.88 µm) & Band 4 (Red, 0.64-0.67 µm)</div>
              <div>· MODIS: Band 2 (NIR, 841-876 nm) & Band 1 (Red, 620-670 nm)</div>
              <div>· Values range from -1.0 to +1.0. Mangrove canopy typically scores +0.55 to +0.82.</div>
            </div>
          </div>
        </section>

        {/* 2. What is NDWI? */}
        <section className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-mono font-bold text-[#60A5FA] uppercase">
            <span>💧 02 / WHAT IS NDWI? (SURFACE WATER EXTENT)</span>
          </div>

          <p className="text-xs sm:text-sm text-[#8FA7A0] leading-relaxed">
            The Normalized Difference Water Index (McFeeters, 1996) delineates open water bodies, tidal rivers, and flooded mangrove floor mudflats by maximizing green reflectance and minimizing near-infrared absorption.
          </p>

          <div className="rounded-xl border border-[#1C3630] bg-[#07110F] p-4 font-mono">
            <div className="text-xs text-[#8FA7A0] uppercase mb-1">NDWI Mathematical Equation:</div>
            <div className="text-lg font-bold text-[#60A5FA]">
              NDWI = (Green - NIR) / (Green + NIR)
            </div>
            <div className="text-xs text-[#8FA7A0] mt-2 space-y-1">
              <div>· Positive values delineate open water channels and submerged mudflats.</div>
              <div>· Enables continuous automated tracking of cyclonic storm surge inundation boundaries.</div>
            </div>
          </div>
        </section>

        {/* 3. What is Land Surface Temperature (LST)? */}
        <section className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-mono font-bold text-[#F5C451] uppercase">
            <span>🌡️ 03 / WHAT IS LAND SURFACE TEMPERATURE (LST)?</span>
          </div>

          <p className="text-xs sm:text-sm text-[#8FA7A0] leading-relaxed">
            Land Surface Temperature represents the radiometric temperature of the outermost canopy crown layer as detected by satellite thermal infrared sensors (MODIS thermal bands 31 & 32 and Landsat 8/9 TIRS).
          </p>

          <div className="rounded-xl border border-[#F5C451]/30 bg-[#F5C451]/5 p-3.5 text-xs text-[#EAF7F2]">
            <strong className="text-[#F5C451]">Critical Scientific Distinction: </strong>
            Land surface temperature is <span className="underline">NOT identical to ambient air temperature</span>. LST measures radiative skin heating of the mangrove leaves and tidal mudflats, capturing evapotranspiration stress during pre-monsoon heatwaves.
          </div>
        </section>

        {/* 4. Satellite-Detected Fire Activity */}
        <section className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-mono font-bold text-[#FF6B6B] uppercase">
            <span>🔥 04 / SATELLITE-DETECTED FIRE ACTIVITY (NASA FIRMS)</span>
          </div>

          <p className="text-xs sm:text-sm text-[#8FA7A0] leading-relaxed">
            Fire data are harvested from NASA's Fire Information for Resource Management System (FIRMS), utilizing VIIRS 375m and MODIS 1km active fire detection algorithms.
          </p>

          <div className="rounded-xl border border-[#1C3630] bg-[#07110F] p-4 text-xs font-mono space-y-2">
            <div>· Sensor: VIIRS I-Band 4 (3.74 µm) & I-Band 5 (11.45 µm)</div>
            <div>· Nomenclature Rule: Always labelled as <strong className="text-[#50E3A4]">"Satellite-detected thermal hotspot"</strong>, never "Confirmed forest wildfire".</div>
            <div>· Ecological context: True wildfires are virtually non-existent in pristine wet mangroves. Hotspots detected at the northern fringes are almost exclusively seasonal stubble burning, charcoal burning, or legal agricultural clearings.</div>
          </div>
        </section>

        {/* 5. Statistical Anomaly Detection Engine */}
        <section className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-mono font-bold text-[#50E3A4] uppercase">
            <span>⚠️ 05 / HOW ANOMALIES ARE CALCULATED (Z-SCORE ENGINE)</span>
          </div>

          <p className="text-xs sm:text-sm text-[#8FA7A0] leading-relaxed">
            Rather than relying on hallucination-prone heuristic estimates, Sundarbans Sentinel uses verified statistical Z-score anomaly detection against a 26-year historical baseline (2000–2026).
          </p>

          <div className="rounded-xl border border-[#1C3630] bg-[#07110F] p-4 font-mono">
            <div className="text-xs text-[#8FA7A0] uppercase mb-1">Standardized Anomaly Score (Z):</div>
            <div className="text-lg font-bold text-[#50E3A4]">
              z = (x - μ) / σ
            </div>
            <div className="text-xs text-[#8FA7A0] mt-2 space-y-1">
              <div>· x = Current satellite observation value</div>
              <div>· μ = Multi-year historical mean for the corresponding seasonal window</div>
              <div>· σ = Standard deviation of the historical time-series</div>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-[#1C3630] text-[#8FA7A0] text-left">
                  <th className="py-2 pr-4">Z-Score Range</th>
                  <th className="py-2 pr-4">Classification</th>
                  <th className="py-2">Statistical Implication</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C3630]/60">
                <tr>
                  <td className="py-2 pr-4 text-[#50E3A4] font-bold">|z| &lt; 1.0σ</td>
                  <td className="py-2 pr-4 text-[#50E3A4]">NORMAL</td>
                  <td className="py-2 text-[#8FA7A0]">Within expected seasonal variance (&lt;68% interval)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-[#60A5FA] font-bold">1.0σ ≤ |z| &lt; 2.0σ</td>
                  <td className="py-2 pr-4 text-[#60A5FA]">WATCH</td>
                  <td className="py-2 text-[#8FA7A0]">Mild deviation; monitoring suggested</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-[#F5C451] font-bold">2.0σ ≤ |z| &lt; 3.0σ</td>
                  <td className="py-2 pr-4 text-[#F5C451]">ANOMALY</td>
                  <td className="py-2 text-[#8FA7A0]">Significant departure from historical baseline (&gt;95% confidence)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-[#FF6B6B] font-bold">|z| ≥ 3.0σ</td>
                  <td className="py-2 pr-4 text-[#FF6B6B]">STRONG ANOMALY</td>
                  <td className="py-2 text-[#8FA7A0]">Extreme outlier (cyclone impact or acute disturbance)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-[11px] text-[#8FA7A0] italic mt-2">
            *Notice: These severity thresholds are application-defined statistical definitions, not official NASA or government alert levels.
          </div>
        </section>

        {/* 6. Scientific Limitations & Prototype Disclaimer */}
        <section className="rounded-2xl border border-[#FF6B6B]/30 bg-[#FF6B6B]/5 p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-mono font-bold text-[#FF6B6B] uppercase">
            <ShieldAlert className="h-5 w-5" />
            <span>LIMITATIONS & ETHICAL SCIENTIFIC NOTICE</span>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-[#8FA7A0] leading-relaxed">
            <p>
              1. <strong>Cloud Contamination:</strong> During the South Asian Monsoon (June–September), dense cloud cover causes temporal data gaps in optical optical imagery (Landsat & Sentinel-2), requiring reliance on synthetic microwave radar or composite temporal averaging.
            </p>
            <p>
              2. <strong>Tidal Amplitude Bias:</strong> The Sundarbans experiences semi-diurnal tides with amplitudes exceeding 3 to 5 meters. Observations captured during high spring tides naturally record higher NDWI water coverage than those captured during low neap tides.
            </p>
            <p>
              3. <strong>Educational Prototype:</strong> This application is developed as an educational prototype for the NASA Space Apps Challenge 2026. It is designed to demonstrate Earth-observation data visualization and does not replace statutory forest management or disaster warning systems.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
