import type {TegolaCapabilities} from '../types/tegola';
import type {VectorTileLayerConfig} from '../types/layers.ts';
import type {VectorLayerDefinition} from "../types/layers.ts";
import {tegolaApi} from "../../../api/endpoints/tegola.ts";

export const createLayerConfigFromTegolaCapabilities = (capabilities: TegolaCapabilities,
                                                        layerDefinition: VectorLayerDefinition): VectorTileLayerConfig | null => {

    const {mapName, layerName, options} = layerDefinition;
    const map = capabilities.maps.find(m => m.name === mapName);

    if (!map) {
        console.error(`Map "${mapName}" not found in capabilities`);
        return null;
    }

    const layer = map.layers.find(l => l.name === layerName);

    if (!layer) {
        console.error(`Layer "${layerName}" not found in map "${mapName}"`);
        return null;
    }

    const tileUrl = layer.tiles[0];

    if (!tileUrl) {
        console.error(`No tile URL found for layer "${layerName}"`);
        return null;
    }

    const config: VectorTileLayerConfig = {
        id: options.id,
        name: options.displayName,
        type: 'vector-tile',
        url: tileUrl,
        layerName: layerName,
        visible: options.visible,
        zIndex: options.zIndex,
        minZoom: layer.minzoom,
        maxZoom: layer.maxzoom,
        layerDefinition: layerDefinition
    };

    return config;
}
export const loadLayersFromTegola = async( layerDefinitions: VectorLayerDefinition[]):Promise<VectorTileLayerConfig[]>=>{
    try {
        const capabilities = await tegolaApi.getCapabilities();

        const configs: VectorTileLayerConfig[] = [];

        for (const def of layerDefinitions) {
            const config = createLayerConfigFromTegolaCapabilities(
                capabilities,
                def
            );
            if (config) {
                configs.push(config);
            }
        }

        return configs;
    } catch (error) {
        console.error('Error loading layers from Tegola:', error);
        return [];
    }
}