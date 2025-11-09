import {createContext} from 'react';
import type Map from 'ol/Map';
import type {LayerState} from '../types/layers.ts';
import type {Popup, PopupData} from "../types/map.ts";
import type {Coordinate} from "ol/coordinate";

interface MapContextValue {
    map: Map | null;
    layers: LayerState[];
    toggleLayer: (layerId: string) => void;
    showPopup: (data: PopupData, coordinate: Coordinate) => void;
    hidePopup: () => void;
    popup: Popup | null;
}

const MapContext = createContext<MapContextValue>({
    map: null,
    layers: [],
    toggleLayer: () => {},
    showPopup: () => {},
    hidePopup: () => {},
    popup: null,
});
export default MapContext;
