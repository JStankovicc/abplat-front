import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

/**
 * Confirmation dialog for deleting a user.
 */
const DeleteUserDialog = ({ open, onClose, userName, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Potvrda brisanja</DialogTitle>
    <DialogContent>
      <Typography>Da li ste sigurni da želite da obrišete korisnika {userName}?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="secondary">
        Otkaži
      </Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Obriši
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteUserDialog;
