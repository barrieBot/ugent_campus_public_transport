from flask import current_app

# api key from ->
# https://openrouteservice.org/
def ors_key():
    return current_app.config['orc_api_key']

# need to fetch key from ->
# https://data.delijn.be/product#product=5978abf6e8b4390cc83196ad
def deljin_key():
    return current_app.config['deljin_key']

# does this need a key?
bolt_key = ""
