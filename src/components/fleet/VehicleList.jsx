import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    IconButton,
    Chip,
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

const VehicleList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("name");

    // TODO: Zameniti sa pravim podacima iz API-ja
    const vehicles = [
        {
            id: 1,
            brand: "Mercedes",
            model: "Actros",
            year: 2022,
            registration: "BG-123-456",
            serialNumber: "SN123456",
            status: "active",
            mileage: 45000,
            fuelType: "diesel",
            fuelConsumption: 35,
            insuranceExpiry: "2024-12-31",
            nextService: "2024-06-15",
            lastService: "2023-12-15",
            serviceInterval: 15000,
            driver: "Petar Petrović",
            location: "Beograd",
            purchaseDate: "2022-01-15",
            purchasePrice: 85000,
            currentValue: 75000,
            documents: ["Tehnički pregled", "Osiguranje", "Putna dozvola"],
            maintenanceHistory: [
                { date: "2023-12-15", type: "Redovni servis", cost: 850, mileage: 30000 },
                { date: "2023-06-15", type: "Zamena guma", cost: 1200, mileage: 15000 }
            ],
            fuelHistory: [
                { date: "2024-03-15", liters: 150, cost: 277.50, mileage: 45000 },
                { date: "2024-03-01", liters: 120, cost: 222.00, mileage: 42000 }
            ],
            alerts: [
                { type: "warning", message: "Sledeći servis za 30 dana" },
                { type: "info", message: "Osiguranje ističe za 90 dana" }
            ]
        },
        {
            id: 2,
            brand: "Volvo",
            model: "FH16",
            year: 2023,
            registration: "BG-789-012",
            serialNumber: "SN789012",
            status: "service",
            mileage: 15000,
            fuelType: "diesel",
            fuelConsumption: 32,
            insuranceExpiry: "2025-06-30",
            nextService: "2024-09-15",
            lastService: "2024-03-15",
            serviceInterval: 15000,
            driver: "Marko Marković",
            location: "Novi Sad",
            purchaseDate: "2023-03-15",
            purchasePrice: 95000,
            currentValue: 90000,
            documents: ["Tehnički pregled", "Osiguranje", "Putna dozvola"],
            maintenanceHistory: [
                { date: "2024-03-15", type: "Redovni servis", cost: 950, mileage: 15000 }
            ],
            fuelHistory: [
                { date: "2024-03-10", liters: 130, cost: 240.50, mileage: 15000 }
            ],
            alerts: [
                { type: "error", message: "U servisu - zamena kočnica" }
            ]
        }
    ];

    const getStatusChip = (status) => {
        const statusConfig = {
            active: { color: "success", label: "Aktivno" },
            service: { color: "warning", label: "U servisu" },
            retired: { color: "error", label: "Rashodovano" }
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

    const handleAddEdit = (vehicle = null) => {
        setSelectedVehicle(vehicle);
        setOpenDialog(true);
    };

    const calculateServiceProgress = (vehicle) => {
        const lastServiceMileage = vehicle.maintenanceHistory[0]?.mileage || 0;
        const currentMileage = vehicle.mileage;
        const progress = ((currentMileage - lastServiceMileage) / vehicle.serviceInterval) * 100;
        return Math.min(progress, 100);
    };

    const getDaysUntilService = (vehicle) => {
        const nextService = new Date(vehicle.nextService);
        const today = new Date();
        const diffTime = nextService - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <Box>
            {/* Gornji toolbar */}
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
                    <TextField
                        size="small"
                        placeholder="Pretraži vozila..."
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
                            <MenuItem value="active">Aktivni</MenuItem>
                            <MenuItem value="service">U servisu</MenuItem>
                            <MenuItem value="retired">Rashodovani</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Sortiraj po</InputLabel>
                        <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            label="Sortiraj po"
                        >
                            <MenuItem value="name">Naziv</MenuItem>
                            <MenuItem value="mileage">Kilometraža</MenuItem>
                            <MenuItem value="nextService">Sledeći servis</MenuItem>
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
                        Dodaj vozilo
                    </Button>
                </Box>
            </Box>

            {/* Lista vozila */}
            <Grid container spacing={2}>
                {vehicles.map((vehicle) => (
                    <Grid item xs={12} key={vehicle.id}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 0.5 }}>
                                            {vehicle.brand} {vehicle.model}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {vehicle.registration} • {vehicle.year}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        {getStatusChip(vehicle.status)}
                                        <IconButton size="small" onClick={() => handleAddEdit(vehicle)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Osnovne informacije
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2">
                                                            Kilometraža: {vehicle.mileage.toLocaleString()} km
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2">
                                                            Gorivo: {vehicle.fuelType} • {vehicle.fuelConsumption} L/100km
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2">
                                                            Vozač: {vehicle.driver}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="body2">
                                                            Lokacija: {vehicle.location}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Box>

                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Servis
                                                </Typography>
                                                <Box sx={{ mb: 1 }}>
                                                    <Typography variant="body2" gutterBottom>
                                                        Sledeći servis za {getDaysUntilService(vehicle)} dana
                                                    </Typography>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={calculateServiceProgress(vehicle)}
                                                        color={calculateServiceProgress(vehicle) > 80 ? "error" : "primary"}
                                                    />
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Poslednji servis: {new Date(vehicle.lastService).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Dokumenti
                                                </Typography>
                                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                                    {vehicle.documents.map((doc, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={doc}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>

                                            {vehicle.alerts.length > 0 && (
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Upozorenja
                                                    </Typography>
                                                    <Stack spacing={1}>
                                                        {vehicle.alerts.map((alert, index) => (
                                                            <Alert 
                                                                key={index}
                                                                severity={alert.type}
                                                                sx={{ py: 0.5 }}
                                                            >
                                                                <AlertTitle sx={{ fontSize: "0.875rem" }}>
                                                                    {alert.message}
                                                                </AlertTitle>
                                                            </Alert>
                                                        ))}
                                                    </Stack>
                                                </Box>
                                            )}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog za dodavanje/izmenu vozila */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedVehicle ? "Izmeni vozilo" : "Dodaj novo vozilo"}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Marka"
                                defaultValue={selectedVehicle?.brand}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Model"
                                defaultValue={selectedVehicle?.model}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Godina proizvodnje"
                                type="number"
                                defaultValue={selectedVehicle?.year}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Registracija"
                                defaultValue={selectedVehicle?.registration}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Serijski broj"
                                defaultValue={selectedVehicle?.serialNumber}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    defaultValue={selectedVehicle?.status || "active"}
                                    label="Status"
                                >
                                    <MenuItem value="active">Aktivno</MenuItem>
                                    <MenuItem value="service">U servisu</MenuItem>
                                    <MenuItem value="retired">Rashodovano</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Kilometraža"
                                type="number"
                                defaultValue={selectedVehicle?.mileage}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Tip goriva</InputLabel>
                                <Select
                                    defaultValue={selectedVehicle?.fuelType || "diesel"}
                                    label="Tip goriva"
                                >
                                    <MenuItem value="diesel">Dizel</MenuItem>
                                    <MenuItem value="petrol">Benzin</MenuItem>
                                    <MenuItem value="electric">Struja</MenuItem>
                                    <MenuItem value="hybrid">Hibrid</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Datum isteka osiguranja"
                                type="date"
                                defaultValue={selectedVehicle?.insuranceExpiry}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Sledeći servis"
                                type="date"
                                defaultValue={selectedVehicle?.nextService}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Vozač"
                                defaultValue={selectedVehicle?.driver}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Lokacija"
                                defaultValue={selectedVehicle?.location}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Datum kupovine"
                                type="date"
                                defaultValue={selectedVehicle?.purchaseDate}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Cena kupovine"
                                type="number"
                                defaultValue={selectedVehicle?.purchasePrice}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Napomene"
                                multiline
                                rows={2}
                                defaultValue={selectedVehicle?.notes}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Otkaži</Button>
                    <Button variant="contained" color="primary">
                        {selectedVehicle ? "Sačuvaj izmene" : "Dodaj vozilo"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VehicleList; 