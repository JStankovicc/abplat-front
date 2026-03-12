/**
 * Lokacije – glavna sekcija za upravljanje svim tipovima lokacija (kancelarije, radna mesta, magacini, zone, ostalo).
 * Dizajn je usklađen sa zelenim akcentom, čitljivim čipovima i tabelom; lako se skalira na veće firme.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Skeleton,
  Snackbar,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  EditOutlined as EditIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import locationsService, { getLocationById, LOCATION_TYPES, ZONE_TYPES } from "../../services/locationsService";
import wmsService from "../../services/wmsService";
import geoService from "../../services/geoService";
import facilityService from "../../services/facilityService";
import { getCompanyUsersWithRole } from "../../services/companyService";

/** Redosled tabova po tipu lokacije; mora da odgovara LOCATION_TYPES. */
const TAB_KEYS = ["office", "workstation", "warehouse", "warehouse_zone", "other"];
/** Početna vrednost forme za novu lokaciju; polja se popunjavaju u dijalogu. */
const initialForm = {
  type: "office",
  code: "",
  name: "",
  parentId: "",
  headquarters: false,
  openAt: "09:00",
  closedAt: "17:00",
  maxDeskCapacity: "",
  locationId: "",
  countryId: "",
  regionId: "",
  districtId: "",
  city: "",
  address: "",
  warehouseId: "",
  zoneType: "storage",
  maxUnits: "",
  managerUserId: "",
};

/** Stil za sva polja u dijalogu – pozadina, obruba i fokus; obezbeđuje čitljivost u oba tema. */
const dialogInputSx = (theme, colors) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: theme.palette.mode === "dark" ? colors.primary[500] : colors.primary[700],
    color: theme.palette.text.primary,
    "& fieldset": { borderColor: colors.primary[300] },
    "&:hover fieldset": { borderColor: colors.primary[200] },
    "&.Mui-focused fieldset": { borderColor: colors.blueAccent[500], borderWidth: 1 },
  },
  "& .MuiInputLabel-root": { color: theme.palette.text.secondary },
  "& .MuiInputBase-input": { color: theme.palette.text.primary },
  "& .MuiSelect-select": { color: theme.palette.text.primary },
});

/** Stil za padajući meni (Select) – pozadina i izabrana stavka uvek čitljivi. */
const menuPaperSx = (theme, colors) => ({
  backgroundColor: theme.palette.mode === "dark" ? colors.primary[600] : colors.primary[800],
  "& .MuiMenuItem-root": {
    color: theme.palette.text.primary,
    "&.Mui-selected": {
      backgroundColor: colors.primary[500],
      color: theme.palette.text.primary,
      "&:hover": { backgroundColor: colors.primary[400] },
    },
    "&:hover": { backgroundColor: colors.primary[500] },
  },
});

