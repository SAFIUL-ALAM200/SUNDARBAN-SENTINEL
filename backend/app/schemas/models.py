"""
Sundarbans Sentinel - FastAPI Pydantic Models
NASA Space Apps Challenge 2026
"""

from typing import List, Optional
from pydantic import BaseModel, Field

class IndicatorModel(BaseModel):
    type: str
    label: str
    unit: str
    current_value: float
    historical_baseline: float
    historical_std: float
    change_percent: float
    trend: str
    status: str
    z_score: float
    confidence: float
    sensor: str

class MonitoringZoneModel(BaseModel):
    id: str
    name: str
    bengali_name: str
    range: str
    area_km2: float
    center: List[float]
    description: str

class AnomalyEventModel(BaseModel):
    id: str
    zone_id: str
    zone_name: str
    timestamp: str
    indicator: str
    severity: str
    observed_value: float
    historical_baseline: float
    z_score: float
    confidence: float
    title: str
    summary: str

class DashboardSummaryResponse(BaseModel):
    zone_id: str
    zone_name: str
    year: int
    data_source: str
    vegetation: IndicatorModel
    water: IndicatorModel
    temperature: IndicatorModel
    fire: IndicatorModel
    overall_health_score: int
