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
    useTheme,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    List,
    ListItem,
    ListItemText,
    Divider
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
    Business as BusinessIcon,
    Visibility as VisibilityIcon,
    AddCircle as AddCircleIcon,
    RemoveCircle as RemoveCircleIcon
} from "@mui/icons-material";

const SuppliersSection = () => {
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
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [openNewSupplier, setOpenNewSupplier] = useState(false);
    const [openEditSupplier, setOpenEditSupplier] = useState(false);
    const [openAddProduct, setOpenAddProduct] = useState(false);
    const [newSupplier, setNewSupplier] = useState({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        products: []
    });
    const [newProduct, setNewProduct] = useState({
        name: "",
        sku: "",
        price: "",
        category: "",
        description: ""
    });

    // Primer podataka
    const [suppliers, setSuppliers] = useState([
        {
            id: 1,
            name: "Dell Inc.",
            contactPerson: "Marko Marković",
            email: "marko@dell.com",
            phone: "+381 11 123 4567",
            address: "Bulevar Oslobođenja 123, Novi Sad",
            products: [
                {
                    id: 1,
                    name: "Laptop Dell XPS 13",
                    sku: "DELL-XPS13-2024",
                    price: "€1,234.56",
                    category: "Laptopi",
                    description: "13-inch laptop sa Intel i7 procesorom"
                },
                {
                    id: 2,
                    name: "Monitor Dell 27\"",
                    sku: "DELL-MON27-2024",
                    price: "€299.99",
                    category: "Monitori",
                    description: "27-inch 4K monitor"
                }
            ]
        },
        {
            id: 2,
            name: "Apple Inc.",
            contactPerson: "Petar Petrović",
            email: "petar@apple.com",
            phone: "+381 11 987 6543",
            address: "Knez Mihailova 45, Beograd",
            products: [
                {
                    id: 3,
                    name: "iPhone 14 Pro",
                    sku: "APPLE-IP14P-2024",
                    price: "€999.99",
                    category: "Telefoni",
                    description: "Najnoviji iPhone model"
                },
                {
                    id: 4,
                    name: "iPad Pro",
                    sku: "APPLE-IPADP-2024",
                    price: "€899.99",
                    category: "Tableti",
                    description: "12.9-inch iPad Pro"
                }
            ]
        }
    ]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleNewSupplierChange = (field) => (event) => {
        setNewSupplier({
            ...newSupplier,
            [field]: event.target.value
        });
    };

    const handleAddNewSupplier = () => {
        const newId = Math.max(...suppliers.map(s => s.id)) + 1;
        setSuppliers([...suppliers, {
            ...newSupplier,
            id: newId,
            products: []
        }]);
        setOpenNewSupplier(false);
        setNewSupplier({
            name: "",
            contactPerson: "",
            email: "",
            phone: "",
            address: "",
            products: []
        });
    };

    const handleEditSupplier = (supplier) => {
        setNewSupplier(supplier);
        setOpenEditSupplier(true);
    };

    const handleUpdateSupplier = () => {
        setSuppliers(suppliers.map(s => 
            s.id === newSupplier.id ? newSupplier : s
        ));
        setOpenEditSupplier(false);
        setSelectedSupplier(null);
    };

    const handleDeleteSupplier = (supplierId) => {
        setSuppliers(suppliers.filter(s => s.id !== supplierId));
        if (selectedSupplier?.id === supplierId) {
            setSelectedSupplier(null);
        }
    };

    const handleAddProduct = () => {
        const newProductId = Math.max(...selectedSupplier.products.map(p => p.id)) + 1;
        const updatedSupplier = {
            ...selectedSupplier,
            products: [...selectedSupplier.products, { ...newProduct, id: newProductId }]
        };
        setSuppliers(suppliers.map(s => 
            s.id === selectedSupplier.id ? updatedSupplier : s
        ));
        setSelectedSupplier(updatedSupplier);
        setOpenAddProduct(false);
        setNewProduct({
            name: "",
            sku: "",
            price: "",
            category: "",
            description: ""
        });
    };

    const handleRemoveProduct = (productId) => {
        const updatedSupplier = {
            ...selectedSupplier,
            products: selectedSupplier.products.filter(p => p.id !== productId)
        };
        setSuppliers(suppliers.map(s => 
            s.id === selectedSupplier.id ? updatedSupplier : s
        ));
        setSelectedSupplier(updatedSupplier);
    };

    return (
        <Box>
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
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenNewSupplier(true)}
                >
                    Novi dobavljač
                </Button>
            </Box>

            <Grid container spacing={2}>
                {/* Tabela dobavljača */}
                <Grid item xs={12} md={selectedSupplier ? 8 : 12}>
                    <TableContainer component={Paper} sx={{ backgroundColor: safeColors.primary[600] }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Naziv</TableCell>
                                    <TableCell>Kontakt osoba</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Telefon</TableCell>
                                    <TableCell align="right">Broj proizvoda</TableCell>
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
                                            <TableCell>{supplier.contactPerson}</TableCell>
                                            <TableCell>{supplier.email}</TableCell>
                                            <TableCell>{supplier.phone}</TableCell>
                                            <TableCell align="right">{supplier.products.length}</TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Pregledaj">
                                                    <IconButton 
                                                        size="small" 
                                                        sx={{ mr: 1 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedSupplier(supplier);
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
                                                            handleEditSupplier(supplier);
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
                                                            handleDeleteSupplier(supplier.id);
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
                        <Card sx={{ backgroundColor: safeColors.primary[600] }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Detalji dobavljača
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Osnovne informacije
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Naziv: {selectedSupplier.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Kontakt osoba: {selectedSupplier.contactPerson}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Email: {selectedSupplier.email}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Telefon: {selectedSupplier.phone}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Adresa: {selectedSupplier.address}
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                        <Typography variant="subtitle2">
                                            Proizvodi
                                        </Typography>
                                        <Button
                                            size="small"
                                            startIcon={<AddCircleIcon />}
                                            onClick={() => setOpenAddProduct(true)}
                                        >
                                            Dodaj proizvod
                                        </Button>
                                    </Box>
                                    <List>
                                        {selectedSupplier.products.map((product) => (
                                            <Box key={product.id}>
                                                <ListItem
                                                    secondaryAction={
                                                        <IconButton 
                                                            edge="end" 
                                                            onClick={() => handleRemoveProduct(product.id)}
                                                        >
                                                            <RemoveCircleIcon />
                                                        </IconButton>
                                                    }
                                                >
                                                    <ListItemText
                                                        primary={product.name}
                                                        secondary={
                                                            <Box>
                                                                <Typography variant="body2" component="span">
                                                                    SKU: {product.sku}
                                                                </Typography>
                                                                <br />
                                                                <Typography variant="body2" component="span">
                                                                    Cena: {product.price}
                                                                </Typography>
                                                                <br />
                                                                <Typography variant="body2" component="span">
                                                                    Kategorija: {product.category}
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />
                                                </ListItem>
                                                <Divider />
                                            </Box>
                                        ))}
                                    </List>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {/* Dijalog za novog dobavljača */}
            <Dialog 
                open={openNewSupplier} 
                onClose={() => setOpenNewSupplier(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Novi dobavljač</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Naziv"
                                value={newSupplier.name}
                                onChange={handleNewSupplierChange("name")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Kontakt osoba"
                                value={newSupplier.contactPerson}
                                onChange={handleNewSupplierChange("contactPerson")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                value={newSupplier.email}
                                onChange={handleNewSupplierChange("email")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Telefon"
                                value={newSupplier.phone}
                                onChange={handleNewSupplierChange("phone")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Adresa"
                                value={newSupplier.address}
                                onChange={handleNewSupplierChange("address")}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNewSupplier(false)}>Otkaži</Button>
                    <Button 
                        onClick={handleAddNewSupplier}
                        variant="contained"
                    >
                        Dodaj dobavljača
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dijalog za izmenu dobavljača */}
            <Dialog 
                open={openEditSupplier} 
                onClose={() => setOpenEditSupplier(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Izmeni dobavljača</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Naziv"
                                value={newSupplier.name}
                                onChange={handleNewSupplierChange("name")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Kontakt osoba"
                                value={newSupplier.contactPerson}
                                onChange={handleNewSupplierChange("contactPerson")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                value={newSupplier.email}
                                onChange={handleNewSupplierChange("email")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Telefon"
                                value={newSupplier.phone}
                                onChange={handleNewSupplierChange("phone")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Adresa"
                                value={newSupplier.address}
                                onChange={handleNewSupplierChange("address")}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditSupplier(false)}>Otkaži</Button>
                    <Button 
                        onClick={handleUpdateSupplier}
                        variant="contained"
                    >
                        Sačuvaj izmene
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dijalog za dodavanje proizvoda */}
            <Dialog 
                open={openAddProduct} 
                onClose={() => setOpenAddProduct(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Dodaj proizvod</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Naziv proizvoda"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="SKU"
                                value={newProduct.sku}
                                onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Cena"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Kategorija"
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Opis"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddProduct(false)}>Otkaži</Button>
                    <Button 
                        onClick={handleAddProduct}
                        variant="contained"
                    >
                        Dodaj proizvod
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SuppliersSection; 