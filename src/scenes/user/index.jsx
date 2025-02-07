import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    useTheme,
    Button,
    Grid,
    Chip,
    useMediaQuery,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import Header from "../../components/Header";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PieChart from "../../components/PieChart";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import DeleteIcon from "@mui/icons-material/Delete";
import AssistantIcon from '@mui/icons-material/Assistant';

const UserDetails = () => {
    const { userId } = useParams();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const user = mockDataTeam.find(user => user.id === Number(userId));

    // State management
    const [notes, setNotes] = useState([
        {
            id: 1,
            content: "Inicijalni komentar sistema",
            author: "Admin",
            date: "2023-10-25"
        }
    ]);
    const [newNote, setNewNote] = useState("");
    const [tasks] = useState([
        { id: 1, title: "Implementacija autentifikacije", difficulty: "high", status: "Aktivan", dueDate: "2023-11-15" },
        { id: 2, title: "Optimizacija baze", difficulty: "low", status: "U toku", dueDate: "2023-11-10" },
        { id: 3, title: "Responsive dizajn", difficulty: "medium", status: "Završen", dueDate: "2023-10-30" },
    ]);

    // Pie chart data
    const difficultyData = [
        { id: "high", label: "Visok prioritet", value: tasks.filter(t => t.difficulty === "high").length },
        { id: "medium", label: "Srednji prioritet", value: tasks.filter(t => t.difficulty === "medium").length },
        { id: "low", label: "Nizak prioritet", value: tasks.filter(t => t.difficulty === "low").length },
    ];

    // Statistics
    const totalTasks = tasks.length;
    const activeTasks = tasks.filter(t => t.status !== "Završen").length;
    const averageCompletionTime = "2.3 dana";

    const handleAddNote = () => {
        if (newNote.trim()) {
            setNotes([...notes, {
                id: Date.now(),
                content: newNote,
                author: "Korisnik",
                date: new Date().toISOString().split('T')[0]
            }]);
            setNewNote("");
        }
    };

    const handleDeleteUser = () => {
        // Dodati logiku za brisanje korisnika
        console.log("Brisanje korisnika:", user.id);
        setDeleteDialogOpen(false);
        navigate("/team");
    };

    const handleGenerateReport = () => {
        // Dodati logiku za generisanje izveštaja
        console.log("Generisanje izveštaja za korisnika:", user.id);
    };

    // Stilovi
    const sectionStyleTopRow = {
        p: "20px",
        borderRadius: "8px",
        bgcolor: colors.primary[400],
        height: "200px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
    };

    const sectionStyleBottomRow = {
        p: "20px",
        borderRadius: "8px",
        bgcolor: colors.primary[400],
        height: "400px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
    };

    const scrollableContent = {
        flex: 1,
        overflowY: "auto",
        pr: "10px",
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-track': { background: colors.primary[600] },
        '&::-webkit-scrollbar-thumb': { background: colors.blueAccent[700], borderRadius: '4px' },
    };

    return (
        <Box m={isMobile ? "10px" : "20px"}>
            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Potvrda brisanja</DialogTitle>
                <DialogContent>
                    <Typography>Da li ste sigurni da želite da obrišete korisnika {user?.name}?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
                        Otkaži
                    </Button>
                    <Button onClick={handleDeleteUser} color="error" variant="contained">
                        Obriši
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Header */}
            <Box mb="20px" display="flex" gap={2} flexDirection={isMobile ? "column" : "row"} justifyContent="space-between">
                <Button
                    startIcon={<ArrowBackIosIcon />}
                    onClick={() => navigate(-1)}
                    variant="contained"
                    color="secondary"
                    size={isMobile ? "small" : "medium"}
                >
                    Nazad
                </Button>
                <Box display="flex" gap={2} flexDirection={isMobile ? "column" : "row"}>
                    <Button
                        startIcon={<DeleteIcon />}
                        onClick={() => setDeleteDialogOpen(true)}
                        variant="contained"
                        color="error"
                        size={isMobile ? "small" : "medium"}
                    >
                        Obriši korisnika
                    </Button>
                    <Button
                        startIcon={<AssistantIcon />}
                        onClick={handleGenerateReport}
                        variant="contained"
                        color="secondary"
                        size={isMobile ? "small" : "medium"}
                    >
                        Napravi izveštaj
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3} mt={5}>
                {/* Osnovne informacije */}
                <Grid item xs={12} md={6} lg={4}>
                    <Box sx={sectionStyleTopRow}>
                        <Typography variant="h5" mb="15px">Lične informacije</Typography>
                        <Box sx={scrollableContent}>
                            <DetailItem label="Ime" value={user.name} colors={colors} />
                            <DetailItem label="Email" value={user.email} colors={colors} />
                            <DetailItem label="Telefon" value={user.phone} colors={colors} />
                            <DetailItem label="Godine" value={user.age} colors={colors} />
                        </Box>
                    </Box>
                </Grid>

                {/* Profil */}
                <Grid item xs={12} md={6} lg={4}>
                    <Box sx={sectionStyleTopRow}>
                        <Typography variant="h5" mb="15px">Profil</Typography>
                        <Box sx={scrollableContent}>
                            <DetailItem
                                label="Uloga"
                                value={
                                    <Chip
                                        label={user.access}
                                        sx={{
                                            backgroundColor:
                                                user.access === "admin" ? colors.greenAccent[600] :
                                                    user.access === "manager" ? colors.blueAccent[700] :
                                                        colors.grey[700],
                                            color: "white"
                                        }}
                                    />
                                }
                                colors={colors}
                            />
                            <DetailItem label="Datum registracije" value="2023-01-15" colors={colors} />
                            <DetailItem label="Poslednja prijava" value="2023-10-20 14:30" colors={colors} />
                        </Box>
                    </Box>
                </Grid>

                {/* Dozvole */}
                <Grid item xs={12} lg={4}>
                    <Box sx={sectionStyleTopRow}>
                        <Typography variant="h5" mb="15px">Dozvole</Typography>
                        <Box sx={scrollableContent}>
                            <DetailItem label="Pregled sadržaja" value="✓" colors={colors} />
                            <DetailItem label="Izmena sadržaja" value={user.access === "admin" ? "✓" : "✗"} colors={colors} />
                            <DetailItem label="Upravljanje korisnicima" value={user.access === "admin" || user.access === "manager" ? "✓" : "✗"} colors={colors} />
                            <DetailItem label="Administracija" value={user.access === "admin" ? "✓" : "✗"} colors={colors} />
                        </Box>
                    </Box>
                </Grid>

                {/* Komentari */}
                <Grid item xs={12} lg={4}>
                    <Box sx={sectionStyleBottomRow}>
                        <Typography variant="h5" mb="15px">Komentari ({notes.length})</Typography>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Novi komentar"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                multiline
                                rows={3}
                                fullWidth
                            />
                            <Button
                                onClick={handleAddNote}
                                variant="contained"
                                color="secondary"
                                fullWidth
                                sx={{ mt: 1 }}
                            >
                                Dodaj komentar
                            </Button>
                        </Box>
                        <Box sx={scrollableContent}>
                            {notes.map(note => (
                                <Box
                                    key={note.id}
                                    mb={2}
                                    p={2}
                                    borderRadius="4px"
                                    sx={{
                                        backgroundColor: theme.palette.mode === 'dark'
                                            ? colors.primary[500]
                                            : colors.grey[800],
                                        color: theme.palette.mode === 'dark'
                                            ? colors.grey[100]
                                            : colors.grey[300],
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: theme.palette.mode === 'dark'
                                                ? colors.primary[800]
                                                : colors.primary[500],
                                            color: theme.palette.mode === 'dark'
                                                ? colors.grey[300]
                                                : colors.grey[900]
                                        }
                                    }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={8}>
                                            <Typography variant="body1">
                                                {note.content}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Stack alignItems="flex-end">
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Avatar sx={{
                                                        width: 28,
                                                        height: 28,
                                                        bgcolor: colors.blueAccent[700]
                                                    }}>
                                                        <PersonIcon fontSize="small" />
                                                    </Avatar>
                                                    <Typography variant="caption">
                                                        {note.author}
                                                    </Typography>
                                                </Box>
                                                <Box display="flex" alignItems="center" gap={1} mt={1}>
                                                    <EventIcon fontSize="small" />
                                                    <Typography variant="caption">
                                                        {note.date}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Grid>

                {/* Taskovi */}
                <Grid item xs={12} lg={4}>
                    <Box sx={{
                        ...sectionStyleBottomRow
                    }}>
                        <Typography variant="h5" mb="15px">Taskovi ({activeTasks}/{totalTasks})</Typography>
                        <Box sx={scrollableContent}>
                            <TableContainer component={Paper} sx={{
                                bgcolor: 'transparent',
                                transition: 'all 0.3s ease',
                                '& .MuiTable-root': {
                                    backgroundColor: 'inherit'
                                }
                            }}>
                                <Table size={isMobile ? "small" : "medium"}>
                                    <TableHead>
                                        <TableRow sx={{
                                            backgroundColor: theme.palette.mode === 'dark'
                                                ? colors.primary[600]
                                                : colors.primary[600],
                                            '& .MuiTableCell-root': {
                                                color: theme.palette.mode === 'dark'
                                                    ? colors.grey[100]
                                                    : colors.primary[800]
                                            }
                                        }}>
                                            <TableCell>Naziv</TableCell>
                                            <TableCell align="right">Prioritet</TableCell>
                                            <TableCell align="right">Status</TableCell>
                                            <TableCell align="right">Rok</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tasks.map(task => (
                                            <TableRow
                                                key={task.id}
                                                sx={{
                                                    backgroundColor: 'inherit',
                                                    color: 'inherit',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.mode === 'dark'
                                                            ? colors.primary[400]
                                                            : colors.primary[500],
                                                        color: theme.palette.mode === 'dark'
                                                            ? colors.grey[300]
                                                            : colors.primary[900]
                                                    }
                                                }}
                                            >
                                                <TableCell>{task.title}</TableCell>
                                                <TableCell align="right">
                                                    <Chip
                                                        label={task.difficulty}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor:
                                                                task.difficulty === "high" ? colors.redAccent[600] :
                                                                    task.difficulty === "medium" ? colors.blueAccent[600] :
                                                                        colors.greenAccent[600],
                                                            color: "white",
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">{task.status}</TableCell>
                                                <TableCell align="right">{task.dueDate}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </Grid>

                {/* Statistika */}
                <Grid item xs={12} lg={4}>
                    <Box sx={sectionStyleBottomRow}>
                        <Typography variant="h5" mb="15px">Statistika</Typography>
                        <Box sx={{ ...scrollableContent, display: 'flex', flexDirection: 'column' }}>
                            <Box flex={1} minHeight={250}>
                                <PieChart data={difficultyData} />
                            </Box>
                            <Box mt={2}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <DetailItem label="Ukupno taskova" value={totalTasks} colors={colors} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <DetailItem label="Aktivnih taskova" value={activeTasks} colors={colors} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <DetailItem label="Prosečno vreme" value={averageCompletionTime} colors={colors} />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

const DetailItem = ({ label, value, colors }) => (
    <Box display="flex" justifyContent="space-between" mb="10px" component="div">
        <Typography variant="body1" color={colors.grey[100]} component="div">
            {label}:
        </Typography>
        <Typography variant="body1" fontWeight="600" component="div">
            {value}
        </Typography>
    </Box>
);

export default UserDetails;