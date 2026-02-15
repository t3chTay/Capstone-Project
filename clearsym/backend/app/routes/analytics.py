from flask import Blueprint, jsonify
from app.models.symptom import Symptom
from sqlalchemy import func
from app import db

analytics_bp = Blueprint("analytics", __name__)

# severity vs temp chart data
@analytics_bp.route("/severity-temperature", methods=["GET"])
def severity_vs_temperature():
    symptoms = Symptom.query.all()
    
    data = [
        {
            "temperature": s.temperature,
            "severity": s.severity
        }
        for s in symptoms
        if s.temperature is not None
    ]
    
    return jsonify(data)

# daily symptom frequency chart
@analytics_bp.route("/daily-frequency", methods=["GET"])
def daily_frequency():
    
    results = (
        db.session.query(
            func.date(Symptom.created_at),
            func.count(Symptom.id)
        )
        .group_by(func.date(Symptom.created_at))
        .order_by(func.date(Symptom.created_at))
        .all()
    )
    
    data = [
        {
            "date": str(date),
            "count": count
        }
        for date, count in results
    ]
    
    return jsonify(data)

# condition breakdown chart
@analytics_bp.route("/condition-breakdown", methods=["GET"])
def condition_breakdown():
    
    results = (
        db.session.query(
            Symptom.weather_condition,
            func.count(Symptom.id) 
        )
        .group_by(Symptom.weather_condition)
        .all()
    )
    
    data = [
        {
            "condition": condition,
            "count": count
        }
        for condition, count in results
    ]
    
    return jsonify(data)