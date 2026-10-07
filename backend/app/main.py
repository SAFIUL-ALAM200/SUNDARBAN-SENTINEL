"""
Sundarbans Sentinel - FastAPI Application
NASA Space Apps Challenge 2026
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from backend.app.schemas.models import (
    MonitoringZoneModel,
    DashboardSummaryResponse,
    IndicatorModel,
    AnomalyEventModel
)
from backend.app.analysis.anomaly_detector import AnomalyDetector

app = FastAPI(
    title="Sundarbans Sentinel API",
    description="Earth Observation & Statistical Anomaly Detection Service for the Sundarbans Mangrove Complex",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ZONES = [
    {
        "id": "western-satkhira",
        "name": "Western Sundarbans (Satkhira Range)",
        "bengali_name": "পশ্চিম সুন্দরবন",
        "range": "Satkhira Wildlife Sanctuary",
        "area_km2": 1820.0,
        "center": [89.15, 22.12],
        "description": "Bordering Raimangal and Hariabhanga rivers with high salinity gradient."
    },
    {
        "id": "central-khulna",
        "name": "Central Sundarbans (Khulna Range)",
        "bengali_name": "মধ্য সুন্দরবন",
        "range": "Sundarbans South Wildlife Sanctuary",
        "area_km2": 2150.0,
        "center": [89.52, 22.08],
        "description": "Core Sundri tree habitat and primary Royal Bengal Tiger corridor along Sibsa River."
    },
    {
        "id": "eastern-sarankhola",
        "name": "Eastern Sundarbans (Sarankhola Range)",
        "bengali_name": "পূর্ব সুন্দরবন",
        "range": "Sarankhola & Chandpai Ranges",
        "area_km2": 2410.0,
        "center": [89.82, 22.15],
        "description": "Freshwater influence from Baleswar River and dolphin sanctuary zones."
    }
]

@app.get("/api/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "Sundarbans Sentinel FastAPI",
        "version": "1.0.0"
    }

@app.get("/api/zones", response_model=List[MonitoringZoneModel])
def get_zones():
    return ZONES

@app.get("/api/zones/{zone_id}", response_model=MonitoringZoneModel)
def get_zone(zone_id: str):
    for z in ZONES:
        if z["id"] == zone_id:
            return z
    raise HTTPException(status_code=404, detail="Zone not found")

@app.get("/api/dashboard-summary")
def get_dashboard_summary(zone_id: str = "central-khulna", year: int = 2026):
    # Perform real-time Z-score evaluation
    veg_eval = AnomalyDetector.evaluate_indicator(observed=0.63, baseline_mean=0.68, baseline_std=0.05)
    water_eval = AnomalyDetector.evaluate_indicator(observed=3880, baseline_mean=3700, baseline_std=220)
    temp_eval = AnomalyDetector.evaluate_indicator(observed=28.7, baseline_mean=27.8, baseline_std=1.2)
    fire_eval = AnomalyDetector.evaluate_indicator(observed=3, baseline_mean=2.4, baseline_std=1.5)

    return {
        "zone_id": zone_id,
        "year": year,
        "data_source": "CALIBRATED_DEMO",
        "vegetation": {
            "type": "vegetation",
            "label": "Vegetation Health (NDVI)",
            "unit": "Index",
            "current_value": veg_eval["observed"],
            "historical_baseline": veg_eval["baseline_mean"],
            "historical_std": veg_eval["baseline_std"],
            "change_percent": veg_eval["change_pct"],
            "trend": "down",
            "status": veg_eval["severity"],
            "z_score": veg_eval["z_score"],
            "confidence": 94.0,
            "sensor": "MODIS MOD13Q1 / Landsat 9"
        },
        "water": {
            "type": "water",
            "label": "Surface Water Extent (NDWI)",
            "unit": "km²",
            "current_value": water_eval["observed"],
            "historical_baseline": water_eval["baseline_mean"],
            "historical_std": water_eval["baseline_std"],
            "change_percent": water_eval["change_pct"],
            "trend": "up",
            "status": water_eval["severity"],
            "z_score": water_eval["z_score"],
            "confidence": 91.0,
            "sensor": "Landsat 8-9 OLI / Sentinel-2"
        },
        "overall_health_score": 78
    }
