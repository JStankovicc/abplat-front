import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb={{ xs: 2, md: "30px" }}>
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0", fontSize: { xs: 22, sm: 26, md: 32 } }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]} sx={{ fontSize: { xs: 13, md: 16 } }}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
