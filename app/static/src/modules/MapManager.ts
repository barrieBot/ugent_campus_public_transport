import { init_states as state } from './State.js';
declare const L: typeof import('leaflet')

export let map: L.Map
let user_pos_on_map: L.Marker | null = null

export function SetupMap() {

    map = L.map('map', {
        zoomControl: false
    }).setView([51.05, 3.72], 13);


    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);


    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    ///https://stackoverflow.com/questions/15792655/add-marker-to-google-map-on-click


    map.on('click', (e) => {
        if(state.select_location){
            const user_pos: [number, number] = [e.latlng.lat, e.latlng.lng]
            state.update(v => {
                v.select_location = false
                v.current_pos = user_pos
            })
        }
    })
}

state.onchange(() => {
    if(user_pos_on_map){ map.removeLayer(user_pos_on_map) }
    const user_pos = state.current_pos
    if(user_pos) { user_pos_on_map = L.marker(user_pos, {/* Here you could player an icon or somthing, i think? */}).addTo(map)}
})

