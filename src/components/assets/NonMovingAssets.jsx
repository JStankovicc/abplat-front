import { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Typography,
    useTheme,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";
import { tokens } from "../../theme";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const NonMovingAssets = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);

    // Primer podataka - u pravoj aplikaciji bi došli iz API-ja
    const [assets, setAssets] = useState([
        {
            id: 1,
            name: "Zgrada A",
            category: "Nekretnina",
            address: "Bulevar Oslobođenja 123",
            area: "500m²",
            owner: "Kompanija d.o.o.",
            status: "Aktivan",
            purchaseDate: "2020-01-15",
            lastInspection: "2023-12-01",
            insurance: "2024-12-31"
        },
        // Dodajte više primera po potrebi
    ]);

    const handleOpen = () => {
        setOpen(true);
        setEditMode(false);
        setSelectedAsset(null);
    };

    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
        setSelectedAsset(null);
    };

    const handleEdit = (asset) => {
        setSelectedAsset(asset);
        setEditMode(true);
        setOpen(true);
    };

    const handleDelete = (id) => {
        setAssets(assets.filter(asset => asset.id !== id));
    };

    return (
        <Box>
            {/* Header sa akcijama */}
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5" color={colors.grey[100]}>
                    Nepokretna imovina
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                    sx={{
                        backgroundColor: colors.greenAccent[500],
                        "&:hover": {
                            backgroundColor: colors.greenAccent[600]
                        }
                    }}
                >
                    Dodaj imovinu
                </Button>
            </Box>

            {/* Tabela imovine */}
            <TableContainer component={Paper} sx={{ backgroundColor: colors.primary[400] }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Naziv</TableCell>
                            <TableCell>Kategorija</TableCell>
                            <TableCell>Adresa</TableCell>
                            <TableCell>Površina</TableCell>
                            <TableCell>Vlasnik</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Datum nabavke</TableCell>
                            <TableCell>Poslednja inspekcija</TableCell>
                            <TableCell>Osiguranje</TableCell>
                            <TableCell>Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assets.map((asset) => (
                            <TableRow key={asset.id}>
                                <TableCell>{asset.name}</TableCell>
                                <TableCell>{asset.category}</TableCell>
                                <TableCell>{asset.address}</TableCell>
                                <TableCell>{asset.area}</TableCell>
                                <TableCell>{asset.owner}</TableCell>
                                <TableCell>{asset.status}</TableCell>
                                <TableCell>{asset.purchaseDate}</TableCell>
                                <TableCell>{asset.lastInspection}</TableCell>
                                <TableCell>{asset.insurance}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(asset)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(asset.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog za dodavanje/izmenu */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editMode ? "Izmeni imovinu" : "Dodaj novu imovinu"}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Naziv"
                                defaultValue={selectedAsset?.name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Kategorija</InputLabel>
                                <Select
                                    label="Kategorija"
                                    defaultValue={selectedAsset?.category}
                                >
                                    <MenuItem value="Nekretnina">Nekretnina</MenuItem>
                                    <MenuItem value="Zemljište">Zemljište</MenuItem>
                                    <MenuItem value="Infrastruktura">Infrastruktura</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Adresa"
                                defaultValue={selectedAsset?.address}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Površina"
                                defaultValue={selectedAsset?.area}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Vlasnik"
                                defaultValue={selectedAsset?.owner}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    label="Status"
                                    defaultValue={selectedAsset?.status}
                                >
                                    <MenuItem value="Aktivan">Aktivan</MenuItem>
                                    <MenuItem value="U rekonstrukciji">U rekonstrukciji</MenuItem>
                                    <MenuItem value="Na prodaju">Na prodaju</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Datum nabavke"
                                type="date"
                                defaultValue={selectedAsset?.purchaseDate}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Poslednja inspekcija"
                                type="date"
                                defaultValue={selectedAsset?.lastInspection}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Osiguranje"
                                type="date"
                                defaultValue={selectedAsset?.insurance}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Otkaži</Button>
                    <Button variant="contained" onClick={handleClose}>
                        {editMode ? "Sačuvaj izmene" : "Dodaj"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default NonMovingAssets; 