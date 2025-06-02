import pytest
from pathlib import Path
from app.utils import fetcher

def test_check_if_file_is_recent(tmp_path):
    file = tmp_path / "dummy.csv"
    file.write_text("test")
    assert fetcher.check_if_file_is_recent(file, 5)

def test_make_GeoJson_from_CSV(tmp_path):
    csv_file = tmp_path / "sample.csv"
    csv_file.write_text("lat,lon,range,provider\n51.05,3.72,200,Bolt")

    fetcher.bike_csv_path = tmp_path
    fetcher.bike_geojson_path = tmp_path

    fetcher.make_GeoJson_from_CSV("sample.csv")

    geojson_file = tmp_path / "sample.geojson"
    assert geojson_file.exists()
    content = geojson_file.read_text()
    assert "FeatureCollection" in content
