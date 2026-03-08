import { Box, useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../../../theme";
import {
  HomeHero,
  MainFeaturesSection,
  HomeFeaturesSection,
} from "../../../components/homepage";

const HomePage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: theme.palette.background.default }}>
      <HomeHero colors={colors} />
      <MainFeaturesSection theme={theme} colors={colors} />
      <HomeFeaturesSection colors={colors} />
    </Box>
  );
};

export default HomePage;
