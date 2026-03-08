import { Box, Typography, Grid } from "@mui/material";
import PieChart from "../PieChart";
import DetailItem from "./DetailItem";

/**
 * User statistics section with pie chart.
 */
const UserStatsSection = ({
  difficultyData,
  totalTasks,
  activeTasks,
  averageCompletionTime,
  colors,
  sectionStyle,
  scrollableContent,
}) => (
  <Box sx={sectionStyle}>
    <Typography variant="h5" mb="15px">
      Statistika
    </Typography>
    <Box sx={{ ...scrollableContent, display: "flex", flexDirection: "column" }}>
      <Box flex={1} minHeight={250}>
        <PieChart data={difficultyData} />
      </Box>
      <Box mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DetailItem label="Ukupno taskova" value={totalTasks} colors={colors} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DetailItem label="Aktivnih taskova" value={activeTasks} colors={colors} />
          </Grid>
          <Grid item xs={12}>
            <DetailItem label="Prosečno vreme" value={averageCompletionTime} colors={colors} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  </Box>
);

export default UserStatsSection;
