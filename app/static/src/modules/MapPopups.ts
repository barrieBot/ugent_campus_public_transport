import { init_states as _state} from "./State.js";


export function bikePopup(source: GeoJSON.Feature): HTMLElement {
    const bike_properties = source.properties as GeoJSON.GeoJsonProperties || {}

    const popup = document.createElement('div');

    const text_content =document.createElement('div')
    text_content.innerHTML =  `<h3>Bike: </h3>
        <p>Provider: ${bike_properties.provider  || 'Unknown'}</p>
        <p>Range: ${ Math.round(bike_properties.range/10) /100 || '-' } km</p>`

    popup.appendChild(text_content)
    const get_route_button = get_routing_for_popup(source)
    popup.appendChild(get_route_button)

    return popup
}

export function tramPopup(source:GeoJSON.Feature): HTMLElement{
    const tram_properties = source.properties as GeoJSON.GeoJsonProperties || {}

    const popup = document.createElement('div');

    const text_content =document.createElement('div')
    text_content.innerHTML =  `<h3>Tram</h3>
        <p><strong>Tram-Station-Nr.: </strong>${tram_properties.haltenummer || ''}</p>
        <p>${tram_properties.omschrijving || ''}</p>
        <p></p>`

    popup.appendChild(text_content)
    const get_route_button = get_routing_for_popup(source)
    popup.appendChild(get_route_button)

    return popup
}


export function get_routing_for_popup(source: GeoJSON.Feature): HTMLButtonElement{

    const button = document.createElement('button')
    button.textContent = 'Route'

    //Maybe, add checks for (source.geometry as GeoJSON.Point).coordinates
    //to validate input and disable button?

    button.classList.add('btn', 'btn-primary')
    button.addEventListener('click', () => {
                _state.update(v => {
                    const clicked_location = (source.geometry as GeoJSON.Point).coordinates;
                    v.dest_pos = [clicked_location[1], clicked_location[0]]
                    v.routeVisible = true
                })
    })

    return button
}




export function routePopup(source: GeoJSON.Feature): HTMLElement{
    const  route_properties = source.properties as GeoJSON.GeoJsonProperties || {}
    const popup = document.createElement('div')
    //add Class here

    const text_content =document.createElement('div')
    text_content.innerHTML =  `<h3>Route</h3>
        <p>Disance: ${Math.round(route_properties.summary.distance/10) /100 +'km' || ' Unknown'}</p>
        <p>Time: ${Math.round(route_properties.summary.duration/60) + 'min' || ' Unknown'} </p>`

    popup.appendChild(text_content)

    ///Button for close route here, maybe

    const delete_route_button = deleteRoute()
    popup.appendChild(delete_route_button)


    return popup
}



export function deleteRoute(): HTMLButtonElement{

    const button = document.createElement('button')
    button.textContent = 'Delete'


    //vehicle_type_id -> Backend scan history -> make csv, make route (ORS) get bike-locations maybe -> No, doesn't work, no unique id

    button.classList.add('btn', 'btn-primary')
    button.addEventListener('click', () => {
                _state.update(v => {
                    v.routeVisible = false
                })
    })

    return button
}
