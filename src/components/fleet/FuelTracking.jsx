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

const FuelTracking = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [filterVehicle, setFilterVehicle] = useState("all");
    const [sortBy, setSortBy] = useState("date");

    // TODO: Zameniti sa pravim podacima iz API-ja
    const fuelEntries = [
        {
            id: 1,
            vehicle: "Mercedes Actros (BG-123-456)",
            date: "2024-03-15",
            liters: 150,
            pricePerLiter: 1.85,
            totalCost: 277.50,
            mileage: 45000,
            fuelType: "diesel",
            driver: "Petar Petrović",
            location: "Beograd",
            notes: "Redovno punjenje",
            consumption: 35,
            alerts: [
                { type: "warning", message: "Potrošnja iznad proseka" }
            ]
        },
        {
            id: 2,
            vehicle: "Volvo FH16 (BG-789-012)",
            date: "2024-03-14",
            liters: 120,
            pricePerLiter: 1.85,
            totalCost: 222.00,
            mileage: 15000,
            fuelType: "diesel",
            driver: "Marko Marković",
            location: "Novi Sad",
            notes: "Punjenje nakon dugog putovanja",
            consumption: 32,
            alerts: []
        }
    ];

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
                        placeholder="Pretraži unose..."
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
                            <MenuItem value="consumption">Potrošnji</MenuItem>
                            <MenuItem value="cost">Troškovima</MenuItem>
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
                        Dodaj unos
                    </Button>
                </Box>
            </Box>

            {/* Statistika */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Ukupna potrošnja
                            </Typography>
                            <Typography variant="h5">
                                1,500 L
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Poslednjih 30 dana
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Prosečna potrošnja
                            </Typography>
                            <Typography variant="h5">
                                35 L/100km
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Poslednjih 30 dana
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
                                2,775 €
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Poslednjih 30 dana
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Trend potrošnje
                            </Typography>
                            <Typography variant="h5" color="success.main">
                                -5%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                U odnosu na prošli mesec
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabela unosa */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Datum</TableCell>
                            <TableCell>Vozilo</TableCell>
                            <TableCell>Vozač</TableCell>
                            <TableCell>Količina (L)</TableCell>
                            <TableCell>Cena po litru</TableCell>
                            <TableCell>Ukupno</TableCell>
                            <TableCell>Kilometraža</TableCell>
                            <TableCell>Potrošnja</TableCell>
                            <TableCell>Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fuelEntries.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                                <TableCell>{entry.vehicle}</TableCell>
                                <TableCell>{entry.driver}</TableCell>
                                <TableCell>{entry.liters}</TableCell>
                                <TableCell>{entry.pricePerLiter.toFixed(2)} €</TableCell>
                                <TableCell>{entry.totalCost.toFixed(2)} €</TableCell>
                                <TableCell>{entry.mileage.toLocaleString()} km</TableCell>
                                <TableCell>
                                    <Box>
                                        <Typography variant="body2">
                                            {entry.consumption} L/100km
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

            {/* Dialog za dodavanje/izmenu unosa */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedEntry ? "Izmeni unos" : "Dodaj novi unos"}
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
                            <TextField
                                fullWidth
                                label="Količina (L)"
                                type="number"
                                defaultValue={selectedEntry?.liters}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Cena po litru"
                                type="number"
                                defaultValue={selectedEntry?.pricePerLiter}
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
                            <FormControl fullWidth>
                                <InputLabel>Tip goriva</InputLabel>
                                <Select
                                    defaultValue={selectedEntry?.fuelType || "diesel"}
                                    label="Tip goriva"
                                >
                                    <MenuItem value="diesel">Dizel</MenuItem>
                                    <MenuItem value="petrol">Benzin</MenuItem>
                                    <MenuItem value="lpg">LPG</MenuItem>
                                    <MenuItem value="electric">Struja</MenuItem>
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
                                label="Lokacija"
                                defaultValue={selectedEntry?.location}
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
                        {selectedEntry ? "Sačuvaj izmene" : "Dodaj unos"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default FuelTracking; 