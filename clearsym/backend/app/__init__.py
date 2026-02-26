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
    print("DB URI:", app.config["SQLALCHEMY_DATABASE_URI"])    
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    @app.after_request
    def add_cors_headers(response):
        origin = request.headers.get("Origin")
        allowed = {"http://localhost:5173", "http://localhost:5000"}
        if origin in allowed:
            response.headers["Access-Control-Allow-Origin"] = origin
        else:
            # optional: comment this out if you only want strict origins
            response.headers["Access-Control-Allow-Origin"] = "*"

        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        return response

    @app.route("/api/<path:_path>", methods=["OPTIONS"])
    def preflight(_path):
        return ("", 204)
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