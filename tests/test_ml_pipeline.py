"""
Unit Tests: ML Training & Model Evaluation Pipeline
Verifies model performance, persistence, evaluation metrics, and explainability.
"""

import os
import json
import joblib
import numpy as np
import pytest

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "ml", "models")

def test_model_artifacts_exist():
    model_path = os.path.join(MODELS_DIR, "safeher_xgb_model.joblib")
    encoder_path = os.path.join(MODELS_DIR, "label_encoder.joblib")
    metrics_path = os.path.join(MODELS_DIR, "metrics_report.json")
    
    assert os.path.exists(model_path), "Model artifact missing"
    assert os.path.exists(encoder_path), "Encoder artifact missing"
    assert os.path.exists(metrics_path), "Metrics report missing"

def test_model_performance_benchmarks():
    metrics_path = os.path.join(MODELS_DIR, "metrics_report.json")
    with open(metrics_path, "r", encoding="utf-8") as f:
        metrics = json.load(f)
        
    xgb_f1 = metrics["models_comparison"]["xgboost"]["macro_f1"]
    xgb_acc = metrics["models_comparison"]["xgboost"]["accuracy"]
    
    # Must meet academic and production standards (Macro F1 > 0.75, Accuracy > 0.80)
    assert xgb_f1 >= 0.75, f"XGBoost Macro F1 {xgb_f1} below threshold 0.75"
    assert xgb_acc >= 0.80, f"XGBoost Accuracy {xgb_acc} below threshold 0.80"

def test_explainability_engine():
    from ml.explainability import SafeHerExplainer
    explainer = SafeHerExplainer()
    explanation = explainer.explain_prediction({
        "zone_name": "Connaught Place",
        "hour": 23,
        "street_lighting_score": 2.5,
        "patrol_frequency_score": 2.0,
        "transit_proximity_m": 700,
        "commercial_density_score": 2.0
    })
    
    assert "attributions" in explanation
    assert len(explanation["attributions"]) > 0
    assert "disclaimer" in explanation
    assert "not measure personal victimisation" in explanation["disclaimer"]
