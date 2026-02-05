from flask import Blueprint, request, jsonify
from ..models import Symptom
from .. import db

symptoms_bp = Blueprint("symptoms", __name__)
@symptoms_bp.route("/", methods=["POST"])
def create_symptom():
    data = request.json
    symptom = Symptom(
        name=data["name"],
        severity=data["severity"],
        notes=data["notes", ""]
    )
    db.session.add(symptom)
    db.session.commit()
    return jsonify({"message": "Symptom logged"}), 201

@symptoms_bp.route("/", methods=["GET"])
def get_symptoms():
    symptoms = Symptom.query.all()
    return jsonify([
        {"id": s.id, "name": s.name, "severity": s.severity, "notes": s.notes, "created_at": s.created_at} for s in symptoms
    ])