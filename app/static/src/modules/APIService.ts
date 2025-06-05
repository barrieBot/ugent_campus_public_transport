
export class apiService {


    static async loadData(source: 'trams' | 'bikes'): Promise<GeoJSON.GeoJsonObject> {
        const response = await fetch(`/api/${source}`)
        if (!response.ok) throw new Error('Error')
        return response.json();
    }

    

    static async getRoute(from: [number, number], to: [number, number]): Promise<GeoJSON.GeoJsonObject>{
        ///Here I need to switch lat and lng, because Leaflet and GeoJson do it opposite for some G-D reason

        const start = [from[1], from[0]]
        const end = [to[1], to[0]]


        console.log(`Get way from ${start} to ${end}`)

        const response = await fetch('/api/route', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({start, end})
        })
        return await response.json()
    }

}

