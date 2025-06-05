declare const L: typeof import('leaflet')
import { apiService } from './APIService.js';
import { bikePopup, routePopup, tramPopup } from './MapPopups.js';
import { init_states as _state } from './State.js';


const tram_icon = L.divIcon({
    className: 'custom_icon',
    html: '<div class="tram_station"></div>',
    iconSize: [30, 84],
    iconAnchor: [15, 84]
})

const bike_icon = L.divIcon({
    className: 'custom_icon',
    html: '<div class="bike_location"></div>',
    iconSize: [32, 57],
    iconAnchor: [16, 57]
})


const layers = {
    trams: L.geoJSON(null, {
        pointToLayer: (feature, latlon) => L.marker(latlon, {
            icon: tram_icon
        }),
        onEachFeature: (feature, layer) => {
            layer.bindPopup(L.popup().setContent(tramPopup(feature)))
        }
    }),
    bikes: L.geoJSON(null, {
        pointToLayer: (feature, latlon) => L.marker(latlon, {
            icon: bike_icon
        }),
        onEachFeature: (feature, layer) => {
            layer.bindPopup(L.popup().setContent(bikePopup(feature)))
        },
    }),
    routes: L.geoJSON(null, {
        style: (feature) => ({
            color: "#FF0000",
            weight: 5,
            opacity: 0.5
            // Can I put that into css?
        }),
        onEachFeature: (feature, layer) => {
            //Bind popup
            layer.bindPopup(L.popup().setContent(routePopup(feature)))
            // On click stuff? Maybe not nessecary 
        },
    })
};

export class LayerManager {

    private map: L.Map
    private routeAPI = apiService

    constructor(map: L.Map) {
        this.map = map

        layers.trams.addTo(map)
        layers.bikes.addTo(map)

        _state.onchange(() => {
            if (_state.routeVisible) {
                this.displayRoute()
            } else {
                this.deleteRoute()
            }
            this.setVisible('bikes', _state.bikesVisible)
            this.setVisible('trams', _state.tramsVisible)
        })
    }

    updateLayer(type: 'trams' | 'bikes' | 'routes', geojson: GeoJSON.GeoJsonObject) {
        layers[type].clearLayers()
        layers[type].addData(geojson)
    }

    setVisible(type: 'trams' | 'bikes' | 'routes', visible: boolean) {
        if (visible) {
            layers[type].addTo(this.map)
        } else {
            this.map.removeLayer(layers[type])
        }

    }

    displayRoute() {
        if (_state.dest_pos) {
            this.routeAPI.getRoute(_state.current_pos, _state.dest_pos)
                .then(route => this.updateLayer('routes', route))
                .then(() => this.setVisible('routes', true))
                .catch((e) => console.log('Error while fetching Route: ', e))
        }
    }

    deleteRoute() {
        this.map.removeLayer(layers['routes'])
        layers['routes'].clearLayers()
    }






    // Mouseover Popup?
    // https://www.youtube.com/watch?v=Cqv5bv0mV8Q&ab_channel=GISSolutions

    // Fix Mouseover on click and fetch route 


}



