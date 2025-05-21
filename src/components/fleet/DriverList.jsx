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

const DriverList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("name");

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
            medicalExamExpiry: "2024-12-31",
            address: "Beograd, Srbija",
            experience: "15 godina",
            documents: ["Vozačka dozvola", "Lekarski pregled", "Psihološki pregled"],
            alerts: [
                { type: "warning", message: "Lekarski pregled ističe za 30 dana" },
                { type: "info", message: "Vozačka dozvola važi još 365 dana" }
            ]
        },
        {
            id: 2,
            firstName: "Marko",
            lastName: "Marković",
            licenseNumber: "987654321",
            licenseExpiry: "2024-12-31",
            phone: "+381 60 987 6543",
            email: "marko.markovic@example.com",
            status: "active",
            assignedVehicle: "Volvo FH16 (BG-789-012)",
            medicalExamExpiry: "2024-06-30",
            address: "Novi Sad, Srbija",
            experience: "8 godina",
            documents: ["Vozačka dozvola", "Lekarski pregled"],
            alerts: [
                { type: "error", message: "Lekarski pregled ističe za 5 dana" }
            ]
        }
    ];

    const getStatusChip = (status) => {
        const statusConfig = {
            active: { color: "success", label: "Aktivan" },
            inactive: { color: "warning", label: "Neaktivan" },
            suspended: { color: "error", label: "Suspendovan" }
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

    const handleAddEdit = (driver = null) => {
        setSelectedDriver(driver);
        setOpenDialog(true);
    };

    const getDaysUntilExpiry = (date) => {
        const expiryDate = new Date(date);
        const today = new Date();
        const diffTime = expiryDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <Box>
            {/* Gornji toolbar */}
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
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
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            label="Status"
                        >
                            <MenuItem value="all">Svi</MenuItem>
                            <MenuItem value="active">Aktivni</MenuItem>
                            <MenuItem value="inactive">Neaktivni</MenuItem>
                            <MenuItem value="suspended">Suspendovani</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Sortiraj po</InputLabel>
                        <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            label="Sortiraj po"
                        >
                            <MenuItem value="name">Ime</MenuItem>
                            <MenuItem value="experience">Iskustvo</MenuItem>
                            <MenuItem value="licenseExpiry">Dozvola</MenuItem>
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
                        Dodaj vozača
                    </Button>
                </Box>
            </Box>

            {/* Lista vozača */}
            <Grid container spacing={2}>
                {drivers.map((driver) => (
                    <Grid item xs={12} key={driver.id}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 0.5 }}>
                                            {driver.firstName} {driver.lastName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {driver.licenseNumber}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        {getStatusChip(driver.status)}
                                        <IconButton size="small" onClick={() => handleAddEdit(driver)}>
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
                                                    Dokumenti
                                                </Typography>
                                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                                    {driver.documents.map((doc, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={doc}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>

                                            {driver.assignedVehicle && (
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Dodeljeno vozilo
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {driver.assignedVehicle}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Informacije o dozvoli
                                                </Typography>
                                                <Box sx={{ mb: 1 }}>
                                                    <Typography variant="body2" gutterBottom>
                                                        Vozačka dozvola ističe za {getDaysUntilExpiry(driver.licenseExpiry)} dana
                                                    </Typography>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={(getDaysUntilExpiry(driver.licenseExpiry) / 365) * 100}
                                                        color={getDaysUntilExpiry(driver.licenseExpiry) < 30 ? "error" : "primary"}
                                                    />
                                                </Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    Lekarski pregled: {new Date(driver.medicalExamExpiry).toLocaleDateString()}
                                                </Typography>
                                            </Box>

                                            {driver.alerts.length > 0 && (
                                                <Box>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Upozorenja
                                                    </Typography>
                                                    <Stack spacing={1}>
                                                        {driver.alerts.map((alert, index) => (
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
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Adresa"
                                defaultValue={selectedDriver?.address}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Iskustvo"
                                defaultValue={selectedDriver?.experience}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Dodeljeno vozilo"
                                defaultValue={selectedDriver?.assignedVehicle}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Napomene"
                                multiline
                                rows={2}
                                defaultValue={selectedDriver?.notes}
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