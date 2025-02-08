import React, { useState } from "react";
import {
    Box,
    Typography,
    useTheme,
    useMediaQuery,
    Button,
    Stack,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Radio, Grid
} from "@mui/material";
import { tokens } from "../../theme";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const CompanySettings = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [logo, setLogo] = useState("/default-logo.png");
    const [addingPayment, setAddingPayment] = useState(false);

    const [formData, setFormData] = useState({
        companyName: "",
        country: "",
        city: "",
        district: "",
        address: "",
        taxId: "",
        email: "",
        phone: "",
        currency: "RSD",
        supportType: "standard",
        numProfiles: 1,
        packageSize: "medium",
        paymentMethods: [
            { id: 1, type: "bank", details: "Bank: 123-4567812345678", isDefault: true }
        ],
        newPayment: { type: "bank", details: "" }
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) setLogo(URL.createObjectURL(file));
    };

    const handlePaymentChange = (e) => {
        setFormData({
            ...formData,
            newPayment: { ...formData.newPayment, [e.target.name]: e.target.value }
        });
    };

    const addPaymentMethod = () => {
        if (formData.newPayment.details) {
            const newMethods = [
                ...formData.paymentMethods,
                { ...formData.newPayment, id: Date.now(), isDefault: false }
            ];
            setFormData({
                ...formData,
                paymentMethods: newMethods,
                newPayment: { type: "bank", details: "" }
            });
            setAddingPayment(false);
        }
    };

    const removePaymentMethod = (id) => {
        const newMethods = formData.paymentMethods.filter(method => method.id !== id);
        setFormData({ ...formData, paymentMethods: newMethods });
    };

    const setDefaultPayment = (id) => {
        const newMethods = formData.paymentMethods.map(method => ({
            ...method,
            isDefault: method.id === id
        }));
        setFormData({ ...formData, paymentMethods: newMethods });
    };

    return (
        <Box sx={{
            m: isMobile ? "10px" : "20px",
            height: `calc(100vh - ${isMobile ? 80 : 100}px)`,
            overflow: "hidden"
        }}>
            <Stack
                direction={isMobile ? "column" : "row"}
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography
                    variant="h2"
                    sx={{
                        color: colors.grey[100],
                        fontSize: isMobile ? "24px" : "32px",
                        fontWeight: 600
                    }}
                >
                    Postavke Kompanije
                </Typography>

                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<SaveIcon />}
                    sx={{
                        backgroundColor: colors.greenAccent[600],
                        "&:hover": { backgroundColor: colors.greenAccent[700] }
                    }}
                >
                    Sačuvaj
                </Button>
            </Stack>

            <Box sx={{
                height: "100%",
                overflow: "auto",
                "& > div": { mb: 3 }
            }}>
                {/* Osnovne Informacije */}
                <Box
                    p="20px"
                    borderRadius="4px"
                    sx={{
                        backgroundColor: colors.primary[400],
                        minHeight: "40vh"
                    }}
                >
                    <Typography variant="h3" sx={{ mb: "20px", fontSize: isMobile ? "20px" : "24px" }}>
                        Osnovne Informacije
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                            <img
                                src="https://img.logoipsum.com/288.svg"
                                alt="Company Logo"
                                style={{
                                    maxWidth: "200px",
                                    maxHeight: "200px",
                                    borderRadius: "8px",
                                    border: `2px solid ${colors.grey[700]}`
                                }}
                            />
                            <input
                                accept="image/*"
                                style={{ display: "none" }}
                                id="logo-upload"
                                type="file"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="logo-upload">
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    component="span"
                                    color="secondary"
                                    startIcon={<CloudUploadIcon />}
                                    sx={{ mt: 2 }}
                                >
                                    Promeni Logo
                                </Button>
                            </label>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Naziv Kompanije"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        sx={{ mb: 2 }}
                                        InputProps={{ style: { color: colors.grey[100] } }}
                                        InputLabelProps={{ style: { color: colors.grey[100] } }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <InputLabel style={{ color: colors.grey[100] }}>Država</InputLabel>
                                        <Select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            sx={{ color: colors.grey[100] }}
                                        >
                                            <MenuItem value="rs">Srbija</MenuItem>
                                            <MenuItem value="hr">Hrvatska</MenuItem>
                                            <MenuItem value="ba">Bosna</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <InputLabel style={{ color: colors.grey[100] }}>Grad</InputLabel>
                                        <Select
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            sx={{ color: colors.grey[100] }}
                                        >
                                            <MenuItem value="beograd">Beograd</MenuItem>
                                            <MenuItem value="novi-sad">Novi Sad</MenuItem>
                                            <MenuItem value="banja-luka">Banja Luka</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Okrug"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        sx={{ mb: 2 }}
                                        InputProps={{ style: { color: colors.grey[100] } }}
                                        InputLabelProps={{ style: { color: colors.grey[100] } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Adresa"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        sx={{ mb: 2 }}
                                        InputProps={{ style: { color: colors.grey[100] } }}
                                        InputLabelProps={{ style: { color: colors.grey[100] } }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>

                {/* Kontakt Informacije */}
                <Box
                    p="20px"
                    borderRadius="4px"
                    sx={{
                        backgroundColor: colors.primary[400],
                        minHeight: "30vh"
                    }}
                >
                    <Typography variant="h3" sx={{ mb: "20px", fontSize: isMobile ? "20px" : "24px" }}>
                        Kontakt Informacije
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                                InputProps={{ style: { color: colors.grey[100] } }}
                                InputLabelProps={{ style: { color: colors.grey[100] } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Telefon"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                                InputProps={{ style: { color: colors.grey[100] } }}
                                InputLabelProps={{ style: { color: colors.grey[100] } }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Podešavanja Pretplate */}
                <Box
                    p="20px"
                    borderRadius="4px"
                    sx={{
                        backgroundColor: colors.primary[400],
                        minHeight: "30vh"
                    }}
                >
                    <Typography variant="h3" sx={{ mb: "20px", fontSize: isMobile ? "20px" : "24px" }}>
                        Podešavanja Pretplate
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel style={{ color: colors.grey[100] }}>Tip podrške</InputLabel>
                                <Select
                                    name="supportType"
                                    value={formData.supportType}
                                    onChange={handleChange}
                                    sx={{ color: colors.grey[100] }}
                                >
                                    <MenuItem value="24/7">24/7 Podrška</MenuItem>
                                    <MenuItem value="business">Radno vreme</MenuItem>
                                    <MenuItem value="standard">Standardna podrška</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Broj profila"
                                name="numProfiles"
                                type="number"
                                value={formData.numProfiles}
                                onChange={handleChange}
                                InputProps={{ inputProps: { min: 1, max: 50 } }}
                                InputLabelProps={{ style: { color: colors.grey[100] } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel style={{ color: colors.grey[100] }}>Veličina paketa</InputLabel>
                                <Select
                                    name="packageSize"
                                    value={formData.packageSize}
                                    onChange={handleChange}
                                    sx={{ color: colors.grey[100] }}
                                >
                                    <MenuItem value="small">Mali paket (10GB)</MenuItem>
                                    <MenuItem value="medium">Srednji paket (50GB)</MenuItem>
                                    <MenuItem value="large">Veliki paket (100GB)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>

                {/* Načini Plaćanja */}
                <Box
                    p="20px"
                    borderRadius="4px"
                    sx={{
                        backgroundColor: colors.primary[400],
                        minHeight: "40vh"
                    }}
                >
                    <Typography variant="h3" sx={{ mb: "20px", fontSize: isMobile ? "20px" : "24px" }}>
                        Načini Plaćanja
                    </Typography>

                    <List dense>
                        {formData.paymentMethods.map((method) => (
                            <ListItem
                                key={method.id}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        onClick={() => removePaymentMethod(method.id)}
                                        sx={{ color: colors.redAccent[500] }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                }
                                sx={{
                                    border: `1px solid ${colors.grey[700]}`,
                                    mb: 1,
                                    borderRadius: "4px"
                                }}
                            >
                                <Radio
                                    checked={method.isDefault}
                                    onChange={() => setDefaultPayment(method.id)}
                                    color="secondary"
                                />
                                <ListItemText
                                    primary={method.details}
                                    sx={{ color: colors.grey[100] }}
                                />
                            </ListItem>
                        ))}
                    </List>

                    {addingPayment ? (
                        <Box sx={{ mt: 2 }}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel style={{ color: colors.grey[100] }}>Tip plaćanja</InputLabel>
                                <Select
                                    name="type"
                                    value={formData.newPayment.type}
                                    onChange={handlePaymentChange}
                                    sx={{ color: colors.grey[100] }}
                                >
                                    <MenuItem value="bank">Bankovni račun</MenuItem>
                                    <MenuItem value="card">Kreditna kartica</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label={formData.newPayment.type === "bank" ? "Broj računa" : "Broj kartice"}
                                name="details"
                                value={formData.newPayment.details}
                                onChange={handlePaymentChange}
                                sx={{ mb: 2 }}
                                InputProps={{ style: { color: colors.grey[100] } }}
                                InputLabelProps={{ style: { color: colors.grey[100] } }}
                            />

                            <Button
                                variant="contained"
                                onClick={addPaymentMethod}
                                sx={{ mr: 2 }}
                                color="secondary"
                            >
                                Dodaj
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setAddingPayment(false)}
                                color="secondary"
                            >
                                Otkaži
                            </Button>
                        </Box>
                    ) : (
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => setAddingPayment(true)}
                            color="secondary"
                        >
                            Dodaj novi način plaćanja
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default CompanySettings;