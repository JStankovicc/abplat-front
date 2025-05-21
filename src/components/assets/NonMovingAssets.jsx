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
    "U rekonstrukciji": "warning",
    "Na prodaju": "info",
    "Rashodovan": "default",
    "Izgubljen": "error",
    "Rezervisan": "secondary"
};

const initialAssets = [
    {
        id: "NM-0001",
        name: "Zgrada A",
        type: "Poslovni prostor",
        category: "Nekretnina",
        address: "Bulevar Oslobođenja 123",
        area: "500m²",
        owner: "Kompanija d.o.o.",
        status: "Aktivan",
        purchaseDate: "2020-01-15",
        lastInspection: "2023-12-01",
        insurance: "2024-12-31",
        value: 500000,
        depreciation: 100000,
        documents: ["katastar.pdf", "osiguranje.pdf"],
        maintenance: [
            { date: "2023-10-01", type: "Inspekcija", cost: 200, note: "Redovna godišnja inspekcija" }
        ],
        movement: [
            { date: "2020-01-15", location: "Nabavka", user: "Admin" },
            { date: "2020-02-01", location: "Registracija", user: "Admin" }
        ],
        notes: "Poslovni prostor u centru grada."
    },
    // Dodajte još primera po potrebi
];

const assetStatuses = ["Aktivan", "U rekonstrukciji", "Na prodaju", "Rashodovan", "Izgubljen", "Rezervisan"];

const NonMovingAssets = () => {
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
         a.id.toLowerCase().includes(search.toLowerCase()) ||
         a.address.toLowerCase().includes(search.toLowerCase()))
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
                    Nepokretna imovina
                </Typography>
                <Box display="flex" gap={2} alignItems="center">
                    <TextField
                        size="small"
                        placeholder="Pretraga po nazivu, ID, adresi..."
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
                            <TableCell>Kategorija</TableCell>
                            <TableCell>Adresa</TableCell>
                            <TableCell>Površina</TableCell>
                            <TableCell>Vlasnik</TableCell>
                            <TableCell>Status</TableCell>
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
                                <TableCell>{asset.category}</TableCell>
                                <TableCell>{asset.address}</TableCell>
                                <TableCell>{asset.area}</TableCell>
                                <TableCell>{asset.owner}</TableCell>
                                <TableCell>
                                    <Chip label={asset.status} color={statusColors[asset.status] || "default"} size="small" />
                                </TableCell>
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
            <Dialog open={detailDialog} onClose={handleDetailClose} maxWidth="md" fullWidth>
                <DialogTitle>Detalji imovine: {detailAsset?.name}</DialogTitle>
                <DialogContent>
                    <Box display="flex" gap={3} mb={2}>
                        <QRCode value={detailAsset?.id} />
                        <Box>
                            <Typography variant="subtitle2">ID: {detailAsset?.id}</Typography>
                            <Typography variant="subtitle2">Tip: {detailAsset?.type}</Typography>
                            <Typography variant="subtitle2">Kategorija: {detailAsset?.category}</Typography>
                            <Typography variant="subtitle2">Adresa: {detailAsset?.address}</Typography>
                            <Typography variant="subtitle2">Površina: {detailAsset?.area}</Typography>
                            <Typography variant="subtitle2">Vlasnik: {detailAsset?.owner}</Typography>
                            <Typography variant="subtitle2">Status: <Chip label={detailAsset?.status} color={statusColors[detailAsset?.status] || "default"} size="small" /></Typography>
                            <Typography variant="subtitle2">Vrednost: €{detailAsset?.value}</Typography>
                            <Typography variant="subtitle2">Amortizacija: €{detailAsset?.depreciation}</Typography>
                            <Typography variant="subtitle2">Datum nabavke: {detailAsset?.purchaseDate}</Typography>
                            <Typography variant="subtitle2">Poslednja inspekcija: {detailAsset?.lastInspection}</Typography>
                            <Typography variant="subtitle2">Osiguranje do: {detailAsset?.insurance}</Typography>
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
                            <Typography variant="subtitle1" mb={1}>Kretanje imovine:</Typography>
                            <Table size="small">
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
                            <Typography variant="subtitle1" mb={1}>Istorija održavanja:</Typography>
                            <Table size="small">
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
                            <Typography variant="subtitle1" mb={1}>Dokumenti:</Typography>
                            <ul>
                                {detailAsset?.documents?.map((doc, i) => (
                                    <li key={i}><a href="#" style={{ color: colors.greenAccent[500] }}>{doc}</a></li>
                                ))}
                            </ul>
                        </Box>
                    )}
                    {tab === 3 && (
                        <Box>
                            <Typography variant="subtitle1" mb={1}>Napomene:</Typography>
                            <Typography variant="body2">{detailAsset?.notes}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDetailClose}>Zatvori</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog za dodavanje/izmenu (osnovni podaci, može se proširiti po potrebi) */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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
                            <FormControl fullWidth>
                                <InputLabel>Kategorija</InputLabel>
                                <Select label="Kategorija" defaultValue={selectedAsset?.category}>
                                    <MenuItem value="Nekretnina">Nekretnina</MenuItem>
                                    <MenuItem value="Zemljište">Zemljište</MenuItem>
                                    <MenuItem value="Infrastruktura">Infrastruktura</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Adresa" defaultValue={selectedAsset?.address} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Površina" defaultValue={selectedAsset?.area} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Vlasnik" defaultValue={selectedAsset?.owner} />
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
                            <TextField fullWidth label="Poslednja inspekcija" type="date" defaultValue={selectedAsset?.lastInspection} InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Osiguranje do" type="date" defaultValue={selectedAsset?.insurance} InputLabelProps={{ shrink: true }} />
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

export default NonMovingAssets; 