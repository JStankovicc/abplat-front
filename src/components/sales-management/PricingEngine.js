import { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useTheme,
    useMediaQuery
} from "@mui/material";
import { tokens } from "../../theme";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, History as HistoryIcon } from "@mui/icons-material";

// Mock podaci za cene
const mockPricingData = [
    {
        id: 1,
        product: "Osnovni paket",
        description: "Osnovne funkcionalnosti",
        basePrice: 50000,
        discount: 0,
        finalPrice: 50000,
        currency: "RSD",
        validFrom: "2024-01-01",
        validTo: "2024-12-31"
    },
    {
        id: 2,
        product: "Standard paket",
        description: "Standardne funkcionalnosti",
        basePrice: 100000,
        discount: 10,
        finalPrice: 90000,
        currency: "RSD",
        validFrom: "2024-01-01",
        validTo: "2024-12-31"
    },
    {
        id: 3,
        product: "Premium paket",
        description: "Sve funkcionalnosti",
        basePrice: 200000,
        discount: 15,
        finalPrice: 170000,
        currency: "RSD",
        validFrom: "2024-01-01",
        validTo: "2024-12-31"
    }
];

const PricingEngine = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");
    const [pricingData, setPricingData] = useState(mockPricingData);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [formData, setFormData] = useState({
        product: "",
        description: "",
        basePrice: "",
        discount: "",
        currency: "RSD",
        validFrom: "",
        validTo: ""
    });

    const handleOpenDialog = (price = null) => {
        if (price) {
            setSelectedPrice(price);
            setFormData(price);
        } else {
            setSelectedPrice(null);
            setFormData({
                product: "",
                description: "",
                basePrice: "",
                discount: "",
                currency: "RSD",
                validFrom: "",
                validTo: ""
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPrice(null);
    };

    const handleSubmit = () => {
        const finalPrice = formData.basePrice * (1 - formData.discount / 100);
        const newPrice = {
            ...formData,
            finalPrice,
            id: selectedPrice ? selectedPrice.id : pricingData.length + 1
        };

        if (selectedPrice) {
            setPricingData(pricingData.map(price => 
                price.id === selectedPrice.id ? newPrice : price
            ));
        } else {
            setPricingData([...pricingData, newPrice]);
        }
        handleCloseDialog();
    };

    const handleDelete = (id) => {
        setPricingData(pricingData.filter(price => price.id !== id));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('sr-RS', {
            style: 'currency',
            currency: 'RSD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5" color={colors.grey[100]}>
                    Upravljanje cenama
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                        backgroundColor: colors.greenAccent[500],
                        "&:hover": {
                            backgroundColor: colors.greenAccent[600]
                        }
                    }}
                >
                    Dodaj cenu
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ backgroundColor: colors.primary[600] }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: colors.grey[100] }}>Proizvod</TableCell>
                            <TableCell sx={{ color: colors.grey[100] }}>Opis</TableCell>
                            <TableCell sx={{ color: colors.grey[100] }}>Osnovna cena</TableCell>
                            <TableCell sx={{ color: colors.grey[100] }}>Popust</TableCell>
                            <TableCell sx={{ color: colors.grey[100] }}>Konačna cena</TableCell>
                            <TableCell sx={{ color: colors.grey[100] }}>Važi od</TableCell>
                            <TableCell sx={{ color: colors.grey[100] }}>Važi do</TableCell>
                            <TableCell sx={{ color: colors.grey[100] }}>Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pricingData.map((price) => (
                            <TableRow key={price.id}>
                                <TableCell sx={{ color: colors.grey[100] }}>{price.product}</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}>{price.description}</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}>{formatCurrency(price.basePrice)}</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}>{price.discount}%</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}>{formatCurrency(price.finalPrice)}</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}>{price.validFrom}</TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}>{price.validTo}</TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenDialog(price)}
                                        sx={{ color: colors.grey[100] }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(price.id)}
                                        sx={{ color: colors.redAccent[500] }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        sx={{ color: colors.grey[100] }}
                                    >
                                        <HistoryIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {selectedPrice ? "Izmeni cenu" : "Dodaj novu cenu"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Proizvod"
                            value={formData.product}
                            onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Opis"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Osnovna cena"
                            type="number"
                            value={formData.basePrice}
                            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Popust (%)"
                            type="number"
                            value={formData.discount}
                            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Važi od"
                            type="date"
                            value={formData.validFrom}
                            onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Važi do"
                            type="date"
                            value={formData.validTo}
                            onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Otkaži</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedPrice ? "Sačuvaj" : "Dodaj"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PricingEngine; 