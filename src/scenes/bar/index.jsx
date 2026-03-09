import { Box } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";

const Bar = () => {
  return (
    <Box m={{ xs: 1.5, sm: 2, md: "20px" }} sx={{ pb: 2, overflow: "hidden" }}>
      <Header title="Bar Chart" subtitle="Simple Bar Chart" />
      <Box height={{ xs: "50vh", md: "75vh" }} minHeight={280} sx={{ width: "100%" }}>
        <BarChart />
      </Box>
    </Box>
  );
};

export default Bar;
