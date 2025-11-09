import MapRoot from "./components/MapRoot.tsx";
import SideBarMenu from "./components/SideBarMenu.tsx";

const Map = () => {
    return (
        <div className="w-full h-full">
            <MapRoot>
                <SideBarMenu />
            </MapRoot>
        </div>
    );
};

export default Map;