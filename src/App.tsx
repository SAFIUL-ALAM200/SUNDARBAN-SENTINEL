/**
 * Sundarbans Sentinel - Main Application Controller
 * NASA Space Apps Challenge 2026 Prototype
 */

import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnomaliesPage } from './pages/AnomaliesPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { DataPage } from './pages/DataPage';
import { ReportPage } from './pages/ReportPage';
import { CycloneSimulationPage } from './pages/CycloneSimulationPage';
import { GroundTruthingPage } from './pages/GroundTruthingPage';
import { AlertDispatcherPage } from './pages/AlertDispatcherPage';
import { SalinityTrackerPage } from './pages/SalinityTrackerPage';
import { defaultNASAProvider } from './services/nasaDataProvider';
import { Language } from './services/i18n';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [language, setLanguage] = useState<Language>('en');
  const [dataSourceMode, setDataSourceMode] = useState<'LIVE_NASA' | 'CALIBRATED_DEMO'>(
    defaultNASAProvider.getDataSourceMode()
  );

  const handleToggleDataSource = () => {
    const nextMode = dataSourceMode === 'LIVE_NASA' ? 'CALIBRATED_DEMO' : 'LIVE_NASA';
    defaultNASAProvider.setDemoMode(nextMode === 'CALIBRATED_DEMO');
    setDataSourceMode(nextMode);
  };

  const handleToggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'bn' : 'en');
  };

  return (
    <div className="min-h-screen bg-[#07110F] text-[#EAF7F2] flex flex-col font-sans selection:bg-[#50E3A4]/30 selection:text-[#50E3A4]">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        dataSourceMode={dataSourceMode}
        onToggleDataSource={handleToggleDataSource}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onExplore={() => setCurrentTab('dashboard')}
            onOpenTimeMachine={() => setCurrentTab('dashboard')}
            onSelectTab={setCurrentTab}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            onOpenReport={() => setCurrentTab('report')}
            onSelectTab={setCurrentTab}
          />
        )}

        {currentTab === 'cyclone-simulation' && (
          <CycloneSimulationPage
            language={language}
            onOpenReport={() => setCurrentTab('report')}
          />
        )}

        {currentTab === 'ground-truthing' && (
          <GroundTruthingPage
            language={language}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertDispatcherPage
            language={language}
          />
        )}

        {currentTab === 'salinity' && (
          <SalinityTrackerPage
            language={language}
          />
        )}

        {currentTab === 'anomalies' && (
          <AnomaliesPage
            onOpenReport={() => setCurrentTab('report')}
            onNavigateToDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'methodology' && <MethodologyPage />}

        {currentTab === 'data' && <DataPage />}

        {currentTab === 'report' && <ReportPage />}
      </main>

      {/* Global Scientific Footer */}
      <Footer />
    </div>
  );
}
