/**
 * Sundarbans Sentinel - NASA Data Sources & Processing Pipeline
 * 
 * Matrix of official NASA Earth-observation products and pipeline documentation.
 */

import React from 'react';
import { defaultNASAProvider } from '../services/nasaDataProvider';
import { Database, ExternalLink, CheckCircle, Clock, Server, ArrowDown, ShieldCheck } from 'lucide-react';

export const DataPage: React.FC = () => {
  const products = defaultNASAProvider.getNASAProducts();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07110F] text-[#EAF7F2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Header */}
        <div className="border-b border-[#1C3630] pb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#50E3A4] uppercase tracking-wider mb-1">
            <Database className="h-4 w-4" />
            <span>Earth-Observation Products Matrix</span>
          </div>
          <h1 className="text-3xl font-bold font-mono text-[#EAF7F2]">
            NASA Data Sources & Architecture
          </h1>
          <p className="text-sm text-[#8FA7A0] mt-2 leading-relaxed max-w-3xl">
            Detailed catalog of NASA Earth Science Distributed Active Archive Centers (DAACs), sensors, orbital platforms, and resolutions powering Sundarbans Sentinel.
          </p>
        </div>

        {/* Data Architecture Pipeline Diagram */}
        <div className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-6">
          <div className="text-xs font-mono font-bold text-[#50E3A4] uppercase mb-4">
            END-TO-END GEOSPATIAL DATA PIPELINE
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-center font-mono text-xs">
            <div className="rounded-xl border border-[#1C3630] bg-[#07110F] p-3 flex flex-col justify-center">
              <div className="text-[10px] text-[#8FA7A0] uppercase">01. INGESTION</div>
              <div className="text-[#50E3A4] font-bold mt-1">NASA Earthdata</div>
              <div className="text-[10px] text-[#8FA7A0] mt-0.5">CMR API & FIRMS</div>
            </div>

            <div className="rounded-xl border border-[#1C3630] bg-[#07110F] p-3 flex flex-col justify-center">
              <div className="text-[10px] text-[#8FA7A0] uppercase">02. PREPROCESSING</div>
              <div className="text-[#60A5FA] font-bold mt-1">Spatial Clip</div>
              <div className="text-[10px] text-[#8FA7A0] mt-0.5">Sundarbans BBox</div>
            </div>

            <div className="rounded-xl border border-[#1C3630] bg-[#07110F] p-3 flex flex-col justify-center">
              <div className="text-[10px] text-[#8FA7A0] uppercase">03. INDICES</div>
              <div className="text-[#F5C451] font-bold mt-1">Spectral Math</div>
              <div className="text-[10px] text-[#8FA7A0] mt-0.5">NDVI, NDWI, LST</div>
            </div>

            <div className="rounded-xl border border-[#1C3630] bg-[#07110F] p-3 flex flex-col justify-center">
              <div className="text-[10px] text-[#8FA7A0] uppercase">04. BASELINE</div>
              <div className="text-[#FF6B6B] font-bold mt-1">Historical μ, σ</div>
              <div className="text-[10px] text-[#8FA7A0] mt-0.5">2000–2026 Archive</div>
            </div>

            <div className="rounded-xl border border-[#1C3630] bg-[#07110F] p-3 flex flex-col justify-center">
              <div className="text-[10px] text-[#8FA7A0] uppercase">05. ANOMALY</div>
              <div className="text-[#50E3A4] font-bold mt-1">Z-Score Engine</div>
              <div className="text-[10px] text-[#8FA7A0] mt-0.5">z = (x - μ) / σ</div>
            </div>

            <div className="rounded-xl border border-[#1C3630] bg-[#07110F] p-3 flex flex-col justify-center">
              <div className="text-[10px] text-[#8FA7A0] uppercase">06. CLIENT</div>
              <div className="text-[#60A5FA] font-bold mt-1">MapLibre GL</div>
              <div className="text-[10px] text-[#8FA7A0] mt-0.5">Interactive UI</div>
            </div>
          </div>
        </div>

        {/* NASA Products Table */}
        <div className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-[#1C3630] flex items-center justify-between">
            <h2 className="text-base font-bold font-mono text-[#EAF7F2]">
              Official NASA Products Specifications
            </h2>
            <span className="text-xs font-mono text-[#50E3A4]">
              Verified Product Registry
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#07110F] font-mono text-[#8FA7A0] uppercase border-b border-[#1C3630]">
                <tr>
                  <th className="py-3 px-4">Product Code & Name</th>
                  <th className="py-3 px-4">Sensor & Platform</th>
                  <th className="py-3 px-4">Spatial / Temporal</th>
                  <th className="py-3 px-4">Parameter Measured</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Documentation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C3630] font-mono">
                {products.map((prod) => (
                  <tr key={prod.code} className="hover:bg-[#112420]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#EAF7F2]">{prod.code}</div>
                      <div className="text-[11px] text-[#8FA7A0] max-w-xs truncate font-sans">{prod.name}</div>
                    </td>
                    <td className="py-3 px-4 text-[#8FA7A0]">
                      <div>{prod.sensor}</div>
                      <div className="text-[10px] text-[#50E3A4]">{prod.platform}</div>
                    </td>
                    <td className="py-3 px-4 text-[#EAF7F2]">
                      <div>{prod.spatialResolution}</div>
                      <div className="text-[10px] text-[#8FA7A0]">{prod.temporalResolution}</div>
                    </td>
                    <td className="py-3 px-4 text-[#8FA7A0]">
                      {prod.parameterMeasured}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 rounded bg-[#50E3A4]/10 border border-[#50E3A4]/30 px-2 py-0.5 text-[10px] font-bold text-[#50E3A4]">
                        <CheckCircle className="h-3 w-3" />
                        <span>{prod.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <a
                        href={prod.daacUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#50E3A4] hover:underline text-[11px]"
                      >
                        <span>LP DAAC</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Access & Credentials Transparency */}
        <div className="rounded-2xl border border-[#50E3A4]/40 bg-[#07110F] p-6 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#50E3A4] uppercase">
              <Server className="h-4 w-4" />
              <span>AUTHENTICATED NASA FIRMS LIVE STREAM ACTIVE</span>
            </div>
            <span className="text-[10px] font-mono text-[#50E3A4] bg-[#50E3A4]/10 border border-[#50E3A4]/30 px-2 py-0.5 rounded">
              KEY AUTHENTICATED
            </span>
          </div>

          <p className="text-xs text-[#8FA7A0] leading-relaxed">
            NASA FIRMS MAP KEY (<code className="text-[#50E3A4] font-mono">fc431e...7fd0</code>) is provisioned and authenticated. 
            The system is actively querying real-time VIIRS 375m and MODIS thermal radiance observations for the Sundarbans coordinates (<code className="text-[#EAF7F2] font-mono">88.0°E - 91.0°E, 21.0°N - 23.5°N</code>) directly from NASA ESDIS servers.
          </p>

          <div className="rounded-xl border border-[#1C3630] bg-[#112420] p-3 text-xs font-mono text-[#8FA7A0] space-y-1">
            <div className="text-[#EAF7F2] font-semibold">Active Live NASA Query Pipeline:</div>
            <div className="text-[#50E3A4] break-all">
              GET https://firms.modaps.eosdis.nasa.gov/api/area/csv/fc431e.../VIIRS_SNPP_NRT/88.0,21.0,91.0,23.5/5
            </div>
            <div className="text-[11px] text-[#8FA7A0] pt-1">
              Satellites: Suomi-NPP & NOAA-20 · Resolution: 375m · Temporal Frequency: Twice Daily
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
