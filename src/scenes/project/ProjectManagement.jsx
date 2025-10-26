import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    useTheme,
    Chip,
    Avatar,
    AvatarGroup,
    Tooltip,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    CircularProgress
} from "@mui/material";
import { tokens } from "../../theme";
import { API_BASE_URL } from "../../config/apiConfig";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";

const ProjectManagement = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();

    // State za projekte
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // State za dijaloge
    const [openNewProject, setOpenNewProject] = useState(false);
    const [openEditProject, setOpenEditProject] = useState(false);
    const [openDeleteProject, setOpenDeleteProject] = useState(false);
    const [openTeamManagement, setOpenTeamManagement] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    
    // State za listu dostupnih radnika
    const [availableWorkers, setAvailableWorkers] = useState([]);

    // State za novi projekat
    const [newProject, setNewProject] = useState({
        name: "",
        description: "",
        startDate: new Date().toISOString().split('T')[0], // Današnji datum kao default
        endDate: "",
        team: []
    });

    // Handlers za dijaloge
    const handleOpenNewProject = () => setOpenNewProject(true);
    const handleCloseNewProject = () => setOpenNewProject(false);
    const handleOpenEditProject = (project) => {
        setSelectedProject(project);
        setOpenEditProject(true);
    };
    const handleCloseEditProject = () => setOpenEditProject(false);
    const handleOpenDeleteProject = (project) => {
        setSelectedProject(project);
        setOpenDeleteProject(true);
    };
    const handleCloseDeleteProject = () => setOpenDeleteProject(false);
    const handleOpenTeamManagement = (project) => {
        setSelectedProject(project);
        setOpenTeamManagement(true);
        fetchAvailableWorkers(project.id); // Učitaj dostupne radnike kada se otvori dialog
    };
    const handleCloseTeamManagement = () => setOpenTeamManagement(false);

    // Učitavanje projekata pri prvom renderovanju
    useEffect(() => {
        fetchProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Funkcija za učitavanje svih projekata
    const fetchProjects = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                toast.error("Niste prijavljeni. Molimo vas da se prijavite.", {
                    position: "bottom-right",
                    autoClose: 5000,
                });
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `${API_BASE_URL}/project/allByCompany`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Mapiranje projekata sa backend-a u format koji koristi frontend
            const mappedProjects = response.data.map(project => ({
                id: project.id,
                name: project.name,
                description: project.description,
                status: determineProjectStatus(project),
                startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : null,
                endDate: project.updatedAt ? new Date(project.updatedAt).toISOString().split('T')[0] : null,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                note: project.note,
                team: project.users ? project.users.map(user => ({
                    id: user.id,
                    name: user.displayName || 'Nepoznat korisnik',
                    avatar: user.profilePic ? `data:image/jpeg;base64,${convertProfilePicToBase64(user.profilePic)}` : "../../assets/testSpiderman.png"
                })) : []
            }));

            setProjects(mappedProjects);
            setLoading(false);
        } catch (error) {
            console.error("Greška pri učitavanju projekata:", error);
            toast.error(
                error.response?.data?.message || "Došlo je do greške pri učitavanju projekata.",
                {
                    position: "bottom-right",
                    autoClose: 5000,
                }
            );
            setLoading(false);
        }
    };

    // Helper funkcija za određivanje statusa projekta
    const determineProjectStatus = (project) => {
        // Možete prilagoditi logiku određivanja statusa prema vašim potrebama
        if (project.startDate) {
            const startDate = new Date(project.startDate);
            const today = new Date();
            
            if (startDate > today) {
                return "Planiran";
            } else {
                return "U toku";
            }
        }
        return "Aktivan";
    };

    // Helper funkcija za formatiranje datuma u dd/mm/yyyy format
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Helper funkcija za konverziju byte array-a u Base64 string
    const convertProfilePicToBase64 = (profilePic) => {
        if (!profilePic || profilePic.length === 0) return null;
        
        // Ako je već string (Base64), vrati ga
        if (typeof profilePic === 'string') return profilePic;
        
        // Ako je array of bytes, konvertuj u Base64
        if (Array.isArray(profilePic)) {
            const binary = profilePic.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
            return btoa(binary);
        }
        
        return null;
    };

    // Funkcija za učitavanje dostupnih radnika
    const fetchAvailableWorkers = async (projectId) => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                toast.error("Niste prijavljeni. Molimo vas da se prijavite.", {
                    position: "bottom-right",
                    autoClose: 5000,
                });
                return;
            }

            // Ako postoji projectId, dodaj ga kao query parametar
            const url = projectId 
                ? `${API_BASE_URL}/company/getAllCompanyProjectWorkersNotOnProject?projectId=${projectId}`
                : `${API_BASE_URL}/company/getAllCompanyProjectWorkersNotOnProject`;

            const response = await axios.get(
                url,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setAvailableWorkers(response.data);
        } catch (error) {
            console.error("Greška pri učitavanju radnika:", error);
            
            // Detaljnije logovanje greške
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
            }
            
            toast.error(
                error.response?.data?.message || "Došlo je do greške pri učitavanju radnika.",
                {
                    position: "bottom-right",
                    autoClose: 5000,
                }
            );
        }
    };

    // Handler za menu
    const handleMenuClick = (event, project) => {
        setAnchorEl(event.currentTarget);
        setSelectedProject(project);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedProject(null);
    };

    // Handlers za akcije
    const handleCreateProject = async () => {
        try {
            // Validacija polja
            if (!newProject.name || !newProject.name.trim()) {
                toast.error("Naziv projekta je obavezan!", {
                    position: "bottom-right",
                    autoClose: 3000,
                });
                return;
            }

            // Preuzimanje JWT tokena iz localStorage
            const token = localStorage.getItem('token');
            
            if (!token) {
                toast.error("Niste prijavljeni. Molimo vas da se prijavite.", {
                    position: "bottom-right",
                    autoClose: 5000,
                });
                return;
            }

            // Formatiranje datuma za backend (ako postoji)
            const projectData = {
                name: newProject.name,
                description: newProject.description,
                startDate: newProject.startDate ? new Date(newProject.startDate) : null
            };

            // Slanje POST zahteva
            const response = await axios.post(
                `${API_BASE_URL}/project/add`,
                projectData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.success("Projekat je uspešno kreiran!", {
                position: "bottom-right",
                autoClose: 3000,
            });

            // Osveži listu projekata sa backend-a
            await fetchProjects();

            handleCloseNewProject();
            setNewProject({
                name: "",
                description: "",
                startDate: new Date().toISOString().split('T')[0], // Reset na današnji datum
                endDate: "",
                team: []
            });
        } catch (error) {
            console.error("Greška pri kreiranju projekta:", error);
            toast.error(
                error.response?.data?.message || "Došlo je do greške pri kreiranju projekta. Molimo pokušajte ponovo.",
                {
                    position: "bottom-right",
                    autoClose: 5000,
                }
            );
        }
    };

    const handleEditProject = () => {
        const updatedProjects = projects.map(project =>
            project.id === selectedProject.id ? selectedProject : project
        );
        setProjects(updatedProjects);
        handleCloseEditProject();
    };

    const handleDeleteProject = () => {
        const updatedProjects = projects.filter(project => project.id !== selectedProject.id);
        setProjects(updatedProjects);
        handleCloseDeleteProject();
    };

    const handleNavigateToProject = (projectId) => {
        navigate(`/project/${projectId}`);
    };

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ mb: "5px" }}>
                    UPRAVLJANJE PROJEKTIMA
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenNewProject}
                    sx={{
                        backgroundColor: colors.blueAccent[500],
                        color: colors.grey[100],
                        '&:hover': {
                            backgroundColor: colors.blueAccent[600]
                        }
                    }}
                >
                    Novi Projekat
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 3, backgroundColor: colors.primary[400] }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: colors.grey[100] }}>Naziv Projekta</TableCell>
                            <TableCell sx={{ color: colors.grey[100] }}>Status</TableCell>
                            <TableCell sx={{ color: colors.grey[100] }}>Tim</TableCell>
                            <TableCell sx={{ color: colors.grey[100] }}>Trajanje Projekta</TableCell>
                            <TableCell sx={{ color: colors.grey[100] }}>Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                    <CircularProgress sx={{ color: colors.blueAccent[500] }} />
                                    <Typography variant="h6" sx={{ mt: 2, color: colors.grey[100] }}>
                                        Učitavanje projekata...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : projects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                                    <Typography variant="h6" sx={{ color: colors.grey[300] }}>
                                        Nemate kreiranih projekata.
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: colors.grey[400], mt: 1 }}>
                                        Kliknite na "Novi Projekat" da kreirate svoj prvi projekat.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            projects.map((project) => (
                                <TableRow key={project.id} hover>
                                    <TableCell 
                                        sx={{ 
                                            color: colors.grey[100],
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleNavigateToProject(project.id)}
                                    >
                                        {project.name}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={project.status}
                                            color={project.status === "Aktivan" ? "success" : "warning"}
                                            sx={{ color: colors.grey[100] }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'left' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                            <AvatarGroup max={3}>
                                                {project.team.map((member) => (
                                                    <Tooltip key={member.id} title={member.name}>
                                                        <Avatar src={member.avatar} />
                                                    </Tooltip>
                                                ))}
                                            </AvatarGroup>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: colors.grey[100] }}>
                                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={(e) => handleMenuClick(e, project)}>
                                            <MoreVertIcon sx={{ color: colors.grey[100] }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Menu za akcije */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        backgroundColor: colors.primary[400],
                        color: colors.grey[100]
                    }
                }}
            >
                <MenuItem onClick={() => {
                    handleMenuClose();
                    handleOpenEditProject(selectedProject);
                }}>
                    <ListItemIcon>
                        <EditIcon sx={{ color: colors.grey[100] }} />
                    </ListItemIcon>
                    <ListItemText>Izmeni Projekat</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleMenuClose();
                    handleOpenTeamManagement(selectedProject);
                }}>
                    <ListItemIcon>
                        <PeopleIcon sx={{ color: colors.grey[100] }} />
                    </ListItemIcon>
                    <ListItemText>Upravljaj Timom</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleMenuClose();
                    handleOpenDeleteProject(selectedProject);
                }}>
                    <ListItemIcon>
                        <DeleteIcon sx={{ color: colors.grey[100] }} />
                    </ListItemIcon>
                    <ListItemText>Obriši Projekat</ListItemText>
                </MenuItem>
            </Menu>

            {/* Dialog za novi projekat */}
            <Dialog 
                open={openNewProject} 
                onClose={handleCloseNewProject}
                PaperProps={{
                    sx: {
                        backgroundColor: colors.primary[400],
                        color: colors.grey[100]
                    }
                }}
            >
                <DialogTitle>Novi Projekat</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Naziv Projekta"
                        fullWidth
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        sx={{
                            '& .MuiInputLabel-root': { color: colors.grey[100] },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: colors.grey[700] },
                                '&:hover fieldset': { borderColor: colors.grey[600] },
                                '&.Mui-focused fieldset': { borderColor: colors.blueAccent[500] },
                                color: colors.grey[100]
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="Opis"
                        fullWidth
                        multiline
                        rows={4}
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        sx={{
                            '& .MuiInputLabel-root': { color: colors.grey[100] },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: colors.grey[700] },
                                '&:hover fieldset': { borderColor: colors.grey[600] },
                                '&.Mui-focused fieldset': { borderColor: colors.blueAccent[500] },
                                color: colors.grey[100]
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="Datum Početka"
                        type="date"
                        fullWidth
                        value={newProject.startDate}
                        onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            '& .MuiInputLabel-root': { color: colors.grey[100] },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: colors.grey[700] },
                                '&:hover fieldset': { borderColor: colors.grey[600] },
                                '&.Mui-focused fieldset': { borderColor: colors.blueAccent[500] },
                                color: colors.grey[100]
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="Datum Završetka"
                        type="date"
                        fullWidth
                        value={newProject.endDate}
                        onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            '& .MuiInputLabel-root': { color: colors.grey[100] },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: colors.grey[700] },
                                '&:hover fieldset': { borderColor: colors.grey[600] },
                                '&.Mui-focused fieldset': { borderColor: colors.blueAccent[500] },
                                color: colors.grey[100]
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseNewProject} sx={{ color: colors.grey[100] }}>
                        Otkaži
                    </Button>
                    <Button 
                        onClick={handleCreateProject}
                        sx={{ 
                            backgroundColor: colors.blueAccent[500],
                            color: colors.grey[100],
                            '&:hover': {
                                backgroundColor: colors.blueAccent[600]
                            }
                        }}
                    >
                        Kreiraj
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog za brisanje projekta */}
            <Dialog
                open={openDeleteProject}
                onClose={handleCloseDeleteProject}
                PaperProps={{
                    sx: {
                        backgroundColor: colors.primary[400],
                        color: colors.grey[100]
                    }
                }}
            >
                <DialogTitle>Obriši Projekat</DialogTitle>
                <DialogContent>
                    <Typography>
                        Da li ste sigurni da želite da obrišete projekat "{selectedProject?.name}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteProject} sx={{ color: colors.grey[100] }}>
                        Otkaži
                    </Button>
                    <Button 
                        onClick={handleDeleteProject}
                        sx={{ 
                            backgroundColor: colors.redAccent[500],
                            color: colors.grey[100],
                            '&:hover': {
                                backgroundColor: colors.redAccent[600]
                            }
                        }}
                    >
                        Obriši
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog za izmenu projekta */}
            <Dialog
                open={openEditProject}
                onClose={handleCloseEditProject}
                PaperProps={{
                    sx: {
                        backgroundColor: colors.primary[400],
                        color: colors.grey[100]
                    }
                }}
            >
                <DialogTitle>Izmeni Projekat</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Naziv Projekta"
                        fullWidth
                        value={selectedProject?.name || ""}
                        onChange={(e) => setSelectedProject({ ...selectedProject, name: e.target.value })}
                        sx={{
                            '& .MuiInputLabel-root': { color: colors.grey[100] },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: colors.grey[700] },
                                '&:hover fieldset': { borderColor: colors.grey[600] },
                                '&.Mui-focused fieldset': { borderColor: colors.blueAccent[500] },
                                color: colors.grey[100]
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="Opis"
                        fullWidth
                        multiline
                        rows={4}
                        value={selectedProject?.description || ""}
                        onChange={(e) => setSelectedProject({ ...selectedProject, description: e.target.value })}
                        sx={{
                            '& .MuiInputLabel-root': { color: colors.grey[100] },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: colors.grey[700] },
                                '&:hover fieldset': { borderColor: colors.grey[600] },
                                '&.Mui-focused fieldset': { borderColor: colors.blueAccent[500] },
                                color: colors.grey[100]
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="Status"
                        fullWidth
                        select
                        value={selectedProject?.status || ""}
                        onChange={(e) => setSelectedProject({ ...selectedProject, status: e.target.value })}
                        SelectProps={{
                            native: true,
                            sx: {
                                '& .MuiSelect-select': { color: colors.grey[100] },
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.grey[700] },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.grey[600] },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.blueAccent[500] }
                            }
                        }}
                    >
                        <option value="Aktivan">Aktivan</option>
                        <option value="U toku">U toku</option>
                        <option value="Završen">Završen</option>
                        <option value="Obustavljen">Obustavljen</option>
                    </TextField>
                    <TextField
                        margin="dense"
                        label="Datum Početka"
                        type="date"
                        fullWidth
                        value={selectedProject?.startDate || ""}
                        onChange={(e) => setSelectedProject({ ...selectedProject, startDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            '& .MuiInputLabel-root': { color: colors.grey[100] },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: colors.grey[700] },
                                '&:hover fieldset': { borderColor: colors.grey[600] },
                                '&.Mui-focused fieldset': { borderColor: colors.blueAccent[500] },
                                color: colors.grey[100]
                            }
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="Datum Završetka"
                        type="date"
                        fullWidth
                        value={selectedProject?.endDate || ""}
                        onChange={(e) => setSelectedProject({ ...selectedProject, endDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            '& .MuiInputLabel-root': { color: colors.grey[100] },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: colors.grey[700] },
                                '&:hover fieldset': { borderColor: colors.grey[600] },
                                '&.Mui-focused fieldset': { borderColor: colors.blueAccent[500] },
                                color: colors.grey[100]
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditProject} sx={{ color: colors.grey[100] }}>
                        Otkaži
                    </Button>
                    <Button 
                        onClick={handleEditProject}
                        sx={{ 
                            backgroundColor: colors.blueAccent[500],
                            color: colors.grey[100],
                            '&:hover': {
                                backgroundColor: colors.blueAccent[600]
                            }
                        }}
                    >
                        Sačuvaj
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog za upravljanje timom */}
            <Dialog
                open={openTeamManagement}
                onClose={handleCloseTeamManagement}
                PaperProps={{
                    sx: {
                        backgroundColor: colors.primary[400],
                        color: colors.grey[100],
                        minWidth: '500px'
                    }
                }}
            >
                <DialogTitle>Upravljanje Timom - {selectedProject?.name}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: colors.grey[100] }}>
                            Trenutni Tim
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                            {selectedProject?.team.map((member) => (
                                <Chip
                                    key={member.id}
                                    label={member.name}
                                    onDelete={() => {
                                        const updatedTeam = selectedProject.team.filter(m => m.id !== member.id);
                                        setSelectedProject({ ...selectedProject, team: updatedTeam });
                                    }}
                                    sx={{
                                        backgroundColor: colors.primary[500],
                                        color: colors.grey[100],
                                        '& .MuiChip-deleteIcon': {
                                            color: colors.grey[100],
                                            '&:hover': {
                                                color: colors.redAccent[500]
                                            }
                                        }
                                    }}
                                />
                            ))}
                        </Box>

                        <Typography variant="h6" sx={{ mb: 2, color: colors.grey[100] }}>
                            Dodaj Člana Tima
                        </Typography>
                        {availableWorkers.length === 0 ? (
                            <Typography variant="body2" sx={{ color: colors.grey[300], fontStyle: 'italic' }}>
                                Nema dostupnih radnika za dodavanje.
                            </Typography>
                        ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                select
                                fullWidth
                                value=""
                                onChange={async (e) => {
                                    const selectedWorkerId = e.target.value;
                                    if (!selectedWorkerId) return;
                                    
                                    const worker = availableWorkers.find(w => w.id.toString() === selectedWorkerId);
                                    if (!worker) return;
                                    
                                    // Provera da radnik već nije u timu
                                    const alreadyInTeam = selectedProject.team.some(m => m.id === worker.id);
                                    if (alreadyInTeam) {
                                        toast.warning("Ovaj radnik je već u timu!", {
                                            position: "bottom-right",
                                            autoClose: 3000,
                                        });
                                        return;
                                    }

                                    try {
                                        const token = localStorage.getItem('token');
                                        
                                        if (!token) {
                                            toast.error("Niste prijavljeni. Molimo vas da se prijavite.", {
                                                position: "bottom-right",
                                                autoClose: 5000,
                                            });
                                            return;
                                        }

                                        // Slanje POST zahteva za dodavanje korisnika na projekat
                                        await axios.post(
                                            `${API_BASE_URL}/project/addUserToProject`,
                                            null,
                                            {
                                                headers: {
                                                    'Authorization': `Bearer ${token}`
                                                },
                                                params: {
                                                    userId: worker.id,
                                                    projectId: selectedProject.id
                                                }
                                            }
                                        );

                                        // Dodavanje u lokalnu listu nakon uspešnog poziva
                                        const base64Pic = convertProfilePicToBase64(worker.profilePic);
                                        const newMember = {
                                            id: worker.id,
                                            name: worker.displayName,
                                            avatar: base64Pic ? `data:image/jpeg;base64,${base64Pic}` : "../../assets/testSpiderman.png"
                                        };
                                        
                                        setSelectedProject({
                                            ...selectedProject,
                                            team: [...selectedProject.team, newMember]
                                        });

                                        toast.success("Korisnik je uspešno dodat na projekat!", {
                                            position: "bottom-right",
                                            autoClose: 3000,
                                        });

                                        // Osveži listu dostupnih radnika
                                        await fetchAvailableWorkers(selectedProject.id);

                                    } catch (error) {
                                        console.error("Greška pri dodavanju korisnika na projekat:", error);
                                        toast.error(
                                            error.response?.data?.message || "Došlo je do greške pri dodavanju korisnika na projekat.",
                                            {
                                                position: "bottom-right",
                                                autoClose: 5000,
                                            }
                                        );
                                    }
                                }}
                                SelectProps={{
                                    native: true,
                                    sx: {
                                        '& .MuiSelect-select': { color: colors.grey[100] },
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.grey[700] },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.grey[600] },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.blueAccent[500] }
                                    }
                                }}
                            >
                                <option value="">Izaberi člana</option>
                                {availableWorkers.map((worker) => (
                                    <option key={worker.id} value={worker.id}>
                                        {worker.displayName}
                                    </option>
                                ))}
                            </TextField>
                        </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTeamManagement} sx={{ color: colors.grey[100] }}>
                        Zatvori
                    </Button>
                    <Button 
                        onClick={() => {
                            handleEditProject();
                            handleCloseTeamManagement();
                        }}
                        sx={{ 
                            backgroundColor: colors.blueAccent[500],
                            color: colors.grey[100],
                            '&:hover': {
                                backgroundColor: colors.blueAccent[600]
                            }
                        }}
                    >
                        Sačuvaj Promene
                    </Button>
                </DialogActions>
            </Dialog>
            
            <ToastContainer />
        </Box>
    );
};

export default ProjectManagement; 