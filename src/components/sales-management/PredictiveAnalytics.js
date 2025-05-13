import { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Grid,
    useTheme,
    useMediaQuery,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    LinearProgress
} from "@mui/material";
import { tokens } from "../../theme";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

// Mock podaci za prediktivnu analitiku
const mockPredictiveData = {
    salesForecast: [
        { month: "Jan", actual: 4000, predicted: 4200 },
        { month: "Feb", actual: 3000, predicted: 3100 },
        { month: "Mar", actual: 5000, predicted: 4800 },
        { month: "Apr", actual: 2780, predicted: 2900 },
        { month: "Maj", actual: 1890, predicted: 2000 },
        { month: "Jun", actual: 2390, predicted: 2500 },
        { month: "Jul", actual: null, predicted: 2800 },
        { month: "Avg", actual: null, predicted: 3200 },
        { month: "Sep", actual: null, predicted: 3500 }
    ],
    customerSegments: [
        { segment: "Novi", probability: 0.8, trend: "Rastući" },
        { segment: "Postojeći", probability: 0.6, trend: "Stabilan" },
        { segment: "VIP", probability: 0.9, trend: "Rastući" },
        { segment: "Rizik", probability: 0.3, trend: "Opadajući" }
    ],
    marketTrends: [
        { trend: "Digitalna transformacija", impact: 0.9, confidence: 0.85 },
        { trend: "Cloud rešenja", impact: 0.8, confidence: 0.75 },
        { trend: "AI i automatizacija", impact: 0.95, confidence: 0.90 },
        { trend: "Cybersecurity", impact: 0.85, confidence: 0.80 }
    ]
};

const PredictiveAnalytics = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");
    const [forecastPeriod, setForecastPeriod] = useState("3m");

    const handleForecastPeriodChange = (event) => {
        setForecastPeriod(event.target.value);
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5" color={colors.grey[100]}>
                    Prediktivna analitika
                </Typography>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="forecast-period-label">Period prognoze</InputLabel>
                    <Select
                        labelId="forecast-period-label"
                        value={forecastPeriod}
                        label="Period prognoze"
                        onChange={handleForecastPeriodChange}
                        sx={{ color: colors.grey[100] }}
                    >
                        <MenuItem value="1m">1 mesec</MenuItem>
                        <MenuItem value="3m">3 meseca</MenuItem>
                        <MenuItem value="6m">6 meseci</MenuItem>
                        <MenuItem value="1y">1 godina</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={2}>
                {/* Prognoza prodaje */}
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 2,
                            backgroundColor: colors.primary[600],
                            height: "400px"
                        }}
                    >
                        <Typography
                            variant="h6"
                            color={colors.grey[100]}
                            sx={{ mb: 2 }}
                        >
                            Prognoza prodaje
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockPredictiveData.salesForecast}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="month"
                                    stroke={colors.grey[100]}
                                />
                                <YAxis stroke={colors.grey[100]} />
                                <Tooltip />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="actual"
                                    stroke={colors.greenAccent[500]}
                                    fill={colors.greenAccent[500]}
                                    fillOpacity={0.3}
                                    name="Stvarna prodaja"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="predicted"
                                    stroke={colors.blueAccent[500]}
                                    fill={colors.blueAccent[500]}
                                    fillOpacity={0.3}
                                    name="Predviđena prodaja"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Segmenti klijenata */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 2,
                            backgroundColor: colors.primary[600]
                        }}
                    >
                        <Typography
                            variant="h6"
                            color={colors.grey[100]}
                            sx={{ mb: 2 }}
                        >
                            Segmenti klijenata
                        </Typography>
                        {mockPredictiveData.customerSegments.map((segment, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 1
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        color={colors.grey[100]}
                                    >
                                        {segment.segment}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color={
                                            segment.trend === "Rastući"
                                                ? colors.greenAccent[500]
                                                : segment.trend === "Opadajući"
                                                ? colors.redAccent[500]
                                                : colors.grey[100]
                                        }
                                    >
                                        {segment.trend}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={segment.probability * 100}
                                    sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: colors.primary[500],
                                        "& .MuiLinearProgress-bar": {
                                            backgroundColor:
                                                segment.probability > 0.7
                                                    ? colors.greenAccent[500]
                                                    : segment.probability > 0.4
                                                    ? colors.blueAccent[500]
                                                    : colors.redAccent[500]
                                        }
                                    }}
                                />
                            </Box>
                        ))}
                    </Paper>
                </Grid>

                {/* Tržišni trendovi */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 2,
                            backgroundColor: colors.primary[600]
                        }}
                    >
                        <Typography
                            variant="h6"
                            color={colors.grey[100]}
                            sx={{ mb: 2 }}
                        >
                            Tržišni trendovi
                        </Typography>
                        {mockPredictiveData.marketTrends.map((trend, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 1
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        color={colors.grey[100]}
                                    >
                                        {trend.trend}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color={colors.grey[100]}
                                    >
                                        {`${(trend.confidence * 100).toFixed(0)}% sigurnost`}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={trend.impact * 100}
                                    sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: colors.primary[500],
                                        "& .MuiLinearProgress-bar": {
                                            backgroundColor:
                                                trend.impact > 0.8
                                                    ? colors.greenAccent[500]
                                                    : trend.impact > 0.5
                                                    ? colors.blueAccent[500]
                                                    : colors.redAccent[500]
                                        }
                                    }}
                                />
                            </Box>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PredictiveAnalytics; 