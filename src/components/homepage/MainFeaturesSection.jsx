import { Box, Typography, Container, Grid, Card, CardContent } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DashboardIcon from "@mui/icons-material/Dashboard";

/**
 * Main features section with 3 cards: Projects, CRM, Analytics.
 */
const MainFeaturesSection = ({ theme, colors }) => {
  const features = [
    {
      icon: <SpeedIcon sx={{ fontSize: 36, color: colors.greenAccent[500] }} />,
      title: "Upravljanje projektima",
      description:
        "Organizacija zadataka po projektima, dodela članova tima i praćenje napretka kroz Kanban board i kalendar",
      bgColor: `${colors.greenAccent[500]}20`,
      hoverBorder: colors.greenAccent[500],
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 36, color: colors.blueAccent[500] }} />,
      title: "CRM i prodaja",
      description:
        "Praćenje leadova, upravljanje kontaktima, pipeline prodaje i analitika performansi tima",
      bgColor: `${colors.blueAccent[500]}20`,
      hoverBorder: colors.blueAccent[500],
    },
    {
      icon: <DashboardIcon sx={{ fontSize: 36, color: colors.redAccent[500] }} />,
      title: "Analitika i izveštaji",
      description:
        "Dashboard sa ključnim metrikama, pregled aktivnosti projekata i performansi zaposlenih",
      bgColor: `${colors.redAccent[500]}20`,
      hoverBorder: colors.redAccent[500],
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 10, md: 12 },
        px: { xs: 2, md: 4 },
        bgcolor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid item xs={12} md={4} key={feature.title}>
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
                    border: `1px solid ${feature.hoverBorder}40`,
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      bgcolor: feature.bgColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: colors.grey[100], mb: 2, fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: colors.grey[300], lineHeight: 1.8 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default MainFeaturesSection;
