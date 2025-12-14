import { 
    Box, 
    Typography, 
    Container, 
    Grid, 
    Card, 
    CardContent,
    useTheme,
    useMediaQuery
} from "@mui/material";
import { tokens } from "../../../theme";
import SpeedIcon from "@mui/icons-material/Speed";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Task";
import BusinessIcon from "@mui/icons-material/Business";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import InventoryIcon from "@mui/icons-material/Inventory";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

const HomePage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.background.default }}>
            {/* Sekcija 1 - Hero */}
            <Box
                sx={{
                    pt: { xs: 18, md: 24 },
                    pb: { xs: 10, md: 16 },
                    px: { xs: 2, md: 4 },
                    background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 50%, ${colors.primary[700]} 100%)`,
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `radial-gradient(circle at 20% 50%, ${colors.blueAccent[900]}40 0%, transparent 50%),
                                    radial-gradient(circle at 80% 80%, ${colors.greenAccent[900]}40 0%, transparent 50%)`,
                        pointerEvents: "none",
                    },
                }}
            >
                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: "2.5rem", md: "4rem" },
                            fontWeight: 700,
                            color: colors.grey[100],
                            mb: 3,
                            lineHeight: 1.1,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Upravljanje projektima,<br />prodajom i timom
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            fontSize: { xs: "1rem", md: "1.25rem" },
                            color: colors.grey[300],
                            mb: 6,
                            maxWidth: "700px",
                            mx: "auto",
                            lineHeight: 1.7,
                            fontWeight: 400,
                        }}
                    >
                        Centralizovana platforma za upravljanje zadacima, praćenje prodaje, komunikaciju tima i evidenciju imovine
                    </Typography>
                    
                    {/* Preview funkcionalnosti */}
                    <Grid container spacing={3} sx={{ mt: 8 }}>
                        <Grid item xs={12} md={4}>
                            <Box
                                sx={{
                                    bgcolor: `${colors.primary[400]}80`,
                                    backdropFilter: "blur(10px)",
                                    borderRadius: 3,
                                    p: 4,
                                    height: "200px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: `1px solid ${colors.grey[700]}40`,
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        bgcolor: `${colors.primary[400]}CC`,
                                        border: `1px solid ${colors.greenAccent[500]}60`,
                                    },
                                }}
                            >
                                <TaskIcon sx={{ fontSize: 64, color: colors.greenAccent[500], mb: 2 }} />
                                <Typography variant="body1" sx={{ color: colors.grey[200], textAlign: "center", fontWeight: 500 }}>
                                    Kanban board
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box
                                sx={{
                                    bgcolor: `${colors.primary[400]}80`,
                                    backdropFilter: "blur(10px)",
                                    borderRadius: 3,
                                    p: 4,
                                    height: "200px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: `1px solid ${colors.grey[700]}40`,
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        bgcolor: `${colors.primary[400]}CC`,
                                        border: `1px solid ${colors.blueAccent[500]}60`,
                                    },
                                }}
                            >
                                <TrendingUpIcon sx={{ fontSize: 64, color: colors.blueAccent[500], mb: 2 }} />
                                <Typography variant="body1" sx={{ color: colors.grey[200], textAlign: "center", fontWeight: 500 }}>
                                    Sales pipeline
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Box
                                sx={{
                                    bgcolor: `${colors.primary[400]}80`,
                                    backdropFilter: "blur(10px)",
                                    borderRadius: 3,
                                    p: 4,
                                    height: "200px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: `1px solid ${colors.grey[700]}40`,
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        bgcolor: `${colors.primary[400]}CC`,
                                        border: `1px solid ${colors.redAccent[500]}60`,
                                    },
                                }}
                            >
                                <DashboardIcon sx={{ fontSize: 64, color: colors.redAccent[500], mb: 2 }} />
                                <Typography variant="body1" sx={{ color: colors.grey[200], textAlign: "center", fontWeight: 500 }}>
                                    Dashboard metrike
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Sekcija 2 - Glavne funkcionalnosti */}
            <Box
                sx={{
                    py: { xs: 10, md: 12 },
                    px: { xs: 2, md: 4 },
                    bgcolor: theme.palette.background.default,
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Card
                                sx={{
                                    height: "100%",
                                    bgcolor: colors.primary[400],
                                    border: `1px solid ${colors.grey[700]}`,
                                    borderRadius: 3,
                                    transition: "all 0.3s ease",
                                    boxShadow: `0 4px 20px ${colors.primary[900]}40`,
                                    "&:hover": {
                                        transform: "translateY(-8px)",
                                        boxShadow: `0 12px 40px ${colors.primary[900]}60`,
                                        border: `1px solid ${colors.greenAccent[500]}40`,
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Box
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 2,
                                            bgcolor: `${colors.greenAccent[500]}20`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mb: 3,
                                        }}
                                    >
                                        <SpeedIcon
                                            sx={{
                                                fontSize: 36,
                                                color: colors.greenAccent[500],
                                            }}
                                        />
                                    </Box>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: colors.grey[100],
                                            mb: 2,
                                            fontWeight: 600,
                                        }}
                                    >
                                        Upravljanje projektima
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: colors.grey[300],
                                            lineHeight: 1.8,
                                        }}
                                    >
                                        Organizacija zadataka po projektima, dodela članova tima i praćenje napretka kroz Kanban board i kalendar
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card
                                sx={{
                                    height: "100%",
                                    bgcolor: colors.primary[400],
                                    border: `1px solid ${colors.grey[700]}`,
                                    borderRadius: 3,
                                    transition: "all 0.3s ease",
                                    boxShadow: `0 4px 20px ${colors.primary[900]}40`,
                                    "&:hover": {
                                        transform: "translateY(-8px)",
                                        boxShadow: `0 12px 40px ${colors.primary[900]}60`,
                                        border: `1px solid ${colors.blueAccent[500]}40`,
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Box
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 2,
                                            bgcolor: `${colors.blueAccent[500]}20`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mb: 3,
                                        }}
                                    >
                                        <TrendingUpIcon
                                            sx={{
                                                fontSize: 36,
                                                color: colors.blueAccent[500],
                                            }}
                                        />
                                    </Box>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: colors.grey[100],
                                            mb: 2,
                                            fontWeight: 600,
                                        }}
                                    >
                                        CRM i prodaja
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: colors.grey[300],
                                            lineHeight: 1.8,
                                        }}
                                    >
                                        Praćenje leadova, upravljanje kontaktima, pipeline prodaje i analitika performansi tima
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card
                                sx={{
                                    height: "100%",
                                    bgcolor: colors.primary[400],
                                    border: `1px solid ${colors.grey[700]}`,
                                    borderRadius: 3,
                                    transition: "all 0.3s ease",
                                    boxShadow: `0 4px 20px ${colors.primary[900]}40`,
                                    "&:hover": {
                                        transform: "translateY(-8px)",
                                        boxShadow: `0 12px 40px ${colors.primary[900]}60`,
                                        border: `1px solid ${colors.redAccent[500]}40`,
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Box
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 2,
                                            bgcolor: `${colors.redAccent[500]}20`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mb: 3,
                                        }}
                                    >
                                        <DashboardIcon
                                            sx={{
                                                fontSize: 36,
                                                color: colors.redAccent[500],
                                            }}
                                        />
                                    </Box>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            color: colors.grey[100],
                                            mb: 2,
                                            fontWeight: 600,
                                        }}
                                    >
                                        Analitika i izveštaji
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: colors.grey[300],
                                            lineHeight: 1.8,
                                        }}
                                    >
                                        Dashboard sa ključnim metrikama, pregled aktivnosti projekata i performansi zaposlenih
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Sekcija 3 - Detalji funkcionalnosti */}
            <Box
                sx={{
                    py: { xs: 10, md: 12 },
                    px: { xs: 2, md: 4 },
                    bgcolor: colors.primary[500],
                    position: "relative",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "1px",
                        background: `linear-gradient(90deg, transparent, ${colors.grey[700]}, transparent)`,
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h2"
                        sx={{
                            textAlign: "center",
                            color: colors.grey[100],
                            mb: 10,
                            fontWeight: 700,
                            fontSize: { xs: "2rem", md: "3rem" },
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Funkcionalnosti
                    </Typography>

                    {/* 1. Upravljanje zadacima */}
                    <Grid container spacing={5} sx={{ mb: 8 }}>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    bgcolor: colors.primary[400],
                                    borderRadius: 3,
                                    p: 5,
                                    height: "300px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: `1px solid ${colors.grey[700]}`,
                                    boxShadow: `0 8px 32px ${colors.primary[900]}40`,
                                    position: "relative",
                                    overflow: "hidden",
                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        top: -50,
                                        right: -50,
                                        width: 200,
                                        height: 200,
                                        borderRadius: "50%",
                                        bgcolor: `${colors.greenAccent[500]}10`,
                                        filter: "blur(40px)",
                                    },
                                }}
                            >
                                <TaskIcon sx={{ fontSize: 120, color: colors.greenAccent[500], position: "relative", zIndex: 1 }} />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center" }}>
                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: colors.grey[100],
                                        mb: 3,
                                        fontWeight: 600,
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    Upravljanje zadacima
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: colors.grey[300],
                                        lineHeight: 1.9,
                                        fontSize: "1.05rem",
                                    }}
                                >
                                    Organizacija zadataka po projektima sa Kanban board prikazom. Dodela članova tima, postavljanje rokova i praćenje statusa kroz listu, board ili kalendar prikaz.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* 2. Sales & CRM */}
                    <Grid container spacing={5} sx={{ mb: 8 }}>
                        <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center", order: { xs: 2, md: 1 } }}>
                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: colors.grey[100],
                                        mb: 3,
                                        fontWeight: 600,
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    Sales & CRM
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: colors.grey[300],
                                        lineHeight: 1.9,
                                        fontSize: "1.05rem",
                                    }}
                                >
                                    Upravljanje leadovima, kontaktima i prodajnim procesom. Pipeline prikaz prodaje, automatsko praćenje follow-up aktivnosti i centralizovana baza kontakata.
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
                            <Box
                                sx={{
                                    bgcolor: colors.primary[400],
                                    borderRadius: 3,
                                    p: 5,
                                    height: "300px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: `1px solid ${colors.grey[700]}`,
                                    boxShadow: `0 8px 32px ${colors.primary[900]}40`,
                                    position: "relative",
                                    overflow: "hidden",
                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        top: -50,
                                        left: -50,
                                        width: 200,
                                        height: 200,
                                        borderRadius: "50%",
                                        bgcolor: `${colors.blueAccent[500]}10`,
                                        filter: "blur(40px)",
                                    },
                                }}
                            >
                                <TrendingUpIcon sx={{ fontSize: 120, color: colors.blueAccent[500], position: "relative", zIndex: 1 }} />
                            </Box>
                        </Grid>
                    </Grid>

                    {/* 3. Dashboard i analitika */}
                    <Grid container spacing={5} sx={{ mb: 8 }}>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    bgcolor: colors.primary[400],
                                    borderRadius: 3,
                                    p: 5,
                                    height: "300px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: `1px solid ${colors.grey[700]}`,
                                    boxShadow: `0 8px 32px ${colors.primary[900]}40`,
                                    position: "relative",
                                    overflow: "hidden",
                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        bottom: -50,
                                        right: -50,
                                        width: 200,
                                        height: 200,
                                        borderRadius: "50%",
                                        bgcolor: `${colors.redAccent[500]}10`,
                                        filter: "blur(40px)",
                                    },
                                }}
                            >
                                <AnalyticsIcon sx={{ fontSize: 120, color: colors.redAccent[500], position: "relative", zIndex: 1 }} />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center" }}>
                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: colors.grey[100],
                                        mb: 3,
                                        fontWeight: 600,
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    Dashboard i analitika
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: colors.grey[300],
                                        lineHeight: 1.9,
                                        fontSize: "1.05rem",
                                    }}
                                >
                                    Pregled ključnih metrika u realnom vremenu: status projekata, performanse tima, prodajni rezultati i aktivnosti. Vizuelni prikaz podataka za brže donošenje odluka.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    {/* 4. Upravljanje prodajom */}
                    <Grid container spacing={5} sx={{ mb: 8 }}>
                        <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center", order: { xs: 2, md: 1 } }}>
                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: colors.grey[100],
                                        mb: 3,
                                        fontWeight: 600,
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    Upravljanje prodajom
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: colors.grey[300],
                                        mb: 3,
                                        lineHeight: 1.9,
                                        fontSize: "1.05rem",
                                    }}
                                >
                                    Kompletan modul za upravljanje prodajom: upravljanje timom, postavljanje ciljeva, konfiguracija strategije, upravljanje cenama, baza kontakata i analitika performansi.
                                </Typography>
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                                    {["Tim", "Ciljevi", "Strategija", "Cene", "Kontakti", "Analitika"].map((item) => (
                                        <Box
                                            key={item}
                                            sx={{
                                                bgcolor: colors.primary[600],
                                                px: 2.5,
                                                py: 1,
                                                borderRadius: 2,
                                                border: `1px solid ${colors.grey[700]}`,
                                                transition: "all 0.2s ease",
                                                "&:hover": {
                                                    bgcolor: colors.primary[500],
                                                    border: `1px solid ${colors.greenAccent[500]}40`,
                                                },
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: colors.grey[200],
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {item}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
                            <Box
                                sx={{
                                    bgcolor: colors.primary[400],
                                    borderRadius: 3,
                                    p: 5,
                                    height: "300px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: `1px solid ${colors.grey[700]}`,
                                    boxShadow: `0 8px 32px ${colors.primary[900]}40`,
                                    position: "relative",
                                    overflow: "hidden",
                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        top: -50,
                                        right: -50,
                                        width: 200,
                                        height: 200,
                                        borderRadius: "50%",
                                        bgcolor: `${colors.greenAccent[500]}10`,
                                        filter: "blur(40px)",
                                    },
                                }}
                            >
                                <BusinessIcon sx={{ fontSize: 120, color: colors.greenAccent[500], position: "relative", zIndex: 1 }} />
                            </Box>
                        </Grid>
                    </Grid>

                    {/* 5. Imovina */}
                    <Grid container spacing={5}>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    bgcolor: colors.primary[400],
                                    borderRadius: 3,
                                    p: 5,
                                    height: "300px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: `1px solid ${colors.grey[700]}`,
                                    boxShadow: `0 8px 32px ${colors.primary[900]}40`,
                                    position: "relative",
                                    overflow: "hidden",
                                    gap: 4,
                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        top: -50,
                                        left: -50,
                                        width: 200,
                                        height: 200,
                                        borderRadius: "50%",
                                        bgcolor: `${colors.blueAccent[500]}10`,
                                        filter: "blur(40px)",
                                    },
                                }}
                            >
                                <InventoryIcon sx={{ fontSize: 90, color: colors.blueAccent[500], position: "relative", zIndex: 1 }} />
                                <DirectionsCarIcon sx={{ fontSize: 90, color: colors.redAccent[500], position: "relative", zIndex: 1 }} />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center" }}>
                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: colors.grey[100],
                                        mb: 3,
                                        fontWeight: 600,
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    Evidencija imovine
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: colors.grey[300],
                                        lineHeight: 1.9,
                                        fontSize: "1.05rem",
                                    }}
                                >
                                    Kompletan inventar pokretne i nepokretne imovine, kao i evidencija vozila. Praćenje lokacija, statusa i vrednosti imovine.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            </Box>
    );
};

export default HomePage;
