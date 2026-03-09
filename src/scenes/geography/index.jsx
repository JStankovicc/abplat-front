import { Box, useTheme } from "@mui/material";
import GeographyChart from "../../components/GeographyChart";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Geography = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m={{ xs: 1.5, sm: 2, md: "20px" }} sx={{ pb: 2, overflow: "hidden" }}>
      <Header title="Geography" subtitle="Simple Geography Chart" />
      <Box
        height={{ xs: "50vh", md: "75vh" }}
        minHeight={280}
        border={`1px solid ${colors.grey[100]}`}
        borderRadius="4px"
        sx={{ width: "100%" }}
      >
        <GeographyChart />
      </Box>
    </Box>
  );
};

export default Geography;
