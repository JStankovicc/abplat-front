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
    useTheme,
    useMediaQuery
} from "@mui/material";
import { tokens } from "../../theme";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

// Mock podaci za tim
const mockTeamData = [
    {
        id: 1,
        name: "Marko Petrović",
        role: "Menadžer prodaje",
        email: "marko.petrovic@abplat.com",
        phone: "+381 64 123 4567",
        status: "Aktivan"
    },
    {
        id: 2,
        name: "Ana Jovanović",
        role: "Prodajni predstavnik",
        email: "ana.jovanovic@abplat.com",
        phone: "+381 64 234 5678",
        status: "Aktivan"
    },
    {
        id: 3,
        name: "Stefan Nikolić",
        role: "Prodajni predstavnik",
        email: "stefan.nikolic@abplat.com",
        phone: "+381 64 345 6789",
        status: "Neaktivan"
    }
];

const TeamManagement = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");
    const [teamData, setTeamData] = useState(mockTeamData);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        email: "",
        phone: "",
        status: "Aktivan"
    });

    const handleOpenDialog = (member = null) => {
        if (member) {
            setSelectedMember(member);
            setFormData(member);
        } else {
            setSelectedMember(null);
            setFormData({
                name: "",
                role: "",
                email: "",
                phone: "",
                status: "Aktivan"
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedMember(null);
    };

    const handleSubmit = () => {
        if (selectedMember) {
            setTeamData(teamData.map(member => 
                member.id === selectedMember.id ? { ...formData, id: member.id } : member
            ));
        } else {
            setTeamData([...teamData, { ...formData, id: teamData.length + 1 }]);
        }
        handleCloseDialog();
    };

    const handleDelete = (id) => {
        setTeamData(teamData.filter(member => member.id !== id));
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5" color={colors.grey[100]}>
                    Upravljanje timom
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
                    Dodaj člana
                </Button>
            </Box>

            <Grid container spacing={2}>
                {teamData.map((member) => (
                    <Grid item xs={12} md={6} key={member.id}>
                        <Paper
                            sx={{
                                p: 2,
                                backgroundColor: colors.primary[600],
                                color: colors.grey[100]
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="h6">{member.name}</Typography>
                                <Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenDialog(member)}
                                        sx={{ color: colors.grey[100] }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(member.id)}
                                        sx={{ color: colors.redAccent[500] }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Typography variant="body2" color={colors.grey[300]}>
                                {member.role}
                            </Typography>
                            <Typography variant="body2" color={colors.grey[300]}>
                                {member.email}
                            </Typography>
                            <Typography variant="body2" color={colors.grey[300]}>
                                {member.phone}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: member.status === "Aktivan" ? colors.greenAccent[500] : colors.redAccent[500],
                                    mt: 1
                                }}
                            >
                                {member.status}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {selectedMember ? "Izmeni člana tima" : "Dodaj novog člana"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Ime i prezime"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Uloga"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Telefon"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Otkaži</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedMember ? "Sačuvaj" : "Dodaj"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TeamManagement; 