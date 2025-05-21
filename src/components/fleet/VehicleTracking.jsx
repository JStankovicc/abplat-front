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
    useTheme
} from "@mui/material";
import {
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    LocationOn as LocationIcon,
    Speed as SpeedIcon,
    DirectionsCar as CarIcon,
    Person as PersonIcon,
    Route as RouteIcon
} from "@mui/icons-material";
import { tokens } from "../../theme";

const VehicleTracking = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);

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
            status: "active",
            route: "Beograd - Novi Sad",
            notes: "Redovna ruta"
        },
        // Dodati više unosa...
    ];

    const getStatusChip = (status) => {
        const statusConfig = {
            active: { color: "success", icon: <CarIcon />, label: "Aktivno" },
            parked: { color: "info", icon: <LocationIcon />, label: "Parkirano" },
            stopped: { color: "warning", icon: <SpeedIcon />, label: "Zaustavljeno" },
            offline: { color: "error", icon: <CarIcon />, label: "Offline" }
        };

        const config = statusConfig[status];
        return (
            <Chip
                icon={config.icon}
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
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

            {/* Statistika */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Aktivna vozila
                            </Typography>
                            <Typography variant="h5">
                                5
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Trenutno u vožnji
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Ukupna kilometraža
                            </Typography>
                            <Typography variant="h5">
                                1,200 km
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Danas
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Prosečna brzina
                            </Typography>
                            <Typography variant="h5">
                                65 km/h
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Danas
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Potrošnja goriva
                            </Typography>
                            <Typography variant="h5">
                                420 L
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
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
                            <TableCell>Status</TableCell>
                            <TableCell>Udaljenost</TableCell>
                            <TableCell>Prosečna brzina</TableCell>
                            <TableCell>Potrošnja</TableCell>
                            <TableCell>Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trackingEntries.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                                <TableCell>{entry.vehicle}</TableCell>
                                <TableCell>{entry.driver}</TableCell>
                                <TableCell>{entry.route}</TableCell>
                                <TableCell>{getStatusChip(entry.status)}</TableCell>
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
                                    {/* Dodati više vozila */}
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
                                    {/* Dodati više vozača */}
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
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    defaultValue={selectedEntry?.status || "active"}
                                    label="Status"
                                >
                                    <MenuItem value="active">Aktivno</MenuItem>
                                    <MenuItem value="parked">Parkirano</MenuItem>
                                    <MenuItem value="stopped">Zaustavljeno</MenuItem>
                                    <MenuItem value="offline">Offline</MenuItem>
                                </Select>
                            </FormControl>
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