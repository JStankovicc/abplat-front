import { useCallback, useEffect, useMemo, useState } from "react";
import {
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
import locationsService, { LOCATION_TYPES } from "../../services/locationsService";
import wmsService from "../../services/wmsService";

const TAB_KEYS = ["office", "workstation", "warehouse", "warehouse_zone", "other"];
const initialForm = {
  type: "office",
  code: "",
  name: "",
  address: "",
  warehouseId: "",
  zoneType: "storage",
  maxUnits: "",
  managerUserId: "",
};

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

  const currentType = TAB_KEYS[tab];
  const showWarehouseZoneFields = form.type === "warehouse_zone";
  const showWarehouseFields = form.type === "warehouse";

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
        (l.address && l.address.toLowerCase().includes(q))
    );
  }, [filteredByTab, search]);

  const countsByType = useMemo(() => {
    const c = { office: 0, workstation: 0, warehouse: 0, warehouse_zone: 0, other: 0 };
    locations.forEach((l) => {
      if (c[l.type] !== undefined) c[l.type]++;
    });
    return c;
  }, [locations]);

  const handleOpenCreate = () => {
    setForm({ ...initialForm, type: currentType });
    setDialogMode("create");
    setDialogOpen(true);
  };

  const handleOpenEdit = (row) => {
    setForm({
      type: row.type,
      code: row.code,
      name: row.name,
      address: row.address || "",
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

  const handleSave = async () => {
    if (!form.code?.trim() || !form.name?.trim()) {
      setSnack({ open: true, message: "Kod i naziv su obavezni.", severity: "warning" });
      return;
    }
    if (form.type === "warehouse_zone" && !form.warehouseId) {
      setSnack({ open: true, message: "Izaberi magacin za zonu.", severity: "warning" });
      return;
    }
    try {
      if (form.type === "warehouse") {
        await wmsService.createWarehouse({
          code: form.code,
          name: form.name,
          address: form.address,
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
          address: form.address,
          parentId: form.parentId || null,
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
        border: `1px solid ${colors.primary[300]}40`,
        bgcolor: theme.palette.mode === "dark" ? colors.primary[600] : colors.primary[800],
      }}
    >
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: `1px solid ${colors.primary[300]}30`,
          minHeight: 48,
          "& .MuiTab-root": { minHeight: 48, textTransform: "none", fontWeight: 600 },
          "& .Mui-selected": { color: colors.greenAccent[500] },
          "& .MuiTabs-indicator": { backgroundColor: colors.greenAccent[500], height: 3 },
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
            flexWrap: "wrap",
            gap: 1,
            mb: 2,
          }}
        >
          {TAB_KEYS.map((key, idx) => (
            <Box
              key={key}
              sx={{
                px: 1.5,
                py: 0.75,
                borderRadius: 1,
                bgcolor: tab === idx ? `${colors.greenAccent[500]}20` : colors.primary[500],
                border: `1px solid ${tab === idx ? colors.greenAccent[500] : "transparent"}`,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
                {LOCATION_TYPES[key]}:
              </Typography>
              <Typography component="span" variant="body2" fontWeight={700}>
                {countsByType[key] ?? 0}
              </Typography>
            </Box>
          ))}
        </Box>

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
              color: colors.primary[500],
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
              border: `1px dashed ${colors.primary[300]}60`,
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
                sx={{ mt: 1, borderRadius: 2, textTransform: "none" }}
              >
                Dodaj prvu lokaciju
              </Button>
            )}
          </Box>
        ) : (
          <TableContainer sx={{ borderRadius: 1, border: `1px solid ${colors.primary[300]}20` }}>
            <Table size="medium" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, bgcolor: colors.primary[500], color: colors.grey[300] }}>
                    Tip
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: colors.primary[500], color: colors.grey[300] }}>
                    Kod
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: colors.primary[500], color: colors.grey[300] }}>
                    Naziv
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, bgcolor: colors.primary[500], color: colors.grey[300] }}>
                    Adresa / Magacin
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, bgcolor: colors.primary[500], color: colors.grey[300] }}>
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
                      "&:hover": { bgcolor: `${colors.primary[400]}40` },
                    }}
                  >
                    <TableCell>{LOCATION_TYPES[loc.type] || loc.type}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace" }}>{loc.code}</TableCell>
                    <TableCell>{loc.name}</TableCell>
                    <TableCell>{loc.address || loc.warehouseName || "—"}</TableCell>
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
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {dialogMode === "create" ? "Nova lokacija" : "Izmena lokacije"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              select
              fullWidth
              label="Tip"
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              disabled={dialogMode === "edit"}
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
              placeholder="npr. KANC-01"
            />
            <TextField
              fullWidth
              label="Naziv"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
            {(showWarehouseFields || form.type === "office" || form.type === "other") && (
              <TextField
                fullWidth
                label="Adresa"
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                multiline={showWarehouseFields}
                rows={showWarehouseFields ? 2 : 1}
              />
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
                >
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
                >
                  <MenuItem value="receiving">Receiving</MenuItem>
                  <MenuItem value="storage">Storage</MenuItem>
                  <MenuItem value="pick">Pick</MenuItem>
                  <MenuItem value="packing">Packing</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  type="number"
                  label="Kapacitet (jedinice)"
                  value={form.maxUnits}
                  onChange={(e) => setForm((p) => ({ ...p, maxUnits: e.target.value }))}
                />
              </>
            )}
            {form.type === "warehouse" && (
              <TextField
                fullWidth
                label="ID menadžera"
                value={form.managerUserId}
                onChange={(e) => setForm((p) => ({ ...p, managerUserId: e.target.value }))}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: "none" }}>
            Otkaži
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              bgcolor: colors.greenAccent[500],
              color: colors.primary[500],
              "&:hover": { bgcolor: colors.greenAccent[600] },
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
