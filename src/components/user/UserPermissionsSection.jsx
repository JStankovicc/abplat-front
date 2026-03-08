import { Box, Typography } from "@mui/material";
import DetailItem from "./DetailItem";

/**
 * User permissions section.
 */
const UserPermissionsSection = ({ user, colors, sectionStyle, scrollableContent }) => (
  <Box sx={sectionStyle}>
    <Typography variant="h5" mb="15px">
      Dozvole
    </Typography>
    <Box sx={scrollableContent}>
      <DetailItem label="Pregled sadržaja" value="✓" colors={colors} />
      <DetailItem
        label="Izmena sadržaja"
        value={user.access === "admin" ? "✓" : "✗"}
        colors={colors}
      />
      <DetailItem
        label="Upravljanje korisnicima"
        value={user.access === "admin" || user.access === "manager" ? "✓" : "✗"}
        colors={colors}
      />
      <DetailItem label="Administracija" value={user.access === "admin" ? "✓" : "✗"} colors={colors} />
    </Box>
  </Box>
);

export default UserPermissionsSection;
