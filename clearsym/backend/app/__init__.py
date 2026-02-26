from flask import Flask, app
from .extensions import db, migrate
from flask_cors import CORS
from dotenv import load_dotenv
import os


def create_app():

    load_dotenv()
    app = Flask(__name__)
    app.config.from_object("app.config.Config")
    app.config["OPENWEATHER_API_KEY"] = os.getenv("OPENWEATHER_API_KEY")
    print("DB URI:", app.config["SQLALCHEMY_DATABASE_URI"])    
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(
        app,
        resources={r"/api/*": {
            "origins": ["http://localhost:5173", "https://localhost:5174"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type"]
            }},
        supports_credentials=True
        )
    @app.get("/api/ping")
    def ping():
        return{"ok": True, "server": "clearsym-backend"}
    
    # @app.after_request
    # def after_request(response):
    #     response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    #     response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    #     response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    #     return response

    
    from .routes.symptoms import symptoms_bp
    from .routes.weather import weather_bp
    from .routes.analytics import analytics_bp
    from .routes.patient_codes import patient_codes_bp
    from .routes.food_logs import food_logs_bp
    app.register_blueprint(symptoms_bp, url_prefix="/api/symptoms")
    app.register_blueprint(weather_bp, url_prefix="/api/weather")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(patient_codes_bp, url_prefix="/api/patient-codes")
    app.register_blueprint(food_logs_bp, url_prefix="/api/food-logs")
    
    print("\n====REGISTERED ROUTES:=====")
    for rule in app.url_map.iter_rules():
        print(rule)
    print("====================\n")
    
    return app 