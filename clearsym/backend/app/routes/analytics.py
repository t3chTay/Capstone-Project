from flask import Blueprint, jsonify, request
from sqlalchemy import func
from app.extensions import db
from app.models.symptom import Symptom
from app.models.patient_code import PatientCode
from datetime import timedelta
from app.models.food_log import FoodLog

analytics_bp = Blueprint("analytics", __name__)

def get_patient():
    patient_code = request.args.get("patient_code")
    if not patient_code:
        return None, (jsonify({"error": "patient_code query param is required"}), 400)

    pc = PatientCode.query.filter_by(code=patient_code).first()
    if not pc:
        return None, (jsonify({"error": "Invalid patient code"}), 404)

    return pc, None


@analytics_bp.route("/severity-temperature", methods=["GET"])
def severity_vs_temperature():
    pc, err = get_patient()
    if err:
        return err

    symptoms = Symptom.query.filter(Symptom.patient_code_id == pc.id).all()

    data = [
        {"temperature": s.temperature, "severity": s.severity}
        for s in symptoms
        if s.temperature is not None
    ]
    return jsonify(data)


@analytics_bp.route("/daily-frequency", methods=["GET"])
def daily_frequency():
    pc, err = get_patient()
    if err:
        return err

    results = (
        db.session.query(
            func.date(Symptom.created_at).label("day"),
            func.count(Symptom.id).label("count"),
        )
        .filter(Symptom.patient_code_id == pc.id)
        .group_by(func.date(Symptom.created_at))
        .order_by(func.date(Symptom.created_at))
        .all()
    )

    data = [{"date": str(day), "count": count} for day, count in results]
    return jsonify(data)


@analytics_bp.route("/condition-breakdown", methods=["GET"])
def condition_breakdown():
    pc, err = get_patient()
    if err:
        return err

    results = (
        db.session.query(
            Symptom.weather_condition,
            func.count(Symptom.id),
        )
        .filter(Symptom.patient_code_id == pc.id)
        .group_by(Symptom.weather_condition)
        .all()
    )

    data = [{"condition": condition, "count": count} for condition, count in results]
    return jsonify(data)

@analytics_bp.route("/food-severity", methods=["GET"])
def food_severity():
    from app.models.patient_code import PatientCode
    
    patient_code = request.args.get("patient_code")
    if not patient_code:
        return jsonify({"error": "patient_code query param is required"}), 400
    
    pc = PatientCode.query.filter_by(code=patient_code).first()
    if not pc:
        return jsonify({"error": "Invalid patient code"}), 404
    
    window_hours = request.args.get("window_hours", default=6, type=int)
    window = timedelta(hours=window_hours)
    
    foods = (
        FoodLog.query.filter(FoodLog.patient_code_id == pc.id).order_by(FoodLog.created_at.desc()).all()
    )
    symptoms = (
        Symptom.query.filter(Symptom.patient_code_id == pc.id).order_by(Symptom.created_at.desc()).all()
    )
    
    bucket = {} #food name then list of severities
    
    for f in foods:
        start = f.created_at
        end = f.created_at + window
        matched = [s.severity for s in symptoms if s.created_at >= start and s.created_at <= end and s.severity is not None ]
        
        if matched:
            key = (f.food_name or "").strip().lower()
            if not key:
                continue
            bucket.setdefault(key, []).extend(matched)
            
    # ranked results
    results = []
    for food_key, severities in bucket.items():
        avg = sum(severities) / len(severities)
        results.append({
            "food": food_key.title(),
            "avg_severity": round(avg, 2),
            "symptom_count": len(severities)
        })
    results.sort(key=lambda x: (x["avg_severity"], x["symptom_count"]), reverse=True)
    
    return jsonify({
        "window_hours": window_hours,
        "results": results
    })