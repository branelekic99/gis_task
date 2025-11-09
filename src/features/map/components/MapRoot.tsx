import {useCallback, useEffect, useRef, useState} from 'react';
import {transformExtent} from "ol/proj";
import {fromLonLat} from 'ol/proj.js';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import type {Coordinate} from "ol/coordinate";
import MapContext from '../context/MapContext';
import {loadLayersFromTegola} from "../services/tegolaService.ts";
import {createLayer} from "../utils/layerFactory.ts";
import PopupContainer from "./PopupContainer.tsx";
import {generateWmsConfig} from "../utils/helperFunctions.ts";
import type {Popup, PopupData} from "../types/map.ts";
import type {LayerState} from "../types/layers.ts";

import {INITIAL_LOCATION, MAP_BOUNDS} from "../constants.ts";
import {VECTOR_LAYER_DEFINITIONS, WMS_LAYER_DEFINITIONS} from "../config/layers.ts";
import {INITIAL_ZOOM} from "../constants.ts";

import "ol/ol.css"

interface MapProps {
    children?: React.ReactNode;
}

const extent = transformExtent(MAP_BOUNDS, 'EPSG:4326', 'EPSG:3857');

const MapRoot = ({children}:MapProps) => {
    const mapElement = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<Map | null>(null);
    const [layers, setLayers] = useState<LayerState[]>([]);
    const [isLoadingLayers, setIsLoadingLayers] = useState(false);
    const [popup, setPopup] = useState<Popup | null>(null);

    const initializeMap = (): Map | null => {
        if (!mapElement.current) return null;
        const mapInstance = new Map({
            target: mapElement.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                })
            ],
            view: new View({
                center: fromLonLat(INITIAL_LOCATION),
                zoom: INITIAL_ZOOM,
                extent: extent,
                constrainOnlyCenter: false
            }),
        });
        setMap(mapInstance);
        return mapInstance;
    }

    const loadLayers = async (mapObj: Map) => {
        setIsLoadingLayers(true)
        const tegolaLayerConfig = await loadLayersFromTegola(VECTOR_LAYER_DEFINITIONS);
        const vectorLayers = tegolaLayerConfig.map(config => createLayer(config))
        vectorLayers.forEach(layer => mapObj.addLayer(layer));

        const vectorLayerStates: LayerState[] = tegolaLayerConfig.map((config, index) => ({
            id: config.id,
            name: config.name,
            type: config.type,
            visible: config.visible,
            layer: vectorLayers[index],
            config: config,
        }))

        const wmsLayersConfigs = WMS_LAYER_DEFINITIONS.map(definition => generateWmsConfig(definition))
        const wmsLayers = wmsLayersConfigs.map(config => createLayer(config))

        wmsLayers.forEach(wmsLayer => mapObj.addLayer(wmsLayer));

        const wmsLayersState:LayerState[] = wmsLayersConfigs.map((config,index)=>({
            id: config.id,
            name: config.name,
            type: config.type,
            visible: config.visible,
            layer: wmsLayers[index],
            config: config,
        }))
        setIsLoadingLayers(false)
        const layerStates = [...vectorLayerStates,...wmsLayersState]
        setLayers(layerStates)
    }
    useEffect(() => {
        if (map) return;
        const mapInstance = initializeMap();
        if (mapInstance) loadLayers(mapInstance);
        return () => {
            if (mapInstance) mapInstance.setTarget(undefined);
        };
    }, []);

    const toggleLayer = useCallback((layerId: string) => {
        setLayers(prevLayers => {
            return prevLayers.map(layerState => {
                if (layerState.id === layerId) {
                    const newVisible = !layerState.visible;
                    layerState.layer.setVisible(newVisible);
                    return {...layerState, visible: newVisible};
                }
                return layerState;
            });
        });
    }, []);

    const showPopup = (data: PopupData, coordinate: Coordinate) => {
        setPopup({
            data,
            coordinate,
        });
    };

    const hidePopup = () => {
        setPopup(null);
    };

    return (
        <MapContext.Provider value={{map, layers, toggleLayer, popup, showPopup, hidePopup}}>
            <div ref={mapElement} className={"absolute top-0 bottom-0 w-full"}/>
            <PopupContainer/>
            {isLoadingLayers && (
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-3 rounded-lg shadow-lg z-50">
                    <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-gray-700">Loading map layers...</span>
                    </div>
                </div>
            )}
            {map && children}
        </MapContext.Provider>
    );
};

export default MapRoot;