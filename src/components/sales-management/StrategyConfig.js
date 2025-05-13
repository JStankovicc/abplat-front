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
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, DragIndicator as DragIcon } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Mock podaci za strategije
const mockStrategiesData = [
    {
        id: 1,
        name: "Inicijalni kontakt",
        description: "Prvi kontakt sa potencijalnim klijentom",
        successRate: 75,
        averageTime: "2 dana",
        nextStage: "Pregovori"
    },
    {
        id: 2,
        name: "Pregovori",
        description: "Razgovor o detaljima i cenama",
        successRate: 60,
        averageTime: "5 dana",
        nextStage: "Ponuda"
    },
    {
        id: 3,
        name: "Ponuda",
        description: "Priprema i slanje ponude",
        successRate: 45,
        averageTime: "3 dana",
        nextStage: "Zaključak"
    },
    {
        id: 4,
        name: "Zaključak",
        description: "Finalizacija ugovora",
        successRate: 90,
        averageTime: "1 dan",
        nextStage: "Zatvoreno"
    }
];

const StrategyConfig = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");
    const [strategiesData, setStrategiesData] = useState(mockStrategiesData);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStrategy, setSelectedStrategy] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        successRate: "",
        averageTime: "",
        nextStage: ""
    });

    const handleOpenDialog = (strategy = null) => {
        if (strategy) {
            setSelectedStrategy(strategy);
            setFormData(strategy);
        } else {
            setSelectedStrategy(null);
            setFormData({
                name: "",
                description: "",
                successRate: "",
                averageTime: "",
                nextStage: ""
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedStrategy(null);
    };

    const handleSubmit = () => {
        if (selectedStrategy) {
            setStrategiesData(strategiesData.map(strategy => 
                strategy.id === selectedStrategy.id ? { ...formData, id: strategy.id } : strategy
            ));
        } else {
            setStrategiesData([...strategiesData, { ...formData, id: strategiesData.length + 1 }]);
        }
        handleCloseDialog();
    };

    const handleDelete = (id) => {
        setStrategiesData(strategiesData.filter(strategy => strategy.id !== id));
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(strategiesData);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setStrategiesData(items);
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5" color={colors.grey[100]}>
                    Konfiguracija strategije
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
                    Dodaj fazu
                </Button>
            </Box>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="strategies">
                    {(provided) => (
                        <Box
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {strategiesData.map((strategy, index) => (
                                <Draggable
                                    key={strategy.id}
                                    draggableId={strategy.id.toString()}
                                    index={index}
                                >
                                    {(provided) => (
                                        <Paper
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            sx={{
                                                p: 2,
                                                backgroundColor: colors.primary[600],
                                                color: colors.grey[100],
                                                mb: 2,
                                                display: "flex",
                                                alignItems: "center"
                                            }}
                                        >
                                            <Box
                                                {...provided.dragHandleProps}
                                                sx={{ mr: 2, cursor: "grab" }}
                                            >
                                                <DragIcon />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                                    <Typography variant="h6">{strategy.name}</Typography>
                                                    <Box>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleOpenDialog(strategy)}
                                                            sx={{ color: colors.grey[100] }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDelete(strategy.id)}
                                                            sx={{ color: colors.redAccent[500] }}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                </Box>
                                                <Typography variant="body2" color={colors.grey[300]}>
                                                    {strategy.description}
                                                </Typography>
                                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                                    <Grid item xs={4}>
                                                        <Typography variant="body2" color={colors.grey[300]}>
                                                            Stopa uspeha: {strategy.successRate}%
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Typography variant="body2" color={colors.grey[300]}>
                                                            Prosečno vreme: {strategy.averageTime}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <Typography variant="body2" color={colors.grey[300]}>
                                                            Sledeća faza: {strategy.nextStage}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Paper>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {selectedStrategy ? "Izmeni fazu" : "Dodaj novu fazu"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Naziv faze"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                            label="Stopa uspeha (%)"
                            type="number"
                            value={formData.successRate}
                            onChange={(e) => setFormData({ ...formData, successRate: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Prosečno vreme"
                            value={formData.averageTime}
                            onChange={(e) => setFormData({ ...formData, averageTime: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Sledeća faza"
                            value={formData.nextStage}
                            onChange={(e) => setFormData({ ...formData, nextStage: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Otkaži</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedStrategy ? "Sačuvaj" : "Dodaj"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StrategyConfig; 