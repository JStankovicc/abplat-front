import { Box, Grid, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import StatBox from "../StatBox";
import BarChart from "../BarChart";
import LineChart from "../LineChart";
import PieChart from "../PieChart";
import {
    Inventory as InventoryIcon,
    Warning as WarningIcon,
    ShoppingCart as ShoppingCartIcon,
    Euro as EuroIcon
} from "@mui/icons-material";

const DashboardSection = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box>
            {/* Statistički podaci */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatBox
                        title="Ukupno proizvoda"
                        value="1,234"
                        icon={<InventoryIcon />}
                        subtitle="+12% u odnosu na prošli mesec"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatBox
                        title="Niska zaliha"
                        value="23"
                        icon={<WarningIcon />}
                        subtitle="Proizvodi koji zahtevaju dopunu"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatBox
                        title="Aktivne porudžbine"
                        value="45"
                        icon={<ShoppingCartIcon />}
                        subtitle="Na čekanju za isporuku"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatBox
                        title="Vrednost inventara"
                        value="€234,567"
                        icon={<EuroIcon />}
                        subtitle="+8% u odnosu na prošli mesec"
                    />
                </Grid>
            </Grid>

            {/* Grafici */}
            <Grid container spacing={2}>
                {/* Promet inventara */}
                <Grid item xs={12} md={8}>
                    <Box
                        sx={{
                            backgroundColor: colors.primary[600],
                            p: 2,
                            borderRadius: 1,
                            height: "300px"
                        }}
                    >
                        <Typography variant="h6" color={colors.grey[100]} sx={{ mb: 2 }}>
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
                            height="250px"
                        />
                    </Box>
                </Grid>

                {/* Distribucija po kategorijama */}
                <Grid item xs={12} md={4}>
                    <Box
                        sx={{
                            backgroundColor: colors.primary[600],
                            p: 2,
                            borderRadius: 1,
                            height: "300px"
                        }}
                    >
                        <Typography variant="h6" color={colors.grey[100]} sx={{ mb: 2 }}>
                            Distribucija po kategorijama
                        </Typography>
                        <PieChart
                            data={[
                                { name: "Elektronika", value: 35 },
                                { name: "Odeća", value: 25 },
                                { name: "Namirnice", value: 20 },
                                { name: "Ostalo", value: 20 }
                            ]}
                            height="250px"
                        />
                    </Box>
                </Grid>

                {/* Top proizvodi */}
                <Grid item xs={12}>
                    <Box
                        sx={{
                            backgroundColor: colors.primary[600],
                            p: 2,
                            borderRadius: 1,
                            height: "300px"
                        }}
                    >
                        <Typography variant="h6" color={colors.grey[100]} sx={{ mb: 2 }}>
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
                            height="250px"
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardSection; 