from flask import requests, current_app

def get_weather(lat,lon):
    api_key = current_app.config("OPENWEATHER-API-KEY") #add api key
    url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?lat={lat}&lon={lon}&appid={api_key}&units=metric"
    )
    response = requests.get(url)
    return response.json()

# when called a symptom is logged