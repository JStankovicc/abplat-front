import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";

/**
 * Dialog za kreiranje ili izmenu događaja u kalendaru.
 */
const EventDialog = ({
  open,
  onClose,
  isEditing,
  eventDetails,
  onEventDetailsChange,
  onSave,
  onDelete,
  loading,
  colors,
  fullScreen = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fieldSx = {
    "& .MuiInputBase-input": {
      color: colors.grey[100],
      fontSize: isMobile ? "16px" : undefined,
    },
    "& .MuiInputLabel-root": { color: colors.grey[300] },
    "& .MuiInputLabel-root.Mui-focused": { color: colors.grey[100] },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[600] },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.grey[500],
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.blueAccent?.[500] ?? colors.grey[400],
      borderWidth: "1px",
    },
    "& .MuiInputBase-input::placeholder": { color: colors.grey[500], opacity: 1 },
  };

  const selectSx = {
    color: colors.grey[100],
    "& .MuiSelect-icon": { color: colors.grey[300] },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[600] },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: colors.blueAccent?.[500] ?? colors.grey[400],
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          backgroundColor: colors.primary[400],
          border: `1px solid ${colors.grey[700]}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
          fontWeight: 600,
          fontSize: isMobile ? "1.25rem" : "1.375rem",
          letterSpacing: "-0.01em",
          pt: isMobile ? 3 : 2.5,
          px: isMobile ? 2.5 : 3,
          pb: 2,
          borderBottom: `1px solid ${colors.grey[700]}`,
        }}
      >
        {isEditing ? "Uredi događaj" : "Novi događaj"}
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: colors.primary[400],
          px: isMobile ? 2.5 : 3,
          pt: 3.5,
          pb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Naziv događaja"
              value={eventDetails.title}
              onChange={(e) => onEventDetailsChange({ ...eventDetails, title: e.target.value })}
              required
              placeholder="Unesite naziv"
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth sx={fieldSx}>
              <InputLabel id="event-priority-label">Prioritet</InputLabel>
              <Select
                labelId="event-priority-label"
                label="Prioritet"
                value={eventDetails.priority}
                onChange={(e) => onEventDetailsChange({ ...eventDetails, priority: e.target.value })}
                sx={selectSx}
              >
                <MenuItem value="LOW">Nizak</MenuItem>
                <MenuItem value="NORMAL">Normalan</MenuItem>
                <MenuItem value="HIGH">Visok</MenuItem>
                <MenuItem value="URGENT">Hitan</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Opis"
          placeholder="Opciono"
          multiline
          rows={isMobile ? 3 : 4}
          value={eventDetails.description}
          onChange={(e) => onEventDetailsChange({ ...eventDetails, description: e.target.value })}
          sx={fieldSx}
        />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Početak"
              type="datetime-local"
              value={eventDetails.start}
              onChange={(e) => onEventDetailsChange({ ...eventDetails, start: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Kraj"
              type="datetime-local"
              value={eventDetails.end}
              onChange={(e) => onEventDetailsChange({ ...eventDetails, end: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={fieldSx}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: colors.primary[400],
          px: isMobile ? 2.5 : 3,
          py: 2,
          gap: 1,
          borderTop: `1px solid ${colors.grey[700]}`,
          flexWrap: "wrap",
        }}
      >
        {isEditing && (
          <Button
            onClick={onDelete}
            variant="outlined"
            color="error"
            disabled={loading}
            sx={{ order: 0, mr: "auto" }}
          >
            Obriši
          </Button>
        )}
        <Box sx={{ display: "flex", gap: 1, ml: isEditing ? 0 : "auto" }}>
          <Button
            onClick={onClose}
            variant="text"
            sx={{ color: colors.grey[300] }}
            disabled={loading}
          >
            Otkaži
          </Button>
          <Button
            onClick={onSave}
            variant="contained"
            color="secondary"
            disabled={loading || !eventDetails.title || !eventDetails.start || !eventDetails.end}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {loading ? "Čuva…" : isEditing ? "Sačuvaj" : "Kreiraj"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EventDialog;
