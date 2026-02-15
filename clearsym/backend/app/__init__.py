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
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True
        )
    
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