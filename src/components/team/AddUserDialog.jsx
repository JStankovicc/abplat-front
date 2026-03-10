import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";

/**
 * Dialog for adding a new team member. Šalje POST /user/add (UserRequest).
 */
const AddUserDialog = ({
  open,
  onClose,
  newUser,
  onChange,
  onSubmit,
  colors,
  isMobile,
  loading = false,
  error = null,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        backgroundColor: colors.primary[400],
        color: colors.grey[100],
        minWidth: isMobile ? "90%" : "400px",
      },
    }}
  >
    <DialogTitle>Dodaj novog korisnika</DialogTitle>
    <DialogContent>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Ime"
            value={newUser.firstName}
            onChange={(e) => onChange({ ...newUser, firstName: e.target.value })}
            required
            sx={{ mb: 2 }}
            InputProps={{ style: { color: colors.grey[100] } }}
            InputLabelProps={{ style: { color: colors.grey[100] } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Prezime"
            value={newUser.lastName}
            onChange={(e) => onChange({ ...newUser, lastName: e.target.value })}
            required
            sx={{ mb: 2 }}
            InputProps={{ style: { color: colors.grey[100] } }}
            InputLabelProps={{ style: { color: colors.grey[100] } }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) => onChange({ ...newUser, email: e.target.value })}
            required
            sx={{ mb: 2 }}
            InputProps={{ style: { color: colors.grey[100] } }}
            InputLabelProps={{ style: { color: colors.grey[100] } }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Šifra"
            type="password"
            value={newUser.password}
            onChange={(e) => onChange({ ...newUser, password: e.target.value })}
            required
            InputProps={{ style: { color: colors.grey[100] } }}
            InputLabelProps={{ style: { color: colors.grey[100] } }}
          />
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="secondary" disabled={loading}>
        Otkaži
      </Button>
      <Button
        onClick={onSubmit}
        color="secondary"
        variant="contained"
        disabled={
          loading ||
          !newUser.firstName?.trim() ||
          !newUser.lastName?.trim() ||
          !newUser.email?.trim() ||
          !newUser.password
        }
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Dodaj"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default AddUserDialog;
