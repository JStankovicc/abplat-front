import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Dohvata sve korisnike kompanije (UserResponse: id, displayName, profilePic).
 * @returns {Promise<Array<{ id: number, displayName: string, profilePic?: any }>>}
 */
export const getAllCompanyUsers = async () => {
    const response = await axios.get(`${API_BASE_URL}/company/getAllCompanyUsers`, {
        headers: getAuthHeaders()
    });
    const list = Array.isArray(response.data) ? response.data : [];
    return list.map((u) => ({
        id: u.id != null ? Number(u.id) : null,
        displayName: u.displayName ?? "",
        profilePic: u.profilePic
    }));
};
