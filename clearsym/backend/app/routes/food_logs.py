from flask import Blueprint, jsonify, request
from app.extensions import db
from app.models.food_log import FoodLog
from app.models.patient_code import PatientCode

food_logs_bp = Blueprint("food_logs", __name__)

def get_patient_or_error():
    patient_code = request.args.get("patient_code")
    
    if not patient_code and request.is_json:
        payload = request.get_json(silent=True) or {}
        patient_code = payload.get("patient_code")
        
    if not patient_code:
        return None, (jsonify({"error": "patient_code is required"}), 400)
    
    pc = PatientCode.query.filter_by(code=patient_code).first()
    if not pc:
        return None, (jsonify({"error": "Invalid patient code"}), 404)
    return pc, None

@food_logs_bp.route("/", methods=["GET"])
def list_food_logs():
    pc, err = get_patient_or_error()
    if err:
        return err
    logs = (FoodLog.query.filter_by(patient_code_id=pc.id).order_by(FoodLog.created_at.desc()).all())
    
    data = [{
        "id": l.id,
        "food_name": l.food_name,
        "notes": l.notes,
        "suspected_trigger": l.suspected_trigger,
        "created_at": l.created_at.isoformat()
    } for l in logs]
    return jsonify(data)



@food_logs_bp.route("/", methods=["POST"])
def create_food_log():
    pc, err = get_patient_or_error()
    data = request.get_json()
    if err:
        return err    
    
    from datetime import datetime
    timestamp = data.get("timestamp")

    if timestamp:
        try:
            created_at = datetime.fromisoformat(timestamp)
        except ValueError:
            return jsonify({"error": "Invalid timestamp format"}), 400
    else:
        created_at = datetime.utcnow()      
    
    
    
    payload = request.get_json() or {}
    food_name = payload.get("food_name", "").strip()
    if not food_name:
        return jsonify({"error": "food_name is required"}), 400

    log = FoodLog(
        food_name=food_name,
        notes=payload.get("notes"),
        suspected_trigger=bool(payload.get("suspected_trigger", False)),
        patient_code_id=pc.id,
        created_at=created_at, 
    )

    db.session.add(log)
    db.session.commit()

    return jsonify({"message": "Food logged successfully", "food_log_id": log.id}), 201
    
@food_logs_bp.route("/<int:log_id>", methods=["DELETE"])
def delete_food_log(log_id):
    pc, err = get_patient_or_error()
    if err:
        return err
    
    log = FoodLog.query.filter(FoodLog.id == log_id, FoodLog.patient_code_id == pc.id).first()
    
    if not log:
        return jsonify({"error": "Food log not found"}), 404
    
    db.session.delete(log)
    db.session.commit()
    return jsonify({"message": "Food log deleted successfully"}), 200
        