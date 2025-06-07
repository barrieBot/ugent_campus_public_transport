"""
Utility layer imported by app/routes.py.

•  /api/bikes  → latest Dott/Bolt feed, stored on disk by bike_geojson_script.py
•  /api/trams  → fetches one (or more) De Lijn haltes, **saves them to disk in
   exactly the same way** as the bike layer, then returns the GeoJSON so the
   Flask route can `jsonify()` it.
"""

from __future__ import annotations

import os
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import requests

from app.utils.data_fetch_csv import get_bikes_from_API_data  # legacy alias
from app.utils.api_key import deljin_key

# ───────────────────────────────────────────────────────────────────────────────
#  Constants & paths
# ───────────────────────────────────────────────────────────────────────────────

TARGET_PATH        = Path("./data")
TRAM_GEOJSON_PATH  = TARGET_PATH / "tram_data/geojson"
ARCHIVE_DIR_TRAM   = TARGET_PATH / "archive/tram_geojson"

DL_API_BASE = "https://api.delijn.be/DLKernOpenData/api/v1"

# ───────────────────────────────────────────────────────────────────────────────
#  Disk helpers – mimic behaviour of bike script
# ───────────────────────────────────────────────────────────────────────────────

def _ensure_dirs() -> None:
    for p in (TRAM_GEOJSON_PATH, ARCHIVE_DIR_TRAM):
        p.mkdir(parents=True, exist_ok=True)


def _archive_old() -> None:
    """Archive existing GeoJSONs before writing a fresh one."""
    for file in TRAM_GEOJSON_PATH.glob("*.geojson"):
        ARCHIVE_DIR_TRAM.mkdir(parents=True, exist_ok=True)
        file.replace(ARCHIVE_DIR_TRAM / file.name)


def _save_tram_geojson(data: Dict[str, Any]) -> None:
    """Write *data* (FeatureCollection) to a timestamped .geojson file."""
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M")  # avoid ':' on Windows
    out_path  = TRAM_GEOJSON_PATH / f"tram_{timestamp}.geojson"
    out_path.write_text(
        __import__("json").dumps(data, indent=2, ensure_ascii=False),
        encoding="utf-8"
    )
    os.chmod(out_path, 0o444)

# ───────────────────────────────────────────────────────────────────────────────
#  Public helper used by routes.py
# ───────────────────────────────────────────────────────────────────────────────

def get_bike_data() -> Dict[str, Any]:
    """Return the latest bike GeoJSON (Dott & Bolt)."""
    return get_bikes_from_API_data()

# ───────────────────────────────────────────────────────────────────────────────
#  De Lijn helpers
# ───────────────────────────────────────────────────────────────────────────────

# -- coordinate extraction ------------------------------------------------------

def _extract_lat_lon(halte: Dict[str, Any]) -> Optional[tuple[float, float]]:
    """Return (lat, lon) from the many variants the API uses, or None."""
    coord = halte.get("geoCoordinaat")
    if isinstance(coord, dict) and "latitude" in coord and "longitude" in coord:
        return float(coord["latitude"]), float(coord["longitude"])

    if "geoPointLatitude" in halte and "geoPointLongitude" in halte:
        return float(halte["geoPointLatitude"]), float(halte["geoPointLongitude"])

    geom = halte.get("geometry")
    if isinstance(geom, dict) and geom.get("type") == "Point":
        coords = geom.get("coordinates")
        if isinstance(coords, list) and len(coords) == 2:
            lon, lat = coords
            return float(lat), float(lon)
    return None

# -- converters -----------------------------------------------------------------

def _halte_to_feature(halte: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    coords = _extract_lat_lon(halte)
    if coords is None:
        return None
    lat, lon = coords
    return {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [lon, lat]},
        "properties": {
            "provider":       "De Lijn",
            "entiteitnummer": halte.get("entiteitnummer"),
            "haltenummer":    halte.get("haltenummer"),
            "omschrijving":   halte.get("omschrijving"),
            "gemeente":       halte.get("omschrijvingGemeente") or halte.get("gemeente"),
        },
    }


def _haltes_to_featurecollection(haltes: List[Dict[str, Any]]) -> Dict[str, Any]:
    features = [feat for h in haltes if (feat := _halte_to_feature(h))]
    return {
        "type": "FeatureCollection",
        "crs": {"type": "name", "properties": {"name": "EPSG:4326"}},
        "features": features,
    }

# -- request wrappers -----------------------------------------------------------

def _headers() -> Dict[str, str]:
    return {"Ocp-Apim-Subscription-Key": deljin_key()}

# -- public tram endpoint -------------------------------------------------------

def get_tram_data() -> Dict[str, Any]:
    """Fetch Gent-Sint-Pieters halte, save GeoJSON, return it."""

    _ensure_dirs()
    _archive_old()

    url = f"{DL_API_BASE}/haltes/2/212159"
    resp = requests.get(url, headers=_headers(), timeout=10)
    resp.raise_for_status()

    halte_obj = resp.json()  # single halte
    fc = _haltes_to_featurecollection([halte_obj])

    _save_tram_geojson(fc)
    return fc
