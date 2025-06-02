import requests


def get_bike_data(lat, lon):
    url = "https://api.bold.eu/urban-mobility/v1/bikes?lat={lat}&lon={lon}"
    response = requests.get(url)
    return response.json()

#https://data.delijn.be/products
#https://data.delijn.be/product#product=5978abf6e8b4390cc83196ad

def get_tram_data():
    #Get real url and key from that ^ url 
    url = "https://data.delijn.be/api/v1/haltes/halte/456239"
    headers = {"Ocp-Apim-Subscription-Key": "my_key"}
    response = requests.get(url, headers=headers)
    return response.json()

