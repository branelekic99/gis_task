import type {WMSLayerConfig, WmsLayerDefinition} from "../types/layers.ts";

export const generateWmsConfig = (definition:WmsLayerDefinition):WMSLayerConfig=>{
    return {
        id:`wms-${definition.layers.join("-")}`,
        visible:true,
        name:`${definition.layerName}`,
        type: 'wms',
        url: definition.url,
        layers: definition.layers,
        zIndex: definition.zIndex,
        params:definition?.params ?? {}
    }
}