import { useState } from "react";
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
    InputAdornment
} from "@mui/material";
import { tokens } from "../../theme";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, QrCode2 as QrCodeIcon, Search as SearchIcon, Description as DescriptionIcon, History as HistoryIcon, Build as BuildIcon } from "@mui/icons-material";

// Dummy QR code generator (zamena za pravu biblioteku)
const QRCode = ({ value }) => (
    <Box sx={{ width: 80, height: 80, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, fontSize: 12 }}>
        QR: {value}
    </Box>
);

const statusColors = {
    "Aktivan": "success",
    "U popravci": "warning",
    "Rashodovan": "default",
    "Izgubljen": "error",
    "Iznajmljen": "info",
    "Rezervisan": "secondary"
};

const initialAssets = [
    {
        id: "A-0001",
        name: "Laptop Dell XPS 13",
        type: "Laptop",
        model: "XPS 13 9310",
        manufacturer: "Dell",
        year: 2022,
        category: "IT Oprema",
        serialNumber: "SN123456",
        location: "Kancelarija 101",
        assignedTo: "Marko Marković",
        status: "Aktivan",
        purchaseDate: "2022-03-10",
        warranty: "2025-03-10",
        value: 1800,
        depreciation: 600,
        documents: ["garancija.pdf", "faktura.pdf"],
        maintenance: [
            { date: "2023-05-01", type: "Servis", cost: 50, note: "Zamena tastature" }
        ],
        movement: [
            { date: "2022-03-10", location: "Magacin", user: "Admin" },
            { date: "2022-03-15", location: "Kancelarija 101", user: "Marko Marković" }
        ],
        notes: "Laptop koristi za rad na terenu."
    },
    // Dodajte još primera po potrebi
];

const assetStatuses = ["Aktivan", "U popravci", "Rashodovan", "Izgubljen", "Iznajmljen", "Rezervisan"];

