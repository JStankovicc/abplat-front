export const ASSET_STATUS = {
  AVAILABLE: "AVAILABLE",
  UNDER_REPAIR: "UNDER_REPAIR",
  DECOMMISSIONED: "DECOMMISSIONED",
  LOST: "LOST",
  RENTED: "RENTED",
  DISCARDED: "DISCARDED",
  IN_USE: "IN_USE",
};

const assetStatusLabels = {
  [ASSET_STATUS.AVAILABLE]: "Dostupno",
  [ASSET_STATUS.UNDER_REPAIR]: "U popravci",
  [ASSET_STATUS.DECOMMISSIONED]: "Rashodovano",
  [ASSET_STATUS.LOST]: "Izgubljeno",
  [ASSET_STATUS.RENTED]: "Iznajmljeno",
  [ASSET_STATUS.DISCARDED]: "Otpisano",
  [ASSET_STATUS.IN_USE]: "U upotrebi",
};

export const translateAssetStatus = (status) => assetStatusLabels[status] ?? status;

export const statusColors = {
  [ASSET_STATUS.AVAILABLE]: "success",
  [ASSET_STATUS.UNDER_REPAIR]: "warning",
  [ASSET_STATUS.DECOMMISSIONED]: "default",
  [ASSET_STATUS.LOST]: "error",
  [ASSET_STATUS.RENTED]: "info",
  [ASSET_STATUS.DISCARDED]: "default",
  [ASSET_STATUS.IN_USE]: "info",
};

export const assetStatuses = Object.values(ASSET_STATUS);

export const ASSET_CATEGORIES = [
  "",
  "IT Oprema",
  "Oprema za kancelariju",
  "Kancelarijski materijal",
  "Alati",
  "Vozila",
  "Mašine i oprema",
  "Električna oprema",
  "Oprema za održavanje",
  "Sigurnosna oprema",
  "Medicinska oprema",
  "Kuhinjska oprema",
  "Sport i rekreacija",
  "Ostalo",
];

export const initialFormState = {
  identifier: "",
  name: "",
  barcode: "",
  type: "",
  model: "",
  manufacturer: "",
  category: "",
  serialNumber: "",
  currentUserId: "",
  movableAssetStatus: ASSET_STATUS.AVAILABLE,
  purchaseDate: "",
  insuranceDate: "",
  comment: "",
  unit: "",
  amount: "",
};
