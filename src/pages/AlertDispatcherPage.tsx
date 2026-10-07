/**
 * Sundarbans Sentinel - Automated Policy & Conservation Alert Dispatcher Page
 * 
 * Features:
 * - Configurable threshold-based trigger rule builder
 * - Automated incident logs with Acknowledge/Resolve workflow
 * - Mock Webhook payload simulator & agency dispatch feeds
 * - Full bilingual English/Bangla localization
 */

import React, { useState } from 'react';
import { 
  AlertDispatcherService, 
  AlertThresholdRule, 
  IncidentAlertLog, 
  AlertSeverity,
  DispatchChannel 
} from '../services/alertDispatcherService';
import { MONITORING_ZONES } from '../data/sundarbansGeo';
import { Language, getTranslation } from '../services/i18n';
import { 
  Bell, 
  Send, 
  Plus, 
  Check, 
  AlertTriangle, 
  Radio, 
  Terminal, 
  CheckCircle2, 
  Flame, 
  ShieldAlert,
  Webhook
} from 'lucide-react';

interface AlertDispatcherPageProps {
  language: Language;
}

export const AlertDispatcherPage: React.FC<AlertDispatcherPageProps> = ({ language }) => {
  const [rules, setRules] = useState<AlertThresholdRule[]>(() => 
    AlertDispatcherService.getRules()
  );
  const [logs, setLogs] = useState<IncidentAlertLog[]>(() => 
    AlertDispatcherService.getLogs()
  );

  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [testPayloadModal, setTestPayloadModal] = useState<IncidentAlertLog | null>(null);

  // New Rule Form Fields
  const [ruleName, setRuleName] = useState('');
  const [triggerType, setTriggerType] = useState<any>('NDVI_DROP');
  const [severity, setSeverity] = useState<AlertSeverity>('CRITICAL');
  const [thresholdVal, setThresholdVal] = useState<number>(0.15);
  const [targetZone, setTargetZone] = useState('all');
  const [webhookUrl, setWebhookUrl] = useState('https://api.forest.gov.bd/v1/sentinel/alerts');

  const t = (key: string) => getTranslation(key, language);

  const handleToggleRule = (id: string) => {
    AlertDispatcherService.toggleRule(id);
    setRules([...AlertDispatcherService.getRules()]);
  };

  const handleAcknowledge = (id: string) => {
    const officerName = language === 'bn' ? 'দায়িত্বপ্রাপ্ত কর্মকর্তা (ডিএফও পূর্ব)' : 'Divisional Forest Officer (Duty Officer)';
    AlertDispatcherService.acknowledgeAlert(id, officerName);
    setLogs([...AlertDispatcherService.getLogs()]);
  };

  const handleSimulateRule = (rule: AlertThresholdRule) => {
    const zone = MONITORING_ZONES.find(z => z.id === rule.targetZoneId)?.name || 'Central Sundarbans';
    const testVal = rule.operator === '>' ? rule.thresholdValue + 0.05 : rule.thresholdValue;
    const newLog = AlertDispatcherService.simulateDispatch(rule, zone, Number(testVal.toFixed(2)));
    setLogs([newLog, ...AlertDispatcherService.getLogs()]);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName) return;

    let unit = 'Delta';
    if (triggerType === 'FIRMS_FIRE_HOTSPOT') unit = 'Hotspots';
    else if (triggerType === 'THERMAL_SPIKE') unit = 'Kelvin';
    else if (triggerType === 'SALINITY_THRESHOLD_BREACH') unit = 'ppt';

    const newR = AlertDispatcherService.addRule({
      name: ruleName,
      triggerType: triggerType,
      severity: severity,
      operator: '>',
      thresholdValue: thresholdVal,
      unit: unit,
      targetZoneId: targetZone,
      channels: ['BFD_SMART_PATROL', 'WEBHOOK_ENDPOINT', 'UPAZILA_DISASTER_COMMITTEE'],
      webhookUrl: webhookUrl,
      isActive: true,
      description: `Automated policy limit for ${ruleName}. Trigger threshold configured at ${thresholdVal} ${unit}.`
    });

    setRules([...AlertDispatcherService.getRules()]);
    setIsAddRuleOpen(false);
    setRuleName('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07110F] text-[#EAF7F2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Page Header */}
        <div className="rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#50E3A4] uppercase tracking-wider mb-1">
              <Bell className="h-4 w-4" />
              <span>{t('alertDispatcherTitle')}</span>
            </div>
            <h1 className="text-2xl font-bold font-mono text-[#EAF7F2]">
              {language === 'bn' 
                ? 'স্বয়ংক্রিয় নীতি ও সংরক্ষণ জরুরি সতর্কতা প্রেরক' 
                : 'Automated Conservation Alert & Webhook Dispatcher'}
            </h1>
            <p className="text-xs text-[#8FA7A0] max-w-3xl mt-1">
              {t('alertDispatcherSubtitle')}
            </p>
          </div>

          <button
            onClick={() => setIsAddRuleOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-[#50E3A4] px-4 py-2.5 text-xs font-bold font-mono text-[#07110F] hover:bg-[#3ec48a] transition-all shadow-lg shadow-[#50E3A4]/20 self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>{t('configureRule')}</span>
          </button>
        </div>

        {/* Agency Distribution Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-3.5 shadow-md">
            <div className="text-[10px] font-mono text-[#8FA7A0] uppercase">BFD SMART Patrol</div>
            <div className="text-sm font-bold text-[#50E3A4] font-mono mt-1">3 Speedboats Active</div>
            <div className="text-[10px] text-[#8FA7A0] font-mono">Khulna & Sarankhola Ranges</div>
          </div>
          <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-3.5 shadow-md">
            <div className="text-[10px] font-mono text-[#8FA7A0] uppercase">UNESCO WHC Feed</div>
            <div className="text-sm font-bold text-[#60A5FA] font-mono mt-1">Direct API Linked</div>
            <div className="text-[10px] text-[#8FA7A0] font-mono">Biodiversity Reserve Status</div>
          </div>
          <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-3.5 shadow-md">
            <div className="text-[10px] font-mono text-[#8FA7A0] uppercase">Upazila Disaster Cell</div>
            <div className="text-sm font-bold text-[#F5C451] font-mono mt-1">SMS Siren Ready</div>
            <div className="text-[10px] text-[#8FA7A0] font-mono">Shyamnagar & Mongla</div>
          </div>
          <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-3.5 shadow-md">
            <div className="text-[10px] font-mono text-[#8FA7A0] uppercase">Webhook Endpoints</div>
            <div className="text-sm font-bold text-[#50E3A4] font-mono mt-1">HTTP 200 Healthy</div>
            <div className="text-[10px] text-[#8FA7A0] font-mono">REST JSON Dispatch</div>
          </div>
        </div>

        {/* TWO-COLUMN LAYOUT: RULES (LEFT) + LIVE DISPATCH LOG (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Active Rules List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#1C3630] pb-2">
                <h3 className="text-xs font-mono font-bold text-[#50E3A4] uppercase tracking-wider">
                  {t('activeRules')} ({rules.length})
                </h3>
                <span className="text-[10px] font-mono text-[#8FA7A0]">Automated Triggers</span>
              </div>

              <div className="space-y-3">
                {rules.map((rule) => (
                  <div 
                    key={rule.id}
                    className={`rounded-lg border p-3.5 space-y-2 transition-all ${
                      rule.isActive 
                        ? 'border-[#1C3630] bg-[#112420]' 
                        : 'border-[#1C3630]/40 bg-[#07110F] opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-[#EAF7F2] font-mono">
                          {rule.name}
                        </div>
                        <div className="text-[10px] text-[#8FA7A0] font-mono mt-0.5">
                          Threshold: <strong className="text-[#50E3A4]">{rule.operator} {rule.thresholdValue} {rule.unit}</strong> · Scope: {rule.targetZoneId}
                        </div>
                      </div>

                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                        rule.severity === 'CRITICAL'
                          ? 'border-[#FF6B6B]/40 bg-[#FF6B6B]/20 text-[#FF6B6B]'
                          : 'border-[#F5C451]/40 bg-[#F5C451]/20 text-[#F5C451]'
                      }`}>
                        {rule.severity}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#8FA7A0] leading-snug">
                      {rule.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1C3630]/60 text-xs font-mono">
                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                          rule.isActive 
                            ? 'border-[#50E3A4]/40 bg-[#50E3A4]/15 text-[#50E3A4]' 
                            : 'border-[#8FA7A0]/40 text-[#8FA7A0]'
                        }`}
                      >
                        {rule.isActive ? 'ACTIVE' : 'MUTED'}
                      </button>

                      <button
                        onClick={() => handleSimulateRule(rule)}
                        className="text-[10px] font-bold text-[#60A5FA] hover:underline flex items-center gap-1"
                        title="Simulate immediate threshold breach and dispatch alert"
                      >
                        <Send className="h-3 w-3" />
                        <span>Simulate Fire</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Incident Alert Logs (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-xl border border-[#1C3630] bg-[#0D1B18] p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#1C3630] pb-2">
                <h3 className="text-xs font-mono font-bold text-[#50E3A4] uppercase tracking-wider flex items-center gap-2">
                  <Radio className="h-3.5 w-3.5 text-[#50E3A4] animate-pulse" />
                  <span>{t('dispatchLog')} ({logs.length})</span>
                </h3>
                <span className="text-[10px] font-mono text-[#8FA7A0]">Live Automated Dispatch</span>
              </div>

              <div className="space-y-3">
                {logs.map((log) => (
                  <div 
                    key={log.id}
                    className="rounded-lg border border-[#1C3630] bg-[#112420] p-4 space-y-2.5 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${
                          log.severity === 'CRITICAL' ? 'bg-[#FF6B6B] animate-ping' : 'bg-[#F5C451]'
                        }`} />
                        <span className="text-xs font-bold text-[#EAF7F2] font-mono">
                          {log.ruleName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <span className="text-[#8FA7A0]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                          log.status === 'RESOLVED' 
                            ? 'bg-[#50E3A4]/15 text-[#50E3A4]' 
                            : log.status === 'ACKNOWLEDGED'
                            ? 'bg-[#60A5FA]/15 text-[#60A5FA]'
                            : 'bg-[#FF6B6B]/15 text-[#FF6B6B] animate-pulse'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#8FA7A0] leading-relaxed">
                      {log.summary}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1C3630]/60 text-xs font-mono">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-[10px] text-[#8FA7A0]">Channels:</span>
                        {log.dispatchedChannels.map(ch => (
                          <span key={ch} className="text-[9px] bg-[#07110F] border border-[#1C3630] px-1.5 py-0.5 rounded text-[#8FA7A0]">
                            {ch}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTestPayloadModal(log)}
                          className="text-[10px] font-mono text-[#8FA7A0] hover:text-[#50E3A4] flex items-center gap-1"
                        >
                          <Terminal className="h-3 w-3" />
                          <span>View Payload</span>
                        </button>

                        {log.status === 'DISPATCHED' && (
                          <button
                            onClick={() => handleAcknowledge(log.id)}
                            className="text-[10px] font-bold bg-[#50E3A4] text-[#07110F] px-2.5 py-1 rounded hover:bg-[#3ec48a] transition-colors"
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Webhook JSON Payload Modal */}
      {testPayloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C3630] pb-2">
              <h3 className="text-sm font-bold font-mono text-[#50E3A4] flex items-center gap-2">
                <Webhook className="h-4 w-4" />
                <span>Dispatched Webhook HTTP POST Payload</span>
              </h3>
              <button onClick={() => setTestPayloadModal(null)} className="text-[#8FA7A0] hover:text-[#EAF7F2]">✕</button>
            </div>

            <pre className="p-3 rounded-lg bg-[#07110F] border border-[#1C3630] text-[11px] font-mono text-[#50E3A4] overflow-x-auto max-h-72">
              {JSON.stringify({
                event: "sundarbans.sentinel.threshold_breach",
                incidentId: testPayloadModal.id,
                severity: testPayloadModal.severity,
                timestamp: testPayloadModal.timestamp,
                zone: testPayloadModal.zoneName,
                metric: testPayloadModal.triggerMetric,
                measuredValue: testPayloadModal.observedValue,
                threshold: testPayloadModal.thresholdValue,
                summary: testPayloadModal.summary,
                channels: testPayloadModal.dispatchedChannels,
                dispatchWebhookStatusCode: 200
              }, null, 2)}
            </pre>

            <div className="flex justify-end">
              <button
                onClick={() => setTestPayloadModal(null)}
                className="px-4 py-1.5 rounded-lg bg-[#112420] border border-[#1C3630] text-xs font-mono text-[#EAF7F2]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Rule Modal */}
      {isAddRuleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C3630] pb-2">
              <h3 className="text-sm font-bold font-mono text-[#EAF7F2] flex items-center gap-2">
                <Plus className="h-4 w-4 text-[#50E3A4]" />
                <span>Configure Alert Threshold Rule</span>
              </h3>
              <button onClick={() => setIsAddRuleOpen(false)} className="text-[#8FA7A0] hover:text-[#EAF7F2]">✕</button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-[#8FA7A0] block mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Passur River Sudden Salinity Spike"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8FA7A0] block mb-1">Trigger Metric</label>
                  <select
                    value={triggerType}
                    onChange={(e) => setTriggerType(e.target.value)}
                    className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
                  >
                    <option value="NDVI_DROP">Vegetation NDVI Drop</option>
                    <option value="THERMAL_SPIKE">Surface Temperature (LST)</option>
                    <option value="FIRMS_FIRE_HOTSPOT">Active Fire Hotspot</option>
                    <option value="SALINITY_THRESHOLD_BREACH">Salinity Breach (ppt)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#8FA7A0] block mb-1">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
                    className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
                  >
                    <option value="CRITICAL">Critical Emergency</option>
                    <option value="HIGH">High Priority</option>
                    <option value="WARNING">Early Warning</option>
                    <option value="ADVISORY">Advisory</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8FA7A0] block mb-1">Threshold Value</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={thresholdVal}
                    onChange={(e) => setThresholdVal(parseFloat(e.target.value))}
                    className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
                  />
                </div>
                <div>
                  <label className="text-[#8FA7A0] block mb-1">Target Zone Scope</label>
                  <select
                    value={targetZone}
                    onChange={(e) => setTargetZone(e.target.value)}
                    className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
                  >
                    <option value="all">Entire Sundarbans Delta</option>
                    {MONITORING_ZONES.map(z => (
                      <option key={z.id} value={z.id}>{z.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#8FA7A0] block mb-1">Webhook URL</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full rounded-lg border border-[#1C3630] bg-[#112420] px-3 py-2 text-[#EAF7F2] focus:outline-none focus:border-[#50E3A4]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#1C3630]">
                <button
                  type="button"
                  onClick={() => setIsAddRuleOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#1C3630] text-[#8FA7A0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#50E3A4] text-[#07110F] font-bold hover:bg-[#3ec48a]"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
