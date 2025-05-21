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
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    LocalPolice as PoliceIcon,
    CarCrash as CrashIcon,
    Speed as SpeedIcon
} from "@mui/icons-material";
import { tokens } from "../../theme";

const IncidentTracking = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);

    // TODO: Zameniti sa pravim podacima iz API-ja
    const incidents = [
        {
            id: 1,
            vehicle: "Mercedes Actros (BG-123-456)",
            date: "2024-03-15",
            type: "accident",
            severity: "medium",
            status: "resolved",
            description: "Manja šteta na prednjem braniku",
            location: "Beograd, Bulevar oslobođenja 123",
            driver: "Petar Petrović",
            cost: 850,
            insuranceClaim: "U toku",
            policeReport: "Da",
            notes: "Zamenjen prednji branik"
        },
        // Dodati više incidenata...
    ];

    const getStatusChip = (status) => {
        const statusConfig = {
            reported: { color: "info", icon: <WarningIcon />, label: "Prijavljeno" },
            inProgress: { color: "warning", icon: <ScheduleIcon />, label: "U toku" },
            resolved: { color: "success", icon: <CheckCircleIcon />, label: "Rešeno" },
            pending: { color: "error", icon: <WarningIcon />, label: "Na čekanju" }
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

    const getTypeChip = (type) => {
        const typeConfig = {
            accident: { color: "error", icon: <CrashIcon />, label: "Nesreća" },
            violation: { color: "warning", icon: <SpeedIcon />, label: "Prekršaj" },
            damage: { color: "info", icon: <WarningIcon />, label: "Oštećenje" },
            theft: { color: "error", icon: <PoliceIcon />, label: "Krađa" }
        };

        const config = typeConfig[type];
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
                    placeholder="Pretraži incidente..."
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
                    Dodaj incident
                </Button>
            </Box>

            {/* Statistika */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Aktivni incidenti
                            </Typography>
                            <Typography variant="h5">
                                3
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                U toku
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Ukupni troškovi
                            </Typography>
                            <Typography variant="h5">
                                5,500 €
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Ove godine
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Osiguranje
                            </Typography>
                            <Typography variant="h5">
                                2,500 €
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Isplaćeno
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Prekršaji
                            </Typography>
                            <Typography variant="h5" color="warning.main">
                                5
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Ove godine
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabela incidenata */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Datum</TableCell>
                            <TableCell>Vozilo</TableCell>
                            <TableCell>Tip</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Opis</TableCell>
                            <TableCell>Lokacija</TableCell>
                            <TableCell>Vozač</TableCell>
                            <TableCell>Trošak</TableCell>
                            <TableCell>Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {incidents.map((incident) => (
                            <TableRow key={incident.id}>
                                <TableCell>{new Date(incident.date).toLocaleDateString()}</TableCell>
                                <TableCell>{incident.vehicle}</TableCell>
                                <TableCell>{getTypeChip(incident.type)}</TableCell>
                                <TableCell>{getStatusChip(incident.status)}</TableCell>
                                <TableCell>{incident.description}</TableCell>
                                <TableCell>{incident.location}</TableCell>
                                <TableCell>{incident.driver}</TableCell>
                                <TableCell>{incident.cost.toFixed(2)} €</TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => handleAddEdit(incident)}>
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

            {/* Dialog za dodavanje/izmenu incidenata */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedEntry ? "Izmeni incident" : "Dodaj novi incident"}
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
                                <InputLabel>Tip incidenta</InputLabel>
                                <Select
                                    defaultValue={selectedEntry?.type || "accident"}
                                    label="Tip incidenta"
                                >
                                    <MenuItem value="accident">Nesreća</MenuItem>
                                    <MenuItem value="violation">Prekršaj</MenuItem>
                                    <MenuItem value="damage">Oštećenje</MenuItem>
                                    <MenuItem value="theft">Krađa</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    defaultValue={selectedEntry?.status || "reported"}
                                    label="Status"
                                >
                                    <MenuItem value="reported">Prijavljeno</MenuItem>
                                    <MenuItem value="inProgress">U toku</MenuItem>
                                    <MenuItem value="resolved">Rešeno</MenuItem>
                                    <MenuItem value="pending">Na čekanju</MenuItem>
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
                                label="Lokacija"
                                defaultValue={selectedEntry?.location}
                            />
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
                                label="Trošak"
                                type="number"
                                defaultValue={selectedEntry?.cost}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status osiguranja</InputLabel>
                                <Select
                                    defaultValue={selectedEntry?.insuranceClaim || ""}
                                    label="Status osiguranja"
                                >
                                    <MenuItem value="U toku">U toku</MenuItem>
                                    <MenuItem value="Odobreno">Odobreno</MenuItem>
                                    <MenuItem value="Odbijeno">Odbijeno</MenuItem>
                                    <MenuItem value="Nije prijavljeno">Nije prijavljeno</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Policijski izveštaj</InputLabel>
                                <Select
                                    defaultValue={selectedEntry?.policeReport || "Ne"}
                                    label="Policijski izveštaj"
                                >
                                    <MenuItem value="Da">Da</MenuItem>
                                    <MenuItem value="Ne">Ne</MenuItem>
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
                        {selectedEntry ? "Sačuvaj izmene" : "Dodaj incident"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default IncidentTracking; 