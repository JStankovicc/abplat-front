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

const VehicleTracking = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [filterVehicle, setFilterVehicle] = useState("all");
    const [sortBy, setSortBy] = useState("date");

    // TODO: Zameniti sa pravim podacima iz API-ja
    const trackingEntries = [
        {
            id: 1,
            vehicle: "Mercedes Actros (BG-123-456)",
            driver: "Petar Petrović",
            date: "2024-03-15",
            startTime: "08:00",
            endTime: "16:00",
            startLocation: "Beograd, Bulevar oslobođenja 123",
            endLocation: "Novi Sad, Bulevar oslobođenja 45",
            distance: 120,
            averageSpeed: 65,
            fuelConsumption: 35,
            route: "Beograd - Novi Sad",
            notes: "Redovna ruta",
            alerts: [
                { type: "info", message: "Prekoračena prosečna brzina" }
            ]
        },
        {
            id: 2,
            vehicle: "Volvo FH16 (BG-789-012)",
            driver: "Marko Marković",
            date: "2024-03-15",
            startTime: "09:00",
            endTime: "17:00",
            startLocation: "Novi Sad, Bulevar oslobođenja 45",
            endLocation: "Subotica, Bulevar oslobođenja 67",
            distance: 100,
            averageSpeed: 70,
            fuelConsumption: 30,
            route: "Novi Sad - Subotica",
            notes: "Dostava robe",
            alerts: [
                { type: "warning", message: "Visoka potrošnja goriva" }
            ]
        }
    ];

    const getStatusChip = (status) => {
        const statusConfig = {
            active: { color: "success", label: "Aktivno" },
            parked: { color: "info", label: "Parkirano" },
            stopped: { color: "warning", label: "Zaustavljeno" },
            offline: { color: "error", label: "Offline" }
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

    return (
        <Box>
            {/* Gornji toolbar */}
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
                    <TextField
                        size="small"
                        placeholder="Pretraži vožnje..."
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
                        <InputLabel>Vozilo</InputLabel>
                        <Select
                            value={filterVehicle}
                            onChange={(e) => setFilterVehicle(e.target.value)}
                            label="Vozilo"
                        >
                            <MenuItem value="all">Sva vozila</MenuItem>
                            <MenuItem value="Mercedes Actros">Mercedes Actros</MenuItem>
                            <MenuItem value="Volvo FH16">Volvo FH16</MenuItem>
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
                            <MenuItem value="distance">Udaljenosti</MenuItem>
                            <MenuItem value="speed">Brzini</MenuItem>
                            <MenuItem value="fuel">Potrošnji goriva</MenuItem>
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
                        Dodaj vožnju
                    </Button>
                </Box>
            </Box>

            {/* Statistika */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Ukupna kilometraža
                            </Typography>
                            <Typography variant="h5">
                                1,200 km
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Danas
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Prosečna brzina
                            </Typography>
                            <Typography variant="h5">
                                65 km/h
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Danas
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Potrošnja goriva
                            </Typography>
                            <Typography variant="h5">
                                420 L
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Danas
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Broj vožnji
                            </Typography>
                            <Typography variant="h5">
                                8
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Danas
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabela vožnji */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Datum</TableCell>
                            <TableCell>Vozilo</TableCell>
                            <TableCell>Vozač</TableCell>
                            <TableCell>Ruta</TableCell>
                            <TableCell>Udaljenost</TableCell>
                            <TableCell>Prosečna brzina</TableCell>
                            <TableCell>Potrošnja</TableCell>
                            <TableCell>Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trackingEntries.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell>
                                    <Box>
                                        <Typography variant="body2">
                                            {new Date(entry.date).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {entry.startTime} - {entry.endTime}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{entry.vehicle}</TableCell>
                                <TableCell>{entry.driver}</TableCell>
                                <TableCell>
                                    <Box>
                                        <Typography variant="body2">
                                            {entry.route}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {entry.startLocation} → {entry.endLocation}
                                        </Typography>
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
                                <TableCell>{entry.distance} km</TableCell>
                                <TableCell>{entry.averageSpeed} km/h</TableCell>
                                <TableCell>{entry.fuelConsumption} L</TableCell>
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

            {/* Dialog za dodavanje/izmenu vožnje */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedEntry ? "Izmeni vožnju" : "Dodaj novu vožnju"}
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
                            <FormControl fullWidth>
                                <InputLabel>Vozač</InputLabel>
                                <Select
                                    defaultValue={selectedEntry?.driver || ""}
                                    label="Vozač"
                                >
                                    <MenuItem value="Petar Petrović">Petar Petrović</MenuItem>
                                    <MenuItem value="Marko Marković">Marko Marković</MenuItem>
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
                            <TextField
                                fullWidth
                                label="Ruta"
                                defaultValue={selectedEntry?.route}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Vreme početka"
                                type="time"
                                defaultValue={selectedEntry?.startTime}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Vreme završetka"
                                type="time"
                                defaultValue={selectedEntry?.endTime}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Početna lokacija"
                                defaultValue={selectedEntry?.startLocation}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Krajnja lokacija"
                                defaultValue={selectedEntry?.endLocation}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Udaljenost (km)"
                                type="number"
                                defaultValue={selectedEntry?.distance}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Prosečna brzina (km/h)"
                                type="number"
                                defaultValue={selectedEntry?.averageSpeed}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Potrošnja goriva (L)"
                                type="number"
                                defaultValue={selectedEntry?.fuelConsumption}
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
                        {selectedEntry ? "Sačuvaj izmene" : "Dodaj vožnju"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VehicleTracking; 