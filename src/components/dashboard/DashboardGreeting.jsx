import { Box, Typography, Chip, useMediaQuery, useTheme } from "@mui/material";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Dobro jutro";
  if (hour < 18) return "Dobar dan";
  return "Dobro veče";
};

const getFormattedDate = () =>
  new Date().toLocaleDateString("sr-RS", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const DashboardGreeting = ({ displayName, colors }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const firstName = displayName?.trim().split(/\s+/)[0] ?? displayName ?? "";

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.blueAccent[800]} 100%)`,
        borderRadius: "16px",
        p: { xs: "14px 16px", md: "18px 24px" },
        mb: { xs: 2, md: 2.5 },
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 1.5, sm: 0 },
        boxShadow: `0 4px 24px rgba(0,0,0,0.25)`,
        border: `1px solid ${colors.blueAccent[700]}40`,
      }}
    >
      <Box display="flex" alignItems="center" gap={{ xs: 1.5, md: 2 }}>
        <Box
          sx={{
            backgroundColor: `${colors.greenAccent[700]}50`,
            borderRadius: "50%",
            p: { xs: 0.8, md: 1 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px solid ${colors.greenAccent[600]}50`,
            flexShrink: 0,
          }}
        >
          <WavingHandIcon
            sx={{ color: colors.greenAccent[400], fontSize: { xs: "1.4rem", md: "1.6rem" } }}
          />
        </Box>
        <Box>
          <Typography
            fontWeight="700"
            color={colors.grey[100]}
            sx={{ fontSize: { xs: "1.05rem", md: "1.3rem" }, lineHeight: 1.25 }}
          >
            {getGreeting()}{firstName ? `, ${firstName}` : ""}!
          </Typography>
          <Box display="flex" alignItems="center" gap={0.6} mt={0.3}>
            <CalendarTodayOutlinedIcon sx={{ fontSize: "0.75rem", color: colors.grey[400] }} />
            <Typography variant="body2" color={colors.grey[400]} sx={{ fontSize: "0.78rem" }}>
              {getFormattedDate()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {!isMobile && (
        <Chip
          label="Dashboard"
          size="small"
          sx={{
            bgcolor: `${colors.blueAccent[800]}90`,
            color: colors.blueAccent[300],
            border: `1px solid ${colors.blueAccent[600]}60`,
            fontWeight: 600,
            fontSize: "0.7rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        />
      )}
    </Box>
  );
};

export default DashboardGreeting;
