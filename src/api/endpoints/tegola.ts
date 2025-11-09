import {api} from "../interceptor.ts";
import type {TegolaCapabilities} from "../../features/map/types/tegola.ts";

export const tegolaApi = {
    getCapabilities: async (): Promise<TegolaCapabilities> => {
        const result = await api.get("/tegola/tegola-capabilities")
        return result.data
    }
}