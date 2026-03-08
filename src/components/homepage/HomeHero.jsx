import { Box, Typography, Container, Grid } from "@mui/material";
import TaskIcon from "@mui/icons-material/Task";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DashboardIcon from "@mui/icons-material/Dashboard";

/**
 * Hero section with headline and feature preview cards.
 */
const HomeHero = ({ colors }) => (
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
        Upravljanje projektima,
        <br />
        prodajom i timom
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
        Centralizovana platforma za upravljanje zadacima, praćenje prodaje, komunikaciju tima i
        evidenciju imovine
      </Typography>

      <Grid container spacing={3} sx={{ mt: 8 }}>
        <Grid item xs={12} md={4}>
          <FeaturePreviewCard
            icon={<TaskIcon sx={{ fontSize: 64, color: colors.greenAccent[500], mb: 2 }} />}
            label="Kanban board"
            colors={colors}
            hoverBorderColor={colors.greenAccent[500]}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FeaturePreviewCard
            icon={<TrendingUpIcon sx={{ fontSize: 64, color: colors.blueAccent[500], mb: 2 }} />}
            label="Sales pipeline"
            colors={colors}
            hoverBorderColor={colors.blueAccent[500]}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FeaturePreviewCard
            icon={<DashboardIcon sx={{ fontSize: 64, color: colors.redAccent[500], mb: 2 }} />}
            label="Dashboard metrike"
            colors={colors}
            hoverBorderColor={colors.redAccent[500]}
          />
        </Grid>
      </Grid>
    </Container>
  </Box>
);

/**
 * Single feature preview card in hero section.
 */
const FeaturePreviewCard = ({ icon, label, colors, hoverBorderColor }) => (
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
        border: `1px solid ${hoverBorderColor}60`,
      },
    }}
  >
    {icon}
    <Typography
      variant="body1"
      sx={{ color: colors.grey[200], textAlign: "center", fontWeight: 500 }}
    >
      {label}
    </Typography>
  </Box>
);

export default HomeHero;
