import { useState } from "react";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Typography,
    Grid,
    Card,
    CardContent,
    useTheme
} from "@mui/material";
import { tokens } from "../../theme";
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    LocationOn as LocationIcon,
    Business as BusinessIcon
} from "@mui/icons-material";

const SuppliersSection = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    // Primer podataka
    const suppliers = [
        {
            id: 1,
            name: "Dobavljač A",
            contact: "John Doe",
            email: "john@suppliera.com",
            phone: "+381 11 123 4567",
            address: "Bulevar Oslobođenja 123, Novi Sad",
            category: "Elektronika",
            status: "Aktivan",
            lastOrder: "2024-03-15",
            totalOrders: 45
        },
        {
            id: 2,
            name: "Dobavljač B",
            contact: "Jane Smith",
            email: "jane@supplierb.com",
            phone: "+381 11 234 5678",
            address: "Bulevar Mihajla Pupina 45, Beograd",
            category: "Odeća",
            status: "Aktivan",
            lastOrder: "2024-03-14",
            totalOrders: 32
        }
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            {/* Toolbar */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2
                }}
            >
                <TextField
                    size="small"
                    placeholder="Pretraži dobavljače..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                    sx={{ width: "300px" }}
                />
                <Box>
                    <IconButton sx={{ mr: 1 }}>
                        <FilterIcon />
                    </IconButton>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        Novi dobavljač
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={2}>
                {/* Lista dobavljača */}
                <Grid item xs={12} md={selectedSupplier ? 8 : 12}>
                    <TableContainer component={Paper} sx={{ backgroundColor: colors.primary[600] }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Naziv</TableCell>
                                    <TableCell>Kontakt osoba</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Telefon</TableCell>
                                    <TableCell>Kategorija</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Akcije</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {suppliers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((supplier) => (
                                        <TableRow
                                            key={supplier.id}
                                            onClick={() => setSelectedSupplier(supplier)}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell>{supplier.name}</TableCell>
                                            <TableCell>{supplier.contact}</TableCell>
                                            <TableCell>{supplier.email}</TableCell>
                                            <TableCell>{supplier.phone}</TableCell>
                                            <TableCell>{supplier.category}</TableCell>
                                            <TableCell>{supplier.status}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" sx={{ mr: 1 }}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton size="small">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={suppliers.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </Grid>

                {/* Detalji dobavljača */}
                {selectedSupplier && (
                    <Grid item xs={12} md={4}>
                        <Card sx={{ backgroundColor: colors.primary[600] }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Detalji dobavljača
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                        <BusinessIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                                        {selectedSupplier.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <PhoneIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                                        {selectedSupplier.phone}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <EmailIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                                        {selectedSupplier.email}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        <LocationIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                                        {selectedSupplier.address}
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Statistika
                                    </Typography>
                                    <Typography variant="body2">
                                        Ukupno porudžbina: {selectedSupplier.totalOrders}
                                    </Typography>
                                    <Typography variant="body2">
                                        Poslednja porudžbina: {selectedSupplier.lastOrder}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<EditIcon />}
                                    sx={{ mt: 2 }}
                                >
                                    Izmeni podatke
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default SuppliersSection; 