import { Box, Typography, Chip } from "@mui/material";
import DetailItem from "./DetailItem";

/**
 * User profile section (role, registration, last login).
 */
const UserProfileSection = ({ user, colors, sectionStyle, scrollableContent }) => (
  <Box sx={sectionStyle}>
    <Typography variant="h5" mb="15px">
      Profil
    </Typography>
    <Box sx={scrollableContent}>
      <DetailItem
        label="Uloga"
        value={
          <Chip
            label={user.access}
            sx={{
              backgroundColor:
                user.access === "admin"
                  ? colors.greenAccent[600]
                  : user.access === "manager"
                  ? colors.blueAccent[700]
                  : colors.grey[700],
              color: "white",
            }}
          />
        }
        colors={colors}
      />
      <DetailItem label="Datum registracije" value="2023-01-15" colors={colors} />
      <DetailItem label="Poslednja prijava" value="2023-10-20 14:30" colors={colors} />
    </Box>
  </Box>
);

export default UserProfileSection;
