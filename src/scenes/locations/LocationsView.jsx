import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useMemo } from "react";
import { tokens } from "../../theme";
import LocationsSection from "../../components/locations/LocationsSection";

const LocationsView = () => {
  const theme = useTheme();
  const colors = useMemo(() => tokens(theme.palette.mode), [theme.palette.mode]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(180deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`
            : colors.primary[400],
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          pt: { xs: 2.5, md: 3 },
          pb: 2,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: 700,
            color: colors.grey[100],
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          Lokacije
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: colors.grey[400],
            maxWidth: 560,
            fontSize: "0.9375rem",
          }}
        >
          Upravljanje kancelarijama, radnim mestima, magacinima i zonama unutar magacina na jednom mestu.
        </Typography>
      </Box>

      <Box sx={{ flex: 1, px: { xs: 2, sm: 3 }, pb: 3 }}>
        <LocationsSection />
      </Box>
    </Box>
  );
};

export default LocationsView;
