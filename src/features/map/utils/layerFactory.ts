import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import {Style, Fill, Stroke} from 'ol/style';
import type {LayerConfig, VectorTileLayerConfig, WMSLayerConfig} from '../types/layers.ts';


const defaultVectorTileStyle = new Style({
    fill: new Fill({
        color: 'rgba(100, 150, 255, 0.3)',
    }),
    stroke: new Stroke({
        color: '#2563eb',
        width: 2,
    }),
});

const createVectorTileLayer = (config: VectorTileLayerConfig): VectorTileLayer => {
    const source = new VectorTileSource({
        format: new MVT(),
        url: config.url,
    });

    const layer = new VectorTileLayer({
        source,
        style: config.layerDefinition.style || defaultVectorTileStyle,
        minZoom: config.minZoom,
        maxZoom: config.maxZoom,
        visible: config.visible,
        zIndex: config.zIndex,
    });

    layer.set('layerId', config.id);
    layer.set('layerName', config.name);
    layer.set('layerType', config.type);

    return layer;
}
const createWMSLayer = (config: WMSLayerConfig): TileLayer => {
    const source = new TileWMS({
        url: config.url,
        params: {'LAYERS': config.layers, 'TILED': true},
        serverType: 'geoserver',
    });

    const layer = new TileLayer({
        source,
        zIndex: config.zIndex,
    });

    layer.set('layerId', config.id);
    layer.set('layerName', config.name);
    layer.set('layerType', config.type);

    return layer;
}
export const createLayer = (config: LayerConfig): VectorTileLayer | TileLayer => {
    switch (config.type) {
        case 'vector-tile':
            return createVectorTileLayer(config);
        case 'wms':
            return createWMSLayer(config);
        default:
            throw new Error(`Unsupported layer type`);
    }
}