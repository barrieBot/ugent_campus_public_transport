import os
import shutil
import requests
import csv
import json
from collections import OrderedDict

from datetime import datetime, timedelta
from pathlib import Path


file_old_timeout_in_min = 10

target_path = Path('./data')
bike_csv_path = target_path / "bike_data/csv"
bike_geojson_path = target_path / "bike_data/geojson"

log_file = target_path / "script_log.log"
tram_json_path = target_path / "tram_data"

archive = target_path / "archive"


csv_urls = {
    "dott": "https://data.stad.gent/api/explore/v2.1/catalog/datasets/dott-deelfietsen-gent/exports/csv?delimiter=%3B&list_separator=%2C&quote_all=false&with_bom=true",
    "bolt": "https://data.stad.gent/api/explore/v2.1/catalog/datasets/bolt-deelfietsen-gent/exports/csv?delimiter=%3B&list_separator=%2C&quote_all=false&with_bom=true"
}


json_urls = {
    "dott": "https://data.stad.gent/api/explore/v2.1/catalog/datasets/dott-deelfietsen-gent/records?limit=100",
    "bolt": "https://data.stad.gent/api/explore/v2.1/catalog/datasets/bolt-deelfietsen-gent/records?limit=100"
}


def log(msg: str):
    with open(log_file, "a") as file:
        file.write(f"{datetime.now(): %Y-%m-%d %H:%M:%S} : {msg}\n")

def ensure_dir_exists():
    for path in [bike_geojson_path, archive / "geojson"]:
        path.mkdir(parents=True, exist_ok=True)



def check_if_file_is_recent(file_path, max_age):
    if not file_path.exists():
        return False
    file_timespamp = datetime.fromtimestamp(file_path.stat().st_mtime)
    return datetime.now() - file_timespamp < timedelta(minutes=max_age)

def archive_old():
    for file in bike_geojson_path.glob("*.geojson"):
        shutil.move(file, archive / "geojson" / file.name)



def fetch_data():
    ensure_dir_exists()

    recent = False
    for name in json_urls:
        pattern = f"{name}_*.geojson"
        relevant_files = sorted(bike_geojson_path.glob(pattern), reverse=True)
        if relevant_files and check_if_file_is_recent(relevant_files[0], file_old_timeout_in_min):
            recent = True

    if recent:
        return

    archive_old()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")

    for name, url in json_urls.items():
        filename = f"{name}_{timestamp}.geojson"
        path = bike_geojson_path / filename
        r = requests.get(url)
        r.raise_for_status()
        data = r.json()
        print(data)
        make_GeoJson_from_JSON(data, path)
        os.chmod(path, 0o444)
        log(f"{name.capitalize()} GeoJSON saved to {path}")


def make_GeoJson_from_JSON(api_response, output_path: Path):
    features = []

    for record in api_response.get("results", []):
        loc = record.get("loc")
        if not loc:
            continue

        try:
            lat = float(loc["lat"])
            lon = float(loc["lon"])
            provider = record.get("vehicle_type_id", "unknown")
            range_m = record.get("current_range_meters", None)

            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lon, lat]
                },
                "properties": {
                    "provider": provider,
                    "range": range_m
                }
            }
            features.append(feature)
        except (KeyError, ValueError, TypeError):
            continue

    geojson_data = {
        "type": "FeatureCollection",
        "features": features
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(geojson_data, f, indent=4)


# https://stackoverflow.com/questions/48586647/python-script-to-convert-csv-to-geojson

def make_GeoJson_from_CSV(csv_file_name: str):
    geoj = []
    path = bike_csv_path / csv_file_name
    with open(path, newline='', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        next(reader)
        for lat, lon, current_range_meters, bike_provider in reader:
            geoj.append({
                'type':'Feature',
                'geometry': {
                    'type': 'Point',
                '   coordinates': [float(lat), float(lon)]
                },
                'properties':{
                    'provider': bike_provider,
                    'range': current_range_meters 
                }
                })
    geojson_data = {
        'type': 'FeatureCollection',
        'features': geoj
    }
    new_json_path = bike_geojson_path / str(csv_file_name).replace('.csv', '.geojson')
    with open(new_json_path, 'w', encoding='utf-8') as file:
        file.write(json.dumps(geojson_data, sort_keys=False, indent=4))


def get_bikes_from_API_data():
    fetch_data()
    
    latest_file = None
    latest_time = None

    for file in bike_geojson_path.glob("*.geojson"):
        modified_time = file.stat().st_mtime
        if latest_time is None or modified_time > latest_time:
            latest_time = modified_time
            latest_file = file

    if latest_file and latest_file.exists():
        with open(latest_file, "r", encoding="utf-8") as f:
            return json.load(f)
    else:
        log("No valid GeoJSON file found.")
        return {"error": "No data available"}