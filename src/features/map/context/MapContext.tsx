import { createContext, useContext } from 'react';
import type Map from 'ol/Map';

interface MapContextValue {
    map: Map | null;
}

const MapContext = createContext<MapContextValue>({ map: null });

export const useMapContext = () => useContext(MapContext);

export default MapContext;