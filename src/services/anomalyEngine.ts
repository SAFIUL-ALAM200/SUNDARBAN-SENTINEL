/**
 * Sundarbans Sentinel - Statistical Anomaly Detection Engine
 * 
 * Implements Z-Score Anomaly Detection against a multi-decadal historical baseline:
 * z = (x - μ) / σ
 * 
 * Thresholds (Configurable scientific thresholds):
 * |z| < 1.0  -> NORMAL
 * 1.0 <= |z| < 2.0 -> WATCH
 * 2.0 <= |z| < 3.0 -> ANOMALY
 * |z| >= 3.0 -> STRONG_ANOMALY
 * 
 * Important Scientific Transparency Directive:
 * The engine generates observational co-occurrence statements, NOT causal claims.
 * We state: "These observations occurred together in this observation window."
 * We NEVER state: "Factor A caused Factor B."
 */

import type { AnomalySeverity, IndicatorType, AnomalyEvent } from '../types/index.ts';

export function calculateZScore(value: number, mean: number, std: number): number {
  if (std === 0) return 0;
  return Number(((value - mean) / std).toFixed(2));
}

export function classifySeverity(absZScore: number): AnomalySeverity {
  if (absZScore >= 3.0) return 'STRONG_ANOMALY';
  if (absZScore >= 2.0) return 'ANOMALY';
  if (absZScore >= 1.0) return 'WATCH';
  return 'NORMAL';
}

export function getSeverityColor(severity: AnomalySeverity): string {
  switch (severity) {
    case 'STRONG_ANOMALY':
      return '#FF6B6B'; // Red/Danger
    case 'ANOMALY':
      return '#F5C451'; // Amber/Warning
    case 'WATCH':
      return '#60A5FA'; // Blue/Watch
    case 'NORMAL':
    default:
      return '#50E3A4'; // Emerald/Accent
  }
}

export function getSeverityBadgeClass(severity: AnomalySeverity): string {
  switch (severity) {
    case 'STRONG_ANOMALY':
      return 'text-[#FF6B6B] border-[#FF6B6B]/40 bg-[#FF6B6B]/10';
    case 'ANOMALY':
      return 'text-[#F5C451] border-[#F5C451]/40 bg-[#F5C451]/10';
    case 'WATCH':
      return 'text-[#60A5FA] border-[#60A5FA]/40 bg-[#60A5FA]/10';
    case 'NORMAL':
    default:
      return 'text-[#50E3A4] border-[#50E3A4]/40 bg-[#50E3A4]/10';
  }
}

export interface AnomalyExplanation {
  headline: string;
  statisticalBreakdown: string;
  formulaDisplay: string;
  supportingObservations: {
    indicator: string;
    trend: 'up' | 'down' | 'stable';
    text: string;
  }[];
  scientificCaution: string;
}

export function explainAnomaly(anomaly: AnomalyEvent): AnomalyExplanation {
  const direction = anomaly.zScore < 0 ? 'below' : 'above';
  const sigmaStr = Math.abs(anomaly.zScore).toFixed(1);

  let indicatorLabel = 'vegetation greenness (NDVI)';
  if (anomaly.indicator === 'water') indicatorLabel = 'surface water extent';
  if (anomaly.indicator === 'temperature') indicatorLabel = 'land surface temperature (LST)';
  if (anomaly.indicator === 'fire') indicatorLabel = 'thermal fire hotspot frequency';

  const headline = `${anomaly.indicator.toUpperCase()} OBSERVATION AT ${sigmaStr}σ ${direction.toUpperCase()} BASELINE`;
  const statisticalBreakdown = `Satellite observations of ${indicatorLabel} in ${anomaly.zoneName} deviate by ${sigmaStr} standard deviations (σ) from the multi-year baseline (${anomaly.observedValue} observed vs ${anomaly.historicalBaseline} baseline, σ = ${anomaly.historicalStd}).`;
  
  const formulaDisplay = `z = (${anomaly.observedValue} - ${anomaly.historicalBaseline}) / ${anomaly.historicalStd} = ${anomaly.zScore > 0 ? '+' : ''}${anomaly.zScore}σ`;

  const supportingObservations = anomaly.evidence.map(e => ({
    indicator: e.indicator,
    trend: (e.trend === 'down' ? 'down' : e.trend === 'up' ? 'up' : 'stable') as 'up' | 'down' | 'stable',
    text: `${e.indicator}: ${e.description} (${e.deviation})`
  }));

  const scientificCaution = 
    "Scientifically Responsible Notice: Satellite sensors detect spectral reflectance and thermal radiation anomalies. These statistical patterns co-occurred in time and space. Definite ecological causality requires synchronized in-situ field validation by forest authorities.";

  return {
    headline,
    statisticalBreakdown,
    formulaDisplay,
    supportingObservations,
    scientificCaution
  };
}
