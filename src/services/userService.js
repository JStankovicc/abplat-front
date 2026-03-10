import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import { getAuthHeaders } from "../lib/api";

const CHANGE_ROLE_ENDPOINT = `${API_BASE_URL}/user/changeRole`;

/**
 * Menja ulogu korisnika.
 * PUT /user/changeRole
 * Body: { userId: number, role: string } – role kao naziv enum vrednosti (npr. "ADMIN", "SALES").
 * @param {number} userId - ID korisnika
 * @param {string} role - naziv role (npr. "ADMIN", "SALES")
 */
export const changeUserRole = async (userId, role) => {
  await axios.put(
    CHANGE_ROLE_ENDPOINT,
    { userId, role },
    { headers: getAuthHeaders() }
  );
};
