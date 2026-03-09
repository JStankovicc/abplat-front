import { Box } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";

const Pie = () => {
  return (
    <Box m={{ xs: 1.5, sm: 2, md: "20px" }} sx={{ pb: 2, overflow: "hidden" }}>
      <Header title="Pie Chart" subtitle="Simple Pie Chart" />
      <Box height={{ xs: "50vh", md: "75vh" }} minHeight={280} sx={{ width: "100%" }}>
        <PieChart />
      </Box>
    </Box>
  );
};

export default Pie;
