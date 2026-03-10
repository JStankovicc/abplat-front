import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import { getAuthHeaders } from "../lib/api";

const CHANGE_ROLE_ENDPOINT = `${API_BASE_URL}/user/changeRole`;
const ADD_USER_ENDPOINT = `${API_BASE_URL}/user/add`;

/**
 * Menja ulogu korisnika.
 * PUT /user/changeRole
 */
export const changeUserRole = async (userId, role) => {
  await axios.put(
    CHANGE_ROLE_ENDPOINT,
    { userId, role },
    { headers: getAuthHeaders() }
  );
};

/**
 * Dodaje novog korisnika.
 * POST /user/add
 * Body: UserRequest { firstName, lastName, email, password, role: string[] }
 * @param {{ firstName: string, lastName: string, email: string, password: string, role?: string[] }} data
 */
export const addUser = async (data) => {
  await axios.post(
    ADD_USER_ENDPOINT,
    {
      firstName: data.firstName?.trim() ?? "",
      lastName: data.lastName?.trim() ?? "",
      email: data.email?.trim() ?? "",
      password: data.password ?? "",
      role: Array.isArray(data.role) ? data.role : [],
    },
    { headers: getAuthHeaders() }
  );
};
