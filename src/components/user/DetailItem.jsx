import { Box, Typography } from "@mui/material";

/**
 * Label-value pair for user detail sections.
 */
const DetailItem = ({ label, value, colors }) => (
  <Box display="flex" justifyContent="space-between" mb="10px" component="div">
    <Typography variant="body1" color={colors.grey[100]} component="div">
      {label}:
    </Typography>
    <Typography variant="body1" fontWeight="600" component="div">
      {value}
    </Typography>
  </Box>
);

export default DetailItem;
