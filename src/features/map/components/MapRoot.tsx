import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {transformExtent} from "ol/proj";
import { fromLonLat } from 'ol/proj.js';
import MapContext from '../context/MapContext';
import {INITIAL_LOCATION, MAP_BOUNDS} from "../constants.ts";
import "ol/ol.css"

interface MapProps {
    children?: React.ReactNode;
}

const extent = transformExtent(MAP_BOUNDS, 'EPSG:4326', 'EPSG:3857');

const MapRoot: React.FC<MapProps> = ({ children }) => {
    const mapElement = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<Map | null>(null);

    useEffect(() => {
        if (!mapElement.current || map) return;
        const mapInstance = new Map({
            target: mapElement.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: fromLonLat(INITIAL_LOCATION),
                zoom: 13,
                extent: extent,
                constrainOnlyCenter: false
            }),
        });
        setMap(mapInstance);

        return () => {
            mapInstance.setTarget(undefined);
        };
    }, []);

    return (
        <MapContext.Provider value={{ map }}>
            <div ref={mapElement} className={"absolute top-0 bottom-0 w-full"} />
            {map && children}
        </MapContext.Provider>
    );
};

export default MapRoot;