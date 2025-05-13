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
    LinearProgress,
    useTheme,
    useMediaQuery
} from "@mui/material";
import { tokens } from "../../theme";
import { Add as AddIcon } from "@mui/icons-material";

// Mock podaci za ciljeve
const mockGoalsData = {
    annualTarget: 1200000,
    currentProgress: 540000,
    quarterlyGoals: [
        {
            id: 1,
            quarter: "Q1",
            target: 300000,
            current: 150000,
            status: "U toku"
        },
        {
            id: 2,
            quarter: "Q2",
            target: 300000,
            current: 180000,
            status: "U toku"
        },
        {
            id: 3,
            quarter: "Q3",
            target: 300000,
            current: 210000,
            status: "U toku"
        },
        {
            id: 4,
            quarter: "Q4",
            target: 300000,
            current: 0,
            status: "Nije započeto"
        }
    ]
};

const GoalTracker = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");
    const [goalsData, setGoalsData] = useState(mockGoalsData);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        quarter: "",
        target: "",
        status: "Nije započeto"
    });

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            quarter: "",
            target: "",
            status: "Nije započeto"
        });
    };

    const handleSubmit = () => {
        const newGoal = {
            id: goalsData.quarterlyGoals.length + 1,
            ...formData,
            current: 0
        };
        setGoalsData({
            ...goalsData,
            quarterlyGoals: [...goalsData.quarterlyGoals, newGoal]
        });
        handleCloseDialog();
    };

    const calculateProgress = (current, target) => {
        return (current / target) * 100;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('sr-RS', {
            style: 'currency',
            currency: 'RSD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5" color={colors.grey[100]}>
                    Praćenje ciljeva
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                    sx={{
                        backgroundColor: colors.greenAccent[500],
                        "&:hover": {
                            backgroundColor: colors.greenAccent[600]
                        }
                    }}
                >
                    Dodaj cilj
                </Button>
            </Box>

            {/* Godišnji cilj */}
            <Paper
                sx={{
                    p: 2,
                    backgroundColor: colors.primary[600],
                    color: colors.grey[100],
                    mb: 2
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Godišnji cilj
                </Typography>
                <Typography variant="h4" gutterBottom>
                    {formatCurrency(goalsData.currentProgress)} / {formatCurrency(goalsData.annualTarget)}
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={calculateProgress(goalsData.currentProgress, goalsData.annualTarget)}
                    sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: colors.primary[500],
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: colors.greenAccent[500]
                        }
                    }}
                />
            </Paper>

            {/* Kvartalni ciljevi */}
            <Grid container spacing={2}>
                {goalsData.quarterlyGoals.map((goal) => (
                    <Grid item xs={12} md={6} key={goal.id}>
                        <Paper
                            sx={{
                                p: 2,
                                backgroundColor: colors.primary[600],
                                color: colors.grey[100]
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                {goal.quarter}
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                                {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={calculateProgress(goal.current, goal.target)}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: colors.primary[500],
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: colors.greenAccent[500]
                                    }
                                }}
                            />
                            <Typography
                                variant="body2"
                                sx={{
                                    color: goal.status === "U toku" ? colors.greenAccent[500] : colors.grey[300],
                                    mt: 1
                                }}
                            >
                                {goal.status}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Dodaj novi cilj</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Kvartal"
                            value={formData.quarter}
                            onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Cilj (RSD)"
                            type="number"
                            value={formData.target}
                            onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Otkaži</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Dodaj
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GoalTracker; 