import { useState } from "react";
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
    ListItemText
} from "@mui/material";
import { tokens } from "../../theme";
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

    // Mock data za projekte
    const [projects, setProjects] = useState([
        {
            id: 1,
            name: "Projekat X",
            description: "Opis projekta X",
            status: "Aktivan",
            startDate: "2024-01-01",
            endDate: "2024-06-30",
            team: [
                { id: 1, name: "Jovan Stanković", avatar: "../../assets/testSpiderman.png" },
                { id: 2, name: "Ana Petrović", avatar: "../../assets/testSpiderman.png" },
                { id: 3, name: "Marko Jovanović", avatar: "../../assets/testSpiderman.png" }
            ]
        },
        {
            id: 2,
            name: "Projekat Y",
            description: "Opis projekta Y",
            status: "U toku",
            startDate: "2024-02-01",
            endDate: "2024-07-31",
            team: [
                { id: 1, name: "Jovan Stanković", avatar: "../../assets/testSpiderman.png" },
                { id: 2, name: "Ana Petrović", avatar: "../../assets/testSpiderman.png" }
            ]
        }
    ]);

    // State za dijaloge
    const [openNewProject, setOpenNewProject] = useState(false);
    const [openEditProject, setOpenEditProject] = useState(false);
    const [openDeleteProject, setOpenDeleteProject] = useState(false);
    const [openTeamManagement, setOpenTeamManagement] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    // State za novi projekat
    const [newProject, setNewProject] = useState({
        name: "",
        description: "",
        startDate: "",
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
    };
    const handleCloseTeamManagement = () => setOpenTeamManagement(false);

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
    const handleCreateProject = () => {
        const project = {
            id: projects.length + 1,
            ...newProject,
            status: "Aktivan",
            team: []
        };
        setProjects([...projects, project]);
        handleCloseNewProject();
        setNewProject({
            name: "",
            description: "",
            startDate: "",
            endDate: "",
            team: []
        });
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
                            <TableCell sx={{ color: colors.grey[100] }}>Period</TableCell>
                            <TableCell sx={{ color: colors.grey[100] }}>Akcije</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projects.map((project) => (
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
                                <TableCell>
                                    <AvatarGroup max={3}>
                                        {project.team.map((member) => (
                                            <Tooltip key={member.id} title={member.name}>
                                                <Avatar src={member.avatar} />
                                            </Tooltip>
                                        ))}
                                    </AvatarGroup>
                                </TableCell>
                                <TableCell sx={{ color: colors.grey[100] }}>
                                    {project.startDate} - {project.endDate}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={(e) => handleMenuClick(e, project)}>
                                        <MoreVertIcon sx={{ color: colors.grey[100] }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
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
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                select
                                fullWidth
                                value=""
                                onChange={(e) => {
                                    const newMember = {
                                        id: Date.now(),
                                        name: e.target.value,
                                        avatar: "../../assets/testSpiderman.png"
                                    };
                                    setSelectedProject({
                                        ...selectedProject,
                                        team: [...selectedProject.team, newMember]
                                    });
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
                                <option value="Marko Jovanović">Marko Jovanović</option>
                                <option value="Ana Petrović">Ana Petrović</option>
                                <option value="Petar Marković">Petar Marković</option>
                                <option value="Jana Stojanović">Jana Stojanović</option>
                            </TextField>
                        </Box>
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
        </Box>
    );
};

export default ProjectManagement; 