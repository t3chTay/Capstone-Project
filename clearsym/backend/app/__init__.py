from flask import Flask
from .extensions import db
from flask_cors import CORS
from dotenv import load_dotenv
import os


def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config.from_object("app.config.Config")
    app.config["OPENWEATHER_API_KEY"] = os.getenv("OPENWEATHER_API_KEY")
    db.init_app(app)
    CORS(
        app,
        resources={r"/api/*": {
            "origins": ["http://localhost:5173", "https://localhost:5174"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type"]
            }},
        supports_credentials=True
        )
    @app.after_request
    def after_request(response):
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
        return response
    
    from .routes.symptoms import symptoms_bp
    from .routes.weather import weather_bp
    from .routes.analytics import analytics_bp
    app.register_blueprint(symptoms_bp, url_prefix="/api/symptoms")
    app.register_blueprint(weather_bp, url_prefix="/api/weather")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    
    print("\nREGISTERED ROUTES:")
    for rule in app.url_map.iter_rules():
        print(rule)
    print()
    return app 