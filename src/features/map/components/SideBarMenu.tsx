import {useContext} from "react";
import MapContext from "../context/MapContext.tsx";
import MapLayer from "./MapLayer.tsx";

const LayerSidebar = () => {
    const { layers } = useContext(MapContext);

    return (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg w-64 z-10 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <h2 className="font-semibold text-gray-800">Map Layers</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
                {layers.length > 0 && (
                    <div className="p-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Feature Layers
                        </h3>
                        <div className="space-y-2">
                            {layers.map((layer) => (
                                <MapLayer layerState={layer} key={layer.id} />
                            ))}
                        </div>
                    </div>
                )}
                {layers.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500">
                        No layers available
                    </div>
                )}
            </div>
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="text-xs text-gray-500">
                    {layers.filter(l => l.visible).length} of {layers.length} layers visible
                </div>
            </div>
        </div>
    );
};

export default LayerSidebar;