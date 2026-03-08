import { Box, Typography, TextField, Grid } from "@mui/material";

/**
 * Contact information section.
 */
const ContactInfoSection = ({ formData, onChange, colors, isMobile }) => (
  <Box
    p="20px"
    borderRadius="4px"
    sx={{ backgroundColor: colors.primary[400], minHeight: "30vh" }}
  >
    <Typography variant="h3" sx={{ mb: "20px", fontSize: isMobile ? "20px" : "24px" }}>
      Kontakt Informacije
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          sx={{ mb: 2 }}
          InputProps={{ style: { color: colors.grey[100] } }}
          InputLabelProps={{ style: { color: colors.grey[100] } }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Telefon"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          sx={{ mb: 2 }}
          InputProps={{ style: { color: colors.grey[100] } }}
          InputLabelProps={{ style: { color: colors.grey[100] } }}
        />
      </Grid>
    </Grid>
  </Box>
);

export default ContactInfoSection;
