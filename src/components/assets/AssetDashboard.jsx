import { Box, Grid, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import StatBox from "../StatBox";
import BarChart from "../BarChart";
import PieChart from "../PieChart";

const AssetDashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box>
            <Grid container spacing={2}>
                {/* Statistički podaci */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatBox
                        title="Ukupno imovine"
                        value="1,234"
                        icon={<i className="fas fa-building" />}
                        subtitle="Aktivna imovina"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatBox
                        title="Pokretna imovina"
                        value="789"
                        icon={<i className="fas fa-laptop" />}
                        subtitle="U upotrebi"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatBox
                        title="Nepokretna imovina"
                        value="445"
                        icon={<i className="fas fa-home" />}
                        subtitle="Registrovana"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatBox
                        title="Vrednost imovine"
                        value="€2.5M"
                        icon={<i className="fas fa-euro-sign" />}
                        subtitle="Ukupna vrednost"
                    />
                </Grid>

                {/* Grafikoni */}
                <Grid item xs={12} md={8}>
                    <Box
                        backgroundColor={colors.primary[400]}
                        p="20px"
                        borderRadius="4px"
                        boxShadow={1}
                    >
                        <Typography variant="h5" fontWeight="600" mb="15px">
                            Distribucija imovine po lokacijama
                        </Typography>
                        <Box height="300px">
                            <BarChart />
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box
                        backgroundColor={colors.primary[400]}
                        p="20px"
                        borderRadius="4px"
                        boxShadow={1}
                    >
                        <Typography variant="h5" fontWeight="600" mb="15px">
                            Status imovine
                        </Typography>
                        <Box height="300px">
                            <PieChart />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AssetDashboard; 