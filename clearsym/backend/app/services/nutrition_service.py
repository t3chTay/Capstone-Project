from flask import requests, current_app
def analyze_food(food):
    url = "https://api.edamam.com/api/nutrition-data"
    params = {
        "app_id": current_app.config["EDAMAM_APP_ID"], #add id
        "app_key": current_app.config["EDAMAM_APP_KEY"],#add api key
        "ingr": food
    }
    response= requests.et(url, params=params)
    return response.json()