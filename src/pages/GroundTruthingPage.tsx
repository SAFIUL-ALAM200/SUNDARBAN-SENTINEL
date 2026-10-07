/**
 * Sundarbans Sentinel - Community Science & Ground-Truthing Layer
 * 
 * Features:
 * - Mobile-first field submission form for forest rangers, researchers, and local NGOs
 * - Satellite vs Ground-Truth validation mechanism with confidence scoring
 * - Geotagged observation repository with filterable categories
 * - Full bilingual localization support (English / বাংলা)
 */

import React, { useState } from 'react';
import { 
  GroundTruthService, 
  FieldObservation, 
  ObservationCategory, 
  ValidationStatus 
} from '../services/groundTruthService';
import { MONITORING_ZONES } from '../data/sundarbansGeo';
import { Language, getTranslation } from '../services/i18n';
import { 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Plus, 
  Filter, 
  Eye, 
  Camera, 
  Droplets, 
  Trees, 
  Compass,
  FileCheck
} from 'lucide-react';

interface GroundTruthingPageProps {
  language: Language;
}

export const GroundTruthingPage: React.FC<GroundTruthingPageProps> = ({ language }) => {
  const [observations, setObservations] = useState<FieldObservation[]>(() => 
    GroundTruthService.getObservations()
  );

  // Form Modal State
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Form Fields
  const [reporterName, setReporterName] = useState('');
  const [reporterRole, setReporterRole] = useState<'FOREST_RANGER' | 'WILDLIFE_BIOLOGIST' | 'NGO_FIELD_OFFICER' | 'COMMUNITY_BAWALI'>('FOREST_RANGER');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState(MONITORING_ZONES[0].id);
  const [category, setCategory] = useState<ObservationCategory>('CANOPY_DAMAGE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [salinityInput, setSalinityInput] = useState<string>('');
  const [latInput, setLatInput] = useState('22.05');
  const [lngInput, setLngInput] = useState('89.55');

  const t = (key: string) => getTranslation(key, language);

  const handleSubmitObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const matchedZone = MONITORING_ZONES.find(z => z.id === selectedZoneId) || MONITORING_ZONES[0];

    const newObs = GroundTruthService.addObservation({
      reporterName: reporterName || 'Anonymous Ranger',
      reporterRole: reporterRole,
      badgeNumber: badgeNumber || undefined,
      zoneId: matchedZone.id,
      zoneName: matchedZone.name,
      coordinates: [parseFloat(lngInput) || matchedZone.center[0], parseFloat(latInput) || matchedZone.center[1]],
      category: category,
      title: title,
      description: description,
      measuredSalinityPpt: salinityInput ? parseFloat(salinityInput) : undefined
    });

    setObservations([newObs, ...observations]);
    setIsSubmitOpen(false);

    // Reset Form
    setTitle('');
    setDescription('');
    setSalinityInput('');
  };

  const filteredObservations = observations.filter(obs => {
    if (filterCategory === 'ALL') return true;
    return obs.category === filterCategory;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07110F] text-[#EAF7F2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header Bar */}
        <div className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#50E3A4] uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>{t('groundTruthTitle')}</span>
            </div>
            <h1 className="text-2xl font-bold font-mono text-[#EAF7F2]">
              {language === 'bn' 
                ? 'মাঠপর্যায়ের পর্যবেক্ষণ ও উপগ্রহ যাচাইকরণ নেটওয়ার্ক' 
                : 'In-Situ Field Intelligence & Satellite Cross-Validation'}
            </h1>
            <p className="text-xs text-[#8FA7A0] max-w-3xl mt-1">
              {t('groundTruthSubtitle')}
            </p>
          </div>

          <button
            onClick={() => setIsSubmitOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#50E3A4] px-4 py-2.5 text-xs font-bold font-mono text-[#07110F] hover:bg-[#3ec48a] transition-all shadow-lg shadow-[#50E3A4]/20 self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>{t('submitObservation')}</span>
          </button>
        </div>

        {/* Validation Accuracy Metrics Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-4 shadow-md flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#50E3A4]/15 border border-[#50E3A4]/30 text-[#50E3A4]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#8FA7A0] uppercase">
                {language === 'bn' ? 'উপগ্রহে নিশ্চিত পরিবর্তন' : 'Confirmed Satellite Matches'}
              </div>
              <div className="text-lg font-bold font-mono text-[#50E3A4]">
                94.2% {language === 'bn' ? 'নির্ভুলতা' : 'Agreement'}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-4 shadow-md flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5C451]/15 border border-[#F5C451]/30 text-[#F5C451]">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#8FA7A0] uppercase">
                {language === 'bn' ? 'মেঘের ছায়া / ভুল সংকেত সংশোধন' : 'False Alarms Filtered'}
              </div>
              <div className="text-lg font-bold font-mono text-[#F5C451]">
                18 {language === 'bn' ? 'টি মেঘের ছায়া সনাক্ত' : 'Cloud Shadows Resolved'}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-4 shadow-md flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#60A5FA]/15 border border-[#60A5FA]/30 text-[#60A5FA]">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-[#8FA7A0] uppercase">
                {language === 'bn' ? 'মাঠে পরিমাপকৃত লবণাক্ততা' : 'Field Salinity Logged'}
              </div>
              <div className="text-lg font-bold font-mono text-[#60A5FA]">
                28.4 ppt {language === 'bn' ? 'সর্বোচ্চ স্তর' : 'Peak Measured'}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C3630] pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-[#50E3A4]" />
            <span className="text-xs font-mono text-[#8FA7A0] uppercase font-bold">
              {language === 'bn' ? 'বিভাগ অনুযায়ী ফিল্টার:' : 'Filter Category:'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {['ALL', 'CANOPY_DAMAGE', 'SALINITY_CHECK', 'WILDLIFE_SIGHTING', 'WATER_INUNDATION', 'ILLEGAL_FELLING'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-md border transition-all ${
                  filterCategory === cat
                    ? 'border-[#50E3A4] bg-[#50E3A4]/15 text-[#50E3A4] font-bold'
                    : 'border-[#1C3630] bg-[#112420] text-[#8FA7A0] hover:text-[#EAF7F2]'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Observations List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredObservations.map(obs => (
            <div 
              key={obs.id}
              className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-5 shadow-xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                {/* Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                    obs.validationStatus === 'CONFIRMED_BY_SATELLITE'
                      ? 'border-[#50E3A4]/40 bg-[#50E3A4]/15 text-[#50E3A4]'
                      : obs.validationStatus === 'FALSE_ALARM_CLOUD_SHADOW'
                      ? 'border-[#F5C451]/40 bg-[#F5C451]/15 text-[#F5C451]'
                      : 'border-[#60A5FA]/40 bg-[#60A5FA]/15 text-[#60A5FA]'
                  }`}>
                    {obs.validationStatus === 'CONFIRMED_BY_SATELLITE' && '✓ SATELLITE CONFIRMED'}
                    {obs.validationStatus === 'FALSE_ALARM_CLOUD_SHADOW' && '⚠ CLOUD ARTIFACT'}
                    {obs.validationStatus === 'SUBPIXEL_CLEARANCE_DETECTED' && '🔎 SUB-PIXEL GAP'}
                    {obs.validationStatus === 'PENDING_NEXT_OVERPASS' && '⏳ PENDING PASS'}
                  </span>

                  <span className="text-[10px] font-mono text-[#8FA7A0]">
                    {new Date(obs.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#EAF7F2] font-mono leading-snug">
                  {obs.title}
                </h3>

                <p className="text-xs text-[#8FA7A0] leading-relaxed">
                  {obs.description}
                </p>

                {obs.measuredSalinityPpt !== undefined && (
                  <div className="inline-flex items-center gap-1.5 rounded bg-[#112420] border border-[#1C3630] px-2 py-1 text-xs font-mono text-[#60A5FA]">
                    <Droplets className="h-3 w-3" />
                    <span>In-Situ Salinity: <strong className="text-[#EAF7F2]">{obs.measuredSalinityPpt} ppt</strong></span>
                  </div>
                )}
              </div>

              {/* Cross-Validation & Provenance Footer */}
              <div className="pt-3 border-t border-[#1C3630] space-y-2 text-xs font-mono">
                <div className="text-[10px] text-[#8FA7A0] bg-[#112420]/80 p-2 rounded border border-[#1C3630]/60">
                  <span className="text-[#50E3A4] font-semibold">Satellite Cross-Check ({obs.satelliteConfidenceScore}%):</span> {obs.validationNotes}
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#8FA7A0]">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-[#50E3A4]" />
                    <span>{obs.zoneName}</span>
                  </div>
                  <div>
                    {obs.reporterName} {obs.badgeNumber ? `(${obs.badgeNumber})` : ''}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Submission Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C3630] pb-3">
              <h2 className="text-lg font-bold font-mono text-[#EAF7F2] flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-[#50E3A4]" />
                <span>{t('submitObservation')}</span>
              </h2>
              <button 
                onClick={() => setIsSubmitOpen(false)}
                className="text-[#8FA7A0] hover:text-[#EAF7F2] text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitObservation} className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8FA7A0] block mb-1">Reporter Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ranger Jahangir"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
                  />
                </div>
                <div>
                  <label className="text-[#8FA7A0] block mb-1">Badge ID / Affiliation</label>
                  <input
                    type="text"
                    placeholder="e.g. BFD-SAR-204"
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                    className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8FA7A0] block mb-1">Monitoring Zone</label>
                  <select
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(e.target.value)}
                    className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
                  >
                    {MONITORING_ZONES.map(z => (
                      <option key={z.id} value={z.id}>{z.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#8FA7A0] block mb-1">Observation Type</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ObservationCategory)}
                    className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
                  >
                    <option value="CANOPY_DAMAGE">Canopy Damage / Dieback</option>
                    <option value="SALINITY_CHECK">Water Salinity (ppt)</option>
                    <option value="WILDLIFE_SIGHTING">Wildlife Sighting</option>
                    <option value="WATER_INUNDATION">Water Inundation / Dyke Leak</option>
                    <option value="ILLEGAL_FELLING">Illegal Felling Sub-pixel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#8FA7A0] block mb-1">Report Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Branch snap and yellowing along Kochikhali Khal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
                />
              </div>

              <div>
                <label className="text-[#8FA7A0] block mb-1">Field Observation Details</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe tree species (Sundri, Gewa), soil moisture, or animal signs..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[#8FA7A0] block mb-1">Salinity (ppt)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 24.5"
                    value={salinityInput}
                    onChange={(e) => setSalinityInput(e.target.value)}
                    className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
                  />
                </div>
                <div>
                  <label className="text-[#8FA7A0] block mb-1">GPS Lng</label>
                  <input
                    type="text"
                    value={lngInput}
                    onChange={(e) => setLngInput(e.target.value)}
                    className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
                  />
                </div>
                <div>
                  <label className="text-[#8FA7A0] block mb-1">GPS Lat</label>
                  <input
                    type="text"
                    value={latInput}
                    onChange={(e) => setLatInput(e.target.value)}
                    className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#1C3630]">
                <button
                  type="button"
                  onClick={() => setIsSubmitOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#1C3630] text-[#8FA7A0] hover:text-[#EAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#50E3A4] text-[#07110F] font-bold hover:bg-[#3ec48a] shadow-lg shadow-[#50E3A4]/20"
                >
                  Save & Cross-Validate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
