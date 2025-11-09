import type { Style } from 'ol/style';
import type VectorTileLayer from 'ol/layer/VectorTile';
import type TileLayer from 'ol/layer/Tile';
import Feature from 'ol/Feature';
import type {PopupData} from "./map.ts";

export type LayerType = 'vector-tile' | 'wms';

export type VectorLayerDefinition = {
    mapName: string,
    layerName: string,
    options: {
        id: string,
        displayName: string,
        visible: boolean,
        zIndex: number,
    },
    style?: Style,
    onFeatureClick?: (feature: Feature) => Promise<PopupData | null>
}

export type WmsLayerDefinition = {
    url:string;
    zIndex:number;
    layers:string[];
    visible:boolean;
    params:Record<string, never>
    layerName:string;
}

export interface BaseLayerConfig {
    id: string;
    name: string;
    type: LayerType;
    visible: boolean;
    zIndex: number;
}

export interface VectorTileLayerConfig extends BaseLayerConfig {
    type: 'vector-tile';
    url: string;
    layerName: string;
    minZoom: number;
    maxZoom: number;
    layerDefinition:VectorLayerDefinition;
}

export interface WMSLayerConfig extends BaseLayerConfig {
    type: 'wms';
    url: string;
    layers: string[];
    params?: Record<string, never>;
}

export type LayerConfig = VectorTileLayerConfig | WMSLayerConfig;

export interface LayerState {
    id: string;
    name: string;
    visible: boolean;
    config:LayerConfig;
    layer: VectorTileLayer | TileLayer;
}
