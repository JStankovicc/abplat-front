import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import { getAuthHeadersMinimal } from "../lib/api";

/** Formats date from API (ISO string or Date) to YYYY-MM-DD. */
const formatDate = (value) => {
    if (value == null) return "";
    if (typeof value === "string") return value.slice(0, 10);
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    return String(value);
};

/** UserResponse shape: { id, displayName, profilePic }. Uses displayName for display. */
const formatUserDisplay = (user) => {
    if (!user) return "";
    if (user.displayName != null && String(user.displayName).trim() !== "") return user.displayName.trim();
    return [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.name || "";
};

/**
 * Maps MovableAssetResponse to the UI shape used in list and detail views.
 * currentUser and issuedBy are UserResponse { id, displayName, profilePic }.
 */
export const mapMovableAssetFromApi = (raw) => {
    // id (Long) - used for changeStatus?assetId=...; try all common field names
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
 * Fetches all movable assets for the company (user resolved from JWT).
 * Supports both plain arrays and Spring Page responses (response.data.content).
 * @returns {Promise<Array>} List of mapped assets for the UI
 */
export const getMovableAssets = async () => {
    const response = await axios.get(`${API_BASE_URL}/asset/movableAsset/all`, {
        headers: getAuthHeadersMinimal()
    });
    const data = response.data;
    const list = Array.isArray(data)
        ? data
        : (Array.isArray(data?.content) ? data.content : []);
    // Some items may be nested (e.g. { movableAsset: { id, ... } }) - unwrap them
    const items = list.map((item) =>
        item?.movableAsset ?? item?.movableAssetResponse ?? item?.asset ?? item
    );
    return items.map(mapMovableAssetFromApi);
};

/**
 * Creates a movable asset. Body maps to PostMovableAssetRequest.
 * Dates must be "YYYY-MM-DD" strings or null.
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
        headers: getAuthHeadersMinimal()
    });
    return mapMovableAssetFromApi(response.data);
};

/**
 * Updates a movable asset. Body maps to UpdateMovableAssetRequest (id required).
 */
export const updateMovableAsset = async (payload) => {
    const id = payload.id != null ? Number(payload.id) : NaN;
    if (Number.isNaN(id) || id < 0) throw new Error("Asset ID is not valid.");
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
        headers: getAuthHeadersMinimal()
    });
    return mapMovableAssetFromApi(response.data);
};

/**
 * Changes the status and assignment of a movable asset.
 * assetId is the Long id from the GET list. Query param: ?assetId=...
 * Body maps to PostMovableAssetStatusChangeRequest { status, currentUserId }.
 */
export const changeMovableAssetStatus = async (assetId, payload) => {
    const id = assetId != null ? Number(assetId) : NaN;
    if (Number.isNaN(id) || id < 1) {
        throw new Error("Asset ID is not valid. Please refresh the list.");
    }
    const body = {
        status: payload.status ?? null,
        currentUserId: payload.currentUserId ?? null
    };
    const url = `${API_BASE_URL}/asset/movableAsset/changeStatus?assetId=${id}`;
    await axios.post(url, body, { headers: getAuthHeadersMinimal() });
};

/**
 * Deletes a movable asset. Query param: ?assetId=...
 */
export const deleteMovableAsset = async (assetId) => {
    const id = assetId != null ? Number(assetId) : NaN;
    if (Number.isNaN(id) || id < 1) {
        throw new Error("Asset ID is not valid.");
    }
    await axios.delete(`${API_BASE_URL}/asset/movableAsset?assetId=${id}`, {
        headers: getAuthHeadersMinimal()
    });
};
