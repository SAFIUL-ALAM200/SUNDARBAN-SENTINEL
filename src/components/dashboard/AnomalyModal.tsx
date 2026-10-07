/**
 * Sundarbans Sentinel - Anomaly Detail Modal
 * 
 * "WHY WAS THIS FLAGGED?" Scientific Deep-Dive
 * Transparently reveals:
 * - Mathematical Z-Score breakdown
 * - Supporting multi-sensor observations
 * - Strict non-causal co-occurrence reporting
 */

import React from 'react';
import type { AnomalyEvent } from '../../types/index.ts';
import { explainAnomaly, getSeverityBadgeClass } from '../../services/anomalyEngine';
import { X, AlertTriangle, HelpCircle, ShieldAlert, ArrowDown, ArrowUp, FileText, CheckCircle2 } from 'lucide-react';

interface AnomalyModalProps {
  anomaly: AnomalyEvent | null;
  onClose: () => void;
  onOpenReport: () => void;
}

export const AnomalyModal: React.FC<AnomalyModalProps> = ({
  anomaly,
  onClose,
  onOpenReport
}) => {
  if (!anomaly) return null;

  const explanation = explainAnomaly(anomaly);

  // Baseline vs Current visual ratio
  const maxVal = Math.max(anomaly.observedValue, anomaly.historicalBaseline) * 1.25 || 1;
  const currentWidth = Math.min(100, Math.max(10, (anomaly.observedValue / maxVal) * 100));
  const baselineWidth = Math.min(100, Math.max(10, (anomaly.historicalBaseline / maxVal) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07110F]/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#1C3630] bg-[#0D1B18] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#8FA7A0] hover:text-[#EAF7F2] hover:bg-[#112420] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getSeverityBadgeClass(anomaly.severity)}`}>
            {anomaly.severity.replace('_', ' ')}
          </span>
          <span className="text-xs font-mono text-[#8FA7A0]">
            DETECTION ID: {anomaly.id}
          </span>
        </div>

        <h2 className="text-xl font-bold text-[#EAF7F2] mt-1">
          {anomaly.title}
        </h2>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#8FA7A0] mt-1.5 border-b border-[#1C3630] pb-3">
          <span>ZONE: <strong className="text-[#EAF7F2]">{anomaly.zoneName}</strong></span>
          <span>·</span>
          <span>DATE: <strong className="text-[#EAF7F2]">{anomaly.timestamp}</strong></span>
          <span>·</span>
          <span>CONFIDENCE: <strong className="text-[#50E3A4]">{anomaly.confidence}%</strong></span>
        </div>

        {/* Section: WHY WAS THIS FLAGGED? */}
        <div className="mt-4 rounded-xl border border-[#1C3630] bg-[#07110F] p-4">
          <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#50E3A4] uppercase tracking-wider mb-1">
            <HelpCircle className="h-4 w-4" />
            <span>WHY WAS THIS FLAGGED?</span>
          </div>

          <p className="text-sm text-[#EAF7F2] leading-relaxed">
            {explanation.statisticalBreakdown}
          </p>

          {/* Mathematical formulation block */}
          <div className="mt-3 rounded-lg border border-[#1C3630] bg-[#112420] p-3 text-xs font-mono">
            <div className="text-[10px] text-[#8FA7A0] uppercase mb-1">Z-Score Formulation:</div>
            <div className="text-[#50E3A4] font-semibold text-sm">
              {explanation.formulaDisplay}
            </div>
            <div className="text-[11px] text-[#8FA7A0] mt-1">
              Where x = observed value, μ = multi-year historical mean, σ = standard deviation.
            </div>
          </div>
        </div>

        {/* Comparative Distribution Bars */}
        <div className="mt-4 rounded-xl border border-[#1C3630] bg-[#07110F] p-4">
          <div className="text-xs font-bold font-mono text-[#8FA7A0] uppercase mb-3">
            OBSERVED VALUE VS HISTORICAL BASELINE
          </div>

          {/* Historical Baseline Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-[#8FA7A0]">Historical Baseline (μ)</span>
              <span className="text-[#EAF7F2] font-semibold">{anomaly.historicalBaseline}</span>
            </div>
            <div className="h-3 w-full bg-[#112420] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#8FA7A0]/60 rounded-full"
                style={{ width: `${baselineWidth}%` }}
              />
            </div>
          </div>

          {/* Current Observed Bar */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-[#50E3A4]">Current Satellite Reading (x)</span>
              <span className="text-[#50E3A4] font-bold">{anomaly.observedValue}</span>
            </div>
            <div className="h-3 w-full bg-[#112420] rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  anomaly.severity === 'STRONG_ANOMALY' ? 'bg-[#FF6B6B]' : 'bg-[#F5C451]'
                }`}
                style={{ width: `${currentWidth}%` }}
              />
            </div>
          </div>
        </div>

        {/* Supporting Evidence Breakdown */}
        <div className="mt-4">
          <div className="text-xs font-bold font-mono text-[#8FA7A0] uppercase mb-2">
            SUPPORTING MULTI-SENSOR OBSERVATIONS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {anomaly.evidence.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-[#1C3630] bg-[#112420]/50 p-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-[#EAF7F2]">{item.indicator}</span>
                  <span className={`text-[11px] font-bold ${
                    item.trend === 'down' ? 'text-[#FF6B6B]' : item.trend === 'up' ? 'text-[#60A5FA]' : 'text-[#8FA7A0]'
                  }`}>
                    {item.deviation}
                  </span>
                </div>
                <div className="text-xs text-[#8FA7A0] mt-1 leading-snug">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Non-Causal Scientific Transparency Statement */}
        <div className="mt-4 rounded-xl border border-[#F5C451]/30 bg-[#F5C451]/5 p-3.5">
          <div className="flex items-start gap-2 text-xs text-[#EAF7F2]">
            <ShieldAlert className="h-4 w-4 text-[#F5C451] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-[#F5C451]">Strict Non-Causal Reporting Principle: </span>
              <p className="text-xs text-[#8FA7A0] leading-relaxed">
                {explanation.scientificCaution}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-[#1C3630]">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#1C3630] px-4 py-2 text-xs font-medium text-[#8FA7A0] hover:text-[#EAF7F2] hover:bg-[#112420] transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenReport();
            }}
            className="flex items-center gap-1.5 rounded-lg bg-[#50E3A4] px-4 py-2 text-xs font-bold text-[#07110F] hover:bg-[#3ec48a] transition-colors shadow-lg shadow-[#50E3A4]/20"
          >
            <FileText className="h-4 w-4" />
            <span>Include in Monitoring Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
