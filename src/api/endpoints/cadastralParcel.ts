import {api} from "../interceptor.ts";
import type {FeatureDetailResponse} from "../../features/map/types/tegola.ts";

export const cadastralParcelApi = {
    getParcelDetails: async (id:number | string): Promise<FeatureDetailResponse> => {
        const result = await api.get(`/dkp/parcels/${id}`);
        return result.data;
    }
}