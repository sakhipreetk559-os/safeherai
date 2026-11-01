"""
Integration Tests: FastAPI REST Endpoints
Verifies API contracts, status codes, prediction results, and emergency directories.
"""

import os
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True

def test_get_areas_endpoint():
    response = client.get("/api/v1/areas")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["zones"]) >= 10

def test_predict_risk_endpoint():
    payload = {
        "zone_name": "Connaught Place",
        "hour": 22,
        "day_of_week": "Friday",
        "month": 11,
        "street_lighting_score": 4.2,
        "patrol_frequency_score": 4.0,
        "transit_proximity_m": 120,
        "commercial_density_score": 4.5
    }
    response = client.post("/api/v1/predict-risk", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["prediction"]["relative_risk_level"] in ["Low", "Moderate", "High"]
    assert 0 <= data["prediction"]["relative_risk_score"] <= 100
    assert "explainability" in data

def test_emergency_helplines_endpoint():
    response = client.get("/api/v1/emergency-helplines")
    assert response.status_code == 200
    data = response.json()
    numbers = [h["number"] for h in data["helplines"]]
    assert "112" in numbers
    assert "1091" in numbers

def test_hotspots_endpoint():
    response = client.get("/api/v1/hotspots?limit=100")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["hotspots"]) == 100
