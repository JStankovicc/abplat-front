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
    Build as BuildIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon
} from "@mui/icons-material";
import { tokens } from "../../theme";

const MaintenanceTracking = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);

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
            notes: "Zamenjeni filteri i ulje"
        },
        // Dodati više unosa...
    ];

    const getStatusChip = (status) => {
        const statusConfig = {
            scheduled: { color: "info", icon: <ScheduleIcon />, label: "Zakazano" },
            inProgress: { color: "warning", icon: <BuildIcon />, label: "U toku" },
            completed: { color: "success", icon: <CheckCircleIcon />, label: "Završeno" },
            overdue: { color: "error", icon: <WarningIcon />, label: "Prekoračeno" }
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

            {/* Statistika */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Zakazani servisi
                            </Typography>
                            <Typography variant="h5">
                                5
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Narednih 30 dana
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                U toku
                            </Typography>
                            <Typography variant="h5">
                                2
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Trenutno u servisu
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
                                12,500 €
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
                                Prekoračeni servisi
                            </Typography>
                            <Typography variant="h5" color="error">
                                1
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
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
                                <TableCell>{getStatusChip(entry.status)}</TableCell>
                                <TableCell>{entry.description}</TableCell>
                                <TableCell>{entry.mileage.toLocaleString()} km</TableCell>
                                <TableCell>{entry.cost.toFixed(2)} €</TableCell>
                                <TableCell>{new Date(entry.nextService).toLocaleDateString()}</TableCell>
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