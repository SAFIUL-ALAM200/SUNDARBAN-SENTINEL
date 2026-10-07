"""
Sundarbans Sentinel - Test Anomaly Detector Logic
"""

import unittest
from backend.app.analysis.anomaly_detector import AnomalyDetector

class TestAnomalyDetector(unittest.TestCase):
    def test_z_score_calculation(self):
        # Normal observation
        z = AnomalyDetector.calculate_z_score(observed=0.68, mean=0.68, std=0.05)
        self.assertEqual(z, 0.0)

        # Defoliation anomaly (e.g. Cyclone Sidr)
        z_sidr = AnomalyDetector.calculate_z_score(observed=0.38, mean=0.68, std=0.05)
        self.assertEqual(z_sidr, -6.0)

    def test_severity_classification(self):
        self.assertEqual(AnomalyDetector.classify_severity(0.4), "NORMAL")
        self.assertEqual(AnomalyDetector.classify_severity(1.5), "WATCH")
        self.assertEqual(AnomalyDetector.classify_severity(2.5), "ANOMALY")
        self.assertEqual(AnomalyDetector.classify_severity(3.8), "STRONG_ANOMALY")

    def test_evaluate_indicator(self):
        res = AnomalyDetector.evaluate_indicator(observed=0.55, baseline_mean=0.68, baseline_std=0.05)
        self.assertEqual(res["z_score"], -2.6)
        self.assertEqual(res["severity"], "ANOMALY")
        self.assertTrue(res["change_pct"] < 0)

if __name__ == '__main__':
    unittest.main()
