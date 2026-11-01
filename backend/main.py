"""
SafeHer AI - FastAPI Analytical & Predictive Backend
Provides endpoints for relative area risk prediction, geospatial hotspot intelligence,
verified emergency directory, and guardrailed AI Safety Assistant.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Optional, List, Dict
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="SafeHer AI API",
    description="Predictive Women Safety & Geospatial Risk Intelligence Platform API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
ML_DIR = os.path.join(BASE_DIR, "ml")

# Load persistent assets
ZONES_FILE = os.path.join(DATA_DIR, "raw", "delhi_zones_metadata.json")
INCIDENTS_FILE = os.path.join(DATA_DIR, "raw", "delhi_incident_history.csv")
MODEL_FILE = os.path.join(ML_DIR, "models", "safeher_xgb_model.joblib")
ENCODER_FILE = os.path.join(ML_DIR, "models", "label_encoder.joblib")
METRICS_FILE = os.path.join(ML_DIR, "models", "metrics_report.json")

# In-memory storage
zones_data = []
if os.path.exists(ZONES_FILE):
    with open(ZONES_FILE, "r", encoding="utf-8") as f:
        zones_data = json.load(f)

model = None
label_encoder = None
metrics_report = {}
if os.path.exists(MODEL_FILE):
    model = joblib.load(MODEL_FILE)
if os.path.exists(ENCODER_FILE):
    label_encoder = joblib.load(ENCODER_FILE)
if os.path.exists(METRICS_FILE):
    with open(METRICS_FILE, "r", encoding="utf-8") as f:
        metrics_report = json.load(f)

# Emergency directory (Verified official Indian helplines)
VERIFIED_HELPLINES = [
    {
        "service": "National Emergency Response Support System (ERSS)",
        "number": "112",
        "description": "Unified 24x7 all-India emergency number for Police, Fire, and Ambulance.",
        "authority": "Ministry of Home Affairs (MHA), Govt of India",
        "type": "Immediate Emergency"
    },
    {
        "service": "Women Police Helpline",
        "number": "1091",
        "description": "Direct 24x7 toll-free police distress line for women in distress or harassment.",
        "authority": "State Police Departments",
        "type": "Police Distress"
    },
    {
        "service": "National Commission for Women (NCW) Helpline",
        "number": "7827170170",
        "description": "24x7 helpline for women facing violence, harassment, or cyber distress.",
        "authority": "National Commission for Women (NCW)",
        "type": "Support & Legal Counsel"
    },
    {
        "service": "Women in Distress Helpline",
        "number": "181",
        "description": "24x7 government helpline for women facing domestic or public harassment.",
        "authority": "Ministry of Women & Child Development (MWCD)",
        "type": "Counseling & Shelter Support"
    },
    {
        "service": "Student & Youth Safety Line",
        "number": "1090",
        "description": "Dedicated line for campus anti-ragging, eve-teasing, and student safety.",
        "authority": "State Law Enforcement & Higher Education Cells",
        "type": "Institutional & Campus"
    },
    {
        "service": "Childline (For Minor Girls & Youths)",
        "number": "1098",
        "description": "Emergency outreach and care service for children and minors in distress.",
        "authority": "Ministry of Women & Child Development (MWCD)",
        "type": "Child & Minor Protection"
    }
]

# Request & Response Schemas
class RiskPredictionRequest(BaseModel):
    zone_name: str = Field(..., example="Connaught Place")
    hour: int = Field(..., ge=0, le=23, example=22)
    day_of_week: str = Field(..., example="Saturday")
    month: int = Field(..., ge=1, le=12, example=11)
    street_lighting_score: Optional[float] = Field(None, ge=1.0, le=5.0)
    patrol_frequency_score: Optional[float] = Field(None, ge=1.0, le=5.0)
    transit_proximity_m: Optional[int] = Field(None, ge=10, le=3000)
    commercial_density_score: Optional[float] = Field(None, ge=1.0, le=5.0)

class ChatMessage(BaseModel):
    message: str = Field(..., example="Is Hauz Khas safe to travel at 11 PM on a weekend?")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SafeHer AI Predictive API",
        "version": "1.0.0",
        "model_loaded": model is not None,
        "zones_count": len(zones_data)
    }

@app.get("/api/v1/areas")
def get_supported_areas():
    """Returns list of all calibrated geographical zones and their baseline indicators."""
    return {"status": "success", "count": len(zones_data), "zones": zones_data}

@app.post("/api/v1/predict-risk")
def predict_relative_risk(req: RiskPredictionRequest):
    """
    Computes area-level historical relative risk tier, numerical risk score (0-100),
    confidence, and explainable feature contributions.
    """
    # Find matching zone
    matched_zone = next((z for z in zones_data if z['zone_name'].lower() == req.zone_name.lower()), None)
    if not matched_zone:
        raise HTTPException(status_code=404, detail=f"Zone '{req.zone_name}' not found in calibrated database.")
        
    # Use defaults from zone metadata if not explicitly provided
    lighting = req.street_lighting_score if req.street_lighting_score is not None else matched_zone['base_lighting']
    patrol = req.patrol_frequency_score if req.patrol_frequency_score is not None else matched_zone['base_patrol']
    transit = req.transit_proximity_m if req.transit_proximity_m is not None else matched_zone['base_transit_m']
    commercial = req.commercial_density_score if req.commercial_density_score is not None else matched_zone['commercial_density']
    
    is_weekend = 1 if req.day_of_week.lower() in ['saturday', 'sunday'] else 0
    
    # Cyclical encodings
    hour_sin = np.sin(2 * np.pi * req.hour / 24.0)
    hour_cos = np.cos(2 * np.pi * req.hour / 24.0)
    month_sin = np.sin(2 * np.pi * req.month / 12.0)
    month_cos = np.cos(2 * np.pi * req.month / 12.0)
    
    features = [
        matched_zone['lat'],
        matched_zone['lng'],
        hour_sin,
        hour_cos,
        month_sin,
        month_cos,
        is_weekend,
        lighting,
        patrol,
        transit,
        commercial
    ]
    
    if model is None:
        raise HTTPException(status_code=500, detail="ML model is not loaded.")
        
    X_input = np.array([features])
    probs = model.predict_proba(X_input)[0]
    pred_class_idx = int(np.argmax(probs))
    pred_label = label_encoder.inverse_transform([pred_class_idx])[0]
    confidence = float(probs[pred_class_idx])
    
    # Compute continuous composite relative risk score (0-100)
    # Weighted by probabilities: Low=20, Moderate=55, High=88
    score_weights = {"Low": 22.0, "Moderate": 58.0, "High": 88.0}
    class_probs = {cls: float(prob) for cls, prob in zip(label_encoder.classes_, probs)}
    continuous_score = sum(class_probs[cls] * score_weights.get(cls, 50.0) for cls in label_encoder.classes_)
    
    # Explainability details
    from ml.explainability import SafeHerExplainer
    explainer = SafeHerExplainer()
    explanation = explainer.explain_prediction({
        "zone_name": matched_zone['zone_name'],
        "hour": req.hour,
        "street_lighting_score": lighting,
        "patrol_frequency_score": patrol,
        "transit_proximity_m": transit,
        "commercial_density_score": commercial,
        "is_weekend": is_weekend
    })
    
    return {
        "status": "success",
        "zone_name": matched_zone['zone_name'],
        "zone_category": matched_zone['category'],
        "coordinates": {"latitude": matched_zone['lat'], "longitude": matched_zone['lng']},
        "temporal_parameters": {
            "hour": req.hour,
            "day_of_week": req.day_of_week,
            "month": req.month,
            "is_weekend": bool(is_weekend)
        },
        "environmental_indicators": {
            "street_lighting_score": lighting,
            "patrol_frequency_score": patrol,
            "transit_proximity_m": transit,
            "commercial_density_score": commercial
        },
        "prediction": {
            "relative_risk_level": pred_label,
            "relative_risk_score": round(continuous_score, 1),
            "confidence": round(confidence, 3),
            "class_probabilities": {k: round(v, 4) for k, v in class_probs.items()}
        },
        "explainability": explanation,
        "safety_principle": (
            "This prediction evaluates historical incident frequency and physical environment patterns. "
            "It is not a guarantee of safety or an estimate of individual victimisation probability."
        )
    }

@app.get("/api/v1/hotspots")
def get_historical_hotspots(limit: int = Query(500, ge=50, le=3000)):
    """Returns spatial coordinates and intensity weights for historical hotspot clustering."""
    if not os.path.exists(INCIDENTS_FILE):
        raise HTTPException(status_code=404, detail="Incident history file not found.")
        
    df = pd.read_csv(INCIDENTS_FILE)
    sample_df = df.tail(limit)
    
    hotspots = []
    for _, row in sample_df.iterrows():
        hotspots.append({
            "id": row['incident_id'],
            "latitude": float(row['latitude']),
            "longitude": float(row['longitude']),
            "zone": row['zone_name'],
            "category": row['crime_category'],
            "risk_score": float(row['relative_risk_score']),
            "risk_level": row['relative_risk_level'],
            "hour": int(row['hour'])
        })
        
    return {"status": "success", "count": len(hotspots), "hotspots": hotspots}

@app.get("/api/v1/emergency-helplines")
def get_emergency_helplines():
    """Returns verified 24x7 emergency helplines and reporting resources."""
    return {"status": "success", "helplines": VERIFIED_HELPLINES}

@app.get("/api/v1/campus-analytics")
def get_campus_analytics():
    """Provides targeted safety risk analysis for educational and university campus hubs."""
    academic_zones = [z for z in zones_data if "Campus" in z['category'] or "Academic" in z['category'] or "Coaching" in z['category']]
    return {
        "status": "success",
        "institutional_zones": academic_zones,
        "recommended_campus_measures": [
            "Maintain operational CCTV surveillance along primary student transit gates.",
            "Conduct quarterly night-time lighting audits along pedestrian corridors to metro stations.",
            "Establish active communication link with local police beat personnel for night shifts."
        ]
    }

@app.post("/api/v1/safety-chat")
def safety_assistant_chat(req: ChatMessage):
    """
    AI Safety Assistant with strict emergency guardrails.
    - If immediate danger is detected, directs instantly to 112.
    - Integrates with Gemini API if key is available, or uses calibrated expert system.
    """
    user_query = req.message.strip().lower()
    
    # 1. Emergency Intent Detection Guardrail
    critical_triggers = [
        "help", "emergency", "danger", "attacked", "harassed", "stalking me right now",
        "save me", "urgent", "dial 112", "police needed", "someone is following me"
    ]
    if any(trigger in user_query for trigger in critical_triggers):
        return {
            "is_emergency": True,
            "response": (
                "⚠️ **IMMEDIATE EMERGENCY DETECTED** ⚠️\n\n"
                "**Please dial 112 immediately for emergency police dispatch.**\n\n"
                "- **National Emergency Number:** 112 (Police / Medical)\n"
                "- **Women Police Helpline:** 1091\n"
                "- **NCW 24x7 Emergency Line:** 7827170170\n\n"
                "*SafeHer AI is an analytical intelligence platform and CANNOT dispatch physical police units or trace your live device. "
                "Move to a populated, well-lit area or commercial shop immediately and contact authorities directly.*"
            ),
            "emergency_numbers": ["112", "1091", "7827170170"]
        }
        
    # 2. Try Gemini API if GEMINI_API_KEY is configured
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            from google import genai
            client = genai.Client(api_key=gemini_key)
            system_prompt = (
                "You are SafeHer AI Assistant, an analytical women safety advisor. "
                "Always adhere to these strict rules: "
                "1. If the user is in distress, immediately tell them to dial 112. "
                "2. Clarify that SafeHer AI provides historical statistical risk estimates, not safety guarantees. "
                "3. Provide verified advice on travel planning, transit hubs, and CPTED environmental factors (lighting, footfall). "
                "4. Keep responses concise, supportive, and practical."
            )
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=f"{system_prompt}\n\nUser Question: {req.message}"
            )
            return {
                "is_emergency": False,
                "response": response.text,
                "model_used": "gemini-2.5-flash"
            }
        except Exception as e:
            # Fall back gracefully to expert rules
            pass
            
    # 3. Deterministic Knowledge-Base Fallback (No hallucination, verified safety domain response)
    fallback_response = (
        "**SafeHer AI Safety Guidance:**\n\n"
        "• **Analytical Principle:** SafeHer AI analyses historical incident patterns and urban environmental factors "
        "(street lighting, transit distance, and patrol frequency) to provide relative area risk assessments. "
        "It does not guarantee individual outcomes.\n\n"
        "• **Preventive Travel Recommendations:**\n"
        "  - Prefer verified public transit interchanges and well-illuminated primary corridors.\n"
        "  - Ensure your phone is charged and share journey details with family or a trusted contact.\n"
        "  - Avoid unmonitored shortcuts through poorly lit transit access lanes.\n\n"
        "• **Verified 24x7 Helplines:**\n"
        "  - **All-India Emergency:** 112\n"
        "  - **Women Helpline:** 1091\n"
        "  - **NCW 24x7:** 7827170170\n\n"
        "*For urgent safety concerns, always dial 112 directly.*"
    )
    
    return {
        "is_emergency": False,
        "response": fallback_response,
        "model_used": "calibrated-expert-engine"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
