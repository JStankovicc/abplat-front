import { Box, Paper } from "@mui/material";
import Shimmer from "../Shimmer";

/**
 * Loading skeleton for the dashboard grid layout.
 */
const DashboardShimmer = ({ colors }) => (
  <Box
    display="grid"
    gridTemplateColumns="repeat(12, 1fr)"
    gridTemplateRows="repeat(5, 1fr)"
    gap="15px"
    height="100%"
    width="75%"
    overflow="hidden"
  >
    {/* Notifications shimmer */}
    <Paper
      elevation={3}
      sx={{
        gridColumn: "span 8",
        gridRow: "span 3",
        backgroundColor: colors.primary[400],
        borderRadius: "12px",
        p: "12px",
      }}
    >
      <Box display="flex" alignItems="center" mb="10px">
        <Shimmer width="40px" height="40px" borderRadius="50%" sx={{ mr: 2 }} />
        <Shimmer width="150px" height="24px" />
      </Box>
      <Box textAlign="center" py={2}>
        <Shimmer width="80px" height="80px" borderRadius="50%" sx={{ mx: "auto", mb: 2 }} />
        <Shimmer width="200px" height="20px" sx={{ mx: "auto" }} />
      </Box>
    </Paper>

    {/* Inbox shimmer */}
    <Paper
      elevation={3}
      sx={{
        gridColumn: "span 4",
        gridRow: "span 3",
        backgroundColor: colors.primary[400],
        borderRadius: "12px",
        p: "12px",
      }}
    >
      <Box display="flex" alignItems="center" mb="10px">
        <Shimmer width="40px" height="40px" borderRadius="50%" sx={{ mr: 2 }} />
        <Shimmer width="120px" height="20px" />
      </Box>
      <Box display="flex" alignItems="center" mb="12px">
        <Shimmer width="36px" height="36px" borderRadius="50%" sx={{ mr: 2 }} />
        <Box flex={1}>
          <Shimmer width="100px" height="16px" sx={{ mb: 1 }} />
          <Shimmer width="60px" height="12px" />
        </Box>
      </Box>
      <Shimmer width="100%" height="40px" sx={{ mb: 2 }} />
      <Shimmer width="80px" height="12px" />
    </Paper>

    {/* Projects shimmer */}
    {[1, 2, 3].map((i) => (
      <Paper
        key={i}
        elevation={3}
        sx={{
          gridColumn: "span 4",
          gridRow: "span 1",
          backgroundColor: colors.primary[400],
          borderRadius: "12px",
          p: "12px",
        }}
      >
        <Box display="flex" alignItems="center" mb="8px">
          <Shimmer width="32px" height="32px" borderRadius="50%" sx={{ mr: 1.5 }} />
          <Box flex={1}>
            <Shimmer width="80px" height="14px" sx={{ mb: 0.5 }} />
            <Shimmer width="60px" height="10px" />
          </Box>
        </Box>
        <Shimmer width="100%" height="4px" sx={{ mb: 1 }} />
        <Box sx={{ maxHeight: "120px", overflowY: "auto" }}>
          {[1, 2, 3].map((j) => (
            <Box key={j} display="flex" alignItems="center" mb={0.5}>
              <Shimmer width="20px" height="20px" borderRadius="50%" sx={{ mr: 1 }} />
              <Box flex={1}>
                <Shimmer width="100px" height="12px" sx={{ mb: 0.5 }} />
                <Shimmer width="60px" height="10px" />
              </Box>
            </Box>
          ))}
        </Box>
        <Box mt={1} textAlign="center">
          <Shimmer width="120px" height="10px" sx={{ mx: "auto" }} />
        </Box>
      </Paper>
    ))}
  </Box>
);

export default DashboardShimmer;
