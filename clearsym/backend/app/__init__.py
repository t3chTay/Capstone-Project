from flask import Flask
from .extensions import db
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object("app.config.DevelopmentConfig")
    
    db.init_app(app)
    CORS(app)
    
    from .routes.symptoms import symptoms_bp
    app.register_blueprint(symptoms_bp, url_prefix="/symptoms")
    
    return app 