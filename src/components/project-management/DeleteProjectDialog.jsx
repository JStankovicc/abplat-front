import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

/**
 * Confirmation dialog for deleting a project.
 */
const DeleteProjectDialog = ({ open, onClose, project, onConfirm, colors }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        backgroundColor: colors.primary[400],
        color: colors.grey[100],
      },
    }}
  >
    <DialogTitle>Obriši Projekat</DialogTitle>
    <DialogContent>
      <Typography>
        Da li ste sigurni da želite da obrišete projekat &quot;{project?.name}&quot;?
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} sx={{ color: colors.grey[100] }}>
        Otkaži
      </Button>
      <Button
        onClick={onConfirm}
        sx={{
          backgroundColor: colors.redAccent[500],
          color: colors.grey[100],
          "&:hover": { backgroundColor: colors.redAccent[600] },
        }}
      >
        Obriši
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteProjectDialog;
