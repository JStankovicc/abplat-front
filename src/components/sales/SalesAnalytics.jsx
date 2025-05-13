import { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Grid,
    useTheme,
    useMediaQuery,
    LinearProgress
} from "@mui/material";
import { tokens } from "../../theme";
import { Line, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// Mock podaci
const monthlyData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun"],
    datasets: [
        {
            label: "Konverzija",
            data: [65, 59, 80, 81, 56, 55],
            borderColor: "#4cceac",
            backgroundColor: "rgba(76, 206, 172, 0.5)",
            tension: 0.4
        }
    ]
};

const leadSourcesData = {
    labels: ["Website", "Referral", "Social", "Email"],
    datasets: [
        {
            data: [40, 25, 20, 15],
            backgroundColor: [
                "#4cceac",
                "#6c5ce7",
                "#e84393",
                "#00cec9"
            ]
        }
    ]
};

const salesGoals = [
    { name: "Mesečni cilj", current: 75000, target: 100000 },
    { name: "Kvartalni cilj", current: 200000, target: 300000 },
    { name: "Godišnji cilj", current: 500000, target: 1000000 }
];

const SalesAnalytics = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: colors.grey[100]
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    color: colors.grey[100]
                },
                grid: {
                    color: colors.primary[500]
                }
            },
            x: {
                ticks: {
                    color: colors.grey[100]
                },
                grid: {
                    color: colors.primary[500]
                }
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: colors.grey[100]
                }
            }
        }
    };

    return (
        <Box sx={{ height: "100%", overflow: "auto" }}>
            <Grid container spacing={2}>
                {/* Mesečna konverzija */}
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            p: 2,
                            backgroundColor: colors.primary[600],
                            height: "400px"
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ color: colors.grey[100], mb: 2 }}
                        >
                            Mesečna konverzija
                        </Typography>
                        <Box sx={{ height: "calc(100% - 40px)" }}>
                            <Line data={monthlyData} options={chartOptions} />
                        </Box>
                    </Paper>
                </Grid>

                {/* Izvori leadova */}
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 2,
                            backgroundColor: colors.primary[600],
                            height: "400px"
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ color: colors.grey[100], mb: 2 }}
                        >
                            Izvori leadova
                        </Typography>
                        <Box sx={{ height: "calc(100% - 40px)" }}>
                            <Pie data={leadSourcesData} options={pieOptions} />
                        </Box>
                    </Paper>
                </Grid>

                {/* Ciljevi prodaje */}
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 2,
                            backgroundColor: colors.primary[600]
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ color: colors.grey[100], mb: 2 }}
                        >
                            Ciljevi prodaje
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {salesGoals.map((goal) => (
                                <Box key={goal.name}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            mb: 1
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{ color: colors.grey[100] }}
                                        >
                                            {goal.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: colors.grey[100] }}
                                        >
                                            {goal.current.toLocaleString()} / {goal.target.toLocaleString()} RSD
                                        </Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(goal.current / goal.target) * 100}
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: colors.primary[500],
                                            "& .MuiLinearProgress-bar": {
                                                backgroundColor: colors.greenAccent[500]
                                            }
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SalesAnalytics; 