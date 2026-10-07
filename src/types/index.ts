/**
 * Sundarbans Sentinel - Core Domain Types
 * NASA Space Apps Challenge 2026
 */

export type IndicatorType = 'vegetation' | 'water' | 'temperature' | 'fire';

export type AnomalySeverity = 'NORMAL' | 'WATCH' | 'ANOMALY' | 'STRONG_ANOMALY';

export interface MonitoringZone {
  id: string;
  name: string;
  bengaliName: string;
  range: string;
  areaKm2: number;
  center: [number, number]; // [lng, lat]
  description: string;
  keyFeatures: string[];
  coordinates: [number, number][][]; // Polygon GeoJSON coordinates
}

export interface IndicatorMetric {
  type: IndicatorType;
  label: string;
  unit: string;
  currentValue: number;
  historicalBaseline: number;
  historicalStd: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  status: AnomalySeverity;
  zScore: number;
  confidence: number; // 0 - 100%
  description: string;
  sensor: string;
  resolution: string;
}

export interface ZoneObservations {
  zoneId: string;
  zoneName: string;
  year: number;
  month: string;
  timestamp: string;
  dataSource: 'LIVE_NASA' | 'CALIBRATED_DEMO';
  vegetation: IndicatorMetric;
  water: IndicatorMetric;
  temperature: IndicatorMetric;
  fire: IndicatorMetric;
  overallHealthScore: number; // 0 - 100
}

export interface AnomalyEvent {
  id: string;
  zoneId: string;
  zoneName: string;
  timestamp: string;
  year: number;
  indicator: IndicatorType;
  severity: AnomalySeverity;
  observedValue: number;
  historicalBaseline: number;
  historicalStd: number;
  zScore: number;
  confidence: number;
  title: string;
  summary: string;
  evidence: {
    indicator: string;
    trend: string;
    description: string;
    deviation: string;
  }[];
  coordinates: [number, number]; // [lng, lat]
  contributingFactors: string[];
  cautionaryStatement: string;
}

export interface HistoricalYearData {
  year: number;
  label: string;
  eventNote?: string;
  ndviAverage: number;
  waterCoverageKm2: number;
  meanLstCelsius: number;
  fireHotspotCount: number;
  notableEvent?: string;
  satelliteCoverages: string[];
}

export interface FireHotspot {
  id: string;
  latitude: number;
  longitude: number;
  brightness: number; // Kelvin
  confidence: number; // percentage (VIIRS / MODIS)
  acqDate: string;
  satellite: 'VIIRS' | 'MODIS';
  instrument: string;
  isVegetationBuffer: boolean;
}

export interface NASAProductMeta {
  code: string;
  name: string;
  sensor: string;
  platform: string;
  spatialResolution: string;
  temporalResolution: string;
  purpose: string;
  daacUrl: string;
  status: 'ONLINE' | 'ACTIVE_DEMO_STREAM' | 'STANDBY';
  parameterMeasured: string;
}
