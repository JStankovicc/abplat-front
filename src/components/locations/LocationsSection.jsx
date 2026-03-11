/**
 * Lokacije – glavna sekcija za upravljanje svim tipovima lokacija (kancelarije, radna mesta, magacini, zone, ostalo).
 * Dizajn je usklađen sa zelenim akcentom, čitljivim čipovima i tabelom; lako se skalira na veće firme.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import locationsService, { LOCATION_TYPES, ZONE_TYPES } from "../../services/locationsService";
import wmsService from "../../services/wmsService";
import geoService from "../../services/geoService";
import { useCompanyUsersWithPermissions } from "../../hooks/useCompanyUsersWithPermissions";

/** Redosled tabova po tipu lokacije; mora da odgovara LOCATION_TYPES. */
const TAB_KEYS = ["office", "workstation", "warehouse", "warehouse_zone", "other"];
/** Početna vrednost forme za novu lokaciju; polja se popunjavaju u dijalogu. */
const initialForm = {
  type: "office",
  code: "",
  name: "",
  parentId: "",
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
  const [warehouses, setWarehouses] = useState([]);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, name: "" });
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);

  const currentType = TAB_KEYS[tab];
  const showWarehouseZoneFields = form.type === "warehouse_zone";
  const showWarehouseFields = form.type === "warehouse";
  const showWorkstationFields = form.type === "workstation";
  const showAddressFields = form.type === "office" || form.type === "other" || form.type === "warehouse";

  // Zaposleni sa rolama – koristimo ih da u velikim kompanijama lako biramo odgovorne osobe,
  // npr. menadžere magacina. Model je skalabilan: dovoljno je proširiti role ili filtere ispod.
  const { users: companyUsers } = useCompanyUsersWithPermissions();

  // Potencijalni menadžeri magacina – trenutno ADMIN i INVENTORY_MANAGEMENT.
  // Ako kasnije uvedemo specifičnu rolu (npr. WAREHOUSE_MANAGER), dovoljno je ovde proširiti filter.
  const warehouseManagers = useMemo(
    () =>
      (companyUsers || []).filter(
        (u) => u.roles?.INVENTORY_MANAGEMENT === true || u.roles?.ADMIN === true
      ),
    [companyUsers]
  );

  // Kancelarije kao zaseban tip – radna mesta mogu „živeti“ u kancelariji,
  // ali i u magacinu (radno mesto viljuškariste u zoni skladišta itd.).
  const offices = useMemo(
    () => (locations || []).filter((l) => l.type === "office"),
    [locations]
  );

  const loadLocations = useCallback(async () => {
    setLoading(true);
    const res = await locationsService.listLocations({});
    setLocations(res.data?.items || []);
    setIsFallback(Boolean(res.isFallback));
    setLoading(false);
  }, []);

  const loadWarehouses = useCallback(async () => {
    const res = await wmsService.listWarehouses();
    setWarehouses(res.data?.items || []);
  }, []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  useEffect(() => {
    loadWarehouses();
  }, [loadWarehouses]);

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

  const filteredByTab = useMemo(() => {
    if (currentType === "all") return locations;
    return locations.filter((l) => l.type === currentType);
  }, [locations, currentType]);

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
    const hasGeo = row.countryId != null || row.regionId != null || row.districtId != null;
    const { city, address } = hasGeo ? { city: row.city ?? "", address: row.address ?? "" } : parseAddressParts(row.address);
    setForm({
      type: row.type,
      code: row.code,
      name: row.name,
      parentId: row.parentId || "",
      countryId: row.countryId ?? "",
      regionId: row.regionId ?? "",
      districtId: row.districtId ?? "",
      city: city || "",
      address: address || "",
      warehouseId: row.warehouseId || "",
      zoneType: row.zoneType || "storage",
      maxUnits: row.capacity?.maxUnits?.toString() || "",
      managerUserId: row.managerUserId || "",
    });
    setEditingId(row.id);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(initialForm);
  };

  /** Adresa za backend: država, region, okrug, mesto i ulica u jedan string; za payload šaljemo i id-eve. */
  const buildFullAddress = () => {
    const countryName = countries.find((c) => String(c.id) === String(form.countryId))?.name ?? "";
    const regionName = regions.find((r) => String(r.id) === String(form.regionId))?.name ?? "";
    const districtName = districts.find((d) => String(d.id) === String(form.districtId))?.name ?? "";
    return [countryName, regionName, districtName, form.city, form.address].filter(Boolean).join(", ") || "";
  };

  const handleSave = async () => {
    if (!form.code?.trim() || !form.name?.trim()) {
      setSnack({ open: true, message: "Kod i naziv su obavezni.", severity: "warning" });
      return;
    }
    // Radno mesto mora biti vezano za konkretnu lokaciju:
    // danas podržavamo kancelarije i magacine, a kasnije možemo dodati i druge tipove (npr. proizvodne linije).
    if (form.type === "workstation" && !form.parentId) {
      setSnack({
        open: true,
        message: "Radno mesto mora biti vezano za lokaciju (kancelariju ili magacin).",
        severity: "warning",
      });
      return;
    }
    // Zona u magacinu uvek pripada nekom magacinu – obavezno je izabrati ga.
    if (form.type === "warehouse_zone" && !form.warehouseId) {
      setSnack({ open: true, message: "Zona mora biti u nekom magacinu.", severity: "warning" });
      return;
    }
    const fullAddress = buildFullAddress();
    try {
      if (form.type === "warehouse") {
        await wmsService.createWarehouse({
          code: form.code,
          name: form.name,
          address: fullAddress,
          managerUserId: form.managerUserId || undefined,
        });
      } else if (form.type === "warehouse_zone") {
        await wmsService.createWarehouseLocation({
          warehouseId: form.warehouseId,
          code: form.code,
          name: form.name,
          type: form.zoneType,
          capacity: form.maxUnits ? { maxUnits: Number(form.maxUnits) } : undefined,
        });
      } else {
        await locationsService.createLocation({
          type: form.type,
          code: form.code,
          name: form.name,
          address: fullAddress,
          parentId: form.type === "workstation" ? form.parentId || null : null,
          countryId: form.countryId || undefined,
          regionId: form.regionId || undefined,
          districtId: form.districtId || undefined,
          city: form.city || undefined,
        });
      }
      setSnack({ open: true, message: "Lokacija je sačuvana.", severity: "success" });
      handleCloseDialog();
      loadLocations();
      if (form.type === "warehouse" || form.type === "warehouse_zone") loadWarehouses();
    } catch {
      setSnack({
        open: true,
        message: "Nije moguće sačuvati. Proveri konekciju ili backend.",
        severity: "error",
      });
    }
  };

  const handleDeleteConfirm = (row) => {
    setDeleteConfirm({ open: true, id: row.id, name: row.name });
  };

  const handleDeleteClose = () => {
    setDeleteConfirm({ open: false, id: null, name: "" });
  };

  const handleDeleteConfirmAction = async () => {
    // Backend delete endpoint would go here; for now just close and show message
    setSnack({ open: true, message: "Brisanje će biti dostupno kada backend podrži.", severity: "info" });
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
          <TableContainer sx={{ borderRadius: 1, border: `1px solid ${colors.primary[300]}30` }}>
            <Table size="medium" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: colors.primary[500], color: colors.grey[200] }}>
                    Tip
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: colors.primary[500], color: colors.grey[200] }}>
                    Kod
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: colors.primary[500], color: colors.grey[200] }}>
                    Naziv
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: colors.primary[500], color: colors.grey[200] }}>
                    Adresa / Magacin
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: colors.primary[500], color: colors.grey[200] }}>
                    Akcije
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBySearch.map((loc) => (
                  <TableRow
                    key={loc.id}
                    hover
                    sx={{
                      "&:hover": { bgcolor: colors.greenAccent[500] + "18" },
                    }}
                  >
                    <TableCell sx={{ color: theme.palette.text.primary }}>{LOCATION_TYPES[loc.type] || loc.type}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", color: theme.palette.text.primary }}>{loc.code}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{loc.name}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary }}>{getLocationDisplaySubtext(loc)}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(loc)}
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
                ))}
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
