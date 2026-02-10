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
    Alert
} from "@mui/material";
import { tokens } from "../../theme";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, QrCode2 as QrCodeIcon, Search as SearchIcon, Description as DescriptionIcon, History as HistoryIcon, Build as BuildIcon } from "@mui/icons-material";
import { getMovableAssets, createMovableAsset, updateMovableAsset, changeMovableAssetStatus, deleteMovableAsset } from "../../services/assetService";
import { getAllCompanyUsers } from "../../services/companyService";
import { QRCodeSVG } from "qrcode.react";

/** Prikazuje QR kod na osnovu barcode-a (ili id ako barcode nije dostupan). */
const AssetQRCode = ({ value, size = 80, ...boxSx }) => {
    const text = value != null && String(value).trim() !== "" ? String(value) : null;
    return (
        <Box sx={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2, backgroundColor: "#fff", p: 0.5, ...boxSx }}>
            {text ? (
                <QRCodeSVG value={text} size={size - 8} level="M" />
            ) : (
                <Typography variant="caption" color="text.secondary">Nema barcode</Typography>
            )}
        </Box>
    );
};

export const ASSET_STATUS = {
    AVAILABLE: "AVAILABLE",
    UNDER_REPAIR: "UNDER_REPAIR",
    DECOMMISSIONED: "DECOMMISSIONED",
    LOST: "LOST",
    RENTED: "RENTED",
    DISCARDED: "DISCARDED",
    IN_USE: "IN_USE"
};

const assetStatusLabels = {
    [ASSET_STATUS.AVAILABLE]: "Dostupno",
    [ASSET_STATUS.UNDER_REPAIR]: "U popravci",
    [ASSET_STATUS.DECOMMISSIONED]: "Rashodovano",
    [ASSET_STATUS.LOST]: "Izgubljeno",
    [ASSET_STATUS.RENTED]: "Iznajmljeno",
    [ASSET_STATUS.DISCARDED]: "Otpisano",
    [ASSET_STATUS.IN_USE]: "U upotrebi"
};

export const translateAssetStatus = (status) => assetStatusLabels[status] ?? status;

const statusColors = {
    [ASSET_STATUS.AVAILABLE]: "success",
    [ASSET_STATUS.UNDER_REPAIR]: "warning",
    [ASSET_STATUS.DECOMMISSIONED]: "default",
    [ASSET_STATUS.LOST]: "error",
    [ASSET_STATUS.RENTED]: "info",
    [ASSET_STATUS.DISCARDED]: "default",
    [ASSET_STATUS.IN_USE]: "info"
};

const assetStatuses = Object.values(ASSET_STATUS);

/** Kategorije opreme – lako se dopunjavaju ili menjaju. */
const ASSET_CATEGORIES = [
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
    "Ostalo"
];

const initialFormState = {
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
    amount: ""
};

