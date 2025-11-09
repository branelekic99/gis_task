import {useEffect, useRef, useContext} from "react";
import Overlay from "ol/Overlay";
import MapContext from "../context/MapContext.tsx";

const PopupContainer = () => {
    const {map, popup, hidePopup} = useContext(MapContext);
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<Overlay | null>(null);

    useEffect(() => {
        if (!map || !containerRef.current) return;

        const overlay = new Overlay({
            element: containerRef.current,
            autoPan: {animation: {duration: 250}},
        });

        overlayRef.current = overlay;
        map.addOverlay(overlay);

        return () => {
            if (overlayRef.current) {
                map.removeOverlay(overlayRef.current);
                overlayRef.current = null;
            }
        };
    }, [map]);


    useEffect(() => {
        if (!overlayRef.current) return;

        if (popup) overlayRef.current.setPosition(popup.coordinate);

        else overlayRef.current.setPosition(undefined);

    }, [popup]);

    const formatKey = (key: string): string => {
        return key.split('_').join(" ");
    }

    return (
        <div
            ref={containerRef}
            className={`absolute bg-white shadow-lg rounded-md p-3 border border-gray-200 min-w-[270px] ${
                popup ? 'block' : 'hidden'
            }`}
        >
            <div className={"flex flex-row items-center justify-between "}>
                <span className={"text-gray-500 font-semibold"}>{popup?.data.title || "Details"}</span>
                <button
                    onClick={hidePopup}
                    className="text-gray-600 hover:text-black hover:cursor-pointer text-xl"
                >
                    ×
                </button>
            </div>
            <div className="mt-2">
                {popup && Object.entries(popup.data).map(([key, value]) =>
                    key !== "title" ? (
                        <div className={"first-letter:uppercase"} key={key}>
                            <span className={"font-bold"}>{formatKey(key)}</span>: <span>{String(value)}</span>
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
};

export default PopupContainer;