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
    Chip,
    Button,
    Grid,
    Typography,
    Card,
    CardContent,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    useTheme,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip
} from "@mui/material";
import { tokens } from "../../theme";
import {
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Warning as WarningIcon,
    LocalShipping as ShippingIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Print as PrintIcon,
    Visibility as VisibilityIcon
} from "@mui/icons-material";

const OrdersSection = () => {
    const theme = useTheme();
    const mode = theme?.palette?.mode || "dark";
    const colors = tokens(mode);

    const defaultColors = {
        primary: {
            400: "#141b2d",
            500: "#1f2a40",
            600: "#2d3a54"
        },
        greenAccent: {
            500: "#4cceac"
        },
        redAccent: {
            500: "#ff6b6b",
            700: "#ff0000"
        },
        orangeAccent: {
            500: "#ffa726"
        },
        grey: {
            100: "#f5f5f5"
        }
    };

    const safeColors = {
        primary: {
            400: colors?.primary?.[400] || defaultColors.primary[400],
            500: colors?.primary?.[500] || defaultColors.primary[500],
            600: colors?.primary?.[600] || defaultColors.primary[600]
        },
        greenAccent: {
            500: colors?.greenAccent?.[500] || defaultColors.greenAccent[500]
        },
        redAccent: {
            500: colors?.redAccent?.[500] || defaultColors.redAccent[500],
            700: colors?.redAccent?.[700] || defaultColors.redAccent[700]
        },
        orangeAccent: {
            500: colors?.orangeAccent?.[500] || defaultColors.orangeAccent[500]
        },
        grey: {
            100: colors?.grey?.[100] || defaultColors.grey[100]
        }
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [openNewOrder, setOpenNewOrder] = useState(false);
    const [openEditOrder, setOpenEditOrder] = useState(false);
    const [newOrder, setNewOrder] = useState({
        orderNumber: "",
        supplier: "",
        buyer: {
            name: "",
            email: "",
            phone: "",
            address: ""
        },
        date: "",
        expectedDelivery: "",
        status: "Na čekanju",
        items: [],
        totalAmount: "",
        notes: ""
    });

    // Primer podataka
    const [orders, setOrders] = useState([
        {
            id: 1,
            orderNumber: "PO-2024-001",
            supplier: "Dell Inc.",
            buyer: {
                name: "Kompanija ABC",
                email: "kontakt@abc.rs",
                phone: "+381 11 123 4567",
                address: "Bulevar Oslobođenja 123, Novi Sad"
            },
            date: "2024-03-15",
            expectedDelivery: "2024-03-25",
            status: "Na čekanju",
            items: [
                { name: "Laptop Dell XPS 13", quantity: 5, price: "€1,234.56" },
                { name: "Monitor Dell 27\"", quantity: 3, price: "€299.99" }
            ],
            totalAmount: "€7,172.77",
            notes: "Hitna porudžbina"
        },
        {
            id: 2,
            orderNumber: "PO-2024-002",
            supplier: "Apple Inc.",
            buyer: {
                name: "Firma XYZ",
                email: "info@xyz.rs",
                phone: "+381 11 987 6543",
                address: "Knez Mihailova 45, Beograd"
            },
            date: "2024-03-10",
            expectedDelivery: "2024-03-20",
            status: "Poslato",
            items: [
                { name: "iPhone 14 Pro", quantity: 10, price: "€999.99" },
                { name: "iPad Pro", quantity: 5, price: "€899.99" }
            ],
            totalAmount: "€14,999.85",
            notes: "Redovna porudžbina"
        }
    ]);

    const pendingOrders = orders.filter(o => o.status === "Na čekanju");

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Poslato":
                return safeColors.greenAccent[500];
            case "Na čekanju":
                return safeColors.orangeAccent[500];
            case "Otkazano":
                return safeColors.redAccent[500];
            case "Primljeno":
                return safeColors.greenAccent[500];
            default:
                return safeColors.grey[500];
        }
    };

    const handleNewOrderChange = (field) => (event) => {
        setNewOrder({
            ...newOrder,
            [field]: event.target.value
        });
    };

    const handleAddNewOrder = () => {
        const newId = Math.max(...orders.map(o => o.id)) + 1;
        setOrders([...orders, {
            ...newOrder,
            id: newId,
            orderNumber: `PO-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`
        }]);
        setOpenNewOrder(false);
        setNewOrder({
            orderNumber: "",
            supplier: "",
            buyer: {
                name: "",
                email: "",
                phone: "",
                address: ""
            },
            date: "",
            expectedDelivery: "",
            status: "Na čekanju",
            items: [],
            totalAmount: "",
            notes: ""
        });
    };

    const handleEditOrder = (order) => {
        setNewOrder(order);
        setOpenEditOrder(true);
    };

    const handleUpdateOrder = () => {
        setOrders(orders.map(o => 
            o.id === newOrder.id ? newOrder : o
        ));
        setOpenEditOrder(false);
        setSelectedOrder(null);
    };

    const handleDeleteOrder = (orderId) => {
        setOrders(orders.filter(o => o.id !== orderId));
        if (selectedOrder?.id === orderId) {
            setSelectedOrder(null);
        }
    };

    const handleStatusChange = (orderId, newStatus) => {
        setOrders(orders.map(o => 
            o.id === orderId ? { ...o, status: newStatus } : o
        ));
    };

    return (
        <Box>
            {/* Upozorenje za porudžbine na čekanju */}
            {pendingOrders.length > 0 && (
                <Alert 
                    severity="warning" 
                    sx={{ mb: 3 }}
                    icon={<WarningIcon />}
                >
                    {pendingOrders.length} porudžbina na čekanju
                </Alert>
            )}

            {/* Toolbar */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    gap: 2
                }}
            >
                <TextField
                    size="small"
                    placeholder="Pretraži porudžbine..."
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
                <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={filterStatus}
                            label="Status"
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <MenuItem value="all">Svi statusi</MenuItem>
                            <MenuItem value="Na čekanju">Na čekanju</MenuItem>
                            <MenuItem value="Poslato">Poslato</MenuItem>
                            <MenuItem value="Primljeno">Primljeno</MenuItem>
                            <MenuItem value="Otkazano">Otkazano</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenNewOrder(true)}
                    >
                        Nova porudžbina
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={2}>
                {/* Tabela porudžbina */}
                <Grid item xs={12} md={selectedOrder ? 8 : 12}>
                    <TableContainer component={Paper} sx={{ backgroundColor: safeColors.primary[600] }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Broj porudžbine</TableCell>
                                    <TableCell>Dobavljač</TableCell>
                                    <TableCell>Kupac</TableCell>
                                    <TableCell>Datum</TableCell>
                                    <TableCell>Očekivana isporuka</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Ukupno</TableCell>
                                    <TableCell align="right">Akcije</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((order) => (
                                        <TableRow 
                                            key={order.id}
                                            onClick={() => setSelectedOrder(order)}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell>{order.orderNumber}</TableCell>
                                            <TableCell>{order.supplier}</TableCell>
                                            <TableCell>{order.buyer.name}</TableCell>
                                            <TableCell>{order.date}</TableCell>
                                            <TableCell>{order.expectedDelivery}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={order.status}
                                                    sx={{
                                                        backgroundColor: getStatusColor(order.status),
                                                        color: safeColors.grey[100]
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">{order.totalAmount}</TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Pregledaj">
                                                    <IconButton 
                                                        size="small" 
                                                        sx={{ mr: 1 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedOrder(order);
                                                        }}
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Izmeni">
                                                    <IconButton 
                                                        size="small" 
                                                        sx={{ mr: 1 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditOrder(order);
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Obriši">
                                                    <IconButton 
                                                        size="small"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteOrder(order.id);
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={orders.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </Grid>

                {/* Detalji porudžbine */}
                {selectedOrder && (
                    <Grid item xs={12} md={4}>
                        <Card sx={{ backgroundColor: safeColors.primary[600] }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Detalji porudžbine
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Osnovne informacije
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Broj porudžbine: {selectedOrder.orderNumber}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Dobavljač: {selectedOrder.supplier}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Datum: {selectedOrder.date}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Očekivana isporuka: {selectedOrder.expectedDelivery}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Status: {selectedOrder.status}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Ukupno: {selectedOrder.totalAmount}
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Informacije o kupcu
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Naziv: {selectedOrder.buyer.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Email: {selectedOrder.buyer.email}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Telefon: {selectedOrder.buyer.phone}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Adresa: {selectedOrder.buyer.address}
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Stavke porudžbine
                                    </Typography>
                                    {selectedOrder.items.map((item, index) => (
                                        <Box key={index} sx={{ mb: 1 }}>
                                            <Typography variant="body2">
                                                {item.name} - {item.quantity} x {item.price}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Napomene
                                    </Typography>
                                    <Typography variant="body2">
                                        {selectedOrder.notes}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                    {selectedOrder.status === "Na čekanju" && (
                                        <>
                                            <Button
                                                variant="contained"
                                                startIcon={<ShippingIcon />}
                                                onClick={() => handleStatusChange(selectedOrder.id, "Poslato")}
                                                fullWidth
                                            >
                                                Označi kao poslato
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                startIcon={<CancelIcon />}
                                                onClick={() => handleStatusChange(selectedOrder.id, "Otkazano")}
                                                fullWidth
                                            >
                                                Otkaži porudžbinu
                                            </Button>
                                        </>
                                    )}
                                    {selectedOrder.status === "Poslato" && (
                                        <Button
                                            variant="contained"
                                            startIcon={<CheckCircleIcon />}
                                            onClick={() => handleStatusChange(selectedOrder.id, "Primljeno")}
                                            fullWidth
                                        >
                                            Označi kao primljeno
                                        </Button>
                                    )}
                                    <Button
                                        variant="outlined"
                                        startIcon={<PrintIcon />}
                                        fullWidth
                                    >
                                        Štampaj
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {/* Dijalog za novu porudžbinu */}
            <Dialog 
                open={openNewOrder} 
                onClose={() => setOpenNewOrder(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Nova porudžbina</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Dobavljač"
                                value={newOrder.supplier}
                                onChange={handleNewOrderChange("supplier")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Informacije o kupcu
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Naziv kupca"
                                value={newOrder.buyer.name}
                                onChange={(e) => setNewOrder({
                                    ...newOrder,
                                    buyer: { ...newOrder.buyer, name: e.target.value }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                value={newOrder.buyer.email}
                                onChange={(e) => setNewOrder({
                                    ...newOrder,
                                    buyer: { ...newOrder.buyer, email: e.target.value }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Telefon"
                                value={newOrder.buyer.phone}
                                onChange={(e) => setNewOrder({
                                    ...newOrder,
                                    buyer: { ...newOrder.buyer, phone: e.target.value }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Adresa"
                                value={newOrder.buyer.address}
                                onChange={(e) => setNewOrder({
                                    ...newOrder,
                                    buyer: { ...newOrder.buyer, address: e.target.value }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Datum"
                                value={newOrder.date}
                                onChange={handleNewOrderChange("date")}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Očekivana isporuka"
                                value={newOrder.expectedDelivery}
                                onChange={handleNewOrderChange("expectedDelivery")}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Napomene"
                                value={newOrder.notes}
                                onChange={handleNewOrderChange("notes")}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNewOrder(false)}>Otkaži</Button>
                    <Button 
                        onClick={handleAddNewOrder}
                        variant="contained"
                    >
                        Kreiraj porudžbinu
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dijalog za izmenu porudžbine */}
            <Dialog 
                open={openEditOrder} 
                onClose={() => setOpenEditOrder(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Izmeni porudžbinu</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Dobavljač"
                                value={newOrder.supplier}
                                onChange={handleNewOrderChange("supplier")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Informacije o kupcu
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Naziv kupca"
                                value={newOrder.buyer.name}
                                onChange={(e) => setNewOrder({
                                    ...newOrder,
                                    buyer: { ...newOrder.buyer, name: e.target.value }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                value={newOrder.buyer.email}
                                onChange={(e) => setNewOrder({
                                    ...newOrder,
                                    buyer: { ...newOrder.buyer, email: e.target.value }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Telefon"
                                value={newOrder.buyer.phone}
                                onChange={(e) => setNewOrder({
                                    ...newOrder,
                                    buyer: { ...newOrder.buyer, phone: e.target.value }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Adresa"
                                value={newOrder.buyer.address}
                                onChange={(e) => setNewOrder({
                                    ...newOrder,
                                    buyer: { ...newOrder.buyer, address: e.target.value }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Datum"
                                value={newOrder.date}
                                onChange={handleNewOrderChange("date")}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Očekivana isporuka"
                                value={newOrder.expectedDelivery}
                                onChange={handleNewOrderChange("expectedDelivery")}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={newOrder.status}
                                    label="Status"
                                    onChange={handleNewOrderChange("status")}
                                >
                                    <MenuItem value="Na čekanju">Na čekanju</MenuItem>
                                    <MenuItem value="Poslato">Poslato</MenuItem>
                                    <MenuItem value="Primljeno">Primljeno</MenuItem>
                                    <MenuItem value="Otkazano">Otkazano</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Napomene"
                                value={newOrder.notes}
                                onChange={handleNewOrderChange("notes")}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditOrder(false)}>Otkaži</Button>
                    <Button 
                        onClick={handleUpdateOrder}
                        variant="contained"
                    >
                        Sačuvaj izmene
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrdersSection; 