const LocationsSection = () => {
  const theme = useTheme();
  const colors = useMemo(() => tokens(theme.palette.mode), [theme.palette.mode]);

  const [locations, setLocations] = useState([]);
  const [officesFromFacility, setOfficesFromFacility] = useState([]);
  const [officesLoadError, setOfficesLoadError] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  // Ref-ovi garantuju da handleSave uvek vidi tačne vrednosti bez stale-closure problema.
  const editingIdRef = useRef(null);
  const dialogModeRef = useRef("create");
  const editingTypeRef = useRef("");
  const [form, setForm] = useState(initialForm);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, name: "", type: "" });
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [warehouseManagers, setWarehouseManagers] = useState([]);
  const [locationEditLoading, setLocationEditLoading] = useState(false);

  // Edit dialog – zasebna forma samo za izmenu (isključivo PUT zahtevi)
  const [editDialog, setEditDialog] = useState({ open: false, row: null });
  const [editForm, setEditForm] = useState({});
  const [editCountries, setEditCountries] = useState([]);
  const [editRegions, setEditRegions] = useState([]);
  const [editDistricts, setEditDistricts] = useState([]);
  const [editCityOptions, setEditCityOptions] = useState([]);
  const [editLocationLoading, setEditLocationLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  const currentType = TAB_KEYS[tab];
  const showWarehouseZoneFields = form.type === "warehouse_zone";
  const showWarehouseFields = form.type === "warehouse";
  const showWorkstationFields = form.type === "workstation";
  const showAddressFields = form.type === "office" || form.type === "other" || form.type === "warehouse";

  // Kancelarije: učitavamo iz FacilityController GET /facility/office/all; radna mesta biraju parent iz ove liste.
  const offices = useMemo(
    () => (officesFromFacility?.length > 0 ? officesFromFacility : (locations || []).filter((l) => l.type === "office")),
    [officesFromFacility, locations]
  );

  const loadLocations = useCallback(async () => {
    setLoading(true);
    const res = await locationsService.listLocations({});
    setLocations(res.data?.items || []);
    setIsFallback(Boolean(res.isFallback));
    setLoading(false);
  }, []);

  const loadWarehouses = useCallback(async () => {
    try {
      const list = await facilityService.getWarehousesForCompany();
      // WarehouseResponse: { id, name, code, openAt, closedAt, locationId, location, manager }
      setWarehouses(Array.isArray(list) ? list : []);
    } catch {
      setWarehouses([]);
    }
  }, []);

  const loadWarehouseManagers = useCallback(async () => {
    try {
      // Koristimo backend endpoint /company/getCompanyUsersWithRole za INVENTORY_MANAGEMENT upravnike magacina.
      const list = await getCompanyUsersWithRole("INVENTORY_MANAGEMENT");
      setWarehouseManagers(list || []);
    } catch {
      setWarehouseManagers([]);
    }
  }, []);

  const loadOffices = useCallback(async () => {
    setOfficesLoadError(null);
    try {
      const list = await facilityService.getOfficesForCompany();
      setOfficesFromFacility(Array.isArray(list) ? list : []);
    } catch (err) {
      setOfficesFromFacility([]);
      const status = err.response?.status;
      const msg = err.response?.data?.message ?? err.response?.data?.error;
      setOfficesLoadError({
        status,
        message: status === 403
          ? "Backend vraća 403 za GET /api/v1/facility/office/all. U Spring Security dozvolite ovaj endpoint za ulogovanog korisnika (npr. .requestMatchers(GET, \"/api/v1/facility/office/all\").authenticated())."
          : (msg || "Nije moguće učitati kancelarije."),
      });
    }
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  useEffect(() => {
    loadWarehouses();
  }, [loadWarehouses]);

  useEffect(() => {
    loadOffices();
  }, [loadOffices]);

  useEffect(() => {
    loadWarehouseManagers();
  }, [loadWarehouseManagers]);

  /** Učitaj države kad se dijalog otvori (za adresu) – GET /api/v1/location/getAllCountries. */
  useEffect(() => {
    if (!dialogOpen || !showAddressFields) return;
    geoService
      .listCountries()
      .then((res) => setCountries(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCountries([]));
  }, [dialogOpen, showAddressFields]);

  /** Učitaj regione kad je izabrana država – GET /api/v1/location/getRegionsByCountry?country=. */
  useEffect(() => {
    if (!form.countryId) {
      setRegions([]);
      return;
    }
    geoService
      .listRegions(form.countryId)
      .then((res) => setRegions(Array.isArray(res.data) ? res.data : []))
      .catch(() => setRegions([]));
  }, [form.countryId]);

  /** Učitaj okruge kad je izabran region – GET /api/v1/location/getDistrictsByRegion?regionId=. */
  useEffect(() => {
    if (!form.regionId) {
      setDistricts([]);
      return;
    }
    geoService
      .listDistricts(form.regionId)
      .then((res) => setDistricts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setDistricts([]));
  }, [form.regionId]);

  /** Učitaj gradove kad je izabran okrug – GET /api/v1/location/getCitiesByDistrictId?districtId=. */
  useEffect(() => {
    if (!form.districtId) {
      setCityOptions([]);
      return;
    }
    setCityLoading(true);
    geoService
      .listCitySuggestions(form.districtId)
      .then((res) => setCityOptions(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCityOptions([]))
      .finally(() => setCityLoading(false));
  }, [form.districtId]);

  // Edit dialog – učitaj države kad se otvori
  useEffect(() => {
    if (!editDialog.open) return;
    geoService.listCountries()
      .then((res) => setEditCountries(Array.isArray(res.data) ? res.data : []))
      .catch(() => setEditCountries([]));
  }, [editDialog.open]);

  // Edit dialog – učitaj regione po countryId
  useEffect(() => {
    if (!editForm.countryId) { setEditRegions([]); return; }
    geoService.listRegions(editForm.countryId)
      .then((res) => setEditRegions(Array.isArray(res.data) ? res.data : []))
      .catch(() => setEditRegions([]));
  }, [editForm.countryId]);

  // Edit dialog – učitaj okruge po regionId
  useEffect(() => {
    if (!editForm.regionId) { setEditDistricts([]); return; }
    geoService.listDistricts(editForm.regionId)
      .then((res) => setEditDistricts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setEditDistricts([]));
  }, [editForm.regionId]);

  // Edit dialog – učitaj gradove po districtId
  useEffect(() => {
    if (!editForm.districtId) { setEditCityOptions([]); return; }
    geoService.listCitySuggestions(editForm.districtId)
      .then((res) => setEditCityOptions(Array.isArray(res.data) ? res.data : []))
      .catch(() => setEditCityOptions([]));
  }, [editForm.districtId]);

  const handleOpenEditDialog = (row) => {
    const baseForm = {
      name: row.name ?? "",
      code: row.code ?? "",
      openAt: row.openAt ? String(row.openAt).slice(0, 5) : "09:00",
      closedAt: row.closedAt ? String(row.closedAt).slice(0, 5) : "17:00",
      countryId: "",
      regionId: "",
      districtId: "",
      city: "",
      address: "",
      // office specific
      maxDeskCapacity: row.maxDeskCapacity != null ? String(row.maxDeskCapacity) : "",
      headquarters: Boolean(row.headquarters),
      // warehouse specific
      managerId: row.manager?.id != null ? String(row.manager.id) : "",
    };
    setEditForm(baseForm);
    setEditDialog({ open: true, row });

    if (row.locationId != null) {
      setEditLocationLoading(true);
      getLocationById(Number(row.locationId))
        .then((loc) => {
          setEditForm((prev) => ({
            ...prev,
            countryId: loc.countryId ?? "",
            regionId: loc.regionId ?? "",
            districtId: loc.districtId ?? "",
            city: loc.city ?? "",
            address: loc.address ?? "",
          }));
        })
        .catch(() => {})
        .finally(() => setEditLocationLoading(false));
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialog({ open: false, row: null });
    setEditForm({});
    setEditLocationLoading(false);
  };

  const handleUpdateSave = async () => {
    const { row } = editDialog;
    if (!row) return;
    const rowId = Number(row.id);
    if (!rowId) {
      setSnack({ open: true, message: "Nema ID-a za izmenu.", severity: "error" });
      return;
    }
    if (!editForm.name?.trim() || !editForm.code?.trim()) {
      setSnack({ open: true, message: "Naziv i kod su obavezni.", severity: "warning" });
      return;
    }
    setEditSaving(true);
    try {
      if (row.type === "office") {
        await facilityService.updateOffice(rowId, {
          name: editForm.name,
          code: editForm.code,
          openAt: editForm.openAt || "09:00",
          closedAt: editForm.closedAt || "17:00",
          maxDeskCapacity: editForm.maxDeskCapacity !== "" ? Number(editForm.maxDeskCapacity) : null,
          newHeadquarters: Boolean(editForm.headquarters),
          countryId: editForm.countryId,
          regionId: editForm.regionId || null,
          districtId: editForm.districtId || null,
          city: editForm.city || null,
          address: editForm.address?.trim() || null,
        });
        loadOffices();
      } else if (row.type === "warehouse") {
        await facilityService.updateWarehouse(rowId, {
          name: editForm.name,
          code: editForm.code,
          openAt: editForm.openAt || "09:00",
          closedAt: editForm.closedAt || "17:00",
          managerId: editForm.managerId || null,
          countryId: editForm.countryId,
          regionId: editForm.regionId || null,
          districtId: editForm.districtId || null,
          city: editForm.city || null,
          address: editForm.address?.trim() || null,
        });
        loadWarehouses();
      }
      setSnack({ open: true, message: "Izmena je sačuvana.", severity: "success" });
      handleCloseEditDialog();
      loadLocations();
    } catch {
      setSnack({ open: true, message: "Greška pri čuvanju izmene.", severity: "error" });
    } finally {
      setEditSaving(false);
    }
  };

  const filteredByTab = useMemo(() => {
    if (currentType === "office") {
      return (officesFromFacility || []).map((o) => ({
        ...o,
        type: "office",
        address: (o.location && String(o.location).trim()) || (o.locationId != null ? `Lokacija #${o.locationId}` : "—"),
      }));
    }
    if (currentType === "warehouse") {
      return (warehouses || []).map((w) => ({
        ...w,
        type: "warehouse",
        // WarehouseResponse.location je već formatirana puna adresa; fallback na locationId ako nema stringa.
        address: (w.location && String(w.location).trim()) || (w.locationId != null ? `Lokacija #${w.locationId}` : "—"),
        // Za edit forme koristimo managerUserId kao string ID menadžera.
        managerUserId: w.manager?.id != null ? String(w.manager.id) : "",
      }));
    }
    if (currentType === "all") return locations;
    return locations.filter((l) => l.type === currentType);
  }, [currentType, officesFromFacility, warehouses, locations]);

  const filteredBySearch = useMemo(() => {
    if (!search.trim()) return filteredByTab;
    const q = search.trim().toLowerCase();
    return filteredByTab.filter(
      (l) =>
        (l.code && l.code.toLowerCase().includes(q)) ||
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.address && l.address.toLowerCase().includes(q)) ||
        (l.city && l.city.toLowerCase().includes(q))
    );
  }, [filteredByTab, search]);

  // Pomoćni prikaz „sekundarne“ informacije po tipu lokacije, da bude čitljiv i za veće sisteme:
  // - Radno mesto → ime kancelarije ili magacina u kome se nalazi
  // - Zona u magacinu → ime magacina
  // - Ostalo → adresa
  const getLocationDisplaySubtext = (loc) => {
    if (loc.type === "workstation") {
      const office = offices.find((o) => o.id === loc.parentId);
      if (office) return office.name;
      const wh = warehouses.find((w) => String(w.id) === String(loc.parentId));
      if (wh) return wh.name;
      return loc.parentId || "—";
    }
    if (loc.type === "warehouse_zone" && loc.warehouseName) return loc.warehouseName;
    return loc.address || "—";
  };

  const handleOpenCreate = () => {
    editingIdRef.current = null;
    dialogModeRef.current = "create";
    editingTypeRef.current = currentType;
    setSaveContext({ mode: "create", id: null, type: currentType });
    setForm({ ...initialForm, type: currentType });
    setDialogMode("create");
    setDialogOpen(true);
  };

  const parseAddressParts = (fullAddress) => {
    if (!fullAddress?.trim()) return { city: "", address: "" };
    const parts = fullAddress.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 3) return { city: parts[1], address: parts.slice(2).join(", ") };
    if (parts.length === 2) return { city: parts[0], address: parts[1] || "" };
    if (parts.length === 1) return { city: "", address: parts[0] };
    return { city: "", address: "" };
  };

  const handleOpenEdit = (row) => {
    const loc = row.location;
    const locObj = loc && typeof loc === "object" ? loc : {};
    const hasGeoIds = row.countryId != null || row.regionId != null || (locObj && (locObj.countryId != null || locObj.regionId != null));

    let city = "";
    let address = "";

    if (hasGeoIds) {
      city = row.city ?? locObj.city ?? "";
      address = row.address ?? locObj.address ?? "";
    } else {
      const parsed = parseAddressParts(row.address || (locObj.city || locObj.address ? [locObj.city, locObj.address].filter(Boolean).join(", ") : ""));
      city = parsed.city || "";
      address = parsed.address || "";
    }

    const openAt = row.openAt != null ? (typeof row.openAt === "string" ? row.openAt.slice(0, 5) : "") : "09:00";
    const closedAt = row.closedAt != null ? (typeof row.closedAt === "string" ? row.closedAt.slice(0, 5) : "") : "17:00";

    setForm({
      type: row.type,
      code: row.code ?? "",
      name: row.name ?? "",
      parentId: row.parentId || "",
      headquarters: Boolean(row.headquarters ?? locObj.headquarters),
      openAt,
      closedAt,
      maxDeskCapacity: row.maxDeskCapacity != null ? String(row.maxDeskCapacity) : "",
      locationId: row.locationId ?? "",
      countryId: row.countryId ?? locObj.countryId ?? "",
      regionId: row.regionId ?? locObj.regionId ?? "",
      districtId: row.districtId ?? locObj.districtId ?? "",
      city: city || "",
      address: address || "",
      warehouseId: row.warehouseId || "",
      zoneType: row.zoneType || "storage",
      maxUnits: row.capacity?.maxUnits?.toString() || "",
      managerUserId: row.managerUserId || "",
    });
    editingIdRef.current = row.id;
    dialogModeRef.current = "edit";
    editingTypeRef.current = row.type;
    setSaveContext({ mode: "edit", id: row.id, type: row.type });
    setEditingId(row.id);
    setDialogMode("edit");
    setDialogOpen(true);

    if ((row.type === "office" || row.type === "warehouse") && row.locationId != null) {
      setLocationEditLoading(true);
      getLocationById(Number(row.locationId))
        .then((locData) => {
          setForm((prev) => ({
            ...prev,
            countryId: locData.countryId ?? prev.countryId,
            regionId: locData.regionId ?? prev.regionId,
            districtId: locData.districtId ?? prev.districtId,
            city: locData.city ?? prev.city ?? "",
            address: locData.address ?? prev.address ?? "",
          }));
        })
        .catch(() => {
          setSnack({
            open: true,
            message:
              row.type === "office"
                ? "Lokacija kancelarije nije učitana."
                : "Lokacija magacina nije učitana.",
            severity: "warning",
          });
        })
        .finally(() => setLocationEditLoading(false));
    }
  };

  const handleCloseDialog = () => {
    editingIdRef.current = null;
    dialogModeRef.current = "create";
    editingTypeRef.current = "";
    setSaveContext({ mode: "create", id: null, type: "" });
    setDialogOpen(false);
    setEditingId(null);
    setDialogMode("create");
    setForm(initialForm);
    setLocationEditLoading(false);
  };

  /** Adresa za backend: država, region, okrug, mesto i ulica u jedan string; za payload šaljemo i id-eve. */
  const buildFullAddress = () => {
    const countryName = countries.find((c) => String(c.id) === String(form.countryId))?.name ?? "";
    const regionName = regions.find((r) => String(r.id) === String(form.regionId))?.name ?? "";
    const districtName = districts.find((d) => String(d.id) === String(form.districtId))?.name ?? "";
    return [countryName, regionName, districtName, form.city, form.address].filter(Boolean).join(", ") || "";
  };

  // saveMode i saveId se postavljaju direktno pri otvaranju dijaloga i prenose se u handleSave.
  // Ovako se izbegavaju stale closure, ref i state problemi – vrednosti su uvek tačne.
  const [saveContext, setSaveContext] = useState({ mode: "create", id: null, type: "" });

  const handleSave = async () => {
    const { mode, id, type: locType } = saveContext;
    const isEdit = mode === "edit" && id != null;

    if (!form.code?.trim() || !form.name?.trim()) {
      setSnack({ open: true, message: "Kod i naziv su obavezni.", severity: "warning" });
      return;
    }
    if (locType === "office" && !form.countryId) {
      setSnack({ open: true, message: "Za kancelariju je obavezna država (countryId).", severity: "warning" });
      return;
    }
    if (locType === "workstation" && !form.parentId) {
      setSnack({ open: true, message: "Radno mesto mora biti vezano za lokaciju (kancelariju ili magacin).", severity: "warning" });
      return;
    }
    if (locType === "warehouse_zone" && !form.warehouseId) {
      setSnack({ open: true, message: "Zona mora biti u nekom magacinu.", severity: "warning" });
      return;
    }

    const fullAddress = buildFullAddress();
    const officePayload = {
      name: form.name,
      code: form.code,
      openAt: form.openAt || "09:00",
      closedAt: form.closedAt || "17:00",
      maxDeskCapacity: form.maxDeskCapacity !== "" ? Number(form.maxDeskCapacity) : null,
      newHeadquarters: Boolean(form.headquarters),
      countryId: form.countryId,
      regionId: form.regionId || null,
      districtId: form.districtId || null,
      city: form.city || null,
      address: form.address?.trim() || null,
    };
    const warehousePayload = {
      name: form.name,
      code: form.code,
      openAt: form.openAt || "09:00",
      closedAt: form.closedAt || "17:00",
      managerId: form.managerUserId || null,
      countryId: form.countryId,
      regionId: form.regionId || null,
      districtId: form.districtId || null,
      city: form.city || null,
      address: form.address?.trim() || null,
    };

    try {
      if (locType === "office") {
        if (isEdit) {
          await facilityService.updateOffice(Number(id), officePayload);
        } else {
          await facilityService.createOffice(officePayload);
        }
        loadOffices();
      } else if (locType === "warehouse") {
        if (isEdit) {
          await facilityService.updateWarehouse(Number(id), warehousePayload);
        } else {
          await facilityService.createWarehouse(warehousePayload);
        }
        loadWarehouses();
      } else if (locType === "warehouse_zone") {
        await wmsService.createWarehouseLocation({
          warehouseId: form.warehouseId,
          code: form.code,
          name: form.name,
          type: form.zoneType,
          capacity: form.maxUnits ? { maxUnits: Number(form.maxUnits) } : undefined,
        });
        loadWarehouses();
      } else {
        await locationsService.createLocation({
          type: locType,
          code: form.code,
          name: form.name,
          address: fullAddress,
          parentId: locType === "workstation" ? form.parentId || null : null,
          countryId: form.countryId || undefined,
          regionId: form.regionId || undefined,
          districtId: form.districtId || undefined,
          city: form.city || undefined,
        });
      }
      setSnack({ open: true, message: "Lokacija je sacuvana.", severity: "success" });
      handleCloseDialog();
      loadLocations();
    } catch {
      setSnack({
        open: true,
        message: "Nije moguće sačuvati. Proveri konekciju ili backend.",
        severity: "error",
      });
    }
  };

  const handleDeleteConfirm = (row) => {
    setDeleteConfirm({ open: true, id: row.id, name: row.name ?? "", type: row.type ?? "" });
  };

  const handleDeleteClose = () => {
    setDeleteConfirm({ open: false, id: null, name: "", type: "" });
  };

  const handleDeleteConfirmAction = async () => {
    const { id, type } = deleteConfirm;
    if (id == null) return;

    if (type === "office") {
      try {
        await facilityService.deleteOffice(Number(id));
        setSnack({ open: true, message: "Kancelarija je obrisana.", severity: "success" });
        handleDeleteClose();
        loadOffices();
        loadLocations();
      } catch {
        setSnack({ open: true, message: "Nije moguće obrisati kancelariju.", severity: "error" });
      }
      return;
    }

    if (type === "warehouse") {
      try {
        await facilityService.deleteWarehouse(Number(id));
        setSnack({ open: true, message: "Magacin je obrisan.", severity: "success" });
        handleDeleteClose();
        loadWarehouses();
        loadLocations();
      } catch {
        setSnack({ open: true, message: "Nije moguće obrisati magacin.", severity: "error" });
      }
      return;
    }

    setSnack({ open: true, message: "Brisanje ovog tipa lokacije će biti dostupno kada backend podrži.", severity: "info" });
    handleDeleteClose();
    loadLocations();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${colors.primary[300]}50`,
        bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : colors.primary[800],
        boxShadow: theme.palette.mode === "dark"
          ? `0 2px 8px ${colors.primary[900]}80`
          : `0 2px 12px ${colors.primary[500]}20`,
      }}
    >
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: `1px solid ${colors.primary[300]}40`,
          minHeight: 48,
          "& .MuiTab-root": {
            minHeight: 48,
            textTransform: "none",
            fontWeight: 600,
            color: colors.grey[100],
            "&.Mui-selected": { color: colors.greenAccent[500] },
          },
          "& .MuiTabs-indicator": { backgroundColor: colors.greenAccent[500], height: 2 },
        }}
      >
        <Tab label="Kancelarije" />
        <Tab label="Radna mesta" />
        <Tab label="Magacini" />
        <Tab label="Zone u magacinu" />
        <Tab label="Ostalo" />
      </Tabs>

      <Box sx={{ px: 2, py: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Pretraži po kodu, nazivu ili adresi…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              maxWidth: 380,
              "& .MuiOutlinedInput-root": {
                bgcolor: theme.palette.mode === "dark" ? colors.primary[500] : colors.primary[700],
                borderRadius: 2,
                "& fieldset": { borderColor: colors.primary[300] + "60" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: colors.grey[400] }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              bgcolor: colors.greenAccent[500],
              color: "#fff",
              "&:hover": {
                bgcolor: colors.greenAccent[600],
                boxShadow: "none",
              },
            }}
          >
            Dodaj lokaciju
          </Button>
        </Box>

        {currentType === "office" && officesLoadError && (
          <Alert
            severity="warning"
            onClose={() => setOfficesLoadError(null)}
            sx={{ mb: 2 }}
          >
            {officesLoadError.message}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ py: 2 }}>
            <Skeleton variant="rectangular" height={56} sx={{ mb: 1, borderRadius: 1 }} />
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rectangular" height={52} sx={{ mb: 1, borderRadius: 1 }} />
            ))}
          </Box>
        ) : filteredBySearch.length === 0 ? (
          <Box
            sx={{
              py: 8,
              px: 2,
              textAlign: "center",
              border: `1px dashed ${colors.primary[300]}50`,
              borderRadius: 2,
              bgcolor: theme.palette.mode === "dark" ? colors.primary[500] : colors.primary[700],
            }}
          >
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {search.trim()
                ? "Nema rezultata za ovu pretragu."
                : `Nema lokacija tipa „${LOCATION_TYPES[currentType]}”.`}
            </Typography>
            {!search.trim() && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpenCreate}
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  borderColor: colors.greenAccent[500],
                  color: colors.greenAccent[500],
                  "&:hover": { borderColor: colors.greenAccent[400], color: colors.greenAccent[400], bgcolor: colors.greenAccent[500] + "15" },
                }}
              >
                Dodaj prvu lokaciju
              </Button>
            )}
          </Box>
        ) : (
          <TableContainer sx={{ borderRadius: 1, border: `1px solid ${colors.primary[300]}30`, overflowX: "auto" }}>
            <Table size="small" stickyHeader sx={{ "& .MuiTableCell-root": { fontSize: { xs: "0.72rem", sm: "0.85rem" }, px: { xs: 1, sm: 2 }, py: { xs: 0.6, sm: 1 } } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: colors.primary[500], color: colors.grey[200] }}>Tip</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: colors.primary[500], color: colors.grey[200] }}>Kod</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: colors.primary[500], color: colors.grey[200] }}>Naziv</TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: colors.primary[500], color: colors.grey[200], display: { xs: "none", sm: "table-cell" } }}>Adresa / Magacin</TableCell>
                  {currentType === "warehouse" && (
                    <TableCell sx={{ fontWeight: 700, bgcolor: colors.primary[500], color: colors.grey[200], display: { xs: "none", md: "table-cell" } }}>Upravnik</TableCell>
                  )}
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: colors.primary[500], color: colors.grey[200] }}>Akcije</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBySearch.map((loc) => {
                  const managerAvatarSrc = loc.manager?.profilePic
                    ? `data:image/jpeg;base64,${
                        typeof loc.manager.profilePic === "string"
                          ? loc.manager.profilePic
                          : btoa(String.fromCharCode(...new Uint8Array(loc.manager.profilePic)))
                      }`
                    : null;
                  return (
                  <TableRow
                    key={loc.id}
                    hover
                    sx={{ "&:hover": { bgcolor: colors.greenAccent[500] + "18" } }}
                  >
                    <TableCell sx={{ color: theme.palette.text.primary }}>{LOCATION_TYPES[loc.type] || loc.type}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", color: theme.palette.text.primary }}>{loc.code}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{loc.name}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary, display: { xs: "none", sm: "table-cell" } }}>{getLocationDisplaySubtext(loc)}</TableCell>
                    {currentType === "warehouse" && (
                      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                        {loc.manager ? (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar
                              src={managerAvatarSrc}
                              alt={loc.manager.displayName ?? ""}
                              sx={{ width: 28, height: 28, fontSize: 12, bgcolor: colors.greenAccent[600] }}
                            >
                              {!managerAvatarSrc && (loc.manager.displayName ?? "?").charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                              {loc.manager.displayName ?? "—"}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" sx={{ color: theme.palette.text.disabled, fontStyle: "italic" }}>
                            Nije dodeljen
                          </Typography>
                        )}
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => (loc.type === "office" || loc.type === "warehouse") ? handleOpenEditDialog(loc) : handleOpenEdit(loc)}
                        sx={{ color: colors.blueAccent[500] }}
                        aria-label="Izmeni"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteConfirm(loc)}
                        sx={{ color: colors.redAccent[500] }}
                        aria-label="Obriši"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {isFallback && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            Prikazani su fallback podaci dok backend nije dostupan.
          </Typography>
        )}
      </Box>

      {/* Dialog Nova / Izmena lokacije */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : colors.primary[800],
            border: `1px solid ${colors.primary[300]}40`,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
          {dialogMode === "create" ? "Nova lokacija" : "Izmena lokacije"}
        </DialogTitle>
        <DialogContent sx={{ "&.MuiDialogContent-root": { color: theme.palette.text.primary } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              select
              fullWidth
              label="Tip lokacije"
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              disabled={dialogMode === "edit"}
              helperText="Odaberite da li je u pitanju kancelarija, radno mesto, magacin, zona magacina ili nešto drugo"
              sx={dialogInputSx(theme, colors)}
              SelectProps={{
                MenuProps: {
                  PaperProps: { sx: menuPaperSx(theme, colors) },
                  MenuListProps: { sx: { py: 0 } },
                },
              }}
            >
              {Object.entries(LOCATION_TYPES).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Kod"
              value={form.code}
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
              required
              placeholder="npr. KANC-01, WH-01, A-01-02"
              helperText="Jedinstveni šifra lokacije u sistemu"
              sx={dialogInputSx(theme, colors)}
            />
            <TextField
              fullWidth
              label="Naziv"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              placeholder="npr. Kancelarija glavna, Zona A red 1"
              sx={dialogInputSx(theme, colors)}
            />
            {form.type === "office" && (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(form.headquarters)}
                      onChange={(e) => setForm((p) => ({ ...p, headquarters: e.target.checked }))}
                      sx={{ color: colors.primary[300], "&.Mui-checked": { color: colors.greenAccent[500] } }}
                    />
                  }
                  label="Sedište kompanije (headquarters)"
                  sx={{ color: theme.palette.text.primary }}
                />
                <TextField
                  fullWidth
                  type="number"
                  inputProps={{ min: 0, step: 1 }}
                  label="Maks. kapacitet radnih mesta (maxDeskCapacity)"
                  value={form.maxDeskCapacity}
                  onChange={(e) => setForm((p) => ({ ...p, maxDeskCapacity: e.target.value }))}
                  placeholder="npr. 20"
                  helperText="Opciono – maksimalan broj radnih mesta u kancelariji"
                  sx={dialogInputSx(theme, colors)}
                />
              </>
            )}
            {(form.type === "office" || form.type === "warehouse") && (
              <>
                <TextField
                  fullWidth
                  type="time"
                  label="Otvaranje (openAt)"
                  value={form.openAt || "09:00"}
                  onChange={(e) => setForm((p) => ({ ...p, openAt: e.target.value || "09:00" }))}
                  InputLabelProps={{ shrink: true }}
                  helperText="Vreme otvaranja objekta (LocalTime na backendu)"
                  sx={dialogInputSx(theme, colors)}
                />
                <TextField
                  fullWidth
                  type="time"
                  label="Zatvaranje (closedAt)"
                  value={form.closedAt || "17:00"}
                  onChange={(e) => setForm((p) => ({ ...p, closedAt: e.target.value || "17:00" }))}
                  InputLabelProps={{ shrink: true }}
                  helperText="Vreme zatvaranja objekta (LocalTime na backendu)"
                  sx={dialogInputSx(theme, colors)}
                />
              </>
            )}
            {showWorkstationFields && (
              <TextField
                select
                fullWidth
                label="Lokacija (kancelarija ili magacin)"
                value={form.parentId}
                onChange={(e) => setForm((p) => ({ ...p, parentId: e.target.value }))}
                required
                helperText={
                  offices.length === 0 && warehouses.length === 0
                    ? "Nema dostupnih kancelarija ni magacina. Prvo dodajte jednu lokaciju ovog tipa."
                    : "Radno mesto mora biti vezano za kancelariju ili magacin (po potrebi moguće je dodati i druge tipove lokacija)."
                }
                sx={dialogInputSx(theme, colors)}
                SelectProps={{
                  MenuProps: {
                    PaperProps: { sx: menuPaperSx(theme, colors) },
                    MenuListProps: { sx: { py: 0 } },
                  },
                }}
              >
                <MenuItem value="">— Izaberi lokaciju —</MenuItem>
                {offices.length > 0 && (
                  <MenuItem disabled value="__offices_header">
                    Kancelarije
                  </MenuItem>
                )}
                {offices.map((off) => (
                  <MenuItem key={off.id} value={off.id}>
                    {off.name} ({off.code})
                  </MenuItem>
                ))}
                {warehouses.length > 0 && (
                  <MenuItem disabled value="__warehouses_header">
                    Magacini
                  </MenuItem>
                )}
                {warehouses.map((wh) => (
                  <MenuItem key={wh.id} value={wh.id}>
                    {wh.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
            {showAddressFields && (
              <>
                {locationEditLoading && form.type === "office" && dialogMode === "edit" && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                    Učitavanje adrese…
                  </Typography>
                )}
                <TextField
                  select
                  fullWidth
                  label="Država"
                  value={form.countryId}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      countryId: e.target.value,
                      regionId: "",
                      districtId: "",
                      city: "",
                    }))
                  }
                  sx={dialogInputSx(theme, colors)}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: { sx: menuPaperSx(theme, colors) },
                      MenuListProps: { sx: { py: 0 } },
                    },
                  }}
                >
                  <MenuItem value="">— Izaberi državu —</MenuItem>
                  {countries.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  fullWidth
                  label="Region"
                  value={form.regionId}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      regionId: e.target.value,
                      districtId: "",
                      city: "",
                    }))
                  }
                  disabled={!form.countryId}
                  sx={dialogInputSx(theme, colors)}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: { sx: menuPaperSx(theme, colors) },
                      MenuListProps: { sx: { py: 0 } },
                    },
                  }}
                >
                  <MenuItem value="">— Izaberi region —</MenuItem>
                  {regions.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  fullWidth
                  label="Okrug"
                  value={form.districtId}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      districtId: e.target.value,
                      city: "",
                    }))
                  }
                  disabled={!form.regionId}
                  sx={dialogInputSx(theme, colors)}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: { sx: menuPaperSx(theme, colors) },
                      MenuListProps: { sx: { py: 0 } },
                    },
                  }}
                >
                  <MenuItem value="">— Izaberi okrug —</MenuItem>
                  {districts.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.name}
                    </MenuItem>
                  ))}
                </TextField>
                <Autocomplete
                  freeSolo
                  options={cityOptions.map((c) => (typeof c === "string" ? c : c.name))}
                  value={form.city}
                  onInputChange={(_, value) => setForm((p) => ({ ...p, city: value ?? "" }))}
                  onOpen={() => {
                    if (form.districtId && cityOptions.length === 0) {
                      setCityLoading(true);
                      geoService
                        .listCitySuggestions(form.districtId)
                        .then((res) => setCityOptions(Array.isArray(res.data) ? res.data : []))
                        .catch(() => setCityOptions([]))
                        .finally(() => setCityLoading(false));
                    }
                  }}
                  loading={cityLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Mesto"
                      placeholder="npr. Beograd ili unesite slobodno"
                      sx={dialogInputSx(theme, colors)}
                    />
                  )}
                />
                <TextField
                  fullWidth
                  label="Adresa (ulica i broj)"
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  placeholder="npr. Knez Mihailova 5"
                  multiline={form.type === "warehouse"}
                  rows={form.type === "warehouse" ? 2 : 1}
                  sx={dialogInputSx(theme, colors)}
                />
              </>
            )}
            {showWarehouseZoneFields && (
              <>
                <TextField
                  select
                  fullWidth
                  label="Magacin"
                  value={form.warehouseId}
                  onChange={(e) => setForm((p) => ({ ...p, warehouseId: e.target.value }))}
                  required
                  helperText="Magacin kojem pripada ova zona"
                  sx={dialogInputSx(theme, colors)}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: { sx: menuPaperSx(theme, colors) },
                      MenuListProps: { sx: { py: 0 } },
                    },
                  }}
                >
                  <MenuItem value="">— Izaberi magacin —</MenuItem>
                  {warehouses.map((wh) => (
                    <MenuItem key={wh.id} value={wh.id}>
                      {wh.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  fullWidth
                  label="Tip zone"
                  value={form.zoneType}
                  onChange={(e) => setForm((p) => ({ ...p, zoneType: e.target.value }))}
                  helperText="Namena zone (skladištenje, prijem, komisioniranje, pakovanje)"
                  sx={dialogInputSx(theme, colors)}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: { sx: menuPaperSx(theme, colors) },
                      MenuListProps: { sx: { py: 0 } },
                    },
                  }}
                >
                  {Object.entries(ZONE_TYPES).map(([key, label]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
                {/* Kapacitet po zoni je opcioni podatak koji u enterprise scenarijima služi za granularna ograničenja,
                    ali za osnovni tip „Skladište“ trenutno ga ne koristimo – taj kapacitet se kasnije računa iz stanja. */}
                {form.zoneType !== "storage" && (
                  <TextField
                    fullWidth
                    type="number"
                    label="Kapacitet (max. jedinica)"
                    value={form.maxUnits}
                    onChange={(e) => setForm((p) => ({ ...p, maxUnits: e.target.value }))}
                    placeholder="Opciono – npr. za pick/packing zone"
                    inputProps={{ min: 0, step: 1 }}
                    sx={dialogInputSx(theme, colors)}
                  />
                )}
              </>
            )}
            {form.type === "warehouse" && (
              <TextField
                select
                fullWidth
                label="Menadžer magacina"
                value={form.managerUserId || ""}
                onChange={(e) => setForm((p) => ({ ...p, managerUserId: e.target.value || "" }))}
                helperText="Izaberite korisnika koji upravlja magacinom (magacioneri i admini)"
                sx={dialogInputSx(theme, colors)}
                SelectProps={{
                  MenuProps: {
                    PaperProps: { sx: menuPaperSx(theme, colors) },
                    MenuListProps: { sx: { py: 0 } },
                  },
                }}
              >
                <MenuItem value="">— Nije dodeljen —</MenuItem>
                {warehouseManagers.map((u) => (
                  <MenuItem key={u.id} value={String(u.id)}>
                    {u.name || u.email || `Korisnik #${u.id}`}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, borderTop: `1px solid ${colors.primary[300]}30` }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: "none" }}>
            Otkaži
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              bgcolor: colors.greenAccent[500],
              color: "#fff",
              "&:hover": { bgcolor: colors.greenAccent[600], boxShadow: "none" },
            }}
          >
            Sačuvaj
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== Edit dialog – SAMO PUT zahtevi ===== */}
      <Dialog
        open={editDialog.open}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : colors.primary[800],
            border: `1px solid ${colors.primary[300]}40`,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, borderBottom: `1px solid ${colors.primary[300]}30` }}>
          Izmena {editDialog.row?.type === "warehouse" ? "magacina" : "kancelarije"}:{" "}
          <span style={{ color: colors.greenAccent[400] }}>{editDialog.row?.name}</span>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            {editLocationLoading && (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                Učitavanje adrese lokacije…
              </Typography>
            )}

            <TextField fullWidth label="Naziv" value={editForm.name ?? ""} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} sx={dialogInputSx(theme, colors)} />
            <TextField fullWidth label="Kod" value={editForm.code ?? ""} onChange={(e) => setEditForm((p) => ({ ...p, code: e.target.value }))} sx={dialogInputSx(theme, colors)} />

            {/* Radno vreme (za oba tipa) */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField fullWidth type="time" label="Otvaranje" value={editForm.openAt ?? "09:00"} onChange={(e) => setEditForm((p) => ({ ...p, openAt: e.target.value }))} InputLabelProps={{ shrink: true }} sx={dialogInputSx(theme, colors)} />
              <TextField fullWidth type="time" label="Zatvaranje" value={editForm.closedAt ?? "17:00"} onChange={(e) => setEditForm((p) => ({ ...p, closedAt: e.target.value }))} InputLabelProps={{ shrink: true }} sx={dialogInputSx(theme, colors)} />
            </Box>

            {/* Kancelarija – kapacitet i headquarters */}
            {editDialog.row?.type === "office" && (
              <>
                <TextField fullWidth type="number" inputProps={{ min: 0 }} label="Maks. radnih mesta" value={editForm.maxDeskCapacity ?? ""} onChange={(e) => setEditForm((p) => ({ ...p, maxDeskCapacity: e.target.value }))} sx={dialogInputSx(theme, colors)} />
                <FormControlLabel
                  control={<Checkbox checked={Boolean(editForm.headquarters)} onChange={(e) => setEditForm((p) => ({ ...p, headquarters: e.target.checked }))} sx={{ color: colors.primary[300], "&.Mui-checked": { color: colors.greenAccent[500] } }} />}
                  label="Sedište kompanije"
                  sx={{ color: theme.palette.text.primary }}
                />
              </>
            )}

            {/* Magacin – menadžer */}
            {editDialog.row?.type === "warehouse" && (
              <TextField
                select fullWidth label="Menadžer magacina"
                value={editForm.managerId ?? ""}
                onChange={(e) => setEditForm((p) => ({ ...p, managerId: e.target.value }))}
                helperText={editDialog.row?.manager ? `Trenutni menadžer: ${editDialog.row.manager.displayName ?? editDialog.row.manager.name ?? "—"}` : "Nije dodeljen menadžer"}
                sx={dialogInputSx(theme, colors)}
                SelectProps={{ MenuProps: { PaperProps: { sx: menuPaperSx(theme, colors) } } }}
              >
                <MenuItem value="">— Nije dodeljen —</MenuItem>
                {warehouseManagers.map((u) => (
                  <MenuItem key={u.id} value={String(u.id)}>{u.name || `Korisnik #${u.id}`}</MenuItem>
                ))}
              </TextField>
            )}

            {/* Adresa – geo dropdowns */}
            <TextField select fullWidth label="Država" value={editForm.countryId ?? ""}
              onChange={(e) => setEditForm((p) => ({ ...p, countryId: e.target.value, regionId: "", districtId: "", city: "" }))}
              sx={dialogInputSx(theme, colors)}
              SelectProps={{ MenuProps: { PaperProps: { sx: menuPaperSx(theme, colors) } } }}
            >
              <MenuItem value="">— Izaberi državu —</MenuItem>
              {editCountries.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </TextField>
            <TextField select fullWidth label="Region" value={editForm.regionId ?? ""}
              onChange={(e) => setEditForm((p) => ({ ...p, regionId: e.target.value, districtId: "", city: "" }))}
              disabled={!editForm.countryId}
              sx={dialogInputSx(theme, colors)}
              SelectProps={{ MenuProps: { PaperProps: { sx: menuPaperSx(theme, colors) } } }}
            >
              <MenuItem value="">— Izaberi region —</MenuItem>
              {editRegions.map((r) => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
            </TextField>
            <TextField select fullWidth label="Okrug" value={editForm.districtId ?? ""}
              onChange={(e) => setEditForm((p) => ({ ...p, districtId: e.target.value, city: "" }))}
              disabled={!editForm.regionId}
              sx={dialogInputSx(theme, colors)}
              SelectProps={{ MenuProps: { PaperProps: { sx: menuPaperSx(theme, colors) } } }}
            >
              <MenuItem value="">— Izaberi okrug —</MenuItem>
              {editDistricts.map((d) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
            </TextField>
            <Autocomplete
              freeSolo
              options={(editCityOptions || []).map((c) => (typeof c === "string" ? c : c.name))}
              value={editForm.city ?? ""}
              onInputChange={(_, value) => setEditForm((p) => ({ ...p, city: value ?? "" }))}
              disabled={!editForm.districtId}
              renderInput={(params) => (
                <TextField {...params} label="Mesto" sx={dialogInputSx(theme, colors)} />
              )}
            />
            <TextField fullWidth label="Adresa (ulica i broj)" value={editForm.address ?? ""}
              onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))}
              sx={dialogInputSx(theme, colors)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, borderTop: `1px solid ${colors.primary[300]}30` }}>
          <Button onClick={handleCloseEditDialog} sx={{ textTransform: "none" }}>Otkaži</Button>
          <Button
            variant="contained"
            onClick={handleUpdateSave}
            disabled={editSaving}
            sx={{ textTransform: "none", fontWeight: 600, boxShadow: "none", bgcolor: colors.greenAccent[500], color: "#fff", "&:hover": { bgcolor: colors.greenAccent[600], boxShadow: "none" } }}
          >
            {editSaving ? "Čuvanje…" : "Sačuvaj izmene"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog potvrda brisanja */}
      <Dialog
        open={deleteConfirm.open}
        onClose={handleDeleteClose}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>Obriši lokaciju?</DialogTitle>
        <DialogContent>
          <Typography>
            Da li ste sigurni da želite da obrišete lokaciju „{deleteConfirm.name}"? Ova akcija se ne može poništiti.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} sx={{ textTransform: "none" }}>
            Otkaži
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirmAction}
            sx={{ textTransform: "none" }}
          >
            Obriši
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 1,
            bgcolor:
              snack.severity === "error"
                ? colors.redAccent[500]
                : snack.severity === "warning"
                ? "#ed6c02"
                : colors.greenAccent[500],
            color: "#fff",
            fontWeight: 500,
          }}
        >
          {snack.message}
        </Box>
      </Snackbar>
    </Paper>
  );
};

export default LocationsSection;
