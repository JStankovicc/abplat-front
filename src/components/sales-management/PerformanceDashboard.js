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
    InputLabel
} from "@mui/material";
import { tokens } from "../../theme";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

// Mock podaci za analitiku
const mockAnalyticsData = {
    salesByMonth: [
        { month: "Jan", sales: 4000 },
        { month: "Feb", sales: 3000 },
        { month: "Mar", sales: 5000 },
        { month: "Apr", sales: 2780 },
        { month: "Maj", sales: 1890 },
        { month: "Jun", sales: 2390 }
    ],
    conversionRates: [
        { stage: "Novi", value: 30 },
        { stage: "U pregovorima", value: 20 },
        { stage: "Ponuda", value: 15 },
        { stage: "Zatvoreno", value: 35 }
    ],
    performanceMetrics: [
        { metric: "Ukupna prodaja", value: "1.2M RSD" },
        { metric: "Prosečna vrednost", value: "120K RSD" },
        { metric: "Stopa konverzije", value: "25%" },
        { metric: "Novi klijenti", value: "15" }
    ]
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PerformanceDashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:768px)");
    const [timeRange, setTimeRange] = useState("6m");

    const handleTimeRangeChange = (event) => {
        setTimeRange(event.target.value);
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5" color={colors.grey[100]}>
                    Analitika performansi
                </Typography>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="time-range-label">Period</InputLabel>
                    <Select
                        labelId="time-range-label"
                        value={timeRange}
                        label="Period"
                        onChange={handleTimeRangeChange}
                        sx={{ color: colors.grey[100] }}
                    >
                        <MenuItem value="1m">Poslednji mesec</MenuItem>
                        <MenuItem value="3m">Poslednja 3 meseca</MenuItem>
                        <MenuItem value="6m">Poslednjih 6 meseci</MenuItem>
                        <MenuItem value="1y">Poslednja godina</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={2}>
                {/* Metrike performansi */}
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        {mockAnalyticsData.performanceMetrics.map((metric, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        backgroundColor: colors.primary[600],
                                        height: "100%"
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        color={colors.grey[100]}
                                        sx={{ mb: 1 }}
                                    >
                                        {metric.metric}
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        color={colors.greenAccent[500]}
                                    >
                                        {metric.value}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* Grafikon prodaje po mesecima */}
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
                            color={colors.grey[100]}
                            sx={{ mb: 2 }}
                        >
                            Prodaja po mesecima
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockAnalyticsData.salesByMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="month"
                                    stroke={colors.grey[100]}
                                />
                                <YAxis stroke={colors.grey[100]} />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="sales"
                                    fill={colors.greenAccent[500]}
                                    name="Prodaja (RSD)"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Grafikon stopa konverzije */}
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
                            color={colors.grey[100]}
                            sx={{ mb: 2 }}
                        >
                            Stopa konverzije
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={mockAnalyticsData.conversionRates}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {mockAnalyticsData.conversionRates.map(
                                        (entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        )
                                    )}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Trend performansi */}
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
                            Trend performansi
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockAnalyticsData.salesByMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="month"
                                    stroke={colors.grey[100]}
                                />
                                <YAxis stroke={colors.grey[100]} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke={colors.greenAccent[500]}
                                    name="Prodaja (RSD)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PerformanceDashboard; 