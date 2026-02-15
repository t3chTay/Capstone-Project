import requests
from flask import current_app


def get_weather(lat,lon):
    api_key = current_app.config["OPENWEATHER_API_KEY"]
    print(f"API Key being used: {api_key}")
    url = (
        f"https://api.openweathermap.org/data/2.5/weather"
    )
    params = {
        "lat": lat,
        "lon": lon,
        "appid": api_key,
        "units": "metric"
    }
    response = requests.get(url, params=params)
    return response.json()

# when called a symptom is logged