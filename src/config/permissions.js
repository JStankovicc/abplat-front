/**
 * Role iz backend-a (JWT authorities).
 * Backend šalje npr. ["ROLE_ADMIN", "ROLE_SALES"] – provera radi preko .includes().
 */

/** Sve moguće role (za referencu / debug) */
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

/**
 * Mapiranje role → frontend flag (useUserPermissions).
 * Svaki flag je true ako korisnik ima bilo koju od navedenih role.
 */
export const PERMISSION_KEYWORDS = {
  /** Admin – podešavanja kompanije, upravljanje korisnicima */
  ADMIN: ["ADMIN"],

  /** Prodaja – dashboard sekcija Prodaja, sales flow */
  SALES: ["SALES_MANAGEMENT", "SALES"],

  /** Projekti – dashboard kartice projekata, project-management */
  PROJECT_MANAGER: ["PROJECT_MANAGEMENT", "PROJECT"],

  /** Inventar + Imovina – dashboard sekcije zahteva/povrata/odobrenja */
  WAREHOUSE: ["INVENTORY_MANAGEMENT", "ASSET_MANAGEMENT"],

  /** Vozila – fleet (sidebar / buduće sekcije) */
  VEHICLE: ["VEHICLE_MANAGEMENT"],
};

export const ALL_PERMISSION_KEYWORDS = Object.values(PERMISSION_KEYWORDS).flat();
