from datetime import datetime
from app.extensions import db

class FoodLog(db.Model):
    __tablename__ = "food_logs"
    
    id = db.Column(db.Integer, primary_key=True)
    food_name = db.Column(db.String(150), nullable=False)
    notes = db.Column(db.String(250))
    suspected_trigger = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    patient_code_id = db.Column(db.Integer, db.ForeignKey("patient_codes.id"), nullable=False)