import type {VectorLayerDefinition} from '../types/layers.ts';
import {Style, Fill, Stroke} from 'ol/style';
import {cadastralParcelApi} from "../../../api/endpoints/cadastralParcel.ts";
import type {PopupData} from "../types/map.ts";
import type {WmsLayerDefinition} from "../types/layers.ts";


export const cadastralParcelStyle = new Style({
    fill: new Fill({
        color: 'rgba(255, 165, 0, 0.2)',
    }),
    stroke: new Stroke({
        color: '#ff6b00',
        width: 1.5,
    }),
});

export const VECTOR_LAYER_DEFINITIONS: VectorLayerDefinition[] = [
    {
        mapName: 'cadastral_parcels',
        layerName: 'cadastral_parcels',
        options: {
            id: 'cadastral-parcels',
            displayName: 'Cadastral Parcels',
            visible: true,
            zIndex: 2,
        },
        style: cadastralParcelStyle,
        onFeatureClick: async (feature) => {
            const id = feature.getId() || null;
            if(!id) return null;
            const data = await cadastralParcelApi.getParcelDetails(id);
            return {
                title:"Cadastral Parcel Details",
                ...data.properties
            } as PopupData;
        }
    },
];

export const WMS_LAYER_DEFINITIONS: WmsLayerDefinition[] = [
    {
        url:"https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2018_WM/MapServer/WMSServer",
        layers:["13"],
        layerName:"Corine Land Cover",
        visible:true,
        zIndex:1,
        params:{}
    }
]
