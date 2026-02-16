from ..extensions import db
from datetime import datetime

class Symptom(db.Model):
    __tablename__ = "symptoms"
    id = db.Column(db.Integer, primary_key=True)
    
    symptom_type = db.Column(db.String(100), nullable=False)
    severity = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text)
    
    # weather
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Integer)
    pressure = db.Column(db.Integer)
    weather_condition = db.Column(db.String(50))
    wind_speed = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            "id": self.id,
            "symptom_type": self.symptom_type,
            "severity": self.severity,
            "notes": self.notes,
            "temperature": self.temperature,
            "humidity": self.humidity,
            "pressure": self.pressure,
            "weather_condition": self.weather_condition,
            "wind_speed": self.wind_speed,
            "created_at": self.created_at.isoformat()
        }