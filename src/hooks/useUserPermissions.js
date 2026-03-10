import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";

/** Normalizuje vrednost role iz JWT (string ili objekat) u velika slova, bez prefiksa ROLE_ */
const normalizeRole = (a) => {
  const s = typeof a === "string" ? a : a?.authority ?? a?.name ?? a?.role ?? "";
  const trimmed = String(s).trim().toUpperCase();
  return trimmed.startsWith("ROLE_") ? trimmed.slice(5) : trimmed;
};

/**
 * Mapiranje (sidebar/dashboard):
 * SVI: Dashboard, Inbox, Kalendar, Podešavanja
 * ADMIN: Upravljanje korisnicima, Podešavanja kompanije, Pregled kompanije
 * SALES_MANAGEMENT: Upravljanje prodajom, Prodaja
 * SALES: Prodaja
 * PROJECT_MANAGEMENT: Upravljanje projektima, Projekti
 * PROJECT: Projekti
 * INVENTORY_MANAGEMENT: Inventar
 * ASSET_MANAGEMENT: Imovina
 * VEHICLE_MANAGEMENT: Vozila
 */
export const useUserPermissions = () => {
  return useMemo(() => {
    const token = localStorage.getItem("token");
    const empty = {
      isAdmin: false,
      hasSalesManagement: false,
      hasSales: false,
      hasProjectManagement: false,
      hasProject: false,
      hasInventory: false,
      hasAssets: false,
      hasVehicle: false,
      raw: [],
    };
    if (!token) return empty;

    try {
      const decoded = jwtDecode(token);
      const auths = decoded.authorities ?? decoded.roles ?? decoded.role ?? [];
      const authArr = Array.isArray(auths) ? auths : [auths];
      const userRoles = new Set(authArr.map(normalizeRole).filter(Boolean));

      const has = (role) => userRoles.has(role);

      return {
        isAdmin: has("ADMIN"),
        hasSalesManagement: has("SALES_MANAGEMENT"),
        hasSales: has("SALES_MANAGEMENT") || has("SALES"),
        hasProjectManagement: has("PROJECT_MANAGEMENT"),
        hasProject: has("PROJECT_MANAGEMENT") || has("PROJECT"),
        hasInventory: has("INVENTORY_MANAGEMENT"),
        hasAssets: has("ASSET_MANAGEMENT"),
        hasVehicle: has("VEHICLE_MANAGEMENT"),
        raw: authArr,
      };
    } catch {
      return empty;
    }
  }, []);
};
