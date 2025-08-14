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
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    LocalShipping as ShippingIcon,
    Inventory as InventoryIcon,
    Category as CategoryIcon,
    AddCircle as AddCircleIcon
} from "@mui/icons-material";

const StockTrackingSection = () => {
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
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [openNewProduct, setOpenNewProduct] = useState(false);
    const [openNewCategory, setOpenNewCategory] = useState(false);
    const [openNewType, setOpenNewType] = useState(false);
    const [openEditProduct, setOpenEditProduct] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [newType, setNewType] = useState("");
    const [categories, setCategories] = useState(["Elektronika", "Odeća", "Namirnice"]);
    const [types, setTypes] = useState(["Računari", "Mobilni telefoni", "Periferije"]);
    const [newProduct, setNewProduct] = useState({
        name: "",
        sku: "",
        category: "",
        type: "",
        quantity: 0,
        minQuantity: 0,
        price: "",
        supplier: ""
    });

    // Primer podataka
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Laptop Dell XPS 13",
            sku: "DL-XPS13-2023",
            category: "Elektronika",
            type: "Računari",
            quantity: 15,
            minQuantity: 5,
            status: "Na stanju",
            price: "€1,234.56",
            supplier: "Dell Inc.",
            lastRestock: "2024-03-01",
            lastOrder: "2024-03-15"
        },
        {
            id: 2,
            name: "iPhone 14 Pro",
            sku: "AP-IP14P-2023",
            category: "Elektronika",
            type: "Mobilni telefoni",
            quantity: 8,
            minQuantity: 10,
            status: "Niska zaliha",
            price: "€999.99",
            supplier: "Apple Inc.",
            lastRestock: "2024-02-15",
            lastOrder: "2024-03-10"
        }
    ]);

    const lowStockProducts = products.filter(p => p.status === "Niska zaliha");

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Na stanju":
                return safeColors.greenAccent[500];
            case "Niska zaliha":
                return safeColors.redAccent[500];
            case "Nema na stanju":
                return safeColors.redAccent[700];
            default:
                return safeColors.grey[500];
        }
    };

    const handleNewProductChange = (field) => (event) => {
        setNewProduct({
            ...newProduct,
            [field]: event.target.value
        });
    };

    const handleAddNewProduct = () => {
        const newId = Math.max(...products.map(p => p.id)) + 1;
        const status = newProduct.quantity <= newProduct.minQuantity ? "Niska zaliha" : "Na stanju";
        
        setProducts([...products, {
            ...newProduct,
            id: newId,
            status,
            lastRestock: new Date().toISOString().split('T')[0],
            lastOrder: new Date().toISOString().split('T')[0]
        }]);
        
        setOpenNewProduct(false);
        setNewProduct({
            name: "",
            sku: "",
            category: "",
            type: "",
            quantity: 0,
            minQuantity: 0,
            price: "",
            supplier: ""
        });
    };

    const handleEditProduct = (product) => {
        setNewProduct(product);
        setOpenEditProduct(true);
    };

    const handleUpdateProduct = () => {
        const status = newProduct.quantity <= newProduct.minQuantity ? "Niska zaliha" : "Na stanju";
        setProducts(products.map(p => 
            p.id === newProduct.id ? { ...newProduct, status } : p
        ));
        setOpenEditProduct(false);
        setSelectedProduct(null);
    };

    const handleDeleteProduct = (productId) => {
        setProducts(products.filter(p => p.id !== productId));
        if (selectedProduct?.id === productId) {
            setSelectedProduct(null);
        }
    };

    const handleAddCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setNewCategory("");
        }
        setOpenNewCategory(false);
    };

    const handleAddType = () => {
        if (newType && !types.includes(newType)) {
            setTypes([...types, newType]);
            setNewType("");
        }
        setOpenNewType(false);
    };

    return (
        <Box>
            {/* Upozorenje za niske zalihe */}
            {lowStockProducts.length > 0 && (
                <Alert 
                    severity="warning" 
                    sx={{ mb: 3 }}
                    icon={<WarningIcon />}
                >
                    {lowStockProducts.length} proizvoda ima niske zalihe
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
                    placeholder="Pretraži proizvode..."
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
                        <InputLabel>Kategorija</InputLabel>
                        <Select
                            value={filterCategory}
                            label="Kategorija"
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <MenuItem value="all">Sve kategorije</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Tip proizvoda</InputLabel>
                        <Select
                            value={filterType}
                            label="Tip proizvoda"
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <MenuItem value="all">Svi tipovi</MenuItem>
                            {types.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenNewProduct(true)}
                    >
                        Novi proizvod
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={2}>
                {/* Tabela proizvoda */}
                <Grid item xs={12} md={selectedProduct ? 8 : 12}>
                    <TableContainer component={Paper} sx={{ backgroundColor: safeColors.primary[600] }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Naziv proizvoda</TableCell>
                                    <TableCell>SKU</TableCell>
                                    <TableCell>Kategorija</TableCell>
                                    <TableCell>Tip</TableCell>
                                    <TableCell align="right">Količina</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Akcije</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((product) => (
                                        <TableRow 
                                            key={product.id}
                                            onClick={() => setSelectedProduct(product)}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.sku}</TableCell>
                                            <TableCell>{product.category}</TableCell>
                                            <TableCell>{product.type}</TableCell>
                                            <TableCell align="right">{product.quantity}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={product.status}
                                                    sx={{
                                                        backgroundColor: getStatusColor(product.status),
                                                        color: safeColors.grey[100]
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Izmeni">
                                                    <IconButton 
                                                        size="small" 
                                                        sx={{ mr: 1 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditProduct(product);
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
                                                            handleDeleteProduct(product.id);
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
                            count={products.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </Grid>

                {/* Detalji proizvoda */}
                {selectedProduct && (
                    <Grid item xs={12} md={4}>
                        <Card sx={{ backgroundColor: safeColors.primary[600] }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Detalji proizvoda
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Osnovne informacije
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Naziv: {selectedProduct.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        SKU: {selectedProduct.sku}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Kategorija: {selectedProduct.category}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Tip: {selectedProduct.type}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Cena: {selectedProduct.price}
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Stanje zaliha
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Trenutna količina: {selectedProduct.quantity}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Minimalna količina: {selectedProduct.minQuantity}
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Dobavljač
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        {selectedProduct.supplier}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Poslednja dopuna: {selectedProduct.lastRestock}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Poslednja porudžbina: {selectedProduct.lastOrder}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<ShippingIcon />}
                                        fullWidth
                                    >
                                        Nova porudžbina
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        fullWidth
                                        onClick={() => handleEditProduct(selectedProduct)}
                                    >
                                        Izmeni
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {/* Dijalog za novi proizvod */}
            <Dialog 
                open={openNewProduct} 
                onClose={() => setOpenNewProduct(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Novi proizvod</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Naziv proizvoda"
                                value={newProduct.name}
                                onChange={handleNewProductChange("name")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="SKU"
                                value={newProduct.sku}
                                onChange={handleNewProductChange("sku")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Kategorija</InputLabel>
                                <Select
                                    value={newProduct.category}
                                    label="Kategorija"
                                    onChange={handleNewProductChange("category")}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                startIcon={<AddCircleIcon />}
                                onClick={() => setOpenNewCategory(true)}
                                sx={{ mt: 1 }}
                            >
                                Nova kategorija
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Tip proizvoda</InputLabel>
                                <Select
                                    value={newProduct.type}
                                    label="Tip proizvoda"
                                    onChange={handleNewProductChange("type")}
                                >
                                    {types.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                startIcon={<AddCircleIcon />}
                                onClick={() => setOpenNewType(true)}
                                sx={{ mt: 1 }}
                            >
                                Novi tip
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Količina"
                                value={newProduct.quantity}
                                onChange={handleNewProductChange("quantity")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Minimalna količina"
                                value={newProduct.minQuantity}
                                onChange={handleNewProductChange("minQuantity")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Cena"
                                value={newProduct.price}
                                onChange={handleNewProductChange("price")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Dobavljač"
                                value={newProduct.supplier}
                                onChange={handleNewProductChange("supplier")}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNewProduct(false)}>Otkaži</Button>
                    <Button 
                        onClick={handleAddNewProduct}
                        variant="contained"
                    >
                        Dodaj proizvod
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dijalog za izmenu proizvoda */}
            <Dialog 
                open={openEditProduct} 
                onClose={() => setOpenEditProduct(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Izmeni proizvod</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Naziv proizvoda"
                                value={newProduct.name}
                                onChange={handleNewProductChange("name")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="SKU"
                                value={newProduct.sku}
                                onChange={handleNewProductChange("sku")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Kategorija</InputLabel>
                                <Select
                                    value={newProduct.category}
                                    label="Kategorija"
                                    onChange={handleNewProductChange("category")}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Tip proizvoda</InputLabel>
                                <Select
                                    value={newProduct.type}
                                    label="Tip proizvoda"
                                    onChange={handleNewProductChange("type")}
                                >
                                    {types.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Količina"
                                value={newProduct.quantity}
                                onChange={handleNewProductChange("quantity")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Minimalna količina"
                                value={newProduct.minQuantity}
                                onChange={handleNewProductChange("minQuantity")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Cena"
                                value={newProduct.price}
                                onChange={handleNewProductChange("price")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Dobavljač"
                                value={newProduct.supplier}
                                onChange={handleNewProductChange("supplier")}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditProduct(false)}>Otkaži</Button>
                    <Button 
                        onClick={handleUpdateProduct}
                        variant="contained"
                    >
                        Sačuvaj izmene
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dijalog za novu kategoriju */}
            <Dialog
                open={openNewCategory}
                onClose={() => setOpenNewCategory(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Nova kategorija</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Naziv kategorije"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNewCategory(false)}>Otkaži</Button>
                    <Button 
                        onClick={handleAddCategory}
                        variant="contained"
                    >
                        Dodaj kategoriju
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dijalog za novi tip */}
            <Dialog
                open={openNewType}
                onClose={() => setOpenNewType(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Novi tip proizvoda</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Naziv tipa"
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNewType(false)}>Otkaži</Button>
                    <Button 
                        onClick={handleAddType}
                        variant="contained"
                    >
                        Dodaj tip
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StockTrackingSection; 