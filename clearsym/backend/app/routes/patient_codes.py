from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models.patient_code import PatientCode

patient_codes_bp = Blueprint("patient_codes", __name__)

@patient_codes_bp.route("/", methods=["POST"])
def create_patient_code():
    code = PatientCode.generate_code()
    while PatientCode.query.filter_by(code=code).first():
        code = PatientCode.generate_code()
        
    pc = PatientCode(code=code)
    db.session.add(pc)
    db.session.commit()
    return jsonify(pc.to_dict()), 201

@patient_codes_bp.get("/validate")
def validate_patient_code():
    code = request.args.get("patient_code")
    if not code:
        return jsonify({"valid": False, "error": "patient_code required"}), 400

    exists = PatientCode.query.filter_by(code=code).first()
    if not exists:
        return jsonify({"valid": False}), 404

    return jsonify({"valid": True}), 200
