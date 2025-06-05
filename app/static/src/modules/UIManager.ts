import { latLng } from "leaflet"
import { init_states as _state } from "./State.js"
import { map, SetupMap } from './MapManager.js';
import { LayerManager } from './LayerManager.js';
import { DataPolling } from './DataPoller.js';

export class UIManager {

    static open_ContrPanel = document.getElementById('open_controls')
    static close_ContrPanel = document.getElementById('close_control_panel')
    static control_panel = document.querySelector('#control_panel')

    static ping_pos_button = document.querySelector('#pinpoint_location_button')
    static set_pos_button = document.querySelector('#set_location_button')
    static set_pos_nav = document.querySelector('#set_location_nav')

    static lon_coords_input = document.querySelector('#lon_coords') as HTMLInputElement
    static valid_lon: boolean = true
    static lat_coords_input = document.querySelector('#lat_coords') as HTMLInputElement
    static valid_lat: boolean = true

    static trams_vis_check = document.querySelector('#trams_visible_check') as HTMLInputElement
    static bikes_vis_check = document.querySelector('#bikes_visible_check') as HTMLInputElement


    constructor() {

        UIManager.open_ContrPanel!.addEventListener('click', this.toggle_contr)
        UIManager.close_ContrPanel!.addEventListener('click', this.toggle_contr)

        UIManager.ping_pos_button!.addEventListener('click', this.ping_pos)
        UIManager.set_pos_button!.addEventListener('click', this.set_pos)
        UIManager.set_pos_nav!.addEventListener('click', this.set_pos)

        UIManager.lon_coords_input!.addEventListener('blur', this.enter_lat_lon)
        UIManager.lat_coords_input!.addEventListener('blur', this.enter_lat_lon)

        UIManager.trams_vis_check!.addEventListener('change', ({ target }) => {
            _state.update(state => {
                state.tramsVisible = (target as HTMLInputElement).checked
            })
        })
        UIManager.bikes_vis_check!.addEventListener('change', ({ target }) => {
            _state.update(state => {
                state.bikesVisible = (target as HTMLInputElement).checked
            })
        })

        _state.onchange(() => {
            if (UIManager.lat_coords_input) { UIManager.lat_coords_input.value = _state.current_pos[0].toString() }
            if (UIManager.lon_coords_input) { UIManager.lon_coords_input.value = _state.current_pos[1].toString() }

        })



        SetupMap()
        const layer_Manager = new LayerManager(map)
        const pollingService = new DataPolling(layer_Manager)

        pollingService.startPolling()


    }

    toggle_contr() {
        UIManager.open_ContrPanel!.classList.toggle('active')
        UIManager.control_panel!.classList.toggle('active')
    }

    ping_pos() {
        navigator.geolocation.getCurrentPosition(user_pos => {
            const lat_lon: [number, number] = [user_pos.coords.latitude, user_pos.coords.longitude]

            //Here maybe alerts for out of Range_pos
            //Your Position is not within the bounds of the Serviceable location....


            _state.update(state => { state.current_pos = lat_lon })
        })
    }

    set_pos() {

        _state.update(state => { state.select_location = true })

    }

    enter_lat_lon() {
        console.log(UIManager.valid_lat)
        console.log(UIManager.valid_lon)

        const lon_val = UIManager.lon_coords_input?.value ?? ""
        const lat_val = UIManager.lat_coords_input?.value ?? ""

        const lon = parseFloat(lon_val)
        const lat = parseFloat(lat_val)

        UIManager.valid_lon = !isNaN(lon) && lon >= -180 && lon <= 180
        UIManager.valid_lat = !isNaN(lat) && lat >= -90 && lat <= 90

        UIManager.lon_coords_input?.classList.toggle("error", !UIManager.valid_lon)
        UIManager.lat_coords_input?.classList.toggle("error", !UIManager.valid_lat)

        if (UIManager.valid_lat && UIManager.valid_lon) {
            _state.update(state => {
                state.current_pos = [lat, lon]
            })
        }
    }

};

