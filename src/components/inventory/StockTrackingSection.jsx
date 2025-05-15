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
    useTheme
} from "@mui/material";
import { tokens } from "../../theme";
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from "@mui/icons-material";

const StockTrackingSection = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    // Primer podataka
    const products = [
        {
            id: 1,
            name: "Laptop Dell XPS 13",
            sku: "DL-XPS13-2023",
            category: "Elektronika",
            quantity: 15,
            minQuantity: 5,
            location: "Skladiste A",
            status: "In Stock"
        },
        {
            id: 2,
            name: "iPhone 14 Pro",
            sku: "AP-IP14P-2023",
            category: "Elektronika",
            quantity: 8,
            minQuantity: 10,
            location: "Skladiste B",
            status: "Low Stock"
        },
        // Dodajte više proizvoda po potrebi
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "In Stock":
                return colors.greenAccent[500];
            case "Low Stock":
                return colors.redAccent[500];
            case "Out of Stock":
                return colors.redAccent[700];
            default:
                return colors.grey[500];
        }
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
                <Box>
                    <IconButton sx={{ mr: 1 }}>
                        <FilterIcon />
                    </IconButton>
                    <IconButton color="primary">
                        <AddIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Tabela */}
            <TableContainer component={Paper} sx={{ backgroundColor: colors.primary[600] }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Naziv proizvoda</TableCell>
                            <TableCell>SKU</TableCell>
                            <TableCell>Kategorija</TableCell>
                            <TableCell align="right">Količina</TableCell>
                            <TableCell>Lokacija</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.sku}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell align="right">{product.quantity}</TableCell>
                                    <TableCell>{product.location}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={product.status}
                                            sx={{
                                                backgroundColor: getStatusColor(product.status),
                                                color: colors.grey[100]
                                            }}
                                        />
                                    </TableCell>
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
                    count={products.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Box>
    );
};

export default StockTrackingSection; 