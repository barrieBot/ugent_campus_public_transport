from flask  import Blueprint, render_template, jsonify, request
from app.utils.data_api_calls import get_bike_data, get_tram_data
from app.utils.ors_service import get_route


main = Blueprint('main', __name__)

#https://flask.palletsprojects.com/en/stable/quickstart/

@main.route("/")
def index():
    return render_template("index.html")

@main.route("/api/bikes")
def bikes():
    return jsonify(get_bike_data())

@main.route("/api/trams")
def trams():
    return jsonify(get_tram_data())

@main.route("/api/route", methods=["POST"])
def route():
    data = request.get_json()
    start = data.get("start")
    end = data.get("end")
    return jsonify(get_route(start, end))
