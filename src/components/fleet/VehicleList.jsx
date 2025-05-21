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
    useTheme
} from "@mui/material";
import {
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    DirectionsCar as CarIcon,
    Build as ServiceIcon,
    Warning as WarningIcon,
    CheckCircle as ActiveIcon
} from "@mui/icons-material";
import { tokens } from "../../theme";

const VehicleList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

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
            insuranceExpiry: "2024-12-31",
            nextService: "2024-06-15"
        },
        // Dodati više vozila...
    ];

    const getStatusChip = (status) => {
        const statusConfig = {
            active: { color: "success", icon: <ActiveIcon />, label: "Aktivno" },
            service: { color: "warning", icon: <ServiceIcon />, label: "U servisu" },
            retired: { color: "error", icon: <WarningIcon />, label: "Rashodovano" }
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

    const handleAddEdit = (vehicle = null) => {
        setSelectedVehicle(vehicle);
        setOpenDialog(true);
    };

    return (
        <Box>
            {/* Gornji toolbar */}
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

            {/* Lista vozila */}
            <Grid container spacing={2}>
                {vehicles.map((vehicle) => (
                    <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                    <Typography variant="h6">
                                        {vehicle.brand} {vehicle.model}
                                    </Typography>
                                    <Box>
                                        <IconButton size="small" onClick={() => handleAddEdit(vehicle)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <CarIcon sx={{ mr: 1 }} />
                                    <Typography variant="body2">
                                        {vehicle.registration} • {vehicle.year}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Kilometraža: {vehicle.mileage.toLocaleString()} km
                                    </Typography>
                                </Box>

                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    {getStatusChip(vehicle.status)}
                                    <Typography variant="body2" color="text.secondary">
                                        Sledeći servis: {new Date(vehicle.nextService).toLocaleDateString()}
                                    </Typography>
                                </Box>
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