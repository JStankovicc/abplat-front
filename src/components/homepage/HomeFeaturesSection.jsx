import { Box, Typography, Container } from "@mui/material";
import TaskIcon from "@mui/icons-material/Task";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import BusinessIcon from "@mui/icons-material/Business";
import InventoryIcon from "@mui/icons-material/Inventory";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import FeatureBlock from "./FeatureBlock";

/**
 * Detailed features section with 5 feature blocks.
 */
const HomeFeaturesSection = ({ colors }) => {
  const features = [
    {
      title: "Upravljanje zadacima",
      description:
        "Organizacija zadataka po projektima sa Kanban board prikazom. Dodela članova tima, postavljanje rokova i praćenje statusa kroz listu, board ili kalendar prikaz.",
      icon: <TaskIcon sx={{ fontSize: 120, color: colors.greenAccent[500], position: "relative", zIndex: 1 }} />,
      blurColor: `${colors.greenAccent[500]}10`,
      iconPosition: "left",
    },
    {
      title: "Sales & CRM",
      description:
        "Upravljanje leadovima, kontaktima i prodajnim procesom. Pipeline prikaz prodaje, automatsko praćenje follow-up aktivnosti i centralizovana baza kontakata.",
      icon: <TrendingUpIcon sx={{ fontSize: 120, color: colors.blueAccent[500], position: "relative", zIndex: 1 }} />,
      blurColor: `${colors.blueAccent[500]}10`,
      iconPosition: "right",
    },
    {
      title: "Dashboard i analitika",
      description:
        "Pregled ključnih metrika u realnom vremenu: status projekata, performanse tima, prodajni rezultati i aktivnosti. Vizuelni prikaz podataka za brže donošenje odluka.",
      icon: <AnalyticsIcon sx={{ fontSize: 120, color: colors.redAccent[500], position: "relative", zIndex: 1 }} />,
      blurColor: `${colors.redAccent[500]}10`,
      iconPosition: "left",
    },
    {
      title: "Upravljanje prodajom",
      description:
        "Kompletan modul za upravljanje prodajom: upravljanje timom, postavljanje ciljeva, konfiguracija strategije, upravljanje cenama, baza kontakata i analitika performansi.",
      icon: <BusinessIcon sx={{ fontSize: 120, color: colors.greenAccent[500], position: "relative", zIndex: 1 }} />,
      blurColor: `${colors.greenAccent[500]}10`,
      iconPosition: "right",
      tags: ["Tim", "Ciljevi", "Strategija", "Cene", "Kontakti", "Analitika"],
    },
    {
      title: "Evidencija imovine",
      description:
        "Kompletan inventar pokretne i nepokretne imovine, kao i evidencija vozila. Praćenje lokacija, statusa i vrednosti imovine.",
      icon: (
        <Box sx={{ display: "flex", gap: 4, position: "relative", zIndex: 1 }}>
          <InventoryIcon sx={{ fontSize: 90, color: colors.blueAccent[500] }} />
          <DirectionsCarIcon sx={{ fontSize: 90, color: colors.redAccent[500] }} />
        </Box>
      ),
      blurColor: `${colors.blueAccent[500]}10`,
      iconPosition: "left",
    },
  ];

  return (
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

        {features.map((feature, index) => (
          <FeatureBlock
            key={feature.title}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            colors={colors}
            blurColor={feature.blurColor}
            iconPosition={index % 2 === 0 ? "left" : "right"}
            tags={feature.tags}
            isLast={index === features.length - 1}
          />
        ))}
      </Container>
    </Box>
  );
};

export default HomeFeaturesSection;
