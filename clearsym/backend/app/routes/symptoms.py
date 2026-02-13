from flask import Blueprint, request, jsonify
from app import db
from app.models.symptom import Symptom
from app.services.weather_service import get_weather

symptoms_bp = Blueprint("symptoms", __name__)
@symptoms_bp.route("/", methods=["POST"])
def create_symptom():
    data = request.json
    lat = data.get("lat", 43.65107)
    lon = data.get ("lon", -79.347015)
    
    weather = get_weather(lat,lon)
    symptom = Symptom (
        name=data["name"],
        severity=data["severity"],
        notes=data["notes", ""]
        symptom.temperature = weather["main"]["temp"]
        symptom.humidity = weather["main"]["humidity"]
        pressure=weather["main"]["pressure"],
        weather_condition=weather["weather"][0]["main"],
        wind_speed=weather["wind"]["speed"]
    )
    
    db.session.add(symptom)
    db.session.commit()
    return jsonify(symptom.to_dict()), 201

@symptoms_bp.route("/", methods=["GET"])
def get_symptoms():
    symptoms = Symptom.query.order_by(Symptom.created_at.desc()).all()
    return jsonify([s.to_dict() for s in symptoms])