const MovingAssets = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [assets, setAssets] = useState(initialAssets);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [tab, setTab] = useState(0);
    const [detailDialog, setDetailDialog] = useState(false);
    const [detailAsset, setDetailAsset] = useState(null);

    // Filter i pretraga
    const filteredAssets = assets.filter(a =>
        (!statusFilter || a.status === statusFilter) &&
        (a.name.toLowerCase().includes(search.toLowerCase()) ||
         a.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
         a.id.toLowerCase().includes(search.toLowerCase()))
    );

    // Akcije
    const handleOpen = () => {
        setOpen(true);
        setEditMode(false);
        setSelectedAsset(null);
    };
    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
        setSelectedAsset(null);
    };
    const handleEdit = (asset) => {
        setSelectedAsset(asset);
        setEditMode(true);
        setOpen(true);
    };
    const handleDelete = (id) => {
        setAssets(assets.filter(asset => asset.id !== id));
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
                        placeholder="Pretraga po nazivu, ID, serijskom broju..."
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
                            {assetStatuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
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

            {/* Tabela imovine */}
            <TableContainer component={Paper} sx={{ backgroundColor: colors.primary[400] }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Naziv</TableCell>
                            <TableCell>Tip</TableCell>
                            <TableCell>Model</TableCell>
                            <TableCell>Proizvođač</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Lokacija</TableCell>
                            <TableCell>Dodeljeno</TableCell>
                            <TableCell>Vrednost (€)</TableCell>
                            <TableCell>Amortizacija (€)</TableCell>
                            <TableCell>Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAssets.map((asset) => (
                            <TableRow key={asset.id} hover>
                                <TableCell>
                                    <Tooltip title="Prikaži QR kod">
                                        <IconButton size="small" onClick={() => alert('QR za: ' + asset.id)}>
                                            <QrCodeIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    {asset.id}
                                </TableCell>
                                <TableCell>
                                    <Button color="inherit" onClick={() => handleDetail(asset)} sx={{ textTransform: 'none', fontWeight: 600 }}>
                                        {asset.name}
                                    </Button>
                                </TableCell>
                                <TableCell>{asset.type}</TableCell>
                                <TableCell>{asset.model}</TableCell>
                                <TableCell>{asset.manufacturer}</TableCell>
                                <TableCell>
                                    <Chip label={asset.status} color={statusColors[asset.status] || "default"} size="small" />
                                </TableCell>
                                <TableCell>{asset.location}</TableCell>
                                <TableCell>{asset.assignedTo}</TableCell>
                                <TableCell>{asset.value}</TableCell>
                                <TableCell>{asset.depreciation}</TableCell>
                                <TableCell>
                                    <Tooltip title="Detalji">
                                        <IconButton onClick={() => handleDetail(asset)}><DescriptionIcon /></IconButton>
                                    </Tooltip>
                                    <Tooltip title="Izmeni">
                                        <IconButton onClick={() => handleEdit(asset)}><EditIcon /></IconButton>
                                    </Tooltip>
                                    <Tooltip title="Obriši">
                                        <IconButton onClick={() => handleDelete(asset.id)}><DeleteIcon /></IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Detaljan prikaz imovine */}
            <Dialog open={detailDialog} onClose={handleDetailClose} maxWidth="md" fullWidth PaperProps={{ sx: { backgroundColor: colors.primary[400], color: colors.grey[100], boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' } }}>
                <DialogTitle>Detalji imovine: {detailAsset?.name}</DialogTitle>
                <DialogContent>
                    <Box display="flex" gap={3} mb={2}>
                        <QRCode value={detailAsset?.id} sx={{ backgroundColor: colors.primary[500], color: colors.grey[100] }} />
                        <Box>
                            <Typography variant="subtitle2" color={colors.grey[100]}>ID: {detailAsset?.id}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Tip: {detailAsset?.type}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Model: {detailAsset?.model}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Proizvođač: {detailAsset?.manufacturer}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Serijski broj: {detailAsset?.serialNumber}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Lokacija: {detailAsset?.location}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Dodeljeno: {detailAsset?.assignedTo}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Status: <Chip label={detailAsset?.status} color={statusColors[detailAsset?.status] || "default"} size="small" /></Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Vrednost: €{detailAsset?.value}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Amortizacija: €{detailAsset?.depreciation}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Datum nabavke: {detailAsset?.purchaseDate}</Typography>
                            <Typography variant="subtitle2" color={colors.grey[100]}>Garancija do: {detailAsset?.warranty}</Typography>
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

            {/* Dialog za dodavanje/izmenu (osnovni podaci, može se proširiti po potrebi) */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth PaperProps={{ sx: { backgroundColor: colors.primary[400], color: colors.grey[100], boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' } }}>
                <DialogTitle>
                    {editMode ? "Izmeni imovinu" : "Dodaj novu imovinu"}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Naziv" defaultValue={selectedAsset?.name} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="ID (barcode/QR)" defaultValue={selectedAsset?.id} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Tip" defaultValue={selectedAsset?.type} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Model" defaultValue={selectedAsset?.model} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Proizvođač" defaultValue={selectedAsset?.manufacturer} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Kategorija</InputLabel>
                                <Select label="Kategorija" defaultValue={selectedAsset?.category}>
                                    <MenuItem value="IT Oprema">IT Oprema</MenuItem>
                                    <MenuItem value="Oprema za kancelariju">Oprema za kancelariju</MenuItem>
                                    <MenuItem value="Alati">Alati</MenuItem>
                                    <MenuItem value="Vozila">Vozila</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Serijski broj" defaultValue={selectedAsset?.serialNumber} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Lokacija" defaultValue={selectedAsset?.location} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Dodeljeno" defaultValue={selectedAsset?.assignedTo} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select label="Status" defaultValue={selectedAsset?.status}>
                                    {assetStatuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Vrednost (€)" type="number" defaultValue={selectedAsset?.value} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Amortizacija (€)" type="number" defaultValue={selectedAsset?.depreciation} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Datum nabavke" type="date" defaultValue={selectedAsset?.purchaseDate} InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Garancija do" type="date" defaultValue={selectedAsset?.warranty} InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Napomene" defaultValue={selectedAsset?.notes} multiline minRows={2} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Otkaži</Button>
                    <Button variant="contained" onClick={handleClose}>
                        {editMode ? "Sačuvaj izmene" : "Dodaj"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MovingAssets; 