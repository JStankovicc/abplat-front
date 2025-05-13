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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    useTheme,
    useMediaQuery
} from "@mui/material";
import { tokens } from "../../theme";
import { 
    Add as AddIcon, 
    Edit as EditIcon, 
    Delete as DeleteIcon,
    Person as PersonIcon,
    Group as GroupIcon,
    Share as ShareIcon
} from "@mui/icons-material";

// Mock podaci za liste klijenata
const mockClientLists = [
    {
        id: 1,
        name: "Glavni klijenti",
        description: "Lista najvažnijih klijenata",
        type: "contacts",
        count: 25
    },
    {
        id: 2,
        name: "Potencijalni klijenti",
        description: "Lista potencijalnih klijenata",
        type: "leads",
        count: 50
    },
    {
        id: 3,
        name: "Regionalni klijenti",
        description: "Klijenti iz regiona",
        type: "contacts",
        count: 15
    },
    {
        id: 4,
        name: "Novi potencijalni klijenti",
        description: "Lista novih potencijalnih klijenata",
        type: "leads",
        count: 30
    }
];

// Mock podaci za timove
const mockTeamsData = [
    {
        id: 1,
        name: "Tim A",
        description: "Glavni prodajni tim",
        members: [
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
            }
        ],
        sharedLists: [1, 2] // ID-jevi lista koje su deljene sa timom
    },
    {
        id: 2,
        name: "Tim B",
        description: "Regionalni tim",
        members: [
            {
                id: 3,
                name: "Stefan Nikolić",
                role: "Prodajni predstavnik",
                email: "stefan.nikolic@abplat.com",
                phone: "+381 64 345 6789",
                status: "Aktivan"
            }
        ],
        sharedLists: [3] // ID-jevi lista koje su deljene sa timom
    }
];

const mockContactsData = [
    { id: 1, name: "Marko Nikolić", company: "IT Solutions", type: "Klijent" },
    { id: 2, name: "Jovana Stanković", company: "Tech Innovations", type: "Partner" },
    { id: 3, name: "Stefan Petrović", company: "Digital Systems", type: "Klijent" }
];

const TeamManagement = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");
    const [teamsData, setTeamsData] = useState(mockTeamsData);
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
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5" color={colors.grey[100]}>
                    Upravljanje timovima
                </Typography>
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
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenShareDialog(team)}
                                        sx={{ color: colors.grey[100] }}
                                    >
                                        <ShareIcon />
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
                                                <TableCell sx={{ color: colors.grey[100] }}>Ime</TableCell>
                                                <TableCell sx={{ color: colors.grey[100] }}>Uloga</TableCell>
                                                <TableCell sx={{ color: colors.grey[100] }}>Email</TableCell>
                                                <TableCell sx={{ color: colors.grey[100] }}>Status</TableCell>
                                                <TableCell sx={{ color: colors.grey[100] }}>Akcije</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {team.members.map((member) => (
                                                <TableRow key={member.id}>
                                                    <TableCell sx={{ color: colors.grey[100] }}>{member.name}</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>{member.role}</TableCell>
                                                    <TableCell sx={{ color: colors.grey[100] }}>{member.email}</TableCell>
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

                            <Box>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    Deljene liste
                                </Typography>
                                <Grid container spacing={1}>
                                    {mockClientLists
                                        .filter(list => team.sharedLists.includes(list.id))
                                        .map(list => (
                                            <Grid item xs={12} md={6} key={list.id}>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    backgroundColor: colors.primary[500],
                                                    p: 1,
                                                    borderRadius: 1
                                                }}>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Typography variant="body2" color={colors.grey[100]}>
                                                            {list.name}
                                                        </Typography>
                                                        <Typography variant="body2" color={colors.grey[300]}>
                                                            {list.count} klijenata
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={list.type === 'leads' ? 'Potencijalni klijenti' : 'Kontakti'}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: list.type === 'leads' 
                                                                ? colors.blueAccent[500] 
                                                                : colors.greenAccent[500],
                                                            color: colors.grey[100]
                                                        }}
                                                    />
                                                </Box>
                                            </Grid>
                                        ))}
                                </Grid>
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

            {/* Dialog za deljenje resursa */}
            <Dialog open={openShareDialog} onClose={handleCloseShareDialog}>
                <DialogTitle>Deljenje lista klijenata</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            Izaberite liste koje želite da podelite sa timom:
                        </Typography>
                        <Grid container spacing={2}>
                            {mockClientLists.map((list) => (
                                <Grid item xs={12} key={list.id}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            backgroundColor: colors.primary[500],
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="body1" color={colors.grey[100]}>
                                                {list.name}
                                            </Typography>
                                            <Typography variant="body2" color={colors.grey[300]}>
                                                {list.description}
                                            </Typography>
                                            <Typography variant="body2" color={colors.grey[300]}>
                                                Broj klijenata: {list.count}
                                            </Typography>
                                        </Box>
                                        <Button
                                            variant={shareFormData.includes(list.id) ? "contained" : "outlined"}
                                            onClick={() => handleToggleList(list.id)}
                                            sx={{
                                                backgroundColor: shareFormData.includes(list.id) 
                                                    ? colors.greenAccent[500] 
                                                    : 'transparent',
                                                '&:hover': {
                                                    backgroundColor: shareFormData.includes(list.id) 
                                                        ? colors.greenAccent[600] 
                                                        : colors.primary[600]
                                                }
                                            }}
                                        >
                                            {shareFormData.includes(list.id) ? "Deljeno" : "Podeli"}
                                        </Button>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseShareDialog}>Otkaži</Button>
                    <Button onClick={handleShareSubmit} variant="contained">
                        Sačuvaj
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