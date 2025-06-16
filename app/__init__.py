import os
from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS
from .routes import main

# https://pypi.org/project/python-dotenv/
# https://medium.com/@oadaramola/a-pitfall-i-almost-fell-into-d1d3461b2fb8

def make_app():
    load_dotenv()

    #https://flask.palletsprojects.com/en/stable/quickstart/

    app = Flask(__name__)
    CORS(app)

    # Env-Import für Flask?
    app.config['orc_api_key'] = os.getenv("orc_api_key")
    app.config['deljin_key'] = os.getenv("deljin_key")

    # https://flask.palletsprojects.com/en/stable/tutorial/views/
    app.register_blueprint(main)

    return app
