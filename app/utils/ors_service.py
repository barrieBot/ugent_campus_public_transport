import openrouteservice
from app.utils.api_key import ors_key

# already have a key - need to make reference to other file 
_client = None

def get_client():
    global _client 
    if _client is None:
        _client = openrouteservice.Client(key = ors_key())
    return _client

#https://pypi.org/project/openrouteservice/

def get_route(start, end):
    client = get_client()
    route = client.directions(
        coordinates=[start, end],
        profile='foot-walking',
        format='geojson'
    )
    return route