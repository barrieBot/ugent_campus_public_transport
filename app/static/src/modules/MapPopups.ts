export function bikePopup(source: GeoJSON.Feature): HTMLElement {
    const bike_properties = source.properties as any

    const popup = document.createElement('div');

    const text_content =document.createElement('div')
    text_content.innerHTML =  `<h3>Bike: </h3>
        <p>Provider: ${bike_properties.provider  || 'Unknown'}</p>
        <p>Range: ${bike_properties.range} km</p>`

    popup.appendChild(text_content)
    const get_route_button = get_routing_for_popup(source)
    popup.appendChild(get_route_button)

    return popup
}

export function tramPopup(source:GeoJSON.Feature): HTMLElement{
    const tram_properties = source.properties as any

    const popup = document.createElement('div');

    const text_content =document.createElement('div')
    text_content.innerHTML =  `<h3>Tram</h3>
        <p><strong>Tram-Station-Nr.: </strong>${tram_properties.haltenummer}</p>
        <p>${tram_properties.omschrijving}</p>
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
        const location_pos = (source.geometry as GeoJSON.Point).coordinates

        console.log(location_pos)

        ///Here Function Call for API-GetRoute 
    })

    return button
}