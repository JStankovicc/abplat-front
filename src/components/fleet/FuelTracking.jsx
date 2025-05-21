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
    useTheme
} from "@mui/material";
import {
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    LocalGasStation as FuelIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon
} from "@mui/icons-material";
import { tokens } from "../../theme";

const FuelTracking = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);

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
            notes: "Redovno punjenje"
        },
        // Dodati više unosa...
    ];

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

            {/* Statistika */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Ukupna potrošnja
                            </Typography>
                            <Typography variant="h5">
                                1,500 L
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Poslednjih 30 dana
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Prosečna potrošnja
                            </Typography>
                            <Typography variant="h5">
                                35 L/100km
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Poslednjih 30 dana
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
                                2,775 €
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Poslednjih 30 dana
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Trend potrošnje
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <TrendingDownIcon color="success" sx={{ mr: 1 }} />
                                <Typography variant="h5" color="success.main">
                                    -5%
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary">
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
                            <TableCell>Lokacija</TableCell>
                            <TableCell>Količina (L)</TableCell>
                            <TableCell>Cena po litru</TableCell>
                            <TableCell>Ukupno</TableCell>
                            <TableCell>Kilometraža</TableCell>
                            <TableCell>Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fuelEntries.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                                <TableCell>{entry.vehicle}</TableCell>
                                <TableCell>{entry.driver}</TableCell>
                                <TableCell>{entry.location}</TableCell>
                                <TableCell>{entry.liters}</TableCell>
                                <TableCell>{entry.pricePerLiter.toFixed(2)} €</TableCell>
                                <TableCell>{entry.totalCost.toFixed(2)} €</TableCell>
                                <TableCell>{entry.mileage.toLocaleString()} km</TableCell>
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
                                    {/* Dodati više vozača */}
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