import os
from dotenv import load_dotenv
load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

    DEBUG = os.getenv("FLASK_DEBUG", "0") == "1"

    db_url = os.getenv("DATABASE_URL")

    if db_url and db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_DATABASE_URI = db_url or "sqlite:///" + os.path.join(basedir, "..", "instance", "clearsym.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False