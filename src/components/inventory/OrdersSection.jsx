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
    Menu,
    MenuItem,
    useTheme
} from "@mui/material";
import { tokens } from "../../theme";
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Add as AddIcon,
    MoreVert as MoreVertIcon,
    LocalShipping as ShippingIcon,
    CheckCircle as CompletedIcon,
    Pending as PendingIcon,
    Cancel as CancelledIcon
} from "@mui/icons-material";

const OrdersSection = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Primer podataka
    const orders = [
        {
            id: "ORD-001",
            date: "2024-03-15",
            customer: "Kompanija A",
            type: "Ulazna",
            status: "Completed",
            total: "€1,234.56",
            items: 5
        },
        {
            id: "ORD-002",
            date: "2024-03-14",
            customer: "Kompanija B",
            type: "Izlazna",
            status: "Pending",
            total: "€2,345.67",
            items: 8
        },
        {
            id: "ORD-003",
            date: "2024-03-13",
            customer: "Kompanija C",
            type: "Ulazna",
            status: "Cancelled",
            total: "€3,456.78",
            items: 3
        }
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleMenuClick = (event, order) => {
        setAnchorEl(event.currentTarget);
        setSelectedOrder(order);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedOrder(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Completed":
                return colors.greenAccent[500];
            case "Pending":
                return colors.blueAccent[500];
            case "Cancelled":
                return colors.redAccent[500];
            default:
                return colors.grey[500];
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Completed":
                return <CompletedIcon />;
            case "Pending":
                return <PendingIcon />;
            case "Cancelled":
                return <CancelledIcon />;
            default:
                return null;
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
                <Box>
                    <IconButton sx={{ mr: 1 }}>
                        <FilterIcon />
                    </IconButton>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        Nova porudžbina
                    </Button>
                </Box>
            </Box>

            {/* Tabela */}
            <TableContainer component={Paper} sx={{ backgroundColor: colors.primary[600] }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Broj porudžbine</TableCell>
                            <TableCell>Datum</TableCell>
                            <TableCell>Kupac/Dobavljač</TableCell>
                            <TableCell>Tip</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Ukupno</TableCell>
                            <TableCell align="right">Broj stavki</TableCell>
                            <TableCell align="right">Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>{order.customer}</TableCell>
                                    <TableCell>{order.type}</TableCell>
                                    <TableCell>
                                        <Chip
                                            icon={getStatusIcon(order.status)}
                                            label={order.status}
                                            sx={{
                                                backgroundColor: getStatusColor(order.status),
                                                color: colors.grey[100]
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">{order.total}</TableCell>
                                    <TableCell align="right">{order.items}</TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuClick(e, order)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
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

            {/* Meni za akcije */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>
                    <ShippingIcon sx={{ mr: 1 }} /> Pregled detalja
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <CompletedIcon sx={{ mr: 1 }} /> Označi kao završeno
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <CancelledIcon sx={{ mr: 1 }} /> Otkaži porudžbinu
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default OrdersSection; 