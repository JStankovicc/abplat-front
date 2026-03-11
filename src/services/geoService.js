import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import { getAuthHeaders } from "../lib/api";

/**
 * Servis za geo podatke – države, regione, okruge, gradove.
 * Koristi LocationController: /api/v1/location/getAllCountries, getRegionsByCountry, getDistrictsByRegion, getCitiesByDistrictId.
 * Svuda se očekuje odgovor sa poljima id i name (ili mapirano iz backend DTO).
 */

const BASE = `${API_BASE_URL}/location`;

/** Normalizuje stavku iz API-ja u { id, name } (backend može da vraća druga imena polja). */
const toIdName = (item) => {
  if (!item) return null;
  const id = item.id ?? item.countryId ?? item.regionId ?? item.districtId ?? item.cityId;
  const name = item.name ?? item.countryName ?? item.regionName ?? item.districtName ?? item.cityName ?? "";
  return { id, name };
};

export const geoService = {
  /** GET /api/v1/location/getAllCountries – lista država (Country: id, name). */
  listCountries: async () => {
    const res = await axios.get(`${BASE}/getAllCountries`, { headers: getAuthHeaders() });
    const list = Array.isArray(res.data) ? res.data : [];
    return { data: list.map(toIdName).filter(Boolean), isFallback: false };
  },

  /** GET /api/v1/location/getRegionsByCountry?country={short} – regioni za državu (RegionResponse). */
  listRegions: async (countryId) => {
    if (countryId == null || countryId === "") return { data: [], isFallback: false };
    const res = await axios.get(`${BASE}/getRegionsByCountry`, {
      params: { country: Number(countryId) },
      headers: getAuthHeaders(),
    });
    const list = Array.isArray(res.data) ? res.data : [];
    return { data: list.map(toIdName).filter(Boolean), isFallback: false };
  },

  /** GET /api/v1/location/getDistrictsByRegion?regionId={int} – okruzi za region (DistrictResponse). */
  listDistricts: async (regionId) => {
    if (regionId == null || regionId === "") return { data: [], isFallback: false };
    const res = await axios.get(`${BASE}/getDistrictsByRegion`, {
      params: { regionId: Number(regionId) },
      headers: getAuthHeaders(),
    });
    const list = Array.isArray(res.data) ? res.data : [];
    return { data: list.map(toIdName).filter(Boolean), isFallback: false };
  },

  /** GET /api/v1/location/getCitiesByDistrictId?districtId={int} – gradovi za okrug (CityResponse). Za autocomplete; filtriranje po tekstu može na frontu. */
  listCitiesByDistrict: async (districtId) => {
    if (districtId == null || districtId === "") return { data: [], isFallback: false };
    const res = await axios.get(`${BASE}/getCitiesByDistrictId`, {
      params: { districtId: Number(districtId) },
      headers: getAuthHeaders(),
    });
    const list = Array.isArray(res.data) ? res.data : [];
    return { data: list.map(toIdName).filter(Boolean), isFallback: false };
  },
};

/** Za backward compatibility: listCitySuggestions poziva listCitiesByDistrict (bez parametra q – backend ne podržava pretragu po tekstu). */
geoService.listCitySuggestions = async (districtId) => geoService.listCitiesByDistrict(districtId);

export default geoService;
