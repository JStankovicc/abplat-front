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

/**
 * GET /api/v1/location/getLocationString?locationId= – puna adresa (adresa, grad, okrug, region, država) za lokaciju.
 * @param {number} locationId
 * @returns {Promise<string>}
 */
export const getLocationString = async (locationId) => {
  const response = await axios.get(
    `${API_BASE_URL}/location/getLocationString`,
    { params: { locationId }, headers: getAuthHeaders() }
  );
  return typeof response.data === "string" ? response.data : "";
};

/**
 * GET /api/v1/location?locationId= – vraća Location entitet (id, countryId, regionId, districtId, city, address).
 * Koristimo ga pri editovanju da popunimo dropdown-e po ID-jevima.
 * @param {number} locationId
 * @returns {Promise<{ id: number, countryId: number, regionId: number, districtId: number, city: string, address: string }>}
 */
export const getLocationById = async (locationId) => {
  const response = await axios.get(`${API_BASE_URL}/location`, {
    params: { locationId },
    headers: getAuthHeaders(),
  });
  return response.data;
};

/** Tipovi lokacija (kancelarije, radna mesta, magacini, zone, ostalo) */
export const LOCATION_TYPES = {
  office: "Kancelarija",
  workstation: "Radno mesto",
  warehouse: "Magacin",
  warehouse_zone: "Zona u magacinu",
  other: "Ostalo",
};

/** Tipovi zone u magacinu – za zone (skladištenje, prijem, komisioniranje, pakovanje) */
export const ZONE_TYPES = {
  storage: "Skladište",
  receiving: "Prijem",
  pick: "Komisioniranje",
  packing: "Pakovanje",
};

export const locationsService = {
  /**
   * Sve lokacije (kancelarije, radna mesta, magacini, zone).
   *
   * Backend /locations API još ne postoji – zato OVDE NAMERNO NE RADIMO nikakav HTTP poziv,
   * već vraćamo čisto fallback stanje. Ovo sprečava GET na /locations? koji vidiš u network tabu.
   */
  listLocations: async (filters = {}) => {
    const fallback = {
      items: [
        { id: "loc-o1", type: "office", code: "KANC-01", name: "Kancelarija 1", parentId: null },
        { id: "loc-o2", type: "office", code: "KANC-02", name: "Kancelarija 2", parentId: null },
        { id: "loc-w1", type: "workstation", code: "RM-101", name: "Radno mesto 101", parentId: "loc-o1" },
        { id: "loc-wh1", type: "warehouse", code: "WH-BG-01", name: "Centralni magacin", parentId: null },
      ],
      total: 4,
    };
    // Ako želiš, ovde možeš kasnije dodati pravi axios.get,
    // ali za sada ne šaljemo nikakav zahtev ka /locations.
    return { data: fallback, isFallback: true, error: null };
  },

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
    const body = {
      type: payload.type,
      code: payload.code,
      name: payload.name,
      parentId: payload.parentId ?? null,
      address: payload.address,
      headquarters: payload.headquarters ?? undefined,
      countryId: payload.countryId ?? undefined,
      regionId: payload.regionId ?? undefined,
      districtId: payload.districtId ?? undefined,
      city: payload.city ?? undefined,
    };
    return axios.post(`${API_BASE_URL}/locations`, body, {
      headers: getAuthHeaders(),
    });
  },
};

export default locationsService;
