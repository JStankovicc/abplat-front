import { useState, useEffect } from "react";
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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    useTheme,
    useMediaQuery,
    CircularProgress,
    Alert,
    Avatar
} from "@mui/material";
import axios from "axios";
import { tokens } from "../../theme";
import { 
    Add as AddIcon, 
    Edit as EditIcon, 
    Delete as DeleteIcon,
    Person as PersonIcon,
    Group as GroupIcon,
    Share as ShareIcon
} from "@mui/icons-material";

// API konstante
const API_BASE_URL = "http://3.73.118.83:8080/api/v1/team";

// Helper funkcija za auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};

const TeamManagement = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");
    const [teamsData, setTeamsData] = useState([]);
    const [openTeamDialog, setOpenTeamDialog] = useState(false);
    const [openMemberDialog, setOpenMemberDialog] = useState(false);
    const [openShareDialog, setOpenShareDialog] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [teamFormData, setTeamFormData] = useState({
        name: "",
        description: ""
    });
    const [memberFormData, setMemberFormData] = useState({
        name: "",
        role: "",
        email: "",
        phone: "",
        status: "Aktivan"
    });
    const [shareFormData, setShareFormData] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [teamToDelete, setTeamToDelete] = useState(null);
    
    // Loading i error states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // API funkcije
    const fetchTeams = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(`${API_BASE_URL}/getAllSalesTeams`, {
                headers: getAuthHeaders()
            });

            console.log('Teams response:', response.data);
            
            // Transformišemo response u format koji komponenta očekuje
            const transformedTeams = response.data.map((team, index) => ({
                id: index + 1,
                name: team.name,
                description: team.description,
                department: team.department,
                members: team.users.map((user, userIndex) => ({
                    id: userIndex + 1,
                    name: user.displayName || user.name,
                    displayName: user.displayName,
                    profilePic: user.profilePic,
                    role: "Član tima", // Default uloga jer nije u response-u
                    email: "", // Nema u response-u
                    phone: "", // Nema u response-u
                    status: "Aktivan" // Default status
                })),
                sharedLists: [] // Dodajemo prazan niz za kompatibilnost
            }));
            
            setTeamsData(transformedTeams);
            
        } catch (error) {
            console.error('Failed to fetch teams:', error);
            setError('Greška pri učitavanju timova');
            setTeamsData([]);
        } finally {
            setLoading(false);
        }
    };

    // useEffect za inicijalno učitavanje
    useEffect(() => {
        fetchTeams();
    }, []);

    const handleOpenTeamDialog = (team = null) => {
        if (team) {
            setSelectedTeam(team);
            setTeamFormData({
                name: team.name,
                description: team.description
            });
        } else {
            setSelectedTeam(null);
            setTeamFormData({
                name: "",
                description: ""
            });
        }
        setOpenTeamDialog(true);
    };

    const handleOpenMemberDialog = (team, member = null) => {
        setSelectedTeam(team);
        if (member) {
            setSelectedMember(member);
            setMemberFormData(member);
        } else {
            setSelectedMember(null);
            setMemberFormData({
                name: "",
                role: "",
                email: "",
                phone: "",
                status: "Aktivan"
            });
        }
        setOpenMemberDialog(true);
    };

    const handleOpenShareDialog = (team) => {
        setSelectedTeam(team);
        setShareFormData(team.sharedLists);
        setOpenShareDialog(true);
    };

    const handleCloseTeamDialog = () => {
        setOpenTeamDialog(false);
        setSelectedTeam(null);
    };

    const handleCloseMemberDialog = () => {
        setOpenMemberDialog(false);
        setSelectedMember(null);
    };

    const handleCloseShareDialog = () => {
        setOpenShareDialog(false);
        setSelectedTeam(null);
    };

    const handleTeamSubmit = () => {
        if (selectedTeam) {
            setTeamsData(teamsData.map(team => 
                team.id === selectedTeam.id 
                    ? { ...team, ...teamFormData }
                    : team
            ));
        } else {
            setTeamsData([...teamsData, {
                id: teamsData.length + 1,
                ...teamFormData,
                members: [],
                sharedLists: []
            }]);
        }
        handleCloseTeamDialog();
    };

    const handleMemberSubmit = () => {
        if (selectedMember) {
            setTeamsData(teamsData.map(team => 
                team.id === selectedTeam.id
                    ? {
                        ...team,
                        members: team.members.map(member =>
                            member.id === selectedMember.id
                                ? { ...member, ...memberFormData }
                                : member
                        )
                    }
                    : team
            ));
        } else {
            setTeamsData(teamsData.map(team => 
                team.id === selectedTeam.id
                    ? {
                        ...team,
                        members: [...team.members, {
                            id: team.members.length + 1,
                            ...memberFormData,
                            assignedLeads: [],
                            assignedContacts: []
                        }]
                    }
                    : team
            ));
        }
        handleCloseMemberDialog();
    };

    const handleShareSubmit = () => {
        setTeamsData(teamsData.map(team => 
            team.id === selectedTeam.id
                ? {
                    ...team,
                    sharedLists: shareFormData
                }
                : team
        ));
        handleCloseShareDialog();
    };

    const handleToggleList = (listId) => {
        setShareFormData(prev => 
            prev.includes(listId)
                ? prev.filter(id => id !== listId)
                : [...prev, listId]
        );
    };

    const handleDeleteTeam = (teamId) => {
        setTeamToDelete(teamId);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        setTeamsData(teamsData.filter(team => team.id !== teamToDelete));
        setOpenDeleteDialog(false);
        setTeamToDelete(null);
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
        setTeamToDelete(null);
    };

    const handleDeleteMember = (teamId, memberId) => {
        setTeamsData(teamsData.map(team => 
            team.id === teamId
                ? {
                    ...team,
                    members: team.members.filter(member => member.id !== memberId)
                }
                : team
        ));
    };

    return (
        <Box>
            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5" color={colors.grey[100]}>
                    Upravljanje timovima
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => fetchTeams()}
                        disabled={loading}
                        sx={{
                            borderColor: colors.greenAccent[500],
                            color: colors.greenAccent[500],
                            "&:hover": {
                                borderColor: colors.greenAccent[600],
                                backgroundColor: colors.greenAccent[500] + '20'
                            }
                        }}
                    >
                        {loading ? <CircularProgress size={20} /> : "Osveži"}
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenTeamDialog()}
                        sx={{
                            backgroundColor: colors.greenAccent[500],
                            "&:hover": {
                                backgroundColor: colors.greenAccent[600]
                            }
                        }}
                    >
                        Dodaj tim
                    </Button>
                </Box>
            </Box>

            {/* Loading indicator */}
            {loading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            )}

            <Grid container spacing={2}>
                {teamsData.map((team) => (
                    <Grid item xs={12} key={team.id}>
                        <Paper
                            sx={{
                                p: 2,
                                backgroundColor: colors.primary[600],
                                color: colors.grey[100]
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Box>
                                    <Typography variant="h6">{team.name}</Typography>
                                    <Typography variant="body2" color={colors.grey[300]}>
                                        {team.description}
                                    </Typography>
                                    {team.department && (
                                        <Typography variant="body2" color={colors.grey[400]} sx={{ mt: 0.5 }}>
                                            Departman: {team.department}
                                        </Typography>
                                    )}
                                </Box>
                                <Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenTeamDialog(team)}
                                        sx={{ color: colors.grey[100] }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDeleteTeam(team.id)}
                                        sx={{ color: colors.redAccent[500] }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>

                                </Box>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    Članovi tima
                                </Typography>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ color: colors.grey[100] }}>Profil</TableCell>
                                                <TableCell sx={{ color: colors.grey[100] }}>Ime</TableCell>
                                                <TableCell sx={{ color: colors.grey[100] }}>Uloga</TableCell>
                                                <TableCell sx={{ color: colors.grey[100] }}>Status</TableCell>
                                                <TableCell sx={{ color: colors.grey[100] }}>Akcije</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {team.members.map((member) => (
                                                <TableRow key={member.id}>
                                                    <TableCell>
                                                        <Avatar
                                                            src={member.profilePic ? `data:image/jpeg;base64,${member.profilePic}` : undefined}
                                                            sx={{
                                                                width: 32,
                                                                height: 32,
                                                                bgcolor: colors.blueAccent[500]
                                                            }}
                                                        >
                                                            {!member.profilePic && member.name ? member.name.split(' ').map(n => n[0]).join('') : '?'}
                                                        </Avatar>
                                                    </TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>{member.name}</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>{member.role}</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>
                                                        <Chip
                                                            label={member.status}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: member.status === "Aktivan" 
                                                                    ? colors.greenAccent[500] 
                                                                    : colors.redAccent[500],
                                                                color: colors.grey[100]
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenMemberDialog(team, member)}
                                                            sx={{ color: colors.grey[100] }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteMember(team.id, member.id)}
                                                            sx={{ color: colors.redAccent[500] }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Button
                                    startIcon={<PersonIcon />}
                                    onClick={() => handleOpenMemberDialog(team)}
                                    sx={{ mt: 1 }}
                                >
                                    Dodaj člana
                                </Button>
                            </Box>


                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog za tim */}
            <Dialog open={openTeamDialog} onClose={handleCloseTeamDialog}>
                <DialogTitle>
                    {selectedTeam ? "Izmeni tim" : "Dodaj novi tim"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Naziv tima"
                            value={teamFormData.name}
                            onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Opis"
                            value={teamFormData.description}
                            onChange={(e) => setTeamFormData({ ...teamFormData, description: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTeamDialog}>Otkaži</Button>
                    <Button onClick={handleTeamSubmit} variant="contained">
                        {selectedTeam ? "Sačuvaj" : "Dodaj"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog za člana tima */}
            <Dialog open={openMemberDialog} onClose={handleCloseMemberDialog}>
                <DialogTitle>
                    {selectedMember ? "Izmeni člana tima" : "Dodaj novog člana"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Ime i prezime"
                            value={memberFormData.name}
                            onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Uloga"
                            value={memberFormData.role}
                            onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            value={memberFormData.email}
                            onChange={(e) => setMemberFormData({ ...memberFormData, email: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Telefon"
                            value={memberFormData.phone}
                            onChange={(e) => setMemberFormData({ ...memberFormData, phone: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={memberFormData.status}
                                label="Status"
                                onChange={(e) => setMemberFormData({ ...memberFormData, status: e.target.value })}
                            >
                                <MenuItem value="Aktivan">Aktivan</MenuItem>
                                <MenuItem value="Neaktivan">Neaktivan</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseMemberDialog}>Otkaži</Button>
                    <Button onClick={handleMemberSubmit} variant="contained">
                        {selectedMember ? "Sačuvaj" : "Dodaj"}
                    </Button>
                </DialogActions>
            </Dialog>



            {/* Dialog za potvrdu brisanja tima */}
            <Dialog
                open={openDeleteDialog}
                onClose={handleCancelDelete}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Potvrda brisanja tima
                </DialogTitle>
                <DialogContent>
                    <Typography id="delete-dialog-description">
                        Da li ste sigurni da želite da obrišete ovaj tim? Ova akcija je nepovratna i obrisaće sve podatke vezane za tim.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Otkaži
                    </Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        color="error" 
                        variant="contained"
                        autoFocus
                    >
                        Obriši
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TeamManagement; 