import { Box, Typography } from "@mui/material";
import DetailItem from "./DetailItem";

/**
 * Personal information section.
 */
const UserInfoSection = ({ user, colors, sectionStyle, scrollableContent }) => (
  <Box sx={sectionStyle}>
    <Typography variant="h5" mb="15px">
      Lične informacije
    </Typography>
    <Box sx={scrollableContent}>
      <DetailItem label="Ime" value={user.name} colors={colors} />
      <DetailItem label="Email" value={user.email} colors={colors} />
      <DetailItem label="Telefon" value={user.phone} colors={colors} />
      <DetailItem label="Godine" value={user.age} colors={colors} />
    </Box>
  </Box>
);

export default UserInfoSection;
