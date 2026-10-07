/**
 * Sundarbans Sentinel - Application Footer
 * 
 * Includes scientific accountability notices, NASA Space Apps Challenge 2026 attribution,
 * and academic references.
 */

import React from 'react';
import { ShieldCheck, ExternalLink, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#1C3630] bg-[#07110F] py-8 text-xs text-[#8FA7A0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-base">🌳</span>
              <span className="font-mono font-bold text-sm text-[#EAF7F2]">SUNDARBANS SENTINEL</span>
            </div>
            <p className="text-xs text-[#8FA7A0] leading-relaxed max-w-md">
              An interactive Earth-observation intelligence system for monitoring ecological shifts, 
              canopy degradation, tidal inundation, and thermal stress across the Sundarbans mangrove delta.
            </p>
            <div className="text-[11px] font-mono text-[#50E3A4]">
              Developed for NASA Space Apps Challenge 2026 by Team Bangladesh.
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <div className="font-mono font-bold text-xs uppercase text-[#EAF7F2] tracking-wider">
              Earth-Observation Feeds
            </div>
            <ul className="space-y-1 text-xs">
              <li>
                <a href="https://earthdata.nasa.gov" target="_blank" rel="noreferrer" className="hover:text-[#50E3A4] transition-colors flex items-center gap-1">
                  <span>NASA Earthdata Search</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://firms.modaps.eosdis.nasa.gov/" target="_blank" rel="noreferrer" className="hover:text-[#50E3A4] transition-colors flex items-center gap-1">
                  <span>NASA FIRMS Active Fire</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://lpdaac.usgs.gov/" target="_blank" rel="noreferrer" className="hover:text-[#50E3A4] transition-colors flex items-center gap-1">
                  <span>USGS / NASA LP DAAC</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a href="https://landsat.gsfc.nasa.gov/" target="_blank" rel="noreferrer" className="hover:text-[#50E3A4] transition-colors flex items-center gap-1">
                  <span>Landsat Science Missions</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <div className="font-mono font-bold text-xs uppercase text-[#EAF7F2] tracking-wider">
              Scientific Principles
            </div>
            <ul className="space-y-1 text-xs">
              <li>· Non-causal observational reporting</li>
              <li>· Multi-decadal historical Z-scores</li>
              <li>· Sentinel-2 & Landsat 9 calibrated</li>
              <li>· Open science reproducible code</li>
            </ul>
          </div>
        </div>

        {/* Scientific Transparency Disclaimer Box */}
        <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-4 text-[11px] leading-relaxed">
          <div className="flex items-center gap-2 text-[#50E3A4] font-mono font-bold mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>SCIENTIFIC INTEGRITY & EDUCATIONAL PROTOTYPE NOTICE</span>
          </div>
          <p className="text-[#8FA7A0]">
            This application is an educational and research prototype developed for the NASA Space Apps Challenge 2026. 
            It is designed to democratize access to satellite-derived Earth observation indicators and statistical anomaly detection. 
            It does not replace official environmental monitoring, cyclone warnings, or statutory field surveys conducted by the 
            Bangladesh Forest Department, Ministry of Environment, Forest and Climate Change, or official NASA mission teams.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono border-t border-[#1C3630]/60 pt-4">
          <div>
            © 2026 Sundarbans Sentinel Team · Space Apps Bangladesh · Open Source MIT
          </div>
          <div className="text-[#8FA7A0] mt-2 sm:mt-0">
            Latitude 21.5°N - 22.8°N · Longitude 88.8°E - 90.1°E
          </div>
        </div>
      </div>
    </footer>
  );
};
