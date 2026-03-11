import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import { getAuthHeaders } from "../lib/api";
import { ROLES } from "../config/permissions";

/**
 * Normalizuje role iz backend odgovora (string ili { name/authority }) u string.
 */
const normalizeRoleName = (role) => {
  if (role == null) return null;
  if (typeof role === "string") return role.trim().toUpperCase();
  const name = role.name ?? role.authority ?? role.role;
  return name != null ? String(name).trim().toUpperCase() : null;
};

/**
 * Mapira UserResponseWithPermissions na format za UI (id, name, email, profilePic, roles).
 * Backend: { id, displayName, profilePic, roles: Set<Role> }
 */
export const mapUserWithPermissionsToRow = (u) => {
  const roleSet = u.roles ?? [];
  const roleArr = Array.isArray(roleSet) ? roleSet : [...roleSet];
  const roleNames = roleArr.map(normalizeRoleName).filter(Boolean);

  const roles = ROLES.reduce((acc, r) => {
    acc[r] = roleNames.includes(r);
    return acc;
  }, {});

  return {
    id: u.id != null ? Number(u.id) : u.id,
    name: u.displayName ?? "",
    email: u.email ?? "",
    profilePic: u.profilePic,
    roles,
  };
};

/**
 * Svi zaposleni kompanije sa rolama (za Upravljanje korisnicima).
 * GET /company/getAllCompanyUsersWithPermissions
 * @returns {Promise<Array<{ id: number, name: string, email: string, profilePic?, roles: Record<string, boolean> }>>}
 */
export const getAllCompanyUsersWithPermissions = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/company/getAllCompanyUsersWithPermissions`,
    { headers: getAuthHeaders() }
  );
  const list = Array.isArray(response.data) ? response.data : [];
  return list.map(mapUserWithPermissionsToRow);
};

/** @deprecated Koristi getAllCompanyUsersWithPermissions. */
export const getAllCompanyUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/company/getAllCompanyUsers`, {
    headers: getAuthHeaders(),
  });
  const list = Array.isArray(response.data) ? response.data : [];
  return list.map((u) => ({
    id: u.id != null ? Number(u.id) : null,
    displayName: u.displayName ?? "",
    profilePic: u.profilePic,
  }));
};

/**
 * Odgovor backend-a CompanySettingsInfoResponse – podaci o kompaniji za postavke i header/sidebar.
 * Trenutno backend vraća ovaj DTO preko GET /company/getCompanyInfo.
 * Polja: companyName, registrationNumber, address, logoPic (byte[]), country, region, district, city,
 * supportTypes (string[]), packagesNumber (number).
 */
export const getCompanySettingsInfo = async () => {
  const response = await axios.get(`${API_BASE_URL}/company/getCompanyInfo`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
