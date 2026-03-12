import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import { getAuthHeaders } from "../lib/api";

/**
 * FacilityController: /api/v1/facility
 * - GET /office/all, POST /office, PUT /office?officeId=, DELETE /office?officeId=
 */
const BASE = `${API_BASE_URL}/facility`;

const buildOfficePayload = (body) => ({
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
});

const buildWarehousePayload = (body) => ({
  name: body.name?.trim() ?? "",
  code: body.code?.trim() ?? "",
  openAt: body.openAt ?? "09:00",
  closedAt: body.closedAt ?? "17:00",
  managerId: body.managerId != null && body.managerId !== "" ? Number(body.managerId) : null,
  countryId: Number(body.countryId),
  regionId: body.regionId != null && body.regionId !== "" ? Number(body.regionId) : null,
  districtId: body.districtId != null && body.districtId !== "" ? Number(body.districtId) : null,
  city: body.city?.trim() ?? null,
  address: body.address?.trim() ?? null,
});

/**
 * GET /api/v1/facility/office/all – sve kancelarije za kompaniju (OfficeResponse DTO).
 * Backend vraća: { id, name, code, openAt, closedAt, locationId, location, maxDeskCapacity }
 * – location (String) je puna adresa (adresa, grad, okrug, region, država), bez drugog API poziva.
 * @returns {Promise<Array<{ id: number, name: string, code?: string, openAt?: string, closedAt?: string, locationId?: number, location?: string, maxDeskCapacity?: number }>>}
 */
export const getOfficesForCompany = async () => {
  const response = await axios.get(`${BASE}/office/all`, {
    headers: getAuthHeaders(),
  });
  return Array.isArray(response.data) ? response.data : [];
};

/**
 * GET /api/v1/facility/warehouse/all – svi magacini za kompaniju (WarehouseResponse DTO).
 * Backend vraća: { id, name, code, openAt, closedAt, locationId, location, manager }.
 */
export const getWarehousesForCompany = async () => {
  const response = await axios.get(`${BASE}/warehouse/all`, {
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
  await axios.post(`${BASE}/office`, buildOfficePayload(body), {
    headers: getAuthHeaders(),
  });
};

/**
 * POST /api/v1/facility/warehouse – kreira magacin (CreateWarehouseRequest).
 */
export const createWarehouse = async (body) => {
  await axios.post(`${BASE}/warehouse`, buildWarehousePayload(body), {
    headers: getAuthHeaders(),
  });
};

/**
 * PUT /api/v1/facility/office?officeId= – izmena kancelarije (CreateOfficeRequest body).
 */
export const updateOffice = async (officeId, body) => {
  await axios.put(`${BASE}/office`, buildOfficePayload(body), {
    params: { officeId },
    headers: getAuthHeaders(),
  });
};

/**
 * PUT /api/v1/facility/warehouse?warehouseId= – izmena magacina (CreateWarehouseRequest body).
 */
export const updateWarehouse = async (warehouseId, body) => {
  await axios.put(`${BASE}/warehouse`, buildWarehousePayload(body), {
    params: { warehouseId },
    headers: getAuthHeaders(),
  });
};

/**
 * DELETE /api/v1/facility/office?officeId= – brisanje kancelarije.
 */
export const deleteOffice = async (officeId) => {
  await axios.delete(`${BASE}/office`, {
    params: { officeId },
    headers: getAuthHeaders(),
  });
};

/**
 * DELETE /api/v1/facility/warehouse?warehouseId= – brisanje magacina.
 */
export const deleteWarehouse = async (warehouseId) => {
  await axios.delete(`${BASE}/warehouse`, {
    params: { warehouseId },
    headers: getAuthHeaders(),
  });
};

export default {
  getOfficesForCompany,
  getWarehousesForCompany,
  createOffice,
  updateOffice,
  deleteOffice,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
