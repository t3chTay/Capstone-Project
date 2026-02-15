import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
    DEBUG = True
    
    SQLALCHEMY_DATABASE_URI = "sqlite:///clearsym.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = "False"
