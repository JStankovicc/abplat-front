import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    MenuItem,
    useTheme
} from "@mui/material";
import { tokens } from "../../../theme";
import { useState } from "react";

const statusOptions = [
    { value: "Aktivan", label: "Aktivan" },
    { value: "Neaktivan", label: "Neaktivan" },
    { value: "Potencijalan", label: "Potencijalan" }
];

const AddLeadModal = ({ open, onClose, onAdd }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formData, setFormData] = useState({
        ime: "",
        email: "",
        status: "Potencijalan"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData({
            ime: "",
            email: "",
            status: "Potencijalan"
        });
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: colors.primary[400],
                    color: colors.grey[100]
                }
            }}
        >
            <DialogTitle>Dodaj novi kontakt</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            name="ime"
                            label="Ime"
                            value={formData.ime}
                            onChange={handleChange}
                            required
                            fullWidth
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: colors.primary[600]
                                }
                            }}
                        />
                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            fullWidth
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: colors.primary[600]
                                }
                            }}
                        />
                        <TextField
                            name="status"
                            select
                            label="Status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                            fullWidth
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: colors.primary[600]
                                }
                            }}
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={onClose}
                        sx={{
                            color: colors.grey[100],
                            "&:hover": {
                                backgroundColor: colors.primary[500]
                            }
                        }}
                    >
                        Otkaži
                    </Button>
                    <Button 
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: colors.greenAccent[500],
                            "&:hover": {
                                backgroundColor: colors.greenAccent[600]
                            }
                        }}
                    >
                        Dodaj
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddLeadModal; 