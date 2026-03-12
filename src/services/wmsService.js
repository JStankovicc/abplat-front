import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import { getAuthHeaders } from "../lib/api";

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

export const wmsService = {
  /**
   * Lista magacina za kompaniju.
   * Prethodno je koristio mock podatke; sada poziva FacilityController:
   * GET /api/v1/facility/warehouse/all → WarehouseResponse[].
   * Vraća oblik { data: { items, total }, isFallback, error } kompatibilan sa postojećim kodom.
   */
  listWarehouses: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/facility/warehouse/all`, {
        headers: getAuthHeaders(),
      });
      const items = Array.isArray(response.data) ? response.data : [];
      return {
        data: { items, total: items.length },
        isFallback: false,
        error: null,
      };
    } catch (error) {
      return {
        data: { items: [], total: 0 },
        isFallback: true,
        error,
      };
    }
  },

  createWarehouse: async (payload) =>
    axios.post(`${API_BASE_URL}/api/v1/warehouses`, payload, { headers: getAuthHeaders() }),

  listWarehouseLocations: async (filters = {}) =>
    withFallback(
      () =>
        axios.get(
          `${API_BASE_URL}/api/v1/warehouse-locations?${buildQuery(filters)}`,
          { headers: getAuthHeaders() }
        ),
      {
        items: [
          {
            id: "loc-1",
            warehouseId: "wh-1",
            warehouseName: "Centralni magacin",
            code: "REC-01",
            name: "Receiving zona 1",
            type: "receiving",
            capacity: { maxUnits: 500 },
          },
          {
            id: "loc-2",
            warehouseId: "wh-1",
            warehouseName: "Centralni magacin",
            code: "A-01-01",
            name: "Regal A-01-01",
            type: "storage",
            capacity: { maxUnits: 1000 },
          },
        ],
        total: 2,
      }
    ),

  createWarehouseLocation: async (payload) =>
    axios.post(`${API_BASE_URL}/api/v1/warehouse-locations`, payload, { headers: getAuthHeaders() }),

  listInventoryBalances: async (filters = {}) =>
    withFallback(
      () =>
        axios.get(
          `${API_BASE_URL}/api/v1/inventory-balances?${buildQuery(filters)}`,
          { headers: getAuthHeaders() }
        ),
      {
        items: [
          {
            id: "inv-1",
            productId: "prd-1",
            productSku: "DL-XPS13-2023",
            productName: "Laptop Dell XPS 13",
            warehouseId: "wh-1",
            warehouseName: "Centralni magacin",
            locationId: "loc-2",
            locationCode: "A-01-01",
            onHandQty: 15,
            reservedQty: 3,
            availableQty: 12,
          },
        ],
        total: 1,
      }
    ),

  createInventoryAdjustment: async (payload) =>
    axios.post(`${API_BASE_URL}/api/v1/inventory-adjustments`, payload, { headers: getAuthHeaders() }),

  listReceivings: async (filters = {}) =>
    withFallback(
      () => axios.get(`${API_BASE_URL}/api/v1/receivings?${buildQuery(filters)}`, { headers: getAuthHeaders() }),
      { items: [], total: 0 }
    ),

  createReceiving: async (payload) =>
    axios.post(`${API_BASE_URL}/api/v1/receivings`, payload, { headers: getAuthHeaders() }),

  confirmReceiving: async (receivingId, payload) =>
    axios.post(`${API_BASE_URL}/api/v1/receivings/${receivingId}/confirm`, payload, {
      headers: getAuthHeaders(),
    }),

  createPutaway: async (payload) =>
    axios.post(`${API_BASE_URL}/api/v1/putaways`, payload, { headers: getAuthHeaders() }),

  listWarehouseTasks: async (filters = {}) =>
    withFallback(
      () =>
        axios.get(`${API_BASE_URL}/api/v1/warehouse-tasks?${buildQuery(filters)}`, {
          headers: getAuthHeaders(),
        }),
      {
        items: [
          {
            id: "tsk-1",
            type: "putaway",
            status: "created",
            warehouseName: "Centralni magacin",
            referenceType: "receiving",
            referenceId: "rcv-1",
          },
        ],
        total: 1,
      }
    ),

  updateWarehouseTask: async (taskId, payload) =>
    axios.patch(`${API_BASE_URL}/api/v1/warehouse-tasks/${taskId}`, payload, { headers: getAuthHeaders() }),

  listSalesOrders: async (filters = {}) =>
    withFallback(
      () => axios.get(`${API_BASE_URL}/api/v1/sales-orders?${buildQuery(filters)}`, { headers: getAuthHeaders() }),
      {
        items: [
          {
            id: "so-1",
            orderNumber: "SO-2026-001",
            customerName: "Kompanija ABC",
            status: "created",
            createdAt: new Date().toISOString(),
            lines: [{ id: "sol-1", productName: "Laptop Dell XPS 13", requestedQty: 2, reservedQty: 0 }],
          },
        ],
        total: 1,
      }
    ),

  reserveSalesOrderInventory: async (orderId) =>
    axios.post(`${API_BASE_URL}/api/v1/sales-orders/${orderId}/reserve-inventory`, {}, { headers: getAuthHeaders() }),

  confirmPicking: async (orderId, payload) =>
    axios.post(`${API_BASE_URL}/api/v1/sales-orders/${orderId}/picking/confirm`, payload, {
      headers: getAuthHeaders(),
    }),

  confirmPacking: async (orderId, payload) =>
    axios.post(`${API_BASE_URL}/api/v1/sales-orders/${orderId}/packing/confirm`, payload, {
      headers: getAuthHeaders(),
    }),

  shipSalesOrder: async (orderId, payload) =>
    axios.post(`${API_BASE_URL}/api/v1/sales-orders/${orderId}/ship`, payload, { headers: getAuthHeaders() }),

  listReturns: async (filters = {}) =>
    withFallback(
      () => axios.get(`${API_BASE_URL}/api/v1/returns?${buildQuery(filters)}`, { headers: getAuthHeaders() }),
      { items: [], total: 0 }
    ),

  createReturn: async (payload) =>
    axios.post(`${API_BASE_URL}/api/v1/returns`, payload, { headers: getAuthHeaders() }),

  getDashboard: async (warehouseId) =>
    withFallback(
      () =>
        axios.get(
          `${API_BASE_URL}/api/v1/wms/dashboard${warehouseId ? `?warehouseId=${warehouseId}` : ""}`,
          { headers: getAuthHeaders() }
        ),
      {
        inventory: { totalSkus: 124, totalUnits: 4300, lowStockSkus: 12 },
        tasks: { active: 8, byType: { receiving: 2, putaway: 2, picking: 3, packing: 1 } },
        orders: { inProcessing: 6, awaitingPick: 3, awaitingPack: 2, awaitingShip: 1 },
      }
    ),

  listAuditLogs: async (filters = {}) =>
    withFallback(
      () => axios.get(`${API_BASE_URL}/api/v1/audit-logs?${buildQuery(filters)}`, { headers: getAuthHeaders() }),
      { items: [], total: 0 }
    ),
};

export default wmsService;
