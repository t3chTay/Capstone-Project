from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.symptom import Symptom
from app.services.weather_service import get_weather

symptoms_bp = Blueprint("symptoms", __name__)
@symptoms_bp.route("/", methods=["POST"])
def create_symptom():
    data = request.get_json()
    
    symptom_type = data.get("symptom_type")
    severity = data.get("severity")
    lat = data.get("lat", 43.65107)
    lon = data.get("lon", -79.347015)
    
    if not symptom_type or severity is None:
        return jsonify ({"error": "symptom_type and severity are required"}), 400
    
    weather = get_weather(lat,lon)
    
    temp = weather.get("main", {}).get("temp")
    humidity = weather.get("main", {}).get("humidity")
    pressure = weather.get("main", {}).get("pressure")
    condition = weather.get("weather", [{}])[0].get("main")
    speed = weather.get("wind", {}).get("speed")
    
    symptom = Symptom(
        symptom_type=symptom_type,
        severity=severity,
        notes=data.get("notes", ""),
        temperature=temp,
        humidity=humidity,
        pressure=pressure,
        weather_condition=condition,
        wind_speed=weather.get("wind", {}).get("speed")
    )
    
    db.session.add(symptom)
    db.session.commit()
    return jsonify({
        "message": "Symptom logged successfully",
        "symptom_id": symptom.id
        }), 201

@symptoms_bp.route("/", methods=["GET"])
def get_symptoms():
    symptoms = Symptom.query.order_by(Symptom.created_at.desc()).all()
    return jsonify([s.to_dict() for s in symptoms])