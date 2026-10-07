/**
 * Sundarbans Sentinel - Environmental Monitoring Report Generator
 * 
 * Generates an official, scientifically transparent satellite report.
 * Exports:
 * - Print / PDF format (styled print-ready CSS & direct jsPDF download)
 * - JSON Telemetry download
 * - Full bilingual support (English / বাংলা)
 */

import React, { useState } from 'react';
import { MONITORING_ZONES } from '../data/sundarbansGeo';
import { defaultNASAProvider, TIMELINE_MILESTONES } from '../services/nasaDataProvider';
import { Printer, Download, FileText, CheckCircle2, ShieldCheck, AlertTriangle, Loader2, Globe2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Language, getTranslation } from '../services/i18n';

interface ReportPageProps {
  language?: Language;
}

export const ReportPage: React.FC<ReportPageProps> = ({ language: defaultLang = 'en' }) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('central-khulna');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [reportLang, setReportLang] = useState<Language>(defaultLang);
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);

  const zone = MONITORING_ZONES.find(z => z.id === selectedZoneId) || MONITORING_ZONES[0];
  const observations = defaultNASAProvider.getZoneObservations(zone.id, selectedYear);
  const zoneAnomalies = defaultNASAProvider.getAnomalies(zone.id, selectedYear);
  const milestone = TIMELINE_MILESTONES.find(m => m.year === selectedYear) || TIMELINE_MILESTONES[TIMELINE_MILESTONES.length - 1];

  const handlePrint = () => {
    window.print();
  };

  const handleSavePDF = async () => {
    setIsExportingPDF(true);
    try {
      const element = document.getElementById('printable-report-content');
      if (!element) {
        window.print();
        return;
      }

      // Generate high-resolution canvas with html2canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#0D1B18'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`sundarbans-sentinel-report-${zone.id}-${selectedYear}-${reportLang}.pdf`);
    } catch (err) {
      console.warn('PDF generation encountered an issue, opening print dialog:', err);
      window.print();
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportJSON = () => {
    const reportData = {
      reportTitle: reportLang === 'bn' 
        ? "সুন্দরবন সেন্টিনেল পরিবেশ ও সংরক্ষণ পর্যবেক্ষণ প্রতিবেদন"
        : "SUNDARBANS SENTINEL ENVIRONMENTAL MONITORING REPORT",
      organization: "NASA Space Apps Challenge 2026 - Bangladesh Team",
      language: reportLang,
      generatedAt: new Date().toISOString(),
      zone: {
        id: zone.id,
        name: zone.name,
        bengaliName: zone.bengaliName,
        range: zone.range,
        areaKm2: zone.areaKm2,
        center: zone.center
      },
      observationPeriod: {
        year: selectedYear,
        month: observations.month,
        timestamp: observations.timestamp
      },
      indicators: {
        vegetation: observations.vegetation,
        water: observations.water,
        temperature: observations.temperature,
        fire: observations.fire,
        overallHealthScore: observations.overallHealthScore
      },
      anomalies: zoneAnomalies,
      disclaimers: {
        scientificNotice: "This application is an educational and research prototype. Satellite-derived observations, statistical anomaly detection, and modelled interpretations do not replace official statutory warnings."
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sundarbans-sentinel-report-${zone.id}-${selectedYear}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07110F] text-[#EAF7F2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Controls Bar (Hidden during print) */}
        <div className="print:hidden rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#50E3A4] uppercase tracking-wider mb-1">
              {reportLang === 'bn' ? 'কনফিগারেশন প্যানেল' : 'Configuration Panel'}
            </div>
            <h1 className="text-xl font-bold font-mono text-[#EAF7F2]">
              {reportLang === 'bn' 
                ? 'পরিবেশ পর্যবেক্ষণ ও সংরক্ষণ প্রতিবেদন তৈরি' 
                : 'Generate Environmental Monitoring Report'}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Zone Selector */}
            <select
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
              className="rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-xs font-mono text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4] cursor-pointer"
            >
              {MONITORING_ZONES.map(z => (
                <option key={z.id} value={z.id}>
                  {reportLang === 'bn' ? `${z.bengaliName} (${z.name})` : z.name}
                </option>
              ))}
            </select>

            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-xs font-mono text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4] cursor-pointer"
            >
              {[2000, 2004, 2007, 2009, 2013, 2016, 2020, 2022, 2024, 2026].map(y => (
                <option key={y} value={y}>Epoch: {y}</option>
              ))}
            </select>

            {/* Report Language Toggle */}
            <button
              onClick={() => setReportLang(l => l === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-1.5 rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-xs font-mono text-[#50E3A4] hover:bg-[#1C3630] transition-colors"
              title="Toggle Report Language (English / বাংলা)"
            >
              <Globe2 className="h-3.5 w-3.5" />
              <span>{reportLang === 'en' ? 'বাংলা রিপোর্ট' : 'English Report'}</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-xs font-mono text-[#8FA7A0] hover:text-[#50E3A4] hover:border-[#50E3A4]/40 transition-colors"
              title="Download raw JSON telemetry"
            >
              <Download className="h-4 w-4" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-xs font-mono text-[#EAF7F2] hover:bg-[#1C3630] transition-colors"
              title="Open browser print dialog"
            >
              <Printer className="h-4 w-4 text-[#50E3A4]" />
              <span>{reportLang === 'bn' ? 'প্রিন্ট ডায়ালগ' : 'Print Dialog'}</span>
            </button>

            <button
              onClick={handleSavePDF}
              disabled={isExportingPDF}
              className="flex items-center gap-1.5 rounded-lg bg-[#50E3A4] px-4 py-2 text-xs font-bold text-[#07110F] hover:bg-[#3ec48a] transition-all shadow-lg shadow-[#50E3A4]/20 disabled:opacity-50"
              title="Directly export and download high-resolution PDF file"
            >
              {isExportingPDF ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{reportLang === 'bn' ? 'পিডিএফ প্রস্তুত হচ্ছে...' : 'Generating PDF...'}</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>{reportLang === 'bn' ? 'পিডিএফ সংরক্ষণ' : 'Save as PDF'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT DOCUMENT */}
        <div 
          id="printable-report-content"
          className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-8 shadow-2xl space-y-6 text-[#EAF7F2] print:bg-white print:text-black print:border-none print:shadow-none print:p-0"
        >
          {/* Document Header */}
          <div className="border-b border-[#1C3630] print:border-black pb-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-[#50E3A4] print:text-emerald-700 font-bold uppercase tracking-wider">
                  NASA SPACE APPS CHALLENGE 2026 · TEAM BANGLADESH
                </div>
                <h2 className="text-2xl font-bold font-mono text-[#EAF7F2] print:text-black mt-1">
                  {reportLang === 'bn' 
                    ? 'সুন্দরবন সেন্টিনেল পরিবেশ ও সংরক্ষণ প্রতিবেদন' 
                    : 'SUNDARBANS SENTINEL MONITORING REPORT'}
                </h2>
                <div className="text-xs text-[#8FA7A0] print:text-gray-600 font-mono mt-0.5">
                  {reportLang === 'bn' 
                    ? 'ভূ-পর্যবেক্ষণ প্রোটোকল: মাল্টি-স্পেকট্রাল, তাপীয় ও লবণাক্ততা বিশ্লেষণ'
                    : 'Earth Observation Protocol: Multi-Spectral, Thermal & Salinity Anomaly Analysis'}
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                <div className="text-[#8FA7A0] print:text-gray-500 text-[10px] uppercase">
                  {reportLang === 'bn' ? 'প্রতিবেদন রেফারেন্স' : 'Report Reference'}
                </div>
                <div className="text-[#50E3A4] print:text-emerald-700 font-bold">
                  SENTINEL-{selectedYear}-{zone.id.toUpperCase()}
                </div>
                <div className="text-[10px] text-[#8FA7A0] print:text-gray-500">
                  {reportLang === 'bn' ? 'তারিখ' : 'Date'}: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Mandatory Disclaimers Bar */}
            <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="rounded bg-[#112420] print:bg-gray-100 border border-[#1C3630] print:border-gray-300 px-2 py-0.5 text-[#50E3A4] print:text-emerald-800">
                ✓ {reportLang === 'bn' ? 'স্যাটেলাইট-উৎস ডেটা' : 'Satellite-derived observations'}
              </span>
              <span className="rounded bg-[#112420] print:bg-gray-100 border border-[#1C3630] print:border-gray-300 px-2 py-0.5 text-[#60A5FA] print:text-blue-800">
                ✓ {reportLang === 'bn' ? 'অ্যালগরিদমীয় সূচক' : 'Application-derived indicators'}
              </span>
              <span className="rounded bg-[#112420] print:bg-gray-100 border border-[#1C3630] print:border-gray-300 px-2 py-0.5 text-[#F5C451] print:text-amber-800">
                ✓ {reportLang === 'bn' ? 'পরিসংখ্যানিক অসঙ্গতি সনাক্তকরণ' : 'Statistical anomaly detection'}
              </span>
              <span className="rounded bg-[#112420] print:bg-gray-100 border border-[#1C3630] print:border-gray-300 px-2 py-0.5 text-[#8FA7A0] print:text-gray-800">
                ✓ {reportLang === 'bn' ? 'মডেলভিত্তিক পরিবেশ ব্যাখ্যা' : 'Modelled interpretation'}
              </span>
            </div>
          </div>

          {/* Target Zone Profile */}
          <div className="rounded-xl border border-[#1C3630] print:border-gray-300 bg-[#07110F] print:bg-gray-50 p-4">
            <h3 className="text-xs font-mono font-bold text-[#50E3A4] print:text-emerald-700 uppercase mb-2">
              {reportLang === 'bn' ? 'নির্দিষ্ট অঞ্চলের পরিমিতি' : 'Target Monitoring Zone Parameters'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <div className="text-[10px] text-[#8FA7A0] print:text-gray-500">
                  {reportLang === 'bn' ? 'অঞ্চলের নাম' : 'ZONE NAME'}
                </div>
                <div className="font-bold text-[#EAF7F2] print:text-black mt-0.5">
                  {reportLang === 'bn' ? zone.bengaliName : zone.name}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#8FA7A0] print:text-gray-500">
                  {reportLang === 'bn' ? 'রেঞ্জ' : 'RANGE'}
                </div>
                <div className="font-bold text-[#EAF7F2] print:text-black mt-0.5">{zone.range}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#8FA7A0] print:text-gray-500">
                  {reportLang === 'bn' ? 'মোট আয়তন' : 'SURFACE EXTENT'}
                </div>
                <div className="font-bold text-[#EAF7F2] print:text-black mt-0.5">{zone.areaKm2} km²</div>
              </div>
              <div>
                <div className="text-[10px] text-[#8FA7A0] print:text-gray-500">
                  {reportLang === 'bn' ? 'কেন্দ্রীয় স্থানাঙ্ক' : 'COORDINATES'}
                </div>
                <div className="font-bold text-[#EAF7F2] print:text-black mt-0.5">
                  {zone.center[1]}°N, {zone.center[0]}°E
                </div>
              </div>
            </div>
          </div>

          {/* Indicators Table */}
          <div>
            <h3 className="text-xs font-mono font-bold text-[#8FA7A0] print:text-gray-700 uppercase mb-2">
              {reportLang === 'bn' ? 'পরিবেশগত স্বাস্থ্য সূচক পর্যবেক্ষণ' : 'Ecosystem Indicator Observations'}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border border-[#1C3630] print:border-gray-300">
                <thead className="bg-[#07110F] print:bg-gray-100 text-[#8FA7A0] print:text-gray-600 border-b border-[#1C3630] print:border-gray-300">
                  <tr>
                    <th className="py-2 px-3">{reportLang === 'bn' ? 'সূচক' : 'Indicator'}</th>
                    <th className="py-2 px-3">{reportLang === 'bn' ? 'বর্তমান মান' : 'Observed Value'}</th>
                    <th className="py-2 px-3">{reportLang === 'bn' ? 'ঐতিহাসিক বেসলাইন' : 'Baseline'}</th>
                    <th className="py-2 px-3">{reportLang === 'bn' ? 'পরিবর্তন %' : 'Change %'}</th>
                    <th className="py-2 px-3">{reportLang === 'bn' ? 'জেড-স্কোর' : 'Z-Score'}</th>
                    <th className="py-2 px-3">{reportLang === 'bn' ? 'অবস্থা' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C3630] print:divide-gray-300 text-xs">
                  {/* Vegetation */}
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#EAF7F2] print:text-black">
                      🌿 {reportLang === 'bn' ? 'উদ্ভিদ ঘনত্ব (NDVI)' : 'Vegetation Health (NDVI)'}
                    </td>
                    <td className="py-2.5 px-3 text-[#50E3A4] print:text-emerald-700 font-bold">
                      {observations.vegetation.currentValue}
                    </td>
                    <td className="py-2.5 px-3 text-[#8FA7A0] print:text-gray-600">
                      {observations.vegetation.historicalBaseline} ± {observations.vegetation.historicalStd}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={observations.vegetation.changePercent < 0 ? 'text-[#FF6B6B] print:text-red-700' : 'text-[#50E3A4] print:text-emerald-700'}>
                        {observations.vegetation.changePercent > 0 ? '+' : ''}{observations.vegetation.changePercent}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      {observations.vegetation.zScore}σ
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-[10px] uppercase">
                        {observations.vegetation.status}
                      </span>
                    </td>
                  </tr>

                  {/* Water */}
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#EAF7F2] print:text-black">
                      💧 {reportLang === 'bn' ? 'জলীয় বিস্তার (NDWI)' : 'Surface Water Extent (NDWI)'}
                    </td>
                    <td className="py-2.5 px-3 text-[#60A5FA] print:text-blue-700 font-bold">
                      {observations.water.currentValue}
                    </td>
                    <td className="py-2.5 px-3 text-[#8FA7A0] print:text-gray-600">
                      {observations.water.historicalBaseline} ± {observations.water.historicalStd}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={observations.water.changePercent > 0 ? 'text-[#60A5FA] print:text-blue-700' : 'text-[#8FA7A0] print:text-gray-600'}>
                        {observations.water.changePercent > 0 ? '+' : ''}{observations.water.changePercent}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      {observations.water.zScore}σ
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-[10px] uppercase">
                        {observations.water.status}
                      </span>
                    </td>
                  </tr>

                  {/* Temperature */}
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#EAF7F2] print:text-black">
                      🌡️ {reportLang === 'bn' ? 'ভূ-পৃষ্ঠের তাপমাত্রা (LST)' : 'Land Surface Temp (MOD11A2)'}
                    </td>
                    <td className="py-2.5 px-3 text-[#F5C451] print:text-amber-700 font-bold">
                      {observations.temperature.currentValue} K
                    </td>
                    <td className="py-2.5 px-3 text-[#8FA7A0] print:text-gray-600">
                      {observations.temperature.historicalBaseline} ± {observations.temperature.historicalStd} K
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={observations.temperature.changePercent > 0 ? 'text-[#F5C451] print:text-amber-700' : 'text-[#8FA7A0] print:text-gray-600'}>
                        {observations.temperature.changePercent > 0 ? '+' : ''}{observations.temperature.changePercent}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      {observations.temperature.zScore}σ
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-[10px] uppercase">
                        {observations.temperature.status}
                      </span>
                    </td>
                  </tr>

                  {/* Fire */}
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#EAF7F2] print:text-black">
                      🔥 {reportLang === 'bn' ? 'নাসা ফার্মস ফায়ার হটস্পট' : 'Active Fire Hotspots (FIRMS)'}
                    </td>
                    <td className="py-2.5 px-3 text-[#FF6B6B] print:text-red-700 font-bold">
                      {observations.fire.currentValue} {reportLang === 'bn' ? 'হটস্পট' : 'spots'}
                    </td>
                    <td className="py-2.5 px-3 text-[#8FA7A0] print:text-gray-600">
                      {observations.fire.historicalBaseline} avg
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={observations.fire.currentValue > 0 ? 'text-[#FF6B6B] print:text-red-700' : 'text-[#8FA7A0] print:text-gray-600'}>
                        {observations.fire.changePercent > 0 ? '+' : ''}{observations.fire.changePercent}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      {observations.fire.zScore}σ
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-[10px] uppercase">
                        {observations.fire.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Anomaly Narrative & Contributing Factors */}
          <div>
            <h3 className="text-xs font-mono font-bold text-[#8FA7A0] print:text-gray-700 uppercase mb-2">
              {reportLang === 'bn' ? 'সনাক্তকৃত অসঙ্গতি ও পরিবেশগত প্রভাব' : 'Detected Anomaly Context & Ecological Drivers'}
            </h3>

            {zoneAnomalies.length > 0 ? (
              <div className="space-y-3">
                {zoneAnomalies.map(anom => (
                  <div key={anom.id} className="rounded-xl border border-[#1C3630] print:border-gray-300 p-3.5 bg-[#07110F] print:bg-white text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#F5C451] print:text-amber-800 uppercase">
                        {anom.title}
                      </span>
                      <span className="font-mono text-[#8FA7A0] print:text-gray-500">
                        {anom.severity} ({Math.abs(anom.zScore)}σ)
                      </span>
                    </div>
                    <p className="text-[#8FA7A0] print:text-gray-700 mt-1 leading-relaxed">
                      {anom.summary}
                    </p>
                    <div className="text-[11px] font-mono text-[#50E3A4] print:text-emerald-800 mt-2">
                      <strong>Contributing Factors: </strong> {anom.contributingFactors.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 text-xs text-[#8FA7A0] print:text-gray-600 rounded-lg border border-[#1C3630] print:border-gray-300">
                {reportLang === 'bn' 
                  ? 'এই অঞ্চলে কোনো চরম পরিবেশগত বিচ্যুতি বা সংকেত পাওয়া যায়নি।' 
                  : 'No critical statistical outlier events recorded for this zone in the specified observation window.'}
              </div>
            )}
          </div>

          {/* Institutional Statutory Disclaimers */}
          <div className="rounded-xl border border-[#1C3630] print:border-gray-300 bg-[#07110F] print:bg-gray-50 p-4 text-xs font-mono">
            <div className="text-[#50E3A4] print:text-emerald-800 font-bold mb-1">
              {reportLang === 'bn' ? 'সংবিধিবদ্ধ গবেষণা ও সতর্কতা বিজ্ঞপ্তি' : 'INSTITUTIONAL SCIENTIFIC NOTICE & STATUTORY DISCLAIMER'}
            </div>
            <p className="text-[#8FA7A0] print:text-gray-700 leading-relaxed">
              {reportLang === 'bn'
                ? 'এই প্ল্যাটফর্মটি নাসা স্পেস অ্যাপস চ্যালেঞ্জ ২০২৬-এর অধীনে তৈরি একটি বৈজ্ঞানিক গবেষণা প্রোটোটাইপ। উপগ্রহভিত্তিক পর্যবেক্ষণ ও গাণিতিক পরিসংখ্যান সরকারি প্রাতিষ্ঠানিক নির্দেশিকার বিকল্প নয়। মাঠপর্যায়ের সিদ্ধান্ত গ্রহণের পূর্বে বাংলাদেশ বন বিভাগ এবং সরকারি দুর্যোগ ব্যবস্থাপনা কর্তৃপক্ষের চূড়ান্ত অনুমোদন আবশ্যক।'
                : 'This platform is developed as a scientific research and educational prototype under the NASA Space Apps Challenge 2026. Satellite observations, derived indices, statistical anomaly detections, and modelled interpretations are experimental indicators and do not replace official statutory warnings, cyclone advisories, or directives issued by the Bangladesh Forest Department or national disaster authorities.'}
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="border-t border-[#1C3630] print:border-black pt-4 text-[10px] text-[#8FA7A0] print:text-gray-500 font-mono space-y-1">
            <div className="flex justify-between">
              <span>Sundarbans Sentinel Earth Observation Core</span>
              <span>Generated by NASA Space Apps Challenge 2026 Bangladesh Team</span>
            </div>
            <div>
              Data Provenance: NASA MODIS (MOD13Q1, MOD11A2), Landsat 8-9 (OLI-2/TIRS-2), NASA FIRMS (VIIRS 375m).
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
