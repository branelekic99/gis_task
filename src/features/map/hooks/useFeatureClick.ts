import {useContext, useEffect, useRef, useState} from 'react';
import {Style, Fill, Stroke} from 'ol/style';
import VectorTileLayer from 'ol/layer/VectorTile';
import MapContext from '../context/MapContext';
import type {FeatureLike} from "ol/Feature";
import type MapBrowserEvent from 'ol/MapBrowserEvent';
import type {ClickedFeature} from "../types/map.ts";


const highlightStyle = new Style({
    fill: new Fill({
        color: 'rgba(255, 255, 0, 0.4)',
    }),
    stroke: new Stroke({
        color: '#ffff00',
        width: 3,
    }),
});

export function useFeatureClick(targetLayerId: string) {
    const {map, layers, popup} = useContext(MapContext);
    const [clickedFeature, setClickedFeature] = useState<ClickedFeature | null>(null);

    const selectionRef = useRef<{ [key: string]: FeatureLike }>({});
    const selectionLayerRef = useRef<VectorTileLayer | null>(null);

    const createSelectionLayer = (targetLayer: VectorTileLayer) => {
        if (!map || !targetLayer) return

        const selectionLayer = new VectorTileLayer({
            map: map,
            renderMode: 'vector',
            // @ts-ignore
            source: targetLayer.getSource(),
            style: function (feature) {
                // @ts-ignore
                if (feature.getId() in selectionRef.current) {
                    return highlightStyle;
                }
            },
        });
        selectionLayerRef.current = selectionLayer;
    }

    useEffect(() => {
        if (!map) return;

        const targetLayer = layers.find(l => l.id === targetLayerId)?.layer;

        if (targetLayer instanceof VectorTileLayer) createSelectionLayer(targetLayer);

        const handleClick = async (event:MapBrowserEvent) => {
            const coordinate = event.coordinate;

            if (targetLayer instanceof VectorTileLayer && targetLayer.isVisible()) {
                const features = await targetLayer.getFeatures(event.pixel);

                if (!features.length) {
                    selectionRef.current = {};
                    setClickedFeature(null);
                    if (selectionLayerRef.current) {
                        selectionLayerRef.current.changed();
                    }
                    return;
                }
                const feature = features[0];
                const fid = feature.getId();
                const layerId = targetLayer.get('layerId');

                selectionRef.current = {};

                if (fid) {
                    selectionRef.current[fid] = feature;
                }

                setClickedFeature({
                    feature,
                    coordinate,
                    layerId,
                });

                if (selectionLayerRef.current) {
                    selectionLayerRef.current.changed();
                }
            }
        };

        map.on('click', handleClick);

        return () => {
            map.un('click', handleClick);
            clearSelection()
            if (selectionLayerRef.current) {
                map.removeLayer(selectionLayerRef.current);
                selectionLayerRef.current = null;
            }
        };
    }, [map, layers, targetLayerId]);

    useEffect(() => {
        if (popup === null) clearSelection();
    }, [popup]);

    const clearSelection = () => {
        setClickedFeature(null);

        selectionRef.current = {};
        if (selectionLayerRef.current) {
            selectionLayerRef.current.changed();
        }
    };

    return {
        clickedFeature,
        clearSelection,
    };
}