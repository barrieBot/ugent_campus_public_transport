import requests
from app.utils.api_key import deljin_key
from app.utils.data_fetch_csv import get_bikes_from_API_data


def get_bike_data():
    return get_bikes_from_API_data()

#https://data.delijn.be/products
#https://data.delijn.be/product#product=5978abf6e8b4390cc83196ad

def get_tram_data():
    #Get real url and key from that ^ url 
    url = "https://api.delijn.be/DLKernOpenData/api/v1/haltes/2/212159"
    headers = {"Ocp-Apim-Subscription-Key": deljin_key()}
    response = requests.get(url, headers=headers)


    print("Status Code:", response.status_code)
    print("Response Text:", response.text[:500])  # nur erster Teil
    response.raise_for_status()

    return response.json()

