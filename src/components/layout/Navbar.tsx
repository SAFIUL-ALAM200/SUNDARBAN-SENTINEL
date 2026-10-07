/**
 * Sundarbans Sentinel - Top Navigation Bar
 * 
 * Features:
 * - Brand with NASA Space Apps 2026 attribution
 * - Full bilingual (English / বাংলা) language toggle
 * - Action-oriented conservation module navigation
 * - Data source provenance switcher (LIVE NASA DATA vs CALIBRATED DEMO DATA)
 */

import React from 'react';
import { 
  Satellite, 
  Database, 
  Wind, 
  ShieldCheck, 
  Bell, 
  Droplets, 
  FileText, 
  BookOpen, 
  AlertTriangle, 
  Globe2 
} from 'lucide-react';
import { Language, getTranslation } from '../../services/i18n';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  dataSourceMode: 'LIVE_NASA' | 'CALIBRATED_DEMO';
  onToggleDataSource: () => void;
  language: Language;
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  dataSourceMode,
  onToggleDataSource,
  language,
  onToggleLanguage
}) => {
  const t = (key: string) => getTranslation(key, language);

  return (
    <header className="sticky top-0 z-40 border-b border-[#1C3630] bg-[#07110F]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Brand */}
        <div 
          onClick={() => onSelectTab('landing')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#50E3A4]/15 border border-[#50E3A4]/40 text-[#50E3A4] shadow-[0_0_15px_rgba(80,227,164,0.15)] group-hover:border-[#50E3A4] transition-all">
            <span className="text-lg">🌳</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-wider font-mono text-[#EAF7F2] uppercase">
                {t('appTitle')}
              </span>
              <span className="text-[10px] font-mono text-[#8FA7A0] hidden xl:inline">
                / {t('nasaSpaceApps')}
              </span>
            </div>
            <div className="text-[10px] text-[#8FA7A0] font-sans -mt-0.5 hidden sm:block">
              {t('appSubtitle')}
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Clean, scientific typography */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-5 text-xs font-mono">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'dashboard'
                ? 'text-[#50E3A4] border-b-2 border-[#50E3A4] font-semibold'
                : 'text-[#8FA7A0] hover:text-[#EAF7F2]'
            }`}
          >
            <Satellite className="h-3.5 w-3.5" />
            <span>{t('navSatelliteMap')}</span>
          </button>

          <button
            onClick={() => onSelectTab('cyclone-simulation')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'cyclone-simulation'
                ? 'text-[#50E3A4] border-b-2 border-[#50E3A4] font-semibold'
                : 'text-[#8FA7A0] hover:text-[#EAF7F2]'
            }`}
          >
            <Wind className="h-3.5 w-3.5" />
            <span>{t('navCycloneSimulation')}</span>
          </button>

          <button
            onClick={() => onSelectTab('ground-truthing')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'ground-truthing'
                ? 'text-[#50E3A4] border-b-2 border-[#50E3A4] font-semibold'
                : 'text-[#8FA7A0] hover:text-[#EAF7F2]'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{t('navGroundTruthing')}</span>
          </button>

          <button
            onClick={() => onSelectTab('alerts')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'alerts'
                ? 'text-[#50E3A4] border-b-2 border-[#50E3A4] font-semibold'
                : 'text-[#8FA7A0] hover:text-[#EAF7F2]'
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            <span>{t('navAlertDispatcher')}</span>
          </button>

          <button
            onClick={() => onSelectTab('salinity')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'salinity'
                ? 'text-[#50E3A4] border-b-2 border-[#50E3A4] font-semibold'
                : 'text-[#8FA7A0] hover:text-[#EAF7F2]'
            }`}
          >
            <Droplets className="h-3.5 w-3.5" />
            <span>{t('navSalinityTracker')}</span>
          </button>

          <button
            onClick={() => onSelectTab('report')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              currentTab === 'report'
                ? 'text-[#50E3A4] border-b-2 border-[#50E3A4] font-semibold'
                : 'text-[#8FA7A0] hover:text-[#EAF7F2]'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>{t('navReportGenerator')}</span>
          </button>
        </nav>

        {/* Right Tools: Language Switcher & Provenance Mode */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bilingual Language Switcher Button */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 rounded-lg border border-[#1C3630] bg-[#112420] px-2.5 py-1.5 text-xs font-mono text-[#EAF7F2] hover:border-[#50E3A4] transition-all cursor-pointer shadow-sm"
            title="Toggle English / বাংলা"
          >
            <Globe2 className="h-3.5 w-3.5 text-[#50E3A4]" />
            <span className="font-bold">{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Data Mode Switcher */}
          <button
            onClick={onToggleDataSource}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-mono transition-all cursor-pointer ${
              dataSourceMode === 'LIVE_NASA'
                ? 'border-[#50E3A4]/60 bg-[#50E3A4]/10 text-[#50E3A4] shadow-[0_0_10px_rgba(80,227,164,0.15)]'
                : 'border-[#F5C451]/50 bg-[#F5C451]/10 text-[#F5C451]'
            }`}
            title="Toggle Live NASA Data stream vs Calibrated Demo Data"
          >
            <span className={`h-2 w-2 rounded-full ${
              dataSourceMode === 'LIVE_NASA' ? 'bg-[#50E3A4] animate-pulse' : 'bg-[#F5C451]'
            }`} />
            <span className="font-semibold text-[10px] sm:text-[11px] hidden sm:inline">
              {dataSourceMode === 'LIVE_NASA' ? t('liveNasaData') : t('demoData')}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Scroll Row */}
      <div className="lg:hidden flex items-center border-t border-[#1C3630] py-2 px-3 text-[11px] font-mono bg-[#0D1B18]/90 overflow-x-auto gap-2 scrollbar-none">
        <button
          onClick={() => onSelectTab('landing')}
          className={`px-2 py-1 rounded shrink-0 ${currentTab === 'landing' ? 'bg-[#50E3A4]/15 text-[#50E3A4] font-bold' : 'text-[#8FA7A0]'}`}
        >
          {t('navOverview')}
        </button>
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`px-2 py-1 rounded shrink-0 ${currentTab === 'dashboard' ? 'bg-[#50E3A4]/15 text-[#50E3A4] font-bold' : 'text-[#8FA7A0]'}`}
        >
          {t('navSatelliteMap')}
        </button>
        <button
          onClick={() => onSelectTab('cyclone-simulation')}
          className={`px-2 py-1 rounded shrink-0 ${currentTab === 'cyclone-simulation' ? 'bg-[#50E3A4]/15 text-[#50E3A4] font-bold' : 'text-[#8FA7A0]'}`}
        >
          {t('navCycloneSimulation')}
        </button>
        <button
          onClick={() => onSelectTab('ground-truthing')}
          className={`px-2 py-1 rounded shrink-0 ${currentTab === 'ground-truthing' ? 'bg-[#50E3A4]/15 text-[#50E3A4] font-bold' : 'text-[#8FA7A0]'}`}
        >
          {t('navGroundTruthing')}
        </button>
        <button
          onClick={() => onSelectTab('alerts')}
          className={`px-2 py-1 rounded shrink-0 ${currentTab === 'alerts' ? 'bg-[#50E3A4]/15 text-[#50E3A4] font-bold' : 'text-[#8FA7A0]'}`}
        >
          {t('navAlertDispatcher')}
        </button>
        <button
          onClick={() => onSelectTab('salinity')}
          className={`px-2 py-1 rounded shrink-0 ${currentTab === 'salinity' ? 'bg-[#50E3A4]/15 text-[#50E3A4] font-bold' : 'text-[#8FA7A0]'}`}
        >
          {t('navSalinityTracker')}
        </button>
        <button
          onClick={() => onSelectTab('report')}
          className={`px-2 py-1 rounded shrink-0 ${currentTab === 'report' ? 'bg-[#50E3A4]/15 text-[#50E3A4] font-bold' : 'text-[#8FA7A0]'}`}
        >
          {t('navReportGenerator')}
        </button>
      </div>
    </header>
  );
};
