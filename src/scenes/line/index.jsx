import { Box } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";

const Line = () => {
  return (
    <Box m={{ xs: 1.5, sm: 2, md: "20px" }} sx={{ pb: 2, overflow: "hidden" }}>
      <Header title="Line Chart" subtitle="Simple Line Chart" />
      <Box height={{ xs: "50vh", md: "75vh" }} minHeight={280} sx={{ width: "100%" }}>
        <LineChart />
      </Box>
    </Box>
  );
};

export default Line;
