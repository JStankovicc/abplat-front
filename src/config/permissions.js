/**
 * Role iz backend-a (JWT). Mapiranje na sidebar i dashboard:
 *
 * SVI:                  Dashboard, Inbox, Kalendar, Podešavanja
 * ADMIN:                Upravljanje korisnicima, Podešavanja kompanije, Pregled kompanije
 * SALES_MANAGEMENT:     Upravljanje prodajom, Prodaja
 * SALES:                Prodaja
 * PROJECT_MANAGEMENT:   Upravljanje projektima, Projekti
 * PROJECT:              Projekti
 * INVENTORY_MANAGEMENT: Inventar
 * ASSET_MANAGEMENT:     Imovina
 * VEHICLE_MANAGEMENT:   Vozila
 */

export const ROLES = [
  "ADMIN",
  "SALES_MANAGEMENT",
  "SALES",
  "PROJECT_MANAGEMENT",
  "PROJECT",
  "INVENTORY_MANAGEMENT",
  "ASSET_MANAGEMENT",
  "VEHICLE_MANAGEMENT",
];

export const ROLE_LABELS = {
  ADMIN: "Admin",
  SALES_MANAGEMENT: "Upravljanje prodajom",
  SALES: "Prodaja",
  PROJECT_MANAGEMENT: "Upravljanje projektima",
  PROJECT: "Projekat",
  INVENTORY_MANAGEMENT: "Upravljanje inventarom",
  ASSET_MANAGEMENT: "Upravljanje imovinom",
  VEHICLE_MANAGEMENT: "Upravljanje vozilima",
};

export const getRoleLabel = (roleKey) =>
  ROLE_LABELS[roleKey] ?? roleKey;
