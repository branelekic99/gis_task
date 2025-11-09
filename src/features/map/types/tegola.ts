import type {Extent} from 'ol/extent';
import type {Coordinate} from "ol/coordinate";

export interface TegolaLayer {
    name: string;
    tiles: string[];
    minzoom: number;
    maxzoom: number;
}

export interface TegolaMap {
    name: string;
    attribution: string;
    bounds: Extent;
    center: Coordinate;
    tiles: string[];
    capabilities: string;
    layers: TegolaLayer[];
}

export interface TegolaCapabilities {
    version: string;
    maps: TegolaMap[];
}
export type FeatureDetailResponse = {
    properties:{
        [key: string]: never
    }
}