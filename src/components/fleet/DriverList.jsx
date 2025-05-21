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
    Avatar,
    useTheme
} from "@mui/material";
import {
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    DirectionsCar as CarIcon,
    Warning as WarningIcon,
    CheckCircle as ActiveIcon
} from "@mui/icons-material";
import { tokens } from "../../theme";

const DriverList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);

    // TODO: Zameniti sa pravim podacima iz API-ja
    const drivers = [
        {
            id: 1,
            firstName: "Petar",
            lastName: "Petrović",
            licenseNumber: "123456789",
            licenseExpiry: "2025-12-31",
            phone: "+381 60 123 4567",
            email: "petar.petrovic@example.com",
            status: "active",
            assignedVehicle: "Mercedes Actros (BG-123-456)",
            medicalExamExpiry: "2024-12-31"
        },
        // Dodati više vozača...
    ];

    const getStatusChip = (status) => {
        const statusConfig = {
            active: { color: "success", icon: <ActiveIcon />, label: "Aktivan" },
            inactive: { color: "warning", icon: <WarningIcon />, label: "Neaktivan" },
            suspended: { color: "error", icon: <WarningIcon />, label: "Suspendovan" }
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

    const handleAddEdit = (driver = null) => {
        setSelectedDriver(driver);
        setOpenDialog(true);
    };

    return (
        <Box>
            {/* Gornji toolbar */}
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <TextField
                    size="small"
                    placeholder="Pretraži vozače..."
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
                    Dodaj vozača
                </Button>
            </Box>

            {/* Lista vozača */}
            <Grid container spacing={2}>
                {drivers.map((driver) => (
                    <Grid item xs={12} sm={6} md={4} key={driver.id}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <Avatar sx={{ mr: 2, bgcolor: colors.primary[500] }}>
                                            {driver.firstName[0]}{driver.lastName[0]}
                                        </Avatar>
                                        <Typography variant="h6">
                                            {driver.firstName} {driver.lastName}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <IconButton size="small" onClick={() => handleAddEdit(driver)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <PersonIcon sx={{ mr: 1 }} />
                                    <Typography variant="body2">
                                        {driver.licenseNumber}
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {driver.phone}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {driver.email}
                                    </Typography>
                                </Box>

                                {driver.assignedVehicle && (
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                        <CarIcon sx={{ mr: 1 }} />
                                        <Typography variant="body2">
                                            {driver.assignedVehicle}
                                        </Typography>
                                    </Box>
                                )}

                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    {getStatusChip(driver.status)}
                                    <Typography variant="body2" color="text.secondary">
                                        Dozvola do: {new Date(driver.licenseExpiry).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog za dodavanje/izmenu vozača */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedDriver ? "Izmeni vozača" : "Dodaj novog vozača"}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Ime"
                                defaultValue={selectedDriver?.firstName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Prezime"
                                defaultValue={selectedDriver?.lastName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Broj vozačke dozvole"
                                defaultValue={selectedDriver?.licenseNumber}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Datum isteka dozvole"
                                type="date"
                                defaultValue={selectedDriver?.licenseExpiry}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Telefon"
                                defaultValue={selectedDriver?.phone}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                defaultValue={selectedDriver?.email}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    defaultValue={selectedDriver?.status || "active"}
                                    label="Status"
                                >
                                    <MenuItem value="active">Aktivan</MenuItem>
                                    <MenuItem value="inactive">Neaktivan</MenuItem>
                                    <MenuItem value="suspended">Suspendovan</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Datum isteka lekarskog pregleda"
                                type="date"
                                defaultValue={selectedDriver?.medicalExamExpiry}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Otkaži</Button>
                    <Button variant="contained" color="primary">
                        {selectedDriver ? "Sačuvaj izmene" : "Dodaj vozača"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DriverList; 