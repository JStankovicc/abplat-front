import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import { getAuthHeaders } from "../lib/api";

/**
 * FacilityController: /api/v1/facility
 * - GET /office/all → List<OfficeResponse> (id, name, code, openAt, closedAt, locationId, maxDeskCapacity)
 * - POST /office → CreateOfficeRequest (body)
 */
const BASE = `${API_BASE_URL}/facility`;

/**
 * GET /api/v1/facility/office/all – sve kancelarije za kompaniju (OfficeResponse DTO).
 * Backend vraća: { id, name, code, openAt, closedAt, locationId, maxDeskCapacity } (locationId = Long, bez objekta location).
 * @returns {Promise<Array<{ id: number, name: string, code?: string, openAt?: string, closedAt?: string, locationId?: number, maxDeskCapacity?: number }>>}
 */
export const getOfficesForCompany = async () => {
  const response = await axios.get(`${BASE}/office/all`, {
    headers: getAuthHeaders(),
  });
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * POST /api/v1/facility/office – kreira kancelariju (CreateOfficeRequest).
 * @param {{
 *   name: string,
 *   code: string,
 *   openAt?: string,
 *   closedAt?: string,
 *   maxDeskCapacity?: number,
 *   newHeadquarters?: boolean,
 *   countryId: number,
 *   regionId?: number,
 *   districtId?: number,
 *   city?: string,
 *   address?: string
 * }} body
 */
export const createOffice = async (body) => {
  const payload = {
    name: body.name?.trim() ?? "",
    code: body.code?.trim() ?? "",
    openAt: body.openAt ?? "09:00",
    closedAt: body.closedAt ?? "17:00",
    maxDeskCapacity: body.maxDeskCapacity != null && body.maxDeskCapacity !== "" ? Number(body.maxDeskCapacity) : null,
    newHeadquarters: Boolean(body.newHeadquarters),
    countryId: Number(body.countryId),
    regionId: body.regionId != null && body.regionId !== "" ? Number(body.regionId) : null,
    districtId: body.districtId != null && body.districtId !== "" ? Number(body.districtId) : null,
    city: body.city?.trim() ?? null,
    address: body.address?.trim() ?? null,
  };
  await axios.post(`${BASE}/office`, payload, {
    headers: getAuthHeaders(),
  });
};

export default { getOfficesForCompany, createOffice };
