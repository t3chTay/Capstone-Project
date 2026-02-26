from flask import Blueprint, jsonify, request
from app.services.weather_service import get_weather
import requests
import os

weather_bp = Blueprint("weather", __name__)

@weather_bp.route("/", methods=["GET"])
def get_weather():
    city = request.args.get("city", "Toronto")
    
    response = requests.get(
        "https://api.openweathermap.org/data/2.5/weather",
        params={
            "q": city,
            "appid": os.getenv("OPENWEATHER_API_KEY"),
            "units": "metric"
        }
    )
    
    data = response.json()
    
    weather_data = {
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "pressure": data["main"]["pressure"],
        "condition": data["weather"][0]["main"],
        "wind_speed": data["wind"]["speed"]
    }
    
    if response.status_code != 200:
        return jsonify({
            "error": "Sorry, unable to fetch weather data",
            "details": data
        }), response.status_code
        
    return jsonify(weather_data)
    