import { Box, Typography, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

/**
 * Basic company information section (logo, name, address).
 */
const BasicInfoSection = ({ formData, onChange, onFileChange, colors, isMobile }) => (
  <Box
    p="20px"
    borderRadius="4px"
    sx={{ backgroundColor: colors.primary[400], minHeight: "40vh" }}
  >
    <Typography variant="h3" sx={{ mb: "20px", fontSize: isMobile ? "20px" : "24px" }}>
      Osnovne Informacije
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
        <img
          src="/assets/logoipsum-378.svg"
          alt="Company Logo"
          style={{
            maxWidth: "200px",
            maxHeight: "200px",
            borderRadius: "8px",
            border: `2px solid ${colors.grey[700]}`,
          }}
        />
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="logo-upload"
          type="file"
          onChange={onFileChange}
        />
        <label htmlFor="logo-upload">
          <Button
            fullWidth
            variant="outlined"
            component="span"
            color="secondary"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 2 }}
          >
            Promeni Logo
          </Button>
        </label>
      </Grid>
      <Grid item xs={12} md={8}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Naziv Kompanije"
              name="companyName"
              value={formData.companyName}
              onChange={onChange}
              sx={{ mb: 2 }}
              InputProps={{ style: { color: colors.grey[100] } }}
              InputLabelProps={{ style: { color: colors.grey[100] } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel style={{ color: colors.grey[100] }}>Država</InputLabel>
              <Select
                name="country"
                value={formData.country}
                onChange={onChange}
                sx={{ color: colors.grey[100] }}
              >
                <MenuItem value="rs">Srbija</MenuItem>
                <MenuItem value="hr">Hrvatska</MenuItem>
                <MenuItem value="ba">Bosna</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel style={{ color: colors.grey[100] }}>Grad</InputLabel>
              <Select
                name="city"
                value={formData.city}
                onChange={onChange}
                sx={{ color: colors.grey[100] }}
              >
                <MenuItem value="beograd">Beograd</MenuItem>
                <MenuItem value="novi-sad">Novi Sad</MenuItem>
                <MenuItem value="banja-luka">Banja Luka</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Okrug"
              name="district"
              value={formData.district}
              onChange={onChange}
              sx={{ mb: 2 }}
              InputProps={{ style: { color: colors.grey[100] } }}
              InputLabelProps={{ style: { color: colors.grey[100] } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Adresa"
              name="address"
              value={formData.address}
              onChange={onChange}
              sx={{ mb: 2 }}
              InputProps={{ style: { color: colors.grey[100] } }}
              InputLabelProps={{ style: { color: colors.grey[100] } }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Box>
);

export default BasicInfoSection;
