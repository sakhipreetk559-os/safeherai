"""
Unit Tests: Historical Incident Dataset Validation
Verifies data schema, geospatial boundaries, absence of PII, and value constraints.
"""

import os
import pandas as pd
import pytest

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "raw", "delhi_incident_history.csv")

def test_dataset_exists():
    assert os.path.exists(DATA_PATH), f"Dataset file not found at {DATA_PATH}"

def test_dataset_schema_and_size():
    df = pd.read_csv(DATA_PATH)
    assert len(df) >= 3000, "Dataset should contain at least 3000 records"
    
    required_cols = [
        "incident_id", "zone_name", "latitude", "longitude",
        "timestamp", "hour", "day_of_week", "month",
        "crime_category", "street_lighting_score",
        "patrol_frequency_score", "transit_proximity_m",
        "commercial_density_score", "relative_risk_score",
        "relative_risk_level"
    ]
    for col in required_cols:
        assert col in df.columns, f"Missing required column: {col}"

def test_geospatial_bounds():
    df = pd.read_csv(DATA_PATH)
    # Delhi NCR latitude/longitude bounding envelope
    assert df['latitude'].between(28.3, 28.9).all(), "Latitude outside Delhi NCR bounds"
    assert df['longitude'].between(76.8, 77.5).all(), "Longitude outside Delhi NCR bounds"

def test_privacy_and_no_pii():
    df = pd.read_csv(DATA_PATH)
    forbidden_terms = ["name", "phone", "email", "address", "victim", "aadhar", "identity"]
    for col in df.columns:
        for term in forbidden_terms:
            assert term not in col.lower(), f"Potential PII column detected: {col}"

def test_relative_risk_classes():
    df = pd.read_csv(DATA_PATH)
    unique_levels = set(df['relative_risk_level'].unique())
    assert unique_levels.issubset({"Low", "Moderate", "High"}), f"Unexpected risk level: {unique_levels}"
