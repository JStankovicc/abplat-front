import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { PERMISSION_KEYWORDS } from "../config/permissions";

/**
 * Uzima permisije iz JWT tokena (polja authorities / roles / role).
 * Koristi role: ADMIN, SALES_MANAGEMENT, SALES, PROJECT_MANAGEMENT, PROJECT,
 * INVENTORY_MANAGEMENT, ASSET_MANAGEMENT, VEHICLE_MANAGEMENT.
 */
export const useUserPermissions = () => {
  return useMemo(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        isAdmin: false,
        isSales: false,
        isWarehouse: false,
        isProjectManager: false,
        isVehicle: false,
        raw: [],
      };
    }

    try {
      const decoded = jwtDecode(token);
      const auths = decoded.authorities || decoded.roles || decoded.role || [];
      const authArr = Array.isArray(auths) ? auths : [auths];

      const check = (keywords) =>
        authArr.some((a) => {
          const s = typeof a === "string" ? a : a?.authority || a?.name || "";
          return keywords.some((k) => s.toUpperCase().includes(k.toUpperCase()));
        });

      return {
        isAdmin: check(PERMISSION_KEYWORDS.ADMIN),
        isSales: check(PERMISSION_KEYWORDS.SALES),
        isWarehouse: check(PERMISSION_KEYWORDS.WAREHOUSE),
        isProjectManager: check(PERMISSION_KEYWORDS.PROJECT_MANAGER),
        isVehicle: check(PERMISSION_KEYWORDS.VEHICLE),
        raw: authArr,
      };
    } catch {
      return {
        isAdmin: false,
        isSales: false,
        isWarehouse: false,
        isProjectManager: false,
        isVehicle: false,
        raw: [],
      };
    }
  }, []);
};
