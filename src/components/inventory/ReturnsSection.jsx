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
    Chip,
    useTheme
} from "@mui/material";
import { tokens } from "../../theme";
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Add as AddIcon,
    AssignmentReturn as ReturnIcon,
    CheckCircle as ApprovedIcon,
    Pending as PendingIcon,
    Cancel as RejectedIcon,
    LocalShipping as ShippingIcon
} from "@mui/icons-material";

const ReturnsSection = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedReturn, setSelectedReturn] = useState(null);

    // Primer podataka
    const returns = [
        {
            id: "RET-001",
            date: "2024-03-15",
            customer: "Kompanija A",
            orderId: "ORD-001",
            reason: "Oštećen proizvod",
            status: "Pending",
            items: [
                { name: "Laptop Dell XPS 13", quantity: 1, price: "€1,234.56" }
            ],
            total: "€1,234.56"
        },
        {
            id: "RET-002",
            date: "2024-03-14",
            customer: "Kompanija B",
            orderId: "ORD-002",
            reason: "Pogrešan proizvod",
            status: "Approved",
            items: [
                { name: "iPhone 14 Pro", quantity: 2, price: "€999.99" }
            ],
            total: "€1,999.98"
        }
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
            case "Approved":
                return colors.greenAccent[500];
            case "Pending":
                return colors.blueAccent[500];
            case "Rejected":
                return colors.redAccent[500];
            default:
                return colors.grey[500];
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Approved":
                return <ApprovedIcon />;
            case "Pending":
                return <PendingIcon />;
            case "Rejected":
                return <RejectedIcon />;
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
                    placeholder="Pretraži povrate..."
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
                        Novi povrat
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={2}>
                {/* Lista povrata */}
                <Grid item xs={12} md={selectedReturn ? 8 : 12}>
                    <TableContainer component={Paper} sx={{ backgroundColor: colors.primary[600] }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Broj povrata</TableCell>
                                    <TableCell>Datum</TableCell>
                                    <TableCell>Kupac</TableCell>
                                    <TableCell>Broj porudžbine</TableCell>
                                    <TableCell>Razlog</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Ukupno</TableCell>
                                    <TableCell align="right">Akcije</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {returns
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((returnItem) => (
                                        <TableRow
                                            key={returnItem.id}
                                            onClick={() => setSelectedReturn(returnItem)}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <TableCell>{returnItem.id}</TableCell>
                                            <TableCell>{returnItem.date}</TableCell>
                                            <TableCell>{returnItem.customer}</TableCell>
                                            <TableCell>{returnItem.orderId}</TableCell>
                                            <TableCell>{returnItem.reason}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(returnItem.status)}
                                                    label={returnItem.status}
                                                    sx={{
                                                        backgroundColor: getStatusColor(returnItem.status),
                                                        color: colors.grey[100]
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">{returnItem.total}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small">
                                                    <ReturnIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={returns.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </Grid>

                {/* Detalji povrata */}
                {selectedReturn && (
                    <Grid item xs={12} md={4}>
                        <Card sx={{ backgroundColor: colors.primary[600] }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Detalji povrata
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Osnovne informacije
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Broj povrata: {selectedReturn.id}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Datum: {selectedReturn.date}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Kupac: {selectedReturn.customer}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Broj porudžbine: {selectedReturn.orderId}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        Razlog: {selectedReturn.reason}
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Stavke
                                    </Typography>
                                    {selectedReturn.items.map((item, index) => (
                                        <Box key={index} sx={{ mb: 1 }}>
                                            <Typography variant="body2">
                                                {item.name} x {item.quantity}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {item.price}
                                            </Typography>
                                        </Box>
                                    ))}
                                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                                        Ukupno: {selectedReturn.total}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<ApprovedIcon />}
                                        fullWidth
                                    >
                                        Odobri
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<RejectedIcon />}
                                        fullWidth
                                    >
                                        Odbij
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default ReturnsSection; 