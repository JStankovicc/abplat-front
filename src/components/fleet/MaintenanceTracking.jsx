import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    IconButton,
    Button,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    useTheme,
    Tooltip,
    Divider,
    LinearProgress,
    Alert,
    AlertTitle,
    Stack
} from "@mui/material";
import {
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Print as PrintIcon,
    Download as DownloadIcon,
    Share as ShareIcon
} from "@mui/icons-material";
import { tokens } from "../../theme";

const MaintenanceTracking = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("date");

    // TODO: Zameniti sa pravim podacima iz API-ja
    const maintenanceEntries = [
        {
            id: 1,
            vehicle: "Mercedes Actros (BG-123-456)",
            date: "2024-03-15",
            type: "regular",
            status: "completed",
            description: "Redovni servis",
            mileage: 45000,
            cost: 850,
            nextService: "2024-09-15",
            serviceProvider: "Auto Servis Beograd",
            notes: "Zamenjeni filteri i ulje",
            alerts: [
                { type: "info", message: "Sledeći servis za 180 dana" }
            ]
        },
        {
            id: 2,
            vehicle: "Volvo FH16 (BG-789-012)",
            date: "2024-03-20",
            type: "emergency",
            status: "inProgress",
            description: "Zamena kočnica",
            mileage: 15000,
            cost: 1200,
            nextService: "2024-09-20",
            serviceProvider: "Auto Servis Novi Sad",
            notes: "Hitna intervencija",
            alerts: [
                { type: "warning", message: "Servis u toku" }
            ]
        }
    ];

    const getStatusChip = (status) => {
        const statusConfig = {
            scheduled: { color: "info", label: "Zakazano" },
            inProgress: { color: "warning", label: "U toku" },
            completed: { color: "success", label: "Završeno" },
            overdue: { color: "error", label: "Prekoračeno" }
        };

        const config = statusConfig[status];
        return (
            <Chip
                label={config.label}
                color={config.color}
                size="small"
                sx={{ minWidth: "100px" }}
            />
        );
    };

    const handleAddEdit = (entry = null) => {
        setSelectedEntry(entry);
        setOpenDialog(true);
    };

    const getDaysUntilService = (date) => {
        const serviceDate = new Date(date);
        const today = new Date();
        const diffTime = serviceDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <Box>
            {/* Gornji toolbar */}
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
                    <TextField
                        size="small"
                        placeholder="Pretraži servise..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: "300px" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            label="Status"
                        >
                            <MenuItem value="all">Svi</MenuItem>
                            <MenuItem value="scheduled">Zakazani</MenuItem>
                            <MenuItem value="inProgress">U toku</MenuItem>
                            <MenuItem value="completed">Završeni</MenuItem>
                            <MenuItem value="overdue">Prekoračeni</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Sortiraj po</InputLabel>
                        <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            label="Sortiraj po"
                        >
                            <MenuItem value="date">Datumu</MenuItem>
                            <MenuItem value="cost">Troškovima</MenuItem>
                            <MenuItem value="nextService">Sledećem servisu</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Štampaj listu">
                        <IconButton>
                            <PrintIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Preuzmi izveštaj">
                        <IconButton>
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Podeli">
                        <IconButton>
                            <ShareIcon />
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleAddEdit()}
                        sx={{
                            backgroundColor: colors.greenAccent[500],
                            "&:hover": {
                                backgroundColor: colors.greenAccent[600],
                            },
                        }}
                    >
                        Dodaj servis
                    </Button>
                </Box>
            </Box>

            {/* Statistika */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Zakazani servisi
                            </Typography>
                            <Typography variant="h5">
                                5
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Narednih 30 dana
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                U toku
                            </Typography>
                            <Typography variant="h5">
                                2
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Trenutno u servisu
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Ukupni troškovi
                            </Typography>
                            <Typography variant="h5">
                                12,500 €
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Ove godine
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Prekoračeni servisi
                            </Typography>
                            <Typography variant="h5" color="error">
                                1
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Zahteva hitnu pažnju
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabela servisa */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Datum</TableCell>
                            <TableCell>Vozilo</TableCell>
                            <TableCell>Tip</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Opis</TableCell>
                            <TableCell>Kilometraža</TableCell>
                            <TableCell>Trošak</TableCell>
                            <TableCell>Sledeći servis</TableCell>
                            <TableCell>Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {maintenanceEntries.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                                <TableCell>{entry.vehicle}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={entry.type === "regular" ? "Redovni" : "Vanredni"}
                                        color={entry.type === "regular" ? "primary" : "secondary"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box>
                                        {getStatusChip(entry.status)}
                                        {entry.alerts.length > 0 && (
                                            <Alert 
                                                severity={entry.alerts[0].type}
                                                sx={{ py: 0.5, mt: 0.5 }}
                                            >
                                                <AlertTitle sx={{ fontSize: "0.75rem" }}>
                                                    {entry.alerts[0].message}
                                                </AlertTitle>
                                            </Alert>
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell>{entry.description}</TableCell>
                                <TableCell>{entry.mileage.toLocaleString()} km</TableCell>
                                <TableCell>{entry.cost.toFixed(2)} €</TableCell>
                                <TableCell>
                                    <Box>
                                        <Typography variant="body2">
                                            {new Date(entry.nextService).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Za {getDaysUntilService(entry.nextService)} dana
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => handleAddEdit(entry)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton size="small" color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog za dodavanje/izmenu servisa */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedEntry ? "Izmeni servis" : "Dodaj novi servis"}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Vozilo</InputLabel>
                                <Select
                                    defaultValue={selectedEntry?.vehicle || ""}
                                    label="Vozilo"
                                >
                                    <MenuItem value="Mercedes Actros (BG-123-456)">Mercedes Actros (BG-123-456)</MenuItem>
                                    <MenuItem value="Volvo FH16 (BG-789-012)">Volvo FH16 (BG-789-012)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Datum"
                                type="date"
                                defaultValue={selectedEntry?.date}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Tip servisa</InputLabel>
                                <Select
                                    defaultValue={selectedEntry?.type || "regular"}
                                    label="Tip servisa"
                                >
                                    <MenuItem value="regular">Redovni</MenuItem>
                                    <MenuItem value="emergency">Vanredni</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    defaultValue={selectedEntry?.status || "scheduled"}
                                    label="Status"
                                >
                                    <MenuItem value="scheduled">Zakazano</MenuItem>
                                    <MenuItem value="inProgress">U toku</MenuItem>
                                    <MenuItem value="completed">Završeno</MenuItem>
                                    <MenuItem value="overdue">Prekoračeno</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Opis"
                                defaultValue={selectedEntry?.description}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Kilometraža"
                                type="number"
                                defaultValue={selectedEntry?.mileage}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Trošak"
                                type="number"
                                defaultValue={selectedEntry?.cost}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Sledeći servis"
                                type="date"
                                defaultValue={selectedEntry?.nextService}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Servis"
                                defaultValue={selectedEntry?.serviceProvider}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Napomene"
                                multiline
                                rows={2}
                                defaultValue={selectedEntry?.notes}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Otkaži</Button>
                    <Button variant="contained" color="primary">
                        {selectedEntry ? "Sačuvaj izmene" : "Dodaj servis"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default MaintenanceTracking; 