/**
 * Sundarbans Sentinel - Automated Policy & Conservation Alert Dispatcher
 * 
 * Configurable threshold-based early warning system that evaluates environmental
 * indices against critical ecological limits and dispatches incident alerts to
 * forest rangers, policy agencies, and coastal disaster management committees.
 */

export type AlertTriggerType = 
  | 'NDVI_DROP' 
  | 'THERMAL_SPIKE' 
  | 'FIRMS_FIRE_HOTSPOT' 
  | 'SALINITY_THRESHOLD_BREACH' 
  | 'RAPID_CANOPY_LOSS';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'WARNING' | 'ADVISORY';

export type DispatchChannel = 
  | 'BFD_SMART_PATROL' 
  | 'UNESCO_WORLD_HERITAGE' 
  | 'UPAZILA_DISASTER_COMMITTEE' 
  | 'COMMUNITY_SMS_BROADCAST' 
  | 'WEBHOOK_ENDPOINT';

export interface AlertThresholdRule {
  id: string;
  name: string;
  triggerType: AlertTriggerType;
  severity: AlertSeverity;
  operator: '>' | '<' | '>=';
  thresholdValue: number;
  unit: string;
  targetZoneId: string; // 'all' or specific zone ID
  channels: DispatchChannel[];
  webhookUrl?: string;
  isActive: boolean;
  description: string;
}

export interface IncidentAlertLog {
  id: string;
  ruleId: string;
  ruleName: string;
  timestamp: string;
  severity: AlertSeverity;
  zoneId: string;
  zoneName: string;
  triggerMetric: string;
  observedValue: number;
  thresholdValue: number;
  unit: string;
  summary: string;
  dispatchedChannels: DispatchChannel[];
  status: 'DISPATCHED' | 'ACKNOWLEDGED' | 'RESOLVED';
  acknowledgedBy?: string;
  webhookResponseCode?: number;
}

const RULES_STORAGE_KEY = 'sundarbans_sentinel_alert_rules_v1';
const LOGS_STORAGE_KEY = 'sundarbans_sentinel_alert_logs_v1';

export const DEFAULT_RULES: AlertThresholdRule[] = [
  {
    id: 'rule-01',
    name: 'Core Wildlife Sanctuary NDVI Collapse Warning',
    triggerType: 'NDVI_DROP',
    severity: 'CRITICAL',
    operator: '>',
    thresholdValue: 0.18, // NDVI drop greater than 0.18
    unit: 'NDVI Delta',
    targetZoneId: 'sarankhola-east',
    channels: ['BFD_SMART_PATROL', 'UNESCO_WORLD_HERITAGE', 'WEBHOOK_ENDPOINT'],
    webhookUrl: 'https://api.forest.gov.bd/v1/sentinel/alerts',
    isActive: true,
    description: 'Triggers emergency patrol when multi-spectral satellite reflectance detects sharp mangrove canopy defoliation in core tiger sanctuary.'
  },
  {
    id: 'rule-02',
    name: 'NASA FIRMS VIIRS Active Fire Alarm in Forest Boundary',
    triggerType: 'FIRMS_FIRE_HOTSPOT',
    severity: 'CRITICAL',
    operator: '>=',
    thresholdValue: 1, // 1 or more fire hotspots
    unit: 'Hotspots',
    targetZoneId: 'all',
    channels: ['BFD_SMART_PATROL', 'UPAZILA_DISASTER_COMMITTEE', 'COMMUNITY_SMS_BROADCAST'],
    isActive: true,
    description: 'Instant notification dispatched upon detection of thermal thermal anomaly (>300K) by VIIRS or MODIS sensors inside forest limits.'
  },
  {
    id: 'rule-03',
    name: 'Hyper-Salinity Estuarine Threshold Breach',
    triggerType: 'SALINITY_THRESHOLD_BREACH',
    severity: 'HIGH',
    operator: '>',
    thresholdValue: 25.0, // > 25 ppt
    unit: 'ppt (PSU)',
    targetZoneId: 'passur-sibsa',
    channels: ['UPAZILA_DISASTER_COMMITTEE', 'COMMUNITY_SMS_BROADCAST'],
    isActive: true,
    description: 'Alerts local water boards and agricultural extension offices when marine salinity penetrates above critical 25 ppt threshold for Sundri.'
  },
  {
    id: 'rule-04',
    name: 'Pre-Monsoon Extreme Heatwave Stress',
    triggerType: 'THERMAL_SPIKE',
    severity: 'WARNING',
    operator: '>',
    thresholdValue: 312.0, // Kelvin (~38.8°C LST)
    unit: 'Kelvin',
    targetZoneId: 'satkhira-west',
    channels: ['BFD_SMART_PATROL'],
    isActive: true,
    description: 'Monitors MOD11A2 Land Surface Temperature spikes threatening freshwater ponds and tiger dehydration.'
  }
];

