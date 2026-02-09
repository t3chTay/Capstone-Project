from flask import Flask
from .extensions import db
from flask_cors import CORS
from dotenv import load_dotenv
import os


def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config.from_object("app.config.DevelopmentConfig")
    app.config["openweather_api_key"] = os.getenv("openweather_api_key")
    db.init_app(app)
    CORS(app)
    
    from .routes.symptoms import symptoms_bp
    from .routes.weather import weather_bp
    app.register_blueprint(symptoms_bp, url_prefix="/symptoms")
    app.register_blueprint(weather_bp, url_prefix="/api/weather")
        
    return app 