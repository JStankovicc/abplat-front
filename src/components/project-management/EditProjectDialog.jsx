import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

/**
 * Dialog for editing an existing project.
 */
const EditProjectDialog = ({ open, onClose, project, onChange, onSubmit, colors }) => {
  if (!project) return null;

  const fieldSx = {
    "& .MuiInputLabel-root": { color: colors.grey[100] },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: colors.grey[700] },
      "&:hover fieldset": { borderColor: colors.grey[600] },
      "&.Mui-focused fieldset": { borderColor: colors.blueAccent[500] },
      color: colors.grey[100],
    },
  };

  const selectSx = {
    "& .MuiSelect-select": { color: colors.grey[100] },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[700] },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[600] },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.blueAccent[500] },
  };

  return (
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
      <DialogTitle>Izmeni Projekat</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Naziv Projekta"
          fullWidth
          value={project.name || ""}
          onChange={(e) => onChange({ ...project, name: e.target.value })}
          sx={fieldSx}
        />
        <TextField
          margin="dense"
          label="Opis"
          fullWidth
          multiline
          rows={4}
          value={project.description || ""}
          onChange={(e) => onChange({ ...project, description: e.target.value })}
          sx={fieldSx}
        />
        <TextField
          margin="dense"
          label="Status"
          fullWidth
          select
          value={project.status || ""}
          onChange={(e) => onChange({ ...project, status: e.target.value })}
          SelectProps={{ native: true, sx: selectSx }}
          sx={fieldSx}
        >
          <option value="Aktivan">Aktivan</option>
          <option value="U toku">U toku</option>
          <option value="Završen">Završen</option>
          <option value="Obustavljen">Obustavljen</option>
        </TextField>
        <TextField
          margin="dense"
          label="Datum Početka"
          type="date"
          fullWidth
          value={project.startDate || ""}
          onChange={(e) => onChange({ ...project, startDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
          sx={fieldSx}
        />
        <TextField
          margin="dense"
          label="Datum Završetka"
          type="date"
          fullWidth
          value={project.endDate || ""}
          onChange={(e) => onChange({ ...project, endDate: e.target.value })}
          InputLabelProps={{ shrink: true }}
          sx={fieldSx}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: colors.grey[100] }}>
          Otkaži
        </Button>
        <Button
          onClick={onSubmit}
          sx={{
            backgroundColor: colors.blueAccent[500],
            color: colors.grey[100],
            "&:hover": { backgroundColor: colors.blueAccent[600] },
          }}
        >
          Sačuvaj
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProjectDialog;
