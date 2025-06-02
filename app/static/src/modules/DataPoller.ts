import { apiService } from "./APIService.js";
import { LayerManager } from "./LayerManager.js";

export class DataPolling {

    private Interval_cache: any = null

    constructor(private layerManager: LayerManager){}


    startPolling(intervalMs: number = 200000){
        this.liveUpdates()
        this.Interval_cache = setInterval(()=> this.liveUpdates(), intervalMs)
    }

    stopPolling(){
        clearInterval(this.Interval_cache)
    }


    private async liveUpdates(){
        try {

            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
            //https://eddieabbondanz.io/post/typescript/await-promise-all/

            const [bikes, trams] = await Promise.all([
                apiService.loadData('bikes'),
                apiService.loadData('trams')
            ])

            this.layerManager.updateLayer('bikes', bikes)
            this.layerManager.updateLayer('trams', trams)

        } catch (err){
            console.error('Errors while fetching data: ', err)
        }
    }
}