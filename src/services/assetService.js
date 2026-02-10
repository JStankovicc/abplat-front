import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Formatira datum iz API-ja (ISO string ili Date) u YYYY-MM-DD za prikaz.
 */
const formatDate = (value) => {
    if (value == null) return "";
    if (typeof value === "string") return value.slice(0, 10);
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    return String(value);
};

/** UserResponse: { id, displayName, profilePic }. Koristi displayName za prikaz. */
const formatUserDisplay = (user) => {
    if (!user) return "";
    if (user.displayName != null && String(user.displayName).trim() !== "") return user.displayName.trim();
    return [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.name || "";
};

/**
 * Mapira MovableAssetResponse na oblik koji koristi UI (lista + detalji).
 * currentUser i issuedBy su UserResponse { id, displayName, profilePic }.
 */
export const mapMovableAssetFromApi = (raw) => {
    // id (Long) – koristi se za changeStatus?assetId=...; uzmi iz bilo kog uobičajenog mesta
    const rawId = raw.id ?? raw.movableAssetId ?? raw.movableAsset?.id ?? raw.movableAssetResponse?.id;
    const id = rawId !== undefined && rawId !== null ? Number(rawId) : null;
    return {
        id,
        identifier: raw.identifier ?? "",
        name: raw.name ?? "",
        barcode: raw.barcode ?? "",
        type: raw.type ?? "",
        model: raw.model ?? "",
        manufacturer: raw.manufacturer ?? "",
        category: raw.category ?? "",
        serialNumber: raw.serialNumber ?? "",
        location: raw.location?.name ?? raw.location?.address ?? "",
        assignedTo: formatUserDisplay(raw.currentUser),
        currentUserId: raw.currentUser?.id ?? null,
        issuedBy: formatUserDisplay(raw.issuedBy),
        status: raw.movableAssetStatus ?? "",
        purchaseDate: formatDate(raw.purchaseDate),
        warranty: formatDate(raw.insuranceDate),
        comment: raw.comment ?? "",
        notes: raw.comment ?? "",
        unit: raw.unit ?? "",
        amount: raw.amount ?? 0,
        createdAt: formatDate(raw.createdAt),
        updatedAt: formatDate(raw.updatedAt),
        movement: [],
        maintenance: [],
        documents: []
    };
};

/**
 * Dohvata sve pokretne imovine kompanije (korisnik iz JWT).
 * Podržava i običan niz i Spring Page (response.data.content).
 * @returns {Promise<Array>} Lista mapiranih stavki za UI
 */
export const getMovableAssets = async () => {
    const response = await axios.get(`${API_BASE_URL}/asset/movableAsset/all`, {
        headers: getAuthHeaders()
    });
    const data = response.data;
    const list = Array.isArray(data)
        ? data
        : (Array.isArray(data?.content) ? data.content : []);
    // Ako je svaki element u listi ugnježden (npr. { movableAsset: { id, ... } }), izvuci ga
    const items = list.map((item) =>
        item?.movableAsset ?? item?.movableAssetResponse ?? item?.asset ?? item
    );
    return items.map(mapMovableAssetFromApi);
};

/**
 * Body za kreiranje pokretne imovine (PostMovableAssetRequest).
 * Datumi kao "YYYY-MM-DD" ili null.
 */
export const createMovableAsset = async (payload) => {
    const amount = payload.amount !== undefined && payload.amount !== "" ? Number(payload.amount) : 0;
    const body = {
        identifier: payload.identifier || null,
        name: payload.name ?? null,
        barcode: payload.barcode || null,
        type: payload.type || null,
        model: payload.model || null,
        manufacturer: payload.manufacturer || null,
        category: payload.category || null,
        serialNumber: payload.serialNumber || null,
        currentUserId: payload.currentUserId ?? null,
        movableAssetStatus: payload.movableAssetStatus || null,
        purchaseDate: payload.purchaseDate || null,
        insuranceDate: payload.insuranceDate || null,
        comment: payload.comment || null,
        unit: payload.unit || null,
        amount: Number.isNaN(amount) ? 0 : amount
    };
    const response = await axios.post(`${API_BASE_URL}/asset/movableAsset`, body, {
        headers: getAuthHeaders()
    });
    return mapMovableAssetFromApi(response.data);
};

/**
 * Ažurira pokretnu imovinu. Body: UpdateMovableAssetRequest (id obavezan + ostala polja).
 */
export const updateMovableAsset = async (payload) => {
    const id = payload.id != null ? Number(payload.id) : NaN;
    if (Number.isNaN(id) || id < 0) throw new Error("ID imovine nije validan.");
    const amount = payload.amount !== undefined && payload.amount !== "" ? Number(payload.amount) : 0;
    const currentUserId = payload.currentUserId === "" || payload.currentUserId == null ? null : Number(payload.currentUserId);
    const body = {
        id,
        identifier: payload.identifier || null,
        name: payload.name ?? null,
        barcode: payload.barcode || null,
        type: payload.type || null,
        model: payload.model || null,
        manufacturer: payload.manufacturer || null,
        category: payload.category || null,
        serialNumber: payload.serialNumber || null,
        currentUserId: currentUserId ?? null,
        movableAssetStatus: payload.movableAssetStatus || null,
        purchaseDate: payload.purchaseDate || null,
        insuranceDate: payload.insuranceDate || null,
        comment: payload.comment || null,
        unit: payload.unit || null,
        amount: Number.isNaN(amount) ? 0 : amount
    };
    const response = await axios.put(`${API_BASE_URL}/asset/movableAsset`, body, {
        headers: getAuthHeaders()
    });
    return mapMovableAssetFromApi(response.data);
};

/**
 * Menja status i dodeljenost pokretne imovine.
 * assetId = broj (Long id iz GET liste, polje id na svakom assetu). Query: ?assetId=...
 * Body: PostMovableAssetStatusChangeRequest { status, currentUserId }.
 */
export const changeMovableAssetStatus = async (assetId, payload) => {
    const id = assetId != null ? Number(assetId) : NaN;
    if (Number.isNaN(id) || id < 1) {
        throw new Error("ID imovine nije validan. Osvežite listu.");
    }
    const body = {
        status: payload.status ?? null,
        currentUserId: payload.currentUserId ?? null
    };
    const url = `${API_BASE_URL}/asset/movableAsset/changeStatus?assetId=${id}`;
    await axios.post(url, body, { headers: getAuthHeaders() });
};

/**
 * Briše pokretnu imovinu. Query: ?assetId=...
 */
export const deleteMovableAsset = async (assetId) => {
    const id = assetId != null ? Number(assetId) : NaN;
    if (Number.isNaN(id) || id < 1) {
        throw new Error("ID imovine nije validan.");
    }
    await axios.delete(`${API_BASE_URL}/asset/movableAsset?assetId=${id}`, {
        headers: getAuthHeaders()
    });
};
