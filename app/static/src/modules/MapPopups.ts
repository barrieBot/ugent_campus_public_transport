export function bikePopup(source: GeoJSON.Feature): string {
    const bike_properties = source.properties as any
    return `
    <div>
        <h3>Bike: </h3>
        <p>Provider: ${bike_properties.provider}</p>
        <p>Range: ${bike_properties.range} km</p>
        <button id="get_route">Route</button>
    </div>`
}

export function tramPopup(source:GeoJSON.Feature): string{
    const tram_properties = source.properties as any
    return " "
}

export function get_routing_for_popup(source: GeoJSON.Feature){
    
}