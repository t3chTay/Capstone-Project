from .extensions import db
from datetime import datetime

class Symptom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    severity = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Integer)