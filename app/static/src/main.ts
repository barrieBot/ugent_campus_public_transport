import { UIManager } from './modules/UIManager.js';
import { map, SetupMap } from './modules/MapManager.js';
import { LayerManager } from './modules/LayerManager.js';
import { apiService} from './modules/APIService.js';
import { state } from './modules/State.js';


declare const L: typeof import('leaflet')


SetupMap()

const ui_Manager = new UIManager()
const layer_Manager = new LayerManager(map)



const routes_layer = L.geoJSON(null).addTo(map)
const test_layer = L.geoJSON(null).addTo(map)


