import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

/**
 * Sidebar profile section (avatar, name, company).
 */
const SidebarProfile = ({ userProfile, companyInfo, getProfileImageUrl, isMobile }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box mb="25px">
      <Box display="flex" justifyContent="center" alignItems="center">
        <img
          alt="profile-user"
          width="100px"
          height="100px"
          src={getProfileImageUrl()}
          style={{
            cursor: "pointer",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </Box>
      <Box textAlign="center">
        <Typography
          variant="h3"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ m: "10px 0 0 0", fontSize: isMobile ? "1.5rem" : "1.75rem" }}
        >
          {userProfile?.displayName || "Loading..."}
        </Typography>
        <Typography
          variant="h5"
          color={colors.greenAccent[500]}
          sx={{ fontSize: isMobile ? "0.9rem" : "1.1rem" }}
        >
          {companyInfo?.companyName || "Loading..."}
        </Typography>
      </Box>
    </Box>
  );
};

export default SidebarProfile;
