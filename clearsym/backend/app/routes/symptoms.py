from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.symptom import Symptom
from app.services.weather_service import get_weather
from app.models.patient_code import PatientCode

symptoms_bp = Blueprint("symptoms", __name__)
@symptoms_bp.route("/", methods=["POST"])
def create_symptom():
    data = request.get_json()
    from datetime import datetime
    
    timestamp = data.get("timestamp")

    if timestamp:
        try:
            created_at = datetime.fromisoformat(timestamp)
        except ValueError:
            return jsonify({"error": "Invalid timestamp format"}), 400
    else:
        created_at = datetime.utcnow()   
    
    patient_code = data.get("patient_code")
    if not patient_code:
        return jsonify({"error": "patient_code is required"}), 400
    
    pc = PatientCode.query.filter_by(code=patient_code).first()
    if not pc:
        return jsonify({"error": "Invalid patient_code"}), 400
    
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
    speed = weather.get("wind", {}).get("speed", 0)
    
    
    symptom = Symptom(
        patient_code_id=pc.id,
        symptom_type=symptom_type,
        severity=severity,
        created_at=created_at,
        notes=data.get("notes", ""),
        temperature=temp,
        humidity=humidity,
        pressure=pressure,
        weather_condition=condition,
        wind_speed=speed,
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

@symptoms_bp.route("/<int:symptom_id>", methods=["DELETE"])
def delete_symptom(symptom_id):
    symptom = Symptom.query.get(symptom_id)
    if not symptom:
        return jsonify({"error": "Symptom not found"}), 404
    
    db.session.delete(symptom)
    db.session.commit()
    return jsonify({"message": "Symptom deleted successfully"}), 200

@symptoms_bp.route("/<int:symptom_id>", methods=["PUT"])
def update_symptom(symptom_id):
    symptom = Symptom.query.get(symptom_id)
    if not symptom:
        return jsonify({"error": "Symptom not found"}), 404
    
    data = request.get_json() or {}
    
    if "severity" in data:
        symptom.severity = data["severity"]
    if "notes" in data: 
        symptom.notes = data["notes"]
        
    db.session.commit()
    return jsonify(symptom.to_dict()), 200

@symptoms_bp.get("/by-code/<string:code>")
def get_symptoms_by_code(code):
    pc = PatientCode.query.filter_by(code=code).first()
    if not pc:
        return jsonify([]), 200

    symptoms = (
        Symptom.query
        .filter_by(patient_code_id=pc.id)
        .order_by(Symptom.created_at.desc())
        .all()
    )

    return jsonify([s.to_dict() for s in symptoms]), 200
