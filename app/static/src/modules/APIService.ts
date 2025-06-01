
export class apiService {


    static async loadData(source: 'trams' | 'bikes'): Promise<GeoJSON.GeoJsonObject> {
        const response = await fetch(`/api/${source}`)
        if (!response.ok) throw new Error('Error')
        return response.json();
    }

    

    static async getRoute(from: [number, number], to: [number, number]): Promise<GeoJSON.GeoJsonObject>{
        ///Here I need 
        
        const response = await fetch('/api/route', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({from, to})
        })
        return await response.json()
    }

}

