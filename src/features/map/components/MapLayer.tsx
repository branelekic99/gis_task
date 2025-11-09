import {useContext, useEffect, useState} from "react";
import MapContext from '../context/MapContext';
import {useFeatureClick} from "../hooks/useFeatureClick.ts";
import type {ClickedFeature} from "../types/map.ts";
import type {LayerState} from "../types/layers.ts";
import Feature from "ol/Feature";

type LayerControlProps = {
    layerState: LayerState
}
const MapLayer = ({layerState}: LayerControlProps) => {
    const {toggleLayer, showPopup, hidePopup} = useContext(MapContext);

    const {clickedFeature} = useFeatureClick(layerState.id);
    const [isLoadingFeature, setIsLoadingFeature] = useState(false);


    const handleFeatureDetails = async (clickedFeature: ClickedFeature | null) => {
        if (layerState.config.type !== 'vector-tile' || !layerState.config?.layerDefinition?.onFeatureClick) return;
        if (!clickedFeature) {
            hidePopup();
            return
        }
        setIsLoadingFeature(true);
        try {
            const data = await layerState.config?.layerDefinition?.onFeatureClick(clickedFeature.feature as Feature);
            if (data) showPopup(data, clickedFeature.coordinate);
        } catch (error) {
            console.error('Error fetching feature details:', error);
        } finally {
            setIsLoadingFeature(false);
        }
    }

    useEffect(() => {
        handleFeatureDetails(clickedFeature)
    }, [clickedFeature]);

    return (
        <div
            key={layerState.id}
            className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors"
        >
            <label className="flex items-start gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={layerState.visible}
                    onChange={() => toggleLayer(layerState.id)}
                    className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <span>{layerState.name}</span>
                        {isLoadingFeature && (
                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-blue-600 border-t-transparent"></div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                                                    <span
                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                        {layerState.config.type}
                                                    </span>
                    </div>
                </div>
            </label>
        </div>
    );
};

export default MapLayer;