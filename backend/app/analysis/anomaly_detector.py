"""
Sundarbans Sentinel - Python Anomaly Detection Engine
Implements Z-Score Anomaly Detection on Earth Observation Time Series.
"""

from typing import Tuple, Dict, Any

class AnomalyDetector:
    @staticmethod
    def calculate_z_score(observed: float, mean: float, std: float) -> float:
        if std == 0:
            return 0.0
        return round((observed - mean) / std, 2)

    @staticmethod
    def classify_severity(abs_z_score: float) -> str:
        if abs_z_score >= 3.0:
            return "STRONG_ANOMALY"
        elif abs_z_score >= 2.0:
            return "ANOMALY"
        elif abs_z_score >= 1.0:
            return "WATCH"
        return "NORMAL"

    @staticmethod
    def evaluate_indicator(observed: float, baseline_mean: float, baseline_std: float) -> Dict[str, Any]:
        z = AnomalyDetector.calculate_z_score(observed, baseline_mean, baseline_std)
        severity = AnomalyDetector.classify_severity(abs(z))
        change_pct = round(((observed - baseline_mean) / baseline_mean) * 100, 1) if baseline_mean != 0 else 0.0

        return {
            "observed": observed,
            "baseline_mean": baseline_mean,
            "baseline_std": baseline_std,
            "z_score": z,
            "severity": severity,
            "change_pct": change_pct
        }
