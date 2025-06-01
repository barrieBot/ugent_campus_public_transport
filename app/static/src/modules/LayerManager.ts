declare const L: typeof import('leaflet')
import { init_states as _state } from './State.js';



const layers = {
    trams: L.geoJSON(null, {
        pointToLayer: (feature, latlon) => L.circleMarker(latlon, {
            radius: 6,
            color: 'green',
            fillColor: 'green',
            fillOpacity: 0.8,
        }),
        onEachFeature: (feature, layer) => {
            layer.on('click', () => {
                //Do something
                ///Make popup and call function for Route-Service
            })
            layer.on('hover', () => {
                //Do something else
                //Show popup for as long as neccessary
            })
        }
    }),
    bikes: L.geoJSON(null, {
        onEachFeature: (feature, layer) => {
            layer.on('click', () => {
                //Do something
                console.log("Clicked ", feature.properties)
            })
            layer.on('hover', () => {
                //Do something else
            })
        },
    })
};

export class LayerManager {

    private map: L.Map

    constructor(map: L.Map) {
        this.map = map

        layers.trams.addTo(map)
        layers.bikes.addTo(map)

        _state.onchange(() => {
            console.log("Bikes vis: " + _state.bikesVisible)
            console.log("Trams vis: " + _state.tramsVisible)
            this.setVisible('bikes', _state.bikesVisible)
            this.setVisible('trams', _state.tramsVisible)
        })
    }

    updateLayer(type: 'trams' | 'bikes', geojson: GeoJSON.GeoJsonObject) {
        layers[type].clearLayers()
        layers[type].addData(geojson)
    }

    setVisible(type: 'trams' | 'bikes', visible: boolean) {
        if (visible) {
            layers[type].addTo(this.map)
        } else {
            this.map.removeLayer(layers[type])
        }

    }


    // Mouseover Popup
    // https://www.youtube.com/watch?v=Cqv5bv0mV8Q&ab_channel=GISSolutions


    // Fix Mouseover on click and fetch route 


}



