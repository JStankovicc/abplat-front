import { useState } from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    useTheme
} from "@mui/material";
import { tokens } from "../../theme";
import StatBox from "../StatBox";
import BarChart from "../BarChart";
import LineChart from "../LineChart";
import PieChart from "../PieChart";
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Inventory as InventoryIcon,
    Warning as WarningIcon,
    AttachMoney as MoneyIcon,
    LocalShipping as ShippingIcon
} from "@mui/icons-material";

const AnalyticsSection = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [timeRange, setTimeRange] = useState("month");

    return (
        <Box>
            {/* Filter za vremenski period */}
            <Box sx={{ mb: 3 }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Vremenski period</InputLabel>
                    <Select
                        value={timeRange}
                        label="Vremenski period"
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <MenuItem value="week">Poslednja nedelja</MenuItem>
                        <MenuItem value="month">Poslednji mesec</MenuItem>
                        <MenuItem value="quarter">Poslednji kvartal</MenuItem>
                        <MenuItem value="year">Poslednja godina</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Statistički podaci */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatBox
                        title="Ukupna vrednost inventara"
                        value="€234,567"
                        icon={<MoneyIcon />}
                        subtitle="+8% u odnosu na prošli period"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatBox
                        title="Obrt inventara"
                        value="4.5"
                        icon={<TrendingUpIcon />}
                        subtitle="+0.5 u odnosu na prošli period"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatBox
                        title="Prosečno vreme isporuke"
                        value="2.5 dana"
                        icon={<ShippingIcon />}
                        subtitle="-0.5 dana u odnosu na prošli period"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatBox
                        title="Stopa povrata"
                        value="2.3%"
                        icon={<TrendingDownIcon />}
                        subtitle="-0.5% u odnosu na prošli period"
                    />
                </Grid>
            </Grid>

            {/* Grafici */}
            <Grid container spacing={2}>
                {/* Promet inventara */}
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            p: 2,
                            backgroundColor: colors.primary[600],
                            height: "400px"
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2, color: colors.grey[100] }}>
                            Promet inventara
                        </Typography>
                        <LineChart
                            data={[
                                { name: "Jan", value: 400 },
                                { name: "Feb", value: 300 },
                                { name: "Mar", value: 600 },
                                { name: "Apr", value: 800 },
                                { name: "May", value: 500 },
                                { name: "Jun", value: 700 }
                            ]}
                            height="300px"
                        />
                    </Paper>
                </Grid>

                {/* Distribucija po kategorijama */}
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 2,
                            backgroundColor: colors.primary[600],
                            height: "400px"
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2, color: colors.grey[100] }}>
                            Distribucija po kategorijama
                        </Typography>
                        <PieChart
                            data={[
                                { name: "Elektronika", value: 35 },
                                { name: "Odeća", value: 25 },
                                { name: "Namirnice", value: 20 },
                                { name: "Ostalo", value: 20 }
                            ]}
                            height="300px"
                        />
                    </Paper>
                </Grid>

                {/* Top proizvodi */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 2,
                            backgroundColor: colors.primary[600],
                            height: "400px"
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2, color: colors.grey[100] }}>
                            Top proizvodi po prodaji
                        </Typography>
                        <BarChart
                            data={[
                                { name: "Proizvod A", value: 400 },
                                { name: "Proizvod B", value: 300 },
                                { name: "Proizvod C", value: 200 },
                                { name: "Proizvod D", value: 150 },
                                { name: "Proizvod E", value: 100 }
                            ]}
                            height="300px"
                        />
                    </Paper>
                </Grid>

                {/* Proizvodi sa niskom zalihom */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: 2,
                            backgroundColor: colors.primary[600],
                            height: "400px"
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2, color: colors.grey[100] }}>
                            Proizvodi sa niskom zalihom
                        </Typography>
                        <BarChart
                            data={[
                                { name: "Proizvod X", value: 5 },
                                { name: "Proizvod Y", value: 8 },
                                { name: "Proizvod Z", value: 3 },
                                { name: "Proizvod W", value: 6 },
                                { name: "Proizvod V", value: 4 }
                            ]}
                            height="300px"
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyticsSection; 