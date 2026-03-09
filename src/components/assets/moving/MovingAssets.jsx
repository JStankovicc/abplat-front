import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Chip,
  Tabs,
  Tab,
  InputAdornment,
  CircularProgress,
  Alert,
  Fab,
  TablePagination,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Popover,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  QrCode2 as QrCodeIcon,
  Search as SearchIcon,
  Description as DescriptionIcon,
  History as HistoryIcon,
  Build as BuildIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { tokens } from "../../../theme";
import {
  getMovableAssets,
  createMovableAsset,
  updateMovableAsset,
  changeMovableAssetStatus,
  deleteMovableAsset,
} from "../../../services/assetService";
import { getAllCompanyUsers } from "../../../services/companyService";
import AssetQRCode from "./AssetQRCode";
import {
  ASSET_STATUS,
  translateAssetStatus,
  statusColors,
  assetStatuses,
  ASSET_CATEGORIES,
  initialFormState,
} from "./constants";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

/** Polja po kojima se može pretraživati – key = property na assetu, label = prikaz. Status nije u listi jer postoji poseban filter. */
const SEARCH_FIELDS = [
  { key: "identifier", label: "Identifikator" },
  { key: "id", label: "ID" },
  { key: "name", label: "Naziv" },
  { key: "type", label: "Tip" },
  { key: "model", label: "Model" },
  { key: "manufacturer", label: "Proizvođač" },
  { key: "serialNumber", label: "Serijski broj" },
  { key: "barcode", label: "Barkod" },
  { key: "unit", label: "Jedinica" },
  { key: "amount", label: "Količina" },
  { key: "location", label: "Lokacija" },
  { key: "assignedTo", label: "Dodeljeno" },
  { key: "issuedBy", label: "Dodelio" },
];

const defaultSearchFields = SEARCH_FIELDS.reduce((acc, { key }) => ({ ...acc, [key]: true }), {});

