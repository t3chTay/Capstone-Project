from app.extensions import db
from datetime import datetime
import secrets

class PatientCode(db.Model):
    __tablename__ = "patient_codes"
    
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(16), unique=True, nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    @staticmethod
    def generate_code():
        return "CLRSYM-" + secrets.token_hex(3).upper()
    
    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "created_at": self.created_at.isoformat()
        }
    