export const INITIAL_ALERT_LOGS: IncidentAlertLog[] = [
  {
    id: 'inc-901',
    ruleId: 'rule-01',
    ruleName: 'Core Wildlife Sanctuary NDVI Collapse Warning',
    timestamp: '2026-09-29T14:22:00Z',
    severity: 'CRITICAL',
    zoneId: 'sarankhola-east',
    zoneName: 'Sarankhola Wildlife Sanctuary',
    triggerMetric: 'Vegetation NDVI Drop',
    observedValue: 0.22,
    thresholdValue: 0.18,
    unit: 'NDVI Delta',
    summary: 'Landsat 9 overpass detected 0.22 NDVI drop across 4.2 km² sector. Automated dispatch sent to BFD SMART Patrol and UNESCO Desk.',
    dispatchedChannels: ['BFD_SMART_PATROL', 'UNESCO_WORLD_HERITAGE', 'WEBHOOK_ENDPOINT'],
    status: 'ACKNOWLEDGED',
    acknowledgedBy: 'Divisional Forest Officer (DFO) Sundarbans East',
    webhookResponseCode: 200
  },
  {
    id: 'inc-902',
    ruleId: 'rule-02',
    ruleName: 'NASA FIRMS VIIRS Active Fire Alarm in Forest Boundary',
    timestamp: '2026-09-28T03:45:00Z',
    severity: 'CRITICAL',
    zoneId: 'central-khulna',
    zoneName: 'Central Sundarbans',
    triggerMetric: 'Thermal Hotspots',
    observedValue: 2,
    thresholdValue: 1,
    unit: 'Hotspots',
    summary: 'VIIRS Day/Night Band logged 2 distinct 375m fire hotspots (328.4 K) along dry creek margin. Rangers dispatched via speed boat.',
    dispatchedChannels: ['BFD_SMART_PATROL', 'UPAZILA_DISASTER_COMMITTEE'],
    status: 'RESOLVED',
    acknowledgedBy: 'Range Officer Khulna Range',
    webhookResponseCode: 200
  },
  {
    id: 'inc-903',
    ruleId: 'rule-03',
    ruleName: 'Hyper-Salinity Estuarine Threshold Breach',
    timestamp: '2026-09-27T18:10:00Z',
    severity: 'HIGH',
    zoneId: 'passur-sibsa',
    zoneName: 'Passur-Sibsa Estuary',
    triggerMetric: 'Salinity In-Situ / Derived',
    observedValue: 27.2,
    thresholdValue: 25.0,
    unit: 'ppt (PSU)',
    summary: 'Surface salinity sustained at 27.2 ppt across Passur channel during astronomical neap tide. Low upstream Gorai discharge indicated.',
    dispatchedChannels: ['UPAZILA_DISASTER_COMMITTEE', 'COMMUNITY_SMS_BROADCAST'],
    status: 'DISPATCHED',
    webhookResponseCode: 200
  }
];

export class AlertDispatcherService {
  public static getRules(): AlertThresholdRule[] {
    try {
      const stored = localStorage.getItem(RULES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load rules:', e);
    }
    return DEFAULT_RULES;
  }

  public static getLogs(): IncidentAlertLog[] {
    try {
      const stored = localStorage.getItem(LOGS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load logs:', e);
    }
    return INITIAL_ALERT_LOGS;
  }

  public static addRule(rule: Omit<AlertThresholdRule, 'id'>): AlertThresholdRule {
    const rules = this.getRules();
    const newRule: AlertThresholdRule = {
      ...rule,
      id: `rule-${Date.now().toString(36)}`
    };
    rules.push(newRule);
    localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(rules));
    return newRule;
  }

  public static toggleRule(ruleId: string): void {
    const rules = this.getRules();
    const target = rules.find(r => r.id === ruleId);
    if (target) {
      target.isActive = !target.isActive;
      localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(rules));
    }
  }

  public static acknowledgeAlert(alertId: string, acknowledgedBy: string): void {
    const logs = this.getLogs();
    const target = logs.find(l => l.id === alertId);
    if (target) {
      target.status = 'ACKNOWLEDGED';
      target.acknowledgedBy = acknowledgedBy;
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
    }
  }

  public static simulateDispatch(rule: AlertThresholdRule, zoneName: string, observedValue: number): IncidentAlertLog {
    const logs = this.getLogs();
    const newLog: IncidentAlertLog = {
      id: `inc-${Date.now().toString(36)}`,
      ruleId: rule.id,
      ruleName: rule.name,
      timestamp: new Date().toISOString(),
      severity: rule.severity,
      zoneId: rule.targetZoneId,
      zoneName: zoneName,
      triggerMetric: rule.triggerType,
      observedValue: observedValue,
      thresholdValue: rule.thresholdValue,
      unit: rule.unit,
      summary: `Automated threshold trigger: ${rule.name} breached in ${zoneName}. Measured ${observedValue} ${rule.unit} (Limit: ${rule.operator} ${rule.thresholdValue} ${rule.unit}).`,
      dispatchedChannels: rule.channels,
      status: 'DISPATCHED',
      webhookResponseCode: rule.channels.includes('WEBHOOK_ENDPOINT') ? 200 : undefined
    };

    logs.unshift(newLog);
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
    return newLog;
  }
}