const MovingAssets = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [open, setOpen] = useState(false);
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
        return () => { cancelled = true; };
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
        return () => { cancelled = true; };
    }, []);

    // Filter i pretraga
    const filteredAssets = assets.filter(a => {
        const searchLower = search.trim().toLowerCase();
        if (!searchLower) return !statusFilter || a.status === statusFilter;
        const text = (val) => (val != null && val !== "" ? String(val).toLowerCase() : "");
        const statusLabel = translateAssetStatus(a.status).toLowerCase();
        const matchSearch =
            text(a.identifier).includes(searchLower) ||
            text(a.id).includes(searchLower) ||
            text(a.name).includes(searchLower) ||
            text(a.type).includes(searchLower) ||
            text(a.model).includes(searchLower) ||
            text(a.manufacturer).includes(searchLower) ||
            text(a.serialNumber).includes(searchLower) ||
            text(a.barcode).includes(searchLower) ||
            text(a.status).includes(searchLower) ||
            statusLabel.includes(searchLower) ||
            text(a.unit).includes(searchLower) ||
            text(a.amount).includes(searchLower) ||
            text(a.location).includes(searchLower) ||
            text(a.assignedTo).includes(searchLower) ||
            text(a.issuedBy).includes(searchLower);
        return (!statusFilter || a.status === statusFilter) && matchSearch;
    });

    // Akcije
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
            const currentUserId = formState.currentUserId === "" || formState.currentUserId == null ? null : Number(formState.currentUserId);
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
                amount: formState.amount
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
        const currentUserId = formState.currentUserId === "" || formState.currentUserId == null ? null : Number(formState.currentUserId);
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
                amount: formState.amount === "" ? 0 : Number(formState.amount)
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
            amount: asset.amount !== undefined && asset.amount !== null ? String(asset.amount) : ""
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
        if (!window.confirm(`Da li ste sigurni da želite da obrišete „${asset.name || "imovinu"}”?`)) return;
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
            setQuickEditError(`ID imovine nije dostupan (vrednost: ${JSON.stringify(quickEditAsset.id)}). Osvežite listu ili proverite odgovor API-ja.`);
            return;
        }
        setQuickEditSaving(true);
        setQuickEditError(null);
        try {
            const currentUserId = quickEditCurrentUserId === "" || quickEditCurrentUserId == null ? null : Number(quickEditCurrentUserId);
            if (currentUserId !== null && Number.isNaN(currentUserId)) {
                setQuickEditError("Izaberite korisnika ili ostavite prazno.");
                setQuickEditSaving(false);
                return;
            }
            await changeMovableAssetStatus(assetId, {
                status: quickEditStatus,
                currentUserId
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
        <Box>
            {/* Header sa akcijama i filterima */}
            <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" mb={2} gap={2}>
                <Typography variant="h5" color={colors.grey[100]}>
                    Pokretna imovina
                </Typography>
                <Box display="flex" gap={2} alignItems="center">
                    <TextField
                        size="small"
                        placeholder="Pretraga"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                        sx={{ minWidth: 220, background: colors.primary[400], borderRadius: 1 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            label="Status"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="">Svi statusi</MenuItem>
                            {assetStatuses.map(s => (
                                <MenuItem key={s} value={s}>{translateAssetStatus(s)}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpen}
                        sx={{
                            backgroundColor: colors.greenAccent[500],
                            "&:hover": { backgroundColor: colors.greenAccent[600] }
                        }}
                    >
                        Dodaj imovinu
                    </Button>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                    <CircularProgress sx={{ color: colors.greenAccent[500] }} />
                </Box>
            ) : (
            <>
            {/* Tabela imovine */}
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
                        {filteredAssets.map((asset) => (
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
                                    <Button color="inherit" onClick={() => openQuickEdit(asset)} sx={{ textTransform: 'none', fontWeight: 600 }} title="Klik za promenu statusa i dodeljenosti">
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
                                        <IconButton onClick={() => handleDetail(asset)}><DescriptionIcon /></IconButton>
                                    </Tooltip>
                                    <Tooltip title="Izmeni">
                                        <IconButton onClick={() => handleEdit(asset)}><EditIcon /></IconButton>
                                    </Tooltip>
                                    <Tooltip title="Obriši">
                                        <IconButton onClick={() => handleDelete(asset)}><DeleteIcon /></IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dijalog za QR kod (barcode) */}
            <Dialog open={!!qrDialogAsset} onClose={() => setQrDialogAsset(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { backgroundColor: colors.primary[400], color: colors.grey[100] } }}>
                <DialogTitle>QR kod – {qrDialogAsset?.name}</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2} pt={1}>
                        <AssetQRCode value={qrDialogAsset?.barcode ?? qrDialogAsset?.id} size={160} />
                        <Typography variant="body2" color={colors.grey[100]}>
                            Barcode: <strong>{qrDialogAsset?.barcode || qrDialogAsset?.identifier || qrDialogAsset?.id || "—"}</strong>
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setQrDialogAsset(null)}>Zatvori</Button>
                </DialogActions>
            </Dialog>

            {/* Brza promena statusa i dodeljenosti */}
            <Dialog open={!!quickEditAsset} onClose={closeQuickEdit} maxWidth="xs" fullWidth PaperProps={{ sx: { backgroundColor: colors.primary[400], color: colors.grey[100] } }}>
                <DialogTitle>Promena statusa i dodeljenosti – {quickEditAsset?.name}</DialogTitle>
                <DialogContent>
                    <Typography variant="caption" color={colors.grey[400]} display="block" sx={{ mb: 1 }}>
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
                                onChange={e => setQuickEditStatus(e.target.value)}
                            >
                                {assetStatuses.map(s => (
                                    <MenuItem key={s} value={s}>{translateAssetStatus(s)}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Dodeljeno (korisnik)</InputLabel>
                            <Select
                                label="Dodeljeno (korisnik)"
                                value={quickEditCurrentUserId ?? ""}
                                onChange={e => setQuickEditCurrentUserId(e.target.value)}
                            >
                                <MenuItem value="">Niko</MenuItem>
                                {companyUsers.map((u) => (
                                    <MenuItem key={u.id} value={String(u.id)}>{u.displayName || `Korisnik #${u.id}`}</MenuItem>
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
                    <Button onClick={closeQuickEdit} disabled={quickEditSaving}>Otkaži</Button>
                    <Button variant="contained" onClick={handleQuickEditSubmit} disabled={quickEditSaving}>
                        {quickEditSaving ? "Čuvanje…" : "Sačuvaj"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Detaljan prikaz imovine */}
            <Dialog open={detailDialog} onClose={handleDetailClose} maxWidth="md" fullWidth PaperProps={{ sx: { backgroundColor: colors.primary[400], color: colors.grey[100], boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' } }}>
                <DialogTitle>Detalji imovine: {detailAsset?.name}</DialogTitle>
                <DialogContent>
                    <Box display="flex" gap={3} mb={2}>
                        <AssetQRCode value={detailAsset?.barcode ?? detailAsset?.identifier ?? detailAsset?.id} size={100} />
                        <Box>
                            <Typography variant="subtitle2" color={colors.grey[100]}>ID: {detailAsset?.id}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Identifikator: {detailAsset?.identifier || "—"}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Tip: {detailAsset?.type}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Model: {detailAsset?.model}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Proizvođač: {detailAsset?.manufacturer}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Serijski broj: {detailAsset?.serialNumber}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Lokacija: {detailAsset?.location}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Dodeljeno: {detailAsset?.assignedTo || "—"}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Izdato od: {detailAsset?.issuedBy || "—"}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Status: <Chip label={translateAssetStatus(detailAsset?.status)} color={statusColors[detailAsset?.status] || "default"} size="small" /></Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Jedinica: {detailAsset?.unit || "—"}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Količina: {detailAsset?.amount ?? "—"}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Datum nabavke: {detailAsset?.purchaseDate || "—"}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Osiguranje do: {detailAsset?.warranty || "—"}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Kreirano: {detailAsset?.createdAt || "—"}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Ažurirano: {detailAsset?.updatedAt || "—"}</Typography>
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
                            <Typography variant="subtitle1" mb={1} color={colors.grey[100]}>Kretanje imovine:</Typography>
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
                            <Typography variant="subtitle1" mb={1} color={colors.grey[100]}>Istorija održavanja:</Typography>
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
                            <Typography variant="subtitle1" mb={1} color={colors.grey[100]}>Dokumenti:</Typography>
                            <ul>
                                {detailAsset?.documents?.map((doc, i) => (
                                    <li key={i}><a href="#" style={{ color: colors.greenAccent[500] }}>{doc}</a></li>
                                ))}
                            </ul>
                        </Box>
                    )}
                    {tab === 3 && (
                        <Box>
                            <Typography variant="subtitle1" mb={1} color={colors.grey[100]}>Napomene:</Typography>
                            <Typography variant="body2" color={colors.grey[100]}>{detailAsset?.notes}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDetailClose}>Zatvori</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog za dodavanje/izmenu */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { backgroundColor: colors.primary[400], color: colors.grey[100], boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' } }}>
                <DialogTitle>
                    {editMode ? "Izmeni imovinu" : "Dodaj novu imovinu"}
                </DialogTitle>
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
                                onChange={e => setFormState(s => ({ ...s, identifier: e.target.value }))}
                                placeholder="Opciono"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Naziv"
                                value={formState.name}
                                onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Barcode"
                                value={formState.barcode}
                                onChange={e => setFormState(s => ({ ...s, barcode: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tip"
                                value={formState.type}
                                onChange={e => setFormState(s => ({ ...s, type: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Model"
                                value={formState.model}
                                onChange={e => setFormState(s => ({ ...s, model: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Proizvođač"
                                value={formState.manufacturer}
                                onChange={e => setFormState(s => ({ ...s, manufacturer: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Kategorija</InputLabel>
                                <Select
                                    label="Kategorija"
                                    value={formState.category}
                                    onChange={e => setFormState(s => ({ ...s, category: e.target.value }))}
                                >
                                    {ASSET_CATEGORIES.map(cat => (
                                        <MenuItem key={cat || "empty"} value={cat}>{cat || "—"}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Serijski broj"
                                value={formState.serialNumber}
                                onChange={e => setFormState(s => ({ ...s, serialNumber: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Dodeljeno (korisnik)</InputLabel>
                                <Select
                                    label="Dodeljeno (korisnik)"
                                    value={formState.currentUserId ?? ""}
                                    onChange={e => setFormState(s => ({ ...s, currentUserId: e.target.value }))}
                                >
                                    <MenuItem value="">Niko</MenuItem>
                                    {companyUsers.map((u) => (
                                        <MenuItem key={u.id} value={String(u.id)}>{u.displayName || `Korisnik #${u.id}`}</MenuItem>
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
                                    onChange={e => setFormState(s => ({ ...s, movableAssetStatus: e.target.value }))}
                                >
                                    {assetStatuses.map(s => (
                                        <MenuItem key={s} value={s}>{translateAssetStatus(s)}</MenuItem>
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
                                onChange={e => setFormState(s => ({ ...s, purchaseDate: e.target.value }))}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Osiguranje do"
                                type="date"
                                value={formState.insuranceDate}
                                onChange={e => setFormState(s => ({ ...s, insuranceDate: e.target.value }))}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Jedinica"
                                value={formState.unit}
                                onChange={e => setFormState(s => ({ ...s, unit: e.target.value }))}
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
                                onChange={e => setFormState(s => ({ ...s, amount: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Napomene"
                                multiline
                                minRows={2}
                                value={formState.comment}
                                onChange={e => setFormState(s => ({ ...s, comment: e.target.value }))}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={saving}>Otkaži</Button>
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
            </>
            )}
        </Box>
    );
};

export default MovingAssets; 