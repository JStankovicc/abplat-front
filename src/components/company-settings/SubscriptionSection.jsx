import { Box, Typography, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

/**
 * Subscription settings section.
 */
const SubscriptionSection = ({ formData, onChange, colors, isMobile }) => (
  <Box
    p="20px"
    borderRadius="4px"
    sx={{ backgroundColor: colors.primary[400], minHeight: "30vh" }}
  >
    <Typography variant="h3" sx={{ mb: "20px", fontSize: isMobile ? "20px" : "24px" }}>
      Podešavanja Pretplate
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel style={{ color: colors.grey[100] }}>Tip podrške</InputLabel>
          <Select
            name="supportType"
            value={formData.supportType}
            onChange={onChange}
            sx={{ color: colors.grey[100] }}
          >
            <MenuItem value="24/7">24/7 Podrška</MenuItem>
            <MenuItem value="business">Radno vreme</MenuItem>
            <MenuItem value="standard">Standardna podrška</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Broj profila"
          name="numProfiles"
          type="number"
          value={formData.numProfiles}
          onChange={onChange}
          InputProps={{ inputProps: { min: 1, max: 50 } }}
          InputLabelProps={{ style: { color: colors.grey[100] } }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel style={{ color: colors.grey[100] }}>Veličina paketa</InputLabel>
          <Select
            name="packageSize"
            value={formData.packageSize}
            onChange={onChange}
            sx={{ color: colors.grey[100] }}
          >
            <MenuItem value="small">Mali paket (10GB)</MenuItem>
            <MenuItem value="medium">Srednji paket (50GB)</MenuItem>
            <MenuItem value="large">Veliki paket (100GB)</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  </Box>
);

export default SubscriptionSection;
