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
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    MenuItem
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
    const mode = theme?.palette?.mode || "dark";
    const colors = tokens(mode);

    // Definišemo sve boje koje nam trebaju
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
            500: "#ff6b6b"
        },
        orangeAccent: {
            500: "#ffa726"
        },
        grey: {
            100: "#f5f5f5"
        }
    };

    // Sigurno čitanje boja sa fallback vrednostima
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
            500: colors?.redAccent?.[500] || defaultColors.redAccent[500]
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
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [isNewReturnDialogOpen, setIsNewReturnDialogOpen] = useState(false);
    const [returns, setReturns] = useState([
        {
            id: 1,
            orderNumber: "ORD-2024-001",
            customer: "Petar Petrović",
            date: "2024-02-15",
            reason: "Neispravan proizvod",
            status: "Na čekanju",
            items: [
                {
                    id: 1,
                    name: "Laptop Dell XPS 13",
                    quantity: 1,
                    price: "€1,234.56"
                }
            ],
            totalAmount: "€1,234.56",
            notes: "Kupac prijavljuje da laptop ne pali"
        },
        {
            id: 2,
            orderNumber: "ORD-2024-002",
            customer: "Ana Anić",
            date: "2024-02-14",
            reason: "Pogrešan proizvod",
            status: "Odobreno",
            items: [
                {
                    id: 2,
                    name: "Monitor Dell 27\"",
                    quantity: 1,
                    price: "€299.99"
                }
            ],
            totalAmount: "€299.99",
            notes: "Kupac je dobio pogrešan model monitora"
        }
    ]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Na čekanju":
                return safeColors.orangeAccent[500];
            case "Odobreno":
                return safeColors.greenAccent[500];
            case "Odbijeno":
                return safeColors.redAccent[500];
            case "Završeno":
                return safeColors.primary[400];
            default:
                return safeColors.grey[100];
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

    const [newReturn, setNewReturn] = useState({
        orderNumber: "",
        customer: "",
        date: "",
        reason: "",
        status: "Na čekanju",
        totalAmount: "",
        notes: ""
    });

    const handleNewReturnChange = (field) => (event) => {
        setNewReturn({
            ...newReturn,
            [field]: event.target.value
        });
    };

    const handleOpenNewReturnDialog = () => {
        setIsNewReturnDialogOpen(true);
    };

    const handleCloseNewReturnDialog = () => {
        setIsNewReturnDialogOpen(false);
        setNewReturn({
            orderNumber: "",
            customer: "",
            date: "",
            reason: "",
            status: "Na čekanju",
            totalAmount: "",
            notes: ""
        });
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
                        onClick={handleOpenNewReturnDialog}
                    >
                        Novi povrat
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={2}>
                {/* Lista povrata */}
                <Grid item xs={12} md={selectedReturn ? 8 : 12}>
                    <TableContainer component={Paper} sx={{ backgroundColor: safeColors.primary[600] }}>
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
                                            <TableCell>{returnItem.orderNumber}</TableCell>
                                            <TableCell>{returnItem.reason}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(returnItem.status)}
                                                    label={returnItem.status}
                                                    sx={{
                                                        backgroundColor: getStatusColor(returnItem.status),
                                                        color: safeColors.grey[100]
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">{returnItem.totalAmount}</TableCell>
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
                        <Card sx={{ backgroundColor: safeColors.primary[600] }}>
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
                                        Broj porudžbine: {selectedReturn.orderNumber}
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
                                        Ukupno: {selectedReturn.totalAmount}
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

            {/* Dialog za novi povrat */}
            <Dialog open={isNewReturnDialogOpen} onClose={handleCloseNewReturnDialog}>
                <DialogTitle>Novi povrat</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Broj porudžbine"
                                value={newReturn?.orderNumber || ""}
                                onChange={handleNewReturnChange("orderNumber")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Kupac"
                                value={newReturn?.customer || ""}
                                onChange={handleNewReturnChange("customer")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Datum"
                                type="date"
                                value={newReturn?.date || ""}
                                onChange={handleNewReturnChange("date")}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Razlog"
                                value={newReturn?.reason || ""}
                                onChange={handleNewReturnChange("reason")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Status"
                                select
                                value={newReturn?.status || ""}
                                onChange={handleNewReturnChange("status")}
                            >
                                <MenuItem value="Na čekanju">Na čekanju</MenuItem>
                                <MenuItem value="Odobreno">Odobreno</MenuItem>
                                <MenuItem value="Odbijeno">Odbijeno</MenuItem>
                                <MenuItem value="Završeno">Završeno</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Iznos"
                                value={newReturn?.totalAmount || ""}
                                onChange={handleNewReturnChange("totalAmount")}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Napomene"
                                value={newReturn?.notes || ""}
                                onChange={handleNewReturnChange("notes")}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default ReturnsSection; 