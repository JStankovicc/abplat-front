import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
} from "@mui/material";

/**
 * Dialog for creating or editing calendar events.
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
}) => {
  const fieldSx = {
    "& .MuiInputBase-input": { color: colors.grey[100] },
    "& .MuiInputLabel-root": { color: colors.grey[100] },
  };

  const selectSx = {
    color: colors.grey[100],
    "& .MuiSelect-icon": { color: colors.grey[100] },
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle
        sx={{
          backgroundColor: colors.primary[400],
          color: colors.grey[100],
          borderBottom: `1px solid ${colors.grey[700]}`,
        }}
      >
        {isEditing ? "Uredi Događaj" : "Novi Događaj"}
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: colors.primary[400],
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Naziv događaja"
              value={eventDetails.title}
              onChange={(e) => onEventDetailsChange({ ...eventDetails, title: e.target.value })}
              required
              sx={fieldSx}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: colors.grey[100] }}>Prioritet</InputLabel>
              <Select
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
          label="Opis događaja"
          multiline
          rows={3}
          value={eventDetails.description}
          onChange={(e) => onEventDetailsChange({ ...eventDetails, description: e.target.value })}
          sx={fieldSx}
        />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
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

        <Divider sx={{ borderColor: colors.grey[700] }} />

        <Typography variant="body2" sx={{ color: colors.grey[300], fontStyle: "italic", mt: 2 }}>
          Napomena: Učesnici se dodaju kroz backend logiku na osnovu team-a i ostalih parametara.
          Trenutno možete kreirati događaj samo sa osnovnim podacima.
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: colors.primary[400],
          padding: "16px",
          borderTop: `1px solid ${colors.grey[700]}`,
        }}
      >
        {isEditing && (
          <Button onClick={onDelete} variant="contained" color="error" disabled={loading}>
            Obriši
          </Button>
        )}
        <Button onClick={onClose} sx={{ color: colors.grey[100] }} disabled={loading}>
          Otkaži
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          color="secondary"
          disabled={loading || !eventDetails.title || !eventDetails.start || !eventDetails.end}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Čuva..." : isEditing ? "Sačuvaj" : "Kreiraj"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDialog;