const MovingAssets = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchFields, setSearchFields] = useState(defaultSearchFields);
  const [searchFieldsAnchor, setSearchFieldsAnchor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tab, setTab] = useState(0);
  const [detailDialog, setDetailDialog] = useState(false);
  const [detailAsset, setDetailAsset] = useState(null);
  const [qrDialogAsset, setQrDialogAsset] = useState(null);
  const [formState, setFormState] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [quickEditAsset, setQuickEditAsset] = useState(null);
  const [quickEditStatus, setQuickEditStatus] = useState("");
  const [quickEditCurrentUserId, setQuickEditCurrentUserId] = useState("");
  const [quickEditSaving, setQuickEditSaving] = useState(false);
  const [quickEditError, setQuickEditError] = useState(null);
  const [companyUsers, setCompanyUsers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const fetchAssets = async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await getMovableAssets();
        if (!cancelled) setAssets(list);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || "Greška pri učitavanju imovine.");
          setAssets([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAssets();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchUsers = async () => {
      try {
        const users = await getAllCompanyUsers();
        if (!cancelled) setCompanyUsers(users);
      } catch {
        if (!cancelled) setCompanyUsers([]);
      }
    };
    fetchUsers();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredAssets = assets.filter((a) => {
    const searchLower = search.trim().toLowerCase();
    if (!searchLower) return !statusFilter || a.status === statusFilter;
    const text = (val) => (val != null && val !== "" ? String(val).toLowerCase() : "");
    const fieldMatches = {
      identifier: () => text(a.identifier).includes(searchLower),
      id: () => text(a.id).includes(searchLower),
      name: () => text(a.name).includes(searchLower),
      type: () => text(a.type).includes(searchLower),
      model: () => text(a.model).includes(searchLower),
      manufacturer: () => text(a.manufacturer).includes(searchLower),
      serialNumber: () => text(a.serialNumber).includes(searchLower),
      barcode: () => text(a.barcode).includes(searchLower),
      unit: () => text(a.unit).includes(searchLower),
      amount: () => text(a.amount).includes(searchLower),
      location: () => text(a.location).includes(searchLower),
      assignedTo: () => text(a.assignedTo).includes(searchLower),
      issuedBy: () => text(a.issuedBy).includes(searchLower),
    };
    const hasAnyFieldSelected = SEARCH_FIELDS.some(({ key }) => searchFields[key]);
    const matchSearch = !hasAnyFieldSelected
      ? SEARCH_FIELDS.some(({ key }) => fieldMatches[key]?.())
      : SEARCH_FIELDS.some(({ key }) => searchFields[key] && fieldMatches[key]?.());
    return (!statusFilter || a.status === statusFilter) && matchSearch;
  });

  // Frontend pagination (kasnije prebaciti na backend)
  const totalCount = filteredAssets.length;
  const paginatedAssets = filteredAssets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    setPage(0);
  }, [search, statusFilter, searchFields]);

  const handleSearchFieldToggle = (key) => {
    setSearchFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleSelectAllSearchFields = (checked) => {
    setSearchFields(SEARCH_FIELDS.reduce((acc, { key }) => ({ ...acc, [key]: checked }), {}));
  };

  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setSelectedAsset(null);
    setFormState(initialFormState);
    setSubmitError(null);
  };
  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedAsset(null);
    setSubmitError(null);
  };
  const handleSubmitAdd = async () => {
    setSaving(true);
    setSubmitError(null);
    try {
      const currentUserId =
        formState.currentUserId === "" || formState.currentUserId == null
          ? null
          : Number(formState.currentUserId);
      if (currentUserId !== null && Number.isNaN(currentUserId)) {
        setSubmitError("Izaberite korisnika ili ostavite prazno.");
        return;
      }
      await createMovableAsset({
        identifier: formState.identifier || null,
        name: formState.name || null,
        barcode: formState.barcode || null,
        type: formState.type || null,
        model: formState.model || null,
        manufacturer: formState.manufacturer || null,
        category: formState.category || null,
        serialNumber: formState.serialNumber || null,
        currentUserId,
        movableAssetStatus: formState.movableAssetStatus || null,
        purchaseDate: formState.purchaseDate || null,
        insuranceDate: formState.insuranceDate || null,
        comment: formState.comment || null,
        unit: formState.unit || null,
        amount: formState.amount,
      });
      const list = await getMovableAssets();
      setAssets(list);
      handleClose();
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Greška pri čuvanju imovine.");
    } finally {
      setSaving(false);
    }
  };
  const handleSubmitEdit = async () => {
    if (!selectedAsset || (selectedAsset.id == null && selectedAsset.id !== 0)) {
      setSubmitError("ID imovine nije dostupan.");
      return;
    }
    const assetId = Number(selectedAsset.id);
    if (Number.isNaN(assetId) || assetId < 0) {
      setSubmitError("ID imovine nije validan.");
      return;
    }
    const currentUserId =
      formState.currentUserId === "" || formState.currentUserId == null
        ? null
        : Number(formState.currentUserId);
    if (currentUserId !== null && Number.isNaN(currentUserId)) {
      setSubmitError("Izaberite korisnika ili ostavite prazno.");
      return;
    }
    setSaving(true);
    setSubmitError(null);
    try {
      await updateMovableAsset({
        id: assetId,
        identifier: formState.identifier || null,
        name: formState.name || null,
        barcode: formState.barcode || null,
        type: formState.type || null,
        model: formState.model || null,
        manufacturer: formState.manufacturer || null,
        category: formState.category || null,
        serialNumber: formState.serialNumber || null,
        currentUserId,
        movableAssetStatus: formState.movableAssetStatus || null,
        purchaseDate: formState.purchaseDate || null,
        insuranceDate: formState.insuranceDate || null,
        comment: formState.comment || null,
        unit: formState.unit || null,
        amount: formState.amount === "" ? 0 : Number(formState.amount),
      });
      const list = await getMovableAssets();
      setAssets(list);
      handleClose();
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || "Greška pri čuvanju izmena.");
    } finally {
      setSaving(false);
    }
  };
  const handleEdit = (asset) => {
    setSelectedAsset(asset);
    setFormState({
      identifier: asset.identifier ?? "",
      name: asset.name ?? "",
      barcode: asset.barcode ?? "",
      type: asset.type ?? "",
      model: asset.model ?? "",
      manufacturer: asset.manufacturer ?? "",
      category: asset.category ?? "",
      serialNumber: asset.serialNumber ?? "",
      currentUserId: asset.currentUserId != null ? String(asset.currentUserId) : "",
      movableAssetStatus: asset.status ?? ASSET_STATUS.AVAILABLE,
      purchaseDate: asset.purchaseDate ?? "",
      insuranceDate: asset.warranty ?? "",
      comment: asset.notes ?? asset.comment ?? "",
      unit: asset.unit ?? "",
      amount: asset.amount !== undefined && asset.amount !== null ? String(asset.amount) : "",
    });
    setEditMode(true);
    setOpen(true);
    setSubmitError(null);
  };
  const handleDelete = async (asset) => {
    const assetId = asset?.id != null ? Number(asset.id) : NaN;
    if (Number.isNaN(assetId) || assetId < 1) {
      setError("ID imovine nije dostupan.");
      return;
    }
    if (!window.confirm(`Da li ste sigurni da želite da obrišete „${asset.name || "imovinu"}"?`))
      return;
    try {
      await deleteMovableAsset(assetId);
      const list = await getMovableAssets();
      setAssets(list);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Greška pri brisanju imovine.");
    }
  };
  const handleDetail = (asset) => {
    setDetailAsset(asset);
    setDetailDialog(true);
    setTab(0);
  };
  const handleDetailClose = () => {
    setDetailDialog(false);
    setDetailAsset(null);
  };

  const openQuickEdit = (asset) => {
    setQuickEditAsset(asset);
    setQuickEditStatus(asset.status || ASSET_STATUS.AVAILABLE);
    setQuickEditCurrentUserId(asset.currentUserId != null ? String(asset.currentUserId) : "");
    setQuickEditError(null);
  };
  const closeQuickEdit = () => {
    setQuickEditAsset(null);
    setQuickEditError(null);
  };
  const handleQuickEditSubmit = async () => {
    if (!quickEditAsset) return;
    const rawId = quickEditAsset.id ?? quickEditAsset.movableAssetId;
    const assetId = rawId !== undefined && rawId !== null ? Number(rawId) : NaN;
    if (Number.isNaN(assetId) || assetId < 0) {
      setQuickEditError(
        `ID imovine nije dostupan (vrednost: ${JSON.stringify(quickEditAsset.id)}). Osvežite listu ili proverite odgovor API-ja.`
      );
      return;
    }
    setQuickEditSaving(true);
    setQuickEditError(null);
    try {
      const currentUserId =
        quickEditCurrentUserId === "" || quickEditCurrentUserId == null
          ? null
          : Number(quickEditCurrentUserId);
      if (currentUserId !== null && Number.isNaN(currentUserId)) {
        setQuickEditError("Izaberite korisnika ili ostavite prazno.");
        setQuickEditSaving(false);
        return;
      }
      await changeMovableAssetStatus(assetId, {
        status: quickEditStatus,
        currentUserId,
      });
      const list = await getMovableAssets();
      setAssets(list);
      closeQuickEdit();
    } catch (err) {
      setQuickEditError(err.response?.data?.message || err.message || "Greška pri promeni statusa.");
    } finally {
      setQuickEditSaving(false);
    }
  };

  return (
    <Box sx={{ pb: isMobile ? 10 : 0 }}>
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        flexWrap="wrap"
        alignItems={isMobile ? "stretch" : "center"}
        justifyContent="space-between"
        mb={2}
        gap={2}
      >
        <Typography
          variant="h5"
          color={colors.grey[100]}
          sx={{
            fontSize: isMobile ? "1.25rem" : undefined,
            fontWeight: 600,
          }}
        >
          Pokretna imovina
          {isMobile && (
            <Typography component="span" sx={{ ml: 0.75, fontSize: "0.875rem", color: colors.grey[300], fontWeight: 500 }}>
              ({totalCount})
            </Typography>
          )}
        </Typography>
        <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={1.5} alignItems="stretch" sx={{ width: isMobile ? "100%" : undefined }}>
          <Box display="flex" gap={0.5} alignItems="stretch" sx={{ flex: isMobile ? "1 1 100%" : "0 1 auto", minWidth: 0 }}>
            <TextField
              size="small"
              placeholder="Pretraga"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: isMobile ? undefined : 220,
                background: colors.primary[400],
                borderRadius: 1,
                "& .MuiInputBase-input": { fontSize: isMobile ? 16 : undefined },
              }}
            />
            <Tooltip title="Polja pretrage">
              <IconButton
                onClick={(e) => setSearchFieldsAnchor(e.currentTarget)}
                sx={{
                  background: colors.primary[400],
                  border: `1px solid ${colors.grey[600]}`,
                  borderRadius: 1,
                  color: searchFieldsAnchor ? colors.greenAccent[500] : colors.grey[300],
                  minWidth: 40,
                  minHeight: 40,
                }}
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Popover
            open={Boolean(searchFieldsAnchor)}
            anchorEl={searchFieldsAnchor}
            onClose={() => setSearchFieldsAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                p: 2,
                backgroundColor: colors.primary[400],
                color: colors.grey[100],
                minWidth: 260,
                maxWidth: 320,
              },
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1.5, color: colors.grey[200] }}>
              Pretraži po poljima
            </Typography>
            <FormGroup>
              <Box display="flex" gap={0.5} mb={1}>
                <Button size="small" onClick={() => handleSelectAllSearchFields(true)} sx={{ color: colors.grey[300], fontSize: "0.75rem" }}>
                  Sve
                </Button>
                <Button size="small" onClick={() => handleSelectAllSearchFields(false)} sx={{ color: colors.grey[300], fontSize: "0.75rem" }}>
                  Ništa
                </Button>
              </Box>
              {SEARCH_FIELDS.map(({ key, label }) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={!!searchFields[key]}
                      onChange={() => handleSearchFieldToggle(key)}
                      size="small"
                      sx={{ color: colors.grey[400], "&.Mui-checked": { color: colors.greenAccent[500] } }}
                    />
                  }
                  label={<Typography variant="body2" sx={{ color: colors.grey[200] }}>{label}</Typography>}
                />
              ))}
            </FormGroup>
          </Popover>
          <FormControl size="small" sx={{ minWidth: isMobile ? "100%" : 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">Svi statusi</MenuItem>
              {assetStatuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {translateAssetStatus(s)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {!isMobile && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpen}
              sx={{
                backgroundColor: colors.greenAccent[500],
                "&:hover": { backgroundColor: colors.greenAccent[600] },
              }}
            >
              Dodaj imovinu
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress sx={{ color: colors.greenAccent[500] }} size={isMobile ? 32 : undefined} />
        </Box>
      ) : isMobile ? (
        <>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            {paginatedAssets.length === 0 ? (
              <Box
                sx={{
                  py: 6,
                  px: 2,
                  textAlign: "center",
                  backgroundColor: colors.primary[400],
                  borderRadius: 2,
                  border: `1px solid ${colors.grey[700]}`,
                }}
              >
                <Typography variant="body1" sx={{ color: colors.grey[200], fontWeight: 500 }}>
                  Nema stavki.
                </Typography>
                <Typography variant="body2" sx={{ color: colors.grey[400], mt: 1 }}>
                  Promenite filter ili dodajte imovinu.
                </Typography>
              </Box>
            ) : (
              paginatedAssets.map((asset) => (
                <Box
                  key={asset.id}
                  onClick={() => handleDetail(asset)}
                  sx={{
                    backgroundColor: colors.primary[400],
                    borderRadius: 2,
                    p: 2,
                    borderLeft: `4px solid ${colors.greenAccent?.[500] ?? colors.grey[500]}`,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                    cursor: "pointer",
                    transition: "box-shadow 0.2s ease",
                    "&:active": { transform: "scale(0.99)" },
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: colors.grey[100],
                        fontWeight: 600,
                        flex: 1,
                        fontSize: "1rem",
                      }}
                    >
                      {asset.name || asset.identifier || asset.id}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5} onClick={(e) => e.stopPropagation()}>
                      <IconButton
                        size="small"
                        onClick={() => setQrDialogAsset(asset)}
                        sx={{ minWidth: 40, minHeight: 40, color: colors.grey[300] }}
                      >
                        <QrCodeIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(asset)}
                        sx={{ minWidth: 40, minHeight: 40, color: colors.grey[300] }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(asset)}
                        sx={{ minWidth: 40, minHeight: 40, color: colors.grey[300] }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} mt={1}>
                    <Typography variant="caption" sx={{ color: colors.grey[300] }}>
                      {asset.identifier || asset.id}
                      {asset.type ? ` · ${asset.type}` : ""}
                    </Typography>
                    <Chip
                      label={translateAssetStatus(asset.status)}
                      size="small"
                      color={statusColors[asset.status] || "default"}
                      sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                    />
                  </Box>
                  {(asset.assignedTo || asset.location) && (
                    <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: colors.grey[400] }}>
                      {asset.assignedTo && `Dodeljeno: ${asset.assignedTo}`}
                      {asset.assignedTo && asset.location && " · "}
                      {asset.location && `Lokacija: ${asset.location}`}
                    </Typography>
                  )}
                </Box>
              ))
            )}
          </Box>
          {totalCount > 0 && (
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              labelRowsPerPage="Po stranici:"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} od ${count}`}
              sx={{
                color: colors.grey[200],
                borderTop: `1px solid ${colors.grey[700]}`,
                mt: 2,
                "& .MuiTablePagination-selectIcon": { color: colors.grey[300] },
              }}
            />
          )}
          <Fab
            color="primary"
            aria-label="Dodaj imovinu"
            onClick={handleOpen}
            sx={{
              position: "fixed",
              left: "50%",
              transform: "translateX(-50%)",
              bottom: "max(80px, calc(env(safe-area-inset-bottom) + 28px))",
              zIndex: 1100,
              backgroundColor: colors.greenAccent[500],
              "&:hover": { backgroundColor: colors.greenAccent[600] },
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
            }}
          >
            <AddIcon sx={{ fontSize: 28 }} />
          </Fab>
        </>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ backgroundColor: colors.primary[400] }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Identifikator</TableCell>
                  <TableCell>Naziv</TableCell>
                  <TableCell>Tip</TableCell>
                  <TableCell>Model</TableCell>
                  <TableCell>Proizvođač</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Jedinica</TableCell>
                  <TableCell>Količina</TableCell>
                  <TableCell>Lokacija</TableCell>
                  <TableCell>Dodeljeno</TableCell>
                  <TableCell>Dodelio</TableCell>
                  <TableCell>Akcije</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAssets.map((asset) => (
                  <TableRow key={asset.id} hover>
                    <TableCell>
                      <Tooltip title="Prikaži QR kod">
                        <IconButton size="small" onClick={() => setQrDialogAsset(asset)}>
                          <QrCodeIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {asset.identifier || asset.id}
                    </TableCell>
                    <TableCell>
                      <Button
                        color="inherit"
                        onClick={() => openQuickEdit(asset)}
                        sx={{ textTransform: "none", fontWeight: 600 }}
                        title="Klik za promenu statusa i dodeljenosti"
                      >
                        {asset.name}
                      </Button>
                    </TableCell>
                    <TableCell>{asset.type}</TableCell>
                    <TableCell>{asset.model}</TableCell>
                    <TableCell>{asset.manufacturer}</TableCell>
                    <TableCell>
                      <Chip
                        label={translateAssetStatus(asset.status)}
                        color={statusColors[asset.status] || "default"}
                        size="small"
                        onClick={() => openQuickEdit(asset)}
                        sx={{ cursor: "pointer" }}
                        title="Klik za promenu statusa i dodeljenosti"
                      />
                    </TableCell>
                    <TableCell>{asset.unit || "—"}</TableCell>
                    <TableCell>{asset.amount ?? "—"}</TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell>{asset.assignedTo || "—"}</TableCell>
                    <TableCell>{asset.issuedBy || "—"}</TableCell>
                    <TableCell>
                      <Tooltip title="Detalji">
                        <IconButton onClick={() => handleDetail(asset)}>
                          <DescriptionIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Izmeni">
                        <IconButton onClick={() => handleEdit(asset)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Obriši">
                        <IconButton onClick={() => handleDelete(asset)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {totalCount > 0 && (
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              labelRowsPerPage="Redova po stranici:"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} od ${count}`}
              sx={{
                color: colors.grey[200],
                backgroundColor: colors.primary[400],
                borderTop: `1px solid ${colors.grey[700]}`,
                "& .MuiTablePagination-selectIcon": { color: colors.grey[300] },
              }}
            />
          )}
        </>
      )}

      {/* Dijalozi uvek u DOM-u da FAB/dodavanje rade i na mobilnom */}
      <Dialog
            open={!!qrDialogAsset}
            onClose={() => setQrDialogAsset(null)}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { backgroundColor: colors.primary[400], color: colors.grey[100] } }}
          >
            <DialogTitle>QR kod – {qrDialogAsset?.name}</DialogTitle>
            <DialogContent>
              <Box display="flex" flexDirection="column" alignItems="center" gap={2} pt={1}>
                <AssetQRCode value={qrDialogAsset?.barcode ?? qrDialogAsset?.id} size={160} />
                <Typography variant="body2" color={colors.grey[100]}>
                  Barcode:{" "}
                  <strong>
                    {qrDialogAsset?.barcode || qrDialogAsset?.identifier || qrDialogAsset?.id || "—"}
                  </strong>
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setQrDialogAsset(null)}>Zatvori</Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={!!quickEditAsset}
            onClose={closeQuickEdit}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { backgroundColor: colors.primary[400], color: colors.grey[100] } }}
          >
            <DialogTitle>Promena statusa i dodeljenosti – {quickEditAsset?.name}</DialogTitle>
            <DialogContent>
              <Typography
                variant="caption"
                color={colors.grey[400]}
                display="block"
                sx={{ mb: 1 }}
              >
                ID imovine: {quickEditAsset?.id ?? quickEditAsset?.movableAssetId ?? "—"}
              </Typography>
              {quickEditError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setQuickEditError(null)}>
                  {quickEditError}
                </Alert>
              )}
              <Box display="flex" flexDirection="column" gap={2} pt={1}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={quickEditStatus}
                    onChange={(e) => setQuickEditStatus(e.target.value)}
                  >
                    {assetStatuses.map((s) => (
                      <MenuItem key={s} value={s}>
                        {translateAssetStatus(s)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Dodeljeno (korisnik)</InputLabel>
                  <Select
                    label="Dodeljeno (korisnik)"
                    value={quickEditCurrentUserId ?? ""}
                    onChange={(e) => setQuickEditCurrentUserId(e.target.value)}
                  >
                    <MenuItem value="">Niko</MenuItem>
                    {companyUsers.map((u) => (
                      <MenuItem key={u.id} value={String(u.id)}>
                        {u.displayName || `Korisnik #${u.id}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {quickEditAsset?.issuedBy && (
                  <Typography variant="caption" color={colors.grey[300]}>
                    Trenutno izdao: {quickEditAsset.issuedBy}
                  </Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeQuickEdit} disabled={quickEditSaving}>
                Otkaži
              </Button>
              <Button
                variant="contained"
                onClick={handleQuickEditSubmit}
                disabled={quickEditSaving}
              >
                {quickEditSaving ? "Čuvanje…" : "Sačuvaj"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={detailDialog}
            onClose={handleDetailClose}
            maxWidth="md"
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
              sx: {
                backgroundColor: colors.primary[400],
                color: colors.grey[100],
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            <DialogTitle sx={{ fontSize: isMobile ? "1.25rem" : undefined }}>
              Detalji imovine: {detailAsset?.name}
            </DialogTitle>
            <DialogContent>
              <Box display="flex" gap={3} mb={2}>
                <AssetQRCode
                  value={detailAsset?.barcode ?? detailAsset?.identifier ?? detailAsset?.id}
                  size={100}
                />
                <Box>
                  <Typography variant="subtitle2" color={colors.grey[100]}>
                    ID: {detailAsset?.id}
                  </Typography>
                  <Typography variant="subtitle2" color={colors.grey[100]}>
                    Identifikator: {detailAsset?.identifier || "—"}
                  </Typography>
                  <Typography variant="subtitle2" color={colors.grey[100]}>
                    Tip: {detailAsset?.type}
                  </Typography>
                  <Typography variant="subtitle2" color={colors.grey[100]}>
                    Model: {detailAsset?.model}
                  </Typography>
                  <Typography variant="subtitle2" color={colors.grey[100]}>
                    Proizvođač: {detailAsset?.manufacturer}
                  </Typography>
                  <Typography variant="subtitle2" color={colors.grey[100]}>
                    Serijski broj: {detailAsset?.serialNumber}
                  </Typography>
                  <Typography variant="subtitle2" color={colors.grey[100]}>
                    Lokacija: {detailAsset?.location}
                  </Typography>
                  <Typography variant="subtitle2" color={colors.grey[100]}>
                    Dodeljeno: {detailAsset?.assignedTo || "—"}
                  </Typography>
                  <Typography variant="subtitle2" color={colors.grey[100]}>
                    Izdato od: {detailAsset?.issuedBy || "—"}
                  </Typography>
                  <Typography variant="subtitle2" color={colors.grey[100]}>
                    Status:{" "}
                    <Chip
                      label={translateAssetStatus(detailAsset?.status)}
                      color={statusColors[detailAsset?.status] || "default"}
                      size="small"
                    />
                  </Typography>
                  <Typography variant="subtitle2" color={colors.grey[100]}>
                    Jedinica: {detailAsset?.unit || "—"}
                  </Typography>
                  <Typography variant="subtitle2" color={colors.grey[100]}>
                    Količina: {detailAsset?.amount ?? "—"}
                  </Typography>
                  <Typography variant="subtitle2" color={colors.grey[100]}>
                    Datum nabavke: {detailAsset?.purchaseDate || "—"}
                  </Typography>
                  <Typography variant="subtitle2" color={colors.grey[100]}>
                    Osiguranje do: {detailAsset?.warranty || "—"}
                  </Typography>
                  <Typography variant="subtitle2" color={colors.grey[100]}>
                    Kreirano: {detailAsset?.createdAt || "—"}
                  </Typography>
                  <Typography variant="subtitle2" color={colors.grey[100]}>
                    Ažurirano: {detailAsset?.updatedAt || "—"}
                  </Typography>
                </Box>
              </Box>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab icon={<HistoryIcon />} label="Istorija" />
                <Tab icon={<BuildIcon />} label="Održavanje" />
                <Tab icon={<DescriptionIcon />} label="Dokumenti" />
                <Tab label="Napomene" />
              </Tabs>
              {tab === 0 && (
                <Box>
                  <Typography variant="subtitle1" mb={1} color={colors.grey[100]}>
                    Kretanje imovine:
                  </Typography>
                  <Table size="small" sx={{ backgroundColor: colors.primary[300] }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Datum</TableCell>
                        <TableCell>Lokacija</TableCell>
                        <TableCell>Korisnik</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {detailAsset?.movement?.map((m, i) => (
                        <TableRow key={i}>
                          <TableCell>{m.date}</TableCell>
                          <TableCell>{m.location}</TableCell>
                          <TableCell>{m.user}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
              {tab === 1 && (
                <Box>
                  <Typography variant="subtitle1" mb={1} color={colors.grey[100]}>
                    Istorija održavanja:
                  </Typography>
                  <Table size="small" sx={{ backgroundColor: colors.primary[300] }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Datum</TableCell>
                        <TableCell>Tip</TableCell>
                        <TableCell>Trošak (€)</TableCell>
                        <TableCell>Napomena</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {detailAsset?.maintenance?.map((m, i) => (
                        <TableRow key={i}>
                          <TableCell>{m.date}</TableCell>
                          <TableCell>{m.type}</TableCell>
                          <TableCell>{m.cost}</TableCell>
                          <TableCell>{m.note}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
              {tab === 2 && (
                <Box>
                  <Typography variant="subtitle1" mb={1} color={colors.grey[100]}>
                    Dokumenti:
                  </Typography>
                  <ul>
                    {detailAsset?.documents?.map((doc, i) => (
                      <li key={i}>
                        <a href="#" style={{ color: colors.greenAccent[500] }}>
                          {doc}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
              {tab === 3 && (
                <Box>
                  <Typography variant="subtitle1" mb={1} color={colors.grey[100]}>
                    Napomene:
                  </Typography>
                  <Typography variant="body2" color={colors.grey[100]}>
                    {detailAsset?.notes}
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ flexWrap: "wrap", gap: 1 }}>
              {isMobile && (
                <>
                  <Button
                    startIcon={<QrCodeIcon />}
                    onClick={() => {
                      if (detailAsset) setQrDialogAsset(detailAsset);
                      handleDetailClose();
                    }}
                    sx={{ color: colors.grey[200] }}
                  >
                    QR
                  </Button>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => {
                      if (detailAsset) handleEdit(detailAsset);
                      handleDetailClose();
                    }}
                    sx={{ color: colors.grey[200] }}
                  >
                    Izmeni
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      if (detailAsset) handleDelete(detailAsset);
                      handleDetailClose();
                    }}
                    color="error"
                  >
                    Obriši
                  </Button>
                </>
              )}
              <Button onClick={handleDetailClose} variant={isMobile ? "contained" : "text"}>
                Zatvori
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            fullScreen={isMobile}
            PaperProps={{
              sx: {
                backgroundColor: colors.primary[400],
                color: colors.grey[100],
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              },
            }}
          >
            <DialogTitle>{editMode ? "Izmeni imovinu" : "Dodaj novu imovinu"}</DialogTitle>
            <DialogContent>
              {submitError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSubmitError(null)}>
                  {submitError}
                </Alert>
              )}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Identifikator"
                    value={formState.identifier}
                    onChange={(e) => setFormState((s) => ({ ...s, identifier: e.target.value }))}
                    placeholder="Opciono"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Naziv"
                    value={formState.name}
                    onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Barcode"
                    value={formState.barcode}
                    onChange={(e) => setFormState((s) => ({ ...s, barcode: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tip"
                    value={formState.type}
                    onChange={(e) => setFormState((s) => ({ ...s, type: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Model"
                    value={formState.model}
                    onChange={(e) => setFormState((s) => ({ ...s, model: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Proizvođač"
                    value={formState.manufacturer}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, manufacturer: e.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Kategorija</InputLabel>
                    <Select
                      label="Kategorija"
                      value={formState.category}
                      onChange={(e) => setFormState((s) => ({ ...s, category: e.target.value }))}
                    >
                      {ASSET_CATEGORIES.map((cat) => (
                        <MenuItem key={cat || "empty"} value={cat}>
                          {cat || "—"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Serijski broj"
                    value={formState.serialNumber}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, serialNumber: e.target.value }))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Dodeljeno (korisnik)</InputLabel>
                    <Select
                      label="Dodeljeno (korisnik)"
                      value={formState.currentUserId ?? ""}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, currentUserId: e.target.value }))
                      }
                    >
                      <MenuItem value="">Niko</MenuItem>
                      {companyUsers.map((u) => (
                        <MenuItem key={u.id} value={String(u.id)}>
                          {u.displayName || `Korisnik #${u.id}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      value={formState.movableAssetStatus}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, movableAssetStatus: e.target.value }))
                      }
                    >
                      {assetStatuses.map((s) => (
                        <MenuItem key={s} value={s}>
                          {translateAssetStatus(s)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Datum nabavke"
                    type="date"
                    value={formState.purchaseDate}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, purchaseDate: e.target.value }))
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Osiguranje do"
                    type="date"
                    value={formState.insuranceDate}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, insuranceDate: e.target.value }))
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Jedinica"
                    value={formState.unit}
                    onChange={(e) => setFormState((s) => ({ ...s, unit: e.target.value }))}
                    placeholder="npr. kom, kg"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Količina"
                    type="number"
                    inputProps={{ min: 0 }}
                    value={formState.amount}
                    onChange={(e) => setFormState((s) => ({ ...s, amount: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Napomene"
                    multiline
                    minRows={2}
                    value={formState.comment}
                    onChange={(e) => setFormState((s) => ({ ...s, comment: e.target.value }))}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} disabled={saving}>
                Otkaži
              </Button>
              {editMode ? (
                <Button variant="contained" onClick={handleSubmitEdit} disabled={saving}>
                  {saving ? "Čuvanje…" : "Sačuvaj izmene"}
                </Button>
              ) : (
                <Button variant="contained" onClick={handleSubmitAdd} disabled={saving}>
                  {saving ? "Čuvanje…" : "Dodaj"}
                </Button>
              )}
            </DialogActions>
          </Dialog>
    </Box>
  );
};

export default MovingAssets;
