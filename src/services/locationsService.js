import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import { getAuthHeaders } from "../lib/api";
import { wmsService } from "./wmsService";

const buildQuery = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  });
  return search.toString();
};

const withFallback = async (request, fallbackValue) => {
  try {
    const response = await request();
    return { data: response.data, isFallback: false, error: null };
  } catch (error) {
    return { data: fallbackValue, isFallback: true, error };
  }
};

/** Tipovi lokacija za sidebar (kancelarije, radna mesta, zone u magacinu itd.) */
export const LOCATION_TYPES = {
  office: "Kancelarija",
  workstation: "Radno mesto",
  warehouse: "Magacin",
  warehouse_zone: "Zona u magacinu",
  other: "Ostalo",
};

export const locationsService = {
  /** Sve lokacije (kancelarije, radna mesta, magacini, zone) */
  listLocations: async (filters = {}) =>
    withFallback(
      () =>
        axios.get(`${API_BASE_URL}/api/v1/locations?${buildQuery(filters)}`, {
          headers: getAuthHeaders(),
        }),
      {
        items: [
          { id: "loc-o1", type: "office", code: "KANC-01", name: "Kancelarija 1", parentId: null },
          { id: "loc-o2", type: "office", code: "KANC-02", name: "Kancelarija 2", parentId: null },
          { id: "loc-w1", type: "workstation", code: "RM-101", name: "Radno mesto 101", parentId: "loc-o1" },
          { id: "loc-wh1", type: "warehouse", code: "WH-BG-01", name: "Centralni magacin", parentId: null },
        ],
        total: 4,
      }
    ),

  createLocation: async (payload) => {
    if (payload.type === "warehouse") {
      return wmsService.createWarehouse({
        code: payload.code,
        name: payload.name,
        address: payload.address,
        managerUserId: payload.managerUserId,
      });
    }
    if (payload.type === "warehouse_zone") {
      return wmsService.createWarehouseLocation({
        warehouseId: payload.warehouseId,
        code: payload.code,
        name: payload.name,
        type: payload.zoneType || "storage",
        capacity: payload.maxUnits ? { maxUnits: Number(payload.maxUnits) } : undefined,
      });
    }
    return axios.post(`${API_BASE_URL}/api/v1/locations`, payload, {
      headers: getAuthHeaders(),
    });
  },
};

export default locationsService;
