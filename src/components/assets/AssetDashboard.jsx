import { Box, Grid, Typography, useTheme, Paper, IconButton, Tooltip, Button, Menu, MenuItem, Divider } from "@mui/material";
import { tokens } from "../../theme";
import StatBox from "../StatBox";
import BarChart from "../BarChart";
import PieChart from "../PieChart";
import { 
    MoreVert as MoreVertIcon,
    TrendingUp as TrendingUpIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    FilterList as FilterListIcon,
    Download as DownloadIcon,
    Refresh as RefreshIcon,
    Add as AddIcon
} from "@mui/icons-material";
import { useState } from "react";

const AssetDashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [anchorEl, setAnchorEl] = useState(null);
    const [timeRange, setTimeRange] = useState("30d");

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleTimeRangeChange = (range) => {
        setTimeRange(range);
        handleMenuClose();
    };

    return (
        <Box>
            {/* Header sa akcijama */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" color={colors.grey[100]} fontWeight="bold">
                    Pregled imovine
                </Typography>
                <Box display="flex" gap={2}>
                    <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        sx={{
                            borderColor: colors.greenAccent[500],
                            color: colors.greenAccent[500],
                            '&:hover': {
                                borderColor: colors.greenAccent[400],
                                backgroundColor: colors.greenAccent[500] + '10'
                            }
                        }}
                    >
                        Filteri
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        sx={{
                            borderColor: colors.greenAccent[500],
                            color: colors.greenAccent[500],
                            '&:hover': {
                                borderColor: colors.greenAccent[400],
                                backgroundColor: colors.greenAccent[500] + '10'
                            }
                        }}
                    >
                        Izveštaj
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            backgroundColor: colors.greenAccent[500],
                            '&:hover': {
                                backgroundColor: colors.greenAccent[600]
                            }
                        }}
                    >
                        Nova imovina
                    </Button>
                </Box>
            </Box>

            {/* Statistički podaci */}
            <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            backgroundColor: colors.primary[400],
                            borderRadius: 2,
                            border: `1px solid ${colors.primary[300]}`,
                            height: '100%'
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" color={colors.grey[100]}>
                                Ukupno imovine
                            </Typography>
                            <IconButton size="small" sx={{ color: colors.grey[100] }}>
                                <MoreVertIcon />
                            </IconButton>
                        </Box>
                        <Typography variant="h3" color={colors.grey[100]} fontWeight="bold" mb={1}>
                            1,234
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <TrendingUpIcon sx={{ color: colors.greenAccent[500] }} />
                            <Typography variant="body2" color={colors.greenAccent[500]}>
                                +12% u odnosu na prošli mesec
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            backgroundColor: colors.primary[400],
                            borderRadius: 2,
                            border: `1px solid ${colors.primary[300]}`,
                            height: '100%'
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" color={colors.grey[100]}>
                                Pokretna imovina
                            </Typography>
                            <IconButton size="small" sx={{ color: colors.grey[100] }}>
                                <MoreVertIcon />
                            </IconButton>
                        </Box>
                        <Typography variant="h3" color={colors.grey[100]} fontWeight="bold" mb={1}>
                            789
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <CheckCircleIcon sx={{ color: colors.greenAccent[500] }} />
                            <Typography variant="body2" color={colors.grey[100]}>
                                95% aktivno
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            backgroundColor: colors.primary[400],
                            borderRadius: 2,
                            border: `1px solid ${colors.primary[300]}`,
                            height: '100%'
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" color={colors.grey[100]}>
                                Nepokretna imovina
                            </Typography>
                            <IconButton size="small" sx={{ color: colors.grey[100] }}>
                                <MoreVertIcon />
                            </IconButton>
                        </Box>
                        <Typography variant="h3" color={colors.grey[100]} fontWeight="bold" mb={1}>
                            445
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <WarningIcon sx={{ color: colors.redAccent[500] }} />
                            <Typography variant="body2" color={colors.grey[100]}>
                                3 zahteva za održavanje
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            backgroundColor: colors.primary[400],
                            borderRadius: 2,
                            border: `1px solid ${colors.primary[300]}`,
                            height: '100%'
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" color={colors.grey[100]}>
                                Vrednost imovine
                            </Typography>
                            <IconButton size="small" sx={{ color: colors.grey[100] }}>
                                <MoreVertIcon />
                            </IconButton>
                        </Box>
                        <Typography variant="h3" color={colors.grey[100]} fontWeight="bold" mb={1}>
                            €2.5M
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                            <TrendingUpIcon sx={{ color: colors.greenAccent[500] }} />
                            <Typography variant="body2" color={colors.grey[100]}>
                                +8% u odnosu na prošli kvartal
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Grafikoni i tabele */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            backgroundColor: colors.primary[400],
                            borderRadius: 2,
                            border: `1px solid ${colors.primary[300]}`,
                            height: '100%'
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h5" color={colors.grey[100]} fontWeight="bold">
                                Distribucija imovine po lokacijama
                            </Typography>
                            <Box display="flex" gap={1}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleMenuClick}
                                    sx={{
                                        borderColor: colors.greenAccent[500],
                                        color: colors.greenAccent[500],
                                        '&:hover': {
                                            borderColor: colors.greenAccent[400],
                                            backgroundColor: colors.greenAccent[500] + '10'
                                        }
                                    }}
                                >
                                    {timeRange === "7d" ? "7 dana" : 
                                     timeRange === "30d" ? "30 dana" : 
                                     timeRange === "90d" ? "90 dana" : "Godina"}
                                </Button>
                                <IconButton size="small" sx={{ color: colors.grey[100] }}>
                                    <RefreshIcon />
                                </IconButton>
                            </Box>
                        </Box>
                        <Box height="400px">
                            <BarChart />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            backgroundColor: colors.primary[400],
                            borderRadius: 2,
                            border: `1px solid ${colors.primary[300]}`,
                            height: '100%'
                        }}
                    >
                        <Typography variant="h5" color={colors.grey[100]} fontWeight="bold" mb={3}>
                            Status imovine
                        </Typography>
                        <Box height="400px">
                            <PieChart />
                        </Box>
                    </Paper>
                </Grid>

                {/* Dodatne informacije */}
                <Grid item xs={12}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            backgroundColor: colors.primary[400],
                            borderRadius: 2,
                            border: `1px solid ${colors.primary[300]}`
                        }}
                    >
                        <Typography variant="h5" color={colors.grey[100]} fontWeight="bold" mb={3}>
                            Aktivnosti i upozorenja
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Box display="flex" alignItems="center" gap={2} p={2} sx={{ backgroundColor: colors.primary[300], borderRadius: 1 }}>
                                    <ErrorIcon sx={{ color: colors.redAccent[500] }} />
                                    <Box>
                                        <Typography variant="subtitle1" color={colors.grey[100]}>
                                            Istekla garancija
                                        </Typography>
                                        <Typography variant="body2" color={colors.grey[100]}>
                                            5 stavki zahteva pažnju
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box display="flex" alignItems="center" gap={2} p={2} sx={{ backgroundColor: colors.primary[300], borderRadius: 1 }}>
                                    <WarningIcon sx={{ color: colors.redAccent[500] }} />
                                    <Box>
                                        <Typography variant="subtitle1" color={colors.grey[100]}>
                                            Predstojeće inspekcije
                                        </Typography>
                                        <Typography variant="body2" color={colors.grey[100]}>
                                            3 stavke u narednih 7 dana
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box display="flex" alignItems="center" gap={2} p={2} sx={{ backgroundColor: colors.primary[300], borderRadius: 1 }}>
                                    <CheckCircleIcon sx={{ color: colors.greenAccent[500] }} />
                                    <Box>
                                        <Typography variant="subtitle1" color={colors.grey[100]}>
                                            Završene aktivnosti
                                        </Typography>
                                        <Typography variant="body2" color={colors.grey[100]}>
                                            12 stavki ovog meseca
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Menu za izbor vremenskog perioda */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        backgroundColor: colors.primary[400],
                        color: colors.grey[100],
                        mt: 1
                    }
                }}
            >
                <MenuItem onClick={() => handleTimeRangeChange("7d")}>Poslednjih 7 dana</MenuItem>
                <MenuItem onClick={() => handleTimeRangeChange("30d")}>Poslednjih 30 dana</MenuItem>
                <MenuItem onClick={() => handleTimeRangeChange("90d")}>Poslednjih 90 dana</MenuItem>
                <MenuItem onClick={() => handleTimeRangeChange("1y")}>Poslednja godina</MenuItem>
            </Menu>
        </Box>
    );
};

export default AssetDashboard; 