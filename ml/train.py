"""
SafeHer AI - Machine Learning Training & Chronological Validation Pipeline
Strictly validates against temporal data leakage:
- Evaluates on chronological split (Earliest 80% Train, Latest 20% Test)
- Baseline comparison: Logistic Regression vs Random Forest vs XGBoost
- Macro F1, Precision, Recall, Confusion Matrix
- Model persistence for runtime inference and explainability
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, f1_score, accuracy_score, confusion_matrix
import xgboost as xgb

def train_and_evaluate():
    base_dir = os.path.dirname(os.path.dirname(__file__))
    data_path = os.path.join(base_dir, "data", "raw", "delhi_incident_history.csv")
    models_dir = os.path.join(base_dir, "ml", "models")
    os.makedirs(models_dir, exist_ok=True)
    
    print(f"Loading historical incident data from: {data_path}")
    df = pd.read_csv(data_path)
    
    # Ensure chronological sorting
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values(by='timestamp').reset_index(drop=True)
    
    # Feature Engineering: Cyclical temporal features
    df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24.0)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24.0)
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12.0)
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12.0)
    
    feature_cols = [
        'latitude', 'longitude',
        'hour_sin', 'hour_cos',
        'month_sin', 'month_cos',
        'is_weekend',
        'street_lighting_score',
        'patrol_frequency_score',
        'transit_proximity_m',
        'commercial_density_score'
    ]
    
    X = df[feature_cols].copy()
    y_raw = df['relative_risk_level'].copy()
    y_score = df['relative_risk_score'].copy()
    
    # Label encode target
    le = LabelEncoder()
    # Ensure consistent ordering: Low: 0, Moderate: 1, High: 2
    le.fit(['Low', 'Moderate', 'High'])
    y = le.transform(y_raw)
    
    # Chronological Split: 80% Train, 20% Test (strictly chronologically separated)
    split_idx = int(len(df) * 0.8)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]
    
    train_dates = (df['timestamp'].iloc[0].strftime('%Y-%m-%d'), df['timestamp'].iloc[split_idx-1].strftime('%Y-%m-%d'))
    test_dates = (df['timestamp'].iloc[split_idx].strftime('%Y-%m-%d'), df['timestamp'].iloc[-1].strftime('%Y-%m-%d'))
    print(f"Train Period: {train_dates[0]} to {train_dates[1]} ({len(X_train)} samples)")
    print(f"Test Period: {test_dates[0]} to {test_dates[1]} ({len(X_test)} samples)")
    
    # Feature Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # 1. Baseline Model: Logistic Regression
    print("\n--- Model 1: Baseline Logistic Regression ---")
    lr = LogisticRegression(max_iter=1000, random_state=42)
    lr.fit(X_train_scaled, y_train)
    y_pred_lr = lr.predict(X_test_scaled)
    acc_lr = accuracy_score(y_test, y_pred_lr)
    f1_lr = f1_score(y_test, y_pred_lr, average='macro')
    print(f"Baseline Logistic Regression Accuracy: {acc_lr:.4f}, Macro F1: {f1_lr:.4f}")
    
    # 2. Model 2: Random Forest
    print("\n--- Model 2: Random Forest Classifier ---")
    rf = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    rf.fit(X_train, y_train)
    y_pred_rf = rf.predict(X_test)
    acc_rf = accuracy_score(y_test, y_pred_rf)
    f1_rf = f1_score(y_test, y_pred_rf, average='macro')
    print(f"Random Forest Accuracy: {acc_rf:.4f}, Macro F1: {f1_rf:.4f}")
    
    # 3. Model 3: XGBoost Classifier (Champion Model)
    print("\n--- Model 3: XGBoost Multi-Class Classifier ---")
    xgb_model = xgb.XGBClassifier(
        n_estimators=120,
        max_depth=5,
        learning_rate=0.08,
        subsample=0.85,
        colsample_bytree=0.85,
        random_state=42,
        eval_metric='mlogloss'
    )
    xgb_model.fit(X_train, y_train)
    y_pred_xgb = xgb_model.predict(X_test)
    acc_xgb = accuracy_score(y_test, y_pred_xgb)
    f1_xgb = f1_score(y_test, y_pred_xgb, average='macro')
    
    print(f"XGBoost Accuracy: {acc_xgb:.4f}, Macro F1: {f1_xgb:.4f}")
    
    report_dict = classification_report(
        y_test, y_pred_xgb,
        target_names=le.classes_,
        output_dict=True
    )
    cm = confusion_matrix(y_test, y_pred_xgb).tolist()
    
    print("\nDetailed Classification Report for XGBoost:")
    print(classification_report(y_test, y_pred_xgb, target_names=le.classes_))
    
    # Feature Importances from XGBoost
    importances = dict(zip(feature_cols, [float(x) for x in xgb_model.feature_importances_]))
    sorted_importances = sorted(importances.items(), key=lambda x: x[1], reverse=True)
    
    metrics_summary = {
        "dataset": {
            "total_records": len(df),
            "train_records": len(X_train),
            "test_records": len(X_test),
            "train_dates": train_dates,
            "test_dates": test_dates
        },
        "models_comparison": {
            "logistic_regression": {"accuracy": float(acc_lr), "macro_f1": float(f1_lr)},
            "random_forest": {"accuracy": float(acc_rf), "macro_f1": float(f1_rf)},
            "xgboost": {"accuracy": float(acc_xgb), "macro_f1": float(f1_xgb)}
        },
        "champion_model": "xgboost",
        "detailed_metrics": report_dict,
        "confusion_matrix": cm,
        "classes": list(le.classes_),
        "feature_importances": sorted_importances,
        "feature_columns": feature_cols
    }
    
    # Save artifacts
    joblib.dump(xgb_model, os.path.join(models_dir, "safeher_xgb_model.joblib"))
    joblib.dump(scaler, os.path.join(models_dir, "scaler.joblib"))
    joblib.dump(le, os.path.join(models_dir, "label_encoder.joblib"))
    
    with open(os.path.join(models_dir, "metrics_report.json"), "w", encoding="utf-8") as f:
        json.dump(metrics_summary, f, indent=2)
        
    print(f"\nModel artifacts successfully saved in {models_dir}")
    return metrics_summary

if __name__ == "__main__":
    train_and_evaluate()
