import os

class DevelopmentConfig:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///clearsym.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = "False"
