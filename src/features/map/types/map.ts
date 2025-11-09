import type {Coordinate} from "ol/coordinate";
import type {FeatureLike} from "ol/Feature";

export interface PopupData {
    [key: string]: any;
}
export type Popup = {
    data:PopupData;
    coordinate:Coordinate
}
export interface ClickedFeature {
    feature: FeatureLike;
    coordinate: Coordinate;
    layerId: string;
}

