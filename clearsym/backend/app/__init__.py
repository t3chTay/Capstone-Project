from flask import Flask ,request
from .extensions import db, migrate
from flask_cors import CORS
from dotenv import load_dotenv
from app.config import Config
import os

def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config["OPENWEATHER_API_KEY"] = os.getenv("OPENWEATHER_API_KEY")

    db.init_app(app)
    migrate.init_app(app, db)
    from .models.symptom import Symptom
    from .models.patient_code import PatientCode
    from .models.food_log import FoodLog
    from .models.user import User
    with app.app_context():
        db.create_all()

    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                    "https://astounding-kitten-a11c0a.netlify.app",
                ]
            }
        },
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Content-Type", "Authorization"],
    )

    @app.get("/api/ping")
    def ping():
        return{"ok": True, "server": "clearsym-backend"}
    
    from .routes.symptoms import symptoms_bp
    from .routes.weather import weather_bp
    from .routes.analytics import analytics_bp
    from .routes.patient_codes import patient_codes_bp
    from .routes.food_logs import food_logs_bp
    from .routes.auth import auth_bp
    app.register_blueprint(symptoms_bp, url_prefix="/api/symptoms")
    app.register_blueprint(weather_bp, url_prefix="/api/weather")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(patient_codes_bp, url_prefix="/api/patient-codes")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(food_logs_bp, url_prefix="/api/food-logs")
    
    print("\n====REGISTERED ROUTES:=====")
    for rule in app.url_map.iter_rules():
        print(rule)
    print("====================\n")
    
    return app 