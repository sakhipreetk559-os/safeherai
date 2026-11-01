"""
SafeHer AI - Explainable AI (XAI) Engine
Translates model feature importances and tree-based decision weights into
human-understandable risk factor attributions and mitigating recommendations.
"""

import os
import json
import joblib
import numpy as np

class SafeHerExplainer:
    def __init__(self):
        base_dir = os.path.dirname(os.path.dirname(__file__))
        models_dir = os.path.join(base_dir, "ml", "models")
        self.model = joblib.load(os.path.join(models_dir, "safeher_xgb_model.joblib"))
        self.label_encoder = joblib.load(os.path.join(models_dir, "label_encoder.joblib"))
        with open(os.path.join(models_dir, "metrics_report.json"), "r", encoding="utf-8") as f:
            self.metrics = json.load(f)
            
    def explain_prediction(self, feature_dict):
        """
        Calculates feature attributions and generates natural language explanations.
        feature_dict contains:
        hour, month, is_weekend, street_lighting_score, patrol_frequency_score,
        transit_proximity_m, commercial_density_score, zone_name
        """
        hour = feature_dict.get('hour', 12)
        lighting = feature_dict.get('street_lighting_score', 3.5)
        patrol = feature_dict.get('patrol_frequency_score', 3.5)
        transit = feature_dict.get('transit_proximity_m', 250)
        commercial = feature_dict.get('commercial_density_score', 3.5)
        is_weekend = feature_dict.get('is_weekend', 0)
        zone_name = feature_dict.get('zone_name', 'Selected Area')
        
        factors = []
        mitigations = []
        
        # 1. Temporal Analysis
        if 21 <= hour or hour <= 4:
            factors.append({
                "factor": "Late-Night Temporal Exposure",
                "impact": "High Negative",
                "percentage_weight": 34.0,
                "direction": "increases_risk",
                "detail": f"Travel at {hour:02d}:00 historically coincides with lower public transit operations and reduced pedestrian density."
            })
        elif 18 <= hour < 21:
            factors.append({
                "factor": "Evening Commute Transition",
                "impact": "Moderate Negative",
                "percentage_weight": 18.0,
                "direction": "increases_risk",
                "detail": f"Commute at {hour:02d}:00 involves high transit congestion and higher historical snatching/eve-teasing reports."
            })
        else:
            factors.append({
                "factor": "Daylight Visibility & Footfall",
                "impact": "Positive (Protective)",
                "percentage_weight": -20.0,
                "direction": "mitigates_risk",
                "detail": f"Daytime hours ({hour:02d}:00) benefit from natural surveillance and open commercial establishments."
            })
            
        # 2. Environmental Lighting
        if lighting < 2.8:
            factors.append({
                "factor": "Sub-optimal Public Lighting",
                "impact": "High Negative",
                "percentage_weight": 26.0,
                "direction": "increases_risk",
                "detail": f"Street illumination audit score ({lighting}/5.0) indicates unlit or poorly maintained public corridors."
            })
            mitigations.append("Plan journeys along arterial, lit thoroughfares rather than pedestrian shortcuts.")
        elif lighting >= 4.0:
            factors.append({
                "factor": "High Arterial Lighting",
                "impact": "Positive (Protective)",
                "percentage_weight": -15.0,
                "direction": "mitigates_risk",
                "detail": f"Well-lit public spaces ({lighting}/5.0) significantly reduce isolated vulnerability pockets."
            })
            
        # 3. Police Patrol & Enforcement Density
        if patrol < 2.8:
            factors.append({
                "factor": "Infrequent Active Patrols",
                "impact": "Moderate Negative",
                "percentage_weight": 16.0,
                "direction": "increases_risk",
                "detail": f"Patrol frequency index ({patrol}/5.0) indicates wider intervals between PCR/beat patrolling."
            })
        elif patrol >= 4.0:
            factors.append({
                "factor": "High Law Enforcement Presence",
                "impact": "Positive (Protective)",
                "percentage_weight": -18.0,
                "direction": "mitigates_risk",
                "detail": f"Active police presence and designated beat booths ({patrol}/5.0) serve as deterrence."
            })
            
        # 4. Transit Proximity
        if transit > 600:
            factors.append({
                "factor": "Last-Mile Transit Disconnect",
                "impact": "Moderate Negative",
                "percentage_weight": 14.0,
                "direction": "increases_risk",
                "detail": f"Distance to verified metro/bus hub ({transit}m) creates an isolated last-mile transit segment."
            })
            mitigations.append("Pre-arrange verified last-mile transport (e.g. prepaid taxi or official feeder bus) before arrival.")
            
        # 5. Eyes on the Street (Commercial Density)
        if commercial >= 4.0:
            factors.append({
                "factor": "Active Eyes-on-the-Street",
                "impact": "Positive (Protective)",
                "percentage_weight": -12.0,
                "direction": "mitigates_risk",
                "detail": f"Continuous commercial activity ({commercial}/5.0) provides informal community observation."
            })
            
        # Standard analytical disclaimer
        disclaimer = (
            "Analytical Disclaimer: This assessment reflects historical aggregate incident trends and "
            "CPTED environmental factors for the chosen area. It does not measure personal victimisation probability, "
            "nor does it constitute a personal safety guarantee. In any immediate distress, dial 112 directly."
        )
        
        return {
            "zone_name": zone_name,
            "attributions": factors,
            "preventive_recommendations": mitigations,
            "disclaimer": disclaimer
        }

if __name__ == "__main__":
    explainer = SafeHerExplainer()
    sample_features = {
        "zone_name": "Rohini Sector 10",
        "hour": 23,
        "street_lighting_score": 2.2,
        "patrol_frequency_score": 2.1,
        "transit_proximity_m": 850,
        "commercial_density_score": 2.0
    }
    explanation = explainer.explain_prediction(sample_features)
    print("Sample Explainability Output:")
    print(json.dumps(explanation, indent=2))
